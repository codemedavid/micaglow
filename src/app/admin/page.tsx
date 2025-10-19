'use client'

import Link from 'next/link'
import { useBatches } from '@/hooks/use-batches'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { 
  Package, 
  Users, 
  ShoppingCart, 
  ArrowLeft, 
  Plus, 
  Settings, 
  TrendingUp,
  Activity,
  Layers,
  Clock,
  CheckCircle2,
  Sparkles
} from 'lucide-react'
import { getWhitelistCount } from '@/lib/api/admin'

export default function AdminDashboard() {
  const { isAdmin, isLoading } = useAuth()
  const { data: batches } = useBatches()
  const router = useRouter()
  const [whitelistCount, setWhitelistCount] = useState<number | null>(null)

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/batches')
    }
  }, [isAdmin, isLoading, router])

  useEffect(() => {
    async function loadWhitelistCount() {
      try {
        const count = await getWhitelistCount()
        setWhitelistCount(count)
      } catch (error) {
        console.error('Failed to load whitelist count:', error)
      }
    }
    
    if (isAdmin) {
      loadWhitelistCount()
    }
  }, [isAdmin])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f7f9ff] via-white to-white">
        <div className="space-y-4 text-center">
          <Activity className="h-8 w-8 animate-pulse text-primary mx-auto" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  const activeBatches = batches?.filter((b) => 
    ['OPEN', 'FILLING', 'LOCKED'].includes(b.status)
  ).length || 0

  const totalBatches = batches?.length || 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f9ff] via-white to-white">
      {/* Header */}
      <header className="border-b border-border/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 max-w-[1400px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/batches">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-foreground">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Manage your platform
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="rounded-full px-4 py-1.5">
              <Sparkles className="h-3.5 w-3.5 mr-2" />
              Admin Access
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-[1400px] space-y-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Active Batches Card */}
          <Card className="border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
            <CardContent className="p-8 relative">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Batches</p>
                    <p className="text-4xl font-black text-foreground mt-1">{activeBatches}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Currently open or filling
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Batches Card */}
          <Card className="border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl" />
            <CardContent className="p-8 relative">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center shadow-lg">
                    <Layers className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Batches</p>
                    <p className="text-4xl font-black text-foreground mt-1">{totalBatches}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    All time batches
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Whitelist Card */}
          <Card className="border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#3CCB7F]/5 rounded-full blur-3xl" />
            <CardContent className="p-8 relative">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3CCB7F] to-[#3CCB7F]/70 flex items-center justify-center shadow-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Whitelist</p>
                    <p className="text-4xl font-black text-foreground mt-1">
                      {whitelistCount !== null ? whitelistCount : '-'}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Authorized users
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions - Spanning 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Settings className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
                    <p className="text-sm text-muted-foreground">Manage your platform</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Link href="/admin/batches/new">
                    <Button className="w-full rounded-full shadow-lg hover:shadow-xl transition-all text-base h-12">
                      <Plus className="h-5 w-5 mr-2" />
                      Create New Batch
                    </Button>
                  </Link>
                  <Link href="/admin/peptides">
                    <Button variant="outline" className="w-full rounded-full text-base h-12 hover:bg-muted">
                      <Package className="h-5 w-5 mr-2" />
                      Manage Peptides
                    </Button>
                  </Link>
                  <Link href="/admin/whitelist">
                    <Button variant="outline" className="w-full rounded-full text-base h-12 hover:bg-muted">
                      <Users className="h-5 w-5 mr-2" />
                      Manage Whitelist
                    </Button>
                  </Link>
                  <Link href="/admin/orders">
                    <Button variant="outline" className="w-full rounded-full text-base h-12 hover:bg-muted">
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Review Orders
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Batches */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold">Recent Batches</CardTitle>
                      <p className="text-sm text-muted-foreground">Latest batch activity</p>
                    </div>
                  </div>
                  <Link href="/admin/batches">
                    <Button variant="ghost" size="sm" className="rounded-full">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {!batches || batches.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-muted/50 mx-auto flex items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      No batches yet. Create your first batch to get started!
                    </p>
                    <Link href="/admin/batches/new">
                      <Button size="sm" className="rounded-full mt-2">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Batch
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {batches.slice(0, 5).map((batch) => (
                      <Link
                        key={batch.id}
                        href={`/admin/batches/${batch.id}`}
                        className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-all duration-200 group"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {batch.name}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex-1 max-w-[200px]">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-semibold text-foreground">{batch.fill_percentage.toFixed(1)}%</span>
                              </div>
                              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-300"
                                  style={{ width: `${batch.fill_percentage}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <Badge className="rounded-full">
                          {batch.status}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* System Status Sidebar */}
          <div className="space-y-6">
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#3CCB7F]/10 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-[#3CCB7F]" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">System Status</CardTitle>
                    <p className="text-sm text-muted-foreground">All systems operational</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#3CCB7F]/5">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#3CCB7F] animate-pulse" />
                    <span className="text-sm font-medium text-foreground">Database</span>
                  </div>
                  <Badge className="bg-[#3CCB7F] text-white hover:bg-[#3CCB7F] rounded-full">
                    Connected
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#3CCB7F]/5">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#3CCB7F] animate-pulse" />
                    <span className="text-sm font-medium text-foreground">Authentication</span>
                  </div>
                  <Badge className="bg-[#3CCB7F] text-white hover:bg-[#3CCB7F] rounded-full">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#3CCB7F]/5">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#3CCB7F] animate-pulse" />
                    <span className="text-sm font-medium text-foreground">WhatsApp</span>
                  </div>
                  <Badge className="bg-[#3CCB7F] text-white hover:bg-[#3CCB7F] rounded-full">
                    Ready
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Platform Stats */}
            <Card className="border-border/50 shadow-sm bg-gradient-to-br from-primary via-primary to-primary/90 text-white overflow-hidden relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent_50%)]" />
              <CardContent className="p-6 relative">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    <h3 className="font-bold text-lg">Platform Stats</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-3xl font-black">{totalBatches}</div>
                      <div className="text-sm text-white/80">Total Batches</div>
                    </div>
                    <div>
                      <div className="text-3xl font-black">{whitelistCount || 0}</div>
                      <div className="text-sm text-white/80">Active Members</div>
                    </div>
                    <div>
                      <div className="text-3xl font-black">{activeBatches}</div>
                      <div className="text-sm text-white/80">Live Batches</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

