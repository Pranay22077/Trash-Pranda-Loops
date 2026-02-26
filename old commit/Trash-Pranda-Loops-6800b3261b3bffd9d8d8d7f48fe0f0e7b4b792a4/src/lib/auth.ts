import { supabase } from './supabase';

export interface SignUpData {
  email: string;
  password: string;
  username: string;
  displayName?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export const authService = {
  // Sign up new user
  async signUp({ email, password, username, displayName }: SignUpData) {
    // First, check if email provider is enabled by trying to sign up
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            display_name: displayName || username,
          },
          emailRedirectTo: undefined, // Disable email confirmation redirect
        },
      });

      if (error) {
        // If email signups are disabled, provide helpful error
        if (error.message.includes('disabled')) {
          throw new Error('Please enable Email provider in Supabase Dashboard: Authentication → Providers → Email');
        }
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  // Sign in existing user
  async signIn({ email, password }: SignInData) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current session
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  // Get current user
  async getUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  // Listen to auth changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },

  // Reset password
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  },

  // Update password
  async updatePassword(newPassword: string) {
    const { error} = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  },
};
