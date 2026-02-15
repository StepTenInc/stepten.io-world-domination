"use client";

import { motion } from "framer-motion";
import { Logo } from "./logo";

type AnimationType =
  | "none"
  | "pulse"
  | "glow"
  | "float"
  | "rotate"
  | "scale-on-hover"
  | "neon-pulse"
  | "3d-rotate";

interface AnimatedLogoProps {
  /** Width of the logo in pixels */
  width?: number;
  /** Height of the logo in pixels */
  height?: number;
  /** Animation type to apply */
  animation?: AnimationType;
  /** Custom className for additional styling */
  className?: string;
  /** Whether the logo should be clickable */
  clickable?: boolean;
  /** Callback when logo is clicked */
  onClick?: () => void;
}

/**
 * Animated StepTen Logo Component
 *
 * A versatile logo component with multiple animation presets.
 * Perfect for navbar, hero sections, loading states, etc.
 *
 * @example
 * // Simple static logo
 * <AnimatedLogo width={120} height={120} />
 *
 * // Floating logo in hero
 * <AnimatedLogo width={200} height={200} animation="float" />
 *
 * // Navbar logo with hover effect
 * <AnimatedLogo width={40} height={40} animation="scale-on-hover" clickable />
 */
export function AnimatedLogo({
  width = 120,
  height = 120,
  animation = "none",
  className = "",
  clickable = false,
  onClick,
}: AnimatedLogoProps) {

  // Animation variants for Framer Motion
  const animations: Record<AnimationType, any> = {
    none: {},

    pulse: {
      animate: {
        scale: [1, 1.05, 1],
        opacity: [1, 0.9, 1],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },

    glow: {
      animate: {
        filter: [
          "drop-shadow(0 0 5px rgba(0, 255, 65, 0.5))",
          "drop-shadow(0 0 20px rgba(0, 255, 65, 0.8)) drop-shadow(0 0 30px rgba(0, 180, 255, 0.6))",
          "drop-shadow(0 0 5px rgba(0, 255, 65, 0.5))"
        ],
      },
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },

    float: {
      animate: {
        y: [0, -20, 0],
        rotate: [0, 5, 0, -5, 0],
      },
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },

    rotate: {
      animate: {
        rotate: 360,
      },
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }
    },

    "scale-on-hover": {
      whileHover: {
        scale: 1.1,
        rotate: 5,
        filter: "drop-shadow(0 0 15px rgba(0, 255, 65, 0.7))",
      },
      whileTap: {
        scale: 0.95,
      },
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },

    "neon-pulse": {
      animate: {
        filter: [
          "drop-shadow(0 0 2px rgba(0, 255, 65, 0.3)) drop-shadow(0 0 5px rgba(0, 180, 255, 0.3))",
          "drop-shadow(0 0 10px rgba(0, 255, 65, 0.8)) drop-shadow(0 0 20px rgba(0, 180, 255, 0.8)) drop-shadow(0 0 30px rgba(0, 255, 65, 0.5))",
          "drop-shadow(0 0 2px rgba(0, 255, 65, 0.3)) drop-shadow(0 0 5px rgba(0, 180, 255, 0.3))",
        ],
        scale: [1, 1.02, 1],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },

    "3d-rotate": {
      animate: {
        rotateY: [0, 360],
      },
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "linear"
      },
      style: {
        transformStyle: "preserve-3d" as const,
      }
    },
  };

  const selectedAnimation = animations[animation];

  return (
    <motion.div
      className={`inline-block ${clickable ? 'cursor-pointer' : ''} ${className}`}
      onClick={clickable ? onClick : undefined}
      {...selectedAnimation}
    >
      <Logo
        size={width}
        className="object-contain"
      />
    </motion.div>
  );
}

/**
 * Pre-configured logo variants for common use cases
 */

/** Logo for navigation bar */
export function NavbarLogo({ onClick }: { onClick?: () => void }) {
  return (
    <AnimatedLogo
      width={40}
      height={40}
      animation="scale-on-hover"
      clickable
      onClick={onClick}
    />
  );
}

/** Logo for hero section */
export function HeroLogo() {
  return (
    <AnimatedLogo
      width={200}
      height={200}
      animation="float"
      className="mx-auto"
    />
  );
}

/** Logo for loading states */
export function LoadingLogo() {
  return (
    <AnimatedLogo
      width={80}
      height={80}
      animation="neon-pulse"
      className="mx-auto"
    />
  );
}

/** Logo for footer */
export function FooterLogo() {
  return (
    <AnimatedLogo
      width={60}
      height={60}
      animation="glow"
    />
  );
}

/** Logo for author avatar/gravatar */
export function AvatarLogo({ size = 40 }: { size?: number }) {
  return (
    <AnimatedLogo
      width={size}
      height={size}
      animation="none"
      className="rounded-full bg-gradient-to-br from-primary/10 to-info/10 p-1"
    />
  );
}
