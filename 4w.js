const solutions = {
    'engine-overheating': `
        <ol>
            <li><a href="https://youtu.be/lBslHMW8i_Y?si=-H9I-Cd6HM-HgjEV" target="_blank">Overheating can occur due to a malfunctioning radiator, a broken water pump, or low coolant levels. When your engine overheats, it’s crucial to stop driving immediately to avoid severe damage. Wait for the engine to cool before checking the coolant level. If it's low, refill with the appropriate coolant. Ensure the radiator fans are working and check for any leaks in the cooling system. Regularly maintaining the cooling system, including flushing the radiator and replacing hoses, can prevent this issue.</a></li>
        </ol>
    `,
    'dead-battery': `
        <ol>
            <li><a href="https://youtu.be/VdnkRQF5Cps?si=FW8Sif6Q5JHFw7tF" target="_blank"></a>xA dead battery is often caused by leaving lights on, a faulty alternator, or an old battery. If your car won't start, try jump-starting it with another vehicle or a portable battery jumper. If the car starts, drive it for at least 20 minutes to recharge the battery. If it doesn’t hold a charge, test the battery and alternator at an auto parts store. Regularly checking the battery terminals for corrosion and ensuring a tight connection can help avoid this problem. Replacing the battery every 3-5 years is also recommended.</li>
            
        </ol>
    `,
    'flat-tire': `
        <ol>
            <li><a href="https://youtu.be/Bq5To-ZH160?si=wTHyuSJFov1lTmHx" target="_blank">A flat tire can be caused by punctures, improper inflation, or wear and tear. If you experience a flat tire, pull over safely and use a spare tire or a tire repair kit to fix it temporarily. Check for the cause of the flat, such as nails or other debris. To prevent flats, regularly inspect tires for proper inflation, tread wear, and any damage. Rotate your tires every 5,000 to 8,000 miles and replace them when the tread depth is below 2/32 of an inch.</a></li>
        </ol>
    `,
    'brake-issues': `
         <ol>
            <li><a href="https://youtu.be/9CAlqxXv_I8?si=W1sa8MHTkyt1pVW8" target="_blank">Brake problems, such as squeaking or reduced braking power, can be due to worn brake pads, low brake fluid, or damaged rotors. If you notice any issues, inspect the brake pads for wear and replace them if necessary. Check the brake fluid level and top it off if it's low. If the brakes feel spongy, there might be air in the brake lines, which requires bleeding the brakes. Regular brake maintenance and prompt attention to any abnormalities can ensure your braking system remains reliable.</a></li>
        </ol>
    `,
    'transmission-problems': `
        <ol>
            <li><a href="https://youtu.be/WjNbeInU6-4?si=BPA7Fa4gFOrOErkc" target="_blank">Transmission issues, such as slipping gears or rough shifting, can stem from low transmission fluid, worn-out clutches, or faulty sensors. If you notice these problems, check the transmission fluid level and quality. Refill or replace the fluid if it's low or dirty. For more serious issues, a mechanic might need to inspect the transmission system. Regularly servicing the transmission, including fluid changes and filter replacements, can help prevent major issues.</a></li>
        </ol>
    `,
    'alternator-failure': `
         <ol>
            <li><a href="https://youtu.be/XC8W9RHGTMI?si=i8PvedtRaGeyKQsi" target="_blank">A failing alternator can cause the battery to drain quickly, dim lights, or electrical malfunctions. If your car shows these symptoms, test the alternator’s output with a voltmeter. If it's not producing the correct voltage, it might need replacing. Regularly inspecting the alternator belt for wear and ensuring a clean connection can prolong the alternator’s life. Replacing the alternator every 100,000 to 150,000 miles can prevent unexpected failures.</a></li>
        </ol>
    `,
    'faulty-spark-plugs': `
         <ol>
            <li><a href="https://youtu.be/OQtoRWB-Lhg?si=hy-eVm5mN04rWIOJ" target="_blank">Worn or dirty spark plugs can cause engine misfires, poor fuel economy, or difficulty starting the car. If your engine runs rough, inspect the spark plugs and replace any that are worn or covered in deposits. Using the correct type of spark plug for your engine and changing them every 30,000 to 50,000 miles can maintain optimal engine performance. Ensuring the spark plug gaps are correctly set during installation is also essential..</a></li>
        </ol>
    `,
    'radiator-leaks': `
         <ol>
            <li><a href="https://youtu.be/2VhPSU7-Zy0?si=r6W4ZNCXmm7NtzgB" target="_blank">Radiator leaks can lead to coolant loss and engine overheating. If you notice coolant puddles under your car, inspect the radiator and hoses for cracks or damage. Seal small leaks with a radiator sealant as a temporary fix, but replace damaged components as soon as possible. Regularly checking the coolant level and maintaining the radiator system can prevent leaks. Flushing the radiator and using the correct coolant mix are also vital maintenance steps.</a></li>
        </ol>
    `,
    'fuel-pump-failure': `
        <ol>
            <li><a href="https://youtu.be/mDIlwbx0B-s?si=h65f5i1UWzNmEmuY" target="_blank">A failing fuel pump can cause engine sputtering, loss of power, or difficulty starting. If your car exhibits these symptoms, test the fuel pressure with a gauge. If the pressure is low, the fuel pump may need replacing. Keeping your fuel tank at least a quarter full can help prevent fuel pump strain. Regularly replacing the fuel filter can also ensure a steady fuel supply to the engine, reducing the risk of pump failure.</a></li>
        </ol>
    `,
    'electrical-problems': `
         <ol>
            <li><a href="https://youtu.be/BcGT1bNrsAM?si=kEVbglAB-TKfQG74" target="_blank">Electrical issues, such as malfunctioning lights, power windows, or stereo systems, can be due to blown fuses, faulty wiring, or a weak battery. If you experience electrical problems, check the car’s fuses and replace any that are blown. Inspect wiring for damage or loose connections. If the problem persists, a professional diagnosis may be necessary. Regularly checking the electrical system and keeping the battery terminals clean can help avoid these issues.</a></li>
        </ol>
    `
};

function showSolution(problemId) {
    document.getElementById('solution-content').innerHTML = solutions[problemId];
}
