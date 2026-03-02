let editId = null;
document.addEventListener("DOMContentLoaded", async () => {
      console.log("Dashboard loaded");
      // -------- variable untuk transaction list ----------------
      const listEl = document.getElementById("transactionList");

      //---------variable untuk total income dan expense----------
      const incomeEl = document.getElementById("totalIncome");
      const expenseEl = document.getElementById("totalExpense");

      console.log(incomeEl, expenseEl, listEl);

      const { data, error } = await supabaseClient
            .from("transactions")
            .select("*");

      console.log("DATA:", data);

      if (error) {
            console.error(error);
            return;
      }

      //--------- Urutkan terbaru di atas (berdasarkan id atau created_at)
      data.sort((a, b) => b.id - a.id);

      // ------- fungsi untuk menampilkan di span dashboard ----
      let totalIncome = 0;
      let totalExpense = 0;

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
                  /*
                  const { data, error } = await supabaseClient
                        .from("transactions")
                        .select("*")
                        .eq("id", id)
                        .single();

                  console.log(document.getElementById("tipe"));
                  if (error) return console.error(error);

                  document.getElementById("tanggal").value = data.tanggal;
                  document.getElementById("tipe").value = data.tipe;
                  document.getElementById("kategori").value = data.kategori;
                  ocument.getElementById("jumlah").value = data.jumlah;
                  ocument.getElementById("keterangan").value = data.keterangan;
*/
                 // editId = id;
                  //document.getElementById("submitBtn").innerText = "Update";
            });
      });
      // --- Tampilkan total ---
      incomeEl.textContent = totalIncome.toLocaleString("id-ID");
      expenseEl.textContent = totalExpense.toLocaleString("id-ID");
});
