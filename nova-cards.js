/* Nova Cards v0.8.4 | MIT | https://github.com/Blackstar9119/nova-cards
   Raum, Thermostat, Licht, Dock, Modular, Kamera, Media, Saugroboter – alle als custom:nova-*. */

/* ---------- Raum, Thermostat, Licht ---------- */
(() => {
var _t=Object.defineProperty;var bt=(s,t,e)=>t in s?_t(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e;var v=(s,t,e)=>bt(s,typeof t!="symbol"?t+"":t,e);var J="0.8.4",xt="https://github.com/Blackstar9119/nova-cards",z=s=>`${xt}#${s}`;var g=s=>String(s??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),yt=new Set(["off","unavailable","unknown","idle","docked","standby","closed","paused","not_home","none","ready"]),B=s=>!!s&&!yt.has(s.state),q=s=>String(s||"").split(".")[0],D=(s,t,e)=>s.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0})),$=(s,t)=>D(s,"hass-more-info",{entityId:t}),w=(s,t,e)=>D(s,"hass-action",{config:t,action:e}),X=(s,t)=>{try{return s.formatEntityState?s.formatEntityState(t):`${t.state}${t.attributes.unit_of_measurement?" "+t.attributes.unit_of_measurement:""}`}catch{return t.state}},T=(s,t)=>{let e=s.entities?.[t];return e&&(e.area_id||s.devices?.[e.device_id]?.area_id)||null},Y=s=>typeof s=="string"&&/^(\/|https?:|data:image)/.test(s),Q={light:"mdi:lightbulb",switch:"mdi:power-socket-eu",fan:"mdi:fan",vacuum:"mdi:robot-vacuum",input_boolean:"mdi:toggle-switch-outline",media_player:"mdi:speaker",button:"mdi:gesture-tap-button",input_button:"mdi:gesture-tap-button",script:"mdi:script-text-outline",scene:"mdi:palette",climate:"mdi:thermostat",cover:"mdi:window-shutter",lock:"mdi:lock",sensor:"mdi:eye"};function F(s,{tap:t,hold:e,holdMs:n=500}){let i,o=!1,a=()=>clearTimeout(i);s.addEventListener("pointerdown",()=>{o=!1,i=setTimeout(()=>{o=!0,e&&e()},n)}),s.addEventListener("pointerup",r=>{a(),!o&&t&&t(),r.stopPropagation()}),s.addEventListener("pointerleave",a),s.addEventListener("pointercancel",a),s.addEventListener("contextmenu",r=>r.preventDefault()),s.addEventListener("click",r=>r.stopPropagation()),s.addEventListener("keydown",r=>{(r.key==="Enter"||r.key===" ")&&(r.preventDefault(),r.stopPropagation(),t&&t())})}function _(s,t,e){customElements.get(s)||customElements.define(s,t),e&&(window.customCards=window.customCards||[],window.customCards.some(n=>n.type===s)||window.customCards.push({type:s,preview:!0,...e}))}var vt=`:host{
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

/* ---------- Nova Dock Card + Nova Modular Card + Nova Kamera Card + Nova Media Card + Nova Saugroboter Card ---------- */
(() => {
const VERSION = '0.8.4';
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

/* ---------- Nova Kamera Card ---------- */
const CCSS = `
.g.cam{padding:12px;gap:10px}
.media{position:relative;border-radius:calc(var(--nv-radius) - 8px);overflow:hidden;background:rgba(0,0,0,.35);aspect-ratio:var(--ar,16/9);cursor:pointer;-webkit-tap-highlight-color:transparent}
.media>img,.media .live,.media .live>*{position:absolute;inset:0;width:100%;height:100%;display:block;object-fit:var(--fit,cover);border:none}
.media .live>*{--video-max-height:100%;--ha-card-border-radius:0;--ha-card-background:transparent}
.media .live:empty{display:none}
.media .ph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:.45}
.media .ph ha-icon{--mdc-icon-size:40px}
.ovl{position:absolute;display:flex;gap:6px;flex-wrap:wrap;z-index:2;pointer-events:none}
.ovl>*{pointer-events:auto}
.ovl.tl{top:8px;left:8px;right:40%}.ovl.tr{top:8px;right:8px;justify-content:flex-end;max-width:58%}
.ovl.bot{left:8px;right:8px;bottom:8px;justify-content:center}
.ovl .pill,.ovl .al{background:rgba(10,14,24,.55);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-color:rgba(255,255,255,.14)}
.ovl .pill{padding:5px 10px;font-size:12px}
.ovl .pill.on{background:var(--nv-accent);color:var(--nv-accent-fg);box-shadow:none}
.ovl .al{background:color-mix(in srgb,var(--c) 55%,rgba(10,14,24,.6))}
.ovl .al ha-icon{color:inherit}
.cb{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(10,14,24,.5);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.16)}
.cb.on{background:var(--nv-active);color:var(--nv-active-fg)}
.cb:active,.pill:active{transform:scale(.92)}
.dot{position:absolute;left:10px;bottom:10px;z-index:1;display:flex;align-items:center;gap:5px;font-size:10.5px;font-weight:700;letter-spacing:.06em;padding:3px 8px;border-radius:999px;background:rgba(10,14,24,.55)}
.dot::before{content:'';width:7px;height:7px;border-radius:50%;background:var(--nv-error)}
.has-ov .dot{display:none}
.x{display:none;position:absolute;top:10px;right:10px;z-index:3}
.media.fs{position:fixed;inset:0;z-index:9;border-radius:0;aspect-ratio:auto;background:#000}
.media.fs>img,.media.fs .live>*,.media:fullscreen>img,.media:fullscreen .live>*{object-fit:contain}
.media.fs .x,.media:fullscreen .x{display:flex}
.ptz{display:flex;align-items:center;gap:8px;z-index:2}
.ovl-ptz{position:absolute;right:10px;bottom:10px}
.ptz.below{justify-content:center}
.pad{width:var(--nova-camera-ptz-size,108px);aspect-ratio:1;border-radius:50%;display:grid;grid-template:repeat(3,1fr)/repeat(3,1fr);box-sizing:border-box;padding:4px;
background:rgba(10,14,24,.5);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.16)}
.below .pad{background:var(--nv-chip)}
.pad>i,.zm>i{font-style:normal;display:flex;align-items:center;justify-content:center;border-radius:50%;cursor:pointer;-webkit-tap-highlight-color:transparent;touch-action:none;transition:background .15s}
.pad>i ha-icon{--mdc-icon-size:26px}
.pad>[data-k=up]{grid-area:1/2}.pad>[data-k=left]{grid-area:2/1}.pad>[data-k=right]{grid-area:2/3}.pad>[data-k=down]{grid-area:3/2}
.pad>[data-k=home]{grid-area:2/2;background:rgba(255,255,255,.12);margin:4px}.pad>[data-k=home] ha-icon{--mdc-icon-size:18px}
.zm{display:flex;flex-direction:column;gap:8px}
.zm>i{width:36px;height:36px;background:rgba(10,14,24,.5);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.16)}
.below .zm>i{background:var(--nv-chip)}
.pad>i.act,.zm>i.act{background:var(--nv-active);color:var(--nv-active-fg)}
.has-ptz .ovl.bot{right:calc(var(--nova-camera-ptz-size,108px) + 64px);justify-content:flex-start}
@container (max-width:320px){.pad{--nova-camera-ptz-size:88px}}
.split{display:grid;gap:8px;grid-template-columns:repeat(2,minmax(0,1fr));--nova-camera-ptz-size:84px}
.split.row{grid-auto-flow:column;grid-template-columns:none;grid-auto-columns:minmax(0,1fr)}
.split.column{grid-template-columns:1fr}
.split>nova-camera-card{display:block;min-width:0}
@container (max-width:420px){.split{grid-template-columns:1fr;grid-auto-flow:row}}
.g.bare{padding:0;background:none;border:none;box-shadow:none;backdrop-filter:none;-webkit-backdrop-filter:none;border-radius:0;overflow:visible}
.pill.lbl{font-weight:600}`;

const RATIO = {'16:9': '16/9', '4:3': '4/3', '1:1': '1/1', '21:9': '21/9', '9:16': '9/16'};
const CDEF = {aspect_ratio: '16:9', fit: 'cover', image_action: 'more-info', stream: 'auto', refresh: 10, buttons_position: 'overlay', show_header: true, ptz: 'auto', ptz_position: 'overlay', split_layout: 'grid'};
const CLISTS = ['buttons', 'chips', 'alerts', 'split'];
const toObj = x => typeof x === 'string' ? {entity: x} : {...x};
const hasCond = o => o.state != null || o.state_not != null || o.above != null || o.below != null;
const stamp = (u, v) => u + (u.includes('?') ? '&' : '?') + 't=' + encodeURIComponent(v);

// Steuerkreuz: Richtung → Button-Entität, Aktion oder ONVIF
const PTZ_KEYS = ['up', 'left', 'right', 'down', 'home', 'zoom_in', 'zoom_out'];
const PTZ_ICON = {up: 'mdi:chevron-up', down: 'mdi:chevron-down', left: 'mdi:chevron-left', right: 'mdi:chevron-right', home: 'mdi:crosshairs-gps', zoom_in: 'mdi:magnify-plus-outline', zoom_out: 'mdi:magnify-minus-outline'};
const PTZ_NAME = {up: 'Hoch', down: 'Runter', left: 'Links', right: 'Rechts', home: 'Ausgangsposition', zoom_in: 'Zoom +', zoom_out: 'Zoom −'};
const PTZ_ONVIF = {up: {tilt: 'UP'}, down: {tilt: 'DOWN'}, left: {pan: 'LEFT'}, right: {pan: 'RIGHT'}, zoom_in: {zoom: 'ZOOM_IN'}, zoom_out: {zoom: 'ZOOM_OUT'}};
const PTZ_RE = [['zoom_in', /zoom.?(in|rein|\+|nah)/], ['zoom_out', /zoom.?(out|raus|-|weg)/], ['left', /left|links/], ['right', /right|rechts/],
  ['down', /down|abw|runter|unten/], ['up', /up|aufw|hoch|oben/], ['home', /home|ausgang|zentr|center|mitte/]];
// Schwenk-/Neige-Buttons am selben Gerät wie die Kamera finden (z. B. tplink pan_left, tilt_up)
function ptzAuto(h, cam) {
  const dev = h?.entities?.[cam]?.device_id, m = {};
  if (!dev) return m;
  Object.values(h.entities).filter(e => e.device_id === dev && dom(e.entity_id) === 'button').forEach(e => {
    const s = `${e.entity_id} ${e.translation_key || ''} ${h.states[e.entity_id]?.attributes.friendly_name || ''}`.toLowerCase();
    if (!/pan|tilt|zoom|ptz|schwenk|neig|move|beweg|dreh|home|ausgang/.test(s)) return;
    const hit = PTZ_RE.find(([, re]) => re.test(s));
    if (hit && !m[hit[0]]) m[hit[0]] = e.entity_id;
  });
  return m;
}
function ptzMap(h, c) {
  const p = c.ptz;
  if (p === 'onvif') return dom(c.entity) === 'camera' ? {...PTZ_ONVIF, home: undefined} : {};
  const m = p === 'auto' || p === true ? ptzAuto(h, c.entity) : p && typeof p === 'object' ? p : {};
  return Object.fromEntries(PTZ_KEYS.filter(k => m[k]).map(k => [k, m[k]]));
}
// Gedrückt halten = weiterfahren
function repeat(el, fn, ms = 450) {
  let t;
  const stop = () => { clearInterval(t); el.classList.remove('act'); };
  el.classList.add('tap'); el.tabIndex = 0; el.setAttribute('role', 'button');
  el.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); stop(); el.classList.add('act'); fn(); t = setInterval(fn, ms); });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(n => el.addEventListener(n, stop));
  el.addEventListener('click', e => e.stopPropagation());
  el.addEventListener('contextmenu', e => e.preventDefault());
  el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } });
}

// ha-camera-stream ist lazy – einmal über eine Bildkarte nachladen
let camPre;
const camStream = () => customElements.get('ha-camera-stream') ? Promise.resolve(true) : (camPre ||= (async () => {
  try { (await window.loadCardHelpers()).createCardElement({type: 'picture-entity', entity: 'camera.nova', camera_view: 'live'}); } catch {}
  return Promise.race([customElements.whenDefined('ha-camera-stream').then(() => true), new Promise(r => setTimeout(() => r(false), 3000))]);
})());

class NovaCameraCard extends HTMLElement {
  static getConfigElement() { return document.createElement('nova-camera-card-editor'); }
  static getStubConfig(h) {
    const ids = Object.keys(h.states);
    return {entity: ids.find(i => i.startsWith('camera.')) || ids.find(i => i.startsWith('image.')) || 'camera.'};
  }
  constructor() {
    super();
    this._vis = false;
    this._onVis = () => this._sync();
  }
  setConfig(c) {
    if (!c || typeof c !== 'object') throw new Error('Ungültige Konfiguration');
    if (!c.entity || !['camera', 'image'].includes(dom(c.entity))) throw new Error('entity muss eine camera.* oder image.* Entität sein');
    this._c = {...CDEF, ...c};
    CLISTS.forEach(k => { this._c[k] = [].concat(c[k] || []).map(toObj).filter(o => o.entity || o.tap_action); });
    this._built = false;
    this._stopLive();
    if (this._h) { this._build(); this._update(); }
  }
  set hass(h) {
    this._h = h;
    if (!this._c) return;
    if (!this._built) this._build();
    this._update();
  }
  getCardSize() { return 5 + (this._c?.split.length ? 3 : 0); }
  getGridOptions() { return {columns: 12, rows: 'auto', min_columns: 4}; }
  connectedCallback() {
    document.addEventListener('visibilitychange', this._onVis);
    if ('IntersectionObserver' in window) {
      this._io ||= new IntersectionObserver(es => { this._vis = es[es.length - 1].isIntersecting; this._sync(); }, {rootMargin: '100px'});
      this._io.observe(this);
    } else { this._vis = true; this._sync(); }
  }
  disconnectedCallback() {
    document.removeEventListener('visibilitychange', this._onVis);
    this._io?.disconnect();
    this._vis = false;
    this._sync();
  }
  _build() {
    this._built = true;
    const c = this._c, r = this.shadowRoot || this.attachShadow({mode: 'open'});
    const hb = c.button_icon || (c.button_action?.action && c.button_action.action !== 'none');
    const ov = c.buttons_position !== 'below';
    this._ptz = ptzMap(this._h, c);
    const pk = Object.keys(this._ptz), pov = c.ptz_position !== 'below';
    r.innerHTML = `<style>${MVARS}${MCSS}${CCSS}</style><div class="g cam${c.bare ? ' bare' : ''}">
