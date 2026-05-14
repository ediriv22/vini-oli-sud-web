import type { Metadata } from "next";
import GrandPrixWinners from "@/components/sections/GrandPrixWinners";
import InternalPageTemplate from "@/components/sections/InternalPageTemplate";
import { staticPages } from "@/data/pages";
import { createPageMetadata } from "@/data/site";

const page = staticPages["grand-prix"];

export const metadata: Metadata = createPageMetadata(
  "Grand Prix Magna Grecia: riconoscimento in costruzione",
  page.metadataDescription,
);

export default function GrandPrixPage() {
  return (
    <>
      <InternalPageTemplate page={page} />
      <GrandPrixWinners />
    </>
  );
}
