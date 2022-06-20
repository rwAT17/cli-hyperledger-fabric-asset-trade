"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionRunner = void 0;
function actionErrorHanlder(error) {
    console.error(error.message);
}
function actionRunner(fn) {
    return (...args) => fn(...args).catch(actionErrorHanlder);
}
exports.actionRunner = actionRunner;
//# sourceMappingURL=actions.js.map