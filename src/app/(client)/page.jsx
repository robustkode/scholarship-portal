import Hero from "./_sections/hero";
import Videos from "./_sections/videos";
import PopularCountries from "./_sections/popular-countries";
import Blogs from "./_sections/blogs";
import RecentScholarships from "./_sections/recent-scholarships";
import PopularScholarships from "./_sections/populars";

export const dynamic = "force-static";

export const metadata = {
  description:
    "Empowering Ethiopian youth to discover scholarships and resources that help them achieve their educational dreams and aspirations.",
  openGraph: {
    type: "website",
  },
};

export default function Home() {
  return (
    <main>
      <Hero />
      <RecentScholarships />
      <PopularScholarships />
      <Videos />
      <PopularCountries />
      <Blogs />
    </main>
  );
}
