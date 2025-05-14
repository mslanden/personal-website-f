// frontend/src/app/layout.tsx
import "../app/globals.css";
import { ReactNode } from "react";
import ClientChatWrapper from "../components/ClientChatWrapper";

export const metadata = {
  title: "Marcelino Landen | AI Engineer",
  description:
    "Personal website of Marcelino Landen, AI Engineer specializing in AI automation, agent frameworks, and competitive analysis tools",
  keywords: "AI Engineer, Software Developer, AI Automation, Web Development",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Marcelino Landen | AI Engineer",
    description:
      "Personal website of Marcelino Landen, AI Engineer specializing in AI automation",
    url: "https://marcelinolanden.com",
    siteName: "Marcelino Landen",
    images: [
      {
        url: "/images/OG-image.png",
        width: 1200,
        height: 630,
        alt: "Marcelino Landen",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marcelino Landen | AI Engineer",
    description:
      "Personal website of Marcelino Landen, AI Engineer specializing in AI automation",
    images: ["/images/OG-image.png"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ClientChatWrapper />
      </body>
    </html>
  );
}
