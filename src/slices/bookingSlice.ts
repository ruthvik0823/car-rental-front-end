// src/store/slices/bookingSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchJSON, loadLocal, saveLocal } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';
import { Booking, BookingFormData, Car, MyBooking, User } from '@/types/types';

interface BookingState {
  bookings: Booking[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  currentUserBookings: MyBooking[];
  bookingMessage: string ;
}


const initialState: BookingState = {
  bookings: [],
  currentUserBookings: [],
  status: 'idle',
  error: null,
  bookingMessage : "",
};

type BookingResponse = {
    message : string,
    currentUserBookings : MyBooking,
    booking : Booking,
}

// Fetch all bookings (from bookings.json + localStorage)
export const fetchBookings = createAsyncThunk<Booking[]>('bookings/fetchBookings', async () => {
  const json = await fetchJSON<Booking[]>('/data/bookings.json');
  const local = loadLocal<Booking>('bookings');
  return [...json, ...local];
});

// Fetch current user's bookings
// export const fetchCurrentUserBookings = createAsyncThunk<
//   MyBooking[],
//   string,
//   { rejectValue: string }
// >(
//   'bookings/fetchCurrentUserBookings',
//   async (userId, { rejectWithValue }) => {
//     try {
//       const json  = await fetchJSON<Booking[]>('/data/bookings.json');
//       const local = loadLocal<Booking>('bookings') || [];
//       const all   = [...json, ...local];


//       // filter & map in one pass
//       return all
//         .filter(b => b?.clientId === userId)
//         .map(b => ({
//           bookingId:     b.bookingId,
//           bookingStatus: b.bookingStatus as MyBooking['bookingStatus'],
//           carImageUrl:   b.carImageUrl  || '',
//           carModel:      b.carModel,
//           orderDetails:  `#${b.bookingNumber} (${b.date})`,
//         }));
//     } catch (err: any) {
//       console.log(err)
//       return rejectWithValue(err.message);
//     }
//   }
// );

export const fetchCurrentUserBookings = createAsyncThunk<MyBooking[], string,{ rejectValue : string }>('bookings/fetchCurrentUserBookings', async(userId,{rejectWithValue}) => {
  try {
      const json = await fetchJSON<Booking[]>('/data/bookings.json');
      const local = loadLocal<Booking>('bookings');
      const currentUserBookings = loadLocal<MyBooking[]>('currentUserBookings') || [];
      const allBookings = [...json, ...local];
      const userBookings = allBookings.filter(booking => booking.clientId === userId);
      const myBookings: MyBooking[] = userBookings.map(booking => ({
          bookingId: booking.bookingId,
          bookingStatus: booking.bookingStatus as "RESERVED" | "SERVICE_STARTED" | "SERVICE_PROVIDED" | "BOOKING_FINISHED" | "CANCELLED",
          carImageUrl: booking.carImageUrl || '',
          carModel: booking.carModel,
          orderDetails: `#${booking.bookingNumber} (${booking.date})`,
      }));
      //return [...myBookings, ...currentUserBookings] as MyBooking[];
      const merged = [...myBookings, ...currentUserBookings] as MyBooking[];

      const uniqueMyBookings = Array.from(
        new Map(merged.map(b => [b.bookingId, b])).values()
      );
      return uniqueMyBookings;
  } catch (err: any) {
      return rejectWithValue(err.message);
  }
});

// Update an existing booking
export const updateBooking = createAsyncThunk<
  BookingResponse,
  { bookingId: string; updatedData: BookingFormData },
  { rejectValue: string }
>('bookings/updateBooking', async ({ bookingId, updatedData }, { rejectWithValue }) => {
  try {
    const bookingsFromJson = await fetchJSON<Booking[]>('/data/bookings.json');
    const localBookings = loadLocal<Booking>('bookings') || [];

    

    // Find and update the booking
    const bookingIndex2 = localBookings.findIndex(b => b.bookingId === bookingId);
    const bookingIndex = bookingsFromJson.findIndex(b => b.bookingId === bookingId);
    let bookingToUpdate: Booking;
    if (bookingIndex !== -1) {
      bookingToUpdate = bookingsFromJson[bookingIndex];
    }
    else if( bookingIndex2 !==-1){
      bookingToUpdate = localBookings[bookingIndex2];
    }
    else{
      return rejectWithValue('Booking not found');
    }
    


    const updatedBooking: Booking = {
      ...bookingToUpdate,
      ...updatedData,
      bookingPeriod: `${new Date(updatedData.pickupDateTime || bookingToUpdate.pickupDateTime).toLocaleDateString()} - ${new Date(updatedData.dropOffDateTime || bookingToUpdate.dropOffDateTime).toLocaleDateString()}`,
    };

    const updatedBookings = localBookings.map(b =>
      b.bookingId === bookingId ? updatedBooking : b
    );

    // ✅ Save cleanly only the updated bookings
    saveLocal('bookings', updatedBookings);

    // Prepare myBooking for frontend
    const myBooking: MyBooking = {
      bookingId: updatedBooking.bookingId,
      bookingStatus: updatedBooking.bookingStatus as MyBooking['bookingStatus'],
      carImageUrl: updatedBooking.carImageUrl || '',
      carModel: updatedBooking.carModel,
      orderDetails: `#${updatedBooking.bookingNumber} (${updatedBooking.date})`,
    };

    return {
      message: `Booking successfully updated.\n${updatedBooking.carModel} booked under ${updatedBooking.bookingNumber}.\nChange allowed until ${updatedBooking.pickupDateTime}.\nOrder period: ${updatedBooking.bookingPeriod}`,
      currentUserBookings: myBooking,
      booking: updatedBooking,
    };
    
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to update booking');
  }
});
// Create a new booking
export const createBooking = createAsyncThunk<
  BookingResponse,
  BookingFormData,
  { rejectValue: string }
>('bookings/createBooking', async (formData, { rejectWithValue }) => {
  try {
    // Load existing bookings
    const localBookings = loadLocal<Booking>('bookings') || [];

    // Load cars and users
    const cars = await fetchJSON<Car[]>('/data/cars.json');
    const car = cars.find(c => c.carId === formData.carId);
    if (!car) return rejectWithValue('Car not found');

    const usersFromJSON = await fetchJSON<User[]>('/data/users.json');
    const localUsers = loadLocal<User>('users') || [];
    const allUsers = [...usersFromJSON, ...localUsers];

    const user = allUsers.find(u => u.userId === formData.clientId);
    if (!user) return rejectWithValue('User not found');

    // Build new booking
    const now = new Date();
    const newBooking: Booking = {
      ...formData,
      bookingId: uuidv4(),
      bookingNumber: `#${Math.floor(1000 + Math.random() * 9000)}`,
      bookingStatus: 'RESERVED',
      bookingPeriod: `${new Date(formData.pickupDateTime).toLocaleDateString()} - ${new Date(formData.dropOffDateTime).toLocaleDateString()}`,
      carModel: car.model,
      clientName: `${user.firstName} ${user.lastName}`,
      location: car.location,
      madeBy: user.role,
      carImageUrl: car.imageUrl,
      date: now.toLocaleDateString(),
    };

    // Save updated bookings locally
    saveLocal('bookings', [...localBookings, newBooking]);

    // Build current user's booking
    const myBooking: MyBooking = {
      bookingId: newBooking.bookingId,
      bookingStatus: newBooking.bookingStatus as MyBooking['bookingStatus'],
      carImageUrl: newBooking.carImageUrl || '',
      carModel: newBooking.carModel,
      orderDetails: `${newBooking.bookingNumber} (${newBooking.date})`,
    };

    return {
      message: `New booking created.\n${newBooking.carModel} reserved under ${newBooking.bookingNumber}.\nOrder dates: ${newBooking.bookingPeriod}`,
      currentUserBookings: myBooking,
      booking: newBooking,
    };
    
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to create booking');
  }
});

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    cancelBooking: (state, action: PayloadAction<string>) => {
      const id = action.payload;
  
      // 1) update master list
      state.bookings = state.bookings.map(b =>
        b.bookingId === id ? { ...b, bookingStatus: 'CANCELLED' } : b
      );
  
      // 2) update the user’s view
      state.currentUserBookings = state.currentUserBookings.map(b =>
        b.bookingId === id ? { ...b, bookingStatus: 'CANCELLED' } : b
      );
  
      // 3) persist master bookings only
      saveLocal('bookings', state.bookings);
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchBookings.pending, state => { state.status = 'loading'; state.error = null; })
      .addCase(fetchBookings.fulfilled, (state, action: PayloadAction<Booking[]>) => {
        state.status = 'succeeded';
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch bookings';
      })

