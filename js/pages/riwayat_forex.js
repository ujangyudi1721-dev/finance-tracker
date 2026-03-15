import { getForex, getForexTrades } from "../services/forexService.js";
import { renderHistoryForex } from "../ui.js";
import { calculateLoss, calculateProfit, calculateSaldo } from "../engine/forexEngine.js";

let allTransactions = [];

document.addEventListener("DOMContentLoaded", async () => {
    await loadHistoryForex();
});

// --- fungsi untuk meload semua yang ada di riwayat forex ---
async function loadHistoryForex() {
    
    const data = await getForex();

    // -- cek isi data --
    console.log("DATA", data);
    
    allTransactions = data;
    renderHistoryForex(data);

}

async function loadForexsaldo() {
    const trades = await getForexTrades();
    const saldo = calculateSaldo(trades);
    const saldoEl = document.getElementById("statSaldo");

    console.log(saldoEl);

    if (saldoEl){
        saldoEl.textContent = saldo.toLocaleString();

    }

    
}    
loadForexsaldo();
