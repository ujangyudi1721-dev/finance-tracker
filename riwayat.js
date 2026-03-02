document.addEventListener("DOMContentLoaded", async () => {
      const listEl = document.getElementById("transactionList");

      const { data, error } = await supabaseClient
            .from("transactions")
            .select("*")
            .order("id", { ascending: false });

      if (error) {
            console.error(error);
            return;
      }

      data.forEach((item) => {
            const li = document.createElement("li");
            li.textContent =
                  item.tipe.toUpperCase() +
                  " - Rp " +
                  Number(item.jumlah) +
                  " - " +
                  item.keterangan.toLocaleString("id-ID");
            listEl.appendChild(li);
      });
});
