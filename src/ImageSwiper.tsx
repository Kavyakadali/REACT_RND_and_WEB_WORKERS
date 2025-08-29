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

// Enhanced ImageSwiper component with black and white theme
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
                         place-self-center rounded-2xl shadow-2xl overflow-hidden 
                         will-change-transform bg-gradient-to-br from-gray-800/50 to-gray-900/50
                         backdrop-blur-lg border border-gray-700/50 hover:border-white/50"
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
                boxShadow:
                  displayIndex === 0
                    ? "0 20px 60px rgba(0,0,0,0.4), 0 0 30px rgba(255,255,255,0.1)"
                    : "0 10px 30px rgba(0,0,0,0.3)",
              } as React.CSSProperties
            }
          >
            <div className="relative w-full h-full group">
              <img
                src={card.imageUrl}
                alt={card.title}
                className="w-full h-full object-cover pointer-events-none transition-all duration-700 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
                draggable={false}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = `https://placehold.co/${cardWidth}x${cardHeight}/374151/ffffff?text=Image+Not+Found`;
                }}
              />

              {/* Gradient overlay matching the black theme */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-gray-900/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

              {/* Content overlay with black/white theme */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-gray-900/80 to-transparent">
                <h3 className="font-bold text-xl text-white drop-shadow-lg mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
                  {card.title}
                </h3>
                <p className="text-gray-400 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100 group-hover:text-gray-200">
                  {card.description}
                </p>
              </div>

              {/* White shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>

              {/* Geometric elements matching the main theme */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-8 h-8 border-2 border-white/50 rounded-full animate-spin"></div>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
};

// Main component with black and white theme
const BlackWhiteImageSwiperApp: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Enhanced card data matching the black theme
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

  const generateParticles = (count = 50) => {
    return Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        className="absolute rounded-full opacity-40 animate-pulse"
        style={{
          width: `${2 + Math.random() * 4}px`,
          height: `${2 + Math.random() * 4}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          background: i % 2 === 0 ? "#ffffff" : "#d1d5db",
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${2 + Math.random() * 4}s`,
          transform: `translate(${Math.sin((scrollY + i) * 0.01) * 10}px, ${
            Math.cos((scrollY + i) * 0.01) * 10
          }px)`,
        }}
      />
    ));
  };

  const generateFloatingShapes = () => {
    return Array.from({ length: 8 }, (_, i) => (
      <div
        key={i}
        className="absolute opacity-20 animate-spin"
        style={{
          width: `${20 + Math.random() * 40}px`,
          height: `${20 + Math.random() * 40}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          background:
            i % 2 === 0
              ? `linear-gradient(${
                  Math.random() * 360
                }deg, rgba(255, 255, 255, 0.3), rgba(209, 213, 219, 0.3))`
              : `linear-gradient(${
                  Math.random() * 360
                }deg, rgba(107, 114, 128, 0.3), rgba(75, 85, 99, 0.3))`,
          borderRadius: Math.random() > 0.5 ? "50%" : "20%",
          animationDuration: `${10 + Math.random() * 20}s`,
          animationDirection: Math.random() > 0.5 ? "normal" : "reverse",
          transform: `translate(${
            Math.sin((scrollY + i * 100) * 0.005) * 30
          }px, ${Math.cos((scrollY + i * 100) * 0.005) * 20}px) rotate(${
            scrollY * 0.1 + i * 30
          }deg)`,
        }}
      />
    ));
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-gray-700 border-t-white rounded-full animate-spin"></div>
          <div
            className="absolute inset-0 w-20 h-20 border-4 border-gray-600 border-b-gray-300 rounded-full animate-spin"
            style={{ animationDirection: "reverse" }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background effects matching AnimationWorld */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px),
               linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        {generateParticles(80)}
        {generateFloatingShapes()}
      </div>

      {/* Geometric Rings */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute border-2 rounded-full opacity-20"
            style={{
              width: `${100 + i * 60}px`,
              height: `${100 + i * 60}px`,
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) rotate(${
                scrollY * 0.1 + i * 30
              }deg)`,
              borderColor: i % 2 === 0 ? "#ffffff" : "#9ca3af",
              animation: `float ${10 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Header with black/white theme */}
        <div className="text-center mb-12">
          <h1
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent"
            style={{ textShadow: "0 0 50px rgba(255,255,255,0.5)" }}
          >
            Animation Worlds
          </h1>
          <p
            className="text-xl text-gray-400 mb-4"
            style={{ textShadow: "0 0 20px rgba(255,255,255,0.2)" }}
          >
            Swipe through mystical realms and fantasy landscapes
          </p>
          <div
            className="w-24 h-1 bg-gradient-to-r from-white to-gray-300 mx-auto rounded-full"
            style={{ boxShadow: "0 0 20px rgba(255,255,255,0.5)" }}
          ></div>
        </div>

        {/* Centered Image Swiper */}
        <div className="relative">
          <ImageSwiper
            cards={cardData}
            cardWidth={320}
            cardHeight={450}
            className="drop-shadow-2xl"
          />

          {/* Navigation indicators with black/white theme */}
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {cardData.map((_, index) => (
              <div
                key={index}
                className={`rounded-full transition-all duration-500 cursor-pointer ${
                  index === currentIndex % cardData.length
                    ? "w-12 h-3 bg-gradient-to-r from-white to-gray-300"
                    : "w-3 h-3 bg-white/30 hover:bg-white/60"
                }`}
                style={{
                  boxShadow:
                    index === currentIndex % cardData.length
                      ? "0 0 20px rgba(255,255,255,0.5)"
                      : "none",
                }}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Current card info display with theme matching */}
        <div className="mt-16 text-center max-w-md">
          {/* <h3 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
            {cardData[cardOrder[0]]?.title}
          </h3>
          <p className="text-gray-400 leading-relaxed">
            {cardData[cardOrder[0]]?.description}
          </p> */}
        </div>
      </div>

      {/* Enhanced CSS Animations matching the black theme */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }

        @keyframes glitch {
          0%, 100% {
            transform: translate(0, 0);
          }
          10% {
            transform: translate(-2px, -2px);
          }
          20% {
            transform: translate(2px, 2px);
          }
          30% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(2px, -2px);
          }
          50% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          70% {
            transform: translate(-2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
          90% {
            transform: translate(-2px, -2px);
          }
        }

        /* Enhanced card hover effects for black theme */
        .image-card:first-child {
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.8),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            0 0 40px rgba(255, 255, 255, 0.1);
        }

        .image-card:first-child:hover {
          box-shadow: 
            0 35px 60px -12px rgba(0, 0, 0, 0.9),
            0 0 0 1px rgba(255, 255, 255, 0.2),
            0 0 60px rgba(255, 255, 255, 0.2);
          transform: 
            translateY(calc(var(--i) * 12px))
            translateZ(calc(var(--i) * -60px))
            translateX(var(--swipe-x))
            rotate(var(--swipe-rotate))
            scale(calc(1 - var(--i) * 0.05))
            translateY(-8px) !important;
        }

        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #1a1a1a;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #ffffff, #9ca3af);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #f9fafb, #d1d5db);
        }
      `}</style>
    </div>
  );
};

export default BlackWhiteImageSwiperApp;
