"use server"

import { revalidatePath } from "next/cache"

// API base URL
const API_BASE_URL = "http://localhost:8000"

// Interface for collection data
interface Collection {
  name: string
  document_count: number
}

interface CollectionsResponse {
  collections: Collection[]
  total_collections: number
  total_documents: number
}

// Mock data for fallback when API is not available
const mockCollections: Collection[] = [
  { name: "catalog", document_count: 47 },
  { name: "test_collection", document_count: 1 },
  { name: "general_info", document_count: 0 },
]

export async function createCollection(name: string): Promise<void> {
  if (!name) throw new Error("Collection name is required")

  try {
    // In a real app, this would create a collection via API
    // This is a placeholder for the actual API call
    // You would implement the actual API endpoint for creating collections

    // For now, we'll just revalidate the path
    revalidatePath("/admin")
    return Promise.resolve()
  } catch (error) {
    console.error("Error creating collection:", error)
    throw new Error("Failed to create collection")
  }
}

export async function getCollections(): Promise<Collection[]> {
  try {
    // Since we're dealing with a localhost API, we need to handle this differently
    // in a server component vs client component

    // For client-side usage, we'll return mock data
    // In a production environment, you would set up a Next.js API route
    // to proxy the request to your backend API

    // This is a temporary solution for development
    return mockCollections
  } catch (error) {
    console.error("Error fetching collections:", error)
    // Return mock data as fallback
    return mockCollections
  }
}

export async function clearCollection(name: string): Promise<void> {
  if (!name) throw new Error("Collection name is required")

  try {
    // In a real app, this would clear a collection via API
    // This is a placeholder for the actual API call
    // You would implement the actual API endpoint for clearing collections

    // For now, we'll just revalidate the path
    revalidatePath("/admin/view")
    return Promise.resolve()
  } catch (error) {
    console.error("Error clearing collection:", error)
    throw new Error(`Failed to clear collection "${name}"`)
  }
}

export async function uploadData(collection: string, file: File, format: string): Promise<void> {
  if (!collection) throw new Error("Collection name is required")
  if (!file) throw new Error("File is required")

  try {
    // In a real app, this would upload data to a collection via API
    // This is a placeholder for the actual API call
    // You would implement the actual API endpoint for uploading data

    // For now, we'll just revalidate the path
    revalidatePath("/admin/view")
    return Promise.resolve()
  } catch (error) {
    console.error("Error uploading data:", error)
    throw new Error("Failed to upload data")
  }
}

export async function getCollectionData(collection: string): Promise<any[]> {
  if (!collection) return []

  try {
    // In a real app, this would fetch data from a collection via API
    // This is a placeholder for the actual API call
    // You would implement the actual API endpoint for fetching collection data

    // For now, we'll return an empty array
    return []
  } catch (error) {
    console.error("Error fetching collection data:", error)
    throw new Error(`Failed to fetch data from "${collection}" collection`)
  }
}
