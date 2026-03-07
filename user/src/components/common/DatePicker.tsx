import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isBefore, startOfDay } from 'date-fns';

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  onClose: () => void;
}

export default function DatePicker({ value, onChange, minDate, onClose }: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(value || new Date());
  const today = startOfDay(new Date());
  const min = minDate ? startOfDay(minDate) : today;

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get first day of week for the month
  const firstDayOfWeek = monthStart.getDay();
  
  // Create array with empty cells for days before month starts
  const emptyDays = Array(firstDayOfWeek).fill(null);
  
  const allDays = [...emptyDays, ...daysInMonth];

  const handleDateClick = (day: Date) => {
    if (!isBefore(day, min)) {
      onChange(day);
      onClose();
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const isDateDisabled = (day: Date) => {
    return isBefore(day, min);
  };

  const isDateSelected = (day: Date) => {
    return value && isSameDay(day, value);
  };

  const isToday = (day: Date) => {
    return isSameDay(day, today);
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg shadow-xl border-2 border-primary-coral/50 p-4 min-w-[300px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-primary-coral" />
          <h3 className="text-body font-semibold text-neutral-charcoal">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-neutral-medium-gray hover:text-neutral-charcoal transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-white rounded-lg transition-colors"
          disabled={isSameMonth(currentMonth, min)}
        >
          <ChevronLeft className={`w-5 h-5 ${isSameMonth(currentMonth, min) ? 'text-neutral-border-gray' : 'text-neutral-charcoal'}`} />
        </button>
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-white rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-neutral-charcoal" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {/* Week day headers */}
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-caption font-medium text-neutral-medium-gray py-2"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {allDays.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const disabled = isDateDisabled(day);
          const selected = isDateSelected(day);
          const isTodayDate = isToday(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => handleDateClick(day)}
              disabled={disabled}
              className={`
                aspect-square rounded-lg text-body font-medium transition-all
                ${disabled
                  ? 'text-neutral-border-gray cursor-not-allowed opacity-30'
                  : selected
                    ? 'bg-primary-coral text-neutral-light-gray hover:bg-primary-coral/90'
                    : isTodayDate
                      ? 'bg-primary-coral/10 text-primary-coral hover:bg-primary-coral/20'
                      : 'text-neutral-charcoal hover:bg-white'
                }
              `}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-neutral-border-gray">
        <div className="flex items-center justify-between text-caption text-neutral-medium-gray">
          <span>Today: {format(today, 'MMM dd, yyyy')}</span>
          {value && (
            <span className="text-primary-coral font-medium">
              Selected: {format(value, 'MMM dd, yyyy')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
