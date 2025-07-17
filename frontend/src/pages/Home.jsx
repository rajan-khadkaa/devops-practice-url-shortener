import { useAuth } from "../context/AuthContext";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  googleProvider,
  auth,
  sendEmailVerification,
  updateProfile,
} from "../firebase";
import UrlForm from "../components/UrlForm";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
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
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await updateProfile(userCredential.user, { displayName: name });
        await sendEmailVerification(userCredential.user);
        setVerificationSent(true);
        const token = await userCredential.user.getIdToken();
        await axios.post(
          `${import.meta.env.VITE_API_URL}/update-user`,
          { name },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.reload();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      localStorage.setItem("urlCount", "0");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A]">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] px-4 py-12 flex flex-col items-center">
      <h1 className="text-5xl font-bold mb-8 text-center fade-in">
        URL Shortener
      </h1>
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Authentication */}
        <div className="space-y-6">
          {error && (
            <div className="card text-[#EF4444] p-4 flex items-center gap-2 fade-in">
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
          {verificationSent && (
            <div className="card text-[#10B981] p-4 flex items-center gap-2 fade-in">
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Verification email sent! Please check your inbox and verify your
              email.
            </div>
          )}
          {!user && (
            <>
              <button
                onClick={handleGoogleSignIn}
                className="btn-secondary w-full flex items-center justify-center gap-2 scale-hover"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="spinner mr-2"></div>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.02.68-2.33 1.09-3.71 1.09-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C4.01 20.07 7.64 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.64 1 4.01 3.93 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Sign in with Google
                  </>
                )}
              </button>
              <div className="card fade-in">
                <form onSubmit={handleEmailAuth} className="space-y-4">
                  {isSignUp && (
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium mb-1"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full bg-[#0F0F0F] border border-[#4B5563] text-white px-4 py-2 rounded-lg"
                        required
                      />
                    </div>
                  )}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-1"
                    >
                      Email
                    </label>
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
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium mb-1"
                    >
                      Password
                    </label>
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
                    className="btn-primary w-full flex items-center justify-center scale-hover"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="spinner mr-2"></div>
                    ) : isSignUp ? (
                      "Sign Up"
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-[#60A5FA] hover:text-[#93C5FD] mt-4 w-full text-center font-['Geist_Sans',_sans-serif]"
                >
                  {isSignUp
                    ? "Already have an account? Sign In"
                    : "Need an account? Sign Up"}
                </button>
              </div>
            </>
          )}
        </div>
        {/* Right Column: UrlForm */}
        <div className="card fade-in">
          <h2 className="text-2xl font-semibold mb-4">Shorten a URL</h2>
          <UrlForm />
        </div>
      </div>
    </div>
  );
};

export default Home;

// import { useAuth } from "../context/AuthContext";
// import {
//   signInWithPopup,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   signOut,
//   googleProvider,
//   auth,
// } from "../firebase";
// import UrlForm from "../components/UrlForm";
// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { useEffect } from "react";

// const Home = () => {
//   const { user, loading } = useAuth();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isSignUp, setIsSignUp] = useState(false);
//   const [error, setError] = useState("");

//   const handleGoogleSignIn = async () => {
//     try {
//       await signInWithPopup(auth, googleProvider);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const handleEmailAuth = async (e) => {
//     e.preventDefault();
//     setError("");
//     try {
//       if (isSignUp) {
//         await createUserWithEmailAndPassword(auth, email, password);
//       } else {
//         await signInWithEmailAndPassword(auth, email, password);
//       }
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//       localStorage.setItem("urlCount", "0"); // Reset free tier limit
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   if (loading) return <p>Loading...</p>;

//   // useEffect(() => {
//   //   console.log("user info: ", user);
//   // }, []);

//   return (
//     <div>
//       <h1>URL Shortener</h1>
//       {error && <p className="text-red-500">{error}</p>}
//       {user ? (
//         <>
//           <p>Welcome, {user.name}</p>
//           <button
//             onClick={handleSignOut}
//             className="bg-red-500 text-white p-2 mb-4"
//           >
//             Sign Out
//           </button>
//           <Link
//             to="/dashboard"
//             className="bg-blue-500 text-white p-2 mb-4 inline-block"
//           >
//             Go to Dashboard
//           </Link>
//           <UrlForm />
//         </>
//       ) : (
//         <>
//           <button
//             onClick={handleGoogleSignIn}
//             className="bg-blue-500 text-white p-2 mb-2"
//           >
//             Sign in with Google
//           </button>
//           <form onSubmit={handleEmailAuth} className="mb-4">
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Email"
//               className="border p-2 mb-2 block"
//               required
//             />
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Password"
//               className="border p-2 mb-2 block"
//               required
//             />
//             <button type="submit" className="bg-blue-500 text-white p-2">
//               {isSignUp ? "Sign Up" : "Sign In"}
//             </button>
//           </form>
//           <button
//             onClick={() => setIsSignUp(!isSignUp)}
//             className="text-blue-500"
//           >
//             {isSignUp
//               ? "Already have an account? Sign In"
//               : "Need an account? Sign Up"}
//           </button>
//           <UrlForm />
//         </>
//       )}
//     </div>
//   );
// };

// export default Home;
