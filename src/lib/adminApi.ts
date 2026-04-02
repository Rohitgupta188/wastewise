import { http } from "./http";
export async function fetchDashboardMetrics() {
  try {
    const res = await http.get("/admin/dashboard");
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "Failed to load metrics"
    );
  }
}

export async function fetchNgoRequests(page = 1) {
  try {
    const res = await http.get("/admin/ngo-requests", {
      params: {
        page,
        limit: 10,
      },
    });

    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "Failed to load requests"
    );
  }
}

export async function verifyNgo(
  userId: string,
  action: "approve" | "reject",
) {
  try {
    const res = await http.post(`/admin/ngo-verify/${userId}`, {
      action,
    });

    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "Verification failed"
    );
  }
}
