class Folder {
    constructor(name) {
        this.name = name;
        this.inside = [];
    }

    push(file) {
        this.inside.push(file);
    }
}