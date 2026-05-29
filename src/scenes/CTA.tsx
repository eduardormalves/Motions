import React from 'react';
import {
  AbsoluteFill,
  Img,
  staticFile,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  random,
} from 'remotion';
import { COLORS, FONTS } from '../theme';
import { TypewriterText } from '../components/TypewriterText';

// ── 14 particles with deterministic positions ──
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  x:       random(`p-x-${i}`) * 960 + 60,
  y:       random(`p-y-${i}`) * 1600 + 160,
  size:    random(`p-s-${i}`) * 10 + 6,       // 6–16px
  opacity: random(`p-o-${i}`) * 0.25 + 0.15,  // 0.15–0.40
  phase:   random(`ph-${i}`) * 60,             // float phase offset
}));

// ── Tagline segments ──
const TAGLINE_SEGMENTS = [
  { text: 'Automatize seu WhatsApp e nunca mais perca um cliente', color: '#1e293b' },
];

export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Logo: spring scale, frame 15 (damping: 12, stiffness: 80) ──
  const logoScale = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 12, stiffness: 80 },
    from: 0,
    to: 1,
  });

  // ── Blue line: width 0→160px, frame 40–60 ──
  const lineWidth = interpolate(Math.max(0, frame - 40), [0, 20], [0, 160], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── CTA button: spring scale + translateY, frame 80–110 ──
  const btnScale = spring({
    frame: Math.max(0, frame - 80),
    fps,
    config: { damping: 16, stiffness: 150 },
    from: 0.9,
    to: 1,
  });
  const btnTranslateY = interpolate(
    spring({ frame: Math.max(0, frame - 80), fps, config: { damping: 16, stiffness: 150 }, from: 0, to: 1 }),
    [0, 1], [30, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const btnOpacity = interpolate(Math.max(0, frame - 80), [0, 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Pulse ring: loop every 60 frames, starting at frame 100 ──
  const ring = frame >= 100 ? (frame - 100) % 60 : 0;
  const ringSize = frame >= 100
    ? interpolate(ring, [0, 30, 60], [0, 24, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;
  const ringAlpha = frame >= 100
    ? interpolate(ring, [0, 15, 60], [0, 0.35, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;
  const pulseBoxShadow = `0 0 0 ${ringSize}px rgba(37,99,235,${ringAlpha})`;

  // ── URL fadeIn: frame 115–140 ──
  const urlOpacity = interpolate(Math.max(0, frame - 115), [0, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: '#f0f4f8', overflow: 'hidden' }}>

      {/* ── Particles ── */}
      {PARTICLES.map((p, i) => {
        // Entrance: spring scale 0→1, frames 0–20 staggered
        const entranceLocal = Math.max(0, frame - i);
        const entranceScale = spring({
          frame: entranceLocal,
          fps,
          config: { damping: 16, stiffness: 200 },
          from: 0,
          to: 1,
        });

        // Float loop: starting at frame 130
        const floatY = frame >= 130
          ? Math.sin((frame + p.phase) / 22) * 14
          : 0;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: p.x,
              top: p.y + floatY,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: '#2563eb',
              opacity: p.opacity * entranceScale,
              transform: `scale(${entranceScale})`,
            }}
          />
        );
      })}

      {/* ── Content column ── */}
      <div
        style={{
          position: 'absolute',
          top: 140,
          left: 60,
          right: 60,
          bottom: 80,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 44,
        }}
      >
        {/* Logo */}
        <div style={{ transform: `scale(${logoScale})` }}>
          <Img
            src={staticFile('imagens/logo-reta-full.png')}
            style={{ height: 100 }}
          />
        </div>

        {/* Decorative blue line */}
        <div
          style={{
            width: lineWidth,
            height: 5,
            background: COLORS.primary,
            borderRadius: 3,
          }}
        />

        {/* TypewriterText tagline */}
        <TypewriterText
          segments={TAGLINE_SEGMENTS}
          startFrame={55}
          charsPerFrame={0.7}
          showCursor={false}
          style={{
            fontFamily: FONTS.inter,
            fontSize: 40,
            fontWeight: 600,
            lineHeight: 1.3,
            textAlign: 'center',
            display: 'block',
          }}
        />

        {/* CTA Button with pulse ring */}
        <div
          style={{
            opacity: btnOpacity,
            transform: `scale(${btnScale}) translateY(${btnTranslateY}px)`,
            background: COLORS.primary,
            color: '#ffffff',
            borderRadius: 100,
            padding: '40px 88px',
            fontFamily: FONTS.inter,
            fontSize: 44,
            fontWeight: 700,
            letterSpacing: 0.5,
            textAlign: 'center',
            boxShadow: pulseBoxShadow,
            cursor: 'default',
          }}
        >
          Comece grátis por 30 dias
        </div>

        {/* URL */}
        <div
          style={{
            opacity: urlOpacity,
            fontFamily: FONTS.inter,
            fontSize: 32,
            fontWeight: 400,
            color: COLORS.textFaint,
          }}
        >
          avoautomacao.com.br
        </div>
      </div>
    </AbsoluteFill>
  );
};
