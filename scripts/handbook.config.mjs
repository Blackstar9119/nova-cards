/* Rezepte im Handbuch: je Eintrag ein Editor-Bild mit roten Rahmen (scripts/handbook.mjs).
   page   Seite in nova-integration/docs/de/karten/<page>.md     id   Teil des Dateinamens
   card   Kartentyp ohne „nova-“                                   img  Bildordner in docs/images (= Ordner der Karte)
   config Konfiguration der Beispielkarte (Demo-Entitäten von HA Dev)
   open   Bereiche, die aufgeklappt werden    items  Einträge in Listen (Anfang der Beschriftung, z. B. „1.“)
   mark   rot umrahmt: Feldname (Konfig-Schlüssel), {text: 'Knopf-Text'}, {section: 'Bereich'} oder {item: '1.'} */
// Konfigurationen nur für --list (Karten ohne Entität zeichnen sich teils nicht)
export const LIST_STUBS = {
  'light-card': {entities: ['light.nova_demo_wohnzimmer_decke', 'light.nova_demo_wohnzimmer_stehlampe']},
  'thermostat-card': {entity: 'climate.nova_demo_heizung'},
  'weather-card': {entity: 'weather.nova_demo_wetter'},
  'camera-card': {entity: 'image.nova_demo_kamera_wohnzimmer'},
  'media-card': {entity: 'media_player.nova_demo_wohnzimmer'},
  'waste-card': {calendars: ['calendar.nova_demo_abfall']},
  'modular-card': {blocks: [{type: 'header', name: 'Futterautomat', icon: 'mdi:cat', status: 'sensor.nova_demo_batterie'}, {type: 'alerts', alerts: [{entity: 'sensor.nova_demo_batterie', below: 20, message: 'Akku {state} %'}]}]},
  'chips-card': {chips: [{entity: 'sensor.nova_demo_wohnzimmer_temperatur'}, {entity: 'binary_sensor.nova_demo_wohnzimmer_fenster', name: 'Fenster offen'}]},
  'remote-card': {entity: 'media_player.nova_demo_wohnzimmer'},
  'drucker-card': {demo: 'print'},
  'timer-card': {entity: 'timer.nova_demo_kuche_timer'},
  'navi-card': {items: [{icon: 'mdi:home', name: 'Start', navigation_path: '/nova-showcase/uebersicht'}]},
  'swipe-card': {},
};

const T = 'sensor.nova_demo_wohnzimmer_temperatur', H = 'sensor.nova_demo_wohnzimmer_luftfeuchte';
const DECKE = 'light.nova_demo_wohnzimmer_decke', STEH = 'light.nova_demo_wohnzimmer_stehlampe';
const r = (page, card, img, list) => list.map(x => ({page, card, img, ...x}));

