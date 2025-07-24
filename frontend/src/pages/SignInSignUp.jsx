import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, googleProvider, auth, sendEmailVerification, updateProfile } from "../firebase";

const SignInSignUp = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setVerificationSent(false);
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        await sendEmailVerification(userCredential.user);
        setVerificationSent(true);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col md:flex-row items-stretch relative overflow-hidden">
      {/* Rectangular spotlights */}
      <div className="spotlight-bg w-full h-0">
        <div className="spotlight-rect left" />
        <div className="spotlight-rect left short" />
        <div className="spotlight-rect right" />
        <div className="spotlight-rect right short" />
      </div>
      {/* Left: Illustration and info */}
      <div className="flex-1 flex flex-col justify-center items-center bg-[#18181B] p-12 gap-8 min-h-[400px]">
        <svg width="220" height="160" viewBox="0 0 220 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="40" width="180" height="80" rx="24" fill="#23272e" />
          <rect x="60" y="80" width="100" height="16" rx="6" fill="#23272e" />
          <rect x="60" y="104" width="60" height="16" rx="6" fill="#23272e" />
          <circle cx="170" cy="110" r="18" fill="#60A5FA" />
          <rect x="150" y="92" width="36" height="36" rx="10" fill="#23272e" />
        </svg>
        <h2 className="text-3xl font-bold text-white">Welcome to Shortly</h2>
        <p className="text-gray-300 text-lg text-center max-w-md">Shorten, manage, and share your links with ease. Enjoy unlimited URLs, QR codes, and a beautiful dashboard.</p>
        <div className="bg-[#23272e] rounded-lg px-4 py-2 text-gray-300 text-sm mt-2 text-center">"Productivity is never an accident. It is always the result of a commitment to excellence."</div>
      </div>
      {/* Right: Auth form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-16">
        <div className="card p-10 w-full max-w-md fade-in">
          <h2 className="text-2xl font-bold mb-6 text-center">{isSignUp ? "Sign Up" : "Sign In"}</h2>
          {error && <div className="bg-[#EF4444]/20 border border-[#EF4444] text-[#EF4444] p-3 rounded-lg mb-4 text-center">{error}</div>}
          {verificationSent && (
            <div className="bg-[#10B981]/20 border border-[#10B981] text-[#10B981] p-3 rounded-lg mb-4 text-center">
              Verification email sent! Please check your inbox and verify your email.
            </div>
          )}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-[#0F0F0F] border border-[#4B5563] text-white px-4 py-2 rounded-lg"
                  required
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-[#0F0F0F] border border-[#4B5563] text-white px-4 py-2 rounded-lg"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-[#0F0F0F] border border-[#4B5563] text-white px-4 py-2 rounded-lg"
                required
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center scale-hover mt-2"
              disabled={isLoading}
            >
              {isLoading ? <div className="spinner mr-2"></div> : isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[#60A5FA] hover:text-white mt-4 w-full text-center font-semibold"
          >
            {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
          </button>
          <button
            onClick={handleGoogleSignIn}
            className="btn-secondary w-full mt-4 scale-hover"
            disabled={isLoading}
          >
            Continue with Google
          </button>
        </div>
        <div className="mt-8 text-center text-gray-400 text-sm">
          <Link to="/privacy" className="hover:text-white">Privacy Policy</Link> &bull; <Link to="/terms" className="hover:text-white">Terms</Link>
        </div>
      </div>
    </div>
  );
};

export default SignInSignUp; 