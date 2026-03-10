import { supabase } from "../config/supabaseClient.js";
export async function getTransactions(limit = null) {

      const { data, error } = await supabase
            .from("transactions")
            .select("*")
            .order("tanggal", {ascending: false})
            .limit(limit);

      if (error) {
            console.error("GET TRANSACTIONS ERROR:", error)
            return [];
      }

      return data;
}

// --- fungsi input ---
export async function createTransaction(data) {

      const { error } = await supabase
            .from("transactions")
            .insert([data]);
}

// --- fungsi Edit ---
export async function updateTransaction(id, data) {
      const { error } = await supabase
            .from("transactions")
            .update(data)
            .eq("id", id);
      
      if (error) console.error("UPDATE ERROR:", error)
}

// --- fungsi Delete ---
export async function deleteTransaction(id) {
      const { error } = await supabase
            .from("transactions")
            .delete()
            .eq("id", id);

      if (error) {
            console.error(error);
            return false;
      }

      return true;
}
