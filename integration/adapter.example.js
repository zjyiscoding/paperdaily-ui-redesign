/* Optional wiring example. No endpoints or credentials are assumed.
 * Pass callbacks wrapping your ALREADY EXISTING services/state store, not this preview's fixtures.
 */
window.mountPaperDailyArea = function mountPaperDailyArea(root, existingActions) {
  if (!existingActions || typeof existingActions !== 'object') {
    throw new TypeError('Supply host callbacks explicitly; unconnected operations never succeed silently.');
  }
  return window.PaperDailyUI.mount(root, {
    actions: existingActions,
    onError(error, context) {
      // Host may use a redacted logger. Never log form/password/key content.
      console.warn('PaperDaily UI action failed:', context.action);
    }
  });
};
/* In your component mount lifecycle:
 const ui = mountPaperDailyArea(document.getElementById('pd-ui'), {
   'reviews.save': async ({data, signal}) => {
     // 1. Map data.fields to your EXISTING payload; validate & authorize in existing services.
     // 2. await yourExistingSave(payload, {signal});
     // 3. Refresh your original state store, then return an explicit result.
     // This example intentionally has no fake endpoint or fake success:
     throw new Error('Bind the existing review save service first');
   }
 });
 // In unmount lifecycle: ui.destroy();
 // React/Vue/other frameworks may use only the CSS + their own handlers instead of controller.js.
 */
