import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS, FONTS } from '../theme';

// ── Helpers ──────────────────────────────────────────────

const makeBubbleAnim = (frame: number, fps: number, startFrame: number) => {
  const local = Math.max(0, frame - startFrame);
  const scale = spring({
    frame: local, fps,
    config: { damping: 16, stiffness: 180 },
    from: 0.88, to: 1,
  });
  const opacity = interpolate(local, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  return { scale, opacity };
};

// ── Bubble components ─────────────────────────────────────

const BotBubble: React.FC<{ text: string; scale: number; opacity: number }> = ({ text, scale, opacity }) => (
  <div style={{ display: 'flex', justifyContent: 'flex-end', transform: `scale(${scale})`, opacity, transformOrigin: 'right bottom' }}>
    <div style={{
      maxWidth: '72%',
      background: '#2563eb',
      borderRadius: '16px 16px 4px 16px',
      padding: '14px 18px',
      fontSize: 28,
      fontFamily: FONTS.inter,
      fontWeight: 400,
      color: '#ffffff',
      lineHeight: 1.5,
    }}>
      {text}
    </div>
  </div>
);

const ClientBubble: React.FC<{ text: string; scale: number; opacity: number }> = ({ text, scale, opacity }) => (
  <div style={{ display: 'flex', justifyContent: 'flex-start', transform: `scale(${scale})`, opacity, transformOrigin: 'left bottom' }}>
    <div style={{
      maxWidth: '72%',
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px 16px 16px 4px',
      padding: '14px 18px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      fontSize: 28,
      fontFamily: FONTS.inter,
      fontWeight: 400,
      color: '#1e293b',
      lineHeight: 1.5,
    }}>
      {text}
    </div>
  </div>
);

const SystemBubble: React.FC<{ text: string; scale: number; opacity: number }> = ({ text, scale, opacity }) => (
  <div style={{ display: 'flex', justifyContent: 'center', transform: `scale(${scale})`, opacity }}>
    <div style={{
      alignSelf: 'center',
      textAlign: 'center',
      background: 'rgba(37,99,235,0.06)',
      border: '1px solid rgba(37,99,235,0.15)',
      borderRadius: 8,
      padding: '8px 20px',
      fontSize: 24,
      fontFamily: FONTS.inter,
      fontWeight: 400,
      color: '#64748b',
    }}>
      {text}
    </div>
  </div>
);

const AgentBubble: React.FC<{ text: string; scale: number; opacity: number }> = ({ text, scale, opacity }) => (
  <div style={{ display: 'flex', justifyContent: 'flex-end', transform: `scale(${scale})`, opacity, transformOrigin: 'right bottom' }}>
    <div style={{
      maxWidth: '72%',
      background: '#1e3a6e',
      borderRadius: '16px 16px 4px 16px',
      padding: '14px 18px',
      fontSize: 28,
      fontFamily: FONTS.inter,
      fontWeight: 400,
      color: '#ffffff',
      lineHeight: 1.5,
    }}>
      <div style={{ fontWeight: 700, fontSize: 22, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>Você</div>
      {text}
    </div>
  </div>
);

// ── Main scene ────────────────────────────────────────────

export const HumanHandoff: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Notification banner (frame 95): slides down then up
  const notifLocal = Math.max(0, frame - 95);
  const notifInProgress = spring({ frame: notifLocal, fps, config: { damping: 18, stiffness: 150 }, from: 0, to: 1 });
  const notifY = interpolate(notifInProgress, [0, 1], [-100, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  // Auto-hide after 35 frames (frame 95+35=130)
  const notifOutLocal = Math.max(0, frame - 130);
  const notifOutProgress = spring({ frame: notifOutLocal, fps, config: { damping: 18, stiffness: 150 }, from: 0, to: 1 });
  const notifYFinal = frame >= 130
    ? interpolate(notifOutProgress, [0, 1], [0, -120], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : notifY;
  const notifOpacity = interpolate(notifLocal, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Section label fade
  const labelOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: '#ffffff', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          top: 140,
          left: 60,
          right: 60,
          bottom: 60,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {/* Section label */}
        <div style={{
          opacity: labelOpacity,
          fontFamily: FONTS.inter,
          fontSize: 26,
          fontWeight: 700,
          color: 'rgba(30,58,110,0.45)',
          letterSpacing: 4,
          textTransform: 'uppercase',
          flexShrink: 0,
        }}>
          ATENDIMENTO HUMANO
        </div>

        {/* Chat mock container */}
        <div style={{
          flex: 1,
          background: '#ffffff',
          borderRadius: 20,
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 16px rgba(30,58,110,0.10)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
        }}>

          {/* ── Notification banner ── */}
          {frame >= 95 && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 50,
              display: 'flex',
              justifyContent: 'center',
              padding: '12px 20px',
              opacity: notifOpacity,
              transform: `translateY(${notifYFinal}px)`,
            }}>
              <div style={{
                background: '#1e3a6e',
                borderRadius: 14,
                padding: '18px 24px',
                width: 800,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}>
                {/* Bell icon using unicode */}
                <span style={{ fontSize: 24, color: '#86efac', flexShrink: 0 }}>🔔</span>
                <span style={{
                  fontFamily: FONTS.inter,
                  fontSize: 26,
                  fontWeight: 600,
                  color: '#ffffff',
                  flex: 1,
                }}>
                  Maria Lima aguarda sua resposta
                </span>
              </div>
            </div>
          )}

          {/* ── Conversation header ── */}
          <div style={{
            height: 80,
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexShrink: 0,
          }}>
            {/* Avatar */}
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563eb, #1e3a6e)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONTS.syne,
              fontWeight: 700,
              fontSize: 18,
              color: '#ffffff',
              flexShrink: 0,
            }}>
              ML
            </div>

            {/* Contact info */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <span style={{ fontFamily: FONTS.inter, fontWeight: 700, fontSize: 28, color: '#1e293b' }}>
                Maria Lima
              </span>
              <span style={{ fontFamily: FONTS.inter, fontWeight: 400, fontSize: 22, color: '#64748b' }}>
                +55 41 99999-0000
              </span>
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <div style={{
                background: 'rgba(37,99,235,0.1)',
                border: '1px solid rgba(37,99,235,0.3)',
                borderRadius: 8,
                padding: '6px 14px',
                fontSize: 22,
                fontFamily: FONTS.inter,
                fontWeight: 600,
                color: '#2563eb',
              }}>
                🤖 Bot
              </div>
              <div style={{
                background: 'rgba(22,163,74,0.1)',
                border: '1px solid rgba(22,163,74,0.3)',
                borderRadius: 8,
                padding: '6px 14px',
                fontSize: 22,
                fontFamily: FONTS.inter,
                fontWeight: 600,
                color: '#15803d',
              }}>
                ● Ativo
              </div>
            </div>
          </div>

          {/* ── Messages area ── */}
          <div style={{
            flex: 1,
            background: '#f8fafc',
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            overflow: 'hidden',
          }}>
            {/* frame 0: BOT "Olá! Como posso ajudar você hoje?" */}
            {frame >= 0 && (
              <BotBubble text="Olá! Como posso ajudar você hoje?" {...makeBubbleAnim(frame, fps, 0)} />
            )}

            {/* frame 20: CLIENTE */}
            {frame >= 20 && (
              <ClientBubble text="Oi! Preciso de uma ajuda" {...makeBubbleAnim(frame, fps, 20)} />
            )}

            {/* frame 40: BOT */}
            {frame >= 40 && (
              <BotBubble text="Claro! Para qual assunto posso te ajudar?" {...makeBubbleAnim(frame, fps, 40)} />
            )}

            {/* frame 60: CLIENTE */}
            {frame >= 60 && (
              <ClientBubble text="Quero falar com um atendente humano" {...makeBubbleAnim(frame, fps, 60)} />
            )}

            {/* frame 80: SISTEMA */}
            {frame >= 80 && (
              <SystemBubble text="── Bot pausado · Aguardando atendente ──" {...makeBubbleAnim(frame, fps, 80)} />
            )}

            {/* frame 115: SISTEMA "João assumiu" */}
            {frame >= 115 && (
              <SystemBubble text="João assumiu esta conversa" {...makeBubbleAnim(frame, fps, 115)} />
            )}

            {/* frame 135: AGENTE */}
            {frame >= 135 && (
              <AgentBubble text="Olá Maria! Sou o João, posso te ajudar agora?" {...makeBubbleAnim(frame, fps, 135)} />
            )}

            {/* frame 160: CLIENTE */}
            {frame >= 160 && (
              <ClientBubble text="Ótimo! Estava com dúvida sobre meu pedido" {...makeBubbleAnim(frame, fps, 160)} />
            )}

            {/* frame 178: AGENTE */}
            {frame >= 178 && (
              <AgentBubble text="Claro! Me conta o que aconteceu que vou resolver." {...makeBubbleAnim(frame, fps, 178)} />
            )}
          </div>

          {/* ── Input bar ── */}
          <div style={{
            height: 88,
            background: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexShrink: 0,
          }}>
            <div style={{
              flex: 1,
              height: 52,
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              borderRadius: 26,
              padding: '0 20px',
              display: 'flex',
              alignItems: 'center',
              fontSize: 26,
              fontFamily: FONTS.inter,
              fontWeight: 400,
              color: '#94a3b8',
            }}>
              Digite sua mensagem...
            </div>
            {/* Send button */}
            <div style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              color: '#ffffff',
              flexShrink: 0,
            }}>
              ➤
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
