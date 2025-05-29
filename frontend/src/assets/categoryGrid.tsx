import { Link } from "react-router-dom";
import {
  Smartphone,
  Shirt,
  Home,
  Heart,
  Wrench,
  Car,
  Building,
  Coffee,
  Package,
  Gamepad2,
  Scissors,
  Hammer,
  FlaskConical,
  Wheat,
  BookOpen,
} from "lucide-react"

const SAMPLE_CATEGORIES = [
  { id: "1", name: "Electronics & Components", icon: Smartphone },
  { id: "2", name: "Apparel & Fashion", icon: Shirt },
  { id: "3", name: "Home & Garden", icon: Home },
  { id: "4", name: "Health & Beauty", icon: Heart },
  { id: "5", name: "Machinery & Equipment", icon: Wrench },
  { id: "6", name: "Automotive Parts", icon: Car },
  { id: "7", name: "Construction Materials", icon: Building },
  { id: "8", name: "Food & Beverages", icon: Coffee },
  { id: "9", name: "Packaging & Printing", icon: Package },
  { id: "10", name: "Sports & Entertainment", icon: Gamepad2 },
  { id: "11", name: "Textiles & Leather", icon: Scissors },
  { id: "12", name: "Tools & Hardware", icon: Hammer },
  { id: "13", name: "Chemical & Plastics", icon: FlaskConical },
  { id: "14", name: "Agriculture & Farming", icon: Wheat },
  { id: "15", name: "Office & School Supplies", icon: BookOpen },
]

export default function CategoryGrid() {
  return (
    <div className="w-full bg-[var(--color-primary)] text-[var(--color-heading)] px-6 md:px-20 p-6">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {SAMPLE_CATEGORIES.map((category) => {
          const IconComponent = category.icon
          const categorySlug = category.name.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and")

          return (
            <Link
              id="category"
              key={category.id}
              to={`/product/trade/search?searchKeywords=${category.name}`}
              className="group flex flex-col items-center space-y-3 p-4 rounded-lg transition-all duration-200 hover:bg-gray-50 hover:shadow-md"
            >
              <div id className="relative w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full transition-all duration-200 group-hover:bg-orange-100 group-hover:scale-110">
                <IconComponent
                  className="w-8 h-8 text-gray-600 transition-colors duration-200 group-hover:text-orange-600"
                  strokeWidth={1.5}
                />
              </div>
              <span className="text-sm text-[var(--color-heading)] text-center leading-tight font-medium group-hover:text-gray-900 transition-colors duration-200">
                {category.name}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
