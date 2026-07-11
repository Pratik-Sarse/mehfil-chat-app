import { motion } from "framer-motion";
import { FaBolt } from "react-icons/fa";

const CyberHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      whileHover={{
        scale: 1.03,
        rotateX: 3,
        rotateY: -3,
      }}
      className="relative overflow-hidden rounded-2xl m-2 p-[2px] cursor-pointer"
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
        className="absolute inset-0 rounded-2xl bg-[length:300%_300%]
        bg-gradient-to-r
        from-violet-500
        via-fuchsia-500
        to-cyan-400"
      />

      {/* Card */}
      <div className="relative rounded-2xl bg-[#09090B] px-5 py-5 overflow-hidden">

        {/* Purple Glow */}
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.25, 0.5, 0.25],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
          className="absolute w-56 h-56 -top-20 -right-20 rounded-full bg-violet-600 blur-3xl"
        />

        {/* Title */}
        <motion.h1
          animate={{
            textShadow: [
              "0 0 8px #8b5cf6",
              "0 0 18px #8b5cf6",
              "0 0 8px #8b5cf6",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="relative text-[#7480FF] font-black tracking-[6px] text-lg"
        >
          MEHFIL
        </motion.h1>

        {/* Subtitle */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.2,
            duration: 0.6,
          }}
          className="relative mt-2 text-white text-3xl font-extrabold"
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
          className="origin-left h-[3px] w-full rounded-full mt-4
          bg-gradient-to-r from-violet-500 via-cyan-400 to-fuchsia-500"
        />

        {/* Lightning */}
        <motion.div
          animate={{
            opacity: [0.2, 1, 0.2],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
          className="absolute top-5 right-5 text-yellow-300 text-xl"
        >
          <FaBolt />
        </motion.div>

      </div>
    </motion.div>
  );
};

export default CyberHeader;