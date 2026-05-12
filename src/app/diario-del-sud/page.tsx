import type { Metadata } from "next";
import InternalPageTemplate from "@/components/sections/InternalPageTemplate";
import { staticPages } from "@/data/pages";
import { createPageMetadata } from "@/data/site";

const page = staticPages["diario-del-sud"];

export const metadata: Metadata = createPageMetadata(
  "Diario del Sud",
  page.metadataDescription,
);

export default function DiarioDelSudPage() {
  return <InternalPageTemplate page={page} />;
}
