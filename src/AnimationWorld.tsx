import React, { useState, useEffect, useRef } from "react";
import TrendyUserProfiles from "./TrendyUserProfiles";
import AnimationWorlds from "./ImageSwiper";
import NftMarketplace from "./NftMarketplace";

const AnimationWorld = () => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [visibleElements, setVisibleElements] = useState(new Set<number>());
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  const phases = [
    {
      title: "Welcome to our",
      subtitle: "ANIMATION WORLD",
      description: "Where creativity meets motion",
      gradient: "from-purple-600 via-pink-600 to-red-600",
    },
    {
      title: "Journey began in",
      subtitle: "2010",
      description: "Pioneering digital experiences",
      gradient: "from-blue-600 via-cyan-600 to-teal-600",
    },
    {
      title: "Evolved through",
      subtitle: "INNOVATION",
      description: "Pushing creative boundaries",
      gradient: "from-green-600 via-emerald-600 to-blue-600",
    },
    {
      title: "Creating the",
      subtitle: "FUTURE",
      description: "One animation at a time",
      gradient: "from-yellow-600 via-orange-600 to-red-600",
    },
  ];

  const services = [
    {
      title: "3D Animations",
      icon: "🎭",
      description: "Immersive 3D experiences that captivate",
      count: "150+",
    },
    {
      title: "Motion Graphics",
      icon: "🎨",
      description: "Dynamic visual storytelling",
      count: "300+",
    },
    {
      title: "UI Animations",
      icon: "💫",
      description: "Seamless user interactions",
      count: "500+",
    },
    {
      title: "Brand Identity",
      icon: "✨",
      description: "Memorable animated brands",
      count: "200+",
    },
    {
      title: "VFX & Effects",
      icon: "🚀",
      description: "Cinematic visual effects",
      count: "100+",
    },
    {
      title: "Web Animations",
      icon: "🌐",
      description: "Interactive web experiences",
      count: "400+",
    },
  ];

  const projects = [
    {
      name: "Cosmic Journey",
      year: "2024",
      type: "3D Animation",
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Digital Dreams",
      year: "2023",
      type: "Motion Graphics",
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Future Vision",
      year: "2023",
      type: "UI/UX",
      color: "from-green-500 to-emerald-500",
    },
    {
      name: "Brand Orbit",
      year: "2022",
      type: "Branding",
      color: "from-orange-500 to-red-500",
    },
    {
      name: "Interactive Space",
      year: "2022",
      type: "Web Experience",
      color: "from-indigo-500 to-purple-500",
    },
    {
      name: "Visual Symphony",
      year: "2021",
      type: "VFX",
      color: "from-pink-500 to-rose-500",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      company: "Tech Innovators",
      text: "Absolutely revolutionary work! The animations brought our vision to life.",
    },
    {
      name: "Mike Chen",
      company: "Creative Studios",
      text: "Outstanding quality and attention to detail. Exceeded all expectations.",
    },
    {
      name: "Emma Davis",
      company: "Future Brands",
      text: "Professional, creative, and delivered exactly what we needed.",
    },
  ];

  useEffect(() => {
    setIsVisible(true);

    const interval = setInterval(() => {
      setCurrentPhase((prev) => (prev + 1) % phases.length);
    }, 4000);

    const handleScroll = () => {
      const newScrollY = window.scrollY;
      setScrollY(newScrollY);

      // Update active section based on scroll position
      const sections = sectionsRef.current;
      const scrollPosition = newScrollY + window.innerHeight / 2;

      sections.forEach((section, index) => {
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionBottom = sectionTop + section.offsetHeight;

          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            setActiveSection(index);
          }
        }
      });

      // Check for visible elements for reveal animations
      const elements = document.querySelectorAll("[data-reveal]");
      const newVisibleElements = new Set<number>(visibleElements);

      elements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const isElementVisible =
          rect.top < window.innerHeight && rect.bottom > 0;

        if (isElementVisible && !visibleElements.has(index)) {
          newVisibleElements.add(index);
        }
      });

      if (newVisibleElements.size !== visibleElements.size) {
        setVisibleElements(newVisibleElements);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [visibleElements, phases.length]);

  const generateParticles = (count = 50) => {
    return Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        className="absolute rounded-full opacity-40 animate-pulse"
        style={{
          width: `${2 + Math.random() * 4}px`,
          height: `${2 + Math.random() * 4}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          background: `hsl(${Math.random() * 360}, 70%, 70%)`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${2 + Math.random() * 4}s`,
          transform: `translate(${Math.sin((scrollY + i) * 0.01) * 10}px, ${
            Math.cos((scrollY + i) * 0.01) * 10
          }px)`,
        }}
      />
    ));
  };

  const generateFloatingShapes = () => {
    return Array.from({ length: 8 }, (_, i) => (
      <div
        key={i}
        className="absolute opacity-20 animate-spin"
        style={{
          width: `${20 + Math.random() * 40}px`,
          height: `${20 + Math.random() * 40}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          background: `linear-gradient(${
            Math.random() * 360
          }deg, rgba(147, 51, 234, 0.3), rgba(219, 39, 119, 0.3))`,
          borderRadius: Math.random() > 0.5 ? "50%" : "20%",
          animationDuration: `${10 + Math.random() * 20}s`,
          animationDirection: Math.random() > 0.5 ? "normal" : "reverse",
          transform: `translate(${
            Math.sin((scrollY + i * 100) * 0.005) * 30
          }px, ${Math.cos((scrollY + i * 100) * 0.005) * 20}px) rotate(${
            scrollY * 0.1 + i * 30
          }deg)`,
        }}
      />
    ));
  };

  return (
    <div
      className="relative bg-black text-white overflow-x-hidden"
      ref={containerRef}
    >
      {/* Custom Styles */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }

        @keyframes glitch {
          0%, 100% {
            transform: translate(0, 0);
          }
          10% {
            transform: translate(-2px, -2px);
          }
          20% {
            transform: translate(2px, 2px);
          }
          30% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(2px, -2px);
          }
          50% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          70% {
            transform: translate(-2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
          90% {
            transform: translate(-2px, -2px);
          }
        }

        @keyframes slideAcross {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes slideLine {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        html {
          scroll-behavior: smooth;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #1a1a1a;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #9333ea, #ec4899);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #a855f7, #f472b6);
        }
      `}</style>

      {/* Enhanced Cursor Follower */}
      <div
        className="fixed w-6 h-6 pointer-events-none z-50 mix-blend-difference rounded-full"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)",
          transition: "all 0.1s ease-out",
        }}
      />

      {/* Animated Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-900 z-50">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out"
          style={{
            width: `${
              (scrollY / (document.body.scrollHeight - window.innerHeight)) *
              100
            }%`,
          }}
        />
      </div>

      {/* Floating Navigation */}
      <nav className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
        <div className="flex flex-col space-y-4">
          {["Hero", "Services", "Projects", "About", "Testimonials"].map(
            (item, index) => (
              <div
                key={item}
                className={`relative cursor-pointer group transition-all duration-300 ${
                  activeSection === index ? "scale-125" : "hover:scale-110"
                }`}
                onClick={() =>
                  sectionsRef.current[index]?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
              >
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeSection === index
                      ? "bg-gradient-to-r from-pink-500 to-purple-500"
                      : "bg-gray-600 hover:bg-gray-400"
                  }`}
                />
                <div
                  className={`absolute right-5 top-1/2 transform -translate-y-1/2 px-2 py-1 rounded text-sm transition-all duration-300 ${
                    activeSection === index
                      ? "opacity-100 translate-x-0 bg-white/10 backdrop-blur-sm text-white"
                      : "opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0"
                  }`}
                >
                  {item}
                </div>
              </div>
            )
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        ref={(el) => (sectionsRef.current[0] = el)}
        className={`relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br ${phases[currentPhase].gradient}`}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-grid-pattern" />
          {generateParticles(80)}
          {generateFloatingShapes()}
        </div>

        {/* Geometric Rings */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute border-2 rounded-full opacity-20"
              style={{
                width: `${100 + i * 60}px`,
                height: `${100 + i * 60}px`,
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) rotate(${
                  scrollY * 0.1 + i * 30
                }deg)`,
                borderColor: `hsl(${(scrollY * 0.1 + i * 60) % 360}, 70%, 60%)`,
                animation: `float ${10 + i * 2}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div
          className={`relative z-10 text-center text-white transform transition-all duration-1000 ${
            isVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        >
          <div className="mb-6 overflow-hidden">
            <h1
              className="text-2xl md:text-4xl lg:text-6xl font-light tracking-wider"
              style={{
                textShadow: "0 0 30px rgba(255,255,255,0.3)",
              }}
            >
              {phases[currentPhase].title}
            </h1>
          </div>

          <div className="relative mb-8">
            <h2
              className="text-4xl md:text-6xl lg:text-8xl font-bold bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent"
              style={{
                textShadow: "0 0 50px rgba(255,255,255,0.5)",
              }}
            >
              {phases[currentPhase].subtitle}
            </h2>

            {/* Glitch layers */}
            <h2
              className="absolute inset-0 text-4xl md:text-6xl lg:text-8xl font-bold text-red-400 opacity-20 mix-blend-multiply"
              style={{
                animation: "glitch 3s infinite",
              }}
            >
              {phases[currentPhase].subtitle}
            </h2>
            <h2
              className="absolute inset-0 text-4xl md:text-6xl lg:text-8xl font-bold text-cyan-400 opacity-20 mix-blend-screen"
              style={{
                animation: "glitch 3s infinite reverse",
              }}
            >
              {phases[currentPhase].subtitle}
            </h2>
          </div>

          <div className="mb-8">
            <p
              className="text-lg md:text-xl lg:text-2xl font-light tracking-wide"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: `translateY(${isVisible ? 0 : 30}px)`,
                transitionDelay: "1s",
                textShadow: "0 0 20px rgba(255,255,255,0.2)",
              }}
            >
              {phases[currentPhase].description}
            </p>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center space-x-4 mb-8">
            {phases.map((_, index) => (
              <div
                key={index}
                className={`rounded-full transition-all duration-500 cursor-pointer ${
                  index === currentPhase
                    ? "w-12 h-3 bg-gradient-to-r from-pink-500 to-purple-500"
                    : "w-3 h-3 bg-white/30 hover:bg-white/60"
                }`}
                onClick={() => setCurrentPhase(index)}
                style={{
                  boxShadow:
                    index === currentPhase
                      ? "0 0 20px rgba(255,255,255,0.5)"
                      : "none",
                }}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              className="group relative px-8 py-4 border-2 border-white/30 rounded-full text-white font-semibold tracking-wider overflow-hidden transform hover:scale-105 transition-all duration-500 backdrop-blur-sm"
              onClick={() =>
                sectionsRef.current[1]?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <span className="relative z-10">EXPLORE SERVICES</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full opacity-90" />
            </button>

            <button
              className="group relative px-8 py-4 bg-white/10 rounded-full text-white font-semibold tracking-wider transform hover:scale-105 transition-all duration-500 backdrop-blur-sm border border-white/20"
              onClick={() => setCurrentPhase(0)}
            >
              <span className="relative z-10">RESTART JOURNEY</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        ref={(el) => (sectionsRef.current[1] = el)}
        className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden"
      >
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-white to-transparent"
              style={{
                top: `${(i + 1) * 5}%`,
                left: "-100%",
                right: "-100%",
                animation: `slideLine ${
                  2 + Math.random() * 3
                }s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
          {generateFloatingShapes()}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2
              data-reveal
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
            >
              OUR SERVICES
            </h2>
            <p
              className="text-xl text-gray-400 max-w-3xl mx-auto"
              style={{
                transform: `translateY(${visibleElements.has(0) ? 0 : 50}px)`,
                opacity: visibleElements.has(0) ? 1 : 0,
                transition: "all 1s ease-out 0.3s",
              }}
            >
              Transforming ideas into breathtaking animated experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={service.title}
                data-reveal
                className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 overflow-hidden"
                style={{
                  transform: `translateY(${
                    visibleElements.has(index + 1) ? 0 : 60
                  }px)`,
                  opacity: visibleElements.has(index + 1) ? 1 : 0,
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                {/* Icon */}
                <div className="text-5xl mb-6 transform group-hover:scale-125 transition-transform duration-500">
                  {service.icon}
                </div>

                <h3 className="text-xl font-bold mb-4 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-500">
                  {service.title}
                </h3>

                <p className="text-gray-400 mb-6 group-hover:text-gray-300 transition-colors duration-300">
                  {service.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {service.count}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-500 transform group-hover:scale-110">
                    <span className="text-purple-400 group-hover:text-white transition-colors duration-300">
                      →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section
        ref={(el) => (sectionsRef.current[2] = el)}
        className="py-20 bg-black relative overflow-hidden"
      >
        <div className="absolute inset-0">{generateParticles(100)}</div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-center mb-16 text-white">
            <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              FEATURED PROJECTS
            </span>
          </h2>

          <div className="relative">
            <div
              className="flex space-x-6 transition-transform duration-1000 ease-out"
              style={{
                transform: `translateX(-${
                  (scrollY * 0.5) % (projects.length * 300)
                }px)`,
              }}
            >
              {[...projects, ...projects].map((project, index) => (
                <div
                  key={`${project.name}-${index}`}
                  className={`flex-shrink-0 w-72 h-80 rounded-2xl bg-gradient-to-br ${project.color} p-6 flex flex-col justify-between transform hover:scale-105 hover:-translate-y-4 transition-all duration-500 relative overflow-hidden group cursor-pointer`}
                  style={{
                    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                  }}
                >
                  <div>
                    <span className="text-sm font-semibold opacity-80 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                      {project.year}
                    </span>
                    <h3 className="text-2xl font-bold mt-4 mb-2 group-hover:scale-105 transition-transform duration-300">
                      {project.name}
                    </h3>
                    <p className="text-base opacity-90">{project.type}</p>
                  </div>

                  <div className="w-full h-24 bg-black/20 rounded-xl backdrop-blur-sm flex items-center justify-center group-hover:bg-black/30 transition-all duration-300">
                    <span className="text-4xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                      🎨
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        ref={(el) => (sectionsRef.current[3] = el)}
        className="py-20 bg-gradient-to-r from-purple-900 via-pink-900 to-indigo-900 relative overflow-hidden"
      >
        <div className="absolute inset-0">
          {generateFloatingShapes()}
          {generateParticles(60)}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              {
                number: "1500+",
                label: "Projects Completed",
                color: "from-yellow-400 to-orange-500",
              },
              {
                number: "500+",
                label: "Happy Clients",
                color: "from-green-400 to-blue-500",
              },
              {
                number: "15+",
                label: "Years Experience",
                color: "from-purple-400 to-pink-500",
              },
              {
                number: "50+",
                label: "Awards Won",
                color: "from-red-400 to-yellow-500",
              },
            ].map((stat, index) => (
              <div
                key={stat.label}
                data-reveal
                className="transform hover:scale-125 transition-all duration-500 group cursor-pointer"
                style={{
                  opacity: visibleElements.has(index + 10) ? 1 : 0,
                  transitionDelay: `${index * 200}ms`,
                }}
              >
                <div
                  className={`text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-500`}
                >
                  {stat.number}
                </div>
                <div className="text-base text-purple-200 group-hover:text-white transition-colors duration-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        ref={(el) => (sectionsRef.current[4] = el)}
        className="py-20 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden"
      >
        <div className="absolute inset-0">{generateFloatingShapes()}</div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-center mb-16 text-white">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              CLIENT STORIES
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimationWorlds />
          </div>
        </div>
      </section>
      <TrendyUserProfiles />
      {/* Contact Section */}
      <section
        ref={(el) => (sectionsRef.current[5] = el)}
        className="py-20 bg-gradient-to-t from-purple-900 via-pink-900 to-black relative overflow-hidden"
      >
        {/* Background Animation */}
        <div className="absolute inset-0">
          {generateParticles(150)}
          {generateFloatingShapes()}
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-7xl font-bold mb-8 text-white relative">
            <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-purple-500 bg-clip-text text-transparent">
              LET'S CREATE MAGIC
            </span>

            {/* Floating Magic Sparkles */}
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="absolute text-xl opacity-70"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${-20 + Math.random() * 40}%`,
                  color: `hsl(${(i * 60) % 360}, 70%, 70%)`,
                  animation: `float ${
                    2 + Math.random() * 2
                  }s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              >
                ✨
              </div>
            ))}
          </h2>

          <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Ready to bring your vision to life? Let's collaborate and create
            something
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold">
              {" "}
              extraordinary{" "}
            </span>
            together.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <button className="group relative px-12 py-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full text-white font-bold text-lg overflow-hidden transform hover:scale-110 transition-all duration-500">
              <span className="relative z-10">START PROJECT</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/40 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>

            <button className="group relative px-12 py-6 border-2 border-white/30 rounded-full text-white font-bold text-lg hover:bg-white hover:text-black transform hover:scale-110 transition-all duration-500 backdrop-blur-sm overflow-hidden">
              <span className="relative z-10">VIEW PORTFOLIO</span>
              <div className="absolute inset-0 bg-white transform scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
            </button>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "📧", title: "Email", info: "hello@animationworld.com" },
              { icon: "📱", title: "Phone", info: "+1 (555) 123-4567" },
              { icon: "📍", title: "Location", info: "New York, USA" },
            ].map((contact, index) => (
              <div
                key={contact.title}
                className="group cursor-pointer transform hover:scale-110 transition-all duration-500"
              >
                <div className="text-3xl mb-3 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                  {contact.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-500">
                  {contact.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-200 transition-colors duration-300 text-sm">
                  {contact.info}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <NftMarketplace />
    </div>
  );
};

export default AnimationWorld;
