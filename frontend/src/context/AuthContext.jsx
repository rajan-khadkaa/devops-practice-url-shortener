import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        try {
          // Fetch user data from backend
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/my-urls`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUser({
            uid: firebaseUser.uid,
            token,
            name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
            email: firebaseUser.email,
            profileImage:
              firebaseUser.photoURL ||
              "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
            emailVerified: firebaseUser.emailVerified,
          });
        } catch (error) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// import { createContext, useContext, useEffect, useState } from "react";
// import { auth } from "../firebase";
// import { onAuthStateChanged } from "firebase/auth";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//       if (firebaseUser) {
//         const token = await firebaseUser.getIdToken();
//         console.log("current user info is: ", firebaseUser);
//         setUser({
//           uid: firebaseUser.uid,
//           token,
//           name: firebaseUser.displayName,
//           email: firebaseUser.email,
//         });
//       } else {
//         setUser(null);
//       }
//       setLoading(false);
//     });
//     return unsubscribe;
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
