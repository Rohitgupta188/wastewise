// app/page.tsx
import Link from 'next/link';
import {  Truck, BrainCircuit, HeartHandshake } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-green-600 rounded-lg"></div>
           <span className="text-xl font-bold text-gray-800">WasteWise AI</span>
        </div>
        <div className="hidden md:flex gap-8 text-gray-600 font-medium">
          <Link href="#">How it Works</Link>
          <Link href="dashboard/donor">For Donors</Link>
          <Link href="dashboard/receiver/request">For NGOs</Link>
        </div>
        <div className="flex gap-4">
          <Link href="/sign-in" className="px-4 py-2 text-gray-600 hover:text-green-600">Login</Link>
          <Link href="/sign-up" className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700">Register</Link>
        </div>
      </nav>

      <main className="grow">
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Fighting Food Waste, <br/>
              <span className="text-green-600">Feeding Communities</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Join India's first AI-Powered Food Redistribution Network. We connect surplus food to those in need instantly.
            </p>
            <div className="flex gap-4">
              <Link href="dashboard/donor" className="px-8 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition">
                Share Surplus Food
              </Link>
              <Link href="dashboard/receiver/request" className="px-8 py-3 border-2 border-green-600 text-green-600 rounded-full font-semibold hover:bg-green-50 transition">
                Find Food for Community
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gray-100 rounded-2xl overflow-hidden aspect-video shadow-xl flex items-center justify-center">
               <span className="text-gray-400">[Hero Illustration: Logistics Map]</span>
            </div>
          </div>
        </section>


        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <HeartHandshake className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">1. Share Surplus</h3>
                <p className="text-gray-500">Donors list available food. Our AI validates and categorizes it instantly.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BrainCircuit className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">2. AI Match & Optimize</h3>
                <p className="text-gray-500">Algorithms match food to the nearest NGO based on need and distance.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Truck className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">3. Deliver & Impact</h3>
                <p className="text-gray-500">Optimized routes ensure fresh delivery. Track impact in real-time.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center opacity-60 grayscale">
             <span className="font-bold text-xl">Mumbai Food Bank</span>
             <span className="font-bold text-xl">Feeding India</span>
             <span className="font-bold text-xl">Robin Hood Army</span>
          </div>
        </section>
      </main>
    </div>
  );
}