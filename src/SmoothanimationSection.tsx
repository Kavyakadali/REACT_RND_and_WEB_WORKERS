// import React, { useState, useEffect, useRef, useCallback } from "react";

// // Enhanced Smooth Zoom Section Component
// const SmoothZoomSection = ({
//   title,
//   subtitle,
//   description,
//   imageUrl,
//   stats = [],
//   quote = null,
//   services = [],
//   direction = "zoom-in",
// }) => {
//   const sectionRef = useRef(null);
//   const [scrollProgress, setScrollProgress] = useState(0);
//   const [isVisible, setIsVisible] = useState(false);
//   const [hasAnimated, setHasAnimated] = useState(false);

//   const handleScroll = useCallback(() => {
//     if (!sectionRef.current) return;

//     const rect = sectionRef.current.getBoundingClientRect();
//     const windowHeight = window.innerHeight;
//     const sectionHeight = rect.height;

//     // Enhanced visibility detection with buffer
//     const isInView =
//       rect.top <= windowHeight * 0.9 && rect.bottom >= windowHeight * 0.1;
//     setIsVisible(isInView);

//     if (isInView && !hasAnimated) {
//       setHasAnimated(true);
//     }

//     // Smoother progress calculation with easing
//     let progress = 0;

//     if (rect.top <= windowHeight && rect.bottom >= 0) {
//       if (rect.top <= 0) {
//         progress = Math.abs(rect.top) / (sectionHeight - windowHeight);
//       } else {
//         progress = (windowHeight - rect.top) / windowHeight;
//       }
//       progress = Math.max(0, Math.min(1, progress));
//     }

//     setScrollProgress(progress);
//   }, [hasAnimated]);

//   useEffect(() => {
//     const throttledScroll = () => {
//       requestAnimationFrame(handleScroll);
//     };

//     window.addEventListener("scroll", throttledScroll, { passive: true });
//     handleScroll();

//     return () => window.removeEventListener("scroll", throttledScroll);
//   }, [handleScroll]);

//   // Smooth easing functions
//   const easeInOutCubic = (t) =>
//     t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
//   const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
//   const easeInOutExpo = (t) =>
//     t === 0
//       ? 0
//       : t === 1
//       ? 1
//       : t < 0.5
//       ? Math.pow(2, 20 * t - 10) / 2
//       : (2 - Math.pow(2, -20 * t + 10)) / 2;

//   // Enhanced animation calculations
//   const getImageScale = () => {
//     const baseScale = direction === "zoom-in" ? 0.8 : 1.8;
//     const targetScale = direction === "zoom-in" ? 1.4 : 1.0;
//     const easeProgress = easeInOutCubic(scrollProgress);
//     return baseScale + (targetScale - baseScale) * easeProgress;
//   };

//   const getContentTransform = () => {
//     const easeProgress = easeOutQuart(scrollProgress);
//     const translateY =
//       direction === "zoom-in" ? -easeProgress * 80 : easeProgress * 60;
//     const scale = 0.95 + easeProgress * 0.1;
//     return `translateY(${translateY}px) scale(${scale})`;
//   };

//   const getContentOpacity = () => {
//     if (!isVisible) return 0;
//     if (scrollProgress < 0.1) return scrollProgress * 10;
//     if (scrollProgress > 0.9) return (1 - scrollProgress) * 10;
//     return 1;
//   };

//   const getParallaxOffset = (multiplier = 1) => {
//     return scrollProgress * 100 * multiplier;
//   };

//   return (
//     <section
//       ref={sectionRef}
//       className="relative h-[500vh]"
//       style={{ zIndex: 10 }}
//     >
//       {/* Fixed Background with Advanced Effects */}
//       <div className="fixed top-0 left-0 w-full h-screen overflow-hidden">
//         <div
//           className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-700 ease-out"
//           style={{
//             backgroundImage: `url(${imageUrl})`,
//             transform: `scale(${getImageScale()}) rotate(${
//               scrollProgress * 1
//             }deg)`,
//             transformOrigin: "center center",
//             filter: `blur(${scrollProgress * 1.5}px) brightness(${
//               0.6 + scrollProgress * 0.5
//             }) contrast(${1.1 + scrollProgress * 0.2}) saturate(${
//               1.2 + scrollProgress * 0.3
//             })`,
//           }}
//         />

//         {/* Dynamic Gradient Overlays */}
//         <div
//           className="absolute inset-0 transition-all duration-1000"
//           style={{
//             background: `linear-gradient(${
//               135 + scrollProgress * 45
//             }deg, rgba(0,0,0,0.7), transparent 40%, transparent 60%, rgba(0,0,0,0.8))`,
//             opacity: 0.4 + scrollProgress * 0.4,
//           }}
//         />
//         <div
//           className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 transition-opacity duration-1000"
//           style={{ opacity: 0.5 + scrollProgress * 0.3 }}
//         />

//         {/* Floating Particles */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           {[...Array(25)].map((_, i) => (
//             <div
//               key={i}
//               className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
//               style={{
//                 left: `${10 + ((i * 3.5) % 80)}%`,
//                 top: `${10 + ((i * 2.3) % 80)}%`,
//                 transform: `translateY(${getParallaxOffset(
//                   0.1 + (i % 5) * 0.1
//                 )}px) scale(${0.8 + scrollProgress * 0.4})`,
//                 opacity: 0.1 + scrollProgress * 0.3 * Math.sin(i),
//                 animationDelay: `${i * 0.1}s`,
//                 animationDuration: `${2 + Math.random() * 2}s`,
//               }}
//             />
//           ))}
//         </div>

