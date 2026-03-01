//    =============================
//    SUPABASE CONECTION (SAFE)
//    =============================

if (!window.supabaseClient) {
      const supabaseUrl = "https://tbgirpsbfjjbnrleltod.supabase.co";
      const supabaseKey = "sb_publishable_ywY-FXj_zicmv7b9DNzmkg_oRau1eFI";
      window.supabaseClient = window.supabase.createClient(
            supabaseUrl,
            supabaseKey,
      );
}

const db = window.supabaseClient;
//    =============================
//    LOAD DASHBOARD
//    =============================

async function loadData() {
      const { data, error } = await db.from("transactions").select("*");

      if (error) {
            console.error(error);
            return;
      }

      let totalIncome = 0;
      let totalExpense = 0;

      data.forEach((item) => {
            if (item.tipe === "income") totalIncome += Number(item.jumlah);
            if (item.tipe === "expense") totalExpense += Number(item.jumlah);
      });

      const incomeEl = document.getElementById("totalIncome");
      const expenseEl = document.getElementById("totalExpense");

      if (incomeEl) incomeEl.innerText = totalIncome;
      if (expenseEl) expenseEl.innerText = totalExpense;
}

//    ==========================
//    SIMPAN TRANSAKSI
//    ==========================

document.addEventListener("DOMContentLoaded", function () {
      const btn = document.getElementById("btnSimpan");

      if (btn) {
            btn.addEventListener("click", async function () {
                  const tanggal = document.getElementById("tanggal").value;
                  const tipe = document.getElementById("tipe").value;
                  const kategori = document.getElementById("kategori").value;
                  const jumlah = document.getElementById("jumlah").value;
                  const keterangan =
                        document.getElementById("keterangan").value;

                  if (
                        !tanggal ||
                        !tipe ||
                        !kategori ||
                        !jumlah ||
                        !keterangan
                  ) {
                        alert("Lengakapi data dulu!");
                        return;
                  }

                  const { error } = await db
                        .from("transactions")
                        .insert([
                              { tanggal, tipe, kategori, jumlah, keterangan },
                        ]);

                  if (error) {
                        alert("Gagal simpan!");
                        console.error(error);
                        return;
                  }

                  alert("Data berhasil disimpan !");

                  document.getElementById("tanggal").value = "";
                  document.getElementById("kategori").value = "";
                  document.getElementById("jumlah").value = "";
                  document.getElementById("keterangan").value = "";
            });
      }

      //    --------------------------------------------------------
      //    Jalankan load dashboard hanya kalau elemen ada
      //    --------------------------------------------------------

      if (document.getElementById("totalIncome")) {
            loadData();
      }
});
