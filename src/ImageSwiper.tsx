import React, { useEffect, useRef, useState, useCallback } from "react";

// Define the interface for card data
interface CardData {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
}

// Define the props interface for ImageSwiper
interface ImageSwiperProps {
  cards: CardData[];
  cardWidth?: number;
  cardHeight?: number;
  className?: string;
}

// Enhanced ImageSwiper component with more animations
const ImageSwiper: React.FC<ImageSwiperProps> = ({
  cards,
  cardWidth = 280,
  cardHeight = 400,
  className = "",
}) => {
  const cardStackRef = useRef<HTMLDivElement>(null);
  const isSwiping = useRef(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  const [cardOrder, setCardOrder] = useState<number[]>(() =>
    Array.from({ length: cards.length }, (_, i) => i)
  );
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const getCards = useCallback((): HTMLElement[] => {
    if (!cardStackRef.current) return [];
    return Array.from(cardStackRef.current.querySelectorAll(".image-card"));
  }, []);

  const getActiveCard = useCallback((): HTMLElement | null => {
    return getCards()[0] || null;
  }, [getCards]);

  const updateCardPositions = useCallback(() => {
    getCards().forEach((card, i) => {
      card.style.setProperty("--i", i.toString());
      card.style.setProperty("--swipe-x", "0px");
      card.style.setProperty("--swipe-rotate", "0deg");
      card.style.opacity = "1";
      card.style.transition =
        "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease";
    });
  }, [getCards]);

  const applySwipeStyles = useCallback(
    (deltaX: number) => {
      const card = getActiveCard();
      if (!card) return;
      const rotation = deltaX * 0.1;
      const opacity = 1 - Math.abs(deltaX) / (cardWidth * 1.2);
      card.style.setProperty("--swipe-x", `${deltaX}px`);
      card.style.setProperty("--swipe-rotate", `${rotation}deg`);
      card.style.opacity = Math.max(0.3, opacity).toString();
    },
    [getActiveCard, cardWidth]
  );

  const swipeCard = useCallback(
    (direction: number = 1) => {
      const card = getActiveCard();
      if (!card || isSwiping.current) return;

      isSwiping.current = true;
      const swipeOutX = direction * (cardWidth * 1.8);

      card.style.transition =
        "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease";
      card.style.setProperty("--swipe-x", `${swipeOutX}px`);
      card.style.setProperty("--swipe-rotate", `${direction * 25}deg`);
      card.style.opacity = "0";

      setTimeout(() => {
        setCardOrder((prev) => [...prev.slice(1), prev[0]]);
        isSwiping.current = false;
      }, 400);
    },
    [getActiveCard, cardWidth]
  );

  const handleStart = useCallback(
    (clientX: number) => {
      if (isSwiping.current) return;
      setIsAutoPlaying(false);
      isSwiping.current = true;
      startX.current = clientX;
      currentX.current = clientX;

      const card = getActiveCard();
      if (card) {
        card.style.transition = "none";
      }

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    },
    [getActiveCard]
  );

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isSwiping.current) return;
      currentX.current = clientX;

      animationFrameId.current = requestAnimationFrame(() => {
        const deltaX = currentX.current - startX.current;
        applySwipeStyles(deltaX);
      });
    },
    [applySwipeStyles]
  );

  const handleEnd = useCallback(() => {
    if (!isSwiping.current) return;
    isSwiping.current = false;

    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    const deltaX = currentX.current - startX.current;
    const threshold = cardWidth / 3;
    const card = getActiveCard();
    if (!card) return;

    card.style.transition =
      "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease";

    if (Math.abs(deltaX) > threshold) {
      const direction = Math.sign(deltaX);
      const swipeOutX = direction * (cardWidth * 1.8);
      card.style.setProperty("--swipe-x", `${swipeOutX}px`);
      card.style.setProperty("--swipe-rotate", `${direction * 25}deg`);
      card.style.opacity = "0";

      setTimeout(() => {
        setCardOrder((prev) => [...prev.slice(1), prev[0]]);
      }, 400);
    } else {
      applySwipeStyles(0);
    }

    setTimeout(() => setIsAutoPlaying(true), 2000);
  }, [getActiveCard, applySwipeStyles, cardWidth]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      if (!isSwiping.current) {
        swipeCard(1);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, swipeCard]);

  useEffect(() => {
    const element = cardStackRef.current;
    if (!element) return;

    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault();
      handleStart(e.clientX);
    };
    const onPointerMove = (e: PointerEvent) => {
      e.preventDefault();
      handleMove(e.clientX);
    };
    const onPointerUp = () => handleEnd();
    const onPointerLeave = () => handleEnd();

    element.addEventListener("pointerdown", onPointerDown);
    element.addEventListener("pointermove", onPointerMove);
    element.addEventListener("pointerup", onPointerUp);
    element.addEventListener("pointerleave", onPointerLeave);

    return () => {
      element.removeEventListener("pointerdown", onPointerDown);
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerup", onPointerUp);
      element.removeEventListener("pointerleave", onPointerLeave);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [handleStart, handleMove, handleEnd]);

  useEffect(() => {
    updateCardPositions();
  }, [cardOrder, updateCardPositions]);

  return (
    <section
      ref={cardStackRef}
      className={`relative grid place-content-center select-none ${className}`}
      style={
        {
          width: cardWidth + 64,
          height: cardHeight + 64,
          perspective: "1200px",
          touchAction: "none",
        } as React.CSSProperties
      }
    >
      {cardOrder.map((originalIndex, displayIndex) => {
        const card = cards[originalIndex];
        return (
          <article
            key={card.id}
            className="image-card absolute cursor-grab active:cursor-grabbing
                         place-self-center rounded-3xl shadow-2xl overflow-hidden 
                         will-change-transform bg-slate-800 border border-slate-600
                         hover:shadow-cyan-500/20 transition-shadow duration-300"
            style={
              {
                "--i": displayIndex.toString(),
                "--swipe-x": "0px",
                "--swipe-rotate": "0deg",
                width: cardWidth,
                height: cardHeight,
                zIndex: cards.length - displayIndex,
                transform: `
                translateY(calc(var(--i) * 12px))
                translateZ(calc(var(--i) * -60px))
                translateX(var(--swipe-x))
                rotate(var(--swipe-rotate))
                scale(calc(1 - var(--i) * 0.05))
              `,
                filter: `brightness(${1 - displayIndex * 0.1})`,
              } as React.CSSProperties
            }
          >
            <div className="relative w-full h-full group">
              <img
                src={card.imageUrl}
                alt={card.title}
                className="w-full h-full object-cover pointer-events-none transition-transform duration-700 group-hover:scale-110"
                draggable={false}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = `https://placehold.co/${cardWidth}x${cardHeight}/2d3748/e2e8f0?text=Image+Not+Found`;
                }}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                <h3 className="font-bold text-xl text-white drop-shadow-lg mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  {card.title}
                </h3>
                <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                  {card.description}
                </p>
              </div>

              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
            </div>
          </article>
        );
      })}
    </section>
  );
};

