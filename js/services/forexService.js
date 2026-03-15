import { supabase } from "../config/supabaseClient.js";
import { calculateLoss, calculateProfit, calculateSaldo } from "../engine/forexEngine.js";

// --- fungsi untuk menambahkan data dari forexinput.js ke database ---

export async function createForex(forex) {
 
      // -- mengambil fungsi perhitungan saldo, loss, profit dari forexEngine.js ---
      const {data: trades = []} = await supabase

      .from("forex")
      .select("aktual");

      const saldo = calculateSaldo(trades, forex.aktual);
      const loss = calculateLoss(saldo);
      const profit = calculateProfit(saldo);

      //--- ambil semua data untuk acuan saldo ---
      const {data, error} = await supabase
      .from("forex")
      .insert([
            {
            tanggal: forex.tanggal,
            pair: forex.pair,
            tipe_open: forex.tipe_open,
            t_loss: loss,
            t_profit: profit,
            lot: forex.lot,
            aktual: forex.aktual,
            keterangan: forex.keterangan,
                  },
            ]);

      console.log("DATA BERHASIL DI SIMPAN")
      console.log(forex)

      if (error) {
            console.error(error);
            return;
      }
      return data;
}


// --- fungsi untuk mengambil data dari database ke riwayat_forex.html ---
export async function getForex(limit = null) {
      
      const { data, error } = await supabase
            .from("forex")
            .select("*")
            .order("tanggal", {ascending: false})
            .limit (limit);

      if (error) {
            console.error("GET TRANSACTION ERROR: ", error)
            return [];
      }

      return data;
}

// -- fungsi ambil data service --
export async function getForexTrades () {
      const {data, error } = await supabase
      .from("forex")
      .select("aktual");

      if (error){
            console.error(error);
            return [];
      }
      return data;
}