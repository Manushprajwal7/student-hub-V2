"use client";

import { useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ResourceCard } from '@/components/resources/resource-card'
import { PageHeader } from '@/components/page-header'
import { PageTransition } from '@/components/page-transition'
import { SkeletonGrid } from '@/components/ui/skeleton-card'
import { useResources } from '@/lib/hooks/use-query-hooks'
import { useDebounce } from '@/hooks/use-debounce'
import type { Department, ResourceType, Semester } from '@/types/resources'

const resourceTypes: ResourceType[] = ['Notes', 'Textbooks', 'Practice Tests', 'Study Guides']
const departments: Department[] = ['CSE', 'ISE', 'AIML', 'BT', 'EEE', 'ECE', 'MT', 'ME']
const semesters: Semester[] = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']

export function ResourcesPageClient() {
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState<ResourceType | 'all'>('all')
  const [selectedDepartment, setSelectedDepartment] = useState<Department | 'all'>('all')
  const [selectedSemester, setSelectedSemester] = useState<Semester | 'all'>('all')

  // Debounce search — API only fires after 300ms of typing pause
  const debouncedSearch = useDebounce(search, 300)

  const {
    data: resources = [],
    isLoading,
    error,
  } = useResources(selectedType, selectedDepartment, selectedSemester, debouncedSearch)

  return (
    <PageTransition>
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Resources"
          description="Browse and share educational resources with your peers."
          action={
            <Button asChild>
              <Link href="/resources/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Resource
              </Link>
            </Button>
          }
        />

        <div className="grid gap-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <Input
              placeholder="Search resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="md:max-w-xs"
            />
            <Select value={selectedType} onValueChange={(value) => setSelectedType(value as ResourceType | 'all')}>
              <SelectTrigger className="md:max-w-xs">
                <SelectValue placeholder="Resource type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {resourceTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedDepartment}
              onValueChange={(value) => setSelectedDepartment(value as Department | 'all')}
            >
              <SelectTrigger className="md:max-w-xs">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedSemester} onValueChange={(value) => setSelectedSemester(value as Semester | 'all')}>
              <SelectTrigger className="md:max-w-xs">
                <SelectValue placeholder="Filter by semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Semesters</SelectItem>
                {semesters.map((sem) => (
                  <SelectItem key={sem} value={sem}>
                    {sem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <SkeletonGrid count={6} cols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
          ) : error ? (
            <div className="flex items-center justify-center rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
              Failed to load resources. Please try again.
            </div>
          ) : resources.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-lg border bg-muted/50 p-8 text-center">
              <p className="text-lg font-medium">No resources found</p>
              <p className="text-sm text-muted-foreground">
                {search || selectedType !== 'all' || selectedDepartment !== 'all' || selectedSemester !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Be the first to share a resource!'}
              </p>
              <Button asChild>
                <Link href="/resources/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Resource
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
