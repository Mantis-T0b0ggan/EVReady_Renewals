document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded.");
    document.getElementById("processButton").addEventListener("click", processFiles);
});

function processFiles() {
    console.log("Process Files button clicked.");

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

    console.log("File detected:", stationFile.name);

    const reader = new FileReader();
    reader.onload = function (e) {
        console.log("File successfully read.");
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
    console.log("Updating table with data:", stationData);

    if (stationData.length === 0) {
        console.warn("No data available to display.");
        return;
    }

    const tbody = document.querySelector('#renewalsTable tbody');
    tbody.innerHTML = '';

    stationData.forEach(row => {
        const skuDropdown = document.createElement('select');
        skuDropdown.innerHTML = Object.keys(pricingData).map(sku => `<option value="${sku}">${sku}</option>`).join('');
        
        skuDropdown.addEventListener('change', function () {
            updateRowPricing(this.parentElement.parentElement, this.value);
        });
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row['Org Name'] || ''}</td>
            <td>${row['Station Name'] || ''}</td>
            <td>${row['Model Number'] || ''}</td>
            <td>${row['Station S/N'] || ''}</td>
            <td></td>
            <td class="oneYearCost">N/A</td>
            <td class="threeYearCost">N/A</td>
            <td class="fiveYearCost">N/A</td>
        `;
        
        tr.children[4].appendChild(skuDropdown);
        tbody.appendChild(tr);
    });

    console.log("Table updated successfully.");
}

function updateRowPricing(row, sku) {
    const oneYearCost = pricingData[sku] ? pricingData[sku] * 1 : 'N/A';
    const threeYearCost = pricingData[sku] ? pricingData[sku] * 3 : 'N/A';
    const fiveYearCost = pricingData[sku] ? pricingData[sku] * 5 : 'N/A';

    row.querySelector('.oneYearCost').textContent = oneYearCost;
    row.querySelector('.threeYearCost').textContent = threeYearCost;
    row.querySelector('.fiveYearCost').textContent = fiveYearCost;
}
