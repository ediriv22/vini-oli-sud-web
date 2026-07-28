import {Easing, interpolate, useCurrentFrame, useVideoConfig} from "remotion";

export type RecipeProgressListProps = {
  visibleFrom: number;
  visibleTo: number;
  currentStepIndex: number;
  steps?: string[];
  position?: "left" | "right";
};

const defaultSteps = [
  "Olio EVO + aglio",
  "Alici",
  "Spaghetti",
  "Limone",
  "Mantecatura",
  "Pangrattato",
  "Falanghina",
];

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const RecipeProgressList = ({
  visibleFrom,
  visibleTo,
  currentStepIndex,
  steps = defaultSteps,
  position = "right",
}: RecipeProgressListProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const duration = visibleTo - visibleFrom;
  const localFrame = frame - visibleFrom;

  if (localFrame < 0 || localFrame > duration) {
    return null;
  }

  const opacity = interpolate(
    localFrame,
    [0, fps * 0.5, Math.max(duration - fps * 0.55, 1), duration],
    [0, 1, 1, 0],
    {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)},
  );
  const x = interpolate(localFrame, [0, fps * 0.5], [position === "right" ? 18 : -18, 0], clamp);

  return (
    <div
      style={{
        position: "absolute",
        top: 640,
        [position]: 54,
        width: 320,
        opacity,
        transform: `translateX(${x}px)`,
        color: "#17382b",
        fontFamily: "Inter, Source Sans Pro, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          background: "rgba(252, 247, 232, 0.86)",
          backgroundImage:
            "radial-gradient(circle at 14% 22%, rgba(170,130,70,0.065) 0 1px, transparent 1.4px)",
          backgroundSize: "42px 42px",
          border: "1px solid rgba(170, 130, 70, 0.28)",
          borderRadius: 16,
          padding: "22px 24px",
          boxShadow: "0 16px 34px rgba(12, 25, 18, 0.2)",
          backdropFilter: "blur(2px)",
        }}
      >
        {steps.map((step, index) => {
          const completed = index < currentStepIndex;
          const current = index === currentStepIndex;

          return (
            <div
              key={step}
              style={{
                display: "grid",
                gridTemplateColumns: "26px 1fr",
                alignItems: "center",
                columnGap: 10,
                marginBottom: index === steps.length - 1 ? 0 : 14,
                opacity: completed || current ? 1 : 0.52,
              }}
            >
              <div
                style={{
                  color: completed ? "#17382b" : "rgba(23, 56, 43, 0.38)",
                  fontSize: 16,
                  lineHeight: "20px",
                  textAlign: "center",
                }}
              >
                {completed ? "✓" : ""}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 21,
                    lineHeight: 1.12,
                    fontWeight: current ? 650 : 500,
                  }}
                >
                  {step}
                </div>
                <div
                  style={{
                    width: current ? 86 : 0,
                    height: 1,
                    background: "#a98246",
                    marginTop: 7,
                    opacity: current ? 0.8 : 0,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
