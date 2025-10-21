import { AuthState } from "../types/types";
import { Link } from "react-router";
import { FiFacebook } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { useAppSelector } from "@/hooks/reduxStoreHooks";

function Footer() {
  const { user } = useAppSelector((state: { auth: AuthState }) => state.auth);
  const isAuthenticated = user !== null && user !== undefined;
  return (
    <footer className="flex w-full flex-wrap sm:flex-nowrap px-8 py-7 mt-auto border border-border items-center justify-between">
      <figure className="text-2xl font-normal mr-auto sm:mb-0 mb-4 ">
        <figcaption>
          Flexi<span className="text-primary font-black">Ride</span>
        </figcaption>
      </figure>
      <nav className="flex  justify-between w-full sm:justify-center  sm:mr-auto items-center">
        <ul className="flex sm:mb-0 mb-4 gap-2 sm:gap-10 sm:ml-auto flex-col sm:flex-row  ">
          {user?.role === "SUPPORT_AGENT" ? (
            <Link className={"outline-none"} to="/bookings">
              <li>Bookings</li>
            </Link>
          ) : (
            <Link className={"outline-none"} to="/">
              <li>Home</li>
            </Link>
          )}
          <Link to="/cars">
            <li>Car</li>
          </Link>
          {isAuthenticated && user?.role === "CLIENT" && (
            <Link to="/my-bookings">
              <li>My Bookings</li>
            </Link>
          )}
          {user?.role === "SUPPORT_AGENT" && (
            <Link to="/clients">
              <li>Clients</li>
            </Link>
          )}
        </ul>
        <ul className="flex  gap-2 sm:ml-auto sm:items-center flex-col sm:flex-row">
          <li className="cursor-pointer">
            <FiFacebook className="text-lg" />
          </li>
          <li className="cursor-pointer">
            <FaXTwitter className="text-lg" />
          </li>
          <li className="cursor-pointer">
            <FaInstagram className="text-lg" />
          </li>
        </ul>
      </nav>
    </footer>
  );
}

export default Footer;
