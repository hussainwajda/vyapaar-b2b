import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, DollarSign } from "lucide-react";

interface PricingTier {
  id: string;
  minQty: number;
  maxQty: number | null;
  price: number;
}

interface PricingTiersProps {
  value?: PricingTier[];
  onChange?: (tiers: PricingTier[]) => void;
  currency?: string;
}

export default function PricingTiers({ 
  value = [], 
  onChange, 
  currency = "USD" 
}: PricingTiersProps) {
  const [tiers, setTiers] = useState<PricingTier[]>(
    value.length > 0 ? value : [
      { id: '1', minQty: 1, maxQty: 10, price: 0 }
    ]
  );

  const updateTiers = (newTiers: PricingTier[]) => {
    setTiers(newTiers);
    onChange?.(newTiers);
  };

  const addTier = () => {
    const lastTier = tiers[tiers.length - 1];
    const newMinQty = lastTier ? (lastTier.maxQty || 0) + 1 : 1;
    
    const newTier: PricingTier = {
      id: Date.now().toString(),
      minQty: newMinQty,
      maxQty: newMinQty + 9,
      price: 0
    };
    
    updateTiers([...tiers, newTier]);
  };

  const removeTier = (id: string) => {
    if (tiers.length > 1) {
      updateTiers(tiers.filter(tier => tier.id !== id));
    }
  };

  const updateTier = (id: string, field: keyof PricingTier, value: any) => {
    updateTiers(tiers.map(tier => 
      tier.id === id ? { ...tier, [field]: value } : tier
    ));
  };

  const getDiscountPercentage = (basePrice: number, currentPrice: number) => {
    if (basePrice <= 0) return 0;
    return Math.round(((basePrice - currentPrice) / basePrice) * 100);
  };

  const basePrice = tiers[0]?.price || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Quantity-Based Pricing
        </CardTitle>
        <p className="text-sm text-slate-500">
          Set different prices for different order quantities to encourage bulk orders
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {tiers.map((tier, index) => (
          <div key={tier.id} className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Minimum Quantity */}
              <div>
                <label className="text-xs font-medium text-slate-700 mb-1 block">
                  Min Qty
                </label>
                <Input
                  type="number"
                  min="1"
                  value={tier.minQty}
                  onChange={(e) => updateTier(tier.id, 'minQty', parseInt(e.target.value) || 1)}
                  placeholder="1"
                />
              </div>

              {/* Maximum Quantity */}
              <div>
                <label className="text-xs font-medium text-slate-700 mb-1 block">
                  Max Qty
                </label>
                <Input
                  type="number"
                  min={tier.minQty}
                  value={tier.maxQty || ''}
                  onChange={(e) => updateTier(tier.id, 'maxQty', e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="Unlimited"
                />
              </div>

              {/* Price */}
              <div>
                <label className="text-xs font-medium text-slate-700 mb-1 block">
                  Price ({currency})
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={tier.price}
                  onChange={(e) => updateTier(tier.id, 'price', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>

              {/* Discount Badge */}
              <div className="flex items-end">
                {index > 0 && tier.price < basePrice && (
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {getDiscountPercentage(basePrice, tier.price)}% off
                  </Badge>
                )}
                {index === 0 && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Base Price
                  </Badge>
                )}
              </div>
            </div>

            {/* Remove Button */}
            {tiers.length > 1 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeTier(tier.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}

        {/* Add Tier Button */}
        <Button
          type="button"
          variant="outline"
          onClick={addTier}
          className="w-full border-dashed border-2 border-slate-300 hover:border-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Price Tier
        </Button>

        {/* Preview */}
        {tiers.length > 1 && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
            <h4 className="text-sm font-medium text-slate-900 mb-2">Pricing Preview:</h4>
            <div className="space-y-1">
              {tiers.map((tier, index) => (
                <p key={tier.id} className="text-xs text-slate-600">
                  {tier.minQty} - {tier.maxQty || '∞'} units: {currency} {tier.price.toFixed(2)}
                  {index > 0 && tier.price < basePrice && (
                    <span className="text-green-600 ml-2">
                      ({getDiscountPercentage(basePrice, tier.price)}% discount)
                    </span>
                  )}
                </p>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}