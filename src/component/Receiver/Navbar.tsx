import { Utensils, Bell, User } from "lucide-react";
export function Navbar() {
  return (
    <header className="bg-[#1A4D2E] text-white py-4 px-6 flex items-center justify-between shadow-md sticky top-0 z-50">
      <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="bg-white/10 p-1.5 rounded-lg">
              <Utensils size={20} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              WasteWise AI
            </span>
          </div>

          
        </div>
      <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-200">
        <span className="text-white border-b-2 border-white pb-1 cursor-pointer">
          Dashboard
        </span>
        <span className="hover:text-white cursor-pointer transition-colors">
          My Profile
        </span>
        <span className="hover:text-white cursor-pointer transition-colors">
          Reports
        </span>
      </nav>

      <div className="flex items-center gap-4">
        <div className="relative cursor-pointer">
          <Bell className="w-5 h-5 opacity-90" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            2
          </span>
        </div>
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition">
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
}
