import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { FONTS } from '../theme';
import { TypewriterText } from '../components/TypewriterText';

const TEAL = '#1ddbb4';
const BLUE = '#3b82f6';
const NW   = 310;   // node width
const HH   = 44;    // header height
const CW   = 960;
const CH   = 1050;

// ── Node positions (canvas-relative) ─────────────────────────────────────────
const MNI = { x: 40,  y: 30  };
const SEL = { x: 40,  y: 230 };
const MSG = { x: 540, y: 110 };
const PED = { x: 540, y: 340 };
const AGD = { x: 540, y: 575 };
const ATD = { x: 290, y: 800 };

// ── Selecionar: simplified — header + 4 output rows with blue dots ────────────
const S_OUT = 40;  // each output row height
// SEL total height = HH + 4 * S_OUT = 44 + 160 = 204

// ── Connection endpoints ──────────────────────────────────────────────────────
const MNI_BOT = { x: MNI.x + NW / 2, y: MNI.y + HH + 80 };   // bottom-center of MNI
const SEL_TOP = { x: SEL.x + NW / 2, y: SEL.y };               // top-center of SEL
const SRX     = SEL.x + NW;                                     // 350 — right edge of SEL
// SOY[i] = center y of each output row inside SEL
const SOY     = [0, 1, 2, 3].map(i => SEL.y + HH + i * S_OUT + S_OUT / 2);
// ≈ [294, 334, 374, 414]

// Target input points (left edge of right-side nodes, approximate vertical center)
const MSG_IN  = { x: MSG.x, y: MSG.y + 65 };   // (540, 175)
const PED_IN  = { x: PED.x, y: PED.y + 65 };   // (540, 405)
const AGD_IN  = { x: AGD.x, y: AGD.y + 65 };   // (540, 640)
const ATD_TOP = { x: ATD.x + NW / 2, y: ATD.y }; // (445, 800)

// ── SVG bezier paths ──────────────────────────────────────────────────────────
const bz = (ox: number, oy: number, tx: number, ty: number): string => {
  const mx = (ox + tx) / 2;
  return `M ${ox},${oy} C ${mx},${oy} ${mx},${ty} ${tx},${ty}`;
};

const PATHS: string[] = [
  // P0: MNI bottom → SEL top (short vertical S-curve)
  `M ${MNI_BOT.x},${MNI_BOT.y} C ${MNI_BOT.x},${(MNI_BOT.y + SEL_TOP.y) / 2} ${SEL_TOP.x},${(MNI_BOT.y + SEL_TOP.y) / 2} ${SEL_TOP.x},${SEL_TOP.y}`,
  // P1: SEL opt1 → MSG left (curve up-right)
  bz(SRX, SOY[0], MSG_IN.x, MSG_IN.y),
  // P2: SEL opt2 → PED left
  bz(SRX, SOY[1], PED_IN.x, PED_IN.y),
  // P3: SEL opt3 → AGD left (curve down-right)
  bz(SRX, SOY[2], AGD_IN.x, AGD_IN.y),
  // P4: SEL opt4 → ATD top (long curve down)
  `M ${SRX},${SOY[3]} C ${ATD_TOP.x},${SOY[3]} ${ATD_TOP.x},${ATD_TOP.y - 80} ${ATD_TOP.x},${ATD_TOP.y}`,
];

const PLENS   = [90, 240, 215, 360, 400];
const C_START = [660, 770, 880, 990, 1100];
const C_DUR   = 90;

// ── TypewriterText headline ───────────────────────────────────────────────────
const HL_START = 15;
const HL_SPEED = 0.95 / 4;
const HL_SEGS  = [
  { text: 'Configure tudo ', color: '#1e293b' as const },
  { text: 'sem saber programar.', color: TEAL },
];

// ── Node appearance frames ────────────────────────────────────────────────────
const T_MNI    = 200;
const T_SEL    = 360;
const T_OTHERS = 520;

