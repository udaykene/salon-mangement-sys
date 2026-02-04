import React from 'react'
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Linkedin,
  Facebook,
  Twitter,
  Clock,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 py-12 sm:py-16 px-4 sm:px-6 md:px-16 font-sans">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 pb-12">
            {/* Company Info */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
                  <Sparkles size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-white text-xl font-bold">Glamour Salon</h2>
                  <p className="text-xs text-gray-400">Beauty & Wellness</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-gray-400">
                Experience luxury beauty treatments and transformative wellness services. 
                Where elegance meets expertise, creating unforgettable beauty experiences.
              </p>
              <div className="flex space-x-3">
                {[
                  { Icon: Instagram, color: "from-pink-500 to-rose-500" },
                  { Icon: Facebook, color: "from-blue-500 to-blue-600" },
                  { Icon: Twitter, color: "from-sky-400 to-blue-500" },
                  { Icon: Linkedin, color: "from-blue-600 to-blue-700" },
                ].map(({ Icon, color }, index) => (
                  <a
                    key={index}
                    href="#"
                    className={`p-2.5 bg-gradient-to-br ${color} rounded-full hover:scale-110 transition-transform shadow-md`}
                    aria-label={`Social media link ${index + 1}`}
                  >
                    <Icon size={18} className="text-white" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-bold mb-4 sm:mb-6 text-base sm:text-lg flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-rose-500 to-pink-500 rounded-full"></span>
                Quick Links
              </h3>
              <ul className="space-y-3 sm:space-y-3.5 text-sm">
                {[
                  { to: "/about", label: "About Us" },
                  { to: "/services", label: "Our Services" },
                  { to: "/projects", label: "Gallery" },
                  { to: "/team", label: "Our Team" },
                  { to: "/testimonials", label: "Testimonials" },
                  { to: "/blog", label: "Beauty Blog" },
                ].map((link) => (
                  <li key={link.to}>
                    <Link 
                      to={link.to} 
                      className="hover:text-rose-400 transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-0 h-0.5 bg-gradient-to-r from-rose-500 to-pink-500 group-hover:w-3 transition-all duration-300"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-white font-bold mb-4 sm:mb-6 text-base sm:text-lg flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-rose-500 to-pink-500 rounded-full"></span>
                Our Services
              </h3>
              <ul className="space-y-3 sm:space-y-3.5 text-sm">
                {[
                  "Hair Styling & Color",
                  "Spa & Massage Therapy",
                  "Bridal Makeup",
                  "Nail Art & Manicure",
                  "Facial Treatments",
                  "Beauty Packages",
                ].map((service) => (
                  <li key={service}>
                    <a 
                      href="#" 
                      className="hover:text-rose-400 transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-0 h-0.5 bg-gradient-to-r from-rose-500 to-pink-500 group-hover:w-3 transition-all duration-300"></span>
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Get In Touch */}
            <div>
              <h3 className="text-white font-bold mb-4 sm:mb-6 text-base sm:text-lg flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-rose-500 to-pink-500 rounded-full"></span>
                Get In Touch
              </h3>
              <div className="space-y-4 sm:space-y-5 text-sm">
                <div className="flex items-start space-x-3 group">
                  <div className="p-2 bg-gradient-to-br from-rose-500/20 to-pink-500/20 rounded-lg group-hover:from-rose-500/30 group-hover:to-pink-500/30 transition-all">
                    <Phone size={18} className="text-rose-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">+91 8252926242</p>
                    <p className="text-xs text-gray-500">Mon-Sat 9am-8pm</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 group">
                  <div className="p-2 bg-gradient-to-br from-rose-500/20 to-pink-500/20 rounded-lg group-hover:from-rose-500/30 group-hover:to-pink-500/30 transition-all">
                    <Mail size={18} className="text-rose-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium break-words">
                      glamour@salon.com
                    </p>
                    <p className="text-xs text-gray-500">
                      24hr response time
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 group">
                  <div className="p-2 bg-gradient-to-br from-rose-500/20 to-pink-500/20 rounded-lg group-hover:from-rose-500/30 group-hover:to-pink-500/30 transition-all">
                    <MapPin size={18} className="text-rose-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Artist Village, Maharashtra</p>
                    <p className="text-xs text-gray-500">India</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 group">
                  <div className="p-2 bg-gradient-to-br from-rose-500/20 to-pink-500/20 rounded-lg group-hover:from-rose-500/30 group-hover:to-pink-500/30 transition-all">
                    <Clock size={18} className="text-rose-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Opening Hours</p>
                    <p className="text-xs text-gray-500">Sun: 10am-6pm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="border-t border-white/10 pt-8 pb-8">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-white font-bold text-lg sm:text-xl mb-3">
                Subscribe to Our Beauty Newsletter
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Get exclusive tips, special offers, and beauty trends delivered to your inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3 bg-white/5 border border-white/10 rounded-full text-white placeholder:text-gray-500 focus:outline-none focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20 transition-all"
                />
                <button className="px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold rounded-full shadow-lg shadow-rose-500/30 transition-all whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center text-xs space-y-4 md:space-y-0">
            <p className="text-center md:text-left text-gray-400">
              © 2025 Glamour Salon. All rights reserved. Crafted with{" "}
              <span className="text-rose-500">♥</span>
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 sm:gap-6">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-gray-400 hover:text-rose-400 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;