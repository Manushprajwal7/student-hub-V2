"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2 } from "lucide-react"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import type { IssueCategory } from "@/types/issues"
import { PageTransition } from "@/components/page-transition"

const categories: IssueCategory[] = [
  "Teaching",
  "Women Rights",
  "Ragging",
  "Cultural Events",
  "Campus",
  "Sports",
  "Fest",
  "Infrastructure",
  "Academics",
  "Student Services",
  "Extracurricular Activities",
]

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  category: z.enum(["Teaching", "Women Rights", "Ragging", "Cultural Events", "Campus", "Sports", "Fest", "Infrastructure", "Academics", "Student Services", "Extracurricular Activities"] as const),
  tags: z.string(),
})

type FormValues = z.infer<typeof formSchema>

export default function NewIssuePage() {
  const { toast } = useToast()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      category: "Teaching",
      tags: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true)
      const supabase = createClientComponentClient()
      
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please sign in to create issues.",
        })
        router.push("/login")
        return
      }

      // 1. Ensure profile exists (to satisfy FK constraint)
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("user_id", session.user.id)
        .single()

      if (!profile) {
        console.log("Creating missing profile for user...")
        await supabase.from("profiles").insert({
          user_id: session.user.id,
          full_name: session.user.user_metadata.full_name || "User",
          avatar_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${session.user.id}`,
        })
      }

      // 2. Insert issue
      const { error } = await supabase.from("issues").insert({
        title: data.title,
        description: data.description,
        location: data.location,
        category: data.category,
        tags: data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        user_id: session.user.id,
        upvotes: [],
        downvotes: [],
        reports: [],
      })

      if (error) {
        console.error("Supabase insert error:", error)
        throw error
      }

      // Invalidate issues query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["issues"] })

      toast({
        title: "Success",
        description: "Issue created successfully!",
      })
      router.push("/issues")
    } catch (error: any) {
      console.error("Error creating issue:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to create issue: ${error.message || "Unknown error"}`,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Create New Issue</h1>
          <p className="text-muted-foreground">Share your concerns with the community.</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Heading</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter issue title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter issue description" className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tags (comma-separated)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Issue
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </PageTransition>
  )
}

