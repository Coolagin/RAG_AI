"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { getCollections, getCollectionData } from "@/lib/database"
import { Loader2, RefreshCw, Database } from "lucide-react"

interface Collection {
  name: string
  document_count: number
}

export default function ViewDataPage() {
  const searchParams = useSearchParams()
  const collectionParam = searchParams.get("collection")

  const [collections, setCollections] = useState<Collection[]>([])
  const [selectedCollection, setSelectedCollection] = useState(collectionParam || "")
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingCollections, setLoadingCollections] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchCollections()
    if (collectionParam) {
      setSelectedCollection(collectionParam)
      fetchCollectionData(collectionParam)
    }
  }, [collectionParam])

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

  const fetchCollectionData = async (collection: string) => {
    if (!collection) return

    setLoading(true)
    try {
      const result = await getCollectionData(collection)
      setData(result)
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to fetch data from "${collection}" collection. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCollectionChange = (value: string) => {
    setSelectedCollection(value)
    fetchCollectionData(value)
  }

  const renderDataTable = () => {
    if (data.length === 0) {
      return (
        <div className="text-center py-12 bg-muted/30 rounded-md">
          <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No data found in this collection.</p>
        </div>
      )
    }

    // Get all unique keys from all objects
    const allKeys = Array.from(new Set(data.flatMap((item) => Object.keys(item))))

    return (
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              {allKeys.map((key) => (
                <th key={key} className="p-3 text-left border-b font-medium text-muted-foreground">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                {allKeys.map((key) => (
                  <td key={`${index}-${key}`} className="p-3">
                    {renderCellValue(item[key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const renderCellValue = (value: any) => {
    if (value === undefined || value === null) {
      return "-"
    } else if (typeof value === "object") {
      return JSON.stringify(value)
    } else {
      return String(value)
    }
  }

  return (
    <Card className="shadow-md border-l-4 border-l-amber-light">
      <CardHeader className="bg-amber-50/50 dark:bg-amber-950/10">
        <CardTitle className="text-amber-dark dark:text-amber-light">View Collection Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-6">
          <Select value={selectedCollection} onValueChange={handleCollectionChange}>
            <SelectTrigger className="w-full border-amber-light/20 focus:ring-amber-light/30">
              <SelectValue placeholder="Select a collection to view" />
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
            variant="outline"
            onClick={() => fetchCollectionData(selectedCollection)}
            disabled={loading || !selectedCollection}
            className="border-amber-light/50 text-amber-dark hover:bg-amber-light/10"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-amber-light" />
          </div>
        ) : selectedCollection ? (
          renderDataTable()
        ) : (
          <div className="text-center py-12 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-950/10 dark:to-orange-950/10 rounded-md">
            <Database className="h-12 w-12 mx-auto mb-4 text-amber-light" />
            <p className="text-muted-foreground">Select a collection to view its data.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
