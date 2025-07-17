import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="bg-[#0F0F0F] text-white">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <h1 className="text-5xl md:text-7xl font-bold text-center mb-6 fade-in">
          Simplify Your Links
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl text-center mb-8 fade-in">
          Create short, shareable URLs with QR codes in seconds. Secure, fast,
          and built for ease of use.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 fade-in">
          <Link
            to={user ? "/dashboard" : "/home"}
            className="btn-primary scale-hover"
          >
            {user ? "Go to Dashboard" : "Start Shortening"}
          </Link>
          {!user && (
            <Link to="/home" className="btn-secondary scale-hover">
              Sign In
            </Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-[#1E1E1E]">
        <h2 className="text-4xl font-bold text-center mb-12">
          Powerful Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="card fade-in">
            <svg
              className="w-12 h-12 text-[#60A5FA] mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <h3 className="text-2xl font-semibold mb-3">Lightning Fast</h3>
            <p className="text-gray-300">
              Generate short URLs instantly with minimal latency.
            </p>
          </div>
          <div className="card fade-in">
            <svg
              className="w-12 h-12 text-[#60A5FA] mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <h3 className="text-2xl font-semibold mb-3">QR Code Generation</h3>
            <p className="text-gray-300">
              Every short URL comes with a scannable QR code for easy sharing.
            </p>
          </div>
          <div className="card fade-in">
            <svg
              className="w-12 h-12 text-[#60A5FA] mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-2xl font-semibold mb-3">Personal Dashboard</h3>
            <p className="text-gray-300">
              Track and manage all your URLs in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <h2 className="text-4xl font-bold text-center mb-12">What Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="card fade-in">
            <p className="text-gray-300 mb-4">
              "This tool has made sharing links so much easier. The QR codes are
              a game-changer!"
            </p>
            <p className="font-semibold">Jane Doe, Marketer</p>
          </div>
          <div className="card fade-in">
            <p className="text-gray-300 mb-4">
              "Fast, reliable, and the dashboard is super intuitive. Highly
              recommend!"
            </p>
            <p className="font-semibold">John Smith, Developer</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-[#1E1E1E] text-center">
        <h2 className="text-4xl font-bold mb-6">
          Ready to Simplify Your Links?
        </h2>
        <Link
          to={user ? "/dashboard" : "/home"}
          className="btn-primary scale-hover"
        >
          Get Started Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-[#0F0F0F] border-t border-[#4B5563]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold">URL Shortener</h3>
            <p className="text-gray-400">
              Simplify your links, amplify your reach.
            </p>
          </div>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-gray-400 hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white">
              Terms of Service
            </Link>
            <Link to="/contact" className="text-gray-400 hover:text-white">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
