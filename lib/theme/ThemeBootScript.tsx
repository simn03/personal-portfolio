import { DEFAULT_THEME_ID, THEMES } from "./themes";
import { THEME_STORAGE_KEY } from "./theme-storage";

/**
 * Inline script rendered by the SERVER root layout so the persisted theme is
 * applied to <html> before first paint (no flash of the wrong theme). Mode
 * metadata is derived from the single `THEMES` source of truth.
 */
export default function ThemeBootScript() {
  const meta = JSON.stringify(THEMES.map(({ id, mode }) => ({ id, mode })));
  const script = `(function(){try{var m=${meta};var t=localStorage.getItem(${JSON.stringify(
    THEME_STORAGE_KEY
  )})||${JSON.stringify(DEFAULT_THEME_ID)};var i=0;for(;i<m.length;i++){if(m[i].id===t)break;}if(i===m.length){t=${JSON.stringify(
    DEFAULT_THEME_ID
  )};}document.documentElement.setAttribute('data-theme',t);document.documentElement.classList.toggle('dark',m[i]&&m[i].mode==='dark');}catch(e){}})();`;

  return (
    <script dangerouslySetInnerHTML={{ __html: script }} data-theme-boot="true" />
  );
}
