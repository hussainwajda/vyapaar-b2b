const taxData = {
    "Electronics & Components": {
        gst_rate: "18%", // Common rate, but sub-categories vary.
        sub_categories: {
            "Mobile Phones & Accessories": "12%",
            "Computers & Laptops": "12%",
            "TVs & Home Audio": "18%", // Some high-end TVs can be 28%.
            "Cameras & Photography": "18%",
            "Wearable Technology": "18%",
            "Electronic Components": "18%",
            "Security & Surveillance": "18%",
            "Gaming Consoles & Accessories": "18%",
            "Office Electronics": "18%", // Printers, scanners, etc.
            "Car & Vehicle Electronics": "28%", // Often treated as automotive parts.
        }
    },
    "Apparel & Fashion": {
        gst_rate: "5% / 12%", // Common rate for garments and footwear.
        sub_categories: {
            "Men's Apparel": "5% / 12%", // 5% for value up to ₹1000, 12% above ₹1000.
            "Women's Apparel": "5% / 12%", // 5% for value up to ₹1000, 12% above ₹1000.
            "Kids' Apparel": "5% / 12%", // 5% for value up to ₹1000, 12% above ₹1000.
            "Activewear": "12%",
            "Outerwear": "12%",
            "Footwear": "5% / 12%", // 5% for value up to ₹1000, 12% above ₹1000.
            "Bags & Luggage": "18%",
            "Jewelry & Accessories": "3%", // Precious metals and stones are 3% (gold, diamonds). Imitation jewellery is also 3%.
            "Undergarments & Sleepwear": "5% / 12%", // 5% for value up to ₹1000, 12% above ₹1000.
        }
    },
    "Home & Garden": {
        gst_rate: "18%", // Common rate, but some small home appliances are 18%, larger ones (ACs, Refrigerators) are 28%.
        sub_categories: {
            "Furniture": "18%",
            "Home Decor": "18%",
            "Kitchen & Dining": "12% / 18%", // Cookware and some utensils are 12%, others 18%.
            "Bedding & Bath": "12%", // Textile-based items like bedsheets, towels.
            "Lighting": "18%",
            "Gardening Tools & Equipment": "18%",
            "Outdoor Living": "18%",
            "Home Improvement Supplies": "18%", // Excludes specific construction materials.
            "Cleaning Supplies": "18%",
            "Smart Home Devices": "18%",
        }
    },
    "Health & Beauty": {
        gst_rate: "18%", // Common rate, but life-saving drugs are 5%. Healthcare services by registered practitioners are 0%.
        sub_categories: {
            "Skincare": "18%", // Luxury skincare can be 28%.
            "Makeup": "18%", // Luxury makeup can be 28%.
            "Haircare": "18%",
            "Fragrances": "18%", // Luxury fragrances can be 28%.
            "Bath & Body": "18%",
            "Vitamins & Supplements": "18%",
            "Personal Care Appliances": "18%",
            "Oral Care": "18%",
            "Health Monitors & Tests": "12% / 18%", // Medical devices are often 12%.
        }
    },
    "Machinery & Equipment": {
        gst_rate: "18%", // Common rate, but agricultural machinery is 12%.
        sub_categories: {
            "Heavy Construction Machinery": "18%",
            "Industrial Manufacturing Equipment": "18%",
            "Agricultural Machinery": "12%",
            "Material Handling Equipment": "18%",
            "Power Generation Equipment": "18%",
            "Packaging Machinery": "18%",
            "Textile Machinery": "18%",
            "Metalworking Machinery": "18%",
            "Woodworking Machinery": "18%",
            "Pumps & Compressors": "18%",
        }
    },
    "Automotive Parts": {
        gst_rate: "28%", // Common rate, but some lubricants and fluids are 18%.
        sub_categories: {
            "Engine Parts": "28%",
            "Brake Systems": "28%",
            "Suspension & Steering": "28%",
            "Electrical & Lighting Parts": "28%",
            "Exhaust Systems": "28%",
            "Automotive Accessories": "28%", // Some minor accessories might be 18%.
            "Tires & Wheels": "28%",
            "Body & Exterior Parts": "28%",
            "Interior Parts": "28%",
        }
    },
    "Construction Materials": {
        gst_rate: "18%", // Common rate, but cement is 28%. Bricks and blocks are 5% or 12%.
        sub_categories: {
            "Cement & Concrete": "28%",
            "Bricks & Blocks": "5% / 12%", // Clay bricks are 5%, fly ash bricks 12%.
            "Lumber & Wood Products": "18%",
            "Steel & Metal Products": "18%",
            "Roofing Materials": "18%",
            "Insulation": "18%",
            "Pipes & Fittings": "18%",
            "Aggregates (Sand, Gravel)": "5%",
            "Tiles & Flooring": "18%",
            "Paints & Coatings": "18%",
        }
    },
    "Food & Beverages": {
        gst_rate: "0% / 5% / 12% / 18% / 28%", // Wide range of rates.
        sub_categories: {
            "Fresh Produce (Fruits, Vegetables)": "0%", // Unpacked and fresh.
            "Meat, Poultry & Seafood": "0% / 12%", // Fresh/unprocessed is 0%, processed/frozen is 12%.
            "Dairy & Eggs": "0% / 5% / 12%", // Unpacked milk/eggs 0%, packaged milk 5%, cheese/butter 12%.
            "Baked Goods & Snacks": "5% / 18%", // Basic bread 0%, biscuits/cakes 18%.
            "Beverages (Non-Alcoholic)": "18% / 28%", // Mineral water, fruit juice 18%. Aerated drinks are 28% + cess.
            "Alcoholic Beverages": "Excluded from GST", // Subject to State Excise Duty & VAT.
            "Grains, Pasta & Oils": "0% / 5% / 12%", // Unpacked foodgrains 0%, packaged 5%, edible oils 5%.
            "Confectionery & Sweets": "18%",
            "Spices & Condiments": "5% / 12%", // Some spices are 5%, others 12%.
        }
    },
    "Packaging & Printing": {
        gst_rate: "18%",
        sub_categories: {
            "Flexible Packaging": "18%",
            "Rigid Packaging": "18%",
            "Paper & Cardboard Packaging": "18%",
            "Plastic Packaging": "18%",
            "Metal Packaging": "18%",
            "Commercial Printing": "18%",
            "Marketing & Promotional Printing": "18%",
            "Labels & Tags Printing": "18%",
            "Packaging Printing": "18%",
            "Specialty Printing": "18%",
        }
    },
    "Sports & Entertainment": {
        gst_rate: "18%", // Common rate, but books are 0%.
        sub_categories: {
            "Team Sports Equipment": "12% / 18%", // Some basic equipment 12%, others 18%.
            "Individual Sports Equipment": "12% / 18%", // Some basic equipment 12%, others 18%.
            "Fitness & Exercise Equipment": "18%",
            "Outdoor Recreation Gear": "18%",
            "Sports Apparel & Footwear": "5% / 12%", // Same as general apparel/footwear rules.
            "Musical Instruments": "12% / 18%", // Some basic instruments 12%, others 18%.
            "Board Games & Puzzles": "12% / 18%", // Some toys/games 12%, others 18%.
            "Video Games & Accessories": "18%",
            "Party & Event Supplies": "18%",
        }
    },
    "Textiles & Leather": {
        gst_rate: "5% / 12% / 18%", // Fabrics are 5%. Leather goods are generally 18%.
        sub_categories: {
            "Natural Fibers (Cotton, Silk, Wool)": "5%",
            "Synthetic Fibers": "5%",
            "Woven Fabrics": "5%",
            "Knitted Fabrics": "5%",
            "Home Textiles (Bedding, Curtains)": "12%",
            "Industrial Textiles": "12% / 18%",
            "Leather Hides & Skins": "5%",
            "Leather Apparel": "12%",
            "Leather Footwear": "5% / 12%", // 5% for value up to ₹1000, 12% above ₹1000.
            "Leather Goods & Accessories": "18%",
        }
    },
    "Tools & Hardware": {
        gst_rate: "18%",
        sub_categories: {
            "Hand Tools": "18%",
            "Power Tools": "18%",
            "Tool Storage & Organization": "18%",
            "Fasteners (Screws, Nails, Bolts)": "18%",
            "Adhesives & Sealants": "18%",
            "Plumbing Hardware": "18%",
            "Electrical Hardware": "18%",
            "Locks & Security Hardware": "18%",
            "Building Hardware": "18%",
        }
    },
    "Chemical & Plastics": {
        gst_rate: "18%", // Common rate, but fertilizers are 5%.
        sub_categories: {
            "Basic Chemicals": "18%",
            "Specialty Chemicals": "18%",
            "Polymers & Resins": "18%",
            "Plastic Raw Materials": "18%",
            "Additives & Dyes": "18%",
            "Adhesives & Sealants (Chemical)": "18%",
            "Industrial Gases": "18%",
            "Fine Chemicals": "18%",
            "Thermoplastics": "18%",
            "Composites": "18%",
        }
    },
    "Agriculture & Farming": {
        gst_rate: "0% / 5% / 12% / 18%", // Wide range of rates.
        sub_categories: {
            "Crop Production (Grains, Fruits, Vegetables)": "0% / 5%", // Fresh produce 0%, packaged foodgrains 5%.
            "Animal Production (Livestock, Poultry)": "0% / 12%", // Live animals 0%, processed meat 12%.
            "Farm Machinery & Equipment": "12% / 18%", // Some machinery 12%, others 18%.
            "Fertilizers & Pesticides": "5% / 18%", // Fertilizers 5%, Pesticides 18%.
            "Seeds & Seedlings": "0%", // For sowing.
            "Animal Feed & Supplements": "0%", // Animal feed is 0%.
            "Irrigation Systems": "12% / 18%",
            "Aquaculture Products": "0% / 12%", // Fresh 0%, processed 12%.
            "Agricultural Services": "0%", // Certain services are exempt.
        }
    },
    "Office & School Supplies": {
        gst_rate: "12% / 18%", // Common rate, but books are 0%.
        sub_categories: {
            "Writing Instruments": "12% / 18%", // Pens, pencils are 12%, higher-end 18%.
            "Paper Products": "12%", // Notebooks, printing paper.
            "Desk Accessories & Organizers": "18%",
            "Filing & Storage Solutions": "18%",
            "School Bags & Backpacks": "18%",
            "Art & Craft Supplies": "12% / 18%", // Some items 12%, others 18%.
            "Calculators & Office Electronics": "18%",
            "Boardroom & Presentation Supplies": "18%",
            "Educational Supplies": "12% / 18%", // Books are 0%.
        }
    }
};

export function getTaxRate(category, subCategory) {
    const categoryData = taxData[category];

    if (!categoryData) {
        console.log(`Category "${category}" not found.`);
        return null; // Category not found
    }

    // If a subCategory is provided, try to find its specific tax rate.
    if (subCategory) {
        const subCategoryData = categoryData.sub_categories && categoryData.sub_categories[subCategory];
        console.log(`Subcategory "${subCategory}" found for category "${category}".`);
        if (subCategoryData) {
            return subCategoryData;
        } else {
            console.log(`Subcategory "${subCategory}" not found for category "${category}". Returning general category rate.`);
            // If subcategory not found, fall back to the general category rate.
            return categoryData.gst_rate;
        }
    }

    // If no subCategory is provided, return the general category tax rate.
    return categoryData.gst_rate;
}