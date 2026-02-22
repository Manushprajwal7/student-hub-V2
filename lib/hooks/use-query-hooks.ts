/**
 * Central React Query hooks for all feature modules.
 * Uses a 2-step pattern: fetch data first, then fetch profiles in a single .in() call.
 * This avoids Supabase FK join syntax which requires explicit named constraints.
 * React Query caches the result so subsequent page visits have zero network calls.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { supabase } from "@/lib/supabase"
import type { IssueCategory, IssueWithUser } from "@/types/issues"
import type { EventType, EventWithUser } from "@/types/events"
import type { AnnouncementPriority, AnnouncementWithUser } from "@/types/announcements"
import type { JobType, JobWithUser } from "@/types/jobs"
import type { Subject, StudyGroupWithUser } from "@/types/study-groups"
import type { ScholarshipCategory, ScholarshipWithUser } from "@/types/scholarships"
import type { Department, ResourceType, ResourceWithUser, Semester } from "@/types/resources"

// ─── Shared helper ────────────────────────────────────────────────────────────

/** Fetch profiles for a list of user IDs in a single query and return a map */
async function fetchProfileMap(userIds: string[]): Promise<Record<string, { user_id: string; full_name: string | null; avatar_url: string | null }>> {
  const unique = [...new Set(userIds.filter(Boolean))]
  if (unique.length === 0) return {}

  const supabase = createClientComponentClient() // Added supabase initialization
  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, full_name, avatar_url")
    .in("user_id", unique)

  if (error) { // Added error handling
    console.error("Error fetching profiles for map:", error)
  }

  const map: Record<string, { user_id: string; full_name: string | null; avatar_url: string | null }> = {}
  for (const profile of data ?? []) {
    map[profile.user_id] = profile
  }
  return map
}

// ─── Issues ──────────────────────────────────────────────────────────────────

export function useIssues(category: IssueCategory | "All") {
  return useQuery<IssueWithUser[]>({
    queryKey: ["issues", category],
    queryFn: async () => {
      console.log(`Fetching issues: ${category}`)
      const supabase = createClientComponentClient()
      let query = supabase
        .from("issues")
        .select("*")
        .order("created_at", { ascending: false })

      if (category !== "All") query = query.eq("category", category)

      const { data, error } = await query
      if (error) {
        console.error("Supabase error fetching issues:", error)
        throw error
      }

      const items = ((data as any[]) ?? []).map((item: any) => ({
        ...item,
        reports: item.reports ?? [],
        upvotes: item.upvotes ?? [],
        downvotes: item.downvotes ?? [],
      }))

      const profileMap = await fetchProfileMap(items.map((i) => i.user_id))

      return items.map((item) => ({
        ...item,
        user: profileMap[item.user_id] ?? null,
      })) as IssueWithUser[]
    },
    staleTime: 3 * 60 * 1000,
  })
}

// ─── Events ──────────────────────────────────────────────────────────────────

export function useEvents(type: EventType | "All") {
  return useQuery<EventWithUser[]>({
    queryKey: ["events", type],
    queryFn: async () => {
      console.log(`Fetching events: ${type}`)
      const supabase = createClientComponentClient()
      let query = supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true })

      if (type !== "All") query = query.eq("type", type)

      const { data, error } = await query
      if (error) {
        console.error("Supabase error fetching events:", error)
        throw error
      }

      const items = ((data as any[]) ?? []).map((item: any) => ({
        ...item,
        registrations: item.registrations ?? [],
      }))

      const profileMap = await fetchProfileMap(items.map((i) => i.user_id))

      return items.map((item) => ({
        ...item,
        user: profileMap[item.user_id] ?? null,
      })) as EventWithUser[]
    },
    staleTime: 3 * 60 * 1000,
  })
}

// ─── Announcements ───────────────────────────────────────────────────────────

