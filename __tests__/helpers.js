import React from 'react'
import ShallowRenderer from 'react-test-renderer/shallow';

/**
 * Renders component and returns instance object and rendered output.
 */
export function render(element, ctx) {
  const renderer = new ShallowRenderer();
  if (ctx) {
    element = React.cloneElement(element, { ctx })
  }
  renderer.render(element);
  const instance = renderer.getMountedInstance();
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

/**
Creates a mock of react instance
*/
export function mockReactInstance() {
  const instance = {
    state: {}
  };
  instance.setState = (newState, after) => {
    Object.assign(instance.state, newState);
    after && after();
  }
  return instance;
}

const WAIT_STEP = 50;
export function waitFor(condition, timeout = 200) {
  const startTime = new Date().getTime();
  return new Promise((resolve, reject) => {
    const check = () => {
      const t = new Date().getTime();
      console.log('Checking condition at time:', t - startTime);
      if (condition()) {
        return resolve();
      }
      if (t > startTime + timeout) {
        return reject();
      }
      setTimeout(check, Math.min(WAIT_STEP, startTime + timeout - t));
    };
    check();
  });
}

export function nthChild(node, n) {
  return n === 0 ? node : nthChild(node.props.children, n - 1);
}
