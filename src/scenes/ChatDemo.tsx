import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS, FONTS } from '../theme';
import { ChatBubble } from '../components/ChatBubble';

const makeBubbleAnim = (frame: number, fps: number, startFrame: number) => {
  const localFrame = Math.max(0, frame - startFrame);
  const scale = spring({ frame: localFrame, fps, config: { damping: 16, stiffness: 180 }, from: 0.85, to: 1 });
  const opacity = interpolate(localFrame, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return { scale, opacity };
};

const PhoneHeader: React.FC = () => (
  <div
    style={{
      background: COLORS.navy,
      padding: '24px 28px',
      borderRadius: '32px 32px 0 0',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
    }}
  >
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #2563eb, #1e3a6e)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONTS.syne,
        fontWeight: 800,
        fontSize: 24,
        color: '#fff',
        flexShrink: 0,
      }}
    >
      A
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <span style={{ fontFamily: FONTS.inter, fontSize: 28, fontWeight: 600, color: '#fff' }}>
        Assistente AVO
      </span>
      <span style={{ fontFamily: FONTS.inter, fontSize: 22, color: '#86efac' }}>
        ● responde em segundos
      </span>
    </div>
  </div>
);

export const ChatDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // BUG 5 fix — cyclic interpolate, no Math.random
  const dotY = (dotIndex: number) =>
    interpolate(
      (frame + dotIndex * 8) % 24,
      [0, 12, 24],
      [0, -10, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  const dotOffsets: [number, number, number] = [dotY(0), dotY(1), dotY(2)];

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
          overflow: 'hidden',
        }}
      >
        {/* Label */}
        <div
          style={{
            opacity: labelOpacity,
            fontFamily: FONTS.inter,
            fontSize: 26,
            fontWeight: 700,
            color: 'rgba(30,58,110,0.45)',
            letterSpacing: 4,
            textTransform: 'uppercase',
            marginBottom: 24,
            flexShrink: 0,
          }}
        >
          AGENDAMENTO AUTOMÁTICO
        </div>

        {/* Phone mockup */}
        <div
          style={{
            flex: 1,
            width: 560,
            alignSelf: 'center',
            background: COLORS.card,
            borderRadius: 32,
            border: `1px solid ${COLORS.border}`,
            boxShadow: '0 8px 40px rgba(30,58,110,0.12)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <PhoneHeader />

          {/* Chat area */}
          <div
            style={{
              background: '#f8fafc',
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              flex: 1,
            }}
          >
            {frame >= 15 && (
              <ChatBubble type="USR" text="Oi! Quero agendar uma consulta" {...makeBubbleAnim(frame, fps, 15)} />
            )}
            {frame >= 35 && frame < 60 && (
              <ChatBubble type="TYPING" scale={1} opacity={1} dotOffsets={dotOffsets} />
            )}
            {frame >= 60 && (
              <ChatBubble type="BOT" text="Olá! Para qual serviço?" {...makeBubbleAnim(frame, fps, 60)} />
            )}
            {frame >= 80 && (
              <ChatBubble
                type="OPTS"
                options={[
                  { label: 'Corte' },
                  { label: 'Barba' },
                  { label: 'Corte + Barba', selected: frame >= 105 },
                ]}
                {...makeBubbleAnim(frame, fps, 80)}
              />
            )}
            {frame >= 105 && (
              <ChatBubble type="USR" text="Corte + Barba" {...makeBubbleAnim(frame, fps, 105)} />
            )}
            {frame >= 120 && frame < 145 && (
              <ChatBubble type="TYPING" scale={1} opacity={1} dotOffsets={dotOffsets} />
            )}
            {frame >= 145 && (
              <ChatBubble type="BOT" text="Escolha o horário:" {...makeBubbleAnim(frame, fps, 145)} />
            )}
            {frame >= 160 && (
              <ChatBubble
                type="OPTS"
                options={[
                  { label: '09:00' },
                  { label: '11:00' },
                  { label: '14:00', selected: frame >= 185 },
                  { label: '16:00' },
                ]}
                {...makeBubbleAnim(frame, fps, 160)}
              />
            )}
            {frame >= 185 && (
              <ChatBubble type="USR" text="14:00" {...makeBubbleAnim(frame, fps, 185)} />
            )}
            {frame >= 200 && frame < 220 && (
              <ChatBubble type="TYPING" scale={1} opacity={1} dotOffsets={dotOffsets} />
            )}
            {frame >= 220 && (
              <ChatBubble
                type="SYS"
                text="✅ Agendado! Corte + Barba hoje às 14h. Lembrete 1h antes."
                {...makeBubbleAnim(frame, fps, 220)}
              />
            )}
            {frame >= 228 && (
              <ChatBubble
                type="BADGE"
                text="⚡ Respondido em 2 segundos"
                {...makeBubbleAnim(frame, fps, 228)}
              />
            )}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
