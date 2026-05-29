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

export const OrderDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // BUG 5 fix — cyclic interpolate
  const dotY = (dotIndex: number) =>
    interpolate(
      (frame + dotIndex * 8) % 24,
      [0, 12, 24],
      [0, -10, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  const dotOffsets: [number, number, number] = [dotY(0), dotY(1), dotY(2)];

  const menuItems = [
    { emoji: '🍕', name: 'Pizza Margherita', price: 'R$ 32,00', selected: frame >= 100 },
    { emoji: '🍔', name: 'X-Burguer Especial', price: 'R$ 28,00' },
    { emoji: '🥗', name: 'Salada Caesar', price: 'R$ 24,00' },
  ];

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
          PEDIDOS ONLINE
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
            {frame >= 10 && (
              <ChatBubble type="USR" text="Oi! Quero fazer um pedido" {...makeBubbleAnim(frame, fps, 10)} />
            )}
            {frame >= 30 && frame < 55 && (
              <ChatBubble type="TYPING" scale={1} opacity={1} dotOffsets={dotOffsets} />
            )}
            {frame >= 55 && (
              <ChatBubble type="BOT" text="Claro! Veja nosso cardápio:" {...makeBubbleAnim(frame, fps, 55)} />
            )}
            {frame >= 70 && (
              <ChatBubble
                type="MENU"
                menuItems={menuItems}
                {...makeBubbleAnim(frame, fps, 70)}
              />
            )}
            {frame >= 100 && (
              <ChatBubble type="USR" text="Pizza Margherita" {...makeBubbleAnim(frame, fps, 100)} />
            )}
            {frame >= 115 && frame < 138 && (
              <ChatBubble type="TYPING" scale={1} opacity={1} dotOffsets={dotOffsets} />
            )}
            {frame >= 138 && (
              <ChatBubble
                type="BOT"
                text="Ótima escolha! Endereço de entrega?"
                {...makeBubbleAnim(frame, fps, 138)}
              />
            )}
            {frame >= 158 && (
              <ChatBubble type="USR" text="Rua das Flores, 123" {...makeBubbleAnim(frame, fps, 158)} />
            )}
            {frame >= 172 && frame < 192 && (
              <ChatBubble type="TYPING" scale={1} opacity={1} dotOffsets={dotOffsets} />
            )}
            {frame >= 192 && (
              <ChatBubble
                type="SYS"
                text="✅ Pedido confirmado! Pizza Margherita — R$ 32,00. Entrega em ~35 min."
                {...makeBubbleAnim(frame, fps, 192)}
              />
            )}
            {frame >= 200 && (
              <ChatBubble
                type="BADGE"
                text="✓ Pedido registrado automaticamente"
                {...makeBubbleAnim(frame, fps, 200)}
              />
            )}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
