if (!self.define) {
    const e = e => {
            "require" !== e && (e += ".js");
            let s = Promise.resolve();
            return r[e] || (s = new Promise((async s => {
                if ("document" in self) {
                    const r = document.createElement("script");
                    r.src = e, document.head.appendChild(r), r.onload = s
                } else importScripts(e), s()
            }))), s.then((() => {
                if (!r[e]) throw new Error(`Module ${e} didn’t register its module`);
                return r[e]
            }))
        },
        s = (s, r) => {
            Promise.all(s.map(e)).then((e => r(1 === e.length ? e[0] : e)))
        },
        r = {
            require: Promise.resolve(s)
        };
    self.define = (s, i, a) => {
        r[s] || (r[s] = Promise.resolve().then((() => {
            let r = {};
            const c = {
                uri: location.origin + s.slice(1)
            };
            return Promise.all(i.map((s => {
                switch (s) {
                    case "exports":
                        return r;
                    case "module":
                        return c;
                    default:
                        return e(s)
                }
            }))).then((e => {
                const s = a(...e);
                return r.default || (r.default = s), r
            }))
        })))
    }
}
define("./sw.js", ["./workbox"], (function(e) {
    "use strict";
    self.skipWaiting(), e.clientsClaim(), e.precacheAndRoute([{
        url: "favicon.ico",
        revision: "f869984f711a1bcba1f561f09f53c8da"
    }, {
        url: "assets/a.tf",
        revision: "a1e54eb01417b179dd6703530fd25b2d"
    }, {
        url: "assets/AntOcrWasm.wasm",
        revision: "7bef8d0b352c96b399b7575023ef294d"
    }, {
        url: "assets/b.tf",
        revision: "6fdd91d65504746ec1720f91ecf7d945"
    }, {
        url: "assets/c.tf",
        revision: "c1732a295bf1e61faabdd06ce3b61fbe"
    }, {
        url: "assets/element-icons.woff",
        revision: "d9491be2c5109fca0fa40d0c59e2e3b9"
    }, {
        url: "assets/element-icons.ttf",
        revision: "abe71f7d608d43b56d9b2aef78d7ae99"
    }, {
        url: "assets/logo.png",
        revision: "17f10914516a63f7d5592db03b92d24e"
    }, {
        url: "assets/PDFRender.js",
        revision: "84d71ae7fc4ac84d0d896e9b01b58d2c"
    }, {
        url: "font/iconfont.ttf",
        revision: "764e458139c606d1979434d874741f95"
    }, {
        url: "font/iconfont.woff",
        revision: "1857c930751402c6c2cb69801f8aeb03"
    }, {
        url: "font/iconfont.woff2",
        revision: "2801b21df61ce562b1b18915796c3af2"
    }, {
        url: "assets/AntOcrWorker.js",
        revision: "14f54115dbcc8955bb64bd25ea1be007"
    }, {
        url: "assets/ExportPDF.js",
        revision: "57082cd858d25a8c044c68e7914bbe5c"
    }, {
        url: "assets/ExportPDF.css",
        revision: "09a41287496e44864b8c2129bb6090a5"
    }, {
        url: "assets/html2canvas.esm.js",
        revision: "44b6827a84bb819345b185f83dfac47a"
    }, {
        url: "assets/index.es.js",
        revision: "a86032afe9848a038359b269c3be8f17"
    },{
        url: "assets/main.css",
        revision: "f3ee5c538d5910501515d4ac5a19744a"
    }, {
        url: "assets/main.js",
        revision: "0a285a31c6bc616fe72daa73b1e4cc3b"
    }, {
        url: "assets/purify.es.js",
        revision: "d8ce43f75772aeb9b0850a99e0017ca0"
    }, {
        url: "assets/vendor.js",
        revision: "03e092a0bffe5ea0e761b6b9a1e20428"
    }, {
        url: "assets/zh.js",
        revision: "270270e13e855934d796f2cd062da626"
    },{
        url: "font/iconfont.css",
        revision: "fdaea9a33c3ef6b9ef954ca0757911ff"
    }, {
        url: "index.html",
        revision: "de62dffc2f5a1158dee04bd676c89885"
    }, {
        url: "registerSW.js",
        revision: "1872c500de691dce40960bb85481de07"
    }, {
        url: "manifest.webmanifest",
        revision: "5e2e7ff077e6b008def1afa07684000e"
    }], {}), e.cleanupOutdatedCaches(), e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))
}));
//# sourceMappingURL=sw.js.map