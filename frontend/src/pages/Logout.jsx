import React from "react";
import { Link } from "react-router-dom";

const Logout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A] px-4">
      <div className="card max-w-md w-full text-center">
        <h2 className="text-3xl font-bold mb-4">
          Are you sure you want to log out?
        </h2>
        <p className="text-gray-300 mb-8">
          You’ll be redirected to the landing page after signing out.
        </p>
        <button className="btn-primary w-full">
          {/* <button onClick={handleLogout} className="btn-primary w-full"> */}
          Confirm Logout
        </button>
        <Link
          to="/dashboard"
          className="btn-secondary w-full mt-4 inline-block"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
};

export default Logout;
