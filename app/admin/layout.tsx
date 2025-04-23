import type React from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Database, Upload, Table } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-primary">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your database collections and data</p>
      </div>

      <Tabs defaultValue="collections" className="mb-8">
        <TabsList className="w-full justify-start bg-muted/50 p-1">
          <Link href="/admin" className="w-full sm:w-auto">
            <TabsTrigger
              value="collections"
              className="w-full sm:w-auto data-[state=active]:bg-purple-light data-[state=active]:text-white"
            >
              <Database className="mr-2 h-4 w-4" />
              Collections
            </TabsTrigger>
          </Link>
          <Link href="/admin/upload" className="w-full sm:w-auto">
            <TabsTrigger
              value="upload"
              className="w-full sm:w-auto data-[state=active]:bg-emerald-light data-[state=active]:text-white"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Data
            </TabsTrigger>
          </Link>
          <Link href="/admin/view" className="w-full sm:w-auto">
            <TabsTrigger
              value="view"
              className="w-full sm:w-auto data-[state=active]:bg-amber-light data-[state=active]:text-white"
            >
              <Table className="mr-2 h-4 w-4" />
              View Data
            </TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>

      {children}
    </div>
  )
}
