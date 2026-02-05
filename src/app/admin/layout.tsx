import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Users, LogOut, Plus, Layout } from 'lucide-react'
import LogoutButton from '@/components/shared/LogoutButton'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }



    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-gray-200 hidden md:flex flex-col h-screen sticky top-0">
                <div className="p-8">
                    <Link href="/admin/dashboard" className="flex items-center space-x-3 group">
                        <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-200">
                            <Calendar className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tighter">PLANORAMA</h1>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-1.5 mt-4">
                    <div className="px-4 mb-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Main Menu</p>
                    </div>
                    <Link
                        href="/admin/dashboard"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl group transition-all duration-200 font-medium border border-transparent hover:border-indigo-100"
                    >
                        <Layout className="mr-3 h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/events/new"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl group transition-all duration-200 font-medium border border-transparent hover:border-indigo-100"
                    >
                        <Plus className="mr-3 h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                        Create Event
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                    <LogoutButton />
                </div>
            </aside>

            <main className="flex-1 p-10 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
