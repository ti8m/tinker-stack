import type { DemoApi } from '#/demo/api';
import { createContext, useContext } from 'react';

type ApiContextType = {
	demo: ReturnType<typeof DemoApi>;
};

const ApiContext = createContext<ApiContextType | null>(null);

export const ApiProvider = ApiContext.Provider;

export const useApi = (): ApiContextType => {
	const context = useContext(ApiContext);
	if (!context) {
		throw new Error('useApi must be used within an ApiProvider');
	}

	return context;
};
