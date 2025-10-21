// src/store/slices/carsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchJSON, loadLocal, saveLocal } from '../utils/storage';
import { CarBriefInfo, CarDetails, ClientReview } from '@/types/types';

interface CarsState {
  carsList: CarBriefInfo[];
  carDetailsList: CarDetails [];
  carDetails: CarDetails;
  reviews: ClientReview[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CarsState = {
  carsList: await fetchJSON<CarBriefInfo[]>('/data/cars.json').then(cars => cars), 
  carDetails: {} as CarDetails,
  reviews: await fetchJSON<ClientReview[]>('/data/reviews.json').then(reviews => reviews),
  status: 'idle',
  error: null,
  carDetailsList: await fetchJSON<CarDetails[]>("/data/carDetails.json").then(
    (cars) => cars
  ),
};

// Fetch all cars (brief info)
export const fetchCars = createAsyncThunk<CarBriefInfo[]>('cars/fetchCars', async () => {
  const json = await fetchJSON<CarBriefInfo[]>('/data/cars.json');
  return [...json];
});

// fetch all cars with their details
export const fetchCarsDetailsList = createAsyncThunk<CarDetails[]>('cars/fetchCarsDetailsList', async () => {
  const json = await fetchJSON<CarDetails[]>('/data/carDetails.json');
  return [...json];
});

export const fetchCarDetailsList = createAsyncThunk<CarDetails[]>(
  "cars/fetchCars",
  async () => {
    const json = await fetchJSON<CarDetails[]>("/data/carDetails.json");
    const local = loadLocal<CarDetails>("carDetailsList");
    return [...json, ...local];
  }
);
// Fetch details of a specific car

export const fetchCarDetails = createAsyncThunk<CarDetails, string>('cars/fetchCarDetails', async (carId) => {
  const json = await fetchJSON<CarDetails[]>('/data/carDetails.json');
  const found = json.find(car => car.carId === carId);
  if (!found) throw new Error('Car not found');
  return found;
});

// Fetch reviews for a specific car (connect with feedbackSlice!)
export const fetchCarReviews = createAsyncThunk<ClientReview[], string>('cars/fetchCarReviews', async (carId) => {
  const allReviews = await fetchJSON<ClientReview[]>('/data/reviews.json'); // all the feedbacks for different different cars
  const localReviews = loadLocal<ClientReview>('reviews');
  if (localReviews) allReviews.push(...localReviews);
  return allReviews.filter(review => review.carId === carId);
});

const carsSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchCars.fulfilled,
        (state, action: PayloadAction<CarBriefInfo[]>) => {
          state.status = "succeeded";
          state.carsList = action.payload;
        }
      )
      .addCase(fetchCars.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch cars";
      })

      .addCase(fetchCarDetails.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchCarDetails.fulfilled,
        (state, action: PayloadAction<CarDetails>) => {
          state.status = "succeeded";
          state.carDetails = action.payload;
        }
      )
      .addCase(fetchCarDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch car details";
      })

      .addCase(fetchCarReviews.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchCarReviews.fulfilled,
        (state, action: PayloadAction<ClientReview[]>) => {
          state.status = "succeeded";
          state.reviews = action.payload;
        }
      )
      .addCase(fetchCarReviews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch reviews';
      })
      .addCase(fetchCarsDetailsList.pending, state => { state.status = 'loading'; state.error = null; })
      .addCase(fetchCarsDetailsList.fulfilled, (state, action: PayloadAction<CarDetails[]>) => {
        state.status = 'succeeded';
        state.carDetailsList = action.payload;
      })
      .addCase(fetchCarsDetailsList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch car details list';
      });

     
  }
});

export default carsSlice.reducer;
