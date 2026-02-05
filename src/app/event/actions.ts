'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function submitRsvp(eventId: string, formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const status = formData.get('status') as string
    const dietary = formData.get('dietary') as string
    const plusOne = formData.get('plus_one') as string

    // Check capacity first if status is yes
    if (status === 'yes') {
        const { data: event } = await supabase.from('events').select('max_capacity').eq('id', eventId).single()
        if (event?.max_capacity) {
            // We need to count current RSVPs. 
            // Note: This check is somewhat optimistic/racy without database constraints or locks.
            // For MVP, calling the RPC or just counting is good enough, or trusting the client state (which is bad).
            // Let's us the RPC `get_event_rsvp_count`
            const { data: currentCount } = await supabase.rpc('get_event_rsvp_count', { p_event_id: eventId })

            // Add current request count (1 + plus_one)
            const requestCount = 1 + (plusOne ? parseInt(plusOne) : 0)

            if ((currentCount + requestCount) > event.max_capacity) {
                // Capacity Reached. 
                // Better UX: Suggest Waitlist.
                // For now, return error.
                return { error: 'Event capacity reached. Please try joining the waitlist.' }
            }
        }
    }

    const { data: rsvpData, error } = await supabase.from('rsvps').insert({
        event_id: eventId,
        name,
        email,
        status,
        dietary_restrictions: dietary,
        plus_one_count: plusOne ? parseInt(plusOne) : 0,
    }).select('id').single()

    if (error) {
        if (error.code === '23505') { // Unique violation
            return { error: 'You have already RSVPed with this email for this event.' }
        }
        return { error: error.message }
    }

    redirect(`/event/${eventId}/confirmation?name=${encodeURIComponent(name)}&status=${status}&id=${rsvpData.id}`)
}
