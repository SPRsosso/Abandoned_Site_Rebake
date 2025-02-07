export class ImageFile {
    name: string;
    content: string;
    
    constructor(name: string, content = "") {
        this.name = name;
        this.content = content;
    }
}