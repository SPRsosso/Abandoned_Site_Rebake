export class ComputerFile {
    name;
    type;
    content;
    constructor(name, type, content = "") {
        this.name = name;
        this.type = type;
        this.content = content;
    }
}
