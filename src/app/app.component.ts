import {Component} from '@angular/core';
import {MathfieldElement} from 'mathlive';
import {CustomFunction} from "./CustomFunction";
import {CustomSymbol} from "./CustomSymbol";
import {ComputeEngine} from "@cortex-js/compute-engine";
import {joinLatexDictionaryItems} from "./symbol-latex-dictionary";
import {addCustomMacrosAndShortcuts, removeHelpSymbols} from "./symbol-macros-shortcuts";
import {normalizeName} from "./util-symbol-name";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'mathlive-test';
    public mfe = new MathfieldElement({});

    public mySymbolMap: Map<string, CustomSymbol> = new Map();
    public myFunctionMap: Map<string, CustomFunction> = new Map();

    ngOnInit() {
        this.addSymbolToMap('A', 'Popis A', '0ba9b0ce-44a9-4c56-a39c-005a8fafc507');
        this.addSymbolToMap('B', 'Popis B', '1629cf3a-2a60-40b8-9d2c-f0a59f0ff348');
        this.addSymbolToMap('vodík', 'Popis C', '0ba9b0ce-44a9-4c56-a39c-005a8fafc507');

        this.addFunctionToMap('FunFunction', 'Popis A', '0ba9b0ce-44a9-4c56-a39c-005a8fafc507', 2);
        this.addFunctionToMap('Funkcerr', 'Popis A', '0ba9b0ce-44a9-4c56-a39c-005a8fafc507', 2);
        this.addFunctionToMap('Korupce', 'Popis A', '0ba9b0ce-44a9-4c56-a39c-005a8fafc507', 5);
        this.addFunctionToMap('Random', 'Popis A', '0ba9b0ce-44a9-4c56-a39c-005a8fafc507', 0);
    }

    ngAfterViewInit() {

        MathfieldElement.soundsDirectory = 'assets/mathlive/sounds';
        MathfieldElement.fontsDirectory = 'assets/mathlive/fonts';
        const targetElement = document.getElementById('mycontainer');
        const formulaElement  = document.getElementById("formula-content");
        targetElement?.appendChild(this.mfe);
        this.mfe.style.setProperty('width', 'inherit');

        const ce = new ComputeEngine({
            latexDictionary: joinLatexDictionaryItems(this.myFunctionMap, this.mySymbolMap),
        });


        console.log('you got there compute engine');
        MathfieldElement.computeEngine = ce;
        MathfieldElement.computeEngine.jsonSerializationOptions = {shorthands: []};

        addCustomMacrosAndShortcuts(this.mfe, this.myFunctionMap, this.mySymbolMap);
        console.log(this.mfe.macros);

        this.mfe.addEventListener('input', (ev: any) => {
            console.log(ev.target.value);
            const expanded = this.mfe.getValue('latex-expanded');
            console.log(removeHelpSymbols(expanded));
            console.log(expanded);
            if(formulaElement != null){
                formulaElement.innerHTML = expanded;
            }
            // console.log(ev.target.innerText);
        });
    }

    private addFunctionToMap(name: string, description: string, unitId: string, parameterNo: number) {
        this.myFunctionMap.set(name, new CustomFunction({
            'name': name,
            'description': description,
            'functionUnit': unitId,
            'numberOfParameters': parameterNo
        }));
    }

    private addSymbolToMap(symbolName: string, description: string, unitId: string) {
        this.mySymbolMap.set(symbolName, new CustomSymbol({
            'symbolName': symbolName,
            'description': description,
            'unitId': unitId
        }));
    }

    insertFunction(functionName: string, paramCount: number) {
        let command = '\\';
        command += normalizeName(functionName);
        for (let i = 0; i < paramCount; i++) {
            command += '{\\placeholder{}}';
        }
        this.mfe.executeCommand(['insert', command]);
    }

    insertSymbol(symbolName: string) {
        let command = '\\';
        command += normalizeName(symbolName);
        this.mfe.executeCommand(['insert', command]);

    }
}
