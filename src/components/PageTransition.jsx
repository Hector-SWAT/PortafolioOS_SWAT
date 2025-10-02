import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function PageTransition({ children }) {
  const [displayed, setDisplayed] = useState(children);

  useEffect(() => {
    setDisplayed(children);
  }, [children]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={JSON.stringify(children.key) || Math.random()}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {displayed}
      </motion.div>
    </AnimatePresence>
  );
}
