import Button from "@/components/common/Button";
import Dropdown from "../components/Dropdown";
import { useState, useEffect, useRef, useMemo } from "react";
import CommonDatePicker from "../components/common/CommonDatePicker";
import { DateRange } from "react-day-picker";
import { useNavigate } from "react-router-dom";

type data = {
  bookingId: string;
  bookingNumber: string;
  bookingPeriod: string;
  carModel: string;
  clientName: string;
  date: string;
  location: string;
  madeBy: string;
  bookingStatus: string;
};

const Bookings = () => {
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [isClientOpen, setIsClientOpen] = useState(false);
  const [selectedClientOption, setSelectedClientOption] = useState("Client");
  const [isBookingStatusOpen, setIsBookingStatusOpen] = useState(false);
  const [selectedBookingStatusOption, setSelectedBookingStatusOption] =
    useState("Booking status");
  const [data, setData] = useState<data[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [clientOptions, setClientOptions] = useState<string[]>([]);
  const [bookingStatusOptions, setBookingStatusOptions] = useState<string[]>(
    []
  );
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/bookings.json");
        if (!response.ok) throw new Error("Network response was not ok");
        setData(await response.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const uniqueClients = Array.from(
        new Set(data.map((item) => item.clientName))
      );
      const uniqueStatuses = Array.from(
        new Set(data.map((item) => item.bookingStatus))
      );
      setClientOptions(uniqueClients);
      setBookingStatusOptions(uniqueStatuses);
    }
  }, [data]);

  const filteredData = useMemo(() => {
    // console.log("Selected Date Range:", date?.from, date?.to);
    // console.log("Data Items:", data);
    // console.log(data.map((item) => item.date));

    return data.filter((item) => {
      const isClientMatch =
        selectedClientOption === "Client" ||
        item.clientName === selectedClientOption;
      const isStatusMatch =
        selectedBookingStatusOption === "Booking status" ||
        item.bookingStatus === selectedBookingStatusOption;

      let isDateMatch = true; // Default is true

      if (date?.from && date?.to) {
        const itemDate = new Date(item.date);
        const fromDate = new Date(date.from);
        const toDate = new Date(date.to);

        // normalize all to midnight
        itemDate.setHours(0, 0, 0, 0);
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(0, 0, 0, 0);

        isDateMatch = itemDate >= fromDate && itemDate <= toDate;
      }

      return isClientMatch && isStatusMatch && isDateMatch;
    });
  }, [data, selectedClientOption, selectedBookingStatusOption, date]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-3xl">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-64 text-red-500 text-3xl">
        {error}
      </div>
    );

  const handleClick = (bookingId: string) => {
    if (activeDropdown === bookingId) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(bookingId);
    }
  };

  const handleCancel = (indexC: number) => {
    // data.filter((item, index) => {
    //   if (index === indexC) {
    //     item.bookingStatus = "Cancelled";
    //   }
    // });
    // setData([...data]);
    // setActiveDropdown(null);
    setData((prevData) =>
      prevData.map((item, index) => {
        if (index === indexC) {
          return { ...item, bookingStatus: "Cancelled" };
        }
        return item;
      })
    );
    setActiveDropdown(null);
  };

  return (
    <div className="px-8 font-primary">
      <div className="flex justify-between items-center">
        <h1 className="text-[27px] sm:text-4xl md:text-[56px] font-semibold px-1 md:px-2">
          Bookings
        </h1>
        <Button label="Create new booking" onClick={() => navigate("/cars")} />
      </div>
      <div className="flex gap-6 items-center mt-10 mb-6">
        <CommonDatePicker
          className="mt-1"
          labels={false}
          pickupdropoff={false}
          date={date}
          setDate={setDate}
        ></CommonDatePicker>
        <Dropdown
          title=""
          options={clientOptions}
          isOpen={isClientOpen}
          setIsOpen={setIsClientOpen}
          selectedOption={selectedClientOption}
          setSelectedOption={setSelectedClientOption}
        ></Dropdown>
        <Dropdown
          title=""
          options={bookingStatusOptions}
          isOpen={isBookingStatusOpen}
          setIsOpen={setIsBookingStatusOpen}
          selectedOption={selectedBookingStatusOption}
          setSelectedOption={setSelectedBookingStatusOption}
        ></Dropdown>
      </div>
      <div className="rounded-lg border border-border">
        <table className="w-full">
          <thead>
            <tr className="bg-black text-white">
              <td className="text-center px-4 py-2 rounded-tl-lg border-r border-border">
                Date
              </td>
              <td className="text-center border-r border-border">
                Booking number
              </td>
              <td className="text-center border-r border-border">Client</td>
              <td className="text-center border-r border-border">Car</td>
              <td className="text-center border-r border-border">Made by</td>
              <td className="text-center border-r border-border">
                Booking status
              </td>
              <td className="text-center border-r border-border">
                Booking period
              </td>
              <td className="px-4 py-2 rounded-tr-lg">Action</td>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={item.bookingId} className="border-t border-border">
                <td className="text-center px-4 py-2 border-r border-border">
                  {item.date}
                </td>
                <td className="text-center border-r border-border">
                  {item.bookingNumber}
                </td>
                <td className="text-center border-r border-border">
                  {item.clientName}
                </td>
                <td className="text-center border-r border-border">
                  {item.carModel}
                </td>
                <td className="text-center border-r border-border">
                  {item.madeBy}
                </td>
                <td className="text-center border-r border-border">
                  {item.bookingStatus}
                </td>
                <td className="text-center border-r border-border">
                  {item.bookingPeriod}
                </td>
                <td className="relative flex justify-center items-center">
                  <button
                    className="hover:cursor-pointer"
                    onClick={() => handleClick(item.bookingId)}
                  >
                    ...
                  </button>
                  {activeDropdown === item.bookingId && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-10 top-[90%] right-[50%] bg-white border border-border rounded-lg p-4 shadow-lg flex flex-col w-40"
                    >
                      <button className="hover:bg-black hover:text-white hover:cursor-pointer rounded-sm">
                        View details
                      </button>
                      <button
                        onClick={() => handleCancel(index)}
                        className={
                          item.bookingStatus === "Cancelled"
                            ? "hover:bg-black hover:text-white hover:cursor-not-allowed rounded-sm"
                            : "hover:bg-black hover:text-white hover:cursor-pointer rounded-sm"
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bookings;
