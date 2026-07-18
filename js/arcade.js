/**
 * Hidden arcade
 * High-five the wave → a corner of the page peels back. Click that corner →
 * the whole page sheet peels away to reveal the games room behind it.
 *
 * The arcade lives inline here (single source of truth). Opening it swaps the
 * URL to /games/ via pushState — no navigation, so the peel animation stays
 * seamless — and the browser Back button closes it again. Direct hits to
 * /games/ are bounced here by a redirect shim (games/index.html) with an
 * ?arcade flag, which opens the arcade instantly on load.
 */
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        var sheet = document.getElementById('page-sheet');
        var peel = document.getElementById('page-peel');
        var room = document.getElementById('games-room');
        var backBtn = document.getElementById('room-back');
        if (!sheet || !peel || !room) return;

        var revealed = false; // corner peeled back and inviting a click
        var open = false;     // sheet peeled away, room showing

        // True when the address bar is (virtually) at the arcade.
        function atGames() {
            return location.pathname.replace(/\/+$/, '') === '/games';
        }

        // Show the peeled corner. Only ever called from a high-five, and never
        // persisted — so the arcade stays fully hidden until the visitor
        // actually high-fives, every page load.
        function revealPeel() {
            if (revealed) return;
            revealed = true;
            peel.hidden = false;
            // Force a reflow so the grow-in transition runs from the hidden state.
            void peel.offsetWidth;
            peel.classList.add('is-in');
        }

        function prefersReduced() {
            return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        }

        // Use the soft-fold curl when supported; otherwise the CSS peel.
        function useCurl() {
            return window.PeelCurl && window.PeelCurl.isSupported() && !prefersReduced();
        }

        function finishOpen() {
            sheet.setAttribute('inert', '');
            sheet.setAttribute('aria-hidden', 'true');
            if (backBtn) backBtn.focus();
            document.addEventListener('keydown', onKey);
        }

        // Reveal the arcade. `instant` skips the peel animation — used when we
        // land here already meant to be open (a /games/ deep link), where there
        // was never a sheet to curl away in the first place.
        function applyOpen(instant) {
            if (open) return;
            open = true;

            room.removeAttribute('inert');
            room.setAttribute('aria-hidden', 'false');
            document.body.classList.add('arcade-open');
            peel.classList.add('is-spent');

            if (instant) {
                // Jump straight to the peeled-away end state, no animation.
                // (The .is-peeling class only reaches opacity:0 via its running
                // animation, so set the end state explicitly here.)
                sheet.classList.remove('is-restoring', 'is-peeling');
                sheet.style.animation = 'none';
                sheet.style.opacity = '0';
                sheet.style.pointerEvents = 'none';
                finishOpen();
                return;
            }

            if (useCurl()) {
                window.PeelCurl.run(sheet, room).then(finishOpen).catch(function () {
                    // Curl unsupported — fall back to the CSS peel.
                    sheet.style.visibility = '';
                    sheet.classList.remove('is-restoring');
                    sheet.classList.add('is-peeling');
                    finishOpen();
                });
            } else {
                sheet.classList.remove('is-restoring');
                sheet.classList.add('is-peeling');
                finishOpen();
            }
        }

        function finishClose() {
            document.body.classList.remove('arcade-open');
            peel.classList.remove('is-spent');
            sheet.style.visibility = '';
            sheet.style.animation = '';
            sheet.style.opacity = '';
            sheet.style.pointerEvents = '';
            sheet.removeAttribute('inert');
            sheet.removeAttribute('aria-hidden');
            // Return focus to the corner so keyboard users keep their place.
            if (!peel.hidden && peel.focus) peel.focus();
        }

        function applyClose() {
            if (!open) return;
            open = false;

            room.setAttribute('inert', '');
            room.setAttribute('aria-hidden', 'true');
            document.removeEventListener('keydown', onKey);

            // Clear any instant-open overrides so the restore can animate.
            sheet.style.animation = '';
            sheet.style.opacity = '';
            sheet.style.pointerEvents = '';

            if (window.PeelCurl && window.PeelCurl.canReverse()) {
                // Un-curl the page back over the arcade.
                window.PeelCurl.reverse(sheet).then(finishClose, finishClose);
            } else {
                sheet.classList.remove('is-peeling');
                sheet.classList.add('is-restoring');
                finishClose();
            }
        }

        // User-initiated open (clicked the peeled corner): reveal + record the
        // /games/ URL so it's shareable and the Back button closes the arcade.
        function openRoom() {
            if (open) return;
            applyOpen(false);
            if (!atGames()) {
                history.pushState({ arcade: true }, '', '/games/');
            }
        }

        // User-initiated close (Back-to-the-page button or Escape): restore the
        // sheet and return the URL to the home page.
        function closeRoom() {
            if (!open) return;
            applyClose();
            if (atGames()) {
                history.pushState({}, '', '/');
            }
        }

        function onKey(e) {
            if (e.key === 'Escape') closeRoom();
        }

        // Browser Back/Forward: mirror the DOM to whatever URL we land on,
        // without pushing more history of our own.
        window.addEventListener('popstate', function () {
            if (atGames()) {
                applyOpen(false);
            } else {
                applyClose();
            }
        });

        // Let the restore animation re-run cleanly next time it opens.
        sheet.addEventListener('animationend', function (e) {
            if (e.animationName === 'page-peel-on') {
                sheet.classList.remove('is-restoring');
            }
        });

        peel.addEventListener('click', openRoom);
        if (backBtn) backBtn.addEventListener('click', closeRoom);
        document.addEventListener('liam:highfive', revealPeel);

        // Deep link: a direct /games/ hit is bounced here with ?arcade (or we
        // may already be sitting on the /games path). Open instantly and
        // normalize the URL to /games/ so it reads cleanly and reloads land
        // back in the arcade.
        var wantsArcade = atGames() ||
            /[?&]arcade\b/.test(location.search);
        if (wantsArcade) {
            applyOpen(true);
            history.replaceState({ arcade: true }, '', '/games/');
        }
    });
})();
