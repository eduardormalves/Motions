import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

interface KineticTextProps {
  text: string;
  style?: React.CSSProperties;
  wordDelay?: number;
  startFrame?: number;
}

export const KineticText: React.FC<KineticTextProps> = ({
  text,
  style,
  wordDelay = 4,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = text.split(' ');

  // Map textAlign → flexbox alignment
  const justifyContent =
    style?.textAlign === 'center'
      ? 'center'
      : style?.textAlign === 'right'
      ? 'flex-end'
      : 'flex-start';

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent,
        rowGap: 4,
      }}
    >
      {words.map((word, wordIndex) => {
        const wordFrame = frame - startFrame - wordIndex * wordDelay;
        const clampedFrame = Math.max(0, wordFrame);

        const wordSpring = spring({
          fps,
          frame: clampedFrame,
          config: { damping: 18, stiffness: 120 },
          from: 0,
          to: 1,
        });

        const opacity = wordFrame <= 0 ? 0 : wordSpring;
        const translateY = interpolate(wordSpring, [0, 1], [28, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const scale = interpolate(wordSpring, [0, 1], [0.85, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <span
            key={wordIndex}
            style={{
              display: 'inline-block',
              marginRight: 14,
              opacity,
              transform: `translateY(${translateY}px) scale(${scale})`,
              ...style,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
