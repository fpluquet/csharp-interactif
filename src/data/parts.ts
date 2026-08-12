import type { ScenarioPart } from "../types/memory";

export const PART_ORDER: ScenarioPart[] = [
  "variables",
  "operators",
  "conversions",
  "control",
  "native-methods",
  "collections",
  "memory",
  "functions",
  "exceptions",
  "files",
  // Syllabus OO (Q2) — chapitres 02 → 10
  "oo-classes",
  "oo-constructors",
  "oo-encapsulation",
  "oo-static",
  "oo-heritage",
  "oo-polymorphism",
  "oo-interfaces",
  "oo-generics",
];

export const PART_LABELS: Record<ScenarioPart, string> = {
  variables: "Variables & types",
  operators: "Opérateurs",
  conversions: "Conversions",
  control: "Structures de contrôle",
  "native-methods": "Méthodes des types natifs",
  collections: "Tableaux & collections",
  memory: "Mémoire",
  functions: "Fonctions",
  exceptions: "Exceptions",
  files: "Fichiers",
  "oo-classes": "OO · 02 Classes et objets",
  "oo-constructors": "OO · 03 Constructeurs",
  "oo-encapsulation": "OO · 04 Encapsulation",
  "oo-static": "OO · 05 Membres statiques",
  "oo-heritage": "OO · 07 Héritage",
  "oo-polymorphism": "OO · 08 Polymorphisme",
  "oo-interfaces": "OO · 09 Interfaces",
  "oo-generics": "OO · 10 Génériques",
};
