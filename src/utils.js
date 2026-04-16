export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export function getTodayDateString() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

export function generateCalendarMonths(startDate, count) {
  let months = [];
  let currentYear = startDate.getFullYear();
  let currentMonth = startDate.getMonth();

  for (let i = 0; i < count; i++) {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday
    
    let days = [];
    // padding for first row
    for(let w = 0; w < firstDay; w++) {
      days.push(null);
    }
    
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ day: d, dateStr: dateStr });
    }
    
    const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    months.push({
      year: currentYear,
      month: currentMonth,
      monthName: monthNames[currentMonth],
      days: days
    });

    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
  }
  return months;
}

// Check if a date falls inside a booking range (inclusive)
export function isDateInBooking(dateStr, booking) {
  return dateStr >= booking.checkInDate && dateStr < booking.checkOutDate; 
  // typical booking: checkout date morning = not booked for that night
}

export function getBookedRoomIdsForDate(dateStr, bookings) {
  let bookedIds = new Set();
  bookings.forEach(b => {
    if (isDateInBooking(dateStr, b)) {
      b.roomIds.forEach(id => bookedIds.add(id));
    }
  });
  return Array.from(bookedIds);
}

// True if [start1, end1) and [start2, end2) overlap
export function doDateRangesOverlap(start1, end1, start2, end2) {
  return start1 < end2 && end1 > start2;
}

// Checks if a specific check-in date falls into any existing booking for the selected rooms
// Note: We ignore the currently editing booking ID
export function isDateAvailableForRooms(checkInStr, roomIds, allBookings, editingBookingId = null) {
  const relevantBookings = allBookings.filter(b => b.id !== editingBookingId && b.roomIds.some(r => roomIds.includes(r)));
  
  for (const b of relevantBookings) {
    if (checkInStr >= b.checkInDate && checkInStr < b.checkOutDate) {
      return false; // date falls inside an existing booking
    }
  }
  return true;
}

// Gets the start date of the VERY NEXT booking that happens strictly AFTER the checkInStr for the given rooms.
// This forms the absolute maximum limit for a check-out date.
export function getNextBookingDate(checkInStr, roomIds, allBookings, editingBookingId = null) {
  const relevantBookings = allBookings.filter(b => b.id !== editingBookingId && b.roomIds.some(r => roomIds.includes(r)));
  
  // Find all bookings that start AFTER the requested checkInStr
  const futureBookings = relevantBookings.filter(b => b.checkInDate > checkInStr);
  
  if (futureBookings.length === 0) return null;
  
  // Sort to find the earliest upcoming check-in date
  futureBookings.sort((a, b) => a.checkInDate.localeCompare(b.checkInDate));
  return futureBookings[0].checkInDate;
}
