import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

const ScrollZoomSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 3, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  const isInView = useInView(containerRef, { margin: "-200px" });

  return (
    <section ref={containerRef} className="h-[300vh] relative">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ scale, opacity, y }} className="relative">
          <motion.div
            initial={{ rotate: 0 }}
            animate={isInView ? { rotate: 360 } : {}}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-purple-500/20"
            style={{ width: "120%", height: "120%", left: "-10%", top: "-10%" }}
          />

          <motion.div
            initial={{ rotate: 0 }}
            animate={isInView ? { rotate: -360 } : {}}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-blue-500/20"
            style={{ width: "140%", height: "140%", left: "-20%", top: "-20%" }}
          />

          <div className="relative w-96 h-96 rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=800&fit=crop"
              alt="Premium product detail"
              className="w-full h-full object-cover"
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-blue-600/20" />

            {/* Content overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center">
                <motion.h3
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-2xl font-light text-white mb-2"
                >
                  Precision
                </motion.h3>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="text-white/80 text-sm"
                >
                  Crafted to perfection
                </motion.p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/10 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScrollZoomSection;
