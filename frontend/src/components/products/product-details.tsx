import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Plus, X, Package, Award, Clock, Ruler } from "lucide-react";

interface ProductDimensions {
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  unit: 'metric' | 'imperial';
}

interface ProductDetailsProps {
  dimensions?: ProductDimensions;
  materials?: string;
  certifications?: string[];
  warranty?: string;
  leadTime?: string;
  customizable?: boolean;
  tags?: string[];
  onDimensionsChange?: (dimensions: ProductDimensions) => void;
  onMaterialsChange?: (materials: string) => void;
  onCertificationsChange?: (certifications: string[]) => void;
  onWarrantyChange?: (warranty: string) => void;
  onLeadTimeChange?: (leadTime: string) => void;
  onCustomizableChange?: (customizable: boolean) => void;
  onTagsChange?: (tags: string[]) => void;
}

export default function ProductDetails({
  dimensions = { unit: 'metric' },
  materials = '',
  certifications = [],
  warranty = '',
  leadTime = '',
  customizable = false,
  tags = [],
  onDimensionsChange,
  onMaterialsChange,
  onCertificationsChange,
  onWarrantyChange,
  onLeadTimeChange,
  onCustomizableChange,
  onTagsChange,
}: ProductDetailsProps) {
  const [newCertification, setNewCertification] = useState('');
  const [newTag, setNewTag] = useState('');

  const updateDimensions = (field: keyof ProductDimensions, value: any) => {
    const updated = { ...dimensions, [field]: value };
    onDimensionsChange?.(updated);
  };

  const addCertification = () => {
    if (newCertification.trim() && !certifications.includes(newCertification.trim())) {
      onCertificationsChange?.([...certifications, newCertification.trim()]);
      setNewCertification('');
    }
  };

  const removeCertification = (cert: string) => {
    onCertificationsChange?.(certifications.filter(c => c !== cert));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      onTagsChange?.([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    onTagsChange?.(tags.filter(t => t !== tag));
  };

  const commonCertifications = [
    'ISO 9001', 'ISO 14001', 'ISO 45001', 'CE Marking', 'FDA Approved',
    'UL Listed', 'RoHS Compliant', 'FCC Certified', 'Energy Star',
    'OSHA Compliant', 'API Certified', 'ASME Certified'
  ];

  const commonTags = [
    'High Quality', 'Fast Delivery', 'Custom Orders', 'Bulk Discount',
    'Eco Friendly', 'Made to Order', 'Premium', 'Industrial Grade',
    'Commercial Use', 'Residential Use', 'Export Quality', 'Durable'
  ];

  return (
    <div className="space-y-6">
      {/* Dimensions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            Product Dimensions & Weight
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-slate-700">Unit System:</label>
            <Select
              value={dimensions.unit}
              onValueChange={(value: 'metric' | 'imperial') => updateDimensions('unit', value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Metric (cm/kg)</SelectItem>
                <SelectItem value="imperial">Imperial (in/lbs)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-700 mb-1 block">
                Length ({dimensions.unit === 'metric' ? 'cm' : 'in'})
              </label>
              <Input
                type="number"
                step="0.1"
                min="0"
                value={dimensions.length || ''}
                onChange={(e) => updateDimensions('length', parseFloat(e.target.value) || undefined)}
                placeholder="0.0"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 mb-1 block">
                Width ({dimensions.unit === 'metric' ? 'cm' : 'in'})
              </label>
              <Input
                type="number"
                step="0.1"
                min="0"
                value={dimensions.width || ''}
                onChange={(e) => updateDimensions('width', parseFloat(e.target.value) || undefined)}
                placeholder="0.0"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 mb-1 block">
                Height ({dimensions.unit === 'metric' ? 'cm' : 'in'})
              </label>
              <Input
                type="number"
                step="0.1"
                min="0"
                value={dimensions.height || ''}
                onChange={(e) => updateDimensions('height', parseFloat(e.target.value) || undefined)}
                placeholder="0.0"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 mb-1 block">
                Weight ({dimensions.unit === 'metric' ? 'kg' : 'lbs'})
              </label>
              <Input
                type="number"
                step="0.1"
                min="0"
                value={dimensions.weight || ''}
                onChange={(e) => updateDimensions('weight', parseFloat(e.target.value) || undefined)}
                placeholder="0.0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Materials */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Materials & Specifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Materials Used
            </label>
            <Textarea
              value={materials}
              onChange={(e) => onMaterialsChange?.(e.target.value)}
              placeholder="e.g., Stainless Steel 316L, Aluminum Alloy 6061, Food Grade Silicone..."
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Warranty Period
              </label>
              <Input
                value={warranty}
                onChange={(e) => onWarrantyChange?.(e.target.value)}
                placeholder="e.g., 2 years, 12 months, Lifetime"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Lead Time
              </label>
              <Input
                value={leadTime}
                onChange={(e) => onLeadTimeChange?.(e.target.value)}
                placeholder="e.g., 2-3 weeks, 30 days, Same day"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div>
              <p className="font-medium text-slate-900">Customizable Product</p>
              <p className="text-sm text-slate-500">
                Can this product be customized based on customer requirements?
              </p>
            </div>
            <Switch
              checked={customizable}
              onCheckedChange={onCustomizableChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Certifications & Standards
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newCertification}
              onChange={(e) => setNewCertification(e.target.value)}
              placeholder="Enter certification (e.g., ISO 9001)"
              onKeyPress={(e) => e.key === 'Enter' && addCertification()}
            />
            <Button type="button" onClick={addCertification}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Common Certifications */}
          <div>
            <p className="text-xs text-slate-600 mb-2">Quick add common certifications:</p>
            <div className="flex flex-wrap gap-1">
              {commonCertifications.map((cert) => (
                <Badge
                  key={cert}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-white text-xs"
                  onClick={() => {
                    if (!certifications.includes(cert)) {
                      onCertificationsChange?.([...certifications, cert]);
                    }
                  }}
                >
                  {cert}
                </Badge>
              ))}
            </div>
          </div>

          {/* Added Certifications */}
          {certifications.length > 0 && (
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Added Certifications:</p>
              <div className="flex flex-wrap gap-2">
                {certifications.map((cert) => (
                  <Badge key={cert} variant="default" className="flex items-center gap-1">
                    {cert}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeCertification(cert)}
                      className="h-auto p-0 hover:bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Tags & Keywords
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Enter product tag (e.g., High Quality)"
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
            />
            <Button type="button" onClick={addTag}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Common Tags */}
          <div>
            <p className="text-xs text-slate-600 mb-2">Quick add common tags:</p>
            <div className="flex flex-wrap gap-1">
              {commonTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-white text-xs"
                  onClick={() => {
                    if (!tags.includes(tag)) {
                      onTagsChange?.([...tags, tag]);
                    }
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Added Tags */}
          {tags.length > 0 && (
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Added Tags:</p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeTag(tag)}
                      className="h-auto p-0 hover:bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}