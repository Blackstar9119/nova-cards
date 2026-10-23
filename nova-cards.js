/* Nova Cards v0.3.0 | MIT | https://github.com/Blackstar9119/nova-cards
   Raum, Thermostat, Licht, Dock, Modular – alle als custom:nova-*. */

/* ---------- Raum, Thermostat, Licht ---------- */
(() => {
var _t=Object.defineProperty;var bt=(s,t,e)=>t in s?_t(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e;var v=(s,t,e)=>bt(s,typeof t!="symbol"?t+"":t,e);var J="0.3.0",xt="https://github.com/Blackstar9119/nova-cards",z=s=>`${xt}#${s}`;var g=s=>String(s??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),yt=new Set(["off","unavailable","unknown","idle","docked","standby","closed","paused","not_home","none","ready"]),B=s=>!!s&&!yt.has(s.state),q=s=>String(s||"").split(".")[0],D=(s,t,e)=>s.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0})),$=(s,t)=>D(s,"hass-more-info",{entityId:t}),w=(s,t,e)=>D(s,"hass-action",{config:t,action:e}),X=(s,t)=>{try{return s.formatEntityState?s.formatEntityState(t):`${t.state}${t.attributes.unit_of_measurement?" "+t.attributes.unit_of_measurement:""}`}catch{return t.state}},T=(s,t)=>{let e=s.entities?.[t];return e&&(e.area_id||s.devices?.[e.device_id]?.area_id)||null},Y=s=>typeof s=="string"&&/^(\/|https?:|data:image)/.test(s),Q={light:"mdi:lightbulb",switch:"mdi:power-socket-eu",fan:"mdi:fan",vacuum:"mdi:robot-vacuum",input_boolean:"mdi:toggle-switch-outline",media_player:"mdi:speaker",button:"mdi:gesture-tap-button",input_button:"mdi:gesture-tap-button",script:"mdi:script-text-outline",scene:"mdi:palette",climate:"mdi:thermostat",cover:"mdi:window-shutter",lock:"mdi:lock",sensor:"mdi:eye"};function F(s,{tap:t,hold:e,holdMs:n=500}){let i,o=!1,a=()=>clearTimeout(i);s.addEventListener("pointerdown",()=>{o=!1,i=setTimeout(()=>{o=!0,e&&e()},n)}),s.addEventListener("pointerup",r=>{a(),!o&&t&&t(),r.stopPropagation()}),s.addEventListener("pointerleave",a),s.addEventListener("pointercancel",a),s.addEventListener("contextmenu",r=>r.preventDefault()),s.addEventListener("click",r=>r.stopPropagation()),s.addEventListener("keydown",r=>{(r.key==="Enter"||r.key===" ")&&(r.preventDefault(),r.stopPropagation(),t&&t())})}function _(s,t,e){customElements.get(s)||customElements.define(s,t),e&&(window.customCards=window.customCards||[],window.customCards.some(n=>n.type===s)||window.customCards.push({type:s,preview:!0,...e}))}var vt=`:host{
--nv-bg:var(--nova-background,linear-gradient(160deg,rgba(80,96,128,.55),rgba(22,27,42,.62)));
--nv-border:var(--nova-border-color,rgba(255,255,255,.14));
--nv-fg:var(--nova-text-color,#fff);
--nv-accent:var(--nova-accent-color,#f5b83d);
--nv-accent-fg:var(--nova-accent-text-color,#3a2a00);
--nv-active:var(--nova-active-color,#3d8bf5);
--nv-active-fg:var(--nova-active-text-color,#fff);
--nv-warn:var(--nova-warning-color,#7cc4ff);
--nv-chip:var(--nova-chip-color,rgba(255,255,255,.13));
--nv-radius:var(--nova-radius,24px);
--nv-blur:var(--nova-blur,20px)}`,C=`${vt}
:host{display:block;height:100%}
.g{height:100%;box-sizing:border-box;border-radius:var(--nv-radius);background:var(--nv-bg);
backdrop-filter:blur(var(--nv-blur)) saturate(150%);-webkit-backdrop-filter:blur(var(--nv-blur)) saturate(150%);
border:1px solid var(--nv-border);box-shadow:0 10px 30px rgba(0,0,0,.25),inset 0 1px 0 rgba(255,255,255,.12);
color:var(--nv-fg);overflow:hidden;position:relative;font-family:var(--ha-font-family-body,Roboto,sans-serif)}
ha-icon{--mdc-icon-size:20px;display:flex}`;var wt;function kt(){return customElements.get("ha-form")?Promise.resolve():wt||(wt=(async()=>{try{await(await(await window.loadCardHelpers()).createCardElement({type:"button",entity:"sun.sun"}))?.constructor?.getConfigElement?.()}catch(s){console.warn("[nova-cards] Editor-Komponenten nicht vorgeladen",s)}await Promise.race([customElements.whenDefined("ha-form"),new Promise(s=>setTimeout(s,3e3))])})())}var k=s=>s.flatMap(t=>t.schema?k(t.schema):t.name?[t.name]:[]),Et=s=>s==null||s===""||Array.isArray(s)&&!s.length;function L(s,t,e){let n={...s};return t.forEach(i=>Et(e[i])?delete n[i]:n[i]=e[i]),n}var S=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._forms=[]}set hass(t){this._hass=t,this._forms.forEach(e=>e.hass=t)}setConfig(t){let e=JSON.stringify(t);if(e===this._emitted){this._config=t;return}this._config=JSON.parse(e),this._onExternalConfig?.(),this._rebuild()}async _rebuild(){let t=this._bid=(this._bid||0)+1;await kt(),t===this._bid&&(this._forms=[],this._build())}_emit(t){this._config=t,this._emitted=JSON.stringify(t),D(this,"config-changed",{config:t})}_form(t,e,n){let i=document.createElement("ha-form");return i.hass=this._hass,i.schema=t,i.data=e,i.computeLabel=o=>this.constructor.labels?.[o.name]??o.name,i.computeHelper=o=>this.constructor.helpers?.[o.name],i.addEventListener("value-changed",o=>{o.stopPropagation(),i.data=o.detail.value,n(o.detail.value)}),this._forms.push(i),i}},M=`
.wrap{display:flex;flex-direction:column;gap:16px}
h3{margin:8px 0 0;font-size:15px;font-weight:600}
details.item{border:1px solid var(--divider-color,#444);border-radius:12px;overflow:hidden}
details.item>summary{display:flex;align-items:center;gap:10px;padding:10px 12px;cursor:pointer;list-style:none;background:var(--secondary-background-color)}
details.item>summary::-webkit-details-marker{display:none}
summary .lbl{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.body{padding:12px;display:flex;flex-direction:column;gap:12px}
.ib{background:none;border:none;color:var(--primary-text-color);cursor:pointer;padding:4px;border-radius:50%;display:flex}
.ib:hover{background:var(--secondary-background-color)}.ib[disabled]{opacity:.3;pointer-events:none}
.add{align-self:flex-start;display:flex;gap:6px;align-items:center;padding:8px 14px;border-radius:999px;border:1px solid var(--primary-color);background:none;color:var(--primary-color);cursor:pointer;font:inherit}
.maprow{display:flex;gap:6px;align-items:center}.maprow ha-form{flex:1}
.hint{font-size:12px;opacity:.7;margin:0}`,E=(s,t,e,n)=>{let i=document.createElement("button");return i.className="ib",i.title=t,i.disabled=!!n,i.innerHTML=`<ha-icon icon="${s}"></ha-icon>`,i.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),e()}),i},O=(s,t)=>{let e=document.createElement("button");return e.className="add",e.innerHTML=`<ha-icon icon="mdi:plus"></ha-icon>${s}`,e.addEventListener("click",n=>{n.preventDefault(),t()}),e};var tt=[{type:"grid",name:"",schema:[{name:"name",required:!0,selector:{text:{}}},{name:"icon",selector:{icon:{}}}]},{name:"temperature",selector:{entity:{domain:["sensor","climate"]}}},{name:"windows",selector:{entity:{multiple:!0,domain:"binary_sensor"}}},{name:"tap_action",selector:{ui_action:{}}}],et=[{name:"info",selector:{entity:{}}},{type:"grid",name:"",schema:[{name:"info_suffix",selector:{text:{}}},{name:"info_round",selector:{boolean:{}}}]},{name:"image",selector:{text:{}}},{name:"window_icon",selector:{icon:{}}}],nt=[{name:"entity",required:!0,selector:{entity:{}}},{type:"grid",name:"",schema:[{name:"icon",selector:{icon:{}},context:{icon_entity:"entity"}},{name:"name",selector:{text:{}}}]},{name:"state_entity",selector:{entity:{}}},{name:"tap_action",selector:{ui_action:{}}},{name:"hold_action",selector:{ui_action:{}}},{name:"icon_entity",selector:{entity:{}}}],St=[{type:"grid",name:"",schema:[{name:"state",selector:{text:{}}},{name:"value",selector:{text:{}}}]}],N=class extends S{_onExternalConfig(){this._maps=(this._config.buttons||[]).map(t=>Object.entries(t.icon_map||{})),this._open=this._open||new Set}_build(){let t=this.shadowRoot;t.innerHTML=`<style>${M}</style><div class="wrap"></div>`;let e=t.querySelector(".wrap"),n=a=>r=>this._emit(L(this._config,k(a),r));e.append(this._form(tt,this._config,n(tt)));let i=document.createElement("h3");i.textContent="Buttons",e.append(i),(this._config.buttons||[]).forEach((a,r)=>e.append(this._button(a,r))),e.append(O("Button hinzuf\xFCgen",()=>{let a=[...this._config.buttons||[],{}];this._maps.push([]),this._open.add(a.length-1),this._emit({...this._config,buttons:a}),this._rebuild()}));let o=document.createElement("details");o.className="item",o.innerHTML='<summary><ha-icon icon="mdi:cog-outline"></ha-icon><span class="lbl">Erweitert</span></summary><div class="body"></div>',o.querySelector(".body").append(this._form(et,this._config,n(et))),e.append(o)}_label(t,e){let n=t.entity?this._hass?.states[t.entity]:null;return`${e+1}. ${t.name||n?.attributes.friendly_name||t.entity||"Neuer Button"}`}_button(t,e){let n=(this._config.buttons||[]).length,i=document.createElement("details");i.className="item",i.open=this._open.has(e),i.addEventListener("toggle",()=>i.open?this._open.add(e):this._open.delete(e));let o=document.createElement("summary");o.innerHTML=`<ha-icon icon="${t.icon||"mdi:gesture-tap-button"}"></ha-icon><span class="lbl"></span>`,o.querySelector(".lbl").textContent=this._label(t,e),o.append(E("mdi:arrow-up","Nach oben",()=>this._move(e,-1),e===0),E("mdi:arrow-down","Nach unten",()=>this._move(e,1),e===n-1),E("mdi:delete-outline","L\xF6schen",()=>this._remove(e)));let a=document.createElement("div");return a.className="body",a.append(this._form(nt,t,r=>{let l=[...this._config.buttons],c=l[e];l[e]=L(c,k(nt),r),this._emit({...this._config,buttons:l}),o.querySelector(".lbl").textContent=this._label(l[e],e),!!c.icon_entity!=!!l[e].icon_entity&&this._rebuild()})),t.icon_entity&&a.append(this._mapEditor(e)),i.append(o,a),i}_mapEditor(t){var i;let e=document.createElement("div");e.innerHTML='<p class="hint">Icon je Zustand der Icon-Entit\xE4t. Wert: <code>mdi:…</code> oder Bild-URL (z. B. <code>/local/logos/netflix.svg</code>).</p>';let n=(i=this._maps)[t]||(i[t]=[]);return n.forEach(([o,a],r)=>{let l=document.createElement("div");l.className="maprow",l.append(this._form(St,{state:o,value:a},c=>{n[r]=[c.state??"",c.value??""],this._writeMap(t)}),E("mdi:close","Entfernen",()=>{n.splice(r,1),this._writeMap(t),this._rebuild()})),e.append(l)}),e.append(O("Zustand hinzuf\xFCgen",()=>{n.push(["",""]),this._rebuild()})),e}_writeMap(t){let e=Object.fromEntries(this._maps[t].filter(([o,a])=>o&&a)),n=[...this._config.buttons],i={...n[t]};Object.keys(e).length?i.icon_map=e:delete i.icon_map,n[t]=i,this._emit({...this._config,buttons:n})}_move(t,e){let n=t+e,i=[...this._config.buttons];[i[t],i[n]]=[i[n],i[t]],[this._maps[t],this._maps[n]]=[this._maps[n],this._maps[t]],this._open=new Set([n]),this._emit({...this._config,buttons:i}),this._rebuild()}_remove(t){let e=this._config.buttons.filter((n,i)=>i!==t);this._maps.splice(t,1),this._open=new Set,this._emit({...this._config,buttons:e}),this._rebuild()}};v(N,"labels",{name:"Name",icon:"Icon",temperature:"Temperatur (Sensor oder Thermostat)",windows:"Fenster & T\xFCren",tap_action:"Aktion beim Antippen",hold_action:"Aktion bei langem Dr\xFCcken",info:"Info-Entit\xE4t (ersetzt Temperatur)",info_suffix:"Info-Suffix",info_round:"Info runden",image:"Hintergrundbild (URL)",window_icon:"Icon f\xFCr offenes Fenster",entity:"Entit\xE4t",state_entity:"Status-Entit\xE4t",icon_entity:"Icon-Entit\xE4t",state:"Zustand",value:"Icon oder Bild-URL"}),v(N,"helpers",{windows:"Offenes Fenster = farbiger Rahmen + Icon",state_entity:"Optional: bestimmt An/Aus-Anzeige statt der Entit\xE4t selbst (z. B. TV-Bildschirmstatus)",icon_entity:"Optional: Icon wechselt je nach Zustand dieser Entit\xE4t (z. B. aktuelle TV-App)",image:"z. B. /local/raeume/wohnzimmer.jpg"});_("nova-room-card-editor",N);var st="nova-room-card",Lt=["light","switch","input_boolean","fan","cover","group","siren","humidifier","automation"],it={scene:["scene","turn_on"],script:["script","turn_on"],button:["button","press"],input_button:["input_button","press"]},$t=["button","input_button","script","scene"],zt=`
.room{display:flex;flex-direction:column;justify-content:space-between;padding:14px 16px;min-height:var(--nova-room-min-height,168px);transition:box-shadow .4s}
.room.click{cursor:pointer}
.bg{position:absolute;inset:0;background-size:cover;background-position:center;opacity:.45;filter:grayscale(.7);transition:all .5s}
.bgi{position:absolute;right:-14px;top:4px;--mdc-icon-size:130px;opacity:.07;transition:all .5s}
.room.lit .bgi{opacity:.18;color:var(--nv-accent)}.room.lit .bg{opacity:.85;filter:none}
.room.lit{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 1px color-mix(in srgb,var(--nv-accent) 40%,transparent),inset 0 1px 0 rgba(255,255,255,.12)}
.room.warn{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 1px color-mix(in srgb,var(--nv-warn) 60%,transparent),inset 0 1px 0 rgba(255,255,255,.12)}
.head{display:flex;align-items:center;gap:2px;position:relative;font-weight:600;font-size:15px;text-shadow:0 1px 4px rgba(0,0,0,.4)}
.head .chev{--mdc-icon-size:18px;opacity:.6}
.t{margin-left:auto;font-weight:500;font-size:13px;opacity:.85;display:flex;gap:8px;align-items:center}
.w{display:none;--mdc-icon-size:16px;color:var(--nv-warn)}.room.warn .w{display:flex}
.btns{display:flex;gap:9px;flex-wrap:wrap;position:relative}
.b{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);border:1px solid rgba(255,255,255,.1);transition:all .25s;cursor:pointer;-webkit-tap-highlight-color:transparent;user-select:none;outline:none}
.b:focus-visible{box-shadow:0 0 0 2px var(--nv-active)}
.b:active{transform:scale(.9)}
.b img{width:24px;height:24px;object-fit:contain}
.b.on{background:var(--nv-accent);color:var(--nv-accent-fg);border-color:transparent;box-shadow:0 0 16px color-mix(in srgb,var(--nv-accent) 55%,transparent)}
.b.on.alt{background:var(--nv-active);color:var(--nv-active-fg);box-shadow:0 0 16px color-mix(in srgb,var(--nv-active) 55%,transparent)}
.b.na{opacity:.3}`;function Tt(s){if(!s||typeof s!="object")throw new Error("Ung\xFCltige Konfiguration");let t={glow_domains:["light","switch"],temperature_decimals:1,...s};return!t.tap_action&&t.navigation_path&&(t.tap_action={action:"navigate",navigation_path:t.navigation_path}),t.windows=[].concat(t.windows||[]).filter(Boolean),t.buttons=(t.buttons||[]).filter(e=>e&&e.entity).map(e=>{let n={...e};return!n.tap_action&&n.action==="more-info"&&(n.tap_action={action:"more-info"}),n}),t}var P=class extends HTMLElement{static getConfigElement(){return document.createElement(`${st}-editor`)}static getStubConfig(t){let e=Object.keys(t.states);for(let n of Object.values(t.areas||{})){let i=e.filter(a=>a.startsWith("light.")&&T(t,a)===n.area_id).slice(0,4);if(!i.length)continue;let o=e.find(a=>a.startsWith("sensor.")&&T(t,a)===n.area_id&&t.states[a].attributes.device_class==="temperature");return{name:n.name,icon:n.icon||"mdi:home",...o?{temperature:o}:{},buttons:i.map(a=>({entity:a}))}}return{name:"Wohnzimmer",icon:"mdi:sofa",buttons:[]}}setConfig(t){this._c=Tt(t),this._built=!1,this._h&&(this._build(),this._update())}set hass(t){this._h=t,this._built||this._build(),this._update()}getCardSize(){return 3}getGridOptions(){return{columns:12,rows:3,min_rows:2,min_columns:6}}_build(){if(!this._c)return;this._built=!0;let t=this._c,e=this.shadowRoot||this.attachShadow({mode:"open"}),n=t.tap_action?.action;e.innerHTML=`<style>${C}${zt}</style>
<div class="g room ${n&&n!=="none"?"click":""}">
  ${t.image?`<div class="bg" style="background-image:url('${g(t.image)}')"></div>`:""}
  <ha-icon class="bgi" icon="${g(t.icon||"mdi:home")}"></ha-icon>
  <div class="head"><span>${g(t.name||"")}</span>${n==="navigate"?'<ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>':""}
    <span class="t"><ha-icon class="w" icon="${g(t.window_icon||"mdi:window-open-variant")}"></ha-icon><span class="tv"></span></span></div>
  <div class="btns"></div>
</div>`,this._room=e.querySelector(".room"),this._tv=e.querySelector(".tv");let i=e.querySelector(".btns");this._room.addEventListener("click",()=>{!n||n==="none"||w(this,{entity:t.temperature||t.info,tap_action:t.tap_action},"tap")}),this._btns=t.buttons.map(o=>{let a=document.createElement("div");return a.className="b",a.tabIndex=0,a.setAttribute("role","button"),F(a,{tap:()=>this._tap(o),hold:()=>this._hold(o)}),i.appendChild(a),[a,o]})}_tap(t){let e=t.tap_action;if(e&&e.action&&e.action!=="default")return w(this,{entity:t.entity,tap_action:e},"tap");let n=this._h,i=q(t.entity),o={entity_id:t.entity};if(it[i])return n.callService(...it[i],o);if(i==="media_player")return n.callService("media_player","toggle",o);if(Lt.includes(i))return n.callService("homeassistant","toggle",o);$(this,t.entity)}_hold(t){if(t.hold_action?.action)return w(this,{entity:t.entity,hold_action:t.hold_action},"hold");$(this,t.entity)}_icon(t){let e=this._h;if(t.icon_entity&&t.icon_map){let n=e.states[t.icon_entity],i=n&&t.icon_map[n.state];if(i)return i}return t.icon||e.states[t.entity]?.attributes.icon||Q[q(t.entity)]||"mdi:power"}_info(){let t=this._h,e=this._c;if(e.info){let o=t.states[e.info];if(!o)return"";let a=parseFloat(o.state);return(e.info_round&&!isNaN(a)?Math.round(a):X(t,o))+(e.info_suffix||"")}let n=e.temperature&&t.states[e.temperature],i=n?n.attributes.current_temperature??n.state:null;return i!==null&&!isNaN(parseFloat(i))?`${parseFloat(i).toFixed(e.temperature_decimals)}\xB0`:""}_update(){if(!this._h||!this._btns)return;let t=this._h,e=this._c;this._tv.textContent=this._info(),this._room.classList.toggle("warn",e.windows.some(i=>t.states[i]?.state==="on"));let n=!1;for(let[i,o]of this._btns){let a=t.states[o.entity],r=q(o.entity),l=o.state_entity?B(t.states[o.state_entity]):B(a),c=e.glow_domains.includes(r);i.classList.toggle("na",!a||a.state==="unavailable"),i.classList.toggle("on",l&&!$t.includes(r)),i.classList.toggle("alt",!c),l&&c&&(n=!0);let p=this._icon(o);i._ic!==p&&(i._ic=p,i.innerHTML=Y(p)?`<img src="${g(p)}" alt="">`:`<ha-icon icon="${g(p)}"></ha-icon>`),i.title=o.name||a?.attributes.friendly_name||o.entity}this._room.classList.toggle("lit",n)}};_(st,P,{name:"Nova Raum Card",description:"Raumkachel mit Temperatur, Fenster-Warnung und frei belegbaren Buttons.",documentationURL:z("nova-raum-card")});var I={};function ot(s,t,e,n){let i=`${t}|${e}`,o=I[i];if(o&&(o.loading||Date.now()-o.t<6e5))return o.data;I[i]={t:Date.now(),data:o?.data||null,loading:!0};let a=new Date(Date.now()-e*36e5).toISOString();return s.callApi("GET",`history/period/${a}?filter_entity_id=${t}&minimal_response&no_attributes`).then(r=>{let l=(r[0]||[]).map(c=>[new Date(c.last_changed).getTime(),parseFloat(c.state)]).filter(c=>!isNaN(c[1]));I[i]={t:Date.now(),data:l},n&&n()}).catch(()=>{I[i]={t:Date.now(),data:[]}}),I[i].data}var Ct=0;function at(s,{w:t=300,h:e=64,color:n="var(--nv-accent)"}={}){if(!s||s.length<2)return'<svg class="spk"></svg>';let i=s[0][0],o=Math.max(s[s.length-1][0],Date.now()),a=s.map(u=>u[1]),r=Math.min(...a),l=Math.max(...a),c=l-r||1,d="M"+s.concat([[o,s[s.length-1][1]]]).map(u=>[(u[0]-i)/(o-i||1)*t,e-6-(u[1]-r)/c*(e-14)]).map(u=>u[0].toFixed(1)+","+u[1].toFixed(1)).join("L"),m=`nvg${++Ct}`;return`<svg class="spk" viewBox="0 0 ${t} ${e}" preserveAspectRatio="none"><defs><linearGradient id="${m}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${n}" stop-opacity=".45"/><stop offset="1" stop-color="${n}" stop-opacity="0"/></linearGradient></defs><path d="${d}L${t},${e}L0,${e}Z" fill="url(#${m})"/><path d="${d}" fill="none" stroke="${n}" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>`}var Mt=(s,t)=>{let e=s?.states[t]?.attributes.hvac_modes||Object.keys(H);return[{name:"entity",required:!0,selector:{entity:{domain:"climate"}}},{type:"grid",name:"",schema:[{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}},context:{icon_entity:"entity"}}]},{name:"sensor",selector:{entity:{domain:"sensor",device_class:"temperature"}}},{name:"windows",selector:{entity:{multiple:!0,domain:"binary_sensor"}}},{type:"grid",name:"",schema:[{name:"show_graph",selector:{boolean:{}}},{name:"graph_hours",selector:{number:{min:1,max:168,mode:"box",unit_of_measurement:"h"}}}]},{type:"grid",name:"",schema:[{name:"show_modes",selector:{boolean:{}}},{name:"show_presets",selector:{boolean:{}}}]},{name:"compact",selector:{boolean:{}}},{name:"modes",selector:{select:{multiple:!0,options:e.map(n=>({value:n,label:H[n]||n}))}}},{type:"grid",name:"",schema:[{name:"step",selector:{number:{min:.1,max:5,step:.1,mode:"box",unit_of_measurement:"\xB0"}}},{name:"humidity",selector:{entity:{domain:"sensor",device_class:"humidity"}}}]},{name:"tap_action",selector:{ui_action:{}}}]},rt={show_graph:!0,graph_hours:24,show_modes:!0,show_presets:!1,compact:!0},j=class extends S{_build(){let t=this.shadowRoot;t.innerHTML=`<style>${M}</style><div class="wrap"></div>`;let e=Mt(this._hass,this._config.entity),n=k(e);t.querySelector(".wrap").append(this._form(e,{...rt,...this._config},i=>{let o=this._config.entity,a=L(this._config,n,i);Object.entries(rt).forEach(([r,l])=>a[r]===l&&delete a[r]),this._emit(a),a.entity!==o&&this._rebuild()}))}};v(j,"labels",{entity:"Thermostat",name:"Name",icon:"Icon",sensor:"Raumsensor (optional, genauer als Thermostat)",windows:"Fenster & T\xFCren",show_graph:"Verlauf anzeigen",graph_hours:"Verlauf (Stunden)",show_modes:"Modi anzeigen",show_presets:"Presets anzeigen",compact:"Kompakt",modes:"Nur diese Modi (leer = alle)",step:"Schrittweite",humidity:"Luftfeuchte-Sensor",tap_action:"Aktion beim Antippen des Kopfes"}),v(j,"helpers",{sensor:"F\xFCr Anzeige und Verlauf. Ohne: Ist-Temperatur des Thermostats",step:"Leer = Wert vom Thermostat (meist 0,5\xB0)"});_("nova-thermostat-card-editor",j);var ct="nova-thermostat-card",H={off:"Aus",heat:"Heizen",auto:"Auto",cool:"K\xFChlen",heat_cool:"Heizen/K\xFChlen",dry:"Trocknen",fan_only:"L\xFCften"},Ot={heating:"heizt",cooling:"k\xFChlt",idle:"Ziel erreicht",off:"aus",drying:"trocknet",fan:"l\xFCftet",preheating:"heizt vor"},At={off:"mdi:power",heat:"mdi:fire",auto:"mdi:thermostat-auto",cool:"mdi:snowflake",heat_cool:"mdi:sun-snowflake-variant",dry:"mdi:water-percent",fan_only:"mdi:fan"},Nt=`
.th{padding:14px 16px;display:flex;flex-direction:column;gap:10px}
.th.warn{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 1px color-mix(in srgb,var(--nv-warn) 60%,transparent)}
.hd{display:flex;align-items:center;gap:10px;cursor:pointer}
.ic{width:38px;height:38px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);transition:all .3s}
.ic.on{background:var(--nv-accent);color:var(--nv-accent-fg);box-shadow:0 0 14px color-mix(in srgb,var(--nv-accent) 50%,transparent)}
.ic.cool{background:var(--nv-active);color:var(--nv-active-fg)}
.nm{flex:1;min-width:0}.nm b{display:block;font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nm small{display:block;font-size:12px;opacity:.65}
.w{display:none;--mdc-icon-size:18px;color:var(--nv-warn)}.th.warn .w{display:flex}
.main{display:flex;align-items:center;gap:10px}
.cur{font-size:40px;font-weight:300;line-height:1;letter-spacing:-1px}
.hum{font-size:12px;opacity:.65;margin-top:4px}
.stp{display:flex;align-items:center;gap:8px;margin-left:auto;background:rgba(0,0,0,.25);border-radius:999px;padding:5px;font-weight:600;font-size:16px}
.stp span{min-width:52px;text-align:center}
.sb{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);cursor:pointer;user-select:none;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
.sb:active{transform:scale(.9)}.sb ha-icon{--mdc-icon-size:18px}
.stp.pend span{color:var(--nv-accent)}
.spk{width:100%;height:56px;display:block}
.pills{display:flex;flex-wrap:wrap;gap:7px}
.pill{padding:7px 12px;border-radius:999px;background:var(--nv-chip);font-size:12.5px;cursor:pointer;display:inline-flex;gap:6px;align-items:center;border:1px solid rgba(255,255,255,.08);white-space:nowrap;-webkit-tap-highlight-color:transparent}
.pill:active{transform:scale(.94)}.pill ha-icon{--mdc-icon-size:16px}
.pill.on{background:var(--nv-accent);color:var(--nv-accent-fg)}.pill.on.off{background:var(--nv-active);color:var(--nv-active-fg)}
.na{opacity:.4;pointer-events:none}`,It=`:host{container-type:inline-size}
.th{padding:10px 12px;gap:6px;min-width:0}.ic{width:30px;height:30px}.ic ha-icon{--mdc-icon-size:17px}.nm b{font-size:13px}.nm small{font-size:11px}
.cur{font-size:28px;white-space:nowrap}.hum{font-size:11px;margin-top:2px;white-space:nowrap}
.main{flex-wrap:wrap;row-gap:6px;min-width:0}
.stp{padding:3px;gap:6px;font-size:14px;flex:none}.stp span{min-width:44px}
.sb{width:30px;height:30px}.sb ha-icon{--mdc-icon-size:15px}.spk{height:32px}
.pills{gap:5px}.pill{padding:4px 9px;font-size:11.5px}.pill ha-icon{--mdc-icon-size:14px}
.hd{order:0}.modes{order:1}.presets{order:2}.main{order:3}.graph{order:4}
@container (max-width:260px){.th{padding:8px 10px}.cur{font-size:24px}.stp{gap:3px;font-size:13px}.stp span{min-width:38px}.sb{width:26px;height:26px}.pill{padding:3px 7px;font-size:11px}.hum{display:none}}`;function jt(s){if(!s||!s.entity)throw new Error("entity (Thermostat) fehlt");return{show_graph:!0,graph_hours:24,show_modes:!0,show_presets:!1,...s,windows:[].concat(s.windows||[]).filter(Boolean)}}var K=class extends HTMLElement{static getConfigElement(){return document.createElement(`${ct}-editor`)}static getStubConfig(t){return{entity:Object.keys(t.states).find(n=>n.startsWith("climate."))||"climate.wohnzimmer"}}setConfig(t){this._c=jt(t),this._built=!1,this._pend=null,this._h&&(this._build(),this._update())}set hass(t){this._h=t,this._built||this._build(),this._update()}getCardSize(){return 4}getGridOptions(){return{columns:9,rows:"auto",min_columns:6}}_build(){if(!this._c)return;this._built=!0;let t=this.shadowRoot||this.attachShadow({mode:"open"});t.innerHTML=`<style>${C}${Nt}${this._c.compact===!1?"":It}</style>
<div class="g th">
  <div class="hd"><div class="ic"><ha-icon></ha-icon></div><div class="nm"><b></b><small></small></div><ha-icon class="w" icon="mdi:window-open-variant"></ha-icon></div>
  <div class="main"><div><div class="cur">–</div><div class="hum"></div></div>
    <div class="stp"><div class="sb" data-v="-1"><ha-icon icon="mdi:minus"></ha-icon></div><span>–</span><div class="sb" data-v="1"><ha-icon icon="mdi:plus"></ha-icon></div></div></div>
  <div class="graph"></div>
  <div class="pills modes"></div>
  <div class="pills presets"></div>
</div>`;let e=n=>t.querySelector(n);this._e={card:e(".th"),ic:e(".ic"),icon:e(".ic ha-icon"),name:e(".nm b"),sub:e(".nm small"),cur:e(".cur"),hum:e(".hum"),stp:e(".stp"),tgt:e(".stp span"),graph:e(".graph"),modes:e(".modes"),presets:e(".presets")},this._sig={},e(".hd").addEventListener("click",()=>{let n=this._c.tap_action;if(n?.action&&n.action!=="default")return w(this,{entity:this._c.entity,tap_action:n},"tap");$(this,this._c.entity)}),t.querySelectorAll(".sb").forEach(n=>n.addEventListener("pointerup",i=>{i.preventDefault(),this._step(+n.dataset.v)})),e(".modes").addEventListener("click",n=>{let i=n.composedPath().find(o=>o.dataset?.m)?.dataset.m;i&&this._h.callService("climate","set_hvac_mode",{entity_id:this._c.entity,hvac_mode:i})}),e(".presets").addEventListener("click",n=>{let i=n.composedPath().find(o=>o.dataset?.p)?.dataset.p;i&&this._h.callService("climate","set_preset_mode",{entity_id:this._c.entity,preset_mode:i})})}_stepSize(t){return this._c.step||t.target_temp_step||.5}_step(t){let e=this._h.states[this._c.entity];if(!e)return;let n=e.attributes,i=this._stepSize(n),o=this._pend??(parseFloat(n.temperature)||20),a=Math.min(n.max_temp??35,Math.max(n.min_temp??5,Math.round((o+t*i)/i)*i));this._pend=a,this._e.tgt.textContent=`${a.toFixed(1)}\xB0`,this._e.stp.classList.add("pend"),clearTimeout(this._tm),this._tm=setTimeout(()=>{this._h.callService("climate","set_temperature",{entity_id:this._c.entity,temperature:a}).catch(r=>console.warn("[nova-cards] Temperatur setzen fehlgeschlagen",r)).finally(()=>setTimeout(()=>{this._pend=null,this._e.stp.classList.remove("pend"),this._update()},1500))},this._c.debounce??800)}_update(){if(!this._h||!this._e)return;let t=this._h,e=this._c,n=this._e,i=t.states[e.entity];if(n.card.classList.toggle("na",!i||i.state==="unavailable"),!i){n.name.textContent=e.name||e.entity,n.sub.textContent="nicht gefunden";return}let o=i.attributes,a=o.hvac_action,r=a==="heating"||a==="preheating",l=a==="cooling";n.ic.classList.toggle("on",r),n.ic.classList.toggle("cool",l),n.icon.setAttribute("icon",e.icon||(r?"mdi:fire":l?"mdi:snowflake":"mdi:thermostat")),n.name.textContent=e.name||o.friendly_name||e.entity,n.sub.textContent=[H[i.state]||i.state,a&&a!==i.state?Ot[a]||a:""].filter(Boolean).join(" \xB7 "),n.card.classList.toggle("warn",e.windows.some(h=>t.states[h]?.state==="on"));let c=e.sensor&&t.states[e.sensor],p=c?parseFloat(c.state):NaN;isNaN(p)&&(p=parseFloat(o.current_temperature)),n.cur.textContent=isNaN(p)?"–":`${p.toFixed(1)}\xB0`;let d=e.humidity?parseFloat(t.states[e.humidity]?.state):parseFloat(o.current_humidity);n.hum.textContent=isNaN(d)?"":`${Math.round(d)} % Luftfeuchte`;let m=i.state==="off"||o.temperature==null;if(n.stp.style.display=m&&this._pend==null?"none":"",this._pend==null&&(n.tgt.textContent=o.temperature!=null?`${Number(o.temperature).toFixed(1)}\xB0`:"–"),e.show_graph){let h=e.sensor||e.graph_entity,y=h?ot(t,h,e.graph_hours,()=>this._update()):null,Z=y?`${y.length}|${y[y.length-1]?.[1]}`:"";this._sig.g!==Z&&(this._sig.g=Z,n.graph.innerHTML=y?at(y):"")}else n.graph.innerHTML="";let f=(e.show_modes?e.modes?.length?e.modes.filter(h=>(o.hvac_modes||[]).includes(h)):o.hvac_modes||[]:[]).map(h=>`<div class="pill ${i.state===h?"on":""} ${h==="off"?"off":""}" data-m="${g(h)}"><ha-icon icon="${At[h]||"mdi:thermostat"}"></ha-icon>${g((e.mode_names||{})[h]||H[h]||h)}</div>`).join("");this._sig.m!==f&&(this._sig.m=f,n.modes.innerHTML=f);let x=(e.show_presets?o.preset_modes||[]:[]).map(h=>`<div class="pill ${o.preset_mode===h?"on":""}" data-p="${g(h)}">${g(h)}</div>`).join("");this._sig.p!==x&&(this._sig.p=x,n.presets.innerHTML=x)}};_(ct,K,{name:"Nova Thermostat Card",description:"Thermostat mit Ist-/Solltemperatur, \xB1 Stepper, Verlauf und Modi.",documentationURL:z("nova-thermostat-card")});function lt(s,t){let e=n=>{let i=(n+s/60)%6;return Math.round(255*(1-t*Math.max(0,Math.min(i,4-i,1))))};return[e(5),e(3),e(1)]}var U=s=>"#"+s.map(t=>t.toString(16).padStart(2,"0")).join(""),Ht=s=>{let t=parseInt(s.slice(1),16);return[t>>16&255,t>>8&255,t&255]};function Rt(s){let t=s/100,e=t<=66?255:329.7*Math.pow(t-60,-.1332),n=t<=66?99.47*Math.log(t)-161.12:288.12*Math.pow(t-60,-.0755),i=t>=66?255:t<=19?0:138.52*Math.log(t-10)-305.04;return[e,n,i].map(o=>Math.max(0,Math.min(255,Math.round(o))))}var qt=["hs","xy","rgb","rgbw","rgbww"],dt=s=>(s.supported_color_modes||[]).some(t=>qt.includes(t)),pt=s=>(s.supported_color_modes||[]).includes("color_temp"),A=s=>s.startsWith("k")?U(Rt(+s.slice(1))):s,ht=s=>s.startsWith("k")?{color_temp_kelvin:+s.slice(1)}:{rgb_color:Ht(s)};var Dt=`
:host{display:block}
.w{display:flex;flex-direction:column;gap:12px;padding:12px;border-radius:12px;background:var(--secondary-background-color)}
.disc{position:relative;width:min(240px,100%);aspect-ratio:1;align-self:center;border-radius:50%;touch-action:none;cursor:crosshair;
background:radial-gradient(closest-side,#fff,rgba(255,255,255,0)),conic-gradient(from 90deg,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00);
box-shadow:0 2px 10px rgba(0,0,0,.3)}
.mk{position:absolute;width:24px;height:24px;margin:-12px 0 0 -12px;border-radius:50%;border:3px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,.6);pointer-events:none;display:none}
.lbl{font-size:12px;opacity:.7}
.kt{-webkit-appearance:none;appearance:none;width:100%;height:24px;border-radius:12px;margin:0;outline:none;background:linear-gradient(90deg,#ffa94d,#fff1dc,#cfe3ff)}
.kt::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;border-radius:50%;background:#fff;border:3px solid rgba(0,0,0,.3)}
.kt::-moz-range-thumb{width:24px;height:24px;border-radius:50%;background:#fff;border:3px solid rgba(0,0,0,.3)}
.row{display:flex;align-items:center;gap:10px}
.sw{width:36px;height:36px;border-radius:50%;flex:none;border:2px solid var(--divider-color,#888);background:transparent}
button{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:9px;border-radius:999px;border:none;background:var(--primary-color);color:var(--text-primary-color,#fff);font:inherit;font-weight:600;cursor:pointer}
button:disabled{opacity:.4;cursor:default}
ha-icon{--mdc-icon-size:18px;display:flex}`,V=class extends HTMLElement{connectedCallback(){if(this._built)return;this._built=!0;let t=+(this.getAttribute("kmin")||2e3),e=+(this.getAttribute("kmax")||6500),n=this.attachShadow({mode:"open"});n.innerHTML=`<style>${Dt}</style><div class="w">
<div class="disc"><div class="mk"></div></div>
<div class="lbl">oder Wei\xDFton</div><input class="kt" type="range" min="${t}" max="${e}" step="100" value="${Math.round((t+e)/200)*100}">
<div class="row"><div class="sw"></div><button disabled><ha-icon icon="mdi:plus"></ha-icon>Als Knopf hinzuf\xFCgen</button></div></div>`;let i=n.querySelector(".disc"),o=n.querySelector(".mk"),a=n.querySelector(".sw"),r=n.querySelector("button"),l=n.querySelector(".kt"),c=d=>{this._v=d,a.style.background=A(d),r.disabled=!1},p=d=>{let m=i.getBoundingClientRect(),u=m.width/2,f=d.clientX-m.left-u,b=d.clientY-m.top-u,x=(Math.atan2(b,f)*180/Math.PI+360)%360,h=Math.min(1,Math.hypot(f,b)/u),y=U(lt(x,h));Object.assign(o.style,{display:"block",left:`${50+Math.cos(x*Math.PI/180)*h*50}%`,top:`${50+Math.sin(x*Math.PI/180)*h*50}%`,background:y}),c(y)};i.addEventListener("pointerdown",d=>{i.setPointerCapture?.(d.pointerId),this._drag=!0,p(d)}),i.addEventListener("pointermove",d=>this._drag&&p(d)),i.addEventListener("pointerup",d=>{this._drag=!1,p(d)}),l.addEventListener("input",()=>{o.style.display="none",c(`k${l.value}`)}),r.addEventListener("click",d=>{d.preventDefault(),this._v&&this.dispatchEvent(new CustomEvent("color-add",{detail:{value:this._v}}))})}};_("nova-color-input",V);var mt=[{type:"grid",name:"",schema:[{name:"title",selector:{text:{}}},{name:"icon",selector:{icon:{}}}]},{name:"area",selector:{area:{}}},{name:"exclude",selector:{entity:{multiple:!0,domain:"light"}}},{type:"grid",name:"",schema:[{name:"show_header",selector:{boolean:{}}},{name:"show_all_off",selector:{boolean:{}}},{name:"use_light_color",selector:{boolean:{}}},{name:"show_colors",selector:{boolean:{}}}]}],ut=[{name:"entity",required:!0,selector:{entity:{domain:"light"}}},{type:"grid",name:"",schema:[{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}},context:{icon_entity:"entity"}}]},{name:"tap_action",selector:{ui_action:{}}},{name:"hold_action",selector:{ui_action:{}}}],ft={show_header:!0,show_all_off:!0,use_light_color:!0,show_colors:!0},W=s=>typeof s=="string"?{entity:s}:{...s},Ft=`
.dots{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.dot{position:relative;width:30px;height:30px;border-radius:50%;border:2px solid var(--divider-color,#888);box-sizing:border-box}
.dot button{position:absolute;top:-6px;right:-6px;width:18px;height:18px;padding:0;border-radius:50%;border:none;background:var(--error-color,#db4437);color:#fff;font:700 12px/18px sans-serif;cursor:pointer}
.sub{font-size:13px;font-weight:600;margin:4px 0 0}`,R=class extends S{setConfig(t){JSON.stringify(t)!==this._emitted&&super.setConfig(t)}_onExternalConfig(){let t=this._config;t.entity&&(t.entities=[t.entity,...t.entities||[]],delete t.entity),t.entities=(t.entities||[]).map(W),this._open||(this._open=new Set),this._pickerOpen||(this._pickerOpen=new Set)}_build(){let t=this.shadowRoot;t.innerHTML=`<style>${M}${Ft}</style><div class="wrap"></div>`;let e=t.querySelector(".wrap"),n=k(mt);e.append(this._form(mt,{...ft,...this._config},r=>this._emit(this._clean(L(this._config,n,r)))));let i=document.createElement("h3");i.textContent="Lampen";let o=document.createElement("p");o.className="hint",o.textContent="Genau eine Lampe (ohne Bereich) = Einzelkachel. Mehrere = Sammelkarte.",e.append(i,o),this._config.entities.forEach((r,l)=>e.append(this._lamp(r,l))),e.append(O("Lampe hinzuf\xFCgen",()=>{let r=[...this._config.entities,{entity:""}];this._open.add(r.length-1),this._set(r),this._rebuild()}));let a=document.createElement("h3");a.textContent="Farbkn\xF6pfe f\xFCr alle Lampen",e.append(a,this._colors("all",this._config.colors||[],r=>{this._emit(this._clean({...this._config,colors:r})),this._config.entities=this._internal}))}_clean(t){let e={...t};return this._internal=(t.entities||[]).map(W),Object.entries(ft).forEach(([n,i])=>e[n]===i&&delete e[n]),e.colors?.length||delete e.colors,e.entities=this._internal.map(n=>{let i={...n};return i.colors?.length||delete i.colors,Object.keys(i).length===1&&i.entity?i.entity:i}),e}_set(t){this._emit(this._clean({...this._config,entities:t})),this._config.entities=this._internal}_emit(t){super._emit(t),this._config={...t,entities:this._internal||(t.entities||[]).map(W)}}_label(t,e){let n=t.entity?this._hass?.states[t.entity]:null;return`${e+1}. ${t.name||n?.attributes.friendly_name||t.entity||"Neue Lampe"}`}_lamp(t,e){let n=this._config.entities.length,i=document.createElement("details");i.className="item",i.open=this._open.has(e),i.addEventListener("toggle",()=>i.open?this._open.add(e):this._open.delete(e));let o=document.createElement("summary");o.innerHTML=`<ha-icon icon="${t.icon||"mdi:lightbulb"}"></ha-icon><span class="lbl"></span>`,o.querySelector(".lbl").textContent=this._label(t,e),o.append(E("mdi:arrow-up","Nach oben",()=>this._move(e,-1),e===0),E("mdi:arrow-down","Nach unten",()=>this._move(e,1),e===n-1),E("mdi:delete-outline","L\xF6schen",()=>this._removeLamp(e)));let a=document.createElement("div");a.className="body";let r=k(ut);a.append(this._form(ut,t,c=>{let p=[...this._config.entities],d=p[e];p[e]=L(d,r,c),this._set(p),o.querySelector(".lbl").textContent=this._label(p[e],e),d.entity!==p[e].entity&&this._rebuild()}));let l=document.createElement("div");return l.className="sub",l.textContent="Farbkn\xF6pfe dieser Lampe",a.append(l,this._colors(`l${e}`,t.colors||[],c=>{let p=[...this._config.entities];p[e]={...p[e],colors:c},this._set(p)},t.entity)),i.append(o,a),i}_colors(t,e,n,i){let o=document.createElement("div");o.style.cssText="display:flex;flex-direction:column;gap:10px";let a=document.createElement("div");if(a.className="dots",e.forEach((c,p)=>{let d=document.createElement("div");d.className="dot",d.style.background=A(c),d.title=c;let m=document.createElement("button");m.textContent="\xD7",m.title="Entfernen",m.addEventListener("click",u=>{u.preventDefault(),n(e.filter((f,b)=>b!==p)),this._rebuild()}),d.append(m),a.append(d)}),!e.length){let c=document.createElement("span");c.className="hint",c.textContent="Noch keine – Farbe w\xE4hlen und hinzuf\xFCgen.",a.append(c)}let r=this._pickerOpen.has(t),l=O(r?"Farbscheibe schlie\xDFen":"Farbe hinzuf\xFCgen",()=>{r?this._pickerOpen.delete(t):this._pickerOpen.add(t),this._rebuild()});if(o.append(a,l),r){let c=i&&this._hass?.states[i]?.attributes,p=document.createElement("nova-color-input");c?.min_color_temp_kelvin&&p.setAttribute("kmin",c.min_color_temp_kelvin),c?.max_color_temp_kelvin&&p.setAttribute("kmax",c.max_color_temp_kelvin),p.addEventListener("color-add",d=>{e.includes(d.detail.value)||n([...e,d.detail.value]),this._rebuild()}),o.append(p)}return o}_move(t,e){let n=t+e,i=[...this._config.entities];[i[t],i[n]]=[i[n],i[t]],this._open=new Set([n]),this._pickerOpen=new Set,this._set(i),this._rebuild()}_removeLamp(t){this._open=new Set,this._pickerOpen=new Set,this._set(this._config.entities.filter((e,n)=>n!==t)),this._rebuild()}};v(R,"labels",{title:"Titel",icon:"Icon",area:"Bereich (alle Lampen automatisch)",exclude:"Ausblenden (bei Bereich)",show_header:"Kopfzeile",show_all_off:"„Alle aus“-Knopf",use_light_color:"In Lichtfarbe leuchten",show_colors:"Farbkn\xF6pfe anzeigen",entity:"Lampe",name:"Name",tap_action:"Aktion beim Antippen",hold_action:"Aktion bei langem Dr\xFCcken"}),v(R,"helpers",{area:"Optional. Neue Lampen im Bereich erscheinen von selbst"});_("nova-light-card-editor",R);var gt="nova-light-card",Bt=`
:host{container-type:inline-size}
.lc{padding:12px;display:flex;flex-direction:column;gap:10px}
.hd{display:flex;align-items:center;gap:8px;font-weight:600;font-size:14px;padding:0 4px}
.hd ha-icon{--mdc-icon-size:18px;opacity:.8}.hd .cnt{opacity:.6;font-weight:500;font-size:12px}
.hd .all{margin-left:auto;padding:4px 10px;border-radius:999px;background:var(--nv-chip);font-size:11.5px;font-weight:500;cursor:pointer;display:none}
.hd .all.show{display:block}.hd .all:active{transform:scale(.94)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(var(--nova-light-min-width,150px),1fr));gap:8px}
.t{position:relative;border-radius:16px;background:var(--nv-chip);border:1px solid rgba(255,255,255,.08);padding:10px;display:flex;flex-direction:column;gap:8px;overflow:hidden;transition:background .3s,box-shadow .3s;min-width:0}
.t.on{background:color-mix(in srgb,var(--lc,var(--nv-accent)) 22%,rgba(255,255,255,.08));box-shadow:0 0 18px color-mix(in srgb,var(--lc,var(--nv-accent)) 30%,transparent);border-color:color-mix(in srgb,var(--lc,var(--nv-accent)) 45%,transparent)}
.t.na{opacity:.35}
.top{display:flex;align-items:center;gap:8px;cursor:pointer;-webkit-tap-highlight-color:transparent;user-select:none;outline:none}
.ic{width:34px;height:34px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.12);transition:all .3s}
.ic ha-icon{--mdc-icon-size:18px}
.t.on .ic{background:var(--lc,var(--nv-accent));color:var(--nv-accent-fg);box-shadow:0 0 12px color-mix(in srgb,var(--lc,var(--nv-accent)) 60%,transparent)}
.top:active .ic{transform:scale(.9)}
.nm{flex:1;min-width:0}.nm b{display:block;font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.nm small{display:block;font-size:11px;opacity:.6}
input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:22px;border-radius:11px;margin:0;outline:none;
background:linear-gradient(90deg,var(--lc,var(--nv-accent)) 0 var(--p,0%),rgba(255,255,255,.14) var(--p,0%) 100%)}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.4)}
input[type=range]::-moz-range-thumb{width:22px;height:22px;border-radius:50%;background:#fff;border:none}
.t:not(.on) input[type=range]{opacity:.5}
.dots{display:flex;flex-wrap:wrap;gap:6px}.dots:empty{display:none}
.dot{width:24px;height:24px;border-radius:50%;cursor:pointer;border:2px solid rgba(255,255,255,.45);box-sizing:border-box;-webkit-tap-highlight-color:transparent}
.dot:active{transform:scale(.88)}
.single .lc,.lc.single{padding:0}.single .grid{display:block}
.single .t{border:none;border-radius:var(--nv-radius);background:transparent;padding:12px;height:100%;box-sizing:border-box}
@container (max-width:300px){.grid{grid-template-columns:1fr}}`,Pt=s=>typeof s=="string"?s:s?.entity;function Kt(s){if(!s||typeof s!="object")throw new Error("Ung\xFCltige Konfiguration");let t=[].concat(s.entity?[s.entity]:[],s.entities||[]).filter(Pt).map(e=>typeof e=="string"?{entity:e}:{...e});if(!t.length&&!s.area)throw new Error("entities oder area angeben");return{show_all_off:!0,show_header:!0,...s,entities:t}}var G=class extends HTMLElement{static getConfigElement(){return document.createElement(`${gt}-editor`)}static getStubConfig(t){for(let e of Object.values(t.areas||{}))if(Object.keys(t.states).filter(i=>i.startsWith("light.")&&T(t,i)===e.area_id).length)return{title:e.name,area:e.area_id};return{entities:Object.keys(t.states).filter(e=>e.startsWith("light.")).slice(0,4)}}setConfig(t){this._c=Kt(t),this._built=!1,this._h&&(this._build(),this._update())}set hass(t){let e=this._list;if(this._h=t,!this._c)return;let n=this._lights();(!this._built||n.join()!==(e||[]).join())&&this._build(),this._update()}getCardSize(){return 1+Math.ceil((this._list?.length||2)/2)*2}get _single(){return this._c&&!this._c.area&&this._c.entities.length===1}getGridOptions(){return this._single?{columns:6,rows:"auto",min_columns:3}:{columns:12,rows:"auto",min_columns:4}}_lights(){let t=this._c,e=this._h,n=t.entities.map(i=>i.entity);if(t.area&&e){let i=new Set(t.exclude||[]);Object.keys(e.states).filter(o=>o.startsWith("light.")&&T(e,o)===t.area&&!i.has(o)&&!n.includes(o)).filter(o=>{let a=e.entities?.[o];return!a||!a.hidden&&!a.entity_category}).sort((o,a)=>(e.states[o].attributes.friendly_name||o).localeCompare(e.states[a].attributes.friendly_name||a)).forEach(o=>n.push(o))}return n}_build(){if(!this._c||!this._h)return;this._built=!0;let t=this._c,e=this._h;this._list=this._lights();let n=this.shadowRoot||this.attachShadow({mode:"open"}),i=t.title??(t.area?e.areas?.[t.area]?.name:"")??"";n.innerHTML=`<style>${C}${Bt}</style>
<div class="g lc ${this._single?"single":""}">
  ${!this._single&&t.show_header&&(i||t.show_all_off)?`<div class="hd"><ha-icon icon="${g(t.icon||"mdi:lightbulb-group")}"></ha-icon><span>${g(i)}</span><span class="cnt"></span><div class="all">Alle aus</div></div>`:""}
  <div class="grid"></div>
</div>`,this._cnt=n.querySelector(".cnt"),this._all=n.querySelector(".all"),this._all?.addEventListener("click",()=>{let r=this._list.filter(l=>this._h.states[l]?.state==="on");r.length&&this._h.callService("light","turn_off",{entity_id:r})});let o=n.querySelector(".grid"),a=Object.fromEntries(t.entities.map(r=>[r.entity,r]));this._tiles=this._list.map(r=>{let l=a[r]||{entity:r},c=document.createElement("div");c.className="t",c.innerHTML='<div class="top" tabindex="0" role="button"><div class="ic"><ha-icon></ha-icon></div><div class="nm"><b></b><small></small></div></div><input type="range" min="1" max="100"><div class="dots"></div>';let p=c.querySelector(".top"),d=c.querySelector("input"),m=c.querySelector(".dots");return m.addEventListener("click",u=>{let f=u.composedPath().find(b=>b.dataset?.c)?.dataset.c;f&&this._h.callService("light","turn_on",{entity_id:r,...ht(f)})}),F(p,{tap:()=>l.tap_action?.action?w(this,{entity:r,tap_action:l.tap_action},"tap"):this._h.callService("light","toggle",{entity_id:r}),hold:()=>l.hold_action?.action?w(this,{entity:r,hold_action:l.hold_action},"hold"):$(this,r)}),d.addEventListener("pointerdown",()=>c._drag=!0),d.addEventListener("input",()=>c.style.setProperty("--p",`${d.value}%`)),d.addEventListener("change",()=>{this._h.callService("light","turn_on",{entity_id:r,brightness_pct:+d.value}),setTimeout(()=>c._drag=!1,800)}),o.appendChild(c),{id:r,o:l,t:c,ic:c.querySelector("ha-icon"),nm:c.querySelector("b"),st:c.querySelector("small"),sl:d,dots:m}})}_update(){if(!this._h||!this._tiles)return;let t=this._h,e=0;for(let n of this._tiles){let i=t.states[n.id],o=i?.attributes||{},a=i?.state==="on",r=!i||i.state==="unavailable";a&&e++;let l=(o.supported_color_modes||[]).some(f=>f!=="onoff"),c=a?Math.max(1,Math.round((o.brightness||0)/2.55)):0;n.t.classList.toggle("on",a),n.t.classList.toggle("na",r),n.ic.setAttribute("icon",n.o.icon||o.icon||(a?"mdi:lightbulb-on":"mdi:lightbulb-outline")),n.nm.textContent=n.o.name||this._strip(o.friendly_name||n.id),n.st.textContent=r?"nicht erreichbar":a?l?`${c} %`:"an":"aus";let p=this._c.use_light_color!==!1&&a&&o.rgb_color;p?n.t.style.setProperty("--lc",`rgb(${p.join(",")})`):n.t.style.removeProperty("--lc"),n.sl.style.display=l&&!r?"":"none",n.t._drag||(n.sl.value=c||1,n.t.style.setProperty("--p",`${c}%`));let m=!r&&(dt(o)||pt(o))&&this._c.show_colors!==!1?[...n.o.colors||[],...this._c.colors||[]].filter((f,b,x)=>x.indexOf(f)===b):[],u=m.join();n.dots._sig!==u&&(n.dots._sig=u,n.dots.innerHTML=m.map(f=>`<div class="dot" data-c="${g(f)}" style="background:${g(A(f))}"></div>`).join(""))}this._cnt&&(this._cnt.textContent=e?`${e} an`:""),this._all?.classList.toggle("show",!!this._c.show_all_off&&e>0)}_strip(t){let e=this._c.strip_prefix??this._c.title??(this._c.area?this._h.areas?.[this._c.area]?.name:"");return e&&t.toLowerCase().startsWith(e.toLowerCase()+" ")?t.slice(e.length+1):t}};_(gt,G,{name:"Nova Licht Card",description:"Lampen als Kacheln: Antippen schaltet, Regler dimmt, leuchtet in der Lichtfarbe.",documentationURL:z("nova-licht-card")});
})();

