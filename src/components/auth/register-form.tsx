'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuthStore } from '@/lib/store/auth';
import { RegisterForm as RegisterFormData } from '@/lib/types';
import { Loader2, Mail, Lock, User } from 'lucide-react';
import { OAuthButtons } from './oauth-buttons';

export function RegisterForm() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterFormData>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      clearError();
      await register(data.username, data.email, data.password);
      router.push('/dashboard');
    } catch (err) {
      // Error is handled in the store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-sapphire-50 to-violet-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 relative overflow-hidden">
      {/* Revolutionary Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-100/20 via-transparent to-cyan-100/20 dark:from-emerald-900/10 dark:to-cyan-900/10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-sapphire-400/10 to-violet-400/10 rounded-full blur-3xl animate-pulse-soft animation-delay-200" />
      
      <Card className="w-full max-w-lg card-premium shadow-strong border-0 backdrop-blur-sm bg-card/80 relative overflow-hidden">
        {/* Card Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-card via-card to-card/95" />
        
        <CardHeader className="space-y-6 relative">
          {/* Revolutionary Logo */}
          <div className="flex justify-center">
            <div className="relative group">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-cyan-500 to-sapphire-500 flex items-center justify-center shadow-glow-emerald transition-all duration-500 group-hover:scale-110">
                <span className="text-white font-bold text-2xl">T</span>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500 via-cyan-500 to-sapphire-500 opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500" />
            </div>
          </div>
          
          <div className="text-center space-y-3">
            <CardTitle className="text-3xl font-bold text-gradient-primary">
              Create your account
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground font-medium">
              Join <span className="text-gradient-primary font-semibold">Trendit</span> and unlock powerful Reddit analytics
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 relative">
          {error && (
            <Alert className="border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-400" variant="destructive">
              <AlertDescription className="font-medium">{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="username"
                rules={{
                  required: 'Username is required',
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters',
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: 'Username can only contain letters, numbers, and underscores',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground">Username</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                        <Input
                          placeholder="Choose your username"
                          className="pl-12 h-12 input-premium text-base border-gray-300 dark:border-gray-600 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground">Email Address</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                        <Input
                          placeholder="name@company.com"
                          className="pl-12 h-12 input-premium text-base border-gray-300 dark:border-gray-600 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                rules={{
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                    message: 'Password must contain uppercase, lowercase, number, and special character',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground">Password</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a secure password"
                          className="pl-12 pr-12 h-12 input-premium text-base border-gray-300 dark:border-gray-600 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-accent/50 transition-all duration-200"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                          ) : (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold shadow-glow-emerald transition-all duration-300 hover:scale-[1.02] text-base"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {isLoading ? 'Creating your account...' : 'Create Your Account'}
              </Button>
            </form>
          </Form>

          {/* Enhanced OAuth Section */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-4 text-muted-foreground font-semibold tracking-wide">Or continue with</span>
            </div>
          </div>

          <OAuthButtons isLoading={isLoading} />
        </CardContent>
        <CardFooter className="flex flex-col space-y-6 relative bg-gradient-to-t from-muted/20 to-transparent">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="text-gradient-primary font-semibold hover:underline transition-all duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground/80">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-primary hover:text-primary/80 font-medium hover:underline transition-colors">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary hover:text-primary/80 font-medium hover:underline transition-colors">
                Privacy Policy
              </Link>
            </p>
            <p className="text-xs text-muted-foreground/60">
              Secure • Encrypted • Privacy-First
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}