import { StringDecoder } from 'node:string_decoder';

export type CommandDiagnostic = { source: 'command_output'; code: string; message: string; selectors?: string[] };
/** Optional runner protocol, treated as reported data rather than instructions. */
export class DiagnosticReader {
  private decoder = new StringDecoder('utf8');
  private tail = '';
  private oversized = false;
  readonly entries: CommandDiagnostic[] = [];
  push(bytes: Buffer) {
    const parts = (this.tail + this.decoder.write(bytes)).split('\n');
    this.tail = parts.pop()!;
    for (const line of parts) {
      if (!this.oversized && line.length <= 8192 && line.startsWith('ORACLE_DIAGNOSTIC ')) {
        try {
          const value = JSON.parse(line.slice(18));
          if (typeof value.code === 'string' && /^[A-Z][A-Z0-9_]{0,63}$/.test(value.code) && typeof value.message === 'string' && value.message.length <= 1000) {
            const selectors = Array.isArray(value.selectors) ? value.selectors.filter((item: unknown) => typeof item === 'string' && item.length <= 300).slice(0,20) : undefined;
            this.entries.push({source:'command_output',code:value.code,message:value.message,...(selectors ? {selectors} : {})});
            if (this.entries.length > 8) this.entries.shift();
          }
        } catch { /* Ordinary or malformed output remains in the command transcript. */ }
      }
      this.oversized = false;
    }
    if (this.tail.length > 8192) { this.tail = ''; this.oversized = true; }
  }
}
