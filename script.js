function processFiles() {
    const stationFile = document.getElementById('stationFile').files[0];

    if (!stationFile) {
        alert("Please upload the station data file.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        stationData = XLSX.utils.sheet_to_json(sheet);
        updateTable();
    };

    reader.readAsArrayBuffer(stationFile);
}

let stationData = [];
let pricingData = {
    "CPCLD-POWER-5": 1080,
    "CPCLD-POWER-4": 895,
    "CPCLD-POWER-3": 685,
    "CPCLD-POWER-2": 470,
    "CPCLD-POWER-1": 240
};

function updateTable() {
    if (stationData.length === 0) return;

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
