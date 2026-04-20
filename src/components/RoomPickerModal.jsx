import { useState, useEffect } from 'react';
import { doDateRangesOverlap } from '../utils';

export default function RoomPickerModal({ 
  isOpen, 
  onClose, 
  rooms, 
  selectedRoomIds, 
  onSave, 
  allBookings, 
  editingBookingId,
  checkInDate,
  checkOutDate 
}) {
  const [localIds, setLocalIds] = useState(selectedRoomIds);

  useEffect(() => {
    if (isOpen) {
      setLocalIds(selectedRoomIds);
    }
  }, [isOpen, selectedRoomIds]);

  if (!isOpen) return null;

  // Determine availability for each room
  const isRoomAvailable = (roomId) => {
    if (!checkInDate) return true; // If no check-in date, can't reliably validate, assume true or validate on save
    
    // Default check-out to next day if not provided
    let effectiveCheckOut = checkOutDate;
    if (!effectiveCheckOut) {
      const d = new Date(checkInDate);
      d.setDate(d.getDate() + 1);
      effectiveCheckOut = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    const hasConflict = allBookings.some(b => 
      b.id !== editingBookingId &&
      b.roomIds.includes(roomId) &&
      doDateRangesOverlap(checkInDate, effectiveCheckOut, b.checkInDate, b.checkOutDate)
    );

    return !hasConflict;
  };

  const toggleRoom = (roomId, isAvailable) => {
    if (!isAvailable) {
      alert("ห้องนี้ไม่ว่างในช่วงเวลาที่เลือก");
      return;
    }
    
    if (localIds.includes(roomId)) {
      setLocalIds(localIds.filter(id => id !== roomId));
    } else {
      setLocalIds([...localIds, roomId]);
    }
  };

  const handleSave = () => {
    if (localIds.length === 0) {
      alert("กรุณาเลือกอย่างน้อย 1 ห้อง");
      return;
    }
    onSave(localIds);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="header modal-header">
          <button onClick={onClose}>&times;</button>
          <h1>เลือกห้องพัก</h1>
        </div>
        
        <div className="content modal-scroll">
          <div className="room-grid">
            {rooms.map(room => {
              const available = isRoomAvailable(room.id);
              const isSelected = localIds.includes(room.id);
              const statusClass = available ? 'available' : 'booked';
              const selectedClass = isSelected ? 'selected' : '';
              
              return (
                <div 
                  key={room.id}
                  className={`room-card ${statusClass} ${selectedClass}`}
                  onClick={() => toggleRoom(room.id, available)}
                  style={{ opacity: available ? 1 : 0.5 }}
                >
                  {room.name}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bottom-bar" style={{ justifyContent: 'center', background: 'var(--color-bg)', padding: '15px' }}>
          <button className="btn" style={{ width: '150px', border: '2px solid var(--color-text)', background: 'transparent' }} onClick={handleSave}>
            ตกลง
          </button>
        </div>
      </div>
    </div>
  );
}
