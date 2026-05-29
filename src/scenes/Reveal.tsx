import React from 'react';
import {
  AbsoluteFill,
  Img,
  staticFile,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS, FONTS } from '../theme';
import { KineticText } from '../components/KineticText';

export const Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const logoScale = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 14, stiffness: 120 },
    from: 0,
    to: 1,
  });
  const lineWidth = interpolate(Math.max(0, frame - 30), [0, 20], [0, 140], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const badgeOpacity = interpolate(Math.max(0, frame - 72), [0, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const badgeScale = spring({
    frame: Math.max(0, frame - 72),
    fps,
    config: { damping: 16, stiffness: 140 },
    from: 0.8,
    to: 1,
  });

  return (
    <AbsoluteFill style={{ background: '#f0f4f8', overflow: 'hidden' }}>
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
          gap: 36,
        }}
      >
        {/* Small label */}
        <div
          style={{
            opacity: labelOpacity,
            fontFamily: FONTS.inter,
            fontSize: 36,
            fontWeight: 400,
            color: COLORS.textMuted,
          }}
        >
          A solução para o seu WhatsApp
        </div>

        {/* Logo */}
        <div style={{ transform: `scale(${logoScale})` }}>
          <Img src={staticFile('imagens/logo-reta-full.png')} style={{ height: 120 }} />
        </div>

        {/* Decorative line */}
        <div style={{ width: lineWidth, height: 6, background: COLORS.primary, borderRadius: 3 }} />

        {/* Kinetic description — word by word */}
        <KineticText
          text="Automatize o atendimento e nunca mais perca um cliente"
          wordDelay={4}
          startFrame={15}
          style={{
            fontFamily: FONTS.inter,
            fontSize: 36,
            fontWeight: 400,
            color: COLORS.textMuted,
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        />

        {/* Badge */}
        <div
          style={{
            opacity: badgeOpacity,
            transform: `scale(${badgeScale})`,
            background: 'rgba(37,99,235,0.08)',
            border: '2px solid rgba(37,99,235,0.22)',
            borderRadius: 100,
            padding: '20px 44px',
            fontFamily: FONTS.inter,
            fontSize: 28,
            fontWeight: 600,
            color: COLORS.primary,
          }}
        >
          Integração Oficial Meta API
        </div>
      </div>
    </AbsoluteFill>
  );
};
