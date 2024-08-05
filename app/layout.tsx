import type { Metadata } from "next";
import "./globals.css";
import Appbar from "./component/Appbar";
import Provider from "./component/Provider";


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <Appbar/>
          {children}
        </Provider>
      </body>
    </html>
  );
}
