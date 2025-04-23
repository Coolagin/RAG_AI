"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { askQuestion } from "@/lib/chat"
import { Loader2, Send, Database, MessageSquare, Sparkles } from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await askQuestion(userMessage.content)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Smart Data Assistant</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your intelligent companion for managing and querying data collections with natural language.
          </p>
        </div>

        <div className="grid gap-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 flex flex-col items-center text-center border-purple-light/30 bg-purple-50 dark:bg-purple-950/10">
              <div className="h-12 w-12 rounded-full bg-purple-light/20 flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-purple-light" />
              </div>
              <h3 className="text-lg font-medium mb-2">Manage Collections</h3>
              <p className="text-muted-foreground mb-4">Create, upload, and manage your data collections easily.</p>
              <Button
                asChild
                variant="outline"
                className="mt-auto border-purple-light/50 text-purple-dark hover:bg-purple-light/10"
              >
                <Link href="/admin">Admin Dashboard</Link>
              </Button>
            </Card>

            <Card className="p-6 flex flex-col items-center text-center border-teal-light/30 bg-teal-50 dark:bg-teal-950/10">
              <div className="h-12 w-12 rounded-full bg-teal-light/20 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-teal-light" />
              </div>
              <h3 className="text-lg font-medium mb-2">Natural Language</h3>
              <p className="text-muted-foreground mb-4">Ask questions about your data in plain language.</p>
              <Button
                variant="outline"
                className="mt-auto border-teal-light/50 text-teal-dark hover:bg-teal-light/10"
                disabled
              >
                Learn More
              </Button>
            </Card>

            <Card className="p-6 flex flex-col items-center text-center border-amber-light/30 bg-amber-50 dark:bg-amber-950/10">
              <div className="h-12 w-12 rounded-full bg-amber-light/20 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-amber-light" />
              </div>
              <h3 className="text-lg font-medium mb-2">AI-Powered</h3>
              <p className="text-muted-foreground mb-4">Get intelligent insights and answers from your data.</p>
              <Button
                variant="outline"
                className="mt-auto border-amber-light/50 text-amber-dark hover:bg-amber-light/10"
                disabled
              >
                Learn More
              </Button>
            </Card>
          </div>
        </div>

        <Card className="border-primary/20 shadow-lg bg-gradient-to-br from-white to-purple-50 dark:from-gray-950 dark:to-purple-950/10">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center text-primary">
              <MessageSquare className="mr-2 h-5 w-5" />
              Chat with Your Data
            </h2>

            <div className="flex flex-col h-[60vh] bg-white/80 dark:bg-gray-950/50 rounded-lg p-4 shadow-inner">
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-950/30 dark:to-blue-950/30 border shadow-sm"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <MessageSquare className="h-12 w-12 text-primary/50 mb-4" />
                    <p className="text-muted-foreground mb-2">
                      Start a conversation by asking a question about your data.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Try: "What collections do I have?" or "How can I upload data?"
                    </p>
                  </div>
                )}
                {loading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg p-3 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-950/30 dark:to-blue-950/30 border shadow-sm">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin text-teal-light" />
                        <p>Thinking...</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  placeholder="Ask a question about your data..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  className="bg-background border-primary/20 focus-visible:ring-primary/30"
                />
                <Button type="submit" disabled={loading || !input.trim()} className="bg-primary hover:bg-primary/90">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
