import React from "react";
import { useNavigate } from "react-router-dom";
import { removeToken, getTokenPayload } from "../utils/auth";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const user = getTokenPayload(); // { id, email }

  const handleLogout = () => {
    removeToken();
    navigate("/auth");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow">
      <div className="font-bold text-lg cursor-pointer" onClick={() => navigate("/dashboard")}>
        PDF Annotator
      </div>
      {user && (
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">Hello, {user.email}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
