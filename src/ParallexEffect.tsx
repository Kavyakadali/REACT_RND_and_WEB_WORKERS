import React, { useState, useEffect, useRef } from "react";

const RoyalParallaxWebsite = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState({});
  const particlesRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("[id]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Advanced Particle System

  return (
    <div className="bg-black text-white overflow-x-hidden">
      {/* Particle Canvas */}
      <canvas
        ref={particlesRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-10"
        style={{ mixBlendMode: "screen" }}
      />

      {/* Dynamic Mouse Follower */}
      <div
        className="fixed w-80 h-80 rounded-full pointer-events-none z-15 mix-blend-screen"
        style={{
          background: `radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, transparent 70%)`,
          transform: `translate3d(${mousePos.x * 150}px, ${
            mousePos.y * 150
          }px, 0) scale(${1 + Math.abs(mousePos.x) * 0.3})`,
          //   transition: "transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)",
          left: "50%",
          top: "50%",
          marginLeft: "-10rem",
          marginTop: "-10rem",
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="text-4xl font-bold tracking-wider relative">
              <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                ROYAL
              </span>
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-white rounded-full animate-ping"></div>
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
            </div>
            <div className="hidden md:flex space-x-10">
              {["Home", "Portfolio", "Services", "Gallery", "Contact"].map(
                (item, index) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="relative group text-lg tracking-wide transition-all duration-500 hover:text-gray-300"
                  >
                    {item}
                    <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-white to-gray-300 group-hover:w-full transition-all duration-700"></span>
                    <div className="absolute -top-1 -right-1 w-1 h-1 bg-white/70 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Parallax Section 1 */}
      <section
        className="relative h-screen flex items-center justify-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&h=1080&fit=crop")',
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          filter: "grayscale(100%) contrast(1.3)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70"></div>

        {/* Floating 3D Elements */}
        <div className="absolute inset-0 pointer-events-none z-20">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `translate3d(${mousePos.x * (30 + i * 10)}px, ${
                  mousePos.y * (20 + i * 5)
                }px, 0) rotateZ(${scrollY * (0.1 + i * 0.02)}deg)`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              <div
                className={`w-${2 + (i % 3)} h-${2 + (i % 3)} ${
                  i % 3 === 0
                    ? "bg-white/30 rounded-full"
                    : i % 3 === 1
                    ? "border-2 border-white/40 rotate-45"
                    : "bg-white/20 rotate-12"
                }`}
              ></div>
            </div>
          ))}
        </div>

        <div className="relative z-30 text-center max-w-6xl mx-auto px-6">
          <div
            className="transform transition-all duration-2000"
            style={{
              transform: `perspective(1000px) rotateX(${
                scrollY * 0.01
              }deg) translateY(${scrollY * -0.2}px)`,
              opacity: Math.max(1 - scrollY * 0.002, 0.1),
            }}
          >
            <h1 className="text-9xl md:text-11xl font-bold mb-8 tracking-wider relative">
              <span
                className="bg-gradient-to-b from-white via-gray-100 to-gray-300 bg-clip-text text-transparent"
                style={{
                  textShadow: "0 20px 40px rgba(255,255,255,0.3)",
                  transform: `perspective(500px) rotateY(${mousePos.x * 5}deg)`,
                }}
              >
                ROYAL
              </span>
              <div className="absolute -top-6 -right-6 w-12 h-12 border-4 border-white/50 rotate-45 animate-spin-slow"></div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-48 h-2 bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
            </h1>
            <p className="text-4xl md:text-5xl mb-16 tracking-wide opacity-90 font-light">
              Elite 3D Animations & Cinematic Experiences
            </p>
            <div className="flex justify-center space-x-8">
              <button className="group relative px-20 py-8 text-2xl tracking-wider border-3 border-white/50 hover:border-white transition-all duration-700 overflow-hidden transform hover:scale-110 hover:rotate-1">
                <span className="relative z-10 group-hover:text-black transition-colors duration-700 font-bold">
                  ENTER KINGDOM
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-100 to-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                <div className="absolute inset-0 border-2 border-white/30 transform rotate-45 scale-0 group-hover:scale-100 transition-transform duration-500"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Animated Crown */}
        <div
          className="absolute top-20 left-1/2 transform -translate-x-1/2 text-8xl opacity-20 animate-bounce"
          style={{
            transform: `translateX(-50%) translateY(${
              scrollY * 0.3
            }px) rotateZ(${scrollY * 0.1}deg)`,
            animationDelay: "1s",
          }}
        >
          👑
        </div>
      </section>

      {/* Content Section 1 */}
      <section
        id="services"
        className="relative min-h-screen py-32 px-6 bg-gradient-to-b from-black via-gray-950 to-black"
      >
        <div className="max-w-7xl mx-auto relative z-20">
          <div className="text-center mb-24">
            <h2
              className="text-8xl font-bold mb-8 tracking-wider"
              style={{
                transform: `perspective(1000px) rotateY(${
                  scrollY * 0.02
                }deg) translateZ(${scrollY * 0.1}px)`,
              }}
            >
              <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                PREMIUM SERVICES
              </span>
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-8"></div>
            <p className="text-2xl opacity-80 max-w-4xl mx-auto font-light leading-relaxed">
              We create cinematic animations that blur the line between reality
              and imagination
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "CINEMATIC 3D",
                description:
                  "Hollywood-grade 3D animations with photorealistic rendering and dynamic camera movements",
                icon: "",
                image:
                  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop",
                features: ["Motion Capture", "Ray Tracing", "Particle Systems"],
              },
              {
                title: "LUXURY BRANDING",
                description:
                  "Premium brand animations that elevate your identity to royal status",
                icon: "",
                image:
                  "https://images.unsplash.com/photo-1566041510394-cf7c8fe21800?w=600&h=400&fit=crop",
                features: [
                  "Logo Animation",
                  "Brand Stories",
                  "Identity Systems",
                ],
              },
              {
                title: "INTERACTIVE MEDIA",
                description:
                  "Immersive experiences that respond to user interaction with fluid precision",
                icon: "",
                image:
                  "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=600&h=400&fit=crop",
                features: ["UI Animation", "Web Experiences", "AR/VR Content"],
              },
            ].map((service, index) => (
              <div
                key={index}
                className="group relative transform transition-all duration-1000 hover:scale-105"
                style={{
                  transform: isVisible.services
                    ? `translateY(0) rotateX(0) rotateY(0)`
                    : `translateY(100px) rotateX(15deg) rotateY(5deg)`,
                  opacity: isVisible.services ? 1 : 0,
                  transitionDelay: `${index * 300}ms`,
                }}
              >
                {/* Card Container */}
                <div className="relative h-[500px] bg-gradient-to-br from-white/15 to-white/5 border border-white/20 overflow-hidden transform transition-all duration-700 hover:border-white/50 hover:-translate-y-6 hover:rotate-2">
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-50 transition-all duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage: `url("${service.image}")`,
                      filter: "grayscale(100%) contrast(1.4)",
                      transform: `scale(${1 + scrollY * 0.0001})`,
                    }}
                  />

                  {/* Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  {/* Animated Icon */}
                  <div className="absolute top-8 right-8 text-6xl transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 group-hover:drop-shadow-lg">
                    {service.icon}
                  </div>

                  {/* Content */}
                  <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-3xl font-bold mb-6 tracking-wide group-hover:text-gray-100 transition-colors duration-300">
                        {service.title}
                      </h3>
                      <p className="opacity-80 leading-relaxed mb-6 group-hover:opacity-100 transition-opacity duration-300">
                        {service.description}
                      </p>
                      <div className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center space-x-3 opacity-60 group-hover:opacity-100 transition-all duration-500"
                            style={{ transitionDelay: `${idx * 100}ms` }}
                          >
                            <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                            <span className="text-sm tracking-wide">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="text-xs opacity-50 tracking-widest uppercase">
                        Premium Quality
                      </span>
                      <div className="w-14 h-14 border-2 border-white/40 rounded-full flex items-center justify-center group-hover:border-white group-hover:bg-white/10 group-hover:rotate-180 transition-all duration-700">
                        <span className="text-2xl font-bold">→</span>
                      </div>
                    </div>
                  </div>

                  {/* Advanced Border Effects */}
                  <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/40 transition-all duration-700"></div>
                  <div className="absolute top-0 left-0 w-0 h-0 border-l-4 border-t-4 border-white/70 group-hover:w-24 group-hover:h-24 transition-all duration-700"></div>
                  <div className="absolute bottom-0 right-0 w-0 h-0 border-r-4 border-b-4 border-white/70 group-hover:w-24 group-hover:h-24 transition-all duration-700"></div>
                  <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-white/60 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parallax Section 2 */}
      <section
        className="relative h-screen flex items-center justify-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1614850715681-ca8944be7e5c?w=1920&h=1080&fit=crop")',
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          filter: "grayscale(100%) contrast(1.5)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/80"></div>

        <div className="relative z-30 text-center max-w-5xl mx-auto px-6">
          <div
            style={{
              transform: `perspective(1000px) rotateY(${
                scrollY * 0.01
              }deg) translateZ(${scrollY * 0.05}px)`,
              opacity: Math.max(1 - Math.abs(scrollY - 1000) * 0.003, 0.3),
            }}
          >
            <h2 className="text-8xl font-bold mb-12 tracking-wider">
              <span
                className="bg-gradient-to-r from-gray-200 via-white to-gray-200 bg-clip-text text-transparent"
                style={{
                  transform: `rotateX(${mousePos.y * 10}deg)`,
                }}
              >
                PORTFOLIO
              </span>
            </h2>
            <p className="text-3xl opacity-90 font-light leading-relaxed">
              Witness the fusion of artistry and technology in our award-winning
              animations
            </p>
          </div>
        </div>

        {/* 3D Geometric Shapes */}
        <div className="absolute inset-0 pointer-events-none z-25">
          <div
            className="absolute top-1/4 left-1/4 w-32 h-32 border-4 border-white/40"
            style={{
              transform: `translate3d(${mousePos.x * 80}px, ${
                mousePos.y * 60
              }px, 0) rotateX(${scrollY * 0.2}deg) rotateY(${
                scrollY * 0.3
              }deg) rotateZ(${scrollY * 0.1}deg)`,
              animation: "spin 20s linear infinite",
            }}
          ></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white/20 rounded-full backdrop-blur-sm"
            style={{
              transform: `translate3d(${mousePos.x * -60}px, ${
                mousePos.y * 80
              }px, 0) scale(${1 + Math.sin(scrollY * 0.01) * 0.3})`,
              animation: "pulse 4s ease-in-out infinite",
            }}
          ></div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section id="portfolio" className="relative py-40 px-6 bg-black">
        <div className="max-w-7xl mx-auto relative z-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "LUXURY CAR REVEAL",
                category: "Automotive",
                image:
                  "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=600&fit=crop",
                year: "2024",
              },
              {
                title: "ROYAL JEWELRY SHOWCASE",
                category: "Product Animation",
                image:
                  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop",
                year: "2024",
              },
              {
                title: "ARCHITECTURAL VISUALIZATION",
                category: "Real Estate",
                image:
                  "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&h=600&fit=crop",
                year: "2023",
              },
              {
                title: "FASHION RUNWAY",
                category: "Fashion",
                image:
                  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=600&fit=crop",
                year: "2024",
              },
              {
                title: "TECH PRODUCT LAUNCH",
                category: "Technology",
                image:
                  "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
                year: "2024",
              },
              {
                title: "CULINARY ARTISTRY",
                category: "Food & Beverage",
                image:
                  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
                year: "2023",
              },
            ].map((project, index) => (
              <div
                key={index}
                className="group relative aspect-square overflow-hidden transform transition-all duration-1000 hover:scale-110 hover:z-40"
                style={{
                  transform: `translateY(${
                    scrollY * (0.1 + index * 0.02)
                  }px) rotateZ(${index % 2 === 0 ? 2 : -2}deg)`,
                  opacity: isVisible.portfolio ? 1 : 0,
                  transitionDelay: `${index * 150}ms`,
                }}
              >
                {/* Project Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-125"
                  style={{
                    backgroundImage: `url("${project.image}")`,
                    filter: "grayscale(100%) contrast(1.4)",
                  }}
                ></div>

                {/* Overlay Effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/70 transition-all duration-700"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
                  <div className="mb-3">
                    <span className="text-xs opacity-70 tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                      {project.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 tracking-wide group-hover:text-gray-200 transition-colors duration-300">
                    {project.title}
                  </h3>
                  <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200">
                    <span className="text-sm tracking-wide">
                      {project.year}
                    </span>
                    <div className="w-10 h-10 border border-white/40 rounded-full flex items-center justify-center group-hover:bg-white/10 group-hover:rotate-90 transition-all duration-500">
                      <span className="text-lg">↗</span>
                    </div>
                  </div>
                </div>

                {/* Advanced Border Animations */}
                <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/40 transition-all duration-700"></div>
                <div className="absolute top-0 left-0 w-0 h-0 border-l-4 border-t-4 border-white/80 group-hover:w-16 group-hover:h-16 transition-all duration-500"></div>
                <div className="absolute bottom-0 right-0 w-0 h-0 border-r-4 border-b-4 border-white/80 group-hover:w-16 group-hover:h-16 transition-all duration-500 delay-100"></div>

                {/* Glowing Corner Effects */}
                <div className="absolute top-2 right-2 w-4 h-4 bg-white/0 group-hover:bg-white/60 rounded-full transition-all duration-300 group-hover:animate-ping"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 bg-white/0 group-hover:bg-white/60 rounded-full transition-all duration-300 delay-150 group-hover:animate-ping"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parallax Section 3 */}
      <section
        className="relative h-screen flex items-center justify-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1626387346567-aa3b56e2cd93?w=1920&h=1080&fit=crop")',
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          filter: "grayscale(100%) contrast(1.2)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/80"></div>
      </section>

      {/* Gallery Section */}
      <section
        id="gallery"
        className="relative py-40 px-6 bg-gradient-to-b from-black via-gray-950 to-black"
      >
        <div className="max-w-7xl mx-auto relative z-20">
          <h2 className="text-8xl font-bold text-center mb-24 tracking-wider">
            <span className="bg-gradient-to-r from-gray-300 via-white to-gray-300 bg-clip-text text-transparent">
              GALLERY OF WONDERS
            </span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "https://images.unsplash.com/photo-1626387346567-aa3b56e2cd93?w=400&h=400&fit=crop",
              "https://images.unsplash.com/photo-1614850715681-ca8944be7e5c?w=400&h=400&fit=crop",
              "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400&h=400&fit=crop",
              "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400&h=400&fit=crop",
              "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=400&h=400&fit=crop",
              "https://images.unsplash.com/photo-1566041510394-cf7c8fe21800?w=400&h=400&fit=crop",
              "https://images.unsplash.com/photo-1614850715649-1d0106293bd1?w=400&h=400&fit=crop",
              "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop",
            ].map((image, index) => (
              <div
                key={index}
                className="group relative aspect-square overflow-hidden border border-white/20 hover:border-white/80 transition-all duration-700 transform hover:scale-110 hover:rotate-3 hover:z-30"
                style={{
                  transform: `translateY(${
                    scrollY * (0.08 + (index % 2) * 0.04)
                  }px) rotateZ(${((index % 3) - 1) * 2}deg)`,
                  transitionDelay: `${index * 80}ms`,
                }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-130"
                  style={{
                    backgroundImage: `url("${image}")`,
                    filter: "grayscale(100%) contrast(1.3)",
                  }}
                ></div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                {/* 3D Frame Effects */}
                <div className="absolute inset-2 border border-white/0 group-hover:border-white/50 transition-all duration-500 transform group-hover:rotate-1"></div>
                <div className="absolute inset-4 border border-white/0 group-hover:border-white/30 transition-all duration-700 transform group-hover:-rotate-1"></div>

                {/* Corner Highlights */}
                <div className="absolute top-2 left-2 w-0 h-0 border-l-3 border-t-3 border-white/0 group-hover:border-white group-hover:w-8 group-hover:h-8 transition-all duration-500"></div>
                <div className="absolute bottom-2 right-2 w-0 h-0 border-r-3 border-b-3 border-white/0 group-hover:border-white group-hover:w-8 group-hover:h-8 transition-all duration-500 delay-100"></div>

                {/* Glowing Dots */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-white/0 group-hover:bg-white rounded-full group-hover:animate-ping transition-all duration-300"></div>
                <div className="absolute bottom-4 left-4 w-2 h-2 bg-white/0 group-hover:bg-white rounded-full group-hover:animate-ping transition-all duration-300 delay-200"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parallax Section 4 */}
      <section
        className="relative h-screen flex items-center justify-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?w=1920&h=1080&fit=crop")',
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          filter: "grayscale(100%) contrast(1.6)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/50 to-black/85"></div>

        <div className="relative z-30 text-center max-w-5xl mx-auto px-6">
          <div
            style={{
              transform: `perspective(1000px) rotateX(${
                scrollY * 0.005
              }deg) translateY(${scrollY * -0.1}px)`,
              opacity: Math.max(1 - Math.abs(scrollY - 3000) * 0.002, 0.3),
            }}
          >
            <h2 className="text-9xl font-bold mb-16 tracking-wider">
              <span
                className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent"
                style={{
                  transform: `perspective(800px) rotateY(${
                    mousePos.x * 12
                  }deg) rotateX(${mousePos.y * 8}deg)`,
                }}
              >
                CONTACT
              </span>
            </h2>
            <p className="text-3xl mb-12 opacity-90 font-light">
              Ready to create something extraordinary together?
            </p>
            <div className="flex justify-center space-x-8">
              <button className="group relative px-16 py-6 text-xl border-3 border-white/50 hover:border-white transition-all duration-700 tracking-wider overflow-hidden transform hover:scale-110 hover:-rotate-1">
                <span className="relative z-10 group-hover:text-black transition-colors duration-700 font-bold">
                  START PROJECT
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                <div className="absolute inset-0 border-2 border-white/20 transform rotate-45 scale-0 group-hover:scale-100 transition-transform duration-500"></div>
              </button>
              <button className="px-16 py-6 text-xl border-3 border-white/30 text-white/80 hover:text-white hover:border-white/70 transition-all duration-500 tracking-wider transform hover:scale-110 hover:rotate-1">
                VIEW SHOWREEL
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final Content Section */}
      <section className="relative py-40 px-6 bg-gradient-to-b from-black via-gray-950 to-black">
        <div className="max-w-6xl mx-auto text-center relative z-20">
          <div
            style={{
              transform: isVisible.contact
                ? "translateY(0) rotateX(0)"
                : "translateY(100px) rotateX(20deg)",
              opacity: isVisible.contact ? 1 : 0,
              transition: "all 1.5s cubic-bezier(0.165, 0.84, 0.44, 1)",
            }}
          >
            <h2 className="text-7xl font-bold mb-16 tracking-wider">
              <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                THE ROYAL EXPERIENCE
              </span>
            </h2>

            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="text-left space-y-8">
                <p className="text-xl leading-relaxed opacity-90">
                  Every animation we craft is a masterpiece of precision,
                  creativity, and technical excellence. We don't just create
                  motion graphics—we birth digital experiences that reign
                  supreme.
                </p>

                <div className="space-y-6">
                  {[
                    "🎭 Cinematic Storytelling",
                    "⚡ Lightning-Fast Delivery",
                    "👑 Royal Quality Standards",
                    "🎬 Hollywood-Grade Production",
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 group transform hover:translate-x-4 transition-transform duration-300"
                      style={{
                        opacity: isVisible.contact ? 1 : 0,
                        transform: `translateX(${
                          isVisible.contact ? 0 : -100
                        }px)`,
                        transition: `all 0.8s ease ${index * 200}ms`,
                      }}
                    >
                      <div className="w-4 h-4 border-2 border-white/50 rounded-full group-hover:bg-white/30 group-hover:scale-125 transition-all duration-300"></div>
                      <span className="text-xl tracking-wide group-hover:text-gray-300 transition-colors duration-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div
                  className="relative h-96 bg-gradient-to-br from-white/20 to-white/5 border-2 border-white/30 transform transition-all duration-1000 hover:scale-105"
                  style={{
                    transform: `perspective(1000px) rotateY(${
                      scrollY * 0.05
                    }deg) rotateX(${scrollY * 0.03}deg) translateZ(${
                      scrollY * 0.1
                    }px)`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-40"
                    style={{
                      backgroundImage:
                        'url("https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=600&h=600&fit=crop")',
                      filter: "grayscale(100%)",
                    }}
                  ></div>

                  <div className="absolute inset-4 border-2 border-white/20 bg-gradient-to-tr from-white/10 to-transparent transform translate-z-4"></div>
                  <div className="absolute inset-8 border border-white/15 bg-gradient-to-bl from-white/5 to-transparent transform translate-z-8"></div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="text-8xl opacity-40 animate-pulse transform"
                      style={{
                        transform: `rotateY(${
                          scrollY * 0.2
                        }deg) translateZ(20px)`,
                      }}
                    >
                      👑
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute top-4 right-4 w-6 h-6 border-2 border-white/50 rotate-45 animate-spin-slow"></div>
                  <div className="absolute bottom-4 left-4 w-4 h-4 bg-white/40 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Parallax Section */}
      <section
        className="relative h-screen flex items-center justify-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1611337084050-00fb3fd88c30?w=1920&h=1080&fit=crop")',
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          filter: "grayscale(100%) contrast(1.4)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/60 to-black/90"></div>

        <div className="relative z-30 text-center max-w-4xl mx-auto px-6">
          <div
            style={{
              transform: `perspective(1000px) rotateX(${
                scrollY * 0.003
              }deg) translateY(${scrollY * -0.08}px)`,
              opacity: Math.max(1 - Math.abs(scrollY - 4000) * 0.001, 0.4),
            }}
          >
            <h2 className="text-10xl font-bold mb-12 tracking-wider">
              <span
                className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent"
                style={{
                  textShadow: "0 40px 80px rgba(255,255,255,0.3)",
                  transform: `rotateY(${mousePos.x * 6}deg) rotateX(${
                    mousePos.y * 4
                  }deg)`,
                }}
              >
                BEYOND
              </span>
            </h2>
            <p className="text-3xl opacity-90 font-light mb-16">
              Step into the future of animation
            </p>
            <button className="group relative px-24 py-8 text-2xl tracking-wider border-4 border-white/60 hover:border-white transition-all duration-700 overflow-hidden transform hover:scale-115 hover:rotate-1">
              <span className="relative z-10 group-hover:text-black transition-colors duration-700 font-bold">
                BEGIN JOURNEY
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-100 to-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center"></div>
              <div className="absolute inset-0 border-2 border-white/40 transform rotate-45 scale-0 group-hover:scale-100 transition-transform duration-500"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="relative py-20 px-6 border-t border-white/20 bg-gradient-to-b from-gray-950 to-black"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div>
              <h3 className="text-3xl font-bold mb-6 tracking-wider">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  ROYAL STUDIOS
                </span>
              </h3>
              <p className="opacity-70 leading-relaxed">
                Crafting the future of animation with royal precision and
                artistic excellence.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-4 tracking-wide">
                SERVICES
              </h4>
              <div className="space-y-2">
                {[
                  "3D Animation",
                  "Motion Graphics",
                  "Brand Identity",
                  "UI Animation",
                ].map((service, index) => (
                  <div
                    key={index}
                    className="opacity-70 hover:opacity-100 hover:translate-x-2 transition-all duration-300 cursor-pointer"
                  >
                    {service}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-4 tracking-wide">
                CONNECT
              </h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 hover:text-gray-300 transition-colors duration-300 cursor-pointer">
                  <span>📧</span>
                  <span>royal@animations.com</span>
                </div>
                <div className="flex items-center space-x-3 hover:text-gray-300 transition-colors duration-300 cursor-pointer">
                  <span>📱</span>
                  <span>+1 (555) ROYAL-99</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
            <div className="text-2xl font-bold tracking-wider mb-4 md:mb-0">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                ROYAL ANIMATIONS
              </span>
            </div>
            <div className="flex space-x-8 text-sm opacity-60">
              <span>© 2024 Royal Animations</span>
              <span>•</span>
              <span>Premium Quality</span>
              <span>•</span>
              <span>Worldwide</span>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-spin-slow {
          animation: spin 12s linear infinite;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }

        html {
          scroll-behavior: smooth;
        }

        /* Enhanced Scrollbar */
        ::-webkit-scrollbar {
          width: 12px;
        }

        ::-webkit-scrollbar-track {
          background: #000;
          border-left: 1px solid rgba(255, 255, 255, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #333, #666, #333);
          border-radius: 6px;
          border: 2px solid #000;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #555, #888, #555);
        }

        /* Custom Animation Classes */
        .border-3 {
          border-width: 3px;
        }

        .border-4 {
          border-width: 4px;
        }

        .text-10xl {
          font-size: 8rem;
          line-height: 1;
        }

        .text-11xl {
          font-size: 10rem;
          line-height: 1;
        }

        .translate-z-4 {
          transform: translateZ(4px);
        }

        .translate-z-8 {
          transform: translateZ(8px);
        }

        /* Advanced Animations */
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default RoyalParallaxWebsite;