${c.show_header !== false ? `<div class="hd"><div class="ic"></div><div class="nm"><b></b><small></small></div>${hb ? '<div class="hb"></div>' : ''}</div>` : ''}
<div class="media${ov && c.buttons.length ? ' has-ov' : ''}${pk.length && pov ? ' has-ptz' : ''}"><div class="ph"><ha-icon icon="mdi:cctv-off"></ha-icon></div><img class="still" alt=""><div class="live"></div>
<span class="dot" hidden>LIVE</span><div class="ovl tl"></div><div class="ovl tr"></div>${ov ? '<div class="ovl bot"></div>' : ''}<div class="cb x" title="Schließen"><ha-icon icon="mdi:close"></ha-icon></div>${pk.length && pov ? '<div class="ptz ovl-ptz"></div>' : ''}</div>
${pk.length && !pov ? '<div class="ptz below"></div>' : ''}${!ov && c.buttons.length ? '<div class="pills below"></div>' : ''}</div>`;
    const q = s => r.querySelector(s);
    this._e = {g: q('.g'), hd: q('.hd'), ic: q('.hd .ic'), name: q('.hd b'), sub: q('.hd small'), media: q('.media'), still: q('.still'), live: q('.live'), ph: q('.ph'), dot: q('.dot')};
    const m = this._e.media;
    m.style.setProperty('--ar', RATIO[c.aspect_ratio] || String(c.aspect_ratio).replace(':', '/'));
    m.style.setProperty('--fit', c.fit === 'contain' ? 'contain' : 'cover');
    this._e.still.addEventListener('load', () => { this._e.ph.hidden = true; });
    this._e.still.addEventListener('error', () => { this._e.ph.hidden = false; });
    if (this._e.hd) {
      press(this._e.ic, {tap: () => this._act({entity: c.entity, tap_action: c.tap_action}, 'tap', true), hold: () => this._act({entity: c.entity, hold_action: c.hold_action}, 'hold')});
      if (hb) { setIcon(q('.hb'), c.button_icon || 'mdi:dots-horizontal'); press(q('.hb'), {tap: () => this._act({entity: c.status || c.entity, tap_action: c.button_action}, 'tap', true)}); }
    }
    m.addEventListener('click', e => { if (!e.composedPath().some(x => x.classList?.contains('tap'))) this._tapImage(); });
    press(q('.x'), {tap: () => this._fullscreen(false)});
    this._btns = c.buttons.map(o => {
      const el = document.createElement('div');
      el.className = ov ? 'cb' : 'pill';
      el.innerHTML = ov ? '<span class="i"></span>' : '<span class="i"></span><span class="t"></span>';
      press(el, {tap: () => this._act(o, 'tap'), hold: () => this._act(o, 'hold')});
      q(ov ? '.ovl.bot' : '.below').append(el);
      return [el, o];
    });
    this._chips = c.chips.map(o => { const el = document.createElement('div'); el.className = 'pill'; el.innerHTML = '<span class="i"></span><span class="t"></span>'; press(el, {tap: () => this._act(o, 'tap', true)}); q('.ovl.tl').append(el); return [el, o]; });
    this._alerts = c.alerts.map(o => { const el = document.createElement('div'); el.className = `al ${o.level || 'warning'}`; el.innerHTML = '<span class="i"></span><span class="t"></span>'; press(el, {tap: () => this._act(o, 'tap', true)}); q('.ovl.tr').append(el); return [el, o]; });
    if (pk.length) {
      const box = q('.ptz'), dirs = pk.filter(k => !k.startsWith('zoom')), zm = pk.filter(k => k.startsWith('zoom'));
      const mk = k => { const el = document.createElement('i'); el.dataset.k = k; el.title = PTZ_NAME[k]; el.innerHTML = `<ha-icon icon="${PTZ_ICON[k]}"></ha-icon>`; repeat(el, () => this._ptzGo(k)); return el; };
      if (dirs.length) { const pad = document.createElement('div'); pad.className = 'pad'; pad.append(...dirs.map(mk)); box.append(pad); }
      if (zm.length) { const z = document.createElement('div'); z.className = 'zm'; z.append(...zm.map(mk)); box.append(z); }
      this._ptzEls = [...box.querySelectorAll('[data-k]')];
    } else this._ptzEls = [];
    const lbl = c.label ?? (c.split.length ? this._h.states[c.entity]?.attributes.friendly_name : null);
    if (lbl) { const l = document.createElement('div'); l.className = 'pill lbl'; l.textContent = lbl; q('.ovl.tl').prepend(l); }
    // Splitscreen: weitere Kameras als schlanke Kacheln neben dem Hauptbild
    this._kids = [];
    if (c.split.length) {
      const sp = document.createElement('div');
      sp.className = `split ${c.split_layout}`;
      m.before(sp); sp.append(m);
      this._kids = c.split.map(o => {
        const k = document.createElement('nova-camera-card');
        try {
          k.setConfig({entity: o.entity, bare: true, show_header: false, label: o.name ?? this._h.states[o.entity]?.attributes.friendly_name ?? o.entity,
            aspect_ratio: c.aspect_ratio, fit: c.fit, stream: c.stream, refresh: c.refresh, image_action: o.image_action || c.image_action,
            ptz: o.ptz === 'off' ? false : o.ptz ?? 'auto', ...(o.ptz_onvif ? {ptz_onvif: o.ptz_onvif} : {})});
        } catch (e) { console.warn('[nova-cards] Splitscreen', o.entity, e.message); return null; }
        k.hass = this._h;
        sp.append(k);
        return k;
      }).filter(Boolean);
    }
    this._stillKey = null;
    this._sync();
  }
  _update() {
    const h = this._h, c = this._c, e = this._e;
    if (!h || !e) return;
    const s = h.states[c.entity], st = c.status && h.states[c.status];
    e.g.classList.toggle('na', !s || s.state === 'unavailable');
    if (e.hd) {
      e.name.textContent = c.name ?? s?.attributes.friendly_name ?? c.entity;
      setIcon(e.ic, c.icon || st?.attributes.icon || s?.attributes.icon || (dom(c.entity) === 'image' ? 'mdi:image' : 'mdi:cctv'));
      e.sub.textContent = st ? fmtState(h, st) : !s ? 'nicht gefunden' : this._mode ? 'Live' : '';
      e.hd.classList.toggle('on', st ? isOn(st) : !!this._mode);
    }
    this._btns.forEach(([el, o]) => {
      const bs = o.entity && h.states[o.entity];
      el.classList.toggle('na', !!o.entity && (!bs || bs.state === 'unavailable'));
      el.classList.toggle('on', !!bs && TOGGLE.includes(dom(o.entity)) && isOn(bs));
      setIcon(el.firstChild, iconOf(h, o, 'mdi:gesture-tap-button'));
      el.title = nameOf(h, o);
      if (el.children[1]) el.children[1].textContent = o.name ?? (bs?.attributes.friendly_name || '');
    });
    this._chips.forEach(([el, o]) => {
      const cs = h.states[o.entity];
      el.hidden = !cs || (hasCond(o) && !alertHit(o, cs));
      if (el.hidden) return;
      el.classList.toggle('on', dom(o.entity) === 'binary_sensor' && cs.state === 'on');
      setIcon(el.firstChild, iconOf(h, o, 'mdi:information-outline'));
      const v = valueOf(h, cs, o);
      el.lastChild.textContent = o.name ? `${o.name} · ${v}` : v;
    });
    let lvl = 0;
    this._alerts.forEach(([el, o]) => {
      const as = h.states[o.entity], hit = alertHit(o, as);
      el.hidden = !hit;
      if (!hit) return;
      lvl = Math.max(lvl, o.level === 'error' ? 2 : o.level === 'info' ? 0 : 1);
      setIcon(el.firstChild, o.icon || (o.level === 'error' ? 'mdi:alert-octagon' : o.level === 'info' ? 'mdi:information' : 'mdi:alert'));
      el.lastChild.textContent = o.message ? o.message.replace('{state}', fmtState(h, as)) : `${nameOf(h, o)}: ${fmtState(h, as)}`;
    });
    this._ptzEls.forEach(el => { const v = this._ptz[el.dataset.k]; el.classList.toggle('na', typeof v === 'string' && (!h.states[v] || h.states[v].state === 'unavailable')); });
    if (c.glow === false) lvl = 0;
    e.g.classList.toggle('warn', lvl === 1);
    e.g.classList.toggle('err', lvl === 2);
    // image.* bekommt ein neues Bild, wenn sich der Zustand ändert
    if (dom(c.entity) === 'image' && s && this._stillKey !== s.state) this._still();
    if (this._liveEl && 'hass' in this._liveEl) this._liveEl.hass = h;
    this._kids.forEach(k => { k.hass = h; });
  }
  _ptzGo(k) {
    const v = this._ptz[k], c = this._c;
    if (this._c.ptz === 'onvif') return this._h.callService('onvif', 'ptz', {entity_id: c.entity, ...v, ...(c.ptz_onvif || {})}).catch(e => console.warn('[nova-cards] onvif.ptz', e));
    if (typeof v === 'string') return this._act({entity: v}, 'tap');
    if (v?.action) return this._act({entity: c.entity, tap_action: v}, 'tap');
  }
  _still() {
    const s = this._h?.states[this._c.entity], p = s?.attributes.entity_picture;
    if (!p) return;
    this._stillKey = s.state;
    this._e.still.src = stamp(p, dom(this._c.entity) === 'image' ? s.state : Date.now());
  }
  // Stream nur, wenn Karte sichtbar und Tab aktiv – sonst Standbild
  _sync() {
    if (!this._e || !this._h) return;
    const show = this._vis && !document.hidden && this.isConnected;
    const live = show && dom(this._c.entity) === 'camera' && this._c.stream !== 'snapshot';
    if (live && !this._mode && !this._starting) this._startLive();
    if (!live) this._stopLive();
    clearInterval(this._tm); this._tm = null;
    if (show && dom(this._c.entity) === 'camera' && !this._mode) {
      if (!this._e.still.src) this._still();
      if (this._c.refresh > 0) this._tm = setInterval(() => !this._mode && this._still(), this._c.refresh * 1000);
    }
  }
  async _startLive() {
    const c = this._c, id = this._lid = (this._lid || 0) + 1;
    this._starting = true;
    let mode = c.stream;
    if (mode === 'webrtc' && !customElements.get('webrtc-camera')) mode = 'auto';
    if (mode === 'auto') mode = await camStream() ? 'ha' : 'mjpeg';
    this._starting = false;
    if (id !== this._lid || !this._vis || document.hidden) return;
    const s = this._h.states[c.entity];
    if (!s) return;
    let el;
    if (mode === 'webrtc') {
      el = document.createElement('webrtc-camera');
      try { el.setConfig({entity: c.entity, ui: false, muted: true, ...(c.webrtc || {})}); } catch (e) { console.warn('[nova-cards] webrtc-camera', e); }
      el.hass = this._h;
    } else if (mode === 'ha') {
      el = document.createElement('ha-camera-stream');
      Object.assign(el, {hass: this._h, stateObj: s, muted: true, controls: false, fitMode: c.fit === 'contain' ? 'contain' : 'cover'});
    } else {
      const p = s.attributes.entity_picture;
      if (!p) return;
      el = document.createElement('img');
      el.alt = '';
      el.src = p.replace('/api/camera_proxy/', '/api/camera_proxy_stream/');
      el.addEventListener('error', () => { if (this._liveEl !== el) return; this._stopLive(); this._retry = setTimeout(() => this._sync(), 10000); });
    }
    this._mode = mode;
    this._liveEl = el;
    this._e.live.replaceChildren(el);
    this._e.dot.hidden = false;
    this._e.ph.hidden = true;
    this._sync(); this._update();
  }
  _stopLive() {
    this._lid = (this._lid || 0) + 1;
    this._starting = false;
    clearTimeout(this._retry);
    if (!this._mode) return;
    if (this._liveEl?.tagName === 'IMG') this._liveEl.src = ''; // MJPEG-Verbindung wirklich schließen
    this._liveEl = null; this._mode = null;
    if (this._e) { this._e.live.replaceChildren(); this._e.dot.hidden = true; this._still(); this._update(); }
  }
  _tapImage() {
    const a = this._c.image_action;
    if (a === 'none') return;
    if (a === 'fullscreen') return this._fullscreen(!this._isFs());
    fire(this, 'hass-more-info', {entityId: this._c.entity});
  }
  _isFs() { return this._e.media.classList.contains('fs') || this.shadowRoot.fullscreenElement === this._e.media; }
  _fullscreen(on) {
    const m = this._e.media;
    if (!on) { m.classList.remove('fs'); if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {}); return; }
    // iOS/ältere WebViews: Fallback auf festes Overlay
    const p = m.requestFullscreen?.();
    if (p?.catch) p.catch(() => m.classList.add('fs')); else if (!p) m.classList.add('fs');
  }
}
NovaCameraCard.prototype._act = NovaModularCard.prototype._act;
define('nova-camera-card', NovaCameraCard, {name: 'Nova Kamera Card', description: 'Live-Bild von camera.* oder image.* mit Kopfzeile, rundem PTZ-Steuerkreuz, Splitscreen, frei belegbaren Buttons (Licht, Sirene …), Info-Chips und Warnungen.', documentationURL: 'https://github.com/Blackstar9119/nova-cards#nova-kamera-card'});

/* ---------- Editor Kamera Card ---------- */
const CMAIN = [
  {name: 'entity', required: true, selector: {entity: {domain: ['camera', 'image']}}},
  g2({name: 'name', selector: T}, {name: 'icon', selector: I, context: {icon_entity: 'entity'}}),
  {name: 'status', selector: {entity: {}}},
  g2({name: 'show_header', selector: {boolean: {}}}, {name: 'glow', selector: {boolean: {}}}),
  {name: 'tap_action', selector: A},
  g2({name: 'button_icon', selector: I}, {name: 'button_action', selector: A}),
  g2(sel('aspect_ratio', [['16:9', '16:9'], ['4:3', '4:3'], ['1:1', '1:1']]), sel('fit', [['cover', 'Füllen'], ['contain', 'Ganzes Bild']])),
  g2(sel('image_action', [['more-info', 'Details (more-info)'], ['fullscreen', 'Vollbild'], ['none', 'Nichts']]),
     sel('stream', [['auto', 'Automatisch'], ['mjpeg', 'MJPEG'], ['webrtc', 'WebRTC-Karte'], ['snapshot', 'Nur Standbild']])),
  g2({name: 'refresh', selector: {number: {min: 0, max: 300, mode: 'box', unit_of_measurement: 's'}}}, sel('buttons_position', [['overlay', 'Über dem Bild'], ['below', 'Darunter']])),
];
CMAIN.push(sel('split_layout', [['grid', 'Raster (2 Spalten)'], ['row', 'Nebeneinander'], ['column', 'Untereinander']]));
const CPTZ = [g2(sel('ptz', [['auto', 'Automatisch (Geräte-Buttons)'], ['manual', 'Manuell'], ['onvif', 'ONVIF'], ['off', 'Aus']]), sel('ptz_position', [['overlay', 'Über dem Bild'], ['below', 'Darunter']]))];
const PBTN = {entity: {domain: ['button', 'input_button', 'script', 'scene']}};
const CPTZM = [g2({name: 'up', selector: PBTN}, {name: 'down', selector: PBTN}), g2({name: 'left', selector: PBTN}, {name: 'right', selector: PBTN}),
  {name: 'home', selector: PBTN}, g2({name: 'zoom_in', selector: PBTN}, {name: 'zoom_out', selector: PBTN})];
const CM = {
  buttons: {label: 'Steuer-Buttons', item: 'Button', icon: 'mdi:gesture-tap-button',
    items: [NAMEICON, {name: 'entity', selector: {entity: {}}}, {name: 'tap_action', selector: A}, {name: 'hold_action', selector: A}, {name: 'confirm', selector: T}]},
  chips: {label: 'Info-Chips', item: 'Chip', icon: 'mdi:information-outline',
    items: [ENT, NAMEICON, g2({name: 'unit', selector: T}, {name: 'decimals', selector: {number: {min: 0, max: 4, mode: 'box'}}}),
      g2({name: 'state', selector: T}, {name: 'state_not', selector: T}), g2(NUM('above'), NUM('below'))]},
  split: {label: 'Splitscreen (weitere Kameras)', item: 'Kamera', icon: 'mdi:view-split-vertical',
    items: [{name: 'entity', required: true, selector: {entity: {domain: ['camera', 'image']}}},
      g2({name: 'name', selector: T}, sel('ptz', [['auto', 'Automatisch'], ['onvif', 'ONVIF'], ['off', 'Aus']]))]},
  alerts: {label: 'Warn-Badges', item: 'Warnung', icon: 'mdi:alert-outline',
    items: [ENT, g2({name: 'state', selector: T}, {name: 'state_not', selector: T}), g2(NUM('above'), NUM('below')),
      {name: 'message', selector: T}, g2({name: 'icon', selector: I}, sel('level', [['warning', 'Warnung'], ['error', 'Fehler'], ['info', 'Hinweis']]))]},
};
const CLABELS = {...MLABELS, status: 'Status-Entität (optional)', show_header: 'Kopfzeile anzeigen', glow: 'Kartenrahmen bei Warnung einfärben',
  tap_action: 'Aktion beim Antippen', aspect_ratio: 'Seitenverhältnis', fit: 'Bild einpassen', image_action: 'Bild antippen',
  stream: 'Live-Stream', refresh: 'Standbild aktualisieren alle', buttons_position: 'Buttons', state: 'Bedingung: Zustand', state_not: 'Bedingung: außer Zustand',
  above: 'Bedingung: über', below: 'Bedingung: unter', ptz: 'Steuerkreuz', ptz_position: 'Steuerkreuz-Position', split_layout: 'Splitscreen-Anordnung',
  up: 'Hoch (neigen)', down: 'Runter (neigen)', left: 'Links (schwenken)', right: 'Rechts (schwenken)', home: 'Mitte / Ausgangsposition', zoom_in: 'Zoom +', zoom_out: 'Zoom −'};
const CHELPERS = {
  entity: 'camera.* = Live-Stream, image.* = Bild (z. B. 3D-Drucker)',
  stream: 'Automatisch = HA-Stream (HLS/WebRTC), sonst MJPEG. Läuft nur, solange die Karte sichtbar ist',
  refresh: 'Nur ohne Live-Stream. 0 = aus',
  state: 'Komma-Liste. Chips: leer = immer sichtbar · Warnungen: leer = bei „on“/„problem“',
  tap_action: 'Gilt für das Icon oben. Standard: Details der Kamera',
  message: 'Leer = Name: Zustand. {state} wird ersetzt',
  split_layout: 'Nur mit weiteren Kameras unter „Splitscreen“. Schmale Karten stapeln automatisch',
  ptz: 'Automatisch sucht Schwenk-/Neige-Buttons am Gerät der Kamera. Gedrückt halten = weiterfahren',
};

class NovaCameraCardEditor extends NovaModularCardEditor {
  _form(schema, data, cb) {
    const f = super._form(schema, data, cb);
    f.computeLabel = s => CLABELS[s.name] ?? s.name;
    f.computeHelper = s => CHELPERS[s.name];
    return f;
  }
  _list(k) { return [].concat(this._config[k] || []).map(toObj); }
  _setList(k, arr) { const c = {...this._config}; if (arr.length) c[k] = arr; else delete c[k]; this._emit(c); }
  _build() {
    const r = this.shadowRoot;
    r.innerHTML = `<style>${ECSS}${MECSS}</style><div class="wrap"></div>`;
    const w = r.querySelector('.wrap');
    w.append(this._form(CMAIN, {...CDEF, glow: true, ...this._config}, v => {
      const c = merge(this._config, names(CMAIN), v);
      Object.entries(CDEF).forEach(([k, x]) => c[k] === x && delete c[k]);
      if (c.glow === true) delete c.glow;
      this._emit(c);
    }));
    const h = document.createElement('h3'); h.textContent = 'Steuerkreuz (Schwenken / Neigen)'; w.append(h);
    const p = this._config.ptz, mode = p === undefined || p === true ? 'auto' : p === false ? 'off' : typeof p === 'object' ? 'manual' : p;
    w.append(this._form(CPTZ, {ptz: mode, ptz_position: this._config.ptz_position || 'overlay'}, v => {
      const c = {...this._config};
      if (v.ptz === 'auto') delete c.ptz; else if (v.ptz === 'off') c.ptz = false; else if (v.ptz === 'manual') c.ptz = typeof p === 'object' ? p : {}; else c.ptz = v.ptz;
      if (v.ptz_position === 'overlay') delete c.ptz_position; else c.ptz_position = v.ptz_position;
      this._emit(c);
      if (v.ptz !== mode) this._rebuild();
    }));
    if (mode === 'manual') {
      w.append(this._form(CPTZM, {...p}, v => {
        const o = Object.fromEntries(PTZ_KEYS.filter(k => v[k]).map(k => [k, v[k]]));
        this._emit({...this._config, ptz: o});
      }));
    } else if (mode === 'auto') {
      const found = Object.keys(ptzAuto(this._hass, this._config.entity));
      const hint = document.createElement('p'); hint.className = 'hint';
      hint.textContent = found.length ? `Gefunden: ${found.map(k => PTZ_NAME[k]).join(', ')}` : 'Keine Schwenk-/Neige-Buttons am Gerät gefunden – dann „Manuell“ wählen.';
      w.append(hint);
    }
    Object.entries(CM).forEach(([k, m]) => {
      const h = document.createElement('h3'); h.textContent = m.label; w.append(h);
      const arr = this._list(k);
      arr.forEach((it, j) => w.append(this._citem(k, m, it, j, arr.length)));
      const a = document.createElement('button');
      a.className = 'add';
      a.innerHTML = `<ha-icon icon="mdi:plus"></ha-icon>${esc(m.item)} hinzufügen`;
      a.addEventListener('click', e => {
        e.preventDefault();
        const n = [...this._list(k), {}];
        this._open = new Set([`${k}.${n.length - 1}`]);
        this._setList(k, n); this._rebuild();
      });
      w.append(a);
    });
  }
  _citem(k, m, it, j, n) {
    const [d, s, body] = this._details(`${k}.${j}`, it.icon || m.icon, this._ilabel(it, j, m), [
      this._btn('mdi:arrow-up', 'Nach oben', () => this._cmove(k, j, -1), j === 0),
      this._btn('mdi:arrow-down', 'Nach unten', () => this._cmove(k, j, 1), j === n - 1),
      this._btn('mdi:delete-outline', 'Löschen', () => this._cdel(k, j))]);
    const keys = names(m.items);
    body.append(this._form(m.items, it, v => {
      const arr = this._list(k);
      arr[j] = merge(arr[j], keys, v);
      this._setList(k, arr);
      s.querySelector('.lbl').textContent = this._ilabel(arr[j], j, m);
    }));
    return d;
  }
  _cmove(k, j, dir) {
    const arr = this._list(k), t = j + dir;
    [arr[j], arr[t]] = [arr[t], arr[j]];
    this._open = new Set([`${k}.${t}`]);
    this._setList(k, arr); this._rebuild();
  }
  _cdel(k, j) {
    this._open = new Set();
    this._setList(k, this._list(k).filter((_, x) => x !== j)); this._rebuild();
  }
}
define('nova-camera-card-editor', NovaCameraCardEditor);

/* ---------- Nova Media Card ---------- */
const MPCSS = `
.g.mp{gap:12px;min-height:var(--nova-media-min-height,0)}
.g.mp.play{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 1px color-mix(in srgb,var(--nv-accent) 40%,transparent),inset 0 1px 0 rgba(255,255,255,.12)}
.mp>*{position:relative;z-index:1}
.mp>.art{position:absolute;inset:0;z-index:0;background:center/cover no-repeat;opacity:0;transition:opacity .6s,filter .6s;pointer-events:none}
.mp.has-art>.art{opacity:var(--nova-media-artwork-opacity,.5)}
.mp.cover>.art{filter:blur(22px) saturate(140%);transform:scale(1.2)}
.mp:not(.play)>.art{filter:grayscale(.6)}.mp.cover:not(.play)>.art{filter:blur(22px) grayscale(.6)}
.mp>.shade{position:absolute;inset:0;z-index:0;background:linear-gradient(180deg,rgba(10,14,24,.05),rgba(10,14,24,.55));opacity:0;transition:opacity .6s;pointer-events:none}
.mp.has-art>.shade{opacity:1}
.mp .hd .ic img{width:26px;height:26px;border-radius:6px}
.hb.on{background:var(--nv-accent);color:var(--nv-accent-fg)}
.now{display:flex;align-items:center;gap:12px;min-width:0}
.thumb{width:72px;height:72px;flex:none;border-radius:14px;background:var(--nv-chip) center/cover no-repeat;box-shadow:0 4px 14px rgba(0,0,0,.35);display:none}
.mp.cover.has-art .thumb{display:block}
.tt{flex:1;min-width:0}.tt b,.tt span{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-shadow:0 1px 4px rgba(0,0,0,.35)}
.tt b{font-size:17px;font-weight:600}.tt span{font-size:13px;opacity:.75;margin-top:2px}
.bar{display:flex;align-items:center;gap:8px;font-size:11px;opacity:.85;font-variant-numeric:tabular-nums}
.bar .tr{flex:1;height:6px;border-radius:3px;background:rgba(255,255,255,.14);overflow:hidden}
.bar.seek .tr{cursor:pointer}
.bar .tr i{display:block;height:100%;width:0;background:var(--nv-accent);border-radius:3px;transition:width 1s linear}
.ctl{display:flex;align-items:center;justify-content:center;gap:14px}
.ctl .cb{width:44px;height:44px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);border:1px solid rgba(255,255,255,.08);transition:all .2s}
.ctl .cb ha-icon{--mdc-icon-size:24px}
.ctl .cb.pp{width:56px;height:56px;background:var(--nv-accent);color:var(--nv-accent-fg);border-color:transparent;box-shadow:0 0 16px color-mix(in srgb,var(--nv-accent) 45%,transparent)}
.ctl .cb.pp ha-icon{--mdc-icon-size:30px}
.cb:active{transform:scale(.9)}
.vol{display:flex;align-items:center;gap:10px}
.vol .cb{width:34px;height:34px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip)}
.vol .cb ha-icon{--mdc-icon-size:18px}
.vol .cb.on{background:var(--nv-error);color:#fff}
.vol .v{min-width:38px;text-align:right;font-size:13px;font-weight:600}
.vol input{flex:1}
.vol .step{flex:1;display:flex;justify-content:center;gap:10px}
.src,.pls{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;margin:0 -2px;padding:2px}
.src::-webkit-scrollbar,.pls::-webkit-scrollbar{display:none}
.pls .pill.on{background:var(--nv-accent);color:var(--nv-accent-fg);box-shadow:none}
.pls .pill .eq{display:none;--mdc-icon-size:14px}.pls .pill.pl .eq{display:flex}
.mp.off .now,.mp.off .bar,.mp.off .ctl,.mp.off .vol,.mp.off .src{display:none}
@container (max-width:300px){.ctl{gap:8px}.ctl .cb{width:38px;height:38px}.ctl .cb.pp{width:48px;height:48px}.thumb{width:56px;height:56px}.tt b{font-size:15px}}`;

// supported_features von media_player
const MF = {PAUSE: 1, SEEK: 2, VOL_SET: 4, MUTE: 8, PREV: 16, NEXT: 32, ON: 128, OFF: 256, VOL_STEP: 1024, SOURCE: 2048, STOP: 4096, PLAY: 16384};
const MDEF = {artwork: 'background', show_progress: true, show_volume: true, show_mute: true, show_power: true, show_source: false, show_players: true, auto_switch: true};
const hasF = (s, f) => ((s?.attributes.supported_features || 0) & f) === f;
const clock = t => { t = Math.max(0, Math.floor(t || 0)); const h = Math.floor(t / 3600), m = Math.floor(t % 3600 / 60), x = String(t % 60).padStart(2, '0'); return h ? `${h}:${String(m).padStart(2, '0')}:${x}` : `${m}:${x}`; };
const posOf = s => {
  const a = s.attributes;
  if (a.media_position == null) return null;
  const upd = a.media_position_updated_at ? Date.parse(a.media_position_updated_at) : NaN;
  return a.media_position + (s.state === 'playing' && !isNaN(upd) ? (Date.now() - upd) / 1000 : 0);
};
// icon_map: Schlüssel ohne Groß/Klein, z. B. {netflix: /local/logos/netflix.svg}
const mapIcon = (map, ...keys) => {
  if (!map) return null;
  const m = Object.fromEntries(Object.entries(map).map(([k, v]) => [String(k).toLowerCase(), v]));
  for (const k of keys) if (k != null && m[String(k).toLowerCase()]) return m[String(k).toLowerCase()];
  return null;
};
// Music Assistant legt je Gerät einen eigenen Player an – nur der kennt Titel, Cover und Vor/Zurück
const MA_ON = ['playing', 'paused', 'buffering'];
function maOf(h, id, ma) {
  if (ma === false || !id) return null;
  if (typeof ma === 'string') return ma;
  if (h.entities?.[id]?.platform === 'music_assistant') return null;
  const n = h.states[id]?.attributes.friendly_name;
  const hits = Object.values(h.entities || {}).map(e => e.entity_id)
    .filter(x => x !== id && dom(x) === 'media_player' && h.entities[x].platform === 'music_assistant' && h.states[x]?.attributes.friendly_name === n);
  return hits.find(x => x.startsWith(id)) || hits.find(x => MA_ON.includes(h.states[x].state)) || hits[0] || null;
}
const cssUrl = u => `url("${String(u).replace(/["\\\n]/g, encodeURIComponent)}")`;

