'use strict'

// ================================================================================
// * Document <SDUDOC Document>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   License: MIT
// ================================================================================

// ================================================================================
// * Module dependencies
// --------------------------------------------------------------------------------
/**
 * Module dependencies.
 * @private
 */
// --------------------------------------------------------------------------------
const Element        = require('./element/Element');
const ElementFactory = require('./element/ElementFactory');
const ElementPool    = require('./element/ElementPool');
const Action         = require('./repository/Action');
const Repository     = require('./repository/Repository');
// ================================================================================

// ================================================================================
// * Document
// --------------------------------------------------------------------------------
function Document(){
    this.initialize.apply(this, arguments);
}
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
Document.Element        = Element;
Document.ElementFactory = ElementFactory;
Document.Action         = Action;
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Document.prototype._header = {};
Document.prototype._element_pool = null;
// --------------------------------------------------------------------------------
Document.prototype._repository = null;
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Document.prototype, 'header', {
    get: function() { return this._header; },
    set: function(value) { this._header = value; },
    configurable: true
});
Object.defineProperty(Document.prototype, 'element_pool', {
    get: function() { return this._element_pool; },
    set: function(value) { this._element_pool = value; },
    configurable: true
});
Object.defineProperty(Document.prototype, 'repository', {
    get: function() { return this._repository; },
    set: function(value) { this._repository = value; },
    configurable: true
});
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Document.prototype.initialize = function(){
    this.clear();
};
Document.prototype.clear = function(){
    this._header = {};
    this._element_pool = new ElementPool();
    this._repository = new Repository();
};
// --------------------------------------------------------------------------------
// * Version control
// --------------------------------------------------------------------------------
/**
 * Write buffer to document.
 */
Document.prototype.commit = function(username){
    this._repository.commit(username);
};
// --------------------------------------------------------------------------------
/**
 * Add version control info from package.
 */
Document.prototype.pull = function(json_package){
    let action = this._repository.pull(json_package);
    if(action !== null){
        this._element_pool.applyAction(action);
    }
};
/**
 * Pak version control info after HEAD to package.
 */
Document.prototype.push = function(head){
    return this._repository.push(head);
};
// --------------------------------------------------------------------------------
// * Save & Load Version control
// --------------------------------------------------------------------------------
/**
 * Load version control info from json.
 */
Document.prototype.apply = function(json_object){
    this._repository.apply(json_object.Repository);
};
/**
 * Save version control info to json.
 */
Document.prototype.freeze = function(){
    let json_object = {};
    json_object.Repository = this._repository.freeze();
    return json_object;
};
// --------------------------------------------------------------------------------
// * Function
// --------------------------------------------------------------------------------
/**
 * Can undo.
 */
Document.prototype.canUndo = function(){
    return this._repository.canUndo();
}
/**
 * Can redo.
 */
Document.prototype.canRedo = function(){
    return this._repository.canRedo();
}
// --------------------------------------------------------------------------------
/**
 * Apply action.
 */
Document.prototype.applyAction = function(action){
    this._repository.applyAction(action);
    this._element_pool.applyAction(action);
};
// --------------------------------------------------------------------------------
/**
 * Undo.
 */
Document.prototype.undo = function(){
    let action = this._repository.undo();
    if (action !== null){
        this._element_pool.revertAction(action);
    }
};
/**
 * Redo.
 */
Document.prototype.redo = function(){
    let action = this._repository.redo();
    if (action !== null){
        this._element_pool.applyAction(action);
    }
};
// --------------------------------------------------------------------------------
// * Save, Load & Export
// --------------------------------------------------------------------------------
/**
 * Load document elements from json.
 */
Document.prototype.loadJson = function(json_object){
    this._header = json_object.Header;
    this._element_pool.loadJson(json_object.Elements);
};
/**
 * Save document elements to json.
 */
Document.prototype.saveJson = function(){
    let json_object = {};
    json_object.Header = this._header;
    json_object.Elements = this._element_pool.saveJson();
    return json_object;
};
/**
 * Export document elements to json.
 */
Document.prototype.exportJson = function(){
    let json_object = {};
    json_object.Header = this._header;
    json_object.Elements = this._element_pool.exportJson();
    return json_object;
};
// ================================================================================

// ================================================================================
// * Module exports
// --------------------------------------------------------------------------------
/**
 * Module exports.
 * @public
 */
// --------------------------------------------------------------------------------
module.exports = Document
// ================================================================================
