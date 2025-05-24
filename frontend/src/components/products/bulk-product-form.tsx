import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertProductSchema } from "../../shared/schema";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Package, Copy, Upload, Image } from "lucide-react";
import PricingTiers from "./pricing-tiers";

const bulkProductSchema = z.object({
  category: z.string().min(1, "Category is required"),
  currency: z.string().default("USD"),
  products: z.array(
    insertProductSchema.omit({ manufacturerId: true, category: true, currency: true }).extend({
      images: z.array(z.string()).optional(),
    })
  ).min(1, "At least one product is required"),
});

type BulkProductFormValues = z.infer<typeof bulkProductSchema>;

interface BulkProductFormProps {
  onSuccess?: () => void;
}

const categories = [
  "Heavy Machinery",
  "Electronics", 
  "Automotive Parts",
  "Industrial Equipment",
  "Construction Materials",
  "Textiles",
  "Chemicals",
  "Food & Beverages",
  "Medical Equipment",
  "Agricultural Equipment",
];

export default function BulkProductForm({ onSuccess }: BulkProductFormProps) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<BulkProductFormValues>({
    resolver: zodResolver(bulkProductSchema),
    defaultValues: {
      category: "",
      currency: "USD",
      products: [
        {
          title: "",
          description: "",
          price: "",
          minOrderQuantity: 1,
          stock: 0,
          specifications: "",
          status: "active",
        }
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products",
  });

  const createBulkProductsMutation = useMutation({
    mutationFn: async (data: BulkProductFormValues) => {
      const promises = data.products.map(product => 
        apiRequest("POST", "/api/products", {
          ...product,
          category: data.category,
          currency: data.currency,
        })
      );
      return Promise.all(promises);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Bulk Products Created",
        description: `Successfully created ${data.length} products in ${selectedCategory} category.`,
      });
      form.reset();
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create bulk products. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BulkProductFormValues) => {
    setSelectedCategory(data.category);
    createBulkProductsMutation.mutate(data);
  };

  const addProduct = () => {
    append({
      title: "",
      description: "",
      price: "",
      minOrderQuantity: 1,
      stock: 0,
      specifications: "",
      status: "active",
    });
  };

  const duplicateProduct = (index: number) => {
    const product = form.getValues(`products.${index}`);
    append({
      ...product,
      title: `${product.title} (Copy)`,
    });
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Category Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Bulk Product Creation
              </CardTitle>
              <p className="text-sm text-slate-500">
                Add multiple products of the same category quickly and efficiently
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Category *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category for all products" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
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
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="INR">INR (₹)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Products List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Products ({fields.length})
              </h3>
              <Button type="button" onClick={addProduct} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            {fields.map((field, index) => (
              <Card key={field.id} className="relative">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      Product #{index + 1}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => duplicateProduct(index)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => remove(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`products.${index}.title`}
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
                      name={`products.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01" 
                              placeholder="0.00" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`products.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Product description..." 
                            className="min-h-[80px]"
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
                      name={`products.${index}.minOrderQuantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Min Order Qty</FormLabel>
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
                      name={`products.${index}.stock`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stock</FormLabel>
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

                    <FormField
                      control={form.control}
                      name={`products.${index}.status`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Separator />

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Reset All
            </Button>
            <Button type="submit" disabled={createBulkProductsMutation.isPending}>
              {createBulkProductsMutation.isPending 
                ? `Creating ${fields.length} Products...` 
                : `Create ${fields.length} Products`
              }
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}