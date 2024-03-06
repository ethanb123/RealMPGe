document.getElementById('calculate').addEventListener('click', function() {
    // Read input values
    var gasPrice = parseFloat(document.getElementById('gasPrice').value);
    var electricPrice = parseFloat(document.getElementById('electricPrice').value);
    var milesYear = parseFloat(document.getElementById('milesYear').value);
    var yearsOwnership = parseFloat(document.getElementById('yearsOwnership').value);
    
    var vehicle1Type = document.getElementById('vehicle1Type').value;
    var vehicle1Efficiency = parseFloat(document.getElementById('vehicle1Efficiency').value);
    
    var vehicle2Type = document.getElementById('vehicle2Type').value;
    var vehicle2Efficiency = parseFloat(document.getElementById('vehicle2Efficiency').value);
    
    // Calculate electric cost per mile
    var electricCostPerMile = (vehicle1Type === 'electric') 
        ? electricPrice / vehicle1Efficiency 
        : electricPrice / vehicle2Efficiency;

    // Calculate MPG equivalent for electric vehicle
    var electricCarMPGe = gasPrice / electricCostPerMile;

    // Update the output
    document.getElementById('mpgEquivalent').innerText = 'Electric Car MPGe: ' + electricCarMPGe.toFixed(2);

    // TODO: Implement graph comparison logic here
    
});


