// src/hooks/useTaskScheduler.js
import { useEffect, useRef, useState } from 'react';
import { sendTaskEmail } from '../services/emailService';

/**
 * Custom hook for scheduling task email notifications
 * Runs every 20 minutes (1200000ms)
 */
const useTaskScheduler = (tasks, userEmail, isEnabled = true) => {
  const [lastEmailSent, setLastEmailSent] = useState(null);
  const [emailStatus, setEmailStatus] = useState(null);
  const intervalRef = useRef(null);

  const INTERVAL_TIME = 20 * 60 * 1000; // 20 minutes in milliseconds
  // For testing: Use 2 minutes instead
  // const INTERVAL_TIME = 2 * 60 * 1000; // 2 minutes for testing

  useEffect(() => {
    if (!isEnabled || !userEmail) {
      return;
    }

    // Function to send email notification
    const sendNotification = async () => {
      console.log('⏰ Task Scheduler: Running email notification...');
      
      const result = await sendTaskEmail(tasks, userEmail);
      
      setEmailStatus({
        ...result,
        sentAt: new Date().toLocaleString()
      });
      
      setLastEmailSent(new Date());
    };

    // Send first email immediately on mount
    sendNotification();

    // Set up interval for recurring emails
    intervalRef.current = setInterval(() => {
      sendNotification();
    }, INTERVAL_TIME);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        console.log('🛑 Task Scheduler: Stopped');
      }
    };
  }, [tasks, userEmail, isEnabled]);

  return {
    lastEmailSent,
    emailStatus,
    nextEmailIn: INTERVAL_TIME
  };
};

export default useTaskScheduler;