
// for user slice

export interface User {
    userId: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'CLIENT' | 'SUPPORT_AGENT' | 'ADMIN';
  }

  export interface PersonalInfo extends Omit<User, 'password' | 'userId'> {
    imageUrl: string | undefined;
    phone: string;
    clientId : User['userId'];
    city: string;
    country: string;
    postalCode: string;
    street : string;
  }

  export interface ChangePasswordResponse{
    idToken: string;
    role: 'CLIENT' | 'SUPPORT_AGENT' | 'ADMIN';
    userId: string;
    userImageUrl: string | undefined;
    username: string;
  }

  export interface ChangePasswordPayload {
    userId: string;
    oldPassword: string;
    newPassword: string;
  }


  // for auth slice
  


  export interface AuthState {
    user: Omit<User, 'password'> | null;
    token: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  }
  


export interface Booking {
    carId: string;
    clientId: string;
    dropOffDateTime: string; // ISO 8601 format
    dropOffLocationId: string;
    pickupDateTime: string; // ISO 8601 format
    pickupLocationId: string;
    bookingId: string;
    bookingNumber: string;
    bookingStatus: "RESERVED" | "SERVICE_STARTED" | "SERVICE_PROVIDED" | "BOOKING_FINISHED" | "CANCELLED";
    bookingPeriod: string; // e.g., "Oct 25 - Nov 05"
    carModel: string;
    clientName: string;
    date: string; // e.g., "25.11.24"
    location: string;
    carImageUrl?:string,
    madeBy: 'CLIENT' | 'SUPPORT_AGENT' | 'ADMIN'; // Add other roles as needed
}

export interface BookingFormData {
  carId: string;
  clientId: string;
  dropOffDateTime: string; // ISO 8601 format
  dropOffLocationId: string;
  pickupDateTime: string; // ISO 8601 format
  pickupLocationId: string;
}


        // bookingId": "ce3d9306-ec01-48a9-9d1a-f9818063c734",
//       "bookingNumber": "2437",
//       "BookingPeriod": "Oct 25 - Nov 05",
//       "carModel": "Audi A6 Quattro 2023",
//       "clientName": "Lily Hope",
//       "date": "25.11.24",
//       "location": "Boston",
//       "madeBy": "Client"

export interface MyBooking {
    bookingId: string;
    bookingStatus: "RESERVED" | "SERVICE_STARTED" | "SERVICE_PROVIDED" | "BOOKING_FINISHED" | "CANCELLED";
    carImageUrl: string;
    carModel: string;
    orderDetails: string;
}

export interface Car {
    carId: string;
    carRating: string,
    imageUrl: string;
    location: string;
    model: string;
    pricePerDay: string,
    serviceRating: string;
    status : "AVAILABLE" | "BOOKED";
  }
  
  
  // for home page
  
  export interface AboutUsStoryInfo {
    title: string;
    description: string;
    numericValue: string;
  }
  
  export interface FAQStory {
    question: string;
    answer: string;
  }
  
  export interface LocationInfo {
    locationId: string;
    locationName: string;
    locationAddress: string;
    locationImageUrl: string;
  }
  
  export interface HomepageState {
    aboutUs: AboutUsStoryInfo[];
    faq: FAQStory[];
    locations: LocationInfo[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    popularCars: Car[];
  }
  
  // for feedback section
  export interface FeedbackInfo {
    bookingId: string;
    feedbackId: string;
    author: string;
    carModel: string;
    feedbackText: string;
    carImageUrl: string;
    orderHistory: string;
    rating: string;
    date: string;
    location? : string
}

export interface ClientReview {
  author: string;
  authorImageUrl: string;
  date: string;
  rentalExperience: string;
  text: string;
  carId: string;
}


export interface CreateFeedbackPayload {
  bookingId: string;
  carId: string;
  clientId: string;
  feedbackText: string;
  rating: string;
}


// for car slice 
export interface CarBriefInfo {
  carId: string;
  carRating: number;
  imageUrl: string;
  location: string;
  model: string;
  pricePerDay: number;
  serviceRating: number;
  status: 'AVAILABLE' | 'BOOKED' | 'UNAVAILABLE';
}

export interface CarDetails extends CarBriefInfo {
  climateControlOption: 'NONE' | 'AIR_CONDITIONER' | 'CLIMATE_CONTROL' | 'TWO_ZONE_CLIMATE_CONTROL';
  engineCapacity: string;
  fuelConsumption: string;
  fuelType: 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';
  gearBoxType: 'MANUAL' | 'AUTOMATIC';
  images: string[];
  passengerCapacity: number;
  clientReviews?: ClientReview[];
}

export interface CarBookedDates {
  carId: string;
  content: string[];
}
