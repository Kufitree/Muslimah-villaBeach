import { useState, useMemo } from 'react';
import { generateCalendarMonths, getTodayDateString } from '../utils';

export default function DatePickerModal({ title, isOpen, onClose, onSelectDate, minDate, maxDate, isDateDisabled }) {
  const [months] = useState(() => {
    // We generate enough months to cover standard booking futures
    return generateCalendarMonths(new Date(2026, 3, 1), 12); 
  });

  const todayStr = useMemo(() => getTodayDateString(), []);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="header modal-header">
          <button onClick={onClose}>&times;</button>
          <h1>{title}</h1>
        </div>
        
        <div className="content modal-scroll">
          {months.map((m) => (
            <div key={`${m.year}-${m.month}`} className="month-block">
              <h2 className="month-title">{m.monthName} {m.year + 543}</h2>
              
              <div className="calendar-grid">
                {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map(d => (
                  <div key={d} className="day-header">{d}</div>
                ))}
                
                {m.days.map((dayObj, dIdx) => {
                  if (!dayObj) return <div key={`empty-${dIdx}`} className="date-cell empty" />;
                  
                  const dateStr = dayObj.dateStr;
                  const isPast = minDate && dateStr < minDate;
                  const isFuture = maxDate && dateStr > maxDate;
                  const isProgrammaticallyDisabled = isDateDisabled ? isDateDisabled(dateStr) : false;
                  
                  const isDisabled = isPast || isFuture || isProgrammaticallyDisabled;
                  const isToday = dateStr === todayStr;
                  
                  let cellClasses = 'date-cell';
                  if (isDisabled) {
                    cellClasses += ' disabled';
                  } else {
                    cellClasses += ' pickable';
                  }
                  
                  if (isToday) {
                    cellClasses += ' is-today';
                  }

                  return (
                    <div 
                      key={dayObj.dateStr}
                      className={cellClasses}
                      onClick={() => !isDisabled && onSelectDate(dayObj.dateStr)}
                    >
                      {dayObj.day}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
