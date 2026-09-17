#define _GNU_SOURCE
#include <node_api.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <sys/file.h>
#include <fcntl.h>
#include <unistd.h>
#include <dirent.h>
#include <errno.h>
#include <string.h>
#include <stdlib.h>
#include <stdio.h>
#ifndef O_CLOEXEC
#define O_CLOEXEC 0
#endif
static napi_value failure(napi_env env,const char* msg){char buf[512];snprintf(buf,sizeof(buf),"%s: %s",msg,strerror(errno));napi_value s,e,c;napi_create_string_utf8(env,buf,NAPI_AUTO_LENGTH,&s);napi_create_error(env,NULL,s,&e);napi_create_int32(env,errno,&c);napi_set_named_property(env,e,"errno",c);napi_throw(env,e);return NULL;}
static int integer(napi_env env,napi_value v){int32_t i;if(napi_get_value_int32(env,v,&i)!=napi_ok){errno=EINVAL;return -1;}return i;}
static char* text(napi_env env,napi_value v){size_t n=0;if(napi_get_value_string_utf8(env,v,NULL,0,&n)!=napi_ok||n>4096){errno=EINVAL;return NULL;}char*p=calloc(n+1,1);size_t copied=0;napi_get_value_string_utf8(env,v,p,n+1,&copied);if(strlen(p)!=copied){free(p);errno=EINVAL;return NULL;}return p;}
static int component(const char*s){return s&&*s&&strcmp(s,".")&&strcmp(s,"..")&&!strchr(s,'/')&&!strchr(s,'\\');}
static napi_value number(napi_env env,int fd){napi_value v;napi_create_int32(env,fd,&v);return v;}
static napi_value undef(napi_env env){napi_value v;napi_get_undefined(env,&v);return v;}
static int walk(int root,const char* p){
 if(!p||p[0]=='/'||strchr(p,'\\')){errno=EINVAL;return -1;}int current=openat(root,".",O_RDONLY|O_DIRECTORY|O_CLOEXEC|O_NOFOLLOW);if(current<0)return -1;
 if(!strcmp(p,"."))return current;
 char* copy=strdup(p);char* save=NULL;char* segment=strtok_r(copy,"/",&save);
 while(segment){if(!component(segment)){close(current);free(copy);errno=EINVAL;return -1;}int next=openat(current,segment,O_RDONLY|O_DIRECTORY|O_CLOEXEC|O_NOFOLLOW);close(current);if(next<0){free(copy);return -1;}current=next;segment=strtok_r(NULL,"/",&save);}free(copy);return current;
}
static napi_value open_root(napi_env env,napi_callback_info info){size_t n=1;napi_value a[1];napi_get_cb_info(env,info,&n,a,NULL,NULL);char*p=text(env,a[0]);if(!p)return failure(env,"root");int fd=open(p,O_RDONLY|O_DIRECTORY|O_CLOEXEC|O_NOFOLLOW);free(p);return fd<0?failure(env,"open root"):number(env,fd);}
static napi_value open_dir(napi_env env,napi_callback_info info){size_t n=2;napi_value a[2];napi_get_cb_info(env,info,&n,a,NULL,NULL);char*p=text(env,a[1]);if(!p)return failure(env,"path");int fd=walk(integer(env,a[0]),p);free(p);return fd<0?failure(env,"open directory"):number(env,fd);}
static napi_value open_file(napi_env env,napi_callback_info info){size_t n=3;napi_value a[3];napi_get_cb_info(env,info,&n,a,NULL,NULL);char*p=text(env,a[1]);if(!component(p)){free(p);errno=EINVAL;return failure(env,"component");}bool create=false;if(n>2)napi_get_value_bool(env,a[2],&create);
 int fd=openat(integer(env,a[0]),p,(create?(O_RDWR|O_CREAT|O_EXCL):O_RDONLY)|O_CLOEXEC|O_NOFOLLOW|O_NONBLOCK,0600);free(p);if(fd<0)return failure(env,"open regular file");struct stat st;if(fstat(fd,&st)||!S_ISREG(st.st_mode)||st.st_nlink>1){close(fd);errno=EPERM;return failure(env,"special or hard-linked file rejected");}return number(env,fd);}
