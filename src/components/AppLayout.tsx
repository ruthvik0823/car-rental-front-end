import { Outlet } from "react-router";
import Footer from "./Footer";
import Header from "./header/Header";

function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default AppLayout;
