'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { ArrowLeft, Plus, Trash2, Upload, Search, FileText, ChevronLeft, ChevronRight, Users } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  getAllWhitelistEntries,
  addWhitelistEntry,
  removeWhitelistEntry,
  updateWhitelistEntry,
  bulkAddWhitelistEntries,
  type WhitelistEntry,
} from '@/lib/api/admin'
import { formatPhoneToE164 } from '@/lib/format'

export default function AdminWhitelistPage() {
  const [entries, setEntries] = useState<WhitelistEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showBulkDialog, setShowBulkDialog] = useState(false)
  const [editingEntry, setEditingEntry] = useState<WhitelistEntry | null>(null)
  const [newPhone, setNewPhone] = useState('')
  const [newNote, setNewNote] = useState('')
  const [bulkText, setBulkText] = useState('')
  const [uploading, setUploading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadEntries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadEntries() {
    try {
      setLoading(true)
      const data = await getAllWhitelistEntries()
      setEntries(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load whitelist',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd() {
    if (!newPhone.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a phone number',
        variant: 'destructive',
      })
      return
    }

    try {
      setUploading(true)
      const e164 = formatPhoneToE164(newPhone, 'PH')
      
      if (!e164) {
        toast({
          title: 'Error',
          description: 'Invalid phone number format',
          variant: 'destructive',
        })
        return
      }

      await addWhitelistEntry(e164, newNote.trim() || undefined)
      
      toast({
        title: 'Success',
        description: 'Number added to whitelist',
      })
      
      setNewPhone('')
      setNewNote('')
      setShowAddDialog(false)
      await loadEntries()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add number',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  async function handleRemove(id: number) {
    if (!confirm('Are you sure you want to remove this number from the whitelist?')) {
      return
    }

    try {
      await removeWhitelistEntry(id)
      toast({
        title: 'Success',
        description: 'Number removed from whitelist',
      })
      await loadEntries()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to remove number',
        variant: 'destructive',
      })
    }
  }

  async function handleUpdateNote(entry: WhitelistEntry) {
    if (!newNote.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a note',
        variant: 'destructive',
      })
      return
    }

    try {
      setUploading(true)
      await updateWhitelistEntry(entry.id, newNote.trim())
      toast({
        title: 'Success',
        description: 'Note updated',
      })
      setEditingEntry(null)
      setNewNote('')
      await loadEntries()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update note',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  async function handleBulkAdd() {
    if (!bulkText.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter phone numbers',
        variant: 'destructive',
      })
      return
    }

    try {
      setUploading(true)
      
      // Parse input - each line can be: phone or phone,note
      const lines = bulkText.split('\n').filter(line => line.trim())
      const entriesToAdd: { whatsapp_e164: string; note?: string }[] = []
      
      for (const line of lines) {
        const [phone, ...noteParts] = line.split(',').map(s => s.trim())
        const e164 = formatPhoneToE164(phone, 'PH')
        
        if (e164) {
          entriesToAdd.push({
            whatsapp_e164: e164,
            note: noteParts.join(',').trim() || undefined,
          })
        }
      }

      if (entriesToAdd.length === 0) {
        toast({
          title: 'Error',
          description: 'No valid phone numbers found',
          variant: 'destructive',
        })
        return
      }

      const result = await bulkAddWhitelistEntries(entriesToAdd)
      
      toast({
        title: 'Bulk Import Complete',
        description: `Added ${result.success} numbers. ${result.failed} failed.`,
        variant: result.failed > 0 ? 'default' : 'default',
      })

      if (result.errors.length > 0) {
        console.error('Bulk import errors:', result.errors)
      }
      
      setBulkText('')
      setShowBulkDialog(false)
      await loadEntries()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to import numbers',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      setBulkText(text)
    }
    reader.readAsText(file)
  }

  const filteredEntries = entries.filter(entry =>
    entry.whatsapp_e164.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (entry.note?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  )

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // Pagination calculations
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedEntries = filteredEntries.slice(startIndex, endIndex)

  function goToPage(page: number) {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  function nextPage() {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  function previousPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f9ff] via-white to-white">
      <header className="border-b border-border/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 max-w-[1400px]">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-foreground">Whitelist Management</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Control access to your platform
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-[1400px]">
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#3CCB7F]/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-[#3CCB7F]" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">WhatsApp Whitelist</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {entries.length} authorized {entries.length === 1 ? 'member' : 'members'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setShowBulkDialog(true)} 
                  variant="outline"
                  className="rounded-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Bulk Import
                </Button>
                <Button 
                  onClick={() => setShowAddDialog(true)}
                  className="rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Number
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by phone number or note..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="items-per-page" className="text-sm whitespace-nowrap">
                  Show:
                </Label>
                <select
                  id="items-per-page"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="border rounded-md px-3 py-1.5 text-sm bg-background"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <Users className="h-12 w-12 text-muted-foreground/50 animate-pulse" />
                <p className="text-muted-foreground">Loading whitelist...</p>
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 rounded-full bg-muted/50 mx-auto flex items-center justify-center">
                  <Users className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-foreground">
                    {searchQuery ? 'No matching entries' : 'No whitelist entries yet'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery 
                      ? 'Try adjusting your search query'
                      : 'Add members to control platform access'
                    }
                  </p>
                </div>
                {!searchQuery && (
                  <Button onClick={() => setShowAddDialog(true)} className="rounded-full mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Member
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>WhatsApp Number</TableHead>
                        <TableHead>Note</TableHead>
                        <TableHead>Added</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedEntries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="font-mono">{entry.whatsapp_e164}</TableCell>
                          <TableCell>
                            <button
                              onClick={() => {
                                setEditingEntry(entry)
                                setNewNote(entry.note || '')
                              }}
                              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                            >
                              {entry.note || (
                                <span className="italic">Click to add note</span>
                              )}
                              <FileText className="h-3 w-3" />
                            </button>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(entry.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full hover:bg-destructive/10"
                              onClick={() => handleRemove(entry.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredEntries.length)} of{' '}
                      {filteredEntries.length} entries
                      {searchQuery && ` (filtered from ${entries.length} total)`}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={previousPage}
                        disabled={currentPage === 1}
                        className="rounded-full"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNumber: number
                          
                          if (totalPages <= 5) {
                            pageNumber = i + 1
                          } else if (currentPage <= 3) {
                            pageNumber = i + 1
                          } else if (currentPage >= totalPages - 2) {
                            pageNumber = totalPages - 4 + i
                          } else {
                            pageNumber = currentPage - 2 + i
                          }
                          
                          return (
                            <Button
                              key={pageNumber}
                              variant={currentPage === pageNumber ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => goToPage(pageNumber)}
                              className="w-9 h-9 rounded-full"
                            >
                              {pageNumber}
                            </Button>
                          )
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className="rounded-full"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Add Number Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Number to Whitelist</DialogTitle>
            <DialogDescription>
              Enter a WhatsApp number to authorize. Format: +639154901224 or 09154901224
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                placeholder="+639154901224"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Note (Optional)</Label>
              <Input
                id="note"
                placeholder="e.g., John Doe, VIP Customer"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={uploading}>
              {uploading ? 'Adding...' : 'Add to Whitelist'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Note Dialog */}
      <Dialog open={!!editingEntry} onOpenChange={() => setEditingEntry(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
            <DialogDescription>
              Update the note for {editingEntry?.whatsapp_e164}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-note">Note</Label>
              <Input
                id="edit-note"
                placeholder="e.g., John Doe, VIP Customer"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingEntry(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => editingEntry && handleUpdateNote(editingEntry)}
              disabled={uploading}
            >
              {uploading ? 'Saving...' : 'Save Note'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Import Dialog */}
      <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bulk Import Numbers</DialogTitle>
            <DialogDescription>
              Import multiple numbers at once. Enter one number per line.
              Format: phone or phone,note
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Upload CSV/TXT File (Optional)</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bulk-text">Or Paste Numbers</Label>
              <textarea
                id="bulk-text"
                className="w-full min-h-[200px] p-3 rounded-md border border-input bg-background"
                placeholder={`+639154901224,John Doe\n+639876543210,Jane Smith\n09123456789`}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Example: +639154901224,John Doe
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkAdd} disabled={uploading}>
              {uploading ? 'Importing...' : 'Import Numbers'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
