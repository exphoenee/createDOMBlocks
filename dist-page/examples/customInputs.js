/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./documentation/page-components/createFooter.ts"
/*!*******************************************************!*\
  !*** ./documentation/page-components/createFooter.ts ***!
  \*******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createFooter: () => (/* binding */ createFooter)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");

function createFooter(params = {}) {
    const year = new Date().getFullYear();
    const copyright = params.copyright || `\u00A9 2022\u2013${year} Viktor Bozzay. MIT License.`;
    const footer = (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "footer",
        attrs: { class: "site-footer" },
        children: [
            {
                tag: "div",
                attrs: { class: "footer-inner" },
                children: [
                    {
                        tag: "div",
                        attrs: { class: "footer-left" },
                        children: [
                            {
                                tag: "span",
                                text: copyright,
                                attrs: { class: "footer-copyright" },
                            },
                        ],
                    },
                    {
                        tag: "div",
                        attrs: { class: "footer-right" },
                        children: [
                            {
                                tag: "a",
                                text: "Meet the Creator \u2192",
                                attrs: {
                                    href: "https://viktor.bozzay.online",
                                    target: "_blank",
                                    class: "footer-creator-btn",
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    });
    const portals = document.querySelectorAll(".drawer-overlay, .drawer-sidebar, .modal-portal");
    const lastPortal = portals.length > 0 ? portals[portals.length - 1] : null;
    if (lastPortal) {
        document.body.insertBefore(footer, lastPortal);
    }
    else {
        document.body.appendChild(footer);
    }
    return footer;
}


/***/ },

/***/ "./documentation/page-components/createHeader.ts"
/*!*******************************************************!*\
  !*** ./documentation/page-components/createHeader.ts ***!
  \*******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createHeader: () => (/* binding */ createHeader)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");

function createHeader(params = {}) {
    const header = (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "header",
        attrs: { class: "site-header" },
        children: [
            {
                tag: "div",
                attrs: { class: "header-inner" },
                children: [
                    {
                        tag: "div",
                        attrs: { class: "header-left" },
                        children: [
                            {
                                tag: "button",
                                text: "\u2630",
                                attrs: { class: "header-menu-btn", "aria-label": "Menu" },
                                handleEvent: params.onMenuClick
                                    ? { event: "click", cb: params.onMenuClick }
                                    : undefined,
                            },
                            {
                                tag: "a",
                                text: params.title || "createDOMBlocks",
                                attrs: { href: "index.html", class: "header-logo" },
                            },
                        ],
                    },
                    {
                        tag: "div",
                        attrs: { class: "header-right" },
                        children: [
                            {
                                tag: "a",
                                text: "GitHub",
                                attrs: {
                                    href: "https://github.com/exphoenee/createDOMBlocks",
                                    target: "_blank",
                                    class: "header-link",
                                },
                            },
                            {
                                tag: "a",
                                text: "v2.1.0",
                                attrs: { class: "header-version" },
                            },
                        ],
                    },
                ],
            },
        ],
    });
    document.body.insertBefore(header, document.body.firstChild);
    return header;
}


/***/ },

/***/ "./documentation/page-components/createPageLoading.ts"
/*!************************************************************!*\
  !*** ./documentation/page-components/createPageLoading.ts ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPageLoading: () => (/* binding */ createPageLoading)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");

function createPageLoading() {
    const overlay = (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "div",
        attrs: { class: "page-loading" },
        children: [
            {
                tag: "div",
                attrs: { class: "page-loading-spinner" },
            },
        ],
    });
    document.body.appendChild(overlay);
    return () => {
        overlay.classList.add("fade-out");
        overlay.addEventListener("transitionend", () => overlay.remove());
    };
}


/***/ },

/***/ "./documentation/page-components/index.ts"
/*!************************************************!*\
  !*** ./documentation/page-components/index.ts ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addFooter: () => (/* reexport safe */ _initPage__WEBPACK_IMPORTED_MODULE_4__.addFooter),
/* harmony export */   closeDrawer: () => (/* reexport safe */ _src_components_createDrawer__WEBPACK_IMPORTED_MODULE_0__.closeDrawer),
/* harmony export */   createDrawer: () => (/* reexport safe */ _src_components_createDrawer__WEBPACK_IMPORTED_MODULE_0__.createDrawer),
/* harmony export */   createFooter: () => (/* reexport safe */ _createFooter__WEBPACK_IMPORTED_MODULE_2__.createFooter),
/* harmony export */   createHeader: () => (/* reexport safe */ _createHeader__WEBPACK_IMPORTED_MODULE_1__.createHeader),
/* harmony export */   createPageLoading: () => (/* reexport safe */ _createPageLoading__WEBPACK_IMPORTED_MODULE_5__.createPageLoading),
/* harmony export */   getDrawerMenuItems: () => (/* reexport safe */ _menuItems__WEBPACK_IMPORTED_MODULE_3__.getDrawerMenuItems),
/* harmony export */   initDocPage: () => (/* reexport safe */ _initPage__WEBPACK_IMPORTED_MODULE_4__.initDocPage),
/* harmony export */   openDrawer: () => (/* reexport safe */ _src_components_createDrawer__WEBPACK_IMPORTED_MODULE_0__.openDrawer),
/* harmony export */   renderSections: () => (/* reexport safe */ _initPage__WEBPACK_IMPORTED_MODULE_4__.renderSections)
/* harmony export */ });
/* harmony import */ var _src_components_createDrawer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/components/createDrawer */ "./src/components/createDrawer.ts");
/* harmony import */ var _createHeader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./createHeader */ "./documentation/page-components/createHeader.ts");
/* harmony import */ var _createFooter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./createFooter */ "./documentation/page-components/createFooter.ts");
/* harmony import */ var _menuItems__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./menuItems */ "./documentation/page-components/menuItems.ts");
/* harmony import */ var _initPage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./initPage */ "./documentation/page-components/initPage.ts");
/* harmony import */ var _createPageLoading__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./createPageLoading */ "./documentation/page-components/createPageLoading.ts");








/***/ },

/***/ "./documentation/page-components/initPage.ts"
/*!***************************************************!*\
  !*** ./documentation/page-components/initPage.ts ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addFooter: () => (/* binding */ addFooter),
/* harmony export */   initDocPage: () => (/* binding */ initDocPage),
/* harmony export */   renderSections: () => (/* binding */ renderSections)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");
/* harmony import */ var _src_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/index */ "./src/index.ts");
/* harmony import */ var _createHeader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./createHeader */ "./documentation/page-components/createHeader.ts");
/* harmony import */ var _createFooter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./createFooter */ "./documentation/page-components/createFooter.ts");
/* harmony import */ var _menuItems__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./menuItems */ "./documentation/page-components/menuItems.ts");
/* harmony import */ var _src_components_highlighter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../src/components/highlighter */ "./src/components/highlighter.ts");
/* harmony import */ var _createPageLoading__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./createPageLoading */ "./documentation/page-components/createPageLoading.ts");







function createCodeBlockHTML(code, lang) {
    const highlighted = (0,_src_components_highlighter__WEBPACK_IMPORTED_MODULE_5__.highlightCode)(code, lang);
    return {
        tag: "div",
        attrs: { class: "code-block" },
        children: [
            ...(lang
                ? [{ tag: "div", text: lang.toUpperCase(), attrs: { class: "code-language" } }]
                : []),
            {
                tag: "pre",
                attrs: { class: "code-pre" },
                children: [
                    { tag: "code", content: highlighted, attrs: { class: `code-content language-${lang || ""}` } },
                ],
            },
        ],
    };
}
function initDocPage() {
    const done = (0,_createPageLoading__WEBPACK_IMPORTED_MODULE_6__.createPageLoading)();
    const items = (0,_menuItems__WEBPACK_IMPORTED_MODULE_4__.getDrawerMenuItems)();
    (0,_src_index__WEBPACK_IMPORTED_MODULE_1__.createDrawer)({
        id: "sidebar-drawer",
        title: "createDOMBlocks",
        children: [(0,_src_index__WEBPACK_IMPORTED_MODULE_1__.createMenu)({ id: "sidebar-drawer", items })],
        defaultState: "open",
        hasOverlay: false,
        mode: "push",
    });
    (0,_createHeader__WEBPACK_IMPORTED_MODULE_2__.createHeader)({ onMenuClick: () => (0,_src_index__WEBPACK_IMPORTED_MODULE_1__.openDrawer)() });
    (0,_createFooter__WEBPACK_IMPORTED_MODULE_3__.createFooter)();
    return done;
}
function addFooter() {
    return (0,_createFooter__WEBPACK_IMPORTED_MODULE_3__.createFooter)();
}
function renderSections(sections) {
    const main = document.querySelector(".page-content");
    if (!main)
        return;
    for (const section of sections) {
        const resultId = `result-${Math.random().toString(36).slice(2, 8)}`;
        const sectionEl = (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
            tag: "section",
            attrs: { class: "doc-section" },
            children: [
                (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({ tag: "h2", text: section.title, attrs: { class: "doc-section-title" } }),
                (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({ tag: "p", text: section.description, attrs: { class: "doc-section-desc" } }),
                createCodeBlockHTML(section.code, section.codeLang),
                (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({ tag: "div", text: "Eredm\u00E9ny:", attrs: { class: "doc-result-label" } }),
                (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({ tag: "div", attrs: { class: "doc-result", id: resultId } }),
            ],
        });
        main.appendChild(sectionEl);
        const resultContainer = document.getElementById(resultId);
        if (resultContainer) {
            section.render(resultContainer);
        }
    }
}


/***/ },

/***/ "./documentation/page-components/menuItems.ts"
/*!****************************************************!*\
  !*** ./documentation/page-components/menuItems.ts ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getDrawerMenuItems: () => (/* binding */ getDrawerMenuItems)
/* harmony export */ });
function getDrawerMenuItems() {
    return [
        { label: "Kezdőlap", href: "index.html" },
        {
            label: "Forms",
            children: [
                { label: "Form Inputok", href: "forms.html" },
                { label: "Select / Radio", href: "selection.html" },
                { label: "Egyedi Inputok", href: "customInputs.html" },
                { label: "Drop file input", href: "draganddrop.html" },
            ],
        },
        { label: "Gombok", href: "buttons.html" },
        {
            label: "Tartalom",
            children: [
                { label: "Komponensek", href: "content.html" },
                { label: "Listák", href: "lists.html" },
                { label: "Táblázatok", href: "tables.html" },
                { label: "Avatar", href: "avatars.html" },
            ],
        },
        {
            label: "Navigáció",
            children: [
                { label: "Nav / Breadcrumb", href: "navigation.html" },
                { label: "Menu", href: "menu.html" },
                { label: "Drawer", href: "drawer.html" },
            ],
        },
        { label: "Visszajelzés", href: "feedback.html" },
        {
            label: "Interaktív",
            children: [
                { label: "Accordion / Tooltip", href: "interactive.html" },
                { label: "Carousel", href: "carousel.html" },
            ],
        },
        {
            label: "Átfedő elemek",
            children: [
                { label: "Modal", href: "modal.html" },
            ],
        },
    ];
}


/***/ },

/***/ "./src/buttons/createButton.ts"
/*!*************************************!*\
  !*** ./src/buttons/createButton.ts ***!
  \*************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createButton: () => (/* binding */ createButton)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./src/utils.ts");


function createButton(params) {
    const handleEvent = [];
    if (params.click)
        handleEvent.push({ event: "click", cb: params.click });
    if (params.handleEvent)
        handleEvent.push(...(0,_utils__WEBPACK_IMPORTED_MODULE_1__.toArray)(params.handleEvent));
    const attrs = {
        class: `btn${params.class ? ` ${params.class}` : ""}`,
    };
    if (params.id)
        attrs.id = params.id;
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        parent: params.parent,
        tag: "button",
        attrs,
        text: params.text,
        style: params.style,
        handleEvent: handleEvent.length > 0 ? handleEvent : undefined,
    });
}


/***/ },

/***/ "./src/buttons/createButtonInput.ts"
/*!******************************************!*\
  !*** ./src/buttons/createButtonInput.ts ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createButtonInput: () => (/* binding */ createButtonInput)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers */ "./src/helpers.ts");


function createButtonInput(params) {
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        ...(0,_helpers__WEBPACK_IMPORTED_MODULE_1__.createInputElem)("input", { ...params, type: "button", value: params.text ?? params.value }),
        parent: params.parent,
    });
}


/***/ },

/***/ "./src/buttons/createResetInput.ts"
/*!*****************************************!*\
  !*** ./src/buttons/createResetInput.ts ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createResetInput: () => (/* binding */ createResetInput)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers */ "./src/helpers.ts");


function createResetInput(params) {
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        ...(0,_helpers__WEBPACK_IMPORTED_MODULE_1__.createInputElem)("input", { ...params, type: "reset", value: params.text ?? params.value }),
        parent: params.parent,
    });
}


/***/ },

/***/ "./src/buttons/createSubmitInput.ts"
/*!******************************************!*\
  !*** ./src/buttons/createSubmitInput.ts ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createSubmitInput: () => (/* binding */ createSubmitInput)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers */ "./src/helpers.ts");


function createSubmitInput(params) {
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        ...(0,_helpers__WEBPACK_IMPORTED_MODULE_1__.createInputElem)("input", { ...params, type: "submit", value: params.text ?? params.value }),
        parent: params.parent,
    });
}


/***/ },

/***/ "./src/buttons/index.ts"
/*!******************************!*\
  !*** ./src/buttons/index.ts ***!
  \******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createButton: () => (/* reexport safe */ _createButton__WEBPACK_IMPORTED_MODULE_0__.createButton),
/* harmony export */   createButtonInput: () => (/* reexport safe */ _createButtonInput__WEBPACK_IMPORTED_MODULE_1__.createButtonInput),
/* harmony export */   createResetInput: () => (/* reexport safe */ _createResetInput__WEBPACK_IMPORTED_MODULE_3__.createResetInput),
/* harmony export */   createSubmitInput: () => (/* reexport safe */ _createSubmitInput__WEBPACK_IMPORTED_MODULE_2__.createSubmitInput)
/* harmony export */ });
/* harmony import */ var _createButton__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createButton */ "./src/buttons/createButton.ts");
/* harmony import */ var _createButtonInput__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./createButtonInput */ "./src/buttons/createButtonInput.ts");
/* harmony import */ var _createSubmitInput__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./createSubmitInput */ "./src/buttons/createSubmitInput.ts");
/* harmony import */ var _createResetInput__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./createResetInput */ "./src/buttons/createResetInput.ts");






/***/ },

/***/ "./src/components/asyncImage.ts"
/*!**************************************!*\
  !*** ./src/components/asyncImage.ts ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   asyncImage: () => (/* binding */ asyncImage)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");

function asyncImage(params) {
    const attrs = {
        src: params.src,
        alt: params.alt || "",
        class: `async-image${params.class ? ` ${params.class}` : ""}`,
    };
    if (params.lazy)
        attrs.loading = "lazy";
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "img",
        parent: params.parent,
        attrs,
    });
}


/***/ },

/***/ "./src/components/calendar-helper.ts"
/*!*******************************************!*\
  !*** ./src/components/calendar-helper.ts ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DAY_NAMES: () => (/* binding */ DAY_NAMES),
/* harmony export */   MONTHS: () => (/* binding */ MONTHS),
/* harmony export */   MONTH_NAMES_SHORT: () => (/* binding */ MONTH_NAMES_SHORT),
/* harmony export */   buildMonthCalendar: () => (/* binding */ buildMonthCalendar),
/* harmony export */   createCalendarHeader: () => (/* binding */ createCalendarHeader),
/* harmony export */   createDayCell: () => (/* binding */ createDayCell),
/* harmony export */   createDayGrid: () => (/* binding */ createDayGrid),
/* harmony export */   createDayNamesHeader: () => (/* binding */ createDayNamesHeader),
/* harmony export */   createEmptyDay: () => (/* binding */ createEmptyDay),
/* harmony export */   formatDateStr: () => (/* binding */ formatDateStr),
/* harmony export */   getDaysInMonth: () => (/* binding */ getDaysInMonth),
/* harmony export */   getFirstDayOfMonth: () => (/* binding */ getFirstDayOfMonth),
/* harmony export */   getISOWeek: () => (/* binding */ getISOWeek),
/* harmony export */   getWeeksInMonth: () => (/* binding */ getWeeksInMonth),
/* harmony export */   setupCalendarCloseHandler: () => (/* binding */ setupCalendarCloseHandler),
/* harmony export */   toggleCalendar: () => (/* binding */ toggleCalendar)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");

const MONTHS = [
    "Januar", "Februar", "Marcius", "Aprilis", "Majus", "Junius",
    "Julius", "Augusztus", "Szeptember", "October", "November", "December",
];
const DAY_NAMES = ["H", "K", "S", "Cs", "P", "Szo", "V"];
const MONTH_NAMES_SHORT = MONTHS.map((m) => m.slice(0, 3));
/** Format a date as YYYY-MM-DD */
function formatDateStr(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
/** Get the number of days in a given month */
function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}
/** Get the day of week (0=Sunday) for the first day of a month */
function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
}
/** Create calendar month/year header with prev/next navigation */
function createCalendarHeader(title, onPrev, onNext) {
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "div",
        attrs: { class: "calendar-header" },
        children: [
            (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
                tag: "button",
                text: "\u25C0",
                attrs: { class: "calendar-nav-btn" },
                handleEvent: { event: "click", cb: (e) => { e.stopPropagation(); onPrev(); } },
            }),
            (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({ tag: "span", text: title, attrs: { class: "calendar-title" } }),
            (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
                tag: "button",
                text: "\u25B6",
                attrs: { class: "calendar-nav-btn" },
                handleEvent: { event: "click", cb: (e) => { e.stopPropagation(); onNext(); } },
            }),
        ],
    });
}
/** Create the day names header row */
function createDayNamesHeader() {
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "div",
        attrs: { class: "calendar-days-header" },
        children: DAY_NAMES.map((d) => (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({ tag: "span", text: d, attrs: { class: "calendar-day-name" } })),
    });
}
/** Create an empty day cell */
function createEmptyDay() {
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({ tag: "span", attrs: { class: "calendar-day empty" } });
}
/** Create a day cell with optional selected/disabled styling and click handler */
function createDayCell(day, extraClass, onClick) {
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "span",
        text: String(day),
        attrs: { class: `calendar-day${extraClass}` },
        handleEvent: onClick ? { event: "click", cb: onClick } : undefined,
    });
}
/** Build a full day grid for a month (empty cells + day cells) */
function createDayGrid(year, month, dayCellBuilder) {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const grid = [];
    for (let i = 0; i < firstDay; i++) {
        grid.push(createEmptyDay());
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = formatDateStr(year, month, day);
        grid.push(dayCellBuilder(day, dateStr));
    }
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({ tag: "div", attrs: { class: "calendar-grid" }, children: grid });
}
/** Build a full month calendar layout: header + day names + day grid */
function buildMonthCalendar(year, month, onPrev, onNext, dayCellBuilder) {
    return [
        createCalendarHeader(`${MONTHS[month]} ${year}`, onPrev, onNext),
        createDayNamesHeader(),
        createDayGrid(year, month, dayCellBuilder),
    ];
}
/** Register a document click handler to close a calendar element */
function setupCalendarCloseHandler(calendarEl) {
    document.addEventListener("click", () => {
        calendarEl.style.display = "none";
    });
}
/** Toggle calendar visibility and re-render */
function toggleCalendar(calendarEl, rerender) {
    const isVisible = calendarEl.style.display !== "none";
    calendarEl.style.display = isVisible ? "none" : "block";
    if (!isVisible)
        rerender();
}
/** Get ISO week number for a date */
function getISOWeek(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
/** Get list of ISO week numbers in a month */
function getWeeksInMonth(year, month) {
    const weeks = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstWeek = getISOWeek(firstDay);
    const lastWeek = getISOWeek(lastDay);
    for (let w = firstWeek; w <= lastWeek; w++)
        weeks.push(w);
    return weeks;
}


/***/ },

