import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS, FONTS } from '../theme';

const TEAL     = '#1ddbb4';
const WA_GREEN = '#25D366';

// ── SVG Icons ────────────────────────────────────────────────────────────────
const InstagramIcon: React.FC = () => (
  <svg width="68" height="68" viewBox="0 0 24 24" fill="none">
    <defs>
      <radialGradient id="ig-bg" cx="30%" cy="108%" r="148%">
        <stop offset="0%"   stopColor="#FED373" />
        <stop offset="18%"  stopColor="#F15245" />
        <stop offset="44%"  stopColor="#D92E7F" />
        <stop offset="72%"  stopColor="#9B36B7" />
        <stop offset="100%" stopColor="#515ECF" />
      </radialGradient>
    </defs>
    <rect width="24" height="24" rx="5.5" fill="url(#ig-bg)" />
    <circle cx="12" cy="12" r="4.6" fill="none" stroke="white" strokeWidth="1.65" />
    <circle cx="17.5" cy="6.5" r="1.3" fill="white" />
    <rect x="1.6" y="1.6" width="20.8" height="20.8" rx="4.2" fill="none"
      stroke="rgba(255,255,255,0.28)" strokeWidth="1.3" />
  </svg>
);

const WhatsAppIcon: React.FC = () => (
  <svg width="68" height="68" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="16" fill={WA_GREEN} />
    <path
      d="M22.9 9.1A9.7 9.7 0 0016 6C10.48 6 6 10.48 6 16a9.95 9.95 0 001.36 4.97L6 26l5.17-1.35A9.96 9.96 0 0016 26c5.52 0 10-4.48 10-10a9.7 9.7 0 00-3.1-6.9zM16 24.4a8.32 8.32 0 01-4.24-1.16l-.3-.18-3.13.82.84-3.06-.2-.31A8.32 8.32 0 017.6 16c0-4.63 3.77-8.4 8.4-8.4 2.25 0 4.36.87 5.95 2.46A8.32 8.32 0 0124.4 16c0 4.63-3.77 8.4-8.4 8.4zm4.6-6.28c-.25-.12-1.48-.73-1.71-.82-.23-.08-.4-.12-.57.13-.17.25-.65.82-.79.98-.14.17-.29.19-.54.06-.25-.12-1.06-.39-2.02-1.25-.74-.67-1.25-1.5-1.4-1.75-.15-.26-.02-.4.11-.52.11-.12.25-.3.38-.44.12-.15.17-.25.25-.42.08-.17.04-.32-.02-.44-.07-.13-.57-1.37-.78-1.87-.2-.5-.42-.43-.57-.44H13c-.17 0-.44.06-.67.32-.23.25-.88.86-.88 2.1s.9 2.44 1.03 2.61c.12.17 1.76 2.69 4.28 3.77.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.48-.6 1.69-1.19.21-.59.21-1.1.14-1.2-.06-.1-.23-.17-.48-.3z"
      fill="white"
    />
  </svg>
);

