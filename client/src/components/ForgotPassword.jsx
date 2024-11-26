import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { authService } from '@/services/api'

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export default function ForgotPassword() {
  const [securityQuestion, setSecurityQuestion] = useState('')
  const navigate = useNavigate()

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data) => {
    try {
      const response = await authService.forgotPassword(data.email)
      if (response.success) {
        setSecurityQuestion(response.securityQuestion)
        toast.success('Security question retrieved')
        // Navigate to reset password page and pass the email and security question
        navigate('/reset-password', { state: { email: data.email, securityQuestion: response.securityQuestion } })
      } else {
        toast.error(response.message || 'Failed to retrieve security question')
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
          <CardTitle className="text-2xl font-bold text-center">Forgot Password</CardTitle>
          <CardDescription className="text-center">
            Enter your email to retrieve your security question
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
                      <Input placeholder="Enter your email" {...field} />
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
                    <Loader2 className="mr-2 h-
4 w-4 animate-spin" />
                    Retrieving...
                  </>
                ) : (
                  'Retrieve Security Question'
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