/***/ "./src/components/createAccordion.ts"
/*!*******************************************!*\
  !*** ./src/components/createAccordion.ts ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createAccordion: () => (/* binding */ createAccordion)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");

function buildAccordionItem(item, multiple) {
    const content = Array.isArray(item.content) ? item.content : [item.content];
    return {
        tag: "div",
        attrs: {
            class: `accordion-item${item.open ? " open" : ""}`,
            "data-accordion-item": item.id,
        },
        children: [
            {
                tag: "button",
                attrs: {
                    class: "accordion-header",
                    "data-accordion-toggle": item.id,
                    "aria-expanded": item.open ? "true" : "false",
                },
                children: [
                    { tag: "span", text: item.title, attrs: { class: "accordion-title" } },
                    { tag: "span", text: "\u25BC", attrs: { class: "accordion-icon" } },
                ],
                handleEvent: {
                    event: "click",
                    cb: (e) => {
                        const button = e.currentTarget;
                        const accordionItem = button.closest(".accordion-item");
                        if (!accordionItem)
                            return;
                        const isOpen = accordionItem.classList.contains("open");
                        if (!multiple) {
                            const accordion = accordionItem.closest(".accordion");
                            accordion?.querySelectorAll(".accordion-item.open").forEach((el) => {
                                el.classList.remove("open");
                                el.querySelector(".accordion-header")?.setAttribute("aria-expanded", "false");
                            });
                        }
                        accordionItem.classList.toggle("open", !isOpen);
                        button.setAttribute("aria-expanded", (!isOpen).toString());
                    },
                },
            },
            {
                tag: "div",
                attrs: {
                    class: `accordion-content${item.open ? " open" : ""}`,
                    "data-accordion-content": item.id,
                },
                children: content,
            },
        ],
    };
}
function createAccordion(params) {
    const rootAttrs = { class: `accordion${params.class ? ` ${params.class}` : ""}` };
    if (params.id)
        rootAttrs.id = params.id;
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "div",
        parent: params.parent,
        attrs: rootAttrs,
        children: params.items.map((item) => buildAccordionItem(item, params.multiple || false)),
    });
}


/***/ },

/***/ "./src/components/createAlert.ts"
/*!***************************************!*\
  !*** ./src/components/createAlert.ts ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createAlert: () => (/* binding */ createAlert)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");

function createAlert(params) {
    const children = [];
    if (params.title) {
        children.push({ tag: "strong", text: params.title, attrs: { class: "alert-title" } });
    }
    children.push({ tag: "span", text: params.message, attrs: { class: "alert-message" } });
    if (params.dismissible) {
        children.push({
            tag: "button",
            text: "\u00D7",
            attrs: { class: "alert-close" },
            handleEvent: {
                event: "click",
                cb: (e) => {
                    const alert = e.currentTarget.closest(".alert");
                    if (alert)
                        alert.style.display = "none";
                    params.onDismiss?.();
                },
            },
        });
    }
    const rootAttrs = {
        class: `alert alert-${params.type || "info"}${params.class ? ` ${params.class}` : ""}`,
        role: "alert",
    };
    if (params.id)
        rootAttrs.id = params.id;
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({ tag: "div", parent: params.parent, attrs: rootAttrs, children });
}


/***/ },

/***/ "./src/components/createAvatar.ts"
/*!****************************************!*\
  !*** ./src/components/createAvatar.ts ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createAvatar: () => (/* binding */ createAvatar)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");

function createAvatar(params) {
    const children = [];
    if (params.src) {
        children.push({
            tag: "img",
            attrs: { src: params.src, alt: params.name || "Avatar", class: "avatar-image" },
        });
    }
    else if (params.name) {
        const initials = params.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
        children.push({ tag: "span", text: initials, attrs: { class: "avatar-initials" } });
    }
    const rootAttrs = {
        class: `avatar avatar-${params.size || "md"} avatar-${params.shape || "circle"}${params.class ? ` ${params.class}` : ""}`,
    };
    if (params.id)
        rootAttrs.id = params.id;
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({ tag: "div", parent: params.parent, attrs: rootAttrs, children });
}


/***/ },

/***/ "./src/components/createBadge.ts"
/*!***************************************!*\
  !*** ./src/components/createBadge.ts ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createBadge: () => (/* binding */ createBadge)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");

function createBadge(params) {
    const rootAttrs = { class: `badge badge-${params.type || "neutral"}${params.class ? ` ${params.class}` : ""}` };
    if (params.id)
        rootAttrs.id = params.id;
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({ tag: "span", parent: params.parent, attrs: rootAttrs, text: params.text });
}


/***/ },

/***/ "./src/components/createBlockquote.ts"
/*!********************************************!*\
  !*** ./src/components/createBlockquote.ts ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createBlockquote: () => (/* binding */ createBlockquote)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");

function createBlockquote(params) {
    const children = [];
    children.push({ tag: "p", text: params.text, attrs: { class: "blockquote-text" } });
    if (params.author) {
        children.push({
            tag: "footer",
            attrs: { class: "blockquote-author" },
            children: [{ tag: "cite", text: `\u2014 ${params.author}` }],
        });
    }
    const rootAttrs = { class: `blockquote${params.class ? ` ${params.class}` : ""}` };
    if (params.id)
        rootAttrs.id = params.id;
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({ tag: "blockquote", parent: params.parent, attrs: rootAttrs, children });
}


/***/ },

/***/ "./src/components/createBreadcrumb.ts"
/*!********************************************!*\
  !*** ./src/components/createBreadcrumb.ts ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createBreadcrumb: () => (/* binding */ createBreadcrumb)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");

function createBreadcrumb(params) {
    const separator = params.separator || "/";
    const children = [];
    params.items.forEach((item, index) => {
        if (index > 0) {
            children.push({ tag: "span", text: separator, attrs: { class: "breadcrumb-separator" } });
        }
        const isLast = index === params.items.length - 1;
        if (item.href && !isLast) {
            children.push({
                tag: "a",
                text: item.text,
                attrs: { href: item.href, class: "breadcrumb-link" },
                handleEvent: item.click ? { event: "click", cb: item.click } : undefined,
            });
        }
        else {
            children.push({
                tag: "span",
                text: item.text,
                attrs: { class: isLast ? "breadcrumb-current" : "breadcrumb-link" },
                handleEvent: item.click ? { event: "click", cb: item.click } : undefined,
            });
        }
    });
    const rootAttrs = { class: `breadcrumb${params.class ? ` ${params.class}` : ""}` };
    if (params.id)
        rootAttrs.id = params.id;
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "nav",
        parent: params.parent,
        attrs: rootAttrs,
        children: [
            {
                tag: "ol",
                attrs: { class: "breadcrumb-list" },
                children: children.map((child) => ({
                    tag: "li",
                    attrs: { class: "breadcrumb-item" },
                    children: [child],
                })),
            },
        ],
    });
}


/***/ },

/***/ "./src/components/createCard.ts"
/*!**************************************!*\
  !*** ./src/components/createCard.ts ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createCard: () => (/* binding */ createCard)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");

function createCard(params) {
    const children = [];
    if (params.title) {
        children.push({
            tag: "div",
            attrs: { class: "card-header" },
            children: [{ tag: "h3", text: params.title }],
        });
    }
    if (params.body) {
        const bodyItems = Array.isArray(params.body) ? params.body : [params.body];
        children.push({
            tag: "div",
            attrs: { class: "card-body" },
            children: bodyItems,
        });
    }
    if (params.footer) {
        const footerItems = Array.isArray(params.footer) ? params.footer : [params.footer];
        children.push({
            tag: "div",
            attrs: { class: "card-footer" },
            children: footerItems,
        });
    }
    const rootAttrs = { class: `card${params.class ? ` ${params.class}` : ""}` };
    if (params.id)
        rootAttrs.id = params.id;
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "div",
        parent: params.parent,
        attrs: rootAttrs,
        children,
    });
}


/***/ },

/***/ "./src/components/createCarousel.ts"
/*!******************************************!*\
  !*** ./src/components/createCarousel.ts ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createCarousel: () => (/* binding */ createCarousel)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");

function buildSlide(slide) {
    const children = [];
    if (slide.icon) {
        children.push({ tag: "div", text: slide.icon, attrs: { class: "carousel-slide-icon" } });
    }
    if (slide.title) {
        children.push({ tag: "span", text: slide.title, attrs: { class: "carousel-slide-title" } });
    }
    if (slide.description) {
        children.push({ tag: "span", text: slide.description, attrs: { class: "carousel-slide-desc" } });
    }
    if (slide.content) {
        const contentItems = Array.isArray(slide.content) ? slide.content : [slide.content];
        children.push({ tag: "div", attrs: { class: "carousel-slide-content" }, children: contentItems });
    }
    if (slide.cta) {
        const ctaAttrs = { class: "carousel-slide-cta" };
        if (slide.cta.href)
            ctaAttrs.href = slide.cta.href;
        children.push({
            tag: slide.cta.href ? "a" : "button",
            text: slide.cta.text,
            attrs: ctaAttrs,
            ...(slide.cta.click ? { handleEvent: { event: "click", cb: slide.cta.click } } : {}),
        });
    }
    const slideAttrs = {
        class: `carousel-slide${slide.class ? ` ${slide.class}` : ""}`,
        role: "listitem",
    };
    if (slide.id)
        slideAttrs.id = slide.id;
    return {
        tag: "div",
        attrs: slideAttrs,
        children,
    };
}
function createCarousel(params) {
    const rootAttrs = {
        class: `carousel-wrap${params.class ? ` ${params.class}` : ""}`,
    };
    if (params.id)
        rootAttrs.id = params.id;
    const stageId = params.id ? `${params.id}-stage` : "carousel-stage";
    const dotsId = params.id ? `${params.id}-dots` : "carousel-dots";
    const showArrows = params.showArrows !== false;
    const showDots = params.showDots !== false;
    const slideElements = params.slides.map((s) => buildSlide(s));
    const navChildren = [];
    if (showArrows) {
        navChildren.push({
            tag: "button",
            text: "\u25C0",
            attrs: { class: "carousel-arrow carousel-prev", "aria-label": "Previous" },
        });
    }
    if (showDots) {
        navChildren.push({ tag: "div", attrs: { class: "carousel-dots", id: dotsId, role: "tablist" } });
    }
    if (showArrows) {
        navChildren.push({
            tag: "button",
            text: "\u25B6",
            attrs: { class: "carousel-arrow carousel-next", "aria-label": "Next" },
        });
    }
    const carousel = (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "div",
        parent: params.parent,
        attrs: rootAttrs,
        children: [
            {
                tag: "div",
                attrs: { class: "carousel-stage", id: stageId, role: "list" },
                children: slideElements,
            },
            { tag: "div", attrs: { class: "carousel-nav", role: "group", "aria-label": "Carousel navigation" }, children: navChildren },
        ],
    });
    initCarouselLogic(carousel, stageId, dotsId, showArrows);
    return carousel;
}
function initCarouselLogic(root, stageId, dotsId, showArrows) {
    const stage = root.querySelector(`#${stageId}`);
    if (!stage)
        return;
    const slides = Array.from(stage.querySelectorAll(".carousel-slide"));
    const dotsWrap = root.querySelector(`#${dotsId}`);
    const N = slides.length;
    if (N === 0)
        return;
    let current = 0;
    const dots = [];
    if (dotsWrap) {
        for (let i = 0; i < N; i++) {
            const d = document.createElement("button");
            d.className = "carousel-dot";
            d.setAttribute("aria-label", `Slide ${i + 1}`);
            d.addEventListener("click", () => goTo(i));
            dotsWrap.appendChild(d);
            dots.push(d);
        }
    }
    function mod(n, m) {
        return ((n % m) + m) % m;
    }
    function goTo(idx) {
        current = mod(idx, N);
        const prev = mod(current - 1, N);
        const next = mod(current + 1, N);
        slides.forEach((slide, i) => {
            const stepsAhead = mod(i - current, N);
            if (i === current)
                slide.dataset.state = "active";
            else if (i === prev)
                slide.dataset.state = "prev";
            else if (i === next)
                slide.dataset.state = "next";
            else
                slide.dataset.state = stepsAhead <= Math.floor(N / 2) ? "hidden-next" : "hidden-prev";
        });
        dots.forEach((d, i) => {
            d.classList.toggle("active", i === current);
        });
    }
    if (showArrows) {
        const nextBtn = root.querySelector(".carousel-next");
        const prevBtn = root.querySelector(".carousel-prev");
        nextBtn?.addEventListener("click", () => goTo(current + 1));
        prevBtn?.addEventListener("click", () => goTo(current - 1));
    }
    stage.addEventListener("click", (e) => {
        const target = e.target.closest(".carousel-slide");
        if (!target)
            return;
        const state = target.dataset.state;
        if (state === "prev") {
            e.preventDefault();
            goTo(current - 1);
        }
        else if (state === "next") {
            e.preventDefault();
            goTo(current + 1);
        }
    });
    let startX = 0;
    let startY = 0;
    let dragging = false;
    stage.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });
    stage.addEventListener("touchend", (e) => {
        const dx = e.changedTouches[0].clientX - startX;
        const dy = e.changedTouches[0].clientY - startY;
        if (Math.abs(dx) < 30 || Math.abs(dy) > Math.abs(dx) * 0.9)
            return;
        if (dx < 0)
            goTo(current + 1);
        else
            goTo(current - 1);
    }, { passive: true });
    stage.addEventListener("mousedown", (e) => {
        startX = e.clientX;
        dragging = true;
    });
    stage.addEventListener("mouseup", (e) => {
        if (!dragging)
            return;
        dragging = false;
        const dx = e.clientX - startX;
        if (Math.abs(dx) < 40)
            return;
        if (dx < 0)
            goTo(current + 1);
        else
            goTo(current - 1);
    });
    stage.addEventListener("mouseleave", () => {
        dragging = false;
    });
    goTo(0);
}


/***/ },

/***/ "./src/components/createCodeBlock.ts"
/*!*******************************************!*\
  !*** ./src/components/createCodeBlock.ts ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createCodeBlock: () => (/* binding */ createCodeBlock)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");
/* harmony import */ var _highlighter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./highlighter */ "./src/components/highlighter.ts");


function createCodeBlock(params) {
    const children = [];
    if (params.language) {
        children.push({
            tag: "div",
            text: params.language.toUpperCase(),
            attrs: { class: "code-language" },
        });
    }
    const highlighted = (0,_highlighter__WEBPACK_IMPORTED_MODULE_1__.highlightCode)(params.code, params.language);
    children.push({
        tag: "pre",
        attrs: { class: "code-pre" },
        children: [
            {
                tag: "code",
                content: highlighted,
                attrs: { class: `code-content${params.language ? ` language-${params.language}` : ""}` },
            },
        ],
    });
    const rootAttrs = {
        class: `code-block${params.class ? ` ${params.class}` : ""}`,
    };
    if (params.id)
        rootAttrs.id = params.id;
    const opts = {
        tag: "div",
        attrs: rootAttrs,
        children,
    };
    if (params.parent)
        opts.parent = params.parent;
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)(opts);
}


/***/ },

/***/ "./src/components/createContainer.ts"
/*!*******************************************!*\
  !*** ./src/components/createContainer.ts ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createContainer: () => (/* binding */ createContainer)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");

function createContainer(params) {
    const rootAttrs = { class: `container${params.class ? ` ${params.class}` : ""}` };
    if (params.id)
        rootAttrs.id = params.id;
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({ tag: "div", parent: params.parent, attrs: rootAttrs, children: params.children });
}


/***/ },

/***/ "./src/components/createCustomDatePicker.ts"
/*!**************************************************!*\
  !*** ./src/components/createCustomDatePicker.ts ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createCustomDatePicker: () => (/* binding */ createCustomDatePicker)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");
/* harmony import */ var _calendar_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./calendar-helper */ "./src/components/calendar-helper.ts");


