import { Badge } from "@/Components/ui/badge";
import { Utensils } from "lucide-react";
import { Donation } from "@/types/donation";
export function ListingItem({ donation }: { donation: Donation }) {
  const badgeColor =
    donation.status === "delivered"
      ? "bg-green-100 text-green-700 hover:bg-green-100"
      : donation.status === "requested"
      ? "bg-orange-100 text-orange-700 hover:bg-orange-100"
      : "bg-blue-100 text-blue-700 hover:bg-blue-100";

  return (
    
    <div className="flex gap-4 p-4 border border-slate-200 rounded-xl bg-white hover:shadow-lg transition-all h-full items-start">
      
     
      <div className="w-24 h-24 shrink-0 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center border border-slate-100">
        {donation.photos ? (
            <img 
                src={donation.photos} 
                alt={donation.title}
                className="w-full h-full object-cover" 
            />
        ) : (
            <Utensils size={28} className="text-slate-300" />
        )}
      </div>

      <div className="flex-1 min-w-0"> 
        <div className="flex justify-between items-start">
            <h4 className="font-bold text-slate-800 truncate pr-2">{donation.title}</h4>
            <Badge className={`${badgeColor} border-0`}>
             {donation.status}
            </Badge>
        </div>

        <p className="text-xs text-slate-500 font-medium mb-2 uppercase tracking-wide">{donation.category || "General"}</p>

        {donation.ngo && (
            <p className="text-xs mt-3 bg-slate-50 p-2 rounded text-slate-600">
            NGO: <span className="text-slate-900 font-semibold">{donation.ngo}</span>
            </p>
        )}
      </div>
    </div>
  );
}