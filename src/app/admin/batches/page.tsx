'use client'

import Link from 'next/link'
import { useAdminBatches, useDeleteBatch, useSetFeaturedBatch } from '@/hooks/use-admin'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArrowLeft, Plus, Pencil, Trash2, Star, Package } from 'lucide-react'
import { BATCH_STATUS_LABELS } from '@/lib/constants'
import { formatDateShort } from '@/lib/format'

export default function AdminBatchesPage() {
  const { data: batches, isLoading } = useAdminBatches()
  const { mutate: deleteBatch } = useDeleteBatch()
  const { mutate: setFeatured, isPending: isSettingFeatured } = useSetFeaturedBatch()

  function handleDelete(id: string, name: string) {
    if (
      confirm(
        `Are you sure you want to delete batch "${name}"? This will also delete all associated data. This cannot be undone.`
      )
    ) {
      deleteBatch(id)
    }
  }

  function handleSetFeatured(id: string, name: string) {
    if (confirm(`Set "${name}" as the FEATURED batch?\n\nThis will be the only batch shown to customers on the main page.`)) {
      setFeatured(id)
    }
  }

  const statusColor = {
    DRAFT: 'bg-muted text-muted-foreground',
    OPEN: 'bg-primary text-primary-foreground',
    FILLING: 'bg-secondary text-secondary-foreground',
    LOCKED: 'bg-accent text-accent-foreground',
    PAYMENT: 'bg-primary text-primary-foreground',
    CLOSED: 'bg-muted text-muted-foreground',
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
                <h1 className="text-2xl font-black tracking-tight text-foreground">All Batches</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Manage batch inventory and status
                </p>
              </div>
            </div>
            <Link href="/admin/batches/new">
              <Button size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-all">
                <Plus className="h-5 w-5 mr-2" />
                Create Batch
              </Button>
            </Link>
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
                <CardTitle className="text-xl font-bold">Batch Management</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {batches?.length || 0} total batches
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12 space-y-4">
                <Package className="h-12 w-12 text-muted-foreground/50 mx-auto animate-pulse" />
                <p className="text-muted-foreground">Loading batches...</p>
              </div>
            ) : !batches || batches.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 rounded-full bg-muted/50 mx-auto flex items-center justify-center">
                  <Package className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-foreground">No batches yet</p>
                  <p className="text-sm text-muted-foreground">Get started by creating your first batch</p>
                </div>
                <Link href="/admin/batches/new">
                  <Button size="lg" className="rounded-full mt-4">
                    <Plus className="h-5 w-5 mr-2" />
                    Create Your First Batch
                  </Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Opens At</TableHead>
                    <TableHead>Closes At</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batches.map((batch) => (
                    <TableRow 
                      key={batch.id} 
                      className={batch.is_featured ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted/50'}
                    >
                      <TableCell className="font-semibold">
                        <div className="flex items-center gap-2">
                          {batch.name}
                          {batch.is_featured && (
                            <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/5">
                              <Star className="h-3 w-3 mr-1 fill-[#FDBA37] text-[#FDBA37]" />
                              Featured
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            statusColor[batch.status as keyof typeof statusColor]
                          } rounded-full`}
                        >
                          {BATCH_STATUS_LABELS[batch.status as keyof typeof BATCH_STATUS_LABELS]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {batch.is_featured ? (
                          <Badge className="bg-[#FDBA37] text-foreground hover:bg-[#FDBA37] rounded-full">
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            Yes
                          </Badge>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full"
                            onClick={() => handleSetFeatured(batch.id, batch.name)}
                            disabled={isSettingFeatured}
                          >
                            <Star className="h-4 w-4 mr-1" />
                            Set Featured
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {batch.opens_at ? formatDateShort(batch.opens_at) : '-'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {batch.closes_at ? formatDateShort(batch.closes_at) : '-'}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDateShort(batch.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/batches/${batch.id}`}>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-destructive/10"
                            onClick={() => handleDelete(batch.id, batch.name)}
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
      </main>
    </div>
  )
}

