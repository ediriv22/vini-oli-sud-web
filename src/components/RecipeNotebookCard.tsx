import type {CSSProperties} from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type RecipeNotebookCardPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export type RecipeNotebookCardProps = {
  title: string;
  subtitle?: string;
  stepNumber?: number;
  stepLabel: string;
  stepText: string;
  visibleFrom: number;
  visibleTo: number;
  position?: RecipeNotebookCardPosition;
  compact?: boolean;
};

const colors = {
  paper: "rgba(252, 247, 232, 0.92)",
  green: "#17382b",
  greenSoft: "rgba(23, 56, 43, 0.7)",
  gold: "#a98246",
  goldSoft: "rgba(170, 130, 70, 0.35)",
};

const paperTexture: CSSProperties = {
  backgroundColor: colors.paper,
  backgroundImage: [
    "radial-gradient(circle at 12% 18%, rgba(170, 130, 70, 0.08) 0 1px, transparent 1.4px)",
    "radial-gradient(circle at 76% 34%, rgba(23, 56, 43, 0.045) 0 1px, transparent 1.5px)",
    "linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0) 44%, rgba(129, 93, 48, 0.045))",
  ].join(", "),
  backgroundSize: "38px 38px, 54px 54px, 100% 100%",
};

const positionStyles: Record<RecipeNotebookCardPosition, CSSProperties> = {
  "top-left": {left: 56, top: 156},
  "top-right": {right: 56, top: 156},
  "bottom-left": {left: 56, bottom: 196},
  "bottom-right": {right: 56, bottom: 196},
};

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const RecipeNotebookCard = ({
  title,
  subtitle,
  stepNumber,
  stepLabel,
  stepText,
  visibleFrom,
  visibleTo,
  position = "bottom-left",
  compact = false,
}: RecipeNotebookCardProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const duration = visibleTo - visibleFrom;
  const localFrame = frame - visibleFrom;

  if (localFrame < 0 || localFrame > duration) {
    return null;
  }

  const entrance = spring({
    frame: localFrame,
    fps,
    config: {
      damping: 18,
      stiffness: 72,
      mass: 0.75,
    },
    durationInFrames: Math.round(fps * 0.55),
  });

  const exitStart = Math.max(duration - Math.round(fps * 0.65), 1);
  const exit = interpolate(localFrame, [exitStart, duration], [1, 0], {
    ...clamp,
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const opacity = entrance * exit;
  const slideY = interpolate(entrance, [0, 1], [22, 0]) +
    interpolate(localFrame, [exitStart, duration], [0, -10], clamp);
  const textReveal = interpolate(
    localFrame,
    [Math.round(fps * 0.32), Math.round(fps * 1.32)],
    [0, 1],
    {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)},
  );
  const checkOpacity = interpolate(
    localFrame,
    [Math.max(duration - Math.round(fps * 1.25), 0), Math.max(duration - Math.round(fps * 0.9), 1)],
    [0, 1],
    clamp,
  );

  return (
    <div
      style={{
        position: "absolute",
        ...positionStyles[position],
        width: compact ? 500 : 620,
        maxWidth: "calc(100% - 112px)",
        opacity,
        transform: `translateY(${slideY}px) rotate(-0.35deg)`,
        transformOrigin: position.includes("right") ? "right center" : "left center",
        filter: "drop-shadow(0 18px 32px rgba(12, 25, 18, 0.24))",
      }}
    >
      <div
        style={{
          ...paperTexture,
          border: `1px solid ${colors.goldSoft}`,
          borderRadius: 18,
          padding: compact ? "28px 30px 30px" : "36px 40px 40px",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.54)",
          backdropFilter: "blur(2px)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            marginBottom: compact ? 16 : 22,
          }}
        >
          <div style={{minWidth: 0}}>
            <div
              style={{
                color: colors.gold,
                fontFamily: "Inter, Source Sans Pro, system-ui, sans-serif",
                fontSize: compact ? 18 : 20,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 1.6,
                marginBottom: 7,
              }}
            >
              {stepNumber ? `Passaggio ${stepNumber}` : title}
            </div>
            <div
              style={{
                color: colors.green,
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontSize: compact ? 38 : 46,
                lineHeight: 1,
                fontWeight: 600,
              }}
            >
              {stepLabel}
            </div>
          </div>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 999,
              border: `1px solid rgba(170, 130, 70, ${0.28 + checkOpacity * 0.38})`,
              color: colors.green,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Inter, Source Sans Pro, system-ui, sans-serif",
              fontSize: 21,
              opacity: 0.28 + checkOpacity * 0.72,
            }}
          >
            {checkOpacity > 0.35 ? "✓" : ""}
          </div>
        </div>

        <div
          style={{
            height: 1,
            width: compact ? 96 : 132,
            background: colors.gold,
            opacity: 0.75,
            marginBottom: compact ? 18 : 24,
            transform: `scaleX(${interpolate(localFrame, [8, 24], [0, 1], clamp)})`,
            transformOrigin: "left",
          }}
        />

        {subtitle ? (
          <div
            style={{
              color: colors.greenSoft,
              fontFamily: "Inter, Source Sans Pro, system-ui, sans-serif",
              fontSize: compact ? 21 : 24,
              lineHeight: 1.3,
              marginBottom: 12,
            }}
          >
            {subtitle}
          </div>
        ) : null}

        <div
          style={{
            overflow: "hidden",
            clipPath: `inset(0 ${Math.max(0, (1 - textReveal) * 100)}% 0 0)`,
          }}
        >
          <div
            style={{
              color: colors.green,
              fontFamily: "Inter, Source Sans Pro, system-ui, sans-serif",
              fontSize: compact ? 29 : 34,
              lineHeight: 1.24,
              fontWeight: 400,
            }}
          >
            {stepText}
          </div>
        </div>
      </div>
    </div>
  );
};
