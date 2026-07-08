I’d update the PR body’s `Screenshots` section so the screen list is no longer text-only. Each listed screen should have an embedded screenshot or short clip plus a caption explaining what the reviewer should notice.

Example shape:

```md
## Screenshots

### Settings screen
![Settings screen after layout update](https://github.com/user-attachments/assets/...)
Caption: Shows the updated spacing, control alignment, and final empty/error state behavior.

### Detail screen
![Detail screen updated visual treatment](https://github.com/user-attachments/assets/...)
Caption: Shows the revised hierarchy and responsive layout at the changed breakpoint.
```

If the real captures are not available yet, I would keep the PR as draft and update the body with an explicit blocker like: `Still needed before ready for review: screenshots for Settings screen, Detail screen, and mobile breakpoint.` I would not close out with only the text list.