/* ---------- Nova Dock Card + Nova Modular Card ---------- */
(() => {
const VERSION = '0.3.0';
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const OFF = new Set(['off','unavailable','unknown','idle','docked','standby','closed','paused','not_home','none','ready']);
const isOn = s => !!s && !OFF.has(s.state);
const fire = (el, type, detail) => el.dispatchEvent(new CustomEvent(type, {detail, bubbles: true, composed: true}));
const nav = p => { history.pushState(null, '', p); window.dispatchEvent(new CustomEvent('location-changed', {detail: {replace: false}})); };
const countOn = (h, group, ex) => ((h.states[group]?.attributes.entity_id) || []).filter(id => !(ex || []).includes(id) && isOn(h.states[id])).length;
const define = (tag, cls, meta) => {
  if (!customElements.get(tag)) customElements.define(tag, cls);
  if (meta) { window.customCards = window.customCards || []; if (!window.customCards.some(c => c.type === tag)) window.customCards.push({type: tag, preview: true, ...meta}); }
};

const VARS = `:host{
--nv-bg:var(--nova-background,linear-gradient(160deg,rgba(80,96,128,.55),rgba(22,27,42,.62)));
--nv-border:var(--nova-border-color,rgba(255,255,255,.16));
--nv-fg:var(--nova-text-color,#fff);
--nv-accent:var(--nova-accent-color,#f5b83d);
--nv-active:var(--nova-active-color,#3d8bf5);
--nv-chip:var(--nova-chip-color,rgba(255,255,255,.1));
--nv-blur:var(--nova-blur,22px)}`;

/* ---------- Popup mit beliebigen Karten ---------- */
const PCSS = `
:host{position:fixed;inset:0;z-index:6;display:flex;align-items:center;justify-content:center;background:rgba(8,12,22,.5);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);animation:fi .2s}
.root{width:min(var(--nova-popup-width,1180px),96vw);max-height:84vh;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;box-sizing:border-box;padding:14px;border-radius:28px;
background:linear-gradient(160deg,rgba(92,110,148,.8),rgba(22,27,42,.9));border:1px solid var(--nv-border);box-shadow:0 20px 60px rgba(0,0,0,.45);color:var(--nv-fg);font-family:var(--ha-font-family-body,Roboto,sans-serif);animation:up .28s cubic-bezier(.2,.8,.2,1)}
.hd{position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:10px;margin-bottom:14px;padding:6px 6px 6px 14px;border-radius:999px;background:rgba(60,72,100,.85);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}
.tt{flex:1;min-width:0;font-weight:600;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.x{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.14);cursor:pointer;flex:none}
ha-icon{--mdc-icon-size:20px;display:flex}
.body{display:grid;grid-template-columns:repeat(auto-fill,minmax(var(--nova-popup-min-col,300px),1fr));gap:12px;align-items:start}
.body.one{grid-template-columns:1fr}
.empty{opacity:.6;font-size:13px;padding:8px}
@media(max-width:600px){:host{align-items:flex-end}.root{width:100vw;max-height:86vh;border-radius:28px 28px 0 0;padding:12px 12px calc(90px + env(safe-area-inset-bottom))}.body{grid-template-columns:1fr}}
@keyframes up{from{transform:translateY(40px);opacity:0}}@keyframes fi{from{opacity:0}}`;

class NovaDockPopup extends HTMLElement {
  constructor() {
    super();
    const r = this.attachShadow({mode: 'open'});
    r.innerHTML = `<style>${VARS}${PCSS}</style><div class="root"><div class="hd"><ha-icon class="hi"></ha-icon><span class="tt"></span><div class="x" title="Schließen"><ha-icon icon="mdi:close"></ha-icon></div></div><div class="body"></div></div>`;
    this._body = r.querySelector('.body');
    this._cards = [];
    r.querySelector('.x').addEventListener('click', () => this.onclose?.());
    this.addEventListener('click', e => { if (e.composedPath()[0] === this) this.onclose?.(); });
  }
  set cfg(c) {
    this._cfg = c;
    const r = this.shadowRoot;
    r.querySelector('.tt').textContent = c.title || '';
    r.querySelector('.hi').setAttribute('icon', c.icon || 'mdi:dots-horizontal');
    this._body.classList.toggle('one', (c.cards || []).length === 1);
    this._load();
  }
  async _load() {
    const helpers = await window.loadCardHelpers();
    this._body.innerHTML = '';
    this._cards = (this._cfg.cards || []).map(cc => {
      const el = helpers.createCardElement(cc);
      if (this._h) el.hass = this._h;
      this._body.appendChild(el);
      return el;
    });
    if (!this._cards.length) this._body.innerHTML = '<div class="empty">Noch keine Karten in diesem Popup – im Editor unter „Popup-Karten“ eintragen.</div>';
  }
  set hass(h) { this._h = h; this._cards.forEach(c => { c.hass = h; }); }
}
define('nova-dock-popup', NovaDockPopup);

/* ---------- Dock ---------- */
const DCSS = `
:host{display:block;height:var(--nova-dock-space,64px)}
.dock.inline{max-width:100%}
ha-icon{--mdc-icon-size:22px;display:flex}
.dock{position:fixed;left:50%;transform:translateX(-50%);display:flex;gap:8px;padding:8px;border-radius:999px;background:var(--nv-bg);
backdrop-filter:blur(var(--nv-blur)) saturate(160%);-webkit-backdrop-filter:blur(var(--nv-blur)) saturate(160%);border:1px solid var(--nv-border);
box-shadow:0 12px 36px rgba(0,0,0,.4);z-index:7;max-width:calc(100vw - 24px);overflow-x:auto;scrollbar-width:none;box-sizing:border-box}
.dock.bottom{bottom:calc(14px + env(safe-area-inset-bottom))}.dock.top{top:14px}
.dock::-webkit-scrollbar{display:none}
.dock.inline{position:static;transform:none;margin:0 auto;width:max-content}
.d{width:var(--sz);height:var(--sz);border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);color:var(--nv-fg);cursor:pointer;position:relative;transition:all .2s;-webkit-tap-highlight-color:transparent;outline:none}
.d:focus-visible{box-shadow:0 0 0 2px var(--nv-active)}
.d:active{transform:scale(.9)}
.d.act{background:var(--nv-active);box-shadow:0 0 16px color-mix(in srgb,var(--nv-active) 60%,transparent)}
.d.here{outline:2px solid rgba(255,255,255,.5)}
.d img{width:60%;height:60%;object-fit:contain}
.dot{position:absolute;top:14%;right:14%;width:8px;height:8px;border-radius:50%;background:var(--nv-accent);box-shadow:0 0 6px var(--nv-accent);display:none}
.d.bd .dot{display:block}
.num{position:absolute;top:2px;right:0;min-width:16px;height:16px;padding:0 4px;box-sizing:border-box;border-radius:8px;background:var(--nv-accent);color:#3a2a00;font:700 10px/16px var(--ha-font-family-body,Roboto,sans-serif);text-align:center;display:none}
.d.bn .num{display:block}.d.bn .dot{display:none}
.empty{color:var(--nv-fg);opacity:.7;font-size:13px;padding:6px 12px}
@media(max-width:600px){.d{width:calc(var(--sz) * .875);height:calc(var(--sz) * .875)}.dock{gap:5px;padding:6px}}`;

const SRC = {};
const findDock = o => {
  if (!o || typeof o !== 'object') return null;
  if ((o.type === 'custom:nova-dock-card' || o.type === 'custom:nz-dock-card') && Array.isArray(o.items) && o.items.length) return o;
  for (const v of Object.values(o)) { const r = findDock(v); if (r) return r; }
  return null;
};

class NovaDockCard extends HTMLElement {
  static getConfigElement() { return document.createElement('nova-dock-card-editor'); }
  static getStubConfig() {
    return {items: [
      {icon: 'mdi:home', label: 'Start', tap_action: {action: 'navigate', navigation_path: location.pathname}},
      {icon: 'mdi:lightbulb-group', label: 'Licht', popup_title: 'Licht', cards: [{type: 'markdown', content: 'Hier deine Licht-Karten eintragen'}]},
    ]};
  }
  setConfig(c) {
    if (!c || typeof c !== 'object') throw new Error('Ungültige Konfiguration');
    if (!c.items && !c.source) throw new Error('items oder source angeben');
    this._cfg = {position: 'bottom', button_size: 48, ...c};
    this._close();
    this._items = null; this._btns = null; this._built = false; this._cur = -1;
    if (this._h) this.hass = this._h;
  }
  set hass(h) {
    this._h = h;
    if (!this._cfg) return;
    if (!this._items) {
      if (this._cfg.items) this._items = this._cfg.items;
      else { this._loadSource(); return; }
    }
    if (!this._built) this._build();
    if (this._pop) this._pop.hass = h;
    this._update();
  }
  async _loadSource() {
    if (this._loading) return;
    this._loading = true;
    const k = this._cfg.source;
    SRC[k] = SRC[k] || this._h.callWS({type: 'lovelace/config', url_path: k === 'default' ? null : k}).then(findDock).catch(() => null);
    const d = await SRC[k];
    this._loading = false;
    this._items = d ? d.items : [];
    this._srcCfg = d || {};
    this.hass = this._h;
  }
  connectedCallback() {
    this._applyInline();
    requestAnimationFrame(() => this._applyInline());
    this._loc = () => this._update();
    window.addEventListener('location-changed', this._loc);
    window.addEventListener('popstate', this._loc);
  }
  disconnectedCallback() {
    window.removeEventListener('location-changed', this._loc);
    window.removeEventListener('popstate', this._loc);
    this._close();
  }
  getCardSize() { return 1; }
  getGridOptions() { return {columns: 'full', rows: 1}; }
  get _inline() {
    if (this.preview || this.editMode || this.hasAttribute('preview') || this._cfg?.inline) return true;
    // In Kartenauswahl & Editor-Vorschau nicht schweben, sondern als normale Leiste zeigen
    const PREV = new Set(['HUI-CARD-PICKER', 'HUI-CARD-PREVIEW', 'HUI-DIALOG-EDIT-CARD', 'HUI-DIALOG-CREATE-CARD', 'HUI-CARD-ELEMENT-EDITOR']);
    let n = this;
    for (let i = 0; i < 40 && n; i++) {
      if (PREV.has(n.tagName)) return true;
      n = n.parentElement || n.getRootNode?.().host;
    }
    return false;
  }
  _applyInline() { this.shadowRoot?.querySelector('.dock')?.classList.toggle('inline', this._inline); }

  _build() {
    this._built = true;
    const c = this._cfg, r = this.shadowRoot || this.attachShadow({mode: 'open'});
    r.innerHTML = `<style>${VARS}${DCSS}</style><div class="dock ${esc(c.position)} ${this._inline ? 'inline' : ''}" style="--sz:${+c.button_size || 48}px"></div>`;
    const dock = r.querySelector('.dock');
    if (!this._items.length) { dock.innerHTML = `<span class="empty">${c.source ? `Kein Dock in „${esc(c.source)}“ gefunden` : 'Noch keine Einträge'}</span>`; this._btns = []; return; }
    this._btns = this._items.map((it, i) => {
      const d = document.createElement('div');
      d.className = 'd'; d.tabIndex = 0; d.setAttribute('role', 'button');
      d.title = it.label || it.popup_title || '';
      const ic = it.icon || 'mdi:circle-outline';
      d.innerHTML = `${/^(\/|https?:|data:image)/.test(ic) ? `<img src="${esc(ic)}" alt="">` : `<ha-icon icon="${esc(ic)}"></ha-icon>`}<span class="dot"></span><span class="num"></span>`;
      d.addEventListener('click', () => this._tap(i));
      d.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this._tap(i); } });
      if (it.hold_action) {
        let t; d.addEventListener('pointerdown', () => { t = setTimeout(() => { d._held = true; fire(this, 'hass-action', {config: {entity: it.entity, hold_action: it.hold_action}, action: 'hold'}); }, 500); });
        ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => d.addEventListener(ev, () => clearTimeout(t)));
      }
      dock.appendChild(d);
      return d;
    });
  }

  _path(it) { return it.tap_action?.action === 'navigate' ? it.tap_action.navigation_path : it.navigation_path; }

  _update() {
    if (!this._btns || !this._h) return;
    const h = this._h;
    this._items.forEach((it, i) => {
      const d = this._btns[i]; if (!d) return;
      const p = this._path(it);
      d.classList.toggle('act', i === this._cur);
      d.classList.toggle('here', !!p && location.pathname === p);
      let n = 0, dot = false;
      if (it.badge_count_of) n = countOn(h, it.badge_count_of, it.badge_exclude);
      else if (it.badge) dot = isOn(h.states[it.badge]);
      const showNum = n > 0 && it.badge_show_number;
      d.classList.toggle('bd', dot || (n > 0 && !showNum));
      d.classList.toggle('bn', showNum);
      if (showNum) d.querySelector('.num').textContent = n > 99 ? '99+' : n;
    });
  }

  _tap(i) {
    const it = this._items[i];
    if (this._btns[i]?._held) { this._btns[i]._held = false; return; }
    if (this._cur === i) return this._close();
    this._close();
    if (Array.isArray(it.cards)) return this._openCards(i, it);
    if (typeof it.popup === 'string' && customElements.get('nz-popup')) return this._openLegacy(i, it);
    if (it.tap_action && it.tap_action.action !== 'none') return fire(this, 'hass-action', {config: {entity: it.entity, tap_action: it.tap_action}, action: 'tap'});
    if (it.navigation_path) return nav(it.navigation_path);
    if (it.entity) fire(this, 'hass-more-info', {entityId: it.entity});
  }

  _openCards(i, it) {
    const p = document.createElement('nova-dock-popup');
    p.onclose = () => this._close();
    p.cfg = {title: it.popup_title || it.label || '', icon: it.icon, cards: it.cards};
    p.hass = this._h;
    this.shadowRoot.appendChild(p); // im eigenen Shadow-DOM, damit more-info & Aktionen der Karten bei HA ankommen
    this._opened(i, p);
  }

  _openLegacy(i, it) { // Kompatibilität mit alten nz-Dock-Einträgen (popup: lights|heating|…)
    const p = document.createElement('nz-popup');
    p.host = this; p.onclose = () => this._close();
    p.cfg = {weather: this._srcCfg?.weather || this._cfg.weather, ...it, title: it.title || it.label};
    document.body.appendChild(p);
    p.hass = this._h;
    this._opened(i, p);
  }

  _opened(i, p) {
    this._pop = p; this._cur = i; this._update();
    this._esc = e => { if (e.key === 'Escape') this._close(); };
    window.addEventListener('keydown', this._esc);
  }

  _close() {
    if (this._pop) { this._pop.remove(); this._pop = null; }
    this._cur = -1;
    if (this._esc) window.removeEventListener('keydown', this._esc);
    this._update();
  }
}
define('nova-dock-card', NovaDockCard, {name: 'Nova Dock Card', description: 'Schwebende Leiste unten mit Buttons: navigieren, Aktion auslösen oder Popup mit beliebigen Karten öffnen.', documentationURL: 'https://github.com/Blackstar9119/nova-cards#nova-dock-card'});

