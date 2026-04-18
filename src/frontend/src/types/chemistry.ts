export type ElementCategory =
  | "alkali-metal"
  | "alkaline-earth-metal"
  | "transition-metal"
  | "post-transition-metal"
  | "metalloid"
  | "nonmetal"
  | "halogen"
  | "noble-gas"
  | "lanthanide"
  | "actinide";

export type StateAtRT = "Solid" | "Liquid" | "Gas" | "Synthetic";

export type Block = "s" | "p" | "d" | "f";

export type ChemicalType = "acid" | "base" | "salt" | "neutral";

export type ChemicalStrength = "strong" | "weak" | "neutral";

export type Difficulty = "easy" | "medium" | "hard";

export type ReactionType =
  | "combination"
  | "decomposition"
  | "displacement"
  | "double-displacement"
  | "combustion"
  | "neutralization"
  | "redox";

export interface Element {
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMass: number;
  category: ElementCategory;
  electronConfig: string;
  shells: number[];
  stateAtRT: StateAtRT;
  meltingPoint: number | null;
  boilingPoint: number | null;
  uses: string;
  funFact: string;
  safetyInfo: string;
  group: number | null;
  period: number;
  block: Block;
}

export interface IndicatorResults {
  blueLitmus: string;
  redLitmus: string;
  phenolphthalein: string;
  methylOrange: string;
  universalIndicator: string;
}

export interface Chemical {
  id: string;
  name: string;
  formula: string;
  type: ChemicalType;
  strength: ChemicalStrength;
  ph: number;
  indicatorResults: IndicatorResults;
  uses: string;
  safetyWarning: string;
}

export interface ExperimentStep {
  instruction: string;
  animation: string;
}

export interface Experiment {
  id: string;
  name: string;
  description: string;
  requiredItems: string[];
  steps: ExperimentStep[];
  observation: string;
  inference: string;
  equation: string;
  conclusion: string;
  safetyWarning: string;
  teacherNotes: string;
}

export interface BalancingEquationQuestion {
  question: string;
  answer: string;
  difficulty: Difficulty;
  hint: string;
}

export interface ElementSymbolQuestion {
  element: string;
  symbol: string;
  difficulty: Difficulty;
}

export interface AtomicNumberQuestion {
  element: string;
  atomicNumber: number;
  difficulty: Difficulty;
}

export interface ValencyQuestion {
  element: string;
  valency: string;
  difficulty: Difficulty;
}

export interface ReactionTypeQuestion {
  equation: string;
  type: ReactionType;
  difficulty: Difficulty;
}

export interface WorksheetQuestions {
  balancingEquations: BalancingEquationQuestion[];
  elementSymbols: ElementSymbolQuestion[];
  atomicNumbers: AtomicNumberQuestion[];
  valency: ValencyQuestion[];
  reactionTypes: ReactionTypeQuestion[];
}
