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
      <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F] px-4">
        <div className="text-center card fade-in">
          <p className="text-gray-400 mb-4">Please log in to view your dashboard.</p>
          <Link to="/" className="btn-primary scale-hover">Go to Home</Link>
        </div>
      </div>
    );
  }

  // Dashboard main layout
  return (
    <div className="min-h-screen bg-[#0F0F0F] border-2 px-4 py-12 flex flex-col items-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0" style={{background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.10) 0%, rgba(15,15,15,0.95) 80%)'}}></div>
      <div className="w-full max-w-[95%] mx-auto relative z-10 flex flex-col gap-12">
        {/* Hero/Welcome Section */}
        <section className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8 mb-4">
          <div className="flex items-center gap-6">
            <img src={user.profileImage} alt="Profile" className="w-20 h-20 rounded-full border-2 border-[#60A5FA] shadow-lg" />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-1">Welcome back, {user.name.split(' ')[0] || user.name}!</h1>
              <p className="text-gray-400 text-lg">Ready to simplify your links today?</p>
            </div>
          </div>
          <div className="flex gap-4 flex-wrap mt-6 md:mt-0 items-center">
            <div className="bg-[#18181B] px-6 py-3 rounded-xl flex flex-col items-center shadow border border-[#23272e] min-w-[120px]">
              <span className="text-2xl font-bold">{Array.isArray(window.__urls) ? window.__urls.length : '--'}</span>
              <span className="text-xs text-gray-400 mt-1">Total URLs</span>
            </div>
            <div className="bg-[#18181B] px-6 py-3 rounded-xl flex flex-col items-center shadow border border-[#23272e] min-w-[120px]">
              <span className="text-2xl font-bold">{Array.isArray(window.__urls) && window.__urls.length > 0 ? new Date(window.__urls[0].created_at).toLocaleDateString() : '--'}</span>
              <span className="text-xs text-gray-400 mt-1">Last Created</span>
            </div>
            {/* Logout Button */}
            <button
              className="btn-secondary px-6 py-2 font-semibold"
              onClick={async () => {
                if (window.confirm("Are you sure you want to log out?")) {
                  try {
                    await signOut(auth);
                    localStorage.setItem("urlCount", "0");
                    window.location.href = "/";
                  } catch (err) {
                    alert("Failed to log out. Please try again.");
                  }
                }
              }}
            >
              Log Out
            </button>
          </div>
        </section>
        {/* Motivational Quote/Tip */}
        {/* <section className="w-full flex justify-center mb-2">
          <div className="bg-[#23272e] rounded-lg px-6 py-3 text-center text-gray-300 text-base max-w-xl shadow">
            "The best way to get started is to quit talking and begin doing." – Walt Disney
          </div>
        </section> */}
        {/* Main Content Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-4 gap-4 w-full">
          {/* Left: URL Form + How it works + Recent Activity */}
          <div className="flex flex-col gap-8 lg:col-span-1">
            <div className="card p-10 flex flex-col">
              <h2 className="text-2xl font-semibold">Shorten a URL</h2>
              <UrlForm />
              {/* How it works */}
              <div className="bg-[#23272e] rounded-lg px-4 py-3 mt-6">
                <h3 className="text-lg font-bold mb-1">How it works</h3>
                <ol className="list-decimal list-inside text-gray-300 text-base space-y-1">
                  <li>Paste your long URL above.</li>
                  <li>Click "Shorten URL".</li>
                  <li>Copy or share your short URL!</li>
                </ol>
              </div>
              {/* Recent Activity */}
              {Array.isArray(window.__urls) && window.__urls.length > 0 && (
                <div className="bg-[#23272e] rounded-lg px-4 py-3 mt-6">
                  <h3 className="text-lg font-bold mb-2">Recent Activity</h3>
                  <ul className="text-gray-400 text-base space-y-1">
                    {window.__urls.slice(0, 3).map((url, idx) => (
                      <li key={url._id} className="truncate">{idx + 1}. {url.short_url}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {/* Get Help Card */}
            <div className="card p-8 flex flex-col items-center text-center mt-1">
              <h3 className="text-lg font-bold mb-2">Need Help?</h3>
              <p className="text-gray-400 mb-2">Contact our support team for assistance or feedback.</p>
              <a href="mailto:support@example.com" className="btn-secondary w-full">Contact Support</a>
            </div>
          </div>
          {/* Right: URL List */}
          <div className="lg:col-span-3 card p-8 min-h-[400px] overflow-y-hidden flex flex-col">
            <h2 className="text-2xl font-semibold mb-4">Your URLs</h2>
            <UrlList />
          </div>
        </main>
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
