import React from "react";
import { useNavigate } from "react-router-dom";
import { removeToken, getTokenPayload } from "../../utils/auth";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const user = getTokenPayload(); // { id, email }

  const handleLogout = () => {
    removeToken();
    navigate("/auth");
  };

  return (
    <nav className="bg-white text-gray-800 shadow-md py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-300">
      <div
        className="font-extrabold text-xl md:text-2xl text-blue-600 cursor-pointer hover:text-blue-700 transition-colors duration-200"
        onClick={() => navigate("/dashboard")}
      >
        PDF Annotator
      </div>
      {user && (
        <div className="flex items-center gap-4">
          <span className="hidden md:inline text-gray-600 font-medium">
            Hello,{" "}
            <span className="text-blue-600 font-semibold">{user.email}</span>
          </span>
          <span className="hidden md:inline text-gray-600 font-medium cursor-pointer hover:text-blue-700" onClick={() => navigate("/dashboard")} >
            Dashboard,{" "}
            <span className="text-blue-600 font-semibold">{user.email}</span>
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
