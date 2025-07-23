import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../firebase";
import AuthContext from "./AuthContext";

// Get authorized emails from environment variable
const AUTHORIZED_EMAILS = import.meta.env.VITE_AUTHORIZED_EMAILS 
  ? import.meta.env.VITE_AUTHORIZED_EMAILS.split(',').map(email => email.trim().toLowerCase())
  : [];

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser &&
          AUTHORIZED_EMAILS.includes(firebaseUser.email) &&
          firebaseUser.emailVerified) {
          setUser(firebaseUser);
        } else {
          setUser(null);
          if (firebaseUser) {
            if (!firebaseUser.emailVerified) {
              await sendEmailVerification(firebaseUser);
              console.log("Verification email sent");
            }
            await signOut(auth);
          }
        }
      } catch (error) {
        console.error("Auth state error:", error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      if (!AUTHORIZED_EMAILS.includes(email)) {
        throw new Error("Access restricted to authorized users only");
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      if (!userCredential.user.emailVerified) {
        await sendEmailVerification(userCredential.user);
        await signOut(auth); // Immediate sign out if not verified
        throw new Error("Email not verified. Please check your inbox.");
      }

      return userCredential.user;
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Re-throw for component-level handling
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      return true; // Indicate success
    } catch (error) {
      console.error("Logout error:", error);
      throw error; // Re-throw for error handling in components
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;