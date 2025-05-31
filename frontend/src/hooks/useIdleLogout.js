import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const IDLE_TIMEOUT = 20 * 60 * 1000; // 20 minutes in milliseconds

export default function useIdleLogout() {
  const navigate = useNavigate();
  const timerRef = useRef(null);

  // Function to reset the idle timer
  // and log out the user if idle for too long
  const resetTimer = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      await supabase.auth.signOut();
      navigate('/login');
    }, IDLE_TIMEOUT);
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    
    // Add event listeners to reset the timer on user activity
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer(); // Initialize on mount

    return () => {
        // Cleanup: clear the timer and remove event listeners
        clearTimeout(timerRef.current);
        // Remove all event listeners
        events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, []);
}