class NovaMediaCard extends HTMLElement {
  static getConfigElement() { return document.createElement('nova-media-card-editor'); }
  static getStubConfig(h) {
    const ids = Object.keys(h.states).filter(i => i.startsWith('media_player.'));
    return {entity: ids.find(i => h.states[i].state === 'playing') || ids[0] || 'media_player.'};
  }
  setConfig(c) {
    if (!c || typeof c !== 'object') throw new Error('Ungültige Konfiguration');
    if (!c.entity || dom(c.entity) !== 'media_player') throw new Error('entity muss eine media_player.* Entität sein');
    this._c = {...MDEF, ...c, players: [].concat(c.players || []).map(toObj).filter(o => dom(o.entity) === 'media_player')};
    this._all = [{entity: c.entity, name: c.name, icon: c.icon}, ...this._c.players];
    this._idx = 0; this._manual = false;
    this._built = false;
    if (this._h) { this._build(); this._update(); }
  }
  set hass(h) {
    this._h = h;
    if (!this._c) return;
    if (!this._built) this._build();
    this._update();
  }
  getCardSize() { return 4; }
  getGridOptions() { return {columns: 12, rows: 'auto', min_columns: 4}; }
  connectedCallback() { if (this._built) this._tick(); }
  disconnectedCallback() { clearInterval(this._tm); this._tm = null; }
  get _p() { return this._all[this._idx]; }
  // Spielt der Music-Assistant-Zwilling, kommen Anzeige und Steuerung von dort
  _eidOf(i) { const ma = this._ma?.[i], s = ma && this._h?.states[ma]; return s && MA_ON.includes(s.state) ? ma : this._all[i].entity; }
  get _eid() { return this._eidOf(this._idx); }
  _build() {
    this._built = true;
    const c = this._c, r = this.shadowRoot || this.attachShadow({mode: 'open'});
    this._ma = this._all.map(o => maOf(this._h, o.entity, o.music_assistant ?? c.music_assistant));
    const multi = this._all.length > 1 && c.show_players !== false;
    r.innerHTML = `<style>${MVARS}${MCSS}${MPCSS}</style><div class="g mp${c.artwork === 'cover' ? ' cover' : ''}">
${c.artwork !== 'none' ? '<div class="art"></div><div class="shade"></div>' : ''}
${multi ? '<div class="pills pls"></div>' : ''}
<div class="hd"><div class="ic"></div><div class="nm"><b></b><small></small></div>${c.show_power !== false ? '<div class="hb pw" title="Ein/Aus"><ha-icon icon="mdi:power"></ha-icon></div>' : ''}</div>
<div class="now"><div class="thumb"></div><div class="tt"><b></b><span></span></div></div>
${c.show_progress !== false ? '<div class="bar"><span class="a">0:00</span><div class="tr"><i></i></div><span class="b">0:00</span></div>' : ''}
<div class="ctl"><div class="cb pv" title="Zurück"><ha-icon icon="mdi:skip-previous"></ha-icon></div><div class="cb pp" title="Play/Pause"><ha-icon icon="mdi:play"></ha-icon></div><div class="cb nx" title="Weiter"><ha-icon icon="mdi:skip-next"></ha-icon></div></div>
${c.show_volume !== false || c.show_mute !== false ? `<div class="vol">${c.show_mute !== false ? '<div class="cb mu" title="Stumm"><ha-icon icon="mdi:volume-high"></ha-icon></div>' : ''}${c.show_volume !== false ? '<input type="range" min="0" max="100" step="1"><div class="step"><div class="cb vd" title="Leiser"><ha-icon icon="mdi:volume-minus"></ha-icon></div><div class="cb vu" title="Lauter"><ha-icon icon="mdi:volume-plus"></ha-icon></div></div><span class="v"></span>' : ''}</div>` : ''}
${c.show_source ? '<div class="pills src"></div>' : ''}</div>`;
    const q = s => r.querySelector(s);
    this._e = {g: q('.g'), art: q('.art'), thumb: q('.thumb'), pls: q('.pls'), ic: q('.hd .ic'), name: q('.hd b'), sub: q('.hd small'), pw: q('.pw'),
      title: q('.tt b'), artist: q('.tt span'), bar: q('.bar'), fill: q('.bar i'), ta: q('.bar .a'), tb: q('.bar .b'),
      pv: q('.pv'), pp: q('.pp'), nx: q('.nx'), mu: q('.mu'), vol: q('.vol input'), step: q('.vol .step'), vv: q('.vol .v'), src: q('.src')};
    const e = this._e, svc = (s, d = {}, id = this._eid) => this._h.callService('media_player', s, {entity_id: id, ...d});
    press(e.ic, {tap: () => this._act({entity: this._eid, tap_action: c.tap_action}, 'tap', true), hold: () => this._act({entity: this._eid, hold_action: c.hold_action}, 'hold')});
    if (e.pw) press(e.pw, {tap: () => { const id = this._p.entity, s = this._h.states[id], on = s && !['off', 'standby'].includes(s.state); svc(!on ? 'turn_on' : hasF(s, MF.OFF) ? 'turn_off' : 'toggle', {}, id); }});
    press(e.pp, {tap: () => svc(this._st()?.state === 'playing' && !hasF(this._st(), MF.PAUSE) ? 'media_stop' : 'media_play_pause')});
    press(e.pv, {tap: () => svc('media_previous_track')});
    press(e.nx, {tap: () => svc('media_next_track')});
    if (e.mu) press(e.mu, {tap: () => svc('volume_mute', {is_volume_muted: !this._st()?.attributes.is_volume_muted})});
    if (e.step) { press(e.step.children[0], {tap: () => svc('volume_down')}); press(e.step.children[1], {tap: () => svc('volume_up')}); }
    if (e.vol) {
      const show = () => { e.vol.style.setProperty('--p', `${e.vol.value}%`); e.vv.textContent = `${e.vol.value} %`; };
      e.vol.addEventListener('pointerdown', () => { this._drag = true; });
      e.vol.addEventListener('input', () => { this._drag = true; show(); });
      e.vol.addEventListener('change', () => { this._drag = false; show(); svc('volume_set', {volume_level: +e.vol.value / 100}); });
    }
    if (e.bar) e.bar.querySelector('.tr').addEventListener('click', ev => {
      const s = this._st(), d = s?.attributes.media_duration;
      if (!d || !hasF(s, MF.SEEK)) return;
      const b = ev.currentTarget.getBoundingClientRect();
      svc('media_seek', {seek_position: Math.round(Math.min(1, Math.max(0, (ev.clientX - b.left) / b.width)) * d)});
    });
    if (e.pls) this._chips = this._all.map((o, i) => {
      const el = document.createElement('div');
      el.className = 'pill';
      el.innerHTML = '<span class="i"></span><span class="t"></span><ha-icon class="eq" icon="mdi:equalizer"></ha-icon>';
      press(el, {tap: () => { this._idx = i; this._manual = true; this._srcKey = null; this._update(); }, hold: () => fire(this, 'hass-more-info', {entityId: o.entity})});
      e.pls.append(el);
      return el;
    });
    this._srcKey = null;
    this._tick();
  }
  _st() { return this._h?.states[this._eid]; }
  _update() {
    const h = this._h, c = this._c, e = this._e;
    if (!h || !e) return;
    // Automatisch zum Player wechseln, der gerade spielt – bis man selbst umschaltet
    if (c.auto_switch !== false && !this._manual && this._all.length > 1 && h.states[this._eid]?.state !== 'playing') {
      const i = this._all.findIndex((o, j) => h.states[this._eidOf(j)]?.state === 'playing');
      if (i >= 0 && i !== this._idx) { this._idx = i; this._srcKey = null; }
    }
    const p = this._p, n = h.states[p.entity], s = h.states[this._eid], a = s?.attributes || {};
    const off = !s || ['off', 'unavailable', 'unknown', 'standby'].includes(s.state), play = s?.state === 'playing';
    e.g.classList.toggle('na', !s || s.state === 'unavailable');
    e.g.classList.toggle('off', off);
    e.g.classList.toggle('play', play && c.glow !== false);
    const app = a.app_name || (a.app_id === 'music_assistant' ? 'Music Assistant' : a.source);
    const logo = mapIcon(c.icon_map, c.icon_entity && h.states[c.icon_entity]?.state, a.app_name, a.app_id, a.source, a.media_channel);
    e.name.textContent = p.name ?? n?.attributes.friendly_name ?? a.friendly_name ?? p.entity;
    e.sub.textContent = !s ? 'nicht gefunden' : off ? fmtState(h, s) : [app, play ? null : fmtState(h, s)].filter(Boolean).join(' · ') || fmtState(h, s);
    setIcon(e.ic, logo || p.icon || a.icon || (a.device_class === 'tv' ? 'mdi:television' : a.device_class === 'speaker' ? 'mdi:speaker' : 'mdi:cast'));
    e.ic.parentElement.classList.toggle('on', !off);
    if (e.pw) { e.pw.classList.toggle('on', !off); e.pw.hidden = !!n && !hasF(n, MF.ON) && !hasF(n, MF.OFF); }
    e.title.textContent = a.media_title || (off ? '' : app || fmtState(h, s));
    e.artist.textContent = [a.media_artist || a.media_series_title, a.media_album_name].filter(Boolean).join(' · ') || (a.media_title ? '' : a.media_channel || '');
    // Cover: nur neu laden, wenn sich das Bild ändert
    const pic = !off && c.artwork !== 'none' ? a.entity_picture_local || a.entity_picture : null;
    if (pic !== this._pic) {
      this._pic = pic;
      if (e.art) e.art.style.backgroundImage = pic ? cssUrl(pic) : '';
      e.thumb.style.backgroundImage = pic ? cssUrl(pic) : '';
    }
    e.g.classList.toggle('has-art', !!pic);
    setIcon(e.pp, play ? (hasF(s, MF.PAUSE) ? 'mdi:pause' : 'mdi:stop') : 'mdi:play');
    e.pp.hidden = !!s && !hasF(s, MF.PAUSE) && !hasF(s, MF.PLAY) && !hasF(s, MF.STOP);
    e.pv.hidden = !hasF(s, MF.PREV);
    e.nx.hidden = !hasF(s, MF.NEXT);
    if (e.mu) {
      e.mu.hidden = !hasF(s, MF.MUTE);
      e.mu.classList.toggle('on', !!a.is_volume_muted);
      setIcon(e.mu, a.is_volume_muted ? 'mdi:volume-off' : 'mdi:volume-high');
    }
    if (e.vol) {
      const set = hasF(s, MF.VOL_SET) && a.volume_level != null;
      e.vol.hidden = e.vv.hidden = !set;
      e.step.hidden = set || !hasF(s, MF.VOL_STEP);
      if (set && !this._drag) {
        const v = Math.round(a.volume_level * 100);
        e.vol.value = v; e.vol.style.setProperty('--p', `${v}%`); e.vv.textContent = `${v} %`;
      }
    }
    const vb = e.vol?.parentElement;
    if (vb) vb.hidden = [...vb.children].every(x => x.hidden);
    if (e.src) this._sources(n);
    this._chips?.forEach((el, i) => {
      const o = this._all[i], ps = h.states[o.entity], pa = ps?.attributes || {};
      el.classList.toggle('on', i === this._idx);
      el.classList.toggle('pl', h.states[this._eidOf(i)]?.state === 'playing');
      el.classList.toggle('na', !ps || ps.state === 'unavailable');
      setIcon(el.firstChild, o.icon || pa.icon || (pa.device_class === 'tv' ? 'mdi:television' : 'mdi:speaker'));
      el.children[1].textContent = o.name ?? pa.friendly_name ?? o.entity;
    });
    this._progress();
    this._tick();
  }
  _sources(s) {
    const c = this._c, a = s?.attributes || {}, e = this._e;
    const only = list(c.sources), all = hasF(s, MF.SOURCE) ? a.source_list || [] : [];
    const srcs = only.length ? all.filter(x => only.includes(x)) : all;
    const key = `${this._idx}|${srcs.join('\n')}`;
    if (key !== this._srcKey) {
      this._srcKey = key;
      e.src.replaceChildren(...srcs.map(x => {
        const el = document.createElement('div');
        el.className = 'pill'; el.dataset.s = x;
        el.innerHTML = '<span class="i"></span><span class="t"></span>';
        setIcon(el.firstChild, mapIcon(c.icon_map, x) || 'mdi:import');
        el.lastChild.textContent = x;
        press(el, {tap: () => this._h.callService('media_player', 'select_source', {entity_id: this._p.entity, source: x})});
        return el;
      }));
    }
    e.src.hidden = !srcs.length;
    [...e.src.children].forEach(el => el.classList.toggle('on', el.dataset.s === a.source));
  }
  _progress() {
    const e = this._e, s = this._st();
    if (!e?.bar || !s) return;
    const d = s.attributes.media_duration, p = posOf(s);
    e.bar.hidden = !(d > 0) || p == null;
    if (e.bar.hidden) return;
    e.bar.classList.toggle('seek', hasF(s, MF.SEEK));
    e.fill.style.width = `${Math.min(100, p / d * 100)}%`;
    e.ta.textContent = clock(Math.min(p, d));
    e.tb.textContent = clock(d);
  }
  // Sekundentakt nur, solange etwas läuft und der Balken sichtbar ist
  _tick() {
    const run = this.isConnected && this._e?.bar && this._st()?.state === 'playing';
    if (run && !this._tm) this._tm = setInterval(() => this._progress(), 1000);
    if (!run && this._tm) { clearInterval(this._tm); this._tm = null; }
  }
}
NovaMediaCard.prototype._act = NovaModularCard.prototype._act;
define('nova-media-card', NovaMediaCard, {name: 'Nova Media Card', description: 'Media-Player mit Cover als Hintergrund, Titel, Interpret, App-Logo, Play/Pause, Vor/Zurück, Lautstärke, Stumm, Ein/Aus, Quellen und mehreren umschaltbaren Playern.', documentationURL: 'https://github.com/Blackstar9119/nova-cards#nova-media-card'});

