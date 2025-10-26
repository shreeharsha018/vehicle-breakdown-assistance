document.addEventListener("DOMContentLoaded", function() {
    const problemData = {
       "flat-tire": `
    <h3>Flat Tire</h3>
    <ol>
        <li><a href="https://youtu.be/JBf7iExWp8Q?si=yPfQt75LY6B0TX1T" target="_blank">A flat tire can be fixed temporarily using a spare tire or a tire repair kit. First, safely pull over and use a jack to lift the vehicle. Remove the flat tire and replace it with the spare, tightening the lug nuts securely. If using a repair kit, follow the instructions to seal the puncture. To prevent future flats, regularly inspect your tires for proper inflation, tread wear, and any damage. Keep the tires rotated and balanced every 5,000 to 8,000 miles, and replace them when the tread depth is below 2/32 of an inch. Keeping a tire pressure monitoring system can also help you stay ahead of potential issues.</a></li>
    </ol>
`,
"dead-battery": `
    <h3>Dead Battery</h3>
    <ol>
        <li><a href="https://youtu.be/OiYzmVhgm2s?si=U9nIKrFsMrD-Hh26" target="_blank">A dead battery can be revived by jump-starting with another vehicle or a portable battery jumper. Connect the positive and negative terminals correctly and start the engine of the working vehicle, then your car. Drive for at least 20 minutes to recharge the battery. If it doesn’t hold a charge, have the battery and alternator tested at an auto parts store. To prevent this issue, ensure battery terminals are clean and connections are tight. Regularly check the battery’s health and replace it every 3-5 years. Avoid leaving lights or electronics on when the engine is off.</a></li>
    </ol>
`,
"engine-overheating": `
    <h3>Engine Overheating</h3>
    <ol>
        <li><a href="https://youtu.be/Gz8116snAaw?si=4AqHZPg0kjkbh19i" target="_blank">Engine overheating requires immediate action: stop driving, let the engine cool, and check the coolant level. Refill if it's low, and inspect for leaks in the radiator or hoses. Ensure the radiator fans are operational. Preventive measures include regular maintenance of the cooling system, such as flushing the radiator, replacing hoses, and using the correct coolant mix. Avoid heavy loads and high speeds, especially in hot weather. Monitoring the temperature gauge and addressing any issues promptly can prevent severe engine damage.</a></li>
    </ol>
`,
"chain-issues": `
    <h3>Chain Issues</h3>
    <ol>
        <li><a href="https://youtu.be/VBRffCgdUNM?si=gDuev_b9x5WEWq3h" target="_blank">Chain issues, common in motorcycles or bicycles, require regular inspection and maintenance. If the chain is loose or making noise, adjust the tension according to the manufacturer's specifications. Clean the chain regularly to remove dirt and debris, and lubricate it with the appropriate chain oil to ensure smooth operation. Replace the chain if it shows signs of excessive wear or damage. Ensuring the sprockets are in good condition and properly aligned can also prevent chain problems and extend its lifespan.</a></li>
    </ol>
`,
"fuel-issues": `
    <h3>Fuel Issues</h3>
    <ol>
        <li><a href="https://youtu.be/nzwx8H_7jnA?si=3CmdY1Z1DSThvY2L" target="_blank">Fuel issues can range from a clogged fuel filter to a failing fuel pump. If the engine sputters or loses power, check the fuel filter first and replace it if necessary. For fuel pump problems, test the fuel pressure and replace the pump if the pressure is low. Keeping your fuel tank at least a quarter full helps prevent debris from clogging the filter and reduces strain on the pump. Using high-quality fuel and regularly cleaning the fuel system can prevent many common fuel-related problems.</a></li>
    </ol>
`,
"electrical-problems": `
    <h3>Electrical Problems</h3>
    <ol>
        <li><a href="https://youtu.be/OJUrEnZNeJg?si=Yfg_9q6P2IatLNgc" target="_blank">Electrical problems can manifest as malfunctioning lights, power windows, or stereo systems. Start by checking the fuses and replacing any that are blown. Inspect wiring for damage or loose connections and repair as needed. Test the battery and alternator to ensure they are providing proper voltage. Regular maintenance of the electrical system, including cleaning battery terminals and ensuring all connections are tight, can prevent many issues. For persistent problems, seek professional diagnostic services to pinpoint and fix the underlying cause.</a></li>
    </ol>
`,
"braking-issues": `
    <h3>Braking Issues</h3>
    <ol>
        <li><a href="https://youtu.be/6DoX5Ve1Oiw?si=M7IOj90QFUaoZnAu" target="_blank">Braking issues, such as squeaking or reduced braking power, often stem from worn brake pads or low brake fluid. Inspect the brake pads and replace them if they are worn. Check the brake fluid level and top it off if necessary. If the brakes feel spongy, there might be air in the brake lines, which requires bleeding the brakes. Regularly check the condition of the brake rotors and calipers. Promptly addressing any abnormalities in the braking system ensures reliable performance and safety.</a></li>
    </ol>
`,
"clutch-problems": `
    <h3>Clutch Problems</h3>
    <ol>
        <li><a href="https://youtu.be/2owO_GhYjzE?si=3uuy0gtSL9L0n6wt" target="_blank">Clutch problems can cause difficulty in changing gears or a slipping clutch. If the clutch pedal feels spongy or stiff, check the clutch fluid level and top it off if necessary. Inspect the clutch cable for any signs of wear and adjust or replace it if needed. For hydraulic clutches, ensure there are no leaks in the system. If the clutch is slipping, it might need to be replaced. Regular maintenance and prompt attention to any changes in clutch performance can prevent major issues.</a></li>
    </ol>
`,
"exhaust-problems": `
    <h3>Exhaust Problems</h3>
    <ol>
        <li><a href="https://youtu.be/iFrUiwQO7_4?si=w0wacFz_yq5g5G2U" target="_blank">Exhaust problems can lead to increased noise, decreased fuel efficiency, and harmful emissions. Inspect the exhaust system for rust, holes, or loose connections. Replace any damaged components, such as the muffler or catalytic converter. Regularly check the exhaust hangers to ensure the system is securely attached to the vehicle. Using high-quality fuel and keeping the engine in good condition can reduce the likelihood of exhaust system problems. Addressing exhaust issues promptly can improve performance and reduce environmental impact.</a></li>
    </ol>
`,
"suspension-issues": `
    <h3>Suspension Issues</h3>
    <ol>
        <li><a href="https://youtu.be/TFqhpvzdI8Q?si=KluvmcgZWu1tnu5m" target="_blank">Suspension issues can cause a bumpy ride, poor handling, or uneven tire wear. Inspect the suspension components, such as shocks, struts, and springs, for signs of wear or damage. Replace any worn parts to restore proper function. Check the alignment and balance of the wheels to ensure even tire wear and smooth handling. Regularly inspecting and maintaining the suspension system can prevent major issues and ensure a comfortable and safe driving experience. Keeping the suspension in good condition also helps to protect other components of the vehicle from excessive wear.</a></li>
    </ol>
`
};

document.querySelectorAll('tbody tr').forEach(row => {
    row.addEventListener('click', function() {
        const problem = this.getAttribute('data-problem');
        document.getElementById('solution-text').innerHTML = problemData[problem];
        document.getElementById('solution-container').style.display = 'block';
    });
});
});
