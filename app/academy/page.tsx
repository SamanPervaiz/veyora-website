import type { Metadata } from "next";
import Academy from "@/components/Academy/Academy";

export const metadata: Metadata = {
  title: "Academy",
  description:
    "Veyora Academy offers practical, project-based technology education across AI, automation, software, data, cybersecurity, freelancing and creative technology.",
};

export default function AcademyPage() {
  return <Academy />;
}