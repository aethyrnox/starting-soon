 /**
 * ============================================================
 *  Starting Soon — Script.js
 *  Handles:
 *    1. Dark Animated Block Grid  (Emboss / Timbul Effect)
 *    2. Neon Red Cable Animation  (Canvas)
 * ============================================================
 */

'use strict';

/* ============================================================
   BAGIAN 1: BLOCK GRID GENERATOR
   ============================================================ */
(function buildBlockGrid() {

    var grid    = document.getElementById('blocksGrid');
    var BSIZE   = 55; // ukuran tiap blok dalam pixel

    function populate() {
        grid.innerHTML = '';

        var cols  = Math.ceil(window.innerWidth  / BSIZE) + 1;
        var rows  = Math.ceil(window.innerHeight / BSIZE) + 1;
        var total = cols * rows;

        grid.style.gridTemplateColumns = 'repeat(' + cols + ', ' + BSIZE + 'px)';
        grid.style.gridTemplateRows    = 'repeat(' + rows + ', ' + BSIZE + 'px)';

        for (var i = 0; i < total; i++) {
            var block = document.createElement('div');
            block.className = 'block';

            // ~8% blok mendapat tint merah subtle
            if (Math.random() < 0.08) {
                block.classList.add('red-tint');
            }

            var dur   = (3 + Math.random() * 5).toFixed(2) + 's';
            var delay = (Math.random() * 7).toFixed(2) + 's';

            block.style.setProperty('--dur',   dur);
            block.style.setProperty('--delay', delay);
            grid.appendChild(block);
        }
    }

    populate();

    // Debounced resize
    var rszTimer;
    window.addEventListener('resize', function () {
        clearTimeout(rszTimer);
        rszTimer = setTimeout(populate, 220);
    });

})();


/* ============================================================
   BAGIAN 2: NEON CABLE ANIMATION (Canvas)
   ============================================================ */
