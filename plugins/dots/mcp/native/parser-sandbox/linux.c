/* Portal's Linux verification harness, not an advertised Linux device agent.
 * Kernel Landlock confines parser reads/writes; seccomp denies networking and process inspection.
 * macOS uses the separate sandbox-exec policy in parser.ts. No user commands use this runner. */
#define _GNU_SOURCE
#include <linux/landlock.h>
#include <linux/filter.h>
#include <linux/seccomp.h>
#include <sys/prctl.h>
#include <sys/syscall.h>
#include <sys/resource.h>
#include <sys/stat.h>
#include <unistd.h>
#include <fcntl.h>
#include <errno.h>
#include <stddef.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#ifndef LANDLOCK_ACCESS_FS_TRUNCATE
#define LANDLOCK_ACCESS_FS_TRUNCATE (1ULL << 14)
#endif
static void die(const char*s){perror(s);exit(126);}
int main(int argc,char**argv){
 int abi=syscall(__NR_landlock_create_ruleset,NULL,0,LANDLOCK_CREATE_RULESET_VERSION);if(abi<3){fprintf(stderr,"Portal requires Landlock ABI >=3 for parser verification\n");return 126;}
 if(argc==2&&!strcmp(argv[1],"--probe")){printf("{\"landlockAbi\":%d}\n",abi);return 0;}
 uint64_t read=LANDLOCK_ACCESS_FS_EXECUTE|LANDLOCK_ACCESS_FS_READ_FILE|LANDLOCK_ACCESS_FS_READ_DIR;
 uint64_t write=LANDLOCK_ACCESS_FS_WRITE_FILE|LANDLOCK_ACCESS_FS_REMOVE_DIR|LANDLOCK_ACCESS_FS_REMOVE_FILE|LANDLOCK_ACCESS_FS_MAKE_DIR|LANDLOCK_ACCESS_FS_MAKE_REG|LANDLOCK_ACCESS_FS_REFER|LANDLOCK_ACCESS_FS_TRUNCATE;
 struct landlock_ruleset_attr a={.handled_access_fs=read|write|LANDLOCK_ACCESS_FS_MAKE_CHAR|LANDLOCK_ACCESS_FS_MAKE_SOCK|LANDLOCK_ACCESS_FS_MAKE_FIFO|LANDLOCK_ACCESS_FS_MAKE_BLOCK|LANDLOCK_ACCESS_FS_MAKE_SYM};
 int fd=syscall(__NR_landlock_create_ruleset,&a,sizeof(a),0);if(fd<0)die("create_ruleset");int i=1;
 for(;i<argc&&strcmp(argv[i],"--");i+=2){if(i+1>=argc)return 126;int rw=!strcmp(argv[i],"--write");if(!rw&&strcmp(argv[i],"--read"))return 126;int p=open(argv[i+1],O_PATH|O_CLOEXEC);if(p<0)die("sandbox root");struct stat st;if(fstat(p,&st))die("stat root");uint64_t rights=read|(rw?write:0);if(!S_ISDIR(st.st_mode))rights&=LANDLOCK_ACCESS_FS_EXECUTE|LANDLOCK_ACCESS_FS_READ_FILE|LANDLOCK_ACCESS_FS_WRITE_FILE|LANDLOCK_ACCESS_FS_TRUNCATE;struct landlock_path_beneath_attr r={.allowed_access=rights,.parent_fd=p};if(syscall(__NR_landlock_add_rule,fd,LANDLOCK_RULE_PATH_BENEATH,&r,0))die("add_rule");close(p);}
 if(i+1>=argc)return 126;if(prctl(PR_SET_NO_NEW_PRIVS,1,0,0,0))die("no_new_privs");if(syscall(__NR_landlock_restrict_self,fd,0))die("restrict_self");close(fd);
 #define DENY(n) BPF_JUMP(BPF_JMP|BPF_JEQ|BPF_K,n,0,1),BPF_STMT(BPF_RET|BPF_K,SECCOMP_RET_ERRNO|(EPERM&SECCOMP_RET_DATA))
 struct sock_filter filters[]={BPF_STMT(BPF_LD|BPF_W|BPF_ABS,offsetof(struct seccomp_data,nr)),DENY(__NR_socket),DENY(__NR_connect),DENY(__NR_bind),DENY(__NR_listen),DENY(__NR_accept),DENY(__NR_ptrace),DENY(__NR_process_vm_readv),DENY(__NR_process_vm_writev),DENY(__NR_mount),DENY(__NR_unshare),DENY(__NR_bpf),DENY(__NR_keyctl),BPF_STMT(BPF_RET|BPF_K,SECCOMP_RET_ALLOW)};
 struct sock_fprog prog={.len=(unsigned short)(sizeof(filters)/sizeof(filters[0])),.filter=filters};if(prctl(PR_SET_SECCOMP,SECCOMP_MODE_FILTER,&prog))die("seccomp");
 struct rlimit cpu={30,30},mem={768ULL*1024*1024,768ULL*1024*1024},nofile={128,128},file={128ULL*1024*1024,128ULL*1024*1024};setrlimit(RLIMIT_CPU,&cpu);setrlimit(RLIMIT_AS,&mem);setrlimit(RLIMIT_NOFILE,&nofile);setrlimit(RLIMIT_FSIZE,&file);umask(0077);execv(argv[i+1],&argv[i+1]);die("exec parser");return 126;
}
