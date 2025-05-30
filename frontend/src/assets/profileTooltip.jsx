import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"; // Import DropdownMenu components
import { useAuth } from "../context/AuthContext";
import NotificationModal from './NotificationModal'; // Adjust the path as needed
import axios from 'axios';
import {User} from "lucide-react"
const ProfileMenu = () => { // Renamed from ProfileToolTip for clarity
  const ServerUrl = import.meta.env.VITE_SERVER_URL;
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control NotificationModal
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for DropdownMenu

  // Fetch unread notification count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (user && user.UserAttributes && user.UserAttributes.length > 0) {
        try {
          const response = await axios.get(`${ServerUrl}/api/notifications/unread/count/${user.UserAttributes[0].Value}`);
          console.log("unread count",response.data);
          setUnreadCount(response.data.count);
        } catch (error) {
          console.error('Error fetching unread notification count:', error);
          setUnreadCount(0);
        }
      }
    };

    fetchUnreadCount();
    // Re-fetch on mount and user change. Consider a global state update or
    // a re-fetch trigger when a notification is marked as read in NotificationModal
  }, [user, isModalOpen]); // Added isModalOpen to re-fetch when modal closes (implies read status might change)

  

  const handleNotificationButtonClick = (e) => {
    e.preventDefault(); // Prevent default link behavior
    setIsModalOpen(true); // Open the notification modal
    setIsDropdownOpen(false); // Close the profile dropdown when modal opens
  };

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className="flex items-center space-x-2 font-medium hover:text-purple-600 cursor-pointer md:mr-2"
            aria-label="User profile menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {/* <User size={20} strokeWidth={1.5} className="text-red] hover:text-purple-600 font-medium cursor-pointer md:mr-2" /> */}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="bottom"
          align="end"
          className="bg-[var(--color-primary)] shadow-lg rounded-md w-48 p-3 border border-gray-200"
          // Keep the dropdown open if the notification modal is opening/open.
          // This prevents the dropdown from closing immediately after clicking the notification button.
          onMouseDown={(e) => {
            // Prevent immediate closing if the click target is part of the notification button
            if (e.target.closest('.notification-button-wrapper')) {
              e.preventDefault();
            }
          }}
        >
          {user ? (
            <>
              <p className="text-sm text-[var(--color-heading)] font-semibold mb-1">Hello, {user.Username}</p>
              <p className="text-xs text-gray-500 mb-2">Manage your account</p>

              <DropdownMenuItem asChild>
                <button
                  onClick={logout}
                  className="block text-center cursor-pointer bg-red-600 text-white text-sm font-medium py-2 rounded-md w-full"
                >
                  Logout
                </button>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-2 border-t border-gray-200" />

              <DropdownMenuItem asChild>
                <a href="/orders" className="block text-sm text-[var(--color-heading)] hover:bg-[var(--color-secondary)] px-2 py-1 rounded">
                  🛒 My Orders
                </a>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <div className="relative inline-block w-full notification-button-wrapper">
                  <a
                    href="#"
                    className="block text-sm text-[var(--color-heading)] hover:bg-[var(--color-secondary)] px-2 py-1 rounded"
                    onClick={handleNotificationButtonClick}
                  >
                    🔔 Notifications
                    {unreadCount > 0 && (
                      <span className="absolute ml-2-top-1 right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center -mt-1 mr-1">
                        {unreadCount}
                      </span>
                    )}
                  </a>
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-2 border-t border-gray-200" />

              <DropdownMenuItem asChild>
                <button className="block text-sm text-red-600 hover:bg-red-100 px-2 py-1 rounded w-full text-left">
                  ❌ Delete Account
                </button>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-[var(--color-heading)] mb-1">Hello, User</p>
              <p className="text-xs text-gray-500 mb-2">To access your account</p>

              <DropdownMenuItem asChild>
                <a href="/auth" className="block text-center bg-purple-600 text-white text-sm font-medium py-2 rounded-md">
                  Sign Up
                </a>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Render NotificationModal outside the DropdownMenu for proper portal behavior */}
      {user && ( 
        <NotificationModal
          userId={user.UserAttributes.find(attr => attr.Name === 'email').Value}
          opened={isModalOpen}
          onClose={() => setIsModalOpen(false)} // Callback to close modal
        />
      )}
    </>
  );
};

export default ProfileMenu;