# Drag Input

Use these web recipes when implementing custom drag behavior. Reuse the existing
component’s gesture system when it already supplies them. For native controls,
use the platform's gesture recognizers.

### Pointer capture for drag

When dragging starts, capture the initiating pointer on the element. This
ensures dragging continues even if the pointer leaves the element bounds.

### Multi-touch protection

Ignore additional touch points after the initial drag begins. Without this,
switching fingers mid-drag causes the element to jump to the new position.

```js
function onPress() {
  if (isDragging) return;
  // Start drag...
}
```

### Complete The Gesture Lifecycle

Track the initiating pointer identity. Handle pointer cancellation and lost
capture as well as release; clear transient drag state and do not commit an
accidental action. Preserve page scrolling on unused axes. For any essential
drag action, provide a keyboard action or control that achieves the same result.
Verify leaving the bounds, a second finger, cancellation, and a new drag after
cancellation.
