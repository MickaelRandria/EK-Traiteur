import React, { useEffect } from 'react';
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** Élément posé « au-dessus » de la photo, en profondeur (parallaxe 3D) */
  overlay?: React.ReactNode;
  /**
   * « object » : plat détouré sans cadre. Le reflet est découpé à la forme du plat
   * (masque = image détourée) et l'ombre est portée par le plat lui-même.
   */
  variant?: 'card' | 'object';
  maskSrc?: string;
}

const MAX_TILT_Y = 14;
const MAX_TILT_X = 10;
const clamp = (v: number, max: number) => Math.max(-max, Math.min(max, v));

/**
 * Carte inclinable en 3D : suit le doigt / la souris, ou l'inclinaison du téléphone.
 * Le produit reste stable au repos. Un reflet suit l'angle de l'interaction.
 */
export const TiltCard: React.FC<TiltCardProps> = ({ children, className = '', overlay, variant = 'card', maskSrc }) => {
  const isObject = variant === 'object';
  const reduceMotion = useReducedMotion();
  const spring = { stiffness: 140, damping: 16, mass: 0.6 };
  const rotateX = useSpring(0, spring);
  const rotateY = useSpring(0, spring);

  const sheenX = useTransform(rotateY, [-MAX_TILT_Y, MAX_TILT_Y], [100, 0]);
  const sheenY = useTransform(rotateX, [-MAX_TILT_X, MAX_TILT_X], [0, 100]);
  const sheen = useMotionTemplate`radial-gradient(circle at ${sheenX}% ${sheenY}%, rgba(255,255,255,0.38), rgba(255,255,255,0) 55%)`;
  const shadowX = useTransform(rotateY, (v) => -v * 1.6);
  const shadowY = useTransform(rotateX, (v) => 34 + v * 1.6);
  const shadow = useMotionTemplate`${shadowX}px ${shadowY}px 60px -18px rgba(35,38,31,0.45)`;

  const resetTilt = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  // Inclinaison du téléphone (Android ; iOS demande une autorisation que l'on ne sollicite pas)
  useEffect(() => {
    if (reduceMotion) return;
    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      rotateY.set(clamp(e.gamma / 2.5, MAX_TILT_Y));
      rotateX.set(clamp(-(e.beta - 45) / 3, MAX_TILT_X));
    };
    window.addEventListener('deviceorientation', onOrientation);
    return () => window.removeEventListener('deviceorientation', onOrientation);
  }, [reduceMotion, rotateX, rotateY]);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(clamp(px * MAX_TILT_Y * 2, MAX_TILT_Y));
    rotateX.set(clamp(-py * MAX_TILT_X * 2, MAX_TILT_X));
  };

  return (
    <div className={`[perspective:1100px] ${className}`} onPointerMove={onPointerMove} onPointerLeave={resetTilt} onPointerCancel={resetTilt}>
      <motion.div
        className={`relative w-full h-full [transform-style:preserve-3d] ${isObject ? '' : 'rounded-[4px]'}`}
        style={isObject ? { rotateX, rotateY } : { rotateX, rotateY, boxShadow: shadow }}
        initial={reduceMotion ? false : { scale: 0.97 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className={`absolute inset-0 ${isObject ? '' : 'overflow-hidden rounded-[4px]'}`}>{children}</div>
        <motion.div
          aria-hidden="true"
          className={`absolute inset-0 pointer-events-none mix-blend-soft-light ${isObject ? '' : 'rounded-[4px]'}`}
          style={
            isObject && maskSrc
              ? {
                  background: sheen,
                  WebkitMaskImage: `url(${maskSrc})`,
                  maskImage: `url(${maskSrc})`,
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                }
              : { background: sheen }
          }
        />
        {overlay && (
          <div className="absolute inset-0 pointer-events-none [transform:translateZ(46px)]">{overlay}</div>
        )}
      </motion.div>
    </div>
  );
};

/** Fond d'ambiance : la photo floutée, agrandie, qui dérive lentement */
export const AmbientBackdrop: React.FC<{ src: string }> = ({ src }) => {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9 }}
    >
      <motion.img
        src={src}
        alt=""
        className="absolute left-[-25%] top-[-25%] w-[150%] h-[150%] object-cover blur-[46px] saturate-[1.35] opacity-80"
        animate={
          reduceMotion
            ? undefined
            : { x: ['-5%', '5%', '-5%'], y: ['-4%', '3%', '-4%'], rotate: [0, 10, 0], scale: [1.05, 1.2, 1.05] }
        }
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ivory/0 via-ivory/10 to-ivory" />
      {/* Grain discret, façon tirage photo */}
      <div
        className="absolute inset-0 opacity-[0.16] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </motion.div>
  );
};