//         {/* Interactive Light Rays */}
//         <div className="absolute inset-0 overflow-hidden">
//           {[...Array(3)].map((_, i) => (
//             <div
//               key={i}
//               className="absolute bg-gradient-to-r from-transparent via-white/5 to-transparent h-px w-full"
//               style={{
//                 top: `${20 + i * 25}%`,
//                 transform: `translateX(${getParallaxOffset(
//                   0.2 + i * 0.1
//                 )}px) rotate(${15 + i * 10}deg)`,
//                 opacity: scrollProgress * 0.6,
//                 transition: "all 1s ease-out",
//               }}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Enhanced Floating Content */}
//       <div className="relative z-20 h-full flex items-center justify-center">
//         <div
//           className="max-w-7xl mx-auto px-8 text-center text-white transition-all duration-1000 ease-out"
//           style={{
//             transform: getContentTransform(),
//             opacity: getContentOpacity(),
//           }}
//         >
//           {/* Animated Title with Stagger Effect */}
//           <div className="mb-24">
//             <h2
//               className="text-6xl md:text-8xl lg:text-9xl font-extralight leading-[0.85] mb-12 overflow-hidden"
//               style={{
//                 textShadow: `0 ${8 + scrollProgress * 20}px ${
//                   40 + scrollProgress * 20
//                 }px rgba(0,0,0,0.8)`,
//                 letterSpacing: "-0.02em",
//               }}
//             >
//               <span
//                 className="inline-block transition-all duration-1000 ease-out"
//                 style={{
//                   transform: `translateY(${hasAnimated ? 0 : 100}px) rotateX(${
//                     hasAnimated ? 0 : 15
//                   }deg)`,
//                   opacity: hasAnimated ? 1 : 0,
//                   transitionDelay: "0.2s",
//                 }}
//               >
//                 {title}
//               </span>
//               <br />
//               <span
//                 className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 transition-all duration-1000 ease-out"
//                 style={{
//                   transform: `translateY(${hasAnimated ? 0 : 120}px) rotateX(${
//                     hasAnimated ? 0 : 20
//                   }deg) scale(${1 + scrollProgress * 0.05})`,
//                   opacity: hasAnimated ? 1 : 0,
//                   filter: `brightness(${1.2 + scrollProgress * 0.5}) saturate(${
//                     1.3 + scrollProgress * 0.4
//                   })`,
//                   transitionDelay: "0.5s",
//                 }}
//               >
//                 {subtitle}
//               </span>
//             </h2>
//             <p
//               className="text-xl md:text-3xl text-gray-100 max-w-5xl mx-auto leading-relaxed font-light transition-all duration-1000 ease-out"
//               style={{
//                 transform: `translateY(${hasAnimated ? 0 : 80}px) rotateX(${
//                   hasAnimated ? 0 : 10
//                 }deg)`,
//                 opacity: hasAnimated ? getContentOpacity() * 0.9 : 0,
//                 textShadow: "0 4px 20px rgba(0,0,0,0.8)",
//                 transitionDelay: "0.8s",
//               }}
//             >
//               {description}
//             </p>
//           </div>

//           {/* Enhanced Animated Stats Grid */}
//           {stats.length > 0 && (
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-20 mb-32">
//               {stats.map((stat, index) => (
//                 <div
//                   key={index}
//                   className="text-center group transition-all duration-1000 ease-out"
//                   style={{
//                     transform: `translateY(${
//                       hasAnimated
//                         ? getParallaxOffset(0.02 * (index + 1))
//                         : 100 + index * 20
//                     }px) scale(${
//                       hasAnimated ? 0.95 + scrollProgress * 0.1 : 0.8
//                     })`,
//                     opacity: hasAnimated ? getContentOpacity() : 0,
//                     transitionDelay: `${1.2 + index * 0.2}s`,
//                   }}
//                 >
//                   <div
//                     className="text-7xl md:text-8xl font-extralight mb-6 text-white group-hover:scale-110 transition-all duration-700 ease-out"
//                     style={{
//                       textShadow: "0 10px 40px rgba(255,255,255,0.2)",
//                       background: "linear-gradient(135deg, #ffffff, #e0e0e0)",
//                       backgroundClip: "text",
//                       WebkitBackgroundClip: "text",
//                     }}
//                   >
//                     {stat.number}
//                   </div>
//                   <div
//                     className="text-gray-300 text-xl uppercase tracking-[0.3em] font-light group-hover:text-white group-hover:tracking-[0.4em] transition-all duration-700"
//                     style={{
//                       textShadow: "0 2px 10px rgba(0,0,0,0.5)",
//                     }}
//                   >
//                     {stat.label}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Enhanced Animated Quote */}
//           {quote && (
//             <div
//               className="max-w-6xl mx-auto mb-32 group transition-all duration-1000 ease-out"
//               style={{
//                 transform: `translateY(${
//                   hasAnimated ? getParallaxOffset(-0.03) : 80
//                 }px) perspective(1000px) rotateX(${scrollProgress * 2}deg)`,
//                 opacity: hasAnimated ? getContentOpacity() : 0,
//                 transitionDelay: "1.8s",
//               }}
//             >
//               <blockquote
//                 className="text-3xl md:text-5xl font-extralight italic text-gray-100 leading-[1.4] mb-12 group-hover:scale-105 transition-all duration-1000"
//                 style={{
//                   textShadow: "0 8px 40px rgba(0,0,0,0.8)",
//                   background: "linear-gradient(135deg, #f8f8f8, #d0d0d0)",
//                   backgroundClip: "text",
//                   WebkitBackgroundClip: "text",
//                 }}
//               >
//                 "{quote.text}"
//               </blockquote>
//               <cite className="text-2xl text-gray-300 font-light transition-all duration-500">
//                 <span className="text-white font-medium">— {quote.author}</span>
//                 <span className="text-gray-400 block text-lg mt-3">
//                   {quote.role}
//                 </span>
//               </cite>
//             </div>
//           )}

