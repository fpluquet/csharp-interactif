export type SlotKind = "value" | "ref";

export type ScenarioPart =
  | "variables"
  | "operators"
  | "conversions"
  | "control"
  | "native-methods"
  | "collections"
  | "memory"
  | "functions"
  | "exceptions"
  | "files"
  | "oo-classes"
  | "oo-constructors"
  | "oo-encapsulation"
  | "oo-static"
  | "oo-heritage"
  | "oo-polymorphism"
  | "oo-interfaces"
  | "oo-generics"
  | "oo-advanced"
  | "oo-records"
  | "oo-primary-ctors"
  | "oo-nullable"
  | "oo-init"
  | "oo-modern-interfaces"
  | "oo-pattern";

export type StackSlot = {
  id: string;
  name: string;
  value: string;
  kind: SlotKind;
  /** When kind is 'ref', points to a HeapObject id */
  targetId?: string;
  /**
   * Profondeur de portée dans la frame (0 = corps de la méthode).
   * Un bloc `{ }`, un `for`, etc. → 1, 2, …
   */
  scopeDepth?: number;
  /** Libellé pédagogique de la portée, ex. "bloc", "for", "if". */
  scopeLabel?: string;
  /** Type déclaré (statique) de la variable, ex. "Animal". */
  declaredType?: string;
};

export type StackFrame = {
  id: string;
  method: string;
  slots: StackSlot[];
};

export type HeapField = {
  id?: string;
  label: string;
  value: string;
  kind?: SlotKind;
  /** When kind is 'ref', points to a HeapObject id */
  targetId?: string;
};

export type HeapObject = {
  id: string;
  typeLabel: string;
  address: string;
  fields: HeapField[];
  /** No live references point here (pedagogical "orphan" / GC candidate). */
  orphan?: boolean;
};

export type RefLink = {
  id: string;
  /** Stack slot anchor (exclusive with fromFieldId). */
  fromSlotId?: string;
  /** Heap field anchor for object graphs (exclusive with fromSlotId). */
  fromFieldId?: string;
  toObjectId: string;
};

/** Visualise that a return value replaces the call expression. */
export type ReturnPhase = "returning" | "replaces" | "assigned";

export type ReturnFlow = {
  fromMethod: string;
  callExpr: string;
  value: string;
  targetVar?: string;
  phase: ReturnPhase;
  /** Code line index where the call appears (for inline rewrite). */
  callLine: number;
};

export type ExceptionPhase = "throwing" | "unwinding" | "caught";

export type ExceptionFlow = {
  typeName: string;
  message: string;
  phase: ExceptionPhase;
  /** Method that catches, when phase is caught. */
  catchMethod?: string;
};

/** Visualise le cycle d’une boucle (test → corps → post → …). */
export type LoopKind = "for" | "while" | "do-while" | "foreach";

export type LoopPhase = "init" | "test" | "body" | "post" | "done";

export type LoopFlow = {
  kind: LoopKind;
  phase: LoopPhase;
  /** Tour courant (1-based), utile pour body/post. */
  iteration?: number;
  /** Expression testée, ex. "i < 2". */
  condition?: string;
  conditionResult?: boolean;
  /** Détail court, ex. "i++ → 1". */
  detail?: string;
};

/** Résolution d’appel : type statique vs dynamique (virtual / new). */
export type DispatchFlow = {
  /** Liaison statique (type déclaré) ou dynamique (virtual/override). */
  mode: "static" | "virtual";
  callExpr: string;
  staticType: string;
  dynamicType: string;
  /** Méthode réellement appelée, ex. "Animal.Info". */
  chosen: string;
  result: string;
};

export type VirtualFile = {
  path: string;
  content: string;
};

export type Step = {
  id: string;
  /**
   * Lignes surlignées. Tableau vide sur la dernière étape : le lecteur
   * affiche le marqueur « fin du programme », pas une instruction.
   */
  highlightLines: number[];
  /**
   * Sous-expression de la ligne à exécuter (ex. `new int[] { 2 }`).
   * Si absent, toute la ligne est considérée.
   */
  highlightExpr?: string;
  narration: string;
  stack: StackFrame[];
  heap: HeapObject[];
  refs: RefLink[];
  focus?: string;
  returnFlow?: ReturnFlow;
  exceptionFlow?: ExceptionFlow;
  loopFlow?: LoopFlow;
  dispatchFlow?: DispatchFlow;
  /** Cumulative console output at this step. */
  consoleLines?: string[];
  /** Virtual filesystem snapshot at this step. */
  files?: VirtualFile[];
};

export type Scenario = {
  id: string;
  title: string;
  subtitle: string;
  part: ScenarioPart;
  code: string[];
  steps: Step[];
};