function createCustomDatePicker(params) {
    let selectedDate = params.value || "";
    const rootAttrs = {
        class: `custom-date-picker${params.class ? ` ${params.class}` : ""}`,
    };
    if (params.id)
        rootAttrs.id = params.id;
    const input = (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "input",
        attrs: {
            type: "text",
            readonly: "true",
            class: "custom-date-picker-input",
            placeholder: params.placeholder || "Valassz datumot...",
            ...(params.id ? { id: `${params.id}-input` } : {}),
            ...(selectedDate ? { value: selectedDate } : {}),
        },
        handleEvent: {
            event: "click",
            cb: (e) => {
                e.stopPropagation();
                (0,_calendar_helper__WEBPACK_IMPORTED_MODULE_1__.toggleCalendar)(calendarEl, () => {
                    const y = selectedDate ? parseInt(selectedDate.split("-")[0]) : new Date().getFullYear();
                    const m = selectedDate ? parseInt(selectedDate.split("-")[1]) - 1 : new Date().getMonth();
                    calendarEl.replaceChildren(...renderCalendar(y, m));
                });
            },
        },
    });
    const calendarEl = (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "div",
        attrs: { class: "custom-date-picker-calendar" },
        style: { display: "none" },
    });
    function renderCalendar(year, month) {
        return (0,_calendar_helper__WEBPACK_IMPORTED_MODULE_1__.buildMonthCalendar)(year, month, 
        // prev
        () => {
            const prev = month === 0 ? 11 : month - 1;
            const prevYear = month === 0 ? year - 1 : year;
            calendarEl.replaceChildren(...renderCalendar(prevYear, prev));
        }, 
        // next
        () => {
            const next = month === 11 ? 0 : month + 1;
            const nextYear = month === 11 ? year + 1 : year;
            calendarEl.replaceChildren(...renderCalendar(nextYear, next));
        }, 
        // day cell builder
        (day, dateStr) => {
            const isSelected = dateStr === selectedDate;
            const isDisabled = (params.min && dateStr < params.min) || (params.max && dateStr > params.max);
            return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
                tag: "span",
                text: String(day),
                attrs: { class: `calendar-day${isSelected ? " selected" : ""}${isDisabled ? " disabled" : ""}` },
                handleEvent: isDisabled ? undefined : {
                    event: "click",
                    cb: (e) => {
                        e.stopPropagation();
                        selectedDate = dateStr;
                        input.value = dateStr;
                        calendarEl.style.display = "none";
                        params.onChange?.(dateStr);
                    },
                },
            });
        });
    }
    calendarEl.append(...renderCalendar(new Date().getFullYear(), new Date().getMonth()));
    (0,_calendar_helper__WEBPACK_IMPORTED_MODULE_1__.setupCalendarCloseHandler)(calendarEl);
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "div",
        parent: params.parent,
        attrs: rootAttrs,
        children: [
            ...(params.labelText
                ? [(0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({ tag: "label", text: params.labelText, attrs: { class: "custom-date-picker-label" } })]
                : []),
            { tag: "div", attrs: { class: "custom-date-picker-wrapper" }, children: [input, calendarEl] },
        ],
    });
}


/***/ },

/***/ "./src/components/createCustomDateRangePicker.ts"
/*!*******************************************************!*\
  !*** ./src/components/createCustomDateRangePicker.ts ***!
  \*******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createCustomDateRangePicker: () => (/* binding */ createCustomDateRangePicker)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");
/* harmony import */ var _calendar_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./calendar-helper */ "./src/components/calendar-helper.ts");


function createCustomDateRangePicker(params) {
    let startDate = params.startValue || "";
    let endDate = params.endValue || "";
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    let selectingStart = true;
    const rootAttrs = {
        class: `custom-date-range-picker${params.class ? ` ${params.class}` : ""}`,
    };
    if (params.id)
        rootAttrs.id = params.id;
    const startInput = (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "input",
        attrs: {
            type: "text", readonly: "true", class: "custom-date-range-picker-input",
            placeholder: "Kezdet...",
            ...(startDate ? { value: startDate } : {}),
        },
    });
    const endInput = (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "input",
        attrs: {
            type: "text", readonly: "true", class: "custom-date-range-picker-input",
            placeholder: "Veg...",
            ...(endDate ? { value: endDate } : {}),
        },
    });
    const calendarEl = (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "div", attrs: { class: "custom-date-range-picker-calendar" }, style: { display: "none" },
    });
    function renderCalendar() {
        return (0,_calendar_helper__WEBPACK_IMPORTED_MODULE_1__.buildMonthCalendar)(currentYear, currentMonth, 
        // prev
        () => {
            currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            if (currentMonth === 11)
                currentYear--;
            calendarEl.replaceChildren(...renderCalendar());
        }, 
        // next
        () => {
            currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;
            if (currentMonth === 0)
                currentYear++;
            calendarEl.replaceChildren(...renderCalendar());
        }, 
        // day cell builder
        (day, dateStr) => {
            const isStart = dateStr === startDate;
            const isEnd = dateStr === endDate;
            const inRange = startDate && endDate && dateStr > startDate && dateStr < endDate;
            return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
                tag: "span", text: String(day),
                attrs: { class: `calendar-day${isStart ? " range-start" : ""}${isEnd ? " range-end" : ""}${inRange ? " in-range" : ""}` },
                handleEvent: {
                    event: "click",
                    cb: (e) => {
                        e.stopPropagation();
                        if (selectingStart) {
                            startDate = dateStr;
                            endDate = "";
                            selectingStart = false;
                        }
                        else {
                            if (dateStr < startDate) {
                                endDate = startDate;
                                startDate = dateStr;
                            }
                            else {
                                endDate = dateStr;
                            }
                            selectingStart = true;
                        }
                        startInput.value = startDate;
                        endInput.value = endDate;
                        calendarEl.replaceChildren(...renderCalendar());
                        params.onChange?.(startDate, endDate);
                    },
                },
            });
        });
    }
    calendarEl.append(...renderCalendar());
    const wrapper = (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "div", attrs: { class: "custom-date-range-picker-wrapper" },
        children: [
            startInput,
            (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({ tag: "span", text: " \u2013 ", attrs: { class: "range-separator" } }),
            endInput,
            calendarEl,
        ],
    });
    [startInput, endInput].forEach((inp) => {
        inp.addEventListener("click", (e) => {
            e.stopPropagation();
            calendarEl.style.display = calendarEl.style.display === "none" ? "block" : "none";
        });
    });
    (0,_calendar_helper__WEBPACK_IMPORTED_MODULE_1__.setupCalendarCloseHandler)(calendarEl);
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "div", parent: params.parent, attrs: rootAttrs,
        children: [
            ...(params.labelText ? [(0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({ tag: "label", text: params.labelText, attrs: { class: "custom-date-range-picker-label" } })] : []),
            wrapper,
        ],
    });
}


/***/ },

/***/ "./src/components/createCustomDateTimePicker.ts"
/*!******************************************************!*\
  !*** ./src/components/createCustomDateTimePicker.ts ***!
  \******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createCustomDateTimePicker: () => (/* binding */ createCustomDateTimePicker)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");
/* harmony import */ var _calendar_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./calendar-helper */ "./src/components/calendar-helper.ts");


function createCustomDateTimePicker(params) {
    let selectedDate = params.value || "";
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    let selectedTime = "12:00";
    const rootAttrs = {
        class: `custom-datetime-picker${params.class ? ` ${params.class}` : ""}`,
    };
    if (params.id)
        rootAttrs.id = params.id;
    const timeInput = (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "input",
        attrs: { type: "time", class: "custom-datetime-picker-time", value: selectedTime },
        handleEvent: {
            event: "change",
            cb: (e) => {
                selectedTime = e.target.value;
                if (selectedDate) {
                    const datePart = selectedDate.split("T")[0];
                    selectedDate = `${datePart}T${selectedTime}`;
                    input.value = selectedDate;
                    params.onChange?.(selectedDate);
                }
            },
        },
    });
    const input = (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "input",
        attrs: {
            type: "text", readonly: "true", class: "custom-datetime-picker-input",
            placeholder: params.placeholder || "Valassz datumot es idot...",
            ...(params.id ? { id: `${params.id}-input` } : {}),
            ...(selectedDate ? { value: selectedDate } : {}),
        },
        handleEvent: {
            event: "click",
            cb: (e) => {
                e.stopPropagation();
                (0,_calendar_helper__WEBPACK_IMPORTED_MODULE_1__.toggleCalendar)(calendarEl, () => calendarEl.replaceChildren(...renderCalendar()));
            },
        },
    });
    const calendarEl = (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "div", attrs: { class: "custom-datetime-picker-calendar" }, style: { display: "none" },
    });
    function renderCalendar() {
        return (0,_calendar_helper__WEBPACK_IMPORTED_MODULE_1__.buildMonthCalendar)(currentYear, currentMonth, 
        // prev
        () => {
            currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            if (currentMonth === 11)
                currentYear--;
            calendarEl.replaceChildren(...renderCalendar());
        }, 
        // next
        () => {
            currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;
            if (currentMonth === 0)
                currentYear++;
            calendarEl.replaceChildren(...renderCalendar());
        }, 
        // day cell builder
        (day, dateStr) => {
            const datePart = selectedDate.split("T")[0];
            return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
                tag: "span", text: String(day),
                attrs: { class: `calendar-day${datePart === dateStr ? " selected" : ""}` },
                handleEvent: {
                    event: "click",
                    cb: (e) => {
                        e.stopPropagation();
                        selectedDate = `${dateStr}T${selectedTime}`;
                        input.value = selectedDate;
                        calendarEl.style.display = "none";
                        params.onChange?.(selectedDate);
                    },
                },
            });
        });
    }
    calendarEl.append(...renderCalendar());
    (0,_calendar_helper__WEBPACK_IMPORTED_MODULE_1__.setupCalendarCloseHandler)(calendarEl);
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "div", parent: params.parent, attrs: rootAttrs,
        children: [
            ...(params.labelText ? [(0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({ tag: "label", text: params.labelText, attrs: { class: "custom-datetime-picker-label" } })] : []),
            { tag: "div", attrs: { class: "custom-datetime-picker-wrapper" }, children: [input, calendarEl, timeInput] },
        ],
    });
}


/***/ },

/***/ "./src/components/createCustomMonthPicker.ts"
/*!***************************************************!*\
  !*** ./src/components/createCustomMonthPicker.ts ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createCustomMonthPicker: () => (/* binding */ createCustomMonthPicker)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");
/* harmony import */ var _calendar_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./calendar-helper */ "./src/components/calendar-helper.ts");


function createCustomMonthPicker(params) {
    let selectedMonth = params.value || "";
    let currentYear = new Date().getFullYear();
    const rootAttrs = {
        class: `custom-month-picker${params.class ? ` ${params.class}` : ""}`,
    };
    if (params.id)
        rootAttrs.id = params.id;
    const calendarEl = (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "div",
        attrs: { class: "custom-month-picker-calendar" },
        style: { display: "none" },
    });
    function render() {
        return [
            (0,_calendar_helper__WEBPACK_IMPORTED_MODULE_1__.createCalendarHeader)(String(currentYear), () => { currentYear--; calendarEl.replaceChildren(...render()); }, () => { currentYear++; calendarEl.replaceChildren(...render()); }),
            (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
                tag: "div",
                attrs: { class: "month-grid" },
                children: _calendar_helper__WEBPACK_IMPORTED_MODULE_1__.MONTHS.map((m, i) => {
                    const monthStr = `${currentYear}-${String(i + 1).padStart(2, "0")}`;
                    const isSelected = monthStr === selectedMonth;
                    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
                        tag: "span",
                        text: _calendar_helper__WEBPACK_IMPORTED_MODULE_1__.MONTH_NAMES_SHORT[i],
                        attrs: { class: `month-item${isSelected ? " selected" : ""}` },
                        handleEvent: {
                            event: "click",
                            cb: (e) => {
                                e.stopPropagation();
                                selectedMonth = monthStr;
                                input.value = `${m} ${currentYear}`;
                                calendarEl.style.display = "none";
                                params.onChange?.(monthStr);
                            },
                        },
                    });
                }),
            }),
        ];
    }
    calendarEl.append(...render());
    const input = (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "input",
        attrs: {
            type: "text",
            readonly: "true",
            class: "custom-month-picker-input",
            placeholder: params.placeholder || "Valassz honapot...",
            ...(params.id ? { id: `${params.id}-input` } : {}),
            ...(selectedMonth ? { value: selectedMonth } : {}),
        },
        handleEvent: {
            event: "click",
            cb: (e) => {
                e.stopPropagation();
                (0,_calendar_helper__WEBPACK_IMPORTED_MODULE_1__.toggleCalendar)(calendarEl, () => calendarEl.replaceChildren(...render()));
            },
        },
    });
    (0,_calendar_helper__WEBPACK_IMPORTED_MODULE_1__.setupCalendarCloseHandler)(calendarEl);
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "div",
        parent: params.parent,
        attrs: rootAttrs,
        children: [
            ...(params.labelText ? [(0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({ tag: "label", text: params.labelText, attrs: { class: "custom-month-picker-label" } })] : []),
            { tag: "div", attrs: { class: "custom-month-picker-wrapper" }, children: [input, calendarEl] },
        ],
    });
}


/***/ },

/***/ "./src/components/createCustomSelect.ts"
/*!**********************************************!*\
  !*** ./src/components/createCustomSelect.ts ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createCustomSelect: () => (/* binding */ createCustomSelect)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");

function createCustomSelect(params) {
    let selectedValue = params.value;
    let isOpen = false;
    const rootAttrs = {
        class: `custom-select${params.class ? ` ${params.class}` : ""}`,
        "data-value": selectedValue != null ? String(selectedValue) : "",
    };
    if (params.id)
        rootAttrs.id = params.id;
    const displayLabel = params.options.find((o) => o.value === selectedValue)?.text || params.placeholder || "";
    const selectedAttrs = { class: "custom-select-trigger" };
    const optionsListAttrs = { class: "custom-select-options" };
    const optionElements = params.options.map((opt) => {
        const optAttrs = {
            class: `custom-select-option${opt.value === selectedValue ? " selected" : ""}`,
            "data-value": String(opt.value),
        };
        return {
            tag: "div",
            text: opt.text,
            attrs: optAttrs,
            handleEvent: {
                event: "click",
                cb: () => {
                    selectedValue = opt.value;
                    root.setAttribute("data-value", String(opt.value));
                    triggerSpan.textContent = opt.text;
                    triggerSpan.classList.remove("placeholder");
                    root.querySelectorAll(".custom-select-option").forEach((el) => {
                        el.classList.remove("selected");
                    });
                    optionElements.find((_, i) => params.options[i].value === opt.value)?.attrs?.class?.includes("selected");
                    const allOpts = root.querySelectorAll(".custom-select-option");
                    allOpts.forEach((el) => {
                        if (el.getAttribute("data-value") === String(opt.value)) {
                            el.classList.add("selected");
                        }
                        else {
                            el.classList.remove("selected");
                        }
                    });
                    isOpen = false;
                    root.classList.remove("open");
                    optionsList.style.display = "none";
                    params.onChange?.(opt.value);
                },
            },
        };
    });
    const triggerSpan = (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "span",
        text: displayLabel,
        attrs: { class: `custom-select-trigger${!displayLabel ? " placeholder" : ""}` },
    });
    const optionsList = (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "div",
        attrs: optionsListAttrs,
        children: optionElements,
        style: { display: "none" },
    });
    const root = (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "div",
        parent: params.parent,
        attrs: rootAttrs,
        children: [
            ...(params.labelText
                ? [{ tag: "label", text: params.labelText, attrs: { class: "custom-select-label", for: params.id } }]
                : []),
            {
                tag: "div",
                attrs: { class: "custom-select-trigger-wrapper" },
                children: [triggerSpan, { tag: "span", text: "\u25BC", attrs: { class: "custom-select-arrow" } }],
                handleEvent: {
                    event: "click",
                    cb: () => {
                        isOpen = !isOpen;
                        root.classList.toggle("open", isOpen);
                        optionsList.style.display = isOpen ? "block" : "none";
                    },
                },
            },
            optionsList,
        ],
    });
    const closeHandler = (e) => {
        if (!root.contains(e.target)) {
            isOpen = false;
            root.classList.remove("open");
            optionsList.style.display = "none";
        }
    };
    document.addEventListener("click", closeHandler);
    return root;
}


/***/ },

/***/ "./src/components/createCustomWeekPicker.ts"
/*!**************************************************!*\
  !*** ./src/components/createCustomWeekPicker.ts ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createCustomWeekPicker: () => (/* binding */ createCustomWeekPicker)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");
/* harmony import */ var _calendar_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./calendar-helper */ "./src/components/calendar-helper.ts");


function createCustomWeekPicker(params) {
    let selectedWeek = params.value || "";
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    const rootAttrs = {
        class: `custom-week-picker${params.class ? ` ${params.class}` : ""}`,
    };
    if (params.id)
        rootAttrs.id = params.id;
    const input = (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "input",
        attrs: {
            type: "text",
            readonly: "true",
            class: "custom-week-picker-input",
            placeholder: params.placeholder || "Valassz hetet...",
            ...(params.id ? { id: `${params.id}-input` } : {}),
            ...(selectedWeek ? { value: selectedWeek } : {}),
        },
        handleEvent: {
            event: "click",
            cb: (e) => {
                e.stopPropagation();
                (0,_calendar_helper__WEBPACK_IMPORTED_MODULE_1__.toggleCalendar)(calendarEl, () => calendarEl.replaceChildren(...render()));
            },
        },
    });
    const calendarEl = (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "div",
        attrs: { class: "custom-week-picker-calendar" },
        style: { display: "none" },
    });
    function render() {
        const weeks = (0,_calendar_helper__WEBPACK_IMPORTED_MODULE_1__.getWeeksInMonth)(currentYear, currentMonth);
        return [
            (0,_calendar_helper__WEBPACK_IMPORTED_MODULE_1__.createCalendarHeader)(`${_calendar_helper__WEBPACK_IMPORTED_MODULE_1__.MONTHS[currentMonth]} ${currentYear}`, () => {
                currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                if (currentMonth === 11)
                    currentYear--;
                calendarEl.replaceChildren(...render());
            }, () => {
                currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;
                if (currentMonth === 0)
                    currentYear++;
                calendarEl.replaceChildren(...render());
            }),
            (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
                tag: "div",
                attrs: { class: "week-list" },
                children: weeks.map((w) => {
                    const weekStr = `${currentYear}-W${String(w).padStart(2, "0")}`;
                    const isSelected = weekStr === selectedWeek;
                    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
                        tag: "span",
                        text: `${w}. hét`,
                        attrs: { class: `week-item${isSelected ? " selected" : ""}` },
                        handleEvent: {
                            event: "click",
                            cb: (e) => {
                                e.stopPropagation();
                                selectedWeek = weekStr;
                                input.value = weekStr;
                                calendarEl.style.display = "none";
                                params.onChange?.(weekStr);
                            },
                        },
                    });
                }),
            }),
        ];
    }
    calendarEl.append(...render());
    (0,_calendar_helper__WEBPACK_IMPORTED_MODULE_1__.setupCalendarCloseHandler)(calendarEl);
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "div",
        parent: params.parent,
        attrs: rootAttrs,
        children: [
            ...(params.labelText ? [(0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({ tag: "label", text: params.labelText, attrs: { class: "custom-week-picker-label" } })] : []),
            { tag: "div", attrs: { class: "custom-week-picker-wrapper" }, children: [input, calendarEl] },
        ],
    });
}


/***/ },

/***/ "./src/components/createDivider.ts"
/*!*****************************************!*\
  !*** ./src/components/createDivider.ts ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createDivider: () => (/* binding */ createDivider)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");

