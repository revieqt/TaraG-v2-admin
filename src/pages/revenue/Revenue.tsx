import { useState, useEffect } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { BACKEND_URL } from '@/constants/Config';

export default function Revenue() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const primaryColor = useThemeColor({}, "primary");
  const secondaryColor = useThemeColor({}, "secondary");

  return (
    <div
      style={{ backgroundColor }}
      className="min-h-screen p-6 md:p-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 style={{ color: textColor }} className="text-4xl font-bold font-poppins mb-2">
            Ad Revenue
          </h1>
          <p style={{ color: textColor }} className="text-lg opacity-70 font-poppins">
            Manage and view all registered users on the platform
          </p>
        </div>

        
      </div>
    </div>
  );
}
