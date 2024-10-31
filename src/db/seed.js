"use server";
import { db } from "@/db";
import {
  scholarships,
  scholarshipHosts,
  ScholarshipDegrees,
  videos,
  blogs,
} from "./schema";
import { users } from "./schema";
import { createScholarship } from "@/data-access/scholarships";

const dfa = {
  // name: "France Excellence  Scholarship Program",
  // university: "Bonjour university",
  tution: 5000,
  currency: "$",
  openTime: 1730408400000,
  deadline: 1730322000000,
  // tags: "France, Europe",
  applyLink:
    "https://www.francefootball.fr/&ved=2ahUKEwiRxY-zt7CJAxUcVqQEHb0tO5oQFnoECE4QAQ&usg=AOvVaw3FwUhUML0gqZH6jiZRapYj",
  about:
    "Developed by the Ministry for Europe and Foreign Affairs, the France Excellence Europa scholarship program allows students from 26 European Union countries to obtain scholarships to study at the Master's level in a French institution of higher education.",
  content:
    "<p><strong>Documents</strong><br>Copy of the most recent higher education diploma obtained or copy of the secondary school diploma if the applicant is in the process of higher education. The higher education diploma must be sent as soon as it is obtained. (translated in French or in English); Copies of transcripts from the last two years of higher education (translated in French or in English);Copy of an identity document (passport, ID card);Letter of admission to a Master’s 1 or Master’s 2 program at a French institute of higher education for the year 2024-25.</p><p><br><strong>Eligibility</strong></p><ul><li><p>Not hold dual citizenship of any developed country;</p></li><li><p>Be in good health;</p></li><li><p>Hold a bachelor’s (or equivalent) degree earned at least 3 years prior to the Application Deadline date;</p></li><li><p>Be employed in development-related work in a paid full- time position at the time of submitting the scholarship application. Have at least 3 years of paid development-related employment since earning a bachelor’s degree</p></li></ul><p><strong>How to Apply</strong><br>Copy of the most recent higher education diploma obtained or copy of the secondary school diploma if the applicant is in the process of higher education. The higher education diploma must be sent as soon as it is obtained.<br></p>",
  userId: "cf67b90e-768d-4b43-a640-b35afc3d9f78",
};

const ri = [
  {
    name: "Global Excellence Scholarship Program",
    university: "International University",
    tags: ["Global", "Education"],
    countries: ["fr", "us"],
    degrees: ["bh", "ms"],
  },
  {
    name: "UK Research Fellowship",
    university: "Oxford University",
    tags: ["UK", "Research", "Education"],
    countries: ["uk"],
    degrees: ["bh", "ms", "phd"],
  },
  {
    name: "Canada Graduate Scholarship",
    university: "University of Toronto",
    tags: ["Canada", "Graduate"],
    countries: ["ca"],
    degrees: ["ph", "ms", "ot"],
  },
  {
    name: "Australian Leadership Program",
    university: "University of Sydney",
    tags: ["Australia", "Leadership"],
    countries: ["au", "us", "ar"],
    degrees: ["bh", "ms", "ph", "ot"],
  },
  {
    name: "Asian Cultural Studies Grant",
    university: "National University of Singapore",
    tags: ["Singapore", "Asia"],
    countries: ["cn", "jp", "my"],
    degrees: ["bh", "ms"],
  },
  {
    name: "Germany Innovation Scholarship",
    university: "Technical University of Munich",
    tags: ["Germany"],
    countries: ["gr"],
    degrees: ["bh"],
  },
  {
    name: "South African Development Scholarship",
    university: "University of Cape Town",
    tags: ["South Africa", "Development"],
    countries: ["za"],
    degrees: ["bh", "ms"],
  },
  {
    name: "Brazilian Arts Fellowship",
    university: "University of São Paulo",
    tags: ["Brazil", "Arts"],
    countries: ["br"],
    degrees: ["bh", "ms", "ph", "ot"],
  },
  {
    name: "India Science and Technology Grant",
    university: "Indian Institute of Technology",
    tags: ["India", "Science"],
    countries: ["in"],
    degrees: ["bh", "ms", "ph", "ot"],
  },

  {
    name: "Middle East Business Scholarship",
    university: "American University of Beirut",
    tags: ["Lebanon", "Business"],
    countries: ["lb", "qa"],
    degrees: ["bh", "ms", "ph", "ot"],
  },
];

