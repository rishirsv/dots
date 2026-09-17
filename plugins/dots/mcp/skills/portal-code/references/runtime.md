# Runtime

The guest is QuickJS/WASM, not V8 eval or node:vm. Defaults are 32 MiB heap, 512 KiB stack, 60 s wall time, 100 calls, four in-flight callbacks, 16 KiB console and 64 KiB inline results. The supervisor has a separate hard deadline.
