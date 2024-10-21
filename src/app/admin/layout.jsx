import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AdminNavbar from "@/components/admin-navbar";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { isModerator } from "@/use-cases/authorization";
import { seed } from "@/db/seed";

export const metadata = {
  robots: {
    follow: false,
    index: false,
  },
};

export default async function AdminLayout({ children }) {
  return <>{children}</>;
}
