const SAMPLE_CATEGORIES = [
    { id: "1", name: "Electronics & Components" },
    { id: "2", name: "Apparel & Fashion" },
    { id: "3", name: "Home & Garden" },
    { id: "4", name: "Health & Beauty" },
    { id: "5", name: "Machinery & Equipment" },
    { id: "6", name: "Automotive Parts" },
    { id: "7", name: "Construction Materials" },
    { id: "8", name: "Food & Beverages" },
    { id: "9", name: "Packaging & Printing" },
    { id: "10", name: "Sports & Entertainment" },
    { id: "11", name: "Textiles & Leather" },
    { id: "12", name: "Tools & Hardware" },
    { id: "13", name: "Chemical & Plastics" },
    { id: "14", name: "Agriculture & Farming" },
    { id: "15", name: "Office & School Supplies" }
  ];

export const getCategories = () => {
    return SAMPLE_CATEGORIES;
  };

export const getCategoryById = (id) => {
    return SAMPLE_CATEGORIES.find((category) => category.id === id);
  };