function createDivider(params) {
    const rootAttrs = { class: `divider${params.class ? ` ${params.class}` : ""}` };
    if (params.id)
        rootAttrs.id = params.id;
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({ tag: "hr", parent: params.parent, attrs: rootAttrs });
}


/***/ },

/***/ "./src/components/createDragAndDropFileInput.ts"
/*!******************************************************!*\
  !*** ./src/components/createDragAndDropFileInput.ts ***!
  \******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createDragAndDropFileInput: () => (/* binding */ createDragAndDropFileInput)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");

function formatSize(bytes) {
    if (bytes < 1024)
        return bytes + " B";
    if (bytes < 1024 * 1024)
        return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}
function getFileIcon(name) {
    const ext = name.split(".").pop()?.toLowerCase() || "";
    const iconMap = {
        pdf: "\uD83D\uDCC4", jpg: "\uD83D\uDDBC", jpeg: "\uD83D\uDDBC",
        png: "\uD83D\uDDBC", gif: "\uD83C\uDFAC", svg: "\uD83D\uDD8C",
        doc: "\uD83D\uDCDD", docx: "\uD83D\uDCDD", xls: "\uD83D\uDCCA", xlsx: "\uD83D\uDCCA",
        zip: "\uD83D\uDCE6", rar: "\uD83D\uDCE6", "7z": "\uD83D\uDCE6",
        mp4: "\uD83C\uDFA5", mov: "\uD83C\uDFA5", mp3: "\uD83C\uDFB5",
        json: "{ }", ts: "TS", js: "JS", css: "CSS", html: "HTML",
    };
    return iconMap[ext] || "\uD83D\uDCC1";
}
function createDragAndDropFileInput(params) {
    let files = [];
    const rootAttrs = {
        class: `drag-and-drop${params.class ? ` ${params.class}` : ""}`,
    };
    if (params.id)
        rootAttrs.id = params.id;
    const fileListAttrs = { class: "dd-file-list" };
    function renderFileList() {
        if (files.length === 0)
            return [];
        return files.map((file, i) => (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
            tag: "div",
            attrs: { class: "dd-file-item" },
            children: [
                (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({ tag: "span", text: getFileIcon(file.name), attrs: { class: "dd-file-icon" } }),
                (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
                    tag: "div",
                    attrs: { class: "dd-file-info" },
                    children: [
                        (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({ tag: "span", text: file.name, attrs: { class: "dd-file-name" } }),
                        (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({ tag: "span", text: formatSize(file.size), attrs: { class: "dd-file-size" } }),
                    ],
                }),
                (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
                    tag: "button",
                    text: "\u00D7",
                    attrs: { class: "dd-file-remove" },
                    handleEvent: {
                        event: "click",
                        cb: (e) => {
                            e.stopPropagation();
                            files.splice(i, 1);
                            fileListEl.replaceChildren(...renderFileList());
                            params.onFiles?.(files);
                        },
                    },
                }),
            ],
        }));
    }
    const fileListEl = (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({ tag: "div", attrs: fileListAttrs });
    fileListEl.append(...renderFileList());
    const hiddenInput = (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "input",
        attrs: {
            type: "file",
            class: "dd-hidden-input",
            ...(params.multiple ? { multiple: "true" } : {}),
            ...(params.accept ? { accept: params.accept.join(",") } : {}),
        },
        handleEvent: {
            event: "change",
            cb: (e) => {
                const inputEl = e.target;
                if (inputEl.files) {
                    const newFiles = Array.from(inputEl.files);
                    if (params.maxFiles) {
                        const allowed = params.maxFiles - files.length;
                        files.push(...newFiles.slice(0, allowed));
                    }
                    else {
                        files.push(...newFiles);
                    }
                    fileListEl.replaceChildren(...renderFileList());
                    params.onFiles?.(files);
                    inputEl.value = "";
                }
            },
        },
    });
    const dropIcon = (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({ tag: "div", text: "\u2B06", attrs: { class: "dd-drop-icon" } });
    const dropText = (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "div",
        attrs: { class: "dd-drop-text" },
        children: [
            (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({ tag: "span", text: params.dropText || "Húzd ide a fájlokat", attrs: { class: "dd-drop-title" } }),
            (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({ tag: "span", text: "vagy kattints a tallózáshoz", attrs: { class: "dd-drop-sub" } }),
        ],
    });
    const dropHint = (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "div",
        attrs: { class: "dd-drop-hint" },
        text: params.accept ? `.${params.accept.join(", .")} f\u00E1jlok` : "B\u00E1rmilyen f\u00E1jl t\u00E1mogatott",
    });
    const dropzone = (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "div",
        attrs: { class: "dd-dropzone" },
        children: [dropIcon, dropText, dropHint, fileListEl],
    });
    dropzone.addEventListener("click", () => {
        hiddenInput.click();
    });
    dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add("dd-drag-over");
    });
    dropzone.addEventListener("dragenter", (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add("dd-drag-over");
    });
    dropzone.addEventListener("dragleave", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!dropzone.contains(e.relatedTarget)) {
            dropzone.classList.remove("dd-drag-over");
        }
    });
    dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove("dd-drag-over");
        if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
            const newFiles = Array.from(e.dataTransfer.files);
            if (params.maxFiles) {
                const allowed = params.maxFiles - files.length;
                files.push(...newFiles.slice(0, allowed));
            }
            else {
                files.push(...newFiles);
            }
            fileListEl.replaceChildren(...renderFileList());
            params.onFiles?.(files);
        }
    });
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "div", parent: params.parent, attrs: rootAttrs,
        children: [
            ...(params.labelText
                ? [(0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({ tag: "label", text: params.labelText, attrs: { class: "dd-label" } })]
                : []),
            dropzone,
            hiddenInput,
        ],
    });
}


/***/ },

/***/ "./src/components/createDrawer.ts"
/*!****************************************!*\
  !*** ./src/components/createDrawer.ts ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   closeDrawer: () => (/* binding */ closeDrawer),
/* harmony export */   createDrawer: () => (/* binding */ createDrawer),
/* harmony export */   openDrawer: () => (/* binding */ openDrawer)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");
/* harmony import */ var _createMenu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./createMenu */ "./src/components/createMenu.ts");


function createDrawer(params) {
    const id = params.id;
    const defaultState = params.defaultState || "closed";
    const hasOverlay = params.hasOverlay ?? false;
    const mode = params.mode || "overlay";
    let overlay = null;
    if (hasOverlay) {
        overlay = (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
            tag: "div",
            attrs: { class: "drawer-overlay", id: `${id}-overlay` },
            handleEvent: {
                event: "click",
                cb: () => closeDrawer(id),
            },
        });
    }
    // Backward compatibility: if items is provided (without children), wrap in createMenu
    const drawerChildren = params.children
        ? params.children
        : params.items
            ? [(0,_createMenu__WEBPACK_IMPORTED_MODULE_1__.createMenu)({ id, items: params.items })]
            : [];
    const sidebar = (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "div",
        attrs: {
            class: `drawer-sidebar${mode === "push" ? " drawer-push" : ""}`,
            id: `${id}-sidebar`,
            "data-drawer-mode": mode,
        },
        children: [
            {
                tag: "div",
                attrs: { class: "drawer-header" },
                children: [
                    {
                        tag: "span",
                        text: params.title || "Menu",
                        attrs: { class: "drawer-title" },
                    },
                    {
                        tag: "button",
                        text: "\u00D7",
                        attrs: { class: "drawer-close-btn" },
                        handleEvent: {
                            event: "click",
                            cb: () => closeDrawer(id),
                        },
                    },
                ],
            },
            ...drawerChildren,
        ],
    });
    if (overlay)
        document.body.appendChild(overlay);
    document.body.appendChild(sidebar);
    if (defaultState === "open") {
        openDrawer(id);
    }
    return sidebar;
}
function openDrawer(id = "sidebar-drawer") {
    const sidebar = document.getElementById(`${id}-sidebar`);
    if (!sidebar)
        return;
    const mode = sidebar.dataset.drawerMode || "overlay";
    const openedBefore = sidebar.dataset.drawerOpenedBefore === "true";
    if (openedBefore) {
        document.body.classList.add("drawer-transition");
    }
    else {
        sidebar.dataset.drawerOpenedBefore = "true";
    }
    const overlay = document.getElementById(`${id}-overlay`);
    if (overlay)
        overlay.classList.add("open");
    sidebar.classList.add("open");
    if (mode === "push") {
        document.body.classList.add("drawer-push-open");
    }
}
function closeDrawer(id = "sidebar-drawer") {
    const sidebar = document.getElementById(`${id}-sidebar`);
    if (!sidebar)
        return;
    const openedBefore = sidebar.dataset.drawerOpenedBefore === "true";
    if (openedBefore) {
        document.body.classList.add("drawer-transition");
    }
    const overlay = document.getElementById(`${id}-overlay`);
    if (overlay)
        overlay.classList.remove("open");
    sidebar.classList.remove("open");
    document.body.classList.remove("drawer-push-open");
}


/***/ },

/***/ "./src/components/createForm.ts"
/*!**************************************!*\
  !*** ./src/components/createForm.ts ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createForm: () => (/* binding */ createForm)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");
/* harmony import */ var _inputs_createTextInput__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../inputs/createTextInput */ "./src/inputs/createTextInput.ts");
/* harmony import */ var _inputs_createTelInput__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../inputs/createTelInput */ "./src/inputs/createTelInput.ts");
/* harmony import */ var _inputs_createUrlInput__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../inputs/createUrlInput */ "./src/inputs/createUrlInput.ts");
/* harmony import */ var _inputs_createSearchInput__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../inputs/createSearchInput */ "./src/inputs/createSearchInput.ts");
/* harmony import */ var _inputs_createEmailInput__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../inputs/createEmailInput */ "./src/inputs/createEmailInput.ts");
/* harmony import */ var _inputs_createPasswordInput__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../inputs/createPasswordInput */ "./src/inputs/createPasswordInput.ts");
/* harmony import */ var _inputs_createNumberInput__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../inputs/createNumberInput */ "./src/inputs/createNumberInput.ts");
/* harmony import */ var _inputs_createDateInput__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../inputs/createDateInput */ "./src/inputs/createDateInput.ts");
/* harmony import */ var _inputs_createDatetimeInput__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../inputs/createDatetimeInput */ "./src/inputs/createDatetimeInput.ts");
/* harmony import */ var _inputs_createTimeInput__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../inputs/createTimeInput */ "./src/inputs/createTimeInput.ts");
/* harmony import */ var _inputs_createMonthInput__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../inputs/createMonthInput */ "./src/inputs/createMonthInput.ts");
/* harmony import */ var _inputs_createWeekInput__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../inputs/createWeekInput */ "./src/inputs/createWeekInput.ts");
/* harmony import */ var _inputs_createCheckbox__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../inputs/createCheckbox */ "./src/inputs/createCheckbox.ts");
/* harmony import */ var _inputs_createColorInput__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../inputs/createColorInput */ "./src/inputs/createColorInput.ts");
/* harmony import */ var _inputs_createFileInput__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../inputs/createFileInput */ "./src/inputs/createFileInput.ts");
/* harmony import */ var _inputs_createRangeInput__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../inputs/createRangeInput */ "./src/inputs/createRangeInput.ts");
/* harmony import */ var _inputs_createHiddenInput__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../inputs/createHiddenInput */ "./src/inputs/createHiddenInput.ts");
/* harmony import */ var _buttons__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../buttons */ "./src/buttons/index.ts");
/* harmony import */ var _selection_createSelect__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../selection/createSelect */ "./src/selection/createSelect.ts");
/* harmony import */ var _selection_createRadio__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../selection/createRadio */ "./src/selection/createRadio.ts");
/* harmony import */ var _createTextarea__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./createTextarea */ "./src/components/createTextarea.ts");






















function cast(input) {
    return input;
}
function getInputFactory(type) {
    const map = {
        text: (p, i) => (0,_inputs_createTextInput__WEBPACK_IMPORTED_MODULE_1__.createTextInput)({ ...cast(i), parent: p, type: "text" }),
        tel: (p, i) => (0,_inputs_createTelInput__WEBPACK_IMPORTED_MODULE_2__.createTelInput)({ ...cast(i), parent: p, type: "tel" }),
        url: (p, i) => (0,_inputs_createUrlInput__WEBPACK_IMPORTED_MODULE_3__.createUrlInput)({ ...cast(i), parent: p, type: "url" }),
        search: (p, i) => (0,_inputs_createSearchInput__WEBPACK_IMPORTED_MODULE_4__.createSearchInput)({ ...cast(i), parent: p, type: "search" }),
        email: (p, i) => (0,_inputs_createEmailInput__WEBPACK_IMPORTED_MODULE_5__.createEmailInput)({ ...cast(i), parent: p, type: "email" }),
        password: (p, i) => (0,_inputs_createPasswordInput__WEBPACK_IMPORTED_MODULE_6__.createPasswordInput)({ ...cast(i), parent: p, type: "password" }),
        number: (p, i) => (0,_inputs_createNumberInput__WEBPACK_IMPORTED_MODULE_7__.createNumberInput)({ ...cast(i), parent: p, type: "number" }),
        date: (p, i) => (0,_inputs_createDateInput__WEBPACK_IMPORTED_MODULE_8__.createDateInput)({ ...cast(i), parent: p, type: "date" }),
        "datetime-local": (p, i) => (0,_inputs_createDatetimeInput__WEBPACK_IMPORTED_MODULE_9__.createDatetimeInput)({ ...cast(i), parent: p, type: "datetime-local" }),
        time: (p, i) => (0,_inputs_createTimeInput__WEBPACK_IMPORTED_MODULE_10__.createTimeInput)({ ...cast(i), parent: p, type: "time" }),
        month: (p, i) => (0,_inputs_createMonthInput__WEBPACK_IMPORTED_MODULE_11__.createMonthInput)({ ...cast(i), parent: p, type: "month" }),
        week: (p, i) => (0,_inputs_createWeekInput__WEBPACK_IMPORTED_MODULE_12__.createWeekInput)({ ...cast(i), parent: p, type: "week" }),
        checkbox: (p, i) => (0,_inputs_createCheckbox__WEBPACK_IMPORTED_MODULE_13__.createCheckbox)({ ...cast(i), parent: p, type: "checkbox" }),
        color: (p, i) => (0,_inputs_createColorInput__WEBPACK_IMPORTED_MODULE_14__.createColorInput)({ ...cast(i), parent: p, type: "color" }),
        file: (p, i) => (0,_inputs_createFileInput__WEBPACK_IMPORTED_MODULE_15__.createFileInput)({ ...cast(i), parent: p, type: "file" }),
        range: (p, i) => (0,_inputs_createRangeInput__WEBPACK_IMPORTED_MODULE_16__.createRangeInput)({ ...cast(i), parent: p, type: "range" }),
        hidden: (p, i) => (0,_inputs_createHiddenInput__WEBPACK_IMPORTED_MODULE_17__.createHiddenInput)({ ...cast(i), parent: p, type: "hidden" }),
        select: (p, i) => (0,_selection_createSelect__WEBPACK_IMPORTED_MODULE_19__.createSelect)({ ...cast(i), parent: p, options: i.options || [] }),
        radio: (p, i) => (0,_selection_createRadio__WEBPACK_IMPORTED_MODULE_20__.createRadio)({ ...cast(i), parent: p, options: (i.options || []) }),
        textarea: (p, i) => (0,_createTextarea__WEBPACK_IMPORTED_MODULE_21__.createTextarea)({ ...cast({ ...i, type: "textarea" }), parent: p }),
        button: (p, i) => (0,_buttons__WEBPACK_IMPORTED_MODULE_18__.createButtonInput)({ ...cast(i), parent: p, type: "button", text: String(i.value ?? i.placeholder ?? "") }),
        submit: (p, i) => (0,_buttons__WEBPACK_IMPORTED_MODULE_18__.createSubmitInput)({ ...cast(i), parent: p, type: "submit", text: String(i.value ?? i.placeholder ?? "Küldés") }),
        reset: (p, i) => (0,_buttons__WEBPACK_IMPORTED_MODULE_18__.createResetInput)({ ...cast(i), parent: p, type: "reset", text: String(i.value ?? i.placeholder ?? "Visszaállítás") }),
    };
    return map[type] || null;
}
function createForm(params) {
    const formAttrs = {};
    if (params.id)
        formAttrs.id = params.id;
    if (params.class)
        formAttrs.class = params.class;
    if (params.action)
        formAttrs.action = params.action;
    if (params.method)
        formAttrs.method = params.method;
    const form = (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "form",
        parent: params.parent,
        attrs: formAttrs,
        handleEvent: params.onSubmit
            ? [{ event: "submit", cb: (e) => { e.preventDefault(); params.onSubmit(e); } }]
            : undefined,
    });
    for (const input of params.inputs) {
        const factory = getInputFactory(input.type);
        if (factory) {
            factory(form, input);
        }
    }
    return form;
}


/***/ },

/***/ "./src/components/createGrid.ts"
/*!**************************************!*\
  !*** ./src/components/createGrid.ts ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createGrid: () => (/* binding */ createGrid)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");

function createGrid(params) {
    const style = { display: "grid", gap: params.gap || "1rem" };
    if (params.columns)
        style.gridTemplateColumns = `repeat(${params.columns}, 1fr)`;
    const attrs = { class: `grid${params.class ? ` ${params.class}` : ""}` };
    if (params.id)
        attrs.id = params.id;
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({ tag: "div", parent: params.parent, attrs, style });
}


/***/ },

/***/ "./src/components/createImage.ts"
/*!***************************************!*\
  !*** ./src/components/createImage.ts ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createImage: () => (/* binding */ createImage)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");

function createImage(params) {
    const children = [];
    const imgAttrs = {
        src: params.src,
        alt: params.alt || "",
        class: "image-element",
    };
    if (params.lazy)
        imgAttrs.loading = "lazy";
    if (params.width)
        imgAttrs.width = params.width;
    if (params.height)
        imgAttrs.height = params.height;
    children.push({ tag: "img", attrs: imgAttrs });
    if (params.caption) {
        children.push({ tag: "figcaption", text: params.caption, attrs: { class: "image-caption" } });
    }
    const rootAttrs = { class: `image-container${params.class ? ` ${params.class}` : ""}` };
    if (params.id)
        rootAttrs.id = params.id;
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({ tag: "figure", parent: params.parent, attrs: rootAttrs, children });
}


/***/ },

/***/ "./src/components/createLink.ts"
/*!**************************************!*\
  !*** ./src/components/createLink.ts ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createLink: () => (/* binding */ createLink)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");

