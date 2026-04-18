import type { Experiment } from "../types/chemistry";

export const experimentsData: Experiment[] = [
  {
    id: "exp-1",
    name: "Heating Copper Sulphate Crystals",
    description:
      "Observe the effect of heat on blue copper sulphate crystals and the reversibility of the reaction with water.",
    requiredItems: [
      "Boiling tube",
      "Bunsen burner",
      "Blue copper sulphate crystals",
      "Dropper",
      "Distilled water",
      "Test tube holder",
      "Safety goggles",
    ],
    steps: [
      {
        instruction:
          "Take a few blue copper sulphate crystals in a clean, dry boiling tube.",
        animation: "pour-crystals",
      },
      {
        instruction:
          "Hold the boiling tube with a test tube holder at an angle facing away from you.",
        animation: "hold-tube",
      },
      {
        instruction:
          "Heat the boiling tube gently over the Bunsen burner flame.",
        animation: "heat-tube",
      },
      {
        instruction:
          "Observe the color change of the crystals from blue to white as water of crystallization is lost.",
        animation: "color-change-blue-white",
      },
      {
        instruction:
          "Allow the tube to cool completely. Add 2-3 drops of distilled water using a dropper.",
        animation: "add-water-drops",
      },
      {
        instruction:
          "Observe the crystals turning blue again as they reabsorb water.",
        animation: "color-change-white-blue",
      },
    ],
    observation:
      "Blue copper sulphate crystals turn white on heating. Water droplets appear on the cooler parts of the tube. On adding water, the white solid turns blue again.",
    inference:
      "Copper sulphate crystals contain water of crystallization (CuSO₄·5H₂O). On heating, water is lost giving anhydrous white copper sulphate. The reaction is reversible.",
    equation: "CuSO₄·5H₂O ⇌ CuSO₄ + 5H₂O\n(Blue)      (White)",
    conclusion:
      "The experiment shows that copper sulphate crystals are hydrated and the water of crystallization can be removed by heating. The reaction is reversible — anhydrous copper sulphate reabsorbs water to form the hydrated blue form again.",
    safetyWarning:
      "Heat the tube gently and tilt away from your face. Do not add water to a hot tube. Wear safety goggles throughout.",
    teacherNotes:
      "This experiment demonstrates hydrated salts and reversible reactions. It is a great introduction to the concept of water of crystallization and reversible chemical changes. Emphasize that the blue color is due to the hydrated Cu²⁺ ion complex.",
  },
  {
    id: "exp-2",
    name: "Heating Ferrous Sulphate Crystals",
    description:
      "Observe thermal decomposition of green ferrous sulphate crystals into brown ferric oxide with release of gases.",
    requiredItems: [
      "Boiling tube",
      "Bunsen burner",
      "Green ferrous sulphate crystals",
      "Test tube holder",
      "Damp red/blue litmus paper",
      "Safety goggles",
      "Clamp stand",
    ],
    steps: [
      {
        instruction:
          "Take a spatula of green ferrous sulphate crystals (FeSO₄·7H₂O) in a boiling tube.",
        animation: "pour-crystals-green",
      },
      {
        instruction:
          "Fix the boiling tube at an angle in a clamp stand pointing away from you.",
        animation: "setup-clamp",
      },
      {
        instruction: "Hold damp red litmus paper at the mouth of the tube.",
        animation: "hold-litmus",
      },
      {
        instruction: "Heat the boiling tube strongly over the Bunsen burner.",
        animation: "heat-strong",
      },
      {
        instruction:
          "Observe the color change from light green to brown/black residue.",
        animation: "color-change-green-brown",
      },
      {
        instruction:
          "Note the smell of burning sulphur and the color change of the litmus paper.",
        animation: "gas-release",
      },
    ],
    observation:
      "The light green crystals gradually turn brown/black on strong heating. A pungent smell resembling burning sulphur is noticed. Damp litmus paper shows the release of an acidic gas (SO₂). Brown residue (Fe₂O₃) remains in the tube.",
    inference:
      "Ferrous sulphate decomposes on heating to form ferric oxide (brown), sulphur dioxide (acidic, pungent gas), and sulphur trioxide. This is a thermal decomposition reaction.",
    equation: "2FeSO₄ → Fe₂O₃ + SO₂ + SO₃\n(Green)    (Brown)  (Gases)",
    conclusion:
      "Ferrous sulphate undergoes thermal decomposition on heating. The color change from green to brown and the release of pungent gas (SO₂) indicate a chemical change. This is an irreversible decomposition reaction.",
    safetyWarning:
      "Perform in a well-ventilated area or fume hood. SO₂ gas is toxic — avoid inhaling. Wear goggles and heat-resistant gloves.",
    teacherNotes:
      "This experiment demonstrates thermal decomposition reactions. The color change from green (Fe²⁺) to brown (Fe³⁺) is excellent for discussing oxidation states. Test gas with damp litmus paper to confirm acidic SO₂.",
  },
  {
    id: "exp-3",
    name: "Heating Baking Soda",
    description:
      "Observe the thermal decomposition of sodium bicarbonate and test for the release of carbon dioxide gas.",
    requiredItems: [
      "Boiling tube",
      "Delivery tube with rubber cork",
      "Bunsen burner",
      "Baking soda (NaHCO₃)",
      "Lime water (in a test tube)",
      "Test tube holder",
      "Safety goggles",
    ],
    steps: [
      {
        instruction:
          "Take 2 spatulas of baking soda in a boiling tube fitted with a delivery tube.",
        animation: "pour-baking-soda",
      },
      {
        instruction:
          "Place the other end of the delivery tube in a test tube containing fresh lime water.",
        animation: "setup-delivery-tube",
      },
      {
        instruction: "Heat the boiling tube gently over the Bunsen burner.",
        animation: "heat-gentle",
      },
      {
        instruction: "Observe bubbles passing through the lime water.",
        animation: "bubbles-lime-water",
      },
      {
        instruction:
          "Continue heating and observe the lime water turning milky.",
        animation: "lime-water-milky",
      },
      {
        instruction: "Pass excess CO₂ to observe lime water clearing again.",
        animation: "excess-co2-clear",
      },
    ],
    observation:
      "Bubbles are produced when baking soda is heated. The lime water turns milky (or chalky white). On passing excess gas, the milky suspension clears again forming a clear solution of calcium bicarbonate.",
    inference:
      "Baking soda decomposes on heating to release CO₂ gas. CO₂ turns lime water milky, confirming its presence. Excess CO₂ forms soluble calcium bicarbonate, clearing the solution.",
    equation:
      "2NaHCO₃ → Na₂CO₃ + H₂O + CO₂\nCO₂ + Ca(OH)₂ → CaCO₃↓ + H₂O (milky)\nCaCO₃ + H₂O + CO₂ → Ca(HCO₃)₂ (clear)",
    conclusion:
      "Sodium bicarbonate undergoes thermal decomposition on heating. The test with lime water confirms the release of CO₂. The lime water test is a standard laboratory method to identify CO₂.",
    safetyWarning:
      "Ensure the delivery tube does not become blocked. Do not heat too rapidly to avoid sudden spurting. Wear goggles.",
    teacherNotes:
      "This is an excellent experiment to introduce CO₂ testing and thermal decomposition. The lime water test is a standard method for CO₂ identification. Discuss why this happens in baking (leavening). The reversal with excess CO₂ shows carbonate chemistry.",
  },
  {
    id: "exp-4",
    name: "Zinc + Dilute Hydrochloric Acid",
    description:
      "Observe the displacement reaction of zinc metal with dilute HCl and test for hydrogen gas production.",
    requiredItems: [
      "Test tube",
      "Zinc granules",
      "Dilute HCl solution",
      "Burning splint/matchstick",
      "Test tube holder",
      "Dropper",
      "Safety goggles",
    ],
    steps: [
      {
        instruction: "Take 3-4 zinc granules in a clean test tube.",
        animation: "add-zinc-granules",
      },
      {
        instruction:
          "Using a dropper, add dilute HCl (about 5 mL) to the zinc in the test tube.",
        animation: "add-hcl-drops",
      },
      {
        instruction:
          "Observe the vigorous effervescence (bubbling) immediately.",
        animation: "effervescence-bubbles",
      },
      {
        instruction:
          "Collect the gas by inverting a test tube over the mouth of the reacting tube.",
        animation: "collect-gas",
      },
      {
        instruction:
          "Bring a burning splint to the mouth of the inverted tube.",
        animation: "burning-splint",
      },
      {
        instruction: "Listen for a pop sound confirming hydrogen gas.",
        animation: "pop-sound",
      },
    ],
    observation:
      "Vigorous bubbling (effervescence) occurs when dilute HCl is added to zinc. The gas burns with a pop sound when a burning splint is brought near, confirming it is hydrogen. The zinc gradually dissolves.",
    inference:
      "Zinc displaces hydrogen from dilute HCl, producing hydrogen gas and zinc chloride. The pop test confirms H₂. This is a single displacement reaction showing zinc is more reactive than hydrogen.",
    equation:
      "Zn + 2HCl → ZnCl₂ + H₂↑\n(Zinc) (dil.) (Zinc Chloride) (Hydrogen gas)",
    conclusion:
      "Zinc reacts with dilute hydrochloric acid in a displacement reaction to produce hydrogen gas and zinc chloride. The pop sound confirms hydrogen. This demonstrates the activity series — metals above hydrogen displace it from dilute acids.",
    safetyWarning:
      "Hydrogen is highly flammable. Ensure no large accumulation of gas before testing. Work away from open flames. Wear goggles. HCl is corrosive — avoid contact.",
    teacherNotes:
      "Great experiment for introducing displacement reactions and the reactivity series. Discuss why metals react with dilute acids and why noble metals do not. The pop test is a standard identification for H₂. Try iron, magnesium, copper for comparison.",
  },
  {
    id: "exp-5",
    name: "Burning Magnesium Ribbon",
    description:
      "Observe the combustion of magnesium in air and identify the product formed.",
    requiredItems: [
      "Magnesium ribbon (5 cm)",
      "Crucible tongs",
      "Bunsen burner",
      "Sand tray or ceramic tile",
      "Safety goggles",
      "Piece of cobalt blue glass (for viewing)",
    ],
    steps: [
      {
        instruction:
          "Hold a 5 cm piece of magnesium ribbon with crucible tongs. Do NOT hold in your hands.",
        animation: "hold-mg-tongs",
      },
      {
        instruction:
          "Hold the cobalt blue glass in front of your eyes for protection — do NOT look directly at the flame.",
        animation: "blue-glass-protection",
      },
      {
        instruction:
          "Bring the magnesium ribbon close to the Bunsen burner flame.",
        animation: "approach-flame",
      },
      {
        instruction:
          "Observe the magnesium igniting and burning with an intensely bright white flame.",
        animation: "bright-white-flame",
      },
      {
        instruction:
          "Hold the burning ribbon over the ceramic tile and observe the white ash falling.",
        animation: "white-ash-falls",
      },
      {
        instruction:
          "Examine the white powder (magnesium oxide) collected on the tile.",
        animation: "examine-mgo",
      },
    ],
    observation:
      "Magnesium burns in air with a dazzling, intensely bright white flame, producing a white powdery residue. The white powder is magnesium oxide. The flame is too bright to look at directly.",
    inference:
      "Magnesium undergoes rapid combustion (combination reaction) with oxygen in air to form magnesium oxide. The large amount of light and heat produced indicates an exothermic reaction.",
    equation: "2Mg + O₂ → 2MgO\n(Silver) (in air) (White powder)",
    conclusion:
      "Magnesium is a highly reactive metal that burns in air in a combination reaction to form magnesium oxide. The reaction is highly exothermic producing intense white light. This demonstrates combustion and the formation of a metal oxide.",
    safetyWarning:
      "NEVER look directly at burning magnesium — it can cause permanent eye damage. Use cobalt blue glass. Do not burn near flammable materials. Do not touch the white residue (MgO is an irritant). Keep a sand bucket nearby.",
    teacherNotes:
      "One of the most visually dramatic experiments. Perfect for introducing combination reactions and metal oxide formation. Discuss why cobalt glass blocks harmful UV radiation. Compare with other metal combustions. Note that MgO is basic and can be dissolved in water to form Mg(OH)₂.",
  },
];
