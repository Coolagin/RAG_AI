"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { createCollection, getCollections, clearCollection } from "@/lib/database"
import { Loader2, Trash2, Plus, RefreshCw, Database } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Collection {
  name: string
  document_count: number
}

export default function AdminPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [newCollection, setNewCollection] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingCollections, setLoadingCollections] = useState(false)
  const [clearingCollection, setClearingCollection] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Fetch collections when the component mounts
    fetchCollections()
  }, [])

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCollection.trim()) return

    setLoading(true)
    try {
      await createCollection(newCollection.trim())
      toast({
        title: "Collection created",
        description: `Collection "${newCollection}" has been created successfully.`,
      })
      setNewCollection("")
      fetchCollections()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create collection. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

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

  const handleClearCollection = async (collectionName: string) => {
    setClearingCollection(collectionName)
    try {
      await clearCollection(collectionName)
      toast({
        title: "Collection cleared",
        description: `Collection "${collectionName}" has been cleared successfully.`,
      })
      // Refresh the collections list after clearing
      fetchCollections()
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to clear collection "${collectionName}". Please try again.`,
        variant: "destructive",
      })
    } finally {
      setClearingCollection(null)
    }
  }

  return (
    <div className="grid gap-8">
      <Card className="shadow-md border-l-4 border-l-purple-light">
        <CardHeader className="bg-purple-50/50 dark:bg-purple-950/10">
          <CardTitle className="text-purple-dark dark:text-purple-light">Create New Collection</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleCreateCollection} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="collection-name">Collection Name</Label>
              <div className="flex gap-2">
                <Input
                  id="collection-name"
                  placeholder="Enter collection name"
                  value={newCollection}
                  onChange={(e) => setNewCollection(e.target.value)}
                  disabled={loading}
                  className="border-purple-light/20 focus-visible:ring-purple-light/30"
                />
                <Button
                  type="submit"
                  disabled={loading || !newCollection.trim()}
                  className="bg-purple-light hover:bg-purple-dark"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-md border-l-4 border-l-teal-light">
        <CardHeader className="bg-teal-50/50 dark:bg-teal-950/10">
          <div className="flex justify-between items-center">
            <CardTitle className="text-teal-dark dark:text-teal-light">Existing Collections</CardTitle>
            <Button
              variant="outline"
              onClick={fetchCollections}
              disabled={loadingCollections}
              size="sm"
              className="border-teal-light/50 text-teal-dark hover:bg-teal-light/10"
            >
              {loadingCollections ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {collections.length > 0 ? (
            <ul className="space-y-3">
              {collections.map((collection) => (
                <li
                  key={collection.name}
                  className="flex justify-between items-center p-3 border rounded-md bg-gradient-to-r from-teal-50/50 to-blue-50/50 dark:from-teal-950/10 dark:to-blue-950/10 hover:from-teal-50 hover:to-blue-50 dark:hover:from-teal-950/20 dark:hover:to-blue-950/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-teal-light" />
                    <div>
                      <span className="font-medium">{collection.name}</span>
                      <Badge variant="outline" className="ml-2 bg-teal-50 text-teal-dark border-teal-light/30">
                        {collection.document_count} {collection.document_count === 1 ? "document" : "documents"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-teal-light/50 text-teal-dark hover:bg-teal-light/10"
                    >
                      <a href={`/admin/view?collection=${collection.name}`}>View Data</a>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleClearCollection(collection.name)}
                      disabled={clearingCollection === collection.name}
                    >
                      {clearingCollection === collection.name ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 bg-gradient-to-r from-teal-50/50 to-blue-50/50 dark:from-teal-950/10 dark:to-blue-950/10 rounded-md">
              {loadingCollections ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-teal-light mb-4" />
                  <p className="text-muted-foreground">Loading collections...</p>
                </div>
              ) : (
                <>
                  <p className="text-muted-foreground mb-4">No collections found.</p>
                  <Button
                    variant="outline"
                    onClick={fetchCollections}
                    size="sm"
                    className="border-teal-light/50 text-teal-dark hover:bg-teal-light/10"
                  >
                    Refresh List
                  </Button>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