function createLink(params) {
    const rootAttrs = {
        class: `link${params.class ? ` ${params.class}` : ""}`,
        href: params.href,
    };
    if (params.id)
        rootAttrs.id = params.id;
    if (params.target)
        rootAttrs.target = params.target;
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "a",
        parent: params.parent,
        text: params.text,
        attrs: rootAttrs,
        handleEvent: params.click ? { event: "click", cb: params.click } : undefined,
    });
}


/***/ },

/***/ "./src/components/createLists.ts"
/*!***************************************!*\
  !*** ./src/components/createLists.ts ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createOrderedList: () => (/* binding */ createOrderedList),
/* harmony export */   createUnorderedList: () => (/* binding */ createUnorderedList)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");

function createUnorderedList(data, params) {
    const attrs = {
        class: `unsorted-list${params.class ? ` ${params.class}` : ""}`,
    };
    if (params.id)
        attrs.id = params.id;
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        parent: params.parent,
        tag: "ul",
        attrs,
        children: data.map((item, index) => ({
            tag: "li",
            text: item,
            attrs: { id: `${params.id}-${index}`, class: "list-elem" },
        })),
    });
}
function createOrderedList(data, params) {
    const attrs = {
        class: `ordered-list${params.class ? ` ${params.class}` : ""}`,
    };
    if (params.id)
        attrs.id = params.id;
    if (params.start != null)
        attrs.start = params.start;
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        parent: params.parent,
        tag: "ol",
        attrs,
        children: data.map((item, index) => ({
            tag: "li",
            text: item,
            attrs: { id: `${params.id}-${index}`, class: "list-elem" },
        })),
    });
}


/***/ },

/***/ "./src/components/createMenu.ts"
/*!**************************************!*\
  !*** ./src/components/createMenu.ts ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createMenu: () => (/* binding */ createMenu)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");

function buildMenuItem(item) {
    const children = [];
    if (item.href) {
        children.push({
            tag: "a",
            text: item.label,
            attrs: { href: item.href, class: "drawer-link" },
        });
    }
    else {
        children.push({
            tag: "span",
            text: item.label,
            attrs: { class: "drawer-link drawer-link-header" },
        });
    }
    if (item.children && item.children.length > 0) {
        children.push({
            tag: "div",
            attrs: { class: "drawer-submenu" },
            children: item.children.map((child) => ({
                tag: "div",
                attrs: { class: "drawer-subitem" },
                children: [buildMenuItem(child)],
            })),
        });
    }
    return {
        tag: "div",
        attrs: { class: "drawer-item" },
        children,
    };
}
function createMenu(params) {
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "nav",
        attrs: { class: "drawer-nav", id: `${params.id}-nav` },
        children: params.items.map((item) => buildMenuItem(item)),
    });
}


/***/ },

/***/ "./src/components/createModal.ts"
/*!***************************************!*\
  !*** ./src/components/createModal.ts ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   closeModal: () => (/* binding */ closeModal),
/* harmony export */   createModal: () => (/* binding */ createModal),
/* harmony export */   openModal: () => (/* binding */ openModal)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");
/* harmony import */ var _buttons_createButton__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../buttons/createButton */ "./src/buttons/createButton.ts");


function openModal(id) {
    const portal = document.getElementById(`${id}-portal`);
    if (portal) {
        document.body.appendChild(portal);
        portal.style.display = "flex";
        portal.style.opacity = "1";
        portal.classList.remove("hidden");
    }
}
function closeModal(id) {
    const portal = document.getElementById(`${id}-portal`);
    if (portal) {
        portal.classList.add("hidden");
        portal.style.opacity = "0";
        portal.addEventListener("transitionend", () => {
            portal.style.display = "none";
        }, { once: true });
    }
}
function createModal(content, actions, params) {
    const bodyChildren = Array.isArray(content.body) ? content.body : [content.body];
    const modal = (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "div",
        attrs: {
            class: "modal-portal hidden",
            id: `${params.id}-portal`,
        },
        style: {
            position: "fixed",
            width: "100vw",
            height: "100vh",
            top: "0",
            left: "0",
            background: "rgba(0,0,0,0.5)",
            zIndex: "9999",
            transition: "opacity 0.3s ease-in-out",
            display: "none",
            opacity: "0",
            justifyContent: "center",
            alignItems: "center",
        },
        children: [{
                tag: "div",
                style: {
                    background: "white",
                    padding: "1.5rem",
                    borderRadius: "1rem",
                    boxShadow: "0 0.5rem 1rem rgba(0,0,0,0.5)",
                    minWidth: "320px",
                    maxWidth: "90vw",
                    maxHeight: "90vh",
                    overflow: "auto",
                },
                attrs: {
                    class: `modal${params.class ? ` ${params.class}` : ""}`,
                    id: params.id,
                },
                children: [
                    {
                        tag: "div",
                        attrs: { class: "modal-title-container" },
                        style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" },
                        children: [
                            {
                                tag: "h2",
                                attrs: { class: "modal-title" },
                                text: content.modalTitle,
                                style: { margin: 0, fontSize: "1.25rem" },
                            },
                            (0,_buttons_createButton__WEBPACK_IMPORTED_MODULE_1__.createButton)({
                                id: `${params.id}-close-btn`,
                                class: "modal-close-btn",
                                parent: document.body,
                                text: "\u00D7",
                                style: { fontSize: "1.5rem", cursor: "pointer", background: "none", border: "none", padding: "0.25rem", lineHeight: 1 },
                                click: () => {
                                    closeModal(params.id);
                                    actions.closeAction?.();
                                },
                            }),
                        ],
                    },
                    {
                        tag: "div",
                        attrs: { class: "modal-body" },
                        children: bodyChildren,
                    },
                    {
                        tag: "div",
                        attrs: { class: "modal-footer" },
                        style: { display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem", borderTop: "1px solid #e5e7eb", paddingTop: "1rem" },
                        children: [
                            (0,_buttons_createButton__WEBPACK_IMPORTED_MODULE_1__.createButton)({
                                id: `${params.id}-cancel-btn`,
                                parent: document.body,
                                class: "modal-cancel-btn",
                                click: () => { actions.cancelAction?.(); closeModal(params.id); },
                                text: "Mégse",
                            }),
                            (0,_buttons_createButton__WEBPACK_IMPORTED_MODULE_1__.createButton)({
                                id: `${params.id}-ok-btn`,
                                parent: document.body,
                                class: "modal-ok-btn",
                                click: () => { actions.okAction?.(); closeModal(params.id); },
                                text: "OK",
                            }),
                        ],
                    },
                ],
            }],
    });
    document.body.appendChild(modal);
    return modal;
}


/***/ },

/***/ "./src/components/createNav.ts"
/*!*************************************!*\
  !*** ./src/components/createNav.ts ***!
  \*************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createNav: () => (/* binding */ createNav)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");

function buildNavItem(item) {
    const children = [];
    if (item.href) {
        const linkAttrs = { href: item.href };
        if (item.active)
            linkAttrs.class = "active";
        children.push({
            tag: "a",
            text: item.text,
            attrs: linkAttrs,
            handleEvent: item.click ? { event: "click", cb: item.click } : undefined,
        });
    }
    else {
        const spanAttrs = {};
        if (item.active)
            spanAttrs.class = "active";
        children.push({
            tag: "span",
            text: item.text,
            attrs: spanAttrs,
            handleEvent: item.click ? { event: "click", cb: item.click } : undefined,
        });
    }
    if (item.children && item.children.length > 0) {
        children.push({
            tag: "ul",
            attrs: { class: "nav-dropdown" },
            children: item.children.map((child) => ({
                tag: "li",
                children: [buildNavItem(child)],
            })),
        });
    }
    return {
        tag: "li",
        attrs: { class: item.active ? "nav-item active" : "nav-item" },
        children,
    };
}
function createNav(params) {
    const navAttrs = { class: `nav${params.class ? ` ${params.class}` : ""}` };
    if (params.id)
        navAttrs.id = params.id;
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "nav",
        parent: params.parent,
        attrs: navAttrs,
        children: [
            {
                tag: "ul",
                attrs: { class: "nav-list" },
                children: params.items.map((item) => buildNavItem(item)),
            },
        ],
    });
}


/***/ },

/***/ "./src/components/createParagraph.ts"
/*!*******************************************!*\
  !*** ./src/components/createParagraph.ts ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createParagraph: () => (/* binding */ createParagraph)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");

function createParagraph(params) {
    const attrs = {};
    if (params.id)
        attrs.id = params.id;
    if (params.class)
        attrs.class = params.class;
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "p",
        text: params.text,
        parent: params.parent,
        attrs,
    });
}


/***/ },

/***/ "./src/components/createProgressBar.ts"
/*!*********************************************!*\
  !*** ./src/components/createProgressBar.ts ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createProgressBar: () => (/* binding */ createProgressBar)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");

function createProgressBar(params) {
    const max = params.max || 100;
    const percentage = Math.min(Math.max((params.value / max) * 100, 0), 100);
    const children = [];
    if (params.label) {
        children.push({ tag: "div", attrs: { class: "progress-label" }, text: params.label });
    }
    children.push({
        tag: "div",
        attrs: { class: "progress-track" },
        children: [
            {
                tag: "div",
                attrs: { class: "progress-fill" },
                style: {
                    width: `${percentage}%`,
                    backgroundColor: params.color || "#3b82f6",
                    height: "100%",
                    borderRadius: "inherit",
                    transition: "width 0.3s ease",
                },
                text: params.showPercentage ? `${Math.round(percentage)}%` : undefined,
            },
        ],
    });
    const rootAttrs = {
        class: `progress-bar${params.class ? ` ${params.class}` : ""}`,
        role: "progressbar",
        "aria-valuenow": params.value,
        "aria-valuemin": 0,
        "aria-valuemax": max,
    };
    if (params.id)
        rootAttrs.id = params.id;
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "div",
        parent: params.parent,
        attrs: rootAttrs,
        children,
    });
}


/***/ },

/***/ "./src/components/createSpinner.ts"
/*!*****************************************!*\
  !*** ./src/components/createSpinner.ts ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createSpinner: () => (/* binding */ createSpinner)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");

function createSpinner(params) {
    const sizeMap = { sm: "1rem", md: "2rem", lg: "3rem" };
    const size = sizeMap[params.size || "md"];
    const rootAttrs = {
        class: `spinner spinner-${params.size || "md"}${params.class ? ` ${params.class}` : ""}`,
        role: "status",
        "aria-label": "Loading",
    };
    if (params.id)
        rootAttrs.id = params.id;
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "div",
        parent: params.parent,
        attrs: rootAttrs,
        style: {
            width: size,
            height: size,
            border: `3px solid ${params.color || "#ccc"}`,
            borderTopColor: params.color || "#333",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
        },
    });
}


/***/ },

/***/ "./src/components/createTable.ts"
/*!***************************************!*\
  !*** ./src/components/createTable.ts ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createTable: () => (/* binding */ createTable)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");

function createTable(data, params) {
    const p = {
        ...params,
        showHeader: params.showHeader ?? true,
        showFooter: params.showFooter ?? true,
        dataIsArray: Array.isArray(data[0]),
    };
    const cellNames = p.cellNames ?? { sum: "Sum", total: "Total", rowNr: "Row #" };
    let headers;
    let rows;
    if (p.dataIsArray) {
        const arrData = data;
        p.hasHeader = true;
        headers = p.hasHeader
            ? arrData.shift()
            : arrData[0].map((_, index) => `Column #${index}`);
        rows = arrData;
    }
    else {
        const objData = data;
        headers = Object.keys(objData[0]);
        rows = objData.map((row) => Object.values(row));
    }
    const footers = Array(headers.length).fill(0);
    if (p.hasFooter && p.showFooter) {
        rows.forEach((row) => row.forEach((cell, cellIdx) => {
            footers[cellIdx] = footers[cellIdx] + parseFloat(String(cell));
        }));
    }
    if (p.sumRowValues) {
        if (p.hasHeader || !p.dataIsArray)
            headers.push(cellNames.sum);
        const total = footers.reduce((acc, cell) => acc + (Number.isNaN(cell) ? 0 : cell), 0);
        footers.push(total);
        rows.forEach((row) => row.push(row.reduce((acc, cell) => acc + Number(cell), 0)));
    }
    if (p.addRowNumbers) {
        if (p.hasHeader)
            headers.unshift(cellNames.rowNr);
        footers.unshift(0);
        rows.forEach((row, rowIdx) => row.unshift(rowIdx + 1));
    }
    const footerRow = footers.map((val, idx) => {
        if (val === 0 && headers[idx] !== cellNames.total)
            return headers[idx];
        return val;
    });
    const tableChildren = [];
    if (p.showHeader) {
        tableChildren.push((0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
            tag: "thead",
            children: [(0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
                    tag: "tr",
                    attrs: { class: "header-row" },
                    children: headers.map((col, index) => (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
                        tag: "th",
                        text: String(col),
                        attrs: { class: `table-col-${index}` },
                    })),
                })],
        }));
    }
    tableChildren.push((0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "tbody",
        children: rows.map((row, rowInd) => (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
            tag: "tr",
            attrs: { class: `table-row-${rowInd}` },
            children: row.map((col, colIdx) => (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
                tag: p.addRowNumbers && colIdx === 0 ? "th" : "td",
                text: String(col),
                attrs: { class: `table-col-${colIdx}` },
            })),
        })),
    }));
    if (p.showFooter) {
        tableChildren.push((0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
            tag: "tfoot",
            children: [(0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
                    tag: "tr",
                    attrs: { class: "footer-row" },
                    children: footerRow.map((col, index) => (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
                        tag: "th",
                        text: String(col),
                        attrs: { class: `table-col-${index}` },
                    })),
                })],
        }));
    }
    const rootAttrs = { class: `table${params.class ? ` ${params.class}` : ""}` };
    if (params.id)
        rootAttrs.id = params.id;
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        parent: params.parent,
        tag: "table",
        attrs: rootAttrs,
        children: tableChildren,
    });
}


/***/ },

/***/ "./src/components/createTabs.ts"
/*!**************************************!*\
  !*** ./src/components/createTabs.ts ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createTabs: () => (/* binding */ createTabs)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");

function createTabs(params) {
    const activeId = params.activeTab || params.tabs[0]?.id;
    const tabButtons = params.tabs.map((tab) => ({
        tag: "button",
        text: tab.label,
        attrs: {
            class: `tab-button${tab.id === activeId ? " active" : ""}`,
            "data-tab": tab.id,
        },
        handleEvent: {
            event: "click",
            cb: (e) => {
                const target = e.currentTarget;
                const tabId = target.getAttribute("data-tab");
                const container = target.closest(".tabs");
                if (!container)
                    return;
                container.querySelectorAll(".tab-button").forEach((btn) => btn.classList.remove("active"));
                container.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"));
                target.classList.add("active");
                const panel = container.querySelector(`[data-tab-panel="${tabId}"]`);
                if (panel)
                    panel.classList.add("active");
            },
        },
    }));
    const tabPanels = params.tabs.map((tab) => {
        const content = Array.isArray(tab.content) ? tab.content : [tab.content];
        return {
            tag: "div",
            attrs: {
                class: `tab-panel${tab.id === activeId ? " active" : ""}`,
                "data-tab-panel": tab.id,
            },
            children: content,
        };
    });
    const rootAttrs = { class: `tabs${params.class ? ` ${params.class}` : ""}` };
    if (params.id)
        rootAttrs.id = params.id;
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "div",
        parent: params.parent,
        attrs: rootAttrs,
        children: [
            { tag: "div", attrs: { class: "tab-buttons" }, children: tabButtons },
            { tag: "div", attrs: { class: "tab-panels" }, children: tabPanels },
        ],
    });
}


/***/ },

/***/ "./src/components/createTextarea.ts"
/*!******************************************!*\
  !*** ./src/components/createTextarea.ts ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createTextarea: () => (/* binding */ createTextarea)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");

function createTextarea(params) {
    const events = [];
    if (params.onChange)
        events.push({ event: "change", cb: params.onChange });
    if (params.click)
        events.push({ event: "click", cb: params.click });
    if (params.handleEvent)
        events.push(...(Array.isArray(params.handleEvent) ? params.handleEvent : [params.handleEvent]));
    const taAttrs = {
        id: params.id,
        name: params.name || params.id,
        class: `textarea-input${params.class ? ` ${params.class}` : ""}`,
    };
    if (params.placeholder)
        taAttrs.placeholder = params.placeholder;
    if (params.rows != null)
        taAttrs.rows = params.rows;
    if (params.cols != null)
        taAttrs.cols = params.cols;
    const textareaEl = (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "textarea",
        text: params.value != null ? String(params.value) : undefined,
        attrs: taAttrs,
        handleEvent: events.length > 0 ? events : undefined,
    });
    const containerAttrs = { class: `textarea-wrapper${params.class ? ` ${params.class}` : ""}` };
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "div",
        parent: params.parent,
        attrs: containerAttrs,
        children: params.labelText
            ? [(0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({ tag: "label", text: params.labelText, attrs: { for: params.id, class: `textarea-label${params.class ? ` ${params.class}` : ""}` } }), textareaEl]
            : [textareaEl],
    });
}


/***/ },

/***/ "./src/components/createTitle.ts"
/*!***************************************!*\
  !*** ./src/components/createTitle.ts ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createTitle: () => (/* binding */ createTitle)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");

const HEADINGS = ["h1", "h2", "h3", "h4", "h5", "h6"];
function createTitle(params, level = 1) {
    const index = Math.max(1, Math.min(6, Math.abs(level))) - 1;
    const attrs = {};
    if (params.id)
        attrs.id = params.id;
    if (params.class)
        attrs.class = params.class;
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: HEADINGS[index],
        text: params.text,
        parent: params.parent,
        attrs,
    });
}


/***/ },

/***/ "./src/components/createToast.ts"
/*!***************************************!*\
  !*** ./src/components/createToast.ts ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createToast: () => (/* binding */ createToast)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");

/** Cache for toast containers keyed by position */
const containerCache = new Map();
function getContainer(position) {
    const existing = containerCache.get(position);
    if (existing && document.body.contains(existing))
        return existing;
    const container = (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "div",
        parent: "body",
        attrs: { class: `toast-container toast-container-${position}` },
    });
    containerCache.set(position, container);
    return container;
}
function removeToast(toast) {
    toast.style.opacity = "0";
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}
function createToast(params) {
    const duration = params.duration || 3000;
    const position = params.position || "top-right";
    const container = getContainer(position);
    const rootAttrs = {
        class: `toast toast-${params.type || "info"}${params.class ? ` ${params.class}` : ""}`,
        role: "status",
        "aria-live": "polite",
    };
    if (params.id)
        rootAttrs.id = params.id;
    const toast = (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "div",
        parent: container,
        attrs: rootAttrs,
        children: [
            { tag: "span", text: params.message, attrs: { class: "toast-message" } },
            {
                tag: "button",
                text: "\u00D7",
                attrs: { class: "toast-close" },
                handleEvent: {
                    event: "click",
                    cb: (e) => {
                        const t = e.currentTarget.closest(".toast");
                        if (t)
                            removeToast(t);
                    },
                },
            },
        ],
    });
    setTimeout(() => removeToast(toast), duration);
    return toast;
}