// ── Spring-enter helper ───────────────────────────────────────────────────────
const nodeEnter = (frame: number, fps: number, start: number) => {
  const f = Math.max(0, frame - start);
  return {
    scale:   spring({ frame: f, fps, config: { damping: 16, stiffness: 220 }, from: 0, to: 1 }),
    opacity: interpolate(f, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
  };
};

// ── Reusable node card shell ──────────────────────────────────────────────────
interface ShellProps {
  x: number; y: number;
  hdrColor: string; icon: string; title: string;
  inputDot?: boolean; outputDot?: boolean;
  scale: number; opacity: number;
  children: React.ReactNode;
}

const NodeShell: React.FC<ShellProps> = ({
  x, y, hdrColor, icon, title, inputDot, outputDot, scale, opacity, children,
}) => (
  <div style={{
    position: 'absolute', left: x, top: y, width: NW,
    background: '#ffffff', borderRadius: 12,
    border: '1.5px solid #e2e8f0',
    boxShadow: '0 3px 14px rgba(30,58,110,0.10)',
    opacity, transform: `scale(${scale})`, transformOrigin: 'top center',
  }}>
    {inputDot && (
      <div style={{
        position: 'absolute', top: -7, left: '50%', transform: 'translateX(-50%)', zIndex: 2,
        width: 14, height: 14, borderRadius: '50%',
        background: '#fff', border: `2.5px solid ${hdrColor}`,
      }} />
    )}
    <div style={{
      height: HH, padding: '0 14px', borderRadius: '11px 11px 0 0',
      background: hdrColor, color: '#fff',
      fontFamily: FONTS.inter, fontSize: 21, fontWeight: 700,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6,
    }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 14 }}>{icon}</span>{title}
      </span>
      <span style={{
        width: 18, height: 18, borderRadius: '50%',
        background: 'rgba(255,255,255,0.28)', flexShrink: 0, display: 'inline-block',
      }} />
    </div>
    {children}
    {outputDot && (
      <div style={{
        position: 'absolute', bottom: -7, left: '50%', transform: 'translateX(-50%)', zIndex: 2,
        width: 14, height: 14, borderRadius: '50%',
        background: '#fff', border: `2.5px solid ${BLUE}`,
      }} />
    )}
  </div>
);

const TextBody: React.FC<{ text: string }> = ({ text }) => (
  <div style={{
    borderTop: '1px solid #e2e8f0', padding: '12px 14px',
    fontFamily: FONTS.inter, fontSize: 20, color: '#374151', lineHeight: 1.4,
  }}>
    <span style={{ fontWeight: 700 }}>Texto:</span> {text}
  </div>
);

