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
import { array3dScenario } from "./scenarios/array-3d";
import { array4dScenario } from "./scenarios/array-4d";
import { arrayJaggedScenario } from "./scenarios/array-jagged";
import { listOpsScenario } from "./scenarios/list-ops";
import { tupleScenario } from "./scenarios/tuple";
import { linqWhereScenario } from "./scenarios/linq-where";
import { linqSelectScenario } from "./scenarios/linq-select";
import { linqAggregatesScenario } from "./scenarios/linq-aggregates";
import { linqOrderByScenario } from "./scenarios/linq-orderby";
import { linqDeferredScenario } from "./scenarios/linq-deferred";
import { nullOrphanScenario } from "./scenarios/null-orphan";
import { callstackShareScenario } from "./scenarios/callstack-share";
import { valueVsRefScenario } from "./scenarios/value-vs-ref";
import { functionLocalsScenario } from "./scenarios/function-locals";
import { paramsPassScenario } from "./scenarios/params-pass";
import { paramListCopyScenario } from "./scenarios/param-list-copy";
import { paramListRefScenario } from "./scenarios/param-list-ref";
import { paramArrayRefScenario } from "./scenarios/param-array-ref";
import { outParamScenario } from "./scenarios/out-param";
import { multiCallsScenario } from "./scenarios/multi-calls";
import { nestedCallsScenario } from "./scenarios/nested-calls";
import { recursionScenario } from "./scenarios/recursion";
import { recursionPrintScenario } from "./scenarios/recursion-print";
import { sommeScenario } from "./scenarios/somme";
import { hanoiScenario } from "./scenarios/hanoi";
import { fibScenario } from "./scenarios/fib";
import { clarifierScenario } from "./scenarios/clarifier";
import { optionalNamedScenario } from "./scenarios/optional-named";
import { overloadScenario } from "./scenarios/overload";
import { exceptionThrowScenario } from "./scenarios/exception-throw";
import { exceptionCatchScenario } from "./scenarios/exception-catch";
import { exceptionRethrowScenario } from "./scenarios/exception-rethrow";
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
import { classCtorDefaultScenario } from "./scenarios/class-ctor-default";
import { classCtorOverloadScenario } from "./scenarios/class-ctor-overload";
import { classCtorThisScenario } from "./scenarios/class-ctor-this";
import { classCtorInitOrderScenario } from "./scenarios/class-ctor-init-order";
import { classCtorValidationScenario } from "./scenarios/class-ctor-validation";
import { classPropertyScenario } from "./scenarios/class-property";
import { classAutoPropScenario } from "./scenarios/class-auto-prop";
import { classPropComputedScenario } from "./scenarios/class-prop-computed";
import { classStaticMemberScenario } from "./scenarios/class-static-member";
import { classStaticMethodScenario } from "./scenarios/class-static-method";
import { classStaticCtorScenario } from "./scenarios/class-static-ctor";
import { classStaticClassScenario } from "./scenarios/class-static-class";
import { classConstReadonlyScenario } from "./scenarios/class-const-readonly";
import { classHeritageScenario } from "./scenarios/class-heritage";
import { classProtectedScenario } from "./scenarios/class-protected";
import { classSealedScenario } from "./scenarios/class-sealed";
import { classHeritageChainScenario } from "./scenarios/class-heritage-chain";
import { classObjectToStringScenario } from "./scenarios/class-object-tostring";
import { classVirtualScenario } from "./scenarios/class-virtual";
import { classAbstractScenario } from "./scenarios/class-abstract";
import { classBaseCallScenario } from "./scenarios/class-base-call";
import { classSealedOverrideScenario } from "./scenarios/class-sealed-override";
import { classIsAsScenario } from "./scenarios/class-is-as";
import { classInterfaceScenario } from "./scenarios/class-interface";
import { classMultiInterfaceScenario } from "./scenarios/class-multi-interface";
import { classGenericScenario } from "./scenarios/class-generic";
import { classGenericMethodScenario } from "./scenarios/class-generic-method";
import { classGenericWhereScenario } from "./scenarios/class-generic-where";
import { classGenericInterfaceScenario } from "./scenarios/class-generic-interface";
import { classOperatorScenario } from "./scenarios/class-operator";
import { classYieldScenario } from "./scenarios/class-yield";
import { classRecordScenario } from "./scenarios/class-record";
import { classPrimaryCtorScenario } from "./scenarios/class-primary-ctor";
import { classNullableScenario } from "./scenarios/class-nullable";
import { classInitOnlyScenario } from "./scenarios/class-init-only";
import { classDefaultInterfaceScenario } from "./scenarios/class-default-interface";
import { classPatternScenario } from "./scenarios/class-pattern";
import { classObjectInitScenario } from "./scenarios/class-object-init";
import { paramInScenario } from "./scenarios/param-in";
import { paramParamsScenario } from "./scenarios/param-params";
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
  array3dScenario,
  array4dScenario,
  arrayJaggedScenario,
  listOpsScenario,
  tupleScenario,
  linqWhereScenario,
  linqSelectScenario,
  linqAggregatesScenario,
  linqOrderByScenario,
  linqDeferredScenario,
  // Mémoire
  valueVsRefScenario,
  callstackShareScenario,
  nullOrphanScenario,
  // Fonctions (incl. ch.06 passage de paramètres du syllabus OO)
  functionLocalsScenario,
  paramsPassScenario,
  paramListCopyScenario,
  paramListRefScenario,
  paramArrayRefScenario,
  outParamScenario,
  multiCallsScenario,
  nestedCallsScenario,
  recursionScenario,
  recursionPrintScenario,
  sommeScenario,
  hanoiScenario,
  fibScenario,
  clarifierScenario,
  optionalNamedScenario,
  overloadScenario,
  paramInScenario,
  paramParamsScenario,
  // Exceptions
  exceptionThrowScenario,
  exceptionCatchScenario,
  exceptionRethrowScenario,
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
  classObjectInitScenario,
  // OO · 03 Constructeurs
  classCtorScenario,
  classCtorDefaultScenario,
  classCtorOverloadScenario,
  classCtorThisScenario,
  classCtorInitOrderScenario,
  classCtorValidationScenario,
  // OO · 04 Encapsulation
  classPropertyScenario,
  classAutoPropScenario,
  classPropComputedScenario,
  // OO · 05 Membres statiques
  classStaticMemberScenario,
  classStaticMethodScenario,
  classStaticCtorScenario,
  classStaticClassScenario,
  classConstReadonlyScenario,
  // OO · 07 Héritage
  classHeritageScenario,
  classProtectedScenario,
  classSealedScenario,
  classHeritageChainScenario,
  classObjectToStringScenario,
  // OO · 08 Polymorphisme
  classVirtualScenario,
  classAbstractScenario,
  classBaseCallScenario,
  classSealedOverrideScenario,
  classIsAsScenario,
  // OO · 09 Interfaces
  classInterfaceScenario,
  classMultiInterfaceScenario,
  // OO · 10 Génériques
  classGenericScenario,
  classGenericMethodScenario,
  classGenericWhereScenario,
  classGenericInterfaceScenario,
  // OO · 11 Concepts avancés
  classOperatorScenario,
  classYieldScenario,
  // OO · 12–17 C# moderne
  classRecordScenario,
  classPrimaryCtorScenario,
  classNullableScenario,
  classInitOnlyScenario,
  classDefaultInterfaceScenario,
  classPatternScenario,
];

export function getScenario(id: string): Scenario | undefined {
  return scenarios.find((s) => s.id === id);
}
