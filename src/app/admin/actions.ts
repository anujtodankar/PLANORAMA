'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createEvent(formData: FormData) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const title = formData.get('title') as string
    const date = formData.get('date') as string
    const time = formData.get('time') as string
    const location = formData.get('location') as string
    const description = formData.get('description') as string
    const maxCapacityStr = formData.get('max_capacity') as string
    const allowPlusOne = formData.get('allow_plus_one') === 'on'

    // Combine date and time
    const dateTime = new Date(`${date}T${time}`)

    // Validation: Ensure date is in the future
    if (dateTime < new Date()) {
        return { error: 'Event date and time must be in the future.' }
    }

    const eventData = {
        user_id: user.id,
        title,
        date: dateTime.toISOString(),
        location,
        description,
        max_capacity: maxCapacityStr ? parseInt(maxCapacityStr) : null,
        allow_plus_one: allowPlusOne,
    }

    const { error } = await supabase.from('events').insert(eventData)

    if (error) {
        console.error(error)
        return { error: error.message }
    }

    revalidatePath('/admin/dashboard')
    redirect('/admin/dashboard')
}

export async function checkInGuest(rsvpId: string) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('rsvps')
        .update({ checked_in: true })
        .eq('id', rsvpId)

    if (error) {
        console.error(error)
        return { error: error.message }
    }

    revalidatePath(`/admin/checkin`)
    return { success: true }
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}
