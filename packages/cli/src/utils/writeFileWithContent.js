import { writeFile } from "fs";

export const writeFileWithContent = (filePath, fileContent) => {
  writeFile(filePath, fileContent, (error) => {
    if (error) {
      console.error(`Error writing file ${filePath}:`, error);
    } else {
      console.log(`File ${filePath} has been written.`);
    }
  });
};
