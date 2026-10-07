import React, { useEffect } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'motion/react';
import { EASE_OUT } from './motion';

interface AnimatedNumberProps {
  value: number;
  format?: (value: number) => string;
  className?: string;
  duration?: number;
}

const defaultFormat = (v: number) => String(Math.round(v));

/** Nombre qui « compte » jusqu'à sa nouvelle valeur (totaux, jauges, quantités) */
export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  format = defaultFormat,
  className,
  duration = 0.7,
}) => {
  const motionValue = useMotionValue(value);
  const display = useTransform(motionValue, (v) => format(v));

  useEffect(() => {
    const controls = animate(motionValue, value, { duration, ease: EASE_OUT });
    return () => controls.stop();
  }, [value, duration, motionValue]);

  return <motion.span className={className}>{display}</motion.span>;
};
