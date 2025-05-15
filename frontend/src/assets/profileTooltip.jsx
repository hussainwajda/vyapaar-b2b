import React, { useState, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "../context/AuthContext";


const ProfileToolTip = () => {
  const [open, setOpen] = useState(false);
  const {user, logout} = useAuth();

  // Handle close when clicking outside (for mobile)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".profile-container")) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <TooltipProvider>
      <div className="relative profile-container">
        <Tooltip open={open} onOpenChange={setOpen}>
          <TooltipTrigger asChild>
            <button
              className="flex items-center space-x-2 text-[var(--color-heading)] hover:text-purple-600 font-medium cursor-pointer md:mr-2"
              onClick={() => setOpen(!open)} // Toggle on mobile
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </TooltipTrigger>

          <TooltipContent side="bottom" align="end" className="bg-[var(--color-primary)] shadow-lg rounded-md w-48 p-3 border border-gray-200">
          {user ? (
              // If user is logged in
              <>
                <p className="text-sm text-[var(--color-heading)] font-semibold">Hello, {user.Username}</p>
                <p className="text-xs text-gray-500">Logout your account</p>

                <button
                  onClick={logout}
                  className="block text-center cursor-pointer bg-red-600 text-white text-sm font-medium py-2 rounded-md mt-2 w-full"
                >
                  Logout
                </button>

                <div className="mt-2 border-t pt-2">
                  <a href="/orders" className="block text-sm text-[var(--color-heading)] hover:bg-[var(--color-secondary)] px-2 py-1 rounded">
                    🛒 My Orders
                  </a>
                  <a href="/orders" className="block text-sm text-[var(--color-heading)] hover:bg-[var(--color-secondary)] px-2 py-1 rounded">
                    🔔 Notifications
                  </a>
                  <button className="block text-sm text-red-600 hover:bg-red-100 px-2 py-1 rounded w-full text-left">
                    ❌ Delete Account
                  </button>
                </div>
              </>
            ) : (
              // If no user is logged in
              <>
                <p className="text-sm font-semibold text-[var(--color-heading)]">Hello, User</p>
                <p className="text-xs text-gray-500">To access your account</p>

                <a href="/auth" className="block text-center bg-purple-600 text-white text-sm font-medium py-2 rounded-md mt-2">
                  Sign Up
                </a>
              </>
            )}
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default ProfileToolTip;
