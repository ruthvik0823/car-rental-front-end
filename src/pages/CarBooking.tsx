import { useState } from "react";
import Dropdown from "../components/Dropdown";
// import carImage1 from "../../public/images/cars/car-01.png";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxStoreHooks";
import { useLocation, useNavigate } from "react-router";

import CommonDatePicker from "@/components/common/CommonDatePicker";
import { DateRange } from "react-day-picker";
import { BookingFormData } from "@/types/types";
import { createBooking, updateBooking } from "@/slices/bookingSlice";
import Toast from "@/components/common/Toast";

function modifyDateAndTime(date: Date | undefined) {
  if (!date) return "2023-10-01 10:00 AM";

  const formattedDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${formattedDate} | ${formattedTime}`;
  // October 01 | 03:30 PM
}

const CarBooking: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { userDetails } = useAppSelector((state) => state.users);
  const { allUsers } = useAppSelector((state) => state.users);
  const { bookingMessage } = useAppSelector((state) => state.bookings);

  const dispatch = useAppDispatch();

  const allClients = allUsers.filter((user) => user.role === "CLIENT");
  const location = useLocation();
  const {
    carId,
    pickupLocationId,
    dropOffLocationId,
    date,
    modifyBooking,
    bookingId,
  } = location.state || {};
  const { carDetailsList: cars } = useAppSelector((state) => state.cars);
  const car = cars.find((car) => car.carId === carId);
  const [showErrorModel, setShowErrorModel] = useState(!car);
  console.log(car);

  const navigate = useNavigate();

  if (!car && !modifyBooking) {
    return (
      <Modal
        onCancel={() => setShowErrorModel(false)}
        onConfirm={() => {
          navigate("/cars");
        }}
        confirmText="Go to Cars"
        open={showErrorModel}
        title="No Selected Car is Found"
        description="Please select a car to book"
        cancelText="Cancel"
      />
    );
  }

  const [isOpenClient, setIsOpenClient] = useState(false);
  const [client, setClient] = useState(allClients[0]?.firstName);

  const [isEditClient, setIsEditClient] = useState(false);

  const [isEditDateTime, setIsEditDateTime] = useState(false);

  const [isEditLocation, setIsEditLocation] = useState(false);
  const [pickupLocation, setPickupLocation] = useState("Kyiv, Hayatt Hotel");
  const [dropOffLocation, setDropOffLocation] = useState("Kyiv, Hayatt Hotel");
  const [isOpenPickupLocation, setIsOpenPickupLocation] = useState(false);
  const [isOpenDropOffLocation, setIsOpenDropOffLocation] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const [isToastModalOpen, setIsToastModalOpen] = useState(false);

  const [changeDate, setChangeDate] = useState<DateRange | undefined>({
    from: date?.from || new Date(),
    to: date?.to || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  });

  async function handleCarBooking() {
    const bookingData: BookingFormData = {
      carId: car?.carId || "",
      clientId: user?.userId || "",
      dropOffDateTime: changeDate?.to?.toString() ?? new Date().toString(),
      dropOffLocationId: dropOffLocationId || "Kyiv, Hayatt Hotel",
      pickupDateTime: changeDate?.from?.toString() ?? new Date().toString(),
      pickupLocationId: pickupLocationId || "Kyiv, Hayatt Hotel",
    };
    if (modifyBooking) {
      await dispatch(updateBooking({ bookingId, updatedData: bookingData }));
    } else {
      await dispatch(createBooking(bookingData));
    }
    setIsSuccessModalOpen(false);
    setIsToastModalOpen(true);
    setTimeout(() => {
      setIsToastModalOpen(false);
      navigate("/my-bookings");
    }, 2000);
  }

  return (
    <main className="px-8 py-14 sm:flex sm:flex-wrap sm:gap-8 ">
      <header className="mb-8 sm:w-full">
        <nav>
          <ul>{/* Add navigation items here */}</ul>
        </nav>
        <h1 className="text-3xl font-semibold text-center sm:text-start sm:text-[56px]">
          {modifyBooking ? "Edit Booking" : "Car Booking"}
        </h1>
      </header>
      <section className="sm:flex-1/3 flex flex-col gap-8 ">
        {/* user info */}
        <div className="space-y-2">
          <h2 className="text-lg font-medium sm:text-2xl">Personal Info</h2>
          {user?.role === "CLIENT" && (
            <div className="p-4 border rounded-lg">
              <p>
                {userDetails
                  ? userDetails?.firstName + " " + userDetails?.lastName
                  : user?.firstName + " " + user?.lastName}
              </p>
              <p>{userDetails?.email || user?.email}</p>
              <p>{userDetails?.phone} </p>
            </div>
          )}

          {user?.role === "SUPPORT_AGENT" && (
            <div className="p-4 border rounded-lg flex  justify-between jrelative">
              <div>
                {isEditClient ? (
                  <div className="w-full">
                    <Dropdown
                      title="Client"
                      options={allUsers
                        .filter((user) => user.role === "CLIENT")
                        .map((user) => user.firstName)}
                      selectedOption={client}
                      setSelectedOption={setClient}
                      isOpen={isOpenClient}
                      setIsOpen={setIsOpenClient}
                    />
                  </div>
                ) : (
                  <div className="">
                    <div>
                      <label className="text-xs font-normal text-gray-500">
                        Client
                      </label>
                      <p className="mt-1 border-transparent border rounded-md px-3 py-2 ">
                        {client}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="">
                <button
                  className="cursor-pointer"
                  onClick={() => setIsEditClient(!isEditClient)}
                >
                  {isEditClient ? "Save" : "Change"}
                </button>
              </div>
            </div>
          )}
        </div>
        {/* location */}
        <div className="space-y-2">
          <h2 className="text-lg font-medium sm:text-2xl">Location</h2>

          <div className="p-4 border rounded-lg flex  justify-between jrelative">
            <div>
              {isEditLocation ? (
                <div className="w-full">
                  <Dropdown
                    title="Pick-up Location"
                    options={[
                      "Kyiv, Hayatt Hotel",
                      "Kyiv, Boryspil Airport",
                      "Kyiv, Central Station",
                    ]}
                    selectedOption={pickupLocation}
                    setSelectedOption={setPickupLocation}
                    isOpen={isOpenPickupLocation}
                    setIsOpen={setIsOpenPickupLocation}
                  />

                  <Dropdown
                    title="Drop-off Location"
                    options={[
                      "Kyiv, Hayatt Hotel",
                      "Kyiv, Boryspil Airport",
                      "Kyiv, Central Station",
                    ]}
                    selectedOption={dropOffLocation}
                    setSelectedOption={setDropOffLocation}
                    isOpen={isOpenDropOffLocation}
                    setIsOpen={setIsOpenDropOffLocation}
                  />
                </div>
              ) : (
                <div className="">
                  <div>
                    <label className="text-xs font-normal text-gray-500">
                      Pick-up Location
                    </label>
                    <p className="mt-1 border-transparent border rounded-md px-3 py-2 ">
                      {pickupLocation}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-normal text-gray-500">
                      Drop-off Location
                    </label>
                    <p className="mt-1 border-transparent border rounded-md px-3 py-2 ">
                      {dropOffLocation}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="">
              <button
                className="cursor-pointer"
                onClick={() => setIsEditLocation(!isEditLocation)}
              >
                {isEditLocation ? "Save" : "Change"}
              </button>
            </div>
          </div>
        </div>
        {/* date and time */}
        <div className="space-y-2">
          <h2 className="text-lg font-medium sm:text-2xl">Date & Times</h2>
          <div className="p-4 border rounded-lg flex  justify-between jrelative">
            <div>
              {isEditDateTime ? (
                <div className="w-full">
                  <CommonDatePicker
                    date={changeDate}
                    setDate={setChangeDate}
                    pickupdropoff={true}
                    labels={true}
                  />
                </div>
              ) : (
                <div className="">
                  <div>
                    <label className="text-xs font-normal text-gray-500">
                      Pick-up Date & Time
                    </label>
                    <p className="mt-1 border-transparent border rounded-md px-3 py-2 ">
                      {modifyDateAndTime(changeDate?.from)}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-normal text-gray-500">
                      Drop-off Date & Time
                    </label>
                    <p className="mt-1 border-transparent border rounded-md px-3 py-2 ">
                      {modifyDateAndTime(changeDate?.to)}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="">
              <button
                className="cursor-pointer"
                onClick={() => setIsEditDateTime(!isEditDateTime)}
              >
                {isEditDateTime ? "Save" : "Change"}
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="sm:self-start flex sm:flex-1/3 flex-col divide-border divide-y-1  bg-[#f0f0f0] p-4 rounded-lg">
        <figure className="flex flex-col gap-4 pb-4">
          <img
            src={car?.images[0]}
            className="w-full sm:w-auto rounded-lg"
            alt=""
          />
          <figcaption>
            <p className="text-lg font-semibold ">{car?.model}</p>
            <p className="text-sm text-gray-500">{car?.location}</p>
          </figcaption>
        </figure>
        <div className="flex flex-col pt-4 ">
          <p className="text-lg font-semibold flex  justify-between">
            <span>Total</span>
            <span> $900</span>
          </p>
          <p className="text-sm text-gray-500 mb-4">Deposit : $2000</p>
          <Button
            label={modifyBooking ? "Modify Reservation" : "Confirm Reservation"}
            onClick={() => {
              if (car?.status === "BOOKED") {
                setIsCancelModalOpen(true);
              } else {
                setIsSuccessModalOpen(true);
              }
            }}
            variant="primary"
            fullWidth={true}
            type="button"
          />
        </div>
      </section>
      {isCancelModalOpen && (
        <Modal
          onConfirm={handleCarBooking}
          onCancel={null}
          confirmText="Ok"
          open={isCancelModalOpen}
          title="Sorry"
          description="It seems like someone has already reserved this car. 
You can find similar one here"
        />
      )}
      {isSuccessModalOpen && (
        <Modal
          onConfirm={handleCarBooking}
          onCancel={() => setIsSuccessModalOpen(false)}
          confirmText="Confirm Reservation"
          open={isSuccessModalOpen}
          cancelText="Cancel"
          title="Confirm Your Reservation"
          description="Go through the details of your reservation and confirm it"
        />
      )}
      <Toast
        type="success"
        isOpen={isToastModalOpen}
        onClose={() => setIsToastModalOpen(false)}
        message={
          modifyBooking
            ? "Booking modified successfully"
            : "Booking created successfully"
        }
        subMessage={bookingMessage}
      />
    </main>
  );
};

export default CarBooking;