/* ---------- Editor ---------- */
let preload;
const loadForm = () => customElements.get('ha-form') ? Promise.resolve() : (preload ||= (async () => {
  try { await (await (await window.loadCardHelpers()).createCardElement({type: 'button', entity: 'sun.sun'}))?.constructor?.getConfigElement?.(); } catch (e) { console.warn('[nova-cards] Editor nicht vorgeladen', e); }
  await Promise.race([customElements.whenDefined('ha-form'), new Promise(r => setTimeout(r, 3000))]);
})());
const names = s => s.flatMap(x => x.schema ? names(x.schema) : x.name ? [x.name] : []);
const empty = v => v == null || v === '' || (Array.isArray(v) && !v.length);
const merge = (base, keys, val) => { const o = {...base}; keys.forEach(k => empty(val[k]) ? delete o[k] : o[k] = val[k]); return o; };

const MAIN = [
  {type: 'grid', name: '', schema: [
    {name: 'position', selector: {select: {mode: 'dropdown', options: [{value: 'bottom', label: 'Unten'}, {value: 'top', label: 'Oben'}]}}},
    {name: 'button_size', selector: {number: {min: 32, max: 72, step: 2, mode: 'box', unit_of_measurement: 'px'}}},
  ]},
  {name: 'source', selector: {text: {}}},
];
const ITEM = [
  {type: 'grid', name: '', schema: [
    {name: 'icon', required: true, selector: {icon: {}}},
    {name: 'label', selector: {text: {}}},
  ]},
  {name: 'tap_action', selector: {ui_action: {}}},
  {name: 'popup_title', selector: {text: {}}},
  {name: 'cards', selector: {object: {}}},
  {name: 'badge', selector: {entity: {}}},
  {type: 'grid', name: '', schema: [
    {name: 'badge_count_of', selector: {entity: {}}},
    {name: 'badge_show_number', selector: {boolean: {}}},
  ]},
  {name: 'badge_exclude', selector: {entity: {multiple: true}}},
];
const LABELS = {
  position: 'Position', button_size: 'Button-Größe', source: 'Einträge aus anderem Dashboard übernehmen',
  icon: 'Icon', label: 'Name', tap_action: 'Aktion beim Antippen', popup_title: 'Popup-Titel',
  cards: 'Popup-Karten (YAML-Liste)', badge: 'Punkt, wenn diese Entität an ist',
  badge_count_of: 'Zähler: Gruppe', badge_show_number: 'Zahl statt Punkt', badge_exclude: 'Beim Zählen ignorieren',
};
const HELPERS = {
  source: 'Optional: URL-Pfad eines Dashboards (z. B. neues-zuhause). Dann gilt dessen Dock – praktisch für mehrere Dashboards mit gleicher Leiste.',
  cards: 'Wenn gesetzt, öffnet der Button ein Popup mit diesen Karten (statt der Aktion). Beispiel: - type: tile, entity: light.flur',
  badge_count_of: 'Zeigt Punkt/Zahl, wenn Mitglieder der Gruppe an sind (z. B. light.alle_lampen)',
};
const ECSS = `
.wrap{display:flex;flex-direction:column;gap:16px}
h3{margin:8px 0 0;font-size:15px;font-weight:600}
details.item{border:1px solid var(--divider-color,#444);border-radius:12px;overflow:hidden}
details.item>summary{display:flex;align-items:center;gap:10px;padding:10px 12px;cursor:pointer;list-style:none;background:var(--secondary-background-color)}
details.item>summary::-webkit-details-marker{display:none}
summary .lbl{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.body{padding:12px;display:flex;flex-direction:column;gap:12px}
.ib{background:none;border:none;color:var(--primary-text-color);cursor:pointer;padding:4px;border-radius:50%;display:flex}
.ib:hover{background:var(--secondary-background-color)}.ib[disabled]{opacity:.3;pointer-events:none}
.add{align-self:flex-start;display:flex;gap:6px;align-items:center;padding:8px 14px;border-radius:999px;border:1px solid var(--primary-color);background:none;color:var(--primary-color);cursor:pointer;font:inherit}
.hint{font-size:12px;opacity:.7;margin:0}
ha-icon{display:flex}`;

