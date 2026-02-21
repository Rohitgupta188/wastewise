// app/dashboard/donor/profile/page.tsx
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DonorProfile() {
  const user = await getCurrentUser();

  if (!user || user.role !== "donor") {
    redirect("/sign-in");
  }

  return (
    <section className="p-6">
      <h1 className="text-xl font-semibold">My Profile</h1>

      <div className="mt-4 space-y-2">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
    </section>
  );
}
