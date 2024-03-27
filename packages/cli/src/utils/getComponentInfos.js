import { readFileSync } from "fs";

export const getComponentInfos = () => {
  try {
    const data = readFileSync(
      "/Users/ghdtjgus/Desktop/cli/cli/packages/registry/components.json",
      "utf8"
    );

    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading components.json:", error);
    return [];
  }
};
