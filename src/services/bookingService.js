import { supabase } from '../lib/supabase';
import { rooms } from '../data/mockData';

const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL || ''; // URL สำหรับส่ง Webhook (เช่น Zapier, Make)

async function notifyWebhook(action, data) {
  if (!WEBHOOK_URL) return;

  // แปลง roomIds เป็นชื่อห้อง
  let payloadData = { ...data };
  if (payloadData.roomIds) {
    payloadData.roomNames = payloadData.roomIds.map(id => {
      const room = rooms.find(r => r.id === id);
      return room ? `ห้อง${room.name}` : `ห้อง ${id}`;
    });
  }

  try {
    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action, // 'created', 'updated', 'deleted'
        timestamp: new Date().toISOString(),
        data: payloadData
      })
    }).catch(err => console.error('Webhook payload failed to send:', err));
  } catch (err) {
    console.error('Webhook error:', err);
  }
}

// Map Supabase snake_case to React camelCase
const mapToFrontend = (dbRecord) => {
  return {
    id: dbRecord.id,
    customerName: dbRecord.customer_name,
    address: dbRecord.address,
    phone: dbRecord.phone,
    checkInDate: dbRecord.check_in_date,
    checkOutDate: dbRecord.check_out_date,
    roomIds: dbRecord.room_ids,
    depositPrice: Number(dbRecord.deposit_price),
    roomPrice: Number(dbRecord.room_price)
  };
};

// Map React camelCase to Supabase snake_case
const mapToDatabase = (frontendRecord) => {
  return {
    customer_name: frontendRecord.customerName,
    address: frontendRecord.address || null,
    phone: frontendRecord.phone || null,
    check_in_date: frontendRecord.checkInDate,
    check_out_date: frontendRecord.checkOutDate,
    room_ids: frontendRecord.roomIds,
    deposit_price: frontendRecord.depositPrice ? Number(frontendRecord.depositPrice) : 0,
    room_price: frontendRecord.roomPrice ? Number(frontendRecord.roomPrice) : 0
  };
};

export const bookingService = {
  async fetchBookings() {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('check_in_date', { ascending: true });

    if (error) {
      console.error("Error fetching bookings:", error);
      throw new Error("Unable to fetch bookings.");
    }

    return data.map(mapToFrontend);
  },

  async createBooking(bookingData) {
    const payload = mapToDatabase(bookingData);

    const { data, error } = await supabase
      .from('bookings')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("Error creating booking:", error);
      throw new Error(`Failed to create booking. ${error.message}`);
    }

    const frontendData = mapToFrontend(data);
    notifyWebhook('created', frontendData);

    return frontendData;
  },

  async updateBooking(id, bookingData) {
    const payload = mapToDatabase(bookingData);

    const { data, error } = await supabase
      .from('bookings')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating booking:", error);
      throw new Error(`Failed to update booking. ${error.message}`);
    }

    const frontendData = mapToFrontend(data);
    notifyWebhook('updated', frontendData);

    return frontendData;
  },

  async deleteBooking(id) {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting booking:", error);
      throw new Error(`Failed to delete booking. ${error.message}`);
    }

    notifyWebhook('deleted', { id });

    return true;
  }
};
