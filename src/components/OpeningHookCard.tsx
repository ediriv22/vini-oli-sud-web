import type {CSSProperties} from "react";
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from "remotion";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const paperStyle: CSSProperties = {
  backgroundColor: "rgba(252, 247, 232, 0.91)",
  backgroundImage:
    "radial-gradient(circle at 18% 22%, rgba(170,130,70,0.075) 0 1px, transparent 1.5px), radial-gradient(circle at 82% 64%, rgba(23,56,43,0.04) 0 1px, transparent 1.4px)",
  backgroundSize: "44px 44px, 58px 58px",
};

export const OpeningHookCard = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = interpolate(frame, [0, fps * 0.8, fps * 2.65, fps * 3], [0, 1, 1, 0], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const y = interpolate(frame, [0, fps * 0.8, fps * 2.7, fps * 3], [16, 0, 0, -8], clamp);
  const underline = interpolate(frame, [fps * 0.55, fps * 1.25], [0, 1], clamp);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 88px",
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <div
        style={{
          ...paperStyle,
          width: 820,
          maxWidth: "100%",
          border: "1px solid rgba(170, 130, 70, 0.35)",
          borderRadius: 18,
          padding: "48px 52px 52px",
          boxShadow: "0 24px 54px rgba(12, 25, 18, 0.26), inset 0 1px 0 rgba(255,255,255,0.55)",
          textAlign: "center",
          backdropFilter: "blur(2px)",
        }}
      >
        <div
          style={{
            color: "#17382b",
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontSize: 51,
            lineHeight: 1.02,
            fontWeight: 600,
          }}
        >
          <div>IL VINO NON ARRIVA ALLA FINE</div>
          <div>ERA GIÀ SCRITTO NELLA RICETTA</div>
        </div>
        <div
          style={{
            width: 210,
            height: 1,
            margin: "30px auto 24px",
            background: "#a98246",
            opacity: 0.8,
            transform: `scaleX(${underline})`,
          }}
        />
        <div
          style={{
            color: "rgba(23, 56, 43, 0.74)",
            fontFamily: "Inter, Source Sans Pro, system-ui, sans-serif",
            fontSize: 27,
            lineHeight: 1.28,
          }}
        >
          Spaghetti, alici, limone e Falanghina
        </div>
      </div>
    </div>
  );
};
