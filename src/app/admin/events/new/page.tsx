import EventForm from '@/components/forms/EventForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewEventPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <Link href="/admin/dashboard" className="text-sm text-gray-500 hover:text-gray-700 flex items-center mb-2">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Dashboard
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
                <p className="text-gray-500 mt-1">Fill in the details for your new event.</p>
            </div>
            <EventForm />
        </div>
    )
}
