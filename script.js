document.getElementById('calculate').addEventListener('click', function() {
    // Input values
    var gasPrice = parseFloat(document.getElementById('gasPrice').value);
    var electricPrice = parseFloat(document.getElementById('electricPrice').value);
    
    var vehicle1Type = document.getElementById('vehicle1Type').value;
    var vehicle2Type = document.getElementById('vehicle2Type').value;

    var vehicle1Efficiency = parseFloat(document.getElementById('vehicle1Efficiency').value);
    var vehicle2Efficiency = parseFloat(document.getElementById('vehicle2Efficiency').value);

    // Unused inputs
    var milesYear = parseFloat(document.getElementById('milesYear').value);
    var yearsOwnership = parseFloat(document.getElementById('yearsOwnership').value);

    // Calculate MPGe if the vehicle is electric
    if (vehicle1Type === 'electric') {
        vehicle1Efficiency = (vehicle1Efficiency/(electricPrice/gasPrice)).toFixed(2); // Use the calculated electricCarMPGe value
    }
    if (vehicle2Type === 'electric') {
        vehicle2Efficiency = (vehicle2Efficiency/(electricPrice/gasPrice)).toFixed(2); // Use the calculated electricCarMPGe value
    }

    // Set the color based on the type of vehicle
    var vehicle1Color = vehicle1Type === 'electric' ? '#72b644' : '#f26937';
    var vehicle2Color = vehicle2Type === 'electric' ? '#72b644' : '#f26937';

    // Update the chart colors
    chart.updateOptions({
        colors: [vehicle1Color, vehicle2Color]
    });

    // Update the chart data with the new efficiency values
    chart.updateSeries([{
        data: [vehicle1Efficiency, vehicle2Efficiency]
    }]);

});