//           {/* Enhanced Animated Services Grid */}
//           {services.length > 0 && (
//             <div className="grid md:grid-cols-3 gap-12">
//               {services.map((service, index) => (
//                 <div
//                   key={index}
//                   className="group relative overflow-hidden transition-all duration-1000 ease-out"
//                   style={{
//                     transform: `translateY(${
//                       hasAnimated
//                         ? getParallaxOffset(0.01 * (index + 1))
//                         : 120 + index * 30
//                     }px)`,
//                     opacity: hasAnimated ? getContentOpacity() : 0,
//                     transitionDelay: `${2.2 + index * 0.3}s`,
//                   }}
//                 >
//                   <div className="bg-black/30 backdrop-blur-2xl border border-gray-500/20 rounded-3xl p-12 h-full relative overflow-hidden group-hover:scale-105 group-hover:bg-black/50 group-hover:border-gray-400/40 transition-all duration-700 hover:shadow-2xl hover:shadow-white/10">
//                     {/* Animated background gradient */}
//                     <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-all duration-1000" />

//                     {/* Enhanced floating particles */}
//                     <div className="absolute inset-0 overflow-hidden">
//                       {[...Array(5)].map((_, i) => (
//                         <div
//                           key={i}
//                           className="absolute w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-30 transition-all duration-1000"
//                           style={{
//                             left: `${20 + Math.random() * 60}%`,
//                             top: `${20 + Math.random() * 60}%`,
//                             animationDelay: `${Math.random() * 2}s`,
//                             transform: `scale(${0.5 + Math.random() * 0.5})`,
//                           }}
//                         />
//                       ))}
//                     </div>

//                     {/* Smooth border animation */}
//                     <div
//                       className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/0 via-purple-500/20 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-all duration-1000"
//                       style={{ padding: "1px" }}
//                     >
//                       <div className="w-full h-full rounded-3xl bg-transparent" />
//                     </div>

//                     <div className="relative z-10">
//                       <h3
//                         className="text-2xl md:text-3xl font-light mb-8 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-300 group-hover:to-purple-400 transition-all duration-700"
//                         style={{
//                           textShadow: "0 4px 20px rgba(0,0,0,0.8)",
//                         }}
//                       >
//                         {service.title}
//                       </h3>
//                       <p
//                         className="text-gray-200 leading-relaxed text-lg font-light group-hover:text-gray-100 transition-all duration-700"
//                         style={{
//                           textShadow: "0 2px 10px rgba(0,0,0,0.5)",
//                         }}
//                       >
//                         {service.description}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Enhanced Scroll Progress Indicator */}
//       <div className="fixed bottom-12 right-12 z-30 group">
//         <div className="relative">
//           {/* Pulsing outer rings */}
//           <div
//             className="absolute inset-0 rounded-full border border-white/10 animate-ping"
//             style={{
//               transform: `scale(${1.5 + scrollProgress * 0.3})`,
//               opacity: 0.3 + scrollProgress * 0.4,
//             }}
//           />
//           <div
//             className="absolute inset-0 rounded-full border border-white/20"
//             style={{
//               transform: `scale(${1.2 + scrollProgress * 0.15})`,
//               opacity: 0.4 + scrollProgress * 0.4,
//             }}
//           />

//           {/* Main progress circle */}
//           <div className="w-20 h-20 rounded-full border-2 border-white/20 relative overflow-hidden backdrop-blur-sm bg-black/20">
//             <svg
//               className="absolute inset-0 w-full h-full transform -rotate-90"
//               viewBox="0 0 80 80"
//             >
//               <circle
//                 cx="40"
//                 cy="40"
//                 r="36"
//                 stroke="url(#gradient)"
//                 strokeWidth="3"
//                 fill="none"
//                 strokeDasharray={`${2 * Math.PI * 36}`}
//                 strokeDashoffset={`${2 * Math.PI * 36 * (1 - scrollProgress)}`}
//                 className="transition-all duration-300 ease-out"
//               />
//               <defs>
//                 <linearGradient
//                   id="gradient"
//                   x1="0%"
//                   y1="0%"
//                   x2="100%"
//                   y2="100%"
//                 >
//                   <stop offset="0%" stopColor="#3b82f6" />
//                   <stop offset="50%" stopColor="#8b5cf6" />
//                   <stop offset="100%" stopColor="#ec4899" />
//                 </linearGradient>
//               </defs>
//             </svg>
//           </div>

