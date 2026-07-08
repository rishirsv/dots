I would update the PR body’s `Screenshots` section from a text-only checklist into actual visual evidence.

Concretely: keep each listed screen name, but add an embedded screenshot or clip next to it using Markdown image/video links, with a short caption saying what the reviewer should notice.

Example:

```md
## Screenshots

**Dashboard, empty state**  
![Dashboard empty state showing the revised CTA](https://github.com/user-attachments/assets/...)

**Dashboard, populated state**  
![Dashboard populated state with updated card spacing](https://github.com/user-attachments/assets/...)
```

A plain list of screens is not enough for a visual/UI PR. Before closing out, I would verify the live draft PR body contains the actual image or clip embeds. If captures genuinely are not available yet, I would keep the PR as draft and explicitly note which screenshots are still missing.