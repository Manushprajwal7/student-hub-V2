"use client";

import { useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { PageTransition } from '@/components/page-transition'
import { ScholarshipCard } from '@/components/scholarships/scholarship-card'
import { Button } from '@/components/ui/button'
import { SkeletonGrid } from '@/components/ui/skeleton-card'
import { cn } from '@/lib/utils'
import { useScholarships } from '@/lib/hooks/use-query-hooks'
import type { ScholarshipCategory } from '@/types/scholarships'

const categories: ScholarshipCategory[] = ['Male', 'Female', 'State Level', 'National Level']

export function ScholarshipsPageClient() {
  const [selectedCategory, setSelectedCategory] = useState<ScholarshipCategory | 'All'>('All')

  const { data: scholarships = [], isLoading, error } = useScholarships(selectedCategory)

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold">Scholarships</h1>
          <Button asChild className="bg-[#28A745] hover:bg-[#218838]">
            <Link href="/scholarships/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Scholarship
            </Link>
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={selectedCategory === 'All' ? 'secondary' : 'outline'}
            onClick={() => setSelectedCategory('All')}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'secondary' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                category === 'Male' && 'text-blue-500',
                category === 'Female' && 'text-pink-500',
                category === 'State Level' && 'text-green-500',
                category === 'National Level' && 'text-purple-500'
              )}
            >
              {category}
            </Button>
          ))}
        </div>
        {isLoading ? (
          <SkeletonGrid count={6} cols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" />
        ) : error ? (
          <div className="flex items-center justify-center rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
            Failed to load scholarships. Please try again.
          </div>
        ) : scholarships.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">No scholarships found.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {scholarships.map((scholarship) => (
              <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  )
}
