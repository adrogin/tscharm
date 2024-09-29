import terser from '@rollup/plugin-terser';

export default {
	input: [
        'js-compiled/tscharm.js'
    ],
    output: {
        format: 'es',
        file: 'dist/tscharm.js'
    },
    plugins: [terser()]
};
