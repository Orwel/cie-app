import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "./components/GoogleAnalytics";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Vivienda | Bogotá",
  description: "Apartaestudios en Bogotá, sector de Chapinero",
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
