'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { verifyWhatsAppNumber, checkExistingWhatsAppProfile, setPassword as createPassword } from '@/lib/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { formatPhoneToE164 } from '@/lib/format'
import Link from 'next/link'

export default function JoinPage() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Check if user is already signed in
      const { data: userData } = await supabase.auth.getUser()

      // Check if this WhatsApp number already has a profile
      const existingProfile = await checkExistingWhatsAppProfile(phoneNumber)

      if (!userData.user) {
        // If WhatsApp already exists, prevent new anonymous user creation
        if (existingProfile.exists) {
          toast({
            title: 'Account already exists',
            description: 'This WhatsApp number is already registered. Please access from your original device or contact admin to reset your account.',
            variant: 'destructive',
          })
          setIsLoading(false)
          return
        }

        // Sign up anonymously for NEW users only
        const { error: signUpError } = await supabase.auth.signInAnonymously()
        
        if (signUpError) {
          throw new Error(
            'Failed to create session. Please enable Anonymous sign-ins in Supabase Dashboard → Authentication → Providers'
          )
        }
      }

      // Verify WhatsApp number
      const result = await verifyWhatsAppNumber(phoneNumber)

      if (result.success) {
        toast({
          title: 'Success!',
          description: 'Your WhatsApp number has been verified',
        })
        
        // If user needs to set a password, show password form
        if (result.needsPassword) {
          setShowPasswordForm(true)
        } else {
          // User already has password, redirect to batches
          router.push('/batches')
        }
      } else {
        toast({
          title: 'Verification failed',
          description: result.message,
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    console.log('Form submitted with email:', email, 'password length:', password.length)
    
    // Validate email
    if (!email || !email.trim() || !email.includes('@')) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      })
      return
    }
    
    // Validate password
    if (password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters',
        variant: 'destructive',
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure both passwords are the same',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      console.log('Calling createPassword with:', email.trim())
      const result = await createPassword(email.trim(), password)

      if (result.success) {
        toast({
          title: 'Password created!',
          description: result.message,
        })
        router.push('/batches')
      } else {
        toast({
          title: 'Failed to set password',
          description: result.message,
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  function skipPasswordSetup() {
    toast({
      title: 'Skipped for now',
      description: 'You can set a password later in your profile settings',
    })
    router.push('/batches')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md border-primary/20 shadow-xl">
        {!showPasswordForm ? (
          // WhatsApp Verification Form
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Welcome to Mama Mica
              </CardTitle>
              <CardDescription>
                Enter your WhatsApp number to get started with our group buy peptides
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">WhatsApp Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+63 915 490 1224"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Include country code (e.g., +63 for Philippines)
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Verifying...' : 'Continue'}
                </Button>

                <div className="text-sm text-muted-foreground space-y-2 pt-4">
                  <p>
                    ℹ️ Your WhatsApp number must be pre-approved by our admin team
                  </p>
                  <p>
                    Contact admin at{' '}
                    <a
                      href={`https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '639154901224'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      +63 915 490 1224
                    </a>
                    {' '}to request access
                  </p>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="text-sm text-center text-muted-foreground">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-primary hover:underline font-medium">
                  Log in with password
                </Link>
              </div>
            </CardFooter>
          </>
        ) : (
          // Password Setup Form
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Secure Your Account
              </CardTitle>
              <CardDescription>
                Create a password to access your account from any device
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    You&apos;ll use this email to log in
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Password'}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full" 
                    onClick={skipPasswordSetup}
                    disabled={isLoading}
                  >
                    Skip for Now
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground space-y-2 pt-2">
                  <p className="text-center">
                    🔒 Setting a password allows you to log in from multiple devices
                  </p>
                </div>
              </form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}

