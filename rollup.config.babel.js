import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'

export default {
  input: './src/index.js',
  output: {
    file: './build/rnpm.js',
    format: 'umd',
    name: 'ReactNativePopupMenu',
    sourcemap: true,
  },

  plugins: [
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      presets: [
        ['@babel/preset-env', { modules: false }],
        '@babel/preset-react',
      ],
      plugins: ['@babel/plugin-proposal-class-properties'],
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    resolve(),
    commonjs(),
  ],

  external: ['react', 'react-dom', 'react-native'],
}