(function neonCables() {

    var canvas = document.getElementById('neonCanvas');
    var ctx    = canvas.getContext('2d');

    /* --------------------------------------------------
       Resize canvas ke full screen
    -------------------------------------------------- */
    function resizeCanvas() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();

    /* --------------------------------------------------
       Bangun definisi jalur kabel
       Semua koordinat dalam pixel absolut
    -------------------------------------------------- */
    function buildPaths() {
        var W = canvas.width;
        var H = canvas.height;

        var om  = 28;   // margin luar
        var im  = 58;   // ornamen sudut: jarak dari border luar
        var bL  = 115;  // panjang kaki bracket sudut

        // Batas box teks tengah
        var cxL = W * 0.15;
        var cxR = W * 0.85;
        var cyT = H * 0.32;
        var cyB = H * 0.68;
        var cxM = W * 0.50;

        return [
            /* ---- BORDER LUAR ---- */
            [ [om, om],       [W - om, om]       ],   // atas
            [ [om, H - om],   [W - om, H - om]   ],   // bawah
            [ [om, om],       [om, H - om]        ],   // kiri
            [ [W - om, om],   [W - om, H - om]    ],   // kanan

            /* ---- BRACKET SUDUT — Kiri Atas ---- */
            [ [om + im, om + im], [om + im + bL, om + im]        ],
            [ [om + im, om + im], [om + im,       om + im + bL]  ],

            /* ---- BRACKET SUDUT — Kanan Atas ---- */
            [ [W - om - im, om + im], [W - om - im - bL, om + im]       ],
            [ [W - om - im, om + im], [W - om - im,       om + im + bL] ],

            /* ---- BRACKET SUDUT — Kiri Bawah ---- */
            [ [om + im, H - om - im], [om + im + bL, H - om - im]       ],
            [ [om + im, H - om - im], [om + im,       H - om - im - bL] ],

            /* ---- BRACKET SUDUT — Kanan Bawah ---- */
            [ [W - om - im, H - om - im], [W - om - im - bL, H - om - im]       ],
            [ [W - om - im, H - om - im], [W - om - im,       H - om - im - bL] ],

            /* ---- FRAME BOX TEKS TENGAH ---- */
            [ [cxL, cyT], [cxR, cyT] ],   // atas box
            [ [cxL, cyB], [cxR, cyB] ],   // bawah box
            [ [cxL, cyT], [cxL, cyB] ],   // kiri box
            [ [cxR, cyT], [cxR, cyB] ],   // kanan box

            /* ---- KONEKTOR HORIZONTAL (border luar → box teks) ---- */
            [ [om, H * 0.50],       [cxL, H * 0.50] ],
            [ [W - om, H * 0.50],   [cxR, H * 0.50] ],

            /* ---- KONEKTOR VERTIKAL ATAS (border luar → box teks) ---- */
            [ [W * 0.33, om],     [W * 0.33, cyT] ],
            [ [W * 0.67, om],     [W * 0.67, cyT] ],

            /* ---- KONEKTOR VERTIKAL BAWAH ---- */
            [ [W * 0.33, H - om], [W * 0.33, cyB] ],
            [ [W * 0.67, H - om], [W * 0.67, cyB] ],

            /* ---- ORNAMEN ATAS TENGAH ---- */
            [
                [W * 0.33, om + im],
                [W * 0.33, cyT - 38],
                [cxM - 65, cyT - 38],
                [cxM,      cyT - 60],
                [cxM + 65, cyT - 38],
                [W * 0.67, cyT - 38],
                [W * 0.67, om + im]
            ],

            /* ---- ORNAMEN BAWAH TENGAH ---- */
            [
                [W * 0.33, H - om - im],
                [W * 0.33, cyB + 38],
                [cxM - 65, cyB + 38],
                [cxM,      cyB + 60],
                [cxM + 65, cyB + 38],
                [W * 0.67, cyB + 38],
                [W * 0.67, H - om - im]
            ],

            /* ---- DETAIL SIRKUIT KIRI ---- */
            [
                [om,       H * 0.38],
                [om + 55,  H * 0.38],
                [om + 55,  H * 0.47],
                [cxL - 22, H * 0.47],
                [cxL - 22, H * 0.53],
                [om + 55,  H * 0.53],
                [om + 55,  H * 0.62],
                [om,       H * 0.62]
            ],

            /* ---- DETAIL SIRKUIT KANAN ---- */
            [
                [W - om,        H * 0.38],
                [W - om - 55,   H * 0.38],
                [W - om - 55,   H * 0.47],
                [cxR + 22,      H * 0.47],
                [cxR + 22,      H * 0.53],
                [W - om - 55,   H * 0.53],
                [W - om - 55,   H * 0.62],
                [W - om,        H * 0.62]
            ]
        ];
    }

    /* --------------------------------------------------
       Kelas Signal — titik bercahaya yang berjalan
       sepanjang jalur kabel
    -------------------------------------------------- */
    function Signal(path, speed) {
        this.path        = path;
        this.speed       = speed;           // px/detik
        this.totalLen    = this._calcLen();
        this.dist        = Math.random() * this.totalLen;
        this.trailPoints = [];
        this.trailMax    = 20;
    }

    Signal.prototype._calcLen = function () {
        var len = 0;
        for (var i = 1; i < this.path.length; i++) {
            var dx = this.path[i][0] - this.path[i - 1][0];
            var dy = this.path[i][1] - this.path[i - 1][1];
            len += Math.sqrt(dx * dx + dy * dy);
        }
        return len;
    };

    Signal.prototype.getPos = function () {
        var rem = this.dist % this.totalLen;
        for (var i = 1; i < this.path.length; i++) {
            var dx  = this.path[i][0] - this.path[i - 1][0];
            var dy  = this.path[i][1] - this.path[i - 1][1];
            var seg = Math.sqrt(dx * dx + dy * dy);
            if (rem <= seg) {
                var t = rem / seg;
                return [
                    this.path[i - 1][0] + dx * t,
                    this.path[i - 1][1] + dy * t
                ];
            }
            rem -= seg;
        }
        return [this.path[this.path.length - 1][0], this.path[this.path.length - 1][1]];
    };

    Signal.prototype.update = function (dt) {
        this.dist += this.speed * dt;
        var pos = this.getPos();
        this.trailPoints.push(pos);
        if (this.trailPoints.length > this.trailMax) {
            this.trailPoints.shift();
        }
    };

    /* --------------------------------------------------
       Fungsi gambar
    -------------------------------------------------- */
    function drawCablePath(path, lineWidth, color, blur) {
        if (path.length < 2) return;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(path[0][0], path[0][1]);
        for (var i = 1; i < path.length; i++) {
            ctx.lineTo(path[i][0], path[i][1]);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth   = lineWidth;
        ctx.lineCap     = 'round';
        ctx.lineJoin    = 'round';
        ctx.shadowBlur  = blur;
        ctx.shadowColor = '#FF0000';
        ctx.stroke();
        ctx.restore();
    }

    function drawNodeDot(x, y) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle   = 'rgba(200, 0, 0, 0.85)';
        ctx.shadowBlur  = 12;
        ctx.shadowColor = '#FF0000';
        ctx.fill();
        ctx.restore();
    }

    function drawNodeDots(paths) {
        var seen = {};
        for (var p = 0; p < paths.length; p++) {
            var path = paths[p];
            var endpoints = [path[0], path[path.length - 1]];
            for (var e = 0; e < endpoints.length; e++) {
                var pt  = endpoints[e];
                var key = Math.round(pt[0]) + '_' + Math.round(pt[1]);
                if (!seen[key]) {
                    seen[key] = true;
                    drawNodeDot(pt[0], pt[1]);
                }
            }
        }
    }

    function drawSignal(sig) {
        // Jejak gerak (motion trail)
        for (var i = 0; i < sig.trailPoints.length; i++) {
            var alpha = i / sig.trailPoints.length;
            var tp    = sig.trailPoints[i];
            ctx.save();
            ctx.beginPath();
            ctx.arc(tp[0], tp[1], 3 * alpha, 0, Math.PI * 2);
            ctx.fillStyle   = 'rgba(255, 60, 60, ' + (alpha * 0.55) + ')';
            ctx.shadowBlur  = 10 * alpha;
            ctx.shadowColor = '#FF0000';
            ctx.fill();
            ctx.restore();
        }

        var pos = sig.getPos();

        // Halo luar
        ctx.save();
        ctx.beginPath();
        ctx.arc(pos[0], pos[1], 13, 0, Math.PI * 2);
        ctx.fillStyle   = 'rgba(255, 0, 0, 0.07)';
        ctx.shadowBlur  = 30;
        ctx.shadowColor = '#FF0000';
        ctx.fill();
        ctx.restore();

        // Cincin tengah
        ctx.save();
        ctx.beginPath();
        ctx.arc(pos[0], pos[1], 6, 0, Math.PI * 2);
        ctx.fillStyle   = 'rgba(255, 50, 50, 0.50)';
        ctx.shadowBlur  = 16;
        ctx.shadowColor = '#FF2222';
        ctx.fill();
        ctx.restore();

        // Core putih panas
        ctx.save();
        ctx.beginPath();
        ctx.arc(pos[0], pos[1], 2.5, 0, Math.PI * 2);
        ctx.fillStyle   = '#FFFFFF';
        ctx.shadowBlur  = 7;
        ctx.shadowColor = '#FF5555';
        ctx.fill();
        ctx.restore();
    }

    /* --------------------------------------------------
       Loop animasi utama
    -------------------------------------------------- */
    var paths   = [];
    var signals = [];
    var lastTS  = null;

    function initSignals() {
        paths   = buildPaths();
        signals = [];

        for (var p = 0; p < paths.length; p++) {
            var path  = paths[p];
            var count = path.length > 5 ? 2 + Math.floor(Math.random() * 2)
                                        : 1 + Math.floor(Math.random() * 2);
            for (var i = 0; i < count; i++) {
                var speed = 85 + Math.random() * 155;
                signals.push(new Signal(path, speed));
            }
        }
    }

    function render(ts) {
        if (!lastTS) lastTS = ts;
        var dt = Math.min((ts - lastTS) / 1000, 0.05); // cap delta time
        lastTS = ts;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        /* === Gambar badan kabel: 4 lapisan glow === */

        // Lapisan 1: glow difus luar (wide)
        for (var p1 = 0; p1 < paths.length; p1++) {
            drawCablePath(paths[p1], 16, 'rgba(170, 0, 0, 0.09)', 38);
        }
        // Lapisan 2: glow menengah
        for (var p2 = 0; p2 < paths.length; p2++) {
            drawCablePath(paths[p2], 7,  'rgba(215, 10, 10, 0.38)', 20);
        }
        // Lapisan 3: garis neon inti
        for (var p3 = 0; p3 < paths.length; p3++) {
            drawCablePath(paths[p3], 2,  '#BB0000', 8);
        }
        // Lapisan 4: garis core putih-panas
        for (var p4 = 0; p4 < paths.length; p4++) {
            drawCablePath(paths[p4], 0.8, 'rgba(255, 170, 170, 0.50)', 3);
        }

        /* === Node dot di tiap ujung jalur === */
        drawNodeDots(paths);

        /* === Update & gambar sinyal bergerak === */
        for (var s = 0; s < signals.length; s++) {
            signals[s].update(dt);
            drawSignal(signals[s]);
        }

        requestAnimationFrame(render);
    }

    /* --------------------------------------------------
       Resize handler
    -------------------------------------------------- */
    var rszTimer;
    window.addEventListener('resize', function () {
        clearTimeout(rszTimer);
        rszTimer = setTimeout(function () {
            resizeCanvas();
            initSignals();
        }, 220);
    });

    /* --------------------------------------------------
       Start
    -------------------------------------------------- */
    initSignals();
    requestAnimationFrame(render);

})();
