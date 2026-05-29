import React from 'react';
import { COLORS, FONTS } from '../theme';

interface FlowNodeProps {
  icon: string;
  color: string;
  title: string;
  subtitle: string;
  opacity: number;
  translateX: number;
}

export const FlowNode: React.FC<FlowNodeProps> = ({
  icon,
  color,
  title,
  subtitle,
  opacity,
  translateX,
}) => {
  const alphaMap: Record<string, string> = {
    '#2563eb': 'rgba(37,99,235,0.12)',
    '#16a34a': 'rgba(22,163,74,0.12)',
    '#7c3aed': 'rgba(124,58,237,0.12)',
    '#d97706': 'rgba(217,119,6,0.12)',
  };

  return (
    <div
      style={{
        width: 860,
        background: COLORS.card,
        borderRadius: 20,
        border: `1px solid ${COLORS.border}`,
        padding: '32px 36px',
        display: 'flex',
        alignItems: 'center',
        gap: 28,
        boxShadow: '0 4px 24px rgba(30,58,110,0.07)',
        opacity,
        transform: `translateX(${translateX}px)`,
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 16,
          background: alphaMap[color] ?? 'rgba(37,99,235,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 34,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span
          style={{
            fontFamily: FONTS.inter,
            fontSize: 38,
            fontWeight: 700,
            color: COLORS.text,
            lineHeight: 1.2,
          }}
        >
          {title}
        </span>
        <span
          style={{
            fontFamily: FONTS.inter,
            fontSize: 30,
            fontWeight: 400,
            color: '#64748b',
          }}
        >
          {subtitle}
        </span>
      </div>
    </div>
  );
};