//           {/* Center indicator */}
//           <div
//             className="absolute top-1/2 left-1/2 w-3 h-3 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
//             style={{
//               transform: `translate(-50%, -50%) scale(${
//                 0.8 + scrollProgress * 0.4
//               })`,
//               boxShadow: "0 0 15px rgba(255,255,255,0.6)",
//             }}
//           />
//         </div>

//         {/* Progress percentage with smooth animation */}
//         <div
//           className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-xs text-white/80 font-light transition-all duration-300"
//           style={{
//             opacity: scrollProgress > 0.1 ? 1 : 0,
//             transform: `translate(-50%, 0) scale(${
//               0.9 + scrollProgress * 0.1
//             })`,
//           }}
//         >
//           {Math.round(scrollProgress * 100)}%
//         </div>
//       </div>
//     </section>
//   );
// };

// // Enhanced MacBook Animation Component
// const EnhancedMacBookAnimation = () => {
//   const canvasRef = useRef(null);
//   const imagesRef = useRef([]);
//   const [scrollProgress, setScrollProgress] = useState(0);
//   const [currentSection, setCurrentSection] = useState(0);
//   const [imagesLoaded, setImagesLoaded] = useState(false);
//   const [loadingProgress, setLoadingProgress] = useState(0);
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

//   const frameCount = 90;

//   // Enhanced mouse tracking
//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       setMousePosition({
//         x: (e.clientX / window.innerWidth - 0.5) * 2,
//         y: (e.clientY / window.innerHeight - 0.5) * 2,
//       });
//     };

//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, []);

//   // Enhanced frame generation
//   const generateMacBookFrame = (frameIndex) => {
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");
//     canvas.width = 1400;
//     canvas.height = 900;

//     const progress = (frameIndex - 1) / (frameCount - 1);

//     // Premium background with depth
//     const bgGradient = ctx.createRadialGradient(700, 450, 0, 700, 450, 900);
//     bgGradient.addColorStop(0, "#0f0f0f");
//     bgGradient.addColorStop(0.6, "#000000");
//     bgGradient.addColorStop(1, "#000000");
//     ctx.fillStyle = bgGradient;
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     // Enhanced animation phases
//     const openPhase = Math.min(progress * 2.2, 1);
//     const rotatePhase = Math.max((progress - 0.45) * 1.8, 0);

//     const centerX = canvas.width / 2;
//     const centerY = canvas.height / 2;

//     ctx.save();
//     ctx.translate(centerX, centerY);

//     // Smooth rotation with easing
//     if (rotatePhase > 0) {
//       const easeRotate = easeInOutCubic(rotatePhase);
//       ctx.rotate((easeRotate * 360 * Math.PI) / 180);
//     }

//     // Dynamic scaling with bounce
//     const bounceScale = 0.75 + easeOutElastic(progress) * 0.35;
//     ctx.scale(bounceScale, bounceScale);

//     drawPremiumMacBook(ctx, openPhase * 130, progress);

//     ctx.restore();

//     return canvas.toDataURL("image/jpeg", 0.95);
//   };

//   // Easing functions
//   const easeInOutCubic = (t) =>
//     t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
//   const easeOutElastic = (t) => {
//     const c4 = (2 * Math.PI) / 3;
//     return t === 0
//       ? 0
//       : t === 1
//       ? 1
//       : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
//   };

//   // Premium MacBook rendering
//   const drawPremiumMacBook = (ctx, screenAngle, progress) => {
//     const baseWidth = 450;
//     const baseHeight = 320;
//     const screenWidth = 430;
//     const screenHeight = 270;

//     // Enhanced shadows
//     ctx.save();
//     ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
//     ctx.shadowBlur = 60;
//     ctx.shadowOffsetY = 35;
//     ctx.shadowOffsetX = 15;

//     // Premium aluminum base with realistic gradients
//     const baseGradient = ctx.createLinearGradient(
//       0,
//       -baseHeight / 2,
//       0,
//       baseHeight / 2
//     );
//     baseGradient.addColorStop(0, "#a8a8a8");
//     baseGradient.addColorStop(0.08, "#f8f8fa");
//     baseGradient.addColorStop(0.15, "#ffffff");
//     baseGradient.addColorStop(0.25, "#fdfdfd");
//     baseGradient.addColorStop(0.75, "#e8e8ea");
//     baseGradient.addColorStop(0.92, "#d2d2d7");
//     baseGradient.addColorStop(1, "#a8a8a8");

//     ctx.fillStyle = baseGradient;
//     roundedRect(
//       ctx,
//       -baseWidth / 2,
//       -baseHeight / 2,
//       baseWidth,
//       baseHeight,
//       16
//     );
//     ctx.fill();

//     // Enhanced Apple logo with glow
//     ctx.save();
//     ctx.translate(0, baseHeight / 2 - 55);
//     ctx.shadowColor = "rgba(255, 255, 255, 0.4)";
//     ctx.shadowBlur = 12;
//     ctx.fillStyle = "#c7c7cc";
//     ctx.beginPath();
//     ctx.arc(0, 0, 16, 0, Math.PI * 2);
//     ctx.fill();
//     ctx.fillStyle = baseGradient;
//     ctx.beginPath();
//     ctx.arc(9, -6, 9, 0, Math.PI * 2);
//     ctx.fill();
//     ctx.restore();

//     ctx.restore();

//     // Enhanced screen
//     ctx.save();
//     ctx.translate(0, -baseHeight / 2 + 12);
//     ctx.rotate((-screenAngle * Math.PI) / 180);

//     drawEnhancedScreen(ctx, screenWidth, screenHeight, screenAngle, progress);

//     ctx.restore();
//   };

//   const drawEnhancedScreen = (ctx, width, height, angle, progress) => {
//     // Screen back with premium finish
//     const backGradient = ctx.createLinearGradient(0, -height, 0, 0);
//     backGradient.addColorStop(0, "#b8b8b8");
//     backGradient.addColorStop(0.15, "#e8e8ea");
//     backGradient.addColorStop(0.5, "#f8f8fa");
//     backGradient.addColorStop(0.85, "#e8e8ea");
//     backGradient.addColorStop(1, "#a8a8a8");

//     ctx.fillStyle = backGradient;
//     roundedRect(ctx, -width / 2, -height, width, height, 16);
//     ctx.fill();

//     // Premium bezel
//     ctx.fillStyle = "#1a1a1a";
//     roundedRect(
//       ctx,
//       -width / 2 + 16,
//       -height + 16,
//       width - 32,
//       height - 32,
//       12
//     );
//     ctx.fill();

//     if (angle > 35) {
//       // Enhanced macOS interface
//       ctx.fillStyle = "#000000";
//       roundedRect(
//         ctx,
//         -width / 2 + 20,
//         -height + 20,
//         width - 40,
//         height - 40,
//         10
//       );
//       ctx.fill();

//       if (angle > 70) {
//         // Animated wallpaper with depth
//         const wallpaperGradient = ctx.createRadialGradient(
//           0,
//           -height / 2,
//           0,
//           0,
//           -height / 2,
//           height / 1.5
//         );
//         wallpaperGradient.addColorStop(0, "#007AFF");
//         wallpaperGradient.addColorStop(0.25, "#5856D6");
//         wallpaperGradient.addColorStop(0.5, "#AF52DE");
//         wallpaperGradient.addColorStop(0.75, "#FF3B30");
//         wallpaperGradient.addColorStop(1, "#FF9500");

//         ctx.fillStyle = wallpaperGradient;
//         roundedRect(
//           ctx,
//           -width / 2 + 20,
//           -height + 20,
//           width - 40,
//           height - 40,
//           10
//         );
//         ctx.fill();

//         // Enhanced UI elements
//         drawMacOSInterface(ctx, width, height, angle, progress);
//       }
//     }

//     // Screen glare effect
//     if (angle > 40) {
//       const glareGradient = ctx.createLinearGradient(
//         -width / 4,
//         -height + 30,
//         width / 4,
//         -height / 2
//       );
//       glareGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
//       glareGradient.addColorStop(0.4, "rgba(255, 255, 255, 0.15)");
//       glareGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

//       ctx.fillStyle = glareGradient;
//       roundedRect(
//         ctx,
//         -width / 2 + 20,
//         -height + 20,
//         width - 40,
//         height - 40,
//         10
//       );
//       ctx.fill();
//     }
//   };

//   const drawMacOSInterface = (ctx, width, height, angle, progress) => {
//     // Menu bar with blur effect
//     ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
//     ctx.fillRect(-width / 2 + 20, -height + 20, width - 40, 30);

//     // Dock with enhanced styling
//     if (angle > 90) {
//       const dockGradient = ctx.createLinearGradient(-140, -40, 140, -40);
//       dockGradient.addColorStop(0, "rgba(255, 255, 255, 0.05)");
//       dockGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.25)");
//       dockGradient.addColorStop(1, "rgba(255, 255, 255, 0.05)");

//       ctx.fillStyle = dockGradient;
//       roundedRect(ctx, -140, -45, 280, 60, 20);
//       ctx.fill();

//       // Enhanced app icons with glow
//       const appColors = [
//         "#FF3B30",
//         "#FF9500",
//         "#FFCC02",
//         "#30D158",
//         "#007AFF",
//         "#5856D6",
//         "#AF52DE",
//         "#FF2D92",
//       ];
//       for (let i = 0; i < 8; i++) {
//         // Icon glow
//         ctx.shadowColor = appColors[i];
//         ctx.shadowBlur = 8;
//         ctx.fillStyle = appColors[i];
//         roundedRect(ctx, -112 + i * 28, -30, 24, 24, 6);
//         ctx.fill();

//         // Icon highlight
//         ctx.shadowBlur = 0;
//         ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
//         roundedRect(ctx, -112 + i * 28, -30, 24, 3, 6);
//         ctx.fill();
//       }
//     }
//   };

//   // Helper function for rounded rectangles
//   const roundedRect = (ctx, x, y, width, height, radius) => {
//     ctx.beginPath();
//     ctx.moveTo(x + radius, y);
//     ctx.lineTo(x + width - radius, y);
//     ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
//     ctx.lineTo(x + width, y + height - radius);
//     ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
//     ctx.lineTo(x + radius, y + height);
//     ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
//     ctx.lineTo(x, y + radius);
//     ctx.quadraticCurveTo(x, y, x + radius, y);
//     ctx.closePath();
//   };

