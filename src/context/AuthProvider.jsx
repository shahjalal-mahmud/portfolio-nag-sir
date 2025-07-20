import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../firebase";
import AuthContext from "./AuthContext";

const TEACHER_EMAIL = "mahmud.nubtk@gmail.com"; // Your teacher's email

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (
        firebaseUser &&
        firebaseUser.email === TEACHER_EMAIL &&
        firebaseUser.emailVerified
      ) {
        setUser(firebaseUser);
      } else {
        setUser(null);
        if (firebaseUser) {
          if (!firebaseUser.emailVerified) {
            await sendEmailVerification(firebaseUser);
            alert("Please verify your email address. A verification email has been sent.");
          }
          signOut(auth); // Log out if not verified or not teacher
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      if (email !== TEACHER_EMAIL) {
        throw new Error("Access restricted to authorized users only");
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const currentUser = userCredential.user;

      if (!currentUser.emailVerified) {
        await sendEmailVerification(currentUser);
        throw new Error("Email not verified. A verification email has been sent.");
      }

      return currentUser;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
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
