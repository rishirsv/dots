import React from 'react';

export interface ExampleComponentProps {
  readonly className?: string;
  readonly children?: React.ReactNode;
}

export function ExampleComponent({ className = '', children }: Readonly<ExampleComponentProps>) {
  return <section className={className}>{children}</section>;
}

export default ExampleComponent;
