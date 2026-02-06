import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Calendar, MapPin, Users, Copy, ExternalLink, ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'
import RsvpTable from '@/components/tables/RsvpTable'
import CopyButton from '@/components/shared/CopyButton'

// Helper function to handle potential async params in Next.js 15+
export default async function EventPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
    // Await params if it's a promise (handling both Next.js 14 and 15 patterns gracefully)
    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;

    const supabase = await createClient()

    // Fetch event details
    const { data: event, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single()

    if (eventError || !event) {
        notFound()
    }

    // Fetch initial RSVPs
    const { data: rsvps, error: rsvpsError } = await supabase
        .from('rsvps')
        .select('*')
        .eq('event_id', id)
        .order('created_at', { ascending: false })

    const rsvpCount = rsvps?.filter(r => r.status === 'yes').length || 0
    const plusOneCount = rsvps?.reduce((acc, curr) => acc + (curr.status === 'yes' ? curr.plus_one_count : 0), 0) || 0
    const totalAttendees = rsvpCount + plusOneCount

    const baseUrl = (process.env.NEXT_EVENT_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '')
    const shareUrl = `${baseUrl}/event/${id}`

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                    <Link href="/admin/dashboard" className="text-sm text-gray-500 hover:text-gray-700 flex items-center mb-2">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
                    <div className="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                        <span className="flex items-center">
                            <Calendar className="mr-1.5 h-4 w-4" />
                            {new Date(event.date).toLocaleDateString()} {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="flex items-center">
                            <MapPin className="mr-1.5 h-4 w-4" />
                            {event.location}
                        </span>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <Link
                        href={`/event/${id}`}
                        target="_blank"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                        <ExternalLink className="h-4 w-4 mr-2 text-gray-500" />
                        View Public Page
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100 p-6 flex items-center space-x-4">
                    <div className="bg-indigo-100 p-3 rounded-xl">
                        <Users className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 truncate">Confirmed Guests</p>
                        <p className="text-2xl font-bold text-gray-900">{totalAttendees}</p>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100 p-6 flex items-center space-x-4">
                    <div className="bg-purple-100 p-3 rounded-xl">
                        <MapPin className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 truncate">Capacity</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {event.max_capacity ? `${totalAttendees} / ${event.max_capacity}` : 'Unlimited'}
                        </p>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100 p-6">
                    <p className="text-sm font-medium text-gray-500 truncate mb-3">Event Share Link</p>
                    <div className="flex rounded-md shadow-sm">
                        <input
                            type="text"
                            readOnly
                            value={shareUrl}
                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 bg-gray-50 text-gray-500 truncate"
                        />
                        <CopyButton text={shareUrl} />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Guest List</h3>
                <RsvpTable initialRsvps={rsvps || []} eventId={id} />
            </div>
        </div>
    )
}
