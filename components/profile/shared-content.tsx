"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  subject: string;
  day: string;
  location: string;
  whatsapp_link: string;
  members: string[];
  created_at: string;
  updated_at: string;
}

interface SharedItem {
  id: string;
  title: string;
  created_at: string;
  type:
    | "issue"
    | "event"
    | "job"
    | "resource"
    | "announcement"
    | "study-group"
    | "scholarship";
}

const contentTypes = [
  { value: "all", label: "All" },
  { value: "issues", label: "Issues" },
  { value: "events", label: "Events" },
  { value: "jobs", label: "Jobs" },
  { value: "resources", label: "Resources" },
  { value: "announcements", label: "Announcements" },
  { value: "study-groups", label: "Study Groups" },
  { value: "scholarships", label: "Scholarships" },
];

const getTableName = (type: SharedItem["type"]): string => {
  switch (type) {
    case "study-group":
      return "study_groups";
    default:
      return `${type}s`;
  }
};

// Helper function to convert filter value to content type
const getContentType = (filterValue: string): string => {
  switch (filterValue) {
    case "study-groups":
      return "studyGroups";
    case "issues":
      return "issues";
    case "events":
      return "events";
    case "jobs":
      return "jobs";
    case "resources":
      return "resources";
    case "announcements":
      return "announcements";
    case "scholarships":
      return "scholarships";
    default:
      return filterValue;
  }
};

