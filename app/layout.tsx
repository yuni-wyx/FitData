import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "天皇尺碼試穿遊戲",
  description: "請根據客人的身形，選擇你覺得最適合的尺碼。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
