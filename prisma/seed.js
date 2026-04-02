const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const productNames = [
  "天皇立領素T 101",
  "天皇針織衫",
  "天皇背心222",
  "天皇平口褲",
  "兒童平口褲",
  "黑豹帽T",
  "黑豹BP55",
  "黑豹BP33",
  "短袖Polo衫",
  "休閒夾克",
  "天皇短袖888",
  "天皇長袖999",
  "黑武士短袖747",
  "黑武士長袖757",
  "彫涼感短袖S350",
  "彫涼感長袖S550",
  "短褲",
  "套裝",
  "大學T",
];

const sizeBands = [
  { maxWeight: 58, maxWaist: 74, size: "S" },
  { maxWeight: 64, maxWaist: 79, size: "M" },
  { maxWeight: 71, maxWaist: 84, size: "L" },
  { maxWeight: 79, maxWaist: 90, size: "XL" },
  { maxWeight: 87, maxWaist: 96, size: "2L" },
  { maxWeight: 95, maxWaist: 102, size: "3L" },
  { maxWeight: 104, maxWaist: 110, size: "4L" },
  { maxWeight: Number.POSITIVE_INFINITY, maxWaist: Number.POSITIVE_INFINITY, size: "5L" },
];

function calculateSuggestedSize(weightKg, waistCm) {
  const match = sizeBands.find(
    (band) => weightKg <= band.maxWeight && waistCm <= band.maxWaist
  );
  return match ? match.size : "5L";
}

function createCases() {
  return Array.from({ length: 56 }, (_, index) => {
    const productName = productNames[index % productNames.length];
    const heightCm = 160 + (index % 16) * 2 + Math.floor(index / 16);
    const weightKg = 52 + (index % 11) * 4 + Math.floor(index / 9);
    const waistCm = 72 + (index % 9) * 4 + Math.floor(index / 7);
    const suggestedSize = calculateSuggestedSize(weightKg, waistCm);

    return {
      productName,
      heightCm,
      weightKg,
      waistCm,
      suggestedSize,
      source: "simulated",
    };
  });
}

async function seedBrandsAndSizeCharts() {
  const uniqlo = await prisma.brand.upsert({
    where: { name: "Uniqlo" },
    update: {},
    create: { name: "Uniqlo" },
  });

  const sizeCharts = [
    {
      brandId: uniqlo.id,
      category: "top",
      sizeLabel: "S",
      chestMin: 34,
      chestMax: 36,
      waistMin: null,
      waistMax: null,
      hipMin: null,
      hipMax: null,
      inseamMin: null,
    },
    {
      brandId: uniqlo.id,
      category: "top",
      sizeLabel: "M",
      chestMin: 37,
      chestMax: 39,
      waistMin: null,
      waistMax: null,
      hipMin: null,
      hipMax: null,
      inseamMin: null,
    },
    {
      brandId: uniqlo.id,
      category: "top",
      sizeLabel: "L",
      chestMin: 40,
      chestMax: 42,
      waistMin: null,
      waistMax: null,
      hipMin: null,
      hipMax: null,
      inseamMin: null,
    },
    {
      brandId: uniqlo.id,
      category: "bottom",
      sizeLabel: "28",
      chestMin: null,
      chestMax: null,
      waistMin: 27,
      waistMax: 28,
      hipMin: null,
      hipMax: null,
      inseamMin: null,
    },
    {
      brandId: uniqlo.id,
      category: "bottom",
      sizeLabel: "30",
      chestMin: null,
      chestMax: null,
      waistMin: 29,
      waistMax: 30,
      hipMin: null,
      hipMax: null,
      inseamMin: null,
    },
    {
      brandId: uniqlo.id,
      category: "bottom",
      sizeLabel: "32",
      chestMin: null,
      chestMax: null,
      waistMin: 31,
      waistMax: 32,
      hipMin: null,
      hipMax: null,
      inseamMin: null,
    },
  ];

  for (const chart of sizeCharts) {
    await prisma.sizeChart.upsert({
      where: {
        brandId_category_sizeLabel: {
          brandId: chart.brandId,
          category: chart.category,
          sizeLabel: chart.sizeLabel,
        },
      },
      update: {
        chestMin: chart.chestMin,
        chestMax: chart.chestMax,
        waistMin: chart.waistMin,
        waistMax: chart.waistMax,
        hipMin: chart.hipMin,
        hipMax: chart.hipMax,
        inseamMin: chart.inseamMin,
      },
      create: chart,
    });
  }
}

async function seedTryOnCases() {
  await prisma.tryOnLabel.deleteMany();
  await prisma.tryOnCase.deleteMany();

  const cases = createCases();

  await prisma.tryOnCase.createMany({
    data: cases,
  });

  console.log(`Seeded ${cases.length} try-on cases.`);
}

async function main() {
  await seedBrandsAndSizeCharts();
  await seedTryOnCases();
}

main()
  .catch(async (error) => {
    console.error("Seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });