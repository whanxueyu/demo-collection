import {
    r as e,
    o as t,
    c as i,
    w as a,
    v as o,
    a as n,
    b as l,
    p as s,
    d as r,
    e as c,
    t as d,
    F as g,
    f as h,
    g as m,
    _ as p,
    h as u,
    i as f,
    j as _,
    k as x,
    l as v,
  } from "./vendor.js";
  function b() {
    return new Worker("./assets/AntOcrWorker.js", { type: "module" });
  }
  let C = {
    zh: [
      "./assets/a.tf",
      "./assets/b.tf",
      "./assets/c.tf",
    ],
  };
  var y = {
      langList: ["zh"],
      calcProgress: function () {
        let e = y.totalSize[0] + y.totalSize[1] + y.totalSize[2],
          t = y.loadedSize[0] + y.loadedSize[1] + y.loadedSize[2];
        y.onprogress && y.onprogress(t, e);
      },
      downLang: function (e) {
        (y.urls = C[e]),
          (y.xhrarr = [
            new XMLHttpRequest(),
            new XMLHttpRequest(),
            new XMLHttpRequest(),
          ]),
          (y.totalSize = [2304374, 4362980, 13250]),
          (y.loadedSize = [0, 0, 0]),
          (y.buffarr = [void 0, void 0, void 0]);
        for (let t = 0; t < y.xhrarr.length; t++) {
          let e = y.xhrarr[t];
          e.open("GET", y.urls[t]),
            e.setRequestHeader(
              "Content-type",
              "application/x-www-form-urlencoded",
            ),
            (e.responseType = "arraybuffer"),
            (e.xhrarrID = t),
            (e.onprogress = function (e) {
              e.lengthComputable &&
                ((y.totalSize[this.xhrarrID] = e.total),
                (y.loadedSize[this.xhrarrID] = e.loaded),
                y.calcProgress());
            }),
            (e.onload = function (e) {
              4 === this.readyState &&
                200 === this.status &&
                ((y.buffarr[this.xhrarrID] = this.response),
                y.buffarr[0] &&
                  y.buffarr[1] &&
                  y.buffarr[2] &&
                  (y.onfinish && y.onfinish(y.buffarr), (y.buffarr = void 0)));
            }),
            e.send(null);
        }
      },
    },
    k = document.createElement("canvas"),
    T = k.getContext("2d");
  var L = (function () {
      var e = { isBusy: !1, txtCount: 0 };
      return (
        (e.langList = y.langList),
        (e.ocrImage = function (t) {
          var i, a;
          (i = t.width),
            (a = t.height),
            (k.width = i),
            (k.height = a),
            T.drawImage(t, 0, 0);
          var o = T.getImageData(0, 0, t.width, t.height);
          let n = new ArrayBuffer(o.data.length);
          var l = new Uint8Array(n);
          for (let e = 0; e < l.length; e++) l[e] = o.data[e];
          e.worker.postMessage(["rec", t.width, t.height, n], [n]);
        }),
        (e.ocrImageUrl = function (t, i) {
          var a = new Image();
          e.isBusy
            ? e.onError && e.onError("antocr is busy")
            : ((e.isBusy = !0),
              (a.userData = i),
              (a.onload = function () {
                e.onImageLoad && e.onImageLoad(this, this.userData),
                  e.ocrImage(this);
              }),
              (a.src = t));
        }),
        (e.onmessage = function (t) {
          if ("Init" == t.data)
            return (
              e.onRuntimeInitialized && e.onRuntimeInitialized(),
              void (e.init = !0)
            );
          if ("recFinish" == t.data[0]) {
            var i = JSON.parse(t.data[3]);
            (i.imgWidth = t.data[1]),
              (i.imgHeight = t.data[2]),
              (i.langCode = e.langCode),
              (e.isBusy = !1),
              e.onRecognitionCompleted && e.onRecognitionCompleted(i);
          }
        }),
        (e.init = function () {
          (e.worker = new b()), (e.worker.onmessage = e.onmessage);
        }),
        (e.setLang = function (t) {
          e.onSetLangBegin && e.onSetLangBegin(t),
            y.downLang(t),
            (y.onprogress = e.onprogress),
            (y.onfinish = function (i) {
              e.worker.postMessage(
                ["setParams", i[0], i[1], i[2]],
                [i[0], i[1], i[2]],
              ),
                (e.langCode = t),
                e.onSetLangFinish && e.onSetLangFinish();
            });
        }),
        e
      );
    })(),
    I = {
      callBackDict: {},
      keyValDict: {},
      addevent: (e, t) => {
        I.callBackDict[e] || (I.callBackDict[e] = []),
          I.callBackDict[e].push(t),
          null != I.keyValDict[e] && t(I.keyValDict[e]);
      },
      set: (e, t) => {
        if (((I.keyValDict[e] = t), I.callBackDict[e]))
          for (const i of I.callBackDict[e]) i(t);
      },
      trig: (e) => {
        I.set(e, !I.keyValDict[e]);
      },
      get: (e) => I.keyValDict[e],
    };
  const D = {
      props: ["tips", "iconClass", "selected", "confirmTips", "visible"],
      emits: ["click"],
      methods: {
        onclick() {
          null != this.confirmTips
            ? this.$confirm(this.confirmTips, this.$t("common.optConfirm"), {
                confirmButtonText: this.$t("common.confirm"),
                cancelButtonText: this.$t("common.cancel"),
                type: "warning",
              }).then(() => {
                this.$emit("click");
              })
            : this.$emit("click");
        },
      },
    },
    S = l("data-v-522ea391"),
    $ = S((l, s, r, c, d, g) => {
      const h = e("el-tooltip");
      return (
        t(),
        i(
          h,
          {
            class: [
              {
                "icon-button_selected": r.selected,
                "icon-button_unselected": !r.selected,
              },
              "tipsitem icon-button",
            ],
            effect: "dark",
            content: r.tips,
            "show-after": 500,
            placement: "bottom",
          },
          {
            default: S(() => [
              a(
                n(
                  "i",
                  {
                    class: r.iconClass,
                    onClick: s[1] || (s[1] = (e) => g.onclick()),
                  },
                  null,
                  2,
                ),
                [[o, null == r.visible || r.visible]],
              ),
            ]),
            _: 1,
          },
          8,
          ["class", "content"],
        )
      );
    });
  (D.render = $), (D.__scopeId = "data-v-522ea391");
  var P = { _data: {}, _changeCallBack: {} },
    B = {
      errWordHandle: "Normal",
      highlightErrWordThres: 0.6,
      recThres: 0.6,
      unclipRadio: 1.6,
      keepLowScore: !1,
      textBackground: "#faebd7",
      textColor: "#000000",
      textBgTransparent: !1,
      recLangCode: "zh",
    };
  function R(e, t, i) {
    "object" == typeof e ? (e[t] = i) : "function" == typeof e && e(i);
  }
  (P.reset = () => {
    P.setFromDict(B), P.save();
  }),
    (P.save = () => {
      let e = JSON.stringify(P._data);
      localStorage.setItem("PearOcrConfig", e);
    }),
    (P.load = () => {
      let e = localStorage.getItem("PearOcrConfig");
      if (e) {
        P._data = JSON.parse(e);
        for (const e in B) null == P._data[e] && P.set(e, B[e]);
      } else P.reset();
    }),
    (P.get = (e) => P._data[e]),
    (P.set = (e, t) => {
      if (P._changeCallBack[e] && P._data[e] != t)
        for (const i of P._changeCallBack[e]) R(i, e, t);
      P._data[e] = t;
    }),
    (P.setFromDict = (e) => {
      for (const t in e) P.set(t, e[t]);
    }),
    (P.getToDict = (e) => {
      for (const t in e) {
        let i = P.get(t);
        null != i && (e[t] = i);
      }
    }),
    (P.addMonitor = (e, t) => {
      if ("object" != typeof e)
        null == P._changeCallBack[e] && (P._changeCallBack[e] = []),
          P._changeCallBack[e].push(t),
          P._data[e] && R(t, e, P._data[e]);
      else for (const i of e) P.addMonitor(i, t);
    }),
    P.load();
  const E = {
      data: () => ({
        errWordHandleOption: [
          { value: "Normal", label: "视作正常字符" },
          { value: "Highlight", label: "高亮字符" },
          { value: "Ignore", label: "跳过字符" },
          { value: "IgnoreAndNormal", label: "忽略两端其余正常" },
          { value: "IgnoreAndHighlight", label: "忽略两端其余高亮" },
        ],
        configure: {
          errWordHandle: "Normal",
          highlightErrWordThres: 0.6,
          recThres: 0.6,
          unclipRadio: 1.6,
          keepLowScore: !1,
          textBackground: "#faebd7",
          textBgTransparent: !1,
          textColor: "#000000",
        },
      }),
      created() {
        P.getToDict(this.configure);
      },
      props: ["dialogVisible"],
      emits: ["update:dialogVisible"],
      methods: {
        handleClose(e) {
          e && e();
        },
        savaConfigure() {
          P.setFromDict(this.configure), P.save();
        },
        resetConfigure() {
          P.reset(), P.getToDict(this.configure);
        },
      },
      watch: {
        dialogVisible(e) {
          e && P.getToDict(this.configure);
        },
      },
    },
    V = l("data-v-7b7daaba");
  s("data-v-7b7daaba");
  const z = { style: { display: "flex", "align-items": "center" } },
    H = { class: "dialog-footer" };
  r();
  const F = V((a, o, l, s, r, p) => {
    const u = e("el-option"),
      f = e("el-select"),
      _ = e("el-input-number"),
      x = e("el-form-item"),
      v = e("el-switch"),
      b = e("el-color-picker"),
      w = e("el-form"),
      C = e("el-button"),
      y = e("el-dialog");
    return (
      t(),
      i(
        y,
        {
          title: a.$t("configure.title"),
          "model-value": l.dialogVisible,
          "onUpdate:modelValue":
            o[11] ||
            (o[11] = (e) => {
              (l.dialogVisible = e),
                a.$emit("update:dialogVisible", l.dialogVisible);
            }),
          "before-close": p.handleClose,
          "destroy-on-close": !0,
        },
        {
          footer: V(() => [
            n("span", H, [
              n(
                C,
                { type: "warning", onClick: p.resetConfigure, size: "small" },
                {
                  default: V(() => [c(d(a.$t("configure.restore_default")), 1)]),
                  _: 1,
                },
                8,
                ["onClick"],
              ),
              n(
                C,
                {
                  onClick:
                    o[9] ||
                    (o[9] = (e) => {
                      (l.dialogVisible = !1), p.handleClose();
                    }),
                  size: "small",
                },
                { default: V(() => [c(d(a.$t("configure.cancel")), 1)]), _: 1 },
              ),
              n(
                C,
                {
                  type: "primary",
                  onClick:
                    o[10] ||
                    (o[10] = (e) => {
                      p.savaConfigure(), (l.dialogVisible = !1);
                    }),
                  size: "small",
                },
                { default: V(() => [c(d(a.$t("configure.save")), 1)]), _: 1 },
              ),
            ]),
          ]),
          default: V(() => [
            n(
              w,
              { ref: "Configure", model: r.configure, "label-width": "auto" },
              {
                default: V(() => [
                  n(
                    x,
                    { label: a.$t("configure.highlight_suspected_error") },
                    {
                      default: V(() => [
                        n(
                          f,
                          {
                            modelValue: r.configure.errWordHandle,
                            "onUpdate:modelValue":
                              o[1] ||
                              (o[1] = (e) => (r.configure.errWordHandle = e)),
                            size: "mini",
                            placeholder: "请选择",
                          },
                          {
                            default: V(() => [
                              (t(!0),
                              i(
                                g,
                                null,
                                h(
                                  r.errWordHandleOption,
                                  (e) => (
                                    t(),
                                    i(
                                      u,
                                      {
                                        key: e.value,
                                        label: e.label,
                                        value: e.value,
                                      },
                                      null,
                                      8,
                                      ["label", "value"],
                                    )
                                  ),
                                ),
                                128,
                              )),
                            ]),
                            _: 1,
                          },
                          8,
                          ["modelValue"],
                        ),
                        n(
                          "label",
                          null,
                          d(a.$t("configure.judgment_threshold")),
                          1,
                        ),
                        n(
                          _,
                          {
                            modelValue: r.configure.highlightErrWordThres,
                            "onUpdate:modelValue":
                              o[2] ||
                              (o[2] = (e) =>
                                (r.configure.highlightErrWordThres = e)),
                            size: "mini",
                            precision: 2,
                            step: 0.1,
                            min: 0,
                            max: 1,
                          },
                          null,
                          8,
                          ["modelValue", "step"],
                        ),
                      ]),
                      _: 1,
                    },
                    8,
                    ["label"],
                  ),
                  n(
                    x,
                    { label: a.$t("configure.confidence_threshold") },
                    {
                      default: V(() => [
                        n(
                          _,
                          {
                            modelValue: r.configure.recThres,
                            "onUpdate:modelValue":
                              o[3] || (o[3] = (e) => (r.configure.recThres = e)),
                            size: "mini",
                            precision: 2,
                            step: 0.1,
                            min: 0,
                            max: 1,
                          },
                          null,
                          8,
                          ["modelValue", "step"],
                        ),
                        n("label", null, d(a.$t("configure.keep_highlight")), 1),
                        n(
                          v,
                          {
                            modelValue: r.configure.keepLowScore,
                            "onUpdate:modelValue":
                              o[4] ||
                              (o[4] = (e) => (r.configure.keepLowScore = e)),
                          },
                          null,
                          8,
                          ["modelValue"],
                        ),
                      ]),
                      _: 1,
                    },
                    8,
                    ["label"],
                  ),
                  n(
                    x,
                    { label: a.$t("configure.text_background_color") },
                    {
                      default: V(() => [
                        n("div", z, [
                          n(
                            b,
                            {
                              modelValue: r.configure.textBackground,
                              "onUpdate:modelValue":
                                o[5] ||
                                (o[5] = (e) => (r.configure.textBackground = e)),
                            },
                            null,
                            8,
                            ["modelValue"],
                          ),
                          n("label", null, d(a.$t("configure.no_background")), 1),
                          n(
                            v,
                            {
                              modelValue: r.configure.textBgTransparent,
                              "onUpdate:modelValue":
                                o[6] ||
                                (o[6] = (e) =>
                                  (r.configure.textBgTransparent = e)),
                            },
                            null,
                            8,
                            ["modelValue"],
                          ),
                          n("label", null, d(a.$t("configure.text_color")), 1),
                          n(
                            b,
                            {
                              modelValue: r.configure.textColor,
                              "onUpdate:modelValue":
                                o[7] ||
                                (o[7] = (e) => (r.configure.textColor = e)),
                            },
                            null,
                            8,
                            ["modelValue"],
                          ),
                        ]),
                      ]),
                      _: 1,
                    },
                    8,
                    ["label"],
                  ),
                  m("", !0),
                ]),
                _: 1,
              },
              8,
              ["model"],
            ),
          ]),
          _: 1,
        },
        8,
        ["title", "model-value", "before-close"],
      )
    );
  });
  (E.render = F), (E.__scopeId = "data-v-7b7daaba");
  let A;
  const W = {
      components: { IconButton: D, Configure: E },
      data: () => ({
        configureVisible: !1,
        recLangCode: "",
        langList: L.langList,
      }),
      emits: ["onDeleteAllImage", "ReRecAllImage"],
      props: ["scannedCount", "imageListLength"],
      created() {
        (A = this), P.addMonitor(["recLangCode"], A);
      },
      methods: {
        onLangueChange(e) {
          L.setLang(e);
        },
        AllSaveToPdf() {
          I.set("OpenExportPDFDialog", this.$parent.imageList);
        },
      },
    },
    O = l("data-v-d695e80a");
  s("data-v-d695e80a");
  const M = { class: "ctrlbar" },
    U = { class: "leftArea" },
    N = { class: "el-dropdown-link" },
    j = n("i", { class: "el-icon-arrow-down el-icon--right" }, null, -1),
    G = { class: "rightArea" },
    Q = { key: 3 };
  r();
  const X = O((a, o, l, s, r, p) => {
    const u = e("el-dropdown-item"),
      f = e("el-dropdown-menu"),
      _ = e("el-dropdown"),
      x = e("IconButton"),
      v = e("Configure");
    return (
      t(),
      i(
        g,
        null,
        [
          n("div", M, [
            n("div", U, [
              n(
                "span",
                null,
                d(a.$t("imagelist.recognition_language")) + ": ",
                1,
              ),
              n(
                _,
                { trigger: "click", onCommand: p.onLangueChange },
                {
                  dropdown: O(() => [
                    n(f, null, {
                      default: O(() => [
                        (t(!0),
                        i(
                          g,
                          null,
                          h(
                            r.langList,
                            (e) => (
                              t(),
                              i(
                                u,
                                { key: e, command: e },
                                {
                                  default: O(() => [
                                    c(d(a.$t("langname." + e)), 1),
                                  ]),
                                  _: 2,
                                },
                                1032,
                                ["command"],
                              )
                            ),
                          ),
                          128,
                        )),
                      ]),
                      _: 1,
                    }),
                  ]),
                  default: O(() => [
                    n("span", N, [c(d(a.$t("langname." + r.recLangCode)), 1), j]),
                  ]),
                  _: 1,
                },
                8,
                ["onCommand"],
              ),
            ]),
            n("div", G, [
              l.scannedCount
                ? (t(),
                  i(
                    x,
                    {
                      key: 0,
                      tips: a.$t("imagelist.export_all_as_pdf"),
                      iconClass: "iconfont icon-pdf",
                      onClick: p.AllSaveToPdf,
                    },
                    null,
                    8,
                    ["tips", "onClick"],
                  ))
                : m("", !0),
              l.scannedCount
                ? (t(),
                  i(
                    x,
                    {
                      key: 1,
                      tips: a.$t("imagelist.refresh_all_image"),
                      iconClass: "el-icon-refresh-left",
                      confirmTips: a.$t("imagelist.tips_rerec_confirm"),
                      onClick: o[1] || (o[1] = (e) => a.$emit("ReRecAllImage")),
                    },
                    null,
                    8,
                    ["tips", "confirmTips"],
                  ))
                : m("", !0),
              l.scannedCount
                ? (t(),
                  i(
                    x,
                    {
                      key: 2,
                      tips: a.$t("imagelist.delete_all_image"),
                      iconClass: "el-icon-delete",
                      confirmTips: a.$t("imagelist.tips_delete_confirm"),
                      onClick:
                        o[2] || (o[2] = (e) => a.$emit("onDeleteAllImage")),
                    },
                    null,
                    8,
                    ["tips", "confirmTips"],
                  ))
                : m("", !0),
              n(
                x,
                {
                  tips: a.$t("imagelist.configure"),
                  iconClass: "el-icon-setting",
                  onClick: o[3] || (o[3] = (e) => (r.configureVisible = !0)),
                },
                null,
                8,
                ["tips"],
              ),
              l.imageListLength
                ? (t(),
                  i(
                    "span",
                    Q,
                    d(a.$t("imagelist.recognition_progress")) +
                      ":" +
                      d(l.scannedCount) +
                      "/" +
                      d(l.imageListLength),
                    1,
                  ))
                : m("", !0),
            ]),
          ]),
          n(
            v,
            {
              dialogVisible: r.configureVisible,
              "onUpdate:dialogVisible":
                o[4] || (o[4] = (e) => (r.configureVisible = e)),
            },
            null,
            8,
            ["dialogVisible"],
          ),
        ],
        64,
      )
    );
  });
  (W.render = X), (W.__scopeId = "data-v-d695e80a");
  var q = null,
    Z = 0;
  const J = {
      components: { ImageListCtrlBar: W },
      data: () => ({
        onRecognitionError: null,
        imageList: new Array(),
        selectedId: -1,
        scannedCount: 0,
      }),
      created: function () {
        q = this;
      },
      emits: [
        "onRuntimeInitialized",
        "currentItemChange",
        "clearRecognitionImage",
      ],
      mounted() {
        window.addEventListener("paste", async function (e) {
          e.preventDefault(), e.stopPropagation(), q.fromClipboard(e);
        }),
          I.addevent("ReRecCurRequest", function () {
            if (-1 != q.selectedId) {
              let e = q.findIndexById(q.selectedId);
              if (q.imageList[e].isScaning) return void q.idleCheck();
              q.Re_recognitionImage(q.selectedId);
            }
          });
      },
      methods: {
        uploadClick() {
          this.$refs.inputFile.dispatchEvent(new MouseEvent("click"));
        },
        idleCheck: (e = !1) =>
          !L.isBusy ||
          (e ||
            p({
              showClose: !0,
              message: q.$t("imagelist.tips_rec_conflict"),
              type: "error",
            }),
          !1),
        findIndexById(e) {
          for (let t = 0; t < this.imageList.length; t++)
            if (e == this.imageList[t].id) return t;
          return -1;
        },
        Re_recognitionImage(e) {
          if (null == e) {
            if (!q.idleCheck()) return;
            q.scannedCount = 0;
            for (const e of q.imageList) e.text = void 0;
            e = q.imageList[q.imageList.length - 1].id;
          }
          let t = q.findIndexById(e);
          null != q.imageList[t].text && q.scannedCount--,
            (q.imageList[t].text = void 0),
            q.idleCheck(!0) && q.recognitionImage(e);
        },
        recognitionImage(e) {
          let t;
          if (e) t = q.findIndexById(e);
          else if (
            ((e = q.selectedId),
            (t = q.findIndexById(e)),
            null != q.imageList[t].text)
          ) {
            for (t = q.imageList.length - 1; t >= 0; t--)
              if (null == q.imageList[t].text) {
                e = q.imageList[t].id;
                break;
              }
            if (t < 0) return;
          }
          null == q.imageList[t].text &&
            ((L.onRecognitionCompleted = (i) => {
              if (((t = q.findIndexById(e)), !(t < 0))) {
                var a = "";
                for (let e = 0; e < i.length; e++) a = a + i[e].text + "\n";
                (q.imageList[t].isScaning = !1),
                  q.scannedCount++,
                  (q.imageList[t].text = a),
                  (q.imageList[t].detail = i),
                  q.recognitionImage();
              }
            }),
            (L.onImageLoad = (e, i) => {
              (t = q.findIndexById(i)),
                (q.imageList[t].imgWidth = e.width),
                (q.imageList[t].imgHeight = e.height);
            }),
            (q.imageList[t].isScaning = !0),
            L.ocrImageUrl(q.imageList[t].url, e));
        },
        addImageToList(e, t) {
          var i = {};
          (i.url = e),
            (i.selected = !1),
            (i.id = Z),
            (i.filename = t),
            (Z += 1),
            q.imageList.unshift(i),
            q.idleCheck(!0) && q.imageClick(i.id),
            q.$nextTick(q.$refs.imgListScrollbar.update);
        },
        addImgPreview(e) {
          e || (e = this.$refs.inputFile.files);
          for (const t of e) {
            if (!t) return void console.log("error");
            {
              if ("image" != t.type.substring(0, 5))
                return void p({
                  showClose: !0,
                  message: q.$t("imagelist.tips_read_fail"),
                  type: "error",
                });
              const e = new FileReader();
              e.readAsDataURL(t),
                (e.filename = t.name),
                (e.onload = function (t) {
                  q.addImageToList(this.result, e.filename);
                });
            }
          }
        },
        imageClick(e) {
          if (this.selectedId == e) return;
          this.selectedId = e;
          let t = this.findIndexById(e);
          L.isBusy || null != this.imageList[t].text || this.recognitionImage(e),
            this.$emit("currentItemChange", this.imageList[t]);
        },
        deleteClick(e) {
          let t = this.findIndexById(e);
          this.imageList[t].isScaning ||
            (null != this.imageList[t].isScaning && q.scannedCount--,
            this.imageList.splice(t, 1),
            0 == t && (this.$refs.inputFile.value = ""),
            t >= this.imageList.length && (t -= 1),
            t >= 0
              ? q.imageClick(this.imageList[t].id)
              : q.$emit("clearRecognitionImage"));
        },
        DeleteAllImage() {
          if (0 == this.imageList.length) return;
          let e = [];
          for (; this.imageList.length > 0; ) {
            let t = this.imageList.splice(0, 1);
            t[0].isScaning && e.push(t[0]);
          }
          console.log("scaningItem", e),
            e.length
              ? ((this.imageList = e), q.imageClick(this.imageList[0].id))
              : (q.$emit("clearRecognitionImage"), (this.selectedId = -1)),
            (this.scannedCount = 0),
            this.$message({
              type: "success",
              message: e.length
                ? q.$t("imagelist.tips_delete_conflict")
                : q.$t("imagelist.tips_delete_success"),
            });
        },
        fromClipboard(e) {
          if (null == e)
            -1 == navigator.userAgent.indexOf("Firefox")
              ? navigator.clipboard
                  .read()
                  .then((e) => {
                    console.log("Pasted content: ", e);
                    var t = !1;
                    for (let a = 0; a < e.length; a++)
                      for (var i of e[a].types)
                        -1 !== i.indexOf("image") &&
                          ((t = !0),
                          e[a].getType(i).then((e) => {
                            var t = URL.createObjectURL(e);
                            q.addImageToList(t);
                          }));
                    t ||
                      p({
                        showClose: !0,
                        message: q.$t("imagelist.tips_clipboard_no_image"),
                        type: "warning",
                      });
                  })
                  .catch((e) => {
                    p({
                      showClose: !0,
                      message: q.$t("imagelist.tips_clipboard_faild"),
                      type: "error",
                    });
                  })
              : p({
                  showClose: !0,
                  message: q.$t("imagelist.tips_clipboard_firefox_only_hotkey"),
                  type: "warning",
                });
          else {
            e.preventDefault(), e.stopPropagation();
            for (const t of e.clipboardData.items) {
              if (0 != t.type.indexOf("image")) return;
              let e = t.getAsFile(),
                i = URL.createObjectURL(e);
              q.addImageToList(i);
            }
          }
        },
      },
    },
    Y = l("data-v-0b15c0dd");
  s("data-v-0b15c0dd");
  const K = { class: "rowCard" },
    ee = { class: "buttonArea" },
    te = n("i", { class: "iconfont icon-located" }, null, -1),
    ie = n("i", { class: "iconfont icon-clipboard" }, null, -1),
    ae = { class: "flex-content" },
    oe = { class: "delete" };
  r();
  const ne = Y((l, s, r, m, p, u) => {
    const f = e("ImageListCtrlBar"),
      _ = e("el-col"),
      x = e("el-image"),
      v = e("el-scrollbar"),
      b = e("el-row");
    return (
      t(),
      i("div", K, [
        n(
          f,
          {
            scannedCount: p.scannedCount,
            imageListLength: p.imageList.length,
            onOnDeleteAllImage: s[1] || (s[1] = (e) => u.DeleteAllImage()),
            onReRecAllImage: s[2] || (s[2] = (e) => u.Re_recognitionImage()),
          },
          null,
          8,
          ["scannedCount", "imageListLength"],
        ),
        n(
          b,
          { type: "flex" },
          {
            default: Y(() => [
              n(
                _,
                { class: "col_ctrlarea" },
                {
                  default: Y(() => [
                    n("div", ee, [
                      n("div", null, [
                        n(
                          "input",
                          {
                            ref: "inputFile",
                            type: "file",
                            style: { display: "none" },
                            onChange: s[3] || (s[3] = (e) => u.addImgPreview()),
                            accept: "image/*",
                            multiple: "",
                          },
                          null,
                          544,
                        ),
                      ]),
                      n(
                        "div",
                        {
                          class: "ao_button",
                          ref: "btn_locate_image",
                          onClick: s[4] || (s[4] = (e) => u.uploadClick()),
                        },
                        [te, c(" " + d(l.$t("imagelist.btn_locate_image")), 1)],
                        512,
                      ),
                      n(
                        "div",
                        {
                          class: "ao_button",
                          ref: "btn_read_clipboard",
                          onClick: s[5] || (s[5] = (e) => u.fromClipboard()),
                        },
                        [ie, c(" " + d(l.$t("imagelist.btn_read_clipboard")), 1)],
                        512,
                      ),
                    ]),
                  ]),
                  _: 1,
                },
              ),
              n(
                _,
                { class: "col_imagelist" },
                {
                  default: Y(() => [
                    n(
                      v,
                      { ref: "imgListScrollbar" },
                      {
                        default: Y(() => [
                          n("div", ae, [
                            (t(!0),
                            i(
                              g,
                              null,
                              h(
                                p.imageList,
                                (e) => (
                                  t(),
                                  i("div", { key: e.id }, [
                                    n("div", oe, [
                                      n(
                                        x,
                                        {
                                          class: [
                                            "item",
                                            {
                                              item_prepare:
                                                null != e.text &&
                                                p.selectedId != e.id,
                                              item_unselected:
                                                null == e.text &&
                                                p.selectedId != e.id,
                                              item_selected: p.selectedId == e.id,
                                              scanBox: e.isScaning,
                                            },
                                          ],
                                          src: e.url,
                                          onClick: (t) => u.imageClick(e.id),
                                          fit: "contain",
                                        },
                                        null,
                                        8,
                                        ["src", "class", "onClick"],
                                      ),
                                      a(
                                        n(
                                          "i",
                                          {
                                            onClick: (t) => u.deleteClick(e.id),
                                            class: "el-icon-delete delete-button",
                                          },
                                          null,
                                          8,
                                          ["onClick"],
                                        ),
                                        [[o, !e.isScaning]],
                                      ),
                                    ]),
                                  ])
                                ),
                              ),
                              128,
                            )),
                          ]),
                        ]),
                        _: 1,
                      },
                      512,
                    ),
                  ]),
                  _: 1,
                },
              ),
            ]),
            _: 1,
          },
        ),
      ])
    );
  });
  let le;
  (J.render = ne), (J.__scopeId = "data-v-0b15c0dd");
  const se = {},
    re = function (e, t) {
      if (!t || 0 === t.length) return e();
      if (void 0 === le) {
        const e = document.createElement("link").relList;
        le =
          e && e.supports && e.supports("modulepreload")
            ? "modulepreload"
            : "preload";
      }
      return Promise.all(
        t.map((e) => {
          if (e in se) return;
          se[e] = !0;
          const t = e.endsWith(".css"),
            i = t ? '[rel="stylesheet"]' : "";
          if (document.querySelector(`link[href="${e}"]${i}`)) return;
          const a = document.createElement("link");
          return (
            (a.rel = t ? "stylesheet" : le),
            t || ((a.as = "script"), (a.crossOrigin = "")),
            (a.href = e),
            document.head.appendChild(a),
            t
              ? new Promise((e, t) => {
                  a.addEventListener("load", e), a.addEventListener("error", t);
                })
              : void 0
          );
        }),
      ).then(() => e());
    };
  let ce;
  function de(e, t) {
    return Math.sqrt((e.x - t.x) * (e.x - t.x) + (e.y - t.y) * (e.y - t.y));
  }
  const ge = {
      data: () => ({
        dCSS: "",
        ctWidth: 0,
        ctHeight: 0,
        dCSS_image: "",
        errWordHandle: "Normal",
        recThres: 0.6,
        keepLowScore: !1,
        highlightErrWordThres: 0.6,
        textBackground: "#faebd7",
        textColor: "#000000",
        textBgTransparent: !1,
      }),
      props: ["recoItem", "fullScreen", "imageBG", "contenteditable"],
      emits: ["onExitFullScreen"],
      methods: {
        getRotateBoxColorStyle() {
          let e = "";
          return (
            this.textBgTransparent ||
              (e += "background-color:" + this.textBackground + ";"),
            (e += "color:" + this.textColor + ";"),
            e
          );
        },
        textChange(e, t) {
          e.target.innerText != t.text
            ? (t.textEdited = e.target.innerText)
            : (t.textEdited = ""),
            this.$forceUpdate();
        },
        getDisplayText(e) {
          if (e.textEdited) return e.textEdited;
          if ("Normal" == this.errWordHandle) return e.text;
          let t,
            i = "",
            a = !1,
            o = -1,
            n =
              this.errWordHandle.indexOf("Highlight") >= 0
                ? "<font color=red>"
                : "",
            l = this.errWordHandle.indexOf("Highlight") >= 0 ? "</font>" : "";
          for (let s = 0; s < e.wordScore.length; s++) {
            let r = e.wordScore[s];
            r < ce.highlightErrWordThres
              ? (a || (i += n), (a = !0))
              : (a && (i += l),
                o < 0 && (o = i.length),
                (t = i.length + 1),
                (a = !1)),
              (r >= ce.highlightErrWordThres || "Ignore" != this.errWordHandle) &&
                (i += e.text[s]);
          }
          return (
            a && (i += l),
            this.errWordHandle.indexOf("Ignore") >= 0
              ? o < 0
                ? ""
                : i.slice(o, t)
              : i
          );
        },
        updata(e) {
          if (this.$refs.PosTextBox) {
            if (this.fullScreen)
              (this.ctHeight = window.innerHeight),
                (this.ctWidth = window.innerWidth);
            else {
              var t = this.$refs.PosTextBox.parentNode;
              (this.ctHeight = t.offsetHeight), (this.ctWidth = t.offsetWidth);
            }
            var i = window.devicePixelRatio,
              a = 1 / i,
              o = e.detail.imgWidth,
              n = e.detail.imgHeight;
            this.dCSS =
              "width: " + o.toString() + "px;height: " + n.toString() + "px;";
            var l = (this.ctWidth * a) / o,
              s = (this.ctHeight * a) / n,
              r = Math.min(l, s) * i,
              c = (-n * (1 - (r = Math.min(1, r)))) / 2,
              d = (-o * (1 - r)) / 2;
            (c += (this.ctHeight - n * r) / 2),
              (d += (this.ctWidth - o * r) / 2),
              (this.dCSS += "transform: scale(" + r.toString() + ");"),
              (this.dCSS += "top: " + c.toString() + "px;"),
              this.fullScreen
                ? ((this.dCSS += "z-index: 21;position: fixed;"),
                  (this.dCSS_image = this.dCSS))
                : (this.dCSS_image = ""),
              (this.dCSS += "left: " + d.toString() + "px;"),
              (function (e) {
                for (let l = 0; l < e.detail.length; l++) {
                  var t = e.detail[l];
                  e.detail[l].textCss =
                    "transform: matrix(" +
                    t.trMat[0].toString() +
                    ", " +
                    t.trMat[1].toString() +
                    ", " +
                    t.trMat[2].toString() +
                    ", " +
                    t.trMat[3].toString() +
                    ", " +
                    t.trMat[4].toString() +
                    ", " +
                    t.trMat[5].toString() +
                    ");";
                  var i = de(e.detail[l].rect[0], e.detail[l].rect[1]),
                    a = de(e.detail[l].rect[1], e.detail[l].rect[2]),
                    o = Math.min(i, a),
                    n = Math.max(i, a);
                  (e.detail[l].textCss +=
                    "width: " +
                    n.toString() +
                    "px;height: " +
                    o.toString() +
                    "px;"),
                    (e.detail[l].textCss += "font-size: " + o.toString() + "px;");
                }
              })(e),
              this.$nextTick(() => {
                !(function (e, t) {
                  for (var i, a = e.childNodes, o = a.length - 1; o >= 0; o--) {
                    var n = a[o].childNodes[0];
                    if (
                      n &&
                      n.getAttribute &&
                      !n.getAttribute("isHandleTextSize")
                    ) {
                      var l = n.childNodes[0];
                      if (l) {
                        var s = a[o].getBoundingClientRect(),
                          r = l.getBoundingClientRect();
                        if (s.width > r.width + 5) {
                          var c = ((i = l),
                            "string" == typeof i.innerText
                              ? i.innerText
                              : i.textContent).length,
                            d = (s.width - r.width) / t / (c - 1);
                          l.style.letterSpacing = d.toString() + "px";
                        } else if (s.width < r.width) {
                          var g = s.width / r.width;
                          if (g > 0.98) continue;
                          n.style.cssText =
                            "transform: scale(" + g.toString() + ");";
                        }
                        n.setAttribute("isHandleTextSize", !0);
                      }
                    }
                  }
                })(this.$refs.PosTextBox, r);
              });
          }
        },
      },
      created() {
        (ce = this),
          P.addMonitor(
            [
              "errWordHandle",
              "highlightErrWordThres",
              "recThres",
              "keepLowScore",
              "textBackground",
              "textColor",
              "textBgTransparent",
            ],
            ce,
          ),
          (window.onresize = () => {
            ce.updata(ce.recoItem);
          });
      },
      mounted: function () {
        this.updata(this.recoItem);
      },
      beforeUpdate() {
        this.updata(this.recoItem);
      },
      watch: {
        recoItem(e, t) {
          this.updata(e);
        },
      },
    },
    he = l("data-v-78a912a2");
  s("data-v-78a912a2");
  const me = { key: 0, class: "covered" },
    pe = { class: "PosTextBoxDiv" },
    ue = { class: "PosTextBoxDiv2" },
    fe = { class: "tramsformOriLT" };
  r();
  const _e = he((l, s, r, c, d, p) => {
    const u = e("el-image");
    return (
      t(),
      i(
        g,
        null,
        [
          r.fullScreen ? (t(), i("div", me)) : m("", !0),
          r.fullScreen
            ? (t(),
              i("i", {
                key: 1,
                onClick: s[1] || (s[1] = (e) => l.$emit("onExitFullScreen")),
                class: "el-icon-close close-button",
              }))
            : m("", !0),
          r.imageBG
            ? (t(),
              i(
                u,
                {
                  key: 2,
                  class: "boxTextImageBG",
                  style: d.dCSS_image,
                  src: r.recoItem.url,
                  fit: "scale-down",
                },
                null,
                8,
                ["style", "src"],
              ))
            : m("", !0),
          n("div", pe, [
            n("div", ue, [
              n(
                "div",
                { class: "PosTextBox", style: d.dCSS, ref: "PosTextBox" },
                [
                  (t(!0),
                  i(
                    g,
                    null,
                    h(r.recoItem.detail, (e) =>
                      a(
                        (t(),
                        i(
                          "div",
                          {
                            class: "rotateBox",
                            contenteditable: r.contenteditable,
                            onBlur: (t) => p.textChange(t, e),
                            key: e.rect,
                            style: e.textCss + p.getRotateBoxColorStyle(),
                          },
                          [
                            n("div", fe, [
                              n(
                                "span",
                                {
                                  class: {
                                    errorTextColor:
                                      e.score < d.recThres && !e.textEdited,
                                    editedTextColor: e.textEdited,
                                  },
                                  innerHTML: p.getDisplayText(e),
                                },
                                null,
                                10,
                                ["innerHTML"],
                              ),
                            ]),
                          ],
                          44,
                          ["contenteditable", "onBlur"],
                        )),
                        [[o, e.score >= d.recThres || d.keepLowScore]],
                      ),
                    ),
                    128,
                  )),
                ],
                4,
              ),
            ]),
          ]),
        ],
        64,
      )
    );
  });
  (ge.render = _e), (ge.__scopeId = "data-v-78a912a2");
  var xe = null;
  const ve = {
      components: {
        IconButton: D,
        RotateText: ge,
        ExportPDF: u(() =>
          re(
            () => import("./ExportPDF.js"),
            [
              "./assets/ExportPDF.js",
              "./assets/ExportPDF.css",
              "./assets/vendor.js",
            ],
          ),
        ),
      },
      data: () => ({
        showType: "PosText",
        tableH: 348,
        textEdited: "",
        showViewer: !1,
        imageBG: !1,
        PosTextEditable: !1,
        recThres: 0.6,
        keepLowScore: !1,
        recLangCode: "",
      }),
      props: ["recoData", "loading"],
      created: function () {
        (xe = this),
          P.addMonitor(["recThres", "keepLowScore", "recLangCode"], xe);
      },
      beforeUpdate() {
        if (!xe.recoData.textEdited && xe.recoData.detail) {
          xe.recoData.textEdited = "";
          for (const e of xe.recoData.detail)
            e.score >= xe.recThres &&
              ((xe.recoData.textEdited += e.textEdited ? e.textEdited : e.text),
              (xe.recoData.textEdited += "\n"));
        }
      },
      watch: { recoData: { deep: !0, handler() {} } },
      methods: {
        getRowClass: ({ row: e, rowIndex: t }) =>
          xe.recThres > e.score
            ? xe.keepLowScore
              ? "error-row"
              : "error-row-hidden"
            : "",
        openPdfDialog() {
          I.get("ExportPDFInited")
            ? I.set("OpenExportPDFDialog", this.recoData)
            : p({
                showClose: !0,
                message: xe.$t("textbox.tips_loading_pdfmodule"),
                type: "warning",
              });
        },
        getPlaceholderText: () =>
          xe.recoData.url
            ? null == xe.recoData.text
              ? xe.$t("textbox.placeholder_wait_rec")
              : "" == xe.recoData.text
                ? xe.$t("textbox.placeholder_no_text")
                : void 0
            : xe.$t("textbox.placeholder"),
        isScaning: () => xe.recoData.isScaning,
        showPoxtextViewer() {
          (this.prevOverflow = document.body.style.overflow),
            (document.body.style.overflow = "hidden"),
            (this.showViewer = !0);
        },
        closePoxtextViewer() {
          (document.body.style.overflow = this.prevOverflow),
            (this.showViewer = !1);
        },
        setShowType(e) {
          xe.showType = e;
        },
        onTextCopy() {
          xe.recoData.textEdited &&
            "" != xe.recoData.textEdited &&
            navigator.clipboard
              .writeText(xe.recoData.textEdited)
              .then(() => {
                p({
                  showClose: !0,
                  duration: 1e3,
                  message: xe.$t("textbox.tips_copyed"),
                  type: "success",
                });
              })
              .catch(() => {
                p({
                  showClose: !0,
                  message: xe.$t("textbox.tips_copy_fail"),
                  type: "error",
                });
              });
        },
      },
    },
    be = l("data-v-125abdda");
  s("data-v-125abdda");
  const we = { key: 0, class: "recText placeholder" },
    Ce = { style: { "text-align": "left" } },
    ye = {
      key: 2,
      style: {
        "overflow-x": "hidden",
        "overflow-y": "hidden",
        position: "relative",
      },
      class: "recText recTextTable",
    },
    ke = { class: "ctrlBar" },
    Te = { class: "rowBar" },
    Le = { key: 2, class: "ButtonGroud" },
    Ie = { key: 0, class: "langtips_warining" };
  r();
  const De = be((l, s, r, c, h, p) => {
    const u = e("el-skeleton"),
      f = e("el-input"),
      _ = e("RotateText"),
      x = e("el-table-column"),
      v = e("el-table"),
      b = e("IconButton"),
      w = e("el-divider"),
      C = e("ExportPDF");
    return (
      t(),
      i(
        g,
        null,
        [
          a(
            n(
              u,
              { class: "boxTextImageLoading", rows: 6, animated: "" },
              null,
              512,
            ),
            [[o, p.isScaning()]],
          ),
          a(
            n(
              "div",
              {
                class: [
                  "boxTextImage",
                  {
                    recTextEdited:
                      "Text" == h.showType &&
                      r.recoData.textEdited != r.recoData.text,
                  },
                ],
              },
              [
                r.recoData.text
                  ? m("", !0)
                  : (t(),
                    i("div", we, [
                      n("div", Ce, [n("p", null, d(p.getPlaceholderText()), 1)]),
                    ])),
                "PureText" == h.showType && r.recoData.text
                  ? (t(),
                    i(
                      f,
                      {
                        key: 1,
                        ref: "recoTextarea",
                        class: "recText",
                        type: "textarea",
                        rows: 22,
                        placeholder: l.$t("textbox.placeholder"),
                        resize: "none",
                        modelValue: r.recoData.textEdited,
                        "onUpdate:modelValue":
                          s[1] || (s[1] = (e) => (r.recoData.textEdited = e)),
                      },
                      null,
                      8,
                      ["placeholder", "modelValue"],
                    ))
                  : m("", !0),
                "PosText" == h.showType && r.recoData.text
                  ? (t(),
                    i("div", ye, [
                      null != r.recoData.detail
                        ? (t(),
                          i(
                            _,
                            {
                              key: 0,
                              ref: "posText",
                              imageBG: h.imageBG,
                              recoItem: r.recoData,
                              contenteditable: h.PosTextEditable,
                              onOnExitFullScreen:
                                s[2] || (s[2] = (e) => p.closePoxtextViewer()),
                              fullScreen: h.showViewer,
                            },
                            null,
                            8,
                            [
                              "imageBG",
                              "recoItem",
                              "contenteditable",
                              "fullScreen",
                            ],
                          ))
                        : m("", !0),
                    ]))
                  : m("", !0),
                "TableText" == h.showType && r.recoData.text
                  ? (t(),
                    i(
                      v,
                      {
                        key: 3,
                        data: r.recoData.detail,
                        height: "tableH",
                        border: "",
                        class: "recText recTextTable",
                        "row-class-name": p.getRowClass,
                      },
                      {
                        default: be(() => [
                          n(
                            x,
                            {
                              sortable: "",
                              prop: "score",
                              label: l.$t("textbox.confidence"),
                              width: "180",
                            },
                            null,
                            8,
                            ["label"],
                          ),
                          n(
                            x,
                            { prop: "text", label: l.$t("textbox.text") },
                            null,
                            8,
                            ["label"],
                          ),
                        ]),
                        _: 1,
                      },
                      8,
                      ["data", "row-class-name"],
                    ))
                  : m("", !0),
                a(
                  n(
                    "div",
                    ke,
                    [
                      n("div", Te, [
                        n("div", null, [
                          n(
                            b,
                            {
                              tips: l.$t("textbox.text_with_pox"),
                              selected: "PosText" == h.showType,
                              iconClass: "iconfont icon-postext",
                              onClick:
                                s[3] || (s[3] = (e) => p.setShowType("PosText")),
                            },
                            null,
                            8,
                            ["tips", "selected"],
                          ),
                          n(
                            b,
                            {
                              tips: l.$t("textbox.puretext"),
                              selected: "PureText" == h.showType,
                              iconClass: "el-icon-document",
                              onClick:
                                s[4] || (s[4] = (e) => p.setShowType("PureText")),
                            },
                            null,
                            8,
                            ["tips", "selected"],
                          ),
                          n(
                            b,
                            {
                              tips: l.$t("textbox.text_with_table"),
                              selected: "TableText" == h.showType,
                              iconClass: "iconfont icon-table",
                              onClick:
                                s[5] ||
                                (s[5] = (e) => p.setShowType("TableText")),
                            },
                            null,
                            8,
                            ["tips", "selected"],
                          ),
                        ]),
                        n(w, { direction: "vertical" }),
                        "PosText" == h.showType
                          ? (t(),
                            i(
                              b,
                              {
                                key: 0,
                                tips: l.$t("textbox.zoom_text"),
                                iconClass: "iconfont icon-fullscreen",
                                onClick: p.showPoxtextViewer,
                              },
                              null,
                              8,
                              ["tips", "onClick"],
                            ))
                          : m("", !0),
                        "PureText" == h.showType && r.recoData.textEdited
                          ? (t(),
                            i(
                              b,
                              {
                                key: 1,
                                tips: l.$t("textbox.copy_text"),
                                iconClass: "el-icon-document-copy",
                                onClick: p.onTextCopy,
                              },
                              null,
                              8,
                              ["tips", "onClick"],
                            ))
                          : m("", !0),
                        "PosText" == h.showType
                          ? (t(),
                            i("div", Le, [
                              n(
                                b,
                                {
                                  selected: h.PosTextEditable,
                                  tips: l.$t("textbox.open_close_editmode"),
                                  iconClass: "iconfont icon-edit",
                                  onClick:
                                    s[6] ||
                                    (s[6] = (e) =>
                                      (h.PosTextEditable = !h.PosTextEditable)),
                                },
                                null,
                                8,
                                ["selected", "tips"],
                              ),
                              n(
                                b,
                                {
                                  tips: l.$t("textbox.export_as_pdf"),
                                  iconClass: "iconfont icon-pdf",
                                  onClick: p.openPdfDialog,
                                },
                                null,
                                8,
                                ["tips", "onClick"],
                              ),
                              n(
                                b,
                                {
                                  selected: h.imageBG,
                                  tips: l.$t("textbox.image_behind_text"),
                                  iconClass: "iconfont icon-imgtxt",
                                  onClick:
                                    s[7] ||
                                    (s[7] = () => {
                                      h.imageBG = !h.imageBG;
                                    }),
                                },
                                null,
                                8,
                                ["selected", "tips"],
                              ),
                            ]))
                          : m("", !0),
                        "PureText" == h.showType &&
                        r.recoData.textEdited != r.recoData.text
                          ? (t(),
                            i(
                              b,
                              {
                                key: 3,
                                tips: l.$t("textbox.undo_text_changes"),
                                iconClass: "iconfont icon-revert",
                                onClick:
                                  s[8] ||
                                  (s[8] = (e) =>
                                    (r.recoData.textEdited = r.recoData.text)),
                              },
                              null,
                              8,
                              ["tips"],
                            ))
                          : m("", !0),
                      ]),
                      n("div", null, [
                        r.recoData.detail &&
                        h.recLangCode != r.recoData.detail.langCode
                          ? (t(),
                            i(
                              "span",
                              Ie,
                              d(l.$t("langname." + r.recoData.detail.langCode)),
                              1,
                            ))
                          : m("", !0),
                      ]),
                    ],
                    512,
                  ),
                  [[o, r.recoData.text]],
                ),
              ],
              2,
            ),
            [[o, !p.isScaning()]],
          ),
          n(C),
        ],
        64,
      )
    );
  });
  (ve.render = De), (ve.__scopeId = "data-v-125abdda");
  let Se = "";
  var $e = null;
  const Pe = {
      data: () => ({
        showViewer: !1,
        isDrawBox: !1,
        viewUrl: "",
        recThres: 0.6,
        keepLowScore: !1,
      }),
      created: function () {
        ($e = this),
          P.addMonitor("recThres", (e) => {
            ($e.recThres = e), $e.drawImage();
          }),
          P.addMonitor("keepLowScore", (e) => {
            ($e.keepLowScore = e), $e.drawImage();
          });
      },
      components: { IconButton: D },
      props: ["loading", "recItem"],
      methods: {
        onReRec() {
          I.trig("ReRecCurRequest");
        },
        isScaning: () => $e.recItem && $e.recItem.isScaning,
        setViewer(e) {
          (Se = document.body.style.overflow),
            (document.body.style.overflow = "hidden"),
            this.isDrawBox
              ? (this.viewUrl = this.$refs.mainCanvas.toDataURL("image/png"))
              : (this.viewUrl = this.recItem.url),
            (this.showViewer = e);
        },
        closeViewer() {
          (document.body.style.overflow = Se), (this.showViewer = !1);
        },
        drawImage() {
          if ($e.img && $e.imgCtx) {
            var e = $e.$refs.mainCanvas,
              t = $e.img,
              i = $e.imgCtx;
            if (
              ((e.width = t.width),
              (e.height = t.height),
              i.drawImage(t, 0, 0),
              $e.recItem.detail && $e.isDrawBox)
            ) {
              i.lineWidth = 2;
              for (const e of $e.recItem.detail)
                if (!(e.score < $e.recThres) || $e.keepLowScore) {
                  var a = e.rect;
                  i.beginPath(),
                    i.moveTo(a[0].x, a[0].y),
                    i.lineTo(a[1].x, a[1].y),
                    i.lineTo(a[2].x, a[2].y),
                    i.lineTo(a[3].x, a[3].y),
                    i.lineTo(a[0].x, a[0].y),
                    i.closePath(),
                    (i.strokeStyle =
                      e.score < $e.recThres ? "#ff0000" : "#00ff00"),
                    i.stroke();
                }
            }
          }
        },
      },
      watch: {
        recItem: {
          deep: !0,
          handler: function (e, t) {
            if (e) {
              var i = this.$refs.mainCanvas;
              $e.lasturl != e.url &&
                (($e.lasturl = e.url),
                ($e.imgCtx = i.getContext("2d")),
                ($e.img = new Image()),
                ($e.img.onload = function () {
                  $e.drawImage();
                }),
                ($e.img.src = e.url));
            }
          },
        },
      },
    },
    Be = l("data-v-f17411da");
  s("data-v-f17411da");
  const Re = { class: "boxTextImage" },
    Ee = { ref: "mainCanvas", class: "ImagePreview" },
    Ve = { key: 0, class: "ImagePreview placeholder" },
    ze = { style: { "text-align": "left" } },
    He = { style: { "text-align": "left" } };
  r();
  const Fe = Be((l, s, r, c, g, h) => {
    const p = e("el-image-viewer"),
      u = e("IconButton");
    return (
      t(),
      i("div", Re, [
        a(
          n(
            "div",
            { class: ["ImagePreviewDiv", { scanBox: h.isScaning() }] },
            [n("canvas", Ee, null, 512)],
            2,
          ),
          [[o, r.recItem.url]],
        ),
        r.recItem.url
          ? m("", !0)
          : (t(),
            i("div", Ve, [
              n("div", ze, [
                n("p", null, d(l.$t("imagebox.image_placeholder")), 1),
              ]),
            ])),
        g.showViewer
          ? (t(),
            i(
              p,
              { key: 1, onClose: h.closeViewer, "url-list": [g.viewUrl] },
              null,
              8,
              ["onClose", "url-list"],
            ))
          : m("", !0),
        a(
          n(
            "div",
            He,
            [
              n(
                u,
                {
                  tips: l.$t("imagebox.btn_big_image_tips"),
                  iconClass: "iconfont icon-fullscreen",
                  onClick: s[1] || (s[1] = (e) => h.setViewer(!0)),
                },
                null,
                8,
                ["tips"],
              ),
              n(
                u,
                {
                  tips: l.$t("imagebox.btn_text_pos_tips"),
                  iconClass: "iconfont icon-lineBox",
                  selected: g.isDrawBox,
                  visible: !r.recItem.isScaning,
                  onClick:
                    s[2] ||
                    (s[2] = (e) => {
                      (g.isDrawBox = !g.isDrawBox), h.drawImage();
                    }),
                },
                null,
                8,
                ["tips", "selected", "visible"],
              ),
              n(
                u,
                {
                  tips: l.$t("imagebox.btn_rerec_current"),
                  iconClass: "el-icon-refresh-left",
                  visible: !r.recItem.isScaning,
                  onClick:
                    s[3] ||
                    (s[3] = (e) => {
                      h.onReRec();
                    }),
                },
                null,
                8,
                ["tips", "visible"],
              ),
            ],
            512,
          ),
          [[o, r.recItem.url]],
        ),
      ])
    );
  });
  (Pe.render = Fe), (Pe.__scopeId = "data-v-f17411da");
  let Ae = null;
  const We = {
      components: { ImageList: J, TextBox: ve, ImageBox: Pe },
      data: () => ({
        dialogVisible: !1,
        recoData: {},
        uploadHover: 0,
        mainRowHeight: "380",
        clientHeight: 0,
      }),
      mounted: function () {
        Ae = this;
        let e = document.getElementById("drop_area"),
          t = document.getElementById("drop_mask");
        t.addEventListener("drop", this.enentDrop, !1);
        var i = function (e) {
            e.stopPropagation(), e.preventDefault(), (Ae.uploadHover -= 1);
          },
          a = function (e) {
            e.stopPropagation(), e.preventDefault(), (Ae.uploadHover += 1);
          },
          o = function (e) {
            e.stopPropagation(), e.preventDefault();
          };
        t.addEventListener("dragleave", i),
          e.addEventListener("dragleave", i),
          t.addEventListener("dragenter", a),
          e.addEventListener("dragenter", a),
          e.addEventListener("dragover", o),
          t.addEventListener("dragover", o),
          (Ae.clientHeight = document.documentElement.clientHeight),
          (window.onresize = () => {
            Ae.clientHeight = document.documentElement.clientHeight;
          }),
          Ae.calcMainRowHeight();
      },
      methods: {
        enentDrop(e) {
          (this.uploadHover = !1), e.stopPropagation(), e.preventDefault();
          let t = e.dataTransfer.files;
          Ae.$refs.ImageList.addImgPreview(t);
        },
        calcMainRowHeight() {
          let e = 0.6 * Ae.clientHeight;
          (e = Math.max(e, 380)), (this.mainRowHeight = e.toString());
        },
        onCurrentItemChange(e) {
          this.recoData = e;
        },
        clearRecognitionImage() {
          this.recoData = {};
        },
      },
      watch: {
        clientHeight(e) {
          this.timer ||
            ((this.timer = !0),
            setTimeout(function () {
              Ae.calcMainRowHeight(), (this.timer = !1);
            }, 400));
        },
      },
    },
    Oe = l("data-v-6fb645f5");
  s("data-v-6fb645f5");
  const Me = { id: "drop_area", style: { position: "relative" } },
    Ue = { id: "drop_mask", class: "drop_mask" },
    Ne = { class: "drop_mask-spinner" },
    je = n("i", { class: "el-icon-upload2 drop_mask-icon" }, null, -1),
    Ge = { class: "drop_mask-text" };
  r();
  const Qe = Oe((l, s, r, c, g, h) => {
    const m = e("ImageBox"),
      p = e("el-col"),
      u = e("TextBox"),
      f = e("el-row"),
      _ = e("ImageList");
    return (
      t(),
      i("div", Me, [
        n(
          f,
          {
            type: "flex",
            justify: "center",
            ref: "mainRow",
            style: "height:" + g.mainRowHeight + "px",
          },
          {
            default: Oe(() => [
              n(
                p,
                { class: "rightAlign", span: 12 },
                {
                  default: Oe(() => [
                    n(
                      m,
                      { recItem: g.recoData, style: { height: "100%" } },
                      null,
                      8,
                      ["recItem"],
                    ),
                  ]),
                  _: 1,
                },
              ),
              n(
                p,
                { class: "leftAlign", span: 12 },
                {
                  default: Oe(() => [
                    n(u, { recoData: g.recoData }, null, 8, ["recoData"]),
                  ]),
                  _: 1,
                },
              ),
            ]),
            _: 1,
          },
          8,
          ["style"],
        ),
        n(
          _,
          {
            ref: "ImageList",
            onCurrentItemChange: h.onCurrentItemChange,
            onClearRecognitionImage: h.clearRecognitionImage,
          },
          null,
          8,
          ["onCurrentItemChange", "onClearRecognitionImage"],
        ),
        a(
          n(
            "div",
            Ue,
            [n("div", Ne, [je, n("p", Ge, d(l.$t("mainpage.drop_tips")), 1)])],
            512,
          ),
          [[o, g.uploadHover]],
        ),
      ])
    );
  });
  (We.render = Qe), (We.__scopeId = "data-v-6fb645f5");
  let Xe;
  const qe = {
      data: () => ({
        curLang: "简体中文",
        langList: [{ name: "简体中文", code: "zh" }],
        navLangTips: void 0,
        navLangTipsShow: !1,
        navLang: "",
      }),
      created() {},
      mounted() {
        Xe = this;
        let e = this.$root.$i18n.locale;
        this.navLang = navigator.language || navigator.userLanguage;
        let t = { "zh-CN": "zh", "zh-TW": "zh-tw", "zh-HK": "zh-tw" };
        if (
          (t[this.navLang] && (this.navLang = t[this.navLang]),
          console.log("this.navLang ", this.navLang),
          null == P.get("uiLangCode") &&
            this.$root.$i18n.messages[this.navLang] &&
            this.navLang != e)
        ) {
          let e = this.$root.$i18n.messages[this.navLang].multilanguage;
          e &&
            e.navLangeTips &&
            (this.navLangTips =
              this.$root.$i18n.messages[this.navLang].multilanguage.navLangeTips),
            this.navLangTips || (this.navLangTips = "undefined"),
            setTimeout(function () {
              Xe.navLangTipsShow = !0;
            }, 1e3),
            setTimeout(function () {
              Xe.navLangTipsShow = !1;
            }, 5e3);
        }
      },
      methods: {
        onLangChange(e) {
          e != this.$root.$i18n.locale &&
            (P.set("uiLangCode", e),
            P.save(),
            (window.location.href = e + ".html"));
        },
        changeToNavLang() {
          this.onLangChange(this.navLang);
        },
      },
    },
    Ze = l("data-v-488daa10");
  s("data-v-488daa10");
  const Je = { class: "nav-item" },
    Ye = { class: "el-dropdown-link iconColor" },
    Ke = n("i", { class: "iconfont icon-a-language1x" }, null, -1),
    et = n("i", { class: "el-icon-arrow-down el-icon--right" }, null, -1);
  r();
  const tt = Ze((a, o, l, s, r, m) => {
    const p = e("el-dropdown-item"),
      u = e("el-dropdown-menu"),
      f = e("el-dropdown"),
      _ = e("el-popconfirm");
    return (
      t(),
      i(
        _,
        {
          title: r.navLangTips,
          trigger: "manual",
          visible: r.navLangTipsShow,
          "onUpdate:visible": o[1] || (o[1] = (e) => (r.navLangTipsShow = e)),
          onConfirm: m.changeToNavLang,
          onCancel: o[2] || (o[2] = (e) => (r.navLangTipsShow = !1)),
        },
        {
          reference: Ze(() => [
            n("div", Je, [
              n(
                f,
                { trigger: "click", onCommand: m.onLangChange },
                {
                  dropdown: Ze(() => [
                    n(u, null, {
                      default: Ze(() => [
                        (t(!0),
                        i(
                          g,
                          null,
                          h(
                            r.langList,
                            (e) => (
                              t(),
                              i(
                                p,
                                {
                                  key: e.name,
                                  command: e.code,
                                  class: { highlight: r.navLang == e.code },
                                },
                                { default: Ze(() => [c(d(e.name), 1)]), _: 2 },
                                1032,
                                ["command", "class"],
                              )
                            ),
                          ),
                          128,
                        )),
                      ]),
                      _: 1,
                    }),
                  ]),
                  default: Ze(() => [
                    n("span", Ye, [
                      Ke,
                      c(
                        " " + d(a.$t("langname." + a.$root.$i18n.locale)) + " ",
                        1,
                      ),
                      et,
                    ]),
                  ]),
                  _: 1,
                },
                8,
                ["onCommand"],
              ),
            ]),
          ]),
          _: 1,
        },
        8,
        ["title", "visible", "onConfirm"],
      )
    );
  });
  (qe.render = tt), (qe.__scopeId = "data-v-488daa10");
  var it = {
    data: () => ({ imgUrl: "./assets/logo.png", activeIndex: "0" }),
    components: { Multilanguage: qe },
    methods: { handleSelect() {} },
  };
  s("data-v-0227e5f8");
  r();
  const pt = {
      name: "Highlights",
      data: () => ({
        HighPoints: [
          {
            id: 1,
            icon: "icon-free",
            title: "highlights.free",
            content: "highlights.free_content",
          },
          {
            id: 2,
            icon: "icon-safe",
            title: "highlights.safe",
            content: "highlights.safe_content",
          },
          {
            id: 3,
            icon: "icon-AI",
            title: "highlights.ai",
            content: "highlights.ai_content",
          },
          {
            id: 4,
            icon: "icon-smile",
            title: "highlights.easytouse",
            content: "highlights.easytouse_content",
          },
        ],
      }),
    },
    ut = l("data-v-0eb7cb56");
  s("data-v-0eb7cb56");
  const ft = { class: "HighlightsDiv rowCard" },
    _t = { class: "marginSize" },
    xt = { class: "marginSize" };
  r();
  const vt = ut((a, o, l, s, r, c) => {
    const m = e("el-main");
    return (
      t(),
      i(
        m,
        { class: "el-main_add" },
        {
          default: ut(() => [
            n("div", ft, [
              (t(!0),
              i(
                g,
                null,
                h(
                  r.HighPoints,
                  (e) => (
                    t(),
                    i("div", { class: "ShowItem", key: e.id }, [
                      n("i", { class: ["iconfont iconshow", e.icon] }, null, 2),
                    //   n("h2", _t, d(a.$t(e.title)), 1),
                      n("p", xt, d(a.$t(e.content)), 1),
                    ])
                  ),
                ),
                128,
              )),
            ]),
          ]),
          _: 1,
        },
      )
    );
  });
  (pt.render = vt), (pt.__scopeId = "data-v-0eb7cb56");
  const bt = {
      components: { IconButton: D },
      methods: {
        openTelegram() {
          (this.pdfConfig.action = "SaveToFile"),
            PDFRender.render([this.recoItem], this.pdfConfig);
        },
      },
    },
    wt = l("data-v-04b671a0");
  s("data-v-04b671a0");
  
  r();
  let kt;
  const Tt = {
      data: () => ({ dialogVisible: !0, loadPercentage: 0, langname: "" }),
      mounted() {
        (L.onprogress = function (e, t) {
          kt.loadPercentage = Math.round((e / t) * 100);
        }),
          (L.onRuntimeInitialized = function () {
            L.setLang(P.get("recLangCode"));
          }),
          (L.onSetLangFinish = function () {
            I.set("AntOcrInited", !0),
              (kt.dialogVisible = !1),
              P.set("recLangCode", L.langCode),
              P.save();
          }),
          (L.onSetLangBegin = function (e) {
            (kt.dialogVisible = !0),
              (kt.loadPercentage = 0),
              (kt.langname = kt.$t("langname." + e));
          }),
          L.init();
      },
      created() {
        kt = this;
      },
      methods: {},
    },
    Lt = l("data-v-37a6707e");
  s("data-v-37a6707e");
  const It = { class: "mainDiv" };
  r();
  const Dt = Lt((a, o, l, s, r, c) => {
    const g = e("el-progress"),
      h = e("el-dialog");
    return (
      t(),
      i(
        h,
        {
          title: a.$t("LoadingDialog.loading_tips") + r.langname,
          "model-value": r.dialogVisible,
          "onUpdate:modelValue":
            o[1] ||
            (o[1] = (e) => {
              (r.dialogVisible = e),
                a.$emit("update:dialogVisible", r.dialogVisible);
            }),
          "close-on-click-modal": !1,
          "close-on-press-escape": !1,
          "show-close": !1,
          "destroy-on-close": !0,
        },
        {
          default: Lt(() => [
            n("div", It, [
              n(g, { type: "circle", percentage: r.loadPercentage }, null, 8, [
                "percentage",
              ]),
              n("span", null, d(a.$t("LoadingDialog.network_tips")), 1),
            ]),
          ]),
          _: 1,
        },
        8,
        ["title", "model-value"],
      )
    );
  });
  (Tt.render = Dt), (Tt.__scopeId = "data-v-37a6707e");
  var St = f({
    name: "App",
    components: {
      RecoMain: We,
      AntOcrHeader: it,
      Highlights: pt,
      Footer: bt,
      LoadingDialog: Tt,
    },
    created() {
      let e = window.location.pathname.replace("/", "");
      "" == e && (e = P.get("uiLangCode")),
        null == e || (this.$root.$i18n.locale = e.replace(".html", ""));
    },
  });
  const $t = l("data-v-b8650394");
  s("data-v-b8650394");
  const Pt = { class: "wholeLimit" };
  r();
  const Bt = $t((a, o, l, s, r, c) => {
    const d = e("AntOcrHeader"),
      h = e("RecoMain"),
      m = e("el-main"),
      p = e("LoadingDialog"),
      u = e("Highlights"),
      f = e("Footer"),
      _ = e("el-container");
    return (
      t(),
      i(
        g,
        null,
        [
          n(d),
          n("div", Pt, [
            n(
              _,
              { class: "wholeBox" },
              {
                default: $t(() => [
                  n(m, null, { default: $t(() => [n(h)]), _: 1 }),
                  n(p),
                  n(u),
                  n(f),
                ]),
                _: 1,
              },
            ),
          ]),
        ],
        64,
      )
    );
  });
  (St.render = Bt), (St.__scopeId = "data-v-b8650394");
  const Rt = _({
      locale: "zh",
      fallbackLocale: "zh",
      missing: (e, t, i) => {
        // console.warn(`detect'${t}'key missing in'${e}'`);
      },
      messages: {
        zh: {
          message: {
            title: {
              websize: "在线图片转文字，免费OCR，在线图片文字提取，PearOCR",
              long: "PearOCR文字识别",
              short: "PearOCR",
            },
          },
          navi: { document: "使用文档", feedback: "反馈意见" },
          configure: {
            title: "PearOCR配置",
            highlight_suspected_error: "高亮疑似错误",
            judgment_threshold: "判断阈值",
            confidence_threshold: "置信度阈值",
            keep_highlight: "保留高亮显示",
            text_background_color: "文本背景色",
            no_background: "不显示背景",
            text_color: "文本颜色",
            restore_default: "恢复默认",
            cancel: "取 消",
            save: "保存设置",
          },
          highlights: {
            free: "免费",
            free_content: "完全免费，没有任何次数限制，可以无限次使用",
            safe: "安全",
            safe_content: "全部数据本地运算，所有图片均不会被上传",
            ai: "智能",
            ai_content: "基于深度学习训练得到的模型，拥有强大的识别能力",
            easytouse: "易用",
            easytouse_content:
              "支持本地图片，或者直接读取剪切板而不需要先把图片存为文件",
          },
          imagebox: {
            image_placeholder: "拖动图像文件到此处",
            btn_big_image_tips: "大图预览",
            btn_text_pos_tips: "显示文本位置",
            btn_rerec_current: "重新识别当前图像",
          },
          imagelist: {
            btn_locate_image: "本地图片",
            btn_read_clipboard: "读剪贴板",
            recognition_language: "识别语言",
            recognition_progress: "识别进度",
            delete_all_image: "删除所有图片",
            configure: "设置",
            tips_rec_conflict: "已有识别任务正在进行，请等待识别完成再操作",
            tips_read_fail: "读取失败：错误的文件类型",
            tips_delete_confirm: "删除所有图像和识别结果, 是否继续?",
            tips_rerec_confirm: "重新识别将删除现有的识别结果, 是否继续?",
            delete_confirm: "删除确认",
            tips_delete_success: "删除成功",
            tips_delete_conflict: "不能删除正在识别的图像，请等待识别完成再删除",
            tips_delete_cancel: "已取消删除",
            tips_clipboard_no_image: "没有检测到剪贴板内的图像",
            tips_clipboard_firefox_only_hotkey: "Firefox浏览器只能使用粘贴键",
            tips_clipboard_faild:
              "读取剪贴板失败，请确认是否开放剪贴权限或剪贴板没有图像数据。",
            export_all_as_pdf: "导出所有图像到PDF",
            refresh_all_image: "重新识别所有图像",
          },
          mainpage: { drop_tips: "文件拖放到此处进行识别" },
          pdfconfig: {
            title: "导出PDF",
            filename: "文件名",
            export_data: "导出数据",
            only_text: "只导出文字",
            text_and_image: "导出文字和图像",
            image_position: "文字位置",
            text_on_image: "文字显示在图像上方",
            text_invisible: "文字不可见",
            with_original_picture: "附带原图",
            without_original_picture: "不附带原图",
            image_attached_on_next_page: "原图附在下一页",
            image_attached_on_last_page: "原图附在最后",
            return_config: "返回设置",
            preview_pdf: "预览PDF",
            export_pdf: "导出PDF",
          },
          common: { optConfirm: "操作确认", confirm: "确认", cancel: "取 消" },
          langname: { zh: "简体中文" },
          textbox: {
            placeholder: "识别结果在此显示",
            confidence: "置信度",
            text: "文本",
            text_with_pox: "带位置信息的文体",
            puretext: "纯文本方式显示",
            text_with_table: "以表格方式显示",
            zoom_text: "放大显示",
            copy_text: "复制当前文本",
            open_close_editmode: "开启/关闭编辑模式",
            export_as_pdf: "导出为PDF",
            image_behind_text: "在文本底下显示图像",
            undo_text_changes: "撤销文本修改",
            tips_loading_pdfmodule:
              "PDF模块尚未加载完成，请等待完成后再试，第一次加载可能比较慢",
            placeholder_wait_rec: "等待识别",
            placeholder_no_text: "未识别到文本",
            tips_copyed: "复制成功",
            tips_copy_fail: "复制失败，请确认是否开放剪贴板权限。",
          },
          multilanguage: { navLangeTips: "是否切换到简体中文？" },
          LoadingDialog: {
            loading_tips: "正在加载识别程序：",
            network_tips: "如果进度条长时间无变化，请检查网络设置",
          },
        },
      },
    }),
    Et = x(St);
  Et.use(v), Et.use(Rt), Et.mount("#app");
  export { re as _, I as e };
  