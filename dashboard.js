let editId = null;
document.addEventListener("DOMContentLoaded", async () => {
      console.log("Dashboard loaded");
      // -------- variable untuk transaction list ----------------
      const listEl = document.getElementById("transactionList");

      //---------variable untuk total income dan expense----------
      const incomeEl = document.getElementById("totalIncome");
      const expenseEl = document.getElementById("totalExpense");

      console.log(incomeEl, expenseEl, listEl);
      async function loadData() {
            const { data, error } = await supabaseClient
                  .from("transactions")
                  .select("*")
                  .order("id", { ascending: false })
                  .limit(10);

            console.log("Data dari supabase:", data);
            let totalIncome = 0;
            let totalExpense = 0;
            if (error) {
                  console.error(error);
                  return;
            }

            //--------- Urutkan terbaru di atas (berdasarkan id atau created_at)
            data.sort((a, b) => b.id - a.id);

            // ------- fungsi untuk menampilkan di span dashboard ----
            //let totalIncome = 0;
            //let totalExpense = 0;

            //------ fungsi perhitungan -------
            data.forEach((item) => {
                  console.log("TYPE DARI DB: ", item.tipe);
                  const tipe = item.tipe?.trim().toLowerCase();
                  const jumlah = Number(item.jumlah) || 0;

                  // --- hitung total ---
                  if (tipe === "income") {
                        totalIncome += jumlah;
                  } else if (tipe === "expense") {
                        totalExpense += jumlah;
                  }

                  //--- Elemen list ---
                  const li = document.createElement("li");
                  li.classList.add(tipe === "income" ? "income" : "expense");

                  li.innerHTML = `${tipe.toUpperCase()} - Rp ${jumlah.toLocaleString("id-ID")}
            <button data-id="${item.id}" class="editBtn">Edit</button>
            <button data-id="${item.id}" class="deleteBtn">Hapus</button>
            `;

                  listEl.appendChild(li);
            });

            const saldo = totalIncome - totalExpense;

            document.getElementById("totalIncome").innerText =
                  "Rp " + totalIncome.toLocaleString("id-ID");
            document.getElementById("totalExpense").innerText =
                  "Rp " + totalExpense.toLocaleString("id-ID");
            document.getElementById("totalSaldo").innerText =
                  "Rp " + saldo.toLocaleString("id-ID");

            // --- fungsi grafik ---
            const ctx = document.getElementById("financeChart");

            new Chart(ctx, {
                  type: "bar",
                  data: {
                        labels: ["Income", "Expense"],
                        datasets: [
                              {
                                    label: "Total (Rp)",
                                    data: [totalIncome, totalExpense],
                                    backgroundColor: ["#16a34a", "#dc2626"],
                              },
                        ],
                  },
                  options: {
                        responsive: true,
                        maintainAspectRatio: false, // --- Wajib kalau pakai height CSS
                        plugins: {
                              legend: { display: false },
                        },
                        scales: {
                              y: { beginAtZero: true },
                        },
                  },
            });

            // --- EvenListener untuk delete ---
            document.querySelectorAll(".deleteBtn").forEach((button) => {
                  button.addEventListener("click", async (e) => {
                        const id = e.target.dataset.id;

                        const confirmDelete = confirm(
                              "Yakin mau hapus transaksi ini? ",
                        );
                        if (!confirmDelete) return;

                        const { error } = await supabaseClient
                              .from("transactions")
                              .delete()
                              .eq("id", id);

                        if (error) {
                              console.error(error);
                              alert("Gagal menghapus");
                              return;
                        }

                        // --- Hapus elemen dari tampilan
                        e.target.parentElement.remove();

                        // --- Reload halaman supaya total update (secara simple dulu)
                        location.reload();
                  });
            });

            // --- even listener untuk edit button ---
            document.querySelectorAll(".editBtn").forEach((btn) => {
                  btn.addEventListener("click", () => {
                        const id = btn.getAttribute("data-id");
                        window.location.href = `input.html?id=${id}`;
                  });
            });
      }
      loadData();
});
