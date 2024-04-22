import { writeFile } from "fs";

export const writeFileWithContent = (filePath: string, fileContent: string) => {
  writeFile(filePath, fileContent, (error) => {
    if (error) {
      console.error(`Error writing file ${filePath}:`, error);
    }
  });
};
