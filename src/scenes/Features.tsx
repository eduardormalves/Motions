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

const featureCards = [
  {
    icon: '📦',
    title: 'Controle de Estoque',
    desc: 'Atualize e consulte seu estoque direto pelo WhatsApp, em tempo real',
    color: COLORS.primary,
    top: 720,
  },
  {
    icon: '💸',
    title: 'Fluxo de Caixa',
    desc: 'Acompanhe entradas e saídas sem precisar de planilhas ou sistemas',
    color: COLORS.success,
    top: 930,
  },
  {
    icon: '📣',
    title: 'Marketing em Massa',
    desc: 'Envie mensagens para milhares de clientes de uma só vez, sem esforço',
    color: COLORS.warning,
    top: 1140,
  },
];

const TITLE_START  = 30;
const TITLE_SPEED  = 0.95 / 4;
const TITLE_SEGMENTS = [
  { text: 'Temos muito mais ',        color: '#1e293b' },
  { text: 'para o seu negócio.',      color: TEAL },
];

const CARD_START   = 260;
const CARD_STAGGER = 160;

export const Features: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 15, stiffness: 120 }, from: 0, to: 1 });
  const labelY   = interpolate(entrance, [0, 1], [-20, 0]);
  const titleY   = interpolate(entrance, [0, 1], [-16, 0]);

  return (
    <AbsoluteFill style={{ background: '#f0f4f8', overflow: 'hidden' }}>
      <Audio
        src={staticFile('audios/cena-6.m4a')}
        trimBefore={55}     // 0.46s
        trimAfter={1184}    // 9.87s
        volume={1}
      />

      {/* ── Label + Headline — centered near the cards ────────── */}
      <div style={{ position: 'absolute', top: 470, left: 60, right: 60 }}>
        <div style={{
          opacity: entrance,
          transform: `translateY(${labelY}px)`,
          fontFamily: FONTS.display, fontSize: 26, fontWeight: 800,
          color: TEAL, letterSpacing: 4, textTransform: 'uppercase',
          marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 30, height: 3, background: TEAL, borderRadius: 2 }} />
          E MAIS...
        </div>
        <TypewriterText
          segments={TITLE_SEGMENTS}
          startFrame={TITLE_START}
          charsPerFrame={TITLE_SPEED}
          showCursor={true}
          style={{
            fontFamily: FONTS.display, fontSize: 64, fontWeight: 800,
            lineHeight: 1.2, display: 'block',
          }}
        />
      </div>

      {/* ── Feature cards — slide up from bottom, teal glow on entry ── */}
      {featureCards.map((card, i) => {
        const localFrame   = frame - (CARD_START + i * CARD_STAGGER);
        const clampedFrame = Math.max(0, localFrame);

        // Slides up from 400px below its final position
        const ty = spring({
          fps, frame: clampedFrame,
          config: { damping: 14, stiffness: 120, mass: 1.0 },
          from: 400, to: 0,
        });
        const opacity = localFrame <= 0
          ? 0
          : interpolate(localFrame, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

        // Teal ring flashes on card entry then fades — the "creative" touch
        const glowAlpha = localFrame > 0
          ? interpolate(localFrame, [0, 12, 55], [0, 0.9, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
          : 0;

        // Icon pops in after card settles
        const iconScale = spring({
          fps, frame: Math.max(0, clampedFrame - 8),
          config: { damping: 8, stiffness: 280, mass: 0.7 },
          from: 0, to: 1,
        });

        return (
          <div key={i} style={{
            position: 'absolute',
            left: '50%', marginLeft: -450,
            top: card.top, width: 900,
            opacity,
            transform: `translateY(${ty}px)`,
            background: COLORS.card, borderRadius: 20,
            border: `1px solid ${COLORS.border}`,
            borderLeft: `7px solid ${card.color}`,
            padding: '26px 32px',
            display: 'flex', alignItems: 'center', gap: 24,
            boxShadow: `0 0 0 3px rgba(29,219,180,${glowAlpha}), 0 4px 16px rgba(30,58,110,0.10)`,
          }}>
            <span style={{
              fontSize: 44, lineHeight: 1, flexShrink: 0,
              display: 'inline-block',
              transform: `scale(${iconScale})`,
            }}>
              {card.icon}
            </span>
            <div>
              <div style={{ fontFamily: FONTS.inter, fontSize: 34, fontWeight: 700, color: COLORS.text, lineHeight: 1.2, marginBottom: 6 }}>
                {card.title}
              </div>
              <div style={{ fontFamily: FONTS.inter, fontSize: 28, fontWeight: 400, color: COLORS.textMuted, lineHeight: 1.35 }}>
                {card.desc}
              </div>
            </div>
          </div>
        );
      })}

    </AbsoluteFill>
  );
};
