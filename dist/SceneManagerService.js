"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
var Constants_1 = require("./Constants");
var SceneManagerService = /** @class */ (function () {
    function SceneManagerService() {
    }
    SceneManagerService.initialize = function () {
        var _this = this;
        if (this.initialized !== null) {
            return this.initialized;
        }
        this.initialized = new Promise(function (resolve, reject) {
            _this.context = spinal_env_viewer_graph_service_1.SpinalGraphService.getContext(_this.contextName);
            if (typeof _this.context === "undefined") {
                spinal_env_viewer_graph_service_1.SpinalGraphService.addContext(_this.contextName, _this.type)
                    .then(function (context) {
                    _this.context = context;
                    _this.contextId = context.getId();
                    resolve(true);
                }).catch(reject);
            }
            resolve(true);
        });
        return this.initialized;
    };
    SceneManagerService.createScene = function (name, description, autoLoad) {
        var _this = this;
        return SceneManagerService.initialize().then(function () {
            var sceneId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({
                name: name,
                description: description,
                autoLoad: autoLoad,
                type: Constants_1.SCENE_TYPE
            }, undefined);
            return spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(_this.contextId, sceneId, _this.contextId, Constants_1.SCENE_RELATION_NAME, Constants_1.SCENE_RELATION_TYPE);
        });
    };
    SceneManagerService.addModelToScene = function (sceneId, bimFileId) {
        var _this = this;
        return SceneManagerService.initialize().then(function () {
            return spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(sceneId, bimFileId, _this.contextId, Constants_1.PART_RELATION_NAME, Constants_1.PART_RELATION_TYPE);
        });
    };
    SceneManagerService.getBimFilesFromScene = function (sceneId) {
        return SceneManagerService.initialize().then(function () {
            return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(sceneId, [Constants_1.PART_RELATION_NAME]);
        });
    };
    SceneManagerService.getSceneFromNode = function (nodeId) {
        return SceneManagerService.initialize().then(function () {
            return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(nodeId, [Constants_1.SCENE_RELATION_NAME]);
        });
    };
    SceneManagerService.addSceneToNode = function (nodeId, sceneId) {
        var _this = this;
        return SceneManagerService.initialize().then(function () {
            return spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(nodeId, sceneId, _this.contextId, Constants_1.SCENE_RELATION_NAME, Constants_1.SCENE_RELATION_TYPE);
        });
    };
    SceneManagerService.contextName = "Scenes";
    SceneManagerService.type = "SpinalService";
    return SceneManagerService;
}());
exports.SceneManagerService = SceneManagerService;
