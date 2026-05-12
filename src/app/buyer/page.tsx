import type { Metadata } from "next";
import InternalPageTemplate from "@/components/sections/InternalPageTemplate";
import { staticPages } from "@/data/pages";
import { createPageMetadata } from "@/data/site";

const page = staticPages.buyer;

export const metadata: Metadata = createPageMetadata(
  "Buyer",
  page.metadataDescription,
);

export default function BuyerPage() {
  return <InternalPageTemplate page={page} />;
}
