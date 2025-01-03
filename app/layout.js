import { Geist, Geist_Mono } from "next/font/google";
import { MyRuntimeProvider } from "@/app/components/MyRuntimeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DDbot",
  description: "A prototype developed for the IxT course.",
};

export default function RootLayout({ children }) {
  return (
    <MyRuntimeProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </MyRuntimeProvider>
  );
}