//   // Preload images
//   useEffect(() => {
//     const preloadImages = async () => {
//       const imagePromises = [];

//       for (let i = 1; i <= frameCount; i++) {
//         const img = new Image();
//         img.crossOrigin = "anonymous";
//         img.src = generateMacBookFrame(i);

//         imagePromises.push(
//           new Promise((resolve) => {
//             img.onload = () => {
//               setLoadingProgress((i / frameCount) * 100);
//               resolve(img);
//             };
//             img.onerror = () => {
//               img.src = generateMacBookFrame(i);
//               resolve(img);
//             };
//           })
//         );
//       }

//       try {
//         imagesRef.current = await Promise.all(imagePromises);
//         setImagesLoaded(true);
//       } catch (error) {
//         console.error("Failed to load images:", error);
//       }
//     };

//     preloadImages();
//   }, []);

//   // Enhanced scroll handling
//   useEffect(() => {
//     let ticking = false;

//     const handleScroll = () => {
//       if (!ticking && imagesLoaded) {
//         requestAnimationFrame(() => {
//           const html = document.documentElement;
//           const scrollTop = html.scrollTop;
//           const windowHeight = window.innerHeight;

//           if (scrollTop < windowHeight) {
//             const scrollFraction = scrollTop / windowHeight;
//             setScrollProgress(scrollFraction);
//             setCurrentSection(0);

//             const frameIndex = Math.min(
//               frameCount - 1,
//               Math.floor(scrollFraction * frameCount)
//             );

//             updateCanvas(frameIndex);
//           } else {
//             setCurrentSection(1);
//             setScrollProgress(1);
//           }

//           ticking = false;
//         });
//         ticking = true;
//       }
//     };

//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [imagesLoaded]);

//   // Update canvas
//   const updateCanvas = (frameIndex) => {
//     if (!canvasRef.current || !imagesRef.current[frameIndex]) return;

//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.drawImage(
//       imagesRef.current[frameIndex],
//       0,
//       0,
//       canvas.width,
//       canvas.height
//     );
//   };

//   // Initialize canvas
//   useEffect(() => {
//     if (canvasRef.current && imagesLoaded) {
//       const canvas = canvasRef.current;
//       canvas.width = 1400;
//       canvas.height = 900;
//       updateCanvas(0);
//     }
//   }, [imagesLoaded]);

//   return (
//     <div className="bg-black text-white overflow-x-hidden">
//       {/* MacBook Animation Section */}
//       <section
//         className={`h-screen fixed inset-0 flex flex-col items-center justify-center transition-all duration-1000 ${
//           currentSection > 0 ? "opacity-0 pointer-events-none" : "opacity-100"
//         }`}
//         style={{ zIndex: 100 }}
//       >
//         {/* Enhanced Hero Text */}
//         <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center z-10">
//           <h1 className="text-6xl md:text-8xl font-thin text-white mb-4 tracking-wide transition-all duration-1000 ease-out">
//             <span className="inline-block transform hover:scale-105 transition-transform duration-500">
//               MacBook
//             </span>{" "}
//             <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 transform hover:scale-105 transition-transform duration-500">
//               Pro
//             </span>
//           </h1>
//           <p className="text-lg md:text-2xl text-gray-400 font-light transition-all duration-700 hover:text-gray-300">
//             Supercharged by M4, M4 Pro, and M4 Max
//           </p>

//           {/* Floating elements */}
//           <div className="absolute -top-10 -left-20 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60" />
//           <div className="absolute -top-5 right-10 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-40" />
//           <div className="absolute top-20 -right-15 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce opacity-50" />
//         </div>

//         {/* Enhanced Canvas Container */}
//         <div className="relative group">
//           <canvas
//             ref={canvasRef}
//             className="max-w-full max-h-full transition-all duration-700 group-hover:scale-105"
//             style={{
//               maxWidth: "1000px",
//               maxHeight: "650px",
//               width: "100%",
//               height: "auto",
//               filter: `drop-shadow(0 25px 50px rgba(0,0,0,0.5)) brightness(${
//                 1 + mousePosition.x * 0.1
//               }) contrast(${1.1 + mousePosition.y * 0.1})`,
//             }}
//           />

//           {/* Enhanced Loading Screen */}
//           {!imagesLoaded && (
//             <div className="absolute inset-0 flex items-center justify-center bg-black rounded-3xl">
//               <div className="text-center">
//                 <div className="w-40 h-2 bg-gray-800 rounded-full mb-6 mx-auto overflow-hidden">
//                   <div
//                     className="h-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
//                     style={{ width: `${loadingProgress}%` }}
//                   />
//                 </div>
//                 <div className="text-white text-lg mb-2 font-light">
//                   Loading MacBook Pro...
//                 </div>
//                 <div className="text-gray-400 text-sm">
//                   {Math.round(loadingProgress)}% Complete
//                 </div>

