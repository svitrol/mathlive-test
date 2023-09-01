export class CustomSymbol {

    public name: string;
    public description: string;
    public symbolUnit: string;

    constructor(options?: any) {
        if (options == null) {
            options = {};
        }
        this.name = options.name;
        this.symbolUnit = options.symbolUnit;
        this.description = options.description;
    }
}
