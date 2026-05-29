import React from 'react';
import { useCurrentFrame } from 'remotion';

interface Segment {
  text: string;
  color?: string;
}

interface TypewriterProps {
  segments: Segment[];
  startFrame: number;
  charsPerFrame: number;
  style?: React.CSSProperties;
  showCursor?: boolean;
}

export const TypewriterText: React.FC<TypewriterProps> = ({
  segments,
  startFrame,
  charsPerFrame,
  style,
  showCursor = false,
}) => {
  const frame = useCurrentFrame();

  const totalChars = segments.reduce((sum, seg) => sum + seg.text.length, 0);
  const charsToShow = Math.min(
    Math.floor((frame - startFrame) * charsPerFrame),
    totalChars,
  );

  // Cursor visível apenas enquanto está digitando, sem piscar
  const isTyping = charsToShow >= 0 && charsToShow < totalChars;

  // Render segments character by character
  let charsRendered = 0;
  const renderedSegments: React.ReactNode[] = [];
  let cursorColor = style?.color ?? '#1e293b';

  for (let s = 0; s < segments.length; s++) {
    const seg = segments[s];
    if (charsRendered >= charsToShow) break;

    const charsFromThisSeg = Math.min(seg.text.length, charsToShow - charsRendered);
    const visible = seg.text.slice(0, charsFromThisSeg);
    charsRendered += charsFromThisSeg;

    if (visible.length > 0) {
      cursorColor = seg.color ?? style?.color ?? '#1e293b';
      renderedSegments.push(
        <span key={s} style={{ color: seg.color ?? style?.color }}>
          {visible}
        </span>,
      );
    }
  }

  return (
    <div style={{ display: 'inline', ...style, color: undefined }}>
      {renderedSegments}
      {showCursor && isTyping && (
        <span
          style={{
            opacity: 1,
            color: cursorColor,
            fontWeight: style?.fontWeight,
          }}
        >
          |
        </span>
      )}
    </div>
  );
};
