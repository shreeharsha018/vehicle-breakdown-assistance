import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

export const fallbackProblemsByVehicle = {
  "2-wheeler": [
    {
      id: "2w-flat-tire",
      title: "Flat Tire",
      vehicleType: "2-wheeler",
      description: "Tyre deflates from punctures or valve damage, causing unstable handling.",
      solutionId: "2w-flat-tire",
      solution: {
        description: "Stabilise the bike, repair the puncture or replace the tube, and inflate to the specified pressure.",
        steps: [
          "Move the motorcycle to a level surface and support it securely on a stand.",
          "Locate the puncture, remove debris, and insert a plug or patch the inner tube.",
          "Reinstall the wheel if removed and inflate to the PSI listed on the swingarm or manual.",
          "Torque axle hardware to spec and perform a slow test ride to confirm sealing."
        ],
        tools: ["Tire repair kit", "Portable inflator", "Torque wrench"],
        precautions: "Do not ride on a fully flat tire; inspect the sidewall for cuts before inflating.",
        videoLink: "https://www.youtube.com/watch?v=eZTM0ehOKPs"
      }
    },
    {
      id: "2w-dead-battery",
      title: "Dead Battery",
      vehicleType: "2-wheeler",
      description: "Starter barely turns or lights dim because the battery cannot supply current.",
      solutionId: "2w-dead-battery",
      solution: {
        description: "Jump-start the motorcycle, verify charging voltage, and replace the battery if it cannot hold a charge.",
        steps: [
          "Connect jumper leads positive to positive and negative to grounded metal, then start the donor source.",
          "Crank the motorcycle briefly and let it idle for at least 20 minutes to replenish charge.",
          "Measure voltage at idle and 5,000 RPM to confirm alternator output between 13.2 and 14.5 volts.",
          "Clean terminals, apply dielectric grease, or replace the battery if readings stay low."
        ],
        tools: ["Jumper cables", "Multimeter", "Dielectric grease"],
        precautions: "Never let clamps touch each other during jump-starting; disconnect in reverse order.",
        videoLink: "https://www.youtube.com/watch?v=fRhQaChx6xk"
      }
    },
    {
      id: "2w-engine-overheat",
      title: "Engine Overheating",
      vehicleType: "2-wheeler",
      description: "Temperature gauge spikes and coolant boils during slow traffic or spirited riding.",
      solutionId: "2w-engine-overheat",
      solution: {
        description: "Shut the engine down, inspect the cooling system, and restore fluid circulation before riding again.",
        steps: [
          "Stop safely, allow the engine to cool, and avoid opening the radiator cap while hot.",
          "Check coolant level, hoses, and radiator cap seal for leaks or deterioration.",
          "Verify fan operation and flush the coolant if it appears rusty or contaminated.",
          "Reassemble and monitor the gauge during a controlled test ride."
        ],
        tools: ["Coolant funnel", "Radiator pressure tester", "Replacement hoses"],
        precautions: "Use manufacturer-approved coolant mix and replace caps that fail a pressure test.",
        videoLink: "https://www.youtube.com/watch?v=6w5L0-YRvFk"
      }
    },
    {
      id: "2w-chain-slippage",
      title: "Chain Slippage",
      vehicleType: "2-wheeler",
      description: "Chain jumps teeth or chatters due to poor tension or worn sprockets.",
      solutionId: "2w-chain-slippage",
      solution: {
        description: "Adjust slack, clean and lubricate the chain, and replace the drive set if wear is excessive.",
        steps: [
          "Measure chain slack midway between sprockets and adjust to the specification in the manual.",
          "Clean the chain with kerosene, dry it thoroughly, and apply chain lube on the warm chain.",
          "Inspect sprocket teeth for hooking or shark-fin shapes and replace the set if present.",
          "Recheck alignment marks and spin the wheel to confirm smooth rotation."
        ],
        tools: ["Chain alignment tool", "Kerosene", "Chain lubricant"],
        precautions: "Always rotate the wheel forward while checking slack to simulate riding load.",
        videoLink: "https://www.youtube.com/watch?v=jQ6AoMAP9yY"
      }
    },
    {
      id: "2w-fuel-delivery",
      title: "Fuel Delivery Issue",
      vehicleType: "2-wheeler",
      description: "Engine sputters or stalls because fuel filter or pump cannot supply flow.",
      solutionId: "2w-fuel-delivery",
      solution: {
        description: "Inspect filters and pump pressure, clean the fuel system, and ensure fresh fuel reaches the injectors or carbs.",
        steps: [
          "Drain stale fuel and refill with high-octane gasoline recommended by the manufacturer.",
          "Replace in-line or in-tank fuel filters and inspect the pump screen for debris.",
          "Attach a pressure gauge to confirm output meets factory specifications.",
          "Add injector or carb cleaner to remove varnish from delivery components."
        ],
        tools: ["Fuel pressure gauge", "Replacement filters", "Fuel system cleaner"],
        precautions: "Work in a well-ventilated area and avoid sparks around open fuel containers.",
        videoLink: "https://www.youtube.com/watch?v=y2TT2F9c8Cc"
      }
    },
    {
      id: "2w-electrical-short",
      title: "Electrical Short",
      vehicleType: "2-wheeler",
      description: "Lights flicker or fuses blow because of corroded connectors or chafed wiring.",
      solutionId: "2w-electrical-short",
      solution: {
        description: "Isolate the failing circuit, repair damaged wiring, and protect connections from moisture.",
        steps: [
          "Check fuse status and identify which circuit repeatedly fails.",
          "Inspect wiring harness sections near the steering head and under the seat for chafing.",
          "Repair breaks with solder and heat-shrink tubing and clean terminals with contact cleaner.",
          "Apply dielectric grease and secure the harness to prevent further rubbing."
        ],
        tools: ["Multimeter", "Soldering iron", "Heat-shrink tubing"],
        precautions: "Disconnect the battery negative terminal before repairing any wiring.",
        videoLink: "https://www.youtube.com/watch?v=JUz0SLOHJ6E"
      }
    },
    {
      id: "2w-brake-fade",
      title: "Brake Fade",
      vehicleType: "2-wheeler",
      description: "Lever feels soft and stopping distance grows because pads or fluid have degraded.",
      solutionId: "2w-brake-fade",
      solution: {
        description: "Service the braking system by replacing fluid, pads, and ensuring calipers move freely.",
        steps: [
          "Inspect pad thickness and rotor glazing; replace components below service limits.",
          "Bleed the brakes with the manufacturer-specified DOT fluid to remove air and moisture.",
          "Clean and lubricate caliper slide pins so pads retract evenly.",
          "Pump the lever to seat pads against the rotor before riding."
        ],
        tools: ["Brake bleeder kit", "Torque wrench", "Brake cleaner"],
        precautions: "Do not spill brake fluid on paint; cover bodywork before bleeding.",
        videoLink: "https://www.youtube.com/watch?v=XeT58rDd2cY"
      }
    },
    {
      id: "2w-clutch-drag",
      title: "Clutch Drag",
      vehicleType: "2-wheeler",
      description: "Gear shifts feel stiff or the bike creeps with the lever fully pulled in.",
      solutionId: "2w-clutch-drag",
      solution: {
        description: "Adjust free play, bleed hydraulic circuits, and renew worn friction components to restore smooth engagement.",
        steps: [
          "Set cable or master-cylinder free play to the guideline in the service manual.",
          "Bleed the clutch hydraulic system to remove air bubbles that hold pressure.",
          "Inspect plates and steels for warping or glazing and replace as a matched set if damaged.",
          "Reassemble with fresh oil of the recommended viscosity."
        ],
        tools: ["Clutch alignment tool", "Feeler gauges", "Torque wrench"],
        precautions: "Soak new friction plates in engine oil for several hours before installation.",
        videoLink: "https://www.youtube.com/watch?v=RCE2IjC5T2w"
      }
    },
    {
      id: "2w-exhaust-leak",
      title: "Exhaust Leak",
      vehicleType: "2-wheeler",
      description: "Exhaust note becomes raspy and backfires due to gaps in joints or cracked pipes.",
      solutionId: "2w-exhaust-leak",
      solution: {
        description: "Locate escaping gases, replace gaskets, and tighten joints to restore correct backpressure.",
        steps: [
          "Start the engine cold and feel for pulses around headers, mid-pipes, and muffler clamps.",
          "Remove components carefully and replace crushed or burnt exhaust gaskets.",
          "Weld or replace cracked sections and reinstall using high-temperature sealant where specified.",
          "Torque fasteners evenly and recheck for leaks after a heat cycle."
        ],
        tools: ["Socket set", "Exhaust gaskets", "High-temp sealant"],
        precautions: "Wear gloves when checking for leaks; surfaces heat quickly even at idle.",
        videoLink: "https://www.youtube.com/watch?v=jWjj5GqPj8o"
      }
    },
    {
      id: "2w-suspension-sag",
      title: "Suspension Sag",
      vehicleType: "2-wheeler",
      description: "Bike feels sloppy or bottoms out because preload and damping are out of balance.",
      solutionId: "2w-suspension-sag",
      solution: {
        description: "Measure sag, adjust preload and damping, and refresh worn fork seals or shock components.",
        steps: [
          "Measure static and rider sag front and rear and compare to target values.",
          "Adjust preload collars or fork caps to bring sag into the recommended range.",
          "Dial in rebound and compression damping to control oscillations.",
          "Replace leaking fork seals or rebuild the shock if damping remains inconsistent."
        ],
        tools: ["Measuring tape", "Spanner wrench", "Fork seal driver"],
        precautions: "Record baseline settings before altering suspension so you can revert if needed.",
        videoLink: "https://www.youtube.com/watch?v=ZDn-eEuUhpU"
      }
    },
    {
      id: "2w-ignition-failure",
      title: "Ignition Failure",
      vehicleType: "2-wheeler",
      description: "Engine cranks but will not fire because the ignition circuit fails to produce spark.",
      solutionId: "2w-ignition-failure",
      solution: {
        description: "Trace the ignition path, test components, and correct wiring or switch faults to restore spark.",
        steps: [
          "Verify the kill switch and side-stand switch are functioning and not cutting spark.",
          "Use a multimeter to test ignition switch continuity and coil primary resistance.",
          "Inspect spark plugs and leads, replacing any that show carbon tracking or cracks.",
          "Repair or replace the ignition switch or CDI if diagnostic values fall outside spec."
        ],
        tools: ["Multimeter", "Spark tester", "Replacement ignition switch"],
        precautions: "Never crank the engine with coils disconnected; it can damage electronic modules.",
        videoLink: "https://www.youtube.com/watch?v=U00uh6p5VC8"
      }
    },
    {
      id: "2w-oil-leak",
      title: "Oil Leak",
      vehicleType: "2-wheeler",
      description: "Oil drips onto the floor or engine cases due to failing seals or gaskets.",
      solutionId: "2w-oil-leak",
      solution: {
        description: "Clean the engine, pinpoint the leak, and replace the faulty gasket or seal with proper torque.",
        steps: [
          "Degrease the engine and run it briefly to identify the first point of oil emergence.",
          "Use UV dye if necessary to trace hidden leaks around seals and gaskets.",
          "Replace the faulty component, applying manufacturer-specified sealant if required.",
          "Torque bolts in a criss-cross pattern and monitor for seepage after a test ride."
        ],
        tools: ["Degreaser", "UV leak-detection kit", "Torque wrench"],
        precautions: "Dispose of oil-soaked rags responsibly and avoid overtightening aluminum covers.",
        videoLink: "https://www.youtube.com/watch?v=IrWS5fqmG38"
      }
    },
    {
      id: "2w-throttle-hesitation",
      title: "Throttle Hesitation",
      vehicleType: "2-wheeler",
      description: "Engine stumbles or lurches during acceleration due to air-fuel imbalance.",
      solutionId: "2w-throttle-hesitation",
      solution: {
        description: "Balance throttle bodies or carburetors, clean idle circuits, and set cables to eliminate slack.",
        steps: [
          "Inspect throttle cables for fraying and adjust free play to the manual specification.",
          "Synchronise carburetors or throttle bodies using a vacuum gauge set.",
          "Clean pilot jets and injectors with appropriate cleaner to remove varnish.",
          "Reset ECU trims or idle speed according to the service guide."
        ],
        tools: ["Vacuum gauge", "Carb cleaner", "Throttle cable lubricator"],
        precautions: "Perform synchronization with the engine at operating temperature to obtain accurate readings.",
        videoLink: "https://www.youtube.com/watch?v=UmgW39oL44M"
      }
    },
    {
      id: "2w-starter-failure",
      title: "Starter Motor Failure",
      vehicleType: "2-wheeler",
      description: "Starter clicks or spins slowly because brushes or solenoid contacts are worn.",
      solutionId: "2w-starter-failure",
      solution: {
        description: "Test system voltage, inspect the solenoid, and rebuild or replace the starter motor.",
        steps: [
          "Check battery voltage drop while cranking to ensure it stays above 10 volts.",
          "Test starter relay continuity and listen for engagement when the button is pressed.",
          "Remove the starter, inspect brushes and commutator, and clean or replace worn components.",
          "Bench-test the unit before reinstalling and retest starting performance."
        ],
        tools: ["Multimeter", "Starter brush kit", "Socket set"],
        precautions: "Disconnect the battery before removing the starter to prevent accidental shorts.",
        videoLink: "https://www.youtube.com/watch?v=whFBvLjj3y4"
      }
    },
    {
      id: "2w-air-filter-clog",
      title: "Clogged Air Filter",
      vehicleType: "2-wheeler",
      description: "Engine feels suffocated and fuel economy drops due to restricted airflow.",
      solutionId: "2w-air-filter-clog",
      solution: {
        description: "Remove, clean, and re-oil the air filter or replace it to restore unrestricted intake flow.",
        steps: [
          "Remove the seat or side cover to access the airbox and carefully extract the filter element.",
          "Clean foam filters with approved solvent or use a dedicated kit for cotton gauze elements.",
          "Allow the filter to dry completely, then apply filter oil evenly without oversaturating.",
          "Reinstall the element, ensuring the seal seats properly to prevent unfiltered air entry."
        ],
        tools: ["Air filter cleaner", "Filter oil", "Shop towels"],
        precautions: "Do not ride without the filter installed; debris ingestion can severely damage the engine.",
        videoLink: "https://www.youtube.com/watch?v=2g0-tN9B19A"
      }
    }
  ],
  "3-wheeler": [
    {
      id: "3w-engine-starting",
      title: "Engine Starting Problems",
      vehicleType: "3-wheeler",
      description: "Engine cranks slowly or fails to start due to battery or fuel system issues.",
      solutionId: "3w-engine-starting",
      solution: {
        description: "Check battery terminals, test fuel flow, and verify spark to restore reliable starting.",
        steps: [
          "Clean battery terminals and ensure tight connections on both positive and negative clamps.",
          "Test battery voltage with a multimeter; it should be around 12.6 volts at rest.",
          "Verify fuel reaches the carburetor by observing flow in the fuel line.",
          "Inspect and clean or replace spark plugs if fouled or worn."
        ],
        tools: ["Multimeter", "Battery terminal cleaner", "Spark plug socket"],
        precautions: "Keep the fuel tank at least a quarter full to prevent pump strain.",
        videoLink: "https://www.youtube.com/watch?v=FNypZqU1Ves"
      }
    },
    {
      id: "3w-brake-issues",
      title: "Brake Issues",
      vehicleType: "3-wheeler",
      description: "Brakes feel spongy or lack stopping power due to fluid degradation.",
      solutionId: "3w-brake-issues",
      solution: {
        description: "Inspect brake fluid level, replace worn pads, and bleed air from the system.",
        steps: [
          "Check brake fluid reservoir and top up with the specified DOT fluid if low.",
          "Remove wheels and inspect brake pads for thickness; replace if below 2mm.",
          "Bleed the brake system by opening bleeder valves and pumping brake fluid until clear.",
          "Test brakes in a safe area before normal operation."
        ],
        tools: ["Brake fluid", "Brake bleeder kit", "Torque wrench"],
        precautions: "Use only manufacturer-specified brake fluid to avoid system damage.",
        videoLink: "https://www.youtube.com/watch?v=XeT58rDd2cY"
      }
    },
    {
      id: "3w-transmission",
      title: "Transmission Problems",
      vehicleType: "3-wheeler",
      description: "Gears grind or shift roughly due to low fluid or worn components.",
      solutionId: "3w-transmission",
      solution: {
        description: "Check transmission fluid level and condition, adjust clutch cable tension.",
        steps: [
          "Inspect transmission fluid level with the engine at operating temperature.",
          "Replace transmission fluid if it appears dark or burnt.",
          "Adjust clutch cable free play according to manufacturer specifications.",
          "Test gear engagement and replace worn synchros if grinding persists."
        ],
        tools: ["Transmission fluid", "Feeler gauges", "Wrench set"],
        precautions: "Service transmission fluid regularly to prevent premature wear.",
        videoLink: "https://www.youtube.com/watch?v=GKm1FHdcqY8"
      }
    },
    {
      id: "3w-electrical",
      title: "Electrical Problems",
      vehicleType: "3-wheeler",
      description: "Lights flicker, battery drains quickly, or electrical components malfunction.",
      solutionId: "3w-electrical",
      solution: {
        description: "Test battery and alternator output, inspect wiring and fuses.",
        steps: [
          "Check battery terminals for corrosion and clean with a wire brush.",
          "Test alternator output with a multimeter; should read 13.5-14.5 volts at idle.",
          "Inspect all fuses and relays in the electrical box for blown components.",
          "Check ground connections for corrosion or loose connections."
        ],
        tools: ["Multimeter", "Wire cleaner", "Replacement fuses"],
        precautions: "Disconnect the battery before working on electrical components.",
        videoLink: "https://www.youtube.com/watch?v=eTzp1N9S6qc"
      }
    },
    {
      id: "3w-suspension",
      title: "Suspension Problems",
      vehicleType: "3-wheeler",
      description: "Bouncing, sagging, or uneven handling due to worn suspension components.",
      solutionId: "3w-suspension",
      solution: {
        description: "Inspect shocks and springs, check alignment, and replace worn components.",
        steps: [
          "Check shock absorbers for leaks or damage and bounce test the suspension.",
          "Inspect springs for cracks or permanent sag.",
          "Check wheel alignment and adjust if necessary.",
          "Replace worn bushings or control arms to restore handling."
        ],
        tools: ["Measuring tape", "Alignment tool", "Spring compressor"],
        precautions: "Always support the vehicle safely before working on suspension.",
        videoLink: "https://www.youtube.com/watch?v=kpJeaP9ysb8"
      }
    },
    {
      id: "3w-overheating",
      title: "Overheating Problems",
      vehicleType: "3-wheeler",
      description: "Engine temperature rises abnormally during normal operation.",
      solutionId: "3w-overheating",
      solution: {
        description: "Check coolant level, inspect radiator and hoses, verify fan operation.",
        steps: [
          "Allow engine to cool and check coolant level; top up if necessary.",
          "Inspect radiator fins for blockage and clean with compressed air.",
          "Check cooling hoses for cracks or leaks.",
          "Verify cooling fan operates; replace if motor is faulty."
        ],
        tools: ["Coolant", "Radiator cleaner", "Thermostat tester"],
        precautions: "Never open a hot radiator cap; wait for the engine to cool.",
        videoLink: "https://www.youtube.com/watch?v=AnlcopxQxwI"
      }
    },
    {
      id: "3w-fuel-system",
      title: "Fuel System Problems",
      vehicleType: "3-wheeler",
      description: "Engine sputters, stalls, or lacks fuel pressure.",
      solutionId: "3w-fuel-system",
      solution: {
        description: "Inspect fuel filter, test pump pressure, and check fuel lines.",
        steps: [
          "Replace fuel filter if clogged; check for debris in the fuel tank.",
          "Test fuel pump pressure with a gauge; should match manufacturer specs.",
          "Inspect fuel lines for cracks, kinks, or disconnections.",
          "Clean carburetor jets if fuel flow is restricted."
        ],
        tools: ["Fuel pressure gauge", "Fuel filter", "Carburetor cleaner"],
        precautions: "Work in a well-ventilated area away from ignition sources.",
        videoLink: "https://www.youtube.com/watch?v=8WkNLJtl7Tw"
      }
    },
    {
      id: "3w-exhaust-system",
      title: "Exhaust System Problems",
      vehicleType: "3-wheeler",
      description: "Loud exhaust noise, backfiring, or visible leaks.",
      solutionId: "3w-exhaust-system",
      solution: {
        description: "Locate leaks, replace gaskets, tighten connections.",
        steps: [
          "Inspect exhaust manifold and pipes for cracks or rust.",
          "Feel for pulses around exhaust joints to identify leaks.",
          "Replace worn exhaust gaskets and tighten fasteners evenly.",
          "Check muffler mounting hardware and replace if rusted through."
        ],
        tools: ["Exhaust gasket kit", "Socket set", "High-temp sealant"],
        precautions: "Wear gloves; exhaust components remain hot after engine shutdown.",
        videoLink: "https://www.youtube.com/watch?v=jWjj5GqPj8o"
      }
    },
    {
      id: "3w-steering",
      title: "Steering Problems",
      vehicleType: "3-wheeler",
      description: "Steering feels heavy, loose, or unresponsive.",
      solutionId: "3w-steering",
      solution: {
        description: "Check power steering fluid, inspect steering linkage, verify alignment.",
        steps: [
          "Check power steering fluid level and top up if low.",
          "Inspect steering linkage for wear or damage.",
          "Test for proper steering response at various speeds.",
          "Adjust alignment if steering pulls to one side."
        ],
        tools: ["Power steering fluid", "Steering alignment tool", "Socket set"],
        precautions: "Do not force steering if it feels unusually heavy.",
        videoLink: "https://www.youtube.com/watch?v=6E0V_b2cjBU"
      }
    },
    {
      id: "3w-battery-drain",
      title: "Battery Draining Quickly",
      vehicleType: "3-wheeler",
      description: "Battery loses charge rapidly even when parked.",
      solutionId: "3w-battery-drain",
      solution: {
        description: "Test for parasitic draw, check alternator, inspect for electrical faults.",
        steps: [
          "Test battery with a load tester; replace if it fails.",
          "Use a multimeter to check for parasitic electrical draw with engine off.",
          "Disconnect suspect components one at a time to identify the drain source.",
          "Repair or replace faulty wiring or components causing the drain."
        ],
        tools: ["Multimeter", "Battery load tester", "Replacement battery"],
        precautions: "Check all aftermarket accessories for installation issues.",
        videoLink: "https://www.youtube.com/watch?v=KYa7wJzn92A"
      }
    }
  ],
  "4-wheeler": [
    {
      id: "4w-engine-overheating",
      title: "Engine Overheating",
      vehicleType: "4-wheeler",
      description: "Temperature gauge spikes, steam from engine, risk of damage.",
      solutionId: "4w-engine-overheating",
      solution: {
        description: "Stop immediately, allow cooling, check coolant and radiator.",
        steps: [
          "Pull over safely and turn off the engine to prevent damage.",
          "Wait at least 30 minutes before checking the radiator cap.",
          "Check coolant level in the overflow tank and radiator.",
          "Inspect radiator for blockage and check for visible coolant leaks."
        ],
        tools: ["Coolant", "Radiator flush kit", "Thermostat"],
        precautions: "Do not open a hot radiator cap; steam can cause severe burns.",
        videoLink: "https://www.youtube.com/watch?v=AnlcopxQxwI"
      }
    },
    {
      id: "4w-dead-battery",
      title: "Dead Battery",
      vehicleType: "4-wheeler",
      description: "Engine won't crank, lights are dim or off.",
      solutionId: "4w-dead-battery",
      solution: {
        description: "Jump-start the vehicle, test charging system, replace if needed.",
        steps: [
          "Connect jumper cables positive to positive, negative to engine ground on dead vehicle.",
          "Start the donor vehicle and wait 2-3 minutes before starting yours.",
          "Keep both vehicles running for 5+ minutes, then drive for at least 20 minutes.",
          "Test battery and alternator voltage; replace battery if it won't hold charge."
        ],
        tools: ["Jumper cables", "Multimeter", "Replacement battery"],
        precautions: "Never reverse jumper cable connections; check battery terminals for corrosion.",
        videoLink: "https://www.youtube.com/watch?v=fRhQaChx6xk"
      }
    },
    {
      id: "4w-flat-tire",
      title: "Flat Tire",
      vehicleType: "4-wheeler",
      description: "Loss of tire pressure causing handling issues or complete deflation.",
      solutionId: "4w-flat-tire",
      solution: {
        description: "Move to safe location, use spare tire or repair kit.",
        steps: [
          "Pull over to a safe, level location away from traffic.",
          "Apply parking brake and remove wheel trim if necessary.",
          "Loosen lug nuts, jack up vehicle, remove wheel, and install spare.",
          "Tighten lug nuts in star pattern and lower vehicle; have tire repaired professionally."
        ],
        tools: ["Jack", "Lug wrench", "Spare tire", "Tire repair kit"],
        precautions: "Do not drive at high speed on a temporary spare; get tire repaired quickly.",
        videoLink: "https://www.youtube.com/watch?v=jZTYOT3V4is"
      }
    },
    {
      id: "4w-brake-issues",
      title: "Brake Issues",
      vehicleType: "4-wheeler",
      description: "Soft pedal, brake fade, or reduced stopping power.",
      solutionId: "4w-brake-issues",
      solution: {
        description: "Check brake fluid, inspect pads and rotors, bleed system if necessary.",
        steps: [
          "Check brake fluid level; it should be between MIN and MAX marks.",
          "Inspect brake pads for wear; replace if thickness is below 3mm.",
          "Check rotors for damage or excessive runout.",
          "Bleed brakes if pedal feels spongy using the proper sequence."
        ],
        tools: ["Brake fluid", "Brake bleeder kit", "Torque wrench"],
        precautions: "Replace all four brake pads at once for even braking.",
        videoLink: "https://www.youtube.com/watch?v=w74lLLfR0p8"
      }
    },
    {
      id: "4w-transmission-problems",
      title: "Transmission Problems",
      vehicleType: "4-wheeler",
      description: "Slipping gears, rough shifting, or lack of power transfer.",
      solutionId: "4w-transmission-problems",
      solution: {
        description: "Check transmission fluid level and condition, inspect for leaks.",
        steps: [
          "Check transmission fluid with engine running and transmission in Park on level ground.",
          "Note fluid color and odor; dark or burnt fluid requires replacement.",
          "Inspect transmission housing for leaks.",
          "Have transmission serviced or rebuilt if shifting remains problematic."
        ],
        tools: ["Transmission fluid", "Transmission pan gasket", "Socket set"],
        precautions: "Regular transmission servicing prevents costly repairs.",
        videoLink: "https://www.youtube.com/watch?v=hPdaRRr-1aU"
      }
    },
    {
      id: "4w-alternator-failure",
      title: "Alternator Failure",
      vehicleType: "4-wheeler",
      description: "Dim lights, dashboard warning light, or dead battery despite running.",
      solutionId: "4w-alternator-failure",
      solution: {
        description: "Test alternator output, check belt tension, replace if faulty.",
        steps: [
          "With engine running, measure alternator output at the battery terminals; should be 13.5-14.5 volts.",
          "Inspect serpentine belt for cracks, glazing, or proper tension.",
          "Check alternator connector and wiring for corrosion.",
          "Replace alternator if output is below spec; have professionally installed."
        ],
        tools: ["Multimeter", "Alternator replacement unit", "Socket set"],
        precautions: "Alternator replacement requires significant technical knowledge.",
        videoLink: "https://www.youtube.com/watch?v=EinYfMmg7Xw"
      }
    },
    {
      id: "4w-faulty-spark-plugs",
      title: "Faulty Spark Plugs",
      vehicleType: "4-wheeler",
      description: "Engine misfire, rough idle, or difficulty starting.",
      solutionId: "4w-faulty-spark-plugs",
      solution: {
        description: "Inspect spark plugs, replace if fouled or worn.",
        steps: [
          "Allow engine to cool, locate spark plugs under the hood.",
          "Remove one spark plug and inspect for wear, fouling, or gap issues.",
          "Check gap with a gauge; adjust or replace if outside specifications.",
          "Replace all spark plugs with factory-recommended type; gap correctly before installation."
        ],
        tools: ["Spark plug socket", "Spark plug gap tool", "Replacement spark plugs"],
        precautions: "Replace spark plugs every 30,000-100,000 miles depending on type.",
        videoLink: "https://www.youtube.com/watch?v=0kxNiPc9yIo"
      }
    },
    {
      id: "4w-radiator-leaks",
      title: "Radiator Leaks",
      vehicleType: "4-wheeler",
      description: "Coolant puddles under vehicle, overheating, steam from engine.",
      solutionId: "4w-radiator-leaks",
      solution: {
        description: "Locate leak, seal small leaks temporarily, replace radiator if necessary.",
        steps: [
          "Identify leak location; may be from radiator, hoses, or connections.",
          "For small leaks, use radiator stop-leak sealant as temporary fix.",
          "For large leaks or cracks, drain coolant and replace radiator or hoses.",
          "Monitor coolant level closely and have professional repair planned."
        ],
        tools: ["Radiator stop-leak", "Coolant", "Replacement radiator"],
        precautions: "Do not ignore radiator leaks; they lead to engine damage.",
        videoLink: "https://www.youtube.com/watch?v=LZzcr6uHSd4"
      }
    },
    {
      id: "4w-fuel-pump-failure",
      title: "Fuel Pump Failure",
      vehicleType: "4-wheeler",
      description: "Engine sputters, loss of power, or difficulty starting.",
      solutionId: "4w-fuel-pump-failure",
      solution: {
        description: "Test fuel pressure, inspect fuel lines, replace pump if faulty.",
        steps: [
          "Connect fuel pressure gauge to fuel rail; check reading against factory specs.",
          "Listen for pump humming sound when ignition is turned on.",
          "Inspect fuel filter for clogs; replace if necessary.",
          "Replace fuel pump if pressure is low or inconsistent; typically requires tank removal."
        ],
        tools: ["Fuel pressure gauge", "Fuel filter", "Replacement fuel pump"],
        precautions: "Keep fuel tank at least a quarter full to cool the pump.",
        videoLink: "https://www.youtube.com/watch?v=e0Y-QiAKy8I"
      }
    },
    {
      id: "4w-electrical-problems",
      title: "Electrical Problems",
      vehicleType: "4-wheeler",
      description: "Lights not working, power windows stuck, warning lights on.",
      solutionId: "4w-electrical-problems",
      solution: {
        description: "Check fuses and relays, test battery, inspect wiring.",
        steps: [
          "Locate fuse box and check for blown fuses; replace with correct amperage.",
          "Test battery voltage; should be 12.6 volts at rest.",
          "Inspect wiring harnesses for damage or loose connections.",
          "Use multimeter to test power at various components."
        ],
        tools: ["Multimeter", "Replacement fuses", "Wire connectors"],
        precautions: "Disconnect battery before working on electrical components.",
        videoLink: "https://www.youtube.com/watch?v=0kxNiPc9yIo"
      }
    }
  ]
};

