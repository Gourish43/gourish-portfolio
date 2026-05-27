import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nozuqgftrqkjrkcqyiro.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5venVxZ2Z0cnFranJrY3F5aXJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MDE1MjEsImV4cCI6MjA5Mzk3NzUyMX0.lQrrZan-V7TSlIxETcor1OXkuwKsxOT5eVte8DrlGoo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
