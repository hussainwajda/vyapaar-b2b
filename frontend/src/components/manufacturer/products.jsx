import { useState } from "react";
import ProductCard from "@/components/products/product-card";
import ProductForm from "@/components/products/product-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, RefreshCcw } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import axios from "axios";

export default function Products() {
  const [ products, setProducts ] = useState([]); // Initial state is an empty array
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Initially true
  const { user } = useAuth(); // Assuming this provides `user` object
  const email = user?.UserAttributes[0]?.Value; // Getting email from user object

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:3001/api/products`,{
          params: {email: email}
        });
        setProducts(response.data.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
      console.log("Component unmounted, cleanup.");
    };
  }, [])

  // PROBLEM AREA 3: Conditional rendering based on isLoading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-slate-600">Loading products...</div>
      </div>
    );
  }

  const categories = Array.from(new Set(products?.map(p => p.category) || []));
  
  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) || product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Products</h1>
          <p className="text-sm text-slate-500">Manage your product catalog</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <div className="flex items-center space-x-2">
          <RefreshCcw className="cursor-pointer text-[var(--color-primary)] mt-1" onClick={() => window.location.reload()} />
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          </div>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <ProductForm onSuccess={() => setIsAddModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-slate-500">
                {products?.length === 0 ? (
                  <>
                    <p className="text-lg mb-2">No products yet</p>
                    <p className="text-sm">Start by adding your first product to the catalog.</p>
                  </>
                ) : (
                  <>
                    <p className="text-lg mb-2">No products match your filters</p>
                    <p className="text-sm">Try adjusting your search or category filter.</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              onEdit={setEditingProduct}
            />
          ))
        )}
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <ProductForm onSuccess={() => setEditingProduct(null)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}