class NovaDockCardEditor extends HTMLElement {
  constructor() { super(); this.attachShadow({mode: 'open'}); this._forms = []; this._open = new Set(); }
  set hass(h) { this._hass = h; this._forms.forEach(f => { f.hass = h; }); }
  setConfig(c) {
    const s = JSON.stringify(c);
    if (s === this._emitted) { this._config = c; return; }
    this._config = JSON.parse(s);
    this._rebuild();
  }
  async _rebuild() { const id = this._bid = (this._bid || 0) + 1; await loadForm(); if (id === this._bid) { this._forms = []; this._build(); } }
  _emit(c) { this._config = c; this._emitted = JSON.stringify(c); fire(this, 'config-changed', {config: c}); }
  _form(schema, data, cb) {
    const f = document.createElement('ha-form');
    f.hass = this._hass; f.schema = schema; f.data = data;
    f.computeLabel = s => LABELS[s.name] ?? s.name;
    f.computeHelper = s => HELPERS[s.name];
    f.addEventListener('value-changed', e => { e.stopPropagation(); f.data = e.detail.value; cb(e.detail.value); });
    this._forms.push(f);
    return f;
  }
  _btn(icon, title, fn, dis) {
    const b = document.createElement('button');
    b.className = 'ib'; b.title = title; b.disabled = !!dis;
    b.innerHTML = `<ha-icon icon="${icon}"></ha-icon>`;
    b.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); fn(); });
    return b;
  }
  _build() {
    const r = this.shadowRoot;
    r.innerHTML = `<style>${ECSS}</style><div class="wrap"></div>`;
    const w = r.querySelector('.wrap');
    const main = {position: 'bottom', button_size: 48, ...this._config};
    w.append(this._form(MAIN, main, v => {
      const c = merge(this._config, names(MAIN), v);
      if (c.position === 'bottom') delete c.position;
      if (c.button_size === 48) delete c.button_size;
      const hadSrc = !!this._config.source;
      this._emit(c);
      if (hadSrc !== !!c.source) this._rebuild();
    }));
    if (this._config.source && !(this._config.items || []).length) {
      const p = document.createElement('p'); p.className = 'hint';
      p.textContent = 'Einträge kommen aus dem anderen Dashboard. Eigene Einträge unten überschreiben das.';
      w.append(p);
    }
    const h = document.createElement('h3'); h.textContent = 'Buttons'; w.append(h);
    const items = this._config.items || [];
    items.forEach((it, i) => w.append(this._item(it, i, items.length)));
    const add = document.createElement('button');
    add.className = 'add';
    add.innerHTML = '<ha-icon icon="mdi:plus"></ha-icon>Button hinzufügen';
    add.addEventListener('click', e => {
      e.preventDefault();
      const n = [...items, {icon: 'mdi:circle-outline'}];
      this._open = new Set([n.length - 1]);
      this._emit({...this._config, items: n});
      this._rebuild();
    });
    w.append(add);
  }
  _label(it, i) { return `${i + 1}. ${it.label || it.popup_title || (Array.isArray(it.cards) ? 'Popup' : it.tap_action?.navigation_path) || 'Neuer Button'}`; }
  _item(it, i, n) {
    const d = document.createElement('details');
    d.className = 'item'; d.open = this._open.has(i);
    d.addEventListener('toggle', () => d.open ? this._open.add(i) : this._open.delete(i));
    const s = document.createElement('summary');
    s.innerHTML = `<ha-icon icon="${esc(it.icon || 'mdi:circle-outline')}"></ha-icon><span class="lbl"></span>`;
    s.querySelector('.lbl').textContent = this._label(it, i);
    s.append(this._btn('mdi:arrow-up', 'Nach oben', () => this._move(i, -1), i === 0),
             this._btn('mdi:arrow-down', 'Nach unten', () => this._move(i, 1), i === n - 1),
             this._btn('mdi:delete-outline', 'Löschen', () => this._remove(i)));
    const b = document.createElement('div'); b.className = 'body';
    b.append(this._form(ITEM, it, v => {
      const list = [...this._config.items];
      const nx = merge(list[i], names(ITEM), v);
      if (nx.cards && !Array.isArray(nx.cards)) nx.cards = [nx.cards];
      if (!nx.badge_show_number) delete nx.badge_show_number;
      list[i] = nx;
      this._emit({...this._config, items: list});
      s.querySelector('.lbl').textContent = this._label(nx, i);
      s.querySelector('ha-icon').setAttribute('icon', nx.icon || 'mdi:circle-outline');
    }));
    d.append(s, b);
    return d;
  }
  _move(i, dir) {
    const j = i + dir, list = [...this._config.items];
    [list[i], list[j]] = [list[j], list[i]];
    this._open = new Set([j]);
    this._emit({...this._config, items: list}); this._rebuild();
  }
  _remove(i) {
    this._open = new Set();
    const list = this._config.items.filter((_, k) => k !== i);
    const c = {...this._config};
    if (list.length) c.items = list; else delete c.items;
    if (!c.items && !c.source) c.items = [];
    this._emit(c); this._rebuild();
  }
}
define('nova-dock-card-editor', NovaDockCardEditor);

