import { writeFile } from "fs";

export const writeFileWithContent = (filePath, fileContent) => {
  writeFile(filePath, fileContent, (error) => {
    if (error) {
      console.error(`Error writing file ${filePath}:`, error);
    }
  });
};
