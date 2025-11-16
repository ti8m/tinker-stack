/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_BUILD_NUMBER: string;
	readonly VITE_VERSION: string;
	// more env variables...
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
