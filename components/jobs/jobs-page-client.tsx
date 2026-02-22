"use client";

import { useState } from 'react'
import { Search } from 'lucide-react'
import { PageTransition } from '@/components/page-transition'
import { JobCard } from '@/components/jobs/job-card'
import { PostJobDialog } from '@/components/jobs/post-job-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SkeletonGrid } from '@/components/ui/skeleton-card'
import { cn } from '@/lib/utils'
import { useJobs } from '@/lib/hooks/use-query-hooks'
import { useDebounce } from '@/hooks/use-debounce'
import { useQueryClient } from '@tanstack/react-query'
import type { JobType } from '@/types/jobs'

const jobTypes: JobType[] = ['Full Time', 'Part Time', 'Internship']

export function JobsPageClient() {
  const [selectedType, setSelectedType] = useState<JobType | 'All'>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const queryClient = useQueryClient()

  // Debounce search — API only fires after 300ms of typing pause
  const debouncedSearch = useDebounce(searchQuery, 300)

  const { data: jobs = [], isLoading, error } = useJobs(selectedType, debouncedSearch)

  const invalidateJobs = () => queryClient.invalidateQueries({ queryKey: ['jobs'] })

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold">Jobs</h1>
          <PostJobDialog onSuccess={invalidateJobs} />
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={selectedType === 'All' ? 'secondary' : 'outline'}
              onClick={() => setSelectedType('All')}
            >
              All
            </Button>
            {jobTypes.map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? 'secondary' : 'outline'}
                onClick={() => setSelectedType(type)}
                className={cn(
                  type === 'Full Time' && 'text-blue-500',
                  type === 'Part Time' && 'text-green-500',
                  type === 'Internship' && 'text-orange-500'
                )}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
        {isLoading ? (
          <SkeletonGrid count={6} cols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" />
        ) : error ? (
          <div className="flex items-center justify-center rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
            Failed to load jobs. Please try again.
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">No jobs found.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  )
}
