# VS Code

Store VS Code user config here.

Suggested files:

- `User/settings.json`
- `User/keybindings.json`
- `extensions.txt`

Export extensions:

```bash
code --list-extensions > configs/vscode/extensions.txt
```

Restore extensions:

```bash
xargs -n 1 code --install-extension < configs/vscode/extensions.txt
```

Keep workspace-specific settings in the project repo, not here.
