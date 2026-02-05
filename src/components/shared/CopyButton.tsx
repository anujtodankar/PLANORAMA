'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy: ', err)
        }
    }

    return (
        <button
            type="button"
            onClick={handleCopy}
            className={`-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md transition-colors ${copied
                    ? 'bg-green-50 text-green-700 border-green-200 shadow-inner'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
        >
            {copied ? (
                <>
                    <Check className="h-4 w-4" />
                    <span>Copied!</span>
                </>
            ) : (
                <Copy className="h-4 w-4" />
            )}
        </button>
    )
}
