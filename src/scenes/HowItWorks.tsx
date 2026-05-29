import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS, FONTS } from '../theme';
import { FlowNode } from '../components/FlowNode';

const nodes = [
  { icon: '💬', color: COLORS.primary, title: 'Cliente envia mensagem',        subtitle: 'Qualquer hora, qualquer dia',         delay: 0  },
  { icon: '⚡', color: COLORS.primary, title: 'AVO responde em segundos',       subtitle: 'Sem humano, sem espera',              delay: 20 },
  { icon: '📅', color: COLORS.success, title: 'Agenda, vende ou tira dúvidas', subtitle: 'Fluxo 100% automatizado',             delay: 40 },
  { icon: '📊', color: COLORS.purple,  title: 'Você acompanha no painel',       subtitle: 'Histórico, métricas e controle',      delay: 60 },
];

export const HowItWorks: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

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
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            opacity: labelOpacity,
            fontFamily: FONTS.inter,
            fontSize: 26,
            fontWeight: 700,
            color: 'rgba(30,58,110,0.45)',
            letterSpacing: 4,
            textTransform: 'uppercase',
            marginBottom: 40,
            flexShrink: 0,
          }}
        >
          COMO FUNCIONA
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          {nodes.map((node, i) => {
            const localFrame = Math.max(0, frame - node.delay);
            const progress = spring({
              frame: localFrame,
              fps,
              config: { damping: 18, stiffness: 140 },
              from: 0,
              to: 1,
            });
            const opacity = interpolate(localFrame, [0, 12], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const translateX = interpolate(progress, [0, 1], [-60, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });

            const arrowOpacity = i < nodes.length - 1
              ? interpolate(Math.max(0, frame - nodes[i + 1].delay), [0, 12], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                })
              : 0;

            return (
              <React.Fragment key={i}>
                <FlowNode
                  icon={node.icon}
                  color={node.color}
                  title={node.title}
                  subtitle={node.subtitle}
                  opacity={opacity}
                  translateX={translateX}
                />
                {i < nodes.length - 1 && (
                  <div
                    style={{
                      opacity: arrowOpacity,
                      fontFamily: FONTS.inter,
                      fontWeight: 300,
                      fontSize: 40,
                      color: 'rgba(30,58,110,0.2)',
                      textAlign: 'center',
                      width: 860,
                      lineHeight: 1,
                      padding: '2px 0',
                    }}
                  >
                    ↓
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
