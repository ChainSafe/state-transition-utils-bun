import { resolve } from "node:path";
export const BINDINGS_NAME = "libstate-transition-utils";

export const ROOT_DIR = resolve(__dirname, "..");
export const PREBUILD_DIR = resolve(ROOT_DIR, "prebuild");

class NotBunError extends Error {
	constructor(missingItem: string) {
		super(
			`state-transition-utils-bun bindings only run in a Bun context. No ${missingItem} found.`,
		);
	}
}

/**
 * Get shared library name according to state-transition-z release artifacts
 * for example: https://github.com/ChainSafe/state-transition-z/releases/tag/v0.1.0-rc.1
 * name: libstate-transition-utils-{arch}-{platform}.{ext}
 */
export function getBinaryName(): string {
	if (!process) throw new NotBunError("global object");
	const platform = process.platform;
	if (!platform) throw new NotBunError("process.platform");
	const arch = process.arch;
	if (!arch) throw new NotBunError("process.arch");
	const nodeApiVersion = process.versions.modules;
	if (!nodeApiVersion) throw new NotBunError("process.versions.modules");

	let archName: string;
	switch (arch) {
		case "x64":
			archName = "x86_64";
			break;
		case "arm64":
			archName = "aarch64";
			break;
		default:
			throw new Error(`Unsupported architecture: ${arch}`);
	}

	// TODO: only macos and linux were supported
	let platformName: string;
	// shared library extension
	let ext: string;
	switch (platform) {
		case "darwin":
			platformName = "macos";
			ext = "dylib";
			break;
		case "linux":
			platformName = "linux";
			ext = "so";
			break;
		case "win32":
			platformName = "windows";
			ext = "dll";
			break;
		default:
			throw new Error(`Unsupported platform: ${platform}`);
	}

	return `${BINDINGS_NAME}-${archName}-${platformName}.${ext}`;
}

export function getPrebuiltBinaryPath(binaryName: string): string {
	return resolve(PREBUILD_DIR, binaryName);
}
