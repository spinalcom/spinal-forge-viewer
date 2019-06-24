"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ForgeViewer_1 = require("./ForgeViewer");
var spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
var BimObjectService_1 = require("./BimObjectService");
var Constants_1 = require("./Constants");
var utils_1 = require("./utils");
var SceneManagerService_1 = require("./SceneManagerService");
var SpinalForgeViewer = /** @class */ (function (_super) {
    __extends(SpinalForgeViewer, _super);
    function SpinalForgeViewer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.bimObjectService = new BimObjectService_1.BimObjectService();
        return _this;
    }
    SpinalForgeViewer.prototype.getScene = function (modelId) {
        return this.scenes.filter(function (scene) {
            return scene.modelIds.indexOf(modelId) !== -1;
        });
    };
    ;
    SpinalForgeViewer.prototype.getSVF = function (element, nodeId, name) {
        return utils_1.loadModelPtr(element.ptr)
            .then(function (elem) {
            return utils_1.loadModelPtr(elem.currentVersion);
        })
            .then(function (elem) {
            if (elem.hasOwnProperty('items'))
                for (var i = 0; i < elem.items.length; i++)
                    if (elem.items[i].path.get().indexOf('svf') !== -1) {
                        return {
                            version: elem.versionId,
                            path: elem.items[i].path.get(),
                            id: nodeId,
                            name: name,
                            thumbnail: elem.items[i].thumbnail ? elem.items[i].thumbnail.get() : elem.items[i].path.get() + '.png'
                        };
                    }
            return undefined;
        });
    };
    SpinalForgeViewer.prototype.loadBimFile = function (bimfIle) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.getSVF(bimfIle.element, bimfIle.id, bimfIle.name)
                .then(function (svfVersionFile) {
                _this.loadModel(svfVersionFile.path)
                    .then(function (model) {
                    _this.bimObjectService
                        .addModel(bimfIle.id, model, svfVersionFile.version);
                    resolve({ bimFileId: bimfIle.id, model: model });
                });
            });
        });
    };
    SpinalForgeViewer.prototype.loadModelFromNode = function (nodeId) {
        return __awaiter(this, void 0, void 0, function () {
            var node, e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, spinal_env_viewer_graph_service_1.SpinalGraphService.getNodeAsync(nodeId)];
                    case 1:
                        node = _a.sent();
                        if (node.type === Constants_1.SCENE_TYPE) {
                            return [2 /*return*/, SceneManagerService_1.SceneManagerService.getBimFilesFromScene(nodeId)
                                    .then(function (children) {
                                    var promises = [];
                                    for (var i = 0; i < children.length; i++) {
                                        promises.push(_this.loadBimFile(children[i]));
                                    }
                                    return Promise.all(promises);
                                })];
                        }
                        else
                            return [2 /*return*/, SceneManagerService_1.SceneManagerService.getSceneFromNode(nodeId)
                                    .then(function (scene) {
                                    return _this.loadModelFromNode(scene.id);
                                })];
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return SpinalForgeViewer;
}(ForgeViewer_1.ForgeViewer));
exports.SpinalForgeViewer = SpinalForgeViewer;