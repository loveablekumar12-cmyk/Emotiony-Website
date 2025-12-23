import { motion } from "framer-motion";

export function Visualizer({ isPlaying }: { isPlaying: boolean }) {
  // Mock visualizer bars
  const bars = Array.from({ length: 12 });

  return (
    <div className="flex items-end justify-center gap-1 h-8">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-primary rounded-full opacity-60"
          animate={{
            height: isPlaying ? ["20%", "100%", "40%"] : "20%",
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: i * 0.1, // Stagger effect
          }}
          style={{
            backgroundColor: `hsl(${260 + i * 10}, 80%, 60%)` // Gradient color
          }}
        />
      ))}
    </div>
  );
}
