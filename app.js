console.log("APP JS TERBACA");
let myChart = null;
document.addEventListener("DOMContentLoaded", function () {
      const supabaseUrl = "https://tbgirpsbfjjbnrleltod.supabase.co";
      const supabaseKey = "sb_publishable_ywY-FXj_zicmv7b9DNzmkg_oRau1eFI";

      const db = supabase.createClient(supabaseUrl, supabaseKey);

      document
            .getElementById("btnSimpan")
            .addEventListener("click", async function () {
                  console.log("TOMBOL DI KLIK");
                  const tanggal = document.getElementById("tanggal").value;
                  const tipe = document.getElementById("tipe").value;
                  const kategori = document.getElementById("kategori").value;
                  const jumlah = document.getElementById("jumlah").value;
                  const keterangan =
                        document.getElementById("keterangan").value;

                  const { data, error } = await db.from("transactions").insert([
                        {
                              tanggal,
                              tipe,
                              kategori,
                              jumlah,
                              keterangan,
                        },
                  ]);

                  if (error) {
                        alert("Error: " + error.message);
                        console.log(error);
                  } else {
                        alert("Data berhasil disimpan!");
                        loadData();
                        const tanggal = (document.getElementById(
                              "tanggal",
                        ).value = "");
                        const tipe = (document.getElementById("tipe").value =
                              "Income");
                        const kategori = (document.getElementById(
                              "kategori",
                        ).value = "");
                        const jumlah = (document.getElementById(
                              "jumlah",
                        ).value = "");
                        const keterangan = (document.getElementById(
                              "keterangan",
                        ).value = "");
                  }

                  console.log("insert sukses");
                  await loadData();
            });
      console.log("DOM SIAP");
      loadData();

      function formatRupiah(angka) {
            return new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
            }).format(angka);
      }
      async function loadData() {
            const { data, error } = await db
                  .from("transactions")
                  .select("*")
                  .order("tanggal", { ascending: false });

            if (error) {
                  console.log(error);
                  return;
            }
            let html = "<h3>Daftar Transaksi </h3><ul>";
            //let saldo = 0;
            let totalIncome = 0;
            let totalExpense = 0;
            data.forEach((item) => {
                  console.log(item.tipe);

                  const tipe = item.tipe.toLowerCase().trim();
                  const jumlah = parseFloat(item.jumlah) || 0;

                  if (item.tipe === "income") {
                        totalIncome += jumlah;
                  } else {
                        totalExpense -= jumlah;
                  }

                  html += ` <li>
                                    ${item.tanggal} | ${item.tipe} | ${item.kategori} | Rp ${item.jumlah}
                                    <button onclick="hapusData(${item.id})">Hapus</button>
                                    </li>`;
                  console.log(item.jumlah, typeof item.jumlah);
            });
            console.log("Total income:", totalIncome);
            console.log("Total Expense: ", totalExpense);

            const saldo = totalIncome - totalExpense;

            document.getElementById("totalIncome").innerText =
                  formatRupiah(totalIncome);
            document.getElementById("totalExpense").innerText =
                  formatRupiah(totalExpense);
            document.getElementById("totalSaldo").innerText =
                  formatRupiah(saldo);

            const ctx = document.getElementById("chartKeuangan");
            // hancurkan chart lama
            if (myChart !== null) {
                  myChart.destroy();
            }
            // Buat chart baru
            myChart = new Chart(ctx, {
                  type: "bar",
                  data: {
                        labels: ["Income", "Expense"],
                        datasets: [
                              {
                                    label: "Total",
                                    data: [totalIncome, totalExpense],
                                    backgroundColor: ["green", "red"],
                              },
                        ],
                  },
                  options: {
                        responsive: true,
                        maintainAspectRatio: false,
                  },
            });
            html += "</ul>";
            html += `<h3>Total Saldo: Rp ${saldo}</h3>`;

            document.getElementById("hasil").innerHTML = html;
      }
      window.hapusData = async function (id) {
            const konfirmasi = confirm("Yakin mau hapus data ini?");
            if (!konfirmasi) return;

            const { error } = await db
                  .from("transactions")
                  .delete()
                  .eq("id", id);

            if (error) {
                  alert("gagal hapus:" + error.mesage);
            } else {
                  alert("Data berhasil dihapus!");
                  loadData();
            }
      };
});
