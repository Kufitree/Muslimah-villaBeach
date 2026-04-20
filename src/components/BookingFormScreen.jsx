import { useState, useMemo } from 'react';
import { getTodayDateString, isDateAvailableForRooms, getNextBookingDate, doDateRangesOverlap } from '../utils';
import DatePickerModal from './DatePickerModal';
import RoomPickerModal from './RoomPickerModal';

export default function BookingFormScreen({ rooms, allBookings, selectedRoomIds, initialData, defaultCheckIn, onBack, onSave, onDelete }) {
  const [pickerType, setPickerType] = useState(null);
  const [isRoomPickerOpen, setIsRoomPickerOpen] = useState(false);
  const [localSelectedRoomIds, setLocalSelectedRoomIds] = useState(selectedRoomIds);
  const [formData, setFormData] = useState({
    customerName: initialData?.customerName || '',
    address: initialData?.address || '',
    phone: initialData?.phone || '',
    checkInDate: initialData?.checkInDate || defaultCheckIn || '',
    checkOutDate: initialData?.checkOutDate || '',
    depositPrice: initialData?.depositPrice || '',
    roomPrice: initialData?.roomPrice || ''
  });

  const todayStr = useMemo(() => getTodayDateString(), []);
  const editingBookingId = initialData?.id || null;

  const selectedRooms = rooms.filter(r => localSelectedRoomIds.includes(r.id));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateSelect = (type, value) => {
    if (type === 'checkInDate') {
      setFormData(prev => ({
        ...prev,
        checkInDate: value,
        checkOutDate: (prev.checkOutDate && value >= prev.checkOutDate) ? '' : prev.checkOutDate
      }));
    } else {
      setFormData(prev => ({ ...prev, [type]: value }));
    }
    setPickerType(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.customerName && formData.checkInDate && formData.checkOutDate) {
      // Final conflict validation to prevent overlap boundaries
      const hasConflict = allBookings.some(b => 
        b.id !== editingBookingId &&
        b.roomIds.some(r => localSelectedRoomIds.includes(r)) &&
        doDateRangesOverlap(formData.checkInDate, formData.checkOutDate, b.checkInDate, b.checkOutDate)
      );
      
      if (hasConflict) {
        alert("ช่วงเวลาเข้าพักนี้คาบเกี่ยวกับการจองที่มีอยู่ กรุณาเลือกวันออกใหม่");
        return;
      }
      
      onSave({
        ...formData,
        roomIds: localSelectedRoomIds,
        id: editingBookingId || `b${Date.now()}`
      });
    } else {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน"); // Please fill out completely
    }
  };

  // Constrain checkOut natively based on the next booking boundary
  const getNextDayStr = (dateStr) => {
    if (!dateStr) return todayStr;
    const d = new Date(dateStr);
    d.setDate(d.getDate() + 1);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const checkOutMin = getNextDayStr(formData.checkInDate);
  const nextBookingBoundary = formData.checkInDate ? 
    getNextBookingDate(formData.checkInDate, localSelectedRoomIds, allBookings, editingBookingId) : null;

  return (
    <div>
      <div className="header">
        <button onClick={onBack}>&larr;</button>
        <h1>รายการจอง</h1>
      </div>
      <div className="content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div className="selected-tags" style={{ margin: 0 }}>
            {selectedRooms.map(r => (
              <div key={r.id} className="tag">{r.name}</div>
            ))}
          </div>
          <button 
            className="btn" 
            style={{ padding: '5px 10px', fontSize: '0.9em' }}
            onClick={() => setIsRoomPickerOpen(true)}
          >
            &#9998; แก้ไขห้อง
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ border: '2px solid var(--color-text)', borderRadius: 'var(--border-radius)', padding: '20px' }}>
          <div className="form-group">
            <label>ชื่อ :</label>
            <input 
              type="text" 
              name="customerName"
              value={formData.customerName} 
              onChange={handleChange} 
              required
            />
          </div>
          
          <div className="form-group">
            <label>ที่อยู่ :</label>
            <input 
              type="text" 
              name="address"
              value={formData.address} 
              onChange={handleChange} 
            />
          </div>
          
          <div className="form-group">
            <label>เบอร์โทร :</label>
            <input 
              type="tel" 
              name="phone"
              value={formData.phone} 
              onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label>ราคาจอง (มัดจำ) :</label>
            <input 
              type="number" 
              name="depositPrice"
              value={formData.depositPrice} 
              onChange={handleChange} 
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label>ราคาห้อง (รวม) :</label>
            <input 
              type="number" 
              name="roomPrice"
              value={formData.roomPrice} 
              onChange={handleChange} 
              placeholder="0.00"
            />
          </div>
          
          <div className="form-group">
            <label>วันเข้า :</label>
            <div 
              className="form-input-fake" 
              onClick={() => setPickerType('checkIn')}
            >
              {formData.checkInDate ? new Date(formData.checkInDate).toLocaleDateString('th-TH') : "เลือกวันที่"}
            </div>
          </div>
          
          <div className="form-group">
            <label>วันออก :</label>
            <div 
              className="form-input-fake" 
              onClick={() => {
                if (!formData.checkInDate) {
                  alert("กรุณาเลือกวันเข้าพักก่อน");
                  return;
                }
                setPickerType('checkOut');
              }}
            >
              {formData.checkOutDate ? new Date(formData.checkOutDate).toLocaleDateString('th-TH') : "เลือกวันที่"}
            </div>
          </div>
        </form>
      </div>

      <div className="bottom-bar" style={{ justifyContent: 'center', gap: '15px' }}>
        {editingBookingId && (
          <button 
            className="btn" 
            style={{ width: '150px', border: '2px solid #e74c3c', color: '#e74c3c', background: 'transparent' }} 
            onClick={() => {
              if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการจองนี้?")) {
                onDelete(editingBookingId);
              }
            }}
          >
            ยกเลิกการจอง
          </button>
        )}
        <button className="btn" style={{ width: '150px', border: '2px solid var(--color-text)', background: 'transparent' }} onClick={handleSubmit}>
          บันทึก
        </button>
      </div>
      
      <DatePickerModal 
        title="เลือกวันเข้า"
        isOpen={pickerType === 'checkIn'}
        onClose={() => setPickerType(null)}
        minDate={todayStr}
        isDateDisabled={(str) => !isDateAvailableForRooms(str, localSelectedRoomIds, allBookings, editingBookingId)}
        onSelectDate={(str) => handleDateSelect('checkInDate', str)}
      />

      <DatePickerModal 
        title="เลือกวันออก"
        isOpen={pickerType === 'checkOut'}
        onClose={() => setPickerType(null)}
        minDate={checkOutMin}
        maxDate={nextBookingBoundary || undefined}
        onSelectDate={(str) => handleDateSelect('checkOutDate', str)}
      />

      <RoomPickerModal
        isOpen={isRoomPickerOpen}
        onClose={() => setIsRoomPickerOpen(false)}
        rooms={rooms}
        selectedRoomIds={localSelectedRoomIds}
        allBookings={allBookings}
        editingBookingId={editingBookingId}
        checkInDate={formData.checkInDate}
        checkOutDate={formData.checkOutDate}
        onSave={(newIds) => {
          setLocalSelectedRoomIds(newIds);
          setIsRoomPickerOpen(false);
        }}
      />
    </div>
  );
}
