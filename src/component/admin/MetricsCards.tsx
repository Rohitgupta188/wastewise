export default function MetricsCards({ metrics }: any) {
  const items = [
    { label: "Total Users", value: metrics.totalUsers },
    { label: "Total NGOs", value: metrics.totalNgos },
    { label: "Pending NGOs", value: metrics.pendingNgos },
    { label: "Verified NGOs", value: metrics.verifiedNgos },
    { label: "Rejected NGOs", value: metrics.rejectedNgos },
  ];

  return (
    <div className="grid grid-cols-3 gap-6">
      {items.map((item) => (
        <div key={item.label} className="bg-white p-6 rounded shadow">
          <h3 className="text-gray-500">{item.label}</h3>
          <p className="text-2xl font-bold">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
