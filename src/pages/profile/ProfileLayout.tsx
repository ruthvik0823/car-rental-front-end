import { useLocation, Outlet } from "react-router-dom";
import Sidebar from "../../components/profile/Sidebar";


function ProfileLayout() {
  const location = useLocation();
  const activeTab = location.pathname.split("/").pop();
  

  return (
    <div className="min-h-screen flex bg-[#FAF6F1]">
      <Sidebar active={activeTab || "personal-info"} />
      <main className="flex-1 px-8 py-10">
        <h1 className="text-4xl font-bold mb-8">My profile</h1>
        <Outlet />
      </main>
    </div>
  );
}

export default ProfileLayout;
