import './TimeSelector.styles.css';

interface TimeSelectorProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
  bookedTimes?: string[];
}

export default function TimeSelector({ 
  selectedDate, 
  selectedTime, 
  onTimeSelect,
  bookedTimes = []
}: TimeSelectorProps) {
  const morningTimes = [
    "10:00", "10:30", "11:00", "11:30"
  ];
  
  const afternoonTimes = [
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00",
  ];

  const isTimeDisabled = (time: string) => {
    if (!selectedDate) return true;

    const [hours, minutes] = time.split(':').map(Number);
    const timeDate = new Date(selectedDate);
    timeDate.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const isWithinValidTimeRange = hours >= 10 && (hours < 20 || (hours === 20 && minutes === 0));

    return timeDate < now || !isWithinValidTimeRange || bookedTimes.includes(time);
};


  const getTimeButtonClass = (time: string) => {
    const classes = ['time-button'];
    if (isTimeDisabled(time)) {
      classes.push('disabled');
    }
    if (time === selectedTime) {
      classes.push('selected');
    }
    return classes.join(' ');
  };

  return (
    <div className="time-selector">
      <div className="time-section">
        <h3 className="time-section-title">오전</h3>
        <div className="time-grid">
          {morningTimes.map(time => (
            <button
              key={time}
              className={getTimeButtonClass(time)}
              onClick={() => !isTimeDisabled(time) && onTimeSelect(time)}
              disabled={isTimeDisabled(time)}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      <div className="time-section">
        <h3 className="time-section-title">오후</h3>
        <div className="time-grid">
          {afternoonTimes.map(time => (
            <button
              key={time}
              className={getTimeButtonClass(time)}
              onClick={() => !isTimeDisabled(time) && onTimeSelect(time)}
              disabled={isTimeDisabled(time)}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}