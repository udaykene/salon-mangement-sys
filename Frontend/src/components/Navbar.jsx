import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1023);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Track screen size
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1023);
      if (window.innerWidth > 1023) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Track scroll for navbar style
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className={`z-50 w-full sticky top-0 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg' 
        : 'bg-white/90 backdrop-blur-sm shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Centered on Mobile, Left on Desktop */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:shadow-rose-500/50 transition-all">
              <span className="text-white text-xl">✨</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600">
                Skin & Soul Studio
              </h1>
              <span className="text-xs text-gray-500 -mt-1 hidden sm:block">Beauty & Wellness</span>
            </div>
          </Link>

          {/* Desktop Navigation Links - Centered */}
          {isDesktop && (
            <div className="flex items-center gap-8">
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-rose-600 transition-colors font-medium relative group"
              >
                About Us
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link 
                to="/projects" 
                className="text-gray-700 hover:text-rose-600 transition-colors font-medium relative group"
              >
                Gallery
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link 
                to="/services" 
                className="text-gray-700 hover:text-rose-600 transition-colors font-medium relative group"
              >
                Services
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-700 hover:text-rose-600 transition-colors font-medium relative group"
              >
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>
          )}

          {/* Desktop Right Section */}
          {isDesktop && (
            <div className="flex items-center gap-3">
              <Link 
                to="/admin/dashboard" 
                className="text-rose-600 hover:text-rose-700 transition-colors font-medium px-3 py-2"
              >
                Dashboard
              </Link>

              <Link
                to="/login"
                className="text-gray-700 hover:text-rose-600 transition-colors font-medium px-3 py-2"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold rounded-full shadow-md shadow-rose-500/30 transition-all"
              >
                Book Now
              </Link>
              
              {/* PROFILE WRAPPER */}
              <div className="relative flex items-center">
                <button
                  ref={buttonRef}
                  className="flex items-center gap-1 px-2 py-2 rounded-full hover:bg-rose-50 transition-all outline-none group"
                  onClick={() => setDropdownOpen((open) => !open)}
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                  type="button"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center text-rose-600 border-2 border-rose-200 group-hover:border-rose-300 transition-all">
                    <i className="ri-user-3-fill text-lg"></i>
                  </div>
                  <i className={`ri-arrow-down-s-line text-gray-600 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}></i>
                </button>

                {/* DROPDOWN MENU */}
                {dropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute top-[48px] right-0 flex flex-col bg-white min-w-[180px] shadow-2xl rounded-xl border border-gray-100 overflow-hidden z-[999]"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="absolute -top-4 left-0 w-full h-4 bg-transparent"></div>
                    <Link
                      to="/activity"
                      className="px-5 py-3 hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 hover:text-rose-600 border-b border-gray-100 transition-all flex items-center gap-3"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <i className="ri-calendar-check-line"></i>
                      <span>My Activity</span>
                    </Link>
                    <Link
                      to="/history"
                      className="px-5 py-3 hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 hover:text-rose-600 border-b border-gray-100 transition-all flex items-center gap-3"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <i className="ri-history-line"></i>
                      <span>History</span>
                    </Link>
                    <Link
                      to="/profile"
                      className="px-5 py-3 hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 hover:text-rose-600 transition-all flex items-center gap-3"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <i className="ri-user-line"></i>
                      <span>View Profile</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile menu toggle button */}
          {!isDesktop && (
            <button
              className="text-2xl p-2 hover:bg-rose-50 rounded-full transition-colors text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <i className={mobileMenuOpen ? "ri-close-line" : "ri-menu-line"}></i>
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {!isDesktop && mobileMenuOpen && (
          <div className="pb-4 border-t border-gray-100">
            <div className="flex flex-col gap-1 mt-4">
              <Link 
                to="/about" 
                className="px-4 py-3 hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 hover:text-rose-600 rounded-lg transition-all font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                to="/projects" 
                className="px-4 py-3 hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 hover:text-rose-600 rounded-lg transition-all font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Gallery
              </Link>
              <Link 
                to="/services" 
                className="px-4 py-3 hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 hover:text-rose-600 rounded-lg transition-all font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                to="/contact" 
                className="px-4 py-3 hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 hover:text-rose-600 rounded-lg transition-all font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              
              <div className="border-t border-gray-100 mt-2 pt-2"></div>
              
              <Link 
                to="/admin/dashboard" 
                className="px-4 py-3 text-rose-600 font-medium hover:bg-rose-50 rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>

              <Link
                to="/login"
                className="px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="mx-4 mt-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-full shadow-lg shadow-rose-500/30 text-center hover:from-rose-600 hover:to-pink-600 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Book Appointment
              </Link>

              <div className="border-t border-gray-100 mt-4 pt-2"></div>

              <button
                className="flex items-center gap-3 px-4 py-3 hover:bg-rose-50 rounded-lg transition-all font-medium text-gray-700"
                onClick={() => setDropdownOpen((open) => !open)}
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center text-rose-600 border-2 border-rose-200">
                  <i className="ri-user-3-fill text-lg"></i>
                </div>
                <span className="flex-1 text-left">Profile Menu</span>
                <i className={`ri-arrow-down-s-line transition-transform ${dropdownOpen ? "rotate-180" : ""}`}></i>
              </button>

              {dropdownOpen && (
                <div className="flex flex-col bg-gradient-to-br from-rose-50/50 to-pink-50/50 rounded-lg overflow-hidden mx-2 border border-rose-100">
                  <Link
                    to="/activity"
                    className="px-6 py-3 hover:bg-white hover:text-rose-600 border-b border-rose-100 transition-all flex items-center gap-3"
                    onClick={() => {
                      setDropdownOpen(false);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <i className="ri-calendar-check-line"></i>
                    <span>My Activity</span>
                  </Link>
                  <Link
                    to="/history"
                    className="px-6 py-3 hover:bg-white hover:text-rose-600 border-b border-rose-100 transition-all flex items-center gap-3"
                    onClick={() => {
                      setDropdownOpen(false);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <i className="ri-history-line"></i>
                    <span>History</span>
                  </Link>
                  <Link
                    to="/profile"
                    className="px-6 py-3 hover:bg-white hover:text-rose-600 transition-all flex items-center gap-3"
                    onClick={() => {
                      setDropdownOpen(false);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <i className="ri-user-line"></i>
                    <span>View Profile</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;