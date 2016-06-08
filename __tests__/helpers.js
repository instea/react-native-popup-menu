import utils from 'react-addons-test-utils';

/**
 * Renders component and returns instance object and rendered output.
 */
export function render(Component, ctx) {
  const renderer = utils.createRenderer();
  renderer.render(Component, ctx);
  const instance = renderer._instance._instance;
  const output = renderer.getRenderOutput();
  return { output, instance, renderer };
}

/**
 * Merge styles (possible array) into single style object.
 */
export function normalizeStyle(styles) {
  if (Array.isArray(styles)) {
    return styles.reduce((r, s) => Object.assign(r, s), {});
  }
  return styles;
}

/**
Enable debug logs
*/
export function showDebug() {
  jest.mock('../src/logger', ()=> ({
    debug : (...args) => {
      console.log('test-debug', ...args);
    },
  }));
}

export function nthChild(node, n) {
  return n === 0 ? node : nthChild(node.props.children, n - 1);
}
