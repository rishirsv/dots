# Native Scrolling

Use this when building or debugging lazy SwiftUI collections. Off-screen layout
is estimated; avoid treating an absolute content offset as a stable item
identity. Prefer visible-item relationships for behavior tied to what people see.

Keep durable selection and editing state outside disposable row-local state.
Prepare a reasonable row layout before appearance; avoid a second measurement
pass that changes heights during scrolling. Filter the data instead of hiding
individual leaf views with conditional output. Check transforms near the visible
boundary so virtualization does not remove content that still appears on screen.

Test scrolling away and back, resizing, mixed row sizes, and navigation to a
distant item. Confirm API availability in the target SDK.
