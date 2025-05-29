import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import FileUpload from "@/components/ui/file-upload";
import PricingTiers from "./pricing-tiers";
import ProductVariants from "./product-variants";
import ProductDetails from "./product-details";
import { getCategories, getCategoryById, getSubCategoriesByMainCategoryId } from "../../assets/Categories";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const categories = getCategories();

export default function ProductForm({ onSuccess }) {
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userCategories, setUserCategories] = useState([]);
  const [availableSubCategories, setAvailableSubCategories] = useState([]);
  const { user, isAuthenticated, getEmailFromUser, getCategoriesFromUser } = useAuth();
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      manufacturerEmail: "",
      title: "",
      description: "",
      category: "",
      subCategory: "",
      price: "",
      currency: "INR",
      minOrderQuantity: 1,
      stock: 0,
      specifications: "",
      status: "active",
      images: [],
      videos: [],
      pricingTiers: [{ id: '1', minQty: 1, maxQty: 10, price: 0 }],
      variants: [],
      dimensions: { unit: 'metric' },
      materials: "",
      certifications: [],
      warranty: "",
      leadTime: "",
      customizable: false,
      tags: [],
    },
  });

  useEffect(() => {
    if (user) {
      let userCategoryIds = getCategoriesFromUser();
      if (typeof userCategoryIds === 'string') {
        userCategoryIds = userCategoryIds.split(',').map(id => id.trim());
      }
      
      if (Array.isArray(userCategoryIds) && userCategoryIds.length > 0) {
        const matchedCategories = userCategoryIds
          .map(id => categories?.find(cat => cat.id === id))
          .filter(Boolean);
        setUserCategories(matchedCategories);
      }
    }
  }, [user, getCategoriesFromUser]);

  const handleMainCategoryChange = (selectedCategoryId) => {
    form.setValue("subCategory", "");
    const subCategories = getSubCategoriesByMainCategoryId(selectedCategoryId);
    setAvailableSubCategories(subCategories);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    if (!user) {
      toast({
        title: "Error",
        description: "You are not logged in. Please log in to create a product.",
        variant: "destructive",
      });
      return;
    }

    try {
      const manufacturerEmail = getEmailFromUser();
      
      // Prepare product data with uploaded URLs
      const productData = {
        ...data,
        manufacturerEmail,
        pricingTiers: data.pricingTiers ? JSON.stringify(data.pricingTiers) : undefined,
        variants: data.variants ? JSON.stringify(data.variants) : undefined,
        dimensions: data.dimensions ? JSON.stringify(data.dimensions) : undefined,
      };

      const response = await axios.post(
        "http://localhost:3001/api/add-product", 
        productData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 201) {
        toast({
          title: "Product Created",
          description: "Your product has been successfully created.",
        });
        form.reset();
        onSuccess?.();
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full text-[var(--color-primary)] font-bold grid-cols-5">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="variants">Variants</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Category *</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleMainCategoryChange(value);
                        }} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a main category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {userCategories?.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sub Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={!form.watch("category")}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={form.watch("category") ? "Select a sub category" : "Select main category first"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableSubCategories?.map((subCategory) => (
                            <SelectItem key={subCategory.id} value={subCategory.name}>
                              {subCategory.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your product in detail..." 
                        className="min-h-[120px]"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Price *</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minOrderQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Order Quantity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="1" 
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="specifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technical Specifications</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Technical specifications, features, etc." 
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media" className="space-y-6">
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Images & Videos</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value || []}
                        onChange={(urls) => {
                          field.onChange(urls);
                          form.setValue('images', urls, { shouldValidate: true });
                        }}
                        folder={getEmailFromUser()}
                        maxFiles={10}
                        acceptedTypes={['image/*', 'video/*']}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            {/* Pricing Tab */}
            <TabsContent value="pricing" className="space-y-6">
              <FormField
                control={form.control}
                name="pricingTiers"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PricingTiers
                        value={field.value}
                        onChange={field.onChange}
                        currency={form.watch("currency")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            {/* Variants Tab */}
            <TabsContent value="variants" className="space-y-6">
              <FormField
                control={form.control}
                name="variants"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ProductVariants
                        value={field.value}
                        onChange={field.onChange}
                        currency={form.watch("currency")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-6">
              <ProductDetails
                dimensions={form.watch("dimensions")}
                materials={form.watch("materials")}
                certifications={form.watch("certifications")}
                warranty={form.watch("warranty")}
                leadTime={form.watch("leadTime")}
                customizable={form.watch("customizable")}
                tags={form.watch("tags")}
                onDimensionsChange={(dimensions) => form.setValue("dimensions", dimensions)}
                onMaterialsChange={(materials) => form.setValue("materials", materials)}
                onCertificationsChange={(certifications) => form.setValue("certifications", certifications)}
                onWarrantyChange={(warranty) => form.setValue("warranty", warranty)}
                onLeadTimeChange={(leadTime) => form.setValue("leadTime", leadTime)}
                onCustomizableChange={(customizable) => form.setValue("customizable", customizable)}
                onTagsChange={(tags) => form.setValue("tags", tags)}
              />
            </TabsContent>
          </Tabs>

          <Separator />

          {/* Form Actions */}
          <div className="flex justify-between items-center pt-4">
            <div className="flex space-x-2">
              {activeTab !== "basic" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const tabs = ["basic", "media", "pricing", "variants", "details"];
                    const currentIndex = tabs.indexOf(activeTab);
                    if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1]);
                  }}
                >
                  Previous
                </Button>
              )}
              {activeTab !== "details" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const tabs = ["basic", "media", "pricing", "variants", "details"];
                    const currentIndex = tabs.indexOf(activeTab);
                    if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1]);
                  }}
                >
                  Next
                </Button>
              )}
            </div>
            
            <div className="flex space-x-4">
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Reset All
              </Button>
              <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                {isSubmitting ? "Creating..." : "Create Product"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}