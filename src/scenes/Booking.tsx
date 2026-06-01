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
import { TypewriterText } from '../components/TypewriterText';

const WA_HEADER = '#128C7E';
const WA_BG     = '#ECE5DD';
const WA_SENT   = '#DCF8C6';
const TEAL      = '#1ddbb4';

const CHAT_TOP   = 530;
const CHAT_HDR_H = 96;

const HEADLINE_START    = 15;
const HEADLINE_SPEED    = 0.95 / 4;
const CHAT_FADE_START   = 88;
const CHAT_SWITCH_FRAME = 1380; // start sliding to pizza after booking confirmation
const PIZZA_OFFSET      = 1290; // pizza message frames start here (adiantado 1.25s)

type MsgDef =
  | { kind: 'client'; text: string; time: string; frame: number }
  | { kind: 'bot_text'; text: string; time: string; frame: number }
  | {
      kind: 'bot_buttons';
      text: string;
      time: string;
      buttons: string[];
      grid: boolean;
      selectedIdx: number;
      highlightFrame: number;
      frame: number;
    };

const bookingMsgs: MsgDef[] = [
  { kind: 'client', text: 'Olá! Gostaria de agendar um horário 😊', time: '14:02', frame: 80 },
  { kind: 'bot_buttons', text: 'Olá! Selecione o serviço desejado:', time: '14:02',
    buttons: ['Corte de Cabelo', 'Fazer a Barba', 'Corte + Barba'],
    grid: false, selectedIdx: 0, highlightFrame: 330, frame: 200 },
  { kind: 'client', text: 'Corte de Cabelo', time: '14:03', frame: 420 },
  { kind: 'bot_buttons', text: 'Ótimo! Escolha o dia:', time: '14:03',
    buttons: ['20/06', '21/06', '22/06', '23/06'],
    grid: true, selectedIdx: 1, highlightFrame: 570, frame: 480 },
  { kind: 'client', text: '21/06', time: '14:03', frame: 650 },
  { kind: 'bot_buttons', text: 'Agora escolha o horário:', time: '14:04',
    buttons: ['15:00', '15:20', '15:40', '16:00'],
    grid: true, selectedIdx: 1, highlightFrame: 800, frame: 720 },
  { kind: 'client', text: '15:20', time: '14:04', frame: 880 },
  { kind: 'bot_text', text: 'Perfeito! Qual é o seu nome?', time: '14:04', frame: 980 },
  { kind: 'client', text: 'João Silva', time: '14:05', frame: 1120 },
  { kind: 'bot_text',
    text: '✅ Agendamento confirmado!\nCorte de Cabelo para João Silva\nem 21/06 às 15:20. Te esperamos!',
    time: '14:05', frame: 1260 },
];

const pizzaMsgs: MsgDef[] = [
  { kind: 'client', text: 'Olá, gostaria de pedir uma pizza 🍕', time: '19:30', frame: 80 + PIZZA_OFFSET },
  { kind: 'bot_buttons', text: 'Bem vindo à Bella Pizza! Qual sabor deseja?', time: '19:30',
    buttons: ['🍕 Calabresa  R$60,00', '🍗 Frango  R$58,00', '🧀 Marguerita  R$55,00'],
    grid: false, selectedIdx: 0, highlightFrame: 320 + PIZZA_OFFSET, frame: 200 + PIZZA_OFFSET },
  { kind: 'client', text: 'Calabresa  R$60,00', time: '19:31', frame: 420 + PIZZA_OFFSET },
  { kind: 'bot_buttons',
    text: 'Seu carrinho:\n1x Calabresa  R$60,00\nTotal: R$60,00\n\nDeseja adicionar mais alguma coisa?',
    time: '19:31',
    buttons: ['Adicionar itens', 'Remover itens', 'Finalizar Pedido'],
    grid: false, selectedIdx: 2, highlightFrame: 650 + PIZZA_OFFSET, frame: 520 + PIZZA_OFFSET },
  { kind: 'client', text: 'Finalizar Pedido', time: '19:32', frame: 750 + PIZZA_OFFSET },
  { kind: 'bot_text', text: 'Informe seu endereço de entrega 📍', time: '19:32', frame: 850 + PIZZA_OFFSET },
  { kind: 'client', text: 'Rua das Flores, 123 — Apto 42', time: '19:33', frame: 1010 + PIZZA_OFFSET },
  { kind: 'bot_text', text: '✅ Perfeito! Seu pedido está sendo preparado 🍕', time: '19:40', frame: 1110 + PIZZA_OFFSET },
  { kind: 'bot_text', text: '🛵 Seu pedido saiu para entrega!', time: '20:05', frame: 1230 + PIZZA_OFFSET },
  { kind: 'bot_text', text: '✅ Seu pedido foi entregue! Aproveite 😊', time: '20:20', frame: 1350 + PIZZA_OFFSET },
];

