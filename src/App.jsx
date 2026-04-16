import { useState, useEffect } from 'react';
import CalendarScreen from './components/CalendarScreen';
import DateDetailScreen from './components/DateDetailScreen';
import BookingFormScreen from './components/BookingFormScreen';
import SuccessScreen from './components/SuccessScreen';
import { rooms as initialRooms } from './data/mockData';
import { bookingService } from './services/bookingService';

export default function App() {
  const [rooms] = useState(initialRooms);
  const [bookings, setBookings] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [screen, setScreen] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRoomIds, setSelectedRoomIds] = useState([]);
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [lastSavedBooking, setLastSavedBooking] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await bookingService.fetchBookings();
        setBookings(data);
      } catch (err) {
        console.error(err);
        setError("ไม่สามารถโหลดข้อมูลการจองได้ (Failed to load bookings).");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const navigateToDateDetail = (dateStr) => {
    setSelectedDate(dateStr);
    setScreen('dateDetail');
  };

  const navigateToBookingFormForNew = (roomIds) => {
    setSelectedRoomIds(roomIds);
    setEditingBookingId(null);
    setScreen('bookingForm');
  };

  const navigateToBookingFormForEdit = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      setEditingBookingId(bookingId);
      setSelectedRoomIds(booking.roomIds);
      setScreen('bookingForm');
    }
  };

  const handleSaveBooking = async (bookingData) => {
    try {
      setIsLoading(true); // Can also overlay a spinner on save
      let savedRecord;
      if (editingBookingId) {
        savedRecord = await bookingService.updateBooking(bookingData.id, bookingData);
        setBookings(bookings.map(b => b.id === savedRecord.id ? savedRecord : b));
      } else {
        savedRecord = await bookingService.createBooking(bookingData);
        setBookings([...bookings, savedRecord]);
      }
      setLastSavedBooking(savedRecord);
      setScreen('success');
    } catch (err) {
      alert(err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToCalendar = () => {
    setScreen('calendar');
    setSelectedDate(null);
    setSelectedRoomIds([]);
    setEditingBookingId(null);
    setLastSavedBooking(null);
  };

  if (isLoading && screen === 'calendar') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <h2>กำลังโหลดข้อมูล...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', color: 'red' }}>
        <h2>{error}</h2>
        <button className="btn" style={{marginTop: '20px', maxWidth: '200px'}} onClick={() => window.location.reload()}>ลองใหม่</button>
      </div>
    );
  }

  return (
    <>
      {isLoading && screen !== 'calendar' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.7)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <h4>กำลังบันทึกข้อมูล...</h4>
        </div>
      )}

      {screen === 'calendar' && (
        <CalendarScreen 
          rooms={rooms} 
          bookings={bookings} 
          onSelectDate={navigateToDateDetail} 
        />
      )}
      
      {screen === 'dateDetail' && selectedDate && (
        <DateDetailScreen 
          dateStr={selectedDate}
          rooms={rooms}
          bookings={bookings}
          onBack={navigateToCalendar}
          onEditBooking={navigateToBookingFormForEdit}
          onNextToBooking={navigateToBookingFormForNew}
        />
      )}

      {screen === 'bookingForm' && (
        <BookingFormScreen
          rooms={rooms}
          allBookings={bookings}
          selectedRoomIds={selectedRoomIds}
          initialData={editingBookingId ? bookings.find(b => b.id === editingBookingId) : null}
          defaultCheckIn={selectedDate}
          onBack={() => setScreen('dateDetail')}
          onSave={handleSaveBooking}
        />
      )}

      {screen === 'success' && (
        <SuccessScreen
          booking={lastSavedBooking}
          rooms={rooms}
          onHome={navigateToCalendar}
        />
      )}
    </>
  );
}
