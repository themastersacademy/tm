import { Geist, Geist_Mono, Lato } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const APP_NAME = "The Masters Academy";
const APP_DEFAULT_TITLE = "The Masters Academy";
const APP_TITLE_TEMPLATE = "%s - TMA Learning Platform";
const APP_DESCRIPTION = "The Masters Academy Learning Platform";

export const viewport = {
  themeColor: "#3367D6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

import SWRegistration from "./SWRegistration";

import ThemeRegistry from "./ThemeRegistry";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lato.variable}`}
      >
        <ThemeRegistry>
          <Providers>
            <SWRegistration />
            {children}
          </Providers>
        </ThemeRegistry>
      </body>
    </html>
  );
}
