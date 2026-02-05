'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import { Download, Search, Filter } from 'lucide-react'

type Rsvp = {
    id: string
    name: string
    email: string
    status: 'yes' | 'no' | 'waitlist'
    dietary_restrictions: string | null
    plus_one_count: number
    checked_in: boolean
    created_at: string
}

export default function RsvpTable({
    initialRsvps,
    eventId
}: {
    initialRsvps: Rsvp[],
    eventId: string
}) {
    const [rsvps, setRsvps] = useState<Rsvp[]>(initialRsvps)
    const [filter, setFilter] = useState<'all' | 'yes' | 'no' | 'waitlist'>('all')
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState<'newest' | 'oldest'>('newest')

    const supabase = createClient()

    useEffect(() => {
        const channel = supabase
            .channel('realtime-rsvps')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'rsvps',
                    filter: `event_id=eq.${eventId}`,
                },
                (payload) => {
                    console.log('Change received!', payload)
                    if (payload.eventType === 'INSERT') {
                        setRsvps((prev) => [payload.new as Rsvp, ...prev])
                    } else if (payload.eventType === 'UPDATE') {
                        setRsvps((prev) => prev.map(r => r.id === payload.new.id ? payload.new as Rsvp : r))
                    } else if (payload.eventType === 'DELETE') {
                        setRsvps((prev) => prev.filter(r => r.id !== payload.old.id))
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [eventId, supabase])

    const filteredRsvps = rsvps
        .filter((rsvp) => {
            if (filter !== 'all' && rsvp.status !== filter) return false
            if (search && !rsvp.name.toLowerCase().includes(search.toLowerCase()) && !rsvp.email.toLowerCase().includes(search.toLowerCase())) return false
            return true
        })
        .sort((a, b) => {
            if (sort === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        })

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredRsvps.map(r => ({
            Name: r.name,
            Email: r.email,
            Status: r.status,
            Dietary: r.dietary_restrictions || 'None',
            PlusOnes: r.plus_one_count,
            CheckedIn: r.checked_in ? 'Yes' : 'No',
            RSVPedAt: new Date(r.created_at).toLocaleString()
        })))
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "RSVPs")
        XLSX.writeFile(wb, "rsvps.xlsx")
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:justify-between sm:items-center bg-gray-50">
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <div className="relative rounded-md shadow-sm w-full sm:w-64">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            type="text"
                            className="block w-full rounded-md border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            placeholder="Search guests..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as any)}
                        className="block rounded-md border-0 py-2 pl-3 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                        <option value="all">All Status</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                        <option value="waitlist">Waitlist</option>
                    </select>
                </div>

                <button
                    onClick={exportToExcel}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Guest
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                +1
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Dietary
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Check-in
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Time
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredRsvps.map((rsvp) => (
                            <tr key={rsvp.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="text-sm font-medium text-gray-900">{rsvp.name}</div>
                                    </div>
                                    <div className="text-sm text-gray-500">{rsvp.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${rsvp.status === 'yes' ? 'bg-green-100 text-green-800' :
                                            rsvp.status === 'no' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'}`}>
                                        {rsvp.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {rsvp.plus_one_count}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {rsvp.dietary_restrictions || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {rsvp.checked_in ? (
                                        <span className="text-green-600 font-medium">Checked In</span>
                                    ) : (
                                        <span className="text-gray-400">Pending</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(rsvp.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                        {filteredRsvps.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                    No RSVPs found matching your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6">
                <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{filteredRsvps.length}</span> results
                </p>
            </div>
        </div>
    )
}
