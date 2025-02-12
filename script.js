<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EVReady Renewals</title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.2/xlsx.full.min.js"></script>
    <script src="script.js"></script>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h2>Upload Your Files</h2>
    
    <label for="stationFile">Upload Station Data (Excel):</label>
    <input type="file" id="stationFile" accept=".xls,.xlsx">
    
    <label for="pricingFile">Upload Pricing Data (Excel):</label>
    <input type="file" id="pricingFile" accept=".xls,.xlsx">
    
    <button onclick="processFiles()">Process Files</button>
    
    <h2>Renewal Cost Table</h2>
    <table id="renewalsTable">
        <thead>
            <tr>
                <th>Org Name</th>
                <th>Station Name</th>
                <th>Model Number</th>
                <th>Station S/N</th>
                <th>1-Year Cost</th>
                <th>3-Year Cost</th>
                <th>5-Year Cost</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
</body>
</html>

