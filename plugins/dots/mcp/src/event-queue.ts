export class AdapterEventOverloadError extends Error {
  readonly code = "adapter_event_overload";
  constructor() { super("Adapter event backlog exceeded its entry or byte budget"); }
}

export class AsyncEventQueue<T> implements AsyncIterable<T> {
  private readonly buffered: T[] = [];
  private readonly waiters: Array<{ resolve: (result: IteratorResult<T>) => void; reject: (error: Error) => void }> = [];
  private bufferedBytes = 0;
  private closed = false;
  private failure?: Error;

  constructor(private readonly maxBuffered = 10_000, private readonly maxBufferedBytes = 8 * 1024 * 1024) {}

  private size(value: T): number { return Buffer.byteLength(JSON.stringify(value)); }

  push(value: T): void {
    if (this.failure) throw this.failure;
    if (this.closed) return;
    const bytes = this.size(value);
    if (bytes > this.maxBufferedBytes || this.buffered.length >= this.maxBuffered || this.bufferedBytes + bytes > this.maxBufferedBytes) {
      const failure = new AdapterEventOverloadError();
      this.fail(failure);
      throw failure;
    }
    const waiter = this.waiters.shift();
    if (waiter) {
      waiter.resolve({ value, done: false });
      return;
    }
    this.bufferedBytes += bytes;
    this.buffered.push(value);
  }

  fail(error: Error): void {
    if (this.closed) return;
    this.failure = error;
    this.closed = true;
    if (this.buffered.length === 0) {
      while (this.waiters.length > 0) this.waiters.shift()!.reject(error);
    }
  }

  close(): void {
    if (this.closed) return;
    this.closed = true;
    while (this.waiters.length > 0) this.waiters.shift()!.resolve({ value: undefined, done: true });
  }

  async collect(maxBytes = Infinity): Promise<T[]> {
    const values: T[] = [];
    let bytes = 0;
    for await (const value of this) {
      bytes += this.size(value);
      if (bytes > maxBytes) {
        const failure = new AdapterEventOverloadError();
        this.fail(failure);
        throw failure;
      }
      values.push(value);
    }
    return values;
  }

  [Symbol.asyncIterator](): AsyncIterator<T> {
    return {
      next: () => {
        const value = this.buffered.shift();
        if (value !== undefined) {
          this.bufferedBytes -= this.size(value);
          return Promise.resolve({ value, done: false });
        }
        if (this.failure) return Promise.reject(this.failure);
        if (this.closed) return Promise.resolve({ value: undefined, done: true });
        return new Promise((resolve, reject) => this.waiters.push({ resolve, reject }));
      },
      return: () => {
        this.close();
        return Promise.resolve({ value: undefined, done: true });
      },
    };
  }
}
