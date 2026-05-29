import React from 'react';
import { COLORS, FONTS } from '../theme';

export type BubbleType = 'BOT' | 'USR' | 'SYS' | 'OPTS' | 'TYPING' | 'BADGE' | 'MENU';

export interface MenuItem {
  emoji: string;
  name: string;
  price: string;
  selected?: boolean;
}

export interface ChatOption {
  label: string;
  selected?: boolean;
}

interface ChatBubbleProps {
  type: BubbleType;
  text?: string;
  options?: ChatOption[];
  menuItems?: MenuItem[];
  scale: number;
  opacity: number;
  dotOffsets?: [number, number, number];
}

const bubbleBase: React.CSSProperties = {
  borderRadius: 18,
  padding: '16px 22px',
  maxWidth: 420,
  fontSize: 28,
  lineHeight: 1.45,
  fontFamily: FONTS.inter,
  fontWeight: 400,
};

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  type,
  text,
  options,
  menuItems,
  scale,
  opacity,
  dotOffsets = [0, 0, 0],
}) => {
  const wrapStyle: React.CSSProperties = {
    display: 'flex',
    marginBottom: 14,
    opacity,
    transform: `scale(${scale})`,
    transformOrigin: type === 'USR' ? 'right bottom' : 'left bottom',
    justifyContent:
      type === 'USR'
        ? 'flex-end'
        : type === 'SYS' || type === 'BADGE'
        ? 'center'
        : 'flex-start',
  };

  if (type === 'TYPING') {
    return (
      <div style={wrapStyle}>
        <div
          style={{
            ...bubbleBase,
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderBottomLeftRadius: 4,
            display: 'flex',
            gap: 0,
            alignItems: 'center',
            padding: '18px 20px',
            boxShadow: '0 2px 8px rgba(30,58,110,0.06)',
          }}
        >
          {dotOffsets.map((dy, i) => (
            <div
              key={i}
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: '#94a3b8',
                transform: `translateY(${dy}px)`,
                display: 'inline-block',
                margin: '0 5px',
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (type === 'BOT') {
    return (
      <div style={wrapStyle}>
        <div
          style={{
            ...bubbleBase,
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text,
            borderBottomLeftRadius: 4,
            boxShadow: '0 2px 8px rgba(30,58,110,0.06)',
          }}
        >
          {text}
        </div>
      </div>
    );
  }

  if (type === 'USR') {
    return (
      <div style={wrapStyle}>
        <div
          style={{
            ...bubbleBase,
            background: COLORS.primary,
            color: '#fff',
            borderBottomRightRadius: 4,
          }}
        >
          {text}
        </div>
      </div>
    );
  }

  if (type === 'SYS') {
    return (
      <div style={wrapStyle}>
        <div
          style={{
            ...bubbleBase,
            background: 'rgba(22,163,74,0.08)',
            border: '1px solid rgba(22,163,74,0.2)',
            color: '#15803d',
            textAlign: 'center',
            fontSize: 26,
          }}
        >
          {text}
        </div>
      </div>
    );
  }

  if (type === 'BADGE') {
    return (
      <div style={wrapStyle}>
        <div
          style={{
            background: 'rgba(22,163,74,0.1)',
            border: '1.5px solid rgba(22,163,74,0.3)',
            borderRadius: 100,
            padding: '12px 28px',
            fontFamily: FONTS.inter,
            fontSize: 26,
            fontWeight: 600,
            color: COLORS.success,
          }}
        >
          {text}
        </div>
      </div>
    );
  }

  if (type === 'OPTS' && options) {
    return (
      <div style={{ ...wrapStyle, justifyContent: 'flex-start' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {options.map((opt) => (
            <div
              key={opt.label}
              style={{
                borderRadius: 100,
                border: opt.selected
                  ? `1.5px solid ${COLORS.primary}`
                  : '1.5px solid rgba(37,99,235,0.3)',
                background: opt.selected ? COLORS.primary : 'transparent',
                color: opt.selected ? '#fff' : COLORS.primary,
                padding: '10px 20px',
                fontFamily: FONTS.inter,
                fontSize: 26,
                fontWeight: 600,
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'MENU' && menuItems) {
    return (
      <div style={{ ...wrapStyle, justifyContent: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 380 }}>
          {menuItems.map((item) => (
            <div
              key={item.name}
              style={{
                background: item.selected ? 'rgba(37,99,235,0.06)' : COLORS.card,
                border: `1px solid ${item.selected ? COLORS.primary : COLORS.border}`,
                borderRadius: 16,
                padding: '14px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.inter,
                  fontSize: 26,
                  fontWeight: 600,
                  color: COLORS.text,
                }}
              >
                {item.emoji} {item.name}
              </span>
              <span
                style={{
                  fontFamily: FONTS.inter,
                  fontSize: 26,
                  fontWeight: 700,
                  color: COLORS.primary,
                }}
              >
                {item.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