/***/ },

/***/ "./src/components/createTooltip.ts"
/*!*****************************************!*\
  !*** ./src/components/createTooltip.ts ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createTooltip: () => (/* binding */ createTooltip)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");

function createTooltip(params) {
    const rootAttrs = {
        class: `tooltip-wrapper${params.class ? ` ${params.class}` : ""}`,
        "data-tooltip": params.text,
        "data-tooltip-position": params.position || "top",
    };
    if (params.id)
        rootAttrs.id = params.id;
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "div",
        parent: params.parent,
        attrs: rootAttrs,
        children: [
            {
                tag: "span",
                attrs: { class: "tooltip-trigger" },
                children: [
                    { tag: "span", text: "\u24D8", attrs: { class: "tooltip-icon" } },
                    { tag: "span", text: "Info", attrs: { class: "tooltip-trigger-text" } },
                ],
            },
            { tag: "span", attrs: { class: "tooltip-content" }, text: params.text },
        ],
        handleEvent: params.trigger === "click"
            ? { event: "click", cb: (e) => { e.currentTarget.classList.toggle("tooltip-active"); } }
            : undefined,
    });
}


/***/ },

/***/ "./src/components/highlighter.ts"
/*!***************************************!*\
  !*** ./src/components/highlighter.ts ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   highlightCode: () => (/* binding */ highlightCode)
/* harmony export */ });
const JS_KEYWORDS = new Set([
    "abstract", "arguments", "async", "await", "boolean", "break", "byte",
    "case", "catch", "char", "class", "const", "continue", "debugger",
    "default", "delete", "do", "double", "else", "enum", "export",
    "extends", "false", "final", "finally", "float", "for", "from",
    "function", "goto", "if", "implements", "import", "in", "instanceof",
    "int", "interface", "let", "long", "native", "new", "null", "of",
    "package", "private", "protected", "public", "return", "short",
    "static", "super", "switch", "synchronized", "this", "throw",
    "throws", "transient", "true", "try", "typeof", "undefined", "var",
    "void", "volatile", "while", "with", "yield",
]);
const TS_KEYWORDS = new Set([
    ...JS_KEYWORDS,
    "any", "constructor", "declare", "enum", "keyof", "module", "namespace",
    "never", "object", "readonly", "require", "set", "get",
    "string", "symbol", "type", "unique", "unknown", "as",
]);
const PY_KEYWORDS = new Set([
    "False", "None", "True", "and", "as", "assert", "async", "await",
    "break", "class", "continue", "def", "del", "elif", "else", "except",
    "finally", "for", "from", "global", "if", "import", "in", "is",
    "lambda", "nonlocal", "not", "or", "pass", "raise", "return",
    "try", "while", "with", "yield", "self", "cls",
]);
const BASH_KEYWORDS = new Set([
    "if", "then", "else", "elif", "fi", "case", "esac", "for", "while",
    "until", "do", "done", "in", "function", "return", "exit", "local",
    "export", "source", "alias", "unalias", "declare", "typeset",
    "readonly", "shift", "trap", "wait", "eval", "exec", "set", "unset",
]);
const BASH_BUILTINS = new Set([
    "echo", "printf", "read", "test", "cd", "pwd", "ls", "cp", "mv", "rm",
    "mkdir", "rmdir", "cat", "head", "tail", "grep", "find", "sed", "awk",
    "sort", "uniq", "wc", "curl", "wget", "chmod", "chown", "ln", "touch",
    "tar", "gzip", "gunzip", "ssh", "scp", "git", "npm", "node", "npx",
    "export", "source", "alias", "history", "env", "which", "type",
]);
const PS_KEYWORDS = new Set([
    "begin", "break", "catch", "class", "continue", "data", "do", "dynamicparam",
    "else", "elseif", "end", "exit", "filter", "finally", "for", "foreach",
    "from", "function", "if", "in", "inlinescript", "param", "process",
    "return", "switch", "throw", "trap", "try", "until", "using", "while",
    "workflow", "where", "foreach", "hidden", "static", "abstract",
]);
const PS_BUILTINS = new Set([
    "Write-Host", "Write-Output", "Write-Error", "Write-Warning", "Write-Verbose",
    "Get-ChildItem", "Set-Location", "Get-Location", "Copy-Item", "Move-Item",
    "Remove-Item", "New-Item", "Get-Content", "Set-Content", "Test-Path",
    "Select-String", "ForEach-Object", "Where-Object", "Sort-Object",
    "Import-Csv", "Export-Csv", "Invoke-Command", "Get-Help", "Get-Command",
    "Out-Null", "Out-File", "Select-Object", "Measure-Object", "Group-Object",
    "ForEach-Object", "Where-Object", "Sort-Object", "Compare-Object",
]);
const JS_BUILTINS = new Set([
    "console", "document", "window", "Math", "JSON", "Array", "Object",
    "String", "Number", "Boolean", "Date", "RegExp", "Error", "Promise",
    "Map", "Set", "WeakMap", "WeakSet", "Symbol", "Proxy", "Reflect",
    "parseInt", "parseFloat", "isNaN", "isFinite", "setTimeout",
    "setInterval", "clearTimeout", "clearInterval", "fetch", "alert",
    "confirm", "prompt", "require", "module", "exports",
]);
const TS_BUILTINS = new Set([
    ...JS_BUILTINS,
    "Record", "Partial", "Required", "Readonly", "Pick", "Omit",
    "Exclude", "Extract", "NonNullable", "ReturnType", "Parameters",
    "HTMLElement", "Event", "NodeList",
]);
const PY_BUILTINS = new Set([
    "print", "len", "range", "int", "str", "float", "list", "dict",
    "set", "tuple", "bool", "type", "input", "open", "super", "property",
    "staticmethod", "classmethod", "enumerate", "zip", "map", "filter",
    "sorted", "reversed", "abs", "max", "min", "sum", "any", "all",
    "isinstance", "issubclass", "hasattr", "getattr", "setattr", "delattr",
    "repr", "id", "hash", "callable", "iter", "next",
]);
function getLanguagePatterns(lang) {
    const patterns = [];
    if (lang === "bash") {
        patterns.push({ regex: /#.*$/gm, className: "hl-comment" });
        patterns.push({ regex: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, className: "hl-string" });
        patterns.push({ regex: /\$\{?[\w]+\}?/g, className: "hl-variable" });
        patterns.push({ regex: /\b\d+\b/g, className: "hl-number" });
        patterns.push({ regex: /[|&;><]+/g, className: "hl-operator" });
        patterns.push({
            regex: new RegExp(`\\b(?:${Array.from(BASH_KEYWORDS).join("|")})\\b`, "g"),
            className: "hl-keyword",
        });
        patterns.push({
            regex: new RegExp(`\\b(?:${Array.from(BASH_BUILTINS).join("|")})\\b`, "g"),
            className: "hl-builtin",
        });
        return patterns;
    }
    if (lang === "powershell") {
        patterns.push({ regex: /#.*$/gm, className: "hl-comment" });
        patterns.push({ regex: /<#[\s\S]*?#>/g, className: "hl-comment" });
        patterns.push({ regex: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, className: "hl-string" });
        patterns.push({ regex: /\$[\w]+/g, className: "hl-variable" });
        patterns.push({ regex: /\b\d+\b/g, className: "hl-number" });
        patterns.push({
            regex: new RegExp(`\\b(?:${Array.from(PS_KEYWORDS).join("|")})\\b`, "g"),
            className: "hl-keyword",
        });
        patterns.push({
            regex: new RegExp(`(?:${Array.from(PS_BUILTINS).join("|")})`, "g"),
            className: "hl-builtin",
        });
        return patterns;
    }
    if (lang === "html") {
        patterns.push({ regex: /&lt;!--[\s\S]*?--&gt;/g, className: "hl-comment" });
        patterns.push({ regex: /&lt;\/?[\w-]+/g, className: "hl-keyword" });
        patterns.push({ regex: /&gt;/g, className: "hl-keyword" });
        patterns.push({ regex: /[\w-]+=/g, className: "hl-attr" });
        patterns.push({ regex: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, className: "hl-string" });
        return patterns;
    }
    if (lang === "css") {
        patterns.push({ regex: /\/\*[\s\S]*?\*\//g, className: "hl-comment" });
        patterns.push({ regex: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, className: "hl-string" });
        patterns.push({ regex: /\b\d+\.?\d*(?:px|em|rem|%|vh|vw|s|ms)?\b/g, className: "hl-number" });
        patterns.push({ regex: /#[\da-fA-F]{3,8}\b/g, className: "hl-number" });
        patterns.push({ regex: /[\w-]+(?=\s*:)/g, className: "hl-attr" });
        patterns.push({ regex: /:[\w-]+/g, className: "hl-keyword" });
        return patterns;
    }
    const keywords = lang === "python" ? PY_KEYWORDS : lang === "typescript" ? TS_KEYWORDS : JS_KEYWORDS;
    const builtins = lang === "python" ? PY_BUILTINS : lang === "typescript" ? TS_BUILTINS : JS_BUILTINS;
    if (lang === "python") {
        patterns.push({ regex: /#.*$/gm, className: "hl-comment" });
        patterns.push({ regex: /"""[\s\S]*?"""|'''[\s\S]*?'''/g, className: "hl-string" });
    }
    else {
        patterns.push({ regex: /\/\/.*$/gm, className: "hl-comment" });
        patterns.push({ regex: /\/\*[\s\S]*?\*\//g, className: "hl-comment" });
    }
    patterns.push({ regex: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/g, className: "hl-string" });
    if (lang === "python") {
        patterns.push({ regex: /\b(?:0x[\da-fA-F]+|0o[0-7]+|0b[01]+|\d+\.?\d*(?:e[+-]?\d+)?)\b/g, className: "hl-number" });
    }
    else {
        patterns.push({ regex: /\b\d+\.?\d*(?:e[+-]?\d+)?\b/g, className: "hl-number" });
    }
    patterns.push({ regex: /[=!<>&|+\-*/%]+/g, className: "hl-operator" });
    patterns.push({
        regex: new RegExp(`\\b(?:${Array.from(keywords).join("|")})\\b`, "g"),
        className: "hl-keyword",
    });
    patterns.push({
        regex: new RegExp(`\\b(?:${Array.from(builtins).join("|")})\\b`, "g"),
        className: "hl-builtin",
    });
    if (lang === "typescript") {
        patterns.push({ regex: /\b(?:string|number|boolean|any|void|never|null|undefined|unknown|object|symbol|bigint)\b/g, className: "hl-type" });
    }
    if (lang === "python") {
        patterns.push({ regex: /\b(?:class|def)\s+(\w+)/g, className: "hl-function" });
    }
    else {
        patterns.push({ regex: /\b(?:function|class)\s+(\w+)/g, className: "hl-function" });
        patterns.push({ regex: /(\w+)\s*(?=\()/g, className: "hl-function" });
    }
    return patterns;
}
function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
function highlightCode(code, language) {
    if (!language)
        return escapeHtml(code);
    const lang = language.toLowerCase();
    const validLangs = ["javascript", "typescript", "python", "bash", "powershell", "html", "css"];
    if (!validLangs.includes(lang)) {
        return escapeHtml(code);
    }
    const patterns = getLanguagePatterns(lang);
    const tokens = [];
    for (const pattern of patterns) {
        const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
        let match;
        while ((match = regex.exec(code)) !== null) {
            const start = match.index;
            const end = start + match[0].length;
            const overlap = tokens.some((t) => start < t.end && end > t.start);
            if (!overlap) {
                tokens.push({ start, end, className: pattern.className });
            }
        }
    }
    tokens.sort((a, b) => a.start - b.start);
    let result = "";
    let lastEnd = 0;
    for (const token of tokens) {
        if (token.start > lastEnd) {
            result += escapeHtml(code.slice(lastEnd, token.start));
        }
        result += `<span class="${token.className}">${escapeHtml(code.slice(token.start, token.end))}</span>`;
        lastEnd = token.end;
    }
    if (lastEnd < code.length) {
        result += escapeHtml(code.slice(lastEnd));
    }
    return result;
}


/***/ },

/***/ "./src/components/index.ts"
/*!*********************************!*\
  !*** ./src/components/index.ts ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   asyncImage: () => (/* reexport safe */ _asyncImage__WEBPACK_IMPORTED_MODULE_36__.asyncImage),
/* harmony export */   closeDrawer: () => (/* reexport safe */ _createDrawer__WEBPACK_IMPORTED_MODULE_26__.closeDrawer),
/* harmony export */   closeModal: () => (/* reexport safe */ _createModal__WEBPACK_IMPORTED_MODULE_30__.closeModal),
/* harmony export */   createAccordion: () => (/* reexport safe */ _createAccordion__WEBPACK_IMPORTED_MODULE_16__.createAccordion),
/* harmony export */   createAlert: () => (/* reexport safe */ _createAlert__WEBPACK_IMPORTED_MODULE_6__.createAlert),
/* harmony export */   createAvatar: () => (/* reexport safe */ _createAvatar__WEBPACK_IMPORTED_MODULE_18__.createAvatar),
/* harmony export */   createBadge: () => (/* reexport safe */ _createBadge__WEBPACK_IMPORTED_MODULE_8__.createBadge),
/* harmony export */   createBlockquote: () => (/* reexport safe */ _createBlockquote__WEBPACK_IMPORTED_MODULE_14__.createBlockquote),
/* harmony export */   createBreadcrumb: () => (/* reexport safe */ _createBreadcrumb__WEBPACK_IMPORTED_MODULE_4__.createBreadcrumb),
/* harmony export */   createCard: () => (/* reexport safe */ _createCard__WEBPACK_IMPORTED_MODULE_0__.createCard),
/* harmony export */   createCarousel: () => (/* reexport safe */ _createCarousel__WEBPACK_IMPORTED_MODULE_37__.createCarousel),
/* harmony export */   createCodeBlock: () => (/* reexport safe */ _createCodeBlock__WEBPACK_IMPORTED_MODULE_13__.createCodeBlock),
/* harmony export */   createContainer: () => (/* reexport safe */ _createContainer__WEBPACK_IMPORTED_MODULE_1__.createContainer),
/* harmony export */   createCustomDatePicker: () => (/* reexport safe */ _createCustomDatePicker__WEBPACK_IMPORTED_MODULE_20__.createCustomDatePicker),
/* harmony export */   createCustomDateRangePicker: () => (/* reexport safe */ _createCustomDateRangePicker__WEBPACK_IMPORTED_MODULE_24__.createCustomDateRangePicker),
/* harmony export */   createCustomDateTimePicker: () => (/* reexport safe */ _createCustomDateTimePicker__WEBPACK_IMPORTED_MODULE_23__.createCustomDateTimePicker),
/* harmony export */   createCustomMonthPicker: () => (/* reexport safe */ _createCustomMonthPicker__WEBPACK_IMPORTED_MODULE_22__.createCustomMonthPicker),
/* harmony export */   createCustomSelect: () => (/* reexport safe */ _createCustomSelect__WEBPACK_IMPORTED_MODULE_19__.createCustomSelect),
/* harmony export */   createCustomWeekPicker: () => (/* reexport safe */ _createCustomWeekPicker__WEBPACK_IMPORTED_MODULE_21__.createCustomWeekPicker),
/* harmony export */   createDivider: () => (/* reexport safe */ _createDivider__WEBPACK_IMPORTED_MODULE_15__.createDivider),
/* harmony export */   createDragAndDropFileInput: () => (/* reexport safe */ _createDragAndDropFileInput__WEBPACK_IMPORTED_MODULE_25__.createDragAndDropFileInput),
/* harmony export */   createDrawer: () => (/* reexport safe */ _createDrawer__WEBPACK_IMPORTED_MODULE_26__.createDrawer),
/* harmony export */   createForm: () => (/* reexport safe */ _createForm__WEBPACK_IMPORTED_MODULE_29__.createForm),
/* harmony export */   createGrid: () => (/* reexport safe */ _createGrid__WEBPACK_IMPORTED_MODULE_2__.createGrid),
/* harmony export */   createImage: () => (/* reexport safe */ _createImage__WEBPACK_IMPORTED_MODULE_11__.createImage),
/* harmony export */   createLink: () => (/* reexport safe */ _createLink__WEBPACK_IMPORTED_MODULE_12__.createLink),
/* harmony export */   createMenu: () => (/* reexport safe */ _createMenu__WEBPACK_IMPORTED_MODULE_27__.createMenu),
/* harmony export */   createModal: () => (/* reexport safe */ _createModal__WEBPACK_IMPORTED_MODULE_30__.createModal),
/* harmony export */   createNav: () => (/* reexport safe */ _createNav__WEBPACK_IMPORTED_MODULE_3__.createNav),
/* harmony export */   createOrderedList: () => (/* reexport safe */ _createLists__WEBPACK_IMPORTED_MODULE_33__.createOrderedList),
/* harmony export */   createParagraph: () => (/* reexport safe */ _createParagraph__WEBPACK_IMPORTED_MODULE_31__.createParagraph),
/* harmony export */   createProgressBar: () => (/* reexport safe */ _createProgressBar__WEBPACK_IMPORTED_MODULE_10__.createProgressBar),
/* harmony export */   createSpinner: () => (/* reexport safe */ _createSpinner__WEBPACK_IMPORTED_MODULE_9__.createSpinner),
/* harmony export */   createTable: () => (/* reexport safe */ _createTable__WEBPACK_IMPORTED_MODULE_34__.createTable),
/* harmony export */   createTabs: () => (/* reexport safe */ _createTabs__WEBPACK_IMPORTED_MODULE_5__.createTabs),
/* harmony export */   createTextarea: () => (/* reexport safe */ _createTextarea__WEBPACK_IMPORTED_MODULE_28__.createTextarea),
/* harmony export */   createTitle: () => (/* reexport safe */ _createTitle__WEBPACK_IMPORTED_MODULE_32__.createTitle),
/* harmony export */   createToast: () => (/* reexport safe */ _createToast__WEBPACK_IMPORTED_MODULE_7__.createToast),
/* harmony export */   createTooltip: () => (/* reexport safe */ _createTooltip__WEBPACK_IMPORTED_MODULE_17__.createTooltip),
/* harmony export */   createUnorderedList: () => (/* reexport safe */ _createLists__WEBPACK_IMPORTED_MODULE_33__.createUnorderedList),
/* harmony export */   newLine: () => (/* reexport safe */ _newLine__WEBPACK_IMPORTED_MODULE_35__.newLine),
/* harmony export */   openDrawer: () => (/* reexport safe */ _createDrawer__WEBPACK_IMPORTED_MODULE_26__.openDrawer),
/* harmony export */   openModal: () => (/* reexport safe */ _createModal__WEBPACK_IMPORTED_MODULE_30__.openModal)
/* harmony export */ });
/* harmony import */ var _createCard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createCard */ "./src/components/createCard.ts");
/* harmony import */ var _createContainer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./createContainer */ "./src/components/createContainer.ts");
/* harmony import */ var _createGrid__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./createGrid */ "./src/components/createGrid.ts");
/* harmony import */ var _createNav__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./createNav */ "./src/components/createNav.ts");
/* harmony import */ var _createBreadcrumb__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./createBreadcrumb */ "./src/components/createBreadcrumb.ts");
/* harmony import */ var _createTabs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./createTabs */ "./src/components/createTabs.ts");
/* harmony import */ var _createAlert__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./createAlert */ "./src/components/createAlert.ts");
/* harmony import */ var _createToast__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./createToast */ "./src/components/createToast.ts");
/* harmony import */ var _createBadge__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./createBadge */ "./src/components/createBadge.ts");
/* harmony import */ var _createSpinner__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./createSpinner */ "./src/components/createSpinner.ts");
/* harmony import */ var _createProgressBar__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./createProgressBar */ "./src/components/createProgressBar.ts");
/* harmony import */ var _createImage__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./createImage */ "./src/components/createImage.ts");
/* harmony import */ var _createLink__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./createLink */ "./src/components/createLink.ts");
/* harmony import */ var _createCodeBlock__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./createCodeBlock */ "./src/components/createCodeBlock.ts");
/* harmony import */ var _createBlockquote__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./createBlockquote */ "./src/components/createBlockquote.ts");
/* harmony import */ var _createDivider__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./createDivider */ "./src/components/createDivider.ts");
/* harmony import */ var _createAccordion__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./createAccordion */ "./src/components/createAccordion.ts");
/* harmony import */ var _createTooltip__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./createTooltip */ "./src/components/createTooltip.ts");
/* harmony import */ var _createAvatar__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./createAvatar */ "./src/components/createAvatar.ts");
/* harmony import */ var _createCustomSelect__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./createCustomSelect */ "./src/components/createCustomSelect.ts");
/* harmony import */ var _createCustomDatePicker__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./createCustomDatePicker */ "./src/components/createCustomDatePicker.ts");
/* harmony import */ var _createCustomWeekPicker__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./createCustomWeekPicker */ "./src/components/createCustomWeekPicker.ts");
/* harmony import */ var _createCustomMonthPicker__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./createCustomMonthPicker */ "./src/components/createCustomMonthPicker.ts");
/* harmony import */ var _createCustomDateTimePicker__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./createCustomDateTimePicker */ "./src/components/createCustomDateTimePicker.ts");
/* harmony import */ var _createCustomDateRangePicker__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./createCustomDateRangePicker */ "./src/components/createCustomDateRangePicker.ts");
/* harmony import */ var _createDragAndDropFileInput__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./createDragAndDropFileInput */ "./src/components/createDragAndDropFileInput.ts");
/* harmony import */ var _createDrawer__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./createDrawer */ "./src/components/createDrawer.ts");
/* harmony import */ var _createMenu__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./createMenu */ "./src/components/createMenu.ts");
/* harmony import */ var _createTextarea__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./createTextarea */ "./src/components/createTextarea.ts");
/* harmony import */ var _createForm__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./createForm */ "./src/components/createForm.ts");
/* harmony import */ var _createModal__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./createModal */ "./src/components/createModal.ts");
/* harmony import */ var _createParagraph__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./createParagraph */ "./src/components/createParagraph.ts");
/* harmony import */ var _createTitle__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./createTitle */ "./src/components/createTitle.ts");
/* harmony import */ var _createLists__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ./createLists */ "./src/components/createLists.ts");
/* harmony import */ var _createTable__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ./createTable */ "./src/components/createTable.ts");
/* harmony import */ var _newLine__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! ./newLine */ "./src/components/newLine.ts");
/* harmony import */ var _asyncImage__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! ./asyncImage */ "./src/components/asyncImage.ts");
/* harmony import */ var _createCarousel__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! ./createCarousel */ "./src/components/createCarousel.ts");








































