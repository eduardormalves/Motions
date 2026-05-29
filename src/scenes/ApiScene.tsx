import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from 'remotion';
import { FONTS } from '../theme';
import { TypewriterText } from '../components/TypewriterText';

const TEAL        = '#1ddbb4';
const SEAL_GREEN  = '#22c55e';

// ── SVG seal geometry ────────────────────────────────────────────────────────
const SVG_SIZE    = 280;
const CX          = 140;
const CY          = 140;
const CR          = 118;
const CIRCLE_CIRC = 2 * Math.PI * CR; // ≈ 741

// Checkmark path — two legs meeting at a knee, proportioned for r=118
// M start L knee L tip
const CHECK_PATH = 'M 58 138 L 110 182 L 222 82';
const CHECK_LEN  = 222; // approx path length (calculated from coords)

// ── Timing ───────────────────────────────────────────────────────────────────
const HEADLINE_START = 15;
const HEADLINE_SPEED = 0.95 / 4;
const HEADLINE_SEGMENTS = [
  { text: 'Seu número está ', color: '#1e293b' },
  { text: '100% seguro', color: TEAL },
  { text: '.', color: '#1e293b' },
];
const SUBTITLE_SEGMENTS = [
  { text: 'Utilizamos a API Oficial do WhatsApp — o serviço que o próprio WhatsApp disponibiliza para empresas.', color: '#64748b' },
];
const HEADLINE_CHARS = HEADLINE_SEGMENTS.reduce((s, seg) => s + seg.text.length, 0);
const HEADLINE_END   = HEADLINE_START + Math.ceil(HEADLINE_CHARS / HEADLINE_SPEED);
const SUBTITLE_START = HEADLINE_END + 10;

const SEAL_START       = 300;  // seal begins drawing
const CIRCLE_DRAW_END  = 200;  // circle finishes at sealLocal=200
const CHECK_DRAW_START = 160;  // checkmark starts at sealLocal=160 (overlap)
const CHECK_DRAW_END   = 310;  // checkmark finishes at sealLocal=310
const LABEL_FADE_START = 290;  // text below seal
const LABEL_FADE_END   = 330;
const PULSE_DELAY      = 60;   // extra frames after checkmark before pulse starts
const PULSE_PERIOD     = 90;

export const ApiScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Label entrance
  const entrance = spring({ frame, fps, config: { damping: 15, stiffness: 120 }, from: 0, to: 1 });
  const labelY   = interpolate(entrance, [0, 1], [-20, 0]);

  const sealLocal = Math.max(0, frame - SEAL_START);

  // Circle stroke-draw animation (stroke-dashoffset from full → 0)
  const circleDash = interpolate(
    sealLocal,
    [0, CIRCLE_DRAW_END],
    [CIRCLE_CIRC, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Checkmark draw animation (overlaps with end of circle)
  const checkDash = interpolate(
    sealLocal,
    [CHECK_DRAW_START, CHECK_DRAW_END],
    [CHECK_LEN, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Seal fades in at first stroke
  const sealOpacity = interpolate(sealLocal, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Text below fades in as checkmark finishes
  const labelOpacity = interpolate(sealLocal, [LABEL_FADE_START, LABEL_FADE_END], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const labelY2 = interpolate(sealLocal, [LABEL_FADE_START, LABEL_FADE_END], [14, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Sonar pulse ring — starts after checkmark, repeats
  const pulseStart    = SEAL_START + CHECK_DRAW_END + PULSE_DELAY;
  const afterPulse    = frame - pulseStart;
  const pulseProgress = afterPulse > 0 ? afterPulse % PULSE_PERIOD : -1;
  const pulseScale    = pulseProgress >= 0 ? interpolate(pulseProgress, [0, PULSE_PERIOD], [1, 1.7])   : 1;
  const pulseOpacity  = pulseProgress >= 0 ? interpolate(pulseProgress, [0, PULSE_PERIOD], [0.55, 0]) : 0;

  return (
    <AbsoluteFill style={{ background: '#f0f4f8', overflow: 'hidden' }}>

      {/* ── Label + Headline + Subtitle ─────────────────────── */}
      <div style={{ position: 'absolute', top: 140, left: 60, right: 60 }}>
        <div style={{
          opacity: entrance,
          transform: `translateY(${labelY}px)`,
          fontFamily: FONTS.display, fontSize: 26, fontWeight: 800,
          color: TEAL, letterSpacing: 4, textTransform: 'uppercase',
          marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 30, height: 3, background: TEAL, borderRadius: 2 }} />
          MAS PODE FICAR TRANQUILO
        </div>

        <TypewriterText
          segments={HEADLINE_SEGMENTS}
          startFrame={HEADLINE_START}
          charsPerFrame={HEADLINE_SPEED}
          showCursor={true}
          style={{ fontFamily: FONTS.display, fontSize: 72, fontWeight: 800, lineHeight: 1.2, display: 'block' }}
        />

        <div style={{ marginTop: 20 }}>
          <TypewriterText
            segments={SUBTITLE_SEGMENTS}
            startFrame={SUBTITLE_START}
            charsPerFrame={HEADLINE_SPEED}
            showCursor={false}
            style={{ fontFamily: FONTS.display, fontSize: 36, fontWeight: 400, display: 'block' }}
          />
        </div>
      </div>

      {/* ── Animated seal ─────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        left: 0, right: 0,
        top: 880,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 32,
      }}>

        {/* Sonar pulse ring (sits behind the SVG) */}
        <div style={{
          position: 'absolute',
          width: SVG_SIZE,
          height: SVG_SIZE,
          borderRadius: '50%',
          border: `5px solid ${SEAL_GREEN}`,
          opacity: pulseOpacity,
          transform: `scale(${pulseScale})`,
          top: 0,
          left: '50%',
          marginLeft: -(SVG_SIZE / 2),
          pointerEvents: 'none',
        }} />

        {/* SVG: circle draws, then checkmark draws */}
        <svg
          width={SVG_SIZE}
          height={SVG_SIZE}
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          style={{ opacity: sealOpacity, overflow: 'visible' }}
        >
          {/* Drop shadow filter */}
          <defs>
            <filter id="seal-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor={SEAL_GREEN} floodOpacity="0.28" />
            </filter>
          </defs>

          {/* Circle — starts from 12 o'clock, draws clockwise */}
          <circle
            cx={CX}
            cy={CY}
            r={CR}
            fill="none"
            stroke={SEAL_GREEN}
            strokeWidth={13}
            strokeLinecap="round"
            strokeDasharray={CIRCLE_CIRC}
            strokeDashoffset={circleDash}
            transform={`rotate(-90 ${CX} ${CY})`}
            filter="url(#seal-shadow)"
          />

          {/* Checkmark — drawn after circle is mostly complete */}
          <path
            d={CHECK_PATH}
            fill="none"
            stroke={SEAL_GREEN}
            strokeWidth={15}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={CHECK_LEN}
            strokeDashoffset={checkDash}
            filter="url(#seal-shadow)"
          />
        </svg>

        {/* Text below seal */}
        <div style={{
          opacity: labelOpacity,
          transform: `translateY(${labelY2}px)`,
          textAlign: 'center',
        }}>
          <div style={{ fontFamily: FONTS.display, fontSize: 38, fontWeight: 800, color: SEAL_GREEN, letterSpacing: 1 }}>
            WhatsApp Business API
          </div>
          <div style={{ fontFamily: FONTS.inter, fontSize: 26, fontWeight: 500, color: '#64748b', marginTop: 10 }}>
            Parceiro Oficial Certificado
          </div>
        </div>

      </div>
    </AbsoluteFill>
  );
};
