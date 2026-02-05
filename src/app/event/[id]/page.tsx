import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Calendar, MapPin, Clock } from 'lucide-react'
import RsvpForm from '@/components/forms/RsvpForm'

export default async function PublicEventPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;

    const supabase = await createClient()

    const { data: event, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !event) {
        notFound()
    }

    // Check capacity
    const { data: currentCount } = await supabase.rpc('get_event_rsvp_count', { p_event_id: id })
    const isFull = event.max_capacity && currentCount >= event.max_capacity

    return (
        <div className="min-h-screen bg-amber-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header Image or Design */}
                <div className="h-48 bg-indigo-600 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-90"></div>
                    <div className="absolute bottom-0 left-0 w-full p-8 text-white">
                        <h1 className="text-4xl font-extrabold tracking-tight">{event.title}</h1>
                    </div>
                </div>

                <div className="p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-1/3 space-y-6">
                            <div className="flex items-start">
                                <Calendar className="h-6 w-6 text-indigo-600 mt-1" />
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">Date</h3>
                                    <p className="text-gray-500">{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <Clock className="h-6 w-6 text-indigo-600 mt-1" />
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">Time</h3>
                                    <p className="text-gray-500">{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <MapPin className="h-6 w-6 text-indigo-600 mt-1" />
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">Location</h3>
                                    <address className="text-gray-500 not-italic">{event.location}</address>
                                </div>
                            </div>

                            {event.description && <div className="pt-6 border-t border-gray-100">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">About</h3>
                                <p className="text-gray-600 whitespace-pre-wrap">{event.description}</p>
                            </div>}
                        </div>

                        <div className="md:w-2/3 bg-gray-50 rounded-xl p-6 border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">RSVP</h2>
                            <RsvpForm
                                eventId={id}
                                allowPlusOne={event.allow_plus_one}
                                isFull={isFull}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
