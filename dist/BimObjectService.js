"use strict";
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
var spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
exports.BIM_NODE_RELATION_NAME = "hasBimNode";
exports.BIM_OBJECT_RELATION_NAME = "hasBimObject";
exports.BIM_OBJECT_VERSION_RELATION_NAME = "hasBimVersion";
exports.BIM_NODE_RELATION_TYPE = spinal_env_viewer_graph_service_1.SPINAL_RELATION_LST_PTR_TYPE;
exports.BIM_OBJECT_RELATION_TYPE = spinal_env_viewer_graph_service_1.SPINAL_RELATION_LST_PTR_TYPE;
exports.REFERENCE_OBJECT_RELATION_TYPE = spinal_env_viewer_graph_service_1.SPINAL_RELATION_LST_PTR_TYPE;
exports.REFERENCE_OBJECT_RELATION_NAME = "hasReferenceObject";
exports.BIM_OBJECT_VERSION_RELATION_TYPE = spinal_env_viewer_graph_service_1.SPINAL_RELATION_LST_PTR_TYPE;
var BimObjectService = /** @class */ (function () {
    function BimObjectService() {
    }
    BimObjectService.prototype.createBIMObjectVerionContext = function (bimFileId) {
        spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(bimFileId, [exports.BIM_NODE_RELATION_NAME]).then(function (children) {
            if (children.length > 0)
                return children[0];
            var nodeId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({
                name: "BIMObjectContext",
                currentVersion: 0
            }, undefined);
            spinal_env_viewer_graph_service_1.SpinalGraphService.addChild(bimFileId, nodeId, exports.BIM_NODE_RELATION_NAME, exports.BIM_NODE_RELATION_TYPE);
        });
    };
    BimObjectService.prototype.getBimFileContext = function (bimFileId) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(bimFileId, [exports.BIM_NODE_RELATION_NAME]).then(function (children) {
            if (children.length > 0)
                return children[0];
            return undefined;
        });
    };
    BimObjectService.prototype.createBIMObjectVersion = function (bimFileId, version) {
        this.getBimFileContext(bimFileId).then(function (context) {
            var nodeId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({ version: version }, undefined);
            spinal_env_viewer_graph_service_1.SpinalGraphService.addChild(context.id, nodeId, exports.BIM_OBJECT_VERSION_RELATION_NAME, exports.BIM_OBJECT_VERSION_RELATION_TYPE);
        });
    };
    BimObjectService.prototype.getBIMObjectVersion = function (bimFileId, version) {
        return this.getBimFileContext(bimFileId).then(function (context) {
            spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(context.id, [exports.BIM_OBJECT_VERSION_RELATION_NAME])
                .then(function (children) {
                return children.find(function (node) {
                    return node.version === version;
                });
            });
        });
    };
    BimObjectService.prototype.getBIMObject = function (dbId, model) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var externalId_1, modelMeta, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, BimObjectService.getExternalId(dbId, model)];
                    case 1:
                        externalId_1 = _a.sent();
                        modelMeta = this.mappingModelIdBimFileId[model.id];
                        this.getBIMObjectVersion(modelMeta.bimFileId, modelMeta.version)
                            .then(function (node) {
                            // @ts-ignore
                            spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(node.id, [exports.BIM_OBJECT_RELATION_NAME]).then(function (children) {
                                resolve(children.find(function (node) {
                                    return node.externalId === externalId_1;
                                }));
                            });
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        reject(e_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    BimObjectService.prototype.createBIMObject = function (dbid, model, name) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var externalId, modelMeta, nodeId_1, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, BimObjectService.getExternalId(dbid, model)];
                    case 1:
                        externalId = _a.sent();
                        modelMeta = this.mappingModelIdBimFileId[model.id];
                        nodeId_1 = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({
                            type: 'BIMObject',
                            bimFileId: modelMeta.bimFileId,
                            version: modelMeta.version,
                            externalId: externalId,
                            dbid: dbid,
                            name: name
                        }, undefined);
                        // @ts-ignore
                        this.getBIMObjectVersion(modelMeta.bimFileId, modelMeta.version).then(function (node) {
                            // @ts-ignore
                            spinal_env_viewer_graph_service_1.SpinalGraphService.addChild(node.id, nodeId_1, exports.BIM_OBJECT_RELATION_NAME, exports.BIM_OBJECT_RELATION_TYPE).then(resolve);
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _a.sent();
                        reject(e_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    BimObjectService.getExternalId = function (dbId, model) {
        return new Promise(function (resolve, reject) {
            model.getProperties(dbId, function (props) {
                resolve(props.externalId);
            }, reject);
        });
    };
    BimObjectService.prototype.getDbIdFromExternalId = function (externalId, bimFileId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var modelMeta = _this.mappingBimFileIdModelId[bimFileId];
            var model = modelMeta.model;
            model.getExternalIdMapping(function (res) {
                resolve(res[externalId]);
            }, reject);
        });
    };
    BimObjectService.prototype.addBIMObject = function (contextId, parentId, dbId, model, name) {
        var _this = this;
        return this.getBIMObject(dbId, model).then(function (bimObject) {
            if (bimObject) {
                // @ts-ignore
                return spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(parentId, bimObject.id, contextId, exports.BIM_OBJECT_RELATION_NAME, exports.BIM_NODE_RELATION_TYPE);
            }
            _this.createBIMObject(dbId, model, name).then(function (child) {
                // @ts-ignore
                return spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(parentId, child.getId(), contextId, exports.BIM_OBJECT_RELATION_NAME, exports.BIM_NODE_RELATION_TYPE);
            });
        });
    };
    BimObjectService.prototype.removeBIMObject = function (parentId, bimObjectId) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.removeChild(parentId, bimObjectId, exports.BIM_NODE_RELATION_NAME, exports.BIM_NODE_RELATION_TYPE);
    };
    BimObjectService.prototype.deleteBImObject = function (dbId, model) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // @ts-ignore
            var modelMetaData = _this.mappingModelIdBimFileId[model.id];
            var externalId = BimObjectService.getExternalId(dbId, model);
            _this.getBIMObject(dbId, model).then(function (bimObject) {
                // @ts-ignore
                return spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(bimObject.id).removeFromGraph();
            });
        });
    };
    BimObjectService.prototype.addReferenceObject = function (parentId, dbId, model, name) {
        this.getBIMObject(dbId, model).then(function (child) {
            // @ts-ignore
            spinal_env_viewer_graph_service_1.SpinalGraphService.addChild(parentId, child.id, exports.REFERENCE_OBJECT_RELATION_NAME, exports.REFERENCE_OBJECT_RELATION_TYPE);
        });
    };
    BimObjectService.prototype.removeReferenceObject = function (parentId, dbid, model) {
        this.getBIMObject(dbid, model).then(function (child) {
            // @ts-ignore
            spinal_env_viewer_graph_service_1.SpinalGraphService.removeChild(parentId, child.id, exports.REFERENCE_OBJECT_RELATION_NAME, exports.REFERENCE_OBJECT_RELATION_TYPE);
        });
    };
    BimObjectService.prototype.getAllExternalIdForVersion = function (bimFileId, version) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.getBIMObjectVersion(bimFileId, version).then(function (child) {
                // @ts-ignore
                spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(child.id, [exports.BIM_OBJECT_RELATION_NAME])
                    .then(function (children) {
                    resolve(children.map(function (children) {
                        return children.externalId;
                    }));
                });
            });
        });
    };
    BimObjectService.prototype.getDifferenceExternalIdForVersion = function (version1, version2, bimFileId) {
        var promise = [];
        promise.push(this.getAllExternalIdForVersion(bimFileId, version1));
        promise.push(this.getAllExternalIdForVersion(bimFileId, version2));
        return Promise.all(promise).then(function (result) {
            var union = result[0].filter(function (node) {
                return typeof result[1].find(function (n) {
                    // @ts-ignore
                    return n.externalId === node.externalId;
                }) !== "undefined";
            });
            var newBIMObj = result[0].filter(function (node) {
                return typeof result[1].find(function (n) {
                    // @ts-ignore
                    return n.externalId === node.externalId;
                }) === "undefined";
            });
            var oldBIMObj = result[1].filter(function (node) {
                return typeof result[0].find(function (n) {
                    // @ts-ignore
                    return n.externalId === node.externalId;
                }) !== "undefined";
            });
            return { union: union, newBIMObj: newBIMObj, oldBIMObj: oldBIMObj };
        });
    };
    BimObjectService.prototype.addModel = function (bimFileId, model, version) {
        // @ts-ignore
        this.mappingModelIdBimFileId[model.id] = { bimFileId: bimFileId, number: number };
        // @ts-ignore
        this.mappingBimFileIdModelId[bimFileId] = { modelId: model.id, version: version, model: model };
    };
    return BimObjectService;
}());
exports.BimObjectService = BimObjectService;
