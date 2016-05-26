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
  function subscribe(instance) {
    menus.set(instance.getName(), { instance });
  }

  /**
   * Unsubscribes menu by name.
   */
  function unsubscribe(instance) {
    menus.delete(instance.getName());
  }

  /**
   * Updates layout infomration.
   */
  function updateLayoutInfo(name, { triggerLayout, optionsLayout }) {
    if (!menus.has(name)) {
      return;
    }
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

  function getAll() {
    return [...menus.values()];
  }

  return { subscribe, unsubscribe, updateLayoutInfo, getMenu, getAll };
}

