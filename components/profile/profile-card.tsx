import React, { useEffect, useState } from "react";
import {
  CameraIcon,
  Loader2,
  PencilIcon,
  CheckIcon,
  XIcon,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types/profile";

const ProfileCard = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newFullName, setNewFullName] = useState("");

  useEffect(() => {
    async function loadProfile() {
      if (!user?.id) return;

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) throw error;

        setProfile(data);
        setNewFullName(data.full_name || "");
      } catch (error) {
        console.error("Error loading profile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile information.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [user?.id, toast]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    // Validate file type and size
    const fileType = file.type.split("/")[0];
    if (fileType !== "image") {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file.",
      });
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload new image
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      if (!publicUrlData.publicUrl) throw new Error("Failed to get public URL");

      // Update profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrlData.publicUrl })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      setProfile((prev) => ({
        ...prev!,
        avatar_url: publicUrlData.publicUrl,
      }));

      toast({
        title: "Success",
        description: "Profile picture updated successfully.",
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile picture. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateFullName = async () => {
    if (!user?.id || !newFullName.trim()) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: newFullName.trim() })
        .eq("user_id", user.id);

      if (error) throw error;

      setProfile((prev) => ({
        ...prev!,
        full_name: newFullName.trim(),
      }));

      toast({
        title: "Success",
        description: "Full name updated successfully.",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating name:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update full name. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex h-[300px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  const fullName = profile?.full_name || "Not Set";
  const avatarUrl =
    profile?.avatar_url ||
    `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
      fullName
    )}`;
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          Profile Information
        </CardTitle>
        <CardDescription>
          Manage your account details and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-primary/10">
              <AvatarImage
                src={avatarUrl}
                alt={fullName}
                className="object-cover"
              />
              <AvatarFallback className="text-2xl">
                {fullName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 z-10">
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
              <label
                htmlFor="avatar-upload"
                className="cursor-pointer"
                onClick={() => console.log("Camera button clicked!")} // Added console.log here
              >
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-10 w-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <CameraIcon className="h-5 w-5" />
                  )}
                  <span className="sr-only">Change profile picture</span>
                </Button>
              </label>
            </div>
          </div>
          <div className="w-full space-y-4">
            <div className="space-y-2">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    className="text-lg"
                    placeholder="Enter your full name"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleUpdateFullName}
                  >
                    <CheckIcon className="h-5 w-5 text-green-600" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsEditing(false)}
                  >
                    <XIcon className="h-5 w-5 text-red-600" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <h3 className="text-2xl font-semibold">{fullName}</h3>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsEditing(true)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <div className="flex flex-col items-center gap-2 pt-4 border-t">
              <p className="text-base font-medium">{user?.email}</p>
              {isAdmin && (
                <p className="text-sm font-medium text-green-600">Admin</p>
              )}
              <p className="text-sm text-muted-foreground">
                Member since {memberSince}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
