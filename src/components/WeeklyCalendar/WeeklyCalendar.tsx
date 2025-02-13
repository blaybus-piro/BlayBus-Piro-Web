import { useState, useEffect } from 'react';
import './WeeklyCalendar.styles.css';

interface WeeklyCalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

export default function WeeklyCalendar({ selectedDate, onDateSelect }: WeeklyCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  const findTodayIndex = (dates: Date[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dates.findIndex(date => date.toDateString() === today.toDateString());
  };
  
  useEffect(() => {
    const scrollContainer = document.querySelector('.calendar-scroll-container');
    const dates = generateDates();
    const todayIndex = findTodayIndex(dates);
    
    if (scrollContainer && todayIndex !== -1) {
      const columnWidth = 50; // calendar-column의 width + gap
      const containerWidth = scrollContainer.clientWidth;
      const scrollTo = (todayIndex * columnWidth) - (containerWidth / 2) + (columnWidth / 2);
      
      scrollContainer.scrollLeft = Math.max(0, scrollTo);
    }
  }, []);

  const handlePrevMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentMonth(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentMonth(newDate);
  };

  const formatMonth = (date: Date) => {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
  };

  const generateDates = () => {
    const dates = [];
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    // Start from the first day of the month
    let currentDate = new Date(firstDay);

    // Generate all dates for the current month
    while (currentDate <= lastDay) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDayNameDisabled = (date: Date) => {
    return isDateDisabled(date);
  };

  const dayNameClassName = (date: Date) => {
    const classes = ['day-name'];
    if (date.getDay() === 0) classes.push('sunday');
    if (isDayNameDisabled(date)) classes.push('disabled');
    return classes.join(' ');
  };

  const dateClassName = (date: Date) => {
    const classes = ['calendar-date'];
    if (date.getDay() === 0) classes.push('sunday');
    if (isDateDisabled(date)) classes.push('disabled');
    if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
      classes.push('selected');
    }
    return classes.join(' ');
  };

  const dayNames = ['월', '화', '수', '목', '금', '토', '일'];
  const dates = generateDates();

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button 
          onClick={handlePrevMonth} 
          className="arrow-button"
        >
          <img 
            src="/icons/backarrow-reserve.svg"
            alt="이전 달" 
          />
        </button>
        <span className="month-display">{formatMonth(currentMonth)}</span>
        <button 
          onClick={handleNextMonth} 
          className="arrow-button"
        >
          <img 
            src="/icons/frontarrow.svg" 
            alt="다음 달" 
          />
        </button>
      </div>
      
      <div className="calendar-scroll-container">
        <div className="calendar-content">
          <div className="calendar-days">
            {dates.map((date) => (
              <div key={date.toISOString()} className="calendar-column">
                <div className={dayNameClassName(date)}>
                  {dayNames[date.getDay()]}
                </div>
                <button
                  className={dateClassName(date)}
                  onClick={() => !isDateDisabled(date) && onDateSelect(date)}
                  disabled={isDateDisabled(date)}
                >
                  {date.getDate()}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}