import { Platform, TouchableHighlight, TouchableNativeFeedback } from 'react-native';

/**
 * Promisifies measure's callback function and returns layout object.
 */
export const measure = ref => new Promise((resolve) => {
  ref.measure((x, y, width, height, pageX, pageY) => {
    resolve({
      x: pageX, y: pageY,
      width, height
    })
  });
});

/**
 * Create unique menu name across all menu instances.
 */
export const makeName = (function() {
  let nextID = 1;
  return () => `menu-${nextID++}`;
})();

/**
 * Create touchable component based on passed parameter and platform.
 * It also returns default props for specific touchable types.
 */
export function makeTouchable(TouchableComponent) {
  const Touchable = TouchableComponent || Platform.select({
    ios: TouchableHighlight,
    android: TouchableNativeFeedback,
  });
  let defaultTouchableProps = {};
  if (Touchable === TouchableHighlight) {
    defaultTouchableProps = { underlayColor: 'rgba(0, 0, 0, 0.1)' };
  }
  return { Touchable, defaultTouchableProps };
}

function includes(arr, value) {
  return arr.indexOf(value) > -1;
}

/**
Log object - prepares object for logging by stripping all "private" or excluding fields
*/
export function lo(object, ...excluding) {
  const exc = Array.from(excluding);
  function isObject(obj) {
    return obj === Object(obj);
  }
  function withoutPrivate(obj) {
    if (!isObject(obj)) return obj;
    const res = {};
    for (var property in obj) {
      if (obj.hasOwnProperty(property)) {
        if (!property.startsWith('_') && !includes(exc, property)) {
          res[property] = withoutPrivate(obj[property]);
        }
      }
    }
    return res;
  }
  return withoutPrivate(object);
}
