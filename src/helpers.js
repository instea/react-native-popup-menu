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
 * Computes position outside of the screen.
 */
export const computePositionOutside = ({ windowLayout }) => ({
  top: windowLayout.height,
  left: windowLayout.width
});

/**
 * Computes best position for context menu options according to
 * window boundary and trigger positon.
 */
export const computeContextMenuPosition = ({ windowLayout, triggerLayout, optionsLayout }) => {
  const { width: wWidth, height: wHeight } = windowLayout;
  // TODO: scroll bar for big menus
  const { x: tX, y: tY, height: tHeight, width: tWidth } = triggerLayout;
  const { height: oHeight, width: oWidth } = optionsLayout;
  const top  = (tY + oHeight > wHeight) ? tY + tHeight - oHeight : tY;
  const left = (tX + oWidth > wWidth) ? tX - oWidth + tWidth : tX;
  return { top, left };
}

/**
 * Computes best position for slide-in menu.
 */
export const computeSlideInMenuPosition = ({ windowLayout, triggerLayout, optionsLayout }) => {
  const { height: wHeight } = windowLayout;
  const { height: oHeight } = optionsLayout;
  const top  = wHeight - oHeight;
  const left = 0;
  return { top, left };
}
