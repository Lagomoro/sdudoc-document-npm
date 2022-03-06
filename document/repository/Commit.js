'use strict'

// ================================================================================
// * Commit <SDUDOC Document>
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
const Crypto = require('crypto');
const Action = require("./Action");
// ================================================================================

// ================================================================================
// * Commit
// --------------------------------------------------------------------------------
function Commit() {
    this.initialize.apply(this, arguments);
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Commit.prototype._id = '';
Commit.prototype._sha512 = '';
Commit.prototype._timestamp = 0;
Commit.prototype._username = '';
Commit.prototype._actions = [];
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Commit.prototype, 'id', {
    get: function() { return this._id; },
    configurable: true
});
Object.defineProperty(Commit.prototype, 'sha512', {
    get: function() { return this._sha512; },
    configurable: true
});
Object.defineProperty(Commit.prototype, 'timestamp', {
    get: function() { return this._timestamp; },
    configurable: true
});
Object.defineProperty(Commit.prototype, 'username', {
    get: function() { return this._username; },
    set: function(value) { this._username = value; },
    configurable: true
});
Object.defineProperty(Commit.prototype, 'actions', {
    get: function() { return this._actions; },
    set: function(value) { this._actions = value; },
    configurable: true
});
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Commit.prototype.initialize = function(username, actions){
    this._generateHash(username);
    this._username = username;
    this._actions = actions;
}
// --------------------------------------------------------------------------------
Commit.prototype._generateHash = function(username){
    let time = new Date().getTime();
    let hash = Crypto.createHash('sha512');
    hash.update(username + time.toString(), 'utf8');
    let hashcode = hash.digest('hex');
    this._id = hashcode.substring(0, 7);
    this._sha512 = hashcode;
    this._timestamp = time;
}
// --------------------------------------------------------------------------------
// * Save & Load Version control
// --------------------------------------------------------------------------------
Commit.prototype._applyActions = function(json_object){
    let actions = [];
    for(let i = 0; i < json_object.length; i++){
        if(json_object[i] instanceof Array){
            actions.push(this._applyActions(json_object[i]));
        }else{
            let action = new Action();
            action.apply(json_object[i]);
            actions.push(action);
        }
    }
    return actions;
};
Commit.prototype._freezeActions = function(actions){
    let json_object = [];
    for(let i = 0; i < actions.length; i++){
        if(actions[i] instanceof Array){
            json_object.push(this._freezeActions(actions[i]));
        }else{
            json_object.push(actions[i].freeze());
        }
    }
    return json_object;
};
// --------------------------------------------------------------------------------
Commit.prototype.apply = function(json_object){
    this._id        = json_object.id;
    this._sha512    = json_object.sha512;
    this._timestamp = json_object.timestamp;
    this._username  = json_object.username;
    this._actions   = this._applyActions(json_object.actions);
};
Commit.prototype.freeze = function(){
    let json_object = {};
    json_object.id        = this._id;
    json_object.sha512    = this._sha512;
    json_object.timestamp = this._timestamp;
    json_object.username  = this._username;
    json_object.actions   = this._freezeActions(this._actions);
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
module.exports = Commit;
// ================================================================================
