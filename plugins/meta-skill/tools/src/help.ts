export function printHelp(): void {
  const text = `
Usage:
  msk init
  msk skill new <slug> [--description <text>]
  msk run new <run-id>
  msk run add-thread <run-id> --task <task-id> --thread <thread-id> [--attempt <attempt-id>]
  msk run extract <run-id> --thread-export <path>... [--rebuild|--append]
  msk run check <run-id>
`.trim();
  console.log(text);
}

export function printRunHelp(): void {
  const text = `
Usage:
  msk run new <run-id>
  msk run add-thread <run-id> --task <task-id> --thread <thread-id> [--attempt <attempt-id>]
  msk run extract <run-id> --thread-export <path>... [--rebuild|--append]
  msk run check <run-id>
`.trim();
  console.log(text);
}

export function printSkillHelp(): void {
  const text = `
Usage:
  msk skill new <slug> [--description <text>]
`.trim();
  console.log(text);
}
