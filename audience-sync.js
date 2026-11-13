/*
 * audience-sync.js
 * Shared by the scorer pages (volleyball / basketball / badminton) and audience.html.
 *
 * Storage key : "gfss.audience.state.v1"   (localStorage, same browser profile only)
 *
 * Stored JSON shape:
 * {
 *   version : 1,
 *   sport   : "volleyball" | "basketball" | "badminton" | "cricket",
 *   savedAt : <Date.now() when written>,
 *   home    : { name, score, timeouts?, fouls? },
 *   away    : { name, score, timeouts?, fouls? },
 *   period  : <number> | null,            // volleyball: set number, basketball: the middle counter
 *   timer   : { running: bool, ms: <ms remaining at savedAt> },
 *   timeout : { active: bool, seconds: <seconds left> } | null,
 *   cricket : { ... }                     // cricket only: extra match detail (see cricket.html)
 * }
 *
 * The clock is stored as (running, ms, savedAt). While running, the audience computes
 *   remaining = ms - (Date.now() - savedAt)
 * so it stays accurate without the scorer writing every frame.
 *
 * Only scorer pages call publish(). The audience page only calls read()/subscribe().
 */
(function () {
    var KEY = 'gfss.audience.state.v1';
    var AUDIENCE_URL = 'audience.html';
    var WINDOW_NAME = 'gfss-audience-display';
    var SPORTS = ['volleyball', 'basketball', 'badminton', 'cricket'];
    var RESYNC_MS = 10000;   // re-publish the running clock this often
    var DRIFT_MS = 400;      // re-publish if the scorer clock jumps (manual time edit etc.)

    var lastSig = null;
    var lastPub = null;      // { ms, at } of the last write while the clock was running
    var audienceWin = null;

    function getRaw() {
        try { return window.localStorage.getItem(KEY); } catch (e) { return null; }
    }

    function num(v, fallback) {
        v = Number(v);
        return isFinite(v) ? v : fallback;
    }

    function cleanTeam(t) {
        if (!t || typeof t !== 'object') return null;
        var out = {
            name: String(t.name == null ? '' : t.name).slice(0, 60),
            score: Math.max(0, Math.floor(num(t.score, 0)))
        };
        if (t.timeouts != null) out.timeouts = Math.max(0, Math.floor(num(t.timeouts, 0)));
        if (t.fouls != null) out.fouls = Math.max(0, Math.floor(num(t.fouls, 0)));
        return out;
    }

    // Cricket carries a richer, nested payload. Keep it plain JSON, bounded in size and depth.
    function cleanDeep(v, depth) {
        if (depth > 5) return null;
        if (typeof v === 'string') return v.slice(0, 80);
        if (typeof v === 'number') return isFinite(v) ? v : 0;
        if (typeof v === 'boolean' || v === null) return v;
        if (Array.isArray(v)) return v.slice(0, 40).map(function (x) { return cleanDeep(x, depth + 1); });
        if (v && typeof v === 'object') {
            var o = {};
            Object.keys(v).slice(0, 40).forEach(function (k) { o[k] = cleanDeep(v[k], depth + 1); });
            return o;
        }
        return null;
    }

    // Parse + validate. Returns a clean state object or null (missing / malformed / unknown sport).
    function parse(raw) {
        if (!raw) return null;
        var s;
        try { s = JSON.parse(raw); } catch (e) { return null; }
        if (!s || typeof s !== 'object' || s.version !== 1) return null;
        if (SPORTS.indexOf(s.sport) === -1) return null;
        var home = cleanTeam(s.home), away = cleanTeam(s.away);
        if (!home || !away) return null;
        var t = s.timer || {};
        var out = {
            version: 1,
            sport: s.sport,
            savedAt: num(s.savedAt, 0),
            home: home,
            away: away,
            period: s.period == null ? null : Math.max(0, Math.floor(num(s.period, 0))),
            timer: { running: !!t.running, ms: Math.max(0, num(t.ms, 0)) },
            timeout: s.timeout && typeof s.timeout === 'object'
                ? { active: !!s.timeout.active, seconds: Math.max(0, Math.floor(num(s.timeout.seconds, 0))) }
                : null
        };
        if (s.banner && typeof s.banner === 'object') {
            out.banner = {
                shown: !!s.banner.shown,
                team: String(s.banner.team == null ? '' : s.banner.team).slice(0, 60),
                setLabel: String(s.banner.setLabel == null ? '' : s.banner.setLabel).slice(0, 20),
                score: String(s.banner.score == null ? '' : s.banner.score).slice(0, 20),
                id: num(s.banner.id, 0)
            };
        }
        if (s.caption && typeof s.caption === 'object') {
            out.caption = {
                text: String(s.caption.text == null ? '' : s.caption.text).slice(0, 40),
                id: num(s.caption.id, 0),
                ms: Math.max(0, Math.min(10000, num(s.caption.ms, 0)))
            };
        }
        if (s.sport === 'cricket') {
            if (!s.cricket || typeof s.cricket !== 'object') return null;
            out.cricket = cleanDeep(s.cricket, 0);
        }
        return out;
    }

    function read() { return parse(getRaw()); }

    // Scorer side. Safe to call every frame: it only writes when something meaningful changed.
    function publish(sport, state) {
        if (SPORTS.indexOf(sport) === -1 || !state) return;
        var now = Date.now();
        var timer = state.timer || { running: false, ms: 0 };
        var ms = Math.max(0, Math.round(num(timer.ms, 0)));
        var running = !!timer.running;

        // Signature ignores the live countdown value while running (it changes every frame).
        var sig = JSON.stringify([sport, state.home, state.away, state.period, state.timeout,
                                  running, running ? null : ms, state.cricket || null, state.banner || null, state.caption || null]);
        var need = sig !== lastSig;

        if (!need && running && lastPub) {
            var expected = lastPub.ms - (now - lastPub.at);
            if (Math.abs(expected - ms) > DRIFT_MS || now - lastPub.at > RESYNC_MS) need = true;
        }
        if (!need) return;

        var payload = {
            version: 1,
            sport: sport,
            savedAt: now,
            home: state.home,
            away: state.away,
            period: state.period == null ? null : state.period,
            timer: { running: running, ms: ms },
            timeout: state.timeout || null
        };
        if (state.banner) payload.banner = state.banner;
        if (state.caption) payload.caption = state.caption;
        if (sport === 'cricket') payload.cricket = state.cricket || null;
        try {
            window.localStorage.setItem(KEY, JSON.stringify(payload));
            lastSig = sig;
            lastPub = running ? { ms: ms, at: now } : null;
        } catch (e) {
            // Storage unavailable/full: scorer keeps working, audience just won't update.
        }
    }

    // Audience side. Calls cb(state|null) now and on every change from another window.
    function subscribe(cb) {
        var lastRaw = getRaw();
        function fire(raw) { lastRaw = raw; cb(parse(raw)); }

        window.addEventListener('storage', function (e) {
            if (e.key === KEY || e.key === null) fire(getRaw());
        });
        // Safety net in case a storage event is missed.
        setInterval(function () {
            var raw = getRaw();
            if (raw !== lastRaw) fire(raw);
        }, 1000);

        fire(lastRaw);
    }

    // ---- Scorer side: launch button ----------------------------------------------------
    function openAudience() {
        if (audienceWin && !audienceWin.closed) {
            audienceWin.focus();
            return;
        }
        var w = Math.min(1280, window.screen.availWidth || 1280);
        var h = Math.min(720, window.screen.availHeight || 720);
        // Opened only on click. The browser decides which monitor; drag it to the gym display.
        audienceWin = window.open(AUDIENCE_URL, WINDOW_NAME,
            'popup=yes,width=' + w + ',height=' + h + ',left=80,top=80');
        if (!audienceWin) {
            alert('The audience display was blocked by the browser. Allow pop-ups for this site and try again.');
        }
    }

    function mountLaunchButton() {
        if (document.getElementById('launchAudienceBtn')) return;
        var btn = document.createElement('button');
        btn.id = 'launchAudienceBtn';
        btn.type = 'button';
        btn.textContent = 'Launch Audience Display';
        btn.title = 'Opens a read-only scoreboard window for the gym screen';
        btn.style.cssText =
            'position:fixed;top:12px;right:12px;z-index:9000;padding:10px 20px;' +
            "font:600 24px/1 'Teko',Arial,sans-serif;letter-spacing:0.04em;color:#000;" +
            'background:#ffd700;border:2px solid rgba(0,0,0,0.25);border-radius:10px;' +
            'cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.35);';
        // Keep the click away from the p5 canvas handlers, and don't let Space/Enter re-trigger it.
        btn.addEventListener('mousedown', function (e) { e.stopPropagation(); });
        btn.addEventListener('touchstart', function (e) { e.stopPropagation(); }, { passive: true });
        btn.addEventListener('click', function () { openAudience(); btn.blur(); });
        document.body.appendChild(btn);
    }


    // ---- Scorer side: "Set result" editor ------------------------------------------------
    // Lets the scorekeeper edit and show a "<team> won the <2nd> set by <25-21>" screen on the audience display.
    function ordinal(n) {
        n = Math.floor(Number(n));
        if (!isFinite(n) || n < 1) return String(n);
        var v = n % 100;
        if (v >= 11 && v <= 13) return n + 'th';
        return n + (['th', 'st', 'nd', 'rd'][n % 10] || 'th');
    }

    function mountSetResult(opts) {
        if (document.getElementById('setResultBtn')) return null;
        var banner = { shown: false, team: '', setLabel: '', score: '', id: 0 };

        var btn = document.createElement('button');
        btn.id = 'setResultBtn';
        btn.type = 'button';
        function paintBtn() {
            btn.textContent = banner.shown ? 'Set Result: SHOWING' : 'Set Result';
            btn.style.background = banner.shown ? '#22c55e' : '#ffffff';
        }
        btn.style.cssText =
            'position:fixed;top:70px;right:12px;z-index:9000;padding:8px 20px;' +
            "font:600 22px/1 'Teko',Arial,sans-serif;letter-spacing:0.04em;color:#000;" +
            'border:2px solid rgba(0,0,0,0.25);border-radius:10px;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.35);';
        paintBtn();

        var overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;z-index:9500;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,0.65);' +
            "font-family:'Teko',Arial,sans-serif;";
        var box = document.createElement('div');
        box.style.cssText = 'width:min(560px,92vw);max-height:92vh;overflow:auto;padding:22px 24px;border-radius:16px;background:#0b1220;color:#fff;' +
            'border:2px solid #ffd700;box-shadow:0 12px 40px rgba(0,0,0,0.6);';
        overlay.appendChild(box);

        function el(tag, css, text) {
            var e = document.createElement(tag);
            if (css) e.style.cssText = css;
            if (text != null) e.textContent = text;
            return e;
        }
        var inputCss = 'width:100%;box-sizing:border-box;padding:8px 12px;margin:4px 0 12px;font:500 26px/1.1 Arial,sans-serif;color:#000;background:#fff;border:2px solid #ffd700;border-radius:8px;';
        var labelCss = 'font-size:24px;letter-spacing:0.05em;color:#ffd700;';
        var btnCss = 'padding:8px 16px;font:600 24px/1 Teko,Arial,sans-serif;letter-spacing:0.04em;border:0;border-radius:8px;cursor:pointer;';

        box.appendChild(el('div', 'font-size:34px;font-weight:600;letter-spacing:0.05em;margin-bottom:10px;', 'SET RESULT SCREEN'));
        box.appendChild(el('div', labelCss, 'WINNING TEAM'));
        var team = el('input', inputCss); team.type = 'text'; team.maxLength = 60; box.appendChild(team);
        var quick = el('div', 'display:flex;gap:8px;margin:-6px 0 12px;flex-wrap:wrap;');
        var qHome = el('button', btnCss + 'background:#334155;color:#fff;font-size:20px;'), qAway = el('button', btnCss + 'background:#334155;color:#fff;font-size:20px;');
        qHome.type = qAway.type = 'button';
        quick.appendChild(qHome); quick.appendChild(qAway); box.appendChild(quick);
        box.appendChild(el('div', labelCss, 'SET (e.g. 2nd)'));
        var setLbl = el('input', inputCss); setLbl.type = 'text'; setLbl.maxLength = 20; box.appendChild(setLbl);
        box.appendChild(el('div', labelCss, 'WON BY (e.g. 25 - 21)'));
        var score = el('input', inputCss); score.type = 'text'; score.maxLength = 20; box.appendChild(score);
        var preview = el('div', 'padding:10px 12px;margin-bottom:14px;border-radius:8px;background:#111c33;font:500 24px/1.25 Arial,sans-serif;color:#cbd5e1;');
        box.appendChild(preview);
        var row = el('div', 'display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end;');
        var bShow = el('button', btnCss + 'background:#22c55e;color:#000;', 'Show on audience screen');
        var bHide = el('button', btnCss + 'background:#ef4444;color:#fff;', 'Hide from audience screen');
        var bClose = el('button', btnCss + 'background:#475569;color:#fff;', 'Close');
        bShow.type = bHide.type = bClose.type = 'button';
        row.appendChild(bClose); row.appendChild(bHide); row.appendChild(bShow); box.appendChild(row);

        function paintPreview() {
            preview.textContent = (team.value.trim() || '[team]') + ' won the ' + (setLbl.value.trim() || '[set]') + ' set by ' + (score.value.trim() || '[score]');
        }
        [team, setLbl, score].forEach(function (i) { i.addEventListener('input', paintPreview); });

        // The page underneath is a p5 canvas listening for keys and clicks: keep this editor's events to itself.
        ['keydown', 'keyup', 'keypress', 'mousedown', 'mouseup', 'click', 'touchstart', 'touchend'].forEach(function (ev) {
            overlay.addEventListener(ev, function (e) { e.stopPropagation(); }, ev.indexOf('touch') === 0 ? { passive: true } : false);
        });

        function ctx() { return (opts && opts.getContext && opts.getContext()) || {}; }
        function open(finishedSet) {
            var c = ctx();
            qHome.textContent = c.home || 'Home'; qAway.textContent = c.away || 'Away';
            qHome.onclick = function () { team.value = c.home || ''; paintPreview(); };
            qAway.onclick = function () { team.value = c.away || ''; paintPreview(); };
            if (finishedSet != null) {                       // fresh set just ended: prefill from the scoreboard
                var p1 = Number(c.p1) || 0, p2 = Number(c.p2) || 0;
                team.value = p1 > p2 ? (c.home || '') : p2 > p1 ? (c.away || '') : '';
                setLbl.value = ordinal(finishedSet);
                score.value = Math.max(p1, p2) + ' - ' + Math.min(p1, p2);
            } else if (banner.id) {                          // reopen: keep what was last used
                team.value = banner.team; setLbl.value = banner.setLabel; score.value = banner.score;
            } else {
                var q1 = Number(c.p1) || 0, q2 = Number(c.p2) || 0;
                team.value = q1 > q2 ? (c.home || '') : q2 > q1 ? (c.away || '') : '';
                setLbl.value = ordinal(Number(c.set) || 1);
                score.value = Math.max(q1, q2) + ' - ' + Math.min(q1, q2);
            }
            paintPreview();
            overlay.style.display = 'flex';
            setTimeout(function () { try { team.focus(); team.select(); } catch (e) {} }, 30);
        }
        function close() { overlay.style.display = 'none'; try { document.activeElement && document.activeElement.blur(); } catch (e) {} }
        function commit(shown) {
            banner = { shown: shown, team: team.value.trim(), setLabel: setLbl.value.trim(), score: score.value.trim(), id: Date.now() };
            paintBtn();
            if (opts && opts.onChange) opts.onChange(banner);
            close();
        }
        bShow.addEventListener('click', function () {
            if (!team.value.trim() || !setLbl.value.trim() || !score.value.trim()) { alert('Fill in the team, the set and the score first.'); return; }
            commit(true);
        });
        bHide.addEventListener('click', function () { commit(false); });
        bClose.addEventListener('click', close);
        overlay.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
        btn.addEventListener('mousedown', function (e) { e.stopPropagation(); });
        btn.addEventListener('touchstart', function (e) { e.stopPropagation(); }, { passive: true });
        btn.addEventListener('click', function () { open(null); btn.blur(); });

        document.body.appendChild(overlay);
        document.body.appendChild(btn);
        return {
            open: open,
            hide: function () { if (banner.shown) { banner.shown = false; banner.id = Date.now(); paintBtn(); if (opts && opts.onChange) opts.onChange(banner); } },
            get: function () { return banner; }
        };
    }

    window.AudienceSync = {
        KEY: KEY,
        publish: publish,
        read: read,
        subscribe: subscribe,
        openAudience: openAudience,
        mountLaunchButton: mountLaunchButton,
        mountSetResult: mountSetResult
    };
})();