import { Open_Sans, Oswald } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/providers";
import { getCurrentUser } from "@/lib/session";
import Navbar from "@/components/navbar";
import AdminNavbar from "@/components/admin-navbar";
import Footer from "@/components/footer";
import { isAdmin, isModerator } from "@/use-cases/authorization";
import { BASE_URL, SITE_NAME } from "@/config";

const open = Open_Sans({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-open",
});
const oswald = Oswald({
  subsets: ["latin"],
  weight: "600",
  variable: "--font-oswald",
});

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  applicationName: SITE_NAME,
  keywords: ["scholarship", "ethiopia"],
  robots: {
    follow: true,
    index: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default async function RootLayout({ children }) {
  const moderator = await isModerator();
  return (
    <html lang="en" className={`${open.variable} ${oswald.variable}}`}>
      <body className={open.className}>
        <Providers>
          <Navbar />
          {moderator ? <AdminNavbar /> : ""}
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
