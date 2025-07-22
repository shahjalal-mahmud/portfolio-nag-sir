import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../src/firebase';

const useHeroData = () => {
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Set up the real-time listener
    const docRef = doc(db, "portfolio", "hero");
    
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        try {
          setLoading(true);
          if (docSnap.exists()) {
            setHeroData(docSnap.data());
          } else {
            // Set default data if document doesn't exist
            setHeroData({
              name: "ANINDYA NAG",
              profession: "Lecturer, Dept. of Computer Science & Engineering\nNorthern University of Business and Technology Khulna",
              location: {
                text: "Northern University of Business and Technology Khulna, Khulna-9100, Bangladesh",
                link: "https://maps.app.goo.gl/sr7kWTtaCYLGGRM87"
              },
              email: "anindyanag@ieee.org",
              phone: "+880 1795617168",
              socialLinks: []
            });
          }
        } catch (err) {
          setError(err);
          console.error("Error processing snapshot:", err);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        // Error callback for the listener
        setError(err);
        console.error("Error listening to document:", err);
        setLoading(false);
      }
    );

    // Cleanup function to unsubscribe when component unmounts
    return () => unsubscribe();
  }, []);

  return { heroData, loading, error };
};

export default useHeroData;