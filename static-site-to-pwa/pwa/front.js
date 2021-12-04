/**
 * (Global) variables and user config values.
 */
var pwa_version, pwa_root, ruigehond_head_node, ruigehond_active_worker,
    pwa_theme_color = '#056b17',
    pwa_timeouts = {
        cache_button: 4000, // how long the title will be displayed in the cache button before it converts to an icon
        cache_progress: 2000 // how long a progress bar stays visible after 100% is reached
    },
    cta_languages_by_url = { // key is part of url that defines a language, value is the key for the translations
        'fra/': 'fr-FR',
        'french/': 'fr-FR',
        'dut/': 'nl-NL',
        'dutch/': 'nl-NL',
        'ita/': 'it-IT',
        'italian/': 'it-IT',
        'ger/': 'de-DE',
        'german/': 'de-DE',
        'spa/': 'es-ES',
        'spanish/': 'es-ES',
        'eng/': 'en-US',
        'english/': 'en-US'
    },
    cta_translations = {
        'nl-NL': {
            'Manuals': 'Handleidingen',
            'Delete manual?': 'Verwijderen?',
            'To save a manual for offline use, click the floppy icon while viewing the manual you need.': 'Om een handleiding op te slaan drukt u op het floppy-disk icoon terwijl u de handleiding bekijkt.',
            'It looks like you have no internet connection. The following manuals are available without internet:': 'Het lijkt erop dat u geen internet verbinding heeft. De volgende handleiding(en) zijn beschikbaar zonder internet:'
        },
        'de-DE': {
            'Manuals': 'Handbücher'
        }
    };

/**
 * The actual pwa starts here. You should not have to edit this file beyond this point.
 */
