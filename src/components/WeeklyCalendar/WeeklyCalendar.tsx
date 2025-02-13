import { useState, useEffect, useMemo } from 'react';
import './WeeklyCalendar.styles.css';

interface WeeklyCalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  bookedTimesByDate?: Record<string, string[]>;
}

export default function WeeklyCalendar({ 
  selectedDate, 
  onDateSelect, 
  bookedTimesByDate = {} 
}: WeeklyCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  const generateDates = useMemo(() => {
    return () => {
      const dates = [];
      const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      const currentDate = new Date(firstDay);

      while (currentDate <= lastDay) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dates;
    };
  }, [currentMonth]);

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
  }, [generateDates]);

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

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const threeMonthsLater = new Date(today);
    threeMonthsLater.setMonth(today.getMonth() + 3);
    
    // 날짜 기본 제한 조건
    if (date < today || date > threeMonthsLater) {
      return true;
    }

    // 해당 날짜의 모든 시간이 예약되었는지 확인
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const bookedTimesForDate = bookedTimesByDate[dateKey] || [];
    
    // 모든 시간대(10:00~20:00)가 예약되었다면 날짜 비활성화
    const allAvailableTimes = [
      "10:00", "10:30", "11:00", "11:30", 
      "12:00", "12:30", "13:00", "13:30", 
      "14:00", "14:30", "15:00", "15:30", 
      "16:00", "16:30", "17:00", "17:30", 
      "18:00", "18:30", "19:00", "19:30", "20:00",
    ];

    return allAvailableTimes.every(time => bookedTimesForDate.includes(time));
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
  const dates = useMemo(() => generateDates(), [generateDates]);

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