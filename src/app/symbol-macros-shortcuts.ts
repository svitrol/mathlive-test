import {MathfieldElement} from 'mathlive';
import {CustomFunction} from './CustomFunction';
import {CustomSymbol} from './CustomSymbol';
import {normalizeName} from './util-symbol-name';

function createInlineSymbolShortcut(name: string) {
    name = normalizeName(name);
    return {[name]: '\\' + name};
}

function createInlineFunctionShortcut(functionName: string) {
    const name = normalizeName(functionName);
    return {[name]: '\\' + name + '{#@}{#?}'};
}

function createFunctionMacro(functionName: string, paramCount: number) {
    const name = normalizeName(functionName);
    const symName = 'sym' + name;
    let latexString = '\\' + symName + '\\left(';
    for (let i = 0; i < paramCount; i++) {
        latexString += ' {#' + (i + 1) + '}';
        if (i < paramCount - 1) {
            latexString += ',';
        }
    }
    latexString += '\\right)';
    return {
        [symName]: { // just define symbol separately so that it acts as one
            args: 0,
            def: functionName,
        },
        [name]: {
            captureSelection: false,
            args: paramCount,
            def: latexString,
        }
    };
}

function createSymbolMacro(symbol: string) {
    return {
        [normalizeName(symbol)]: {
            args: 0,
            def: symbol,
            captureSelection: true,
        }
    };
}

export function addMacroForFunction(mfe: MathfieldElement, functionName: string, paramCount: number) {
    mfe.macros = {
        ...mfe.macros,
        ...createFunctionMacro(functionName, paramCount),
    };
}

export function addMacroForSymbol(mfe: MathfieldElement, symbolName: string) {
    mfe.macros = {
        ...mfe.macros,
        ...createSymbolMacro(symbolName),
    };
}

export function addShortcutForFunction(mfe: MathfieldElement, functionName: string) {
    mfe.inlineShortcuts = {
        ...mfe.inlineShortcuts,
        ...createInlineFunctionShortcut(functionName),
    };
}

export function addShortcutForSymbol(mfe: MathfieldElement, symbolName: string) {
    mfe.inlineShortcuts = {
        ...mfe.inlineShortcuts,
        ...createInlineSymbolShortcut(symbolName),
    };
}

export function addCustomMacrosAndShortcuts(mfe: MathfieldElement, customFunctions: Map<string,
    CustomFunction>, customSymbols: Map<string, CustomSymbol>) {
    customFunctions.forEach((val, key) => {
        addMacroForFunction(mfe, key, val.numberOfParameters);
        addShortcutForFunction(mfe, key);
    });
    customSymbols.forEach((val, key) => {
        addMacroForSymbol(mfe, key);
        addShortcutForSymbol(mfe, key);
    });

    console.log(mfe.macros);
}
