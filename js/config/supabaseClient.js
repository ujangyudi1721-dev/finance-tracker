const supabaseUrl = "https://tbgirpsbfjjbnrleltod.supabase.co";
const supabaseKey = "sb_publishable_ywY-FXj_zicmv7b9DNzmkg_oRau1eFI";

export const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

console.log("Supabase connected");
