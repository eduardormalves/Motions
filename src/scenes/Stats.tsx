import React from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS, FONTS } from '../theme';
import { TypewriterText } from '../components/TypewriterText';

const TEAL = '#1ddbb4';

const STAT_SEGMENTS = [
  { text: '80% dos clientes ',         color: '#1e293b' },
  { text: 'desistem de comprar',        color: '#ef4444' },
  { text: ' se a resposta no WhatsApp demorar mais de 5 minutos.', color: '#1e293b' },
];

const STAT_START = 100;
const STAT_SPEED = 0.95 / 4;
const SOURCE_START = STAT_START + 300;

export const Stats: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const topEntrance = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 120 },
    from: 0,
    to: 1,
  });
  const labelOpacity    = topEntrance;
  const labelTranslateY = interpolate(topEntrance, [0, 1], [-20, 0]);

  const statScale = spring({
    frame: Math.max(0, frame - 40),
    fps,
    config: { damping: 14, stiffness: 130 },
    from: 0.8,
    to: 1,
  });
  const statOpacity = interpolate(frame, [40, 88], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Audio
        src={staticFile('audios/cena-1-2-3.m4a')}
        trimBefore={808}   // 6.73s
        trimAfter={1882}   // 15.68s
        volume={1}
      />
      <AbsoluteFill style={{ background: '#f0f4f8' }} />

      <div
        style={{
          position: 'absolute',
          top: 140,
          left: 60,
          right: 60,
          bottom: 80,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 0,
        }}
      >
        {/* Label */}
        <div
          style={{
            opacity: labelOpacity,
            transform: `translateY(${labelTranslateY}px)`,
            fontFamily: FONTS.display,
            fontSize: 26,
            fontWeight: 800,
            color: TEAL,
            letterSpacing: 4,
            textTransform: 'uppercase',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{ width: 30, height: 3, background: TEAL }} />
          DADO DO MERCADO
        </div>

        {/* 80% */}
        <div
          style={{
            opacity: statOpacity,
            transform: `scale(${statScale})`,
            fontFamily: FONTS.display,
            fontSize: 180,
            fontWeight: 900,
            lineHeight: 1,
            marginBottom: 20,
            display: 'flex',
            alignItems: 'baseline',
          }}
        >
          <span style={{ color: COLORS.accentDark }}>80</span>
          <span style={{ color: TEAL }}>%</span>
        </div>

        {/* Linha teal */}
        <div
          style={{
            width: 80,
            height: 4,
            background: TEAL,
            marginBottom: 35,
            opacity: statOpacity,
          }}
        />

        {/* Descrição (typewriter) */}
        <div style={{ minHeight: 160 }}>
          <TypewriterText
            segments={STAT_SEGMENTS}
            startFrame={STAT_START}
            charsPerFrame={STAT_SPEED}
            showCursor={true}
            style={{
              fontFamily: FONTS.display,
              fontSize: 42,
              fontWeight: 700,
              color: COLORS.text,
              lineHeight: 1.3,
              display: 'block',
            }}
          />
        </div>

        <div
          style={{
            opacity: interpolate(frame, [SOURCE_START, SOURCE_START + 24], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            marginTop: 18,
            fontFamily: FONTS.inter,
            fontSize: 22,
            fontWeight: 400,
            color: COLORS.textMuted,
            lineHeight: 1.3,
          }}
        >
          Fonte: Lead Response Management Study (MIT / InsideSales)
        </div>
      </div>
    </AbsoluteFill>
  );
};