/* ---------- Editor Media Card ---------- */
const MP = {domain: ['media_player']};
const MPMAIN = [
  {name: 'entity', required: true, selector: {entity: MP}},
  g2({name: 'name', selector: T}, {name: 'icon', selector: I, context: {icon_entity: 'entity'}}),
  g2({name: 'tap_action', selector: A}, {name: 'hold_action', selector: A}),
  g2(sel('artwork', [['background', 'Hintergrund'], ['cover', 'Cover + unscharfer Hintergrund'], ['none', 'Kein Cover']]), {name: 'glow', selector: {boolean: {}}}),
  g2({name: 'show_progress', selector: {boolean: {}}}, {name: 'show_power', selector: {boolean: {}}}),
  g2({name: 'show_volume', selector: {boolean: {}}}, {name: 'show_mute', selector: {boolean: {}}}),
  {name: 'show_source', selector: {boolean: {}}},
  {name: 'sources', selector: {text: {multiple: true}}},
];
const MPMA = [g2({name: 'ma_auto', selector: {boolean: {}}}, {name: 'ma_entity', selector: {entity: {domain: 'media_player', integration: 'music_assistant'}}})];
const MPPLAY = [g2({name: 'show_players', selector: {boolean: {}}}, {name: 'auto_switch', selector: {boolean: {}}})];
const MPITEM = [{name: 'entity', required: true, selector: {entity: MP}}, NAMEICON, {name: 'music_assistant', selector: {entity: {domain: 'media_player', integration: 'music_assistant'}}}];
const MPLOGO = [{name: 'icon_entity', selector: {entity: {}}}];
const MPMAP = [g2({name: 'key', selector: T}, {name: 'value', selector: T})];
const MPLABELS = {...MLABELS, artwork: 'Cover', glow: 'Leuchten beim Abspielen', show_progress: 'Fortschrittsbalken', show_power: 'Ein/Aus-Button',
  show_volume: 'Lautstärke-Regler', show_mute: 'Stumm-Button', show_source: 'Quellenauswahl', sources: 'Nur diese Quellen zeigen',
  show_players: 'Player-Umschalter anzeigen', auto_switch: 'Automatisch zum spielenden Player', icon_entity: 'Icon-Entität (optional)',
  ma_auto: 'Automatisch suchen', ma_entity: 'Oder fest: Music-Assistant-Player', music_assistant: 'Music-Assistant-Player (optional)',
  key: 'App / Quelle / Zustand', value: 'Icon oder Bild-URL', tap_action: 'Icon antippen', hold_action: 'Icon lange drücken'};
const MPHELPERS = {
  tap_action: 'Standard: Details des Players',
  sources: 'Leer = alle Quellen des Players. Genaue Namen wie in source_list',
  auto_switch: 'Bis man selbst einen Player antippt',
  icon_entity: 'Leer = App-Name bzw. Quelle des Players. Sonst zählt der Zustand dieser Entität (z. B. sensor.tv_app)',
  ma_auto: 'Findet den Music-Assistant-Player mit gleichem Namen. Spielt der, kommen Titel, Cover und Steuerung von dort',
  music_assistant: 'Leer = automatisch (wie oben eingestellt)',
  key: 'z. B. Netflix oder music_assistant – Groß/Klein egal',
  value: 'mdi:netflix oder /local/logos/netflix.svg',
};

class NovaMediaCardEditor extends NovaModularCardEditor {
  _form(schema, data, cb) {
    const f = super._form(schema, data, cb);
    f.computeLabel = s => MPLABELS[s.name] ?? s.name;
    f.computeHelper = s => MPHELPERS[s.name];
    return f;
  }
  _h3(t) { const h = document.createElement('h3'); h.textContent = t; return h; }
  _add(label, fn) {
    const a = document.createElement('button');
    a.className = 'add';
    a.innerHTML = `<ha-icon icon="mdi:plus"></ha-icon>${esc(label)}`;
    a.addEventListener('click', e => { e.preventDefault(); fn(); });
    return a;
  }
  _players() { return [].concat(this._config.players || []).map(toObj); }
  _setPlayers(arr) { const c = {...this._config}; if (arr.length) c.players = arr; else delete c.players; this._emit(c); }
  _build() {
    const r = this.shadowRoot, c0 = this._config;
    r.innerHTML = `<style>${ECSS}${MECSS}.maprow{display:flex;gap:6px;align-items:center}.maprow ha-form{flex:1}</style><div class="wrap"></div>`;
    const w = r.querySelector('.wrap'), strip = c => { Object.entries(MDEF).forEach(([k, x]) => c[k] === x && delete c[k]); if (c.glow === true) delete c.glow; return c; };
    w.append(this._form(MPMAIN, {...MDEF, glow: true, ...c0}, v => this._emit(strip(merge(this._config, names(MPMAIN), v)))));

    w.append(this._h3('Music Assistant'));
    const ma = c0.music_assistant;
    w.append(this._form(MPMA, {ma_auto: ma !== false, ma_entity: typeof ma === 'string' ? ma : undefined}, v => {
      const c = {...this._config};
      if (v.ma_entity) c.music_assistant = v.ma_entity; else if (v.ma_auto === false) c.music_assistant = false; else delete c.music_assistant;
      this._emit(c);
    }));

    w.append(this._h3('Weitere Player (umschaltbar)'));
    const pl = this._players();
    if (pl.length) w.append(this._form(MPPLAY, {...MDEF, ...c0}, v => this._emit(strip({...this._config, ...v}))));
    pl.forEach((it, j) => {
      const m = {item: 'Player'};
      const [d, s, body] = this._details(`p.${j}`, it.icon || 'mdi:speaker', this._ilabel(it, j, m), [
        this._btn('mdi:arrow-up', 'Nach oben', () => this._pmove(j, -1), j === 0),
        this._btn('mdi:arrow-down', 'Nach unten', () => this._pmove(j, 1), j === pl.length - 1),
        this._btn('mdi:delete-outline', 'Löschen', () => { this._open = new Set(); this._setPlayers(this._players().filter((_, x) => x !== j)); this._rebuild(); })]);
      body.append(this._form(MPITEM, it, v => {
        const arr = this._players();
        arr[j] = merge(arr[j], names(MPITEM), v);
        this._setPlayers(arr);
        s.querySelector('.lbl').textContent = this._ilabel(arr[j], j, m);
      }));
      w.append(d);
    });
    w.append(this._add('Player hinzufügen', () => { const n = [...this._players(), {}]; this._open = new Set([`p.${n.length - 1}`]); this._setPlayers(n); this._rebuild(); }));

    // App-Logos: Zeilen bleiben im Editor, auch solange sie noch leer sind
    w.append(this._h3('App-Logos (icon_map)'));
    const p = document.createElement('p'); p.className = 'hint';
    p.textContent = 'Ersetzt das Icon oben und bei den Quellen durch ein Logo, passend zu App oder Quelle.';
    w.append(p, this._form(MPLOGO, c0, v => this._emit(merge(this._config, ['icon_entity'], v))));
    const map = this._map ||= Object.entries(c0.icon_map || {});
    const write = () => {
      const o = Object.fromEntries(map.filter(([k, v]) => k && v)), c = {...this._config};
      if (Object.keys(o).length) c.icon_map = o; else delete c.icon_map;
      this._emit(c);
    };
    map.forEach(([k, v], j) => {
      const row = document.createElement('div'); row.className = 'maprow';
      row.append(this._form(MPMAP, {key: k, value: v}, x => { map[j] = [x.key ?? '', x.value ?? '']; write(); }),
        this._btn('mdi:close', 'Entfernen', () => { map.splice(j, 1); write(); this._rebuild(); }));
      w.append(row);
    });
    w.append(this._add('Logo hinzufügen', () => { map.push(['', '']); this._rebuild(); }));
  }
  setConfig(c) {
    if (JSON.stringify(c) !== this._emitted) this._map = null;
    super.setConfig(c);
  }
  _pmove(j, dir) {
    const arr = this._players(), t = j + dir;
    [arr[j], arr[t]] = [arr[t], arr[j]];
    this._open = new Set([`p.${t}`]);
    this._setPlayers(arr); this._rebuild();
  }
}
define('nova-media-card-editor', NovaMediaCardEditor);

