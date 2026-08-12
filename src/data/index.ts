import { localsScenario } from "./scenarios/locals";
import { valueCopyScenario } from "./scenarios/value-copy";
import { localsGlobalsScenario } from "./scenarios/locals-globals";
import { typesNumericBoolScenario } from "./scenarios/types-numeric-bool";
import { blockScopeScenario } from "./scenarios/block-scope";
import { arithmeticAssignScenario } from "./scenarios/arithmetic-assign";
import { relationalLogicalScenario } from "./scenarios/relational-logical";
import { ternaryScenario } from "./scenarios/ternary";
import { stringConcatScenario } from "./scenarios/string-concat";
import { numericCastScenario } from "./scenarios/numeric-cast";
import { parseOkScenario } from "./scenarios/parse-ok";
import { parseThrowScenario } from "./scenarios/parse-throw";
import { tryParseScenario } from "./scenarios/try-parse";
import { ifElseScenario } from "./scenarios/if-else";
import { switchCaseScenario } from "./scenarios/switch-case";
import { forLoopScenario } from "./scenarios/for-loop";
import { whileLoopScenario } from "./scenarios/while-loop";
import { doWhileScenario } from "./scenarios/do-while";
import { foreachArrayScenario } from "./scenarios/foreach-array";
import { breakContinueScenario } from "./scenarios/break-continue";
import { stringImmutableScenario } from "./scenarios/string-immutable";
import { stringMethodsScenario } from "./scenarios/string-methods";
import { intToStringScenario } from "./scenarios/int-tostring";
import { charIsDigitScenario } from "./scenarios/char-isdigit";
import { datetimePartsScenario } from "./scenarios/datetime-parts";
import { referencesScenario } from "./scenarios/references";
import { refReassignScenario } from "./scenarios/ref-reassign";
import { arrayIndexScenario } from "./scenarios/array-index";
import { array2dScenario } from "./scenarios/array-2d";
import { listOpsScenario } from "./scenarios/list-ops";
import { tupleScenario } from "./scenarios/tuple";
import { linqWhereScenario } from "./scenarios/linq-where";
import { nullOrphanScenario } from "./scenarios/null-orphan";
import { callstackShareScenario } from "./scenarios/callstack-share";
import { valueVsRefScenario } from "./scenarios/value-vs-ref";
import { functionLocalsScenario } from "./scenarios/function-locals";
import { paramsPassScenario } from "./scenarios/params-pass";
import { outParamScenario } from "./scenarios/out-param";
import { multiCallsScenario } from "./scenarios/multi-calls";
import { nestedCallsScenario } from "./scenarios/nested-calls";
import { recursionScenario } from "./scenarios/recursion";
import { optionalNamedScenario } from "./scenarios/optional-named";
import { overloadScenario } from "./scenarios/overload";
import { exceptionThrowScenario } from "./scenarios/exception-throw";
import { exceptionCatchScenario } from "./scenarios/exception-catch";
import { exceptionFinallyScenario } from "./scenarios/exception-finally";
import { multiCatchScenario } from "./scenarios/multi-catch";
import { fileReadScenario } from "./scenarios/file-read";
import { fileWriteScenario } from "./scenarios/file-write";
import { fileAppendScenario } from "./scenarios/file-append";
import { pathCombineScenario } from "./scenarios/path-combine";
import { directoryListScenario } from "./scenarios/directory-list";
import { classNewScenario } from "./scenarios/class-new";
import { classAliasScenario } from "./scenarios/class-alias";
import { classReturnScenario } from "./scenarios/class-return";
import { classGraphScenario } from "./scenarios/class-graph";
import { classMethodScenario } from "./scenarios/class-method";
import { thisShadowScenario } from "./scenarios/this-shadow";
import { thisPassScenario } from "./scenarios/this-pass";
import { thisFluentScenario } from "./scenarios/this-fluent";
import { classCtorScenario } from "./scenarios/class-ctor";
import { classPropertyScenario } from "./scenarios/class-property";
import { classStaticMemberScenario } from "./scenarios/class-static-member";
import { classHeritageScenario } from "./scenarios/class-heritage";
import { classVirtualScenario } from "./scenarios/class-virtual";
import { classInterfaceScenario } from "./scenarios/class-interface";
import { classGenericScenario } from "./scenarios/class-generic";
import type { Scenario } from "../types/memory";

export const scenarios: Scenario[] = [
  // Variables & types
  localsScenario,
  valueCopyScenario,
  localsGlobalsScenario,
  typesNumericBoolScenario,
  blockScopeScenario,
  // Opérateurs
  arithmeticAssignScenario,
  relationalLogicalScenario,
  ternaryScenario,
  stringConcatScenario,
  // Conversions
  numericCastScenario,
  parseOkScenario,
  parseThrowScenario,
  tryParseScenario,
  // Structures de contrôle
  ifElseScenario,
  switchCaseScenario,
  forLoopScenario,
  whileLoopScenario,
  doWhileScenario,
  foreachArrayScenario,
  breakContinueScenario,
  // Méthodes types natifs
  stringImmutableScenario,
  stringMethodsScenario,
  intToStringScenario,
  charIsDigitScenario,
  datetimePartsScenario,
  // Tableaux & collections
  referencesScenario,
  refReassignScenario,
  arrayIndexScenario,
  array2dScenario,
  listOpsScenario,
  tupleScenario,
  linqWhereScenario,
  // Mémoire
  valueVsRefScenario,
  callstackShareScenario,
  nullOrphanScenario,
  // Fonctions (incl. ch.06 passage de paramètres du syllabus OO)
  functionLocalsScenario,
  paramsPassScenario,
  outParamScenario,
  multiCallsScenario,
  nestedCallsScenario,
  recursionScenario,
  optionalNamedScenario,
  overloadScenario,
  // Exceptions
  exceptionThrowScenario,
  exceptionCatchScenario,
  exceptionFinallyScenario,
  multiCatchScenario,
  // Fichiers
  fileReadScenario,
  fileWriteScenario,
  fileAppendScenario,
  pathCombineScenario,
  directoryListScenario,
  // OO · 02 Classes et objets (dont this)
  classNewScenario,
  classAliasScenario,
  classMethodScenario,
  thisShadowScenario,
  thisPassScenario,
  thisFluentScenario,
  classReturnScenario,
  classGraphScenario,
  // OO · 03 Constructeurs
  classCtorScenario,
  // OO · 04 Encapsulation
  classPropertyScenario,
  // OO · 05 Membres statiques
  classStaticMemberScenario,
  // OO · 07 Héritage
  classHeritageScenario,
  // OO · 08 Polymorphisme
  classVirtualScenario,
  // OO · 09 Interfaces
  classInterfaceScenario,
  // OO · 10 Génériques
  classGenericScenario,
];

export function getScenario(id: string): Scenario | undefined {
  return scenarios.find((s) => s.id === id);
}
