import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zapxsrrbfywsypmqiqab.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphcHhzcnJiZnl3c3lwbXFpcWFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxOTU4NDAsImV4cCI6MjAzMzc3MTg0MH0.gInUgEZwD2GpnVXx2fh25Gk3ggoPVeIwuwqLHk1DF0s';

export const supabase = createClient(supabaseUrl, supabaseKey);