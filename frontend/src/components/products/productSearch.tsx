import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Heart, ShoppingCart, MessageCircle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import axios from "axios"

interface Product {
  _id: string
  manufacturerEmail: string
  title: string
  description: string
  category: string
  price: number
  minOrderQuantity: number
  stock: number
  images: string[]
  videos: string[]
  specifications: string
  status: string
  pricingTiers: Array<{
    minQty: number
    maxQty: number
    price: number
  }>
  variants: Array<{
    name: string
    options: Array<{
      label: string
      value: string
      priceModifier: number
      stockModifier: number
    }>
  }>
  dimensions: {
    length: number
    width: number
    height: number
    weight: number
    unit: string
  }
  materials: string
  certifications: string[]
  warranty: string
  leadTime: string
  customizable: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
}

interface FilterState {
  category: string
  minOrder: string
  searchWithin: string
  priceRange: { min: string; max: string }
}

export default function ProductSearch() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterState>({
    category: "",
    minOrder: "",
    searchWithin: "",
    priceRange: { min: "", max: "" },
  })
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({})

  const [searchParams] = useSearchParams();
  const searchKeywords = searchParams.get("searchKeywords") || "";

  useEffect(() => {
    fetchProducts()
  }, [searchKeywords])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/product/trade/search?searchKeywords=${encodeURIComponent(searchKeywords)}`,
      )

      console.log(response);
      setProducts(response.data.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const highlightKeywords = (text: string, keywords: string) => {
    if (!keywords) return text

    const keywordArray = keywords.split(" ").filter((k) => k.length > 0)
    let highlightedText = text

    keywordArray.forEach((keyword) => {
      const regex = new RegExp(`(${keyword})`, "gi")
      highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 px-1">$1</mark>')
    })

    return highlightedText
  }

  const nextImage = (productId: string, totalImages: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % totalImages,
    }))
  }

  const prevImage = (productId: string, totalImages: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) - 1 + totalImages) % totalImages,
    }))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600 text-xl">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-primary)] text-[var(--color-heading)]">
      {/* Left Sidebar - Filters */}
      <div className="w-64 text-[var(--color-heading)] shadow-sm p-4 space-y-6">
        <div>
          <h3 className="font-semibold text-[var(--color-heading)] mb-3">Category</h3>
          <Input
            placeholder="Select category"
            value={filters.category}
            onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
          />
        </div>

        <div>
          <h3 className="font-semibold text-[var(--color-heading)] mb-3">Product Features</h3>
          <Input placeholder="Enter features" />
        </div>

        <div>
          <h3 className="font-semibold text-[var(--color-heading)] mb-3">Min Order</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Less Than"
              value={filters.minOrder}
              onChange={(e) => setFilters((prev) => ({ ...prev, minOrder: e.target.value }))}
            />
            <Button variant="outline" size="sm">
              OK
            </Button>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-[var(--color-heading)] mb-3">Search Within</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Enter Attributes"
              value={filters.searchWithin}
              onChange={(e) => setFilters((prev) => ({ ...prev, searchWithin: e.target.value }))}
            />
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-[var(--color-heading)] mb-3">Price Range</h3>
          <div className="space-y-2">
            <Input
              placeholder="Min Price"
              value={filters.priceRange.min}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  priceRange: { ...prev.priceRange, min: e.target.value },
                }))
              }
            />
            <Input
              placeholder="Max Price"
              value={filters.priceRange.max}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  priceRange: { ...prev.priceRange, max: e.target.value },
                }))
              }
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--color-heading)] mb-2">Search Results for "{searchKeywords}"</h1>
          <p className="text-gray-600">{products.length} products found</p>
        </div>

        <div className="space-y-4">
          {products.map((product) => {
            const currentImg = currentImageIndex[product._id] || 0
            const hasImages = product.images && product.images.length > 0

            return (
              <Card onClick={() => navigate(`/product/${product._id}`)} key={product._id} className="overflow-hidden hover:shadow-lg cursor-pointer transition-shadow bg-[var(--color-secondary)]">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="relative w-48 h-48 flex-shrink-0">
                      {hasImages ? (
                        <>
                          <img
                            src={product.images[currentImg] || "/placeholder.svg?height=200&width=200"}
                            alt={product.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          {product.images.length > 1 && (
                            <>
                              <button
                                onClick={() => prevImage(product._id, product.images.length)}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70"
                              >
                                ‹
                              </button>
                              <button
                                onClick={() => nextImage(product._id, product.images.length)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70"
                              >
                                ›
                              </button>
                              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                                {currentImg + 1}/{product.images.length}
                              </div>
                            </>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400">No Image</span>
                        </div>
                      )}
                      <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                        <Heart className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="mb-4">
                        <h3
                          className="text-lg font-semibold text-[var(--color-heading)] mb-2 leading-tight"
                          dangerouslySetInnerHTML={{
                            __html: highlightKeywords(product.title, searchKeywords),
                          }}
                        />

                        <div className="flex items-center gap-4 mb-3">
                          <span className="text-2xl font-bold text-red-600">{formatPrice(product.price)}</span>
                          <span className="text-gray-500">/ Set (FOB Price)</span>
                        </div>

                        <div className="text-sm text-gray-600 mb-4">{product.minOrderQuantity} Set (MOQ)</div>
                      </div>

                      {/* Product Specifications Grid */}
                      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm mb-4">
                        {product.warranty && (
                          <>
                            <span className="text-gray-600">Warranty:</span>
                            <span className="text-gray-900">{product.warranty}</span>
                          </>
                        )}
                        {product.category && (
                          <>
                            <span className="text-gray-600">Type:</span>
                            <span className="text-gray-900">{product.category}</span>
                          </>
                        )}
                        {product.materials && (
                          <>
                            <span className="text-gray-600">Material:</span>
                            <span className="text-gray-900">{product.materials}</span>
                          </>
                        )}
                        {product.leadTime && (
                          <>
                            <span className="text-gray-600">Lead Time:</span>
                            <span className="text-gray-900">{product.leadTime}</span>
                          </>
                        )}
                        {product.certifications && product.certifications.length > 0 && (
                          <>
                            <span className="text-gray-600">Certification:</span>
                            <span className="text-gray-900">{product.certifications.join(", ")}</span>
                          </>
                        )}
                        {product.customizable && (
                          <>
                            <span className="text-gray-600">Customizable:</span>
                            <span className="text-gray-900">Yes</span>
                          </>
                        )}
                      </div>

                      {/* Supplier Info */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600 hover:underline cursor-pointer font-medium">
                            {product.manufacturerEmail}
                          </span>
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                            Audited
                          </Badge>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button className="bg-red-600 hover:bg-red-700 text-white">Contact Now</Button>
                        <Button variant="outline" className="flex text-[var(--color-heading)] items-center gap-2">
                          <ShoppingCart className="h-4 w-4" />
                          Inquire Now
                        </Button>
                        <Button variant="outline" className="flex text-[var(--color-heading)] items-center gap-2">
                          <MessageCircle className="h-4 w-4" />
                          Chat with Supplier
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found for "{searchKeywords}"</p>
          </div>
        )}
      </div>
    </div>
  )
}
