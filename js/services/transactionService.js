import { supabase } from "../config/supabaseClient.js";
export async function getTransactions(limit = null) {
      let query = supabase
            .from("transactions")
            .select("*")
            .order("id", { ascending: false });

      if (limit) {
            query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
            console.error("Supabase Error:", error);
            return [];
      }

      return data;
}

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
