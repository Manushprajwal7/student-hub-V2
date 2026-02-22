"use client";

import { useState } from "react";
import { PageTransition } from "@/components/page-transition";
import { EventCard } from "@/components/events/event-card";
import { CreateEventDialog } from "@/components/events/create-event-dialog";
import { Button } from "@/components/ui/button";
import { SkeletonGrid } from "@/components/ui/skeleton-card";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { useEvents } from "@/lib/hooks/use-query-hooks";
import { useQueryClient } from "@tanstack/react-query";
import type { EventType } from "@/types/events";

const eventTypes: EventType[] = ["Cultural Event", "Technical", "Out Reach Activity", "Rally Event", "Awareness Event"];

export function EventsPageClient() {
  const [selectedType, setSelectedType] = useState<EventType | "All">("All")
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: events = [], isLoading, error } = useEvents(selectedType)

  const invalidateEvents = () => queryClient.invalidateQueries({ queryKey: ["events"] })

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold">Events</h1>
          <CreateEventDialog onSuccess={invalidateEvents} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant={selectedType === "All" ? "secondary" : "outline"} onClick={() => setSelectedType("All")}>
            All
          </Button>
          {eventTypes.map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? "secondary" : "outline"}
              onClick={() => setSelectedType(type)}
              className={cn(
                type === "Cultural Event" && "text-purple-500",
                type === "Technical" && "text-blue-500",
                type === "Out Reach Activity" && "text-green-500",
                type === "Rally Event" && "text-orange-500",
                type === "Awareness Event" && "text-red-500",
              )}
            >
              {type}
            </Button>
          ))}
        </div>
        {isLoading ? (
          <SkeletonGrid count={4} cols="grid-cols-1 md:grid-cols-2" />
        ) : error ? (
          <div className="flex items-center justify-center rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
            Failed to load events. Please try again.
          </div>
        ) : events.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">No events found.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {events.map((event) => (
              <EventCard key={event.id} event={event} currentUserId={user?.id} onRegister={invalidateEvents} />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  )
}
