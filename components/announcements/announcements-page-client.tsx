"use client";

import { useState } from 'react'
import { PageTransition } from '@/components/page-transition'
import { AnnouncementCard } from '@/components/announcements/announcement-card'
import { CreateAnnouncementDialog } from '@/components/announcements/create-announcement-dialog'
import { Button } from '@/components/ui/button'
import { SkeletonGrid } from '@/components/ui/skeleton-card'
import { useAnnouncements } from '@/lib/hooks/use-query-hooks'
import { useQueryClient } from '@tanstack/react-query'
import type { AnnouncementPriority } from '@/types/announcements'

const priorities: AnnouncementPriority[] = ['High', 'Medium', 'Low']

export function AnnouncementsPageClient() {
  const [selectedPriority, setSelectedPriority] = useState<AnnouncementPriority | 'All'>('All')
  const queryClient = useQueryClient()

  const { data: announcements = [], isLoading, error } = useAnnouncements(selectedPriority)

  const invalidateAnnouncements = () => queryClient.invalidateQueries({ queryKey: ['announcements'] })

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold">Announcements</h1>
          <CreateAnnouncementDialog onSuccess={invalidateAnnouncements} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={selectedPriority === 'All' ? 'secondary' : 'outline'}
            onClick={() => setSelectedPriority('All')}
          >
            All
          </Button>
          {priorities.map((priority) => (
            <Button
              key={priority}
              variant={selectedPriority === priority ? 'secondary' : 'outline'}
              onClick={() => setSelectedPriority(priority)}
            >
              {priority}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <SkeletonGrid count={4} cols="grid-cols-1 md:grid-cols-2" />
        ) : error ? (
          <div className="flex items-center justify-center rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
            Failed to load announcements. Please try again.
          </div>
        ) : announcements.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">No announcements found.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {announcements.map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  )
}
