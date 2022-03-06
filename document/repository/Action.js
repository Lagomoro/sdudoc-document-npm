'use strict'

// ================================================================================
// * Action <SDUDOC Document>
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
// * Action
// --------------------------------------------------------------------------------
function Action() {
    this.initialize.apply(this, arguments);
}
// --------------------------------------------------------------------------------
// * Enum
// --------------------------------------------------------------------------------
Action.Type = {
    Sync:   1 << 0,
    Add:    1 << 1,
    Modify: 1 << 2,
    Remove: 1 << 3
};
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Action.prototype._type = null;
Action.prototype._old_data = null;
Action.prototype._new_data = null;
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Action.prototype, 'type', {
    get: function() { return this._type; },
    set: function(value) { this._type = value; },
    configurable: true
});
Object.defineProperty(Action.prototype, 'old_data', {
    get: function() { return this._old_data; },
    set: function(value) { this._old_data = value; },
    configurable: true
});
Object.defineProperty(Action.prototype, 'new_data', {
    get: function() { return this._new_data; },
    set: function(value) { this._new_data = value; },
    configurable: true
});
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Action.prototype.initialize = function(type, old_data, new_data){
    this._type = type;
    this._old_data = old_data;
    this._new_data = new_data;
}
// --------------------------------------------------------------------------------
// * Version control
// --------------------------------------------------------------------------------
Action.revert = function(actions){
    if(actions instanceof Array){
        let revert_actions = [];
        for (let i = actions.length - 1; i >= 0; i--){
            revert_actions.push(Action.revert(actions[i]));
        }
        return revert_actions;
    }else{
        return actions.revert();
    }
};
// --------------------------------------------------------------------------------
Action.prototype.revert = function(){
    switch(this._type){
        case Action.Type.Sync:
        case Action.Type.Modify:
            return new Action(this._type, this._new_data, this._old_data);
        case Action.Type.Add:
            return new Action(Action.Type.Remove, this._new_data, this._old_data);
        case Action.Type.Remove:
            return new Action(Action.Type.Add, this._new_data, this._old_data);
    }
};
// --------------------------------------------------------------------------------
// * Save & Load Version control
// --------------------------------------------------------------------------------
Action.prototype.apply = function(json_object){
    this._type     = json_object.type;
    this._old_data = json_object.old_data;
    this._new_data = json_object.new_data;
};
Action.prototype.freeze = function(){
    let json_object = {};
    json_object.type     = this._type;
    json_object.old_data = this._old_data;
    json_object.new_data = this._new_data;
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
module.exports = Action;
// ================================================================================
