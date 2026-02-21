import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

export function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <Card className="border-blue-100 bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 text-center">
        <CardTitle className="text-4xl font-bold text-blue-600">
          {value}
        </CardTitle>
        <p className="font-medium text-slate-600 uppercase text-sm tracking-wider">{title}</p>
      </CardHeader>

      <CardContent className="text-center">
        <p className="text-xs text-slate-400 bg-slate-50 inline-block px-2 py-1 rounded-full">Live Data</p>
      </CardContent>
    </Card>
  );
}