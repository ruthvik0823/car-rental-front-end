import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import CreateAccount from "./pages/CreateAccount";
import Login from "./pages/Login";
import ProfileLayout from "./pages/profile/ProfileLayout";
import PersonalInfoForm from "./pages/profile/PersonalInfoForm";
import DocumentsForm from "./pages/profile/DocumentsForm";
import ChangePasswordForm from "./pages/profile/ChangePasswordForm";
import CarBooking from "./pages/CarBooking";

import MyBookings from "./pages/MyBookings";
import MainPage from "./pages/MainPage";
import CarsPage from "./pages/CarsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";
import { fetchUserDetails } from "./slices/userSlice";
import { useAppDispatch, useAppSelector } from "./hooks/reduxStoreHooks";
import Bookings from "./pages/Bookings";
import { fetchRecentFeedbacks } from "./slices/feedbackSlice";
import { fetchBookings } from "./slices/bookingSlice";
import SAProtectedRoute from "./components/SAProtectedRoute";

function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const initializeApp = async () => {
      if (user) {
        await dispatch(fetchUserDetails(user.userId));
      }
    };
    initializeApp();
  }, [dispatch]);

  useEffect(() => {
    const fetchAllFeedbacks = async () => {
      await dispatch(fetchRecentFeedbacks());
    };
    fetchAllFeedbacks();
  }, [dispatch]);

  // fetch all bookings for redux
  useEffect(() => {
    const fetchAllBookings = async () => {
      await dispatch(fetchBookings());
    };
    fetchAllBookings();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          {/* Define all of your routes here which has  common layout like Header and Footer */}
          <Route
            path="/"
            element={
              user?.role === "SUPPORT_AGENT" ? (
                <Navigate to="/bookings" />
              ) : (
                <MainPage />
              )
            }
          />
          <Route path="/cars" element={<CarsPage />}>
            <Route path=":carId" element={null} />
          </Route>
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CarBooking />
              </ProtectedRoute>
            }
          />
          {/* here need to add car details modal */}
          <Route
            path="/my-profile"
            element={
              <ProtectedRoute>
                <ProfileLayout />
              </ProtectedRoute>
            }
          >
            <Route path="" element={<Navigate to="personal-info" replace />} />
            <Route path="personal-info" element={<PersonalInfoForm />} />
            <Route path="documents" element={<DocumentsForm />} />
            <Route path="change-password" element={<ChangePasswordForm />} />
          </Route>
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bookings"
            element={
              <SAProtectedRoute>
                <Bookings />
              </SAProtectedRoute>
            }
          />
          <Route
            path="/clients"
            element={
              <SAProtectedRoute>
                <h1>Support Agent Clients Page</h1>
              </SAProtectedRoute>
            }
          />
        </Route>

        {/* Login and Registration routes will be here */}
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