//                 {/* Loading animation dots */}
//                 <div className="flex justify-center space-x-1 mt-4">
//                   {[...Array(3)].map((_, i) => (
//                     <div
//                       key={i}
//                       className="w-2 h-2 bg-gray-600 rounded-full animate-pulse"
//                       style={{ animationDelay: `${i * 0.2}s` }}
//                     />
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Interactive glow effect */}
//           <div
//             className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-30 transition-all duration-1000 pointer-events-none"
//             style={{
//               background: `radial-gradient(circle at ${
//                 (mousePosition.x + 1) * 50
//               }% ${
//                 (mousePosition.y + 1) * 50
//               }%, rgba(59, 130, 246, 0.3), transparent 70%)`,
//             }}
//           />
//         </div>

//         {/* Enhanced Scroll Indicator */}
//         <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center">
//           <div className="text-sm text-gray-400 mb-4 transition-all duration-500">
//             {scrollProgress < 0.3 ? (
//               <span className="animate-pulse">Scroll to open MacBook Pro</span>
//             ) : scrollProgress < 0.7 ? (
//               <span>Opening...</span>
//             ) : scrollProgress < 1 ? (
//               <span>Continue scrolling for 360° rotation</span>
//             ) : (
//               <span className="text-green-400">✓ Animation Complete</span>
//             )}
//           </div>

//           {/* Enhanced progress visualization */}
//           <div className="flex items-center space-x-4">
//             <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out"
//                 style={{ width: `${scrollProgress * 100}%` }}
//               />
//             </div>
//             <span className="text-xs text-gray-500 font-mono w-8">
//               {Math.round(scrollProgress * 100)}%
//             </span>
//           </div>

//           {/* Scroll hint with animation */}
//           <div className="mt-6 animate-bounce">
//             <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center">
//               <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse" />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Spacer */}
//       <div className="h-screen" />

//       {/* Enhanced Mind-blowing Section */}
//       <section
//         className={`min-h-screen flex items-center justify-center px-8 transition-all duration-1000 ${
//           currentSection >= 1 ? "opacity-100" : "opacity-0"
//         }`}
//         style={{ zIndex: 20 }}
//       >
//         <div className="max-w-7xl text-center">
//           <h2 className="text-7xl md:text-9xl font-thin mb-8 leading-tight">
//             <span className="inline-block transform hover:scale-105 transition-all duration-500">
//               Mind‑blowing.
//             </span>
//             <br />
//             <span className="text-gray-500 inline-block transform hover:scale-105 transition-all duration-500 hover:text-gray-400">
//               Head‑turning.
//             </span>
//           </h2>
//           <p className="text-xl md:text-3xl text-gray-400 leading-relaxed max-w-5xl mx-auto font-light mb-16 hover:text-gray-300 transition-colors duration-500">
//             The most advanced chips. Phenomenal battery life. Next‑level
//             graphics performance. All in the world's best laptop display.
//           </p>

//           {/* Feature highlights */}
//           <div className="grid md:grid-cols-3 gap-12 mt-20">
//             {[
//               { title: "M4 Chip", desc: "Up to 2.4x faster CPU" },
//               { title: "Liquid Retina XDR", desc: "1600 nits peak brightness" },
//               { title: "22-Hour Battery", desc: "All-day performance" },
//             ].map((feature, index) => (
//               <div
//                 key={index}
//                 className="group p-8 rounded-3xl bg-gray-900/30 backdrop-blur-xl border border-gray-700/30 hover:border-gray-600/50 hover:bg-gray-800/40 transition-all duration-700 transform hover:scale-105"
//               >
//                 <h3 className="text-2xl font-light text-white mb-3 group-hover:text-blue-400 transition-colors duration-500">
//                   {feature.title}
//                 </h3>
//                 <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-500">
//                   {feature.desc}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Enhanced Performance Section */}
//       <section
//         className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 flex items-center justify-center px-8 relative overflow-hidden"
//         style={{ zIndex: 20 }}
//       >
//         {/* Animated background elements */}
//         <div className="absolute inset-0">
//           {[...Array(20)].map((_, i) => (
//             <div
//               key={i}
//               className="absolute w-px h-px bg-white rounded-full animate-pulse opacity-20"
//               style={{
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//                 animationDelay: `${Math.random() * 5}s`,
//                 animationDuration: `${2 + Math.random() * 3}s`,
//               }}
//             />
//           ))}
//         </div>

//         <div className="max-w-6xl text-center relative z-10">
//           <h2 className="text-5xl md:text-7xl font-thin mb-20 text-white">
//             <span className="inline-block transform hover:scale-105 transition-all duration-500">
//               Performance
//             </span>
//             <br />
//             <span className="text-gray-400 inline-block transform hover:scale-105 transition-all duration-500 hover:text-gray-300">
//               Pro all out.
//             </span>
//           </h2>

