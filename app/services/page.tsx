import type { Metadata } from "next";
import Services from "@/components/Services/Services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore Veyora's AI automation, software, digital products, data, cybersecurity and AI-powered growth capabilities.",
};

export default function ServicesPage() {
  return <Services />;
}