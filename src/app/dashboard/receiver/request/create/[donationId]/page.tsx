"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/Components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Textarea } from "@/Components/ui/textarea"
import axios from "axios"

export default function RequestDonationPage() {
  const { donationId } = useParams<{ donationId: string }>()
  const router = useRouter()

  const [quantityRequested, setQuantityRequested] = useState(1)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

const handleSubmit = async (e: React.SyntheticEvent) => {
  e.preventDefault()
  setLoading(true)
  setError(null)

  try {
    const { data } = await axios.post("/api/request", {
      donationId,
      quantityRequested,
      message,
    })
    console.log(data.request._id);
    

    
    router.push(`/dashboard/receiver/request/view/${data.request._id}`)

  } catch (err: any) {
    setError(err.response?.data?.error || "Failed to submit request")
  } finally {
    setLoading(false)
  }
}


  return (
    <section className="flex justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Request Donation</CardTitle>
          <CardDescription>
            Specify quantity and add a short message
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <p className="mb-4 text-sm text-red-500">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity Required</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                value={quantityRequested}
                onChange={(e) =>
                  setQuantityRequested(Number(e.target.value))
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="message">Message (optional)</Label>
              <Textarea
                id="message"
                placeholder="Explain your need or pickup details"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </form>
        </CardContent>

        <CardFooter>
          <Button
            className="w-full"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? "Submitting..." : "Submit Request"}
          </Button>
        </CardFooter>
      </Card>
    </section>
  )
}
