export default function SuccessScreen({ booking, rooms, onHome }) {
  if (!booking) return null;

  const selectedRooms = rooms.filter(r => booking.roomIds.includes(r.id));
  
  // Format dates 12/01/26 
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '/');
  };

  return (
    <div>
      <div className="content success-container">
        <div className="success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h2 className="success-title">จองสำเร็จ</h2>
        
        <div className="selected-tags">
          {selectedRooms.map(r => (
            <div key={r.id} className="tag">{r.name}</div>
          ))}
        </div>

        <div className="summary-box" style={{ border: '2px solid var(--color-text)' }}>
          <div className="summary-row">
            <span className="summary-label">ชื่อ :</span>
            <span className="summary-value">{booking.customerName}</span>
          </div>
          {booking.address && (
             <div className="summary-row">
              <span className="summary-label">ที่อยู่ :</span>
              <span className="summary-value">{booking.address}</span>
            </div>
          )}
          {booking.phone && (
            <div className="summary-row">
              <span className="summary-label">เบอร์โทร :</span>
              <span className="summary-value">{booking.phone}</span>
            </div>
          )}
          {booking.roomPrice && (
            <div className="summary-row">
              <span className="summary-label">ราคาห้อง :</span>
              <span className="summary-value">฿{Number(booking.roomPrice).toLocaleString()}</span>
            </div>
          )}
          {booking.depositPrice && (
            <div className="summary-row">
              <span className="summary-label">มัดจำ :</span>
              <span className="summary-value">฿{Number(booking.depositPrice).toLocaleString()}</span>
            </div>
          )}
          <div className="summary-row">
            <span className="summary-label">วันเข้า :</span>
            <span className="summary-value">{formatDate(booking.checkInDate)}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">วันออก :</span>
            <span className="summary-value">{formatDate(booking.checkOutDate)}</span>
          </div>
        </div>
      </div>

      <div className="bottom-bar" style={{ justifyContent: 'center' }}>
        <button className="btn" style={{ width: '150px', border: '2px solid var(--color-text)', borderRadius: '30px' }} onClick={onHome}>
          กลับหน้าหลัก
        </button>
      </div>
    </div>
  );
}
