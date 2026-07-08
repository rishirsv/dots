I would replace the text-only `Screenshots` list with actual embedded visual evidence for each listed screen, keeping captions close to the image:

```md
## Screenshots

| Screen | Capture | Review note |
| --- | --- | --- |
| [Screen name] | ![[Screen name] after change](https://github.com/user-attachments/assets/...) | Shows the updated layout/state for this PR. |
| [Screen name] | ![[Screen name] after change](https://github.com/user-attachments/assets/...) | Shows the responsive/alternate state. |
```

If the evidence is a flow, I’d use a short clip link instead of or alongside the image. I would then re-open or re-query the live PR body and confirm the embeds are present. A bullet list of screen names alone is not enough for a visual/UI PR; if captures are genuinely unavailable, I’d leave the PR as draft and state the exact missing captures under `Screenshots` before closing out.