/***/ },

/***/ "./src/components/newLine.ts"
/*!***********************************!*\
  !*** ./src/components/newLine.ts ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   newLine: () => (/* binding */ newLine)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");

function newLine(parent) {
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({ parent, tag: "br" });
}


/***/ },

/***/ "./src/helpers.ts"
/*!************************!*\
  !*** ./src/helpers.ts ***!
  \************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createInputChildren: () => (/* binding */ createInputChildren),
/* harmony export */   createInputContainer: () => (/* binding */ createInputContainer),
/* harmony export */   createInputElem: () => (/* binding */ createInputElem)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");

function createInputElem(elemType, params) {
    const events = [];
    if (params.onChange)
        events.push({ event: "change", cb: params.onChange });
    if (params.click)
        events.push({ event: "click", cb: params.click });
    if (params.handleEvent) {
        events.push(...(Array.isArray(params.handleEvent) ? params.handleEvent : [params.handleEvent]));
    }
    const attrs = {
        name: params.name || params.id,
        class: `${params.type || elemType}-input${params.class ? ` ${params.class}` : ""}`,
    };
    if (params.id)
        attrs.id = params.id;
    if (params.value != null)
        attrs.value = params.value;
    if (params.type)
        attrs.type = params.type;
    if (params.checked != null)
        attrs.checked = params.checked;
    if (params.placeholder)
        attrs.placeholder = params.placeholder;
    if (params.min != null)
        attrs.min = params.min;
    if (params.max != null)
        attrs.max = params.max;
    if (params.step != null)
        attrs.step = params.step;
    if (params.rows != null)
        attrs.rows = params.rows;
    if (params.cols != null)
        attrs.cols = params.cols;
    if (params.start != null)
        attrs.start = params.start;
    return {
        tag: elemType,
        text: params.value != null ? String(params.value) : undefined,
        attrs,
        handleEvent: events.length > 0 ? events : undefined,
    };
}
function createInputChildren(elemType, params) {
    const inputOpts = createInputElem(elemType, params);
    const inputEl = (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)(inputOpts);
    if (!params.labelText)
        return [inputEl];
    const labelEl = (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "label",
        text: params.labelText,
        attrs: {
            for: params.id,
            class: `${elemType}-label${params.class ? ` ${params.class}` : ""}`,
        },
    });
    return params.labelfirst !== false ? [labelEl, inputEl] : [inputEl, labelEl];
}
function createInputContainer(params, children) {
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "div",
        parent: params.parent,
        attrs: {
            class: `${params.type || "text"}-input${params.class ? ` ${params.class}` : ""}`,
        },
        children,
    });
}


/***/ },

/***/ "./src/index.ts"
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   asyncImage: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.asyncImage),
/* harmony export */   closeDrawer: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.closeDrawer),
/* harmony export */   closeModal: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.closeModal),
/* harmony export */   createAccordion: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createAccordion),
/* harmony export */   createAlert: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createAlert),
/* harmony export */   createAvatar: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createAvatar),
/* harmony export */   createBadge: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createBadge),
/* harmony export */   createBlockquote: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createBlockquote),
/* harmony export */   createBreadcrumb: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createBreadcrumb),
/* harmony export */   createButton: () => (/* reexport safe */ _buttons_createButton__WEBPACK_IMPORTED_MODULE_17__.createButton),
/* harmony export */   createButtonInput: () => (/* reexport safe */ _buttons_createButtonInput__WEBPACK_IMPORTED_MODULE_18__.createButtonInput),
/* harmony export */   createCard: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createCard),
/* harmony export */   createCarousel: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createCarousel),
/* harmony export */   createCheckbox: () => (/* reexport safe */ _inputs_createCheckbox__WEBPACK_IMPORTED_MODULE_12__.createCheckbox),
/* harmony export */   createCodeBlock: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createCodeBlock),
/* harmony export */   createColorInput: () => (/* reexport safe */ _inputs_createColorInput__WEBPACK_IMPORTED_MODULE_13__.createColorInput),
/* harmony export */   createContainer: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createContainer),
/* harmony export */   createCustomDatePicker: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createCustomDatePicker),
/* harmony export */   createCustomDateRangePicker: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createCustomDateRangePicker),
/* harmony export */   createCustomDateTimePicker: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createCustomDateTimePicker),
/* harmony export */   createCustomMonthPicker: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createCustomMonthPicker),
/* harmony export */   createCustomSelect: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createCustomSelect),
/* harmony export */   createCustomWeekPicker: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createCustomWeekPicker),
/* harmony export */   createDateInput: () => (/* reexport safe */ _inputs_createDateInput__WEBPACK_IMPORTED_MODULE_7__.createDateInput),
/* harmony export */   createDatetimeInput: () => (/* reexport safe */ _inputs_createDatetimeInput__WEBPACK_IMPORTED_MODULE_8__.createDatetimeInput),
/* harmony export */   createDivider: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createDivider),
/* harmony export */   createDragAndDropFileInput: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createDragAndDropFileInput),
/* harmony export */   createDrawer: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createDrawer),
/* harmony export */   createEmailInput: () => (/* reexport safe */ _inputs_createEmailInput__WEBPACK_IMPORTED_MODULE_4__.createEmailInput),
/* harmony export */   createFileInput: () => (/* reexport safe */ _inputs_createFileInput__WEBPACK_IMPORTED_MODULE_14__.createFileInput),
/* harmony export */   createForm: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createForm),
/* harmony export */   createGrid: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createGrid),
/* harmony export */   createHiddenInput: () => (/* reexport safe */ _inputs_createHiddenInput__WEBPACK_IMPORTED_MODULE_16__.createHiddenInput),
/* harmony export */   createImage: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createImage),
/* harmony export */   createLink: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createLink),
/* harmony export */   createMenu: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createMenu),
/* harmony export */   createModal: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createModal),
/* harmony export */   createMonthInput: () => (/* reexport safe */ _inputs_createMonthInput__WEBPACK_IMPORTED_MODULE_10__.createMonthInput),
/* harmony export */   createNav: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createNav),
/* harmony export */   createNumberInput: () => (/* reexport safe */ _inputs_createNumberInput__WEBPACK_IMPORTED_MODULE_6__.createNumberInput),
/* harmony export */   createOrderedList: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createOrderedList),
/* harmony export */   createParagraph: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createParagraph),
/* harmony export */   createPasswordInput: () => (/* reexport safe */ _inputs_createPasswordInput__WEBPACK_IMPORTED_MODULE_5__.createPasswordInput),
/* harmony export */   createProgressBar: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createProgressBar),
/* harmony export */   createRadio: () => (/* reexport safe */ _selection_createRadio__WEBPACK_IMPORTED_MODULE_22__.createRadio),
/* harmony export */   createRangeInput: () => (/* reexport safe */ _inputs_createRangeInput__WEBPACK_IMPORTED_MODULE_15__.createRangeInput),
/* harmony export */   createResetInput: () => (/* reexport safe */ _buttons_createResetInput__WEBPACK_IMPORTED_MODULE_20__.createResetInput),
/* harmony export */   createSearchInput: () => (/* reexport safe */ _inputs_createSearchInput__WEBPACK_IMPORTED_MODULE_3__.createSearchInput),
/* harmony export */   createSelect: () => (/* reexport safe */ _selection_createSelect__WEBPACK_IMPORTED_MODULE_21__.createSelect),
/* harmony export */   createSpinner: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createSpinner),
/* harmony export */   createSubmitInput: () => (/* reexport safe */ _buttons_createSubmitInput__WEBPACK_IMPORTED_MODULE_19__.createSubmitInput),
/* harmony export */   createTable: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createTable),
/* harmony export */   createTabs: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createTabs),
/* harmony export */   createTelInput: () => (/* reexport safe */ _inputs_createTelInput__WEBPACK_IMPORTED_MODULE_1__.createTelInput),
/* harmony export */   createTextInput: () => (/* reexport safe */ _inputs_createTextInput__WEBPACK_IMPORTED_MODULE_0__.createTextInput),
/* harmony export */   createTextarea: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createTextarea),
/* harmony export */   createTimeInput: () => (/* reexport safe */ _inputs_createTimeInput__WEBPACK_IMPORTED_MODULE_9__.createTimeInput),
/* harmony export */   createTitle: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createTitle),
/* harmony export */   createToast: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createToast),
/* harmony export */   createTooltip: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createTooltip),
/* harmony export */   createUnorderedList: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.createUnorderedList),
/* harmony export */   createUrlInput: () => (/* reexport safe */ _inputs_createUrlInput__WEBPACK_IMPORTED_MODULE_2__.createUrlInput),
/* harmony export */   createWeekInput: () => (/* reexport safe */ _inputs_createWeekInput__WEBPACK_IMPORTED_MODULE_11__.createWeekInput),
/* harmony export */   newLine: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.newLine),
/* harmony export */   openDrawer: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.openDrawer),
/* harmony export */   openModal: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_23__.openModal)
/* harmony export */ });
/* harmony import */ var _inputs_createTextInput__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./inputs/createTextInput */ "./src/inputs/createTextInput.ts");
/* harmony import */ var _inputs_createTelInput__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./inputs/createTelInput */ "./src/inputs/createTelInput.ts");
/* harmony import */ var _inputs_createUrlInput__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./inputs/createUrlInput */ "./src/inputs/createUrlInput.ts");
/* harmony import */ var _inputs_createSearchInput__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./inputs/createSearchInput */ "./src/inputs/createSearchInput.ts");
/* harmony import */ var _inputs_createEmailInput__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./inputs/createEmailInput */ "./src/inputs/createEmailInput.ts");
/* harmony import */ var _inputs_createPasswordInput__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./inputs/createPasswordInput */ "./src/inputs/createPasswordInput.ts");
/* harmony import */ var _inputs_createNumberInput__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./inputs/createNumberInput */ "./src/inputs/createNumberInput.ts");
/* harmony import */ var _inputs_createDateInput__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./inputs/createDateInput */ "./src/inputs/createDateInput.ts");
/* harmony import */ var _inputs_createDatetimeInput__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./inputs/createDatetimeInput */ "./src/inputs/createDatetimeInput.ts");
/* harmony import */ var _inputs_createTimeInput__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./inputs/createTimeInput */ "./src/inputs/createTimeInput.ts");
/* harmony import */ var _inputs_createMonthInput__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./inputs/createMonthInput */ "./src/inputs/createMonthInput.ts");
/* harmony import */ var _inputs_createWeekInput__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./inputs/createWeekInput */ "./src/inputs/createWeekInput.ts");
/* harmony import */ var _inputs_createCheckbox__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./inputs/createCheckbox */ "./src/inputs/createCheckbox.ts");
/* harmony import */ var _inputs_createColorInput__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./inputs/createColorInput */ "./src/inputs/createColorInput.ts");
/* harmony import */ var _inputs_createFileInput__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./inputs/createFileInput */ "./src/inputs/createFileInput.ts");
/* harmony import */ var _inputs_createRangeInput__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./inputs/createRangeInput */ "./src/inputs/createRangeInput.ts");
/* harmony import */ var _inputs_createHiddenInput__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./inputs/createHiddenInput */ "./src/inputs/createHiddenInput.ts");
/* harmony import */ var _buttons_createButton__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./buttons/createButton */ "./src/buttons/createButton.ts");
/* harmony import */ var _buttons_createButtonInput__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./buttons/createButtonInput */ "./src/buttons/createButtonInput.ts");
/* harmony import */ var _buttons_createSubmitInput__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./buttons/createSubmitInput */ "./src/buttons/createSubmitInput.ts");
/* harmony import */ var _buttons_createResetInput__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./buttons/createResetInput */ "./src/buttons/createResetInput.ts");
/* harmony import */ var _selection_createSelect__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./selection/createSelect */ "./src/selection/createSelect.ts");
/* harmony import */ var _selection_createRadio__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./selection/createRadio */ "./src/selection/createRadio.ts");
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./components */ "./src/components/index.ts");


























/***/ },

/***/ "./src/inputs/createCheckbox.ts"
/*!**************************************!*\
  !*** ./src/inputs/createCheckbox.ts ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createCheckbox: () => (/* binding */ createCheckbox)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers */ "./src/helpers.ts");

function createCheckbox(params) {
    const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "checkbox" };
    return (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.createInputContainer)(conf, (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.createInputChildren)("input", conf));
}


/***/ },

/***/ "./src/inputs/createColorInput.ts"
/*!****************************************!*\
  !*** ./src/inputs/createColorInput.ts ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createColorInput: () => (/* binding */ createColorInput)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers */ "./src/helpers.ts");

function createColorInput(params) {
    const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "color" };
    return (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.createInputContainer)(conf, (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.createInputChildren)("input", conf));
}


/***/ },

/***/ "./src/inputs/createDateInput.ts"
/*!***************************************!*\
  !*** ./src/inputs/createDateInput.ts ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createDateInput: () => (/* binding */ createDateInput)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers */ "./src/helpers.ts");

function createDateInput(params) {
    const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "date" };
    return (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.createInputContainer)(conf, (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.createInputChildren)("input", conf));
}


/***/ },

/***/ "./src/inputs/createDatetimeInput.ts"
/*!*******************************************!*\
  !*** ./src/inputs/createDatetimeInput.ts ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createDatetimeInput: () => (/* binding */ createDatetimeInput)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers */ "./src/helpers.ts");

function createDatetimeInput(params) {
    const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "datetime-local" };
    return (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.createInputContainer)(conf, (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.createInputChildren)("input", conf));
}


/***/ },

/***/ "./src/inputs/createEmailInput.ts"
/*!****************************************!*\
  !*** ./src/inputs/createEmailInput.ts ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createEmailInput: () => (/* binding */ createEmailInput)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers */ "./src/helpers.ts");

function createEmailInput(params) {
    const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "email" };
    return (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.createInputContainer)(conf, (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.createInputChildren)("input", conf));
}


/***/ },

/***/ "./src/inputs/createFileInput.ts"
/*!***************************************!*\
  !*** ./src/inputs/createFileInput.ts ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createFileInput: () => (/* binding */ createFileInput)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers */ "./src/helpers.ts");

