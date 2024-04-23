export const getRegistryInfo = async () => {
  try {
    const data = await fetch(
      `https://ghdtjgus76.github.io/design-system-cli/packages/registry/`
    );

    if (data.status === 404) {
      return null;
    }

    return data.json();
  } catch (error) {
    console.error(`Error reading registry:`, error);
    return null;
  }
};