static napi_value rename_file(napi_env env,napi_callback_info info){size_t n=4;napi_value a[4];napi_get_cb_info(env,info,&n,a,NULL,NULL);char*s=text(env,a[1]),*d=text(env,a[3]);if(!component(s)||!component(d)){free(s);free(d);errno=EINVAL;return failure(env,"component");}int rc=renameat(integer(env,a[0]),s,integer(env,a[2]),d);free(s);free(d);return rc?failure(env,"rename"):undef(env);}
static napi_value unlink_file(napi_env env,napi_callback_info info){size_t n=3;napi_value a[3];napi_get_cb_info(env,info,&n,a,NULL,NULL);char*p=text(env,a[1]);bool dir=false;if(n>2)napi_get_value_bool(env,a[2],&dir);if(!component(p)){free(p);errno=EINVAL;return failure(env,"component");}int rc=unlinkat(integer(env,a[0]),p,dir?AT_REMOVEDIR:0);free(p);return rc?failure(env,"unlink"):undef(env);}
static napi_value mkdir_at(napi_env env,napi_callback_info info){size_t n=2;napi_value a[2];napi_get_cb_info(env,info,&n,a,NULL,NULL);char*p=text(env,a[1]);if(!component(p)){free(p);errno=EINVAL;return failure(env,"component");}int rc=mkdirat(integer(env,a[0]),p,0700);free(p);return rc?failure(env,"mkdir"):undef(env);}
static napi_value list_dir(napi_env env,napi_callback_info info){size_t n=1;napi_value a[1];napi_get_cb_info(env,info,&n,a,NULL,NULL);int fd=openat(integer(env,a[0]),".",O_RDONLY|O_DIRECTORY|O_NOFOLLOW|O_CLOEXEC);if(fd<0)return failure(env,"directory");DIR*d=fdopendir(fd);if(!d){close(fd);return failure(env,"fdopendir");}napi_value arr;napi_create_array(env,&arr);struct dirent*e;uint32_t i=0;while((e=readdir(d))){if(!strcmp(e->d_name,".")||!strcmp(e->d_name,".."))continue;if(i>=100000){closedir(d);errno=EFBIG;return failure(env,"directory entry limit");}napi_value v;napi_create_string_utf8(env,e->d_name,NAPI_AUTO_LENGTH,&v);napi_set_element(env,arr,i++,v);}closedir(d);return arr;}
static napi_value stat_at(napi_env env,napi_callback_info info){size_t n=2;napi_value a[2];napi_get_cb_info(env,info,&n,a,NULL,NULL);char*p=text(env,a[1]);if(!component(p)){free(p);errno=EINVAL;return failure(env,"component");}struct stat st;int rc=fstatat(integer(env,a[0]),p,&st,AT_SYMLINK_NOFOLLOW);free(p);if(rc)return failure(env,"stat");napi_value o,v;napi_create_object(env,&o);
 #define FIELD(k,x) napi_create_double(env,(double)(x),&v);napi_set_named_property(env,o,k,v)
 FIELD("size",st.st_size);FIELD("dev",st.st_dev);FIELD("ino",st.st_ino);FIELD("mode",st.st_mode);FIELD("nlink",st.st_nlink);FIELD("mtimeMs",st.st_mtime*1000.0);
 const char* type=S_ISREG(st.st_mode)?"file":S_ISDIR(st.st_mode)?"directory":S_ISLNK(st.st_mode)?"symlink":"special";napi_create_string_utf8(env,type,NAPI_AUTO_LENGTH,&v);napi_set_named_property(env,o,"type",v);return o;
}
static napi_value lock_fd(napi_env env,napi_callback_info info){size_t n=1;napi_value a[1];napi_get_cb_info(env,info,&n,a,NULL,NULL);if(flock(integer(env,a[0]),LOCK_EX|LOCK_NB))return failure(env,"another Portal owner holds the lock");return undef(env);}
static napi_value init(napi_env env,napi_value exports){napi_property_descriptor props[]={
 {"openRoot",0,open_root,0,0,0,napi_default,0},{"openDir",0,open_dir,0,0,0,napi_default,0},{"openFile",0,open_file,0,0,0,napi_default,0},{"rename",0,rename_file,0,0,0,napi_default,0},{"unlink",0,unlink_file,0,0,0,napi_default,0},{"mkdir",0,mkdir_at,0,0,0,napi_default,0},{"list",0,list_dir,0,0,0,napi_default,0},{"stat",0,stat_at,0,0,0,napi_default,0},{"lock",0,lock_fd,0,0,0,napi_default,0}};napi_define_properties(env,exports,sizeof(props)/sizeof(props[0]),props);return exports;}
NAPI_MODULE(NODE_GYP_MODULE_NAME,init)
