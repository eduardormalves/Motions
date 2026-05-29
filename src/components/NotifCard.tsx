import React from 'react';
import { COLORS, FONTS } from '../theme';

interface NotifCardProps {
  name: string;
  message: string;
  time: string;
  borderColor: string;
  badge: number;
  top: number;
  rotate: number;
  opacity: number;
}

export const NotifCard: React.FC<NotifCardProps> = ({
  name, message, time, borderColor, badge, top, rotate, opacity,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        marginLeft: -340,
        top,
        width: 680,
        transform: `rotate(${rotate}deg)`,
        opacity,
        background: COLORS.card,
        borderRadius: 20,
        border: `1px solid ${COLORS.border}`,
        borderLeft: `7px solid ${borderColor}`,
        padding: '28px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        boxShadow: '0 4px 16px rgba(30,58,110,0.10)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            fontFamily: FONTS.inter,
            fontSize: 32,
            fontWeight: 700,
            color: COLORS.text,
          }}
        >
          {name}
        </span>
        <span style={{ fontFamily: FONTS.inter, fontSize: 28, color: COLORS.textFaint }}>
          {time}
        </span>
      </div>
      <span
        style={{
          fontFamily: FONTS.inter,
          fontSize: 30,
          color: COLORS.textMuted,
          lineHeight: 1.35,
        }}
      >
        {message}
      </span>
      {badge > 0 && (
        <div
          style={{
            position: 'absolute',
            top: -14,
            right: -14,
            background: COLORS.danger,
            borderRadius: '50%',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontFamily: FONTS.inter,
            fontSize: 21,
            fontWeight: 700,
          }}
        >
          {badge}
        </div>
      )}
    </div>
  );
};
