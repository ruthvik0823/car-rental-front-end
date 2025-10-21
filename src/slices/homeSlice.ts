import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchJSON } from '../utils/storage';
import { AboutUsStoryInfo, Car, FAQStory, HomepageState, LocationInfo } from '@/types/types';


const initialAboutUs: AboutUsStoryInfo[] = await fetchJSON<AboutUsStoryInfo[]>('/data/aboutUs.json');
const initialFAQ: FAQStory[] = await fetchJSON<FAQStory[]>('/data/faqs.json');
const initialLocations: LocationInfo[] = await fetchJSON<LocationInfo[]>('/data/locations.json');
const initialPopularCars: Car[] = await fetchJSON<Car[]>('/data/popularCars.json');
const initialState: HomepageState = {
  aboutUs: initialAboutUs,
  faq: initialFAQ,
  locations: initialLocations,
  status: 'idle',
  error: null,
  popularCars: initialPopularCars,

};

export const fetchAboutUs = createAsyncThunk<AboutUsStoryInfo[]>('homepage/fetchAboutUs', async () => {
  return await fetchJSON<AboutUsStoryInfo[]>('/data/aboutUs.json');
});

export const fetchFAQ = createAsyncThunk<FAQStory[]>('homepage/fetchFAQ', async () => {
  return await fetchJSON<FAQStory[]>('/data/faqs.json');
});

export const fetchLocations = createAsyncThunk<LocationInfo[]>('homepage/fetchLocations', async () => {
  return await fetchJSON<LocationInfo[]>('/data/locations.json');
});

export const fetchPopularCars = createAsyncThunk('homepage/fetchPopularCars', async () => {
    return await fetchJSON<Car[]>('/data/popularCars.json');
  });
  

const homepageSlice = createSlice({
  name: 'homepage',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAboutUs.pending, state => { state.status = 'loading'; state.error = null; })
      .addCase(fetchAboutUs.fulfilled, (state, action: PayloadAction<AboutUsStoryInfo[]>) => {
        state.status = 'succeeded';
        state.aboutUs = action.payload;
      })
      .addCase(fetchAboutUs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to load About Us';
      })

      .addCase(fetchFAQ.pending, state => { state.status = 'loading'; state.error = null; })
      .addCase(fetchFAQ.fulfilled, (state, action: PayloadAction<FAQStory[]>) => {
        state.status = 'succeeded';
        state.faq = action.payload;
      })
      .addCase(fetchFAQ.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to load FAQ';
      })

      .addCase(fetchLocations.pending, state => { state.status = 'loading'; state.error = null; })
      .addCase(fetchLocations.fulfilled, (state, action: PayloadAction<LocationInfo[]>) => {
        state.status = 'succeeded';
        state.locations = action.payload;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to load locations';
      })
      .addCase(fetchPopularCars.pending, state => { state.status = 'loading'; state.error = null; })
      .addCase(fetchPopularCars.fulfilled, (state, action: PayloadAction<Car[]>) => {
        state.status = 'succeeded';
        state.popularCars = action.payload;
      })
      .addCase(fetchPopularCars.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to load popular cars';
      });
  }
});

export default homepageSlice.reducer;
