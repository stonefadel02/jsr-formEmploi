import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import CookieConsent from "./components/cookieConsent.tsx/page";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Inter({ 
  subsets: ['latin'], 
  weight: ['400', '700'], // Ajuste les poids selon tes besoins
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "Jsr-alternance | Trouvez votre future alternance",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  keywords: 'alternance, stage, emploi, étudiant, entreprise, recrutement',

  description: "La plateforme qui connecte les meilleurs candidats et les entreprises innovantes pour des contrats en alternance et des stages.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
      >
        <CookieConsent />
       <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
