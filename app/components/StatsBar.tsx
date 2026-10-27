"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiCode, FiUsers, FiAward } from "react-icons/fi";
import { FaSmile, FaRocket, FaLaptopCode } from "react-icons/fa";
import { Stars } from "./Stars";

export default function StatsBar() {
  const [projects, setProjects] = useState(0);
  const [clients, setClients] = useState(0);
  const [tech, setTech] = useState(0);
  const [satisfaction, setSatisfaction] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;

    const interval = window.setInterval(() => {
      setProjects((prev) => (prev < 50 ? prev + 2 : 50));
      setClients((prev) => (prev < 30 ? prev + 1 : 30));
      setTech((prev) => (prev < 20 ? prev + 1 : 20));
      setSatisfaction((prev) => (prev < 100 ? Math.min(100, prev + 2) : 100));
    }, 60);

    return () => window.clearInterval(interval);
  }, [hasStarted]);

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardAnim = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    show: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <section className="relative py-20 bg-linear-to-b from-black via-purple-950/20 to-black overflow-hidden">
      {/* Stars Background */}
      <Stars />

      {/* Purple Glow Orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-pink-600/5 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Moving Gradient Lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-purple-500/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-pink-500/20 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-linear-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 backdrop-blur-sm mb-5">
            <FaRocket className="w-3 h-3 text-purple-400" />
            <span className="text-xs font-semibold tracking-wider text-purple-300">
              OUR ACHIEVEMENTS
            </span>
          </div>

          <p className="text-4xl md:text-5xl font-semibold bg-linear-to-r from-white via-purple-300 to-white bg-clip-text text-transparent">
            Unique Web Layer at a Glance
          </p>

          <p className="text-gray-400 text-sm md:text-base mt-3 max-w-2xl mx-auto">
            What we have delivered, and where
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          onViewportEnter={() => setHasStarted(true)}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center"
        >
          {[
            {
              icon: <FiCode />,
              value: `${projects}+`,
              title: "Projects Completed",
              sub: "Successfully Delivered",
              gradient: "from-purple-500 to-pink-500",
            },
            {
              icon: <FaSmile />,
              value: `${clients}+`,
              title: "Clients Worldwide",
              sub: "From Startups to Enterprises",
              gradient: "from-blue-500 to-cyan-500",
            },
            {
              icon: <FaLaptopCode />,
              value: `${tech}+`,
              title: "Countries Served",
              sub: "Across 6 Continents",
              gradient: "from-orange-500 to-red-500",
            },
            {
              icon: <FiAward />,
              value: `${satisfaction}%`,
              title: "Client Satisfaction",
              sub: "Quality Guaranteed",
              gradient: "from-green-500 to-emerald-500",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={cardAnim}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.07, y: -8 }}
              className="relative w-65 h-60 rounded-2xl p-0.5 group overflow-hidden"
            >
              {/* 🔥 Animated Gradient Border */}
              <div
                className="absolute inset-0 rounded-2xl blur-sm opacity-70 group-hover:opacity-100 transition duration-300"
                style={{
                  background: `conic-gradient(from 0deg, #751f8c, #b665f2, #ec4899, #751f8c)`,
                  animation: "spin 6s linear infinite",
                }}
              />

              {/* Inner Card */}
              <div className="relative w-full h-full bg-linear-to-br from-gray-900/90 to-black/90 rounded-2xl flex flex-col items-center justify-center text-center p-6 border border-white/10 backdrop-blur-md shadow-lg group-hover:shadow-[0_0_40px_rgba(139,92,246,0.4)] transition-all duration-300">
                {/* Icon with Star Effect */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`w-16 h-16 rounded-xl bg-linear-to-br ${item.gradient} flex items-center justify-center mb-4 shadow-lg relative`}
                >
                  <div className="text-white text-2xl">{item.icon}</div>
                  <motion.div
                    className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </motion.div>

                {/* Value */}
                <div className="text-4xl md:text-5xl font-bold text-white leading-none">
                  {item.value}
                </div>

                {/* Title */}
                <p className="text-lg text-white mt-3 font-semibold">
                  {item.title}
                </p>

                {/* Sub */}
                <p className="text-xs text-gray-400 mt-1">{item.sub}</p>

                {/* Progress Bar */}
                <div className="w-full h-0.5 bg-white/10 rounded-full mt-4 overflow-hidden">
                  <div
                    className={`h-full bg-linear-to-r ${item.gradient} rounded-full transition-all duration-1000`}
                    style={{ width: hasStarted ? "100%" : "0%" }}
                  />
                </div>
              </div>

              <style jsx>{`
                @keyframes spin {
                  0% {
                    transform: rotate(0deg);
                  }
                  100% {
                    transform: rotate(360deg);
                  }
                }
              `}</style>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
