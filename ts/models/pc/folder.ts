import { GenericFile } from "./generic_file.js";

export class Folder {
    name: string;
    inside: GenericFile[];

    constructor(name: string) {
        this.name = name;
        this.inside = [];
    }

    push(file: GenericFile) {
        this.inside.push(file);
    }
}