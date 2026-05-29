import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS, FONTS } from '../theme';

// ── Canvas dimensions (inner area) ──
const CANVAS_W = 960;
const CANVAS_H = 720;

// ── Node layout positions ──
const NODE_W = 230;

// Node 1: mensagem_inicial (verde)
const N1 = { x: 80,  y: 40,  w: NODE_W };
// Node 2: mensagem_selecionar (âmbar)
const N2 = { x: 60,  y: 220, w: NODE_W };
// Node 3: mensagem_final (vermelho)
const N3 = { x: 80,  y: 460, w: NODE_W };

// Center X of each node for connection points
const cx1 = N1.x + N1.w / 2;
const cx2 = N2.x + N2.w / 2;
const cx3 = N3.x + N3.w / 2;

// Approximate bottom/top Y for bezier (header ~44px, body ~70px)
const NODE_HEADER_H = 44;
const NODE_BODY_H   = 90;
const NODE_H = NODE_HEADER_H + NODE_BODY_H;

// Exit point (bottom center of node)
const by1 = N1.y + NODE_H;
// Entry point (top center of node 2)
const ey2 = N2.y;
// Exit point (bottom center of node 2)
const by2 = N2.y + NODE_H + 20; // +20 for pills
// Entry point (top center of node 3)
const ey3 = N3.y;

// Bezier path strings
const PATH1 = `M ${cx1},${by1} C ${cx1},${(by1 + ey2) / 2} ${cx2},${(by1 + ey2) / 2} ${cx2},${ey2}`;
const PATH2 = `M ${cx2},${by2} C ${cx2},${(by2 + ey3) / 2} ${cx3},${(by2 + ey3) / 2} ${cx3},${ey3}`;

// Approximate path lengths for dasharray animation
const PATH1_LEN = 180;
const PATH2_LEN = 200;

// ── Node component ──
interface NodeProps {
  x: number;
  y: number;
  headerColor: string;
  title: string;
  children: React.ReactNode;
  hasEntry?: boolean;
  hasExit?: boolean;
  scale?: number;
  opacity?: number;
}

const FlowNode: React.FC<NodeProps> = ({
  x, y, headerColor, title, children,
  hasEntry = false, hasExit = false,
  scale = 1, opacity = 1,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: NODE_W,
      background: '#ffffff',
      borderRadius: 12,
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 16px rgba(30,58,110,0.10)',
      opacity,
      transform: `scale(${scale})`,
      transformOrigin: 'top center',
    }}
  >
    {/* Entry dot */}
    {hasEntry && (
      <div
        style={{
          position: 'absolute',
          top: -6,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: '#ffffff',
          border: `2px solid ${headerColor}`,
        }}
      />
    )}

    {/* Header */}
    <div
      style={{
        padding: '10px 13px',
        borderRadius: '11px 11px 0 0',
        background: headerColor,
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 700,
        fontFamily: FONTS.inter,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {title}
      </span>
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.2)',
        }}
      />
    </div>

    {/* Body */}
    <div
      style={{
        padding: '10px 13px',
        fontSize: 22,
        color: '#64748b',
        lineHeight: 1.5,
        borderTop: '1px solid #e2e8f0',
        fontFamily: FONTS.inter,
        fontStyle: 'italic',
      }}
    >
      {children}
    </div>

    {/* Exit dot */}
    {hasExit && (
      <div
        style={{
          position: 'absolute',
          bottom: -6,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: '#ffffff',
          border: `2px solid ${headerColor}`,
        }}
      />
    )}
  </div>
);

export const FlowEditor: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Canvas entrance ──
  const canvasScale = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 160 },
    from: 0.94,
    to: 1,
  });
  const canvasOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Node 1 (frame 15–30) ──
  const n1Local = Math.max(0, frame - 15);
  const n1Scale = spring({ frame: n1Local, fps, config: { damping: 16, stiffness: 180 }, from: 0, to: 1 });
  const n1Opacity = interpolate(n1Local, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // ── Connector 1 draw (frame 30–50) ──
  const conn1Local = Math.max(0, frame - 30);
  const conn1Progress = interpolate(conn1Local, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const conn1Offset = PATH1_LEN * (1 - conn1Progress);

  // ── Node 2 (frame 50–65) ──
  const n2Local = Math.max(0, frame - 50);
  const n2Scale = spring({ frame: n2Local, fps, config: { damping: 16, stiffness: 180 }, from: 0, to: 1 });
  const n2Opacity = interpolate(n2Local, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // ── Pills stagger (6 frames each, starting at frame 58) ──
  const pill1Opacity = interpolate(Math.max(0, frame - 58), [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const pill2Opacity = interpolate(Math.max(0, frame - 64), [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const pill3Opacity = interpolate(Math.max(0, frame - 70), [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // ── Connector 2 draw (frame 65–85) ──
  const conn2Local = Math.max(0, frame - 65);
  const conn2Progress = interpolate(conn2Local, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const conn2Offset = PATH2_LEN * (1 - conn2Progress);

  // ── Node 3 (frame 85–100) ──
  const n3Local = Math.max(0, frame - 85);
  const n3Scale = spring({ frame: n3Local, fps, config: { damping: 16, stiffness: 180 }, from: 0, to: 1 });
  const n3Opacity = interpolate(n3Local, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // ── Cursor animation (frame 100–130): moves along path N2→N3 ──
  const cursorLocal = Math.max(0, frame - 100);
  const cursorProgress = interpolate(cursorLocal, [0, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // Interpolate x,y along the bezier approximation
  const cursorX = interpolate(cursorProgress, [0, 1], [cx2, cx3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cursorY = interpolate(cursorProgress, [0, 0.5, 1], [by2, (by2 + ey3) / 2, ey3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cursorOpacity = frame >= 100
    ? interpolate(frame, [100, 105, 125, 132], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  // ── Badge (frame 120+) ──
  const badgeLocal = Math.max(0, frame - 120);
  const badgeScale = spring({ frame: badgeLocal, fps, config: { damping: 16, stiffness: 160 }, from: 0, to: 1 });
  const badgeOpacity = interpolate(badgeLocal, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const pillStyle = (opacity: number): React.CSSProperties => ({
    display: 'inline-block',
    border: '1px solid #d97706',
    color: '#d97706',
    borderRadius: 6,
    padding: '2px 8px',
    fontSize: 20,
    fontStyle: 'normal',
    marginRight: 4,
    marginTop: 4,
    opacity,
  });

  return (
    <AbsoluteFill style={{ background: '#ffffff', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          top: 140,
          left: 60,
          right: 60,
          bottom: 80,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
        }}
      >
        {/* Section label */}
        <div
          style={{
            fontFamily: FONTS.inter,
            fontSize: 26,
            fontWeight: 700,
            color: 'rgba(30,58,110,0.45)',
            letterSpacing: 4,
            textTransform: 'uppercase',
            flexShrink: 0,
            opacity: canvasOpacity,
          }}
        >
          EDITOR DE FLUXO VISUAL
        </div>

        {/* Headline */}
        <div
          style={{
            textAlign: 'center',
            flexShrink: 0,
            opacity: canvasOpacity,
          }}
        >
          <div style={{ fontFamily: FONTS.syne, fontSize: 52, fontWeight: 800, color: COLORS.text, lineHeight: 1.15 }}>
            Configure tudo arrastando e soltando
          </div>
          <div style={{ fontFamily: FONTS.inter, fontSize: 32, fontWeight: 400, color: COLORS.textMuted, marginTop: 8 }}>
            Sem código. Sem complicação.
          </div>
        </div>

        {/* Canvas */}
        <div
          style={{
            position: 'relative',
            width: CANVAS_W,
            height: CANVAS_H,
            background: '#f8fafc',
            backgroundImage: 'radial-gradient(circle, #cbd5e1 1.5px, transparent 1.5px)',
            backgroundSize: '24px 24px',
            borderRadius: 20,
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            opacity: canvasOpacity,
            transform: `scale(${canvasScale})`,
            transformOrigin: 'top center',
            flexShrink: 0,
          }}
        >
          {/* SVG connectors — behind nodes */}
          <svg
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
            width={CANVAS_W}
            height={CANVAS_H}
            viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
          >
            <defs>
              <marker id="arrow-green" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                <path d="M0,0 L0,8 L8,4 Z" fill="#16a34a" />
              </marker>
              <marker id="arrow-amber" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                <path d="M0,0 L0,8 L8,4 Z" fill="#d97706" />
              </marker>
            </defs>

            {/* Connector 1: node1 → node2 */}
            <path
              d={PATH1}
              stroke="#16a34a"
              strokeWidth={2}
              fill="none"
              strokeDasharray={PATH1_LEN}
              strokeDashoffset={conn1Offset}
              markerEnd="url(#arrow-green)"
            />

            {/* Connector 2: node2 → node3 */}
            <path
              d={PATH2}
              stroke="#d97706"
              strokeWidth={2}
              fill="none"
              strokeDasharray={PATH2_LEN}
              strokeDashoffset={conn2Offset}
              markerEnd="url(#arrow-amber)"
            />

            {/* Animated cursor circle */}
            {frame >= 100 && (
              <circle
                cx={cursorX}
                cy={cursorY}
                r={7}
                fill="#2563eb"
                opacity={cursorOpacity}
              />
            )}
          </svg>

          {/* Node 1 — Mensagem Inicial */}
          {frame >= 15 && (
            <FlowNode
              x={N1.x} y={N1.y}
              headerColor="#16a34a"
              title="Mensagem Inicial"
              hasExit={true}
              scale={n1Scale}
              opacity={n1Opacity}
            >
              Olá! Como posso ajudar você hoje?
            </FlowNode>
          )}

          {/* Node 2 — Selecionar Opção */}
          {frame >= 50 && (
            <FlowNode
              x={N2.x} y={N2.y}
              headerColor="#d97706"
              title="Selecionar Opção"
              hasEntry={true}
              hasExit={true}
              scale={n2Scale}
              opacity={n2Opacity}
            >
              <div style={{ fontStyle: 'normal' }}>Escolha uma opção:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 6 }}>
                <span style={pillStyle(pill1Opacity)}>1. Agendamento</span>
                <span style={pillStyle(pill2Opacity)}>2. Pedido</span>
                <span style={pillStyle(pill3Opacity)}>3. Atendente</span>
              </div>
            </FlowNode>
          )}

          {/* Node 3 — Mensagem Final */}
          {frame >= 85 && (
            <FlowNode
              x={N3.x} y={N3.y}
              headerColor="#ef4444"
              title="Mensagem Final"
              hasEntry={true}
              scale={n3Scale}
              opacity={n3Opacity}
            >
              Perfeito! Vou te ajudar com isso agora.
            </FlowNode>
          )}
        </div>

        {/* Badge */}
        {frame >= 120 && (
          <div
            style={{
              opacity: badgeOpacity,
              transform: `scale(${badgeScale})`,
              background: 'rgba(37,99,235,0.08)',
              border: '1px solid rgba(37,99,235,0.2)',
              borderRadius: 100,
              padding: '12px 28px',
              fontFamily: FONTS.inter,
              fontSize: 26,
              fontWeight: 400,
              color: COLORS.primary,
              textAlign: 'center',
              flexShrink: 0,
            }}
          >
            Configure uma vez. O bot trabalha para sempre.
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
