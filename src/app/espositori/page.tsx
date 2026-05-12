import type { Metadata } from "next";
import InternalPageTemplate from "@/components/sections/InternalPageTemplate";
import { staticPages } from "@/data/pages";
import { createPageMetadata } from "@/data/site";

const page = staticPages.espositori;

export const metadata: Metadata = createPageMetadata(
  "Espositori",
  page.metadataDescription,
);

export default function EspositoriPage() {
  return <InternalPageTemplate page={page} />;
}
