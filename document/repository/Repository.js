'use strict'

// ================================================================================
// * Repository <SDUDOC Document>
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
const Action  = require("./Action");
const Commit  = require("./Commit");
const History = require("./History");
// ================================================================================

// ================================================================================
// * Repository
// --------------------------------------------------------------------------------
function Repository() {
    this.initialize.apply(this, arguments);
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Repository.prototype._history = null;
Repository.prototype._commits = [];
Repository.prototype._cache = [];
// --------------------------------------------------------------------------------
// * Initialize & Clear
// --------------------------------------------------------------------------------
Repository.prototype.initialize = function(){
    this._history = new History();
    this._commits = [];
    this._cache = [];
}
// --------------------------------------------------------------------------------
Repository.prototype.clear = function(){
    this._history.clear();
    this._commits = [];
    this._cache = [];
};
// --------------------------------------------------------------------------------
// * Version control
// --------------------------------------------------------------------------------
Repository.prototype.commit = function(username){
    this._commits.push(new Commit(username, this._cache));
};
// --------------------------------------------------------------------------------
Repository.prototype._sha512ToIndex = function(sha512){
    for(let i = 0; i < this._commits.length; i++){
        if(this._commits[i].sha512 === sha512){
            return i;
        }
    }
    return -1;
};
// --------------------------------------------------------------------------------
Repository.prototype._pullCommits = function(head, commits){
    let actions = [];
    let index = this._sha512ToIndex(head);
    if (index === this._commits.length - 1 && commits.length > 0){
        for (let i = 0; i < commits.length; i++){
            let commit = new Commit();
            commit.apply(commits[i]);
            this._commits.push(commit);
            actions.push(commit.actions);
        }
        return actions;
    }
    return null;
};
Repository.prototype._pushCommits = function(sha512){
    let commits = [];
    let index = this._sha512ToIndex(sha512);
    if (index < 0 || index >= this._commits.length - 1) return commits;
    for(let i = index; i < this._commits.length; i++){
        commits.push(this._commits[i].freeze());
    }
    return commits;
};
// --------------------------------------------------------------------------------
Repository.prototype.pull = function(json_package){
    let head = json_package.Head;
    let commits = json_package.Commits;
    return this._pullCommits(head, commits);
};
Repository.prototype.push = function(head){
    let json_package = {};
    json_package.Head = head;
    json_package.Commits = this._pushCommits(head);
    return json_package;
};
// --------------------------------------------------------------------------------
// * Function
// --------------------------------------------------------------------------------
Repository.prototype.canUndo = function(){
    return this._history.canUndo();
}
Repository.prototype.canRedo = function(){
    return this._history.canRedo();
}
// --------------------------------------------------------------------------------
Repository.prototype.applyAction = function(actions){
    this._cache.push(actions);
    this._history.applyAction(actions);
};
// --------------------------------------------------------------------------------
Repository.prototype.undo = function(){
    let action = this._history.undo();
    if (action === null) return null;
    this._cache.push(Action.revert(action));
    return action;
};
Repository.prototype.redo = function(){
    let action = this._history.redo();
    if (action === null) return null;
    this._cache.push(action);
    return action;
};
// --------------------------------------------------------------------------------
// * Save & Load Version control
// --------------------------------------------------------------------------------
Repository.prototype.apply = function(json_object){
    this._commits = [];
    for(let i = 0; i < json_object.length; i++){
        let commit = new Commit();
        commit.apply(json_object[i]);
        this._commits.push(commit);
    }
};
Repository.prototype.freeze = function(){
    let json_object = [];
    for(let i = 0; i < this._commits.length; i++){
        json_object.push(this._commits[i].freeze());
    }
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
module.exports = Repository;
// ================================================================================
