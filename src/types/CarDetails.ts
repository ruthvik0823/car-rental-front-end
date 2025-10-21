export interface CarDetailsType {
  carId: string; // Example: "92c87432-3383-4328-85f8-7d20ba8715ec"
  carRating: number; // Example: "4.5"
  // climateControlOption: 'NONE' | 'AIR_CONDITIONER' | 'CLIMATE_CONTROL' | 'TWO_ZONE_CLIMATE_CONTROL';
  climateControlOption: string;

  engineCapacity: string; // Example: "3.0 turbo"
  fuelConsumption: string; // Example: "10.0 Liter/100km"
  // fuelType: 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';
  fuelType: string;

  // gearBoxType: 'MANUAL' | 'AUTOMATIC';
  gearBoxType: string;
  images: string[]; // List of image URLs
  location: string; // Example: "Ukraine, Kyiv"
  model: string; // Example: "Audi A6 Quattro 2023"
  passengerCapacity: number; // Corrected: Example: 5
  pricePerDay: string; // Example: "180"
  serviceRating: number; // Example: "4.8"
  // status: 'AVAILABLE' | 'BOOKED' | 'UNAVAILABLE';
  status: string;

}

export interface CarBriefInfoType {
  carId: string; // Example: "92c87432-3383-4328-85f8-7d20ba8715ec"
  carRating: string; // Example: "4.5"
  imageUrl: string; // Example: "https://application.s3.eu-central-1.amazonaws.com/img/cars/audi-A6-quattro-2023.jpg"
  location: string; // Example: "Ukraine, Kyiv"
  model: string; // Example: "Audi A6 Quattro 2023"
  pricePerDay: string; // Example: "180"
  serviceRating: string; // Example: "4.8"
  // status: 'AVAILABLE' | 'BOOKED' | 'UNAVAILABLE'; // Enum
  status: string; // Enum

}

export interface FeedbackItemType {
  author: string;
  authorImageUrl: string;
  date: string;
  rentalExperience: number; // or number, but keep string if it comes as "5", "4", etc.
  text: string;
}

