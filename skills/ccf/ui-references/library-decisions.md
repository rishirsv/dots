# Library decisions.

Use these guidelines when deciding things like whether to use raw HTML element, predefined custom components, or predefined Chakra v3 components, or whether to use Tailwind/CSS styling or built in Chakra theming..

## Using components vs raw html elements

1. Prefer using predefined custom elements in the shared folder (like Button.tsx) over raw html elements + tailwindcss for primitives. If the no predefiend custom elements exist, prefer using raw html elements like div/span/li over Chakra v3 components like Box/Text/List/Stack.
2. If predefined custom elements don't exist, prefer using Chakra v3 components over creating new ones.
3. Prefer using Chakra v3 components for more complex components like Slider or Accordion or Breadcrumb.

## Styling decisions

1. Prefer to use Chakra theming over css/tailwind styling when using Chakra v3 components.
2. Ensure colours are consistent across Tailwind, CSS and Chakra theme.3. Assign one styling owner per element. When using Chakra components, do not also use Tailwind classes for the same property group on that same element.
4. Avoid conflicting utility classes on the same node, especially multiple `h-*`, `min-h-*`, `rounded-*`, `p-*`, or `border-*` classes.