/* ---------- Nova Saugroboter Card ---------- */
const VCSS = `
.g.vc.run{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 1px color-mix(in srgb,var(--nv-accent) 40%,transparent),inset 0 1px 0 rgba(255,255,255,.12)}
.vc.run .hd .ic ha-icon{animation:nv-vc 2.4s ease-in-out infinite}
@keyframes nv-vc{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(8deg)}}
.vc .hd small.er{color:var(--nv-error);opacity:1}
.bat{display:inline-flex;align-items:center;gap:4px;padding:6px 10px;border-radius:999px;background:var(--nv-chip);font-size:12.5px;font-weight:600;flex:none}
.bat ha-icon{--mdc-icon-size:17px}
.bat.low{background:color-mix(in srgb,var(--nv-error) 30%,transparent)}
.bat.chg ha-icon{color:var(--nv-accent)}
.vc>.main{display:contents}.vc .hd{order:0}.vc .mpnl{order:1}.vc>.main>:not(.hd){order:2}
.mpnl{display:flex;flex-direction:column;gap:8px;min-width:0}
.mpnl .bt{margin:0}
.map{position:relative;border-radius:calc(var(--nv-radius) - 8px);overflow:hidden;background:rgba(0,0,0,.25)}
.map.ar{aspect-ratio:var(--ar)}.map{max-height:var(--nv-map-max,280px)}
.map img{display:block;width:100%;height:auto;max-height:var(--nv-map-max,280px);object-fit:contain}
.map.ar img{height:100%;object-fit:contain}
.ctl{display:flex;align-items:center;justify-content:center;gap:14px}
.ctl .cb{width:44px;height:44px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);border:1px solid rgba(255,255,255,.08);transition:all .2s}
.ctl .cb ha-icon{--mdc-icon-size:24px}
.ctl .cb.pp{width:56px;height:56px;background:var(--nv-accent);color:var(--nv-accent-fg);border-color:transparent;box-shadow:0 0 16px color-mix(in srgb,var(--nv-accent) 45%,transparent)}
.ctl .cb.pp ha-icon{--mdc-icon-size:30px}
.cb:active{transform:scale(.9)}
.ctl.pl{justify-content:flex-start;gap:7px;flex-wrap:wrap}
.fs .pill,.ctl.pl .pill{flex:none}
.rooms .pill{background:color-mix(in srgb,var(--nv-active) 45%,transparent);border-color:color-mix(in srgb,var(--nv-active) 60%,transparent)}
.rooms .pill.on{background:var(--nv-active);box-shadow:0 0 14px color-mix(in srgb,var(--nv-active) 50%,transparent)}
.rooms .pill.go{order:99;background:var(--nv-accent);color:var(--nv-accent-fg);border-color:transparent;box-shadow:none}
.vc .sws .list{row-gap:2px}
.rooms .pill.cur{box-shadow:0 0 0 2px var(--nv-accent),0 0 14px color-mix(in srgb,var(--nv-accent) 50%,transparent)}
.hd .all{flex:none}
.hd .all.on{background:var(--nv-active);color:var(--nv-active-fg);border-color:transparent}
.cons .kv{flex-wrap:wrap;row-gap:4px}
.cons .kv .cbar{flex-basis:100%;height:4px;border-radius:2px;background:rgba(255,255,255,.12);overflow:hidden}
.cons .kv .cbar i{display:block;height:100%;background:var(--nv-active);border-radius:2px}
.cons .warn .cbar i{background:var(--nv-warn)}.cons .warn .v{color:var(--nv-warn);opacity:1}
.cons .pill.warn{background:color-mix(in srgb,var(--nv-warn) 25%,transparent)}
.vc.narrow .ctl{gap:8px}.vc.narrow .ctl .cb{width:38px;height:38px}.vc.narrow .ctl .cb.pp{width:48px;height:48px}
:host{height:auto;container-type:normal}.g.vc{height:auto}
.g.vc.side{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.25fr);gap:14px;align-items:stretch}
.vc.side>.main{display:flex;flex-direction:column;gap:12px;min-width:0;padding:12px;border-radius:calc(var(--nv-radius) - 6px);background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08)}
.vc.side .mpnl{padding:12px;border-radius:calc(var(--nv-radius) - 6px);background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08)}
.vc.side .map{flex:1;min-height:var(--nova-vacuum-map-min-height,240px);max-height:none;aspect-ratio:auto}
.vc.side .map img{position:absolute;inset:0;width:100%;height:100%;max-height:none;object-fit:contain}
.g.vc.auto.wide{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.25fr);gap:14px;align-items:stretch}
.vc.auto.wide>.main{display:flex;flex-direction:column;gap:12px;min-width:0;padding:12px;border-radius:calc(var(--nv-radius) - 6px);background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08)}
.vc.auto.wide .mpnl{padding:12px;border-radius:calc(var(--nv-radius) - 6px);background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08)}
.vc.auto.wide .map{flex:1;min-height:var(--nova-vacuum-map-min-height,240px);max-height:none;aspect-ratio:auto}
.vc.auto.wide .map img{position:absolute;inset:0;width:100%;height:100%;max-height:none;object-fit:contain}
.scene{--rc:var(--nova-vacuum-robot-color,#3d4452);--sc:var(--nova-vacuum-station-color,#2f3542);--wc:var(--nova-vacuum-water-color,#6fb6f2);
position:relative;order:0;height:var(--nova-vacuum-scene-height,100px)}
.scene svg{display:block;width:100%;height:100%;overflow:visible}
.scene .cap{position:absolute;left:0;top:0;padding:4px 10px;border-radius:999px;background:var(--nv-chip);font-size:11px;font-weight:500;letter-spacing:.02em;opacity:.85}
.scene .cap:empty{display:none}
.sc .floor{fill:currentColor;opacity:.1}
.sc .trail{fill:var(--wc);opacity:0;transform-box:fill-box;transform-origin:left center}
.sc .shd{fill:#000;opacity:.3}
.sc .body{fill:url(#vgr);stroke:rgba(255,255,255,.14);stroke-width:.6}.sc .top{fill:rgba(255,255,255,.1)}.sc .bump{fill:rgba(0,0,0,.35)}
.sc .lid{fill:color-mix(in srgb,var(--rc) 55%,#000);stroke:rgba(255,255,255,.12);stroke-width:.5}.sc .lidl{fill:rgba(255,255,255,.25)}
.sc .mop{fill:var(--wc);opacity:0;transition:opacity .4s}
.sc .br line{stroke:rgba(255,255,255,.35);stroke-width:1;stroke-linecap:round}
.sc .br{transform-box:fill-box;transform-origin:center}
.sc .led{fill:var(--nv-active);opacity:.9}
.sc .bolt{fill:none;stroke:var(--nv-accent);stroke-width:1;stroke-linejoin:round;opacity:0}
.sc .err{opacity:0}.sc .err circle{fill:none;stroke:var(--nv-error);stroke-width:1.2}.sc .err rect,.sc .err .dot{fill:var(--nv-error);stroke:none}
.sc .dust circle{fill:currentColor;opacity:0}
.sc .ramp{fill:color-mix(in srgb,var(--sc) 80%,#000)}.sc .tower{fill:url(#vgs);stroke:rgba(255,255,255,.12);stroke-width:.6}.sc .seam{fill:rgba(0,0,0,.35)}
.sc .sled{fill:var(--nv-active);opacity:.35}
.sc .tank{fill:rgba(0,0,0,.4)}.sc .tkc{fill:var(--wc)}.sc .tkd{fill:#9a7a52}.sc .tkc,.sc .tkd{transition:all .6s}
.sc .tkc.low,.sc .tkd.low{fill:var(--nv-error);animation:vc-blink 1.6s infinite}
.sc .parts circle{fill:#b8a993;opacity:0}
.sc .duct,.sc .pipe{fill:rgba(0,0,0,.35);transition:fill .4s}.sc.empty .duct{fill:rgba(184,169,147,.6)}
.sc .bin{fill:rgba(0,0,0,.3)}.sc .bag{fill:#b8a993;opacity:.35;transform-box:fill-box;transform-origin:center bottom;transition:opacity .4s}
.sc.empty .bag{opacity:.75;animation:vc-bag .6s ease-in-out infinite alternate}
.sc.wash .pipe{fill:color-mix(in srgb,var(--wc) 45%,transparent)}.sc.wash .pipe:last-of-type{fill:rgba(154,122,82,.55)}
.sc .water ellipse,.sc .water circle{fill:var(--wc);opacity:0;transform-box:fill-box;transform-origin:center}
.sc .bubl circle{fill:none;stroke:color-mix(in srgb,var(--wc) 60%,#fff);stroke-width:.5}
.sc .heat path{fill:none;stroke:color-mix(in srgb,var(--nv-accent) 70%,#fff);stroke-width:1;stroke-linecap:round;opacity:0}
.sc .rob{transform:translateX(110px);transition:transform 1.4s ease-in-out}
.sc.docked .rob{transform:translateX(240px)}
.sc.cleaning .rob{animation:vc-drive 16s ease-in-out infinite}
.sc.returning .rob{animation:vc-home 6s ease-in-out infinite}
.sc.cleaning .br,.sc.returning .br{animation:vc-spin .35s linear infinite}
.sc.cleaning:not(.mopping) .dust circle{animation:vc-dust 1.2s linear infinite}
.sc .dust circle:nth-child(2),.sc .parts circle:nth-child(2),.sc .water ellipse:nth-child(2),.sc .heat path:nth-child(2){animation-delay:.4s}
.sc .dust circle:nth-child(3),.sc .parts circle:nth-child(3),.sc .water ellipse:nth-child(3),.sc .heat path:nth-child(3){animation-delay:.8s}
.sc.paused .led{animation:vc-blink 1.6s infinite}
.sc.error .rb{transform:rotate(-3deg);transform-box:fill-box;transform-origin:center bottom}
.sc.error .err{opacity:1;animation:vc-blink 1.6s infinite}.sc.error .led{fill:var(--nv-error);animation:vc-blink 1.6s infinite}
.sc.mop .mop{opacity:.9}
.sc.cleaning.mopping .trail{animation:vc-trail 16s ease-in-out infinite}
.sc.chg .bolt{animation:vc-pulse 3s ease-in-out infinite}.sc.chg .led{animation:vc-pulse 3s ease-in-out infinite}
.sc.empty .parts circle{animation:vc-suck .9s cubic-bezier(.5,0,1,1) infinite}
.sc .parts circle:nth-child(4){animation-delay:.2s}.sc .parts circle:nth-child(5){animation-delay:.6s}
.sc .parts circle:nth-child(2){--dx:-8px}.sc .parts circle:nth-child(3){--dx:10px}.sc .parts circle:nth-child(4){--dx:-14px}.sc .parts circle:nth-child(5){--dx:14px}
.sc.empty .stn,.sc.empty .rb{animation:vc-jit .09s linear infinite}
.sc.wash .water ellipse{animation:vc-wave 1.4s ease-in-out infinite}
.sc.wash .drops circle{animation:vc-drop 1.1s ease-in infinite}
.sc .dirt circle{fill:#9a7a52;opacity:0}.sc.wash .dirt circle{animation:vc-rise 1.1s ease-in infinite}
.sc .dirt circle:nth-child(2){animation-delay:.35s}.sc .dirt circle:nth-child(3){animation-delay:.7s}
.sc.wash .bubl circle{animation:vc-bubl 2s ease-out infinite}
.sc.wash .spl circle{animation:vc-spl .9s ease-out infinite}
.sc.wash .mop{opacity:1;animation:vc-scrub .35s ease-in-out infinite alternate}
.sc .drops circle:nth-child(2),.sc .bubl circle:nth-child(2),.sc .spl circle:nth-child(2){animation-delay:.35s}
.sc .drops circle:nth-child(3),.sc .bubl circle:nth-child(3),.sc .spl circle:nth-child(3){animation-delay:.7s}
.sc.dry .heat path{animation:vc-heat 2.4s ease-in-out infinite}
.sc.empty .sled,.sc.wash .sled,.sc.dry .sled{opacity:1;animation:vc-pulse 2s ease-in-out infinite}
.sc.empty .sled{fill:#b8a993}.sc.wash .sled{fill:var(--wc)}.sc.dry .sled{fill:var(--nv-accent)}
.sc:not(.has-tanks) :is(.tank,.tkc,.tkd,.pipe,.drops,.dirt,.bubl),.sc:not(.has-bag) :is(.bin,.bag,.duct,.parts){display:none}
.scene.still *{animation-play-state:paused!important}
@media (prefers-reduced-motion:reduce){.scene *{animation:none!important}}
@keyframes vc-drive{0%,100%{transform:translateX(20px)}45%,50%{transform:translateX(150px)}}
@keyframes vc-home{0%{transform:translateX(90px)}85%,100%{transform:translateX(240px)}}
@keyframes vc-spin{to{transform:rotate(360deg)}}
@keyframes vc-blink{50%{opacity:.25}}
@keyframes vc-pulse{0%,100%{opacity:.3}50%{opacity:.95}}
@keyframes vc-dust{0%{opacity:0;transform:translateX(0)}30%{opacity:.35}100%{opacity:0;transform:translateX(12px)}}
@keyframes vc-suck{0%{opacity:0;transform:translate(0,0)}15%{opacity:.95}80%{opacity:.8;transform:translate(0,-18px)}100%{opacity:0;transform:translate(var(--dx,4px),-22px)}}
@keyframes vc-bag{from{transform:scale(1,.9)}to{transform:scale(1.03,1.08)}}
@keyframes vc-rise{0%{opacity:0;transform:translateY(0)}15%{opacity:.9}100%{opacity:.3;transform:translateY(-38px)}}
@keyframes vc-jit{0%,100%{transform:translateX(0)}50%{transform:translateX(.35px)}}
@keyframes vc-drop{0%{opacity:0;transform:translateY(0)}15%{opacity:.95}100%{opacity:.3;transform:translateY(38px)}}
@keyframes vc-bubl{0%{opacity:0;transform:translateY(0)}20%{opacity:.9}100%{opacity:0;transform:translateY(-30px)}}
@keyframes vc-spl{0%{opacity:0;transform:translate(0,0)}30%{opacity:.9}100%{opacity:0;transform:translate(2px,-7px)}}
@keyframes vc-scrub{from{transform:translateX(-1.5px)}to{transform:translateX(1.5px)}}
@keyframes vc-wave{0%,100%{opacity:0;transform:scaleX(.4)}50%{opacity:.8;transform:scaleX(1)}}
@keyframes vc-heat{0%{opacity:0;transform:translateY(6px)}40%{opacity:.75}100%{opacity:0;transform:translateY(-16px)}}
@keyframes vc-trail{0%{transform:scaleX(.2);opacity:.4}45%,90%{transform:scaleX(.76);opacity:.4}100%{transform:scaleX(.2);opacity:0}}`;

// supported_features von vacuum
const VF = {PAUSE: 4, STOP: 8, RETURN: 16, FAN: 32, LOCATE: 512, SPOT: 1024, START: 8192, AREA: 16384};
const VDEF = {map_max_height: 280, scene: true, scene_auto: true, station_type: 'auto', layout: 'auto', controls: 'pills', battery_display: 'status', rooms_title: 'Raum reinigen', map_title: 'Karte', glow: true, show_stop: true, show_return: true, show_locate: true, show_spot: false, show_fan_speed: true,
  map_aspect_ratio: 'auto', map_refresh: 5, map_action: 'more-info', segment_mode: 'roborock', segment_repeat: 1, consumables_layout: 'rows'};
const VRUN = ['cleaning', 'returning'];
// Steuer-Pillen: Schlüssel → [Icon, Text, Feature, Service]
const VCTL = {start: ['mdi:play', 'Start', 8192, 'start'], pause: ['mdi:pause', 'Pause', 4, 'pause'], stop: ['mdi:stop', 'Stopp', 8, 'stop'],
  home: ['mdi:home-import-outline', 'Zur Station', 16, 'return_to_base'], locate: ['mdi:map-marker-question-outline', 'Suchen', 512, 'locate'], spot: ['mdi:target-variant', 'Spot', 1024, 'clean_spot']};
const vtitle = t => t === '-' || t === '' || t === false ? '' : t;
const segId = x => NUMRE.test(x) ? +x : x;
// Saugstärke übersetzt (falls die Integration das kann), sonst smart_mode → Smart mode
const fanName = (h, s, x) => { try { const t = h.formatEntityAttributeValue?.(s, 'fan_speed', x); if (t && t !== x) return t; } catch {} const v = String(x).replace(/_/g, ' '); return v.charAt(0).toUpperCase() + v.slice(1); };
// Raumreinigung je Integration: [domain, service, data]
const SEG = {
  roborock: (id, s, n) => ['vacuum', 'send_command', {entity_id: id, command: 'app_segment_clean', params: [{segments: s.map(segId), repeat: n}]}],
  valetudo: (id, s, n) => ['vacuum', 'send_command', {entity_id: id, command: 'segment_cleanup', params: {segment_ids: s.map(String), iterations: n, customOrder: true}}],
  dreame: (id, s, n) => ['dreame_vacuum', 'vacuum_clean_segment', {entity_id: id, segments: s.map(segId), repeats: n}],
  xiaomi: (id, s) => ['xiaomi_miio', 'vacuum_clean_segment', {entity_id: id, segments: s.map(segId)}],
};
const batIcon = (v, chg) => {
  if (v == null || isNaN(v)) return 'mdi:battery-unknown';
  const t = Math.round(v / 10) * 10;
  if (chg) return t >= 100 ? 'mdi:battery-charging-100' : t < 10 ? 'mdi:battery-charging-outline' : `mdi:battery-charging-${t}`;
  return t >= 100 ? 'mdi:battery' : t < 10 ? 'mdi:battery-outline' : `mdi:battery-${t}`;
};
// Akku-Sensor am selben Gerät (battery_level-Attribut ist bei neueren HA-Versionen weg)
const batOf = (h, id) => {
  const dev = h.entities?.[id]?.device_id;
  if (!dev) return null;
  return Object.values(h.entities).find(e => e.device_id === dev && dom(e.entity_id) === 'sensor' && h.states[e.entity_id]?.attributes.device_class === 'battery')?.entity_id || null;
};

