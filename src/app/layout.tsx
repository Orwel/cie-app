import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "./components/GoogleAnalytics";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://cielocanto.com'),
  title: "Cielocanto | Apartaestudios en Bogotá",
  description: "Apartaestudios en Bogotá, sector de Chapinero. Reserva de lavadoras disponible.",
  icons: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      url: '/Cielocanto-favicon.svg',
    },
    {
      rel: 'shortcut icon',
      type: 'image/svg+xml',
      url: '/Cielocanto-favicon.svg',
    },
    {
      rel: 'apple-touch-icon',
      type: 'image/svg+xml',
      url: '/Cielocanto-favicon.svg',
    },
  ],
  openGraph: {
    title: "Cielocanto | Apartaestudios en Bogotá",
    description: "Apartaestudios en Bogotá, sector de Chapinero. Reserva de lavadoras disponible.",
    url: "https://cielocanto.com",
    siteName: "Cielocanto",
    images: [
      {
        url: "https://cielocanto.com/Logo_Cielocanto_cielocanto-16.png",
        width: 1200,
        height: 630,
        alt: "Cielocanto Logo",
      },
    ],
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cielocanto | Apartaestudios en Bogotá",
    description: "Apartaestudios en Bogotá, sector de Chapinero. Reserva de lavadoras disponible.",
    images: ["https://cielocanto.com/Logo_Cielocanto_cielocanto-16.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <GoogleAnalytics />
        <link rel="icon" type="image/svg+xml" href="/Cielocanto-favicon.svg" />
        <link rel="shortcut icon" type="image/svg+xml" href="/Cielocanto-favicon.svg" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-black text-white`}>
        {children}
      </body>
    </html>
  );
}
