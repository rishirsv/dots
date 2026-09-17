import { FrontDoor } from '../../../packages/core/src/front-door.js';
import { SkillCatalogue } from '../../../packages/skills/src/catalogue.js';
export async function makeMcpServer(tools: FrontDoor['tools'], call: (name: string, args: any) => Promise<any>, skills: Pick<SkillCatalogue, 'staticList' | 'staticGet' | 'resource'>) {
    const [{ Server }, types, { z }] = await Promise.all([import('@modelcontextprotocol/sdk/server/index.js'), import('@modelcontextprotocol/sdk/types.js'), import('zod')]);
    const server = new Server({ name: 'portal', version: '0.1.0' }, { capabilities: { tools: { listChanged: true }, resources: {}, extensions: { 'io.modelcontextprotocol/skills': {} } } });
    server.setRequestHandler(types.ListToolsRequestSchema, async () => ({ tools }));
    server.setRequestHandler(types.CallToolRequestSchema, async (req: any) => { const result = await call(req.params.name, req.params.arguments ?? {}); const image = result.data?.image; const clean = image ? { ...result, data: { ...result.data, image: { mimeType: image.mimeType, rendered: true } } } : result; const content: any[] = [{ type: 'text', text: JSON.stringify(clean) }]; if (image?.data)
        content.push({ type: 'image', mimeType: image.mimeType, data: image.data }); return { content, structuredContent: clean, isError: !!result.error }; });
    server.setRequestHandler(types.ListResourcesRequestSchema, async () => ({ resources: (await skills.staticList()).skills.flatMap((s: any) => s.resources.map((r: any) => ({ uri: r.uri, name: r.uri.split('/').pop(), mimeType: 'text/plain' }))) }));
    server.setRequestHandler(types.ReadResourceRequestSchema, async (req: any) => skills.resource(req.params.uri));
    server.setRequestHandler(z.object({ method: z.literal('skills/list'), params: z.object({ cursor: z.string().optional() }).optional() }), async (req: any) => skills.staticList(req.params?.cursor));
    server.setRequestHandler(z.object({ method: z.literal('skills/get'), params: z.object({ uri: z.string() }) }), async (req: any) => skills.staticGet(req.params.uri));
    return server;
}
