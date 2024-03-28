export const getComponentInfo = async (component) => {
  try {
    const data = await fetch(
      `https://ui.shadcn.com/registry/styles/default/${component}.json`
    );

    if (data.status === 404) {
      return null;
    }

    return data.json();
  } catch (error) {
    console.error(`Error reading ${component} component`, error);
    return null;
  }
};
