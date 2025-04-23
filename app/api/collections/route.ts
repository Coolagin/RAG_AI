import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Attempt to fetch from the external API
    const response = await fetch("http://94.159.31.118/collections", {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching collections:", error)

    // Return mock data as fallback
    return NextResponse.json({
      collections: [
        { name: "mock_data", document_count: 0 },
        { name: "mock_data", document_count: 0 },
        { name: "mock_data", document_count: 0 },
      ],
      total_collections: 0,
      total_documents: 0,
    })
  }
}