export function SharedContent({ userId }: { userId: string }) {
  const [deletingItems, setDeletingItems] = useState<Set<string>>(new Set());
  const [selectedType, setSelectedType] = useState("all");
  const [itemToDelete, setItemToDelete] = useState<SharedItem | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: fetchedSharedContent, isLoading } = useQuery({
    queryKey: ["shared-content", userId, selectedType],
    queryFn: async () => {
      try {
        const [
          { data: issues },
          { data: events },
          { data: jobs },
          { data: resources },
          { data: announcements },
          { data: studyGroups },
          { data: scholarships },
        ] = await Promise.all([
          supabase
            .from("issues")
            .select("id, title, created_at")
            .eq("user_id", userId),
          supabase
            .from("events")
            .select("id, title, created_at")
            .eq("user_id", userId),
          supabase
            .from("jobs")
            .select("id, title, created_at")
            .eq("user_id", userId),
          supabase
            .from("resources")
            .select("id, title, created_at")
            .eq("user_id", userId),
          supabase
            .from("announcements")
            .select("id, title, created_at")
            .eq("user_id", userId),
          supabase
            .from("study_groups")
            .select(
              "id, name, description, subject, day, location, whatsapp_link, members, created_at"
            )
            .eq("user_id", userId),
          supabase
            .from("scholarships")
            .select("id, title, created_at")
            .eq("user_id", userId),
        ]);

        // Transform study groups to match SharedItem interface
        const transformedStudyGroups =
          studyGroups?.map((group) => ({
            id: group.id,
            title: `${group.name} - ${group.subject}`, // Combine name and subject for better display
            created_at: group.created_at,
            type: "study-group" as const,
            // Include additional study group specific data
            description: group.description,
            day: group.day,
            location: group.location,
            whatsapp_link: group.whatsapp_link,
            members: group.members,
          })) || [];

        return {
          issues:
            issues?.map((item) => ({ ...item, type: "issue" as const })) || [],
          events:
            events?.map((item) => ({ ...item, type: "event" as const })) || [],
          jobs: jobs?.map((item) => ({ ...item, type: "job" as const })) || [],
          resources:
            resources?.map((item) => ({
              ...item,
              type: "resource" as const,
            })) || [],
          announcements:
            announcements?.map((item) => ({
              ...item,
              type: "announcement" as const,
            })) || [],
          studyGroups: transformedStudyGroups,
          scholarships:
            scholarships?.map((item) => ({
              ...item,
              type: "scholarship" as const,
            })) || [],
        };
      } catch (error) {
        console.error("Error fetching shared content:", error);
        throw error;
      }
    },
  });

  const handleDelete = async (item: SharedItem) => {
    try {
      setDeletingItems((prev) => new Set(prev).add(item.id));
      const tableName = getTableName(item.type);

      // Special handling for study groups
      if (item.type === "study-group") {
        const { error: deleteError } = await supabase
          .from("study_groups")
          .delete()
          .match({ id: item.id, user_id: userId });

        if (deleteError) throw deleteError;
      } else {
        // Handle other content types
        if (item.type === "issue") {
          const { error: commentsError } = await supabase
            .from("comments")
            .delete()
            .eq("issue_id", item.id);

          if (commentsError) {
            console.error("Error deleting comments:", commentsError);
          }
        }

        if (item.type === "resource") {
          try {
            const { data: files } = await supabase.storage
              .from("resources")
              .list(item.id);

            if (files?.length) {
              await Promise.all(
                files.map((file) =>
                  supabase.storage
                    .from("resources")
                    .remove([`${item.id}/${file.name}`])
                )
              );
            }
          } catch (error) {
            console.error("Error deleting resource files:", error);
          }
        }

        const { error: deleteError } = await supabase
          .from(tableName)
          .delete()
          .match({ id: item.id, user_id: userId });

        if (deleteError) throw deleteError;
      }

      await queryClient.invalidateQueries(["shared-content"]);

      toast({
        title: "Success",
        description: `${item.type.replace(
          "-",
          " "
        )} has been deleted successfully.`,
      });
    } catch (error) {
      console.error("Error deleting content:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete content. Please try again.",
      });
    } finally {
      setDeletingItems((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
      setItemToDelete(null);
    }
  };

  const filteredContent = () => {
    if (!fetchedSharedContent) return [];

    const allContent: SharedItem[] = [];

    if (selectedType === "all") {
      // Include all content types
      Object.values(fetchedSharedContent).forEach((items) => {
        allContent.push(...items);
      });
    } else {
      // Get the correct content type key
      const contentType = getContentType(selectedType);
      const items =
        fetchedSharedContent[
          contentType as keyof typeof fetchedSharedContent
        ] || [];
      allContent.push(...items);
    }

    return allContent.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  };

  const renderItemDetails = (item: SharedItem) => {
    if (item.type === "study-group") {
      const studyGroup = (fetchedSharedContent?.studyGroups || []).find(
        (group) => group.id === item.id
      );
      if (studyGroup) {
        return (
          <div className="space-y-1">
            <p className="font-medium">{studyGroup.title}</p>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="capitalize">
                  {item.type.replace("-", " ")}
                </span>
                <span>•</span>
                <span>{format(new Date(item.created_at), "PPP")}</span>
              </div>
              <p>Day: {studyGroup.day}</p>
              <p>Location: {studyGroup.location}</p>
              <p>Members: {studyGroup.members?.length || 0}</p>
            </div>
          </div>
        );
      }
    }

    return (
      <div className="space-y-1">
        <p className="font-medium">{item.title}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="capitalize">{item.type.replace("-", " ")}</span>
          <span>•</span>
          <span>{format(new Date(item.created_at), "PPP")}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          Your Shared Content
        </h2>
        <div className="relative">
          <ScrollArea className="max-w-[100vw] md:max-w-[600px]">
            <div className="flex space-x-2 p-1">
              {contentTypes.map((type) => (
                <Button
                  key={type.value}
                  variant={selectedType === type.value ? "default" : "outline"}
                  className="flex-shrink-0"
                  onClick={() => setSelectedType(type.value)}
                >
                  {type.label}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContent().length > 0 ? (
                filteredContent().map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    {renderItemDetails(item)}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      disabled={deletingItems.has(item.id)}
                      onClick={() => setItemToDelete(item)}
                    >
                      {deletingItems.has(item.id) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">
                  No{" "}
                  {selectedType === "all"
                    ? "content"
                    : selectedType.replace("-", " ")}{" "}
                  shared yet.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={!!itemToDelete}
        onOpenChange={() => setItemToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {itemToDelete?.type.replace("-", " ")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this{" "}
              {itemToDelete?.type.replace("-", " ")}? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => itemToDelete && handleDelete(itemToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
