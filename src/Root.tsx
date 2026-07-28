import {Composition} from "remotion";
import {RecipeOverlayComposition} from "./RecipeOverlayComposition";

export const RemotionRoot = () => {
  return (
    <Composition
      id="RecipeNotebookOverlay"
      component={RecipeOverlayComposition}
      durationInFrames={1800}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        backgroundVideoSrc: "videos/hero-vigneto.mp4",
      }}
    />
  );
};
