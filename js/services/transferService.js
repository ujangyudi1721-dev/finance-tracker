import { supabase } from "../config/supabaseClient.js";

// --- fungsi membuat transaksi transfer ---
export async function createTransfer(data, tujuanAkun) {

      // --- variable tranfer keluar ---
      const keluar = {
            tanggal: data.tanggal,
            tipe: "transfer",
            kategori: "transfer",
            jumlah: -Number(data.jumlah),
            keterangan: `Transfer ke ${tujuanAkun}`,
            akun: data.akun
      };

      // --- variable transfer masuk ---
      const masuk = {
            tanggal: data.tanggal,
            tipe: "transfer",
            kategori: "transfer",
            jumlah: Number(data.jumlah),
            keterangan: `Transfer dari ${data.akun}`,
            akun: tujuanAkun
      };

      const { error } = await supabase
            .from("transactions")
            .insert([keluar, masuk]);
            
      if (error) console.error("TRANSFER ERROR: ", error);
}