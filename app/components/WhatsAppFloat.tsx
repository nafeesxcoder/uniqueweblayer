"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { IoChatbubbleEllipsesOutline, IoClose } from "react-icons/io5";
import { MdChat, MdSupportAgent, MdAccessTime } from "react-icons/md";

type Position = "bottom-right" | "bottom-left";

type WhatsAppFloatProps = {
  phoneNumber?: string;
  message?: string;
  position?: Position;
  pulseAnimation?: boolean;
};

const positionClasses: Record<Position, string> = {
  "bottom-right":
    "right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] sm:right-6 sm:bottom-6 md:right-8 md:bottom-8",
  "bottom-left":
    "left-[max(1rem,env(safe-area-inset-left))] bottom-[max(1rem,env(safe-area-inset-bottom))] sm:left-6 sm:bottom-6 md:left-8 md:bottom-8",
};

const panelAlignClasses: Record<Position, string> = {
  "bottom-right": "right-0",
  "bottom-left": "left-0",
};

export function WhatsAppFloat({
  phoneNumber = "+917409233994",
  message = "Hi! I'd like a quote for a website / mobile app / SEO. Can you help?",
  position = "bottom-right",
  pulseAnimation = true,
}: WhatsAppFloatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showPopChat, setShowPopChat] = useState(false);
  const [visitorMessage, setVisitorMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { text: string; isUser: boolean }[]
  >([
    { text: "Hi there! 👋 Welcome to Unique Web Layer!", isUser: false },
    {
      text: "Need a website, a mobile app or better Google rankings? Ask away.",
      isUser: false,
    },
  ]);

  // Show pop chat after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowPopChat(true);
        // Auto hide after 10 seconds
        setTimeout(() => setShowPopChat(false), 10000);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleWhatsAppClick = () => {
    const cleanNumber = phoneNumber.replace(/\D/g, "");
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  const handleSendMessage = () => {
    if (visitorMessage.trim()) {
      setChatMessages((prev) => [
        ...prev,
        { text: visitorMessage, isUser: true },
      ]);
      // Auto reply
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            text: "Thanks for your message! I'll get back to you shortly. Meanwhile, feel free to start a WhatsApp chat for faster response.",
            isUser: false,
          },
        ]);
      }, 1000);
      setVisitorMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className={`fixed z-[100] ${positionClasses[position]}`}>
      {/* Auto Pop Chat */}
      <AnimatePresence>
        {showPopChat && !isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              x: position === "bottom-right" ? 20 : -20,
            }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{
              opacity: 0,
              y: 20,
              x: position === "bottom-right" ? 20 : -20,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`absolute bottom-full mb-4 w-80 overflow-hidden rounded-2xl border border-purple-500/30 bg-linear-to-br from-purple-900/95 to-black/95 backdrop-blur-xl shadow-2xl ${panelAlignClasses[position]}`}
          >
            {/* Pop Chat Header */}
            <div className="flex items-center justify-between bg-linear-to-r from-purple-600 to-pink-600 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white">
                  <MdChat className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Need Help?
                  </h3>
                  <p className="text-xs text-white/70">
                    We usually reply in 5 mins
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPopChat(false)}
                className="rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              >
                <IoClose className="h-5 w-5" />
              </button>
            </div>

            {/* Pop Chat Body */}
            <div className="p-4">
              <div className="mb-3 flex items-center gap-2 text-xs text-purple-300">
                <MdSupportAgent className="h-3.5 w-3.5" />
                <span>Support online</span>
                <span className="h-1.5 w-1.5 rounded-full bg-green-400"></span>
              </div>
              <p className="text-sm text-gray-300 mb-3">
                Website, mobile app or SEO? Message us — we usually reply
                within a few hours, any time zone.
              </p>
              <button
                onClick={() => {
                  setShowPopChat(false);
                  setIsOpen(true);
                }}
                className="w-full rounded-xl bg-linear-to-r from-purple-600 to-pink-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
              >
                Chat with Us →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main WhatsApp Panel */}
      <div className="relative h-14 w-14 shrink-0">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="wa-panel"
              initial={{ opacity: 0, y: 16, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className={`absolute bottom-full mb-3 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-purple-500/30 bg-linear-to-br from-gray-900 to-black shadow-2xl ${panelAlignClasses[position]}`}
            >
              {/* Header */}
              <div className="flex items-center justify-between bg-linear-to-r from-purple-600 to-pink-600 px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white">
                    <FaWhatsapp className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      WhatsApp Chat
                    </h3>
                    <p className="text-xs text-white/70">
                      Typically replies within an hour
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-1.5 text-white transition-colors hover:bg-white/10"
                >
                  <IoClose className="h-5 w-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="max-h-80 overflow-y-auto p-4 space-y-3 bg-linear-to-b from-gray-900/50 to-black/50">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                        msg.isUser
                          ? "bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-br-sm"
                          : "bg-white/10 text-gray-200 rounded-bl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="border-t border-white/10 p-3 bg-black/50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={visitorMessage}
                    onChange={(e) => setVisitorMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 rounded-xl bg-white/10 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="rounded-xl bg-linear-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-105"
                  >
                    Send
                  </button>
                </div>
                <button
                  onClick={handleWhatsAppClick}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-purple-500/30 bg-purple-600/20 px-4 py-2 text-sm font-semibold text-purple-400 transition-all hover:bg-purple-600/30"
                >
                  <FaWhatsapp className="h-4 w-4" />
                  Continue on WhatsApp
                </button>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-center gap-2 border-t border-white/10 bg-black/30 px-4 py-2">
                <MdAccessTime className="h-3 w-3 text-gray-500" />
                <span className="text-xs text-gray-500">
                  We reply within 24 hours
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Button */}
        <motion.button
          onClick={() => setIsOpen((o) => !o)}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg ring-2 ring-white/30 transition-all hover:shadow-xl hover:ring-white/50"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          animate={showPopChat && !isOpen ? { scale: [1, 1.1, 1] } : {}}
          transition={{ repeat: showPopChat && !isOpen ? 2 : 0, duration: 0.5 }}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close WhatsApp menu" : "Open WhatsApp chat"}
        >
          {pulseAnimation && !isOpen && (
            <span
              className="absolute inset-0 rounded-full bg-purple-500 opacity-60 motion-safe:animate-ping"
              aria-hidden
            />
          )}
          <FaWhatsapp className="relative z-[1] h-7 w-7" aria-hidden />
        </motion.button>
      </div>
    </div>
  );
}
