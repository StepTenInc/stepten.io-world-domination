"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X, Sparkles, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { NavbarLogo } from '@/components/ui/animated-logo';

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Handle scroll effect with progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollY / windowHeight) * 100;

      setIsScrolled(scrollY > 20);
      setScrollProgress(Math.min(progress, 100));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track mouse for magnetic effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const navLinks = [
    { href: '/courses', label: 'Courses', isNew: true },
    { href: '/products', label: 'Products' },
    { href: '/services', label: 'Services' },
    { href: '/articles', label: 'Insights' },
    { href: '/about', label: 'About' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <header
        className={cn(
          'fixed top-0 w-full z-50 transition-all duration-500 border-b border-white/0',
          isScrolled
            ? 'bg-background/90 backdrop-blur-xl border-white/10 shadow-2xl shadow-black/10 py-3'
            : 'bg-transparent py-5'
        )}
      >
        {/* Scroll Progress Bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary via-info to-primary origin-left"
          style={{
            width: `${scrollProgress}%`,
            boxShadow: isScrolled ? '0 0 20px rgba(0, 255, 65, 0.6)' : 'none'
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: scrollProgress > 0 ? 1 : 0 }}
          transition={{ duration: 0.1 }}
        />

        {/* Ambient Glow Effect */}
        {isScrolled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"
          />
        )}

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group relative">
              <NavbarLogo />
              <motion.span
                className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-foreground-muted group-hover:from-primary group-hover:via-white group-hover:to-primary"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                StepTen
              </motion.span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      'relative px-5 py-2.5 text-sm font-semibold transition-all rounded-full hover:text-white group block',
                      isActive(link.href) ? 'text-white' : 'text-foreground-muted'
                    )}
                  >
                    <span className="relative z-10 flex items-center gap-1.5">
                      {link.label}
                      {link.isNew && (
                        <motion.span
                          className="w-1.5 h-1.5 rounded-full bg-primary"
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [1, 0.5, 1]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      )}
                    </span>
                    {isActive(link.href) && (
                      <motion.div
                        layoutId="navbar-active"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/10 via-info/10 to-primary/10 border border-primary/20"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    {/* Hover Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    />
                    {/* Glow on Hover */}
                    <div className="absolute inset-0 rounded-full bg-primary/0 group-hover:bg-primary/5 blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-5">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/login"
                  className="text-sm font-semibold text-foreground-muted hover:text-white transition-all px-4 py-2 rounded-full hover:bg-white/5"
                >
                  Log In
                </Link>
              </motion.div>

              <MagneticButton mouseX={mouseX} mouseY={mouseY}>
                <Button asChild className="group relative overflow-hidden bg-gradient-to-r from-primary to-info text-background hover:shadow-2xl hover:shadow-primary/50 transition-all border-0 font-bold px-6">
                  <Link href="/signup">
                    <motion.span
                      className="relative z-10 flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                    >
                      Start Building
                      <motion.div
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      >
                        <Sparkles className="w-4 h-4" />
                      </motion.div>
                    </motion.span>
                    {/* Animated Gradient Background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-info to-primary opacity-0 group-hover:opacity-100"
                      animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    {/* Glow Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 blur-xl bg-primary/50 -z-10 transition-opacity duration-300" />
                  </Link>
                </Button>
              </MagneticButton>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-foreground-muted hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-2xl md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Content */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-background/95 backdrop-blur-2xl md:hidden border-l border-white/10 shadow-2xl"
            >
              {/* Ambient Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-info/10 rounded-full blur-3xl" />

              <div className="relative z-10 flex flex-col h-full p-8 pt-24">
                <div className="flex flex-col gap-6 flex-1">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          "text-3xl font-bold hover:text-primary transition-all flex items-center gap-3 group",
                          isActive(link.href) ? 'text-primary' : 'text-white'
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <motion.span
                          whileHover={{ x: 10 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          {link.label}
                        </motion.span>
                        {link.isNew && (
                          <motion.span
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-xs bg-primary px-3 py-1 rounded-full text-background font-medium shadow-lg shadow-primary/50"
                          >
                            New
                          </motion.span>
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col gap-4 pt-6 border-t border-white/10"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full justify-center border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-primary/50 transition-all"
                  >
                    Log In
                  </Button>
                  <Button
                    size="lg"
                    className="w-full justify-center bg-gradient-to-r from-primary to-info text-background font-bold shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/50 transition-all"
                  >
                    Get Started Free
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Magnetic Button Component with cursor tracking
function MagneticButton({
  children,
  mouseX,
  mouseY,
}: {
  children: React.ReactNode;
  mouseX: any;
  mouseY: any;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const springConfig = { damping: 20, stiffness: 300 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  useEffect(() => {
    if (!ref.current) return;

    const handleMouseMove = () => {
      if (!ref.current || !isHovered) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = mouseX.get() - centerX;
      const distanceY = mouseY.get() - centerY;

      // Apply magnetic effect (max 15px movement)
      x.set(Math.max(-15, Math.min(15, distanceX * 0.2)));
      y.set(Math.max(-15, Math.min(15, distanceY * 0.2)));
    };

    const unsubscribeX = mouseX.on('change', handleMouseMove);
    const unsubscribeY = mouseY.on('change', handleMouseMove);

    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [mouseX, mouseY, isHovered, x, y]);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative"
    >
      {children}
    </motion.div>
  );
}
