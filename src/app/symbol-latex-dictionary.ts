import {LatexDictionaryEntry} from '@cortex-js/compute-engine/dist/types/compute-engine/latex-syntax/public';
import {ComputeEngine, Parser} from '@cortex-js/compute-engine';
import type {Expression} from '@cortex-js/compute-engine/dist/types/math-json';
import {CustomFunction} from './CustomFunction';
import {CustomSymbol} from './CustomSymbol';
import {normalizeName} from './util-symbol-name';

export function joinLatexDictionaryItems(customFunctions: Map<string, CustomFunction>,
                                         customSymbols: Map<string, CustomSymbol>): LatexDictionaryEntry[] {
    let latexDictArray: LatexDictionaryEntry[] = [...ComputeEngine.getLatexDictionary()];

    const newCustomLatexFunctionSymbols: LatexDictionaryEntry[] = Array.from(customFunctions)
        .map(([customFunctionName, customFunction]) => {
            return {
                trigger: ['\\' + normalizeName(customFunctionName)],
                parse: (parser: Parser): Expression => {
                    const params: Expression[] = [];
                    for (let i = 0; i < customFunction.numberOfParameters; i++) {
                        params.push(parser.matchRequiredLatexArgument() ?? ['Error', '\'missing\'']);
                    }
                    return [
                        customFunctionName,
                        ...params
                    ];
                }
            };
        });

    const newCustomLatexSymbols: LatexDictionaryEntry[] = Array.from(customSymbols)
        .map(([name, customSymbol]) => {
            return {
                trigger: ['\\' + normalizeName(name)],
                parse: (parser: Parser): Expression => {
                    return name;
                }
            };
        });
    latexDictArray = latexDictArray.concat(newCustomLatexFunctionSymbols);
    latexDictArray = latexDictArray.concat(newCustomLatexSymbols);
    return latexDictArray;
}

export function latexDictionaryAddSymbol(dict: LatexDictionaryEntry[], symbolName: string) {
    dict.push({
        trigger: ['\\' + normalizeName(symbolName)],
        parse: (parser: Parser): Expression => {
            return symbolName;
        }
    });
}

export function latexDictionaryAddFunction(dict: LatexDictionaryEntry[], functionName: string, paramCount: number) {
    dict.push({
        trigger: ['\\' + normalizeName(functionName)],
        parse: (parser: Parser): Expression => {
            const params: Expression[] = [];
            for (let i = 0; i < paramCount; i++) {
                params.push(parser.matchRequiredLatexArgument() ?? ['Error', '\'missing\'']);
            }
            return [
                functionName,
                ...params
            ];
        }
    });
}
