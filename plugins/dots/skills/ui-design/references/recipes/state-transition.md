# A Small State Transition

```css
.disclosure-icon {
  transition: transform 180ms cubic-bezier(0.2, 0, 0, 1);
}

.disclosure-button[aria-expanded="true"] .disclosure-icon {
  transform: rotate(180deg);
}

@media (prefers-reduced-motion: reduce) {
  .disclosure-icon {
    transition: none;
  }
}
```

Drive `aria-expanded` and panel visibility from the same state. The icon transition
can reverse naturally when the user toggles again. Panel semantics, focus, and
content availability should not depend on the icon's transition completing.
