export const getRegistryInfo = async () => {
  try {
    const data = await fetch(`https://ui.shadcn.com/registry`);

    if (data.status === 404) {
      return null;
    }

    return data.json();
  } catch (error) {
    console.error(`Error reading registry`, error);
    return null;
  }
};
