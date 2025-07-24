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
import UrlFormHome from "../components/UrlFormHome";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import QRCode from "react-qr-code";

const Home = () => {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recentShort, setRecentShort] = useState(null);

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
    <div className="min-h-screen bg-[#0F0F0F] px-4 py-12 flex flex-col items-center relative overflow-hidden">
      {/* Rectangular spotlights */}
      <div className="spotlight-bg w-full h-0">
        <div className="spotlight-rect left" />
        <div className="spotlight-rect left short" />
        <div className="spotlight-rect right" />
        <div className="spotlight-rect right short" />
      </div>
      <div className="w-full max-w-5xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left: Only the form */}
        <div className="card p-10 flex flex-col gap-8">
          <h2 className="text-2xl font-semibold mb-2">Shorten a URL</h2>
          <UrlFormHome onShorten={setRecentShort} />
        </div>
        {/* Right: Recently Shortened */}
        <div className="card p-10 flex flex-col gap-6">
          <h2 className="text-2xl font-semibold mb-2">Recently Shortened</h2>
          {recentShort ? (
            <div className="flex flex-col items-center gap-4">
              <QRCode value={recentShort.short_url} size={96} bgColor="#18181B" fgColor="#FFFFFF" />
              <div className="w-full">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-gray-400">Original:</span>
                  <a href={recentShort.original_url} target="_blank" rel="noopener noreferrer" className="text-[#60A5FA] break-all w-full truncate font-mono text-base hover:underline font-semibold">{recentShort.original_url}</a>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-gray-400">Short:</span>
                  <a href={recentShort.short_url} target="_blank" rel="noopener noreferrer" className="text-[#60A5FA] break-all font-mono text-base hover:underline font-semibold">{recentShort.short_url}</a>
                </div>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(recentShort.short_url)}
                className="btn-secondary w-full scale-hover"
              >
                Copy
              </button>
            </div>
          ) : (
            <div className="text-gray-400 text-center">No recently shortened URL yet.</div>
          )}
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
