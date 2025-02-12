function processFiles() {
    const stationFile = document.getElementById('stationFile').files[0];
    const pricingFile = document.getElementById('pricingFile').files[0];

    if (!stationFile || !pricingFile) {
        alert("Please upload both station data and pricing data files.");
        return;
    }

    const reader1 = new FileReader();
    const reader2 = new FileReader();

    reader1.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        stationData = XLSX.utils.sheet_to_json(sheet);
        updateTable();
    };

    reader2.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        pricingData = XLSX.utils.sheet_to_json(sheet);
        mapPricingData();
        updateTable();
    };

    reader1.readAsArrayBuffer(stationFile);
    reader2.readAsArrayBuffer(pricingFile);
}

let stationData = [];
let pricingData = {};

function mapPricingData() {
    pricingData = {};
    stationData.forEach(row => {
        pricingData[row['Model Number']] = row['USD List Price'];
    });
}

function updateTable() {
    if (stationData.length === 0 || Object.keys(pricingData).length === 0) return;

    const tbody = document.querySelector('#renewalsTable tbody');
    tbody.innerHTML = '';

    stationData.forEach(row => {
        const sku = row['Model Number'];
        const oneYear = pricingData[sku] ? pricingData[sku] * 1 : 'N/A';
        const threeYear = pricingData[sku] ? pricingData[sku] * 3 : 'N/A';
        const fiveYear = pricingData[sku] ? pricingData[sku] * 5 : 'N/A';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row['Org Name'] || ''}</td>
            <td>${row['Station Name'] || ''}</td>
            <td>${row['Model Number'] || ''}</td>
            <td>${row['Station S/N'] || ''}</td>
            <td>${oneYear}</td>
            <td>${threeYear}</td>
            <td>${fiveYear}</td>
        `;
        tbody.appendChild(tr);
    });
}
