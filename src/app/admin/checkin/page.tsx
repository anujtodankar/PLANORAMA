import { createClient } from '@/utils/supabase/server'
import { CheckCircle2, User, Mail, Calendar, MapPin, XCircle } from 'lucide-react'
import { checkInGuest } from '../actions'

export default async function CheckInPage({
    searchParams
}: {
    searchParams: { rsvpId?: string } | Promise<{ rsvpId?: string }>
}) {
    const resolvedSearchParams = searchParams instanceof Promise ? await searchParams : searchParams;
    const rsvpId = resolvedSearchParams.rsvpId

    if (!rsvpId) {
        return (
            <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg text-center">
                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h1 className="text-xl font-bold text-gray-900">Invalid QR Code</h1>
                <p className="text-gray-600 mt-2">No guest ID found in the scan.</p>
            </div>
        )
    }

    const supabase = await createClient()

    // Fetch RSVP and join with event
    const { data: rsvp, error } = await supabase
        .from('rsvps')
        .select(`
            *,
            events (
                title,
                location,
                date
            )
        `)
        .eq('id', rsvpId)
        .single()

    if (error || !rsvp) {
        return (
            <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg text-center">
                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h1 className="text-xl font-bold text-gray-900">Guest Not Found</h1>
                <p className="text-gray-600 mt-2">The guest details could not be retrieved.</p>
            </div>
        )
    }

    const event = rsvp.events as any

    return (
        <div className="max-w-2xl mx-auto space-y-6 py-10">
            <h1 className="text-3xl font-bold text-gray-900">Guest Check-in</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8">
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="bg-indigo-100 p-3 rounded-full">
                            <User className="w-8 h-8 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{rsvp.name}</h2>
                            <p className="flex items-center text-gray-500">
                                <Mail className="w-4 h-4 mr-2" />
                                {rsvp.email}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Event Details</h3>
                            <div className="space-y-2">
                                <p className="font-medium text-gray-900">{event.title}</p>
                                <p className="flex items-center text-sm text-gray-500">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {new Date(event.date).toLocaleDateString()}
                                </p>
                                <p className="flex items-center text-sm text-gray-500">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    {event.location}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">RSVP Status</h3>
                            <div className="space-y-2">
                                <p className="flex items-center">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${rsvp.status === 'yes' ? 'bg-green-100 text-green-800' :
                                            rsvp.status === 'waitlist' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {rsvp.status.toUpperCase()}
                                    </span>
                                </p>
                                {rsvp.plus_one_count > 0 && (
                                    <p className="text-sm text-gray-600">
                                        + {rsvp.plus_one_count} Guests
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {rsvp.checked_in ? (
                        <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-green-600 mr-2" />
                            <span className="text-green-800 font-bold text-lg">Already Checked In</span>
                        </div>
                    ) : (
                        <form action={async () => {
                            'use server'
                            await checkInGuest(rsvpId)
                        }}>
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition shadow-lg hover:shadow-xl flex items-center justify-center text-lg"
                            >
                                <CheckCircle2 className="w-6 h-6 mr-2" />
                                Check In Guest
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
