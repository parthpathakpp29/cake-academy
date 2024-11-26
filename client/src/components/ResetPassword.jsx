import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { authService } from '@/services/api'
import { PasswordInput } from '@/components/PasswordInput'

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  securityAnswer: z.string().min(1, 'Security answer is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export default function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: location.state?.email || '',
      securityAnswer: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data) => {
    try {
      const response = await authService.resetPassword(data)
      if (response.success) {
        toast.success('Password reset successfully')
        navigate('/sign-in')
      } else {
        toast.error(response.message || 'Failed to reset password')
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message || 'An error occurred')
    }
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Answer your security question to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Security Question</FormLabel>
                <FormControl>
                  <Input value={location.state?.securityQuestion || ''} readOnly />
                </FormControl>
              </FormItem>
              <FormField
                control={form.control}
                name="securityAnswer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Security Answer</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your security answer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="Enter new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="Confirm new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => navigate('/sign-in')}>
            Back to Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

