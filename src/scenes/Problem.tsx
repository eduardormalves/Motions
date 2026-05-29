import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS, FONTS } from '../theme';
import { NotifCard } from '../components/NotifCard';
import { TypewriterText } from '../components/TypewriterText';

const notifData = [
  { name: 'Maria Lima',  message: 'Olá, estão abertos hoje?',      time: '08:23', color: COLORS.success, badge: 1 },
  { name: 'João Silva',  message: 'Qual o valor do serviço?',       time: '09:41', color: COLORS.primary, badge: 2 },
  { name: 'Ana Costa',   message: 'Posso agendar amanhã?',          time: '10:15', color: COLORS.purple,  badge: 3 },
  { name: 'Pedro A.',    message: 'Alguém me responde???',           time: '11:02', color: COLORS.warning, badge: 4 },
  { name: 'Lucia Dias',  message: 'Esperando há 2 horas...',        time: '12:30', color: COLORS.danger,  badge: 5 },
  { name: 'Carlos M.',   message: 'Fui buscar outra empresa',        time: '13:55', color: COLORS.danger,  badge: 6 },
  { name: 'Ricardo S.',  message: 'Nunca mais volto aqui.',          time: '15:08', color: COLORS.danger,  badge: 7 },
];

const PILE_TARGETS = [
  { y: 1500, rot: -2 },
  { y: 1380, rot:  4 },
  { y: 1260, rot: -6 },
  { y: 1140, rot:  3 },
  { y: 1020, rot: -5 },
  { y:  900, rot:  7 },
  { y:  780, rot: -4 },
];

// Headline segments with mixed colors per spec
const HEADLINE_SEGMENTS = [
  { text: 'Quantas vendas você perdeu hoje por ', color: '#1e293b' },
  { text: 'demorar pra responder?',               color: '#ef4444' },
];

// Subtitle single segment
const SUBTITLE_SEGMENTS = [
  { text: 'Seu cliente não espera — ele vai para quem responder primeiro.', color: '#64748b' },
];

// Typing config — computed so subtitle never starts before headline ends
const HEADLINE_START = 15;
const HEADLINE_SPEED = 0.95 / 4; // mesma velocidade da Cena 2
const HEADLINE_TOTAL_CHARS = HEADLINE_SEGMENTS.reduce((s, seg) => s + seg.text.length, 0);
const HEADLINE_END = HEADLINE_START + Math.ceil(HEADLINE_TOTAL_CHARS / HEADLINE_SPEED);
const SUBTITLE_START = HEADLINE_END + 12; // 12-frame pause after headline finishes
const SUBTITLE_SPEED = 0.95 / 4; // mesma velocidade da Cena 2

export const Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: '#f0f4f8', overflow: 'hidden' }}>
      {/* Headline + subtitle — safe zone */}
      <div style={{ position: 'absolute', top: 140, left: 60, right: 60 }}>
        {/* TypewriterText headline */}
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

        {/* TypewriterText subtitle — só começa depois do headline terminar */}
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

      {/* Falling notification cards */}
      {notifData.map((notif, i) => {
        const target = PILE_TARGETS[i];
        // Cena de 5.5s (660 frames): stagger de 75 frames para todos os 7 cards caírem a tempo
        const localFrame = frame - (60 + i * 75);
        const clampedFrame = Math.max(0, localFrame);

        const topY = spring({
          fps,
          frame: clampedFrame,
          config: { damping: 14, stiffness: 50, mass: 1.1 },
          from: -400,
          to: target.y,
        });

        const opacity = localFrame <= 0
          ? 0
          : interpolate(localFrame, [0, 8], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });

        return (
          <NotifCard
            key={i}
            name={notif.name}
            message={notif.message}
            time={notif.time}
            borderColor={notif.color}
            badge={notif.badge}
            top={topY}
            rotate={target.rot}
            opacity={opacity}
          />
        );
      })}
    </AbsoluteFill>
  );
};
