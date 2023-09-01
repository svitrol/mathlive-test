export class CustomFunction {

    public name: string;
    public description: string;
    public numberOfParameters: number;
    public functionUnit: string;

    constructor(options?: any) {
        if (options == null) {
            options = {};
        }
        this.name = options.name;
        this.description = options.description;
        this.numberOfParameters = options.numberOfParameters;
        this.functionUnit = options.functionUnit;
    }
}
