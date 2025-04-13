import React, { useState, useEffect } from "react";
import LogoDark from "../assets/images/vyapaar-dark.png";
import Logo from "../assets/images/vyapaar.png";
import { ThemeToggle } from "../assets/ThemeToggle";
import { useMediaQuery } from "@mantine/hooks";
import ProfileToolTip from "../assets/profileTooltip";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileTooltip, setShowProfileTooltip] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const themeMode = localStorage.getItem("mantine-color-scheme-value") === "dark" ? "dark" : "light";
  const location = useLocation();
  const HomePage = location.pathname === "/";
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const checkIsMobile = () => {
      const match = window.matchMedia('(max-width: 768px)');
      setIsMobile(match.matches);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    const checkUser = () => {
      const user = localStorage.getItem('token');
      return user ? "hello" : null;
    };
    const user = checkUser();
    if(user){
      alert("You are logged in");
    }
  })
 
  const toggleProfileTooltip = () => {
    if (isMobile) {
      setShowProfileTooltip((prev) => !prev);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".profile-container")) {
        setShowProfileTooltip(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
          <nav className={`flex justify-between items-center ${HomePage ? "bg-black opactity-50 !text-white" : "bg-[var(--color-primary)] text-[var(--color-heading)]"}  w-screen px-5 py-4`}>
            {/* Logo */}
            <a className="text-3xl font-bold font-heading" href="/">
              <img className="h-20 w-60" src={themeMode === "dark" ? LogoDark : Logo} alt="logo" />
            </a>

            {/* Desktop Nav Links */}
            <ul className="hidden md:flex text-[var(--color-heading)] px-4 mx-auto font-semibold font-heading space-x-12">
              <li><a className="hover:text-purple-500" href="/">Home</a></li>
              <li><a className="hover:text-purple-500" href="#">Categories</a></li>
              <li><a className="hover:text-purple-500" href="#">About</a></li>
              <li><a className="hover:text-purple-500" href="#">Contact Us</a></li>
              <li><a className="hover:text-purple-500" href="#">Add Product</a></li>
            </ul>

            {/* Mobile Menu Toggler + Icons */}
            <div className="flex text-[var(--color-heading)] items-center space-x-4">
              {/* Mobile Menu Toggler */}
              <button className="md:hidden" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Cart Icon */}
              <div className="relative">
                <a className="flex items-center text-[var(--color-heading)] hover:text-purple-600" href="#">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </a>
              </div>

              {/* Profile Icon with Tooltip */}
              <div
                className="relative profile-container"
                onMouseEnter={!isMobile ? () => setShowProfileTooltip(true) : undefined}
                onMouseLeave={!isMobile ? () => setShowProfileTooltip(false) : undefined}
                onClick={toggleProfileTooltip}
              >
                <ProfileToolTip isVisible={showProfileTooltip} />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-[var(--color-primary)] text-[var(--color-heading)] p-4 absolute w-full shadow-md z-50">
              <ul className="flex flex-col space-y-4">
                <li><a href="/" className="block hover:text-gray-500">Home</a></li>
                <li><a href="#" className="block hover:text-gray-500">Categories</a></li>
                <li><a href="#" className="block hover:text-gray-500">About</a></li>
                <li><a href="#" className="block hover:text-gray-500">Contact Us</a></li>
                <li><a href="#" className="block hover:text-gray-500">Add Product</a></li>
              </ul>
            </div>
          )}
    </>
  );
};

export default Navbar;