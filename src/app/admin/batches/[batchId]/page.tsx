'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { useBatch, useBatchPeptides } from '@/hooks/use-batches'
import {
  useAdminPeptides,
  useAddPeptideToBatch,
  useRemovePeptideFromBatch,
  useUpdateBatch,
} from '@/hooks/use-admin'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { BATCH_STATUS, BATCH_STATUS_LABELS } from '@/lib/constants'
import { formatCurrency } from '@/lib/format'

interface BatchEditorPageProps {
  params: Promise<{ batchId: string }>
}

export default function BatchEditorPage({ params }: BatchEditorPageProps) {
  const { batchId } = use(params)
  const { data: batch } = useBatch(batchId)
  const { data: batchPeptides, refetch: refetchBatchPeptides } = useBatchPeptides(batchId)
  const { data: allPeptides } = useAdminPeptides()
  const { mutate: addPeptide, isPending: isAdding } = useAddPeptideToBatch()
  const { mutate: removePeptide } = useRemovePeptideFromBatch()
  const { mutate: updateBatch } = useUpdateBatch()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAddAllDialogOpen, setIsAddAllDialogOpen] = useState(false)
  const [selectedPeptideId, setSelectedPeptideId] = useState('')
  const [boxVialMin, setBoxVialMin] = useState('10')
  const [boxesAvailable, setBoxesAvailable] = useState('5')
  const [pricePerVial, setPricePerVial] = useState('950')
  const [isAddingAll, setIsAddingAll] = useState(false)

  function handleAddPeptide() {
    if (!selectedPeptideId) return

    addPeptide(
      {
        batch_id: batchId,
        peptide_id: selectedPeptideId,
        box_vial_min: parseInt(boxVialMin),
        boxes_available: parseInt(boxesAvailable),
        price_per_vial: parseFloat(pricePerVial),
        vials_filled: 0,
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false)
          setSelectedPeptideId('')
          setBoxVialMin('10')
          setBoxesAvailable('5')
          setPricePerVial('950')
          refetchBatchPeptides()
        },
      }
    )
  }

  function handleRemovePeptide(id: string) {
    if (confirm('Are you sure you want to remove this peptide from the batch?')) {
      removePeptide(id, {
        onSuccess: () => {
          refetchBatchPeptides()
        },
      })
    }
  }

  async function handleAddAllPeptides() {
    if (!availablePeptides || availablePeptides.length === 0) {
      return
    }

    setIsAddingAll(true)
    
    try {
      // Add all peptides sequentially using their individual prices
      for (const peptide of availablePeptides) {
        await new Promise((resolve, reject) => {
          addPeptide(
            {
              batch_id: batchId,
              peptide_id: peptide.id,
              box_vial_min: parseInt(boxVialMin),
              boxes_available: parseInt(boxesAvailable),
              price_per_vial: peptide.price_per_vial || 950, // Use peptide's own price or default
              vials_filled: 0,
            },
            {
              onSuccess: resolve,
              onError: reject,
            }
          )
        })
      }

      setIsAddAllDialogOpen(false)
      refetchBatchPeptides()
    } catch (error) {
      console.error('Error adding all peptides:', error)
    } finally {
      setIsAddingAll(false)
    }
  }

  function handleStatusChange(newStatus: string) {
    updateBatch({
      id: batchId,
      data: { status: newStatus },
    })
  }

  // Get peptides not yet in batch
  const availablePeptides = allPeptides?.filter(
    (p) => !batchPeptides?.some((bp) => bp.peptide.id === p.id)
  )

  // Check if all peptides are fully filled
  const allPeptidesFilled = batchPeptides?.every(
    (bp) => bp.vials_filled >= bp.total_vials
  ) && (batchPeptides?.length || 0) > 0

  const totalVials = batchPeptides?.reduce((sum, bp) => sum + bp.total_vials, 0) || 0
  const totalFilled = batchPeptides?.reduce((sum, bp) => sum + bp.vials_filled, 0) || 0
  const fillPercentage = totalVials > 0 ? (totalFilled / totalVials) * 100 : 0

  if (!batch) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading batch...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-primary/10 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">{batch.name}</h1>
                <p className="text-sm text-muted-foreground">Batch ID: {batch.id}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Fill Progress Alert */}
        {allPeptidesFilled && batch.status !== 'PAYMENT' && batch.status !== 'CLOSED' && (
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="font-semibold text-primary text-lg">
                  🎉 All Peptides Fully Filled!
                </p>
                <p className="text-sm text-muted-foreground">
                  This batch is ready for PAYMENT phase. Change status to PAYMENT to allow customers to pay.
                </p>
                <Button
                  onClick={() => handleStatusChange('PAYMENT')}
                  className="mt-2"
                >
                  Change to PAYMENT Phase
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Batch Status */}
        <Card>
          <CardHeader>
            <CardTitle>Batch Status & Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Label>Current Status:</Label>
              <Select value={batch.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(BATCH_STATUS).map((status) => (
                    <SelectItem key={status} value={status}>
                      {BATCH_STATUS_LABELS[status as keyof typeof BATCH_STATUS_LABELS]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Overall Fill Progress</span>
                <span className="font-medium">
                  {totalFilled} / {totalVials} vials ({fillPercentage.toFixed(1)}%)
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {batch.status === 'FILLING' && (
                  <p>✅ Customers can checkout and lock in orders (no payment yet)</p>
                )}
                {batch.status === 'PAYMENT' && (
                  <p>💳 Ready for payment - Send payment instructions to customers via WhatsApp</p>
                )}
                {batch.status === 'OPEN' && (
                  <p>👀 Customers can view but not order yet - Change to FILLING to accept orders</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Peptides in Batch */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Peptides in Batch ({batchPeptides?.length || 0})</CardTitle>
              <div className="flex gap-2">
                <Dialog open={isAddAllDialogOpen} onOpenChange={setIsAddAllDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" disabled={!availablePeptides || availablePeptides.length === 0}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add All Peptides ({availablePeptides?.length || 0})
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add All Peptides to Batch</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                        <p className="text-sm font-medium text-primary">
                          📋 Adding {availablePeptides?.length || 0} peptides
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Each peptide will use its own price. Set the box size and quantity below.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Vials per Box (Same for all)</Label>
                          <Input
                            type="number"
                            value={boxVialMin}
                            onChange={(e) => setBoxVialMin(e.target.value)}
                            min="1"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Boxes Available (Same for all)</Label>
                          <Input
                            type="number"
                            value={boxesAvailable}
                            onChange={(e) => setBoxesAvailable(e.target.value)}
                            min="1"
                          />
                        </div>
                      </div>

                      <div className="bg-muted p-4 rounded-lg space-y-3">
                        <p className="text-sm font-medium">Preview - Peptides to Add:</p>
                        <div className="max-h-48 overflow-y-auto space-y-2">
                          {availablePeptides?.slice(0, 10).map((peptide) => (
                            <div key={peptide.id} className="flex justify-between items-center text-sm bg-background p-2 rounded">
                              <span className="font-medium">
                                {peptide.name} {peptide.strength && `(${peptide.strength})`}
                              </span>
                              <span className="text-muted-foreground">
                                ₱{peptide.price_per_vial || 950}/vial
                              </span>
                            </div>
                          ))}
                          {(availablePeptides?.length || 0) > 10 && (
                            <p className="text-xs text-center text-muted-foreground">
                              ...and {(availablePeptides?.length || 0) - 10} more
                            </p>
                          )}
                        </div>
                        <div className="pt-2 border-t space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Total vials per peptide:</span>
                            <span className="font-bold">{parseInt(boxVialMin) * parseInt(boxesAvailable)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Total peptides:</span>
                            <span className="font-bold">{availablePeptides?.length || 0}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Price:</span>
                            <span className="font-bold text-primary">Individual per peptide ✅</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setIsAddAllDialogOpen(false)}
                          disabled={isAddingAll}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddAllPeptides}
                          disabled={isAddingAll}
                        >
                          {isAddingAll ? `Adding... (${availablePeptides?.length || 0})` : 'Add All Peptides'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Single Peptide
                    </Button>
                  </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Peptide to Batch</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Select Peptide</Label>
                      <Select value={selectedPeptideId} onValueChange={setSelectedPeptideId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a peptide" />
                        </SelectTrigger>
                        <SelectContent>
                          {availablePeptides?.map((peptide) => (
                            <SelectItem key={peptide.id} value={peptide.id}>
                              {peptide.name} {peptide.strength && `(${peptide.strength})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Vials per Box</Label>
                        <Input
                          type="number"
                          value={boxVialMin}
                          onChange={(e) => setBoxVialMin(e.target.value)}
                          min="1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Boxes Available</Label>
                        <Input
                          type="number"
                          value={boxesAvailable}
                          onChange={(e) => setBoxesAvailable(e.target.value)}
                          min="1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Price per Vial (₱)</Label>
                      <Input
                        type="number"
                        value={pricePerVial}
                        onChange={(e) => setPricePerVial(e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddPeptide}
                        disabled={!selectedPeptideId || isAdding}
                      >
                        {isAdding ? 'Adding...' : 'Add Peptide'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            </div>
          </CardHeader>
          <CardContent>
            {!batchPeptides || batchPeptides.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No peptides added to this batch yet</p>
                <p className="text-sm mt-2">Click &quot;Add Peptide&quot; to get started</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Peptide</TableHead>
                    <TableHead>Strength</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price/Vial</TableHead>
                    <TableHead>Box Size</TableHead>
                    <TableHead>Boxes</TableHead>
                    <TableHead>Total Vials</TableHead>
                    <TableHead>Filled</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batchPeptides.map((bp) => (
                    <TableRow key={bp.id}>
                      <TableCell className="font-medium">{bp.peptide.name}</TableCell>
                      <TableCell>{bp.peptide.strength || '-'}</TableCell>
                      <TableCell>{bp.peptide.vendor || '-'}</TableCell>
                      <TableCell>{bp.peptide.category || '-'}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(bp.price_per_vial)}
                      </TableCell>
                      <TableCell>{bp.box_vial_min} vials</TableCell>
                      <TableCell>{bp.boxes_available}</TableCell>
                      <TableCell>{bp.total_vials}</TableCell>
                      <TableCell>
                        <Badge variant={bp.vials_filled >= bp.total_vials ? 'default' : 'secondary'}>
                          {bp.vials_filled} / {bp.total_vials}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemovePeptide(bp.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

