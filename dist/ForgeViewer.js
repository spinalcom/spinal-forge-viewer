"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var THREE = require("three");
var SelectionMode = Autodesk.Viewing.SelectionMode;
var ForgeViewer = /** @class */ (function () {
    function ForgeViewer(containerElement, headless) {
        if (headless === void 0) { headless = false; }
        this.viewerContainer = containerElement;
        this.viewer = null;
        this.models = {};
        this.viewerInitialized = null;
        this.started = null;
        this.headless = headless;
    }
    ForgeViewer.prototype.getModel = function (modelId) {
        return this.models[modelId];
    };
    ForgeViewer.prototype.initializeViewer = function () {
        if (this.viewerInitialized !== null)
            return this.viewerInitialized;
        var options = {
            env: 'Local',
            docid: "",
            useADP: false
        };
        this.viewerInitialized = new Promise(function (resolve) {
            Autodesk.Viewing.Initializer(options, function () {
                resolve();
            });
        });
        return this.viewerInitialized;
    };
    ForgeViewer.prototype.createViewer = function () {
        if (this.headless)
            this.viewer = new Autodesk.Viewing.Viewer3D(this.viewerContainer, {});
        else
            this.viewer = new Autodesk.Viewing.Private.GuiViewer3D(this.viewerContainer, {});
    };
    ForgeViewer.prototype.start = function (path, interactive) {
        var _this = this;
        if (interactive === void 0) { interactive = true; }
        if (this.started !== null)
            return this.started;
        this.createViewer();
        this.started = new Promise(function (resolve, reject) {
            _this.initializeViewer()
                .then(function () {
                // @ts-ignore
                _this.viewer.start(path, {}, function (m) {
                    if (interactive) {
                        // @ts-ignore
                        var id = m.id;
                        _this.currentModelId = id;
                        // @ts-ignore
                        _this.models[id] = m;
                    }
                    resolve(m);
                }, reject);
            });
        });
        return this.started;
    };
    ForgeViewer.prototype.loadModel = function (path, option) {
        var _this = this;
        if (option === void 0) { option = {}; }
        return new Promise(function (resolve, reject) {
            // @ts-ignore
            _this.viewer.loadModel(path, option, function (m) {
                // @ts-ignore
                _this.models[m.id] = m;
                //TODO change to wait geometry to be loaded
                _this.fitToView([1], m, true);
                resolve(m);
            }, reject);
        });
    };
    ForgeViewer.prototype.unLoadModel = function (model) {
        // @ts-ignore
        if (this.models.hasOwnProperty(model.id)) {
            // @ts-ignore
            this.viewer.impl.unLoadModel(model);
            // @ts-ignore
            delete this.models[model.id];
            return true;
        }
        return false;
    };
    ForgeViewer.prototype.finish = function () {
        if (this.viewer)
            this.viewer.finish();
    };
    ForgeViewer.prototype.viewerEvent = function (event) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var handler = function (e) {
                _this.viewer.removeEventListener(event, handler);
                resolve(e);
            };
            _this.viewer.addEventListener(event, handler);
        });
    };
    ForgeViewer.prototype.resize = function () {
        // @ts-ignore
        if (this.viewer && this.viewer.impl) {
            this.viewer.resize();
        }
    };
    ForgeViewer.prototype.loadExtension = function (extensionId, options) {
        if (options === void 0) { options = {}; }
        return this.viewer.loadExtension(extensionId, options);
    };
    ForgeViewer.prototype.getExtension = function (extensionId) {
        return this.viewer.getExtension(extensionId);
    };
    ForgeViewer.prototype.unloadExtension = function (extensionId) {
        // @ts-ignore
        return this.viewer.unloadExtension(extensionId);
    };
    ForgeViewer.prototype.getProperties = function (dbid, modelId, onSuccessCallback, onErrorCallBack) {
        if (!this.models.hasOwnProperty(modelId)) {
            return onErrorCallBack("Not found");
        }
        return this.models[modelId].getProperties(dbid, onSuccessCallback, onErrorCallBack);
    };
    ForgeViewer.prototype.getObjectTree = function (onSuccessCallback, onErrorCallback, modelId) {
        if (modelId === void 0) { modelId = this.currentModelId; }
        if (!this.models.hasOwnProperty(modelId)) {
            return onErrorCallback("Not Found");
        }
        return this.models[modelId].getObjectTree(onSuccessCallback, onErrorCallback);
    };
    ForgeViewer.prototype.getHiddenNodes = function () {
        //work only with one model viewer3D line 74116
        return this.viewer.getHiddenNodes();
    };
    ForgeViewer.prototype.isolate = function (node, model) {
        // @ts-ignore
        this.viewer.isolate(node, model);
    };
    ForgeViewer.prototype.toggleSelect = function (dbid, model, selectionType) {
        if (selectionType === void 0) { selectionType = SelectionMode.REGULAR; }
        // @ts-ignore
        this.viewer.toggleSelect(dbid, model, selectionType);
    };
    ForgeViewer.prototype.select = function (dbid, model, selectionType) {
        if (selectionType === void 0) { selectionType = SelectionMode.REGULAR; }
        // @ts-ignore
        this.viewer.select(dbid, model, selectionType);
    };
    ForgeViewer.prototype.clearSelection = function () {
        this.viewer.clearSelection();
    };
    ForgeViewer.prototype.getAggregateSelection = function (callback) {
        // @ts-ignore
        this.viewer.getAggregateSelection(callback);
    };
    /**
     * return the isolated items form all loaded models
     */
    ForgeViewer.prototype.getAggregateIsolation = function () {
        // @ts-ignore
        this.viewer.getAggregateIsolation();
    };
    ForgeViewer.prototype.show = function (dbids, model) {
        // @ts-ignore
        this.viewer.show(dbids, model);
    };
    ForgeViewer.prototype.hide = function (dbids, model) {
        // @ts-ignore
        this.viewer.hide(dbids, model);
    };
    ForgeViewer.prototype.togglevisibility = function (dbid, model) {
        // @ts-ignore
        this.viewer.toggleVisibility(dbid, model);
    };
    ForgeViewer.prototype.search = function (text, onSuccessCallback, onErrorCallback, attributeNames, modelId) {
        if (modelId === void 0) { modelId = this.currentModelId; }
        if (!this.models.hasOwnProperty(modelId)) {
            return onErrorCallback();
        }
        return this.models[modelId].search(text, onSuccessCallback, onErrorCallback, attributeNames);
    };
    ForgeViewer.prototype.scaleModel = function (model, scale) {
        var fragCount = model.getFragmentList().fragments.fragId2dbId.length;
        //fragIds range from 0 to fragCount-1
        for (var fragId = 0; fragId < fragCount; ++fragId) {
            // @ts-ignore
            var fragProxy = this.viewer.impl.getFragmentProxy(model, fragId);
            fragProxy.getAnimTransform();
            fragProxy.scale = new THREE.Vector3(scale, scale, scale);
            fragProxy.updateAnimTransform();
        }
        // @ts-ignore
        this.viewer.impl.sceneUpdated(true);
    };
    ForgeViewer.prototype.setCurrentModel = function (model) {
        // @ts-ignore
        var id = model.id;
        if (!this.models.hasOwnProperty(id))
            return false;
        this.currentModelId = id;
        // @ts-ignore
        this.viewer.impl.model = model;
        return true;
    };
    /**
     *
     * @param dbIds
     * @param model
     * @param immediate  true to avoid the default transition.
     */
    ForgeViewer.prototype.fitToView = function (dbIds, model, immediate) {
        if (immediate === void 0) { immediate = false; }
        // @ts-ignore
        this.viewer.fitToView(dbIds, model, immediate);
    };
    ForgeViewer.prototype.setThemingColor = function (dbId, color, model, recursive) {
        color.setX(color.x > 1 ? color.x / 255 : color.x);
        color.setY(color.y > 1 ? color.y / 255 : color.y);
        color.setY(color.z > 1 ? color.z / 255 : color.z);
        // @ts-ignore
        this.viewer.setThemingColor(dbId, color, model, recursive);
    };
    ForgeViewer.prototype.clearThermingColor = function (model) {
        this.viewer.clearThemingColors(model);
    };
    ForgeViewer.prototype.hideModel = function (modelId) {
        this.viewer.hideModel(modelId);
    };
    ForgeViewer.prototype.showModel = function (modelId, preserveTools) {
        if (preserveTools === void 0) { preserveTools = false; }
        // @ts-ignore
        this.viewer.showModel(modelId, preserveTools);
    };
    ForgeViewer.prototype.explode = function (scale) {
        this.viewer.explode(scale);
    };
    return ForgeViewer;
}());
exports.ForgeViewer = ForgeViewer;
