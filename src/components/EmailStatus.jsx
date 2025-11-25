// src/components/EmailStatus.jsx
import React, { useState, useEffect } from 'react';

const EmailStatus = ({ emailStatus, lastEmailSent, nextEmailIn }) => {
  const [timeUntilNext, setTimeUntilNext] = useState('');

  useEffect(() => {
    if (!lastEmailSent) return;

    const updateTimer = () => {
      const now = new Date();
      const nextEmail = new Date(lastEmailSent.getTime() + nextEmailIn);
      const diff = nextEmail - now;

      if (diff <= 0) {
        setTimeUntilNext('Sending now...');
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeUntilNext(`${minutes}m ${seconds}s`);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [lastEmailSent, nextEmailIn]);

  if (!emailStatus) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 mb-6">
        <p className="text-gray-600 text-sm">📧 Email notifications initializing...</p>
      </div>
    );
  }

  return (
    <div className={`rounded-lg p-4 mb-6 ${
      emailStatus.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-2">
            {emailStatus.success ? '✅ Email Notification Sent' : '❌ Email Sending Failed'}
          </h3>
          
          <div className="space-y-1 text-sm">
            <p className="text-gray-700">
              <strong>Status:</strong> {emailStatus.message}
            </p>
            
            {emailStatus.taskCount > 0 && (
              <p className="text-gray-700">
                <strong>Tasks Sent:</strong> {emailStatus.taskCount} pending task{emailStatus.taskCount > 1 ? 's' : ''}
              </p>
            )}
            
            {emailStatus.sentAt && (
              <p className="text-gray-600">
                <strong>Sent At:</strong> {emailStatus.sentAt}
              </p>
            )}
            
            {timeUntilNext && (
              <p className="text-gray-600">
                <strong>Next Email:</strong> in {timeUntilNext}
              </p>
            )}
          </div>
        </div>

        <div className="ml-4">
          <span className="text-3xl">
            {emailStatus.success ? '📧' : '⚠️'}
          </span>
        </div>
      </div>

      {/* Progress bar for next email */}
      {lastEmailSent && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
              style={{
                width: `${Math.min(100, ((Date.now() - lastEmailSent.getTime()) / nextEmailIn) * 100)}%`
              }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-right">
            Automatic email every 20 minutes
          </p>
        </div>
      )}
    </div>
  );
};

export default EmailStatus;