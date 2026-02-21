import { Utensils, Bell } from "lucide-react";
import Link from "next/link";
export function Navbar() {
  return (
   
    <nav className="bg-[#2D5A27] text-white px-4 sm:px-8 py-4 flex flex-wrap justify-between items-center shadow-md">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-full">
            <Utensils size={20} />
        </div>
        <h1 className="font-bold text-lg tracking-wide">WasteWise AI</h1>
      </div>
      
      <div className="flex items-center gap-6 mt-2 sm:mt-0">
          <Link href="/dashboard/donor/create" className="text-sm font-medium hover:text-green-200 transition-colors">Create Donation</Link>
          <Link href="/dashboard/donor/requests" className="text-sm font-medium hover:text-green-200 transition-colors">Requests</Link>
          
        
          <Link href="/dashboard/donor/requests" className="relative group">
            <Bell className="w-6 h-6 group-hover:text-yellow-300 transition-colors" />

          </Link>
      </div>
    </nav>
  );
}