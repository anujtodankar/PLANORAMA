import Link from 'next/link'
import { ArrowRight, CalendarHeart, Zap, Shield, Layout } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-8 max-w-2xl">
          <div className="flex justify-center">
            <div className="bg-indigo-100 p-4 rounded-full">
              <CalendarHeart className="h-12 w-12 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">Planorama</h1>
          <p className="text-xl text-gray-600">
            Beautiful, seamless RSVPs for your special events.
            Manage guest lists, track responses in real-time, and create stunning event pages.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition flex items-center justify-center"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="#features"
              className="w-full sm:w-auto px-8 py-3 bg-white text-indigo-600 border border-indigo-200 rounded-lg font-medium hover:bg-indigo-50 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Planorama?</h2>
            <p className="mt-4 text-gray-600">Everything you need to manage your event guests with ease.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <Zap className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Updates</h3>
              <p className="text-gray-600">See your guest list grow in real-time. No refreshes needed, just instant notifications.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Layout className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Custom Events</h3>
              <p className="text-gray-600">Create beautiful event pages in seconds. Customizable details, location, and capacity limits.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Check-in Codes</h3>
              <p className="text-gray-600">Every guest receives a unique QR code for seamless on-site check-in and security.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">© 2024 Planorama Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
