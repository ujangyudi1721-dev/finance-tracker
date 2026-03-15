export function calculateSaldo (trades, newAktual = 0 ) {
    let saldo = 0;
        
    if (trades && trades.length > 0) {
        trades.forEach(t => {
            saldo += Number(t.aktual) || 0;
        });
    }

     
    saldo += Number(newAktual);

    console.log("TOTAL SALDO FOREX: ", saldo);
    return saldo;
}

export function calculateLoss (saldo) {
    return saldo * 0.01;
}

export function calculateProfit (saldo) {
    return saldo * 0.015;
}