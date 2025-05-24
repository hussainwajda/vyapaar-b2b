import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Palette, X } from "lucide-react";

interface VariantOption {
  id: string;
  label: string;
  value: string;
  priceModifier?: number; // Price adjustment (+/-)
  stockModifier?: number; // Stock adjustment (+/-)
}

interface ProductVariant {
  id: string;
  name: string;
  type: 'color' | 'size' | 'material' | 'model' | 'custom';
  options: VariantOption[];
}

interface ProductVariantsProps {
  value?: ProductVariant[];
  onChange?: (variants: ProductVariant[]) => void;
  currency?: string;
}

const variantTypes = [
  { value: 'color', label: 'Color', icon: '🎨' },
  { value: 'size', label: 'Size', icon: '📏' },
  { value: 'material', label: 'Material', icon: '🏗️' },
  { value: 'model', label: 'Model', icon: '🔧' },
  { value: 'custom', label: 'Custom', icon: '⚙️' },
];

export default function ProductVariants({ 
  value = [], 
  onChange, 
  currency = "USD" 
}: ProductVariantsProps) {
  const [variants, setVariants] = useState<ProductVariant[]>(value);

  const updateVariants = (newVariants: ProductVariant[]) => {
    setVariants(newVariants);
    onChange?.(newVariants);
  };

  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: Date.now().toString(),
      name: '',
      type: 'color',
      options: []
    };
    updateVariants([...variants, newVariant]);
  };

  const removeVariant = (id: string) => {
    updateVariants(variants.filter(variant => variant.id !== id));
  };

  const updateVariant = (id: string, field: keyof ProductVariant, value: any) => {
    updateVariants(variants.map(variant => 
      variant.id === id ? { ...variant, [field]: value } : variant
    ));
  };

  const addOption = (variantId: string) => {
    const newOption: VariantOption = {
      id: Date.now().toString(),
      label: '',
      value: '',
      priceModifier: 0,
      stockModifier: 0
    };
    
    updateVariants(variants.map(variant => 
      variant.id === variantId 
        ? { ...variant, options: [...variant.options, newOption] }
        : variant
    ));
  };

  const removeOption = (variantId: string, optionId: string) => {
    updateVariants(variants.map(variant => 
      variant.id === variantId 
        ? { ...variant, options: variant.options.filter(opt => opt.id !== optionId) }
        : variant
    ));
  };

  const updateOption = (variantId: string, optionId: string, field: keyof VariantOption, value: any) => {
    updateVariants(variants.map(variant => 
      variant.id === variantId 
        ? {
            ...variant,
            options: variant.options.map(opt =>
              opt.id === optionId ? { ...opt, [field]: value } : opt
            )
          }
        : variant
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Product Variants
        </CardTitle>
        <p className="text-sm text-slate-500">
          Add different variations like colors, sizes, materials, or models
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {variants.map((variant) => (
          <div key={variant.id} className="border border-slate-200 rounded-lg p-4 space-y-4">
            {/* Variant Header */}
            <div className="flex items-center gap-3">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 mb-1 block">
                    Variant Type
                  </label>
                  <Select
                    value={variant.type}
                    onValueChange={(value: any) => updateVariant(variant.id, 'type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {variantTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-slate-700 mb-1 block">
                    Variant Name
                  </label>
                  <Input
                    value={variant.name}
                    onChange={(e) => updateVariant(variant.id, 'name', e.target.value)}
                    placeholder={`e.g., ${variant.type === 'color' ? 'Colors' : variant.type === 'size' ? 'Sizes' : 'Options'}`}
                  />
                </div>
              </div>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeVariant(variant.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Variant Options */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">
                  Options
                </label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => addOption(variant.id)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Option
                </Button>
              </div>

              {variant.options.length === 0 ? (
                <div className="text-center py-4 text-slate-500 text-sm border border-dashed border-slate-300 rounded-lg">
                  No options added yet. Click "Add Option" to get started.
                </div>
              ) : (
                <div className="space-y-2">
                  {variant.options.map((option) => (
                    <div key={option.id} className="grid grid-cols-1 md:grid-cols-6 gap-2 p-3 bg-slate-50 rounded-lg">
                      <div>
                        <label className="text-xs text-slate-600">Label</label>
                        <Input
                          size="sm"
                          value={option.label}
                          onChange={(e) => updateOption(variant.id, option.id, 'label', e.target.value)}
                          placeholder="Red"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-600">Value</label>
                        <Input
                          size="sm"
                          value={option.value}
                          onChange={(e) => updateOption(variant.id, option.id, 'value', e.target.value)}
                          placeholder="#FF0000"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-600">Price +/-</label>
                        <Input
                          size="sm"
                          type="number"
                          step="0.01"
                          value={option.priceModifier || ''}
                          onChange={(e) => updateOption(variant.id, option.id, 'priceModifier', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-600">Stock +/-</label>
                        <Input
                          size="sm"
                          type="number"
                          value={option.stockModifier || ''}
                          onChange={(e) => updateOption(variant.id, option.id, 'stockModifier', parseInt(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>

                      <div className="flex items-end">
                        {option.priceModifier !== 0 && (
                          <Badge variant="outline" className={option.priceModifier! > 0 ? "text-red-700" : "text-green-700"}>
                            {option.priceModifier! > 0 ? '+' : ''}{currency} {option.priceModifier?.toFixed(2)}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeOption(variant.id, option.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Add Variant Button */}
        <Button
          type="button"
          variant="outline"
          onClick={addVariant}
          className="w-full border-dashed border-2 border-slate-300 hover:border-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product Variant
        </Button>

        {/* Variants Preview */}
        {variants.length > 0 && variants.some(v => v.options.length > 0) && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
            <h4 className="text-sm font-medium text-slate-900 mb-3">Variants Preview:</h4>
            <div className="space-y-2">
              {variants.filter(v => v.options.length > 0).map((variant) => (
                <div key={variant.id}>
                  <p className="text-xs font-medium text-slate-700 mb-1">
                    {variant.name || `${variant.type.charAt(0).toUpperCase() + variant.type.slice(1)}s`}:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {variant.options.map((option) => (
                      <Badge key={option.id} variant="outline" className="text-xs">
                        {option.label}
                        {option.priceModifier !== 0 && (
                          <span className={option.priceModifier! > 0 ? "text-red-600" : "text-green-600"}>
                            {' '}({option.priceModifier! > 0 ? '+' : ''}{currency} {option.priceModifier?.toFixed(2)})
                          </span>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}