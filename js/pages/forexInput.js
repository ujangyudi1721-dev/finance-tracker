
import { createForex } from "../services/forexService.js";


const form = document.getElementById("inputForex");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const forex = {
            tanggal: document.getElementById("tanggal").value,
            tipe_open: document.getElementById("tipe_open").value,
            pair: document.getElementById("pair").value,
            lot: document.getElementById("lot").value,
            aktual: Number(document.getElementById("aktual").value),
            keterangan: document.getElementById("keterangan").value,
        };

        await createForex(forex);
        console.log(forex);

        alert("data berhasil di simpan");
        window.location.href = "riwayat_forex.html";
    });
    
}
