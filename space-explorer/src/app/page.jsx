"use client";
import TrueFocus from "@/components/heading";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LandingPage = () => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleStart = () => {
    if (isClient && router) {
      router.push("/galaxy");
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black flex flex-col items-center justify-center">
      {/* Universe Background */}
      <div className="absolute inset-0 z-0 animate-pulse">
        <div className="bg-[url('https://e1.pxfuel.com/desktop-wallpaper/286/305/desktop-wallpaper-3d-universe-space-3d-space.jpg')] bg-cover bg-center w-full h-full opacity-80" />
      </div>

      {/* Twinkling Stars Animation */}
      <div className="absolute inset-0 z-0">
        <div className="animate-twinkle w-full h-full">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: `${Math.random() * 3}px`,
                height: `${Math.random() * 3}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
            ></motion.div>
          ))}
        </div>
      </div>

      {/* Information Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-10 text-center text-cyan-400 p-4 drop-shadow-lg"
      >
        <TrueFocus
          sentence="Explore the Wonders of the Universe"
          manualMode={false}
          blurAmount={5}
          borderColor="cyan"
          animationDuration={2}
          pauseBetweenAnimations={1}
        />
        <span className="relative top-5 text-xl max-w-xl">
          Vast, mysterious, and beautiful — the universe holds countless secrets
          waiting to be discovered. Join us on an incredible journey through our
          galaxy and beyond.
        </span>
      </motion.div>

      {/* Glowing Start Button */}
      <motion.button
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.1, boxShadow: "0px 0px 20px #00FFFF" }}
        whileTap={{ scale: 0.9 }}
        onClick={handleStart}
        className="z-10 mt-10 px-8 py-3 text-cyan-400 rounded-2xl text-2xl font-semibold border-2 border-cyan-400 hover:shadow-cyan-400 hover:shadow-lg transition"
      >
        🚀 Start the Journey 🚀
      </motion.button>

      {/* Floating Planets */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        className="absolute bottom-10 left-10 text-9xl"
        transition={{ duration: 2, repeat: Infinity }}
      >
        🪐
      </motion.div>
      <motion.div
        className="absolute top-10 right-10 text-5xl"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        🌏
      </motion.div>
    </div>
  );
};

export default LandingPage;
