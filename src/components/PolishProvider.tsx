/**
 * Polish Language Provider
 * Ensures Polish language support throughout the application
 */

"use client";

import { pl } from "@/lib/i18n/pl";
import { type ReactNode, createContext, useContext } from "react";

interface PolishContextValue {
	locale: "pl";
	translations: typeof pl;
}

const PolishContext = createContext<PolishContextValue>({
	locale: "pl",
	translations: pl,
});

export function PolishProvider({ children }: { children: ReactNode }) {
	return (
		<PolishContext.Provider value={{ locale: "pl", translations: pl }}>
			{children}
		</PolishContext.Provider>
	);
}

export function usePolish() {
	return useContext(PolishContext);
}
