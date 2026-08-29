const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Admin User
  const passwordHash = await bcrypt.hash('SatSaheb@2026', 10);
  await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: { passwordHash },
    create: {
      username: 'admin',
      passwordHash,
    },
  });
  console.log('Admin user seeded (Username: admin, Password: SatSaheb@2026).');

  // 2. Website Settings
  await prisma.websiteSettings.upsert({
    where: { id: 1 },
    update: {
      phone2: '+91 98252 15344',
      storyEnabled: true,
      storyLabel: 'Sat Saheb Trading Co.',
      storyTitle: 'Exporting Premium Commodities Worldwide',
      storyDescription: 'We bridge domestic farms to international markets, delivering uncompromised quality with every container. Operating out of Kutches premier shipping corridor, our logistics efficiency guarantees fresh delivery globally.',
      storyBtnText: 'Our Company Story',
      storyBtnLink: '/about',
      storyBtnVisible: true,
      storyImage: '/images/story.jpg',
      storyPillar1Title: 'Premium Sourcing',
      storyPillar1Desc: 'We procure grains and spices directly from verified cultivation belts across India, ensuring rich nutrient values and authentic flavors.',
      storyPillar2Title: 'Strict Quality Control',
      storyPillar2Desc: 'Before shipping, all commodities go through advanced cleaning, grading, sorting, and lab testing parameters to match global guidelines.',
      storyPillar3Title: 'Logistical Splicing',
      storyPillar3Desc: 'Our close proximity to Mundra Port enables immediate container customs check, minimal port delays, and rapid shipping turnarounds.',
      storyPillar4Title: 'Secure Export Packing',
      storyPillar4Desc: 'Commodities are packed in customized heavy-duty PP, Jute, or vacuum sealed bags to shield goods from moisture and temperature swings.',
      featuredProductsEnabled: true,
      featuredProductsLabel: 'Verified Sourcing',
      featuredProductsTitle: 'Special Products for Most People',
      featuredProductsSubtitle: 'Browse our core portfolio of certified export-grade agricultural commodities, carefully cleaned and prepared for international shipping channels.',
      aboutSectionEnabled: true,
      aboutSectionLabel: 'About Our Company',
      aboutSectionTitle: 'A Trusted Worldwide Export Partner',
      aboutSectionDescription: 'Sat Saheb Trading is a trusted name in the import and export industry, specializing in premium agricultural products for global markets. Our dedication to quality standards and timely delivery has helped us build lasting relationships with clients worldwide, making Sat Saheb Trading a dependable partner in international trade and agricultural exports.',
      aboutSectionImage: '/images/map.png',
      aboutSectionBtnText: 'Read Full Corporate Profile',
      aboutSectionBtnLink: '/about',
      aboutSectionBtnVisible: true,
      logisticsEnabled: true,
      logisticsLabel: 'Global Logistics',
      logisticsTitle: 'Connecting Farms to Global Ports',
      logisticsOriginTitle: 'MUNDRA PORT, INDIA (ORIGIN)',
      logisticsOriginDesc: 'SAT SAHEB TRADING CO. Headquarters & Core Logistics Hub. Directly connected to Mundra Port, Kutches premier trade terminal.',
      logisticsBgImage: '/images/logistics-bg.jpg',
      logisticsMapImage: '/images/map.png',
      reviewsEnabled: true,
      reviewsLabel: 'Global Reviews',
      reviewsTitle: 'What People Say',
      reviewsSubtitle: 'Read comments from our trusted trading partners around the globe.',
      contactSectionEnabled: true,
      contactSectionLabel: 'Get In Touch',
      contactSectionTitle: 'Contact Our Trading Desk',
      contactSectionDescription: 'Ready to discuss your bulk commodity requirements? Get in touch with our team.',
      contactFormTitle: 'Send An Inquiry',
      contactFormSubtitle: 'We typically respond within 1 business day.',
      contactSuccessMsg: 'Thank you! Your inquiry has been received. Our team will contact you shortly.',
      contactErrorMsg: 'Failed to submit inquiry. Please try again later.',
      contactBtnText: 'Submit Inquiry',
      footerDescription: 'SAT SAHEB TRADING CO. is a premier international agro-commodity trading enterprise, sourcing the finest grains, pulses, and spices from verified farming corridors in India.',
      footerCopyright: '© 2026 SAT SAHEB TRADING CO. All rights reserved.',
      socialFacebook: '',
      socialTwitter: '',
      socialLinkedIn: '',
      socialInstagram: '',
    },
    create: {
      id: 1,
      companyName: 'SAT SAHEB TRADING CO.',
      address: 'Office No.126 1st Floor Shakti Shopping Centre, Shakti Nagar Vill: Nana Kapaya Mundra-Kutch, 370421',
      email: 'info@satsahebtrading.com',
      phone1: '+91 90996 67113',
      phone2: '+91 98252 15344',
      whatsappNumber: '+91 90996 67113',
      whatsappDefaultMessage: 'Hello SAT SAHEB TRADING CO., I am interested in your products.',
      googleMapUrl: 'https://maps.google.com/maps?q=Office%20No.126%201st%20Floor%20Shakti%20Shopping%20Centre,%20Shakti%20Nagar%20Vill:%20Nana%20Kapaya%20Mundra-Kutch,%20370421&t=&z=13&ie=UTF8&iwloc=&output=embed',
      preloaderEnabled: true,
      whatsappEnabled: true,
      storyEnabled: true,
      storyLabel: 'Sat Saheb Trading Co.',
      storyTitle: 'Exporting Premium Commodities Worldwide',
      storyDescription: 'We bridge domestic farms to international markets, delivering uncompromised quality with every container. Operating out of Kutches premier shipping corridor, our logistics efficiency guarantees fresh delivery globally.',
      storyBtnText: 'Our Company Story',
      storyBtnLink: '/about',
      storyBtnVisible: true,
      storyImage: '/images/story.jpg',
      storyPillar1Title: 'Premium Sourcing',
      storyPillar1Desc: 'We procure grains and spices directly from verified cultivation belts across India, ensuring rich nutrient values and authentic flavors.',
      storyPillar2Title: 'Strict Quality Control',
      storyPillar2Desc: 'Before shipping, all commodities go through advanced cleaning, grading, sorting, and lab testing parameters to match global guidelines.',
      storyPillar3Title: 'Logistical Splicing',
      storyPillar3Desc: 'Our close proximity to Mundra Port enables immediate container customs check, minimal port delays, and rapid shipping turnarounds.',
      storyPillar4Title: 'Secure Export Packing',
      storyPillar4Desc: 'Commodities are packed in customized heavy-duty PP, Jute, or vacuum sealed bags to shield goods from moisture and temperature swings.',
      featuredProductsEnabled: true,
      featuredProductsLabel: 'Verified Sourcing',
      featuredProductsTitle: 'Special Products for Most People',
      featuredProductsSubtitle: 'Browse our core portfolio of certified export-grade agricultural commodities, carefully cleaned and prepared for international shipping channels.',
      aboutSectionEnabled: true,
      aboutSectionLabel: 'About Our Company',
      aboutSectionTitle: 'A Trusted Worldwide Export Partner',
      aboutSectionDescription: 'Sat Saheb Trading is a trusted name in the import and export industry, specializing in premium agricultural products for global markets. Our dedication to quality standards and timely delivery has helped us build lasting relationships with clients worldwide, making Sat Saheb Trading a dependable partner in international trade and agricultural exports.',
      aboutSectionImage: '/images/map.png',
      aboutSectionBtnText: 'Read Full Corporate Profile',
      aboutSectionBtnLink: '/about',
      aboutSectionBtnVisible: true,
      logisticsEnabled: true,
      logisticsLabel: 'Global Logistics',
      logisticsTitle: 'Connecting Farms to Global Ports',
      logisticsOriginTitle: 'MUNDRA PORT, INDIA (ORIGIN)',
      logisticsOriginDesc: 'SAT SAHEB TRADING CO. Headquarters & Core Logistics Hub. Directly connected to Mundra Port, Kutches premier trade terminal.',
      logisticsBgImage: '/images/logistics-bg.jpg',
      logisticsMapImage: '/images/map.png',
      reviewsEnabled: true,
      reviewsLabel: 'Global Reviews',
      reviewsTitle: 'What People Say',
      reviewsSubtitle: 'Read comments from our trusted trading partners around the globe.',
      contactSectionEnabled: true,
      contactSectionLabel: 'Get In Touch',
      contactSectionTitle: 'Contact Our Trading Desk',
      contactSectionDescription: 'Ready to discuss your bulk commodity requirements? Get in touch with our team.',
      contactFormTitle: 'Send An Inquiry',
      contactFormSubtitle: 'We typically respond within 1 business day.',
      contactSuccessMsg: 'Thank you! Your inquiry has been received. Our team will contact you shortly.',
      contactErrorMsg: 'Failed to submit inquiry. Please try again later.',
      contactBtnText: 'Submit Inquiry',
      footerDescription: 'SAT SAHEB TRADING CO. is a premier international agro-commodity trading enterprise, sourcing the finest grains, pulses, and spices from verified farming corridors in India.',
      footerCopyright: '© 2026 SAT SAHEB TRADING CO. All rights reserved.',
      socialFacebook: '',
      socialTwitter: '',
      socialLinkedIn: '',
      socialInstagram: '',
    },
  });
  console.log('Website settings seeded.');

  // 3. Theme Settings
  await prisma.themeSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      primaryColor: '#06402b',
      secondaryColor: '#d69317',
      accentColor: '#f3f4f6',
      bgPrimary: '#ffffff',
      bgSecondary: '#f9fafb',
      textPrimary: '#111827',
      textSecondary: '#4b5563',
      buttonStyle: 'editorial',
    },
  });
  console.log('Theme settings seeded.');

  // 4. Clean and seed Categories & Products
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const grainsCat = await prisma.category.create({
    data: {
      name: 'Grains & Pulses',
      slug: 'grains-pulses',
      description: 'Premium international grade grains and pulses sourced from major agricultural regions.',
    },
  });

  const spicesCat = await prisma.category.create({
    data: {
      name: 'Spices',
      slug: 'spices',
      description: 'Finest whole spices sorted and cleaned for exporting rich flavor and essential oils.',
    },
  });

  console.log('Categories seeded.');

  const productsData = [
    {
      title: 'Red Kidney Beans',
      slug: 'red-kidney-beans',
      featuredImage: '/images/products/red-kidney-beans.png',
      overview: 'Premium quality Red Kidney Beans, sourced from the finest farms in India, selected for shape, quality, and size.',
      description: 'SAT SAHEB TRADING CO. supplies premium quality Red Kidney Beans (Rajma) to international markets. Sourced directly from local farming communities, our kidney beans undergo strict quality sorting and grading to ensure that only bold, unblemished beans are packed. Rich in proteins, dietary fibers, and essential minerals, they are packed under hygienic conditions to maintain freshness and long shelf-life during export logistics.',
      categoryId: grainsCat.id,
      order: 0,
      specifications: JSON.stringify([
        { key: 'Type', value: 'Red Kidney Beans' },
        { key: 'Moisture', value: 'Max 12-14%' },
        { key: 'Foreign Matter', value: 'Max 0.5%' },
        { key: 'Admixture', value: 'Max 1%' },
        { key: 'Origin', value: 'India' }
      ]),
    },
    {
      title: 'Brown Chana',
      slug: 'brown-chana',
      featuredImage: '/images/products/brown-chana.png',
      overview: 'Superior grade Brown Chana (Desi Chickpeas), packed with nutrition and sourced with care.',
      description: 'Our Brown Chana represents the premium standard of Desi Chickpeas, selected for uniform size, color, and texture. SAT SAHEB TRADING CO. ensures that our chickpeas are cleaned, processed, and packed in heavy-duty export packaging. They are rich in fiber and proteins, making them a staple choice globally.',
      categoryId: grainsCat.id,
      order: 1,
      specifications: JSON.stringify([
        { key: 'Type', value: 'Desi Chickpeas (Brown Chana)' },
        { key: 'Size', value: '7mm - 8mm' },
        { key: 'Moisture', value: 'Max 12%' },
        { key: 'Foreign Matter', value: 'Nil' },
        { key: 'Origin', value: 'India' }
      ]),
    },
    {
      title: 'Chana Dal',
      slug: 'chana-dal',
      featuredImage: '/images/products/chana-dal.png',
      overview: 'Split Bengal Gram processed under strict hygienic conditions for rich taste and texture.',
      description: 'SAT SAHEB TRADING CO. provides premium split Bengal Gram (Chana Dal). De-husked and split with care, it retains its natural nutrients and authentic flavor. Checked for purity and clean sorting to meet international export specifications.',
      categoryId: grainsCat.id,
      order: 2,
      specifications: JSON.stringify([
        { key: 'Moisture', value: 'Max 10-12%' },
        { key: 'Admixture', value: 'Max 0.5%' },
        { key: 'Weevilled', value: 'Nil' },
        { key: 'Origin', value: 'India' }
      ]),
    },
    {
      title: 'Kabuli Chana',
      slug: 'kabuli-chana',
      featuredImage: '/images/products/kabuli-chana.png',
      overview: 'Bold white Chickpeas, highly valued for premium texture, taste, and large sizing.',
      description: 'Sourced from the finest chickpea growing regions of India, our Kabuli Chana is premium sorted. Famous for its bold size, high protein content, and tasty flavor, we export Kabuli Chana in sizes ranging from 7mm to 12mm depending on buyer requirements.',
      categoryId: grainsCat.id,
      order: 3,
      specifications: JSON.stringify([
        { key: 'Size', value: '8mm, 9mm, 10mm, 11mm, 12mm' },
        { key: 'Moisture', value: 'Max 12%' },
        { key: 'Foreign Matter', value: 'Max 0.2%' },
        { key: 'Origin', value: 'India' }
      ]),
    },
    {
      title: 'Toor Dal',
      slug: 'toor-dal',
      featuredImage: '/images/products/toor-dal.png',
      overview: 'Premium Split Pigeon Peas, sorted for uniform golden-yellow color and rich nutritional values.',
      description: 'Sourced and processed with advanced machinery, our Toor Dal (Split Pigeon Peas) is graded for purity and taste. SAT SAHEB TRADING CO. distributes high-quality Toor Dal with low moisture content and zero additives, preserving its natural texture and aroma.',
      categoryId: grainsCat.id,
      order: 4,
      specifications: JSON.stringify([
        { key: 'Purity', value: '99.9%' },
        { key: 'Moisture', value: 'Max 10-11%' },
        { key: 'Foreign Matter', value: 'Nil' },
        { key: 'Origin', value: 'India' }
      ]),
    },
    {
      title: 'Matar',
      slug: 'matar',
      featuredImage: '/images/products/matar.png',
      overview: 'Dried green and white peas, premium graded for processing, packing, and culinary use.',
      description: 'Our dried peas (Matar) are harvested at optimal maturity to ensure excellent size, natural green/white color, and robust texture. Graded closely to prevent damaged or discolored grains, ensuring excellent quality exports.',
      categoryId: grainsCat.id,
      order: 5,
      specifications: JSON.stringify([
        { key: 'Type', value: 'Dried Peas (Green/White)' },
        { key: 'Moisture', value: 'Max 13%' },
        { key: 'Foreign Matter', value: 'Max 0.5%' },
        { key: 'Origin', value: 'India' }
      ]),
    },
    {
      title: 'Chitra Rajma',
      slug: 'chitra-rajma',
      featuredImage: '/images/products/chitra-rajma.png',
      overview: 'Speckled kidney beans of high grade, sourced from high-altitude regions for rich flavor.',
      description: 'Chitra Rajma (Light Speckled Kidney Beans) is highly demanded in international markets for its soft texture and rapid cooking properties. Our beans are machine-sorted and hand-picked to deliver the most consistent premium quality possible.',
      categoryId: grainsCat.id,
      order: 6,
      specifications: JSON.stringify([
        { key: 'Type', value: 'Light Speckled Kidney Beans' },
        { key: 'Moisture', value: 'Max 13%' },
        { key: 'Foreign Matter', value: 'Max 0.5%' },
        { key: 'Origin', value: 'India' }
      ]),
    },
    {
      title: 'Lobia',
      slug: 'lobia',
      featuredImage: '/images/products/lobia.png',
      overview: 'Premium Black-Eyed Peas, cleaned and graded for uniform size and bold cream color.',
      description: 'SAT SAHEB TRADING CO. exports premium Black-Eyed Peas (Lobia). Known for their delicate flavor and creamy texture, our black-eyed peas are double-polished and sorted for purity, ensuring no splits or foreign matter remain.',
      categoryId: grainsCat.id,
      order: 7,
      specifications: JSON.stringify([
        { key: 'Purity', value: '99.5%' },
        { key: 'Moisture', value: 'Max 12%' },
        { key: 'Size', value: 'Regular to Bold' },
        { key: 'Origin', value: 'India' }
      ]),
    },
    {
      title: 'Green Mung Whole',
      slug: 'green-mung-whole',
      featuredImage: '/images/products/green-mung-whole.png',
      overview: 'Whole Green Mung Beans, selected for high germination rate and bright green color.',
      description: 'Our Green Mung Whole beans are sourced from premium agricultural zones, cleaned, and sorted. We offer high-quality mung beans suitable for sprouting as well as culinary applications, packed in customized bags for international shipping.',
      categoryId: grainsCat.id,
      order: 8,
      specifications: JSON.stringify([
        { key: 'Moisture', value: 'Max 12%' },
        { key: 'Foreign Matter', value: 'Max 0.5%' },
        { key: 'Admixture', value: 'Max 0.5%' },
        { key: 'Origin', value: 'India' }
      ]),
    },
    {
      title: 'Moong Dal',
      slug: 'moong-dal',
      featuredImage: '/images/products/moong-dal.png',
      overview: 'Split and de-husked Yellow Mung Beans, processed for optimal purity and fast cooking.',
      description: 'SAT SAHEB TRADING CO. exports premium Yellow Moong Dal. Split and polished under absolute hygienic parameters, this dal is extremely light, nutritious, and cook-friendly, matching global standards.',
      categoryId: grainsCat.id,
      order: 9,
      specifications: JSON.stringify([
        { key: 'Moisture', value: 'Max 11%' },
        { key: 'Foreign Matter', value: 'Nil' },
        { key: 'Admixture', value: 'Max 0.5%' },
        { key: 'Origin', value: 'India' }
      ]),
    },
    {
      title: 'White Urid',
      slug: 'white-urid',
      featuredImage: '/images/products/white-urid.png',
      overview: 'De-husked split and whole Black Gram (Urad Dal), processed for high quality and purity.',
      description: 'Our White Urid is processed with state-of-the-art machinery to remove the black husks while preserving the grain shape. Sourced from regions that specialize in top-grade cultivation, it is highly demanded for food processing applications worldwide.',
      categoryId: grainsCat.id,
      order: 10,
      specifications: JSON.stringify([
        { key: 'Type', value: 'De-husked Split / Whole Urad' },
        { key: 'Moisture', value: 'Max 12%' },
        { key: 'Foreign Matter', value: 'Nil' },
        { key: 'Origin', value: 'India' }
      ]),
    },
    {
      title: 'Cumin Seeds',
      slug: 'cumin-seeds',
      featuredImage: '/images/products/cumin-seeds.png',
      overview: 'Aromatic and bold Cumin Seeds (Jeera), highly rich in volatile oil content and flavor.',
      description: 'SAT SAHEB TRADING CO. is a premier exporter of bold Indian Cumin Seeds (Jeera). Sourced from fertile cultivation belts in Gujarat and Rajasthan, our cumin seeds are carefully cleaned and sorted to guarantee high purity, excellent volatile oil content, and high aroma. Free from chemical residues and dust, we export them in standard and custom-sized jute or PP bags.',
      categoryId: spicesCat.id,
      order: 11,
      specifications: JSON.stringify([
        { key: 'Purity', value: '99.5% (Singapore Grade)' },
        { key: 'Moisture', value: 'Max 9%' },
        { key: 'Admixture', value: 'Max 0.5%' },
        { key: 'Volatile Oil', value: 'Min 2%' },
        { key: 'Origin', value: 'India (Gujarat/Rajasthan)' }
      ]),
    },
  ];

  for (const prod of productsData) {
    const createdProduct = await prisma.product.create({
      data: prod,
    });
    // Create an initial product image entry in the gallery
    await prisma.productImage.create({
      data: {
        url: prod.featuredImage,
        productId: createdProduct.id,
        order: 0,
      },
    });
  }
  console.log('Products and galleries seeded.');

  // 5. Clean and seed Partners
  await prisma.partner.deleteMany();
  await prisma.partner.createMany({
    data: [
      {
        name: 'RAMESH MAHESHWARI',
        role: 'Founder',
        description: 'Founder of SAT SAHEB TRADING CO., Ramesh brings years of deep expertise in commodity sourcing, quality inspection, and international logistics. He oversees domestic procurement and relations with local farming associations to maintain our supply standards.',
        phone: '+91 90996 67113',
        imageUrl: '/images/partners/ramesh-maheshwari.jpeg',
        order: 0,
        isVisible: true,
      },
      {
        name: 'JITENDRA CHAUDHARI',
        role: 'Co-founder',
        description: 'Co-founder of SAT SAHEB TRADING CO., Jitendra leads global business development, trade partnerships, and financial operations. Under his leadership, the company has expanded its network to trade agricultural commodities across several international borders.',
        phone: '+91 98252 15344',
        imageUrl: '/images/partners/jitendra-chaudhari.png',
        order: 1,
        isVisible: true,
      },
    ],
  });
  console.log('Partners seeded.');

  // 6. Clean and seed Testimonials
  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({
    data: [
      {
        name: 'Ahmed Al-Mansoori',
        review: 'A reliable trading partner with professional service and premium agricultural products. We have been highly satisfied with every order.',
        rating: 5,
        order: 0,
        isEnabled: true,
      },
      {
        name: 'Sophie Dubois',
        review: 'Their commitment to quality and customer satisfaction is impressive. The entire import process was smooth and hassle-free.',
        rating: 5,
        order: 1,
        isEnabled: true,
      },
      {
        name: 'Rajesh Sharma',
        review: 'We received top-grade products with excellent packaging standards. Sat Saheb Trading has become one of our trusted suppliers.',
        rating: 5,
        order: 2,
        isEnabled: true,
      },
      {
        name: 'Marcus Lim',
        review: 'Professional team, competitive pricing, and timely delivery. We appreciate their dedication to maintaining international quality standards.',
        rating: 5,
        order: 3,
        isEnabled: true,
      },
      {
        name: 'Elena Rostova',
        review: 'Sat Saheb Trading delivered excellent quality rice exactly as promised. The packaging was secure, shipment was on time, and communication throughout the process was outstanding.',
        rating: 5,
        order: 4,
        isEnabled: true,
      },
    ],
  });
  console.log('Testimonials seeded.');

  // 7. Clean and seed Hero Slides
  await prisma.heroSlide.deleteMany();
  await prisma.heroSlide.createMany({
    data: [
      {
        title: 'GLOBAL REACH. TRUSTED PARTNER.',
        subtitle: 'SAT SAHEB TRADING CO.',
        description: 'SAT SAHEB TRADING CO. is a trusted merchant exporter, delivering premium quality agricultural commodities worldwide with integrity, reliability, and commitment.',
        imageUrl: '/images/slides/hero1.jpg',
        primaryCtaText: 'Browse Grains & Pulses',
        primaryCtaLink: '/products',
        secondaryCtaText: 'Contact Our Trading Desk',
        secondaryCtaLink: '/contact',
        alignment: 'left',
        order: 0,
        isEnabled: true,
      },
      {
        title: 'GLOBAL VISION. TRUSTED PARTNER.',
        subtitle: 'CONNECTING MARKETS. DELIVERING EXCELLENCE.',
        description: 'Bridging domestic cultivation belts to global trade hubs, delivering premium quality products with optimized logistical transit timelines.',
        imageUrl: '/images/slides/hero2.jpg',
        primaryCtaText: 'Browse Spices',
        primaryCtaLink: '/products',
        secondaryCtaText: 'Learn More About Us',
        secondaryCtaLink: '/about',
        alignment: 'left',
        order: 1,
        isEnabled: true,
      },
      {
        title: 'YOUR GROWTH. OUR MISSION.',
        subtitle: 'EMPOWERING BUSINESSES ACROSS THE GLOBE',
        description: 'We don\'t just trade, we build long-term international trade partnerships based on absolute transparency, quality, and mutual success.',
        imageUrl: '/images/slides/hero3.jpg',
        primaryCtaText: 'Send Trade Inquiry',
        primaryCtaLink: '/contact',
        secondaryCtaText: 'View Corporate Gallery',
        secondaryCtaLink: '/gallery',
        alignment: 'left',
        order: 2,
        isEnabled: true,
      },
    ],
  });
  console.log('Hero slides seeded.');

  // 7. Seed Logistics Nodes
  await prisma.logisticsNode.deleteMany();
  await prisma.logisticsNode.createMany({
    data: [
      {
        name: 'Mundra Port, India (Origin)',
        xCoord: 67,
        yCoord: 55,
        info: 'SAT SAHEB TRADING CO. Headquarters & Core Logistics Hub. Directly connected to Mundra Port, Kutches premier trade terminal.',
        type: 'hub',
        isEnabled: true,
        order: 0,
      },
      {
        name: 'Gulf Cooperation Council (GCC)',
        xCoord: 58,
        yCoord: 53,
        info: 'High demand export route for premium Grains, Pulses, and Cumin Seeds.',
        type: 'destination',
        isEnabled: true,
        order: 1,
      },
      {
        name: 'European Union Portals',
        xCoord: 50,
        yCoord: 35,
        info: 'Premium quality compliance shipments, including hand-selected kidney beans and whole seed exports.',
        type: 'destination',
        isEnabled: true,
        order: 2,
      },
      {
        name: 'South-East Asian Ports',
        xCoord: 78,
        yCoord: 62,
        info: 'Fast shipping transit route for wholesale pulses, chick peas, and red kidney beans.',
        type: 'destination',
        isEnabled: true,
        order: 3,
      },
      {
        name: 'North American Hubs',
        xCoord: 25,
        yCoord: 38,
        info: 'Custom graded packaging and specifications matching strict import control guidelines.',
        type: 'destination',
        isEnabled: true,
        order: 4,
      },
    ]
  });
  console.log('Logistics nodes seeded.');

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
