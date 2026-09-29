import type { Metadata } from "next";
import Contact from "@/components/Contact/Contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a conversation with Veyora about AI automation, software, digital products, data, cybersecurity and AI-powered growth solutions.",
};

export default function ContactPage() {
  return <Contact />;
}