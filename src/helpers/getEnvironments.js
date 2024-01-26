export const getEnvironments = () => {
	const importMetaEnv = import.meta.env;
	return { ...importMetaEnv };
};
