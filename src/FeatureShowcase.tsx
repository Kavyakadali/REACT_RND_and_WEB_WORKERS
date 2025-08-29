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
      color: "from-yellow-400 to-orange-500",
    },
    {
      icon: Eye,
      title: "Visual Excellence",
      description: "Pixel-perfect design with attention to every detail",
      color: "from-purple-400 to-pink-500",
    },
    {
      icon: Layers,
      title: "Layered Experience",
      description: "Multi-dimensional interactions that engage users",
      color: "from-blue-400 to-cyan-500",
    },
    {
      icon: Sparkles,
      title: "Premium Feel",
      description: "Luxury animations that elevate your brand",
      color: "from-green-400 to-emerald-500",
    },
  ];

  return (
    <section ref={containerRef} className="py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-thin mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Premium Features
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Every element crafted with precision to deliver an unparalleled user
            experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative group"
            >
              <div className="relative p-8 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl border border-gray-800 hover:border-gray-700 transition-all duration-300">
                {/* Animated background */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}
                />

                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [null, -50, null],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;
