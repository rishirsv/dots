# Lay Out Web Text

Use the project’s styling system. Tune example values to the actual font, content
and supported browsers.

## Reading And Display Roles

```css
.prose {
  max-inline-size: 65ch;
  font-size: 1rem;
  line-height: 1.6;
}

.display {
  font-size: clamp(2rem, 1.25rem + 3vw, 4.5rem);
  line-height: 1.1;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

.description {
  text-wrap: pretty;
}

.user-content {
  overflow-wrap: anywhere;
}
```

Use fluid sizing where the composition benefits, and test zoom as well as viewport
changes. `balance` and `pretty` are enhancements: normal wrapping must remain
usable where unsupported. Apply aggressive word breaking to content that needs
it, not all text. Use `min-inline-size: 0` on a flex/grid item when its intrinsic
minimum prevents the intended shrinkage.

## Truncation With A Full-Text Path

```css
.single-line {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.preview {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.preview.is-expanded {
  display: block;
}
```

The single-line container needs a constrained width. Pair truncated meaningful
content with a keyboard- and touch-accessible detail or expansion control. Keep
its expanded state and accessible label synchronized. Do not clamp essential
instructions or hide interactive descendants inside clipped content.

## Underlines And Mixed-Direction Values

```css
.text-link {
  text-decoration-line: underline;
  text-decoration-thickness: from-font;
  text-underline-offset: 0.15em;
  text-decoration-skip-ink: auto;
}
```

Inspect underline position with the active face and fallback. For a value whose
direction is unknown inside otherwise directed content, isolate it:

```html
<p lang="en">Created by <bdi dir="auto">اسم المستخدم</bdi></p>
```

Set the surrounding document's language and direction appropriately. Isolation
protects adjacent punctuation and text order; it does not translate content or
mirror the page layout.