/* ---------- Nova Modular Card ---------- */
const MVARS = `:host{
--nv-bg:var(--nova-background,linear-gradient(160deg,rgba(80,96,128,.55),rgba(22,27,42,.62)));
--nv-border:var(--nova-border-color,rgba(255,255,255,.14));
--nv-fg:var(--nova-text-color,#fff);
--nv-accent:var(--nova-accent-color,#f5b83d);
--nv-accent-fg:var(--nova-accent-text-color,#3a2a00);
--nv-active:var(--nova-active-color,#3d8bf5);
--nv-active-fg:var(--nova-active-text-color,#fff);
--nv-warn:var(--nova-warning-color,#7cc4ff);
--nv-error:var(--nova-error-color,#ff6b6b);
--nv-chip:var(--nova-chip-color,rgba(255,255,255,.13));
--nv-radius:var(--nova-radius,24px);
--nv-blur:var(--nova-blur,20px)}`;
const MCSS = `
:host{display:block;height:100%;container-type:inline-size}
.g{height:100%;box-sizing:border-box;border-radius:var(--nv-radius);background:var(--nv-bg);
backdrop-filter:blur(var(--nv-blur)) saturate(150%);-webkit-backdrop-filter:blur(var(--nv-blur)) saturate(150%);
border:1px solid var(--nv-border);box-shadow:0 10px 30px rgba(0,0,0,.25),inset 0 1px 0 rgba(255,255,255,.12);
color:var(--nv-fg);overflow:hidden;position:relative;font-family:var(--ha-font-family-body,Roboto,sans-serif);
padding:14px 16px;display:flex;flex-direction:column;gap:12px;transition:box-shadow .4s}
.g.warn{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 1px color-mix(in srgb,var(--nv-warn) 60%,transparent),inset 0 1px 0 rgba(255,255,255,.12)}
.g.err{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 1px color-mix(in srgb,var(--nv-error) 70%,transparent),inset 0 1px 0 rgba(255,255,255,.12)}
ha-icon{--mdc-icon-size:20px;display:flex}
img{object-fit:contain}
.blk[hidden],[hidden]{display:none!important}
.bt{font-size:11.5px;font-weight:600;opacity:.6;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px}
.tap{cursor:pointer;-webkit-tap-highlight-color:transparent;user-select:none;outline:none}
.tap:focus-visible{box-shadow:0 0 0 2px var(--nv-active)}
.na{opacity:.4}
.ic{width:34px;height:34px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);transition:all .25s}
.ic ha-icon{--mdc-icon-size:18px}.ic img{width:20px;height:20px}
.on>.ic{background:var(--nv-accent);color:var(--nv-accent-fg);box-shadow:0 0 14px color-mix(in srgb,var(--nv-accent) 55%,transparent)}
.nm{flex:1;min-width:0}.nm b,.nm small{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nm b{font-weight:500;font-size:13.5px}.nm small{font-size:11.5px;opacity:.6}
.hd{display:flex;align-items:center;gap:10px}
.hd .ic{width:44px;height:44px}.hd .ic ha-icon{--mdc-icon-size:24px}.hd .ic img{width:26px;height:26px}
.hd .nm b{font-weight:600;font-size:15px}.hd .nm small{font-size:12px;opacity:.65}
.pct{font-weight:600;font-size:14px}
.hb{width:36px;height:36px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip)}
.hb:active,.hd .ic:active,.pill:active,.row:active .ic{transform:scale(.92)}
.prog{height:6px;border-radius:3px;background:rgba(255,255,255,.12);overflow:hidden;margin-top:10px}
.prog i{display:block;height:100%;width:0;background:var(--nv-accent);border-radius:3px;transition:width 1s}
.list{display:grid;grid-template-columns:repeat(var(--cols,1),minmax(0,1fr));column-gap:14px}
.kv{display:flex;align-items:center;gap:8px;font-size:13px;padding:7px 0;border-top:1px solid rgba(255,255,255,.08);min-width:0}
.kv ha-icon{--mdc-icon-size:17px;opacity:.7}.kv img{width:17px;height:17px}
.kv .k{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.kv .v{opacity:.8;text-align:right;white-space:nowrap}
.pills{display:flex;flex-wrap:wrap;gap:7px}
.pill{padding:7px 12px;border-radius:999px;background:var(--nv-chip);border:1px solid rgba(255,255,255,.08);font-size:12.5px;display:inline-flex;gap:6px;align-items:center;white-space:nowrap;transition:all .2s;min-width:0}
.pill ha-icon{--mdc-icon-size:16px}.pill img{width:16px;height:16px}
.pill.on{background:var(--nv-active);color:var(--nv-active-fg);border-color:transparent;box-shadow:0 0 14px color-mix(in srgb,var(--nv-active) 50%,transparent)}
.pills.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(var(--nova-modular-button-width,104px),1fr));gap:8px}
.pills.grid .pill{flex-direction:column;justify-content:center;border-radius:16px;padding:10px 8px;white-space:normal;text-align:center}
.pills.grid .pill ha-icon{--mdc-icon-size:22px}.pills.grid .pill img{width:22px;height:22px}
.row{display:flex;align-items:center;gap:10px;padding:5px 0;min-width:0}
.sw{width:38px;height:22px;border-radius:11px;background:rgba(255,255,255,.18);position:relative;flex:none;transition:background .25s}
.sw::after{content:'';position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:#fff;transition:transform .25s}
.row.on .sw{background:var(--nv-active)}.row.on .sw::after{transform:translateX(16px)}
.sl{display:flex;flex-direction:column;gap:6px;padding:6px 0}
.sl .kv{border:none;padding:0}
.sl .v{font-weight:600;opacity:1}
input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:22px;border-radius:11px;margin:0;outline:none;
background:linear-gradient(90deg,var(--nv-accent) 0 var(--p,0%),rgba(255,255,255,.14) var(--p,0%) 100%)}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.4)}
input[type=range]::-moz-range-thumb{width:22px;height:22px;border-radius:50%;background:#fff;border:none}
.als{display:flex;flex-direction:column;gap:6px}.als.chips{flex-direction:row;flex-wrap:wrap}
.al{--c:var(--nv-warn);display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:14px;font-size:13px;
background:color-mix(in srgb,var(--c) 18%,transparent);border:1px solid color-mix(in srgb,var(--c) 45%,transparent)}
.al.error{--c:var(--nv-error)}.al.info{--c:var(--nv-active)}
.al ha-icon{color:var(--c);--mdc-icon-size:18px}
.chips .al{border-radius:999px;padding:5px 10px;font-size:12px}
@container (max-width:280px){.list{grid-template-columns:1fr}.g{padding:12px}}`;

