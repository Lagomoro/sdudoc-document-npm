'use strict'

// ================================================================================
// * ElementPool <SDUDOC Document>
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
const Action         = require('../repository/Action');
const ElementFactory = require('../element/ElementFactory');
// ================================================================================

// ================================================================================
// * ElementPool
// --------------------------------------------------------------------------------
function ElementPool(){
    this.initialize.apply(this, arguments);
}
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
ElementPool.SEPARATER = '-';
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
ElementPool.prototype._elements = {};
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
ElementPool.prototype.initialize = function(){
    this.clear();
};
// --------------------------------------------------------------------------------
ElementPool.prototype.clear = function(){
    this._elements = {};
};
// --------------------------------------------------------------------------------
// * New Element
// --------------------------------------------------------------------------------
ElementPool.prototype.applyAction = function(actions){
    if (actions instanceof Array) {
        for (let i = 0; i < actions.length; i++){
            this.applyAction(actions[i]);
        }
    } else {
        switch(actions.type){
            case Action.Type.Sync:
                this.loadJson(actions.new_data);
                break;
            case Action.Type.Add:
                this.add(actions.new_data);
                break;
            case Action.Type.Modify:
                this.modify(actions.new_data);
                break;
            case Action.Type.Remove:
                this.remove(actions.old_data);
                break;
        }
    }
};
ElementPool.prototype.revertAction = function(actions){
    if (actions instanceof Array) {
        for (let i = actions.length - 1; i >= 0; i--){
            this.revertAction(actions[i]);
        }
    } else {
        this.applyAction(actions.revert());
    }
};
// --------------------------------------------------------------------------------
// * Version control
// --------------------------------------------------------------------------------
ElementPool.prototype.merge = function(from_object, target_object = null){
    if(target_object === null){
        if(this._elements[from_object.tag] && this._elements[from_object.tag][from_object.id]){
            target_object = this._elements[from_object.tag][from_object.id];
        }else{
            return;
        }
    }
    for(let key in from_object){
        let data = from_object[key];
        switch (typeof(data)){
            case 'number': case 'boolean':
                target_object[key] = data;
                break;
            case 'string':
                target_object[key] = data;
                break;
            case 'object':
                if(data instanceof Array){
                    target_object[key] = data;
                }else{
                    this.merge(data, target_object[key]);
                }
                break;
        }
    }
}
// --------------------------------------------------------------------------------
// * Function
// --------------------------------------------------------------------------------
ElementPool.prototype.add = function(json_object){
    let element = ElementFactory.loadElement(json_object);
    this._elements[element.tag][element.id] = element;
};
ElementPool.prototype.modify = function(json_object){
    if(this._elements[json_object.tag] && this._elements[json_object.tag][json_object.id])
        this._elements[json_object.tag][json_object.id].loadJson(json_object);
};
ElementPool.prototype.remove = function(json_object){
    if(this._elements[json_object.tag] && this._elements[json_object.tag][json_object.id])
        delete this._elements[json_object.tag][json_object.id];
};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
ElementPool.prototype.loadJson = function(json_object){
    this._elements = {};
    for(let tag in json_object){
        this._elements[tag] = {};
        for(let i = 0; i < json_object[tag].length; i++){
            let element = ElementFactory.loadElement(json_object[tag][i]);
            this._elements[tag][element.id] = element;
        }
    }
}
ElementPool.prototype.saveJson = function(){
    let json_object = {};
    for(let tag in this._elements){
        json_object[tag] = [];
        for(let id in this._elements[tag]){
            json_object[tag].push(this._elements[tag][id].saveJson());
        }
    }
    return json_object;
}
ElementPool.prototype.exportJson = function(){
    let json_object = {};
    for(let tag in this._elements){
        for(let id in this._elements[tag]){
            let data = this._elements[tag][id].exportJson();
            if(data) {
                json_object[tag] = json_object[tag] || [];
                json_object[tag].push(data);
            }
        }
    }
    return json_object;
}
// ================================================================================

// ================================================================================
// * Module exports
// --------------------------------------------------------------------------------
/**
 * Module exports.
 * @public
 */
// --------------------------------------------------------------------------------
module.exports = ElementPool;
// ================================================================================
