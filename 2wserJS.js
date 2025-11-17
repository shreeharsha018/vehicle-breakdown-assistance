document.addEventListener("DOMContentLoaded", function() {
    const problemData = {
    "flat-tire": `
    <h3>Flat Tire</h3>
    <p>Move to a safe spot, lift the bike, plug the puncture or swap the tube, and torque the wheel evenly before riding away.</p>
    <p>Ride with proper pressure, inspect tread weekly, and keep a compact repair kit onboard.</p>
    <a class="solution-button" href="https://youtu.be/JBf7iExWp8Q?si=yPfQt75LY6B0TX1T" target="_blank" rel="noopener noreferrer">Watch Solution</a>
`,
    "dead-battery": `
    <h3>Dead Battery</h3>
    <p>Jump-start using a charged battery or booster pack, match terminals correctly, and idle for 20 minutes to recover charge.</p>
    <p>Clean clamps, test charging voltage, and replace cells older than three years.</p>
    <a class="solution-button" href="https://youtu.be/OiYzmVhgm2s?si=U9nIKrFsMrD-Hh26" target="_blank" rel="noopener noreferrer">Watch Solution</a>
`,
    "engine-overheating": `
    <h3>Engine Overheating</h3>
    <p>Shut the engine down, cool it completely, top coolant to the fill line, and inspect hoses, caps, and fans for leaks or failure.</p>
    <p>Flush the system on schedule and avoid heavy loads in slow traffic.</p>
    <a class="solution-button" href="https://youtu.be/Gz8116snAaw?si=4AqHZPg0kjkbh19i" target="_blank" rel="noopener noreferrer">Watch Solution</a>
`,
    "chain-issues": `
    <h3>Chain Issues</h3>
    <p>Adjust slack to manufacturer specs, clean with kerosene, and lubricate hot to seat grease between rollers.</p>
    <p>Replace chains and sprockets together when teeth hook or links bind.</p>
    <a class="solution-button" href="https://youtu.be/VBRffCgdUNM?si=gDuev_b9x5WEWq3h" target="_blank" rel="noopener noreferrer">Watch Solution</a>
`,
    "fuel-issues": `
    <h3>Fuel Issues</h3>
    <p>Swap clogged filters, test pump pressure, and drain stale fuel if misfires or hesitation persist.</p>
    <p>Use fresh fuel, keep tanks above a quarter, and add cleaner every few months.</p>
    <a class="solution-button" href="https://youtu.be/nzwx8H_7jnA?si=3CmdY1Z1DSThvY2L" target="_blank" rel="noopener noreferrer">Watch Solution</a>
`,
    "electrical-problems": `
    <h3>Electrical Problems</h3>
    <p>Check fuses, trace wiring for corrosion, and verify battery and stator output with a multimeter.</p>
    <p>Secure grounds and protect connectors with dielectric grease.</p>
    <a class="solution-button" href="https://youtu.be/OJUrEnZNeJg?si=Yfg_9q6P2IatLNgc" target="_blank" rel="noopener noreferrer">Watch Solution</a>
`,
    "braking-issues": `
    <h3>Braking Issues</h3>
    <p>Inspect pad thickness, bleed air from lines, and top the master cylinder with the specified DOT fluid.</p>
    <p>Measure rotor runout and service seized caliper pins promptly.</p>
    <a class="solution-button" href="https://youtu.be/6DoX5Ve1Oiw?si=M7IOj90QFUaoZnAu" target="_blank" rel="noopener noreferrer">Watch Solution</a>
`,
    "clutch-problems": `
    <h3>Clutch Problems</h3>
    <p>Adjust cable free play, bleed hydraulic systems, and inspect friction plates for glazing if slipping occurs.</p>
    <p>Lubricate pivot points and renew clutch springs when engagement weakens.</p>
    <a class="solution-button" href="https://youtu.be/2owO_GhYjzE?si=3uuy0gtSL9L0n6wt" target="_blank" rel="noopener noreferrer">Watch Solution</a>
`,
    "exhaust-problems": `
    <h3>Exhaust Problems</h3>
    <p>Locate leaks with a cold start, replace gaskets, and tighten clamps or weld cracked sections.</p>
    <p>Monitor backpressure after upgrades to protect engine tuning.</p>
    <a class="solution-button" href="https://youtu.be/iFrUiwQO7_4?si=w0wacFz_yq5g5G2U" target="_blank" rel="noopener noreferrer">Watch Solution</a>
`,
    "suspension-issues": `
    <h3>Suspension Issues</h3>
    <p>Check fork seals for oil rings, set sag with correct preload, and replace leaking shocks.</p>
    <p>Align wheels and balance tires to prevent chatter.</p>
    <a class="solution-button" href="https://youtu.be/TFqhpvzdI8Q?si=KluvmcgZWu1tnu5m" target="_blank" rel="noopener noreferrer">Watch Solution</a>
`,
    "spark-plug-issues": `
    <h3>Spark Plug Issues</h3>
    <p>Remove plugs with a cool engine, inspect gaps, clean or replace fouled tips, and torque to spec.</p>
    <p>Use the heat range listed in the manual and retest ignition timing.</p>
    <a class="solution-button" href="https://www.youtube.com/watch?v=52UmlOGAjK8" target="_blank" rel="noopener noreferrer">Watch Solution</a>
`,
    "ignition-failure": `
    <h3>Ignition Failure</h3>
    <p>Verify kill switch, test ignition switch continuity, and confirm spark at each coil lead.</p>
    <p>Clean corroded connectors and replace damaged barrels or switches.</p>
    <a class="solution-button" href="https://www.youtube.com/watch?v=BALdGha_4So" target="_blank" rel="noopener noreferrer">Watch Solution</a>
`,
    "oil-leak": `
    <h3>Oil Leak</h3>
    <p>Degrease the engine, trace the seep with UV dye, and renew gaskets or seals where oil appears.</p>
    <p>Torque covers evenly and use manufacturer-approved sealant sparingly.</p>
    <a class="solution-button" href="https://www.youtube.com/watch?v=J6Pb0EpN5Hg" target="_blank" rel="noopener noreferrer">Watch Solution</a>
`,
    "throttle-response-problems": `
    <h3>Poor Throttle Response</h3>
    <p>Inspect cable slack, sync carbs or balance throttle bodies, and clean idle jets to remove lag.</p>
    <p>Replace clogged air filters and reset ECU trims if required.</p>
    <a class="solution-button" href="https://www.youtube.com/watch?v=FQJSS3RhDqw" target="_blank" rel="noopener noreferrer">Watch Solution</a>
`,
    "starter-motor-failure": `
    <h3>Starter Motor Failure</h3>
    <p>Test battery voltage under load, check solenoid continuity, and bench-test the starter for slow rotation.</p>
    <p>Clean commutators, replace worn brushes, or fit a new starter where necessary.</p>
    <a class="solution-button" href="https://www.youtube.com/watch?v=hlClh8n1e-4" target="_blank" rel="noopener noreferrer">Watch Solution</a>
`
};
document.querySelectorAll('tbody tr').forEach(row => {
    row.addEventListener('click', function() {
        const problem = this.getAttribute('data-problem');
        document.getElementById('solution-text').innerHTML = problemData[problem];
        document.getElementById('solution-container').style.display = 'block';
        document.getElementById('solution-container').scrollIntoView({ behavior: 'smooth' });
    });
});
});
