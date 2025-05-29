
import { useState, useEffect } from "react"
import LogoDark from "../assets/images/vyapaar-dark.png"
import Logo from "../assets/images/vyapaar.png"
import { ThemeToggle } from "../assets/ThemeToggle"
import ProfileToolTip from "../assets/profileTooltip"
import { useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showProfileTooltip, setShowProfileTooltip] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const themeMode = localStorage.getItem("mantine-color-scheme-value") === "dark" ? "dark" : "light"
  const location = useLocation()
  const HomePage = location.pathname === "/"
  const [cartCount, setCartCount] = useState(0)
  const {getUserRole} = useAuth();
  const role = getUserRole();

  useEffect(() => {
    const checkIsMobile = () => {
      const match = window.matchMedia("(max-width: 768px)")
      setIsMobile(match.matches)
    }

    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  // Scroll detection effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const checkUser = () => {
      const user = localStorage.getItem("token")
      return user ? "hello" : null
    }
    const user = checkUser()
    if (user) {
      alert("You are logged in")
    }
  })

  const toggleProfileTooltip = () => {
    if (isMobile) {
      setShowProfileTooltip((prev) => !prev)
    }
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".profile-container")) {
        setShowProfileTooltip(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  // Dynamic navbar classes based on scroll state
  const getNavbarClasses = () => {
    const baseClasses = "flex justify-between items-center w-screen px-5 py-4 transition-all duration-300 ease-in-out"

    if (isScrolled) {
      // Sticky with blur effect
      return `${baseClasses} fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 dark:bg-black/80 shadow-lg border-b border-gray-200/20 dark:border-gray-700/20`
    } else if (HomePage) {
      // Original homepage styling
      return `${baseClasses} bg-black !text-white`
    } else {
      // Original non-homepage styling
      return `${baseClasses} bg-[var(--color-primary)] text-[var(--color-heading)]`
    }
  }

  // Dynamic text color classes
  const getTextClasses = () => {
    if (isScrolled) {
      return "text-gray-900 dark:text-white"
    } else if (HomePage) {
      return "text-white"
    } else {
      return "text-[var(--color-heading)]"
    }
  }

  // Dynamic logo height for sticky state
  const getLogoClasses = () => {
    return isScrolled ? "h-12 w-36 transition-all duration-300" : "h-20 w-60 transition-all duration-300"
  }
  const getLogoSrc = () => {
    return isScrolled ? Logo : LogoDark
  }

  return (
    <>
      <nav className={getNavbarClasses()}>
        {/* Logo */}
        <a className="text-3xl font-bold font-heading" href="/">
          <img className={getLogoClasses()} src={getLogoSrc()} alt="logo" />
        </a>

        {/* Desktop Nav Links */}
        <ul className={`hidden md:flex px-4 mx-auto font-semibold font-heading space-x-12 ${getTextClasses()}`}>
          <li>
            <a className="hover:text-purple-500 transition-colors duration-200" href="/">
              Home
            </a>
          </li>
          <li>
            <a className="hover:text-purple-500 transition-colors duration-200" href="/#category">
              Categories
            </a>
          </li>
          <li>
            <a className="hover:text-purple-500 transition-colors duration-200" href="#">
              About
            </a>
          </li>
          <li>
            <a className="hover:text-purple-500 transition-colors duration-200" href="#">
              Contact Us
            </a>
          </li>
          {role === "manufacturer" && (
          <li>
            <a className="hover:text-purple-500 transition-colors duration-200" href="/manufacturer/products">
              Add Product
            </a>
          </li>
          )}
        </ul>

        {/* Mobile Menu Toggler + Icons */}
        <div className={`flex items-center space-x-4 ${getTextClasses()}`}>
          {/* Mobile Menu Toggler */}
          <button
            className="md:hidden transition-colors duration-200"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Cart Icon */}
          <div className="relative">
            <a className="flex items-center hover:text-purple-600 transition-colors duration-200" href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
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
        <div
          className={`md:hidden p-4 absolute w-full shadow-md z-40 transition-all duration-300 ${
            isScrolled
              ? "top-16 backdrop-blur-md bg-white/90 dark:bg-black/90 border-b border-gray-200/20 dark:border-gray-700/20"
              : "bg-[var(--color-primary)] text-[var(--color-heading)]"
          }`}
        >
          <ul className={`flex flex-col space-y-4 ${getTextClasses()}`}>
            <li>
              <a href="/" className="block hover:text-purple-500 transition-colors duration-200">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="block hover:text-purple-500 transition-colors duration-200">
                Categories
              </a>
            </li>
            <li>
              <a href="#" className="block hover:text-purple-500 transition-colors duration-200">
                About
              </a>
            </li>
            <li>
              <a href="#" className="block hover:text-purple-500 transition-colors duration-200">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="block hover:text-purple-500 transition-colors duration-200">
                Add Product
              </a>
            </li>
          </ul>
        </div>
      )}

      {/* Spacer to prevent content jump when navbar becomes fixed */}
      {isScrolled && <div className="h-16 md:h-20"></div>}
    </>
  )
}

export default Navbar

