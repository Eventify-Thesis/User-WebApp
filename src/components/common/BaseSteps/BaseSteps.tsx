import { Stepper, StepperProps } from '@mantine/core';

export interface BaseStepsProps extends Omit<StepperProps, 'active' | 'children'> {
  current?: number;
  items?: Array<{ title: string; description?: string }>;
}

export const BaseSteps: React.FC<BaseStepsProps> = ({
  current = 0,
  items = [],
  ...otherProps
}) => {
  return (
    <Stepper
      active={current}
      {...otherProps}
    >
      {items.map((item, index) => (
        <Stepper.Step
          key={index}
          label={item.title}
          description={item.description}
        />
      ))}
    </Stepper>
  );
};
