const SAMPLE_CATEGORIES = [
    { id: "1", name: "Electronics & Components", icon: "📱" },
    { id: "2", name: "Apparel & Fashion", icon: "👕" },
    { id: "3", name: "Home & Garden", icon: "🏡" },
    { id: "4", name: "Health & Beauty", icon: "💊" },
    { id: "5", name: "Machinery & Equipment", icon: "🔨" },
    { id: "6", name: "Automotive Parts", icon: "🚗" },
    { id: "7", name: "Construction Materials", icon: "🏗️" },
    { id: "8", name: "Food & Beverages", icon: "🍔" },
    { id: "9", name: "Packaging & Printing", icon: "📦" },
    { id: "10", name: "Sports & Entertainment", icon: "🎮" },
    { id: "11", name: "Textiles & Leather", icon: "👔" },
    { id: "12", name: "Tools & Hardware", icon: "🛠️" },
    { id: "13", name: "Chemical & Plastics", icon: "🧪" },
    { id: "14", name: "Agriculture & Farming", icon: "🌾" },
    { id: "15", name: "Office & School Supplies", icon: "📚" },
  ];

export const getCategories = () => {
    return SAMPLE_CATEGORIES;
  };

export const getCategoryById = (id) => {
    return SAMPLE_CATEGORIES.find((category) => category.id === id);
  };