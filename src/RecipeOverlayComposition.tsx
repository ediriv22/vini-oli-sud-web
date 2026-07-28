import {AbsoluteFill, Sequence, staticFile, useVideoConfig, Video} from "remotion";
import {ClosingCard} from "./components/ClosingCard";
import {OpeningHookCard} from "./components/OpeningHookCard";
import {RecipeNotebookCard} from "./components/RecipeNotebookCard";
import {RecipeProgressList} from "./components/RecipeProgressList";

const secondsToFrames = (seconds: number, fps: number) => Math.round(seconds * fps);

const notebookSteps = [
  {
    start: 3,
    end: 7,
    title: "Ingredienti",
    stepLabel: "Ingredienti",
    stepText: "Alici, olio, limone e pane: pochi gesti, tutto il Mediterraneo.",
    position: "top-left" as const,
    compact: false,
  },
  {
    start: 7,
    end: 12,
    title: "Preparazione",
    stepNumber: 1,
    stepLabel: "Olio EVO + aglio",
    stepText: "Scaldare piano. Senza fretta.",
    position: "bottom-left" as const,
    compact: true,
  },
  {
    start: 12,
    end: 17,
    title: "Preparazione",
    stepNumber: 2,
    stepLabel: "Spaghetti",
    stepText: "Acqua viva, cottura al dente.",
    position: "top-right" as const,
    compact: true,
  },
  {
    start: 17,
    end: 23,
    title: "Preparazione",
    stepNumber: 3,
    stepLabel: "Alici",
    stepText: "Il mare si scioglie nell'olio.",
    position: "bottom-right" as const,
    compact: true,
  },
  {
    start: 23,
    end: 29,
    title: "Preparazione",
    stepNumber: 4,
    stepLabel: "Limone",
    stepText: "La scorza accende il fondo.",
    position: "top-left" as const,
    compact: true,
  },
  {
    start: 29,
    end: 38,
    title: "Preparazione",
    stepNumber: 5,
    stepLabel: "Mantecatura",
    stepText: "Unire tutto. Far legare.",
    position: "bottom-left" as const,
    compact: true,
  },
  {
    start: 38,
    end: 45,
    title: "Preparazione",
    stepNumber: 6,
    stepLabel: "Pangrattato",
    stepText: "Croccantezza finale.",
    position: "top-right" as const,
    compact: true,
  },
  {
    start: 45,
    end: 55,
    title: "Abbinamento",
    stepNumber: 7,
    stepLabel: "Falanghina",
    stepText: "Fresca, luminosa, mediterranea.",
    position: "bottom-right" as const,
    compact: true,
  },
];

const progressMoments = [
  {start: 10.1, end: 12.2, currentStepIndex: 1, position: "right" as const},
  {start: 22.3, end: 24.5, currentStepIndex: 3, position: "left" as const},
  {start: 36.3, end: 38.7, currentStepIndex: 5, position: "right" as const},
  {start: 49.5, end: 52.3, currentStepIndex: 6, position: "left" as const},
];

export type RecipeOverlayCompositionProps = {
  backgroundVideoSrc?: string;
};

export const RecipeOverlayComposition = ({
  backgroundVideoSrc = "videos/hero-vigneto.mp4",
}: RecipeOverlayCompositionProps) => {
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill style={{backgroundColor: "#151a13", overflow: "hidden"}}>
      <AbsoluteFill>
        <Video
          src={staticFile(backgroundVideoSrc)}
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(8, 13, 10, 0.08), rgba(8, 13, 10, 0.02) 44%, rgba(8, 13, 10, 0.14))",
          pointerEvents: "none",
        }}
      />

      <Sequence from={0} durationInFrames={secondsToFrames(3, fps)}>
        <OpeningHookCard />
      </Sequence>

      {notebookSteps.map((step) => (
        <RecipeNotebookCard
          key={`${step.start}-${step.stepLabel}`}
          title={step.title}
          subtitle={step.title === "Ingredienti" ? "Spaghetti, alici, limone e Falanghina" : undefined}
          stepNumber={step.stepNumber}
          stepLabel={step.stepLabel}
          stepText={step.stepText}
          visibleFrom={secondsToFrames(step.start, fps)}
          visibleTo={secondsToFrames(step.end, fps)}
          position={step.position}
          compact={step.compact}
        />
      ))}

      {progressMoments.map((moment) => (
        <RecipeProgressList
          key={`${moment.start}-${moment.currentStepIndex}`}
          visibleFrom={secondsToFrames(moment.start, fps)}
          visibleTo={secondsToFrames(moment.end, fps)}
          currentStepIndex={moment.currentStepIndex}
          position={moment.position}
        />
      ))}

      <Sequence from={secondsToFrames(55, fps)} durationInFrames={secondsToFrames(5, fps)}>
        <ClosingCard />
      </Sequence>
    </AbsoluteFill>
  );
};
