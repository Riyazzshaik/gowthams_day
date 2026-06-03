import type { Metadata } from "next";
import { Poppins, Caveat } from "next/font/google";
import { AudioProvider } from "@/context/AudioContext";
import "./globals.css";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});

export const metadata: Metadata = {
  title: "Happy Birthday Gowthammm 💗 | Our Little Universe",
  description: "A handcrafted digital scrapbook of our most beautiful memories, made with love for your special day.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AudioProvider>{children}</AudioProvider>
      </body>
    </html>
  );
}


