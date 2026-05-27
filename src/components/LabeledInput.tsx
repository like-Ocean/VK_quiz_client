import * as React from 'react';
import { Input, type InputProps } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface LabeledInputProps extends InputProps {
    label?: string;
    containerClassName?: string;
}

export const LabeledInput = React.forwardRef<HTMLInputElement, LabeledInputProps>(
    ({ label, id, containerClassName, ...props }, ref) => {
        const autoId = React.useId();
        const inputId = id ?? autoId;
        return (
            <div className={cn('space-y-2', containerClassName)}>
                {label && (
                    <label htmlFor={inputId} className="block">
                        {label}
                    </label>
                )}
                <Input id={inputId} ref={ref} {...props} />
            </div>
        );
    },
);
LabeledInput.displayName = 'LabeledInput';