-- Drop and recreate notifications table with improved schema
DROP TABLE IF EXISTS public.notifications;

CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  related_id UUID,
  related_type TEXT,
  action_url TEXT,
  CONSTRAINT valid_type CHECK (
    type IN (
      'issue',
      'event',
      'announcement',
      'resource',
      'job',
      'study_group',
      'scholarship',
      'system'
    )
  )
);

-- Add better indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_created_at ON public.notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_read ON public.notifications(user_id, read);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Update RLS policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Create notification functions
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_title TEXT,
  p_content TEXT,
  p_type TEXT,
  p_related_id UUID DEFAULT NULL,
  p_related_type TEXT DEFAULT NULL,
  p_action_url TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO notifications (
    user_id,
    title,
    content,
    type,
    related_id,
    related_type,
    action_url
  ) VALUES (
    p_user_id,
    p_title,
    p_content,
    p_type,
    p_related_id,
    p_related_type,
    p_action_url
  ) RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for various events
CREATE OR REPLACE FUNCTION notify_on_content_creation() RETURNS TRIGGER AS $$
BEGIN
  -- Get the type of content from TG_TABLE_NAME
  -- Use CASE statements to access appropriate fields based on table name
  IF TG_TABLE_NAME = 'issues' THEN
    PERFORM create_notification(
      NEW.user_id,
      'New Issue Created',
      'A new issue has been created: ' || NEW.title,
      'issue',
      NEW.id,
      'issue',
      '/issues/' || NEW.id
    );
  ELSIF TG_TABLE_NAME = 'events' THEN
    PERFORM create_notification(
      NEW.user_id,
      'New Event Created',
      'A new event has been created: ' || NEW.title,
      'event',
      NEW.id,
      'event',
      '/events/' || NEW.id
    );
  ELSIF TG_TABLE_NAME = 'announcements' THEN
    PERFORM create_notification(
      NEW.user_id,
      'New Announcement',
      'New announcement: ' || NEW.title,
      'announcement',
      NEW.id,
      'announcement',
      '/announcements/' || NEW.id
    );
  ELSIF TG_TABLE_NAME = 'resources' THEN
    PERFORM create_notification(
      NEW.user_id,
      'New Resource Shared',
      'A new resource has been shared: ' || NEW.title,
      'resource',
      NEW.id,
      'resource',
      '/resources/' || NEW.id
    );
  ELSIF TG_TABLE_NAME = 'jobs' THEN
    PERFORM create_notification(
      NEW.user_id,
      'New Job Posted',
      'A new job has been posted: ' || NEW.title,
      'job',
      NEW.id,
      'job',
      '/jobs/' || NEW.id
    );
  ELSIF TG_TABLE_NAME = 'study_groups' THEN
    PERFORM create_notification(
      NEW.user_id,
      'New Study Group',
      'A new study group has been created: ' || NEW.name,
      'study_group',
      NEW.id,
      'study_group',
      '/study-groups/' || NEW.id
    );
  ELSIF TG_TABLE_NAME = 'scholarships' THEN
    PERFORM create_notification(
      NEW.user_id,
      'New Scholarship',
      'A new scholarship is available: ' || NEW.title,
      'scholarship',
      NEW.id,
      'scholarship',
      '/scholarships/' || NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for each content type
DROP TRIGGER IF EXISTS notify_new_issue ON issues;
CREATE TRIGGER notify_new_issue
  AFTER INSERT ON issues
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_content_creation();

DROP TRIGGER IF EXISTS notify_new_event ON events;
CREATE TRIGGER notify_new_event
  AFTER INSERT ON events
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_content_creation();

DROP TRIGGER IF EXISTS notify_new_announcement ON announcements;
CREATE TRIGGER notify_new_announcement
  AFTER INSERT ON announcements
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_content_creation();

DROP TRIGGER IF EXISTS notify_new_resource ON resources;
CREATE TRIGGER notify_new_resource
  AFTER INSERT ON resources
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_content_creation();

DROP TRIGGER IF EXISTS notify_new_job ON jobs;
CREATE TRIGGER notify_new_job
  AFTER INSERT ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_content_creation();

DROP TRIGGER IF EXISTS notify_new_study_group ON study_groups;
CREATE TRIGGER notify_new_study_group
  AFTER INSERT ON study_groups
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_content_creation();

DROP TRIGGER IF EXISTS notify_new_scholarship ON scholarships;
CREATE TRIGGER notify_new_scholarship
  AFTER INSERT ON scholarships
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_content_creation();

