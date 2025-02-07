export class Folder {
    name;
    inside;
    constructor(name) {
        this.name = name;
        this.inside = [];
    }
    push(file) {
        this.inside.push(file);
    }
}
