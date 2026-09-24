# Drag Input

Use these web recipes when implementing custom drag behavior. Reuse the existing
component’s gesture system when it already supplies them. Native controls keep
their platform recognizers.

### Pointer capture for drag

Once dragging starts, set the element to capture all pointer events. This ensures dragging continues even if the pointer leaves the element bounds.

### Multi-touch protection

Ignore additional touch points after the initial drag begins. Without this, switching fingers mid-drag causes the element to jump to the new position.

```js
function onPress() {
  if (isDragging) return;
  // Start drag...
}
```

### Complete The Gesture Lifecycle

Track the initiating pointer identity. Handle pointer cancellation and lost
capture as well as release; clear transient drag state and do not commit an
accidental action. Preserve page scrolling on unused axes. Keep a keyboard or
control alternative to any essential drag. Verify leaving the bounds, a second
finger, cancellation, and a new drag after cancellation.
