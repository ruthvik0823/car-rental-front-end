import { useAppSelector } from "../../hooks/reduxStoreHooks";
import { Link } from "react-router-dom";

function ProfileAvatarCard() {
  const authUser = useAppSelector((state) => state.auth.user);
  const userDetails = useAppSelector((state) => state.users.userDetails);

  return (
    <div className="flex items-center justify-between border rounded-xl p-5 bg-white mb-6">
      <div className="flex items-center gap-4">
        <img
          src={userDetails?.imageUrl}
          alt="Profile"
          className="h-16 w-16 rounded-full object-cover border"
        />
        <div>
          <div className="text-lg font-medium">
            {authUser
              ? `${authUser.firstName} ${authUser.lastName}`
              : "User Name"}
          </div>
          <div className="text-gray-600">
            {authUser ? authUser.email : "user@example.com"}
          </div>
        </div>
      </div>
      <Link to="/my-profile">
        <button className="font-semibold text-black hover:text-red-600">
          Change
        </button>
      </Link>
    </div>
  );
}

export default ProfileAvatarCard;
