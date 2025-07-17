import { useAuth } from "../context/AuthContext";
import UrlList from "../components/UrlList";
import { Link } from "react-router-dom";
import { useState } from "react";
import { signOut } from "firebase/auth";
import UrlForm from "../components/UrlForm";
import { auth } from "../firebase";

const Dashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      console.log("logout clicked 1");
      await signOut(auth);
      console.log("logout clicked 2");
      localStorage.setItem("urlCount", "0");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A] px-4">
        <div className="text-center">
          <p className="text-gray-400 mb-4 font-['Geist_Sans']">
            Please log in to view your dashboard.
          </p>
          <Link
            to="/"
            className="bg-[#3B82F6] text-white px-6 py-3 rounded-lg font-semibold scale-hover"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-center fade-in">
          Your URL Dashboard
        </h1>
        {error && (
          <div className="card text-[#EF4444] p-4 mb-6 flex items-center gap-2 fade-in">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </div>
        )}
        {user ? (
          <>
            <div className="card mb-6 fade-in">
              <div className="flex items-center gap-4">
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-16 h-16 rounded-full border border-[#4B5563]"
                />
                <div>
                  <p className="text-xl font-semibold">{user.name}</p>
                  <p className="text-gray-400 font-['Geist_Mono',_monospace]">
                    {user.email}
                  </p>
                  {!user.emailVerified && (
                    <p className="text-[#EF4444] text-sm mt-1">
                      Please verify your email to use all features.
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <Link to="/" className="btn-secondary flex-1 scale-hover">
                  Back to Home
                </Link>
                <button
                  onClick={async () => {
                    setIsLoading(true);
                    setError("");
                    try {
                      console.log("logout clicked 1");
                      if (!auth) {
                        throw new Error(
                          "Firebase auth object is not initialized"
                        );
                      }
                      await signOut(auth);
                      console.log("logout clicked 2");
                      localStorage.setItem("urlCount", "0");
                      window.location.href = "/";
                    } catch (err) {
                      console.error("Logout error:", err);
                      setError(
                        err.message || "Failed to sign out. Please try again."
                      );
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="btn-primary bg-[#EF4444] flex-1 scale-hover flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="spinner mr-2"></div>
                  ) : (
                    "Sign Out"
                  )}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: UrlForm */}
              <div className="card fade-in">
                <h2 className="text-2xl font-semibold mb-4">Shorten a URL</h2>
                <UrlForm />
              </div>
              {/* Right Column: UrlList */}
              <div className="card fade-in">
                <h2 className="text-2xl font-semibold mb-4">Your URLs</h2>
                <UrlList />
              </div>
            </div>
          </>
        ) : (
          <div className="card text-center fade-in">
            <p className="text-gray-400 mb-4">
              Please log in to view your dashboard.
            </p>
            <Link to="/home" className="btn-primary scale-hover">
              Go to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

// import { useAuth } from "../context/AuthContext";
// import UrlList from "../components/UrlList";
// import { Link } from "react-router-dom";

// const Dashboard = () => {
//   const { user } = useAuth();

//   if (!user) {
//     return (
//       <div>
//         <p>Please log in to view your dashboard.</p>
//         <Link to="/" className="text-blue-500">
//           Go to Home
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h1>Your URL Dashboard</h1>
//       <Link to="/" className="text-blue-500 mb-4 inline-block">
//         Back to Home
//       </Link>
//       <UrlList />
//     </div>
//   );
// };

// export default Dashboard;
