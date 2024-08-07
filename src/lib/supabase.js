import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://fgobvtrklodgkuvlwoto.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnb2J2dHJrbG9kZ2t1dmx3b3RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk1MTE5NzQsImV4cCI6MjAzNTA4Nzk3NH0.GttsxsJRDxNWrkzu7lkDqpuzmo6-fBi691AUow3jrhY";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase