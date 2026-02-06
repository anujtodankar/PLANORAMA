import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'
import { CheckCircle, ArrowLeft } from 'lucide-react'

export default async function ConfirmationPage({
    params,
    searchParams
}: {
    params: { id: string } | Promise<{ id: string }>,
    searchParams: { [key: string]: string | string[] | undefined } | Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { id } = params instanceof Promise ? await params : params
    // Await searchParams as well (Next.js 15 pattern)
    const resolvedSearchParams = searchParams instanceof Promise ? await searchParams : searchParams;

    const name = resolvedSearchParams?.name as string || 'Guest'
    const status = resolvedSearchParams?.status as string || 'yes'
    const rsvpId = resolvedSearchParams?.id as string

    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_EVENT_URL || `https://planorama-mu.vercel.app`).replace(/\/$/, '')
    const qrValue = `${baseUrl}/checkin?rsvpId=${rsvpId}`

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-6">

                {status === 'yes' ? (
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                ) : status === 'waitlist' ? (
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
                        <CheckCircle className="h-10 w-10 text-yellow-600" />
                    </div>
                ) : (
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
                        <CheckCircle className="h-10 w-10 text-gray-500" />
                    </div>
                )}

                <h1 className="text-2xl font-bold text-gray-900">
                    {status === 'yes' ? "You're all set!" : status === 'waitlist' ? "Added to Waitlist" : "Response Received"}
                </h1>

                <p className="text-gray-600">
                    {status === 'yes'
                        ? `Thanks ${name}, we can't wait to see you there!`
                        : status === 'waitlist'
                            ? `Thanks ${name}, we'll let you know if a spot opens up.`
                            : `Thanks for letting us know, ${name}.`
                    }
                </p>

                {status === 'yes' && (
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 inline-block">
                        <p className="text-xs text-gray-400 mb-4 uppercase tracking-wider font-semibold">Your Check-in Code</p>
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                            <QRCodeSVG value={qrValue} size={160} />
                        </div>
                        <p className="text-xs text-gray-400 mt-4">Show this code at the door</p>
                    </div>
                )}

                <div className="pt-4 border-t border-gray-100">
                    <Link href={`/event/${id}`} className="text-indigo-600 hover:text-indigo-500 text-sm font-medium flex items-center justify-center">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Event Page
                    </Link>
                </div>
            </div>
        </div>
    )
}
