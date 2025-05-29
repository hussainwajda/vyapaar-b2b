import { useState, useEffect } from "react";
import {  useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Star, 
  Heart, 
  Share2, 
  ShoppingCart, 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Truck, 
  Shield, 
  Award,
  ZoomIn,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function ProductDetail() {
  // const [location, setLocation] = useLocation();
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedTier, setSelectedTier] = useState(0);
  const [product, setProduct] = useState(null);
  const [manufacturer, setManufacturer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ServerUrl = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${ServerUrl}/api/product/${id}`);
        setProduct(response?.data?.data); 

        const email = response?.data?.data?.manufacturerEmail;

        const manufacturerRes = await axios.get(`${ServerUrl}/api/manufacturer/${email}`);
        console.log(manufacturerRes.data.data);
        setManufacturer(manufacturerRes?.data?.data);
      } catch (err) {
        console.error("Failed to load product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);



// Utility function to safely parse prices
const parsePrice = (price) => {
  if (price === null || price === undefined) return 0;
  if (typeof price === 'number') return price;
  if (typeof price === 'string') return parseFloat(price) || 0;
  if (price && typeof price === 'object' && '$numberDecimal' in price) {
    return parseFloat(price.$numberDecimal) || 0;
  }
  return 0;
};
const parseDecimal = (value) => {
  if (!value) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value) || 0;
  if (value && typeof value === 'object' && '$numberDecimal' in value) {
    return parseFloat(value.$numberDecimal) || 0;
  }
  return 0;
};

// In your component
const getCurrentPrice = () => {
  if (!product) return 0;
  
  const basePrice = parsePrice(product.price);
  
  if (!product.pricingTiers?.length) return basePrice;
  
  const tier = product.pricingTiers.find(tier => 
    quantity >= tier.minQty && (tier.maxQty === null || quantity <= tier.maxQty)
  );
  
  return tier ? parsePrice(tier.price) : basePrice;
};

  const handleImagePrevious = () => {
    setSelectedImage(prev => prev === 0 ? product.images.length - 1 : prev - 1);
  };

  const handleImageNext = () => {
    setSelectedImage(prev => prev === product.images.length - 1 ? 0 : prev + 1);
  };

  if (loading) return <div className="flex justify-center py-12">Loading product details...</div>;
  if (error) return <div className="flex justify-center py-12 text-red-500">Error: {error}</div>;
  if (!product) return <div className="flex justify-center py-12">Product not found</div>;

  // Helper to parse specifications if stored as string
  const parseSpecifications = () => {
    try {
      return product.specifications ? JSON.parse(product.specifications) : {};
    } catch {
      return {};
    }
  };

  const specifications = parseSpecifications();

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-slate-600">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Products
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Product Images */}
        <div className="lg:col-span-6">
          <Card>
            <CardContent className="p-6">
              {/* Main Image */}
              <div className="relative mb-4 group">
                <div 
                  className="relative overflow-hidden rounded-lg bg-slate-100 aspect-square cursor-zoom-in"
                  onClick={() => setIsImageZoomed(true)}
                >
                  <img
                    src={product.images[selectedImage] || "/placeholder-product.jpg"}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                    <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                
                {/* Image Navigation */}
                {product.images?.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={handleImagePrevious}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={handleImageNext}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images?.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? 'border-blue-500' : 'border-slate-200'
                      }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Product Info */}
        <div className="lg:col-span-6 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">
                    {product.title}
                  </h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <Badge variant="outline">{product.category}</Badge>
                    {product.tags?.map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4 bg-[var(--color-primary)] hover:bg-[var(--color-heading)] text-[var(--color-heading)] hover:text-[var(--color-primary)]" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4 bg-[var(--color-primary)] hover:bg-[var(--color-heading)] text-[var(--color-heading)] hover:text-[var(--color-primary)]" />
                  </Button>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline space-x-2 mb-2">
                <span className="text-3xl font-bold text-blue-600">
                  {getCurrentPrice().toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'INR',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
                <span className="text-slate-600">/ piece</span>
              </div>
                
                {/* Pricing Tiers */}
                {product.pricingTiers?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-slate-600">Volume Pricing:</p>
                  {product.pricingTiers.map((tier, index) => {
                    const tierPrice = parseDecimal(tier.price);
                    const basePrice = parseDecimal(product.price);
                    const discount = basePrice > 0 
                      ? ((basePrice - tierPrice) / basePrice * 100).toFixed(0)
                      : 0;
                    
                    return (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {tier.minQty}{tier.maxQty ? `-${tier.maxQty}` : '+'} units
                        </span>
                        <span className="font-medium">
                          ₹{tierPrice.toLocaleString()} 
                          {discount > 0 && (
                            <span className="text-green-600 ml-1">({discount}% off)</span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
              </div>

              {/* Quantity & Order */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Quantity (Min: {product.minOrderQuantity || 1})
                  </label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(product.minOrderQuantity || 1, quantity - 1))}
                      className="bg-warning text-warning-foreground"
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(product.minOrderQuantity || 1, parseInt(e.target.value) || 1))}
                      className="w-24 text-center"
                      min={product.minOrderQuantity || 1}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      className="bg-warning text-warning-foreground"
                    >
                      +
                    </Button>
                    <span className="text-sm text-slate-600 ml-4">
                      {product.stock} available
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    className="bg-[var(--color-primary)] hover:bg-[var(--color-heading)] text-[var(--color-heading)] hover:text-[var(--color-primary)]"
                    onClick={() => navigate(`/checkout/${product._id}`)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Buy Now
                  </Button>
                  <Button variant="outline" className="bg-[var(--color-primary)] hover:bg-[var(--color-heading)] text-[var(--color-heading)] hover:text-[var(--color-primary)]">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Supplier
                  </Button>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-heading)] text-[var(--color-heading)] hover:text-[var(--color-primary)]"
                  onClick={() => setLocation('/checkout')}
                >
                  Request Quotation
                </Button>
              </div>

              {/* Quick Info */}
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                {product.leadTime && (
                  <div>
                    <span className="text-slate-600">Lead Time:</span>
                    <span className="font-medium ml-2">{product.leadTime}</span>
                  </div>
                )}
                {product.dimensions?.weight && (
                  <div>
                    <span className="text-slate-600">Weight:</span>
                    <span className="font-medium ml-2">
                      {product.dimensions.weight} {product.dimensions.unit || 'kg'}
                    </span>
                  </div>
                )}
                {product.warranty && (
                  <div>
                    <span className="text-slate-600">Warranty:</span>
                    <span className="font-medium ml-2">{product.warranty}</span>
                  </div>
                )}
                {product.materials && (
                  <div>
                    <span className="text-slate-600">Materials:</span>
                    <span className="font-medium ml-2">{product.materials}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Supplier Info */}
          {manufacturer && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={manufacturer.logo_url} alt="Supplier" />
                    <AvatarFallback>
                      {manufacturer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{manufacturer.name}</h3>
                    <p className="text-sm text-slate-600 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {manufacturer.address?.city}, {manufacturer.address?.state}
                    </p>
                    {manufacturer.year_of_establishment && (
                      <p className="text-sm text-slate-600">
                        Est. {manufacturer.year_of_establishment}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  {manufacturer.company_type && (
                    <div>
                      <span className="text-slate-600">Company Type:</span>
                      <span className="font-medium ml-2">{manufacturer.company_type}</span>
                    </div>
                  )}
                  {manufacturer.GST_no && (
                    <div>
                      <span className="text-slate-600">GST:</span>
                      <span className="font-medium ml-2">{manufacturer.GST_no}</span>
                    </div>
                  )}
                  {manufacturer.contact_person?.name && (
                    <div>
                      <span className="text-slate-600">Contact:</span>
                      <span className="font-medium ml-2">{manufacturer.contact_person.name}</span>
                    </div>
                  )}
                  {manufacturer.contact_person?.designation && (
                    <div>
                      <span className="text-slate-600">Designation:</span>
                      <span className="font-medium ml-2">{manufacturer.contact_person.designation}</span>
                    </div>
                  )}
                </div>

                {manufacturer.certifications?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {manufacturer.certifications.map((cert) => (
                      <Badge key={cert} variant="outline" className="text-xs">
                        <Award className="h-3 w-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 text-[var(--color-heading)] gap-2">
                  <Button variant="outline" size="sm" className="bg-[var(--color-primary)] hover:bg-[var(--color-heading)]">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Product Details Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="company">Company</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="space-y-4">
                <p className="text-slate-700 leading-relaxed">
                  {product.description || "No description available."}
                </p>
                
                {product.features && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                          <span className="text-slate-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              {Object.keys(specifications).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-slate-100">
                      <span className="font-medium text-slate-900">{key}:</span>
                      <span className="text-slate-700">{value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500">No specifications available.</p>
              )}
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {product.leadTime && (
                    <div className="flex items-start space-x-3">
                      <Truck className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-slate-900">Lead Time</p>
                        <p className="text-slate-600">{product.leadTime}</p>
                      </div>
                    </div>
                  )}
                  
                  {product.dimensions && (
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-slate-900">Dimensions</p>
                        <p className="text-slate-600">
                          {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} {product.dimensions.unit}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {product.dimensions?.weight && (
                    <div>
                      <p className="font-medium text-slate-900 mb-2">Weight</p>
                      <p className="text-slate-600">
                        {product.dimensions.weight} {product.dimensions.unit || 'kg'}
                      </p>
                    </div>
                  )}
                  
                  {product.customizable && (
                    <div>
                      <p className="font-medium text-slate-900 mb-2">Customization</p>
                      <p className="text-slate-600">This product can be customized</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="text-center text-slate-500">
                <p>Customer reviews will be displayed here.</p>
                <p className="text-sm">Contact the supplier for references and testimonials.</p>
              </div>
            </TabsContent>

            <TabsContent value="company" className="mt-6">
              {manufacturer ? (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">About {manufacturer.name}</h4>
                    <p className="text-slate-700 leading-relaxed">
                      {manufacturer.name} is a {manufacturer.company_type} company established in {manufacturer.year_of_establishment}.
                      {manufacturer.categories?.length > 0 && (
                        <span> They specialize in {manufacturer.categories.join(', ')}.</span>
                      )}
                    </p>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-slate-900 mb-2">Address</h5>
                    <p className="text-slate-600">
                      {manufacturer.address?.line1}<br />
                      {manufacturer.address?.line2 && <>{manufacturer.address.line2}<br /></>}
                      {manufacturer.address?.city}, {manufacturer.address?.state}<br />
                      {manufacturer.address?.pincode}
                    </p>
                  </div>
                  
                  {manufacturer.website && (
                    <div>
                      <h5 className="font-medium text-slate-900 mb-2">Website</h5>
                      <a 
                        href={manufacturer.website.startsWith('http') ? manufacturer.website : `https://${manufacturer.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {manufacturer.website}
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-slate-500">No company information available.</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Image Zoom Modal */}
      {isImageZoomed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsImageZoomed(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={product.images?.[selectedImage] || "/placeholder-product.jpg"}
              alt={product.title}
              className="max-w-full max-h-full object-contain"
            />
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30"
              onClick={() => setIsImageZoomed(false)}
            >
              ×
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}