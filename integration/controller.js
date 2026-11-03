/* PaperDaily framework-neutral optional UI adapter. No network, storage, fixtures or credentials.
 * Load only once; use one #pd-ui root per document. Host remains responsible for data and permissions.
 */
(() => {
  'use strict';
  const mounted = new WeakMap();
  function mount(root, options = {}) {
    if (!(root instanceof HTMLElement)) throw new TypeError('PaperDailyUI.mount requires an HTMLElement');
    if (mounted.has(root)) throw new Error('This root is already mounted; call destroy() before remounting');
    const actions = options.actions || {};
    const ac = new AbortController();
    const pending = new Set();
    const busyStates = new Map();
    const opened = new Map();
    const signal = ac.signal;
    let destroyed = false;
    const listen = (node, type, handler) => node.addEventListener(type, handler, {signal});
    const find = selector => { try { return root.querySelector(selector); } catch { return null; } };
    const emit = (name, detail) => root.dispatchEvent(new CustomEvent(name, {bubbles:true,detail}));
    function feedback(message, tone='info', element=null) {
      if (options.onFeedback) { options.onFeedback({message,tone,element}); return; }
      let box = find('[data-pd-feedback]');
      if (!box) {
        box=document.createElement('div'); box.dataset.pdFeedback='';
        box.className='alert mt16'; root.appendChild(box);
      }
      box.hidden=false; box.className='alert mt16'+(tone==='error'?' error':'');
      box.setAttribute('role',tone==='error'?'alert':'status');
      box.textContent=message; // Never render server strings as HTML.
    }
    function setBusy(el, busy) {
      if (busy) {
        const state={disabled:el.disabled,aria:el.getAttribute('aria-busy'),width:el.style.minWidth};
        pending.add(el); busyStates.set(el,state); el.setAttribute('aria-busy','true');
        el.style.minWidth=el.getBoundingClientRect().width+'px';
        if ('disabled' in el) el.disabled=true;
        if(el.matches('button')) { const spin=document.createElement('span'); spin.className='spinner';spin.dataset.pdBusyIcon='';spin.setAttribute('aria-hidden','true');el.prepend(spin); }
      } else {
        const state=busyStates.get(el);if(!state)return;
        el.querySelector('[data-pd-busy-icon]')?.remove();
        if('disabled' in el)el.disabled=state.disabled;
        state.aria===null?el.removeAttribute('aria-busy'):el.setAttribute('aria-busy',state.aria);
        el.style.minWidth=state.width;busyStates.delete(el);pending.delete(el);
      }
    }
    async function run(action, element, fields={}) {
      if(destroyed || pending.has(element)) return;
      if(element.matches(':disabled,[aria-disabled="true"]'))return;
      if(typeof actions[action]!=='function') {
        feedback('尚未接入此操作：'+action+'。请由开发者绑定原有服务。','error',element);
        emit('pd:action-unbound',{action});return;
      }
      const ids=Array.from(root.querySelectorAll('input[data-pd-select]:checked')).map(el=>el.value);
      const data={id:element.dataset.id||null,format:element.dataset.format||null,
        selectedIds:ids,fields, nextChecked: element.getAttribute('aria-checked')==='true'?false:true};
      setBusy(element,true);
      try {
        // fields may contain user input. It is sent ONLY to the explicitly supplied host callback.
        const result=await actions[action]({action,data,element,root,signal});
        if(signal.aborted || destroyed)return;
        if(!result || result.ok!==true) {
          const message=result?.message || '操作未确认成功，请检查真实服务返回。';
          feedback(message,'error',element);emit('pd:action-failed',{action});return;
        }
        if(typeof result.checked==='boolean' && element.matches('[role="switch"]'))element.setAttribute('aria-checked',String(result.checked));
        if(result.message)feedback(result.message,'success',element);
        // Updating business lists or navigating is the host's job; never invent a successful row here.
        emit('pd:action-complete',{action});
      } catch(error) {
        if(signal.aborted||destroyed||error?.name==='AbortError')return;
        feedback(options.errorMessage||'操作未完成，请重试或检查连接。','error',element);
        options.onError?.(error,{action});emit('pd:action-failed',{action});
      } finally {setBusy(element,false);}
    }
    function openDialog(dialog, opener) {
      if(!(dialog instanceof HTMLDialogElement)||dialog.open)return;
      opened.set(dialog,opener||document.activeElement);dialog.showModal();
    }
    function closeDialog(dialog) { if(dialog instanceof HTMLDialogElement && dialog.open)dialog.close(); }
    listen(root,'click', event => {
      const target=event.target instanceof Element?event.target:null;if(!target)return;
      const ui=target.closest('[data-pd-ui]');
      if(ui && root.contains(ui)) {
        const sel=ui.dataset.pdTarget;const node=sel?find(sel):null;
        switch(ui.dataset.pdUi) {
          case 'open-dialog': event.preventDefault();openDialog(node,ui);return;
          case 'close-dialog': event.preventDefault();closeDialog(ui.closest('dialog'));return;
          case 'toggle': if(node){event.preventDefault();node.hidden=!node.hidden;ui.setAttribute('aria-expanded',String(!node.hidden));}return;
        }
      }
      const actionEl=target.closest('[data-pd-action]');
      if(actionEl && root.contains(actionEl) && !actionEl.matches('[type="submit"]')) {
        event.preventDefault();void run(actionEl.dataset.pdAction,actionEl);
      }
    });
    listen(root,'submit',event=>{
      const form=event.target;if(!(form instanceof HTMLFormElement)||!form.dataset.pdForm)return;
      event.preventDefault();if(!form.reportValidity())return;
      const data={};new FormData(form).forEach((value,key)=>{
        if(key in data)data[key]=Array.isArray(data[key])?[...data[key],value]:[data[key],value];else data[key]=value;
      });
      const submitter=event.submitter||form.querySelector('[type="submit"]')||form;
      void run(form.dataset.pdForm,submitter,data);
    });
    root.querySelectorAll('dialog').forEach(dialog=>listen(dialog,'close',()=>{
      const opener=opened.get(dialog);opened.delete(dialog);if(opener instanceof HTMLElement && opener.isConnected)opener.focus();
    }));
    const api={root,run,feedback,openDialog,closeDialog,destroy(){
      if(destroyed)return;destroyed=true;ac.abort();
      for(const el of [...pending])setBusy(el,false);
      for(const dialog of opened.keys())closeDialog(dialog);
      opened.clear();mounted.delete(root);
    }};
    mounted.set(root,api);return api;
  }
  window.PaperDailyUI=Object.freeze({mount,version:'1.0.0'});
})();
