@Lagomoro
# sdudoc-npm-document

---
 SDUDOC Document parser for .sjs

## Usages

### Install
```
npm install sdudoc-document
```

### Add interpreter
An interpreter must contains:
```javascript
// ================================================================================
// * Module dependencies
// --------------------------------------------------------------------------------
/**
 * Module dependencies.
 * @private
 */
// --------------------------------------------------------------------------------
const Document       = require('sdudoc-document');
const Element        = Document.Element;
const ElementFactory = Document.ElementFactory;
// ================================================================================

// ================================================================================
// * Sample Element
// --------------------------------------------------------------------------------
function SampleElement(){
    this.initialize.apply(this, arguments);
}
SampleElement.prototype = Object.create(Element.prototype);
SampleElement.prototype.constructor = SampleElement;
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
SampleElement.TAG = 'SampleElement';
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
SampleElement.prototype.initialize = function(username, tag, [...]){
    Element.prototype.initialize.call(this, username, tag);
    [...];
};
// --------------------------------------------------------------------------------
// * New Element
// --------------------------------------------------------------------------------
SampleElement.newElement = function(username, tag, [...]){
    return new SampleElement(username, tag, [...]);
};
// --------------------------------------------------------------------------------
// * Save & Export
// --------------------------------------------------------------------------------
SampleElement.prototype.loadJson = function(json_object){
    Element.prototype.loadJson.call(this, json_object);
    [...];
};
SampleElement.prototype.saveJson = function(){
    let json_object = Element.prototype.saveJson.call(this);
    [...];
    return json_object;
};
SampleElement.prototype.exportJson = function(){
    let json_object = Element.prototype.exportJson.call(this);
    [...];
    return json_object;
};
// ================================================================================

// ================================================================================
// * ElementFactory
// --------------------------------------------------------------------------------
ElementFactory.addInterpreter(SampleElement);
// ================================================================================

// ================================================================================
// * Module exports
// --------------------------------------------------------------------------------
/**
 * Module exports.
 * @public
 */
// --------------------------------------------------------------------------------
module.exports = SampleElement;
// ================================================================================
```

### New document
```javascript
const Document = require('sdudoc-document');

let document = new Document();
```

### Actions
```javascript
const Document       = require('sdudoc-document');
const Action         = Document.Action;
const ElementFactory = Document.ElementFactory;

let document = new Document();

let element = ElementFactory.newElement('Lagomoro', 'SampleElement');

let add_action = new Action('Add', null, element.saveJson());
document.applyAction(add_action);

let before = element.saveJson();
let after = element.saveJson();
after.[...] = [...];
let modify_action = new Action('Modify', before, after);
document.applyAction(modify_action);

let remove_action = new Action('Remove', element.saveJson(), null);
document.applyAction(remove_action);

document.commit('Lagomoro');

// server is your remote.
server.lock();
let remote_head = server.GetHead();
let json_package = document.push(remote_head);
server.GetPush(json_package);
server.unlock();
```