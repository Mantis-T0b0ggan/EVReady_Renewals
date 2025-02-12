document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded.");
    document.getElementById("processButton").addEventListener("click", processFiles);
    fetchPricingData();
});

function fetchPricingData() {
    const pricingFileUrl = 'https://raw.githubusercontent.com/YOUR_GITHUB_USERNAME/EVReady_Renewals/main/CP_Cloudprices_Dec24.xlsx';
    
    fetch(pricingFileUrl)
        .then(response => response.blob())
        .then(blob => {
            const reader = new FileReader();
            reader.onload = function (e) {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const pricingList = XLSX.utils.sheet_to_json(sheet);
                
                pricingData = {};
                pricingList.forEach(row => {
                    if (row['Order Code'] && row['USD List Price']) {
                        pricingData[row['Order Code'].trim()] = parseFloat(row['USD List Price']);
                    }
                });
                console.log("Pricing data loaded:", pricingData);
            };
            reader.readAsArrayBuffer(blob);
        })
        .catch(error => console.error("Error fetching pricing data:", error));
}

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
let pricingData = {};

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
            <td class="skuPrice">N/A</td>
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
    const price = pricingData[sku] ? pricingData[sku] : 'N/A';
    const oneYearCost = price !== 'N/A' ? price * 1 : 'N/A';
    const threeYearCost = price !== 'N/A' ? price * 3 : 'N/A';
    const fiveYearCost = price !== 'N/A' ? price * 5 : 'N/A';

    row.querySelector('.skuPrice').textContent = price.toFixed(2);
    row.querySelector('.oneYearCost').textContent = oneYearCost.toFixed(2);
    row.querySelector('.threeYearCost').textContent = threeYearCost.toFixed(2);
    row.querySelector('.fiveYearCost').textContent = fiveYearCost.toFixed(2);
}
