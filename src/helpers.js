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
 * Computes best position for menu options according to
 * window boundary and trigger positon.
 */
export const computeBestMenuPosition = (windowLayout, triggerLayout, optionsLayout) => {
  const { width: wWidth, height: wHeight } = windowLayout;
  if (!triggerLayout || !optionsLayout) {
    // render outside of the screen
    return {
      top: wHeight,
      left: wWidth,
      isVisible: false
    };
  }
  // TODO: scroll bar for big menus
  const { x: tX, y: tY, height: tHeight, width: tWidth } = triggerLayout;
  const { height: oHeight, width: oWidth } = optionsLayout;
  const top  = (tY + tHeight + oHeight > wHeight) ? tY - oHeight : tY + tHeight;
  const left = (tX + oWidth > wWidth) ? tX - oWidth + tWidth : tX;
  return { top, left, isVisible: true };
}
