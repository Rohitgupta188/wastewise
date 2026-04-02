"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/Components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card"

type Donation = {
  _id: string
  title: string
  status: string
  quantity: number
  unit: string
}

export default function DonorListings() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await axios.get("/api/donation")
        setDonations(res.data.donations)
        console.log(res.data.donations);
        
      } catch (err: any) {
        setError("Failed to load donations")
      } finally {
        setLoading(false)
      }
    }

    fetchDonations()
  }, [])

  if (loading) return <p className="p-6">Loading...</p>

  if (error) return <p className="p-6 text-red-500">{error}</p>

  return (
    <section className="p-6 space-y-6">
      <Button></Button>
      <h1 className="text-2xl font-semibold">My Donations</h1>

      {donations.length === 0 ? (
        <p className="text-muted-foreground">No donations listed yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {donations.map((d) => (
            <Card key={d._id}>
              <CardHeader>
                <CardTitle>{d.title}</CardTitle>
                <CardDescription>Status: {d.status}</CardDescription>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Quantity:{" "}
                  <span className="font-medium">
                    {d.quantity} {d.unit}
                  </span>
                </p>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  View
                </Button>
                <Button size="sm">Edit</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
