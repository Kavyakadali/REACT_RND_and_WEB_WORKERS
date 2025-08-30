"use client";

import React, { useState, useRef, useEffect } from "react";

// Enhanced service data with gradients and additional details
const services = [
  {
    title: "Web Development",
    description:
      "Crafting responsive and high-performance web applications tailored to your needs.",
    features: ["React & Next.js", "Full-Stack Solutions", "Cloud Integration"],
    gradient: "from-cyan-400 via-blue-500 to-purple-600",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
    ),
    count: "01",
  },
  {
    title: "UI/UX Design",
    description:
      "Designing intuitive and visually stunning user interfaces for seamless experiences.",
    features: ["User Research", "Prototyping", "Design Systems"],
    gradient: "from-pink-400 via-rose-500 to-orange-500",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
        />
      </svg>
    ),
    count: "02",
  },
  {
    title: "Animation Solutions",
    description:
      "Creating captivating animations to elevate your brand's digital presence.",
    features: ["Motion Graphics", "3D Animations", "Interactive Effects"],
    gradient: "from-emerald-400 via-teal-500 to-cyan-600",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
    count: "03",
  },
];

// Animated character component with stagger effect
const AnimatedTitle = ({ text = "Our Services" }) => {
  return (
    <div className="flex justify-center items-center flex-wrap">
      {text.split("").map((char, i) => (
        <div
          key={i}
          className="inline-block text-5xl md:text-7xl font-black bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent"
          style={{
            animation: `charReveal 0.8s ease-out ${
              i * 0.08
            }s both, float 3s ease-in-out ${i * 0.1}s infinite`,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </div>
      ))}
    </div>
  );
};

// Floating particle component
const FloatingParticle = ({ delay = 0 }) => (
  <div
    className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-60"
    style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animation: `particleFloat 8s ease-in-out ${delay}s infinite`,
      filter: "blur(0.5px)",
    }}
  />
);

// Advanced service card component
const ServiceCard = ({ service, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    };

    const handleMouseLeave = () => {
      card.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
    };

    if (isHovered) {
      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isHovered]);

  return (
    <div
      ref={cardRef}
      className="group relative p-8 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 overflow-hidden cursor-pointer"
      style={{
        animation: `cardSlideUp 0.8s ease-out ${index * 0.2}s both`,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
      />

      {/* Animated border */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${service.gradient} p-[1px]`}
          style={{ animation: "borderRotate 3s linear infinite" }}
        >
          <div className="w-full h-full rounded-2xl bg-gray-900/90 backdrop-blur-lg"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Service number */}
        <div className="flex justify-between items-start mb-6">
          <span className="text-6xl font-black text-white/20 group-hover:text-white/40 transition-colors duration-300">
            {service.count}
          </span>
          <div
            className={`p-4 rounded-xl bg-gradient-to-br ${service.gradient} text-white transform group-hover:scale-110 transition-transform duration-300`}
            style={{
              animation: `iconFloat 2s ease-in-out ${index * 0.5}s infinite`,
            }}
          >
            {service.icon}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 mb-6 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
          {service.description}
        </p>

        {/* Features */}
        <div className="space-y-2 mb-6">
          {service.features.map((feature, i) => (
            <div
              key={i}
              className="flex items-center text-sm text-gray-500 group-hover:text-gray-400 transition-colors duration-300"
              style={{
                animation: `featureSlide 0.5s ease-out ${
                  index * 0.2 + i * 0.1
                }s both`,
              }}
            >
              <div
                className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.gradient} mr-3`}
              ></div>
              {feature}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center text-white group-hover:text-blue-400 transition-colors duration-300">
          <span className="text-sm font-medium">Explore More</span>
          <svg
            className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
    </div>
  );
};

const TrendyServicesSection = () => {
  return (
    <>
      <style jsx>{`
        @keyframes charReveal {
          0% {
            opacity: 0;
            transform: translateY(50px) rotateX(90deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotateX(0deg);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes particleFloat {
          0%,
          100% {
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.6;
          }
          25% {
            transform: translateY(-20px) translateX(10px) scale(1.2);
            opacity: 1;
          }
          50% {
            transform: translateY(-40px) translateX(-10px) scale(0.8);
            opacity: 0.8;
          }
          75% {
            transform: translateY(-20px) translateX(15px) scale(1.1);
            opacity: 0.9;
          }
        }

        @keyframes cardSlideUp {
          0% {
            opacity: 0;
            transform: translateY(80px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes borderRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes iconFloat {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-5px) rotate(2deg);
          }
        }

        @keyframes featureSlide {
          0% {
            opacity: 0;
            transform: translateX(-20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes meshGradient {
          0%,
          100% {
            transform: scale(1) rotate(0deg);
          }
          33% {
            transform: scale(1.1) rotate(120deg);
          }
          66% {
            transform: scale(0.9) rotate(240deg);
          }
        }
      `}</style>

      <section className="relative min-h-screen py-20 overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Animated mesh gradient background */}
        <div className="absolute inset-0">
          <div
            className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-pink-500/30 rounded-full blur-3xl"
            style={{ animation: "meshGradient 8s ease-in-out infinite" }}
          ></div>
          <div
            className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/20 via-blue-500/30 to-purple-500/20 rounded-full blur-3xl"
            style={{
              animation: "meshGradient 10s ease-in-out infinite reverse",
            }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/30 rounded-full blur-3xl"
            style={{ animation: "meshGradient 12s ease-in-out infinite" }}
          ></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <FloatingParticle key={i} delay={i * 0.5} />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <AnimatedTitle text="Our Services" />
            <p
              className="text-xl md:text-2xl text-gray-400 mt-8 max-w-3xl mx-auto leading-relaxed"
              style={{ animation: "cardSlideUp 1s ease-out 1s both" }}
            >
              Transforming ideas into breathtaking animated experiences with
              cutting-edge technology
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <ServiceCard key={index} service={service} index={index} />
            ))}
          </div>

          {/* Bottom CTA */}
          <div
            className="text-center mt-16"
            style={{ animation: "cardSlideUp 1s ease-out 2s both" }}
          >
            <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
              <span className="relative z-10">Start Your Project</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </section>
    </>
  );
};

export default TrendyServicesSection;
