import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../slices/userSlice";
import authReducer from "../slices/authSlice";
import carsReducer from "../slices/carSlice";
import bookingReducer from "../slices/bookingSlice";
import homePageReducer from "../slices/homeSlice";
import feedbackReducer from "../slices/feedbackSlice";

const store = configureStore({
  reducer: {
    users: usersReducer,
    auth: authReducer,
    cars: carsReducer,
    bookings: bookingReducer,
    homepage: homePageReducer,
    feedback: feedbackReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: true,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;