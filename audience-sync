/*
 * audience-sync.js
 * Shared by the scorer pages (volleyball / basketball / badminton) and audience.html.
 *
 * Storage key : "gfss.audience.state.v1"   (localStorage, same browser profile only)
 *
 * Stored JSON shape:
 * {
 *   version : 1,
 *   sport   : "volleyball" | "basketball" | "badminton",
 *   savedAt : <Date.now() when written>,
 *   home    : { name, score, timeouts?, fouls? },
 *   away    : { name, score, timeouts?, fouls? },
 *   period  : <number> | null,            // volleyball: set number, basketball: the middle counter
 *   timer   : { running: bool, ms: <ms remaining at savedAt> },
 *   timeout : { active: bool, seconds: <seconds left> } | null
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
    var SPORTS = ['volleyball', 'basketball', 'badminton'];
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
        return {
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
                                  running, running ? null : ms]);
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

    window.AudienceSync = {
        KEY: KEY,
        publish: publish,
        read: read,
        subscribe: subscribe,
        openAudience: openAudience,
        mountLaunchButton: mountLaunchButton
    };
})();
