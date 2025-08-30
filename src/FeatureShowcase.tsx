import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Zap, Eye, Layers, Sparkles } from "lucide-react";

const FeatureShowcase = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance with smooth 60fps animations",
      metallic: "from-yellow-200 via-yellow-300 to-yellow-600",
      shadow: "shadow-yellow-500/20",
    },
    {
      icon: Eye,
      title: "Visual Excellence",
      description: "Pixel-perfect design with attention to every detail",
      metallic: "from-purple-200 via-purple-300 to-purple-600",
      shadow: "shadow-purple-500/20",
    },
    {
      icon: Layers,
      title: "Layered Experience",
      description: "Multi-dimensional interactions that engage users",
      metallic: "from-blue-200 via-blue-300 to-blue-600",
      shadow: "shadow-blue-500/20",
    },
    {
      icon: Sparkles,
      title: "Premium Feel",
      description: "Luxury animations that elevate your brand",
      metallic: "from-emerald-200 via-emerald-300 to-emerald-600",
      shadow: "shadow-emerald-500/20",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 80,
      rotateX: -15,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 1.2,
      },
    },
  };

  const titleVariants = {
    hidden: {
      opacity: 0,
      y: -50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 10,
        duration: 0.8,
      },
    },
  };

  return (
    <section
      ref={containerRef}
      className="py-32 px-4 bg-gradient-to-b from-black via-gray-950 to-black relative overflow-hidden"
    >
      {/* Royal Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #ffd700 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, #ffd700 1px, transparent 1px)`,
            backgroundSize: "100px 100px",
          }}
        />
      </div>

      {/* Animated Crown Elements */}
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-16 h-16 border-2 border-yellow-500/30 rounded-full relative"
        >
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-t from-yellow-600 to-yellow-300 rounded-full" />
          <div className="absolute -top-1 left-1/4 transform -translate-x-1/2 w-2 h-3 bg-gradient-to-t from-yellow-600 to-yellow-300 rounded-full" />
          <div className="absolute -top-1 right-1/4 transform translate-x-1/2 w-2 h-3 bg-gradient-to-t from-yellow-600 to-yellow-300 rounded-full" />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          variants={titleVariants}
          initial="hidden"
          n
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-20"
        >
          <motion.h2
            className="text-5xl md:text-7xl font-thin mb-6 bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent relative"
            animate={{
              textShadow: [
                "0 0 20px rgba(255, 215, 0, 0.3)",
                "0 0 30px rgba(255, 215, 0, 0.5)",
                "0 0 20px rgba(255, 215, 0, 0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Royal Features
            {/* Decorative elements */}
            <motion.span
              className="absolute -right-16 top-1/2 transform -translate-y-1/2 text-yellow-500/40"
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              ❋
            </motion.span>
          </motion.h2>

          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: "12rem" } : {}}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto mb-6"
          />

          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light tracking-wide">
            Every element crafted with regal precision to deliver an
            <span className="text-yellow-400 font-medium"> unparalleled </span>
            user experience
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{
                y: -20,
                scale: 1.05,
                rotateY: 5,
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }}
              className="relative group perspective-1000"
            >
              {/* Card Background with Royal Border */}
              <div
                className={`relative p-8 bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl rounded-3xl border-2 border-gray-700 hover:border-yellow-500/50 transition-all duration-500 ${feature.shadow} hover:shadow-2xl`}
              >
                {/* Royal Corner Decorations */}
                <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-yellow-500/30 rounded-tl-lg" />
                <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-yellow-500/30 rounded-tr-lg" />
                <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-yellow-500/30 rounded-bl-lg" />
                <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-yellow-500/30 rounded-br-lg" />

                {/* Animated Luxury Background */}
                <motion.div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20"
                  animate={{
                    background: [
                      "linear-gradient(45deg, rgba(255,215,0,0.1) 0%, rgba(218,165,32,0.1) 100%)",
                      "linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(218,165,32,0.1) 100%)",
                      "linear-gradient(45deg, rgba(255,215,0,0.1) 0%, rgba(218,165,32,0.1) 100%)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                {/* Royal Icon Container */}
                <motion.div
                  whileHover={{
                    rotate: [0, -10, 10, 0],
                    scale: [1, 1.1, 1.2, 1.1],
                  }}
                  transition={{
                    duration: 0.8,
                    type: "spring",
                    stiffness: 200,
                  }}
                  className="relative mb-8"
                >
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${feature.metallic} rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden`}
                  >
                    {/* Metallic Shine Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: [-100, 100] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                        ease: "easeInOut",
                      }}
                      style={{ transform: "skewX(-20deg)" }}
                    />
                    <feature.icon className="w-10 h-10 text-gray-800 relative z-10" />

                    {/* Royal Glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-2xl blur-sm -z-10" />
                  </div>
                </motion.div>

                {/* Content */}
                <motion.h3
                  className="text-2xl font-bold text-white mb-4 tracking-wide"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.2 + 0.5 }}
                >
                  {feature.title}
                </motion.h3>

                <motion.p
                  className="text-gray-300 leading-relaxed font-light"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.2 + 0.7 }}
                >
                  {feature.description}
                </motion.p>

                {/* Royal Hover Overlay */}
                <motion.div
                  className="absolute inset-0 rounded-3xl pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-yellow-500/5 via-transparent to-yellow-600/5" />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-transparent via-white/2 to-transparent" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Floating Royal Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                x:
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerWidth : 1200),
                y:
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerHeight : 800),
                scale: Math.random() * 0.5 + 0.3,
              }}
              animate={{
                y: [null, -100, null],
                x: [null, Math.random() * 50 - 25, null],
                opacity: [0, 0.6, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: Math.random() * 6 + 4,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut",
              }}
            >
              <div className="w-2 h-2 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full relative">
                <div className="absolute inset-0 bg-yellow-400 rounded-full animate-pulse" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Royal Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute text-yellow-400/20 text-2xl"
              initial={{
                x:
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerWidth : 1200),
                y:
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerHeight : 800),
              }}
              animate={{
                y: [null, -200],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
                rotate: [0, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                delay: i * 1.5,
                ease: "easeOut",
              }}
            >
              ♦
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;
