import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { CalendarDays, MapPin, Users, ArrowRight } from 'lucide-react'
import LogoutButton from '@/components/shared/LogoutButton'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: events, error } = await supabase
        .from('events')
        .select(`
            *,
            rsvps:rsvps(count)
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Error fetching events", error)
    }

    const totalEvents = events?.length || 0
    // Group RSVPs by event and sum them
    const { data: allRsvps } = await supabase
        .from('rsvps')
        .select('id, status')
        .in('event_id', events?.map(e => e.id) || [])

    const confirmedGuests = allRsvps?.filter(r => r.status === 'yes').length || 0

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
                    <p className="text-gray-500 mt-1 pb-2">Manage your events and track guest responses.</p>
                </div>
                <Link
                    href="/admin/events/new"
                    className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-200"
                >
                    Create New Event
                </Link>
            </div>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                        <CalendarDays className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Events</p>
                        <p className="text-2xl font-bold text-gray-900">{totalEvents}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-xl text-green-600">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Confirmed Guests</p>
                        <p className="text-2xl font-bold text-gray-900">{confirmedGuests}</p>
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Your Recent Events</h2>

                {events && events.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                        <CalendarDays className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating your first event.</p>
                        <div className="mt-6">
                            <Link
                                href="/admin/events/new"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Create Event
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events?.map((event: any) => (
                            <Link key={event.id} href={`/admin/events/${event.id}`}>
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-100 transition-all cursor-pointer h-full flex flex-col group overflow-hidden">
                                    <div className="h-2 bg-indigo-600 w-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="p-6 flex-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight">{event.title}</h3>
                                        </div>
                                        <div className="space-y-3 text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <CalendarDays className="w-4 h-4 mr-2 text-indigo-400" />
                                                {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div className="flex items-center">
                                                <MapPin className="w-4 h-4 mr-2 text-indigo-400" />
                                                <span className="truncate">{event.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-50 flex justify-between items-center group-hover:bg-indigo-50 transition-colors">
                                        <span className="text-sm font-semibold text-gray-600 group-hover:text-indigo-700">Manage Guests</span>
                                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
