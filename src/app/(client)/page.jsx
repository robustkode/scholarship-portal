import Hero from "./_sections/hero";
import Populars from "./_sections/populars";
import Videos from "./_sections/videos";
import PopularCountries from "./_sections/popular-countries";
import Blogs from "./_sections/blogs";
import RecentScholarships from "./_sections/recent-scholarships";

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
      <Populars />
      <Videos />
      <PopularCountries />
      <Blogs />
    </main>
  );
}
