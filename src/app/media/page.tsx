import type { Metadata } from "next";
import InternalPageTemplate from "@/components/sections/InternalPageTemplate";
import { staticPages } from "@/data/pages";
import { createPageMetadata } from "@/data/site";

const page = staticPages.media;

export const metadata: Metadata = createPageMetadata(
  "Press Room Vini Oli Sud",
  page.metadataDescription,
);

export default function MediaPage() {
  return <InternalPageTemplate page={page} />;
}
