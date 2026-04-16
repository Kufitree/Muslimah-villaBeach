import { useState, useMemo } from 'react';
import { generateCalendarMonths, getBookedRoomIdsForDate, getTodayDateString } from '../utils';

export default function CalendarScreen({ rooms, bookings, onSelectDate }) {
  const [months] = useState(() => {
    // Current date April 2026 for testing, based on initial bookings
    return generateCalendarMonths(new Date(2026, 3, 1), 6); // April is index 3
  });

  const todayStr = useMemo(() => getTodayDateString(), []);

  const getDayStatus = (dateStr) => {
    const bookedIds = getBookedRoomIdsForDate(dateStr, bookings);
    if (bookedIds.length === rooms.length && rooms.length > 0) {
      return 'booked'; // everything booked (red)
    }
    if (bookedIds.length < rooms.length || rooms.length === 0) {
      return 'available'; // at least 1 room available
    }
    return 'available';
  };

  return (
    <div>
      <div className="header">
        <h1>ปฏิทินที่พัก</h1>
      </div>
      <div className="content">
        {months.map((m, idx) => (
          <div key={`${m.year}-${m.month}`} className="month-block">
            <h2 className="month-title">{m.monthName} {m.year + 543}</h2>
            
            <div className="calendar-grid">
              {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map(d => (
                <div key={d} className="day-header">{d}</div>
              ))}
              
              {m.days.map((dayObj, dIdx) => {
                if (!dayObj) return <div key={`empty-${dIdx}`} className="date-cell empty" />;
                
                const status = getDayStatus(dayObj.dateStr);
                const isToday = dayObj.dateStr === todayStr;
                return (
                  <div 
                    key={dayObj.dateStr}
                    className={`date-cell ${status} ${isToday ? 'is-today' : ''}`}
                    onClick={() => onSelectDate(dayObj.dateStr)}
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
  );
}
