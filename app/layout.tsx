import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "온결 | 온전히 우리다운 결혼",
  description: "온결은 사회 초년생을 위한 현실적인 결혼 예산, 스몰웨딩 비용과 준비 단계, 상견례 예절, 서울·경기 웨딩 공간을 안내합니다.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/ongyeol-symbol.png",
    shortcut: "/ongyeol-symbol.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
