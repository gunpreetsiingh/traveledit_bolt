import React from 'react';
import { AnimatePresence, motion, Variants, Transition } from 'framer-motion';

interface TransitionPanelProps {
  activeIndex: number;
  children: React.ReactNode;
  transition?: Transition;
  variants?: Variants;
}

export function TransitionPanel({
  activeIndex,
  children,
  transition = { duration: 0.3, ease: 'easeInOut' },
  variants = {
    enter: { opacity: 0, y: 20, filter: 'blur(4px)' },
    center: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -20, filter: 'blur(4px)' },
  },
}: TransitionPanelProps) {
  const childrenArray = React.Children.toArray(children);
  const currentChild = childrenArray[activeIndex];

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {currentChild && (
          <motion.div
            key={activeIndex} // Key is crucial for AnimatePresence to detect changes
            initial="enter"
            animate="center"
            exit="exit"
            variants={variants}
            transition={transition}
            className="w-full"
          >
            {currentChild}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}