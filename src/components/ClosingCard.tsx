import type {CSSProperties} from "react";
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from "remotion";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const paperStyle: CSSProperties = {
  backgroundColor: "rgba(252, 247, 232, 0.92)",
  backgroundImage:
    "radial-gradient(circle at 14% 22%, rgba(170,130,70,0.07) 0 1px, transparent 1.5px), radial-gradient(circle at 72% 72%, rgba(23,56,43,0.04) 0 1px, transparent 1.4px)",
  backgroundSize: "42px 42px, 56px 56px",
};

export const ClosingCard = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localFrame = frame;
  const opacity = interpolate(localFrame, [0, fps * 1.2], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const y = interpolate(localFrame, [0, fps * 1.2], [18, 0], clamp);

  return (
    <div
      style={{
        position: "absolute",
        left: 64,
        bottom: 188,
        width: 620,
        maxWidth: "calc(100% - 128px)",
        opacity,
        transform: `translateY(${y}px)`,
        filter: "drop-shadow(0 18px 34px rgba(12, 25, 18, 0.25))",
      }}
    >
      <div
        style={{
          ...paperStyle,
          border: "1px solid rgba(170, 130, 70, 0.35)",
          borderRadius: 18,
          padding: "38px 42px 40px",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)",
          backdropFilter: "blur(2px)",
        }}
      >
        <div
          style={{
            color: "#17382b",
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontSize: 48,
            lineHeight: 1.04,
            fontWeight: 600,
          }}
        >
          Il calice chiude il racconto.
        </div>
        <div
          style={{
            width: 136,
            height: 1,
            background: "#a98246",
            opacity: 0.78,
            margin: "24px 0 22px",
          }}
        />
        <div
          style={{
            color: "rgba(23, 56, 43, 0.78)",
            fontFamily: "Inter, Source Sans Pro, system-ui, sans-serif",
            fontSize: 27,
            lineHeight: 1.28,
          }}
        >
          Spaghetti alici e limone × Falanghina del Sannio
        </div>
        <div
          style={{
            color: "#a98246",
            fontFamily: "Inter, Source Sans Pro, system-ui, sans-serif",
            fontSize: 18,
            fontWeight: 650,
            textTransform: "uppercase",
            letterSpacing: 1.6,
            marginTop: 22,
          }}
        >
          ViniSud
        </div>
      </div>
    </div>
  );
};