export function useAnnouncements(priority: AnnouncementPriority | "All") {
  return useQuery<AnnouncementWithUser[]>({
    queryKey: ["announcements", priority],
    queryFn: async () => {
      console.log(`Fetching announcements: ${priority}`)
      const supabase = createClientComponentClient()
      let query = supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })

      if (priority !== "All") query = query.eq("priority", priority)

      const { data, error } = await query
      if (error) {
        console.error("Supabase error fetching announcements:", error)
        throw error
      }

      const profileMap = await fetchProfileMap((data ?? []).map((i) => i.user_id))

      return (data ?? []).map((item) => ({
        ...item,
        user: profileMap[item.user_id] ?? null,
      })) as AnnouncementWithUser[]
    },
    staleTime: 5 * 60 * 1000,
  })
}

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export function useJobs(type: JobType | "All", search: string) {
  return useQuery<JobWithUser[]>({
    queryKey: ["jobs", type, search],
    queryFn: async () => {
      console.log(`Fetching jobs: ${type}, search: ${search}`)
      const supabase = createClientComponentClient()
      let query = supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false })

      if (type !== "All") query = query.eq("type", type)
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,company.ilike.%${search}%`)
      }

      const { data, error } = await query
      if (error) {
        console.error("Supabase error fetching jobs:", error)
        throw error
      }

      const profileMap = await fetchProfileMap((data ?? []).map((i) => i.user_id))

      return (data ?? []).map((item) => ({
        ...item,
        user: profileMap[item.user_id] ?? null,
      })) as JobWithUser[]
    },
    staleTime: 3 * 60 * 1000,
  })
}

// ─── Study Groups ─────────────────────────────────────────────────────────────

export function useStudyGroups(subject: Subject | "All") {
  return useQuery<StudyGroupWithUser[]>({
    queryKey: ["study-groups", subject],
    queryFn: async () => {
      console.log(`Fetching study groups: ${subject}`)
      const supabase = createClientComponentClient()
      let query = supabase
        .from("study_groups")
        .select("*")
        .order("created_at", { ascending: false })

      if (subject !== "All") query = query.eq("subject", subject)

      const { data, error } = await query
      if (error) {
        console.error("Supabase error fetching study groups:", error)
        throw error
      }

      const items = ((data as any[]) ?? []).map((item: any) => ({
        ...item,
        members: item.members ?? [],
      }))

      const profileMap = await fetchProfileMap(items.map((i) => i.user_id))

      return items.map((item) => ({
        ...item,
        user: profileMap[item.user_id] ?? undefined,
      })) as StudyGroupWithUser[]
    },
    staleTime: 3 * 60 * 1000,
  })
}

// ─── Scholarships ─────────────────────────────────────────────────────────────

export function useScholarships(category: ScholarshipCategory | "All") {
  return useQuery<ScholarshipWithUser[]>({
    queryKey: ["scholarships", category],
    queryFn: async () => {
      console.log(`Fetching scholarships: ${category}`)
      const supabase = createClientComponentClient()
      let query = supabase
        .from("scholarships")
        .select("*")
        .order("created_at", { ascending: false })

      if (category !== "All") query = query.eq("category", category)

      const { data, error } = await query
      if (error) {
        console.error("Supabase error fetching scholarships:", error)
        throw error
      }

      const items = ((data as any[]) ?? []).map((item: any) => ({
        ...item,
        tags: item.tags ?? [],
        reports: item.reports ?? [],
      }))

      const profileMap = await fetchProfileMap(items.map((i) => i.user_id))

      return items.map((item) => ({
        ...item,
        user: profileMap[item.user_id] ?? null,
      })) as ScholarshipWithUser[]
    },
    staleTime: 5 * 60 * 1000,
  })
}

// ─── Resources ────────────────────────────────────────────────────────────────

export function useResources(
  type: ResourceType | "all",
  department: Department | "all",
  semester: Semester | "all",
  search: string
) {
  return useQuery<ResourceWithUser[]>({
    queryKey: ["resources", type, department, semester, search],
    queryFn: async () => {
      console.log(`Fetching resources: ${type}, dep: ${department}, sem: ${semester}`)
      const supabase = createClientComponentClient()
      let query = supabase
        .from("resources")
        .select("*")
        .order("created_at", { ascending: false })

      if (type !== "all") query = query.eq("type", type)
      if (department !== "all") query = query.eq("department", department)
      if (semester !== "all") query = query.eq("semester", semester)
      if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)

      const { data, error } = await query
      if (error) {
        console.error("Supabase error fetching resources:", error)
        throw error
      }

      const profileMap = await fetchProfileMap((data ?? []).map((i) => i.user_id))

      return (data ?? []).map((item) => ({
        ...item,
        user: profileMap[item.user_id] ?? null,
      })) as ResourceWithUser[]
    },
    staleTime: 3 * 60 * 1000,
  })
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [
        { count: issues },
        { count: events },
        { count: announcements },
        { count: resources },
        { count: jobs },
        { count: studyGroups },
        { count: scholarships },
      ] = await Promise.all([
        supabase.from("issues").select("*", { count: "exact", head: true }),
        supabase.from("events").select("*", { count: "exact", head: true }),
        supabase.from("announcements").select("*", { count: "exact", head: true }),
        supabase.from("resources").select("*", { count: "exact", head: true }),
        supabase.from("jobs").select("*", { count: "exact", head: true }),
        supabase.from("study_groups").select("*", { count: "exact", head: true }),
        supabase.from("scholarships").select("*", { count: "exact", head: true }),
      ])
      return {
        issues: issues ?? 0,
        events: events ?? 0,
        announcements: announcements ?? 0,
        resources: resources ?? 0,
        jobs: jobs ?? 0,
        studyGroups: studyGroups ?? 0,
        scholarships: scholarships ?? 0,
      }
    },
    staleTime: 5 * 60 * 1000,
  })
}
