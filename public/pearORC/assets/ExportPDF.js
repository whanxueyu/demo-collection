import {
    e, _ as i
}
from "./main.js";
import {
    p as l, d as t, r as o, o as d, c as a, a as f, e as n, t as p, w as r, v as s, g, b as c
}
from "./vendor.js";
let m, _;
const h = {
        data: () => ({
            pdfPreview: !1,
            recoItem: void 0,
            dialogVisible: !1,
            pdfConfig: {
                filename: "pearocr",
                action: "Preview",
                onlyText: !1,
                visibleText: !0,
                pdfPreviewUrl: "",
                ImageAttached: "AttachOnNext"
            }
        }),
        mounted: function() {
            _ = this, e.addevent("AntOcrInited", (e => {
                _.loadModule()
            })), e.addevent("OpenExportPDFDialog", (e => {
                _.openDialog(e)
            }))
        },
        props: [],
        watch: {
            dialogVisible(e, i) {
                e || this.handleClose()
            }
        },
        methods: {
            loadModule() {
                i((() => import("./PDFRender.js")), []).then((i => {
                    m = i.default, e.set("ExportPDFInited", !0)
                }))
            }, openDialog(e) {
                if (this.recoItem = e, this.recoItem.filename) {
                    let e = this.recoItem.filename;
                    this.pdfConfig.filename = e.substring(0, e.lastIndexOf("."))
                } else this.pdfConfig.filename = "pearocr";
                this.dialogVisible = !0
            }, exportPDF() {
                this.pdfConfig.action = "SaveToFile", m.render(this.recoItem, this.pdfConfig)
            }, previewPDF() {
                this.pdfPreview = !this.pdfPreview, this.pdfPreview ? (this.pdfConfig.action = "Preview", this.pdfPreviewUrl = m.render(this.recoItem, this.pdfConfig), console.log("this.pdfPreviewUrl", this.pdfPreviewUrl)) : this.pdfPreviewUrl = ""
            }, handleClose(e) {
                this.pdfPreviewUrl = "", this.pdfPreview = !1, this.recoItem = void 0, e && e()
            }
        }
    },
    u = c();
