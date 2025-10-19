'use client'

import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { Menu, Package, ShoppingBag, Settings, User, Home, Pill, HelpCircle } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function BatchesHeader() {
  const { profile, isAdmin } = useAuth()
  const pathname = usePathname()

  return (
    <header className="border-b border-border/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 max-w-[1200px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-black tracking-tight text-foreground">
              Mama Mica
            </Link>
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link 
                href="/batches" 
                className={`text-sm font-medium transition-colors ${
                  pathname === '/batches' || pathname?.startsWith('/batches/')
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Batches
              </Link>
              <Link 
                href="/dosing-guide" 
                className={`text-sm font-medium transition-colors ${
                  pathname?.startsWith('/dosing-guide')
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Dosing Guide
              </Link>
              <Link 
                href="/faq" 
                className={`text-sm font-medium transition-colors ${
                  pathname?.startsWith('/faq')
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                FAQ
              </Link>
              <Link 
                href="/orders" 
                className={`text-sm font-medium transition-colors ${
                  pathname?.startsWith('/orders')
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                My Orders
              </Link>
              {isAdmin && (
                <Link 
                  href="/admin" 
                  className={`text-sm font-medium transition-colors ${
                    pathname?.startsWith('/admin')
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Admin
                </Link>
              )}
            </nav>
          </div>
          
          <div className="flex items-center gap-3">
            {/* User Info - Desktop */}
            {profile?.whatsapp_e164 && (
              <span className="hidden lg:block text-sm text-muted-foreground">
                {profile.whatsapp_e164}
              </span>
            )}
            
            {/* Mobile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {profile?.whatsapp_e164 && (
                  <>
                    <div className="px-2 py-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground truncate">{profile.whatsapp_e164}</span>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/" className="flex items-center cursor-pointer">
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/batches" className="flex items-center cursor-pointer">
                    <Package className="h-4 w-4 mr-2" />
                    Batches
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dosing-guide" className="flex items-center cursor-pointer">
                    <Pill className="h-4 w-4 mr-2" />
                    Dosing Guide
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/faq" className="flex items-center cursor-pointer">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    FAQ
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="flex items-center cursor-pointer">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    My Orders
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center cursor-pointer">
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}

