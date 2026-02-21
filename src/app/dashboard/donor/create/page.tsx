"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select"
import axios from "axios"
import { http } from "@/lib/http"

export default function CreateDonationPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    title: "",
    foodType: "",
    quantity: 1,
    unit: "kg",
    readyTime: "",
    safeUntil: "",
    pickupWindow: "",
    area: "",
    description: "",
  })

  const [images, setImages] = useState<File[]>([])
  const [preview, setPreview] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (name: string, value: any) => {
    setForm({ ...form, [name]: value })
  }

  // ✅ Handle Image चयन
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages(files)

    // preview
    const urls = files.map(file => URL.createObjectURL(file))
    setPreview(urls)
  }

  // ✅ Submit using FormData (IMPORTANT)
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()

      // append text fields
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value as string)
      })

      formData.set("readyTime", new Date(form.readyTime).toISOString())
      formData.set("safeUntil", new Date(form.safeUntil).toISOString())

      // append images
      images.forEach(file => {
        formData.append("photos", file)
      })

      await http.post("/donation", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      router.push("/dashboard/donor/listings")
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create donation")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex justify-center p-6">
      <Card className="w-full max-w-xl ">
        <CardHeader>
          <CardTitle>Create Donation</CardTitle>
          <CardDescription>Share surplus food for collection</CardDescription>
        </CardHeader>

        <CardContent>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid gap-2">
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Food Type</Label>
              <Input
                value={form.foodType}
                onChange={(e) => handleChange("foodType", e.target.value)}
                required
              />
            </div>

            {/* Quantity */}
            <div className="flex gap-4">
              <Input
                type="number"
                min={1}
                value={form.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
              />

              <Select
                value={form.unit}
                onValueChange={(v) => handleChange("unit", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kg</SelectItem>
                  <SelectItem value="plates">Plates</SelectItem>
                  <SelectItem value="packs">Packs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Input
              type="datetime-local"
              onChange={(e) => handleChange("readyTime", e.target.value)}
              required
            />

            <Input
              type="datetime-local"
              onChange={(e) => handleChange("safeUntil", e.target.value)}
              required
            />

            <Input
              placeholder="Pickup Window"
              onChange={(e) => handleChange("pickupWindow", e.target.value)}
            />

            <Input
              placeholder="Area"
              onChange={(e) => handleChange("area", e.target.value)}
              required
            />

            <Textarea
              placeholder="Description"
              onChange={(e) => handleChange("description", e.target.value)}
            />

            {/* ✅ Image Upload */}
            <div className="grid gap-2">
              <Label>Upload Photos</Label>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            {/* ✅ Preview */}
            {preview.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {preview.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    className="h-24 w-full object-cover rounded-md"
                  />
                ))}
              </div>
            )}

          </form>
        </CardContent>

        <CardFooter>
          <Button className="w-full" disabled={loading} onClick={handleSubmit}>
            {loading ? "Creating..." : "Create Donation"}
          </Button>
        </CardFooter>
      </Card>
    </section>
  )
}
