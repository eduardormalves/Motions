import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadInter("normal", {
  weights: ["300", "700", "900"],
  subsets: ["latin"],
});

const Particle: React.FC<{ x: number; y: number; size: number; delay: number; color: string }> = ({
  x,
  y,
  size,
  delay,
  color,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [delay, delay + 20], [0, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulse = Math.sin((frame - delay) * 0.05) * 0.3 + 0.7;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        opacity: opacity * pulse,
        boxShadow: `0 0 ${size * 3}px ${color}`,
        filter: "blur(1px)",
      }}
    />
  );
};

const particles = [
  { x: 120, y: 80, size: 4, delay: 5, color: "#7c3aed" },
  { x: 980, y: 120, size: 6, delay: 8, color: "#06b6d4" },
  { x: 200, y: 580, size: 3, delay: 3, color: "#06b6d4" },
  { x: 1100, y: 500, size: 5, delay: 10, color: "#7c3aed" },
  { x: 600, y: 50, size: 4, delay: 2, color: "#a78bfa" },
  { x: 400, y: 650, size: 3, delay: 12, color: "#22d3ee" },
  { x: 1050, y: 300, size: 4, delay: 6, color: "#8b5cf6" },
  { x: 80, y: 350, size: 5, delay: 9, color: "#0ea5e9" },
  { x: 700, y: 670, size: 6, delay: 4, color: "#7c3aed" },
  { x: 300, y: 150, size: 3, delay: 7, color: "#38bdf8" },
  { x: 850, y: 60, size: 4, delay: 11, color: "#a78bfa" },
  { x: 1150, y: 650, size: 3, delay: 1, color: "#06b6d4" },
];

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        opacity,
        background: "radial-gradient(ellipse at 30% 40%, #130d2e 0%, #0a0a0f 50%, #050510 100%)",
      }}
    >
      {particles.map((p, i) => (
        <Particle key={i} {...p} />
      ))}
      {/* Grid lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
    </AbsoluteFill>
  );
};

const AccentLine: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const scaleX = interpolate(frame, [90, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 200,
        left: "50%",
        transform: `translateX(-50%) scaleX(${scaleX})`,
        transformOrigin: "center",
        width: 400,
        height: 2,
        background: "linear-gradient(90deg, #7c3aed, #06b6d4, #7c3aed)",
        boxShadow: "0 0 20px rgba(124,58,237,0.8), 0 0 40px rgba(6,182,212,0.4)",
      }}
    />
  );
};

const Title: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const y = interpolate(frame, [0, 30], [40, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        textAlign: "center",
        fontFamily,
        fontWeight: 900,
        fontSize: 96,
        letterSpacing: "-2px",
        lineHeight: 1,
        color: "white",
        textShadow: "0 0 60px rgba(124,58,237,0.5)",
      }}
    >
      REMOTION
    </div>
  );
};

const Subtitle: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const y = interpolate(frame, [0, 25], [20, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        textAlign: "center",
        fontFamily,
        fontWeight: 300,
        fontSize: 28,
        letterSpacing: "8px",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.6)",
      }}
    >
      Create videos with React
    </div>
  );
};

const Tagline: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const words = ["Fast.", "Modern.", "Powerful."];
  const colors = ["#a78bfa", "#22d3ee", "#ffffff"];

  return (
    <div style={{ opacity, textAlign: "center", fontFamily }}>
      {words.map((word, i) => {
        const wordOpacity = interpolate(frame, [i * 8, i * 8 + 15], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        return (
          <span
            key={word}
            style={{
              opacity: wordOpacity,
              color: colors[i],
              fontWeight: 700,
              fontSize: 22,
              marginRight: i < words.length - 1 ? 24 : 0,
              letterSpacing: "2px",
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

export const MyComposition = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: "#050510" }}>
      <Sequence>
        <Background />
      </Sequence>

      {/* Title at 0.5s */}
      <Sequence from={Math.round(0.5 * fps)} layout="none">
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 0,
          }}
        >
          <div style={{ transform: "translateY(-40px)" }}>
            <Title />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Subtitle at 1.3s */}
      <Sequence from={Math.round(1.3 * fps)} layout="none">
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ transform: "translateY(30px)" }}>
            <Subtitle />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Accent line at 3s */}
      <Sequence from={Math.round(3 * fps)} layout="none">
        <AccentLine />
      </Sequence>

      {/* Tagline at 3.5s */}
      <Sequence from={Math.round(3.5 * fps)} layout="none">
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ transform: "translateY(130px)" }}>
            <Tagline />
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