// Animation: Station hinten, Roboter davor, Effekte obendrauf (Seitenansicht, viewBox 320×120)
const VSCENE = `<div class="scene sc"><svg viewBox="0 8 320 102" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
<defs><linearGradient id="vgr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:color-mix(in srgb,var(--rc) 75%,#fff)"/><stop offset="1" style="stop-color:color-mix(in srgb,var(--rc) 70%,#000)"/></linearGradient>
<linearGradient id="vgs" x1="0" y1="0" x2="1" y2="0"><stop offset="0" style="stop-color:color-mix(in srgb,var(--sc) 85%,#fff)"/><stop offset="1" style="stop-color:color-mix(in srgb,var(--sc) 80%,#000)"/></linearGradient>
<clipPath id="vtc"><rect x="293" y="22" width="22" height="30" rx="3"/></clipPath><clipPath id="vtd"><rect x="267" y="22" width="22" height="30" rx="3"/></clipPath></defs>
<rect class="floor" x="0" y="104" width="320" height="1"/><rect class="trail" x="10" y="104" width="230" height="1.6" rx=".8"/>
<g class="stn"><path class="ramp" d="M236 104 L246 98 L320 98 L320 104 Z"/><rect class="tower" x="262" y="12" width="58" height="86" rx="6"/>
<rect class="sled" x="282" y="15.5" width="18" height="1.4" rx=".7"/>
<rect class="tank" x="267" y="22" width="22" height="30" rx="3"/><rect class="tank" x="293" y="22" width="22" height="30" rx="3"/>
<rect class="tkd" clip-path="url(#vtd)" x="267" y="22" width="22" height="30"/><rect class="tkc" clip-path="url(#vtc)" x="293" y="22" width="22" height="30"/>
<rect class="bin" x="267" y="56" width="48" height="20" rx="3"/><rect class="bag" x="271" y="59" width="40" height="14" rx="5"/>
<rect class="duct" x="289.8" y="74" width="2.4" height="12" rx="1.2"/><rect class="pipe" x="316.2" y="50" width="1.6" height="40" rx=".8"/><rect class="pipe" x="264.2" y="50" width="1.6" height="40" rx=".8"/></g>
<g class="rob"><ellipse class="shd" cx="35" cy="104" rx="34" ry="2.4"/><g class="rb"><rect class="mop" x="8" y="99.5" width="54" height="2.5" rx="1.2"/>
<g transform="translate(5 101)"><g class="br"><line x1="-5" y1="0" x2="5" y2="0"/><line x1="0" y1="-1.6" x2="0" y2="1.6"/></g></g>
<rect class="body" x="0" y="86" width="70" height="14" rx="7"/><rect class="top" x="4" y="85" width="62" height="2.2" rx="1.1"/><rect class="bump" x="1" y="93" width="68" height=".8"/>
<rect class="lid" x="28" y="79" width="14" height="6.5" rx="2"/><rect class="lidl" x="30" y="81.2" width="10" height="1"/>
<rect class="led" x="56" y="89.5" width="9" height="1.4" rx=".7"/><g class="dust"><circle cx="-5" cy="102" r="1"/><circle cx="-10" cy="101" r=".8"/><circle cx="-15" cy="102.5" r=".9"/></g>
<path class="bolt" d="M13 66 l-4 7 h4 l-2 6 l6 -8 h-4 l2 -5 z"/><g class="err"><circle cx="35" cy="68" r="5.5"/><rect x="34.3" y="64.8" width="1.4" height="4" rx=".7"/><circle class="dot" cx="35" cy="70.9" r=".8"/></g></g></g>
<g class="parts"><circle cx="291" cy="88" r="1.4"/><circle cx="291" cy="88" r="1.1"/><circle cx="291" cy="88" r="1.3"/><circle cx="291" cy="88" r="1"/><circle cx="291" cy="88" r="1.2"/></g>
<g class="water"><ellipse cx="256" cy="104" rx="11" ry="1.6"/><ellipse cx="280" cy="104" rx="11" ry="1.6"/><ellipse cx="304" cy="104" rx="11" ry="1.6"/>
<g class="drops"><circle cx="317" cy="52" r="1.1"/><circle cx="317" cy="52" r="1"/><circle cx="317" cy="52" r="1.1"/></g>
<g class="dirt"><circle cx="265" cy="90" r="1.1"/><circle cx="265" cy="90" r="1"/><circle cx="265" cy="90" r="1.1"/></g>
<g class="bubl"><circle cx="274" cy="50" r=".9"/><circle cx="281" cy="50" r=".7"/><circle cx="277" cy="50" r=".8"/></g>
<g class="spl"><circle cx="250" cy="100" r=".9"/><circle cx="270" cy="99" r="1"/><circle cx="296" cy="100" r=".8"/></g></g>
<g class="heat"><path d="M249 84 q2 -4 0 -8 q-2 -4 0 -8"/><path d="M257 84 q2 -4 0 -8 q-2 -4 0 -8"/><path d="M304 86 q2 -4 0 -8 q-2 -4 0 -8"/></g>
</svg><div class="cap"></div></div>`;
// Muster für Status-Texte (Roh-Zustand und übersetzt), z. B. emptying_the_bin, washing_the_mop, Trocknen
const VPAT = {empty: /empty|evacuat|dust_?collect|collect_?dust|absaug|entleer/i, wash: /wash|wasch|wäsch|self_?clean|rinse/i, dry: /dry|trock/i, mop: /mop|wisch|wipe/i, chg: /charg|lädt/i};
const VSTATES = ['docked', 'cleaning', 'returning', 'paused', 'error', 'idle'];
// aktiv: Zahl > 0 (z. B. Rest-Trocknungszeit), sonst an/aus
const vact = s => !!s && !['unavailable', 'unknown'].includes(s.state) && (NUMRE.test(s.state) ? +s.state > 0 : isOn(s));
// Gerät des Roboters plus zugehörige Geräte (z. B. eigene „Dock“-Station bei Roborock): via_device in beide Richtungen,
// oder gleicher Integrationseintrag und Name/Kennung beginnt gleich – so bleiben zwei Roboter im selben Konto getrennt
function vdevs(h, id) {
  const dev = h?.entities?.[id]?.device_id, D = h?.devices || {}, me = D[dev];
  if (!dev) return [];
  if (!me) return [dev];
  const idf = d => (d.identifiers || []).map(x => String(Array.isArray(x) ? x[1] : x));
  const mine = idf(me), ce = me.config_entries || [];
  return Object.values(D).filter(d => d.id === dev || d.via_device_id === dev || me.via_device_id === d.id ||
    ((d.config_entries || []).some(e => ce.includes(e)) && (idf(d).some(x => mine.some(m => x !== m && x.startsWith(m))) || (!!d.name && !!me.name && d.name.startsWith(me.name) && /^\s*(dock|station|base|ladestation|basis)\b/i.test(d.name.slice(me.name.length))))))
    .map(d => d.id);
}
const vents = (h, id) => { const ds = vdevs(h, id); return ds.length ? Object.values(h.entities).filter(e => ds.includes(e.device_id) && e.entity_id !== id) : []; };
// Passende Entitäten am Roboter und seiner Station finden (Entity-ID + translation_key, Deutsch/Englisch)
function vauto(h, id) {
  const out = {};
  const ents = vents(h, id).filter(e => !e.hidden);
  if (!ents.length) return out;
  const txt = e => `${e.translation_key || ''} ${e.entity_id}`;
  const find = (doms, re, not) => ents.find(e => doms.includes(dom(e.entity_id)) && re.test(txt(e)) && !(not && not.test(txt(e))))?.entity_id;
  const ERR = /error|fehler|fault/;
  out.status = find(['sensor'], /^(vacuum_)?(status|state) |_(status|state)$/, /dock|station|base|error|fehler|fault/);
  out.station = find(['sensor'], /(dock|station|base)\w*_(status|state)|(status|state)\w*_(dock|station)/, ERR);
  out.mop_attached = find(['binary_sensor'], /mop\w*(attach|install)|(attach|install)\w*mop|mopp?_angebracht/);
  out.mop_mode = ents.find(e => {
    if (dom(e.entity_id) !== 'select') return false;
    const o = (h.states[e.entity_id]?.attributes.options || []).map(String);
    return o.some(x => VPAT.mop.test(x)) && o.some(x => !VPAT.mop.test(x));
  })?.entity_id;
  out.clean_water = find(['binary_sensor', 'sensor'], /clean_?(water|box|tank)|fresh_?water|frischwasser/);
  out.dirty_water = find(['binary_sensor', 'sensor'], /dirty_?(water|box|tank)|waste_?water|schmutzwasser/);
  out.drying = find(['sensor', 'binary_sensor'], /dry|trockn/, ERR);
  out.charging = find(['binary_sensor'], /charg|ladestatus/);
  out.emptying = find(['binary_sensor'], /empty|entleer|absaug/);
  out.washing = find(['binary_sensor'], /wash|wasch|wäsch/);
  return Object.fromEntries(Object.entries(out).filter(([, v]) => v));
}

// Stationstyp: dock (nur Laden), empty (Absaugen), wash (Wassertanks/Moppwäsche), full (beides)
const VBAG = /empty|entleer|absaug|evacuat|dust_?(bag|bin|collect)|staubbeutel/;
const VTANK = /mop_?wash|wash_?mop|moppw|wäsch|wash|self_?clean|clean_?(water|box|tank)|dirty_?(water|box|tank)|frischwasser|schmutzwasser|dry|trockn/;
function vstation(h, id, c, auto) {
  if (['dock', 'empty', 'wash', 'full'].includes(c.station_type)) return c.station_type;
  const t = h?.entities ? vents(h, id).map(e => `${e.translation_key || ''} ${e.entity_id}`) : [];
  const has = k => c[k] !== false && !!(c[k] || (c.scene_auto !== false && auto[k]));
  const bag = has('emptying') || (c.scene_auto !== false && t.some(x => VBAG.test(x)));
  const tank = ['clean_water', 'dirty_water', 'washing', 'drying'].some(has) || (c.scene_auto !== false && t.some(x => VTANK.test(x)));
  return bag && tank ? 'full' : bag ? 'empty' : tank ? 'wash' : 'dock';
}
// Turm und LED je Stationstyp: [x, y, Breite, Höhe], LED [x, y, Breite]
const VTOWER = {full: [262, 12, 58, 86, 282, 15.5, 18], wash: [262, 12, 58, 86, 282, 15.5, 18], empty: [262, 50, 58, 48, 282, 53, 18], dock: [292, 76, 28, 22, 299, 79.5, 14]};