export const RECIPES = [
  ...r('raum', 'room-card', 'room', [
    {id: 'popup', config: {name: 'Wohnzimmer', icon: 'mdi:sofa', temperature: T, popup: 'nova-demo'}, open: ['Aktionen'], mark: ['popup']},
    {id: 'info', config: {name: 'Küche', icon: 'mdi:countertop-outline', info: 'sensor.nova_demo_kueche_luftfeuchte', info_suffix: ' %'}, open: ['Anzeige'], mark: ['info']},
    {id: 'bild', config: {name: 'Wohnzimmer', icon: 'mdi:sofa', temperature: T, image: '/local/nova-showcase/raum-wohnzimmer.jpg'}, open: ['Aussehen'], mark: ['image']},
  ]),
  ...r('licht', 'light-card', 'light', [
    {id: 'ausblenden', config: {area: 'wohnzimmer', exclude: ['light.nova_demo_wohnzimmer_leselampe']}, open: ['Lampen'], mark: ['area', 'exclude']},
    {id: 'flach', config: {entities: [{entity: DECKE, slider: false}, STEH]}, open: ['Lampen'], items: ['1.'], mark: ['slider']},
  ]),
  ...r('thermostat', 'thermostat-card', 'thermostat', [
    {id: 'klein', config: {entity: 'climate.nova_demo_heizung', compact: true, show_graph: false}, open: ['Aussehen'], mark: ['compact', 'show_graph']},
    {id: 'fenster', config: {entity: 'climate.nova_demo_heizung', windows: ['binary_sensor.nova_demo_wohnzimmer_fenster']}, open: ['Sensoren'], mark: ['windows']},
  ]),
  ...r('wetter', 'weather-card', 'weather', [
    {id: 'sensor', config: {entity: 'weather.nova_demo_wetter', temperature_entity: T}, open: ['Aktuelles Wetter'], mark: ['temperature_entity']},
    {id: 'ohne-vorhersage', config: {entity: 'weather.nova_demo_wetter', show_daily: false, show_hourly: false}, open: ['Vorhersage'], mark: ['show_daily', 'show_hourly']},
  ]),
  ...r('kamera', 'camera-card', 'camera', [
    {id: 'split', config: {entity: 'image.nova_demo_kamera_wohnzimmer', split: [{entity: 'image.nova_demo_kamera_garten'}, {entity: 'image.nova_demo_kamera_einfahrt'}]},
      open: ['Splitscreen (weitere Kameras)'], mark: ['split_layout', {item: '1.'}, {item: '2.'}, {text: 'Kamera hinzufügen'}]},
    {id: 'vollbild', config: {entity: 'image.nova_demo_kamera_wohnzimmer', image_action: 'fullscreen'}, open: ['Aktionen'], mark: ['image_action']},
  ]),
  ...r('media', 'media-card', 'media', [
    {id: 'auto', config: {entity: 'media_player.nova_demo_wohnzimmer', players: [{entity: 'media_player.nova_demo_kuche'}, {entity: 'media_player.nova_demo_bad'}]},
      open: ['Weitere Player'], mark: ['auto_switch', {item: '1.'}, {item: '2.'}]},
  ]),
  ...r('muellkalender', 'waste-card', 'waste', [
    {id: 'stichwort', config: {entities: ['calendar.nova_demo_abfall'], types: [{match: 'Gelb, Wertstoff', name: 'Gelber Sack', icon: 'mdi:recycle', color: 'accent-2'}]},
      open: ['Müllarten'], items: ['1.'], mark: ['match']},
  ]),
  ...r('modular', 'modular-card', 'modular', [
    {id: 'groesse', config: {size: 150, blocks: [{type: 'header', name: 'Futterautomat', icon: 'mdi:cat', status: 'sensor.nova_demo_batterie'}]}, open: ['Aussehen'], mark: ['size']},
    {id: 'warnung', config: {blocks: [{type: 'header', name: 'Futterautomat', icon: 'mdi:cat', status: 'sensor.nova_demo_batterie'},
      {type: 'alerts', alerts: [{entity: 'sensor.nova_demo_batterie', below: 20, message: 'Akku nur noch {state} %'}]}]},
      open: ['Bausteine'], items: ['2.', '1. Akku'], mark: ['entity', 'below', 'message']},
  ]),
  ...r('chips', 'chips-card', 'chips', [
    {id: 'fenster', config: {chips: [{entity: T}, {entity: 'binary_sensor.nova_demo_wohnzimmer_fenster', name: 'Fenster offen', icon: 'mdi:window-open-variant', color: 'accent-2', state: 'on'}]},
      open: ['Chips'], items: ['2.'], mark: ['state']},
  ]),
  ...r('fernbedienung', 'remote-card', 'remote', [
    {id: 'app', config: {entity: 'media_player.nova_demo_wohnzimmer'}, open: ['Apps'], mark: [{text: 'App hinzufügen'}]},
  ]),
  ...r('drucker', 'drucker-card', 'printer', [
    {id: 'einfach', config: {demo: 'print'}, open: ['Allgemein'], mark: ['device']},
    {id: 'entitaet', config: {demo: 'print', file: 'sensor.nova_demo_drucker_status', stage: 'sensor.nova_demo_drucker_status'}, open: ['Entitäten'], mark: ['file', 'stage']},
    {id: 'ams', config: {demo: 'print', ams: 'hide'}, open: ['AMS und Spulen'], mark: ['ams', 'ams_trays']},
    {id: 'kamera', config: {demo: 'print', camera: 'image.nova_demo_kamera_wohnzimmer', camera_mode: 'printing'}, open: ['Kamera'], mark: ['camera', 'camera_mode']},
    {id: 'luefter', config: {demo: 'print', switches: ['input_boolean.nova_demo_drucker_licht', 'sensor.nova_demo_drucker_status']}, open: ['Lüfter und Schalter'], mark: ['fans', 'switches']},
    {id: 'anzeigen', config: {demo: 'print', show_file: false, show_end_time: false}, open: ['Anzeigen'], mark: ['show_file', 'show_end_time']},
    {id: 'meldungen', config: {demo: 'print', hide_messages: ['door', 'calib']}, open: ['Meldungen'], mark: ['msg_calib', 'msg_door']},
    {id: 'demo', config: {demo: 'print', demo_message: 'spaghetti', demo_ams: true}, open: ['Demo'], mark: ['demo', 'demo_message', 'demo_ams']},
    {id: 'farbe', config: {demo: 'print', color: 'accent-1'}, open: ['Aussehen'], mark: ['color']},
  ]),
  ...r('timer', 'timer-card', 'timer', [
    {id: 'erster', config: {entity: 'timer.nova_demo_kuche_timer'}, open: ['Timer'], mark: ['entity']},
    {id: 'schnellwahl', config: {entity: 'timer.nova_demo_kuche_timer', presets: [3, 8, 12, 20]}, open: ['Schnellwahl und Knöpfe'], mark: ['presets']},
    {id: 'kompakt', config: {entity: 'timer.nova_demo_kuche_timer', layout: 'compact'}, open: ['Aussehen'], mark: ['layout']},
  ]),
  ...r('navi', 'navi-card', 'navi', [
    {id: 'popup', config: {items: [{icon: 'mdi:home', name: 'Start', navigation_path: '/nova-showcase/uebersicht'}, {icon: 'mdi:sofa', name: 'Wohnzimmer', popup_hash: 'nova-demo'}]},
      open: ['Buttons'], items: ['2.'], mark: ['popup_hash']},
    {id: 'quelle', config: {source: '/nova-showcase', items: [{icon: 'mdi:home', name: 'Start', navigation_path: '/nova-showcase/uebersicht'}]}, open: ['Allgemein'], mark: ['source']},
    {id: 'seitenleiste', config: {sidebar: 'left', items: [{icon: 'mdi:home', name: 'Start', navigation_path: '/nova-showcase/uebersicht'}]}, open: ['Layout und Aussehen'], mark: ['sidebar']},
  ]),
  ...r('swipe', 'swipe-card', 'swipe', [
    {id: 'erste', config: {pages: [{name: 'Küche', rows: [{cells: [{card: {type: 'custom:nova-clock-card'}}, {card: {type: 'custom:nova-light-card', entities: [DECKE]}}]}]},
      {name: 'Timer', rows: [{cells: [{card: {type: 'custom:nova-timer-card', entity: 'timer.nova_demo_kuche_timer'}}]}]}]},
      open: ['Seiten', 'Aufteilung: Küche', 'Karten: Küche'], mark: [{text: 'Seite hinzufügen'}, {section: 'Aufteilung: Küche'}, {section: 'Karten: Küche'}]},
    {id: 'fuellen', config: {fill: true, stack_below: 600, pages: [{rows: [{cells: [{card: {type: 'custom:nova-clock-card'}}]}]}]}, open: ['Wischen und Anzeige'], mark: ['fill', 'stack_below']},
    {id: 'bildschirm', config: {fit_screen: true, margin: 8, pages: [{rows: [{cells: [{card: {type: 'custom:nova-clock-card'}}]}]}]}, open: ['Wischen und Anzeige'], mark: ['fit_screen', 'margin']},
    {id: 'zurueck', config: {reset_after: 120, pages: [{rows: [{cells: [{card: {type: 'custom:nova-clock-card'}}]}]}]}, open: ['Wischen und Anzeige'], mark: ['reset_after']},
  ]),
  ...r('uhr', 'clock-card', 'clock', [
    {id: 'einfach', config: {}, open: ['Uhr'], mark: []},
    {id: 'klappzahlen', config: {style: 'flip'}, open: ['Uhr'], mark: ['style']},
    {id: 'analog', config: {style: 'analog', second_hand: 'sweep'}, open: ['Uhr'], mark: ['style', 'second_hand']},
    {id: 'leuchtziffern', config: {style: 'glow'}, open: ['Uhr'], mark: ['style']},
    {id: 'radiowecker', config: {style: 'retro', retro_color: 'amber'}, open: ['Uhr'], mark: ['style', 'retro_color']},
    {id: 'ohne-datum', config: {show_weekday: false, show_date: false}, open: ['Anzeige'], mark: ['show_weekday', 'show_date']},
    {id: 'werte', config: {entities: [T, H]}, open: ['Anzeige'], mark: ['entities']},
    {id: 'groesse', config: {size: 'small'}, open: ['Aussehen'], mark: ['size', 'font_size']},
    {id: 'datum', config: {style: 'flip', date_size: 'large', date_format: 'long'}, open: ['Aussehen'], mark: ['date_format', 'date_size']},
    {id: 'breit', config: {layout: 'row'}, open: ['Aussehen'], mark: ['layout']},
    {id: 'ohne-glas', config: {glass: false}, open: ['Aussehen'], mark: ['glass']},
  ]),
  ...r('geraet', 'geraet-card', 'appliance', [
    {id: 'einfach', config: {device_type: 'dishwasher', name: 'Spülmaschine', entity: 'input_select.nova_demo_spuelmaschine_status', end_time: 'sensor.nova_demo_spuelmaschine_endzeit'},
      open: ['Allgemein', 'Programm und Zeit'], mark: ['device_type', 'entity', 'end_time']},
    {id: 'nur-wenn-an', config: {device_type: 'airfryer', name: 'Airfryer', entity: 'input_select.nova_demo_airfryer_status', layout: 'compact', hide_when_off: true},
      open: ['Aussehen'], mark: ['layout', 'hide_when_off']},
    {id: 'hinweise', config: {device_type: 'washer', name: 'Waschmaschine', entity: 'input_select.nova_demo_waschmaschine_status', door: 'sensor.nova_demo_waschmaschine_tuer',
      hints: [{entity: 'binary_sensor.nova_demo_waschmaschine_waschmittel', anim: 'detergent'}]}, open: ['Hinweise'], items: ['1.'], mark: ['door', 'anim', {text: 'Hinweis hinzufügen'}]},
    {id: 'starten', config: {device_type: 'washer', name: 'Waschmaschine', entity: 'input_select.nova_demo_waschmaschine_status',
      start: 'select.nova_demo_waschmaschine_aktives_programm', start_at: 'home_connect', duration: 'sensor.nova_demo_waschmaschine_dauer'}, open: ['Bedienung'], mark: ['start', 'start_at']},
  ]),
];
