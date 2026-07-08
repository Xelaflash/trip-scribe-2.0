'use client';

import { forwardRef } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export const DatePicker = forwardRef<
  HTMLButtonElement,
  {
    value?: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    name?: string;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
  }
>(({ value, onChange, onBlur, name, placeholder = 'Pick a date', className, disabled }, ref) => {
  const selectedDate = value ? parseDateValue(value) : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant={'outline'}
          name={name}
          type="button"
          disabled={disabled}
          data-empty={!selectedDate}
          className={cn(
            'h-12 w-full justify-start rounded-2xl border-border/80 bg-card/80 px-4 text-left font-semibold shadow-xs transition-colors hover:bg-muted/70 data-[empty=true]:text-muted-foreground dark:hover:bg-ink-700',
            className,
          )}
          onBlur={onBlur}
        >
          <CalendarIcon className="mr-2 size-5 shrink-0 text-primary" aria-hidden="true" />
          {selectedDate ? format(selectedDate, 'PPP') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto rounded-2xl border-border/80 bg-card p-0 shadow-elevationMedium">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => onChange(date ? format(date, 'yyyy-MM-dd') : '')}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
});

DatePicker.displayName = 'DatePicker';

const parseDateValue = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);

  if (!year || !month || !day) {
    return undefined;
  }

  return new Date(year, month - 1, day);
};
