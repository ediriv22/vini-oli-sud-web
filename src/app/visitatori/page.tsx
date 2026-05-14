import type { Metadata } from "next";
import InternalPageTemplate from "@/components/sections/InternalPageTemplate";
import { staticPages } from "@/data/pages";
import { createPageMetadata } from "@/data/site";

const page = staticPages.visitatori;

export const metadata: Metadata = createPageMetadata(
  "Visitatori: degustazioni e cultura mediterranea",
  page.metadataDescription,
);

export default function VisitatoriPage() {
  return <InternalPageTemplate page={page} />;
}