ruigehond_pwa = function () {
    var head = document.getElementsByTagName('head'),
        isPWA = function () {
            return window.matchMedia('(display-mode: standalone)').matches
                || document.referrer.startsWith('android-app://')
                || navigator.standalone;
        },
        language = get_language_from_url(),
        script_node, el;
    if ('undefined' !== typeof ruigehond_head_node) return; // already active
    if (self !== parent) return; // in an iframe forget it
    if (!head) {
        console.warn('no head found...');
        setTimeout(ruigehond_pwa, 400);
        return;
    }
    ruigehond_head_node = head[0];
    script_node = ruigehond_head_node.querySelector('script[src*="pwa/front.js"]');
    if (!script_node) {
        console.error('must supply script pwa/front.js on the frontpage in order for the pwa to function');
        return;
    }
    pwa_version = script_node.src.replace(/.+?v=/, ''); // that's your version
    pwa_root = script_node.getAttribute('data-root') || console.error('must supply the root using data-root attribute on the script tag');
    document.getElementsByTagName('html')[0].setAttribute('data-is-pwa', isPWA() ? '1' : '0');
    ruigehond_head_node.insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="' + pwa_root + '/pwa/buttons.css?v=' + pwa_version + '">');
    ruigehond_head_node.insertAdjacentHTML('beforeend', '<link rel="manifest" href="' + pwa_root + '/pwa/manifest.webmanifest?v=' + pwa_version + '"/>');
    ruigehond_head_node.insertAdjacentHTML('beforeend', '<!-- ios support --><link rel="apple-touch-icon" href="' + pwa_root + '/pwa/icon/72.png" /><link rel="apple-touch-icon" href="' + pwa_root + '/pwa/icon/96.png" /><link rel="apple-touch-icon" href="' + pwa_root + '/pwa/icon/128.png" /><link rel="apple-touch-icon" href="' + pwa_root + '/pwa/icon/144.png" /><link rel="apple-touch-icon" href="' + pwa_root + '/pwa/icon/152.png" /><link rel="apple-touch-icon" href="' + pwa_root + '/pwa/icon/192.png" /><link rel="apple-touch-icon" href="' + pwa_root + '/pwa/icon/384.png" /><link rel="apple-touch-icon" href="' + pwa_root + '/pwa/icon/512.png" /><meta name="apple-mobile-web-app-status-bar" content="' + pwa_theme_color + '" /><meta name="theme-color" content="' + pwa_theme_color + '" />');
    if ((el = document.getElementById('offline_message'))) {
        el.innerText = __(el.innerText);
    }
    if ((el = document.getElementById('offline_body')) && (el = el.querySelector('header'))) {
        el.style.backgroundColor = pwa_theme_color;
        el.insertAdjacentHTML('afterbegin', '<img src="' + pwa_root + '/pwa/icon/72.png" alt="logo"/>');
    }
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('/serviceworker.js?v=' + pwa_version)
            .then(res => console.log('service worker ruigehond/pwa registered with scope ' + res.scope))
            .catch(err => console.log('service worker not registered', err));
        navigator.serviceWorker.addEventListener('message', event => {
            // event is a MessageEvent object
            console.log('from serviceworker:', event.data);
            if (event.data.hasOwnProperty('key') && event.data.hasOwnProperty('cache_check')) {
                cache_button(event.data.key, event.data.cache_check);
            }
            if (event.data.hasOwnProperty('key') && event.data.hasOwnProperty('cached')) {
                cache_button(event.data.key, event.data.cached);
            }
            if (event.data.hasOwnProperty('key') && event.data.hasOwnProperty('progress')) {
                show_progress(event.data.key, event.data.progress);
            }
            if (event.data.hasOwnProperty('caches')) {
                caches_menu(event.data.caches);
            }
            if (event.data.hasOwnProperty('errors')) {
                console.error(event.data.errors);
                alert(event.data.errors.pop() || event.data.errors);
            }
        });

        navigator.serviceWorker.ready.then(registration => {
            ruigehond_active_worker = registration.active;
            if ('undefined' !== typeof ruigehond_pwa_assets) return;
            // load the assets file
            var assets_node = document.createElement('script');
            assets_node.src = pwa_root + '/pwa/assets.js?v=' + pwa_version;
            assets_node.addEventListener('load', function (e) {
                var key, asset, index_doc = null;
                console.log('assets file loaded');
                if ('undefined' === typeof ruigehond_pwa_assets) {
                    console.error('the assets file must contain the object ruigehond_pwa_assets');
                }
                // load buttons when appropriate
                if ((asset = get_asset_by_uri(get_current_uri())) && asset.hasOwnProperty('destination')) {
                    index_doc = asset.destination; // either a string: the index doc, or null
                }
                if (index_doc) {
                    ruigehond_active_worker.postMessage({cache_check: asset.key});
                }

                // transmit allowed caches (so the rest can be destroyed)
                ruigehond_active_worker.postMessage({
                    caches: ruigehond_pwa_assets,
                    root: pwa_root,
                    version: pwa_version
                });
            });
            ruigehond_head_node.appendChild(assets_node);
        });
        offline_manual_button();
    } else {
        console.error('no serviceworker in navigator');
    }

    function get_asset_by_uri(uri) {
        var i, obj;
        uri = uri.replace(pwa_root, '');
        for (i in ruigehond_pwa_assets) {
            obj = ruigehond_pwa_assets[i];
            if (obj.assets.indexOf(uri) >= 0 && uri.indexOf(i) === 0) {
                obj.key = i;
                return obj;
            }
        }
        return null;
    }

    function show_progress(key, progress) {
        var wrapper, el, span, element_id = 'pwa_cache_progress_' + encodeURI(key);
        if (! (wrapper = document.getElementById('pwa_progress_wrapper'))) {
            wrapper = document.createElement('div');
            wrapper.id = 'pwa_progress_wrapper';
            document.body.appendChild(wrapper);
        }
        if (! (el = document.getElementById(element_id))) {
            el = document.createElement('div');
            el.id = element_id;
            el.className = 'pwa_progress_bar';
            el.style.backgroundColor = pwa_theme_color;
            span = document.createElement('span');
            span.innerText = key;
            el.appendChild(span);
            span = document.createElement('span');
            span.className = 'percentage';
            span.innerText = '0%';
            el.appendChild(span);
            wrapper.appendChild(el);
        }
        if (1 === progress) {
            setTimeout(function(el) { el.parentNode.removeChild(el); }, pwa_timeouts.cache_progress || 3500, el);
        }
        el.querySelector('.percentage').innerText = parseInt(100 * progress) + '%';
        el.style.marginRight = (100 * progress) + '%';
    }

    function __(str) {
        if (cta_translations.hasOwnProperty(language)) {
            return cta_translations[language][str] || str;
        }
        return str;
    }

    function get_language_from_url() {
        var url = window.location.href, identifier
        for (identifier in cta_languages_by_url) {
            if (url.indexOf(identifier) !== -1) {
                return cta_languages_by_url[identifier];
            }
        }
        return 'en-US'; // default
    }

    function get_current_uri() {
        var url = window.location.href;
        return decodeURI(url.split('#').shift().split('?').shift());
        /*if (url.indexOf('?') !== -1) {
            url = url.split('?')[0];
        }
        return decodeURI(url.substr(0, url.lastIndexOf('/')).replace(pwa_root, ''));*/
    }

    function get_current_file() {
        var url = window.location.href;
        return url.split('#').shift().split('?').shift().split('/').pop();
    }

    function title_from_filename(filename) {
        return decodeURI(filename.substr(filename.lastIndexOf('/') + 1, 100));
    }

    function cache_button(cache_key, is_cached) {
        var el, menu_button;
        if (! ((el = get_asset_by_uri(get_current_uri())) && el.hasOwnProperty('key') && el.key === cache_key)) return;
        if (document.getElementById('pwa_cache_button')) {
            el = document.getElementById('pwa_cache_button');
            el.classList.remove('caching');
            if (is_cached) {
                el.classList.add('cached');
            } else {
                el.classList.remove('cached');
            }
        } else {
            el = document.createElement('div');
            el.id = 'pwa_cache_button';
            el.classList.add('pwa_button');
            el.addEventListener('click', function (e) {
                var el, current_page = get_current_file();
                if ((el = document.getElementById('pwa_caches_list'))) el.parentNode.removeChild(el);
                this.classList.add('caching');
                ruigehond_active_worker.postMessage({cache: cache_key, index: current_page});
            });
            if (is_cached) el.classList.add('cached');
            // cache button must be before menu open button, because of css
            if ((menu_button = document.getElementById('pwa_offline_manual_button'))) {
                menu_button.insertAdjacentElement('beforebegin', el);
            } else {
                document.body.appendChild(el);
            }
        }
    }

    function caches_menu(caches) {
        var el, items = [], ul, li, a, btn;
        if (!isPWA()) {
            //return; //
        }
        if (!document.getElementById('pwa_caches_list')) {
            el = document.createElement('nav');
            el.id = 'pwa_caches_list';
            ul = document.createElement('ul');
            // close button
            li = document.createElement('li');
            li.innerHTML = '×';
            li.classList.add('close');
            ul.appendChild(li);
            // the available caches
            caches.forEach(function (cacheName) {
                if (ruigehond_pwa_assets.hasOwnProperty(cacheName)) {
                    if (ruigehond_pwa_assets[cacheName]['destination']) {
                        li = document.createElement('li');
                        a = document.createElement('a');
                        a.setAttribute('target', '_top');
                        a.setAttribute('href', pwa_root + cacheName + '/' + ruigehond_pwa_assets[cacheName]['destination']);
                        a.innerHTML = title_from_filename(cacheName);
                        li.appendChild(a);
                        //el.insertAdjacentHTML('beforeend', '<a target="_top" href="' + pwa_root + cacheName + '/' + ruigehond_pwa_assets[cacheName]['destination'] + '">' + title_from_filename(cacheName) + '</a>');
                        // delete button
                        btn = document.createElement('button');
                        btn.textContent = '×';
                        btn.title = 'Delete';
                        btn.setAttribute('data-cacheName', cacheName);
                        btn.addEventListener('click', function (event) {
                            var el;
                            event.preventDefault();
                            event.stopPropagation();
                            if (true === window.confirm(__('Delete manual?') + ' ' + title_from_filename(cacheName))) {
                                if ((el = document.getElementById('pwa_caches_list'))) el.parentNode.removeChild(el);
                                ruigehond_active_worker.postMessage({cache_delete: this.getAttribute('data-cacheName')});
                            }
                        });
                        li.appendChild(btn);
                        ul.appendChild(li);
                        //el.insertAdjacentElement('beforeend', btn);
                        items.push(cacheName);
                    }
                }
            });
            if (0 === items.length) {
                li = document.createElement('li');
                li.innerHTML = __('To save a manual for offline use, click the floppy icon while viewing the manual you need.');
                ul.appendChild(li);
            }
            el.appendChild(ul);
            el.addEventListener('click', function () {
                document.body.removeAttribute('data-pwa-offline-menu');
            });
            document.body.appendChild(el);
        }
    }

    function offline_manual_button() {
        var el, span, cache_button;
        if (!document.getElementById('pwa_offline_manual_button')) {
            el = document.createElement('nav');
            el.id = 'pwa_offline_manual_button';
            el.classList.add('pwa_button');
            span = document.createElement('span');
            span.innerText = __('Manuals');
            el.appendChild(span);
            el.addEventListener('click', function () {
                if (!isPWA()) {
                    //document.location.href = '/pwa/' + get_language_from_url() + '/add_to_homescreen_tutorial.html';
                }
                document.body.setAttribute('data-pwa-offline-menu', '1');
            });
            // cache button must be before menu open button, because of css
            if ((cache_button = document.getElementById('pwa_cache_button'))) {
                cache_button.insertAdjacentElement('afterend', el);
            } else {
                document.body.appendChild(el);
            }
            setTimeout(function(button) {
                button.style.opacity = '0';
            }, (pwa_timeouts.cache_button || 3500) - 250, el);
            setTimeout(function(button) {
                button.style.opacity = '1';
            }, (pwa_timeouts.cache_button || 3500) + 250, el);
            setTimeout(function(button) {
                button.innerHTML =  '<?xml version="1.0" encoding="iso-8859-1"?>\n' +
                    '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n' +
                    '\t width="24px" height="24px" viewBox="0 0 470.586 470.586"\n' +
                    '\t xml:space="preserve" style="margin: 12px;">\n' +
                    '<g>\n' +
                    '\t<path d="M327.081,0H90.234C74.331,0,61.381,12.959,61.381,28.859v412.863c0,15.924,12.95,28.863,28.853,28.863H380.35\n' +
                    '\t\tc15.917,0,28.855-12.939,28.855-28.863V89.234L327.081,0z M333.891,43.184l35.996,39.121h-35.996V43.184z M384.972,441.723\n' +
                    '\t\tc0,2.542-2.081,4.629-4.635,4.629H90.234c-2.55,0-4.619-2.087-4.619-4.629V28.859c0-2.548,2.069-4.613,4.619-4.613h219.411v70.181\n' +
                    '\t\tc0,6.682,5.443,12.099,12.129,12.099h63.198V441.723z M128.364,128.89H334.15c5.013,0,9.079,4.066,9.079,9.079\n' +
                    '\t\tc0,5.013-4.066,9.079-9.079,9.079H128.364c-5.012,0-9.079-4.066-9.079-9.079C119.285,132.957,123.352,128.89,128.364,128.89z\n' +
                    '\t\t M343.229,198.98c0,5.012-4.066,9.079-9.079,9.079H128.364c-5.012,0-9.079-4.066-9.079-9.079s4.067-9.079,9.079-9.079H334.15\n' +
                    '\t\tC339.163,189.901,343.229,193.968,343.229,198.98z M343.229,257.993c0,5.013-4.066,9.079-9.079,9.079H128.364\n' +
                    '\t\tc-5.012,0-9.079-4.066-9.079-9.079s4.067-9.079,9.079-9.079H334.15C339.163,248.914,343.229,252.98,343.229,257.993z\n' +
                    '\t\t M343.229,318.011c0,5.013-4.066,9.079-9.079,9.079H128.364c-5.012,0-9.079-4.066-9.079-9.079s4.067-9.079,9.079-9.079H334.15\n' +
                    '\t\tC339.163,308.932,343.229,312.998,343.229,318.011z"/>\n' +
                    '</g>\n' +
                    '<g>\n' +
                    '</g>\n' +
                    '<g>\n' +
                    '</g>\n' +
                    '<g>\n' +
                    '</g>\n' +
                    '<g>\n' +
                    '</g>\n' +
                    '<g>\n' +
                    '</g>\n' +
                    '<g>\n' +
                    '</g>\n' +
                    '<g>\n' +
                    '</g>\n' +
                    '<g>\n' +
                    '</g>\n' +
                    '<g>\n' +
                    '</g>\n' +
                    '<g>\n' +
                    '</g>\n' +
                    '<g>\n' +
                    '</g>\n' +
                    '<g>\n' +
                    '</g>\n' +
                    '<g>\n' +
                    '</g>\n' +
                    '<g>\n' +
                    '</g>\n' +
                    '<g>\n' +
                    '</g>\n' +
                    '</svg>\n';
            }, (pwa_timeouts.cache_button || 3500), el);
        }
    }
}

if (document.readyState !== 'loading') {
    ruigehond_pwa();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        ruigehond_pwa();
    });
}