const DICON = {light: 'mdi:lightbulb', switch: 'mdi:power-socket-eu', fan: 'mdi:fan', input_boolean: 'mdi:toggle-switch-outline', button: 'mdi:gesture-tap-button', input_button: 'mdi:gesture-tap-button', script: 'mdi:script-text-outline', scene: 'mdi:palette', automation: 'mdi:robot', climate: 'mdi:thermostat', cover: 'mdi:window-shutter', media_player: 'mdi:speaker', number: 'mdi:ray-vertex', input_number: 'mdi:ray-vertex', select: 'mdi:format-list-bulleted', binary_sensor: 'mdi:checkbox-blank-circle-outline', sensor: 'mdi:eye'};
const TOGGLE = ['light', 'switch', 'input_boolean', 'fan', 'cover', 'group', 'siren', 'humidifier', 'automation', 'media_player', 'valve'];
const PRESS = {button: ['button', 'press'], input_button: ['input_button', 'press'], script: ['script', 'turn_on'], scene: ['scene', 'turn_on']};
const dom = id => String(id || '').split('.')[0];
const isImg = s => typeof s === 'string' && /^(\/|https?:|data:image)/.test(s);
const setIcon = (el, ic) => { if (el._ic === ic) return; el._ic = ic; el.innerHTML = isImg(ic) ? `<img src="${esc(ic)}" alt="">` : `<ha-icon icon="${esc(ic)}"></ha-icon>`; };
const fmtState = (h, s) => { try { return h.formatEntityState ? h.formatEntityState(s) : s.state + (s.attributes.unit_of_measurement ? ' ' + s.attributes.unit_of_measurement : ''); } catch { return s.state; } };
const unitJoin = (v, u) => !u ? `${v}` : u.startsWith('°') ? `${v}${u}` : `${v} ${u}`;
const decOf = st => (String(st).split('.')[1] || '').length;
const nameOf = (h, o) => o.name ?? h.states[o.entity]?.attributes.friendly_name ?? o.entity ?? '';
const iconOf = (h, o, fb) => o.icon || h.states[o.entity]?.attributes.icon || DICON[dom(o.entity)] || fb;
const list = v => [].concat(v ?? []).flatMap(x => String(x).split(',')).map(x => x.trim()).filter(Boolean);
const NUMRE = /^-?\d+(\.\d+)?$/;

