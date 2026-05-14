import type { Metadata } from "next";
import InternalPageTemplate from "@/components/sections/InternalPageTemplate";
import { staticPages } from "@/data/pages";
import { createPageMetadata } from "@/data/site";

const page = staticPages.evento;

export const metadata: Metadata = createPageMetadata(
  "L’Evento: gusto mediterraneo e format in evoluzione",
  page.metadataDescription,
);

export default function EventoPage() {
  return <InternalPageTemplate page={page} />;
}
