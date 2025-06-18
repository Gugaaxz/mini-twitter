'use client';

import supabase from '@/lib/supa';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export default function Login() {
  return (
    <main className="max-w-sm mx-auto p-6">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['google']}
        redirectTo={
          typeof window !== 'undefined' ? `${location.origin}/` : undefined
        }
      />
    </main>
  );
}
