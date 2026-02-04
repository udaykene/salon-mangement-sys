import React, { useState } from "react";
import Certifications from "../components/Certifications";

const SalonGallery = () => {
  const [filter, setFilter] = useState("All");

  const projects = [
    {
      id: 1,
      title: "Bridal Makeover",
      category: "Makeup",
      location: "Wedding Special",
      image:
        "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&q=80",
      status: "Featured",
    },
    {
      id: 2,
      title: "Hair Color Transformation",
      category: "Hair",
      location: "Balayage & Highlights",
      image:
        "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80",
      status: "Popular",
    },
    {
      id: 3,
      title: "Luxury Spa Experience",
      category: "Spa",
      location: "Full Body Treatment",
      image:
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      status: "New",
    },
    {
      id: 4,
      title: "Modern Haircut & Style",
      category: "Hair",
      location: "Trendy Cuts",
      image:
        "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=800&q=80",
      status: "Featured",
    },
    {
      id: 5,
      title: "Glamour Makeup",
      category: "Makeup",
      location: "Evening Look",
      image:
        "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=800&q=80",
      status: "Popular",
    },
    {
      id: 6,
      title: "Relaxing Massage",
      category: "Spa",
      location: "Aromatherapy",
      image:
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
      status: "New",
    },
  ];

  const filteredProjects =
    filter === "All"
      ? projects
      : projects.filter((p) => p.category === filter);

  return (
    <div className="bg-gray-50 w-full overflow-x-hidden">

      {/* HEADER */}
      <div className="relative bg-gray-900 py-14 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?q=80&w=1740&auto=format&fit=crop"
            className="w-full h-full object-cover"
            alt=""
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
              Gallery
            </span>
          </h1>
          <p className="text-lg text-rose-300 italic">
            Transformations That Inspire Confidence
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {["All", "Hair", "Makeup", "Spa"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filter === tab
                  ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-white rounded-xl overflow-hidden border shadow-sm hover:shadow-xl transition-all flex flex-col"
            >
              <div className="relative h-60 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {project.status}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <p className="text-rose-500 text-sm font-semibold uppercase mb-1">
                  {project.category}
                </p>
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-500 text-sm mb-6">
                  ✨ {project.location}
                </p>

                <button className="mt-auto w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-2 font-bold rounded-lg">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1740&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-rose-900/90 via-pink-900/85 to-rose-900/90"></div>

        <div className="relative max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Look?
          </h2>
          <p className="mb-8">
            Book your appointment today and experience the luxury treatment you deserve.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-rose-600 font-bold rounded-lg">
              Book Appointment
            </button>
            <button className="px-8 py-3 border-2 border-white font-bold rounded-lg">
              View Services
            </button>
          </div>
        </div>
      </div>

      {/* Testimonials (unchanged) */}
      {/* ...same testimonial section as before... */}

      {/* Trust Badges */}
      <Certifications />
    </div>
  );
};

export default SalonGallery;