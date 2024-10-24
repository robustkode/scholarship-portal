export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function ClientLayout({ children }) {
  return (
    <main className="flex items-center justify-center h-[80vh]">
      <div className="basis-80 shrink">{children}</div>
    </main>
  );
}