class NovaVacuumCard extends HTMLElement {
  static getConfigElement() { return document.createElement('nova-vacuum-card-editor'); }
  static getStubConfig(h) {
    const ids = Object.keys(h.states).filter(i => i.startsWith('vacuum.'));
    return {entity: ids[0] || 'vacuum.'};
  }
  setConfig(c) {
    if (!c || typeof c !== 'object') throw new Error('Ungültige Konfiguration');
    if (!c.entity || dom(c.entity) !== 'vacuum') throw new Error('entity muss eine vacuum.* Entität sein');
    if (c.map && !['camera', 'image'].includes(dom(c.map))) throw new Error('map muss eine camera.* oder image.* Entität sein');
    this._c = {...VDEF, ...c, rooms: [].concat(c.rooms || []).map(toObj).filter(o => o.name || o.icon || o.entity || o.segments != null || o.tap_action),
      consumables: [].concat(c.consumables || []).map(toObj).filter(o => o.entity), switches: [].concat(c.switches || []).map(toObj).filter(o => o.entity)};
    this._built = false;
    if (this._h) { this._build(); this._update(); }
  }
  set hass(h) {
    this._h = h;
    if (!this._c) return;
    if (!this._built) this._build();
    this._update();
  }
  getCardSize() { return 3 + (this._c?.map ? 4 : 0) + Math.ceil(((this._c?.consumables.length || 0) + (this._c?.switches.length || 0)) / 2); }
  getGridOptions() { return {columns: 12, rows: 'auto', min_columns: 4}; }
  connectedCallback() {
    if ('IntersectionObserver' in window) {
      this._io ||= new IntersectionObserver(es => { this._vis = es[es.length - 1].isIntersecting; this._tick(); }, {rootMargin: '100px'});
      this._io.observe(this);
    } else this._vis = true;
    if ('ResizeObserver' in window) {
      this._ro ||= new ResizeObserver(es => this._width(Math.round(es[es.length - 1].contentRect.width)));
      this._ro.observe(this);
    }
    this._tick();
  }
  disconnectedCallback() { this._io?.disconnect(); this._ro?.disconnect(); this._vis = false; this._tick(); }
  // Layout nach Kartenbreite – mit Puffer (ab 640 px daneben, erst unter 600 px wieder darunter), damit es nie hin- und herkippt
  _width(w) {
    const g = this._e?.g;
    if (!g || !w) return;
    const wide = g.classList.contains('wide') ? w >= 600 : w >= 640;
    g.classList.toggle('wide', wide);
    g.classList.toggle('narrow', w <= 300);
  }
  _build() {
    this._built = true;
    const c = this._c, r = this.shadowRoot || this.attachShadow({mode: 'open'});
    this._bat = c.battery || batOf(this._h, c.entity);
    const ar = String(c.map_aspect_ratio || 'auto').replace(':', '/');
    const pills = c.controls !== 'round', rt = vtitle(c.rooms_title), mt = vtitle(c.map_title);
    const lay = c.map ? (['side', 'stack'].includes(c.layout) ? c.layout : 'auto') : 'stack';
    r.innerHTML = `<style>${MVARS}${MCSS}${VCSS}</style><div class="g vc ${lay}"><div class="main">
<div class="hd"><div class="ic"></div><div class="nm"><b></b><small></small></div>${c.all ? '<div class="pill all"><span class="i"></span><span class="t"></span></div>' : ''}<div class="bat" hidden><ha-icon></ha-icon><span></span></div></div>
${c.scene !== false ? VSCENE : ''}
${pills ? `<div class="ctl pl pills">${Object.entries(VCTL).map(([k, [ic, t]]) => `<div class="pill c-${k}"><ha-icon icon="${ic}"></ha-icon><span>${t}</span></div>`).join('')}</div>`
    : '<div class="ctl"><div class="cb sp" title="Spot"><ha-icon icon="mdi:target-variant"></ha-icon></div><div class="cb st" title="Stopp"><ha-icon icon="mdi:stop"></ha-icon></div><div class="cb pp" title="Start/Pause"><ha-icon icon="mdi:play"></ha-icon></div><div class="cb hm" title="Zur Station"><ha-icon icon="mdi:home-import-outline"></ha-icon></div><div class="cb lo" title="Suchen"><ha-icon icon="mdi:map-marker-question-outline"></ha-icon></div></div>'}
${c.show_fan_speed !== false ? '<div class="pills fs"></div>' : ''}
${c.rooms.length ? `<div class="blk rooms">${rt ? `<div class="bt">${esc(rt)}</div>` : ''}<div class="pills"></div></div>` : ''}
${c.switches.length ? '<div class="blk sws"></div>' : ''}
${c.consumables.length ? `<div class="blk cons"><div class="${c.consumables_layout === 'chips' ? 'pills' : 'list'}"></div></div>` : ''}</div>
${c.map ? `<div class="mpnl">${mt ? `<div class="bt">${esc(mt)}</div>` : ''}<div class="map${ar !== 'auto' ? ' ar' : ''}" style="--ar:${esc(ar)};--nv-map-max:${c.map_max_height > 0 ? +c.map_max_height + 'px' : 'none'}"><img alt=""></div></div>` : ''}</div>`;
    const q = s => r.querySelector(s);
    this._e = {g: q('.g'), ic: q('.hd .ic'), name: q('.hd b'), sub: q('.hd small'), bat: q('.bat'), map: q('.map'), img: q('.map img'),
      pp: q('.pp'), st: q('.st'), hm: q('.hm'), lo: q('.lo'), sp: q('.sp'), fs: q('.fs'), rooms: q('.rooms .pills'), cons: q('.cons > div')};
    const e = this._e, svc = (s, d = {}) => this._h.callService('vacuum', s, {entity_id: c.entity, ...d});
    press(e.ic, {tap: () => this._act({entity: c.entity, tap_action: c.tap_action}, 'tap', true), hold: () => this._act({entity: c.entity, hold_action: c.hold_action}, 'hold')});
    this._allEl = q('.hd .all');
    if (this._allEl) press(this._allEl, {tap: () => this._act({entity: c.all, confirm: c.all_confirm}, 'tap'), hold: () => this._act({entity: c.all}, 'hold')});
    press(e.bat, {tap: () => this._bat && fire(this, 'hass-more-info', {entityId: this._bat})});
    // Start: eingeplante Räume reinigen; nichts eingeplant, „Überall“ an oder Pause = normal starten bzw. fortsetzen
    const start = () => { const p = this._picked(); p.length && this._st()?.state !== 'paused' ? this._clean(p) : svc('start'); };
    if (pills) this._ctl = Object.entries(VCTL).map(([k, d]) => { const el = q(`.c-${k}`); press(el, {tap: () => k === 'start' ? start() : svc(d[3])}); return [k, el, d]; });
    else {
      press(e.pp, {tap: () => { const s = this._st(); s?.state === 'cleaning' ? svc(hasF(s, VF.PAUSE) ? 'pause' : 'stop') : start(); }});
      press(e.st, {tap: () => svc('stop')});
      press(e.hm, {tap: () => svc('return_to_base')});
      press(e.lo, {tap: () => svc('locate')});
      press(e.sp, {tap: () => svc('clean_spot')});
    }
    // Schalter wie der Baustein „Schalter & Entitäten“ der Modular Card
    const sw = q('.sws');
    this._swUp = sw ? BLOCKS.entities.call(this, {entities: c.switches, columns: c.switches_columns}, sw) : null;
    if (e.map) {
      press(e.map, {tap: () => this._mapTap(), hold: () => fire(this, 'hass-more-info', {entityId: c.map})});
      // Feste Höhe nach dem ersten Bild: neue Kartenbilder beim Reinigen verschieben das Layout nicht (Safari kennt keinen Scroll-Anker)
      e.img.addEventListener('load', () => {
        if (e.map.classList.contains('ar') || !e.img.naturalWidth) return;
        e.map.style.setProperty('--ar', `${e.img.naturalWidth}/${e.img.naturalHeight}`);
        e.map.classList.add('ar');
      });
    }
    // Räume: mit Segmenten = auswählen und gesammelt reinigen, sonst Aktion/Entität direkt
    this._sel = new Set();
    if (e.rooms) {
      this._rooms = c.rooms.map((o, i) => {
        const el = document.createElement('div');
        el.className = 'pill';
        el.innerHTML = '<span class="i"></span><span class="t"></span>';
        press(el, {tap: () => {
          if (o.tap_action?.action || o.entity || (!o.area && !list(o.segments).length)) return this._act(o, 'tap');
          this._sel.has(i) ? this._sel.delete(i) : this._sel.add(i);
          this._update();
        }, hold: () => this._act(o, 'hold')});
        e.rooms.append(el);
        return el;
      });
      this._go = document.createElement('div');
      this._go.className = 'pill go';
      this._go.innerHTML = '<ha-icon icon="mdi:play"></ha-icon><span class="t"></span>';
      press(this._go, {tap: () => this._clean(this._picked())});
      e.rooms.append(this._go);
    }
    if (e.cons) {
      const chips = c.consumables_layout === 'chips';
      this._cons = c.consumables.map(o => {
        const el = document.createElement('div');
        el.className = chips ? 'pill' : 'kv';
        el.innerHTML = chips ? '<span class="i"></span><span class="t"></span>' : '<span class="i"></span><span class="k"></span><span class="v"></span><div class="cbar"><i></i></div>';
        press(el, {tap: () => this._act(o, 'tap', true), hold: () => this._act(o, 'hold')});
        e.cons.append(el);
        return [el, o];
      });
    }
    this._auto = vauto(this._h, c.entity);
    e.sc = q('.scene');
    if (e.sc) {
      Object.assign(e, {cap: q('.scene .cap'), tkc: q('.tkc'), tkd: q('.tkd')});
      this._stType = vstation(this._h, c.entity, c, this._auto);
      const [x, y, w, hh, lx, ly, lw] = VTOWER[this._stType], tw = q('.tower'), led = q('.sled');
      Object.entries({x, y, width: w, height: hh}).forEach(([k, v]) => tw.setAttribute(k, v));
      Object.entries({x: lx, y: ly, width: lw}).forEach(([k, v]) => led.setAttribute(k, v));
    }
    this._fsKey = this._mapKey = null;
    this._width(Math.round(this.getBoundingClientRect().width));
    this._tick();
  }
  _st() { return this._h?.states[this._c.entity]; }
  // Eingeplant: angetippt oder Raum-Entität an – nur Räume mit Bereich oder Segmenten; „Überall“ an = nichts (alles)
  _picked() {
    const c = this._c, h = this._h;
    if (c.all && isOn(h?.states[c.all])) return [];
    return c.rooms.map((o, i) => i).filter(i => {
      const o = c.rooms[i], os = o.entity && h?.states[o.entity];
      return (o.area || list(o.segments).length) && (this._sel.has(i) || (!!os && TOGGLE.includes(dom(o.entity)) && isOn(os)));
    });
  }
  // Bereiche über vacuum.clean_area (HA-Bereiche, herstellerunabhängig), sonst Segmente je Integration
  _clean(idx) {
    const c = this._c, rooms = idx.map(i => c.rooms[i]), ok = hasF(this._st(), VF.AREA);
    const byArea = o => ok && o.area;
    const areas = [...new Set(rooms.filter(byArea).map(o => o.area))];
    const seg = rooms.filter(o => !byArea(o)).flatMap(o => list(o.segments)), fn = SEG[c.segment_mode];
    if (areas.length) this._h.callService('vacuum', 'clean_area', {cleaning_area_id: areas}, {entity_id: c.entity});
    if (seg.length && fn) { const [d, s, data] = fn(c.entity, seg, Math.max(1, +c.segment_repeat || 1)); this._h.callService(d, s, data); }
    this._sel.clear(); this._update();
  }
  // Animation: liefert true bei Tank-Warnung
  _scene() {
    const e = this._e, h = this._h, c = this._c;
    if (!e.sc) return false;
    const s = this._st(), st = s?.state, a = s?.attributes || {}, bv = this._bv;
    const pick = k => c[k] === false ? null : c[k] || (c.scene_auto !== false ? this._auto[k] : null);
    const S = k => { const id = pick(k); return id ? h.states[id] : null; };
    const txt = [S('status'), S('station')].flatMap(x => x ? [x.state, fmtState(h, x)] : []).concat(a.status || [], st || []).join(' ');
    const mm = S('mop_mode'), ma = S('mop_attached'), only = list(c.mop_states);
    const mopping = mm ? (only.length ? only.includes(mm.state) : VPAT.mop.test(mm.state) && !/^(off|none|vacuum|aus)$/i.test(mm.state)) : null;
    const attached = ma ? vact(ma) : !!(a.mop_attached ?? a.water_box_attached ?? mopping);
    // Absaugen, Waschen, Trocknen und Laden nur in der Station – Sensoren der Station hinken nach dem Losfahren oft hinterher
    const home = !['cleaning', 'returning', 'error'].includes(st);
    const empty = home && (vact(S('emptying')) || VPAT.empty.test(txt));
    const wash = home && !empty && (vact(S('washing')) || VPAT.wash.test(txt));
    const dry = home && !empty && !wash && (vact(S('drying')) || VPAT.dry.test(txt));
    const chg = home && !empty && !wash && !dry && (vact(S('charging')) || VPAT.chg.test(txt) || (st === 'docked' && bv < 100));
    const wet = attached && (mopping ?? true);
    // Tanks: binary_sensor an = Problem, Zahl = Füllstand in %, Text mit leer/voll = Problem
    const tank = (el, x, ok, bad) => {
      let p = .55, low = false;
      if (x && NUMRE.test(x.state)) p = Math.max(0, Math.min(100, +x.state)) / 100;
      else if (x && !['unavailable', 'unknown'].includes(x.state)) { low = dom(x.entity_id) === 'binary_sensor' ? x.state === 'on' : /low|empty|leer|full|voll|lack|short|knapp|problem/i.test(x.state); p = low ? bad : ok; }
      el.setAttribute('y', 22 + 30 * (1 - p)); el.setAttribute('height', 30 * p);
      el.classList.toggle('low', low);
      el.style.opacity = x ? '' : '.35';
      return low;
    };
    const tk = this._stType === 'full' || this._stType === 'wash';
    const lowC = tk && tank(e.tkc, S('clean_water'), .75, .08), lowD = tk && tank(e.tkd, S('dirty_water'), .3, .95);
    const ty = this._stType;
    e.sc.className = ['scene', 'sc', VSTATES.includes(st) ? st : 'idle', (ty === 'full' || ty === 'empty') && 'has-bag', (ty === 'full' || ty === 'wash') && 'has-tanks', attached && 'mop', wet && 'mopping', empty && 'empty', wash && 'wash', dry && 'dry', chg && 'chg', this._vis === false && 'still'].filter(Boolean).join(' ');
    e.cap.textContent = empty ? 'Absaugen' : wash ? 'Mopp wird gewaschen' : dry ? 'Mopp trocknet' : st === 'cleaning' ? (wet ? 'Saugt & wischt' : 'Saugt')
      : lowC ? 'Frischwasser leer' : lowD ? 'Schmutzwasser voll' : chg ? (bv >= 100 ? 'Voll geladen' : 'Lädt') : '';
    return lowC || lowD;
  }
  _mapTap() {
    const a = this._c.map_action;
    if (a === 'none') return;
    if (a === 'vacuum') return fire(this, 'hass-more-info', {entityId: this._c.entity});
    fire(this, 'hass-more-info', {entityId: this._c.map});
  }
  _update() {
    const h = this._h, c = this._c, e = this._e;
    if (!h || !e) return;
    const s = this._st(), a = s?.attributes || {}, st = s?.state;
    const run = VRUN.includes(st), err = st === 'error';
    e.g.classList.toggle('na', !s || st === 'unavailable');
    e.g.classList.toggle('run', run && c.glow !== false);
    e.name.textContent = c.name ?? a.friendly_name ?? c.entity;
    const ss = c.status && h.states[c.status];
    const bs = this._bat && h.states[this._bat], bv = parseFloat(bs ? bs.state : a.battery_level), chg = st === 'docked' && bv < 100;
    const bd = c.battery_display, btxt = bd === 'status' && !isNaN(bv) ? `Akku ${Math.round(bv)} %` : null;
    e.sub.textContent = !s ? 'nicht gefunden' : [ss ? fmtState(h, ss) : fmtState(h, s), !ss && a.fan_speed && run ? fanName(h, s, a.fan_speed) : null, btxt].filter(Boolean).join(' · ');
    e.sub.classList.toggle('er', err);
    setIcon(e.ic, c.icon || a.icon || 'mdi:robot-vacuum');
    e.ic.parentElement.classList.toggle('on', run);
    // Akku: eigener Sensor, sonst Sensor am Gerät, sonst Attribut
    e.bat.hidden = isNaN(bv) || bd !== 'chip';
    if (!e.bat.hidden) {
      setIcon(e.bat.firstChild, batIcon(bv, chg));
      e.bat.lastChild.textContent = `${Math.round(bv)} %`;
      e.bat.classList.toggle('chg', chg);
      e.bat.classList.toggle('low', bv <= (c.battery_low ?? 20) && !chg);
    }
    if (this._ctl) {
      // Pillen: alle, die der Roboter kann; die gerade aktive leuchtet
      const show = {stop: c.show_stop !== false, home: c.show_return !== false, locate: c.show_locate !== false, spot: !!c.show_spot};
      const act = {cleaning: 'start', paused: 'pause', returning: 'home', docked: 'home'}[st];
      this._ctl.forEach(([k, el, d]) => { el.hidden = show[k] === false || !hasF(s, d[2]); el.classList.toggle('on', k === act && k !== 'home' || k === 'home' && st === 'returning'); });
    } else {
      setIcon(e.pp, st === 'cleaning' ? (hasF(s, VF.PAUSE) ? 'mdi:pause' : 'mdi:stop') : 'mdi:play');
      e.pp.title = st === 'cleaning' ? 'Pause' : 'Start';
      e.pp.hidden = !!s && !hasF(s, VF.START) && !hasF(s, VF.PAUSE);
      e.st.hidden = c.show_stop === false || !hasF(s, VF.STOP) || !(run || st === 'paused');
      e.hm.hidden = c.show_return === false || !hasF(s, VF.RETURN) || st === 'docked';
      e.lo.hidden = c.show_locate === false || !hasF(s, VF.LOCATE);
      e.sp.hidden = !c.show_spot || !hasF(s, VF.SPOT);
    }
    this._swUp?.(h);
    if (e.fs) this._fans(s);
    const rs = c.room_sensor && h.states[c.room_sensor], cur = rs && !['unknown', 'unavailable', ''].includes(rs.state) ? rs.state.toLowerCase() : null;
    if (this._allEl) {
      const as = h.states[c.all];
      this._allEl.classList.toggle('on', isOn(as));
      this._allEl.classList.toggle('na', !as || as.state === 'unavailable');
      setIcon(this._allEl.firstChild, c.all_icon || as?.attributes.icon || 'mdi:check-all');
      this._allEl.lastChild.textContent = c.all_name ?? 'Überall';
    }
    this._rooms?.forEach((el, i) => {
      const o = c.rooms[i], os = o.entity && h.states[o.entity];
      // Raum-Entität (z. B. input_boolean „Raum einplanen“) leuchtet, wenn an
      el.classList.toggle('on', this._sel.has(i) || (!!os && TOGGLE.includes(dom(o.entity)) && isOn(os)));
      el.classList.toggle('cur', !!cur && [o.name, o.area, o.area && h.areas?.[o.area]?.name, ...list(o.segments)].some(x => x != null && String(x).toLowerCase() === cur));
      el.classList.toggle('na', !!o.entity && (!os || os.state === 'unavailable'));
      setIcon(el.firstChild, o.icon || os?.attributes.icon || 'mdi:floor-plan');
      el.lastChild.textContent = o.name ?? os?.attributes.friendly_name ?? (list(o.segments).join(', ') || '');
    });
    if (this._go) {
      const n = this._picked().length;
      this._go.hidden = !n;
      this._go.lastChild.textContent = `${n} ${n === 1 ? 'Raum' : 'Räume'} reinigen`;
    }
    let warn = false;
    this._cons?.forEach(([el, o]) => {
      const cs = h.states[o.entity], n = cs ? parseFloat(cs.state) : NaN;
      const low = o.below != null && !isNaN(n) && n < o.below;
      warn ||= low;
      el.classList.toggle('na', !cs || cs.state === 'unavailable');
      el.classList.toggle('warn', low);
      setIcon(el.firstChild, iconOf(h, o, 'mdi:wrench-clock'));
      const v = valueOf(h, cs, o);
      if (el.classList.contains('pill')) { el.lastChild.textContent = o.name === '' ? v : `${nameOf(h, o)} · ${v}`; return; }
      el.children[1].textContent = nameOf(h, o);
      el.children[2].textContent = v;
      // Balken bei Prozent oder gesetztem Maximum
      const mx = o.max ?? ((o.unit ?? cs?.attributes.unit_of_measurement) === '%' ? 100 : null);
      el.lastChild.hidden = !mx || isNaN(n);
      if (mx && !isNaN(n)) el.lastChild.firstChild.style.width = `${Math.max(0, Math.min(100, n / mx * 100))}%`;
    });
    e.g.classList.toggle('err', err && c.glow !== false);
    this._bv = bv;
    if (this._scene()) warn = true;
    e.g.classList.toggle('warn', !err && warn && c.glow !== false);
    this._mapSync();
    this._tick();
  }
  _fans(s) {
    const c = this._c, a = s?.attributes || {}, e = this._e;
    const only = list(c.fan_speeds), all = hasF(s, VF.FAN) ? a.fan_speed_list || [] : [];
    const fs = only.length ? all.filter(x => only.includes(x)) : all;
    const key = fs.join('\n');
    if (key !== this._fsKey) {
      this._fsKey = key;
      e.fs.replaceChildren(...fs.map(x => {
        const el = document.createElement('div');
        el.className = 'pill'; el.dataset.s = x;
        el.innerHTML = '<span class="i"></span><span class="t"></span>';
        setIcon(el.firstChild, mapIcon(c.fan_speed_icons, x) || 'mdi:fan');
        el.lastChild.textContent = fanName(this._h, s, x);
        press(el, {tap: () => this._h.callService('vacuum', 'set_fan_speed', {entity_id: c.entity, fan_speed: x})});
        return el;
      }));
    }
    e.fs.hidden = !fs.length;
    [...e.fs.children].forEach(el => el.classList.toggle('on', el.dataset.s === a.fan_speed));
  }
  // image.* bei Zustandswechsel neu laden, camera.* im Takt, solange der Roboter fährt
  _mapSync(force) {
    const e = this._e, id = this._c.map, ms = id && this._h?.states[id], p = ms?.attributes.entity_picture;
    if (!e?.map) return;
    if (!this._mapKey) e.map.parentElement.hidden = !p;
    if (!p) return;
    const key = dom(id) === 'image' ? `${p}|${ms.state}` : p;
    if (!force && key === this._mapKey) return;
    if (!this._vis && this._mapKey) return;
    this._mapKey = key;
    e.img.src = stamp(p, dom(id) === 'image' ? ms.state : Date.now());
  }
  _tick() {
    this._e?.sc?.classList.toggle('still', this._vis === false);
    const c = this._c, run = this._vis && c?.map && dom(c.map) === 'camera' && c.map_refresh > 0 && VRUN.includes(this._st()?.state);
    if (run && !this._tm) this._tm = setInterval(() => this._mapSync(true), c.map_refresh * 1000);
    if (!run && this._tm) { clearInterval(this._tm); this._tm = null; }
    if (this._vis) this._mapSync();
  }
}
NovaVacuumCard.prototype._act = NovaModularCard.prototype._act;
define('nova-vacuum-card', NovaVacuumCard, {name: 'Nova Saugroboter Card', description: 'Saugroboter mit Status, Akku, Start/Pause/Stopp/Zur Station, Saugstärke, Karte daneben, Raumreinigung, Schaltern und Verbrauchsteilen.', documentationURL: 'https://github.com/Blackstar9119/nova-cards#nova-saugroboter-card'});

