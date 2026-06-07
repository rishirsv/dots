const SAFE_ID_PATTERN = /^[A-Za-z0-9_.-]+$/;

export function assertSafeId(value: string | undefined, label: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${label} is required`);
  }
  if (value !== value.trim()) {
    throw new Error(`invalid ${label} "${value}": use letters, numbers, dots, dashes, or underscores`);
  }
  if (
    !SAFE_ID_PATTERN.test(value) ||
    value === "." ||
    value.includes("..") ||
    value.includes("/") ||
    value.includes("\\")
  ) {
    throw new Error(`invalid ${label} "${value}": use letters, numbers, dots, dashes, or underscores`);
  }
  return value;
}

export function assertSafeRunId(value: string | undefined): string {
  return assertSafeId(value, "run id");
}

export function assertSafeTaskId(value: string | undefined): string {
  return assertSafeId(value, "task id");
}

export function assertSafeAttemptId(value: string | undefined): string {
  return assertSafeId(value, "attempt id");
}

export function assertSafeSkillSlug(value: string | undefined): string {
  return assertSafeId(value, "skill slug");
}
