import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { authService } from '@/services/api'
import { useAuth } from '@/context/AuthContext'
import { loginSchema } from '@/utils/validations'
import { PasswordInput } from '@/components/PasswordInput'

export default function SignIn() {
    const navigate = useNavigate()
    const { user, login } = useAuth()

    useEffect(() => {
        if (user) {
            navigate(user.role === 1 ? '/admin/dashboard' : '/dashboard', { replace: true })
        }
    }, [user, navigate])

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const onSubmit = async (data) => {
        try {
            const response = await authService.signIn(data)

            if (response.success) {
                login(response.user, response.token)
                toast.success('Signed in successfully')
                navigate(response.user.role === 1 ? '/admin/dashboard' : '/dashboard')
            } else {
                toast.error(response.message || 'Sign in failed')
            }
        } catch (error) {
            console.error(error)
            toast.error(error.message || 'An error occurred during sign in')
        }
    }


    return (
        <div className="container mx-auto flex items-center justify-center min-h-screen px-4 py-10">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Sign in to your account</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email and password to sign in
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <PasswordInput placeholder="Enter your password" {...field} />
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
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-sm text-center">
                        <Link to="/forgot-password" className="text-primary hover:underline">
                            Forgot your password?
                        </Link>
                    </div>
                    <div className="text-sm text-center">
                        Don't have an account?{' '}
                        <Link to="/sign-up" className="text-primary hover:underline">
                            Sign up
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}   