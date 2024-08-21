import JSBridgeProvider from "@/jsBridge/JSBridgeProvider";
import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import VConsoleWrapper from "./components/VConsoleWrapper";

const IBMPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Mini App Demo",
  description: "Mini App Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={IBMPlexSans.className}>
        <JSBridgeProvider>
          <div>6666</div>
          <div className="bg-default bg-cover bg-center">{children}</div>
        </JSBridgeProvider>
      </body>
      {/*
          If you want to open the browser console to debug your Mini App in the Mini App Webview, 
          we recommend using 'VConsole' because the browser's devtools are not available in this environment.
          
          Refer to the VConsole documentation for more information:
          https://github.com/Tencent/vConsole

          To use VConsole, uncomment the following line: */}
      { <VConsoleWrapper /> }
    </html>
  );
}
