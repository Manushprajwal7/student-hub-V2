import { supabase } from "@/lib/supabase";
import type { Resource, ResourceWithUser } from "@/types/resources";

export async function getResources() {
  try {
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error fetching resources (getResources):", error)
      throw error;
    }

    return data as ResourceWithUser[];
  } catch (error) {
    console.error("Error in getResources:", error);
    throw error;
  }
}

export async function createResource(data: Resource, userId: string) {
  try {
    const formattedData = {
      title: data.title,
      description: data.description,
      url: data.url,
      department: data.department,
      semester: data.semester,
      type: data.type,
      user_id: userId,
      tags: Array.isArray(data.tags)
        ? data.tags
        : data.tags
        ? (data.tags as unknown as string)
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [],
    };

    const { error } = await supabase.from("resources").insert(formattedData);

    if (error) {
      console.error("Supabase insert error (resources):", error)
      throw error;
    }
  } catch (error) {
    console.error("Error in createResource:", error);
    throw error;
  }
}
