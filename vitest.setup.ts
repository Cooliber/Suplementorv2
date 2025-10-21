import * as matchers from "@testing-library/jest-dom/matchers";
import { expect } from "vitest";

expect.extend(matchers);

// Polyfill for requestAnimationFrame
global.requestAnimationFrame = (callback) => {
	setTimeout(callback, 0);
	return 0; // Return a dummy ID
};
