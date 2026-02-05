'use client'

import { useState } from 'react'
import { LogOut, AlertTriangle, X } from 'lucide-react'
import { signOut } from '@/app/admin/actions'

export default function LogoutButton() {
    const [isOpen, setIsOpen] = useState(false)

    const handleLogout = async () => {
        await signOut()
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg group transition-colors"
                type="button"
            >
                <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-600" />
                Sign Out
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-red-100 p-2 rounded-full">
                                    <AlertTriangle className="h-6 w-6 text-red-600" />
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-gray-500 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Logout</h3>
                            <p className="text-gray-600">
                                Are you sure you want to sign out of your account? You will need to log in again to access the admin dashboard.
                            </p>
                        </div>

                        <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3">
                            <button
                                onClick={handleLogout}
                                className="w-full sm:w-auto px-6 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition shadow-lg hover:shadow-red-200"
                            >
                                Sign Out
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-full sm:w-auto px-6 py-2.5 bg-white text-gray-700 border border-gray-200 font-semibold rounded-xl hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
