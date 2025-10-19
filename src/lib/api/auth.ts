import { createClient } from '@/lib/supabase/client'
import { formatPhoneToE164 } from '@/lib/format'
import type { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

interface WhatsAppVerifyResponse {
  success: boolean
  message: string
  userId?: string
  needsPassword?: boolean // Indicates if user needs to set a password
}

/**
 * Check if WhatsApp number already has an existing profile
 * Uses a database function to avoid exposing user IDs
 */
export async function checkExistingWhatsAppProfile(
  phoneNumber: string
): Promise<{ exists: boolean }> {
  const supabase = createClient()
  
  const e164 = formatPhoneToE164(phoneNumber, 'PH')
  if (!e164) return { exists: false }

  // Call database function to safely check if WhatsApp exists
  const { data, error } = await (supabase as any).rpc('check_whatsapp_exists', {
    phone_number: e164
  })

  if (error) {
    console.error('Error checking WhatsApp:', error)
    return { exists: false }
  }

  return {
    exists: !!data,
  }
}

/**
 * Verify WhatsApp number against whitelist and create/update profile
 */
export async function verifyWhatsAppNumber(
  phoneNumber: string
): Promise<WhatsAppVerifyResponse> {
  const supabase = createClient()

  // Format to E.164
  const e164 = formatPhoneToE164(phoneNumber, 'PH')
  
  if (!e164) {
    return {
      success: false,
      message: 'Invalid phone number format',
    }
  }

  // Check if number is whitelisted
  const { data: whitelist, error: whitelistError } = await supabase
    .from('whatsapp_whitelist')
    .select('*')
    .eq('whatsapp_e164', e164)
    .single()

  if (whitelistError || !whitelist) {
    return {
      success: false,
      message: 'This WhatsApp number is not authorized. Please contact admin.',
    }
  }

  // Get current user
  const { data: userData } = await supabase.auth.getUser()
  
  if (!userData.user) {
    return {
      success: false,
      message: 'Please sign in first',
    }
  }

  // Check if this WhatsApp number already exists in another profile
  const { data: existingProfile } = await (supabase as any)
    .from('profiles')
    .select('id')
    .eq('whatsapp_e164', e164)
    .maybeSingle()

  // If WhatsApp exists and belongs to a different user, prevent duplicate
  if (existingProfile && existingProfile.id !== userData.user.id) {
    return {
      success: false,
      message: 'This WhatsApp number is already linked to another account. Please use a different device or clear your browser data.',
    }
  }

  // Use upsert to handle both insert and update cases
  // This prevents duplicate key errors from the trigger
  const { error: upsertError } = await (supabase as any)
    .from('profiles')
    .upsert({
      id: userData.user.id,
      whatsapp_e164: e164,
      role: 'customer',
    }, {
      onConflict: 'id'
    })

  if (upsertError) {
    console.error('Profile upsert error:', upsertError)
    return {
      success: false,
      message: `Failed to update profile: ${upsertError.message}`,
    }
  }

  // Check if user has a password set (anonymous users don't have email/password)
  const isAnonymous = userData.user.is_anonymous || !userData.user.email

  return {
    success: true,
    message: 'WhatsApp number verified successfully',
    userId: userData.user.id,
    needsPassword: isAnonymous, // Prompt to set password if anonymous
  }
}

/**
 * Set password for anonymous user (upgrades to email/password auth)
 */
export async function setPassword(
  email: string,
  password: string
): Promise<{ success: boolean; message: string }> {
  const supabase = createClient()

  try {
    // Validate inputs
    if (!email || !email.trim() || !email.includes('@')) {
      console.error('Invalid email:', email)
      return {
        success: false,
        message: 'Please enter a valid email address',
      }
    }

    if (!password || password.length < 6) {
      console.error('Invalid password length')
      return {
        success: false,
        message: 'Password must be at least 6 characters',
      }
    }

    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser()
    
    if (userError || !userData.user) {
      console.error('No user session:', userError)
      return {
        success: false,
        message: 'No active session. Please refresh and try again.',
      }
    }

    console.log('Current user:', userData.user.id, 'is_anonymous:', userData.user.is_anonymous)

    // Update user with email and password
    // This converts anonymous user to email/password user
    const { data: updateData, error: updateError } = await supabase.auth.updateUser({
      email: email.trim(),
      password: password,
    })

    if (updateError) {
      console.error('Update user error:', updateError)
      return {
        success: false,
        message: updateError.message || 'Failed to set password',
      }
    }

    if (!updateData.user) {
      return {
        success: false,
        message: 'Failed to update account',
      }
    }

    console.log('User updated successfully:', updateData.user.id)

    return {
      success: true,
      message: 'Password set successfully! You can now log in from any device.',
    }
  } catch (error) {
    console.error('Set password error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to set password',
    }
  }
}

/**
 * Login with email and password
 */
export async function loginWithPassword(
  email: string,
  password: string
): Promise<{ success: boolean; message: string }> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return {
        success: false,
        message: error.message,
      }
    }

    if (!data.user) {
      return {
        success: false,
        message: 'Login failed',
      }
    }

    // Check if user has WhatsApp verified
    const { data: profile } = await (supabase as any)
      .from('profiles')
      .select('whatsapp_e164')
      .eq('id', data.user.id)
      .single()

    if (!profile?.whatsapp_e164) {
      return {
        success: false,
        message: 'Please verify your WhatsApp number first',
      }
    }

    return {
      success: true,
      message: 'Login successful!',
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Login failed',
    }
  }
}

/**
 * Logout current user
 */
export async function logout(): Promise<void> {
  const supabase = createClient()
  await supabase.auth.signOut()
}

/**
 * Get current user profile
 */
export async function getProfile(): Promise<Profile | null> {
  const supabase = createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return null

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userData.user.id)
    .single()

  if (error) return null

  return profile
}
