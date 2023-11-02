import pluginNodeResolve from '@rollup/plugin-node-resolve';
import pluginEsbuild from 'rollup-plugin-esbuild';

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
	input: 'src/background.ts',
	output: {
		format: "esm",
        dir: "dist/js",
		manualChunks: {
			smoldot: ["smoldot"],
			// helpers: ["@polkadot-api/light-client-extension-helpers/background"]
		}
	},
	plugins: [
		pluginNodeResolve(), 
		pluginEsbuild(),
	]
};

export default config