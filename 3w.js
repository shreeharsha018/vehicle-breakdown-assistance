document.addEventListener("DOMContentLoaded", function() {
    const problemData = {
    "engine-starting": `
    <h3>Engine Starting Problems</h3>
    <p>Check battery terminals for corrosion and ensure a tight connection. Test battery voltage with a multimeter and clean or replace spark plugs if fouled. Verify fuel flow and inspect the ignition system for proper operation.</p>
    <p>Keep the fuel tank at least a quarter full, maintain battery terminals, and replace spark plugs annually for reliable starting.</p>
    <a class="solution-button" href="https://youtu.be/lBslHMW8i_Y?si=-H9I-Cd6HM-HgjEV" target="_blank" rel="noopener noreferrer">Watch Solution</a>
`,
    "brake-issues": `
    <h3>Brake Issues</h3>
    <p>Inspect brake fluid level and top up if needed. Check brake pads for wear, bleed air from brake lines, and examine brake rotors for damage or excessive wear.</p>
    <p>Replace worn brake pads promptly, maintain proper brake fluid levels, and test brakes regularly for optimal stopping power.</p>
    <a class="solution-button" href="https://youtu.be/VdnkRQF5Cps?si=FW8Sif6Q5JHFw7tF" target="_blank" rel="noopener noreferrer">Watch Solution</a>
`,
    "transmission": `
    <h3>Transmission Problems</h3>
    <p>Check transmission fluid level and condition, adjusting or replacing as needed. Inspect clutch cable tension and examine clutch plates for wear or glazing.</p>
    <p>Service transmission fluid regularly, keep clutch cables properly adjusted, and address slipping or grinding sounds immediately to prevent costly repairs.</p>
    <a class="solution-button" href="https://youtu.be/Bq5To-ZH160?si=wTHyuSJFov1lTmHx" target="_blank" rel="noopener noreferrer">Watch Solution</a>
`,
    "electrical": `
    <h3>Electrical Problems</h3>
    <p>Test battery terminals for corrosion and tightness. Check alternator output with a multimeter and inspect wiring for damage or loose connections. Replace blown fuses or faulty relays.</p>
    <p>Maintain clean battery terminals with dielectric grease, test the charging system regularly, and secure all electrical connections to prevent failures.</p>
    <a class="solution-button" href="https://youtu.be/9CAlqxXv_I8?si=W1sa8MHTkyt1pVW8" target="_blank" rel="noopener noreferrer">Watch Solution</a>
`,
    "suspension": `
    <h3>Suspension Problems</h3>
    <p>Inspect shock absorbers and springs for leaks or damage. Check suspension bushings and control arms for wear, and ensure wheel alignment is correct.</p>
    <p>Replace worn shocks and springs promptly, maintain proper wheel alignment, and rotate tires regularly to prevent suspension damage and uneven wear.</p>
    <a class="solution-button" href="https://youtu.be/WjNbeInU6-4?si=BPA7Fa4gFOrOErkc" target="_blank" rel="noopener noreferrer">Watch Solution</a>
`,
    "overheating": `
    <h3>Overheating Problems</h3>
    <p>Shut down the engine immediately and allow it to cool. Check coolant level and top up with the correct coolant mix. Inspect radiator, hoses, and thermostat for leaks or failures.</p>
    <p>Flush the cooling system on schedule, maintain proper coolant levels, and inspect fans for proper operation to prevent engine damage.</p>
    <a class="solution-button" href="https://youtu.be/XC8W9RHGTMI?si=i8PvedtRaGeyKQsi" target="_blank" rel="noopener noreferrer">Watch Solution</a>
`,
    "fuel-system": `
    <h3>Fuel System Problems</h3>
    <p>Inspect fuel filter for clogs and replace if necessary. Check fuel pump operation and fuel pressure regulator function. Drain stale fuel if misfires or hesitation occurs.</p>
    <p>Use fresh fuel, keep the tank above a quarter full, and replace fuel filters regularly to ensure steady fuel flow and prevent pump strain.</p>
    <a class="solution-button" href="https://youtu.be/OQtoRWB-Lhg?si=hy-eVm5mN04rWIOJ" target="_blank" rel="noopener noreferrer">Watch Solution</a>
`,
    "exhaust-system": `
    <h3>Exhaust System Problems</h3>
    <p>Locate leaks with a cold engine start and inspect exhaust manifold, gaskets, and muffler for cracks or rust. Replace damaged components and tighten clamps securely.</p>
    <p>Monitor exhaust system for noise or leaks regularly, replace worn gaskets promptly, and ensure proper hangers are in place to reduce vibration.</p>
    <a class="solution-button" href="https://youtu.be/2VhPSU7-Zy0?si=r6W4ZNCXmm7NtzgB" target="_blank" rel="noopener noreferrer">Watch Solution</a>
`,
    "steering": `
    <h3>Steering Problems</h3>
    <p>Check power steering fluid level and top up if necessary. Inspect steering pump, gearbox, and tie rod ends for wear or damage. Test for proper steering response and alignment.</p>
    <p>Maintain power steering fluid levels, inspect steering components regularly, and align the steering system to ensure responsive and safe handling.</p>
    <a class="solution-button" href="https://youtu.be/mDIlwbx0B-s?si=h65f5i1UWzNmEmuY" target="_blank" rel="noopener noreferrer">Watch Solution</a>
`,
    "battery-drain": `
    <h3>Battery Draining Quickly</h3>
    <p>Test the battery under load with a multimeter and check alternator output for proper charging. Use a multimeter to identify parasitic electrical draws from faulty components.</p>
    <p>Clean battery terminals regularly, inspect for malfunctioning electrical components, and test the charging system to prevent unexpected battery drain.</p>
    <a class="solution-button" href="https://youtu.be/BcGT1bNrsAM?si=kEVbglAB-TKfQG74" target="_blank" rel="noopener noreferrer">Watch Solution</a>
`
    };
    document.querySelectorAll('tbody tr').forEach(row => {
        row.addEventListener('click', function() {
            const index = Array.from(row.parentNode.children).indexOf(row);
            const problems = ["engine-starting", "brake-issues", "transmission", "electrical", "suspension", "overheating", "fuel-system", "exhaust-system", "steering", "battery-drain"];
            const problem = problems[index];
            document.getElementById('solution-text').innerHTML = problemData[problem];
            document.getElementById('solution-container').style.display = 'block';
            document.getElementById('solution-container').scrollIntoView({ behavior: 'smooth' });
        });
    });
});
