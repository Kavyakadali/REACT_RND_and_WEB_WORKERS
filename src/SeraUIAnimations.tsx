import React, { useState, useEffect, useRef } from "react";

// OrbitingSkills Component
const OrbitingSkills = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState<number | null>(null);
  const animationRef = useRef<number | null>(null);

  const skillsConfig = [
    {
      id: 1,
      orbitRadius: 120,
      size: 50,
      speed: 0.8,
      iconType: "react",
      phaseShift: 0,
      glowColor: "cyan",
      label: "React",
    },
    {
      id: 2,
      orbitRadius: 120,
      size: 45,
      speed: 0.6,
      iconType: "javascript",
      phaseShift: Math.PI / 2,
      glowColor: "yellow",
      label: "JavaScript",
    },
    {
      id: 3,
      orbitRadius: 180,
      size: 40,
      speed: -0.4,
      iconType: "css",
      phaseShift: Math.PI,
      glowColor: "blue",
      label: "CSS",
    },
    {
      id: 4,
      orbitRadius: 180,
      size: 48,
      speed: -0.5,
      iconType: "html",
      phaseShift: Math.PI / 4,
      glowColor: "red",
      label: "HTML",
    },
    {
      id: 5,
      orbitRadius: 240,
      size: 42,
      speed: 0.3,
      iconType: "node",
      phaseShift: Math.PI * 1.5,
      glowColor: "green",
      label: "Node.js",
    },
    {
      id: 6,
      orbitRadius: 240,
      size: 46,
      speed: 0.35,
      iconType: "tailwind",
      phaseShift: Math.PI / 6,
      glowColor: "purple",
      label: "Tailwind",
    },
  ];

  const getIconEmoji = (type: string) => {
    const icons: Record<string, string> = {
      react: "⚛️",
      javascript: "🟨",
      css: "🎨",
      html: "🌐",
      node: "🟢",
      tailwind: "💨",
    };
    return icons[type] || "⭐";
  };

  const getGlowColor = (color: string) => {
    const colors: Record<string, string> = {
      cyan: "rgba(6, 182, 212, 0.6)",
      yellow: "rgba(245, 158, 11, 0.6)",
      blue: "rgba(59, 130, 246, 0.6)",
      red: "rgba(239, 68, 68, 0.6)",
      green: "rgba(34, 197, 94, 0.6)",
      purple: "rgba(147, 51, 234, 0.6)",
    };
    return colors[color] || "rgba(255, 255, 255, 0.6)";
  };

  useEffect(() => {
    let startTime = Date.now();

    const animate = () => {
      if (!isHovered) {
        const currentTime = Date.now();
        const elapsed = (currentTime - startTime) / 1000;

        skillsConfig.forEach((skill) => {
          const element = document.getElementById(`skill-${skill.id}`);
          if (element) {
            const angle = skill.phaseShift + elapsed * skill.speed;
            const x = Math.cos(angle) * skill.orbitRadius;
            const y = Math.sin(angle) * skill.orbitRadius;
            element.style.transform = `translate(${x}px, ${y}px)`;
          }
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovered]);

  return (
    <div
      className="relative w-96 h-96 mx-auto flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredSkill(null);
      }}
    >
      {/* Orbit paths */}
      {[120, 180, 240].map((radius) => (
        <div
          key={radius}
          className="absolute border border-white/20 rounded-full animate-spin"
          style={{
            width: `${radius * 2}px`,
            height: `${radius * 2}px`,
            animationDuration: `${20 + radius / 10}s`,
            animationDirection: "reverse",
          }}
        />
      ))}

      {/* Central hub */}
      <div className="absolute w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg z-10">
        <span className="text-2xl">💫</span>
      </div>

      {/* Skills */}
      {skillsConfig.map((skill) => (
        <div
          key={skill.id}
          id={`skill-${skill.id}`}
          className="absolute transition-all duration-300 cursor-pointer"
          style={{
            width: `${skill.size}px`,
            height: `${skill.size}px`,
            filter:
              hoveredSkill === skill.id
                ? `drop-shadow(0 0 20px ${getGlowColor(skill.glowColor)})`
                : "none",
          }}
          onMouseEnter={() => setHoveredSkill(skill.id)}
          onMouseLeave={() => setHoveredSkill(null)}
        >
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-2xl bg-gray-800/80 backdrop-blur-sm border border-white/30 hover:scale-110 transition-transform duration-300"
            style={{
              boxShadow: `0 0 15px ${getGlowColor(skill.glowColor)}`,
            }}
          >
            {getIconEmoji(skill.iconType)}
          </div>

          {/* Skill label */}
          {hoveredSkill === skill.id && (
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
              {skill.label}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// VideoText Component
const VideoText = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto h-64 overflow-hidden rounded-2xl bg-black">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-pink-900/50 to-blue-900/50" />

      {/* Animated video-like background */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Main text overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`text-center transform transition-all duration-2000 ${
            isVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              ANIMATION
            </span>
          </h2>
          <p className="text-lg text-gray-300 tracking-wider">
            Where creativity meets technology
          </p>
        </div>
      </div>

      {/* Video play button effect */}
      <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors duration-300">
        <div className="w-0 h-0 border-l-4 border-l-white border-t-2 border-b-2 border-t-transparent border-b-transparent ml-1" />
      </div>
    </div>
  );
};

// InfiniteGrid Component
const InfiniteGrid = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-full h-64 overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          transform: `translate(${-(scrollY * 0.5) % 40}px, ${
            -(scrollY * 0.3) % 40
          }px)`,
        }}
      />

      {/* Moving grid lines */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40"
            style={{
              top: `${i * 5}%`,
              left: "-100%",
              right: "-100%",
              animation: `slideAcross ${
                3 + Math.random() * 4
              }s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `floatUpDown ${
                3 + Math.random() * 4
              }s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Central focus */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-4xl">🌌</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            Infinite Possibilities
          </h3>
        </div>
      </div>
    </div>
  );
};

// ImageSwiper Component
const ImageSwiper = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const images = [
    {
      id: 1,
      title: "3D Animation",
      description: "Immersive 3D experiences",
      gradient: "from-purple-500 to-pink-500",
      icon: "🎭",
    },
    {
      id: 2,
      title: "Motion Graphics",
      description: "Dynamic visual storytelling",
      gradient: "from-blue-500 to-cyan-500",
      icon: "🎨",
    },
    {
      id: 3,
      title: "VFX Effects",
      description: "Cinematic visual effects",
      gradient: "from-green-500 to-blue-500",
      icon: "🚀",
    },
    {
      id: 4,
      title: "UI Animations",
      description: "Seamless interactions",
      gradient: "from-yellow-500 to-red-500",
      icon: "💫",
    },
  ];

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlay, images.length]);

  return (
    <div
      className="relative w-full max-w-2xl mx-auto h-80 rounded-2xl overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Image container */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
              index === currentIndex
                ? "opacity-100 scale-100 translate-x-0"
                : index < currentIndex
                ? "opacity-0 scale-95 -translate-x-full"
                : "opacity-0 scale-95 translate-x-full"
            }`}
          >
            <div
              className={`w-full h-full bg-gradient-to-br ${image.gradient} flex items-center justify-center relative overflow-hidden`}
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-20">
                {Array.from({ length: 30 }, (_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animation: `twinkle ${
                        2 + Math.random() * 3
                      }s ease-in-out infinite`,
                      animationDelay: `${Math.random() * 2}s`,
                    }}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="text-center text-white z-10">
                <div className="text-6xl mb-4 animate-bounce">{image.icon}</div>
                <h3 className="text-3xl font-bold mb-2">{image.title}</h3>
                <p className="text-lg opacity-90">{image.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-300"
        onClick={() =>
          setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
        }
      >
        ←
      </button>
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-300"
        onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
      >
        →
      </button>
    </div>
  );
};

// Main SeraUI Animation Showcase Component
const SeraUIAnimationShowcase = () => {
  const [visibleSection, setVisibleSection] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionAttr = entry.target.getAttribute("data-section");
            if (sectionAttr) {
              const index = parseInt(sectionAttr);
              setVisibleSection(index);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll("[data-section]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes moveGrid {
            0% {
              transform: translate(0, 0);
            }
            100% {
              transform: translate(60px, 60px);
            }
          }

          @keyframes slideAcross {
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

          @keyframes floatUpDown {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            25% {
              transform: translateY(-20px) rotate(5deg);
            }
            50% {
              transform: translateY(-10px) rotate(10deg);
            }
            75% {
              transform: translateY(-15px) rotate(-5deg);
            }
          }

          @keyframes twinkle {
            0%, 100% {
              opacity: 0;
              transform: scale(0.8);
            }
            50% {
              opacity: 1;
              transform: scale(1.2);
            }
          }
        `}
      </style>

      <section className="py-32 bg-gradient-to-b from-gray-900 via-black to-gray-900 relative overflow-hidden">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0">
          {/* Animated grid background */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
              animation: "moveGrid 20s linear infinite",
            }}
          />

          {/* Floating particles */}
          {Array.from({ length: 100 }, (_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-30"
              style={{
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `hsl(${Math.random() * 360}, 70%, 70%)`,
                animation: `floatUpDown ${
                  3 + Math.random() * 4
                }s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Title */}
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              SERAUI SHOWCASE
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience cutting-edge animations with SeraUI components -
              bringing your vision to life
            </p>
          </div>

          {/* Component Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
            {/* Orbiting Skills */}
            <div
              data-section="0"
              className={`transform transition-all duration-1000 ${
                visibleSection >= 0
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
            >
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Orbiting Skills
                </h3>
                <p className="text-gray-400">
                  Interactive skill showcase with orbital animations
                </p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-500">
                <OrbitingSkills />
              </div>
            </div>

            {/* Video Text */}
            <div
              data-section="1"
              className={`transform transition-all duration-1000 delay-200 ${
                visibleSection >= 1
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
            >
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Video Text
                </h3>
                <p className="text-gray-400">
                  Cinematic text overlays with video-like effects
                </p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-500">
                <VideoText />
              </div>
            </div>

            {/* Infinite Grid */}
            <div
              data-section="2"
              className={`transform transition-all duration-1000 delay-400 ${
                visibleSection >= 2
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
            >
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Infinite Grid
                </h3>
                <p className="text-gray-400">
                  Dynamic grid patterns with infinite scroll effects
                </p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 border border-gray-700/50 hover:border-green-500/50 transition-all duration-500">
                <InfiniteGrid />
              </div>
            </div>

            {/* Image Swiper */}
            <div
              data-section="3"
              className={`transform transition-all duration-1000 delay-600 ${
                visibleSection >= 3
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
            >
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Image Swiper
                </h3>
                <p className="text-gray-400">
                  Smooth image carousel with auto-play functionality
                </p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 border border-gray-700/50 hover:border-pink-500/50 transition-all duration-500">
                <ImageSwiper />
              </div>
            </div>
          </div>

          {/* Featured Showcase */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 backdrop-blur-lg rounded-full px-8 py-4 border border-white/20">
              <span className="text-2xl animate-spin">⚡</span>
              <span className="text-lg font-semibold text-white">
                Created by Kavya & Sai Chandra
              </span>
              <span className="text-2xl animate-pulse">✨</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SeraUIAnimationShowcase;