// ── Main export ───────────────────────────────────────────────────────────────
export const NoCodeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Label entrance
  const entrance = spring({ frame, fps, config: { damping: 15, stiffness: 120 }, from: 0, to: 1 });
  const labelY   = interpolate(entrance, [0, 1], [-20, 0]);

  // Canvas entrance (starts appearing slightly after label)
  const cvF  = Math.max(0, frame - 20);
  const cvSc = spring({ frame: cvF, fps, config: { damping: 16, stiffness: 160 }, from: 0.94, to: 1 });
  const cvOp = interpolate(cvF, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Node enters
  const mni    = nodeEnter(frame, fps, T_MNI);
  const sel    = nodeEnter(frame, fps, T_SEL);
  const others = nodeEnter(frame, fps, T_OTHERS);

  // Connection dash offsets — opacity=0 until the connection starts drawing (fixes arrow-at-start bug)
  const connVals = PLENS.map((len, i) => {
    const prog = interpolate(frame, [C_START[i], C_START[i] + C_DUR], [0, 1], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
    return {
      dashoffset: len * (1 - prog),
      visible: frame >= C_START[i],
    };
  });

  const selItems = ['Informações', 'Fazer um pedido', 'Fazer um agendamento', 'Falar com atendente'];

  return (
    <AbsoluteFill style={{ background: '#f0f4f8', overflow: 'hidden' }}>

      {/* ── Headline ─────────────────────────────────────────── */}
      <div style={{ position: 'absolute', top: 140, left: 60, right: 60 }}>
        <div style={{
          opacity: entrance, transform: `translateY(${labelY}px)`,
          fontFamily: FONTS.display, fontSize: 26, fontWeight: 800,
          color: TEAL, letterSpacing: 4, textTransform: 'uppercase',
          marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 30, height: 3, background: TEAL, borderRadius: 2 }} />
          ZERO CÓDIGO
        </div>

        {/* TypewriterText — same pattern as other scenes in this video */}
        <TypewriterText
          segments={HL_SEGS}
          startFrame={HL_START}
          charsPerFrame={HL_SPEED}
          showCursor={false}
          style={{
            fontFamily: FONTS.display, fontSize: 62, fontWeight: 800,
            lineHeight: 1.2, display: 'block',
          }}
        />
      </div>

      {/* ── Canvas ───────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', left: 60, top: 420,
        width: CW, height: CH,
        background: '#f1f5f9',
        backgroundImage: 'radial-gradient(circle, #cbd5e1 1.5px, transparent 1.5px)',
        backgroundSize: '26px 26px',
        borderRadius: 20, border: '1px solid #e2e8f0',
        overflow: 'hidden',
        opacity: cvOp, transform: `scale(${cvSc})`, transformOrigin: 'top center',
      }}>

        {/* SVG connections — only visible once each connection starts drawing */}
        <svg
          style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}
          width={CW} height={CH}
          viewBox={`0 0 ${CW} ${CH}`}
        >
          <defs>
            <marker id="nc-arr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
              <path d="M 0,0 L 0,7 L 7,3.5 Z" fill={BLUE} />
            </marker>
          </defs>
          {PATHS.map((d, i) => (
            <path
              key={i}
              d={d}
              stroke={BLUE}
              strokeWidth={2.5}
              fill="none"
              strokeDasharray={PLENS[i]}
              strokeDashoffset={connVals[i].dashoffset}
              strokeLinecap="round"
              markerEnd="url(#nc-arr)"
              opacity={connVals[i].visible ? 1 : 0}
            />
          ))}
        </svg>

        {/* ── Mensagem Inicial ─────────────────────────────── */}
        {frame >= T_MNI && (
          <NodeShell
            x={MNI.x} y={MNI.y}
            hdrColor="#22c55e" icon="●" title="Mensagem Inicial"
            outputDot
            scale={mni.scale} opacity={mni.opacity}
          >
            <TextBody text="Olá! Seja muito bem vindo a AVO Automação!" />
          </NodeShell>
        )}

        {/* ── Selecionar — only output rows with blue dots ─── */}
        {frame >= T_SEL && (
          <div style={{
            position: 'absolute', left: SEL.x, top: SEL.y, width: NW,
            background: '#fff', borderRadius: 12,
            border: '1.5px solid #e2e8f0',
            boxShadow: '0 3px 14px rgba(30,58,110,0.10)',
            opacity: sel.opacity, transform: `scale(${sel.scale})`, transformOrigin: 'top center',
            overflow: 'hidden',
          }}>
            {/* input dot — receives connection from Mensagem Inicial */}
            <div style={{
              position: 'absolute', top: -7, left: '50%', transform: 'translateX(-50%)', zIndex: 2,
              width: 14, height: 14, borderRadius: '50%',
              background: '#fff', border: '2.5px solid #f97316',
            }} />
            {/* header */}
            <div style={{
              height: HH, padding: '0 14px', borderRadius: '11px 11px 0 0',
              background: '#f97316', color: '#fff',
              fontFamily: FONTS.inter, fontSize: 21, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14 }}>▤</span> Selecionar
              </span>
              <span style={{
                width: 18, height: 18, borderRadius: '50%',
                background: 'rgba(255,255,255,0.28)', flexShrink: 0, display: 'inline-block',
              }} />
            </div>
            {/* output rows — each row has a blue dot on the right for the outgoing connections */}
            {selItems.map((item, i) => (
              <div key={i} style={{
                borderTop: '1px solid #f3f4f6',
                height: S_OUT, padding: '0 14px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                fontFamily: FONTS.inter, fontSize: 19, color: '#374151',
              }}>
                <span>{i + 1}. {item}</span>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: BLUE, flexShrink: 0 }} />
              </div>
            ))}
          </div>
        )}

        {/* ── Mensagem ─────────────────────────────────────── */}
        {frame >= T_OTHERS && (
          <NodeShell
            x={MSG.x} y={MSG.y}
            hdrColor="#3b82f6" icon="💬" title="Mensagem"
            inputDot
            scale={others.scale} opacity={others.opacity}
          >
            <TextBody text="Nosso horário de funcionamento é:" />
          </NodeShell>
        )}

        {/* ── Pedido — without Cancelar/Voltar ─────────────── */}
        {frame >= T_OTHERS && (
          <NodeShell
            x={PED.x} y={PED.y}
            hdrColor="#d97706" icon="🛒" title="Pedido"
            inputDot
            scale={others.scale} opacity={others.opacity}
          >
            <div style={{
              borderTop: '1px solid #e2e8f0', padding: '12px 14px',
              fontFamily: FONTS.inter, fontSize: 19, color: '#9ca3af', fontStyle: 'italic',
            }}>
              Todos os produtos
            </div>
          </NodeShell>
        )}

        {/* ── Agendamento — without Cancelar/Voltar ────────── */}
        {frame >= T_OTHERS && (
          <NodeShell
            x={AGD.x} y={AGD.y}
            hdrColor="#7c3aed" icon="📅" title="Agendamento"
            inputDot
            scale={others.scale} opacity={others.opacity}
          >
            <div style={{
              borderTop: '1px solid #e2e8f0', padding: '12px 14px',
              fontFamily: FONTS.inter, fontSize: 19, color: '#9ca3af', fontStyle: 'italic',
            }}>
              Clique para configurar grupos...
            </div>
          </NodeShell>
        )}

        {/* ── Atender ──────────────────────────────────────── */}
        {frame >= T_OTHERS && (
          <NodeShell
            x={ATD.x} y={ATD.y}
            hdrColor="#06b6d4" icon="👤" title="Atender"
            inputDot
            scale={others.scale} opacity={others.opacity}
          >
            <TextBody text="Aguarde! Assim que possível um atendente entrará em contato." />
          </NodeShell>
        )}

      </div>
    </AbsoluteFill>
  );
};
