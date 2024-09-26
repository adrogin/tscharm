import tseslint from 'typescript-eslint';

export default tseslint.config(
    ...tseslint.configs.recommended,
    {
        'ignores': [
            'Scripts/dist',
            '*config.*js',
            'Scripts/src/index.ts.js'
        ]
    }
);
