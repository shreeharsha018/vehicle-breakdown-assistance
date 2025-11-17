document.addEventListener("DOMContentLoaded", function() {
    const problemData = {
    "engine-overheating": `
    <h3>Engine Overheating</h3>
    <p>Stop driving immediately to avoid severe engine damage. Allow the engine to cool completely before checking coolant levels. Refill with the appropriate coolant and check radiator, hoses, and fans for leaks or failure.</p>
    <p>Flush the cooling system regularly, maintain proper coolant levels, and ensure the thermostat operates correctly to prevent overheating.</p>
    <a class="solution-button" href="https://youtu.be/lBslHMW8i_Y?si=-H9I-Cd6HM-HgjEV" target="_blank" rel="noopener noreferrer">Watch Solution</a>
`,
    "dead-battery": `
    <h3>Dead Battery</h3>
    <p>Try jump-starting with another vehicle or a portable battery jumper. If the car starts, drive it for at least 20 minutes to recharge the battery. Clean battery terminals for corrosion and ensure tight connections.</p>
    <p>Regularly test the battery and alternator, replace the battery every 3-5 years, and keep terminals clean to prevent battery drain and failure.</p>
    <a class="solution-button" href="https://youtu.be/VdnkRQF5Cps?si=FW8Sif6Q5JHFw7tF" target="_blank" rel="noopener noreferrer">Watch Solution</a>
`,
    "flat-tire": `
    <h3>Flat Tire</h3>
    <p>Pull over safely and use a spare tire or repair kit for temporary fixing. Inspect for punctures or debris causing the flat. Check tire pressure and condition regularly.</p>
    <p>Rotate tires every 5,000-8,000 miles, maintain proper inflation, and replace tires when tread depth drops below 2/32 of an inch for safety.</p>
    <a class="solution-button" href="https://youtu.be/Bq5To-ZH160?si=wTHyuSJFov1lTmHx" target="_blank" rel="noopener noreferrer">Watch Solution</a>
`,
    "brake-issues": `
    <h3>Brake Issues</h3>
    <p>Inspect brake pads for wear and replace if necessary. Check brake fluid level and top off if low. If brakes feel spongy, air may be in the brake lines requiring a bleed procedure.</p>
    <p>Replace worn brake pads promptly, maintain proper brake fluid levels, and test braking power regularly for safe and reliable stopping.</p>
    <a class="solution-button" href="https://youtu.be/9CAlqxXv_I8?si=W1sa8MHTkyt1pVW8" target="_blank" rel="noopener noreferrer">Watch Solution</a>
`,
    "transmission-problems": `
    <h3>Transmission Problems</h3>
    <p>Check transmission fluid level and quality, replacing if dirty or low. Inspect for slipping gears or rough shifting. Test for proper operation and gear engagement.</p>
    <p>Service transmission fluid regularly, include filter replacements, and address abnormal sounds or shifting problems immediately to prevent costly damage.</p>
    <a class="solution-button" href="https://youtu.be/WjNbeInU6-4?si=BPA7Fa4gFOrOErkc" target="_blank" rel="noopener noreferrer">Watch Solution</a>
`,
    "alternator-failure": `
    <h3>Alternator Failure</h3>
    <p>Check for symptoms like dim lights, battery drain, or electrical malfunctions. Test the alternator's output with a voltmeter. If it's not producing correct voltage, replacement may be necessary.</p>
    <p>Inspect the alternator belt regularly for wear, ensure clean connections, and replace the alternator every 100,000-150,000 miles to prevent unexpected failures.</p>
    <a class="solution-button" href="https://youtu.be/XC8W9RHGTMI?si=i8PvedtRaGeyKQsi" target="_blank" rel="noopener noreferrer">Watch Solution</a>
`,
    "faulty-spark-plugs": `
    <h3>Faulty Spark Plugs</h3>
    <p>Worn or fouled spark plugs cause engine misfires, rough running, or poor fuel economy. Inspect plugs and replace any that are worn or covered in deposits. Set gaps to factory specifications.</p>
    <p>Replace spark plugs every 30,000-50,000 miles with the correct type for your engine. Proper gaps ensure optimal combustion and engine performance.</p>
    <a class="solution-button" href="https://youtu.be/OQtoRWB-Lhg?si=hy-eVm5mN04rWIOJ" target="_blank" rel="noopener noreferrer">Watch Solution</a>
`,
    "radiator-leaks": `
    <h3>Radiator Leaks</h3>
    <p>Inspect for coolant puddles under the vehicle. Check radiator and hoses for cracks or damage. Seal small leaks temporarily with sealant, but replace damaged components permanently.</p>
    <p>Flush the radiator regularly, use the correct coolant mix, and replace hoses when they become brittle to prevent leaks and overheating.</p>
    <a class="solution-button" href="https://youtu.be/2VhPSU7-Zy0?si=r6W4ZNCXmm7NtzgB" target="_blank" rel="noopener noreferrer">Watch Solution</a>
`,
    "fuel-pump-failure": `
    <h3>Fuel Pump Failure</h3>
    <p>A failing fuel pump causes sputtering, loss of power, or difficulty starting. Test fuel pressure with a gauge. If pressure is low or zero, the pump may need replacement.</p>
    <p>Keep fuel tank at least a quarter full to cool the pump, replace fuel filters regularly, and maintain proper fuel pressure for reliable engine operation.</p>
    <a class="solution-button" href="https://youtu.be/mDIlwbx0B-s?si=h65f5i1UWzNmEmuY" target="_blank" rel="noopener noreferrer">Watch Solution</a>
`,
    "electrical-problems": `
    <h3>Electrical Problems</h3>
    <p>Check fuses and replace any that are blown. Inspect wiring for damage or loose connections. Test battery voltage and charging system for proper operation.</p>
    <p>Keep battery terminals clean, secure all electrical connections with dielectric grease, and perform regular electrical system checks to prevent malfunctions.</p>
    <a class="solution-button" href="https://youtu.be/BcGT1bNrsAM?si=kEVbglAB-TKfQG74" target="_blank" rel="noopener noreferrer">Watch Solution</a>
`
    };
    function showSolution(problemId) {
        document.getElementById('solution-content').innerHTML = problemData[problemId];
        document.getElementById('solution-container').style.display = 'block';
        document.getElementById('solution-container').scrollIntoView({ behavior: 'smooth' });
    }
    window.showSolution = showSolution;
});
