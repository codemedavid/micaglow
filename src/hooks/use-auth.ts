'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { getProfile } from '@/lib/api/auth'

export function useAuth() {
  const supabase = createClient()

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser()
      return data.user
    },
  })

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => getProfile(),
    enabled: !!user,
  })

  return {
    user,
    profile,
    isLoading: isUserLoading || isProfileLoading,
    isAdmin: profile?.role === 'admin',
    isAuthenticated: !!user && !!profile?.whatsapp_e164,
  }
}

