'use client'

import { startTransition, useActionState } from 'react'
import { login, signup } from './actions'
import { Loader2 } from 'lucide-react'

// Define the initial state type
const initialState = {
    error: null as string | null,
}

export default function LoginPage() {
    // Correct usage of useActionState (or useFormState in older React versions, but Next 15 prefers useActionState from react)
    // Actually, in Next 14/15 canary it's useActionState, but standard might be useFormState.
    // Let's stick to a simpler async transition approach if useActionState is tricky without precise version check.
    // But wait, I'm using "react": "19.2.3" in package.json (from user's file view), which is very new (RC?).
    // 'useActionState' is likely available. 
    // However, the action returns `{ error: string } | void`.

    // Let's implement a simple form handling manually for maximum control/compatibility.

    const [state, formAction, isPending] = useActionState(async (state: any, payload: FormData) => {
        const res = await login(payload);
        console.log(res);

        if (res?.error) return { error: res.error };
        return { error: null };
    }, { error: null });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Admin Login
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <span className="font-medium text-indigo-600 hover:text-indigo-500 cursor-not-allowed opacity-50">
                            sign up (disabled)
                        </span>
                    </p>
                </div>
                <form className="mt-8 space-y-6" action={formAction}>
                    <input type="hidden" name="remember" value="true" />
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isPending ? (
                                <Loader2 className="animate-spin h-5 w-5" />
                            ) : "Sign in"}
                        </button>
                    </div>

                    {state?.error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                            {state.error}
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}
