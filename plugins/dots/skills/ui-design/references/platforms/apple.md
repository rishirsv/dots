# Apple Platforms

Use this reference for native Apple interfaces. Confirm the target platform,
OS range, SDK and existing components before choosing an API.

## Brand And System Behavior

Keep navigation and conventional actions recognizable. Put distinctive imagery,
voice, typography and color primarily into content; customize a functional
control only for a concrete need. For Liquid Glass interfaces, use system
materials for navigation rather than imitating them with browser blur recipes.

Custom fonts must support Dynamic Type and reflow. Custom icons should retain
platform-specific meanings, including sharing. Test light and dark appearances;
keep logos from displacing useful content.

## Resizing And Toolbars

Choose which actions remain visible as a window narrows and which can enter
overflow. Test actual resizing, not just device categories. Inspect inactive
windows as well as focused ones. Use current framework facilities where they
meet the requirement; do not hard-code a snapshot of system geometry.
