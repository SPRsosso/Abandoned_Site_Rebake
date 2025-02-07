import { ComputerFile } from "./computer_file.js";
import { Folder } from "./folder.js";
import { ImageFile } from "./image_file.js";

export type GenericFile = ComputerFile | ImageFile | Folder;