'use client'

import { submitRsvp } from '@/app/event/actions'
import { Loader2 } from 'lucide-react'
import { useState, useTransition } from 'react'

export default function RsvpForm({
    eventId,
    allowPlusOne,
    isFull
}: {
    eventId: string,
    allowPlusOne: boolean,
    isFull: boolean
}) {
    const [status, setStatus] = useState<string>('yes')
    const [error, setError] = useState<null | string>(null)
    const [isPending, startTransition] = useTransition()

    const handleSubmit = (formData: FormData) => {
        setError(null)
        startTransition(async () => {
            const res = await submitRsvp(eventId, formData)
            if (res?.error) {
                setError(res.error)
            }
        })
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            {isFull && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                This event has reached its maximum capacity. You can still sign up for the <strong>Waitlist</strong>.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label className="text-base font-medium text-gray-900">Will you be attending?</label>
                    <div className="mt-2 space-y-2">
                        {!isFull && (
                            <div className="flex items-center">
                                <input
                                    id="status-yes"
                                    name="status"
                                    type="radio"
                                    value="yes"
                                    checked={status === 'yes'}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                />
                                <label htmlFor="status-yes" className="ml-3 block text-sm font-medium text-gray-700">
                                    Joyfully Accept
                                </label>
                            </div>
                        )}
                        <div className="flex items-center">
                            <input
                                id="status-no"
                                name="status"
                                type="radio"
                                value="no"
                                checked={status === 'no'}
                                onChange={(e) => setStatus(e.target.value)}
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                            />
                            <label htmlFor="status-no" className="ml-3 block text-sm font-medium text-gray-700">
                                Regretfully Decline
                            </label>
                        </div>
                        {isFull && (
                            <div className="flex items-center">
                                <input
                                    id="status-waitlist"
                                    name="status"
                                    type="radio"
                                    value="waitlist"
                                    checked={status === 'waitlist'}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                />
                                <label htmlFor="status-waitlist" className="ml-3 block text-sm font-medium text-gray-700">
                                    Join Waitlist
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                    />
                </div>

                {status === 'yes' && (
                    <>
                        {allowPlusOne && (
                            <div>
                                <label htmlFor="plus_one" className="block text-sm font-medium text-gray-700">
                                    Number of Guests (+1s)
                                </label>
                                <select
                                    id="plus_one"
                                    name="plus_one"
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                                >
                                    <option value="0">Just me</option>
                                    <option value="1">+1 Guest</option>
                                    {/* Could add more if logic permits, but task said +1 */}
                                </select>
                            </div>
                        )}

                        <div>
                            <label htmlFor="dietary" className="block text-sm font-medium text-gray-700">
                                Dietary Requirements (Optional)
                            </label>
                            <textarea
                                name="dietary"
                                id="dietary"
                                rows={2}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                                placeholder="Vegetarian, allergies, etc."
                            />
                        </div>
                    </>
                )}
            </div>

            <div>
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70"
                >
                    {isPending ? <Loader2 className="animate-spin h-5 w-5" /> : "Submit RSVP"}
                </button>
            </div>
            {error && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                    {error}
                </div>
            )}
        </form>
    )
}