// Main component
const AnimationWorldsApp: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Enhanced card data with descriptions
  const cardData: CardData[] = [
    {
      id: 1,
      imageUrl:
        "https://i.pinimg.com/736x/d6/8a/12/d68a121e960094f99ad8acd37505fb7d.jpg",
      title: "Crimson Forest",
      description: "Where ancient trees whisper secrets in the wind",
    },
    {
      id: 2,
      imageUrl:
        "https://i.pinimg.com/736x/21/16/f7/2116f71f9d51d875e44d809f074ff079.jpg",
      title: "Misty Mountains",
      description: "Peaks that touch the heavens above the clouds",
    },
    {
      id: 3,
      imageUrl:
        "https://i.pinimg.com/1200x/fe/c2/0d/fec20d2958059b8463bffb138d4eaac6.jpg",
      title: "Floating Islands",
      description: "Gravity-defying realms suspended in time",
    },
    {
      id: 4,
      imageUrl:
        "https://i.pinimg.com/736x/84/dc/62/84dc62de850a34a9d420c97f3a2d58f4.jpg",
      title: "Crystal Cave",
      description: "Luminous crystals that hold ancient magic",
    },
    {
      id: 5,
      imageUrl:
        "https://i.pinimg.com/1200x/be/c3/7e/bec37e2c43e703f922f887db2578ce2e.jpg",
      title: "Sunset Peaks",
      description: "Golden hour painted across mountain ranges",
    },
    {
      id: 6,
      imageUrl:
        "https://i.pinimg.com/736x/47/dd/47/47dd47b0d66c2fa641e03e370bcb5433.jpg",
      title: "Night Sky",
      description: "Stars dancing in the cosmic tapestry",
    },
  ];

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-purple-500/30 border-b-purple-500 rounded-full animate-spin animation-reverse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-cyan-900/20 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-cyan-500/10 to-transparent rounded-full animate-pulse floating-1"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-radial from-purple-500/10 to-transparent rounded-full animate-pulse floating-2"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-gradient-radial from-pink-500/10 to-transparent rounded-full animate-pulse floating-3"></div>

        {/* Animated particles */}
        <div className="particles">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="particle absolute w-2 h-2 bg-cyan-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Header with enhanced animations */}
        <div className="text-center mb-12 header-entrance">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
            Animation Worlds
          </h1>
          <p className="text-xl text-gray-300 mb-4 slide-up-delay">
            Swipe through mystical realms and fantasy landscapes
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto rounded-full glow-line"></div>
        </div>

        {/* Centered Image Swiper */}
        <div className="swiper-container relative">
          <ImageSwiper
            cards={cardData}
            cardWidth={320}
            cardHeight={450}
            className="drop-shadow-2xl"
          />

          {/* Navigation indicators */}
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {cardData.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex % cardData.length
                    ? "bg-cyan-500 scale-125 shadow-lg shadow-cyan-500/50"
                    : "bg-gray-600 hover:bg-gray-500"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Interactive controls */}
        {/* <div className="mt-16 flex space-x-6 control-entrance">
          <button
            onClick={() => swipeCard(-1)}
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-95"
          >
            ← Previous
          </button>
          <button
            onClick={() => swipeCard(1)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95"
          >
            Next →
          </button>
        </div> */}

        {/* Current card info display */}
        {/* <div className="mt-8 text-center info-display max-w-md">
          <h3 className="text-2xl font-bold text-white mb-2">
            {cardData[cardOrder[0]]?.title}
          </h3>
          <p className="text-gray-400 leading-relaxed">
            {cardData[cardOrder[0]]?.description}
          </p>
        </div> */}
      </div>

      {/* Enhanced CSS Animations */}
      <style>{`
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        @keyframes floating-1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }

        @keyframes floating-2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-25px, -25px) rotate(-120deg); }
          66% { transform: translate(25px, 25px) rotate(-240deg); }
        }

        @keyframes floating-3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(15px, -15px) rotate(180deg); }
        }

        @keyframes particle-float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.8;
          }
        }

        @keyframes header-entrance {
          0% {
            opacity: 0;
            transform: translateY(-50px) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slide-up-delay {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes swiper-entrance {
          0% {
            opacity: 0;
            transform: scale(0.8) rotateY(45deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotateY(0deg);
          }
        }

        @keyframes control-entrance {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 0 0 5px currentColor;
          }
          50% {
            box-shadow: 0 0 20px currentColor, 0 0 30px currentColor;
          }
        }

        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }

        .floating-1 {
          animation: floating-1 8s ease-in-out infinite;
        }

        .floating-2 {
          animation: floating-2 6s ease-in-out infinite;
        }

        .floating-3 {
          animation: floating-3 10s ease-in-out infinite;
        }

        .particle {
          animation: particle-float 4s ease-in-out infinite;
        }

        .header-entrance {
          animation: header-entrance 1s ease-out;
        }

        .slide-up-delay {
          animation: slide-up-delay 0.8s ease-out 0.3s both;
        }

        .swiper-container {
          animation: swiper-entrance 1s ease-out 0.6s both;
        }

        .control-entrance {
          animation: control-entrance 0.8s ease-out 1s both;
        }

        .info-display {
          animation: slide-up-delay 0.8s ease-out 1.2s both;
        }

        .glow-line {
          animation: glow-pulse 2s ease-in-out infinite;
        }

        .animation-reverse {
          animation-direction: reverse;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }

        /* Enhanced card hover effects */
        .image-card:first-child {
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(255, 255, 255, 0.05),
            0 0 40px rgba(6, 182, 212, 0.1);
        }

        .image-card:first-child:hover {
          box-shadow: 
            0 35px 60px -12px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            0 0 60px rgba(6, 182, 212, 0.2);
        }
      `}</style>
    </div>
  );
};

export default AnimationWorldsApp;
