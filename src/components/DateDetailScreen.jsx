import { useState } from 'react';
import { isDateInBooking } from '../utils';

export default function DateDetailScreen({ dateStr, rooms, bookings, onBack, onEditBooking, onNextToBooking }) {
  const [selectedIds, setSelectedIds] = useState([]);

  const roomsWithStatus = rooms.map(room => {
    const booking = bookings.find(b => isDateInBooking(dateStr, b) && b.roomIds.includes(room.id));
    return {
      ...room,
      isBooked: !!booking,
      bookingId: booking ? booking.id : null
    };
  });

  // Create Thai format "16 เมษายน 2569"
  const dateObj = new Date(dateStr);
  const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
  const formattedDate = `${dateObj.getDate()} ${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear() + 543}`;

  const toggleRoom = (room) => {
    if (selectedIds.includes(room.id)) {
      setSelectedIds(selectedIds.filter(id => id !== room.id));
    } else {
      setSelectedIds([...selectedIds, room.id]);
    }
  };

  const selectedRoomsData = roomsWithStatus.filter(r => selectedIds.includes(r.id));
  const hasAvailable = selectedRoomsData.some(r => !r.isBooked);
  const hasBooked = selectedRoomsData.some(r => r.isBooked);
  const uniqueBookingIds = new Set(selectedRoomsData.filter(r => r.isBooked).map(r => r.bookingId));
  
  const canNext = selectedIds.length > 0 && hasAvailable && !hasBooked;
  const canEdit = selectedIds.length > 0 && hasBooked && !hasAvailable && uniqueBookingIds.size === 1;

  const handleEdit = () => {
    if (canEdit) {
      const bId = Array.from(uniqueBookingIds)[0];
      onEditBooking(bId);
    }
  };

  return (
    <div>
      <div className="header">
        <button onClick={onBack}>&larr;</button>
        <h1>{formattedDate}</h1>
      </div>
      <div className="content">


        <div className="room-grid">
          {roomsWithStatus.map(room => {
            const isSelected = selectedIds.includes(room.id);
            const statusClass = room.isBooked ? 'booked' : 'available';
            const selectedClass = isSelected ? 'selected' : '';
            return (
              <div 
                key={room.id}
                className={`room-card ${statusClass} ${selectedClass}`}
                onClick={() => toggleRoom(room)}
              >
                {room.name}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="bottom-bar">
        {canEdit && (
          <button className="btn" style={{flex: 1, border: '2px solid var(--color-text)'}} onClick={handleEdit}>
            แก้ไข
          </button>
        )}
        {(canNext || (!canNext && !canEdit)) && (
          <button 
            className="btn btn-primary" 
            style={{flex: 1, opacity: canNext ? 1 : 0.5}} 
            onClick={() => canNext && onNextToBooking(selectedIds)}
            disabled={!canNext}
          >
            ถัดไป
          </button>
        )}
      </div>
    </div>
  );
}
