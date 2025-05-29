import { Edit, Trash2, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast, ToastContainer } from "react-toastify";
import type { Product } from "../../shared/schema";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
}

export default function ProductCard({ product, onEdit }: ProductCardProps) {
  const navigate = useNavigate();
  

  const getStatusBadge = (status: string, stock: number) => {
    if (stock < 5) {
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Low Stock</Badge>;
    }
    return status === "active"
      ? <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
      : <Badge variant="outline" className="bg-gray-50 text-gray-700">Inactive</Badge>;
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      // Delete the product
      const response = axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/product/${product._id}`);
      toast.success("Product deleted successfully");
      window.location.reload();
    }
  }
  // Safely get the display price
  const displayPrice = product.price && typeof product.price === 'object' && '$numberDecimal' in product.price
    ? product.price.$numberDecimal
    : product.price;

  return (
    <Card className="product-card neon-border">
      <CardContent className="p-4">
        <div 
          className="flex items-center space-x-4"
        >
          <div onClick={() => navigate(`/product/${product._id}`)} className="w-16 h-16 cursor-pointer bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <Package className="h-8 w-8 text-slate-400" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 onClick={() => navigate(`/product/${product._id}`)} className="text-sm cursor-pointer font-medium text-slate-900 truncate">{product.title}</h4>
            <p className="text-sm text-slate-500">{product.category}</p>
            <div className="flex items-center space-x-4 mt-1">
              {/* FIX APPLIED HERE: Using displayPrice */}
              <span className="text-sm font-medium text-slate-900">Rs.{displayPrice}</span>
              <span className="text-xs text-slate-500">
                {product.stock ? `In Stock (${product.stock})` : "Out of Stock"}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            {getStatusBadge(product.status || '', product.stock || 0)}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit?.(product)}
              className="text-slate-400 hover:text-slate-600"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-slate-400 hover:text-red-600"
              onClick={() => handleDelete(product._id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}