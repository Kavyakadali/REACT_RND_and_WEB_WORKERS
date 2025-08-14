import React, { useState, useEffect, useRef } from "react";

const TrendyUserProfiles = () => {
  const [activeUser, setActiveUser] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Mock user data with placeholder images
  const users = [
    {
      id: 1,
      name: "Alex Rivera",
      role: "Creative Director",
      company: "Digital Dreams Studio",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      gradient: "from-purple-500 via-pink-500 to-red-500",
      skills: ["UI/UX Design", "3D Modeling", "Brand Strategy"],
      rating: 4.9,
      projects: 127,
      followers: "12.5K",
      status: "Available",
      bio: "Passionate about creating immersive digital experiences that blend creativity with cutting-edge technology.",
    },
    {
      id: 2,
      name: "Maya Chen",
      role: "Motion Designer",
      company: "Pixel Perfect Co.",
      avatar:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
      gradient: "from-cyan-500 via-blue-500 to-purple-500",
      skills: ["After Effects", "Cinema 4D", "Animation"],
      rating: 4.8,
      projects: 89,
      followers: "8.3K",
      status: "Busy",
      bio: "Award-winning motion designer specializing in fluid animations and visual storytelling for global brands.",
    },
    {
      id: 3,
      name: "Jordan Kim",
      role: "Full Stack Developer",
      company: "Tech Innovators",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      gradient: "from-green-500 via-teal-500 to-blue-500",
      skills: ["React", "Node.js", "WebGL"],
      rating: 4.7,
      projects: 156,
      followers: "15.2K",
      status: "Available",
      bio: "Full-stack developer with expertise in creating interactive web experiences and real-time applications.",
    },
    {
      id: 4,
      name: "Sofia Martinez",
      role: "UX Researcher",
      company: "Human Labs",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      gradient: "from-pink-500 via-rose-500 to-orange-500",
      skills: ["User Research", "Prototyping", "Data Analysis"],
      rating: 4.9,
      projects: 73,
      followers: "6.8K",
      status: "Available",
      bio: "UX researcher dedicated to understanding user behavior and creating data-driven design solutions.",
    },
    {
      id: 5,
      name: "Ryan Thompson",
      role: "3D Artist",
      company: "Vertex Studios",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      gradient: "from-indigo-500 via-purple-500 to-pink-500",
      skills: ["Blender", "Substance Painter", "Unreal Engine"],
      rating: 4.6,
      projects: 94,
      followers: "11.1K",
      status: "Busy",
      bio: "3D artist creating photorealistic renders and immersive virtual environments for entertainment industry.",
    },
    {
      id: 6,
      name: "Emma Davis",
      role: "Brand Designer",
      company: "Creative Collective",
      avatar:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
      gradient: "from-yellow-500 via-orange-500 to-red-500",
      skills: ["Brand Identity", "Typography", "Illustration"],
      rating: 4.8,
      projects: 112,
      followers: "9.7K",
      status: "Available",
      bio: "Brand designer crafting memorable visual identities that connect with audiences on an emotional level.",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    const interval = setInterval(() => {
      setActiveUser((prev) => (prev + 1) % users.length);
    }, 5000);

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(interval);
    };
  }, [users.length]);

  const getStatusColor = (status: string) => {
    return status === "Available" ? "bg-green-500" : "bg-orange-500";
  };

  const generateFloatingElements = () => {
    return Array.from({ length: 12 }, (_, i) => (
      <div
        key={i}
        className="absolute opacity-30"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${8 + Math.random() * 16}px`,
          height: `${8 + Math.random() * 16}px`,
          background: `hsl(${Math.random() * 360}, 70%, 60%)`,
          borderRadius: Math.random() > 0.5 ? "50%" : "20%",
          animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 2}s`,
        }}
      />
    ));
  };

  return (
    <div
      ref={containerRef}
      className="py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 relative overflow-hidden"
    >
      {/* Custom Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          33% { transform: translateY(-15px) rotate(120deg) scale(1.1); }
          66% { transform: translateY(-5px) rotate(240deg) scale(0.9); }
        }

        @keyframes slideIn {
          0% { transform: translateX(-100%) scale(0.8); opacity: 0; }
          100% { transform: translateX(0%) scale(1); opacity: 1; }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.1); }
          50% { box-shadow: 0 0 40px rgba(255, 255, 255, 0.3); }
        }

        @keyframes ripple {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }

        .card-hover:hover {
          animation: glow 2s ease-in-out infinite;
        }

        .skill-tag {
          animation: slideIn 0.6s ease-out forwards;
        }
      `}</style>

      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {generateFloatingElements()}
        <div
          className="absolute w-64 h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
          style={{
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            transform: "translate(-50%, -50%)",
            transition: "all 0.3s ease-out",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className={`text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            MEET OUR CREATORS
          </h2>
          <p
            className={`text-xl text-gray-300 max-w-3xl mx-auto transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            Talented individuals crafting the future of digital experiences
          </p>
        </div>

        {/* Main User Card */}
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
          {/* Featured User Card */}
          <div
            className={`flex-1 transform transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-20"
            }`}
          >
            <div className="relative">
              {/* Main Card */}
              <div
                className={`relative bg-gradient-to-br ${users[activeUser].gradient} p-1 rounded-3xl card-hover group`}
              >
                <div className="bg-gray-900/90 backdrop-blur-lg rounded-3xl p-8 h-full">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={users[activeUser].avatar}
                          alt={users[activeUser].name}
                          className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20 group-hover:scale-110 transition-transform duration-500"
                        />
                        <div
                          className={`absolute -bottom-1 -right-1 w-6 h-6 ${getStatusColor(
                            users[activeUser].status
                          )} rounded-full border-2 border-gray-900`}
                        />
                        {/* Ripple effect */}
                        <div
                          className={`absolute -bottom-1 -right-1 w-6 h-6 ${getStatusColor(
                            users[activeUser].status
                          )} rounded-full opacity-75`}
                          style={{ animation: "ripple 2s infinite" }}
                        />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                          {users[activeUser].name}
                        </h3>
                        <p className="text-purple-300 font-semibold">
                          {users[activeUser].role}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {users[activeUser].company}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-2">
                        <span className="text-yellow-400 text-lg">★</span>
                        <span className="text-white font-bold">
                          {users[activeUser].rating}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">
                        {users[activeUser].followers} followers
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {users[activeUser].bio}
                  </p>

                  {/* Skills */}
                  <div className="mb-6">
                    <p className="text-white font-semibold mb-3">
                      Skills & Expertise
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {users[activeUser].skills.map((skill, index) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20 skill-tag group-hover:bg-white/20 group-hover:border-white/30 transition-all duration-300"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10 group-hover:bg-white/10 transition-all duration-300">
                      <p className="text-2xl font-bold text-white">
                        {users[activeUser].projects}
                      </p>
                      <p className="text-gray-400 text-sm">Projects</p>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10 group-hover:bg-white/10 transition-all duration-300">
                      <p className="text-2xl font-bold text-green-400">
                        {users[activeUser].status}
                      </p>
                      <p className="text-gray-400 text-sm">Status</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                      View Portfolio
                    </button>
                    <button className="flex-1 border-2 border-white/30 text-white font-semibold py-3 px-6 rounded-xl hover:bg-white hover:text-gray-900 transform hover:scale-105 transition-all duration-300 backdrop-blur-sm">
                      Contact
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Accent Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full animate-pulse opacity-80" />
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-pulse opacity-60" />
            </div>
          </div>

          {/* User Grid */}
          <div
            className={`flex-1 transform transition-all duration-1000 delay-500 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-20"
            }`}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {users.map((user, index) => (
                <div
                  key={user.id}
                  className={`group cursor-pointer transition-all duration-500 ${
                    index === activeUser ? "scale-110 z-10" : "hover:scale-105"
                  }`}
                  onClick={() => setActiveUser(index)}
                >
                  <div
                    className={`relative bg-gradient-to-br ${
                      user.gradient
                    } p-1 rounded-2xl ${
                      index === activeUser
                        ? "ring-2 ring-white/50 shadow-2xl"
                        : ""
                    }`}
                  >
                    <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-4 text-center">
                      <div className="relative inline-block mb-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-16 h-16 rounded-xl object-cover border border-white/20 group-hover:scale-110 transition-transform duration-300"
                        />
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(
                            user.status
                          )} rounded-full border border-gray-900`}
                        />
                      </div>
                      <h4 className="text-white font-bold text-sm mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                        {user.name}
                      </h4>
                      <p className="text-gray-400 text-xs">{user.role}</p>
                      <div className="flex items-center justify-center space-x-1 mt-2">
                        <span className="text-yellow-400 text-xs">★</span>
                        <span className="text-white text-xs font-semibold">
                          {user.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center space-x-3">
          {users.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all duration-500 ${
                index === activeUser
                  ? "w-8 bg-gradient-to-r from-purple-400 to-pink-400"
                  : "w-2 bg-white/30 hover:bg-white/50"
              }`}
              onClick={() => setActiveUser(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendyUserProfiles;