      .addCase(fetchCurrentUserBookings.pending, state => { state.status = 'loading'; state.error = null; })
      .addCase(fetchCurrentUserBookings.fulfilled, (state, action: PayloadAction<MyBooking[]>) => {
        state.status = 'succeeded';
        state.currentUserBookings = action.payload;
      })
      .addCase(createBooking.pending, state => { state.status = 'loading'; state.error = null; })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bookingMessage = action.payload.message;
      
        // 🛠️ Update or Insert the booking (idempotent)
        const existingBookingIndex = state.bookings.findIndex(
          (b) => b.bookingId === action.payload.booking.bookingId
        );
        if (existingBookingIndex !== -1) {
          state.bookings[existingBookingIndex] = action.payload.booking;
        } else {
          state.bookings.push(action.payload.booking);
        }
      
        // 🛠️ Update or Insert user's booking (idempotent)
        const existingMyBookingIndex = state.currentUserBookings.findIndex(
          (b) => b.bookingId === action.payload.currentUserBookings.bookingId
        );
        if (existingMyBookingIndex !== -1) {
          state.currentUserBookings[existingMyBookingIndex] = action.payload.currentUserBookings;
        } else {
          state.currentUserBookings.push(action.payload.currentUserBookings);
        }
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message || 'Failed to create booking';
      })
      .addCase(updateBooking.pending, state => { state.status = 'loading'; state.error = null; })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bookingMessage = action.payload.message;
      
        // Update booking in bookings array
        const bookingIndex = state.bookings.findIndex(
          (b) => b.bookingId === action.payload.booking.bookingId
        );
        if (bookingIndex !== -1) {
          state.bookings[bookingIndex] = action.payload.booking;
        }
        // ❌ Do not push new booking if not found. Updating only.
      
        // Update booking in currentUserBookings array
        const myBookingIndex = state.currentUserBookings.findIndex(
          (b) => b.bookingId === action.payload.currentUserBookings?.bookingId
        );
        if (myBookingIndex !== -1) {
          state.currentUserBookings[myBookingIndex] = action.payload.currentUserBookings!;
        }
        // ❌ Again, no push, only update.
      })
      .addCase(updateBooking.rejected, (state) => {
        state.status = 'failed';
        state.error =  'Failed to update booking';
      });
  }
});

export default bookingSlice.reducer;
export const { cancelBooking } = bookingSlice.actions;