//    =============================
//    SUPABASE CONECTION (SAFE)
//    =============================
const { createClient } = supabase;
window.supabaseClient = supabase.createClient(
      "https://tbgirpsbfjjbnrleltod.supabase.co",
      "sb_publishable_ywY-FXj_zicmv7b9DNzmkg_oRau1eFI",
);