const ds = ri.map((r) => {
  return { ...dfa, ...r };
});
const videoss = [
  {
    title: "Hungary scholarship",
    link: "https://www.youtube.com/embed/1Fi4hK7L1ec?si=GI58EpWEHx3Gz_rQ",
    tag: "Hungary",
  },
  {
    title: "Nextjs Scholrship",
    link: "https://www.youtube.com/embed/ZTz5DAILbWo?si=yoqaqPHZbgtW4WHS",
    tag: "Sudan, Uganda",
  },
  {
    title: "Vercel meriit scholarship",
    link: "https://www.youtube.com/embed/a52MMobkuhU?si=rsHInZkIHm3748gL",
    tag: "Dubai, Peru",
  },
  {
    title: "Tailwind funded scholarship",
    link: "https://www.youtube.com/embed/Rp5vd34d-z4?si=txjGfJ5VSRg_60AB",
    tag: "Tailwind, Spain",
  },
  {
    title: "AI scholarship",
    link: "https://www.youtube.com/embed/krixaEhLnlA?si=84sAIGcw3zRpm8u2",
    tag: "AI, Math",
  },
];

const content =
  '<p>Server Actions are<u> asynchronous </u>functions executed on the server in <em>Next.js.</em></p><p>They are defined with the "use server" directive and can be used in both server and client components for handling form submissions and data mutations.</p><p>Over the last year, I have seen them applied in a variety of ways, and I have used them in projects<strong> myself</strong>, too.</p><ul><li><p>Now, I have recently discovered the next-safe-action library, and I like the structure, ease-of-use, and extra features it provides.</p></li><li><p>An Example Server Action without next-safe-action</p></li></ul><p>I think the best way to show why I like next-safe-action is to show how I implemented a Next.js server action without the library first.</p><p>Afterwards, I will show the refactor with next-safe-action.</p><ol><li><p>Here is an example server action from a repository and tutorial I recently published on creating a Next.js Modal Form with react-hook-form, ShadCN/ui, Server Actions and Zod validation.</p></li><li><p>You can see above that I was using a local json-server instance in the tutorial to update user data.</p></li></ol><p>Before the update occurs, the data is validated with Zod.</p><p>If the validation fails, Zod validation errors are sent back to the client component with the ZodError type flatten method applied.</p><p>Now let us compare to the refactored version using next-safe-action. The file has shrunk down from 33 lines to 26 lines of code.</p><p>Starting at the top you can see I still import the Zod UserSchema I have defined. The inferred User type is no longer imported.</p>';

const dhahf = [
  {
    title: "Study in Reactjs University",
    coverImage:
      "http://localhost:9000/my-bucket/blogs/images/0bb4d421-799f-4cca-89c6-1b8bfb292418",
  },

  {
    title: "Life in University",
    coverImage:
      "http://localhost:9000/my-bucket/blogs/images/c2c3281b-4dff-46b2-8d62-51a34f4ad544",
  },
  {
    title: "How to apply to Tailwind scholarship",
    coverImage:
      "http://localhost:9000/my-bucket/blogs/images/c2c3281b-4dff-46b2-8d62-51a34f4ad544",
  },
  {
    title: "Next-auth University",
    coverImage:
      "http://localhost:9000/my-bucket/blogs/images/0bb4d421-799f-4cca-89c6-1b8bfb292418",
  },
];

const dafh = dhahf.map((d) => {
  return {
    ...d,
    content: content,
    userId: "cf67b90e-768d-4b43-a640-b35afc3d9f78",
  };
});

