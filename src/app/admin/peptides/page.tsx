'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  useAdminPeptides,
  useCreatePeptide,
  useUpdatePeptide,
  useDeletePeptide,
  useCategories,
  useVendors,
} from '@/hooks/use-admin'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, Pencil, Trash2, X, Package } from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import { ScrollArea } from '@/components/ui/scroll-area'

const peptideSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  strength: z.string().optional(),
  vendor: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  mechanism: z.string().optional(),
  half_life: z.string().optional(),
  storage: z.string().optional(),
  benefits: z.string().optional(), // JSON array as string
  side_effects: z.string().optional(), // JSON array as string
  contraindications: z.string().optional(), // JSON array as string
  dosing: z.string().optional(), // JSON array as string
  stacking: z.string().optional(), // JSON array as string
  icon: z.string().optional(),
  is_active: z.boolean(),
  vials_per_box: z.string().optional(),
  specifications: z.string().optional(), // JSON object as string
  price_per_vial: z.string().min(1, 'Price per vial is required'),
  price_per_box: z.string().optional(),
})

type PeptideFormData = z.infer<typeof peptideSchema>

export default function PeptidesManagementPage() {
  const { data: peptides, isLoading } = useAdminPeptides()
  const { data: categories } = useCategories()
  const { data: vendors } = useVendors()
  const { mutate: createPeptide, isPending: isCreating } = useCreatePeptide()
  const { mutate: updatePeptide, isPending: isUpdating } = useUpdatePeptide()
  const { mutate: deletePeptide } = useDeletePeptide()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPeptide, setEditingPeptide] = useState<any>(null)

  const form = useForm<PeptideFormData>({
    resolver: zodResolver(peptideSchema),
    defaultValues: {
      name: '',
      strength: '',
      vendor: '',
      category: '',
      description: '',
      mechanism: '',
      half_life: '',
      storage: 'Store in refrigerator (2-8°C)',
      benefits: '',
      side_effects: '',
      contraindications: '',
      dosing: '',
      stacking: '',
      icon: '💊',
      is_active: true,
      vials_per_box: '10',
      specifications: '',
      price_per_vial: '950',
      price_per_box: '',
    },
  })

  function openCreateDialog() {
    setEditingPeptide(null)
    form.reset({
      name: '',
      strength: '',
      vendor: '',
      category: '',
      description: '',
      mechanism: '',
      half_life: '',
      storage: 'Store in refrigerator (2-8°C)',
      benefits: '',
      side_effects: '',
      contraindications: '',
      dosing: '',
      stacking: '',
      icon: '💊',
      is_active: true,
      vials_per_box: '10',
      specifications: '',
      price_per_vial: '950',
      price_per_box: '',
    })
    setIsDialogOpen(true)
  }

  function openEditDialog(peptide: any) {
    setEditingPeptide(peptide)
    form.reset({
      name: peptide.name,
      strength: peptide.strength || '',
      vendor: peptide.vendor || '',
      category: peptide.category || '',
      description: peptide.description || '',
      mechanism: peptide.mechanism || '',
      half_life: peptide.half_life || '',
      storage: peptide.storage || 'Store in refrigerator (2-8°C)',
      benefits: peptide.benefits ? JSON.stringify(peptide.benefits, null, 2) : '',
      side_effects: peptide.side_effects ? JSON.stringify(peptide.side_effects, null, 2) : '',
      contraindications: peptide.contraindications ? JSON.stringify(peptide.contraindications, null, 2) : '',
      dosing: peptide.dosing ? JSON.stringify(peptide.dosing, null, 2) : '',
      stacking: peptide.stacking ? JSON.stringify(peptide.stacking, null, 2) : '',
      icon: peptide.icon || '💊',
      is_active: peptide.is_active !== undefined ? peptide.is_active : true,
      vials_per_box: peptide.vials_per_box?.toString() || '10',
      specifications: peptide.specifications ? JSON.stringify(peptide.specifications, null, 2) : '',
      price_per_vial: peptide.price_per_vial?.toString() || '950',
      price_per_box: peptide.price_per_box?.toString() || '',
    })
    setIsDialogOpen(true)
  }

  function onSubmit(data: PeptideFormData) {
    // Parse JSON fields
    let parsedBenefits = null
    let parsedSideEffects = null
    let parsedContraindications = null
    let parsedDosing = null
    let parsedStacking = null
    let parsedSpecifications = null

    try {
      if (data.benefits?.trim()) parsedBenefits = JSON.parse(data.benefits)
      if (data.side_effects?.trim()) parsedSideEffects = JSON.parse(data.side_effects)
      if (data.contraindications?.trim()) parsedContraindications = JSON.parse(data.contraindications)
      if (data.dosing?.trim()) parsedDosing = JSON.parse(data.dosing)
      if (data.stacking?.trim()) parsedStacking = JSON.parse(data.stacking)
      if (data.specifications?.trim()) parsedSpecifications = JSON.parse(data.specifications)
    } catch (error) {
      alert('Invalid JSON format in one of the fields. Please check your JSON syntax.')
      return
    }

    const peptideData = {
      name: data.name,
      strength: data.strength || null,
      vendor: data.vendor || null,
      category: data.category || null,
      description: data.description || null,
      mechanism: data.mechanism || null,
      half_life: data.half_life || null,
      storage: data.storage || null,
      benefits: parsedBenefits,
      side_effects: parsedSideEffects,
      contraindications: parsedContraindications,
      dosing: parsedDosing,
      stacking: parsedStacking,
      icon: data.icon || null,
      is_active: data.is_active,
      vials_per_box: data.vials_per_box ? parseInt(data.vials_per_box) : null,
      specifications: parsedSpecifications,
      price_per_vial: parseFloat(data.price_per_vial),
      price_per_box: data.price_per_box ? parseFloat(data.price_per_box) : null,
    }

    if (editingPeptide) {
      updatePeptide(
        {
          id: editingPeptide.id,
          data: peptideData,
        },
        {
          onSuccess: () => {
            setIsDialogOpen(false)
            form.reset()
          },
        }
      )
    } else {
      createPeptide(peptideData, {
        onSuccess: () => {
          setIsDialogOpen(false)
          form.reset()
        },
      })
    }
  }

  function handleDelete(id: string, name: string) {
    if (confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
      deletePeptide(id)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f9ff] via-white to-white">
      <header className="border-b border-border/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 max-w-[1400px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-foreground">Peptides Management</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Manage your peptide catalog
                </p>
              </div>
            </div>
            <Button 
              onClick={openCreateDialog}
              className="rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Peptide
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-[1400px]">
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">All Peptides</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {peptides?.length || 0} {peptides?.length === 1 ? 'peptide' : 'peptides'} in catalog
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <Package className="h-12 w-12 text-muted-foreground/50 animate-pulse" />
                <p className="text-muted-foreground">Loading peptides...</p>
              </div>
            ) : !peptides || peptides.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 rounded-full bg-muted/50 mx-auto flex items-center justify-center">
                  <Package className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-foreground">No peptides yet</p>
                  <p className="text-sm text-muted-foreground">Create your first peptide to build your catalog</p>
                </div>
                <Button onClick={openCreateDialog} className="rounded-full mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Peptide
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Strength</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price/Vial</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {peptides.map((peptide) => (
                    <TableRow key={peptide.id}>
                      <TableCell className="font-medium">{peptide.name}</TableCell>
                      <TableCell>
                        {peptide.strength ? (
                          <Badge variant="outline" className="rounded-full">{peptide.strength}</Badge>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>{peptide.vendor || '-'}</TableCell>
                      <TableCell>{peptide.category || '-'}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(peptide.price_per_vial || 0)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-primary/10"
                            onClick={() => openEditDialog(peptide)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-destructive/10"
                            onClick={() => handleDelete(peptide.id, peptide.name)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Categories & Vendors Summary */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <span className="text-lg">🏷️</span>
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Categories</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {categories?.length || 0} {categories?.length === 1 ? 'category' : 'categories'}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categories?.map((category) => (
                  <Badge key={category} variant="secondary" className="rounded-full">
                    {category}
                  </Badge>
                ))}
                {(!categories || categories.length === 0) && (
                  <p className="text-sm text-muted-foreground">No categories yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#3CCB7F]/10 flex items-center justify-center">
                  <span className="text-lg">🏪</span>
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Vendors</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {vendors?.length || 0} {vendors?.length === 1 ? 'vendor' : 'vendors'}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {vendors?.map((vendor) => (
                  <Badge key={vendor} variant="secondary" className="rounded-full">
                    {vendor}
                  </Badge>
                ))}
                {(!vendors || vendors.length === 0) && (
                  <p className="text-sm text-muted-foreground">No vendors yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {editingPeptide ? 'Edit Peptide' : 'Create New Peptide'}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="BPC-157" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="strength"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Strength</FormLabel>
                          <FormControl>
                            <Input placeholder="5mg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="vendor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vendor</FormLabel>
                          <FormControl>
                            <Input placeholder="Various" {...field} />
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
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input placeholder="Healing & Recovery" {...field} />
                          </FormControl>
                          <FormDescription>
                            e.g., Weight Loss & Metabolic, Healing & Recovery, Growth Hormone
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="icon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Icon</FormLabel>
                          <FormControl>
                            <Input placeholder="💊" {...field} />
                          </FormControl>
                          <FormDescription>Emoji icon</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vials_per_box"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vials Per Box</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="10" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="is_active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 mt-2">
                          <div className="space-y-0.5">
                            <FormLabel>Active</FormLabel>
                            <FormDescription>
                              Show in catalog
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Description & Mechanism */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Description & Mechanism</h3>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="A brief description of what this peptide does..."
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mechanism"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mechanism of Action</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="How this peptide works in the body..."
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="half_life"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Half Life</FormLabel>
                          <FormControl>
                            <Input placeholder="4-6 hours" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="storage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Storage Instructions</FormLabel>
                          <FormControl>
                            <Input placeholder="Store in refrigerator (2-8°C)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* JSON Fields */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Details (JSON Format)</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter data in JSON format. For arrays use: {`["item1", "item2"]`}
                  </p>
                  
                  <FormField
                    control={form.control}
                    name="benefits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Benefits (JSON Array)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder='["Benefit 1", "Benefit 2", "Benefit 3"]'
                            className="min-h-[80px] font-mono text-sm"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Array of benefits as strings
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="side_effects"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Side Effects (JSON Array)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder='["Side effect 1", "Side effect 2"]'
                            className="min-h-[80px] font-mono text-sm"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Array of side effects as strings
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contraindications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraindications (JSON Array)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder='["Contraindication 1", "Contraindication 2"]'
                            className="min-h-[80px] font-mono text-sm"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Array of contraindications as strings
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dosing"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dosing Instructions (JSON Array)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder='[{"vialSize": "5MG", "reconstitution": "Mix with 2mL BAC water", "frequency": "Daily", "subcutaneous": "250-500mcg daily"}]'
                            className="min-h-[100px] font-mono text-sm"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Array of dosing objects with vialSize, reconstitution, frequency, subcutaneous fields
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stacking"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stacking Recommendations (JSON Array)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder='["TB-500: Synergistic repair", "GHK-Cu: Collagen support"]'
                            className="min-h-[80px] font-mono text-sm"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Array of stacking suggestions as strings
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specifications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specifications (JSON Object)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder='{"purity": "99%", "form": "Lyophilized powder"}'
                            className="min-h-[80px] font-mono text-sm"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          JSON object with specification details
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Pricing</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price_per_vial"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price per Vial (₱) *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="950" 
                              step="0.01"
                              min="0"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price_per_box"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price per Box (₱)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="9500" 
                              step="0.01"
                              min="0"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Optional: Usually vials_per_box × price_per_vial
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreating || isUpdating}>
                    {isCreating || isUpdating ? 'Saving...' : editingPeptide ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </Form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}

