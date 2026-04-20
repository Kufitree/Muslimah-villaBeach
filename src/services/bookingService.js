import { supabase } from '../lib/supabase';

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

    return mapToFrontend(data);
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

    return mapToFrontend(data);
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
    
    return true;
  }
};
