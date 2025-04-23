"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { getCollections, uploadData } from "@/lib/database"
import { Loader2, Upload, RefreshCw, FileType } from "lucide-react"

interface Collection {
  name: string
  document_count: number
}

export default function UploadPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [selectedCollection, setSelectedCollection] = useState("")
  const [fileFormat, setFileFormat] = useState("json")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingCollections, setLoadingCollections] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Fetch collections when the component mounts
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    setLoadingCollections(true)
    try {
      // Use the Next.js API route instead of direct fetch
      const response = await fetch("/api/collections")
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }
      const data = await response.json()
      setCollections(data.collections || [])
    } catch (error) {
      console.error("Error fetching collections:", error)
      toast({
        title: "Error",
        description: "Failed to fetch collections. Using mock data instead.",
        variant: "destructive",
      })
      // Use the server function as fallback
      const fallbackData = await getCollections()
      setCollections(fallbackData)
    } finally {
      setLoadingCollections(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCollection || !file) return

    setLoading(true)
    try {
      await uploadData(selectedCollection, file, fileFormat)
      toast({
        title: "Upload successful",
        description: `Data has been uploaded to "${selectedCollection}" collection.`,
      })
      setFile(null)
      // Reset the file input
      const fileInput = document.getElementById("file-upload") as HTMLInputElement
      if (fileInput) fileInput.value = ""
      // Refresh collections to update document count
      fetchCollections()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="shadow-md border-l-4 border-l-emerald-light">
      <CardHeader className="bg-emerald-50/50 dark:bg-emerald-950/10">
        <CardTitle className="text-emerald-dark dark:text-emerald-light">Upload Data to Collection</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="collection-select">Select Collection</Label>
            <div className="flex gap-2">
              <Select value={selectedCollection} onValueChange={setSelectedCollection}>
                <SelectTrigger
                  id="collection-select"
                  className="w-full border-emerald-light/20 focus:ring-emerald-light/30"
                >
                  <SelectValue placeholder="Select a collection" />
                </SelectTrigger>
                <SelectContent>
                  {collections.map((collection) => (
                    <SelectItem key={collection.name} value={collection.name}>
                      {collection.name} ({collection.document_count}{" "}
                      {collection.document_count === 1 ? "document" : "documents"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                onClick={fetchCollections}
                disabled={loadingCollections}
                className="border-emerald-light/50 text-emerald-dark hover:bg-emerald-light/10"
              >
                {loadingCollections ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-format">File Format</Label>
            <Select value={fileFormat} onValueChange={setFileFormat}>
              <SelectTrigger id="file-format" className="border-emerald-light/20 focus:ring-emerald-light/30">
                <SelectValue placeholder="Select file format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="xml">XML</SelectItem>
                <SelectItem value="txt">TXT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-upload">Upload File</Label>
            <div className="border-2 border-dashed border-emerald-light/30 rounded-md p-6 text-center bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/10 dark:to-teal-950/10">
              <FileType className="h-8 w-8 mx-auto mb-4 text-emerald-light" />
              <Input id="file-upload" type="file" onChange={handleFileChange} disabled={loading} className="hidden" />
              <Label
                htmlFor="file-upload"
                className="cursor-pointer text-emerald-dark dark:text-emerald-light hover:underline"
              >
                {file ? file.name : "Select a file"}
              </Label>
              {file && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {file.size > 1024 * 1024
                    ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                    : `${(file.size / 1024).toFixed(2)} KB`}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-light hover:bg-emerald-dark"
            disabled={loading || !selectedCollection || !file}
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" />
                Upload Data
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
