"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AnimatedLogo, NavbarLogo, HeroLogo, LoadingLogo, FooterLogo, AvatarLogo } from "@/components/ui/animated-logo";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function LogoDemoPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-black text-white flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-primary" />
          StepTen Logo Animations
        </h1>
        <p className="text-foreground-muted text-lg">
          All available animation styles for the StepTen logo
        </p>
      </motion.div>

      {/* Animation Variants */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* None */}
        <Card className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">None (Static)</CardTitle>
            <CardDescription>No animation, static display</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8">
            <AnimatedLogo width={120} height={120} animation="none" />
          </CardContent>
        </Card>

        {/* Pulse */}
        <Card className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">Pulse</CardTitle>
            <CardDescription>Gentle breathing effect</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8">
            <AnimatedLogo width={120} height={120} animation="pulse" />
          </CardContent>
        </Card>

        {/* Glow */}
        <Card className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">Glow</CardTitle>
            <CardDescription>Pulsing neon glow effect</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8 bg-black/20">
            <AnimatedLogo width={120} height={120} animation="glow" />
          </CardContent>
        </Card>

        {/* Float */}
        <Card className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">Float</CardTitle>
            <CardDescription>Floating with subtle rotation</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8" style={{ minHeight: "200px" }}>
            <AnimatedLogo width={120} height={120} animation="float" />
          </CardContent>
        </Card>

        {/* Rotate */}
        <Card className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">Rotate</CardTitle>
            <CardDescription>Continuous rotation</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8">
            <AnimatedLogo width={120} height={120} animation="rotate" />
          </CardContent>
        </Card>

        {/* Scale on Hover */}
        <Card className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">Scale on Hover</CardTitle>
            <CardDescription>Hover to see effect</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8">
            <AnimatedLogo width={120} height={120} animation="scale-on-hover" />
          </CardContent>
        </Card>

        {/* Neon Pulse */}
        <Card className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">Neon Pulse</CardTitle>
            <CardDescription>Intense neon glow pulsing</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8 bg-black/20">
            <AnimatedLogo width={120} height={120} animation="neon-pulse" />
          </CardContent>
        </Card>

        {/* 3D Rotate */}
        <Card className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">3D Rotate</CardTitle>
            <CardDescription>3D rotation on Y-axis</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8">
            <AnimatedLogo width={120} height={120} animation="3d-rotate" />
          </CardContent>
        </Card>
      </div>

      {/* Pre-configured Variants */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Pre-configured Variants</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Navbar Logo */}
          <Card className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">Navbar Logo</CardTitle>
              <CardDescription>Small, hover-responsive for navigation</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-start py-8 gap-4">
              <div className="px-4 py-2 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-lg border border-white/10">
                <NavbarLogo />
              </div>
              <span className="text-sm text-foreground-muted">← Hover over logo</span>
            </CardContent>
          </Card>

          {/* Hero Logo */}
          <Card className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">Hero Logo</CardTitle>
              <CardDescription>Large, floating for hero sections</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-8" style={{ minHeight: "250px" }}>
              <HeroLogo />
            </CardContent>
          </Card>

          {/* Loading Logo */}
          <Card className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">Loading Logo</CardTitle>
              <CardDescription>Medium, neon pulse for loading states</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-8 bg-black/20">
              <LoadingLogo />
            </CardContent>
          </Card>

          {/* Footer Logo */}
          <Card className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">Footer Logo</CardTitle>
              <CardDescription>Medium, glowing for footer sections</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-8 bg-black/20">
              <FooterLogo />
            </CardContent>
          </Card>

          {/* Avatar Logo */}
          <Card className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">Avatar Logo (Gravatar)</CardTitle>
              <CardDescription>Small, rounded for author avatars</CardDescription>
            </CardHeader>
            <CardContent className="py-8">
              <div className="flex items-center gap-3">
                <AvatarLogo size={40} />
                <div>
                  <p className="text-sm font-bold text-white">Stephen Ten</p>
                  <p className="text-xs text-foreground-muted">Founder & CEO</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Code Examples */}
      <Card className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-primary/30">
        <CardHeader>
          <CardTitle className="text-white">Usage Examples</CardTitle>
          <CardDescription>Copy-paste these examples into your components</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-black/40 p-4 rounded-lg border border-white/10 font-mono text-sm">
            <p className="text-success mb-2">// Import the component</p>
            <p className="text-white">import {"{"} AnimatedLogo, NavbarLogo {"}"} from "@/components/ui/animated-logo";</p>
          </div>

          <div className="bg-black/40 p-4 rounded-lg border border-white/10 font-mono text-sm">
            <p className="text-success mb-2">// Use in navbar</p>
            <p className="text-white">&lt;NavbarLogo onClick={"{"}() =&gt; router.push('/'){"}"}  /&gt;</p>
          </div>

          <div className="bg-black/40 p-4 rounded-lg border border-white/10 font-mono text-sm">
            <p className="text-success mb-2">// Custom animation</p>
            <p className="text-white">&lt;AnimatedLogo width={"{"}150{"}"} height={"{"}150{"}"} animation="glow" /&gt;</p>
          </div>

          <div className="bg-black/40 p-4 rounded-lg border border-white/10 font-mono text-sm">
            <p className="text-success mb-2">// As author avatar</p>
            <p className="text-white">&lt;AvatarLogo size={"{"}50{"}"} /&gt;</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
