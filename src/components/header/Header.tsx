import { Link, NavLink, useNavigate } from "react-router";

import { useEffect, useState } from "react";
import Dropdown from "../Dropdown";
import { LucideBell } from "lucide-react";
import { IoCloseOutline, IoMenu } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxStoreHooks";
import { signOut } from "@/slices/authSlice";
import { fetchUserDetails } from "@/slices/userSlice";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProfileOption, setSelectedProfileOption] = useState("");
  const [showNavbar, setShowNavbar] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth); // Access user from Redux state
  const { userDetails } = useAppSelector((state) => state.users);
  useEffect(() => {
    if (selectedProfileOption === "Profile") {
      // Navigate to profile page
      navigate("/my-profile");
      setSelectedProfileOption("");
    } else if (selectedProfileOption === "Logout") {
      // Logout the user
      dispatch(signOut());
      navigate("/");
      setSelectedProfileOption("");
    }
  }, [selectedProfileOption, navigate, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchUserDetails(user?.userId || ""));
    };
    fetchData();
  }, [user?.userId]);

  return (
    <header className="px-8 py-5 flex flex-col gap-8 border border-border sm:flex-row sm:justify-between sm:items-center sm:gap-0">
      {/* Logo Section */}
      <figure className="flex justify-between">
        <Link to="/">
          <figcaption className="text-2xl font-normal">
            <span>Flexi</span>
            <span className="font-extrabold text-primary">Ride</span>
          </figcaption>
        </Link>
        <button
          className="text-3xl cursor-pointer sm:hidden"
          onClick={() => setShowNavbar(!showNavbar)}
        >
          {showNavbar ? <IoCloseOutline /> : <IoMenu />}
        </button>
      </figure>

      {/* Navigation Links */}
      <nav className="hidden sm:flex gap-5 items-center">
        <ul className="flex gap-5 items-center">
          {user?.role === "SUPPORT_AGENT" ? (
            <NavLink className={"outline-none"} to="/bookings">
              <li>Bookings</li>
            </NavLink>
          ) : (
            <NavLink className={"outline-none"} to="/">
              <li>Home</li>
            </NavLink>
          )}
          <NavLink className={"outline-none"} to="/cars">
            <li>Cars</li>
          </NavLink>
          {user?.role === "CLIENT" && (
            <NavLink className={"outline-none"} to="/my-bookings">
              <li>My Bookings</li>
            </NavLink>
          )}
          {user?.role === "SUPPORT_AGENT" && (
            <NavLink className={"outline-none"} to="/clients">
              <li>Clients</li>
            </NavLink>
          )}
        </ul>
      </nav>

      {/* User Section */}
      <ul className="hidden sm:flex gap-5 items-center">
        {user ? (
          <li>
            <figure className="flex items-center gap-2">
              <img
                src={userDetails?.imageUrl}
                className="w-10 h-10 rounded-full"
                alt="user"
              />
              <figcaption>
                <Dropdown
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  title=""
                  options={["Profile", "Logout"]}
                  selectedOption={selectedProfileOption}
                  setSelectedOption={setSelectedProfileOption}
                  className="w-full cursor-pointer"
                  isNavbarDrop={true}
                  userName={`Hello, ${user.firstName} (${user?.role
                    .split("_")
                    .join(" ")
                    .toLowerCase()})`}
                />
              </figcaption>
              <span className="ml-auto">
                <LucideBell />
              </span>
            </figure>
          </li>
        ) : (
          <Link to="/login">
            <li>Login</li>
          </Link>
        )}
        <li className="relative">
          <select name="language" id="language-select">
            <option value="en">En</option>
            <option value="es">Es</option>
            <option value="hi">Hi</option>
          </select>
        </li>
      </ul>

      {/* Mobile Navbar */}
      {showNavbar && (
        <>
          <nav className="flex flex-col sm:hidden gap-2">
            <ul className="flex flex-col gap-2 sm:flex-row sm:justify-center sm:w-full sm:gap-5">
              <NavLink className={"outline-none"} to="/">
                <li>Home</li>
              </NavLink>
              <NavLink className={"outline-none"} to="/cars">
                <li>Cars</li>
              </NavLink>
              {user && (
                <NavLink className={"outline-none"} to="/my-bookings">
                  <li>My Bookings</li>
                </NavLink>
              )}
            </ul>
          </nav>
          <ul className="sm:hidden flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
            {user ? (
              <li>
                <figure className="flex items-center gap-2">
                  <img
                    src={userDetails?.imageUrl}
                    className="w-10 h-10"
                    alt="user"
                  />
                  <figcaption>
                    <Dropdown
                      isOpen={isOpen}
                      setIsOpen={setIsOpen}
                      title=""
                      options={["Profile", "Logout"]}
                      selectedOption={selectedProfileOption}
                      setSelectedOption={setSelectedProfileOption}
                      className="w-full cursor-pointer"
                      isNavbarDrop={true}
                      userName={`Hello, ${user.firstName} (${user.role})`}
                    />
                  </figcaption>
                  <span className="ml-auto">
                    <LucideBell />
                  </span>
                </figure>
              </li>
            ) : (
              <Link to="/login">
                <li>Login</li>
              </Link>
            )}
            <li className="relative">
              <select name="language" id="language-select">
                <option value="en">En</option>
                <option value="es">Es</option>
                <option value="hi">Hi</option>
              </select>
            </li>
          </ul>
        </>
      )}
    </header>
  );
}

export default Header;
