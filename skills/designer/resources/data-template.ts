export interface ExampleItem {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly href?: string;
}

export const exampleItems: readonly ExampleItem[] = [
  {
    id: 'item-1',
    title: 'Example title',
    description: 'Replace with source-derived content.',
    href: '#',
  },
];