const WebIcon: React.FC = () => (
  <svg width="68" height="68" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" stroke={TEAL} strokeWidth="1.8" />
    <ellipse cx="12" cy="12" rx="4.5" ry="11" stroke={TEAL} strokeWidth="1.8" />
    <line x1="1" y1="12" x2="23" y2="12" stroke={TEAL} strokeWidth="1.8" strokeLinecap="round" />
    <line x1="2.5" y1="7" x2="21.5" y2="7" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="2.5" y1="17" x2="21.5" y2="17" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// ── Contact data ─────────────────────────────────────────────────────────────
const contacts = [
  { Icon: WebIcon,       label: 'Acesse nosso site',   value: 'avoautomação.com.br', color: TEAL,      frame: 220 },
  { Icon: InstagramIcon, label: 'Mande um direct',     value: '@avoautomacao',        color: '#D92E7F', frame: 380 },
  { Icon: WhatsAppIcon,  label: 'Fale pelo WhatsApp',  value: '(43) 9 8459-3139',     color: WA_GREEN,  frame: 540 },
];

export const ContactScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Header entrance
  const entrance = spring({ frame, fps, config: { damping: 15, stiffness: 120 }, from: 0, to: 1 });
  const headY    = interpolate(entrance, [0, 1], [-24, 0]);

  // Animated teal divider line
  const dividerLocal = Math.max(0, frame - 80);
  const dividerW = interpolate(
    spring({ frame: dividerLocal, fps, config: { damping: 20, stiffness: 180 }, from: 0, to: 1 }),
    [0, 1], [0, 960],
  );

  // Footer tagline
  const footerOpacity = interpolate(
    Math.max(0, frame - 680),
    [0, 40], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <AbsoluteFill style={{ background: '#f0f4f8', overflow: 'hidden' }}>

      {/* ── Label + Headline ──────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 310, left: 60, right: 60,
        opacity: entrance,
        transform: `translateY(${headY}px)`,
      }}>
        <div style={{
          fontFamily: FONTS.display, fontSize: 26, fontWeight: 800,
          color: TEAL, letterSpacing: 4, textTransform: 'uppercase',
          marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 30, height: 3, background: TEAL, borderRadius: 2 }} />
          COMECE AGORA
        </div>

        <div style={{
          fontFamily: FONTS.display, fontSize: 74, fontWeight: 900,
          color: COLORS.text, lineHeight: 1.1, letterSpacing: -2, marginBottom: 18,
        }}>
          Pronto para{' '}
          <span style={{ color: TEAL }}>automatizar?</span>
        </div>

        <div style={{
          fontFamily: FONTS.inter, fontSize: 34, fontWeight: 400,
          color: COLORS.textMuted, lineHeight: 1.4,
        }}>
          Estamos disponíveis para te ajudar a começar hoje.
        </div>
      </div>

      {/* ── Teal divider line ─────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 720, left: 60,
        height: 3, width: dividerW,
        background: `linear-gradient(90deg, ${TEAL}, #2563eb, transparent)`,
        borderRadius: 2,
      }} />

      {/* ── Contact cards ─────────────────────────────────────── */}
      {contacts.map((c, i) => {
        const local    = Math.max(0, frame - c.frame);
        const progress = spring({ frame: local, fps, config: { damping: 14, stiffness: 120 }, from: 0, to: 1 });
        const opacity  = interpolate(local, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const tx       = interpolate(progress, [0, 1], [-80, 0]);

        return (
          <div key={i} style={{
            position: 'absolute',
            left: 60, right: 60,
            top: 758 + i * 210,
            opacity,
            transform: `translateX(${tx}px)`,
            background: COLORS.card,
            borderRadius: 20,
            border: `1px solid ${COLORS.border}`,
            borderLeft: `7px solid ${c.color}`,
            padding: '30px 36px',
            display: 'flex',
            alignItems: 'center',
            gap: 28,
            boxShadow: '0 4px 16px rgba(30,58,110,0.10)',
          }}>
            <div style={{ flexShrink: 0 }}>
              <c.Icon />
            </div>
            <div>
              <div style={{
                fontFamily: FONTS.inter, fontSize: 22, fontWeight: 700,
                color: c.color, marginBottom: 8,
                letterSpacing: 1, textTransform: 'uppercase',
              }}>
                {c.label}
              </div>
              <div style={{
                fontFamily: FONTS.display, fontSize: 40, fontWeight: 800,
                color: COLORS.text, lineHeight: 1,
              }}>
                {c.value}
              </div>
            </div>
          </div>
        );
      })}

      {/* ── Footer tagline ────────────────────────────────────── */}
      <div style={{
        position: 'absolute', bottom: 110, left: 0, right: 0,
        textAlign: 'center', opacity: footerOpacity,
      }}>
        <span style={{
          fontFamily: FONTS.display, fontSize: 28, fontWeight: 600,
          color: COLORS.textMuted, letterSpacing: 2,
        }}>
          Automatize hoje. Cresça amanhã.
        </span>
      </div>

    </AbsoluteFill>
  );
};
