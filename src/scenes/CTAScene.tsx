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
import { FONTS } from '../theme';

const TEAL = '#1ddbb4';
const DARK = '#1e293b';
const BLUE = '#2563eb';
const MUTED = '#64748b';
const BG = '#f0f4f8';
const Y_OFFSET = 130;

const EXIT_START = 760;
const EXIT_STAGGER = 4;
const EXIT_DUR = 8;

type WordDef = {
  text: string;
  x: number;
  y: number;
  size: number;
  color: string;
  weight: number;
  frame: number;
  vertical?: boolean;
  zIndex?: number;
  glow?: boolean;
};

const words: WordDef[] = [
  { text: 'TRABALHO', x: 20, y: 420, size: 104, color: MUTED, weight: 400, frame: 70, glow: true },
  { text: 'COMPETENCIA', x: 118, y: 588, size: 132, color: DARK, weight: 900, frame: 94, glow: true },
  { text: 'EXPERIENCIA', x: 116, y: 660, size: 96, color: MUTED, weight: 300, frame: 118, glow: true },
  { text: 'PRO', x: 98, y: 1130, size: 122, color: TEAL, weight: 600, frame: 142, glow: true },
  { text: 'QUALIDADE', x: 330, y: 1142, size: 98, color: TEAL, weight: 700, frame: 166, glow: true },
  { text: 'RESULTADO', x: 680, y: 640, size: 46, color: DARK, weight: 800, frame: 190, glow: true },
  { text: 'CONTROLE', x: 0, y: 642, size: 42, color: DARK, weight: 500, frame: 210 },
  { text: 'AUTONOMIA', x: 470, y: 338, size: 60, color: BLUE, weight: 500, frame: 230, glow: true },
  { text: 'RESPONSABILIDADE', x: 66, y: 292, size: 44, color: TEAL, weight: 500, frame: 246, glow: true },
  { text: 'ADAPTACAO', x: 642, y: 246, size: 44, color: BLUE, weight: 500, frame: 262 },
  { text: 'EXPERIENCIA', x: 316, y: 220, size: 34, color: DARK, weight: 400, frame: 278 },
  { text: 'SERVICOS', x: 768, y: 304, size: 36, color: DARK, weight: 600, frame: 294 },
  { text: 'DISPONIBILIDADE', x: 780, y: 370, size: 38, color: DARK, weight: 600, frame: 310, glow: true },
  { text: 'RIGOR', x: 522, y: 492, size: 44, color: MUTED, weight: 500, frame: 326 },
  { text: 'ESTRATEGIA', x: 548, y: 552, size: 30, color: BLUE, weight: 500, frame: 342 },
  { text: 'REATIVIDADE', x: 742, y: 690, size: 40, color: BLUE, weight: 500, frame: 358, glow: true },
  { text: 'VISAO E CAPACIDADE', x: 724, y: 752, size: 32, color: MUTED, weight: 500, frame: 374 },
  { text: 'RELACAO', x: 812, y: 1132, size: 44, color: BLUE, weight: 400, frame: 390 },
  { text: 'ATIVIDADE', x: 112, y: 1270, size: 42, color: DARK, weight: 500, frame: 406 },
  { text: 'DINAMISMO', x: 498, y: 1298, size: 40, color: DARK, weight: 500, frame: 422 },
  { text: 'APTIDAO', x: 628, y: 1395, size: 42, color: MUTED, weight: 500, frame: 438 },
  { text: 'OBJETIVOS', x: 712, y: 1480, size: 44, color: BLUE, weight: 400, frame: 454 },
  { text: 'ORGANIZACAO', x: 412, y: 1268, size: 32, color: TEAL, weight: 500, frame: 470, vertical: true },
  { text: 'RESULTADO', x: 372, y: 1310, size: 28, color: MUTED, weight: 500, frame: 486, vertical: true },
  { text: 'APTIDAO', x: -34, y: 842, size: 74, color: TEAL, weight: 500, frame: 502, vertical: true, glow: true },
  { text: 'DINAMISMO', x: 418, y: 250, size: 40, color: MUTED, weight: 400, frame: 518, vertical: true },
  { text: 'INTIMIDADE', x: 852, y: 142, size: 38, color: DARK, weight: 500, frame: 532, vertical: true },
  { text: 'SABER', x: 1010, y: 674, size: 54, color: DARK, weight: 600, frame: 546, vertical: true, glow: true },
  { text: 'TALENTO', x: 982, y: 750, size: 34, color: MUTED, weight: 400, frame: 558, vertical: true },
  { text: 'CAPACIDADE', x: 862, y: 1110, size: 36, color: MUTED, weight: 400, frame: 570, vertical: true },
];

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const heroOpacity = interpolate(frame, [12, 42], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const heroScale = interpolate(
    spring({
      frame: Math.max(0, frame - 12),
      fps,
      config: { damping: 18, stiffness: 120 },
      from: 0,
      to: 1,
    }),
    [0, 1],
    [0.94, 1],
  );

  return (
    <AbsoluteFill
      style={{
        background: BG,
        overflow: 'hidden',
      }}
    >
      <Audio
        src={staticFile('audios/cena-8.m4a')}
        trimBefore={72}     // 0.60s
        trimAfter={1039}    // 8.66s
        volume={1}
      />

      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 50% 52%, rgba(29,219,180,0.16), transparent 34%), linear-gradient(90deg, rgba(37,99,235,0.04), transparent 22%, transparent 78%, rgba(29,219,180,0.05))',
          boxShadow: 'inset 0 0 120px rgba(148,163,184,0.18)',
        }}
      />

      {words.map((word, i) => {
        const entryLocal = Math.max(0, frame - word.frame);
        if (entryLocal <= 0) {
          return null;
        }

        const entryProgress = spring({
          frame: entryLocal,
          fps,
          config: { damping: 18, stiffness: 160 },
          from: 0,
          to: 1,
        });
        const entryOpacity = interpolate(entryLocal, [0, 14], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const entryTy = word.vertical ? 0 : interpolate(entryProgress, [0, 1], [-18, 0]);

        const exitRank = words.length - 1 - i;
        const wordExitFrame = EXIT_START + exitRank * EXIT_STAGGER;
        const exitLocal = Math.max(0, frame - wordExitFrame);

        const exitOpacity =
          exitLocal > 0
            ? interpolate(exitLocal, [0, EXIT_DUR], [1, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })
            : 1;
        const exitTy =
          !word.vertical && exitLocal > 0
            ? interpolate(
                spring({
                  frame: exitLocal,
                  fps,
                  config: { damping: 22, stiffness: 400 },
                  from: 0,
                  to: 1,
                }),
                [0, 1],
                [0, -22],
              )
            : 0;

        const finalOpacity = Math.min(entryOpacity, exitOpacity);
        const finalTy = entryTy + exitTy;
        const textShadow =
          word.glow || word.size >= 58
            ? `0 2px ${Math.round(word.size * 0.16)}px rgba(30,41,59,0.12), 0 0 ${Math.round(word.size * 0.28)}px rgba(29,219,180,0.18)`
            : '0 2px 10px rgba(30,41,59,0.08)';

        if (word.vertical) {
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: word.x,
                top: word.y + Y_OFFSET,
                opacity: finalOpacity,
                transform: 'rotate(-90deg)',
                transformOrigin: 'center center',
                fontFamily: FONTS.display,
                fontSize: word.size,
                fontWeight: word.weight,
                color: word.color,
                lineHeight: 1,
                whiteSpace: 'nowrap',
                letterSpacing: 0,
                textShadow,
                zIndex: word.zIndex ?? 0,
              }}
            >
              {word.text}
            </div>
          );
        }

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: word.x,
              top: word.y + Y_OFFSET,
              opacity: finalOpacity,
              transform: `translateY(${finalTy}px)`,
              fontFamily: FONTS.display,
              fontSize: word.size,
              fontWeight: word.weight,
              color: word.color,
              lineHeight: 1,
              letterSpacing: 0,
              whiteSpace: 'nowrap',
              textShadow,
              zIndex: word.zIndex ?? 0,
            }}
          >
            {word.text}
          </div>
        );
      })}

      <div
        style={{
          position: 'absolute',
          left: 54,
          right: 54,
          top: 920,
          opacity: heroOpacity,
          transform: `scale(${heroScale})`,
          transformOrigin: 'center center',
          zIndex: 50,
          fontFamily: FONTS.display,
          fontWeight: 900,
          fontSize: 80,
          lineHeight: 1.04,
          letterSpacing: 0,
          textAlign: 'center',
          color: DARK,
          textShadow:
            '0 5px 24px rgba(30,41,59,0.18), 0 0 42px rgba(29,219,180,0.28)',
        }}
      >
        Automatize seu negócio
        <br />
        <span style={{ color: TEAL }}>com a AVO</span>
      </div>
    </AbsoluteFill>
  );
};