/* ---------- Editor Saugroboter Card ---------- */
const VMAIN = [
  {name: 'entity', required: true, selector: {entity: {domain: ['vacuum']}}},
  g2({name: 'name', selector: T}, {name: 'icon', selector: I, context: {icon_entity: 'entity'}}),
  g2({name: 'battery', selector: {entity: {domain: ['sensor'], device_class: 'battery'}}}, {name: 'battery_low', selector: {number: {min: 0, max: 100, mode: 'box', unit_of_measurement: '%'}}}),
  g2({name: 'status', selector: {entity: {}}}, sel('battery_display', [['status', 'Im Statustext'], ['chip', 'Als Pille rechts'], ['none', 'Aus']])),
  g2({name: 'tap_action', selector: A}, {name: 'hold_action', selector: A}),
  g2(sel('controls', [['pills', 'Pillen mit Text'], ['round', 'Runde Buttons']]), sel('layout', [['auto', 'Automatisch'], ['side', 'Karte daneben'], ['stack', 'Karte darüber']])),
  {name: 'glow', selector: {boolean: {}}},
  g2({name: 'show_stop', selector: {boolean: {}}}, {name: 'show_return', selector: {boolean: {}}}),
  g2({name: 'show_locate', selector: {boolean: {}}}, {name: 'show_spot', selector: {boolean: {}}}),
];
const VSCN = [
  g2({name: 'scene', selector: {boolean: {}}}, {name: 'scene_auto', selector: {boolean: {}}}),
  sel('station_type', [['auto', 'Automatisch'], ['dock', 'Nur Ladestation'], ['empty', 'Absaugstation'], ['wash', 'Waschstation (Tanks)'], ['full', 'Komplett (Tanks + Staubbeutel)']]),
  g2({name: 'mop_attached', selector: {entity: {}}}, {name: 'mop_mode', selector: {entity: {}}}),
  {name: 'mop_states', selector: {text: {multiple: true}}},
  g2({name: 'clean_water', selector: {entity: {}}}, {name: 'dirty_water', selector: {entity: {}}}),
  g2({name: 'emptying', selector: {entity: {}}}, {name: 'washing', selector: {entity: {}}}),
  g2({name: 'drying', selector: {entity: {}}}, {name: 'charging', selector: {entity: {}}}),
  {name: 'station', selector: {entity: {}}},
];
const VFAN = [{name: 'show_fan_speed', selector: {boolean: {}}}, {name: 'fan_speeds', selector: {text: {multiple: true}}}];
const VMAP = [
  g2({name: 'map', selector: {entity: {domain: ['camera', 'image']}}}, {name: 'map_title', selector: T}),
  g2(sel('map_aspect_ratio', [['auto', 'Automatisch'], ['1:1', '1:1'], ['4:3', '4:3'], ['16:9', '16:9'], ['3:4', '3:4']]),
    {name: 'map_refresh', selector: {number: {min: 0, max: 60, mode: 'box', unit_of_measurement: 's'}}}),
  g2(sel('map_action', [['more-info', 'Karte groß öffnen'], ['vacuum', 'Details des Roboters'], ['none', 'Nichts']]),
    {name: 'map_max_height', selector: {number: {min: 0, max: 800, step: 10, mode: 'box', unit_of_measurement: 'px'}}}),
];
const VSEG = [{name: 'rooms_title', selector: T}, g2({name: 'room_sensor', selector: {entity: {domain: ['sensor', 'select', 'input_select']}}}, {name: 'all', selector: {entity: {}}}),
  g2({name: 'all_name', selector: T}, {name: 'all_icon', selector: I}), g2(sel('segment_mode', [['roborock', 'Roborock'], ['valetudo', 'Valetudo (MQTT)'], ['dreame', 'Dreame (HACS)'], ['xiaomi', 'Xiaomi Miio']]),
  {name: 'segment_repeat', selector: {number: {min: 1, max: 3, mode: 'slider'}}})];
const VROOM = [NAMEICON, g2({name: 'segments', selector: T}, {name: 'area', selector: {area: {}}}), {name: 'entity', selector: {entity: {}}}, {name: 'tap_action', selector: A}, {name: 'confirm', selector: T}];
const VSWL = [{name: 'switches_columns', selector: {number: {min: 1, max: 3, mode: 'slider'}}}];
const VSW = [ENT, NAMEICON, {name: 'tap_action', selector: A}, {name: 'confirm', selector: T}];
const VCONSL = [sel('consumables_layout', [['rows', 'Liste'], ['chips', 'Chips']])];
const VCONS = [ENT, NAMEICON, g2({name: 'unit', selector: T}, {name: 'decimals', selector: {number: {min: 0, max: 4, mode: 'box'}}}), g2(NUM('below'), NUM('max'))];
const VLABELS = {...MLABELS, station_type: 'Station', scene: 'Animation anzeigen', scene_auto: 'Entitäten automatisch suchen', mop_attached: 'Mopp angebracht', mop_mode: 'Reinigungsmodus (Wischen?)',
  mop_states: 'Zustände, die „wischt“ bedeuten', clean_water: 'Frischwassertank', dirty_water: 'Schmutzwassertank', emptying: 'Absaugen aktiv', washing: 'Moppwäsche aktiv',
  drying: 'Trocknung aktiv', charging: 'Lädt', station: 'Stations-Status', battery: 'Akku-Sensor', battery_display: 'Akku anzeigen', controls: 'Steuerung', layout: 'Layout',
  map_title: 'Überschrift Karte', rooms_title: 'Überschrift Räume', room_sensor: 'Aktueller Raum (Sensor)', all: '„Überall“-Button: Entität',
  all_name: '„Überall“-Button: Text', all_icon: '„Überall“-Button: Icon', area: 'Bereich', switches_columns: 'Spalten', battery_low: 'Akku niedrig ab', status: 'Status-Entität (optional)', glow: 'Leuchten beim Reinigen / bei Warnung',
  show_stop: 'Stopp-Button', show_return: 'Zur-Station-Button', show_locate: 'Suchen-Button', show_spot: 'Spot-Reinigung',
  show_fan_speed: 'Saugstärke anzeigen', fan_speeds: 'Nur diese Stufen zeigen', map: 'Karte / Kamera', map_aspect_ratio: 'Seitenverhältnis',
  map_max_height: 'Max. Höhe (untereinander)', map_refresh: 'Aktualisieren alle', map_action: 'Karte antippen', segment_mode: 'Integration', segment_repeat: 'Durchgänge', segments: 'Segment-IDs',
  consumables_layout: 'Darstellung', below: 'Warnen unter', max: 'Maximum (für Balken)', tap_action: 'Aktion beim Antippen', hold_action: 'Aktion bei langem Drücken'};
const VHELPERS = {
  station_type: 'Automatisch = nach den Entitäten des Roboters (Absaugen → Staubbeutel, Wasser/Moppwäsche → Tanks)',
  scene_auto: 'Sucht Mopp, Tanks, Absaugen, Waschen, Trocknen und Laden am Gerät des Roboters. Felder unten überschreiben das',
  mop_mode: 'Select o. ä.: Zustand mit mop/wisch = wischt (z. B. vac_and_mop)',
  mop_states: 'Optional, wenn die Erkennung nicht passt: genaue Zustände, z. B. vac_and_mop, mop',
  clean_water: 'binary_sensor (an = leer), Füllstand in % oder Text',
  dirty_water: 'binary_sensor (an = voll), Füllstand in % oder Text',
  drying: 'An oder Zahl > 0 (z. B. Rest-Trocknungszeit) = trocknet',
  station: 'Text-Sensor der Station; wird wie der Status nach Absaugen/Waschen/Trocknen durchsucht',
  battery: 'Leer = Akku-Sensor am Gerät des Roboters automatisch',
  status: 'Text unter dem Namen, z. B. sensor.robbi_status. Leer = Zustand des Roboters',
  tap_action: 'Standard: Details des Roboters',
  fan_speeds: 'Leer = alle Stufen des Roboters. Genaue Namen wie in fan_speed_list',
  map: 'z. B. image.robbi_karte oder camera.robbi_map',
  layout: 'Automatisch = Karte daneben, sobald die Karte breit genug ist (z. B. im Popup)',
  map_title: '„-“ = ohne Überschrift',
  rooms_title: '„-“ = ohne Überschrift',
  room_sensor: 'Raum, in dem der Roboter gerade ist, bekommt einen gelben Ring (Vergleich mit Name, Bereich oder Segment)',
  all: 'Optional, z. B. input_boolean.saugroboter_alles oder ein Skript – erscheint oben rechts',
  area: 'Empfohlen: Reinigung über vacuum.clean_area (in den Roboter-Einstellungen Segmente den Bereichen zuordnen). Auch für „Aktueller Raum“',
  map_max_height: 'Nur wenn die Karte über den Bedienelementen steht. 0 = ohne Grenze',
  map_refresh: 'Nur camera.*: Takt beim Reinigen, 0 = aus. image.* lädt bei Änderung selbst neu',
  segment_mode: 'Nur für Räume mit Segment-IDs statt Bereich',
  segments: 'Nur, wenn die Integration keine Bereiche kann: Komma-Liste, z. B. 16, 17',
  entity: 'Optional: input_boolean/Schalter = Raum einplanen (an = Start reinigt ihn), Skript/Button = direkt auslösen',
  confirm: 'Optional: Rückfrage vor dem Auslösen (Aktion/Entität)',
  below: 'Eintrag und Rahmen färben sich, wenn der Wert darunter liegt',
  max: 'Leer = 100 bei %, sonst kein Balken',
};

class NovaVacuumCardEditor extends NovaMediaCardEditor {
  _form(schema, data, cb) {
    const f = super._form(schema, data, cb);
    f.computeLabel = s => VLABELS[s.name] ?? s.name;
    f.computeHelper = s => VHELPERS[s.name];
    return f;
  }
  _items(k) { return [].concat(this._config[k] || []).map(toObj); }
  _setItems(k, arr) { const c = {...this._config}; if (arr.length) c[k] = arr; else delete c[k]; this._emit(c); }
  // Liste mit Aufklapp-Einträgen: k = Konfig-Schlüssel, m = {item, icon}
  _list(w, k, schema, m, label) {
    const items = this._items(k);
    items.forEach((it, j) => {
      const [d, s, body] = this._details(`${k}.${j}`, it.icon || m.icon, this._ilabel(it, j, m), [
        this._btn('mdi:arrow-up', 'Nach oben', () => this._imove(k, j, -1), j === 0),
        this._btn('mdi:arrow-down', 'Nach unten', () => this._imove(k, j, 1), j === items.length - 1),
        this._btn('mdi:delete-outline', 'Löschen', () => { this._open = new Set(); this._setItems(k, this._items(k).filter((_, x) => x !== j)); this._rebuild(); })]);
      // Segmente aus YAML-Listen als Text zeigen
      body.append(this._form(schema, {...it, ...(it.segments != null ? {segments: list(it.segments).join(', ')} : {})}, v => {
        const arr = this._items(k);
        arr[j] = merge(arr[j], names(schema), v);
        this._setItems(k, arr);
        s.querySelector('.lbl').textContent = this._ilabel(arr[j], j, m);
      }));
      w.append(d);
    });
    w.append(this._add(label, () => { const n = [...this._items(k), {}]; this._open = new Set([`${k}.${n.length - 1}`]); this._setItems(k, n); this._rebuild(); }));
  }
  _imove(k, j, dir) {
    const arr = this._items(k), t = j + dir;
    [arr[j], arr[t]] = [arr[t], arr[j]];
    this._open = new Set([`${k}.${t}`]);
    this._setItems(k, arr); this._rebuild();
  }
  _build() {
    const r = this.shadowRoot, c0 = this._config;
    r.innerHTML = `<style>${ECSS}${MECSS}</style><div class="wrap"></div>`;
    const w = r.querySelector('.wrap'), strip = c => { Object.entries(VDEF).forEach(([k, x]) => c[k] === x && delete c[k]); return c; };
    const sec = (schema, title) => { if (title) w.append(this._h3(title)); w.append(this._form(schema, {...VDEF, ...c0}, v => this._emit(strip(merge(this._config, names(schema), v))))); };
    sec(VMAIN);
    sec(VFAN, 'Saugstärke');
    sec(VMAP, 'Karte');
    sec(VSCN, 'Animation');
    if (c0.scene !== false && this._hass) {
      const auto = vauto(this._hass, c0.entity), au = Object.entries(auto), p0 = document.createElement('p');
      const ST = {dock: 'Nur Ladestation', empty: 'Absaugstation', wash: 'Waschstation', full: 'Komplett'};
      p0.className = 'hint';
      p0.textContent = `Station: ${ST[vstation(this._hass, c0.entity, {...VDEF, ...c0}, auto)]}` + (au.length && c0.scene_auto !== false ? ` · Automatisch gefunden: ${au.map(([k, v]) => `${VLABELS[k] || k} = ${v}`).join(', ')}` : '');
      w.append(p0);
    }
    w.append(this._h3('Räume'));
    const p = document.createElement('p'); p.className = 'hint';
    p.textContent = 'Je Raum einen HA-Bereich wählen: antippen plant ein, Start reinigt die eingeplanten Räume (vacuum.clean_area). Nichts eingeplant = alles.';
    w.append(p);
    if (this._items('rooms').length) w.append(this._form(VSEG, {...VDEF, ...c0}, v => this._emit(strip(merge(this._config, names(VSEG), v)))));
    this._list(w, 'rooms', VROOM, {item: 'Raum', icon: 'mdi:floor-plan'}, 'Raum hinzufügen');
    w.append(this._h3('Schalter'));
    const p2 = document.createElement('p'); p2.className = 'hint';
    p2.textContent = 'z. B. Staubentleerung, Moppwäsche, Mopp-Trocknung – Antippen schaltet bzw. löst aus.';
    w.append(p2);
    if (this._items('switches').length) sec(VSWL);
    this._list(w, 'switches', VSW, {item: 'Schalter', icon: 'mdi:toggle-switch-outline'}, 'Schalter hinzufügen');
    w.append(this._h3('Infos & Verbrauchsteile'));
    if (this._items('consumables').length) sec(VCONSL);
    this._list(w, 'consumables', VCONS, {item: 'Verbrauchsteil', icon: 'mdi:wrench-clock'}, 'Verbrauchsteil hinzufügen');
  }
}
define('nova-vacuum-card-editor', NovaVacuumCardEditor);

console.info(`%c NOVA-CARDS %c v${VERSION} `, 'color:#3a2a00;background:#f5b83d;font-weight:700;border-radius:4px 0 0 4px', 'color:#fff;background:#1b2134;border-radius:0 4px 4px 0');
})();
