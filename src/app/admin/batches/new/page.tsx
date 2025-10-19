'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useCreateBatch } from '@/hooks/use-admin'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft } from 'lucide-react'
import { BATCH_STATUS } from '@/lib/constants'

const batchSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  status: z.enum(['DRAFT', 'OPEN', 'FILLING', 'LOCKED', 'PAYMENT', 'CLOSED']),
  opens_at: z.string().optional(),
  closes_at: z.string().optional(),
})

type BatchFormData = z.infer<typeof batchSchema>

export default function NewBatchPage() {
  const router = useRouter()
  const { mutate: createBatch, isPending } = useCreateBatch()

  const form = useForm<BatchFormData>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      name: '',
      status: 'DRAFT',
      opens_at: '',
      closes_at: '',
    },
  })

  function onSubmit(data: BatchFormData) {
    createBatch(
      {
        name: data.name,
        status: data.status,
        opens_at: data.opens_at || null,
        closes_at: data.closes_at || null,
      },
      {
        onSuccess: (batch) => {
          router.push(`/admin/batches/${batch.id}`)
        },
      }
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-primary/10 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Create New Batch</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Batch Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Batch Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="October 2025 Group Buy" {...field} />
                      </FormControl>
                      <FormDescription>
                        A descriptive name for this batch
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.keys(BATCH_STATUS).map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Start with DRAFT, then transition to OPEN when ready
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="opens_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Opens At (Optional)</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormDescription>
                        When the batch becomes available to customers
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="closes_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Closes At (Optional)</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormDescription>
                        Deadline for orders in this batch
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <Button type="submit" disabled={isPending}>
                    {isPending ? 'Creating...' : 'Create Batch'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

