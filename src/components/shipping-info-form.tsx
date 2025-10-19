'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export interface ShippingInfo {
  shipping_name: string
  shipping_address: string
  shipping_phone: string
  delivery_method: 'Lalamove' | 'LBC' | 'J&T'
}

interface ShippingInfoFormProps {
  onSubmit: (info: ShippingInfo) => void
  isSubmitting?: boolean
}

export function ShippingInfoForm({ onSubmit, isSubmitting }: ShippingInfoFormProps) {
  const [formData, setFormData] = useState<ShippingInfo>({
    shipping_name: '',
    shipping_address: '',
    shipping_phone: '',
    delivery_method: 'LBC',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof ShippingInfo, string>>>({})

  function validateForm(): boolean {
    const newErrors: Partial<Record<keyof ShippingInfo, string>> = {}

    if (!formData.shipping_name.trim()) {
      newErrors.shipping_name = 'Name is required'
    }

    if (!formData.shipping_address.trim()) {
      newErrors.shipping_address = 'Address is required'
    }

    if (!formData.shipping_phone.trim()) {
      newErrors.shipping_phone = 'Phone number is required'
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.shipping_phone)) {
      newErrors.shipping_phone = 'Invalid phone number format'
    }

    if (!formData.delivery_method) {
      newErrors.delivery_method = 'Delivery method is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base md:text-lg">Shipping Information</CardTitle>
        <p className="text-xs md:text-sm text-muted-foreground">
          Please provide your shipping details for delivery
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="shipping_name" className="text-sm font-medium">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="shipping_name"
              placeholder="Juan Dela Cruz"
              value={formData.shipping_name}
              onChange={(e) => {
                setFormData({ ...formData, shipping_name: e.target.value })
                if (errors.shipping_name) {
                  setErrors({ ...errors, shipping_name: undefined })
                }
              }}
              className={`h-11 md:h-10 text-base md:text-sm ${errors.shipping_name ? 'border-destructive' : ''}`}
              disabled={isSubmitting}
              autoComplete="name"
            />
            {errors.shipping_name && (
              <p className="text-xs md:text-sm text-destructive">{errors.shipping_name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="shipping_address" className="text-sm font-medium">
              Complete Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="shipping_address"
              placeholder="123 Street Name, Barangay, City, Province"
              value={formData.shipping_address}
              onChange={(e) => {
                setFormData({ ...formData, shipping_address: e.target.value })
                if (errors.shipping_address) {
                  setErrors({ ...errors, shipping_address: undefined })
                }
              }}
              className={`h-11 md:h-10 text-base md:text-sm ${errors.shipping_address ? 'border-destructive' : ''}`}
              disabled={isSubmitting}
              autoComplete="street-address"
            />
            {errors.shipping_address && (
              <p className="text-xs md:text-sm text-destructive">{errors.shipping_address}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="shipping_phone" className="text-sm font-medium">
              Contact Phone <span className="text-destructive">*</span>
            </Label>
            <Input
              id="shipping_phone"
              type="tel"
              placeholder="09171234567 or +639171234567"
              value={formData.shipping_phone}
              onChange={(e) => {
                setFormData({ ...formData, shipping_phone: e.target.value })
                if (errors.shipping_phone) {
                  setErrors({ ...errors, shipping_phone: undefined })
                }
              }}
              className={`h-11 md:h-10 text-base md:text-sm ${errors.shipping_phone ? 'border-destructive' : ''}`}
              disabled={isSubmitting}
              autoComplete="tel"
            />
            {errors.shipping_phone && (
              <p className="text-xs md:text-sm text-destructive">{errors.shipping_phone}</p>
            )}
            <p className="text-xs text-muted-foreground">
              For courier to contact you during delivery
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="delivery_method" className="text-sm font-medium">
              Preferred Delivery Method <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.delivery_method}
              onValueChange={(value) =>
                setFormData({ ...formData, delivery_method: value as ShippingInfo['delivery_method'] })
              }
              disabled={isSubmitting}
            >
              <SelectTrigger
                id="delivery_method"
                className={`h-11 md:h-10 text-base md:text-sm ${errors.delivery_method ? 'border-destructive' : ''}`}
              >
                <SelectValue placeholder="Select delivery method">
                  {formData.delivery_method && (
                    <div className="flex items-center gap-2 overflow-visible">
                      <span className="font-medium flex-shrink-0">
                        {formData.delivery_method === 'J&T' ? 'J&T Express' : formData.delivery_method}
                      </span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                        {formData.delivery_method === 'Lalamove' && '(Same-day)'}
                        {formData.delivery_method === 'LBC' && '(2-3 days)'}
                        {formData.delivery_method === 'J&T' && '(2-5 days)'}
                      </span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Lalamove">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Lalamove</span>
                    <span className="text-xs text-muted-foreground">Same-day delivery</span>
                  </div>
                </SelectItem>
                <SelectItem value="LBC">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">LBC</span>
                    <span className="text-xs text-muted-foreground">2-3 days delivery</span>
                  </div>
                </SelectItem>
                <SelectItem value="J&T">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">J&amp;T Express</span>
                    <span className="text-xs text-muted-foreground">2-5 days delivery</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.delivery_method && (
              <p className="text-sm text-destructive">{errors.delivery_method}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Choose your preferred courier service for delivery
            </p>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : 'Continue to Lock In Order'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

