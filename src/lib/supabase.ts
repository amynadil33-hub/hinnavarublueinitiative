import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://zoticdhevkhsvfphxhpe.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImQ1MGRlOGRmLTVkZDgtNGI4MC1iZjZlLTQyYTM4OTJlNmEyMSJ9.eyJwcm9qZWN0SWQiOiJ6b3RpY2RoZXZraHN2ZnBoeGhwZSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzgwOTY1MDIyLCJleHAiOjIwOTYzMjUwMjIsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.TcXgcgW_XJc3E_SW42ZOZDsX8pHugdNRKpnVAJLeJh4';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };