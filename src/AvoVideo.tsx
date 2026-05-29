import React from 'react';
import {
  AbsoluteFill,
  Img,
  staticFile,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from 'remotion';
import { TransitionSeries, springTiming, linearTiming } from '@remotion/transitions';
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from '@remotion/transitions';
import { Problem } from './scenes/Problem';
import { Stats } from './scenes/Stats';
import { Solution } from './scenes/Solution';
import { Booking } from './scenes/Booking';
import { Features } from './scenes/Features';
import { NoCodeScene } from './scenes/NoCodeScene';
import { ApiScene } from './scenes/ApiScene';
import { CTAScene } from './scenes/CTAScene';
import { ContactScene } from './scenes/ContactScene';
import { FONTS } from './theme';

const FPS_SCALE = 4;

// ── Transição 1: Card Stack (Problem → Stats) ──────────────────────────────
const CARD_TRANSITION_FRAMES = 60;

type CardStackProps = Record<string, never>;

const CardStackComponent: React.FC<TransitionPresentationComponentProps<CardStackProps>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
}) => {
  if (presentationDirection === 'exiting') {
    const translateX = interpolate(p, [0, 1], [0, -1100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const rotate     = interpolate(p, [0, 1], [0, -22],   { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const scale      = interpolate(p, [0, 1], [1, 0.82],  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const opacity    = interpolate(p, [0.35, 1], [1, 0],  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    return (
      <AbsoluteFill style={{ transform: `translateX(${translateX}px) rotate(${rotate}deg) scale(${scale})`, opacity, transformOrigin: '50% 65%' }}>
        {children}
      </AbsoluteFill>
    );
  }
  const translateX = interpolate(p, [0, 1], [640, 0]);
  const rotate     = interpolate(p, [0, 1], [14, 0],   { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scale      = interpolate(p, [0, 1], [0.84, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity    = interpolate(p, [0, 0.1], [0, 1],  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ transform: `translateX(${translateX}px) rotate(${rotate}deg) scale(${scale})`, opacity, transformOrigin: '50% 35%' }}>
      {children}
    </AbsoluteFill>
  );
};

const cardStackPresentation = (): TransitionPresentation<CardStackProps> => ({ component: CardStackComponent, props: {} });

// ── Transição 2: Fade (Stats → Solution) ───────────────────────────────────
const FADE_TRANSITION_FRAMES = 48;

type FadeProps = Record<string, never>;

const FadeComponent: React.FC<TransitionPresentationComponentProps<FadeProps>> = ({
  children, presentationDirection, presentationProgress: p,
}) => {
  const opacity = presentationDirection === 'exiting'
    ? interpolate(p, [0, 1], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : interpolate(p, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

const fadePresentation = (): TransitionPresentation<FadeProps> => ({ component: FadeComponent, props: {} });

// ── Transição 3 & 4→4B: Whip Pan (deslize horizontal ultra-rápido) ─────────
// Estilo Reels/TikTok — as cenas têm exatamente 1080px de largura sem gap.
const WHIP_TRANSITION_FRAMES = 24;

type WhipPanProps = Record<string, never>;

const WhipPanComponent: React.FC<TransitionPresentationComponentProps<WhipPanProps>> = ({
  children, presentationDirection, presentationProgress: p,
}) => {
  const isExiting = presentationDirection === 'exiting';
  const tx   = isExiting
    ? interpolate(p, [0, 1], [0, -1080],  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : interpolate(p, [0, 1], [1080, 0],   { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const blur = isExiting
    ? interpolate(p, [0, 0.7, 1], [0, 28, 42], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : interpolate(p, [0, 0.3, 1], [42, 28, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ transform: `translateX(${tx}px)`, filter: `blur(${blur}px)` }}>
      {children}
    </AbsoluteFill>
  );
};

const whipPanPresentation = (): TransitionPresentation<WhipPanProps> => ({ component: WhipPanComponent, props: {} });

// ── Transição 4→5: Radial Burst (único neste vídeo) ────────────────────────
// Exiting scene zooms in + brightens to white. Entering scene bursts in from
// the center via a growing circle clip-path — estilo Instagram Stories.
const RADIAL_BURST_FRAMES = 30;

type RadialBurstProps = Record<string, never>;

const RadialBurstComponent: React.FC<TransitionPresentationComponentProps<RadialBurstProps>> = ({
  children, presentationDirection, presentationProgress: p,
}) => {
  if (presentationDirection === 'exiting') {
    const scale      = interpolate(p, [0, 1], [1, 1.07], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const brightness = interpolate(p, [0, 0.7, 1], [1, 1, 3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const blur       = interpolate(p, [0.5, 1], [0, 14],  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    return (
      <AbsoluteFill style={{ transform: `scale(${scale})`, filter: `brightness(${brightness}) blur(${blur}px)` }}>
        {children}
      </AbsoluteFill>
    );
  }
  // Entering: circle clip grows from center — 1200px reaches all corners of 1080×1920
  const radius = interpolate(p, [0, 1], [0, 1200], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ clipPath: `circle(${radius}px at 50% 50%)` }}>
      {children}
    </AbsoluteFill>
  );
};

const radialBurstPresentation = (): TransitionPresentation<RadialBurstProps> => ({ component: RadialBurstComponent, props: {} });

// ── Transição 5→6: Glitch (tech, dinâmico) ─────────────────────────────────
// Tela treme com oscilações rápidas + cintila antes de revelar a cena 6.
const GLITCH_TRANSITION_FRAMES = 40;

type GlitchProps = Record<string, never>;

const GlitchComponent: React.FC<TransitionPresentationComponentProps<GlitchProps>> = ({
  children, presentationDirection, presentationProgress: p,
}) => {
  const isExiting = presentationDirection === 'exiting';

  // Amplitude do tremor cresce e desaparece
  const amp = isExiting
    ? interpolate(p, [0, 0.5, 0.85, 1], [0, 22, 18, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : interpolate(p, [0, 0.15, 0.6, 1], [0, 18, 22, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const shakeX = amp * Math.sin(p * Math.PI * 16);

  // Opacidade com cintilação
  const baseOp = isExiting
    ? interpolate(p, [0, 0.65, 0.88, 1], [1, 1, 0.3, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : interpolate(p, [0, 0.12, 0.35, 1], [0, 0.5, 1, 1],  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const flicker = 0.12 * Math.abs(Math.sin(p * Math.PI * 22));
  const opacity = Math.max(0, baseOp - flicker);

  return (
    <AbsoluteFill style={{ transform: `translateX(${shakeX}px)`, opacity }}>
      {children}
    </AbsoluteFill>
  );
};

const glitchPresentation = (): TransitionPresentation<GlitchProps> => ({ component: GlitchComponent, props: {} });

// ── Composição principal ───────────────────────────────────────────────────
export const AvoVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const SCENE1_FRAMES = 660;
  const SCENE2_FRAMES = 260 * FPS_SCALE;  // 1040
  const SCENE3_FRAMES = 300 * FPS_SCALE;  // 1200
  const SCENE4_FRAMES     = 2900;              // Booking + Pizza (internal slide)
  const SCENE_NOCODE_FRAMES = 1380;            // NoCode — flow editor demo
  const SCENE5_FRAMES = 300 * FPS_SCALE;  // 1200 — Features
  const SCENE6_FRAMES = 240 * FPS_SCALE;  // 960  — ApiScene
  const SCENE7_FRAMES = 980;               // CTA Word Cloud — ends 7 frames after last word exits (~913)
  const SCENE8_FRAMES = 220 * FPS_SCALE;  // 880  — Contact

  // Absolute frame at which Stats starts and the emoji starts falling
  const STATS_ABS_START = SCENE1_FRAMES - CARD_TRANSITION_FRAMES; // 600
  const EMOJI_ABS       = STATS_ABS_START + 480;                   // 1080
  const FADE_ABS_START  = STATS_ABS_START + SCENE2_FRAMES - FADE_TRANSITION_FRAMES; // 1592

  // Mirror the exact spring used in Stats.tsx for the ⚠️ emoji
  const emojiLocal = Math.max(0, frame - EMOJI_ABS);
  const emojiY = spring({
    frame: emojiLocal, fps,
    config: { damping: 14, stiffness: 80, mass: 1.8 },
    from: -2000, to: 0,
  });

  const fadeOutProgress = interpolate(
    frame,
    [FADE_ABS_START, FADE_ABS_START + FADE_TRANSITION_FRAMES],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const globalGrayscale = interpolate(Math.abs(emojiY), [0, 600], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  }) * (1 - fadeOutProgress);

  const globalDark = interpolate(Math.abs(emojiY), [0, 600], [0.72, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  }) * (1 - fadeOutProgress);

  const msgOpacity = interpolate(
    frame,
    [EMOJI_ABS + 100, EMOJI_ABS + 140],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: '#f0f4f8' }} />

      {/* Wrapper de grayscale — desatura tudo uniformemente (cenas + topbar) */}
      <AbsoluteFill style={{ filter: `grayscale(${globalGrayscale})` }}>
        <TransitionSeries>
          {/* Cena 1 — Problema */}
          <TransitionSeries.Sequence durationInFrames={SCENE1_FRAMES}>
            <Problem />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            timing={springTiming({ config: { damping: 15, stiffness: 200 }, durationInFrames: CARD_TRANSITION_FRAMES })}
            presentation={cardStackPresentation()}
          />

          {/* Cena 2 — Estatísticas */}
          <TransitionSeries.Sequence durationInFrames={SCENE2_FRAMES}>
            <Stats />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: FADE_TRANSITION_FRAMES })}
            presentation={fadePresentation()}
          />

          {/* Cena 3 — Solução */}
          <TransitionSeries.Sequence durationInFrames={SCENE3_FRAMES}>
            <Solution />
          </TransitionSeries.Sequence>

          {/* Whip Pan → Cena 4 */}
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: WHIP_TRANSITION_FRAMES })}
            presentation={whipPanPresentation()}
          />

          {/* Cena 4 — Agendamento + Pedidos (slide interno) */}
          <TransitionSeries.Sequence durationInFrames={SCENE4_FRAMES}>
            <Booking />
          </TransitionSeries.Sequence>

          {/* Whip Pan → Cena NoCode */}
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: WHIP_TRANSITION_FRAMES })}
            presentation={whipPanPresentation()}
          />

          {/* Cena NoCode — Editor de fluxo visual sem código */}
          <TransitionSeries.Sequence durationInFrames={SCENE_NOCODE_FRAMES}>
            <NoCodeScene />
          </TransitionSeries.Sequence>

          {/* Radial Burst → Cena 5 */}
          <TransitionSeries.Transition
            timing={springTiming({ config: { damping: 16, stiffness: 180 }, durationInFrames: RADIAL_BURST_FRAMES })}
            presentation={radialBurstPresentation()}
          />

          {/* Cena 5 — Funcionalidades (emoji ❓ + cards) */}
          <TransitionSeries.Sequence durationInFrames={SCENE5_FRAMES}>
            <Features />
          </TransitionSeries.Sequence>

          {/* Glitch → Cena 6 */}
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: GLITCH_TRANSITION_FRAMES })}
            presentation={glitchPresentation()}
          />

          {/* Cena 6 — API Oficial WhatsApp */}
          <TransitionSeries.Sequence durationInFrames={SCENE6_FRAMES}>
            <ApiScene />
          </TransitionSeries.Sequence>

          {/* Card Stack → Cena 7 (mesmo estilo da transição 1→2) */}
          <TransitionSeries.Transition
            timing={springTiming({ config: { damping: 15, stiffness: 200 }, durationInFrames: CARD_TRANSITION_FRAMES })}
            presentation={cardStackPresentation()}
          />

          {/* Cena 7 — CTA (Word Cloud) */}
          <TransitionSeries.Sequence durationInFrames={SCENE7_FRAMES}>
            <CTAScene />
          </TransitionSeries.Sequence>

          {/* Fade → Cena 8 */}
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: FADE_TRANSITION_FRAMES })}
            presentation={fadePresentation()}
          />

          {/* Cena 8 — Contato Final */}
          <TransitionSeries.Sequence durationInFrames={SCENE8_FRAMES}>
            <ContactScene />
          </TransitionSeries.Sequence>
        </TransitionSeries>

        {/* Topbar — dentro do wrapper grayscale, dessatura junto com o conteúdo */}
        <AbsoluteFill style={{ zIndex: 100, pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 130,
            display: 'flex', alignItems: 'center', padding: '0 60px',
            background: '#f0f4f8',
          }}>
            <Img src={staticFile('imagens/logo-reta-full.png')} style={{ height: 44 }} />
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* Overlay escuro global (cobre topbar + conteúdo uniformemente) */}
      <AbsoluteFill style={{ background: `rgba(0,0,0,${globalDark})`, pointerEvents: 'none', zIndex: 200 }} />

      {/* Emoji ⚠️ + mensagem — acima do overlay, em cores plenas */}
      <AbsoluteFill style={{
        zIndex: 300, pointerEvents: 'none',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        opacity: 1 - fadeOutProgress,
      }}>
        <div style={{
          transform: `translateY(${emojiY}px)`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        }}>
          <div style={{ fontSize: 260, lineHeight: 1 }}>⚠️</div>
          <div style={{ opacity: msgOpacity, marginTop: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: FONTS.display, fontSize: 70, fontWeight: 900, color: '#ffffff', lineHeight: 1.05, textShadow: '0 4px 24px rgba(0,0,0,0.5)', letterSpacing: -1 }}>
              MAS ESPERA!
            </span>
            <span style={{ fontFamily: FONTS.display, fontSize: 40, fontWeight: 600, color: 'rgba(255,255,255,0.88)', lineHeight: 1.3, textShadow: '0 2px 12px rgba(0,0,0,0.4)', maxWidth: 820 }}>
              Nós temos a solução para isso!
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
