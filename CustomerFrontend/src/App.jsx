import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/Home";
import ServicesPage from "./pages/Services";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";
import BookAppointmentPage from "./pages/BookAppointment";

// Layout wrapper that includes Navbar + Footer
const Layout = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-[#0d0d0f]">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/services"
          element={
            <Layout>
              <ServicesPage />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <AboutPage />
            </Layout>
          }
        />
        <Route
          path="/contact"
          element={
            <Layout>
              <ContactPage />
            </Layout>
          }
        />
        <Route
          path="/book-appointment"
          element={
            <Layout>
              <BookAppointmentPage />
            </Layout>
          }
        />
        {/* Fallback */}
        <Route
          path="*"
          element={
            <Layout>
              <div
                className="min-h-screen flex flex-col items-center justify-center text-center px-4"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                <div className="text-6xl mb-4 opacity-20">404</div>
                <h1
                  className="text-3xl font-bold text-white mb-3"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  Page Not{" "}
                  <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
                    Found
                  </span>
                </h1>
                <p className="text-white/40 text-sm mb-8">
                  The page you're looking for doesn't exist.
                </p>
                <a
                  href="/"
                  className="px-7 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-rose-500/20 transition-all hover:from-rose-400 hover:to-pink-400"
                >
                  Go Home
                </a>
              </div>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