l("data-v-f614bd34");
const v = {
    class: "dialog-footer"
};
t();
const b = u(((e, i, l, t, c, m) => {
    const _ = o("el-input"),
        h = o("el-form-item"),
        b = o("el-radio"),
        w = o("el-radio-group"),
        P = o("el-form"),
        C = o("el-button"),
        x = o("el-dialog");
    return d(), a(x, {
        title: c.pdfPreview ? e.$t("pdfconfig.preview_pdf") : e.$t("pdfconfig.export_pdf"),
        "model-value": c.dialogVisible,
        "onUpdate:modelValue": i[8] || (i[8] = e => {
            c.dialogVisible = e
        }),
        width: c.pdfPreview ? "90%" : "50%",
        top: c.pdfPreview ? "5vh" : "15vh",
        "before-close": m.handleClose,
        "destroy-on-close": !0
    }, {
        footer: u((() => [f("span", v, [f(C, {
            onClick: i[5] || (i[5] = e => {
                c.dialogVisible = !1, m.handleClose()
            }),
            size: "small"
        }, {
            default: u((() => [n(p(e.$t("common.cancel")), 1)])),
            _: 1
        }), f(C, {
            type: "primary",
            onClick: i[6] || (i[6] = e => {
                m.previewPDF()
            }),
            size: "small",
            plain: ""
        }, {
            default: u((() => [n(p(c.pdfPreview ? e.$t("pdfconfig.return_config") : e.$t("pdfconfig.preview_pdf")), 1)])),
            _: 1
        }), f(C, {
            type: "primary",
            onClick: i[7] || (i[7] = e => {
                m.exportPDF(), c.dialogVisible = !1
            }),
            size: "small"
        }, {
            default: u((() => [n(p(e.$t("pdfconfig.export_pdf")), 1)])),
            _: 1
        })])])),
        default: u((() => [c.pdfPreview ? g("", !0) : (d(), a(P, {
            key: 0,
            ref: "pdfConfig",
            model: c.pdfConfig,
            "label-width": "80px"
        }, {
            default: u((() => [f(h, {
                label: e.$t("pdfconfig.filename")
            }, {
                default: u((() => [f(_, {
                    modelValue: c.pdfConfig.filename,
                    "onUpdate:modelValue": i[1] || (i[1] = e => c.pdfConfig.filename = e)
                }, null, 8, ["modelValue"])])),
                _: 1
            }, 8, ["label"]), f(h, {
                label: e.$t("pdfconfig.export_data")
            }, {
                default: u((() => [f(w, {
                    modelValue: c.pdfConfig.onlyText,
                    "onUpdate:modelValue": i[2] || (i[2] = e => c.pdfConfig.onlyText = e)
                }, {
                    default: u((() => [f(b, {
                        label: !0
                    }, {
                        default: u((() => [n(p(e.$t("pdfconfig.only_text")), 1)])),
                        _: 1
                    }), f(b, {
                        label: !1
                    }, {
                        default: u((() => [n(p(e.$t("pdfconfig.text_and_image")), 1)])),
                        _: 1
                    })])),
                    _: 1
                }, 8, ["modelValue"])])),
                _: 1
            }, 8, ["label"]), r(f(h, {
                label: e.$t("pdfconfig.image_position")
            }, {
                default: u((() => [f(w, {
                    modelValue: c.pdfConfig.visibleText,
                    "onUpdate:modelValue": i[3] || (i[3] = e => c.pdfConfig.visibleText = e)
                }, {
                    default: u((() => [f(b, {
                        label: !0
                    }, {
                        default: u((() => [n(p(e.$t("pdfconfig.text_on_image")), 1)])),
                        _: 1
                    }), f(b, {
                        label: !1
                    }, {
                        default: u((() => [n(p(e.$t("pdfconfig.text_invisible")), 1)])),
                        _: 1
                    })])),
                    _: 1
                }, 8, ["modelValue"])])),
                _: 1
            }, 8, ["label"]), [
                [s, !c.pdfConfig.onlyText]
            ]), r(f(h, {
                label: e.$t("pdfconfig.with_original_picture")
            }, {
                default: u((() => [f(w, {
                    modelValue: c.pdfConfig.ImageAttached,
                    "onUpdate:modelValue": i[4] || (i[4] = e => c.pdfConfig.ImageAttached = e)
                }, {
                    default: u((() => [f(b, {
                        label: "NoAttach"
                    }, {
                        default: u((() => [n(p(e.$t("pdfconfig.without_original_picture")), 1)])),
                        _: 1
                    }), f(b, {
                        label: "AttachOnNext"
                    }, {
                        default: u((() => [n(p(e.$t("pdfconfig.image_attached_on_next_page")), 1)])),
                        _: 1
                    }), f(b, {
                        label: "AttachOnLast"
                    }, {
                        default: u((() => [n(p(e.$t("pdfconfig.image_attached_on_last_page")), 1)])),
                        _: 1
                    })])),
                    _: 1
                }, 8, ["modelValue"])])),
                _: 1
            }, 8, ["label"]), [
                [s, c.pdfConfig.onlyText || c.pdfConfig.visibleText]
            ])])),
            _: 1
        }, 8, ["model"])), c.pdfPreview ? (d(), a("iframe", {
            key: 1,
            ref: "pdfIframe",
            src: e.pdfPreviewUrl,
            frameborder: "0",
            width: "100%",
            style: {
                height: "70vh"
            }
        }, null, 8, ["src"])) : g("", !0)])),
        _: 1
    }, 8, ["title", "model-value", "width", "top", "before-close"])
}));
h.render = b, h.__scopeId = "data-v-f614bd34";
export
default h;