export async function seed() {
  // await db.insert(scholarships).values(ds);
  const promises = ds.map((data) => createScholarship(data));
  await Promise.all(promises);
  // await db.insert(videos).values(videoss);
  //console.log(dafh[0]);
  //await db.insert(blogs).values(dafh);
  //   await db.insert(scholarships).values([
  //     {
  //       name: "name",
  //       university: "university",
  //       countries: "oops",
  //       tution: 10,
  //       openTime: 10,
  //       deadline: 20,
  //       about: "sc 1",
  //       eligibility: "test",
  //       documents: "test",
  //       benefits: "test",
  //       howApply: "test",
  //       applyLink: "test",
  //       userId: "841ce79a-7714-4c00-83f4-8548d7085533",
  //     },
  //     {
  //       name: "name 2",
  //       university: "university 2",
  //       countries: "oops",
  //       tution: 10,
  //       openTime: 10,
  //       deadline: 20,
  //       about: "sc 1",
  //       eligibility: "test",
  //       documents: "test",
  //       benefits: "test",
  //       howApply: "test",
  //       applyLink: "test",
  //       userId: "841ce79a-7714-4c00-83f4-8548d7085533",
  //     },
  //     {
  //       name: "name 3",
  //       university: "university 3",
  //       countries: "oops",
  //       tution: 10,
  //       openTime: 10,
  //       deadline: 20,
  //       about: "sc 1",
  //       eligibility: "test",
  //       documents: "test",
  //       benefits: "test",
  //       howApply: "test",
  //       applyLink: "test",
  //       userId: "841ce79a-7714-4c00-83f4-8548d7085533",
  //     },
  //     {
  //       name: "name 4",
  //       university: "university 4",
  //       countries: "oops",
  //       tution: 10,
  //       openTime: 10,
  //       deadline: 20,
  //       about: "sc 1",
  //       eligibility: "test",
  //       documents: "test",
  //       benefits: "test",
  //       howApply: "test",
  //       applyLink: "test",
  //       userId: "841ce79a-7714-4c00-83f4-8548d7085533",
  //     },
  //   ]);

  //await db.insert(scholarshipHosts).values({});

  //await db.insert(ScholarshipDegrees).values({});

  // await db.insert(scholarshipHosts).values([
  //   {
  //     country: "england",
  //     continent: "europe",
  //     scholarshipId: "b942701c-313b-4d2a-a914-20d2b477dad7",
  //   },
  //   {
  //     country: "france",
  //     continent: "europe",
  //     scholarshipId: "b942701c-313b-4d2a-a914-20d2b477dad7",
  //   },
  //   {
  //     country: "ethiopia",
  //     continent: "Africa",
  //     scholarshipId: "e3a7aef4-6d6a-458c-9edb-6dbab9bea9ad",
  //   },
  //   {
  //     country: "france",
  //     continent: "europe",
  //     scholarshipId: "e3a7aef4-6d6a-458c-9edb-6dbab9bea9ad",
  //   },
  // ]);

  // await db.insert(ScholarshipDegrees).values([
  //   {
  //     degree: "bachelor",
  //     scholarshipId: "e3a7aef4-6d6a-458c-9edb-6dbab9bea9ad",
  //   },
  //   {
  //     degree: "master",
  //     scholarshipId: "e3a7aef4-6d6a-458c-9edb-6dbab9bea9ad",
  //   },
  //   {
  //     degree: "phd",
  //     scholarshipId: "b942701c-313b-4d2a-a914-20d2b477dad7",
  //   },
  // ]);
  // await db.insert(users).values([
  //   {
  //     role: 3,
  //     email: "admin@test.com",
  //     passwordHash:
  //       "594d569ead875d70af94155998c5e6b3a1f66c2c99ed9acccdfae61bf7149d0e7f5b520c718719f376d5e0e2c625c2061fb70f4bd1366d40663607523884ddde",
  //     salt: "Y3n7cYSCHHwL2w3uCR1dR8spf4K06XlNC3JU07NSH5S8SC2SgqUMdXcwmZS33KhS/mdzw6mveC1XtntelX9HtBLuV9JTCZKUk9zYI9EntCc1MqyDykAWRUCpY3wLDqesDsAKeqaPnIJ7KK6LSfFpJ1uKZpqoB2FpdmCsLC19A6E=",
  //   },
  //   {
  //     role: 2,
  //     email: "mod1@test.com",
  //     passwordHash:
  //       "93718dc50305f1f312b1f008b21a9bb9b33c1d2ce397d809ff5f65346fe3f52858811c659af4fef2b5a5ccb1c6aa3e2277a704ef22994efb411937485cf664cc",
  //     salt: "sElfVrFQqpuTazvYDn18GNX1cPCjiW19dGWmFXC0Kd26ILF2ImkqbNwHhj4sBy+4UdvppXLvARIOd8s9qg2XBwPpimkTuBFNebnkOnkr3f5qxqYvterJW6MprIs3CgPruV5nBkrMorfO2vFu4effxeL+uFriYaJKL3FhtkNudZg=",
  //   },
  // ]);
}
