'use client'

import { createEvent } from '@/app/admin/actions'
import { Loader2 } from 'lucide-react'
import { useActionState } from 'react'

export default function EventForm() {
    const today = new Date().toISOString().split('T')[0];
    const [state, formAction, isPending] = useActionState(async (state: any, payload: FormData) => {
        const date = payload.get('date') as string;
        const time = payload.get('time') as string;
        const selectedDateTime = new Date(`${date}T${time}`);

        if (selectedDateTime < new Date()) {
            return { error: 'Event date and time must be in the future.' };
        }

        const res = await createEvent(payload);
        if (res?.error) return { error: res.error };
        return { error: null }; // Should redirect on success
    }, { error: null });

    return (
        <form action={formAction} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Event Title <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                    placeholder="e.g. Summer Wedding 2024"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        name="date"
                        id="date"
                        required
                        min={today}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                    />
                </div>
                <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                        Time <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="time"
                        name="time"
                        id="time"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="location"
                    id="location"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                    placeholder="e.g. Grand Hotel, New York"
                />
            </div>

            <div>
                <label htmlFor="max_capacity" className="block text-sm font-medium text-gray-700">
                    Max Capacity (Optional)
                </label>
                <input
                    type="number"
                    name="max_capacity"
                    id="max_capacity"
                    min="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                    placeholder="Leave blank for unlimited"
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    name="description"
                    id="description"
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                    placeholder="Details about the event..."
                />
            </div>

            <div className="flex items-start">
                <div className="flex items-center h-5">
                    <input
                        id="allow_plus_one"
                        name="allow_plus_one"
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="allow_plus_one" className="font-medium text-gray-700">
                        Allow guests to bring a +1?
                    </label>
                    <p className="text-gray-500">Enable this if you want guests to invite a partner.</p>
                </div>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isPending ? (
                        <Loader2 className="animate-spin h-5 w-5" />
                    ) : "Create Event"}
                </button>
            </div>
            {state?.error && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                    {state.error}
                </div>
            )}
        </form>
    )
}
