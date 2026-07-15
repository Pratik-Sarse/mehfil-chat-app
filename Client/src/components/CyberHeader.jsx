import { motion } from "framer-motion";
import { FaBolt } from "react-icons/fa";

const CyberHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{
        scale: 1.02,
        rotateX: 2,
        rotateY: -2,
      }}
      className="relative overflow-hidden rounded-xl m-2 p-[2px] cursor-pointer"
      style={{
        perspective: "1000px",
      }}
    >
      {/* Animated Border */}
      <motion.div
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 rounded-xl bg-[length:300%_300%]
        bg-gradient-to-r
        from-violet-500
        via-fuchsia-500
        to-cyan-400 opacity-[.6]"
      />

      {/* Card */}
      <div className="relative rounded-xl bg-[#09090B] px-4 py-3 overflow-hidden">

        {/* Purple Glow */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
          className="absolute w-32 h-32 -top-10 -right-10 rounded-full bg-violet-600 blur-3xl"
        />

        {/* Title */}
        <motion.h1
          animate={{
            textShadow: [
              "0 0 6px #8b5cf6",
              "0 0 14px #8b5cf6",
              "0 0 6px #8b5cf6",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="relative text-[#7480FF] font-black tracking-[4px] text-sm"
        >
          MEHFIL
        </motion.h1>

        {/* Subtitle */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.2,
            duration: 0.5,
          }}
          className="relative mt-1 text-white text-xl font-bold"
        >
          Connect Freely
        </motion.h2>

        {/* Energy Line */}
        <motion.div
          animate={{
            scaleX: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="origin-left h-[2px]  w-90 rounded-full mt-2
          bg-gradient-to-r from-violet-500 via-cyan-400 to-fuchsia-500 opacity-0"
        />

        {/* Lightning (clickable: reload app / update SW) */}
        <motion.div
          animate={{
            opacity: [0.3, 1, 0.3],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
          className="absolute top-3 right-3 text-yellow-300 text-base cursor-pointer"
          role="button"
          tabIndex={0}
          onClick={() => {
            if (navigator.serviceWorker?.controller) {
              navigator.serviceWorker.getRegistration().then((registration) => {
                if (registration?.waiting) {
                  registration.waiting.postMessage({ type: "SKIP_WAITING" });
                }
                window.location.reload();
              });
              return;
            }
            window.location.reload();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              if (navigator.serviceWorker?.controller) {
                navigator.serviceWorker.getRegistration().then((registration) => {
                  if (registration?.waiting) {
                    registration.waiting.postMessage({ type: "SKIP_WAITING" });
                  }
                  window.location.reload();
                });
                return;
              }
              window.location.reload();
            }
          }}
        >
          <FaBolt />
        </motion.div>

      </div>
    </motion.div>
  );
};

export default CyberHeader;