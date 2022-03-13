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
// ================================================================================

// ================================================================================
// * ElementFactory
// --------------------------------------------------------------------------------
function ElementFactory(){
    throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
ElementFactory.SAPARATOR = '_';
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
ElementFactory._elements = {};
// --------------------------------------------------------------------------------
// * Function
// --------------------------------------------------------------------------------
ElementFactory.addElement = function(element){
    this._elements[element.TAG] = element;
};
// --------------------------------------------------------------------------------
// * New Element
// --------------------------------------------------------------------------------
ElementFactory.newElement = function(username, tag){
    return this._elements[tag].newElement(arguments);
};
// --------------------------------------------------------------------------------
// * Load Element
// --------------------------------------------------------------------------------
ElementFactory.loadElement = function(json_object){
    let element = this._elements[json_object.tag].newElement();
    element.loadJson(json_object);
    return element;
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
module.exports = ElementFactory;
// ================================================================================