function valueOf(h, s, o) {
  if (!s) return '–';
  if ((o.decimals != null || o.unit != null) && NUMRE.test(s.state)) {
    const n = o.decimals != null ? (+s.state).toFixed(o.decimals) : s.state;
    return unitJoin(n, o.unit ?? s.attributes.unit_of_measurement);
  }
  return fmtState(h, s);
}

function press(el, {tap, hold}) {
  let t, held = false;
  const clr = () => clearTimeout(t);
  el.tabIndex = 0; el.setAttribute('role', 'button'); el.classList.add('tap');
  el.addEventListener('pointerdown', () => { held = false; t = setTimeout(() => { held = true; hold && hold(); }, 500); });
  el.addEventListener('pointerup', e => { clr(); if (!held && tap) tap(); e.stopPropagation(); });
  el.addEventListener('pointerleave', clr);
  el.addEventListener('pointercancel', clr);
  el.addEventListener('contextmenu', e => e.preventDefault());
  el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tap && tap(); } });
}

// Schieberegler je Domain: v = aktueller Wert, r = [min, max, step], u = Einheit, set = Service
const SLIDE = {
  number: {v: s => +s.state, r: a => [a.min ?? 0, a.max ?? 100, a.step ?? 1], set: (h, id, v) => h.callService('number', 'set_value', {entity_id: id, value: v})},
  input_number: {v: s => +s.state, r: a => [a.min ?? 0, a.max ?? 100, a.step ?? 1], set: (h, id, v) => h.callService('input_number', 'set_value', {entity_id: id, value: v})},
  light: {v: s => s.state === 'on' ? Math.max(1, Math.round((s.attributes.brightness || 0) / 2.55)) : 0, r: () => [0, 100, 1], u: '%',
    set: (h, id, v) => v > 0 ? h.callService('light', 'turn_on', {entity_id: id, brightness_pct: v}) : h.callService('light', 'turn_off', {entity_id: id})},
  fan: {v: s => s.state === 'on' ? s.attributes.percentage ?? 0 : 0, r: a => [0, 100, a.percentage_step || 1], u: '%', set: (h, id, v) => h.callService('fan', 'set_percentage', {entity_id: id, percentage: Math.round(v)})},
  cover: {v: s => s.attributes.current_position ?? 0, r: () => [0, 100, 1], u: '%', set: (h, id, v) => h.callService('cover', 'set_cover_position', {entity_id: id, position: v})},
  media_player: {v: s => Math.round((s.attributes.volume_level ?? 0) * 100), r: () => [0, 100, 1], u: '%', set: (h, id, v) => h.callService('media_player', 'volume_set', {entity_id: id, volume_level: v / 100})},
  climate: {v: s => s.attributes.temperature ?? 0, r: a => [a.min_temp ?? 7, a.max_temp ?? 35, a.target_temp_step ?? .5], u: '°', set: (h, id, v) => h.callService('climate', 'set_temperature', {entity_id: id, temperature: v})},
  water_heater: {v: s => s.attributes.temperature ?? 0, r: a => [a.min_temp ?? 30, a.max_temp ?? 70, a.target_temp_step ?? 1], u: '°', set: (h, id, v) => h.callService('water_heater', 'set_temperature', {entity_id: id, temperature: v})},
};
const duration = m => m >= 60 ? `${Math.floor(m / 60)}:${String(Math.round(m % 60)).padStart(2, '0')} h` : `${m} min`;

function alertHit(a, s) {
  if (!s) return false;
  const v = s.state, n = parseFloat(v);
  if (a.state != null) return list(a.state).includes(v);
  if (a.state_not != null) return !['unavailable', 'unknown'].includes(v) && !list(a.state_not).includes(v);
  if (a.above != null || a.below != null) return NUMRE.test(v) && (a.above == null || n > a.above) && (a.below == null || n < a.below);
  return ['on', 'problem'].includes(v);
}

const ITEMS = {info: 'entities', entities: 'entities', sliders: 'entities', buttons: 'buttons', alerts: 'alerts'};
const normBlock = b => {
  const k = ITEMS[b.type];
  if (!k) return {...b};
  const it = (b[k] || []).map(x => typeof x === 'string' ? {entity: x} : {...x});
  return {...b, [k]: it.filter(x => k === 'buttons' ? x.entity || x.tap_action : x.entity)};
};

// Bausteine: bekommen Block-Konfig + Container, liefern update(hass) → optional Warnstufe
const BLOCKS = {
  header(b, w) {
    const ent = b.status || b.active;
    const btn = b.button_icon || (b.button_action?.action && b.button_action.action !== 'none');
    w.innerHTML = `<div class="hd"><div class="ic"></div><div class="nm"><b></b><small></small></div><span class="pct"></span>${btn ? '<div class="hb"></div>' : ''}</div><div class="prog" hidden><i></i></div>`;
    const q = s => w.querySelector(s), hd = q('.hd'), ic = q('.ic'), sm = q('small'), pct = q('.pct'), pg = q('.prog'), pi = q('.prog i');
    q('b').textContent = b.name ?? '';
    press(ic, {tap: () => this._act({entity: ent, tap_action: b.tap_action}, 'tap', true), hold: () => this._act({entity: ent, hold_action: b.hold_action}, 'hold')});
    if (btn) { setIcon(q('.hb'), b.button_icon || 'mdi:dots-horizontal'); press(q('.hb'), {tap: () => this._act({entity: ent, tap_action: b.button_action}, 'tap', true)}); }
    return h => {
      const s = b.status && h.states[b.status];
      const on = b.active ? isOn(h.states[b.active]) : isOn(s);
      if (!b.name && ent) q('b').textContent = h.states[ent]?.attributes.friendly_name || '';
      setIcon(ic, b.icon || s?.attributes.icon || 'mdi:devices');
      hd.classList.toggle('on', on);
      sm.textContent = s ? fmtState(h, s) : b.active ? (on ? 'an' : 'aus') : '';
      const pr = b.progress && h.states[b.progress], p = pr ? parseFloat(pr.state) : NaN;
      const show = !isNaN(p) && p > 0 && (on || p < 100);
      pg.hidden = !show; pct.textContent = show ? `${Math.round(p)} %` : '';
      if (show) pi.style.width = `${Math.min(100, p)}%`;
    };
  },
  info(b, w) {
    const chips = b.layout === 'chips';
    const box = document.createElement('div');
    box.className = chips ? 'pills' : 'list';
    if (b.columns > 1) box.style.setProperty('--cols', b.columns);
    const els = b.entities.map(o => {
      const el = document.createElement('div');
      el.className = chips ? 'pill' : 'kv';
      el.innerHTML = chips ? '<span class="i"></span><span class="t"></span>' : '<span class="i"></span><span class="k"></span><span class="v"></span>';
      press(el, {tap: () => this._act(o, 'tap', true), hold: () => this._act(o, 'hold')});
      box.append(el);
      return [el, o];
    });
    w.append(box);
    return h => els.forEach(([el, o]) => {
      const s = h.states[o.entity];
      el.classList.toggle('na', !s || s.state === 'unavailable');
      setIcon(el.firstChild, iconOf(h, o, 'mdi:information-outline'));
      const v = valueOf(h, s, o);
      if (chips) el.lastChild.textContent = o.name === '' ? v : `${nameOf(h, o)} · ${v}`;
      else { el.children[1].textContent = nameOf(h, o); el.children[2].textContent = v; }
    });
  },
  entities(b, w) {
    const box = document.createElement('div');
    box.className = 'list';
    if (b.columns > 1) box.style.setProperty('--cols', b.columns);
    const els = b.entities.map(o => {
      const el = document.createElement('div');
      el.className = 'row';
      el.innerHTML = `<div class="ic"></div><div class="nm"><b></b><small></small></div>${TOGGLE.includes(dom(o.entity)) ? '<div class="sw"></div>' : ''}`;
      press(el, {tap: () => this._act(o, 'tap'), hold: () => this._act(o, 'hold')});
      box.append(el);
      return [el, o];
    });
    w.append(box);
    return h => els.forEach(([el, o]) => {
      const s = h.states[o.entity];
      el.classList.toggle('na', !s || s.state === 'unavailable');
      el.classList.toggle('on', isOn(s) && !PRESS[dom(o.entity)]);
      setIcon(el.firstChild, iconOf(h, o, 'mdi:power'));
      el.querySelector('b').textContent = nameOf(h, o);
      el.querySelector('small').textContent = s ? valueOf(h, s, o) : 'nicht gefunden';
    });
  },
  sliders(b, w) {
    const els = b.entities.map(o => {
      const el = document.createElement('div');
      el.className = 'sl';
      el.innerHTML = '<div class="kv"><span class="i"></span><span class="k"></span><span class="v"></span></div><input type="range">';
      const top = el.firstChild, inp = el.lastChild, v = el.querySelector('.v');
      press(top, {tap: () => this._act(o, 'tap', true), hold: () => this._act(o, 'hold')});
      const paint = () => {
        const mn = +inp.min, mx = +inp.max, n = +inp.value;
        inp.style.setProperty('--p', `${mx > mn ? (n - mn) / (mx - mn) * 100 : 0}%`);
        v.textContent = o.format === 'duration' ? duration(n) : unitJoin(n.toFixed(decOf(inp.step)), el._u);
      };
      inp.addEventListener('pointerdown', () => { el._drag = true; });
      inp.addEventListener('input', () => { el._drag = true; paint(); });
      inp.addEventListener('change', () => {
        SLIDE[dom(o.entity)]?.set(this._h, o.entity, +inp.value);
        clearTimeout(el._t); el._t = setTimeout(() => { el._drag = false; }, 1500);
      });
      w.append(el);
      return {el, o, inp, paint};
    });
    return h => els.forEach(({el, o, inp, paint}) => {
      const s = h.states[o.entity], D = SLIDE[dom(o.entity)];
      el.classList.toggle('na', !s || !D || s.state === 'unavailable');
      setIcon(el.querySelector('.i'), iconOf(h, o, 'mdi:tune-variant'));
      el.querySelector('.k').textContent = nameOf(h, o);
      inp.disabled = !s || !D || s.state === 'unavailable';
      if (!s || !D) { el.querySelector('.v').textContent = s ? fmtState(h, s) : '–'; return; }
      const [mn, mx, st] = D.r(s.attributes);
      inp.min = o.min ?? mn; inp.max = o.max ?? mx; inp.step = o.step ?? st;
      el._u = o.unit ?? D.u ?? s.attributes.unit_of_measurement;
      if (!el._drag) inp.value = D.v(s);
      paint();
    });
  },
  buttons(b, w) {
    const box = document.createElement('div');
    box.className = `pills${b.layout === 'grid' ? ' grid' : ''}`;
    const els = b.buttons.map(o => {
      const el = document.createElement('div');
      el.className = 'pill';
      el.innerHTML = '<span class="i"></span><span class="t"></span>';
      press(el, {tap: () => this._act(o, 'tap'), hold: () => this._act(o, 'hold')});
      box.append(el);
      return [el, o];
    });
    w.append(box);
    return h => els.forEach(([el, o]) => {
      const s = o.entity && h.states[o.entity];
      el.classList.toggle('na', !!o.entity && (!s || s.state === 'unavailable'));
      el.classList.toggle('on', !!s && TOGGLE.includes(dom(o.entity)) && isOn(s));
      setIcon(el.firstChild, iconOf(h, o, 'mdi:gesture-tap-button'));
      el.lastChild.textContent = o.name ?? (s?.attributes.friendly_name || '');
    });
  },
  alerts(b, w) {
    const box = document.createElement('div');
    box.className = `als${b.layout === 'chips' ? ' chips' : ''}`;
    const els = b.alerts.map(o => {
      const el = document.createElement('div');
      el.className = `al ${o.level || 'warning'}`;
      el.innerHTML = '<span class="i"></span><span class="t"></span>';
      press(el, {tap: () => this._act(o, 'tap', true), hold: () => this._act(o, 'hold')});
      box.append(el);
      return [el, o];
    });
    w.append(box);
    return h => {
      let lvl = 0;
      els.forEach(([el, o]) => {
        const s = h.states[o.entity], hit = alertHit(o, s);
        el.hidden = !hit;
        if (!hit) return;
        lvl = Math.max(lvl, o.level === 'error' ? 2 : o.level === 'info' ? 0 : 1);
        setIcon(el.firstChild, o.icon || (o.level === 'error' ? 'mdi:alert-octagon' : o.level === 'info' ? 'mdi:information' : 'mdi:alert'));
        el.lastChild.textContent = o.message ? o.message.replace('{state}', fmtState(h, s)) : `${nameOf(h, o)}: ${fmtState(h, s)}`;
      });
      w.hidden = !els.some(([el]) => !el.hidden);
      return b.glow === false ? 0 : lvl;
    };
  },
};

