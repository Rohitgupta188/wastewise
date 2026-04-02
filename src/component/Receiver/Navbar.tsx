import { Utensils } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { useRouter } from "next/navigation";
import { http } from "@/lib/http";
export function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await http.post("/signout", {}, { withCredentials: true });

      router.replace("/sign-in");
      router.refresh(); // clear auth state
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
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
      </nav>

      <div className="flex items-center gap-4">
        <Button onClick={handleLogout} variant='destructive'>Logout</Button>
      </div>
    </header>
  );
}
