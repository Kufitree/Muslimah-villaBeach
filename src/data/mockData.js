export const rooms = [
  { id: '1', name: '1', type: 'standard' },
  { id: '2', name: '2', type: 'standard' },
  { id: '3', name: '3', type: 'standard' },
  { id: '4', name: 'ใหญ่', type: 'large' },
  { id: '5', name: 'กระจก', type: 'glass' },
  { id: '6', name: 'ดาดฟ้า', type: 'sky' },
  { id: '7', name: 'แฝด', type: 'twin' },
  { id: '8', name: 'ใหม่', type: 'new' }
];

export const initialBookings = [
  {
    id: 'b1',
    customerName: 'คุณสมชาย',
    address: 'กรุงเทพฯ',
    phone: '0812345678',
    checkInDate: '2026-04-15',
    checkOutDate: '2026-04-16',
    roomIds: ['4', '5'], // ใหญ่, กระจก
    depositPrice: 500,
    roomPrice: 2500
  },
  {
    id: 'b2',
    customerName: 'คุณอุมาพร',
    address: 'เชียงใหม่',
    phone: '0898765432',
    checkInDate: '2026-04-20',
    checkOutDate: '2026-04-21',
    roomIds: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], // Fully booked
    depositPrice: 2000,
    roomPrice: 15000
  }

];
