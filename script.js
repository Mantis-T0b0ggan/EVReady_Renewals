document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded."); // Debug log
    document.getElementById("processButton").addEventListener("click", processFiles);
});

function processFiles() {
    console.log("Process Files button clicked."); // Debug log

    const stationInput = document.getElementById('stationFile');
    if (!stationInput) {
        console.error("Station file input not found. Please check your HTML.");
        return;
    }

    const stationFile = stationInput.files[0];
    if (!stationFile) {
        console.warn("No file selected. Please upload a station data file.");
        return;
    }

    console.log("File detected:", stationFile.name); // Debug log

    const reader = new FileReader();
    reader.onload = function (e) {
        console.log("File successfully read."); // Debug log
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        stationData = XLSX.utils.sheet_to_json(sheet);

        console.log("Parsed station data:", stationData); // Debug log
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
    console.log("Updating table with data:", stationData); // Debug log

    if (stationData.length === 0) {
        console.warn("No data available to display.");
        return;
    }

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

    console.log("Table updated successfully."); // Debug log
}
