const tabs = [...document.querySelectorAll('[role="tab"]')];
const sections = new Set(tabs.map(tab => tab.dataset.tab));
function activate(name, {focus = false, scroll = false} = {}) {
  if (!sections.has(name)) name = 'about';
  for (const tab of tabs) {
    const active = tab.dataset.tab === name;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    document.getElementById(`panel-${tab.dataset.tab}`).hidden = !active;
    if (active && focus) tab.focus();
  }
  if (scroll) document.querySelector('.portfolio-layout').scrollIntoView({block:'start'});
}
function select(name, options) {
  activate(name, options);
  if (location.hash !== `#${name}`) history.pushState(null, '', `#${name}`);
}
for (const [index, tab] of tabs.entries()) {
  tab.addEventListener('click', () => select(tab.dataset.tab));
  tab.addEventListener('keydown', event => {
    const next = {'ArrowDown':index+1,'ArrowRight':index+1,'ArrowUp':index-1,'ArrowLeft':index-1,'Home':0,'End':tabs.length-1}[event.key];
    if (next === undefined) return;
    event.preventDefault();
    const target = tabs[(next+tabs.length)%tabs.length];
    select(target.dataset.tab, {focus:true});
  });
}
window.addEventListener('hashchange', () => activate(location.hash.slice(1)));
window.addEventListener('popstate', () => activate(location.hash.slice(1)));
activate(location.hash.slice(1));
