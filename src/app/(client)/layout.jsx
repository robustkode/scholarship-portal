import Footer from "@/components/footer";

export default async function RootLayout({ children }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
