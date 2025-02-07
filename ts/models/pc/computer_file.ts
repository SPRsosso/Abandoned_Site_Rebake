import { FileTypes } from "../pc.js";

export class ComputerFile {
    name: string;
    type: FileTypes;
    content: string;

    constructor(name: string, type: FileTypes, content: string = "") {
        this.name = name;
        this.type = type;
        this.content = content;
    }
}