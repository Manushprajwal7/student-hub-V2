"use client";

import { useState } from 'react'
import { PageTransition } from '@/components/page-transition'
import { StudyGroupCard } from '@/components/study-groups/study-group-card'
import { CreateGroupDialog } from '@/components/study-groups/create-group-dialog'
import { Button } from '@/components/ui/button'
import { SkeletonGrid } from '@/components/ui/skeleton-card'
import { cn } from '@/lib/utils'
import { useAuth } from '@/components/providers/auth-provider'
import { useStudyGroups } from '@/lib/hooks/use-query-hooks'
import { useQueryClient } from '@tanstack/react-query'
import type { Subject, StudyGroupWithUser } from '@/types/study-groups'

const subjects: Subject[] = [
  'Computer Science',
  'Electronics',
  'Bio Technology',
  'Mechanical',
  'Mechanotronics',
  'Civil',
]

export function StudyGroupsPageClient() {
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'All'>('All')
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useStudyGroups(selectedSubject)
  const groups: StudyGroupWithUser[] = data ?? []

  const invalidateGroups = () => queryClient.invalidateQueries({ queryKey: ['study-groups'] })

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold">Study Groups</h1>
          <CreateGroupDialog onSuccess={invalidateGroups} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={selectedSubject === 'All' ? 'secondary' : 'outline'}
            onClick={() => setSelectedSubject('All')}
          >
            All
          </Button>
          {subjects.map((subject) => (
            <Button
              key={subject}
              variant={selectedSubject === subject ? 'secondary' : 'outline'}
              onClick={() => setSelectedSubject(subject)}
              className={cn(
                subject === 'Computer Science' && 'text-blue-500',
                subject === 'Electronics' && 'text-green-500',
                subject === 'Bio Technology' && 'text-purple-500',
                subject === 'Mechanical' && 'text-orange-500',
                subject === 'Mechanotronics' && 'text-red-500',
                subject === 'Civil' && 'text-yellow-500'
              )}
            >
              {subject}
            </Button>
          ))}
        </div>
        {isLoading ? (
          <SkeletonGrid count={4} cols="grid-cols-1 md:grid-cols-2" />
        ) : error ? (
          <div className="flex items-center justify-center rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
            Failed to load study groups. Please try again.
          </div>
        ) : groups.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">No study groups found.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {groups.map((group) => (
              <StudyGroupCard
                key={group.id}
                group={group}
                currentUserId={user?.id}
                onJoinLeave={invalidateGroups}
              />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  )
}
