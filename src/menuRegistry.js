/**
 * Registry to subscribe, unsubscribe and update data of menus.
 *
 * menu data: {
 *   name: String
 *   options: React.Element
 *   events: Object
 *   trigger: Object
 *   triggerLayout: Object
 *   optionsLayout: Object
 * }
*/
export default function makeMenuRegistry(menus = new Map()) {

  /**
   * Subscribes menu by name.
   */
  function subscribe(name, menu) {
    menus.set(name, menu);
  }

  /**
   * Unsubscribes menu by name.
   */
  function unsubscribe(name) {
    menus.delete(name);
  }

  /**
   * Updates menu data excluding layout information.
   */
  function update(name, { options, events, trigger }) {
    const menu = menus.get(name);
    // does not update layouts
    menus.set(name, Object.assign({}, menu, { options, events, trigger }));
  }

  /**
   * Updates layout infomration.
   */
  function updateLayoutInfo(name, { triggerLayout, optionsLayout }) {
    const menu = Object.assign({}, menus.get(name));
    triggerLayout && (menu.triggerLayout = triggerLayout);
    optionsLayout && (menu.optionsLayout = optionsLayout);
    menus.set(name, menu);
  }

  /**
   * Get menu by name.
   */
  function getMenu(name) {
    return menus.get(name);
  }

  return { subscribe, unsubscribe, update, updateLayoutInfo, getMenu };
}

