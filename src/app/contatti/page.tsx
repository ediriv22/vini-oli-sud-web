import type { Metadata } from "next";
import InternalPageTemplate from "@/components/sections/InternalPageTemplate";
import { staticPages } from "@/data/pages";
import { createPageMetadata } from "@/data/site";

const page = staticPages.contatti;

export const metadata: Metadata = createPageMetadata(
  "Contatti",
  page.metadataDescription,
);

export default function ContattiPage() {
  return <InternalPageTemplate page={page} />;
}
