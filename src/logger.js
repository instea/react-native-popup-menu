import Menu from './index';

/**
 * Debug logger depending on `Menu.debug` static porperty.
 */
export const debug = (...args) => {
  Menu.debug && console.log('react-native-popup-menu', ...args);
};
