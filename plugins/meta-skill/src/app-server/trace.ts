import { appendJsonl } from "../project.ts";

export interface AppServerTraceLine {
  direction?: "client" | "server" | "stderr";
  message: unknown;
}

export class JsonlTraceRecorder {
  private target: string | undefined;
  private queue: Promise<void> = Promise.resolve();

  reset(target: string | undefined): void {
    this.target = target;
    this.queue = Promise.resolve();
  }

  append(line: AppServerTraceLine): void {
    if (!this.target) return;
    const target = this.target;
    this.queue = this.queue.then(() => appendJsonl(target, line));
  }

  async flush(): Promise<void> {
    await this.queue;
  }
}

export class BoundedTraceBuffer {
  private events: Array<{ index: number; event: AppServerTraceLine }> = [];
  private nextIndex = 0;
  private readonly maxEvents: number;

  constructor(maxEvents: number) {
    this.maxEvents = maxEvents;
  }

  append(event: AppServerTraceLine): void {
    this.events.push({ index: this.nextIndex, event });
    this.nextIndex += 1;
    while (this.events.length > this.maxEvents) {
      this.events.shift();
    }
  }

  mark(): number {
    return this.nextIndex;
  }

  since(index: number): { events: AppServerTraceLine[]; overflowed: boolean; droppedEventCount: number } {
    const firstRetainedIndex = this.events[0]?.index ?? this.nextIndex;
    return {
      events: this.events.filter((item) => item.index >= index).map((item) => item.event),
      overflowed: index < firstRetainedIndex,
      droppedEventCount: Math.max(0, firstRetainedIndex - index)
    };
  }
}
