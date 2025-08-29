import React, { useState, useEffect } from "react";

const EnhancedFeaturedProjects = () => {
  const [scrollY, setScrollY] = useState(0);
  const [visibleElements, setVisibleElements] = useState(new Set());

  const projects = [
    {
      name: "Cosmic Journey",
      year: "2024",
      type: "3D Animation",
      color: "from-gray-700 to-gray-900",
      icon: "",
      description: "Interstellar voyage through infinite space",
      status: "Featured",
      image:
        "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=300&fit=crop",
    },
    {
      name: "Digital Dreams",
      year: "2023",
      type: "Motion Graphics",
      color: "from-gray-600 to-black",
      icon: "",
      description: "Surreal digital landscapes come alive",
      status: "Award Winner",
      image:
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
    },
    {
      name: "Future Vision",
      year: "2023",
      type: "UI/UX",
      color: "from-black to-gray-700",
      icon: "",
      description: "Tomorrow's interfaces today",
      status: "New",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    },
    {
      name: "Brand Orbit",
      year: "2022",
      type: "Branding",
      color: "from-gray-800 to-gray-600",
      icon: "",
      description: "Revolutionary brand transformations",
      status: "Popular",
      image:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
    },
    {
      name: "Interactive Space",
      year: "2022",
      type: "Web Experience",
      color: "from-gray-900 to-black",
      icon: "",
      description: "Immersive web environments",
      status: "Trending",
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop",
    },
    {
      name: "Visual Symphony",
      year: "2021",
      type: "VFX",
      color: "from-black to-gray-800",
      icon: "",
      description: "Cinematic visual masterpieces",
      status: "Classic",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Check for visible elements
      const elements = document.querySelectorAll("[data-reveal]");
      const newVisibleElements = new Set();

      elements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const isElementVisible =
          rect.top < window.innerHeight && rect.bottom > 0;

        if (isElementVisible) {
          newVisibleElements.add(index);
        }
      });

      setVisibleElements(newVisibleElements);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const generateParticles = (count = 100) => {
    return Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        className="absolute rounded-full opacity-40 animate-pulse"
        style={{
          width: `${2 + Math.random() * 4}px`,
          height: `${2 + Math.random() * 4}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          background: i % 2 === 0 ? "#ffffff" : "#d1d5db",
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${2 + Math.random() * 4}s`,
          transform: `translate(${Math.sin((scrollY + i) * 0.01) * 10}px, ${
            Math.cos((scrollY + i) * 0.01) * 10
          }px)`,
        }}
      />
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Featured":
        return "from-white to-gray-200";
      case "Award Winner":
        return "from-gray-200 to-white";
      case "New":
        return "from-white to-gray-300";
      case "Popular":
        return "from-gray-100 to-gray-300";
      case "Trending":
        return "from-white to-gray-100";
      case "Classic":
        return "from-gray-300 to-white";
      default:
        return "from-white to-gray-200";
    }
  };

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0">{generateParticles(100)}</div>

      {/* Floating geometric elements */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="absolute opacity-10"
            style={{
              width: `${30 + Math.random() * 50}px`,
              height: `${30 + Math.random() * 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `linear-gradient(${
                Math.random() * 360
              }deg, rgba(255, 255, 255, 0.2), rgba(209, 213, 219, 0.2))`,
              borderRadius: Math.random() > 0.5 ? "50%" : "20%",
              animation: `float ${
                8 + Math.random() * 12
              }s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-16 text-white">
          <span
            className="bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent"
            style={{ textShadow: "0 0 50px rgba(255,255,255,0.5)" }}
          >
            FEATURED PROJECTS
          </span>
        </h2>

        <div className="relative">
          <div
            className="flex space-x-6 transition-transform duration-1000 ease-out pb-8"
            style={{
              transform: `translateX(-${
                (scrollY * 0.5) % (projects.length * 300)
              }px)`,
            }}
          >
            {[...projects, ...projects].map((project, index) => (
              <div
                key={`${project.name}-${index}`}
                data-reveal
                className={`flex-shrink-0 w-72 h-80 rounded-2xl bg-gradient-to-br ${project.color} p-6 flex flex-col justify-between transform hover:scale-105 hover:-translate-y-4 transition-all duration-500 relative overflow-hidden group cursor-pointer border border-white/20 backdrop-blur-sm`}
                style={{
                  boxShadow:
                    "0 20px 60px rgba(0,0,0,0.4), 0 0 30px rgba(255,255,255,0.05)",
                  opacity: visibleElements.has(index) ? 1 : 0.7,
                  transform: visibleElements.has(index)
                    ? "translateY(0px) scale(1)"
                    : "translateY(30px) scale(0.95)",
                  transition: "all 0.8s ease-out",
                  transitionDelay: `${(index % projects.length) * 100}ms`,
                }}
              >
                {/* Status badge */}
                <div className="absolute top-4 right-4 z-20">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${getStatusColor(
                      project.status
                    )} text-black backdrop-blur-sm border border-white/30`}
                    style={{ boxShadow: "0 4px 15px rgba(255,255,255,0.2)" }}
                  >
                    {project.status}
                  </span>
                </div>

                {/* Background image with overlay */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-80 group-hover:opacity-70 transition-opacity duration-500`}
                  ></div>
                </div>

                {/* Animated border glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
                    animation: "borderGlow 2s ease-in-out infinite",
                  }}
                ></div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-sm font-semibold opacity-80 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30">
                      {project.year}
                    </span>
                    <div className="text-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 filter drop-shadow-lg">
                      {project.icon}
                    </div>
                  </div>

                  <h3
                    className="text-2xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300 text-white bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent"
                    style={{ textShadow: "0 0 30px rgba(255,255,255,0.3)" }}
                  >
                    {project.name}
                  </h3>

                  <p className="text-base opacity-90 text-gray-200 group-hover:text-white transition-colors duration-300 mb-2">
                    {project.type}
                  </p>

                  <p className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                    {project.description}
                  </p>
                </div>

                {/* Interactive bottom section */}
                <div className="relative z-10 w-full h-24 bg-black/30 rounded-xl backdrop-blur-sm flex items-center justify-center group-hover:bg-black/40 transition-all duration-300 border border-white/10 group-hover:border-white/30 overflow-hidden">
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>

                  {/* Center content */}
                  <div className="relative flex items-center space-x-3">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                      <div className="text-white font-semibold text-sm">
                        VIEW PROJECT
                      </div>
                      <div className="text-gray-300 text-xs">
                        {project.type}
                      </div>
                    </div>
                  </div>

                  {/* Corner decorative elements */}
                  <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Hover glow effect */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 70%)",
                    filter: "blur(1px)",
                  }}
                ></div>

                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none"></div>

                {/* Floating sparkles */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  {Array.from({ length: 6 }, (_, i) => (
                    <div
                      key={i}
                      className="absolute text-white/60"
                      style={{
                        left: `${20 + Math.random() * 60}%`,
                        top: `${20 + Math.random() * 60}%`,
                        fontSize: "8px",
                        animation: `sparkle ${
                          1 + Math.random()
                        }s ease-in-out infinite`,
                        animationDelay: `${i * 0.2}s`,
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation arrows */}
          <div className="absolute top-1/2 -left-6 transform -translate-y-1/2 z-20">
            <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 group">
              <span className="transform group-hover:-translate-x-1 transition-transform duration-300">
                ←
              </span>
            </button>
          </div>

          <div className="absolute top-1/2 -right-6 transform -translate-y-1/2 z-20">
            <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 group">
              <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </button>
          </div>

          {/* Progress indicator */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {projects.map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-white/30 transition-all duration-500"
                style={{
                  background:
                    i === Math.floor((scrollY * 0.1) % projects.length)
                      ? "linear-gradient(90deg, #ffffff, #d1d5db)"
                      : "rgba(255,255,255,0.3)",
                  transform:
                    i === Math.floor((scrollY * 0.1) % projects.length)
                      ? "scale(1.5)"
                      : "scale(1)",
                  boxShadow:
                    i === Math.floor((scrollY * 0.1) % projects.length)
                      ? "0 0 10px rgba(255,255,255,0.5)"
                      : "none",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
        }

        @keyframes borderGlow {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .group:hover .floating-icon {
          animation: float 2s ease-in-out infinite;
        }

        /* Enhanced card glow on hover */
        .group:hover {
          filter: drop-shadow(0 0 20px rgba(255,255,255,0.1));
        }

        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #1a1a1a;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #ffffff, #9ca3af);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #f9fafb, #d1d5db);
        }
      `}</style>
    </section>
  );
};

export default EnhancedFeaturedProjects;
