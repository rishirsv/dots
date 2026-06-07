export function printHelp(): void {
  const text = `
Usage:
  msk init
  msk skill new <slug> [--description <text>]
  msk run new <run-id>
  msk run add-thread <run-id> --task <task-id> --variant <variant-id> --thread <thread-id> [--attempt <attempt-id>]
  msk run extract <run-id> --thread-export <path>... [--rebuild|--append]
  msk run report <run-id>
`.trim();
  console.log(text);
}