//           <div className="grid md:grid-cols-3 gap-16">
//             {[
//               {
//                 chip: "M4",
//                 cpu: "10‑core CPU",
//                 gpu: "10‑core GPU",
//                 color: "from-blue-400 to-blue-600",
//               },
//               {
//                 chip: "M4 Pro",
//                 cpu: "14‑core CPU",
//                 gpu: "20‑core GPU",
//                 color: "from-purple-400 to-purple-600",
//               },
//               {
//                 chip: "M4 Max",
//                 cpu: "16‑core CPU",
//                 gpu: "40‑core GPU",
//                 color: "from-pink-400 to-pink-600",
//               },
//             ].map((spec, index) => (
//               <div
//                 key={index}
//                 className="group text-center p-10 rounded-3xl bg-gray-900/20 backdrop-blur-xl border border-gray-700/20 hover:border-gray-600/40 hover:bg-gray-800/30 transition-all duration-700 transform hover:scale-110 hover:-rotate-1"
//               >
//                 <div
//                   className={`text-5xl md:text-6xl font-thin mb-6 text-transparent bg-clip-text bg-gradient-to-r ${spec.color} group-hover:scale-110 transition-transform duration-500`}
//                 >
//                   {spec.chip}
//                 </div>
//                 <div className="space-y-3">
//                   <div className="text-gray-300 text-lg group-hover:text-white transition-colors duration-500">
//                     {spec.cpu}
//                   </div>
//                   <div className="text-gray-400 text-lg group-hover:text-gray-300 transition-colors duration-500">
//                     {spec.gpu}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Smooth Zoom Sections */}
//       <SmoothZoomSection
//         title="We are a"
//         subtitle="deal factory."
//         description="Independent M&A and fundraising advisor dedicated to pushing sparkling entrepreneurs forward."
//         imageUrl="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
//         stats={[
//           { number: "180+", label: "Deals Closed" },
//           { number: "$2.5B", label: "Total Value" },
//           { number: "95%", label: "Success Rate" },
//         ]}
//         direction="zoom-in"
//       />

//       <SmoothZoomSection
//         title="We are"
//         subtitle="natural born storytellers."
//         description="We specialize in turning your business history into legend. Our team of former CEOs understands the nuances of successful transactions."
//         imageUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
//         quote={{
//           text: "Team sport has a unique value: it is to be able to be ahead of its time. When tennis becomes Davis Cup, it expresses something which does not exist otherwise.",
//           author: "Arsène Wenger",
//           role: "Legendary Coach",
//         }}
//         direction="zoom-out"
//       />

//       <SmoothZoomSection
//         title="We design and implement"
//         subtitle="the best strategies."
//         description="From roadshow to closing, we guide innovative entrepreneurs through every step of the process."
//         imageUrl="https://images.unsplash.com/photo-1664475450410-d4eea9fa7d99?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80"
//         services={[
//           {
//             title: "Company Sale",
//             description:
//               "We design and implement the best strategies for your exit. Find the right Partner to build the right Project at the right Price.",
//           },
//           {
//             title: "External Growth",
//             description:
//               "We are synergy explorers, constantly scouting innovative and meaningful external growth opportunities.",
//           },
//           {
//             title: "Fundraising",
//             description:
//               "From roadshow to closing, we guide entrepreneurs to raise funds from VC funds, banks, and private investors.",
//           },
//         ]}
//         direction="zoom-in"
//       />

//       {/* Enhanced Final CTA Section */}
//       <section
//         className="min-h-screen bg-black flex items-center justify-center px-8 relative overflow-hidden"
//         style={{ zIndex: 20 }}
//       >
//         <div className="absolute inset-0">
//           <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10" />
//           <img
//             src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
//             alt="Success"
//             className="w-full h-full object-cover transition-transform duration-[10s] hover:scale-110"
//           />

//           {/* Floating particles */}
//           <div className="absolute inset-0">
//             {[...Array(30)].map((_, i) => (
//               <div
//                 key={i}
//                 className="absolute w-1 h-1 bg-white rounded-full animate-pulse opacity-30"
//                 style={{
//                   left: `${Math.random() * 100}%`,
//                   top: `${Math.random() * 100}%`,
//                   animationDelay: `${Math.random() * 5}s`,
//                   animationDuration: `${2 + Math.random() * 3}s`,
//                 }}
//               />
//             ))}
//           </div>
//         </div>

//         <div className="relative z-20 text-center max-w-5xl">
//           <h2 className="text-6xl md:text-8xl font-thin mb-12 text-white leading-tight">
//             <span className="inline-block transform hover:scale-105 transition-all duration-700">
//               Ready to write your
//             </span>
//             <br />
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 inline-block transform hover:scale-105 transition-all duration-700">
//               success story?
//             </span>
//           </h2>
//           <p className="text-xl md:text-2xl text-gray-300 mb-16 max-w-3xl mx-auto leading-relaxed font-light">
//             Let's turn your vision into reality. Contact us to explore how we
//             can help accelerate your growth.
//           </p>

//           <div className="flex flex-col sm:flex-row gap-6 justify-center">
//             <button
//               className="group px-12 py-5 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-all duration-500 transform hover:scale-110 hover:shadow-2xl hover:shadow-white/20 relative overflow-hidden"
            
//             >
//               <span className="relative z-10">Start Your Journey</span>
//               <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
//             </button>
//             <button className="group px-12 py-5 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-500 transform hover:scale-110 hover:shadow-2xl hover:shadow-white/20 relative overflow-hidden">
//               <span className="relative z-10">View Case Studies</span>
//               <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//             </button>
//           </div>

//           {/* Additional micro-interactions */}
//           <div className="mt-16 flex justify-center space-x-8">
//             {["LinkedIn", "Twitter", "Email"].map((platform, index) => (
//               <button
//                 key={platform}
//                 className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-white hover:scale-110 transition-all duration-500"
//                 style={{ animationDelay: `${index * 0.1}s` }}
//               >
//                 {platform.charAt(0)}
//               </button>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default EnhancedMacBookAnimation;
