"use server";
import { db } from "@/db";
import { scholarships, scholarshipHosts, ScholarshipDegrees } from "./schema";
import { users } from "./schema";

export async function seed() {
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
  await db.insert(users).values([
    {
      role: 3,
      email: "admin@test.com",
      passwordHash:
        "594d569ead875d70af94155998c5e6b3a1f66c2c99ed9acccdfae61bf7149d0e7f5b520c718719f376d5e0e2c625c2061fb70f4bd1366d40663607523884ddde",
      salt: "Y3n7cYSCHHwL2w3uCR1dR8spf4K06XlNC3JU07NSH5S8SC2SgqUMdXcwmZS33KhS/mdzw6mveC1XtntelX9HtBLuV9JTCZKUk9zYI9EntCc1MqyDykAWRUCpY3wLDqesDsAKeqaPnIJ7KK6LSfFpJ1uKZpqoB2FpdmCsLC19A6E=",
    },
    {
      role: 2,
      email: "mod1@test.com",
      passwordHash:
        "93718dc50305f1f312b1f008b21a9bb9b33c1d2ce397d809ff5f65346fe3f52858811c659af4fef2b5a5ccb1c6aa3e2277a704ef22994efb411937485cf664cc",
      salt: "sElfVrFQqpuTazvYDn18GNX1cPCjiW19dGWmFXC0Kd26ILF2ImkqbNwHhj4sBy+4UdvppXLvARIOd8s9qg2XBwPpimkTuBFNebnkOnkr3f5qxqYvterJW6MprIs3CgPruV5nBkrMorfO2vFu4effxeL+uFriYaJKL3FhtkNudZg=",
    },
  ]);
}
