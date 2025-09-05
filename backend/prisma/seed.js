import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

async function main() {
  const data = JSON.parse(fs.readFileSync("./prisma/schemes.json", "utf-8"));

  // clear old
  await prisma.scheme.deleteMany();

  // insert new
  for (const scheme of data) {
    await prisma.scheme.create({
      data: {
        name: scheme.name,
        income_limit:
          scheme.income_limit === "none" ? null : Number(scheme.income_limit),
        crop_type: scheme.crop_type,
        region: scheme.region,
        deadline: scheme.deadline,
        description: scheme.description,
      },
    });
  }

  console.log("🌱 Schemes seeded into Azure SQL!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
