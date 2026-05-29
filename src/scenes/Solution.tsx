import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS, FONTS } from '../theme';
import { TypewriterText } from '../components/TypewriterText';

// ── Dados dos cards de solução ───────────────────────────────────────────────
const solutionCards = [
  {
    icon: '⚡',
    title: 'Respostas em até 5 segundos',
    desc: 'Disponível 24h por dia, 7 dias por semana, sem exceção',
    color: COLORS.success,
    targetY: 650,
  },
  {
    icon: '💬',
    title: 'Com as suas próprias mensagens',
    desc: 'Você configura o tom — a AVO mantém a sua voz',
    color: COLORS.primary,
    targetY: 870,  // +220 do card 0 (era +180) — espaçamento extra entre 1° e 2°
  },
  {
    icon: '🤝',
    title: 'Relacionamento próximo em escala',
    desc: 'Cada cliente se sente atendido de forma pessoal',
    color: COLORS.purple,
    targetY: 1050, // +180 do card 1
  },
  {
    icon: '📈',
    title: 'Completamente automático',
    desc: 'Configure uma vez — a AVO cuida do resto',
    color: COLORS.warning,
    targetY: 1230, // +180 do card 2
  },
];

// ── Textos ───────────────────────────────────────────────────────────────────
const HEADLINE_SEGMENTS = [
  { text: 'Seus clientes ',               color: '#1e293b' },
  { text: 'respondidos automaticamente',  color: '#1ddbb4' },
  { text: '.',                            color: '#1e293b' },
];

const SUBTITLE_SEGMENTS = [
  {
    text: '24 horas por dia, com as suas próprias mensagens configuradas.',
    color: '#64748b',
  },
];

// ── Timing ───────────────────────────────────────────────────────────────────
const HEADLINE_START  = 15;
const HEADLINE_SPEED  = 0.95 / 4; // mesma velocidade da Cena 2
const HEADLINE_CHARS  = HEADLINE_SEGMENTS.reduce((s, seg) => s + seg.text.length, 0);
const HEADLINE_END    = HEADLINE_START + Math.ceil(HEADLINE_CHARS / HEADLINE_SPEED);
const SUBTITLE_START  = HEADLINE_END + 10;
const SUBTITLE_SPEED  = 0.95 / 4; // mesma velocidade da Cena 2

// Cards aparecem a partir do frame 80, 1 por segundo (120 frames)
const CARD_STAGGER_START = 80;
const CARD_STAGGER       = 120;

export const Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Label "A SOLUÇÃO" — entrada com spring igual às outras cenas
  const topEntrance     = spring({ frame, fps, config: { damping: 15, stiffness: 120 }, from: 0, to: 1 });
  const labelOpacity    = topEntrance;
  const labelTranslateY = interpolate(topEntrance, [0, 1], [-20, 0]);

  return (
    <AbsoluteFill style={{ background: '#f0f4f8', overflow: 'hidden' }}>

      {/* ── Texto no topo ──────────────────────────────────────────────────── */}
      <div style={{ position: 'absolute', top: 140, left: 60, right: 60 }}>

        {/* Label — idêntico ao "DADO DO MERCADO" da Cena 2 */}
        <div
          style={{
            opacity: labelOpacity,
            transform: `translateY(${labelTranslateY}px)`,
            fontFamily: FONTS.display,
            fontSize: 26,
            fontWeight: 800,
            color: '#1ddbb4',
            letterSpacing: 4,
            textTransform: 'uppercase',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{ width: 30, height: 3, background: '#1ddbb4', borderRadius: 2 }} />
          A SOLUÇÃO
        </div>

        {/* Headline TypewriterText — mesmo estilo da Cena 1 */}
        <TypewriterText
          segments={HEADLINE_SEGMENTS}
          startFrame={HEADLINE_START}
          charsPerFrame={HEADLINE_SPEED}
          showCursor={true}
          style={{
            fontFamily: FONTS.display,
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.2,
            display: 'block',
          }}
        />

        {/* Subtítulo */}
        <div style={{ marginTop: 20 }}>
          <TypewriterText
            segments={SUBTITLE_SEGMENTS}
            startFrame={SUBTITLE_START}
            charsPerFrame={SUBTITLE_SPEED}
            showCursor={false}
            style={{
              fontFamily: FONTS.display,
              fontSize: 36,
              fontWeight: 400,
              display: 'block',
            }}
          />
        </div>
      </div>

      {/* ── Cards de solução — caem do topo igual aos cards da Cena 1 ───────── */}
      {solutionCards.map((card, i) => {
        const localFrame  = frame - (CARD_STAGGER_START + i * CARD_STAGGER);
        const clampedFrame = Math.max(0, localFrame);

        const topY = spring({
          fps,
          frame: clampedFrame,
          config: { damping: 14, stiffness: 50, mass: 1.1 },
          from: -400,
          to: card.targetY,
        });

        const opacity = localFrame <= 0
          ? 0
          : interpolate(localFrame, [0, 8], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              marginLeft: -450,
              top: topY,
              width: 900,
              opacity,
              background: COLORS.card,
              borderRadius: 20,
              border: `1px solid ${COLORS.border}`,
              borderLeft: `7px solid ${card.color}`,
              padding: '26px 32px',
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              boxShadow: '0 4px 16px rgba(30,58,110,0.10)',
            }}
          >
            <span style={{ fontSize: 44, lineHeight: 1, flexShrink: 0 }}>{card.icon}</span>
            <div>
              <div
                style={{
                  fontFamily: FONTS.inter,
                  fontSize: 34,
                  fontWeight: 700,
                  color: COLORS.text,
                  lineHeight: 1.2,
                  marginBottom: 6,
                }}
              >
                {card.title}
              </div>
              <div
                style={{
                  fontFamily: FONTS.inter,
                  fontSize: 28,
                  fontWeight: 400,
                  color: COLORS.textMuted,
                  lineHeight: 1.35,
                }}
              >
                {card.desc}
              </div>
            </div>
          </div>
        );
      })}

    </AbsoluteFill>
  );
};
