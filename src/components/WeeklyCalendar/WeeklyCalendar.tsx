import { useState, useEffect } from 'react';
import './WeeklyCalendar.styles.css';

interface WeeklyCalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

export default function WeeklyCalendar({ selectedDate, onDateSelect }: WeeklyCalendarProps) {
    const [currentWeekStart, setCurrentWeekStart] = useState(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
      });
  const [weekDates, setWeekDates] = useState<Date[]>([]);

  useEffect(() => {
    const dates = [];
    const start = new Date(currentWeekStart);
    start.setDate(start.getDate() - start.getDay() + 1); // Start from Monday

    for (let i = 0; i < 7; i++) {
      dates.push(new Date(start));
      start.setDate(start.getDate() + 1);
    }
    setWeekDates(dates);
  }, [currentWeekStart]);

  const isPrevWeekDisabled = () => {
    const firstDateOfWeek = weekDates[0];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return firstDateOfWeek <= today;
  };

  const handlePrevWeek = () => {
    if (!isPrevWeekDisabled()) {
      const newDate = new Date(currentWeekStart);
      newDate.setDate(newDate.getDate() - 7);
      setCurrentWeekStart(newDate);
    }
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDayNameDisabled = (index: number) => {
    if (!weekDates[index]) return false;
    return isDateDisabled(weekDates[index]);
  };

  const dayNameClassName = (index: number) => {
    const classes = ['day-name'];
    if (index === 6) classes.push('sunday');
    if (isDayNameDisabled(index)) classes.push('disabled');
    return classes.join(' ');
  };

  const dateClassName = (date: Date) => {
    const classes = ['calendar-date'];
    
    if (date.getDay() === 0) {
      classes.push('sunday');
    }
    
    if (isDateDisabled(date)) {
      classes.push('disabled');
    }
    
    if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
      classes.push('selected');
    }
    
    return classes.join(' ');
  };

  const formatMonth = (date: Date) => {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
  };

  const dayNames = ['월', '화', '수', '목', '금', '토', '일'];

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button 
          onClick={handlePrevWeek} 
          className="arrow-button"
          disabled={isPrevWeekDisabled()}
        >
          <img 
            src={`/icons/${isPrevWeekDisabled() ? 'backarrow-disabled' : 'backarrow-reserve'}.svg`} 
            alt="이전 주" 
          />
        </button>
        <span className="month-display">{formatMonth(currentWeekStart)}</span>
        <button 
          onClick={handleNextWeek} 
          className="arrow-button"
        >
          <img 
            src="/icons/frontarrow.svg" 
            alt="다음 주" 
          />
        </button>
      </div>
      
      <div className="calendar-days">
        {dayNames.map((day, index) => (
          <div 
            key={day} 
            className={dayNameClassName(index)}
          >
            {day}
          </div>
        ))}
        
        {weekDates.map((date, index) => (
          <button
            key={date.toISOString()}
            className={dateClassName(date)}
            onClick={() => !isDateDisabled(date) && onDateSelect(date)}
            disabled={isDateDisabled(date)}
          >
            {date.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
}