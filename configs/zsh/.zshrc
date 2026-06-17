# ==============================================
# Oh My Zsh Configuration
# ==============================================
export ZSH="$HOME/.oh-my-zsh"

zstyle ':omz:update' mode disabled
DISABLE_AUTO_UPDATE="true"

ZSH_THEME="robbyrussell"

plugins=(git)

source "$ZSH/oh-my-zsh.sh"

# ==============================================
# Custom Aliases
# ==============================================
export CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN=1
export CLAUDE_CODE_DISABLE_MOUSE=1

alias claude='command claude'
alias cc='claude --dangerously-skip-permissions'

# ==============================================
# PATH Additions
# ==============================================

# Bun
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

# uv tools
export PATH="$HOME/.local/bin:$PATH"

# maestro-runner
export PATH="$HOME/.maestro-runner/bin:$PATH"

# ==============================================
# Version Managers
# ==============================================

# mise (universal version manager)
eval "$(mise activate zsh)"

# fnm (Fast Node Manager)
eval "$(fnm env --use-on-cd)"

# ==============================================
# Bun Completions
# ==============================================

[ -s "$HOME/.bun/_bun" ] && source "$HOME/.bun/_bun"

# ==============================================
# Prompt
# ==============================================

# Starship prompt
eval "$(starship init zsh)"

# ==============================================
# Docker Completions
# ==============================================

autoload -Uz compinit
compinit

# ==============================================
# Completion UX
# ==============================================

zmodload zsh/complist
setopt AUTO_MENU
setopt COMPLETE_IN_WORD
setopt ALWAYS_TO_END
setopt GLOB_COMPLETE

zstyle ':completion:*' menu select
zstyle ':completion:*' matcher-list 'm:{a-zA-Z}={A-Za-z}' 'r:|[._-]=* r:|=*'
zstyle ':completion:*' list-colors ${(s.:.)LS_COLORS}
zstyle ':completion:*' group-name ''
zstyle ':completion:*:descriptions' format '%F{39}%B%d%b%f'
zstyle ':completion:*:messages' format '%F{220}%d%f'
zstyle ':completion:*:warnings' format '%F{196}no matches%f'

autoload -Uz up-line-or-beginning-search down-line-or-beginning-search
bindkey '^[[Z' reverse-menu-complete
bindkey '^[[A' up-line-or-beginning-search
bindkey '^[[B' down-line-or-beginning-search

# Ghostty sends standard Mac text-field shortcuts directly:
# Cmd-Left/Cmd-Right jump to line start/end, Cmd-Backspace clears the line,
# and Option-Left/Option-Right move by word.
shift-enter-newline() {
  LBUFFER+=$'\n'
}
zle -N shift-enter-newline
bindkey $'\e[13;2u' shift-enter-newline
bindkey $'\e[27;2;13~' shift-enter-newline
bindkey $'\e[13;2~' shift-enter-newline

# ==============================================
# Autocomplete & Shell Enhancements
# ==============================================

# --- zsh-autosuggestions Configuration ---
source /opt/homebrew/share/zsh-autosuggestions/zsh-autosuggestions.zsh

export ZSH_AUTOSUGGEST_BUFFER_MAX_SIZE=20
export ZSH_AUTOSUGGEST_USE_ASYNC=1
export ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE="fg=#6e6e6e,italic"
export ZSH_AUTOSUGGEST_STRATEGY=(history completion)

# --- fzf Configuration ---
source <(fzf --zsh)

export FZF_DEFAULT_OPTS="
  --height 40%
  --layout=reverse
  --border
  --preview-window=right:50%
  --color=bg+:#1f1f1f,bg:#181818,spinner:#339cff,hl:#fa423e
  --color=fg:#f4f4f5,header:#fa423e,info:#ad7bf9,pointer:#339cff
  --color=marker:#40c977,fg+:#ffffff,prompt:#339cff,hl+:#ff6965
  --color=border:#303030,gutter:#181818,preview-bg:#181818
  --bind='ctrl-/:toggle-preview'
"

if command -v fd >/dev/null 2>&1; then
  export FZF_DEFAULT_COMMAND='fd --type f --hidden --follow --exclude .git'
  export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"
fi

# --- zoxide Configuration ---
eval "$(zoxide init zsh)"

# --- Atuin Configuration ---
eval "$(atuin init zsh)"

# --- zsh-syntax-highlighting Configuration ---
# Keep this last so every widget above gets highlighted correctly.
typeset -A ZSH_HIGHLIGHT_STYLES
ZSH_HIGHLIGHT_STYLES[default]='fg=default'
ZSH_HIGHLIGHT_STYLES[unknown-token]='fg=#fa423e,bold'
ZSH_HIGHLIGHT_STYLES[reserved-word]='fg=#ad7bf9,bold'
ZSH_HIGHLIGHT_STYLES[suffix-alias]='fg=#339cff,underline'
ZSH_HIGHLIGHT_STYLES[global-alias]='fg=#339cff,bold'
ZSH_HIGHLIGHT_STYLES[precommand]='fg=#e5b454'
ZSH_HIGHLIGHT_STYLES[commandseparator]='fg=#6e6e6e'
ZSH_HIGHLIGHT_STYLES[autodirectory]='fg=#339cff,bold'
ZSH_HIGHLIGHT_STYLES[path]='fg=#339cff,underline'
ZSH_HIGHLIGHT_STYLES[path_pathseparator]='fg=#6e6e6e'
ZSH_HIGHLIGHT_STYLES[globbing]='fg=#e5b454'
ZSH_HIGHLIGHT_STYLES[history-expansion]='fg=#e5b454,bold'
ZSH_HIGHLIGHT_STYLES[command-substitution]='fg=default'
ZSH_HIGHLIGHT_STYLES[command-substitution-delimiter]='fg=#6e6e6e'
ZSH_HIGHLIGHT_STYLES[single-hyphen-option]='fg=#40c977'
ZSH_HIGHLIGHT_STYLES[double-hyphen-option]='fg=#40c977'
ZSH_HIGHLIGHT_STYLES[single-quoted-argument]='fg=#40c977'
ZSH_HIGHLIGHT_STYLES[double-quoted-argument]='fg=#40c977'
ZSH_HIGHLIGHT_STYLES[dollar-quoted-argument]='fg=#40c977'
ZSH_HIGHLIGHT_STYLES[redirection]='fg=#ad7bf9'
ZSH_HIGHLIGHT_STYLES[arg0]='fg=#339cff,bold'
source /opt/homebrew/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

# ==============================================
# Ghostty Configuration Aliases
# ==============================================

alias gconfig="$HOME/.config/ghostty/gconfig"
alias ghostty-warp="$HOME/.config/ghostty/interactive-config.sh"
alias gconfig-interactive="$HOME/.config/ghostty/interactive-config.sh"
alias gconfig-switch="$HOME/.config/ghostty/switch-config.sh"

alias gcyber="$HOME/.config/ghostty/gconfig cyber"
alias gminimal="$HOME/.config/ghostty/gconfig minimal"
alias gcozy="$HOME/.config/ghostty/gconfig cozy"
alias gpro="$HOME/.config/ghostty/gconfig pro"

# ==============================================
# Local Secrets And Machine Overrides
# ==============================================

# Keep API keys and other machine-local exports out of Git.
[ -f "$HOME/.zshrc.local" ] && source "$HOME/.zshrc.local"
