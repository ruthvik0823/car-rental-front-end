import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchJSON, loadLocal, saveLocal } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';
import { Booking, CarBriefInfo, ClientReview, CreateFeedbackPayload, FeedbackInfo, PersonalInfo, User } from '@/types/types';

// Extend types.ts too with CreateFeedbackPayload

interface FeedbackState {
  feedbacks: FeedbackInfo[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  clientReviews: ClientReview[];
}

const initialState: FeedbackState = {
  feedbacks: [],
  status: 'idle',
  error: null,
  clientReviews: [],
};

export const fetchRecentFeedbacks = createAsyncThunk<FeedbackInfo[]>('feedback/fetchRecent', async () => {
  console.log('Fetching feedbacks...');
  const json = await fetchJSON<FeedbackInfo[]>('/data/feedbacks.json');
  const local = loadLocal<FeedbackInfo>('feedbacks');
  return [...local,...json];
});

export const updateFeedback = createAsyncThunk<
  FeedbackInfo,
  { feedbackId: string; updatedFeedbackText: string; updatedRating: string },
  { rejectValue: string }
>('feedback/updateFeedback', async (payload, { rejectWithValue }) => {
  try {
    const localFeedbacks = loadLocal<FeedbackInfo>('feedbacks') || [];
    const feedbackIndex = localFeedbacks.findIndex(f => f.feedbackId === payload.feedbackId);

    if (feedbackIndex === -1) {
      throw new Error('Feedback not found');
    }

    const updatedFeedback = {
      ...localFeedbacks[feedbackIndex],
      feedbackText: payload.updatedFeedbackText,
      rating: payload.updatedRating,
      date: new Date().toISOString().split('T')[0],
    };

    localFeedbacks[feedbackIndex] = updatedFeedback;
    saveLocal('feedbacks', localFeedbacks);

    return updatedFeedback;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});
// --- Key function ---
export const postFeedback = createAsyncThunk<
  {feedback: FeedbackInfo , clientReview : ClientReview},
  CreateFeedbackPayload,
  { rejectValue: string }
>('feedback/postFeedback', async (payload, { rejectWithValue }) => {
  try {
    const [users, cars, bookings] = await Promise.all([
      fetchJSON<PersonalInfo[]>('/data/personalInfo.json'),
      fetchJSON<CarBriefInfo[]>('/data/cars.json'),
      fetchJSON<Booking[]>('/data/bookings.json'),
    ]);
    console.log(payload)

    const user = users.find(u => u.clientId === payload.clientId);
    const car = cars.find(c => c.carId === payload.carId);
    const booking = bookings.find(b => b.bookingId === payload.bookingId);

    if (!user || !car || !booking) {
      throw new Error('Related user, car, or booking not found');
    }

    const feedback: FeedbackInfo = {
      feedbackId: uuidv4(),
      author: `${user.firstName} ${user.lastName}, ${user.city || 'Unknown'}, ${user.country || 'Unknown'}`,
      carModel: car.model,
      feedbackText: payload.feedbackText,
      carImageUrl: car.imageUrl,
      orderHistory: `#${booking.bookingNumber || booking.bookingId.slice(0, 4)} (${booking.pickupDateTime.split('T')[0]})`,
      rating: payload.rating,
      bookingId: payload.bookingId,
      date: new Date().toISOString().split('T')[0]
    };

    const clientReview : ClientReview = {
      carId : car.carId,
      author : `${user.firstName} ${user.lastName}`,
      authorImageUrl : user.imageUrl || "",
      date : feedback.date,
      rentalExperience : payload.rating,
      text : feedback.feedbackText,
    }
    // saving reviews to the local storage
    const localReviews = loadLocal<ClientReview>('clientReviews') || [];
    // if the localReview already contains the current review, remove it
    const filteredReviews = localReviews.filter(review => review.carId !== clientReview.carId);
    saveLocal('clientReviews', [...filteredReviews, clientReview]);

    const localFeedbacks = loadLocal<FeedbackInfo>('feedbacks');
    // if the localFeedbacks already contains the current feedback, remove it
    const filteredFeedbacks = localFeedbacks.filter(f => f.bookingId !== feedback.bookingId);
    saveLocal('feedbacks', [ feedback,...filteredFeedbacks]);
    return {
      feedback ,
      clientReview
    };

  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchRecentFeedbacks.pending, state => { state.status = 'loading'; state.error = null; })
      .addCase(fetchRecentFeedbacks.fulfilled, (state, action: PayloadAction<FeedbackInfo[]>) => {
        state.status = 'succeeded';
        state.feedbacks = action.payload;
      })
      .addCase(fetchRecentFeedbacks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to load feedbacks';
      })

      .addCase(postFeedback.pending, state => { state.status = 'loading'; state.error = null; })
      .addCase(postFeedback.fulfilled, (state, action: PayloadAction<{feedback : FeedbackInfo , clientReview : ClientReview}>) => {
        state.status = 'succeeded';
        state.feedbacks.push(action.payload.feedback);
        state.clientReviews.push(action.payload.clientReview);
        
      })
      .addCase(postFeedback.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message || 'Post feedback failed';
      })
      .addCase(updateFeedback.pending, state => { state.status = 'loading'; state.error = null; })
      .addCase(updateFeedback.fulfilled, (state, action: PayloadAction<FeedbackInfo>) => {
        state.status = 'succeeded';
        const index = state.feedbacks.findIndex(f => f.feedbackId === action.payload.feedbackId);
        if (index !== -1) {
          state.feedbacks[index] = action.payload;
        }
      }
    )
      .addCase(updateFeedback.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message || 'Update feedback failed';
      }
      );
  }
});

export default feedbackSlice.reducer;