function createFileInput(params) {
    const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "file" };
    return (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.createInputContainer)(conf, (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.createInputChildren)("input", conf));
}


/***/ },

/***/ "./src/inputs/createHiddenInput.ts"
/*!*****************************************!*\
  !*** ./src/inputs/createHiddenInput.ts ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createHiddenInput: () => (/* binding */ createHiddenInput)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers */ "./src/helpers.ts");


function createHiddenInput(params) {
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        ...(0,_helpers__WEBPACK_IMPORTED_MODULE_1__.createInputElem)("input", { ...params, type: "hidden" }),
        parent: params.parent,
    });
}


/***/ },

/***/ "./src/inputs/createMonthInput.ts"
/*!****************************************!*\
  !*** ./src/inputs/createMonthInput.ts ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createMonthInput: () => (/* binding */ createMonthInput)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers */ "./src/helpers.ts");

function createMonthInput(params) {
    const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "month" };
    return (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.createInputContainer)(conf, (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.createInputChildren)("input", conf));
}


/***/ },

/***/ "./src/inputs/createNumberInput.ts"
/*!*****************************************!*\
  !*** ./src/inputs/createNumberInput.ts ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createNumberInput: () => (/* binding */ createNumberInput)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers */ "./src/helpers.ts");

function createNumberInput(params) {
    const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "number" };
    return (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.createInputContainer)(conf, (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.createInputChildren)("input", conf));
}


/***/ },

/***/ "./src/inputs/createPasswordInput.ts"
/*!*******************************************!*\
  !*** ./src/inputs/createPasswordInput.ts ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPasswordInput: () => (/* binding */ createPasswordInput)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers */ "./src/helpers.ts");

function createPasswordInput(params) {
    const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "password" };
    return (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.createInputContainer)(conf, (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.createInputChildren)("input", conf));
}


/***/ },

/***/ "./src/inputs/createRangeInput.ts"
/*!****************************************!*\
  !*** ./src/inputs/createRangeInput.ts ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createRangeInput: () => (/* binding */ createRangeInput)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers */ "./src/helpers.ts");

function createRangeInput(params) {
    const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "range" };
    return (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.createInputContainer)(conf, (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.createInputChildren)("input", conf));
}


/***/ },

/***/ "./src/inputs/createSearchInput.ts"
/*!*****************************************!*\
  !*** ./src/inputs/createSearchInput.ts ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createSearchInput: () => (/* binding */ createSearchInput)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers */ "./src/helpers.ts");

function createSearchInput(params) {
    const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "search" };
    return (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.createInputContainer)(conf, (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.createInputChildren)("input", conf));
}


/***/ },

/***/ "./src/inputs/createTelInput.ts"
/*!**************************************!*\
  !*** ./src/inputs/createTelInput.ts ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createTelInput: () => (/* binding */ createTelInput)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers */ "./src/helpers.ts");

function createTelInput(params) {
    const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "tel" };
    return (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.createInputContainer)(conf, (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.createInputChildren)("input", conf));
}


/***/ },

/***/ "./src/inputs/createTextInput.ts"
/*!***************************************!*\
  !*** ./src/inputs/createTextInput.ts ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createTextInput: () => (/* binding */ createTextInput)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers */ "./src/helpers.ts");

function createTextInput(params) {
    const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "text" };
    return (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.createInputContainer)(conf, (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.createInputChildren)("input", conf));
}


/***/ },

/***/ "./src/inputs/createTimeInput.ts"
/*!***************************************!*\
  !*** ./src/inputs/createTimeInput.ts ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createTimeInput: () => (/* binding */ createTimeInput)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers */ "./src/helpers.ts");

function createTimeInput(params) {
    const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "time" };
    return (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.createInputContainer)(conf, (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.createInputChildren)("input", conf));
}


/***/ },

/***/ "./src/inputs/createUrlInput.ts"
/*!**************************************!*\
  !*** ./src/inputs/createUrlInput.ts ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createUrlInput: () => (/* binding */ createUrlInput)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers */ "./src/helpers.ts");

function createUrlInput(params) {
    const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "url" };
    return (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.createInputContainer)(conf, (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.createInputChildren)("input", conf));
}


/***/ },

/***/ "./src/inputs/createWeekInput.ts"
/*!***************************************!*\
  !*** ./src/inputs/createWeekInput.ts ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createWeekInput: () => (/* binding */ createWeekInput)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers */ "./src/helpers.ts");

function createWeekInput(params) {
    const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "week" };
    return (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.createInputContainer)(conf, (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.createInputChildren)("input", conf));
}


/***/ },

/***/ "./src/selection/createRadio.ts"
/*!**************************************!*\
  !*** ./src/selection/createRadio.ts ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createRadio: () => (/* binding */ createRadio)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");

function createRadio(params) {
    const radioOptions = params.options.map((option, index) => {
        const checked = typeof params.value === "string"
            ? option.text === params.value
            : typeof params.value === "number"
                ? params.value === index + 1
                : false;
        const children = [
            (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
                tag: "input",
                attrs: { type: "radio", id: `${params.id}-${option.value}`, name: params.name || params.id, value: option.value, checked },
            }),
            (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
                tag: "label",
                text: option.text,
                attrs: { for: `${params.id}-${option.value}` },
            }),
        ];
        if (params.labelfirst === true)
            children.reverse();
        return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
            tag: "div",
            attrs: { class: "radio-option" },
            children,
        });
    });
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "div",
        parent: params.parent,
        attrs: { class: `radio-group${params.class ? ` ${params.class}` : ""}` },
        children: radioOptions,
    });
}


/***/ },

/***/ "./src/selection/createSelect.ts"
/*!***************************************!*\
  !*** ./src/selection/createSelect.ts ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createSelect: () => (/* binding */ createSelect)
/* harmony export */ });
/* harmony import */ var domelemjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! domelemjs */ "./node_modules/domelemjs/dist/index.js");

function createSelect(params) {
    const optionChildren = params.options.map((opt) => {
        const optAttrs = { value: opt.value };
        if (params.value != null && params.value === opt.value)
            optAttrs.selected = true;
        return { tag: "option", text: opt.text, attrs: optAttrs };
    });
    const events = [];
    if (params.onChange)
        events.push({ event: "change", cb: params.onChange });
    if (params.click)
        events.push({ event: "click", cb: params.click });
    if (params.handleEvent)
        events.push(...(Array.isArray(params.handleEvent) ? params.handleEvent : [params.handleEvent]));
    const selectAttrs = {
        name: params.name || params.id,
        class: `select-input${params.class ? ` ${params.class}` : ""}`,
    };
    if (params.id)
        selectAttrs.id = params.id;
    const selectElem = {
        tag: "select",
        text: params.value != null ? String(params.value) : undefined,
        attrs: selectAttrs,
        children: optionChildren,
        handleEvent: events.length > 0 ? events : undefined,
    };
    const selectChildren = params.labelText
        ? [{
                tag: "label",
                text: params.labelText,
                attrs: { for: params.id, class: `select-label${params.class ? ` ${params.class}` : ""}` },
            }, selectElem]
        : [selectElem];
    if (params.labelfirst === false)
        selectChildren.reverse();
    const containerAttrs = {
        class: `select-input${params.class ? ` ${params.class}` : ""}`,
    };
    return (0,domelemjs__WEBPACK_IMPORTED_MODULE_0__.createDOMElem)({
        tag: "div",
        parent: params.parent,
        attrs: containerAttrs,
        children: selectChildren,
    });
}


/***/ },

/***/ "./src/utils.ts"
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   makeEventHandlerArray: () => (/* binding */ makeEventHandlerArray),
/* harmony export */   toArray: () => (/* binding */ toArray)
/* harmony export */ });
function toArray(value) {
    if (value == null)
        return [];
    return Array.isArray(value) ? value : [value];
}
function makeEventHandlerArray(onChange, click, handleEvent) {
    const events = [];
    if (onChange)
        events.push({ event: "change", cb: onChange });
    if (click)
        events.push({ event: "click", cb: click });
    if (handleEvent)
        events.push(...toArray(handleEvent));
    return events;
}


/***/ },

/***/ "./node_modules/domelemjs/dist/index.js"
/*!**********************************************!*\
  !*** ./node_modules/domelemjs/dist/index.js ***!
  \**********************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DOMElem: () => (/* binding */ p),
/* harmony export */   HTML_TAGS: () => (/* binding */ L),
/* harmony export */   createDOMElem: () => (/* binding */ m)
/* harmony export */ });
function u(n){return n.split("-").map((e,t)=>t>0?e.charAt(0).toUpperCase()+e.slice(1):e).join("")}function d(n){return n==null?[]:Array.isArray(n)?n:[n]}function f(n,e=!1){let t={\u00E1:"a",\u00E9:"e",\u00ED:"i",\u00F3:"o",\u00F6:"o",\u0151:"o",\u00FA:"u",\u00FC:"u",\u0171:"u",\u00C1:"A",\u00C9:"E",\u00CD:"I",\u00D3:"O",\u00D6:"O",\u0150:"O",\u00DA:"U",\u00DC:"U",\u0170:"U",\u00E0:"a",\u00E8:"e",\u00EC:"i",\u00F2:"o",\u00F9:"u",\u00E2:"a",\u00EA:"e",\u00EE:"i",\u00F4:"o",\u00FB:"u",\u0103:"a",\u0115:"e",\u012D:"i",\u014F:"o",\u016D:"u",\u0101:"a",\u0113:"e",\u012B:"i",\u014D:"o",\u016B:"u",\u01CE:"a",\u011B:"e",\u01D0:"i",\u01D2:"o",\u01D4:"u",\u00E4:"a",\u00EB:"e",\u00EF:"i",\u00E5:"a",\u00F8:"o",\u00E3:"a",\u00F5:"o",\u00E6:"ae",\u00E7:"c",\u011F:"g",\u0142:"l",\u00F1:"n",\u0111:"d",\u00DF:"ss",\u010F:"d",\u0165:"t",\u0148:"n",\u0159:"r",\u0161:"s",\u017E:"z",\u0158:"R",\u0160:"S",\u017D:"Z",\u00C7:"C",\u015E:"S",\u011E:"G",\u0141:"L",\u00D1:"N",\u0110:"D",\u013E:"l",\u0155:"r",\u013A:"l"},r=n;for(let[i,o]of Object.entries(t))r=r.split(i).join(o);return e?r.toLowerCase():r}var v=["class","id"];function y(n){if(n instanceof HTMLElement)return n;let e=null;return n.charAt(0)==="#"||n.charAt(0)==="."?e=document.querySelector(n):e=document.querySelector(`#${n}`)||document.querySelector(`.${n}`)||document.querySelector(n),e||(console.warn(`[DOMElemJS] Parent element not found for selector: "${n}". Falling back to document.body.`),document.body)}function g(n,e,t){for(let r of d(e))for(let[i,o]of Object.entries(r))if(o!=null)if(i==="checked")n.checked=!!o;else if(i==="dataset"&&typeof o=="object"&&!Array.isArray(o))Object.assign(n.dataset,o);else{let a=(Array.isArray(o)?o:[o]).map(c=>t&&v.includes(i)?f(String(c)):String(c));n.setAttribute(i,a.join(" "))}}function b(n,e){d(e).map(r=>typeof r=="object"&&r!==null?Object.entries(r).map(([i,o])=>`${i}: ${o}`).join("; "):d(r).join("; ")).join("; ").split(";").filter(Boolean).forEach(r=>{let i=r.indexOf(":");if(i===-1)return;let o=r.slice(0,i).trim(),l=r.slice(i+1).trim();if(o){let a=u(o);n.style[a]=l}})}function M(n,e){for(let t of e)t instanceof HTMLElement?n.appendChild(t):n.appendChild(m(t))}function O(n,e){for(let t of d(e))t?.event&&t?.cb&&n.addEventListener(t.event,t.cb)}function m(n){let{tag:e,content:t,text:r,attrs:i,style:o,children:l,parent:a,handleEvent:c,append:h=!0,stripDiacritics:E=!0}=n;t&&r&&console.warn(`[DOMElemJS] Both "content" and "text" provided for <${e}>. "text" takes precedence \u2014 "content" will be ignored.`);let s=document.createElement(e);return r?s.textContent=r:t&&(s.innerHTML=t),i&&g(s,i,E),o&&b(s,o),l&&M(s,l),c&&O(s,c),h&&(a?y(a):document.body).appendChild(s),s}var p=class{constructor(e){this._listeners=new Map;if(this.options=e,this.elem=m(e),e.handleEvent){let t=Array.isArray(e.handleEvent)?e.handleEvent:[e.handleEvent];for(let r of t)this._trackListener(r.event,r.cb)}}addEventListener(e,t){return this.elem.addEventListener(e,t),this._trackListener(e,t),this}removeEventListener(e,t){return this.elem.removeEventListener(e,t),this._untrackListener(e,t),this}removeAllListeners(){for(let[e,t]of this._listeners)for(let r of t)this.elem.removeEventListener(e,r);this._listeners.clear()}_trackListener(e,t){this._listeners.has(e)||this._listeners.set(e,new Set),this._listeners.get(e).add(t)}_untrackListener(e,t){this._listeners.get(e)?.delete(t)}};var L=["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","head","header","hr","html","i","iframe","img","input","ins","kbd","label","legend","li","link","main","map","mark","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strong","style","sub","summary","sup","svg","table","tbody","td","template","textarea","tfoot","th","thead","time","title","tr","track","u","ul","video","wbr"];
//# sourceMappingURL=index.js.map

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!************************************************!*\
  !*** ./documentation/examples/customInputs.ts ***!
  \************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _page_components_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../page-components/index */ "./documentation/page-components/index.ts");
/* harmony import */ var _src_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/index */ "./src/index.ts");


const done = (0,_page_components_index__WEBPACK_IMPORTED_MODULE_0__.initDocPage)();
const sections = [
    {
        title: "createCustomDatePicker",
        description: "Egy\xe9ni d\xe1tum kiv\xe1laszt\xf3 napt\xe1r popup-pal.",
        code: `createCustomDatePicker({\n  parent: "#app",\n  id: "datePicker",\n  labelText: "D\xe1tum:",\n  placeholder: "V\xe1lassz d\xe1tumot...",\n  onChange: (val) => console.log(val),\n});`,
        codeLang: "typescript",
        render: (c) => (0,_src_index__WEBPACK_IMPORTED_MODULE_1__.createCustomDatePicker)({ parent: c, id: "dp1", labelText: "D\xe1tum:", placeholder: "V\xe1lassz d\xe1tumot...", onChange: (v) => console.log(v) }),
    },
    {
        title: "createCustomWeekPicker",
        description: "Egy\xe9ni h\xe9t kiv\xe1laszt\xf3.",
        code: `createCustomWeekPicker({\n  parent: "#app",\n  id: "weekPicker",\n  labelText: "H\xe9t:",\n  placeholder: "V\xe1lassz hetet...",\n  onChange: (val) => console.log(val),\n});`,
        codeLang: "typescript",
        render: (c) => (0,_src_index__WEBPACK_IMPORTED_MODULE_1__.createCustomWeekPicker)({ parent: c, id: "wp1", labelText: "H\xe9t:", placeholder: "V\xe1lassz hetet...", onChange: (v) => console.log(v) }),
    },
    {
        title: "createCustomMonthPicker",
        description: "Egy\xe9ni h\xf3nap kiv\xe1laszt\xf3.",
        code: `createCustomMonthPicker({\n  parent: "#app",\n  id: "monthPicker",\n  labelText: "H\xf3nap:",\n  placeholder: "V\xe1lassz h\xf3napot...",\n  onChange: (val) => console.log(val),\n});`,
        codeLang: "typescript",
        render: (c) => (0,_src_index__WEBPACK_IMPORTED_MODULE_1__.createCustomMonthPicker)({ parent: c, id: "mp1", labelText: "H\xf3nap:", placeholder: "V\xe1lassz h\xf3napot...", onChange: (v) => console.log(v) }),
    },
    {
        title: "createCustomDateTimePicker",
        description: "Egy\xe9ni d\xe1tum + id\u0151 kiv\xe1laszt\xf3.",
        code: `createCustomDateTimePicker({\n  parent: "#app",\n  id: "dateTimePicker",\n  labelText: "D\xe1tum-Id\u0151:",\n  placeholder: "V\xe1lassz d\xe1tumot \xe9s id\u0151t...",\n  onChange: (val) => console.log(val),\n});`,
        codeLang: "typescript",
        render: (c) => (0,_src_index__WEBPACK_IMPORTED_MODULE_1__.createCustomDateTimePicker)({ parent: c, id: "dtp1", labelText: "D\xe1tum-Id\u0151:", placeholder: "V\xe1lassz d\xe1tumot \xe9s id\u0151t...", onChange: (v) => console.log(v) }),
    },
    {
        title: "createCustomDateRangePicker",
        description: "Egy\xe9ni d\xe1tumtartom\xe1ny kiv\xe1laszt\xf3.",
        code: `createCustomDateRangePicker({\n  parent: "#app",\n  id: "dateRangePicker",\n  labelText: "Tartom\xe1ny:",\n  onChange: (start, end) => console.log(start, end),\n});`,
        codeLang: "typescript",
        render: (c) => (0,_src_index__WEBPACK_IMPORTED_MODULE_1__.createCustomDateRangePicker)({ parent: c, id: "drp1", labelText: "Tartom\xe1ny:", onChange: (s, e) => console.log(s, e) }),
    },
    {
        title: "createDragAndDropFileInput",
        description: "Drag-and-drop f\xe1jl felt\xf6lt\u0151.",
        code: `createDragAndDropFileInput({\n  parent: "#app",\n  id: "fileDrop",\n  labelText: "F\xe1jl felt\xf6lt\xe9se:",\n  dropText: "H\xfazd ide a f\xe1jlokat",\n  accept: [".jpg", ".png", ".pdf"],\n  multiple: true,\n  onFiles: (files) => console.log(files),\n});`,
        codeLang: "typescript",
        render: (c) => (0,_src_index__WEBPACK_IMPORTED_MODULE_1__.createDragAndDropFileInput)({ parent: c, id: "dd1", labelText: "F\xe1jl felt\xf6lt\xe9se:", dropText: "H\xfazd ide a f\xe1jlokat", accept: [".jpg", ".png", ".pdf"], multiple: true, onFiles: (f) => console.log(f.map((x) => x.name)) }),
    },
];
(0,_page_components_index__WEBPACK_IMPORTED_MODULE_0__.renderSections)(sections);
done();

})();

/******/ })()
;
//# sourceMappingURL=customInputs.js.map