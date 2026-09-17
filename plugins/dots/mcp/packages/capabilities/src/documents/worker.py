#!/usr/bin/env python3
"""Trusted, bounded staged-document transformer. Invoked only by the confined parser runner.
No macros, remote templates, external entities, user modules or executable documents are run.
The broker, not this process, commits output into an authorized workspace.
"""
import sys,os,json,hashlib,zipfile,io,re,posixpath,copy
from lxml import etree as E
MAX_EXPANDED=200*1024*1024
MAX_PARTS=5000
W='http://schemas.openxmlformats.org/wordprocessingml/2006/main'
S='http://schemas.openxmlformats.org/spreadsheetml/2006/main'
R='http://schemas.openxmlformats.org/officeDocument/2006/relationships'
P='http://schemas.openxmlformats.org/package/2006/relationships'
E.register_namespace('w',W);E.register_namespace('r',R)
def H(b):return hashlib.sha256(b).hexdigest()
def xml(b):
 if b'<!DOCTYPE' in b.upper() or b'<!ENTITY' in b.upper():raise ValueError('External entities and DTDs are forbidden')
 node=E.fromstring(b,parser=E.XMLParser(resolve_entities=False,no_network=True,load_dtd=False,huge_tree=False,remove_blank_text=False))
 if node.getroottree().docinfo.doctype:raise ValueError('DTDs are forbidden in every XML encoding')
 return node
def serialized(node):return E.tostring(node,encoding='utf-8',xml_declaration=True)
def loadzip(filename):
 parts={};total=0
 with zipfile.ZipFile(filename) as z:
  infos=z.infolist()
  if len(infos)>MAX_PARTS:raise ValueError('Archive part quota exceeded')
  for i in infos:
   name=i.filename
   if name.startswith('/') or '\\' in name or any(x in ('..','') for x in name.rstrip('/').split('/')) or posixpath.normpath(name.rstrip('/'))!=name.rstrip('/') or name in parts:raise ValueError('Unsafe/duplicate ZIP entry')
   if i.flag_bits&1:raise ValueError('Encrypted ZIP unsupported')
   if (i.external_attr>>16)&0o170000==0o120000:raise ValueError('ZIP symlink forbidden')
   total+=i.file_size
   if total>MAX_EXPANDED or i.file_size>100*1024*1024 or i.file_size/max(1,i.compress_size)>200:raise ValueError('Archive expansion quota exceeded')
   b=z.read(i)
   if name.endswith(('.xml','.rels')):xml(b)
   parts[name]=b
 return parts
