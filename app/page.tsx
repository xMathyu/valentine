"use client";

import dynamic from "next/dynamic";
import { useState, useCallback, useRef, useEffect } from "react";

const ValentineScene = dynamic(() => import("./components/ValentineScene"), {
  ssr: false,
});

const noMessages = [
  "No 😢",
  "¿Estás segura? 🥺",
  "¡Piénsalo bien! 😭",
  "¡No me hagas esto! 💔",
  "¡Mi corazón se rompe! 😿",
  "¡Vuelve a intentarlo! 🥹",
  "¡No es la respuesta correcta! 😤",
  "¡Dale al otro botón! 💕",
  "¿Segura segura? 🫠",
  "¡Última oportunidad! 🫶",
];

export default function Home() {
  const [phase, setPhase] = useState<"question" | "accepted">("question");
  const [noCount, setNoCount] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [isRandomPosition, setIsRandomPosition] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const noTapCooldown = useRef(false);
  const [confetti, setConfetti] = useState<
    { id: number; x: number; delay: number; color: string; size: number }[]
  >([]);

  const yesScale = 1 + noCount * 0.15;

  const moveNoButton = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const padding = 60;
    const newX = padding + Math.random() * (vw - padding * 2);
    const newY = padding + Math.random() * (vh - padding * 2);
    setNoPosition({ x: newX, y: newY });
    setIsRandomPosition(true);
    setNoCount((prev) => Math.min(prev + 1, noMessages.length - 1));
    // Block "Yes" from firing for a short window after "No" is tapped
    noTapCooldown.current = true;
    setTimeout(() => {
      noTapCooldown.current = false;
    }, 400);
  }, []);

  const handleYes = useCallback(() => {
    const colors = [
      "#ff1493",
      "#ff69b4",
      "#ff6b81",
      "#e84393",
      "#fd79a8",
      "#ffeaa7",
      "#ffffff",
      "#fab1a0",
    ];
    const newConfetti = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 10,
    }));
    setConfetti(newConfetti);
    setPhase("accepted");
  }, []);

  useEffect(() => {
    if (phase !== "accepted") return;
    const interval = setInterval(() => {
      const colors = [
        "#ff1493",
        "#ff69b4",
        "#ff6b81",
        "#e84393",
        "#fd79a8",
        "#ffeaa7",
        "#ffffff",
        "#fab1a0",
      ];
      setConfetti(
        Array.from({ length: 60 }, (_, i) => ({
          id: Date.now() + i,
          x: Math.random() * 100,
          delay: Math.random() * 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 6 + Math.random() * 10,
        })),
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden select-none"
    >
      <ValentineScene />

      {confetti.map((c) => (
        <div
          key={c.id}
          className="confetti-piece"
          style={{
            left: `${c.x}%`,
            animationDelay: `${c.delay}s`,
            backgroundColor: c.color,
            width: c.size,
            height: c.size,
          }}
        />
      ))}

      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none px-4">
        {phase === "question" && (
          <div className="flex flex-col items-center gap-6 pointer-events-auto">
            <div
              className="text-6xl sm:text-8xl animate-bounce"
              style={{ animationDuration: "2s" }}
            >
              {noCount >= 5 ? "🥺" : "🥰"}
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white text-center drop-shadow-lg leading-tight">
              ¿Quieres ser mi
              <br />
              <span className="text-pink-400 text-3xl sm:text-5xl md:text-6xl">
                San Valentín?
              </span>
            </h1>

            {noCount > 0 && (
              <p className="text-lg sm:text-xl text-pink-300 animate-pulse text-center">
                {noMessages[noCount]}
              </p>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 relative">
              <button
                onClick={() => {
                  if (!noTapCooldown.current) handleYes();
                }}
                onTouchEnd={(e) => {
                  if (noTapCooldown.current) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                className="rounded-full font-bold text-white shadow-lg shadow-pink-500/50 transition-all duration-300 hover:shadow-pink-500/80 hover:brightness-110 active:scale-95"
                style={{
                  fontSize: `${Math.min(1.2 + noCount * 0.15, 2.5)}rem`,
                  padding: `${Math.min(0.8 + noCount * 0.1, 1.8)}rem ${Math.min(2 + noCount * 0.3, 4)}rem`,
                  background:
                    "linear-gradient(135deg, #ff1493, #ff69b4, #e84393)",
                  transform: `scale(${yesScale})`,
                  zIndex: 20,
                }}
              >
                ¡Sí, quiero! 💖
              </button>

              <button
                onMouseEnter={moveNoButton}
                onTouchStart={(e) => {
                  e.preventDefault();
                  moveNoButton();
                }}
                onClick={moveNoButton}
                className="rounded-full font-semibold text-gray-300 bg-gray-800/60 backdrop-blur-sm border border-gray-600/50 transition-all duration-200 hover:bg-gray-700/60 active:scale-95"
                style={{
                  padding: `${Math.max(0.6 - noCount * 0.03, 0.3)}rem ${Math.max(1.5 - noCount * 0.08, 0.6)}rem`,
                  fontSize: `${Math.max(1 - noCount * 0.05, 0.6)}rem`,
                  position: isRandomPosition ? "fixed" : "relative",
                  left: isRandomPosition ? `${noPosition.x}px` : undefined,
                  top: isRandomPosition ? `${noPosition.y}px` : undefined,
                  transform: isRandomPosition
                    ? "translate(-50%, -50%)"
                    : undefined,
                  zIndex: 30,
                  transition:
                    "left 0.05s ease-out, top 0.05s ease-out, font-size 0.3s, padding 0.3s",
                }}
              >
                {noMessages[noCount]}
              </button>
            </div>
          </div>
        )}

        {phase === "accepted" && (
          <div className="flex flex-col items-center gap-6 pointer-events-auto animate-fade-in overflow-y-auto max-h-[95vh] pb-8">
            <div className="text-7xl sm:text-9xl animate-heartbeat">💖</div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white text-center drop-shadow-lg">
              ¡Sabía que dirías
              <br />
              <span className="text-pink-400 text-4xl sm:text-6xl md:text-7xl">
                que sí!
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-pink-300 text-center mt-2 animate-pulse">
              Te amo muchísimo 💕
            </p>

            <div className="flex gap-2 text-4xl sm:text-5xl mt-4">
              {["💖", "🌹", "💕", "🌹", "💖"].map((emoji, i) => (
                <span
                  key={i}
                  className="animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  {emoji}
                </span>
              ))}
            </div>

            {/* Video as looping GIF */}
            <video
              src="/valentine.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="mt-6 w-64 sm:w-80 md:w-96 rounded-2xl shadow-lg shadow-pink-500/40 border-2 border-pink-500/30"
            />
          </div>
        )}
      </div>
    </div>
  );
}