export const fallbackProblemIndex = Object.values(fallbackProblemsByVehicle).flat().reduce((acc, problem) => {
  acc[problem.id] = problem;
  return acc;
}, {});

export default function ViewProblems() {
  const { vehicleType } = useParams();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const q = query(
          collection(db, "problems"),
          where("vehicleType", "==", vehicleType)
        );
        const querySnapshot = await getDocs(q);
        const problemsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        if (problemsList.length > 0) {
          setProblems(problemsList);
        } else if (fallbackProblemsByVehicle[vehicleType]) {
          setProblems(fallbackProblemsByVehicle[vehicleType]);
        } else {
          setProblems([]);
        }
      } catch (error) {
        console.error("Error fetching problems:", error);
        if (fallbackProblemsByVehicle[vehicleType]) {
          setProblems(fallbackProblemsByVehicle[vehicleType]);
        } else {
          setProblems([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [vehicleType]);

  const vehicleNames = {
    "2-wheeler": "2-Wheeler",
    "3-wheeler": "3-Wheeler",
    "4-wheeler": "4-Wheeler"
  };

  if (loading) return <div className="dashboard-container"><p>Loading problems...</p></div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Problems for {vehicleNames[vehicleType] || vehicleType}</h1>
        <p>Select a problem to see the solution and video tutorial</p>
      </div>

      {problems.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
          <p>No problems found for this vehicle type. Please check back later!</p>
        </div>
      ) : (
        <div className="problems-list">
          {problems.map(problem => (
            <Link
              key={problem.id}
              to={`/solution/${problem.id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="problem-card">
                <h3>{problem.title}</h3>
                <p>{problem.description}</p>
                <div style={{ color: "#2563eb", fontWeight: "600" }}>
                  View Solution →
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
