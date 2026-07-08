I would replace the text-only screen list with a real `Screenshots` section that embeds the captures inline.

```markdown
## Screenshots

| Screen | Capture | Review note |
| --- | --- | --- |
| <screen name> | ![<screen name> after change](<uploaded-image-url>) | <what changed / what to verify> |
| <screen name> | ![<screen name> after change](<uploaded-image-url>) | <what changed / what to verify> |
```

If I did not have real captures yet, I would keep the PR as draft and update that section to say exactly what is still missing:

```markdown
## Screenshots

Still needed before this is ready for review:

- [ ] <screen name>
- [ ] <screen name>
```

A visual/UI draft PR should not close out with only a text list of affected screens.