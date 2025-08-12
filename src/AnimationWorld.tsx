import React, { useState, useEffect, useRef } from 'react';

const AnimationWorld = () => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [visibleElements, setVisibleElements] = useState(new Set());
  const containerRef = useRef(null);
  const sectionsRef = useRef([]);

  const phases = [
    {
      title: "Welcome to our",
      subtitle: "ANIMATION WORLD",
      description: "Where creativity meets motion",
      gradient: "from-purple-600 via-pink-600 to-red-600"
    },
    {
      title: "Journey began in",
      subtitle: "2010",
      description: "Pioneering digital experiences",
      gradient: "from-blue-600 via-cyan-600 to-teal-600"
    },
    {
      title: "Evolved through",
      subtitle: "INNOVATION",
      description: "Pushing creative boundaries",
      gradient: "from-green-600 via-emerald-600 to-blue-600"
    },
    {
      title: "Creating the",
      subtitle: "FUTURE",
      description: "One animation at a time",
      gradient: "from-yellow-600 via-orange-600 to-red-600"
    }
  ];

  const services = [
    { title: "3D Animations", icon: "🎭", description: "Immersive 3D experiences that captivate", count: "150+" },
    { title: "Motion Graphics", icon: "🎨", description: "Dynamic visual storytelling", count: "300+" },
    { title: "UI Animations", icon: "💫", description: "Seamless user interactions", count: "500+" },
    { title: "Brand Identity", icon: "✨", description: "Memorable animated brands", count: "200+" },
    { title: "VFX & Effects", icon: "🚀", description: "Cinematic visual effects", count: "100+" },
    { title: "Web Animations", icon: "🌐", description: "Interactive web experiences", count: "400+" }
  ];

  const projects = [
    { name: "Cosmic Journey", year: "2024", type: "3D Animation", color: "from-purple-500 to-pink-500" },
    { name: "Digital Dreams", year: "2023", type: "Motion Graphics", color: "from-blue-500 to-cyan-500" },
    { name: "Future Vision", year: "2023", type: "UI/UX", color: "from-green-500 to-emerald-500" },
    { name: "Brand Orbit", year: "2022", type: "Branding", color: "from-orange-500 to-red-500" },
    { name: "Interactive Space", year: "2022", type: "Web Experience", color: "from-indigo-500 to-purple-500" },
    { name: "Visual Symphony", year: "2021", type: "VFX", color: "from-pink-500 to-rose-500" }
  ];

  const testimonials = [
    { name: "Sarah Johnson", company: "Tech Innovators", text: "Absolutely revolutionary work! The animations brought our vision to life." },
    { name: "Mike Chen", company: "Creative Studios", text: "Outstanding quality and attention to detail. Exceeded all expectations." },
    { name: "Emma Davis", company: "Future Brands", text: "Professional, creative, and delivered exactly what we needed." }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    const interval = setInterval(() => {
      setCurrentPhase(prev => (prev + 1) % phases.length);
    }, 4000);

    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Update active section based on scroll position
      const sections = sectionsRef.current;
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
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
      const elements = document.querySelectorAll('[data-reveal]');
      const newVisibleElements = new Set(visibleElements);
      
      elements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && !visibleElements.has(index)) {
          newVisibleElements.add(index);
        }
      });
      
      if (newVisibleElements.size !== visibleElements.size) {
        setVisibleElements(newVisibleElements);
      }
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [visibleElements]);

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
          background: `hsl(${Math.random() * 360}, 70%, 70%)`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${2 + Math.random() * 4}s`,
          transform: `translate(${Math.sin((scrollY + i) * 0.01) * 10}px, ${Math.cos((scrollY + i) * 0.01) * 10}px)`
        }}
      />
    ));
  };

  const generateFloatingShapes = () => {
    return Array.from({ length: 15 }, (_, i) => (
      <div
        key={i}
        className="absolute opacity-20 animate-spin"
        style={{
          width: `${20 + Math.random() * 60}px`,
          height: `${20 + Math.random() * 60}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          background: `linear-gradient(${Math.random() * 360}deg, rgba(147, 51, 234, 0.3), rgba(219, 39, 119, 0.3))`,
          borderRadius: Math.random() > 0.5 ? '50%' : '20%',
          animationDuration: `${10 + Math.random() * 20}s`,
          animationDirection: Math.random() > 0.5 ? 'normal' : 'reverse',
          transform: `translate(${Math.sin((scrollY + i * 100) * 0.005) * 50}px, ${Math.cos((scrollY + i * 100) * 0.005) * 30}px) rotate(${scrollY * 0.1 + i * 30}deg)`
        }}
      />
    ));
  };

  return (
    <div className="relative bg-black text-white overflow-x-hidden">
      {/* Enhanced Cursor Follower */}
      <div 
        className="fixed w-8 h-8 pointer-events-none z-50 mix-blend-difference"
        style={{
          left: mousePosition.x - 16,
          top: mousePosition.y - 16,
          background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(147,51,234,0.6) 50%, transparent 100%)',
          borderRadius: '50%',
          transition: 'all 0.1s ease-out',
          filter: 'blur(1px)'
        }}
      />

      {/* Animated Scroll Progress Bar with Gradient Shift */}
      <div className="fixed top-0 left-0 w-full h-2 bg-gray-900 z-50 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 via-cyan-500 to-yellow-500 transition-all duration-300 ease-out relative"
          style={{ 
            width: `${(scrollY / (document.body.scrollHeight - window.innerHeight)) * 100}%`,
            background: `linear-gradient(90deg, 
              hsl(${(scrollY * 0.1) % 360}, 70%, 60%) 0%, 
              hsl(${((scrollY * 0.1) + 60) % 360}, 70%, 60%) 50%, 
              hsl(${((scrollY * 0.1) + 120) % 360}, 70%, 60%) 100%)`
          }}
        >
          <div className="absolute inset-0 bg-white opacity-30 animate-pulse" />
        </div>
      </div>

      {/* Enhanced Floating Navigation with Pulse Effects */}
      <nav className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
        <div className="flex flex-col space-y-6">
          {['Hero', 'Services', 'Projects', 'About', 'Contact'].map((item, index) => (
            <div
              key={item}
              className={`relative cursor-pointer group transition-all duration-500 ${
                activeSection === index ? 'scale-125' : 'hover:scale-110'
              }`}
              onClick={() => sectionsRef.current[index]?.scrollIntoView({ behavior: 'smooth' })}
            >
              <div className={`w-4 h-4 rounded-full transition-all duration-300 ${
                activeSection === index 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg shadow-pink-500/50' 
                  : 'bg-gray-600 hover:bg-gray-400'
              }`}>
                {activeSection === index && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 animate-ping" />
                )}
              </div>
              <div className={`absolute right-6 top-1/2 transform -translate-y-1/2 px-3 py-1 rounded-md text-sm font-medium transition-all duration-300 ${
                activeSection === index 
                  ? 'opacity-100 translate-x-0 bg-white/10 backdrop-blur-sm text-white' 
                  : 'opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 bg-gray-800 text-gray-300'
              }`}>
                {item}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Hero Section with Enhanced Animations */}
      <section 
        ref={el => sectionsRef.current[0] = el}
        className={`relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br ${phases[currentPhase].gradient} transition-all duration-3000 ease-in-out`}
      >
        {/* Multiple Animated Background Layers */}
        <div className="absolute inset-0 opacity-30">
          <div 
            className="absolute inset-0 bg-grid-pattern"
            style={{
              transform: `translate(${Math.sin(scrollY * 0.001) * 20}px, ${Math.cos(scrollY * 0.001) * 20}px)`
            }}
          />
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
            style={{
              transform: `translateX(${-100 + (scrollY * 0.1) % 200}%)`,
              animation: 'slideAcross 4s ease-in-out infinite'
            }}
          />
        </div>

        {/* Enhanced Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {generateParticles(150)}
        </div>

        {/* Floating Geometric Shapes */}
        <div className="absolute inset-0 pointer-events-none">
          {generateFloatingShapes()}
        </div>

        {/* Enhanced Morphing Geometric Rings */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute border-2 rounded-full opacity-20"
              style={{
                width: `${150 + i * 80}px`,
                height: `${150 + i * 80}px`,
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) rotate(${scrollY * 0.1 + i * 45}deg) scale(${1 + Math.sin((scrollY + i * 100) * 0.01) * 0.1})`,
                borderColor: `hsl(${(scrollY * 0.1 + i * 60) % 360}, 70%, 60%)`,
                animation: `float ${15 + i * 3}s ease-in-out infinite`,
                animationDelay: `${i * 0.8}s`
              }}
            />
          ))}
        </div>

        {/* Main Content with Staggered Animations */}
        <div className={`relative z-10 text-center text-white transform transition-all duration-2000 ${isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
          <div className="mb-8 overflow-hidden">
            <h1 
              className="text-2xl md:text-4xl lg:text-6xl font-light tracking-wider transform transition-all duration-1500 ease-out"
              style={{
                transform: `translateY(${currentPhase * -50}px) rotateX(${Math.sin(scrollY * 0.01) * 5}deg)`,
                textShadow: '0 0 30px rgba(255,255,255,0.3)',
                filter: `hue-rotate(${scrollY * 0.1}deg)`
              }}
            >
              {phases[currentPhase].title}
            </h1>
          </div>

          <div className="relative mb-12">
            <h2 
              className="text-4xl md:text-6xl lg:text-8xl font-bold bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent transform transition-all duration-1000"
              style={{
                transform: `scale(${1 + Math.sin(Date.now() * 0.002) * 0.05}) perspective(1000px) rotateY(${Math.sin(scrollY * 0.005) * 10}deg)`,
                textShadow: '0 0 50px rgba(255,255,255,0.5)',
                filter: `drop-shadow(0 0 20px rgba(255,255,255,0.3))`
              }}
            >
              {phases[currentPhase].subtitle}
            </h2>
            
            {/* Enhanced Glitch layers with more effects */}
            <h2 
              className="absolute inset-0 text-4xl md:text-6xl lg:text-8xl font-bold text-red-400 opacity-20 mix-blend-multiply"
              style={{
                transform: `translate(${2 + Math.sin(scrollY * 0.01) * 2}px, ${Math.cos(scrollY * 0.01) * 2}px)`,
                animation: 'glitch 3s infinite'
              }}
            >
              {phases[currentPhase].subtitle}
            </h2>
            <h2 
              className="absolute inset-0 text-4xl md:text-6xl lg:text-8xl font-bold text-cyan-400 opacity-20 mix-blend-screen"
              style={{
                transform: `translate(${-2 + Math.sin(scrollY * 0.01 + Math.PI) * 2}px, ${Math.cos(scrollY * 0.01 + Math.PI) * 2}px)`,
                animation: 'glitch 3s infinite reverse'
              }}
            >
              {phases[currentPhase].subtitle}
            </h2>
          </div>

          <div className="mb-12 h-16">
            <p 
              className="text-lg md:text-xl lg:text-2xl font-light tracking-wide transform transition-all duration-1000"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: `translateY(${isVisible ? 0 : 30}px) scale(${1 + Math.sin(scrollY * 0.005) * 0.02})`,
                transitionDelay: '1.5s',
                textShadow: '0 0 20px rgba(255,255,255,0.2)'
              }}
            >
              {phases[currentPhase].description}
            </p>
          </div>

          {/* Enhanced Progress Indicators with Morphing Animation */}
          <div className="flex justify-center space-x-6 mb-12">
            {phases.map((_, index) => (
              <div
                key={index}
                className={`rounded-full transition-all duration-700 cursor-pointer relative overflow-hidden ${
                  index === currentPhase 
                    ? 'w-16 h-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500' 
                    : 'w-4 h-4 bg-white/30 hover:bg-white/60'
                }`}
                onClick={() => setCurrentPhase(index)}
                style={{
                  transform: `scale(${index === currentPhase ? 1.2 : 1}) rotate(${index === currentPhase ? 0 : Math.sin(scrollY * 0.01 + index) * 10}deg)`,
                  boxShadow: index === currentPhase ? '0 0 20px rgba(255,255,255,0.5)' : 'none'
                }}
              >
                {index === currentPhase && (
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-50"
                    style={{
                      animation: 'pulse 2s ease-in-out infinite',
                      transform: `translateX(${Math.sin(Date.now() * 0.005) * 100}%)`
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Enhanced Interactive Buttons */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <button 
              className="group relative px-12 py-6 border-2 border-white/30 rounded-full text-white font-semibold tracking-wider overflow-hidden transform hover:scale-110 transition-all duration-500 backdrop-blur-sm"
              onClick={() => sectionsRef.current[1]?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                boxShadow: '0 0 30px rgba(255,255,255,0.1)',
                background: 'linear-gradient(45deg, rgba(255,255,255,0.05), rgba(255,255,255,0.1))'
              }}
            >
              <span className="relative z-10">EXPLORE SERVICES</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 transform scale-0 group-hover:scale-100 transition-transform duration-700 rounded-full opacity-90" />
              <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 mix-blend-overlay" />
            </button>
            
            <button 
              className="group relative px-12 py-6 bg-gradient-to-r from-white/10 to-white/5 rounded-full text-white font-semibold tracking-wider transform hover:scale-110 transition-all duration-500 backdrop-blur-sm border border-white/20 overflow-hidden"
              onClick={() => setCurrentPhase(0)}
              style={{
                boxShadow: '0 0 30px rgba(255,255,255,0.1)'
              }}
            >
              <span className="relative z-10">RESTART JOURNEY</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </button>
          </div>
        </div>

        {/* Enhanced Floating Timeline */}
        <div className="absolute -right-20 top-1/2 transform -translate-y-1/2 hidden xl:block">
          <div className="flex flex-col space-y-12">
            {['2010', '2015', '2020', '2025'].map((year, index) => (
              <div
                key={year}
                className={`text-right transform transition-all duration-700 ${
                  index <= currentPhase ? 'opacity-100 translate-x-0' : 'opacity-30 translate-x-8'
                }`}
                style={{ 
                  transitionDelay: `${index * 0.3}s`,
                  transform: `translateX(${index <= currentPhase ? 0 : 20}px) translateY(${Math.sin((scrollY + index * 200) * 0.01) * 10}px)`
                }}
              >
                <div 
                  className="text-3xl font-bold mb-2"
                  style={{
                    color: `hsl(${(index * 90 + scrollY * 0.1) % 360}, 70%, 70%)`,
                    textShadow: '0 0 15px rgba(255,255,255,0.3)'
                  }}
                >
                  {year}
                </div>
                <div className="text-sm opacity-70">Milestone</div>
                <div 
                  className="w-1 h-12 mx-auto mt-2 rounded-full opacity-60"
                  style={{
                    background: `linear-gradient(to bottom, hsl(${(index * 90) % 360}, 70%, 70%), transparent)`
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section 
        ref={el => sectionsRef.current[1] = el}
        className="py-32 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden"
      >
        {/* Enhanced Background Animation */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-white to-transparent"
              style={{
                top: `${(i + 1) * 3.33}%`,
                left: '-100%',
                right: '-100%',
                animation: `slideLine ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`,
                transform: `translateY(${Math.sin((scrollY + i * 50) * 0.01) * 20}px)`
              }}
            />
          ))}
          {generateFloatingShapes()}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24">
            <h2 
              data-reveal
              className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent transform transition-all duration-1000"
              style={{
                transform: `translateY(${Math.max(0, (scrollY - 800) * -0.1)}px) rotateX(${Math.sin(scrollY * 0.005) * 5}deg)`,
                filter: `hue-rotate(${scrollY * 0.1}deg)`,
                textShadow: '0 0 50px rgba(147, 51, 234, 0.3)'
              }}
            >
              OUR SERVICES
            </h2>
            <p 
              className="text-xl text-gray-400 max-w-3xl mx-auto transform transition-all duration-1000 delay-300"
              style={{
                transform: `translateY(${visibleElements.has(0) ? 0 : 50}px)`,
                opacity: visibleElements.has(0) ? 1 : 0
              }}
            >
              Transforming ideas into breathtaking animated experiences with cutting-edge technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={service.title}
                data-reveal
                className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-gray-700/50 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-700 transform hover:scale-105 hover:-translate-y-2 overflow-hidden"
                style={{
                  transform: `translateY(${visibleElements.has(index + 1) ? 0 : 80}px) rotateY(${Math.sin((scrollY + index * 100) * 0.005) * 3}deg)`,
                  opacity: visibleElements.has(index + 1) ? 1 : 0,
                  transitionDelay: `${index * 150}ms`,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
                }}
              >
                {/* Animated Background Gradient */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl"
                  style={{
                    background: `linear-gradient(135deg, hsl(${(index * 60) % 360}, 70%, 60%), hsl(${((index * 60) + 120) % 360}, 70%, 60%))`
                  }}
                />
                
                {/* Floating Icon with Enhanced Animation */}
                <div 
                  className="text-7xl mb-8 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 relative z-10"
                  style={{
                    transform: `translateY(${Math.sin((scrollY + index * 200) * 0.01) * 5}px) rotate(${Math.sin((scrollY + index * 100) * 0.005) * 10}deg)`,
                    filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.2))'
                  }}
                >
                  {service.icon}
                </div>

                <h3 
                  className="text-2xl font-bold mb-6 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-500"
                  style={{
                    textShadow: '0 0 10px rgba(255,255,255,0.1)'
                  }}
                >
                  {service.title}
                </h3>

                <p className="text-gray-400 mb-8 group-hover:text-gray-300 transition-colors duration-300">
                  {service.description}
                </p>

                <div className="flex items-center justify-between relative z-10">
                  <span 
                    className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                    style={{
                      textShadow: '0 0 20px rgba(147, 51, 234, 0.5)'
                    }}
                  >
                    {service.count}
                  </span>
                  <div 
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-180"
                    style={{
                      boxShadow: '0 0 20px rgba(147, 51, 234, 0.2)'
                    }}
                  >
                    <span className="text-purple-400 group-hover:text-white transition-colors duration-300 text-xl">→</span>
                  </div>
                </div>

                {/* Animated Border Effect */}
                <div 
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(45deg, transparent, hsl(${(index * 60) % 360}, 70%, 60%), transparent)`,
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'subtract',
                    padding: '2px'
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Projects Section with Advanced Carousel */}
      <section 
        ref={el => sectionsRef.current[2] = el}
        className="py-32 bg-black relative overflow-hidden"
      >
        {/* Dynamic Background Particles */}
        <div className="absolute inset-0">
          {generateParticles(200)}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 
            className="text-5xl md:text-7xl font-bold text-center mb-24 text-white relative"
            style={{
              transform: `translateY(${Math.sin(scrollY * 0.005) * 10}px)`,
              textShadow: '0 0 50px rgba(255,255,255,0.3)',
              filter: `hue-rotate(${scrollY * 0.2}deg)`
            }}
          >
            <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              FEATURED PROJECTS
            </span>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full animate-pulse" />
          </h2>
          
          <div className="relative mb-16">
            {/* Enhanced Infinite Carousel */}
            <div 
              className="flex space-x-8 transition-transform duration-1000 ease-out"
              style={{
                transform: `translateX(-${(scrollY * 0.8) % (projects.length * 400)}px)`
              }}
            >
              {[...projects, ...projects, ...projects].map((project, index) => (
                <div
                  key={`${project.name}-${index}`}
                  className={`flex-shrink-0 w-80 h-96 rounded-3xl bg-gradient-to-br ${project.color} p-8 flex flex-col justify-between transform hover:scale-110 hover:-translate-y-4 transition-all duration-700 relative overflow-hidden group cursor-pointer`}
                  style={{
                    transform: `translateY(${Math.sin((scrollY + index * 150) * 0.005) * 10}px) rotateY(${Math.sin((scrollY + index * 100) * 0.003) * 5}deg)`,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(255,255,255,0.1)',
                    filter: 'brightness(1.1) contrast(1.1)'
                  }}
                >
                  {/* Animated Background Pattern */}
                  <div 
                    className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at ${50 + Math.sin((scrollY + index * 100) * 0.01) * 20}% ${50 + Math.cos((scrollY + index * 100) * 0.01) * 20}%, rgba(255,255,255,0.3) 0%, transparent 50%)`
                    }}
                  />
                  
                  {/* Floating Particles Inside Card */}
                  <div className="absolute inset-0 pointer-events-none">
                    {Array.from({ length: 15 }, (_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-pulse"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 2}s`,
                          transform: `translate(${Math.sin((scrollY + i * 50) * 0.01) * 10}px, ${Math.cos((scrollY + i * 50) * 0.01) * 10}px)`
                        }}
                      />
                    ))}
                  </div>

                  <div className="relative z-10">
                    <span 
                      className="text-sm font-semibold opacity-80 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm"
                      style={{
                        textShadow: '0 0 10px rgba(255,255,255,0.5)'
                      }}
                    >
                      {project.year}
                    </span>
                    <h3 
                      className="text-3xl font-bold mt-4 mb-4 group-hover:scale-105 transition-transform duration-300"
                      style={{
                        textShadow: '0 0 20px rgba(0,0,0,0.5)'
                      }}
                    >
                      {project.name}
                    </h3>
                    <p 
                      className="text-lg opacity-90 px-3 py-1 rounded-full bg-black/20 backdrop-blur-sm inline-block"
                      style={{
                        textShadow: '0 0 10px rgba(255,255,255,0.3)'
                      }}
                    >
                      {project.type}
                    </p>
                  </div>
                  
                  {/* Interactive Preview Area */}
                  <div 
                    className="w-full h-32 bg-black/20 rounded-xl backdrop-blur-sm flex items-center justify-center group-hover:bg-black/30 transition-all duration-300 relative overflow-hidden border border-white/20"
                    style={{
                      boxShadow: 'inset 0 0 20px rgba(255,255,255,0.1)'
                    }}
                  >
                    <span 
                      className="text-5xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500"
                      style={{
                        filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.5))',
                        transform: `rotate(${Math.sin((scrollY + index * 100) * 0.01) * 5}deg)`
                      }}
                    >
                      🎨
                    </span>
                    
                    {/* Hover Animation Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>

                  {/* Border Glow Effect */}
                  <div 
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      boxShadow: `0 0 30px rgba(255,255,255,0.3), inset 0 0 30px rgba(255,255,255,0.1)`,
                      border: '1px solid rgba(255,255,255,0.3)'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section with Dynamic Counters */}
      <section 
        ref={el => sectionsRef.current[3] = el}
        className="py-32 bg-gradient-to-r from-purple-900 via-pink-900 to-indigo-900 relative overflow-hidden"
      >
        {/* Advanced Background Animation */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(circle at ${50 + Math.sin(scrollY * 0.001) * 30}% ${50 + Math.cos(scrollY * 0.001) * 30}%, rgba(255,255,255,0.1) 0%, transparent 70%)`
            }}
          />
          {generateFloatingShapes()}
          {generateParticles(100)}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '1500+', label: 'Projects Completed', color: 'from-yellow-400 to-orange-500' },
              { number: '500+', label: 'Happy Clients', color: 'from-green-400 to-blue-500' },
              { number: '15+', label: 'Years Experience', color: 'from-purple-400 to-pink-500' },
              { number: '50+', label: 'Awards Won', color: 'from-red-400 to-yellow-500' }
            ].map((stat, index) => (
              <div
                key={stat.label}
                data-reveal
                className="transform hover:scale-125 transition-all duration-700 group cursor-pointer"
                style={{
                  transform: `translateY(${Math.sin((scrollY + index * 300) * 0.005) * 20}px) rotateX(${Math.sin((scrollY + index * 200) * 0.003) * 10}deg)`,
                  opacity: visibleElements.has(index + 10) ? 1 : 0,
                  transitionDelay: `${index * 200}ms`
                }}
              >
                <div 
                  className={`text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-500 relative`}
                  style={{
                    textShadow: '0 0 30px rgba(255,255,255,0.3)',
                    filter: `drop-shadow(0 0 20px rgba(255,255,255,0.2))`
                  }}
                >
                  {stat.number}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent opacity-50 blur-sm`}
                    style={{
                      transform: `scale(${1.1 + Math.sin((scrollY + index * 100) * 0.01) * 0.1})`
                    }}
                  >
                    {stat.number}
                  </div>
                </div>
                <div 
                  className="text-lg text-purple-200 group-hover:text-white transition-colors duration-300 relative"
                  style={{
                    textShadow: '0 0 15px rgba(255,255,255,0.2)'
                  }}
                >
                  {stat.label}
                  <div 
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-white to-white group-hover:w-full transition-all duration-500"
                    style={{
                      boxShadow: '0 0 10px rgba(255,255,255,0.5)'
                    }}
                  />
                </div>
                
                {/* Animated Ring Around Stats */}
                <div 
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    border: `2px solid transparent`,
                    background: `linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent) border-box`,
                    mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'subtract',
                    animation: 'spin 3s linear infinite'
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section 
        ref={el => sectionsRef.current[4] = el}
        className="py-32 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden"
      >
        {/* Dynamic Background Effects */}
        <div className="absolute inset-0">
          {generateFloatingShapes()}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              background: `conic-gradient(from ${scrollY * 0.1}deg, #9333ea, #ec4899, #06b6d4, #9333ea)`
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 
            className="text-5xl md:text-7xl font-bold text-center mb-24 text-white relative"
            style={{
              transform: `translateY(${Math.sin(scrollY * 0.003) * 15}px)`,
              textShadow: '0 0 50px rgba(255,255,255,0.3)'
            }}
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              CLIENT STORIES
            </span>
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full animate-ping opacity-70" />
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                data-reveal
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-gray-700/50 rounded-3xl p-8 transform hover:scale-105 hover:-translate-y-4 transition-all duration-700 relative overflow-hidden group"
                style={{
                  transform: `translateY(${Math.sin((scrollY + index * 400) * 0.003) * 25}px) rotateZ(${Math.sin((scrollY + index * 200) * 0.002) * 2}deg)`,
                  opacity: visibleElements.has(index + 15) ? 1 : 0,
                  transitionDelay: `${index * 300}ms`,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
                }}
              >
                {/* Animated Quote Background */}
                <div 
                  className="absolute top-4 left-4 text-8xl opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                  style={{
                    color: `hsl(${(index * 120 + scrollY * 0.1) % 360}, 70%, 60%)`,
                    transform: `rotate(${Math.sin((scrollY + index * 100) * 0.01) * 10}deg)`
                  }}
                >
                  "
                </div>

                <div 
                  className="text-7xl mb-8 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500"
                  style={{
                    filter: `hue-rotate(${(scrollY + index * 100) * 0.1}deg) drop-shadow(0 0 20px rgba(255,255,255,0.3))`,
                    transform: `translateY(${Math.sin((scrollY + index * 150) * 0.01) * 3}px)`
                  }}
                >
                  💬
                </div>

                <p 
                  className="text-gray-300 mb-8 text-lg leading-relaxed relative z-10 group-hover:text-gray-100 transition-colors duration-300"
                  style={{
                    textShadow: '0 0 10px rgba(255,255,255,0.1)'
                  }}
                >
                  "{testimonial.text}"
                </p>

                <div className="relative z-10">
                  <h4 
                    className="text-white font-bold text-xl mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-500"
                    style={{
                      textShadow: '0 0 15px rgba(255,255,255,0.2)'
                    }}
                  >
                    {testimonial.name}
                  </h4>
                  <p 
                    className="text-purple-400 font-medium"
                    style={{
                      color: `hsl(${(index * 90 + scrollY * 0.05) % 360}, 70%, 70%)`,
                      textShadow: '0 0 10px rgba(147, 51, 234, 0.3)'
                    }}
                  >
                    {testimonial.company}
                  </p>
                </div>

                {/* Hover Glow Effect */}
                <div 
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, 
                      hsla(${(index * 120) % 360}, 70%, 60%, 0.1) 0%, 
                      hsla(${((index * 120) + 120) % 360}, 70%, 60%, 0.1) 100%)`,
                    boxShadow: `0 0 40px hsla(${(index * 120) % 360}, 70%, 60%, 0.3)`
                  }}
                />

                {/* Animated Border */}
                <div 
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background: `conic-gradient(from ${scrollY * 0.1 + index * 120}deg, 
                      transparent, 
                      hsla(${(index * 120) % 360}, 70%, 60%, 0.5), 
                      transparent)`,
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'subtract',
                    padding: '1px',
                    opacity: 0,
                    animation: `borderRotate 4s linear infinite`,
                    animationPlayState: 'paused'
                  }}
                  onMouseEnter={(e) => e.target.style.animationPlayState = 'running'}
                  onMouseLeave={(e) => e.target.style.animationPlayState = 'paused'}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Contact Section */}
      <section className="py-32 bg-gradient-to-t from-purple-900 via-pink-900 to-black relative overflow-hidden">
        {/* Ultimate Background Animation */}
        <div className="absolute inset-0">
          {generateParticles(300)}
          {generateFloatingShapes()}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(ellipse at ${50 + Math.sin(scrollY * 0.001) * 40}% ${50 + Math.cos(scrollY * 0.001) * 40}%, 
                hsla(${scrollY * 0.1}, 70%, 60%, 0.3) 0%, 
                hsla(${scrollY * 0.1 + 120}, 70%, 60%, 0.2) 50%, 
                transparent 100%)`
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 
            className="text-5xl md:text-8xl font-bold mb-12 text-white relative"
            style={{
              transform: `translateY(${Math.sin(scrollY * 0.002) * 20}px) rotateX(${Math.sin(scrollY * 0.001) * 5}deg)`,
              textShadow: '0 0 60px rgba(255,255,255,0.4)',
              filter: `hue-rotate(${scrollY * 0.2}deg)`
            }}
          >
            <span className="bg-gradient-to-r from-yellow-400 via-red-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
              LET'S CREATE MAGIC
            </span>
            
            {/* Floating Magic Sparkles */}
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className="absolute text-2xl opacity-70"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${-20 + Math.random() * 40}%`,
                  color: `hsl(${(i * 45 + scrollY * 0.1) % 360}, 70%, 70%)`,
                  animation: `float ${2 + Math.random() * 3}s ease-in-out infinite`,
                  animationDelay: `${i * 0.5}s`,
                  transform: `translate(${Math.sin((scrollY + i * 200) * 0.005) * 20}px, ${Math.cos((scrollY + i * 200) * 0.005) * 20}px)`
                }}
              >
                ✨
              </div>
            ))}
          </h2>

          <p 
            className="text-xl text-gray-300 mb-16 max-w-2xl mx-auto leading-relaxed"
            style={{
              textShadow: '0 0 20px rgba(255,255,255,0.2)',
              transform: `translateY(${Math.sin(scrollY * 0.004) * 10}px)`
            }}
          >
            Ready to bring your vision to life? Let's collaborate and create something 
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold"> extraordinary </span>
            together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center mb-16">
            <button 
              className="group relative px-16 py-8 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full text-white font-bold text-xl overflow-hidden transform hover:scale-110 transition-all duration-700"
              style={{
                boxShadow: '0 0 50px rgba(147, 51, 234, 0.5), 0 20px 40px rgba(0,0,0,0.3)',
                background: `linear-gradient(45deg, 
                  hsl(${(scrollY * 0.1) % 360}, 70%, 60%), 
                  hsl(${(scrollY * 0.1 + 120) % 360}, 70%, 60%), 
                  hsl(${(scrollY * 0.1 + 240) % 360}, 70%, 60%))`
              }}
            >
              <span className="relative z-10">START PROJECT</span>
              <div 
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/40 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                style={{
                  background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
            </button>

            <button 
              className="group relative px-16 py-8 border-2 border-white/30 rounded-full text-white font-bold text-xl hover:bg-white hover:text-black transform hover:scale-110 transition-all duration-700 backdrop-blur-sm overflow-hidden"
              style={{
                boxShadow: '0 0 30px rgba(255,255,255,0.2), 0 20px 40px rgba(0,0,0,0.3)',
                borderColor: `hsl(${(scrollY * 0.1 + 180) % 360}, 70%, 70%)`
              }}
            >
              <span className="relative z-10">VIEW PORTFOLIO</span>
              <div className="absolute inset-0 bg-white transform scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full origin-center" />
              <div 
                className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 transform -rotate-45 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                style={{
                  background: `linear-gradient(45deg, 
                    hsla(${(scrollY * 0.1) % 360}, 70%, 60%, 0.2), 
                    hsla(${(scrollY * 0.1 + 180) % 360}, 70%, 60%, 0.2))`
                }}
              />
            </button>
          </div>

          {/* Interactive Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              { icon: '📧', title: 'Email', info: 'hello@animationworld.com' },
              { icon: '📱', title: 'Phone', info: '+1 (555) 123-4567' },
              { icon: '📍', title: 'Location', info: 'New York, USA' }
            ].map((contact, index) => (
              <div
                key={contact.title}
                className="group cursor-pointer transform hover:scale-110 transition-all duration-500"
                style={{
                  transform: `translateY(${Math.sin((scrollY + index * 300) * 0.005) * 15}px)`
                }}
              >
                <div 
                  className="text-4xl mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500"
                  style={{
                    filter: `hue-rotate(${(index * 120 + scrollY * 0.1) % 360}deg) drop-shadow(0 0 20px rgba(255,255,255,0.3))`
                  }}
                >
                  {contact.icon}
                </div>
                <h3 
                  className="text-lg font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-500"
                  style={{
                    textShadow: '0 0 15px rgba(255,255,255,0.2)'
                  }}
                >
                  {contact.title}
                </div>
                <p 
                  className="text-gray-400 group-hover:text-gray-200 transition-colors duration-300"
                  style={{
                    textShadow: '0 0 10px rgba(255,255,255,0.1)'
                  }}
                >
                  {contact.info}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Custom CSS Animations */}
      <style jsx>{`
        @keyframes slideAcross {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes slideLine {
          0% { transform: translateX(-100%) scaleX(0); opacity: 0; }
          50% { transform: translateX(0%) scaleX(1); opacity: 1; }
          100% { transform: translateX(100%) scaleX(0); opacity: 0; }
        }
        
        @keyframes glitch {
          0%, 100% { transform: translate(0, 0) skew(0deg); }
          10% { transform: translate(-2px, -2px) skew(1deg); }
          20% { transform: translate(2px, 2px) skew(-1deg); }
          30% { transform: translate(-2px, 2px) skew(2deg); }
          40% { transform: translate(2px, -2px) skew(-2deg); }
          50% { transform: translate(-2px, -2px) skew(1deg); }
          60% { transform: translate(2px, 2px) skew(-1deg); }
          70% { transform: translate(-2px, 2px) skew(2deg); }
          80% { transform: translate(2px, -2px) skew(-2deg); }
          90% { transform: translate(-2px, -2px) skew(1deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          25% { transform: translateY(-20px) rotate(5deg) scale(1.05); }
          50% { transform: translateY(-10px) rotate(10deg) scale(1.1); }
          75% { transform: translateY(-15px) rotate(-5deg) scale(1.05); }
        }
        
        @keyframes borderRotate {
          0% { transform: rotate(0deg); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: rotate(360deg); opacity: 0; }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px);
          background-size: 60px 60px;
          animation: moveGrid 25s linear infinite;
        }
        
        @keyframes moveGrid {
          0% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(15px, 15px) scale(1.02); }
          50% { transform: translate(30px, 30px) scale(1); }
          75% { transform: translate(45px, 15px) scale(0.98); }
          100% { transform: translate(60px, 60px) scale(1); }
        }
        
        /* Advanced Hover Effects */
        .group:hover .animate-on-hover {
          animation: float 2s ease-in-out infinite;
        }
        
        /* Smooth Scroll Behavior */
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 12px;
        }
        
        ::-webkit-scrollbar-track {
          background: linear-gradient(180deg, #1a1a1a, #2a2a2a);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #9333ea, #ec4899, #06b6d4);
          border-radius: 10px;
          border: 2px solid #1a1a1a;
          animation: scrollbarGlow 3s ease-in-out infinite;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #a855f7, #f472b6, #22d3ee);
          box-shadow: 0 0 20px rgba(147, 51, 234, 0.5);
        }
        
        @keyframes scrollbarGlow {
          0%, 100% { box-shadow: 0 0 10px rgba(147, 51, 234, 0.3); }
          50% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.5); }
        }
        
        /* Particle Effects */
        @keyframes particleFloat {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0.4;
          }
          25% { 
            transform: translateY(-30px) translateX(10px) rotate(90deg);
            opacity: 0.8;
          }
          50% { 
            transform: translateY(-20px) translateX(-5px) rotate(180deg);
            opacity: 1;
          }
          75% { 
            transform: translateY(-40px) translateX(15px) rotate(270deg);
            opacity: 0.6;
          }
        }
        
        /* Glow Pulse Effect */
        @keyframes glowPulse {
          0%, 100% {
            text-shadow: 0 0 5px rgba(255,255,255,0.2), 
                         0 0 10px rgba(147, 51, 234, 0.3), 
                         0 0 15px rgba(236, 72, 153, 0.2);
          }
          50% {
            text-shadow: 0 0 10px rgba(255,255,255,0.4), 
                         0 0 20px rgba(147, 51, 234, 0.5), 
                         0 0 30px rgba(236, 72, 153, 0.4);
          }
        }
        
        /* Morphing Background */
        @keyframes morphBackground {
          0%, 100% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
            transform: rotate(0deg) scale(1);
          }
          25% {
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
            transform: rotate(90deg) scale(1.1);
          }
          50% {
            border-radius: 50% 60% 30% 60% / 60% 40% 60% 40%;
            transform: rotate(180deg) scale(0.9);
          }
          75% {
            border-radius: 60% 40% 60% 40% / 30% 60% 40% 70%;
            transform: rotate(270deg) scale(1.05);
          }
        }
        
        /* Advanced Text Effects */
        .text-glow {
          animation: glowPulse 4s ease-in-out infinite;
        }
        
        .text-shimmer {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          background-size: 200% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s ease-in-out infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        /* 3D Card Flip Effect */
        .flip-card {
          perspective: 1000px;
        }
        
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.8s;
          transform-style: preserve-3d;
        }
        
        .flip-card:hover .flip-card-inner {
          transform: rotateY(180deg);
        }
        
        /* Liquid Blob Animation */
        @keyframes liquidBlob {
          0%, 100% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
            transform: translate(0px, 0px) scale(1) rotate(0deg);
          }
          25% {
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
            transform: translate(10px, -10px) scale(1.1) rotate(90deg);
          }
          50% {
            border-radius: 50% 60% 30% 60% / 60% 40% 60% 40%;
            transform: translate(-5px, 5px) scale(0.95) rotate(180deg);
          }
          75% {
            border-radius: 60% 40% 60% 40% / 30% 60% 40% 70%;
            transform: translate(-10px, -5px) scale(1.05) rotate(270deg);
          }
        }
        
        /* Rainbow Border Animation */
        @keyframes rainbowBorder {
          0% {
            border-image: linear-gradient(0deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080) 1;
          }
          25% {
            border-image: linear-gradient(90deg, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080, #ff0000) 1;
          }
          50% {
            border-image: linear-gradient(180deg, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080, #ff0000, #ff8000) 1;
          }
          75% {
            border-image: linear-gradient(270deg, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080, #ff0000, #ff8000, #ffff00) 1;
          }
          100% {
            border-image: linear-gradient(360deg, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080, #ff0000, #ff8000, #ffff00, #80ff00) 1;
          }
        }
        
        /* Magnetic Hover Effect */
        .magnetic {
          transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .magnetic:hover {
          transform: scale(1.05) translateZ(0);
        }
        
        /* Neon Glow Effect */
        .neon-glow {
          text-shadow: 
            0 0 5px currentColor,
            0 0 10px currentColor,
            0 0 20px currentColor,
            0 0 40px #ff00ff,
            0 0 80px #ff00ff,
            0 0 90px #ff00ff,
            0 0 100px #ff00ff,
            0 0 150px #ff00ff;
          animation: neonFlicker 2s ease-in-out infinite alternate;
        }
        
        @keyframes neonFlicker {
          0%, 18%, 22%, 25%, 53%, 57%, 100% {
            text-shadow: 
              0 0 5px currentColor,
              0 0 10px currentColor,
              0 0 20px currentColor,
              0 0 40px #ff00ff,
              0 0 80px #ff00ff,
              0 0 90px #ff00ff,
              0 0 100px #ff00ff,
              0 0 150px #ff00ff;
          }
          20%, 24%, 55% {
            text-shadow: none;
          }
        }
        
        /* Holographic Effect */
        .holographic {
          background: linear-gradient(45deg, #ff0080, #ff8c00, #40e0d0, #ff0080);
          background-size: 400% 400%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: holographicShift 4s ease-in-out infinite;
        }
        
        @keyframes holographicShift {
          0%, 100% { background-position: 0% 50%; }
          25% { background-position: 100% 50%; }
          50% { background-position: 100% 100%; }
          75% { background-position: 0% 100%; }
        }
        
        /* Breathing Animation */
        @keyframes breathe {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.05) rotate(2deg); }
        }
        
        .breathe {
          animation: breathe 4s ease-in-out infinite;
        }
        
        /* Matrix Rain Effect */
        .matrix-rain {
          position: relative;
          overflow: hidden;
        }
        
        .matrix-rain::before {
          content: '';
          position: absolute;
          top: -100%;
          left: 0;
          width: 100%;
          height: 200%;
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(0, 255, 0, 0.1) 10%,
            rgba(0, 255, 0, 0.2) 20%,
            transparent 30%
          );
          animation: matrixRain 3s linear infinite;
        }
        
        @keyframes matrixRain {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        /* Cyber Grid Effect */
        .cyber-grid {
          background-image: 
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
          animation: cyberGridMove 10s linear infinite;
        }
        
        @keyframes cyberGridMove {
          0% { background-position: 0 0; }
          100% { background-position: 20px 20px; }
        }
        
        /* Plasma Wave Effect */
        @keyframes plasmaWave {
          0%, 100% {
            background-position: 0% 50%;
            transform: scale(1) rotate(0deg);
          }
          25% {
            background-position: 25% 25%;
            transform: scale(1.1) rotate(90deg);
          }
          50% {
            background-position: 100% 50%;
            transform: scale(0.9) rotate(180deg);
          }
          75% {
            background-position: 75% 75%;
            transform: scale(1.05) rotate(270deg);
          }
        }
        
        .plasma-wave {
          background: linear-gradient(
            45deg,
            #ff006e, #8338ec, #3a86ff, #06ffa5, #ffbe0b
          );
          background-size: 400% 400%;
          animation: plasmaWave 8s ease-in-out infinite;
        }
        
        /* Smooth Transitions for All Elements */
        * {
          transition-property: transform, opacity, color, background-color, border-color, text-shadow, box-shadow;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Performance Optimizations */
        .gpu-accelerated {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000;
          will-change: transform, opacity;
        }
        
        /* Responsive Animations */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        /* Ultra-smooth scrolling */
        @supports (scroll-behavior: smooth) {
          html {
            scroll-behavior: smooth;
          }
        }
      `}</style>
    </div>
  );
};

export default AnimationWorld;