class NovaModularCard extends HTMLElement {
  static getConfigElement() { return document.createElement('nova-modular-card-editor'); }
  static getStubConfig(h) {
    const ids = Object.keys(h.states);
    const sensor = ids.find(i => i.startsWith('sensor.')), sw = ids.find(i => i.startsWith('switch.'));
    return {blocks: [
      {type: 'header', name: 'Gerät', icon: 'mdi:devices', ...(sensor ? {status: sensor} : {})},
      ...(sw ? [{type: 'entities', entities: [{entity: sw}]}] : []),
    ]};
  }
  setConfig(c) {
    if (!c || typeof c !== 'object') throw new Error('Ungültige Konfiguration');
    if (!Array.isArray(c.blocks)) throw new Error('blocks (Liste der Bausteine) fehlt');
    this._c = {...c, blocks: c.blocks.filter(b => b && BLOCKS[b.type]).map(normBlock)};
    this._built = false;
    if (this._h) { this._build(); this._update(); }
  }
  set hass(h) {
    this._h = h;
    if (!this._c) return;
    if (!this._built) this._build();
    this._update();
  }
  getCardSize() { return 1 + (this._c?.blocks.length || 1); }
  getGridOptions() { return {columns: 12, rows: 'auto', min_columns: 4}; }
  _build() {
    this._built = true;
    const r = this.shadowRoot || this.attachShadow({mode: 'open'});
    r.innerHTML = `<style>${MVARS}${MCSS}</style><div class="g"></div>`;
    this._g = r.querySelector('.g');
    this._ups = this._c.blocks.map(b => {
      const w = document.createElement('div');
      w.className = `blk ${b.type}`;
      if (b.title) { const t = document.createElement('div'); t.className = 'bt'; t.textContent = b.title; w.append(t); }
      const up = BLOCKS[b.type].call(this, b, w);
      this._g.append(w);
      return up;
    });
  }
  _update() {
    if (!this._h || !this._ups) return;
    const lvl = Math.max(0, ...this._ups.map(up => up(this._h) || 0));
    this._g.classList.toggle('warn', lvl === 1);
    this._g.classList.toggle('err', lvl === 2);
  }
  // info = Standard ist more-info statt Schalten
  _act(o, kind, info) {
    const a = o[`${kind}_action`], id = o.entity;
    if (a?.action === 'none') return;
    const custom = a?.action && a.action !== 'default';
    const d = dom(id), canRun = !!(PRESS[d] || TOGGLE.includes(d));
    if (kind === 'tap' && o.confirm && (custom || (!info && canRun)) && !window.confirm(o.confirm)) return;
    if (custom) return fire(this, 'hass-action', {config: {entity: id, [`${kind}_action`]: a}, action: kind});
    if (!id) return;
    if (kind === 'hold' || info || !canRun) return fire(this, 'hass-more-info', {entityId: id});
    if (PRESS[d]) return this._h.callService(...PRESS[d], {entity_id: id});
    this._h.callService('homeassistant', 'toggle', {entity_id: id});
  }
}
define('nova-modular-card', NovaModularCard, {name: 'Nova Modular Card', description: 'Frei zusammensetzbare Gerätekarte: Kopfzeile, Infos, Schalter, Regler, Aktionsbuttons und Warnungen.', documentationURL: 'https://github.com/Blackstar9119/nova-cards#nova-modular-card'});

/* ---------- Editor Modular Card ---------- */
const g2 = (...schema) => ({type: 'grid', name: '', schema});
const T = {text: {}}, I = {icon: {}}, A = {ui_action: {}};
const ENT = {name: 'entity', required: true, selector: {entity: {}}};
const TITLE = {name: 'title', selector: T};
const COLS = {name: 'columns', selector: {number: {min: 1, max: 4, mode: 'slider'}}};
const NUM = n => ({name: n, selector: {number: {mode: 'box', step: 'any'}}});
const sel = (n, opts) => ({name: n, selector: {select: {mode: 'dropdown', options: opts.map(([value, label]) => ({value, label}))}}});
const NAMEICON = g2({name: 'name', selector: T}, {name: 'icon', selector: I, context: {icon_entity: 'entity'}});
const BM = {
  header: {label: 'Kopfzeile', icon: 'mdi:page-layout-header', schema: [
    g2({name: 'name', selector: T}, {name: 'icon', selector: I, context: {icon_entity: 'status'}}),
    {name: 'status', selector: {entity: {}}},
    g2({name: 'active', selector: {entity: {}}}, {name: 'progress', selector: {entity: {domain: ['sensor', 'number', 'input_number']}}}),
    {name: 'tap_action', selector: A},
    {name: 'button_icon', selector: I},
    {name: 'button_action', selector: A},
  ]},
  info: {label: 'Info-Entitäten', icon: 'mdi:information-outline', item: 'Entität', plural: 'Entitäten', defaults: {layout: 'rows', columns: 1},
    schema: [TITLE, g2(sel('layout', [['rows', 'Liste'], ['chips', 'Chips']]), COLS)],
    items: [ENT, NAMEICON, g2({name: 'unit', selector: T}, {name: 'decimals', selector: {number: {min: 0, max: 4, mode: 'box'}}}), {name: 'tap_action', selector: A}]},
  entities: {label: 'Schalter & Entitäten', icon: 'mdi:toggle-switch-outline', item: 'Entität', plural: 'Entitäten', defaults: {columns: 1},
    schema: [TITLE, COLS],
    items: [ENT, NAMEICON, {name: 'tap_action', selector: A}, {name: 'hold_action', selector: A}, {name: 'confirm', selector: T}]},
  sliders: {label: 'Schieberegler', icon: 'mdi:tune-variant', item: 'Regler', plural: 'Regler',
    schema: [TITLE],
    items: [{...ENT, selector: {entity: {domain: Object.keys(SLIDE)}}}, NAMEICON, g2(NUM('min'), NUM('max'), NUM('step')),
      g2({name: 'unit', selector: T}, sel('format', [['value', 'Zahl'], ['duration', 'Minuten → Std:Min']]))]},
  buttons: {label: 'Aktionsbuttons', icon: 'mdi:gesture-tap-button', item: 'Button', plural: 'Buttons', key: 'buttons', defaults: {layout: 'pills'},
    schema: [TITLE, sel('layout', [['pills', 'Pillen'], ['grid', 'Kacheln']])],
    items: [NAMEICON, {name: 'entity', selector: {entity: {}}}, {name: 'tap_action', selector: A}, {name: 'confirm', selector: T}]},
  alerts: {label: 'Warnungen', icon: 'mdi:alert-outline', item: 'Warnung', plural: 'Warnungen', key: 'alerts', defaults: {layout: 'list', glow: true},
    schema: [TITLE, g2(sel('layout', [['list', 'Balken'], ['chips', 'Badges']]), {name: 'glow', selector: {boolean: {}}})],
    items: [ENT, g2({name: 'state', selector: T}, {name: 'state_not', selector: T}), g2(NUM('above'), NUM('below')),
      {name: 'message', selector: T}, g2({name: 'icon', selector: I}, sel('level', [['warning', 'Warnung'], ['error', 'Fehler'], ['info', 'Hinweis']]))]},
};
const MLABELS = {
  name: 'Name', icon: 'Icon', status: 'Status-Entität', active: 'Aktiv-Entität', progress: 'Fortschritt (%)',
  tap_action: 'Aktion beim Antippen', hold_action: 'Aktion bei langem Drücken', button_icon: 'Touch-Button oben: Icon', button_action: 'Touch-Button oben: Aktion',
  title: 'Überschrift (optional)', layout: 'Darstellung', columns: 'Spalten', entity: 'Entität', unit: 'Einheit', decimals: 'Nachkommastellen',
  min: 'Min', max: 'Max', step: 'Schritt', format: 'Anzeige', confirm: 'Sicherheitsabfrage', state: 'Warnen bei Zustand', state_not: 'Warnen außer bei',
  above: 'Warnen über', below: 'Warnen unter', message: 'Meldung', level: 'Stufe', glow: 'Kartenrahmen einfärben',
};
const MHELPERS = {
  status: 'Text unter dem Namen. Aus/Standby/Idle = inaktiv',
  active: 'Optional: bestimmt, ob das Icon leuchtet (statt Status-Entität)',
  button_icon: 'Button erscheint, sobald Icon oder Aktion gesetzt ist',
  unit: 'Überschreibt die Einheit der Entität',
  confirm: 'Optional: Text der Rückfrage vor dem Auslösen',
  state: 'Mehrere mit Komma trennen. Ohne Bedingung: Warnung bei „on“ bzw. „problem“',
  message: 'Leer = Name: Zustand. {state} wird ersetzt',
  min: 'Leer = Werte der Entität',
};
const MECSS = `
.adds{display:flex;flex-wrap:wrap;gap:8px}
details.item details.item>summary{background:none}
h4{margin:4px 0 0;font-size:13px;font-weight:600;opacity:.8}`;

class NovaModularCardEditor extends NovaDockCardEditor {
  _form(schema, data, cb) {
    const f = super._form(schema, data, cb);
    f.computeLabel = s => MLABELS[s.name] ?? s.name;
    f.computeHelper = s => MHELPERS[s.name];
    return f;
  }
  _blocks() { return (this._config.blocks || []).map(normItems); }
  _set(bl) { this._emit({...this._config, blocks: bl}); }
  _build() {
    const r = this.shadowRoot;
    r.innerHTML = `<style>${ECSS}${MECSS}</style><div class="wrap"></div>`;
    const w = r.querySelector('.wrap'), bl = this._blocks();
    const h = document.createElement('h3'); h.textContent = 'Bausteine';
    const p = document.createElement('p'); p.className = 'hint'; p.textContent = 'Frei kombinierbar – die Reihenfolge hier ist die Reihenfolge auf der Karte.';
    w.append(h, p);
    bl.forEach((b, i) => w.append(this._block(b, i, bl.length)));
    const adds = document.createElement('div'); adds.className = 'adds';
    Object.entries(BM).forEach(([type, m]) => {
      const a = document.createElement('button');
      a.className = 'add';
      a.innerHTML = `<ha-icon icon="mdi:plus"></ha-icon>${esc(m.label)}`;
      a.addEventListener('click', e => {
        e.preventDefault();
        const k = BM[type].items && (m.key || 'entities');
        const n = [...bl, {type, ...(k ? {[k]: [{}]} : {})}];
        this._open = new Set([`${n.length - 1}`, `${n.length - 1}.0`]);
        this._set(n); this._rebuild();
      });
      adds.append(a);
    });
    w.append(adds);
  }
  _details(key, icon, label, btns) {
    const d = document.createElement('details');
    d.className = 'item'; d.open = this._open.has(key);
    d.addEventListener('toggle', e => { e.stopPropagation(); d.open ? this._open.add(key) : this._open.delete(key); });
    const s = document.createElement('summary');
    s.innerHTML = `<ha-icon icon="${esc(icon)}"></ha-icon><span class="lbl"></span>`;
    s.querySelector('.lbl').textContent = label;
    s.append(...btns);
    const body = document.createElement('div'); body.className = 'body';
    d.append(s, body);
    return [d, s, body];
  }
  _blabel(b, i) { const m = BM[b.type]; return `${i + 1}. ${m ? m.label : b.type}${b.title || b.name ? ' · ' + (b.title || b.name) : ''}`; }
  _block(b, i, n) {
    const m = BM[b.type];
    const [d, s, body] = this._details(`${i}`, m?.icon || 'mdi:help-circle-outline', this._blabel(b, i), [
      this._btn('mdi:arrow-up', 'Nach oben', () => this._move(null, i, -1), i === 0),
      this._btn('mdi:arrow-down', 'Nach unten', () => this._move(null, i, 1), i === n - 1),
      this._btn('mdi:delete-outline', 'Löschen', () => this._del(null, i))]);
    if (!m) { const p = document.createElement('p'); p.className = 'hint'; p.textContent = `Unbekannter Baustein „${b.type}“ – nur per YAML bearbeitbar.`; body.append(p); return d; }
    const keys = names(m.schema), def = m.defaults || {};
    body.append(this._form(m.schema, {...def, ...b}, v => {
      const bl = this._blocks(), nb = merge(bl[i], keys, v);
      Object.entries(def).forEach(([k, x]) => nb[k] === x && delete nb[k]);
      bl[i] = nb; this._set(bl);
      s.querySelector('.lbl').textContent = this._blabel(nb, i);
    }));
    if (m.items) {
      const k = m.key || 'entities', items = b[k] || [];
      const h = document.createElement('h4'); h.textContent = m.plural;
      body.append(h);
      items.forEach((it, j) => body.append(this._sub(i, j, it, items.length, m, k)));
      const a = document.createElement('button');
      a.className = 'add';
      a.innerHTML = `<ha-icon icon="mdi:plus"></ha-icon>${esc(m.item)} hinzufügen`;
      a.addEventListener('click', e => {
        e.preventDefault();
        const bl = this._blocks();
        bl[i] = {...bl[i], [k]: [...(bl[i][k] || []), {}]};
        this._open = new Set([`${i}`, `${i}.${bl[i][k].length - 1}`]);
        this._set(bl); this._rebuild();
      });
      body.append(a);
    }
    return d;
  }
  _ilabel(it, j, m) { return `${j + 1}. ${it.name || it.message || (it.entity && this._hass?.states[it.entity]?.attributes.friendly_name) || it.entity || `Neu: ${m.item}`}`; }
  _sub(i, j, it, n, m, k) {
    const [d, s, body] = this._details(`${i}.${j}`, it.icon || m.icon, this._ilabel(it, j, m), [
      this._btn('mdi:arrow-up', 'Nach oben', () => this._move(i, j, -1), j === 0),
      this._btn('mdi:arrow-down', 'Nach unten', () => this._move(i, j, 1), j === n - 1),
      this._btn('mdi:delete-outline', 'Löschen', () => this._del(i, j))]);
    const keys = names(m.items);
    body.append(this._form(m.items, it, v => {
      const bl = this._blocks(), arr = [...bl[i][k]];
      arr[j] = merge(arr[j], keys, v);
      bl[i] = {...bl[i], [k]: arr}; this._set(bl);
      s.querySelector('.lbl').textContent = this._ilabel(arr[j], j, m);
    }));
    return d;
  }
  // i = null: Block verschieben/löschen, sonst Eintrag j in Block i
  _move(i, j, dir) {
    const bl = this._blocks(), t = j + dir;
    if (i === null) { [bl[j], bl[t]] = [bl[t], bl[j]]; this._open = new Set([`${t}`]); }
    else {
      const k = BM[bl[i].type].key || 'entities', arr = [...bl[i][k]];
      [arr[j], arr[t]] = [arr[t], arr[j]];
      bl[i] = {...bl[i], [k]: arr}; this._open = new Set([`${i}`, `${i}.${t}`]);
    }
    this._set(bl); this._rebuild();
  }
  _del(i, j) {
    const bl = this._blocks();
    if (i === null) { bl.splice(j, 1); this._open = new Set(); }
    else { const k = BM[bl[i].type].key || 'entities'; bl[i] = {...bl[i], [k]: bl[i][k].filter((_, x) => x !== j)}; this._open = new Set([`${i}`]); }
    this._set(bl); this._rebuild();
  }
}
// Kurzschreibweise "- sensor.x" im Editor als Objekt behandeln
const normItems = b => { const k = ITEMS[b.type]; return k && Array.isArray(b[k]) ? {...b, [k]: b[k].map(x => typeof x === 'string' ? {entity: x} : x)} : {...b}; };
define('nova-modular-card-editor', NovaModularCardEditor);

console.info(`%c NOVA-CARDS %c v${VERSION} `, 'color:#3a2a00;background:#f5b83d;font-weight:700;border-radius:4px 0 0 4px', 'color:#fff;background:#1b2134;border-radius:0 4px 4px 0');
})();