const HEADLINE_SEGMENTS = [
  { text: 'Agendamento e pedidos',           color: TEAL      },
  { text: ' sem precisar de um atendente.', color: '#1e293b' },
];

export const Booking: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 15, stiffness: 120 }, from: 0, to: 1 });
  const labelY   = interpolate(entrance, [0, 1], [-20, 0]);

  const chatLocal   = Math.max(0, frame - CHAT_FADE_START);
  const chatOpacity = interpolate(chatLocal, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Horizontal slide from booking panel to pizza panel
  const chatSlide = spring({
    frame: Math.max(0, frame - CHAT_SWITCH_FRAME), fps,
    config: { damping: 18, stiffness: 200 },
    from: 0, to: 1,
  });
  const slideX = interpolate(chatSlide, [0, 1], [0, -960]);

  const mkScroll = (msgs: MsgDef[], idx: number, amt: number) =>
    spring({ frame: Math.max(0, frame - msgs[idx].frame), fps, config: { damping: 18, stiffness: 140 }, from: 0, to: amt });

  const bookingScrollY = mkScroll(bookingMsgs, 6, 80) + mkScroll(bookingMsgs, 7, 100) + mkScroll(bookingMsgs, 8, 180) + mkScroll(bookingMsgs, 9, 200);
  const pizzaScrollY   = mkScroll(pizzaMsgs, 6, 50) + mkScroll(pizzaMsgs, 7, 100) + mkScroll(pizzaMsgs, 8, 100) + mkScroll(pizzaMsgs, 9, 100);

  const renderMessages = (msgs: MsgDef[]) =>
    msgs.map((msg, i) => {
      const local = Math.max(0, frame - msg.frame);
      if (local <= 0) return null;

      const tx = spring({ frame: local, fps, config: { damping: 18, stiffness: 220 },
        from: msg.kind === 'client' ? 460 : -460, to: 0 });
      const opacity = interpolate(local, [0, 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

      if (msg.kind === 'client') {
        return (
          <div key={i} style={{ display: 'flex', justifyContent: 'flex-end', transform: `translateX(${tx}px)`, opacity }}>
            <div style={{ background: WA_SENT, borderRadius: '18px 4px 18px 18px', padding: '14px 18px 10px', maxWidth: 640, boxShadow: '0 1px 3px rgba(0,0,0,0.10)' }}>
              <span style={{ fontFamily: FONTS.inter, fontSize: 28, color: '#111827', lineHeight: 1.42, display: 'block', whiteSpace: 'pre-line' }}>{msg.text}</span>
              <span style={{ fontFamily: FONTS.inter, fontSize: 19, color: '#9CA3AF', display: 'block', textAlign: 'right', marginTop: 4 }}>{msg.time} ✓✓</span>
            </div>
          </div>
        );
      }

      if (msg.kind === 'bot_text') {
        return (
          <div key={i} style={{ display: 'flex', justifyContent: 'flex-start', transform: `translateX(${tx}px)`, opacity }}>
            <div style={{ background: '#fff', borderRadius: '4px 18px 18px 18px', padding: '14px 18px 10px', maxWidth: 700, boxShadow: '0 1px 3px rgba(0,0,0,0.10)' }}>
              <span style={{ fontFamily: FONTS.inter, fontSize: 28, color: '#111827', lineHeight: 1.42, display: 'block', whiteSpace: 'pre-line' }}>{msg.text}</span>
              <span style={{ fontFamily: FONTS.inter, fontSize: 19, color: '#9CA3AF', display: 'block', textAlign: 'right', marginTop: 4 }}>{msg.time}</span>
            </div>
          </div>
        );
      }

      // bot_buttons
      const highlightLocal = Math.max(0, frame - msg.highlightFrame);
      return (
        <div key={i} style={{ display: 'flex', justifyContent: 'flex-start', transform: `translateX(${tx}px)`, opacity }}>
          <div style={{ background: '#fff', borderRadius: '4px 18px 18px 18px', maxWidth: 700, boxShadow: '0 1px 3px rgba(0,0,0,0.10)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px 12px' }}>
              <span style={{ fontFamily: FONTS.inter, fontSize: 28, color: '#111827', lineHeight: 1.42, display: 'block', whiteSpace: 'pre-line' }}>{msg.text}</span>
              <span style={{ fontFamily: FONTS.inter, fontSize: 19, color: '#9CA3AF', display: 'block', textAlign: 'right', marginTop: 4 }}>{msg.time}</span>
            </div>
            <div style={{ height: 1, background: '#e5e7eb' }} />
            <div style={{ display: 'flex', flexWrap: msg.grid ? 'wrap' : undefined, flexDirection: msg.grid ? undefined : 'column' }}>
              {msg.buttons.map((btn, bi) => {
                const isSelected = bi === msg.selectedIdx;
                const tapLocal   = isSelected ? highlightLocal : 0;
                const tapScale = tapLocal > 0
                  ? interpolate(tapLocal, [0, 6, 15, 24], [1, 0.91, 1.04, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
                  : 1;
                const tapAlpha = isSelected && tapLocal > 0
                  ? interpolate(tapLocal, [0, 12, 50], [0, 0.22, 0.13], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
                  : 0;
                const gridStyle: React.CSSProperties = msg.grid
                  ? { width: '50%', borderTop: bi >= 2 ? '1px solid #e5e7eb' : undefined, borderRight: bi % 2 === 0 ? '1px solid #e5e7eb' : undefined }
                  : { borderTop: bi > 0 ? '1px solid #e5e7eb' : undefined };
                return (
                  <div key={bi} style={{ ...gridStyle, padding: '16px 10px', textAlign: 'center', background: `rgba(29,219,180,${tapAlpha})`, transform: `scale(${tapScale})` }}>
                    <span style={{ fontFamily: FONTS.inter, fontSize: 27, fontWeight: 600, color: isSelected && tapLocal > 0 ? '#0fa882' : TEAL }}>{btn}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    });

  return (
    <AbsoluteFill style={{ background: '#f0f4f8', overflow: 'hidden' }}>
      <Audio
        src={staticFile('audios/cena-4.m4a')}
        trimBefore={71}     // 0.59s
        trimAfter={2786}    // 23.22s
        volume={1}
      />

      {/* ── Label + Headline (stays fixed throughout) ────────── */}
      <div style={{ position: 'absolute', top: 140, left: 60, right: 60 }}>
        <div style={{
          opacity: entrance, transform: `translateY(${labelY}px)`,
          fontFamily: FONTS.display, fontSize: 26, fontWeight: 800,
          color: TEAL, letterSpacing: 4, textTransform: 'uppercase',
          marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 30, height: 3, background: TEAL, borderRadius: 2 }} />
          ALÉM DISSO...
        </div>
        <TypewriterText
          segments={HEADLINE_SEGMENTS}
          startFrame={HEADLINE_START}
          charsPerFrame={HEADLINE_SPEED}
          showCursor={false}
          style={{ fontFamily: FONTS.display, fontSize: 68, fontWeight: 800, lineHeight: 1.2, display: 'block' }}
        />
      </div>

      {/* ── Chat clip container (overflow hidden, rounded) ───── */}
      <div style={{
        position: 'absolute',
        left: 60, right: 60,
        top: CHAT_TOP, bottom: 80,
        overflow: 'hidden',
        borderRadius: 20,
        opacity: chatOpacity,
      }}>
        {/* Sliding inner row — 2 panels of 960px each */}
        <div style={{
          display: 'flex',
          width: '200%',
          height: '100%',
          transform: `translateX(${slideX}px)`,
        }}>

          {/* ── Panel 1: Agendamento ─────────────────────────── */}
          <div style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: CHAT_HDR_H, background: WA_HEADER, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 18, flexShrink: 0 }}>
              <div style={{ width: 58, height: 58, borderRadius: '50%', background: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, flexShrink: 0 }}>🤖</div>
              <div>
                <div style={{ fontFamily: FONTS.inter, fontSize: 26, fontWeight: 700, color: '#fff', lineHeight: 1 }}>AVO</div>
                <div style={{ fontFamily: FONTS.inter, fontSize: 19, color: 'rgba(255,255,255,0.82)', marginTop: 3 }}>Agente digital · Online</div>
              </div>
            </div>
            <div style={{ flex: 1, background: WA_BG, overflow: 'hidden' }}>
              <div style={{ transform: `translateY(${-bookingScrollY}px)`, padding: '14px 16px 60px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {renderMessages(bookingMsgs)}
              </div>
            </div>
          </div>

          {/* ── Panel 2: Pizzaria ────────────────────────────── */}
          <div style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: CHAT_HDR_H, background: WA_HEADER, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 18, flexShrink: 0 }}>
              <div style={{ width: 58, height: 58, borderRadius: '50%', background: '#e4520d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, flexShrink: 0 }}>🍕</div>
              <div>
                <div style={{ fontFamily: FONTS.inter, fontSize: 26, fontWeight: 700, color: '#fff', lineHeight: 1 }}>Bella Pizza</div>
                <div style={{ fontFamily: FONTS.inter, fontSize: 19, color: 'rgba(255,255,255,0.82)', marginTop: 3 }}>Atendimento automático · Online</div>
              </div>
            </div>
            <div style={{ flex: 1, background: WA_BG, overflow: 'hidden' }}>
              <div style={{ transform: `translateY(${-pizzaScrollY}px)`, padding: '14px 16px 60px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {renderMessages(pizzaMsgs)}
              </div>
            </div>
          </div>

        </div>
      </div>

    </AbsoluteFill>
  );
};
