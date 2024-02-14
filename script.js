function calculateMPGe() {
    const gasPrice = parseFloat(document.getElementById('gasPrice').value);
    const electricPrice = parseFloat(document.getElementById('electricPrice').value);
    const gasMPG = parseFloat(document.getElementById('gasMPG').value);
    const electricMiPerkWh = parseFloat(document.getElementById('electricMiPerkWh').value);

    // Calculate the cost to drive an electric car 1 mile
    const electricCostPerMile = electricPrice / electricMiPerkWh;

    // Calculate the equivalent MPG for the electric car
    const electricCarMPGe = gasPrice / electricCostPerMile;

    const resultElement = document.getElementById('result');
    resultElement.innerText = `The electric car has an equivalent MPG of ${electricCarMPGe.toFixed(2)} MPGe`;
    resultElement.style.display = 'block';
}


