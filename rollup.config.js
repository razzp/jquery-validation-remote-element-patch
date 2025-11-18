import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/jquery-validation-remote-element-patch.cjs',
            format: 'cjs',
        },
        {
            file: 'dist/jquery-validation-remote-element-patch.js',
            format: 'esm',
        },
    ],
    plugins: [typescript()],
};