def savezip(parts,output):
 with zipfile.ZipFile(output,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
  for name,b in parts.items():z.writestr(name,b)
def package(base,kind):
 content=f'<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/{base}" ContentType="{kind}"/></Types>'.encode()
 return {'[Content_Types].xml':content,'_rels/.rels':f'<Relationships xmlns="{P}"><Relationship Id="rId1" Type="{R}/officeDocument" Target="{base}"/></Relationships>'.encode()}
def paragraph_text(p):return ''.join(t.text or '' for t in p.iter('{'+W+'}t'))
def docx_elements(root):
 result=[]
 for i,p in enumerate(root.iter('{'+W+'}p')):result.append({'locator':f'p:{i}','kind':'paragraph','text':paragraph_text(p)})
 for ti,t in enumerate(root.iter('{'+W+'}tbl')):
  rows=[]
  for ri,row in enumerate(t.findall('{'+W+'}tr')):rows.append([{'locator':f't:{ti}:r:{ri}:c:{ci}','text':'\n'.join(paragraph_text(p) for p in cell.findall('{'+W+'}p'))} for ci,cell in enumerate(row.findall('{'+W+'}tc'))])
  result.append({'locator':f't:{ti}','kind':'table','rows':rows})
 return result
def docx(a):
 mode=a['mode'];out=a.get('output')
 if mode=='create':
  root=E.Element('{'+W+'}document');body=E.SubElement(root,'{'+W+'}body')
  paragraphs=list(a.get('paragraphs') or [])
  if not paragraphs:paragraphs=[]
  if a.get('markdown') is not None:
   for line in a['markdown'].splitlines():
    m=re.match(r'^(#{1,6})\s+(.*)',line);paragraphs.append({'text':m.group(2) if m else line,'style':'Heading'+str(len(m.group(1))) if m else 'Normal'})
  for item in paragraphs:
   p=E.SubElement(body,'{'+W+'}p')
   if item.get('style'):pr=E.SubElement(p,'{'+W+'}pPr');E.SubElement(pr,'{'+W+'}pStyle',{'{'+W+'}val':item['style']})
   E.SubElement(E.SubElement(p,'{'+W+'}r'),'{'+W+'}t',{'{http://www.w3.org/XML/1998/namespace}space':'preserve'}).text=item['text']
  for table in a.get('tables',[]):
   t=E.SubElement(body,'{'+W+'}tbl');pr=E.SubElement(t,'{'+W+'}tblPr');E.SubElement(pr,'{'+W+'}tblW',{'{'+W+'}w':'0','{'+W+'}type':'auto'});grid=E.SubElement(t,'{'+W+'}tblGrid');columns=max([len(row) for row in table] or [1])
   for _ in range(columns):E.SubElement(grid,'{'+W+'}gridCol',{'{'+W+'}w':str(9000//columns)})
   for row in table:
    tr=E.SubElement(t,'{'+W+'}tr')
    for value in row:E.SubElement(E.SubElement(E.SubElement(E.SubElement(tr,'{'+W+'}tc'),'{'+W+'}p'),'{'+W+'}r'),'{'+W+'}t').text=value
  parts=package('word/document.xml','application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml');parts['word/document.xml']=serialized(root)
  styles=E.Element('{'+W+'}styles')
  for name in ['Normal']+['Heading'+str(i) for i in range(1,7)]:
   st=E.SubElement(styles,'{'+W+'}style',{'{'+W+'}type':'paragraph','{'+W+'}styleId':name});E.SubElement(st,'{'+W+'}name',{'{'+W+'}val':name})
   if name!='Normal':rp=E.SubElement(st,'{'+W+'}rPr');E.SubElement(rp,'{'+W+'}b');E.SubElement(rp,'{'+W+'}sz',{'{'+W+'}val':str(40-int(name[-1])*2)})
  parts['word/styles.xml']=serialized(styles);parts['word/_rels/document.xml.rels']=f'<Relationships xmlns="{P}"><Relationship Id="styles" Type="{R}/styles" Target="styles.xml"/></Relationships>'.encode()
  ct=xml(parts['[Content_Types].xml']);E.SubElement(ct,'{http://schemas.openxmlformats.org/package/2006/content-types}Override',{'PartName':'/word/styles.xml','ContentType':'application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml'});parts['[Content_Types].xml']=serialized(ct);savezip(parts,out);return {'changedElements':len(paragraphs),'warnings':['Markdown supports headings and literal paragraph text; no linked resources.']}
 parts=loadzip(a['input']);root=xml(parts['word/document.xml']);elements=docx_elements(root)
 if mode in ('inspect','read','text'):
  if mode=='text':return {'text':'\n'.join(x['text'] for x in elements if x['kind']=='paragraph')}
  offset=a.get('offset',0);limit=a.get('limit',100);return {'elements':elements[offset:offset+limit],'totalElements':len(elements),'nextOffset':offset+limit if offset+limit<len(elements) else None,'partHashes':{n:H(b) for n,b in parts.items()},'warnings':['Paragraph locators are pinned to the supplied source hash.']}
 before={n:H(b) for n,b in parts.items()};changed=[];paras=list(root.iter('{'+W+'}p'));tables=list(root.iter('{'+W+'}tbl'))
 for edit in a['edits']:
  loc=edit['locator'];target=None
  if re.fullmatch(r'p:\d+',loc):target=paras[int(loc[2:])]
  elif re.fullmatch(r't:\d+:r:\d+:c:\d+',loc):
   _,ti,_,ri,_,ci=loc.split(':');target=tables[int(ti)].findall('{'+W+'}tr')[int(ri)].findall('{'+W+'}tc')[int(ci)]
  else:raise ValueError('Unsupported DOCX locator')
  runs=list(target.iter('{'+W+'}t'));matches=[t for t in runs if edit['oldText'] in (t.text or '')]
  count=sum((t.text or '').count(edit['oldText']) for t in matches)
  if not edit['oldText'] or count!=edit.get('expectedReplacements',1):raise ValueError('DOCX exact replacement count differs or text spans complex runs')
  for t in matches:t.text=(t.text or '').replace(edit['oldText'],edit['newText']);t.set('{http://www.w3.org/XML/1998/namespace}space','preserve')
  changed.append(loc)
 parts['word/document.xml']=serialized(root);savezip(parts,out)
 return {'changedElements':changed,'preservedParts':[n for n in parts if before[n]==H(parts[n])],'changedParts':[n for n in parts if before[n]!=H(parts[n])],'warnings':['Cross-run replacements, tracked changes, content controls and XML-level edits are not supported.']}
def col(s):
 n=0
 for c in s:n=n*26+ord(c)-64
 return n
def coord(a):
 m=re.fullmatch(r'([A-Z]{1,3})([1-9][0-9]{0,6})',a)
 if not m or col(m.group(1))>16384 or int(m.group(2))>1048576:raise ValueError('Invalid A1 coordinate')
 return col(m.group(1)),int(m.group(2))
def range_cells(r):
 v=r.split(':');a=coord(v[0]);b=coord(v[-1]);
 if len(v)>2 or a[0]>b[0] or a[1]>b[1] or (b[0]-a[0]+1)*(b[1]-a[1]+1)>10000:raise ValueError('Invalid or excessive sheet range')
 return a,b
def sheet_map(parts):
 workbook=xml(parts['xl/workbook.xml']);rels=xml(parts['xl/_rels/workbook.xml.rels']);targets={x.attrib['Id']:x.attrib['Target'] for x in rels if x.attrib.get('TargetMode')!='External'};result=[]
 for item in workbook.findall('.//{'+S+'}sheet'):
  target=targets[item.attrib['{'+R+'}id']];p=target.lstrip('/') if target.startswith('/') else posixpath.normpath('xl/'+target)
  if not p.startswith('xl/worksheets/') or p not in parts:raise ValueError('Unsupported sheet relationship')
  result.append((item.attrib['name'],p))
 return result
STYLES=f'<styleSheet xmlns="{S}"><fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>'.encode()
def apply_cells(parts,root,updates):
 sheetdata=root.find('{'+S+'}sheetData')
 if sheetdata is None:raise ValueError('Worksheet has no sheetData')
 for change in updates:
  cnum,rownum=coord(change['cell']);row=next((x for x in sheetdata if x.attrib.get('r')==str(rownum)),None)
  if row is None:row=E.SubElement(sheetdata,'{'+S+'}row',{'r':str(rownum)})
  cell=next((x for x in row if x.attrib.get('r')==change['cell']),None)
  if cell is None:cell=E.SubElement(row,'{'+S+'}c',{'r':change['cell']})
  if 'value' in change or 'formula' in change:
   for child in list(cell):
    if child.tag in ('{'+S+'}v','{'+S+'}f','{'+S+'}is'):cell.remove(child)
   cell.attrib.pop('t',None)
   if 'formula' in change:E.SubElement(cell,'{'+S+'}f').text=change['formula'].lstrip('=')
   else:
    v=change.get('value')
    if isinstance(v,str):cell.set('t','inlineStr');E.SubElement(E.SubElement(cell,'{'+S+'}is'),'{'+S+'}t',{'{http://www.w3.org/XML/1998/namespace}space':'preserve'}).text=v
    elif isinstance(v,bool):cell.set('t','b');E.SubElement(cell,'{'+S+'}v').text='1' if v else '0'
    elif v is not None:E.SubElement(cell,'{'+S+'}v').text=str(v)
  if 'styleId' in change:
   styles=xml(parts['xl/styles.xml']);xfs=styles.find('{'+S+'}cellXfs');index=change['styleId']
   if index>=len(xfs):raise ValueError('Unknown existing styleId')
   cell.set('s',str(index))
  if change.get('format'):
   styles=xml(parts['xl/styles.xml']);xfs=styles.find('{'+S+'}cellXfs');fontset=styles.find('{'+S+'}fonts');xf=copy.deepcopy(xfs[int(cell.attrib.get('s','0'))]);fmt=change['format']
   if 'bold' in fmt:
    font=copy.deepcopy(fontset[int(xf.attrib.get('fontId','0'))]);b=font.find('{'+S+'}b')
    if b is not None:font.remove(b)
    if fmt['bold']:E.SubElement(font,'{'+S+'}b')
    fontset.append(font);fontset.set('count',str(len(fontset)));xf.set('fontId',str(len(fontset)-1));xf.set('applyFont','1')
   if 'numberFormat' in fmt:
    nf=styles.find('{'+S+'}numFmts')
    if nf is None:nf=E.Element('{'+S+'}numFmts');styles.insert(0,nf)
    number=max([163]+[int(x.attrib['numFmtId']) for x in nf])+1;E.SubElement(nf,'{'+S+'}numFmt',{'numFmtId':str(number),'formatCode':fmt['numberFormat']});nf.set('count',str(len(nf)));xf.set('numFmtId',str(number));xf.set('applyNumberFormat','1')
   xfs.append(xf);xfs.set('count',str(len(xfs)));cell.set('s',str(len(xfs)-1));parts['xl/styles.xml']=serialized(styles)
  row[:]=sorted(row,key=lambda x:coord(x.attrib['r'])[0] if x.tag=='{'+S+'}c' else 20000)
 sheetdata[:]=sorted(sheetdata,key=lambda x:int(x.attrib.get('r','0')))
def sheet(a):
 mode=a['mode']
 if mode=='create':
  parts=package('xl/workbook.xml','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml');wb=E.Element('{'+S+'}workbook');sheets=E.SubElement(wb,'{'+S+'}sheets');rels=E.Element('{'+P+'}Relationships');ct=xml(parts['[Content_Types].xml']);parts['xl/styles.xml']=STYLES
  names=set()
  for i,item in enumerate(a['sheets'],1):
   name=item['name']
   if not name or len(name)>31 or any(c in name for c in '[]:*?/\\') or name.lower() in names:raise ValueError('Invalid or duplicate sheet name')
   names.add(name.lower());sid=f'rId{i}';p=f'xl/worksheets/sheet{i}.xml';E.SubElement(sheets,'{'+S+'}sheet',{'name':name,'sheetId':str(i),'{'+R+'}id':sid});E.SubElement(rels,'{'+P+'}Relationship',{'Id':sid,'Type':R+'/worksheet','Target':f'worksheets/sheet{i}.xml'});E.SubElement(ct,'{http://schemas.openxmlformats.org/package/2006/content-types}Override',{'PartName':'/'+p,'ContentType':'application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml'});root=E.Element('{'+S+'}worksheet');E.SubElement(root,'{'+S+'}sheetData');apply_cells(parts,root,item.get('cells',[]));parts[p]=serialized(root)
  E.SubElement(rels,'{'+P+'}Relationship',{'Id':'styles','Type':R+'/styles','Target':'styles.xml'});E.SubElement(ct,'{http://schemas.openxmlformats.org/package/2006/content-types}Override',{'PartName':'/xl/styles.xml','ContentType':'application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml'});parts['xl/workbook.xml']=serialized(wb);parts['xl/_rels/workbook.xml.rels']=serialized(rels);parts['[Content_Types].xml']=serialized(ct);savezip(parts,a['output']);return {'changedElements':'created workbook','recalculationRequired':True,'warnings':['Formula caches are not calculated by Portal.']}
 parts=loadzip(a['input']);sheets=sheet_map(parts);macro='xl/vbaProject.bin' in parts
 if mode=='inspect':return {'sheets':[{'name':name,'part':p} for name,p in sheets],'macrosPresent':macro,'macroExecution':False,'editingAvailable':not macro,'partHashes':{n:H(b) for n,b in parts.items()}}
 shared=[]
 if 'xl/sharedStrings.xml' in parts:
  shared=[''.join(t.text or '' for t in item.iter('{'+S+'}t')) for item in xml(parts['xl/sharedStrings.xml'])]
 if mode=='text':
  texts=[]
  for name,p in sheets:
   for c in xml(parts[p]).iter('{'+S+'}c'):
    v=c.find('{'+S+'}v');txt=v.text if v is not None else ''.join(x.text or '' for x in c.iter('{'+S+'}t'))
    if c.attrib.get('t')=='s' and txt is not None:txt=shared[int(txt)]
    texts.append(name+'!'+c.attrib['r']+' '+str(txt or ''))
  return {'text':'\n'.join(texts)}
 selected=next((p for name,p in sheets if name==a['sheet']),None)
 if selected is None:raise ValueError('Sheet not found')
 root=xml(parts[selected])
 if mode=='read':
  lo,hi=range_cells(a.get('range','A1:Z100'));cells=[]
  for c in root.iter('{'+S+'}c'):
   x,y=coord(c.attrib['r'])
   if not(lo[0]<=x<=hi[0] and lo[1]<=y<=hi[1]):continue
   t=c.attrib.get('t');v=c.find('{'+S+'}v');f=c.find('{'+S+'}f');raw=v.text if v is not None else None;value=raw
   if t=='s':value=shared[int(raw)] if raw else None
   elif t=='inlineStr':value=''.join(x.text or '' for x in c.iter('{'+S+'}t'))
   elif t=='b':value=raw=='1'
   elif t in (None,'n') and raw is not None:
    try:value=float(raw);value=int(value) if value.is_integer() else value
    except ValueError:pass
   cells.append({'cell':c.attrib['r'],'value':value,'formula':f.text if f is not None else None,'cachedValue':value if f is not None else None,'cacheStatus':'not-verified' if f is not None else 'not-applicable','styleId':int(c.attrib.get('s','0'))})
  return {'sheet':a['sheet'],'range':a.get('range','A1:Z100'),'cells':cells,'macrosPresent':macro,'recalculationRequired':any(c['formula'] is not None for c in cells)}
 if macro:raise ValueError('Macro-enabled workbook edits are unavailable; preserve the original')
 before={n:H(b) for n,b in parts.items()};apply_cells(parts,root,a['cells']);parts[selected]=serialized(root);wb=xml(parts['xl/workbook.xml']);calc=wb.find('{'+S+'}calcPr')
 if calc is None:calc=E.SubElement(wb,'{'+S+'}calcPr')
 calc.set('fullCalcOnLoad','1');calc.set('forceFullCalc','1');parts['xl/workbook.xml']=serialized(wb);savezip(parts,a['output'])
 return {'changedElements':[x['cell'] for x in a['cells']],'preservedParts':[n for n in parts if H(parts[n])==before[n]],'changedParts':[n for n in parts if H(parts[n])!=before[n]],'recalculationRequired':True,'warnings':['Formulas are stored, not recalculated; existing cached values may be stale.']}
def pdf(a):
 from pypdf import PdfReader,PdfWriter
 mode=a['mode']
 if mode=='create':
  from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer
  from reportlab.lib.styles import getSampleStyleSheet
  from xml.sax.saxutils import escape
  styles=getSampleStyleSheet();story=[]
  for line in a['markdown'].splitlines():
   m=re.match(r'^(#{1,6})\s+(.*)',line);style=styles['Heading'+str(min(3,len(m.group(1))))] if m else styles['BodyText'];text=m.group(2) if m else line
   story.append(Paragraph(escape(text) or '&#160;',style));story.append(Spacer(1,4))
  SimpleDocTemplate(a['output']).build(story);return {'pages':len(PdfReader(a['output']).pages),'warnings':['Markdown headings and literal paragraphs; external images/fonts are not fetched.']}
 reader=PdfReader(a['input'],strict=True)
 if reader.is_encrypted:raise ValueError('Encrypted PDF is unsupported; no password guessing')
 if len(reader.pages)>2000:raise ValueError('PDF page count limit exceeded')
 if mode=='inspect':return {'pages':len(reader.pages),'metadata':{str(k):str(v)[:1000] for k,v in (reader.metadata or {}).items()},'encrypted':False}
 if mode=='read':
  start=a.get('startPage',1);count=a.get('maxPages',5)
  if start<1 or start>max(1,len(reader.pages)):raise ValueError('Page numbers are one-based')
  return {'pages':[{'page':i+1,'text':reader.pages[i].extract_text()[:60000]} for i in range(start-1,min(len(reader.pages),start-1+count))],'nextPage':start+count if start+count<=len(reader.pages) else None}
 if mode=='render':
  import pypdfium2 as pdfium
  doc=pdfium.PdfDocument(a['input']);p=a.get('page',1)-1
  if p<0 or p>=len(doc):raise ValueError('Page numbers are one-based')
  page=doc[p];width,height=page.get_size();scale=min(a.get('maxEdge',2048)/max(width,height),3)
  bitmap=page.render(scale=scale);image=bitmap.to_pil();image.save(a['output'],'PNG')
  result={'page':p+1,'width':image.width,'height':image.height,'mimeType':'image/png'}
  image.close();bitmap.close();page.close();doc.close();return result
 writer=PdfWriter();sources=[reader]
 for p in a.get('additionalInputs',[]):
  other=PdfReader(p,strict=True)
  if other.is_encrypted:raise ValueError('Encrypted merge source')
  sources.append(other)
 for page in a['pages']:
  source=page.get('source',0);index=page['page']-1
  if source<0 or source>=len(sources) or index<0 or index>=len(sources[source].pages):raise ValueError('PDF page selection is out of bounds')
  writer.add_page(sources[source].pages[index])
 with open(a['output'],'wb') as f:writer.write(f)
 return {'pages':len(writer.pages),'sourcePreserved':True,'warnings':['Page-level editing; annotations/forms/signatures are not guaranteed to survive merging.']}
def image(a):
 from PIL import Image,ImageOps
 Image.MAX_IMAGE_PIXELS=40000000
 with Image.open(a['input']) as im:
  if im.format not in ('PNG','JPEG','WEBP','GIF'):raise ValueError('Unsupported image format')
  meta={'width':im.width,'height':im.height,'format':im.format,'frames':getattr(im,'n_frames',1),'mimeType':Image.MIME[im.format]}
  if a['mode']=='inspect':return meta
  im.seek(0);img=ImageOps.exif_transpose(im).convert('RGB')
  if a.get('crop'):
   c=a['crop'];box=(c['x'],c['y'],c['x']+c['width'],c['y']+c['height'])
   if min(box)<0 or box[2]>img.width or box[3]>img.height:raise ValueError('Crop is outside image')
   img=img.crop(box)
  img.thumbnail((a.get('maxEdge',2048),a.get('maxEdge',2048)),Image.Resampling.LANCZOS);img.save(a['output'],'JPEG',quality=85,optimize=True);return dict(meta,displayWidth=img.width,displayHeight=img.height,displayMimeType='image/jpeg',animation='first-frame' if meta['frames']>1 else 'static')
def main():
 raw=sys.stdin.buffer.read(1048577)
 if len(raw)>1048576:raise ValueError('Control input too large')
 a=json.loads(raw);family=a.pop('family');result={'docx':docx,'sheet':sheet,'pdf':pdf,'image':image}[family](a)
 encoded=json.dumps(result,ensure_ascii=False,allow_nan=False).encode()
 if len(encoded)>4*1024*1024:raise ValueError('Parser result exceeds bound')
 sys.stdout.buffer.write(encoded)
if __name__=='__main__':
 try:main()
 except Exception as exc:sys.stdout.write(json.dumps({'error':{'code':'PARSER_FAILED','message':str(exc)[:1000]}}));sys.exit(1)
