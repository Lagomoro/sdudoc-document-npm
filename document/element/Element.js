'use strict'

// ================================================================================
// * Element <SDUDOC Document>
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
const Crypto         = require('crypto');
const ElementFactory = require("./ElementFactory");
// ================================================================================

// ================================================================================
// * Element
// --------------------------------------------------------------------------------
function Element(){
    this.initialize.apply(this, arguments);
}
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
Element.TAG = "Element";
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Element.prototype._tag = '';
Element.prototype._id = '';
Element.prototype._sha512 = '';
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Element.prototype, 'tag', {
    get: function() { return this._tag; },
    configurable: true
});
Object.defineProperty(Element.prototype, 'id', {
    get: function() { return this._id; },
    configurable: true
});
Object.defineProperty(Element.prototype, 'sha512', {
    get: function() { return this._sha512; },
    configurable: true
});
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Element.prototype.initialize = function(username, tag){
    this._tag = tag;
    this._generateHash(username, tag);
};
// --------------------------------------------------------------------------------
Element.prototype._generateHash = function(username, tag){
    let time = new Date().getTime();
    let hash = Crypto.createHash('sha512');
    hash.update(username + tag + time.toString(), 'utf8');
    let hashcode = hash.digest('hex');
    this._id = tag + ElementFactory.SEPARATER + hashcode.substring(0, 7);
    this._sha512 = hashcode;
}
// --------------------------------------------------------------------------------
// * New Element
// --------------------------------------------------------------------------------
Element.newElement = function(username, tag){
    return new Element(username, tag);
};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
Element.prototype.loadJson = function(json_object){
    this._tag    = json_object._tag    === undefined ? this._tag    : json_object._tag;
    this._id     = json_object._id     === undefined ? this._id     : json_object._id;
    this._sha512 = json_object._sha512 === undefined ? this._sha512 : json_object._sha512;
};
Element.prototype.saveJson = function(){
    let json_object = {};
    json_object._tag    = this._tag;
    json_object._id     = this._id;
    json_object._sha512 = this._sha512;
    return json_object;
};
Element.prototype.exportJson = function(){
    let json_object = {};
    json_object._tag    = this._tag;
    json_object._id     = this._id;
    json_object._sha512 = this._sha512;
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
module.exports = Element;
// ================================================================================
