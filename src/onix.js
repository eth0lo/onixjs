// **Onix** is a quick and dirty generic Element generator for the browser, it's
// main function is to create HTML nodes dynamically; but it can be customized
// to generate other markup languages.

;(function(root, undefined) {

// ## Internal helper functions and variables

// sniff browser support for setAttribute on Nodes
var isGetSetAttributeAvailable = !!HTMLElement.prototype.setAttribute;

// check is something is and object
function isObject(obj) {
  // it uses the constructor property mainly because we would like to check if
  // the object that it was passed in it's a literal object, one flaw of this
  // approach is that any object ceated using new Object() method will pass this
  // assertion
  return obj && obj.constructor === Object;
}

// check is something is a node element
function isNode(node) {
  return node && !!node.nodeType;
}

// check is something is a string
function isString(str) {
  return str && typeof str === 'string';
}

// alias for slice
function slice(arr, index) {
  return Array.prototype.slice.call(arr, index);
}

// create a new function without the arguments passed with the first call
function partial(fn) {
  var original  = fn,
      args      = slice(arguments, 1);
  return function() {
    return original.apply(this, args.concat(slice(arguments)));
  };
}

// ## Main Documentation for Node generation functions

// local object to attack all methods exposed by onix
var onix;

// register onix as a top level object and assign it to the local onix alias
onix = root.onix = {};

// entrance point for all Node creation, it will create a Node element depending
// on the type and number of parameters provided. Examples:
//
// *Create a empty Node element*  
// onix.eb('div') -> `<div></div>`
//
// *Create a empty Node with attributes*  
// onix.eb('div', {class: 'test'}) -> `<div class="test"></div>`
//
// *Create a Node with content*  
// onix.eb('div', 'test') -> `<div>test</div>`
function eb(tagname, attributesOrContent) {
  var element  = createElement(tagname),
      contents = slice(arguments, 1);

  element = addAttributes(element, attributesOrContent);
  element = contents.reduce(addContent, element);

  return element;
}
// expose the eb function (element builder)
onix.eb = eb;

// add a property to a given Node with the specified value
function addAttribute(element, property, value) {
  if (isGetSetAttributeAvailable)
    element.setAttribute(property, value);
  else
    element[property] = value;

  return element;
}

// add all the given attributes inside the *attributes* object literal to the 
// *element*
function addAttributes(element, attributes) {
  if (!isObject(attributes)) return element;
  var attribute;

  for (attribute in attributes)
    element = addAttribute(element, attribute, attributes[attribute]);

  return element;
}

// add the content to a Node depending on the type of the content; if *content* 
// is a *string* it will create a text node before appending to the given 
// *element*
function addContent(element, content) {
  if (isString(content)) element.appendChild(createText(content));
  if (isNode(content)) element.appendChild(content);

  return element;
}

// creates a node based on the *tagname* provided
function createElement(tagname) {
  if (!isString(tagname)) throw new Error('tagname has to be a string');

  return document.createElement(tagname);
}

// creates a text node with the *text* provided
function createText(text) {
  if (!isString(text)) throw new Error('text has to be a string');

  return document.createTextNode(text);
}

// all out of the box supported tags
var tags  = "a body div head html img li p ol table thead tbody td tr span " +
            "ul";

// expose all tags as an array
onix.tags = tags.split(' ');

// it will remove the reference of the shorthands created by onix, the reasoning
// behind it is that at any time you could create your set of tags and only use
// those instead of the ones already bundled with onix
function cleanTags() {
  var tags = onix.tags;
  tags.forEach(function(tag){
    delete onix[tag];
  });
}

// expose the cleanTags function
onix.cleanTags = cleanTags;

// it will take all the tags defined in onix.tags and create shorthand for 
// those; for example instead of using onix.eb('div'), you could use onix.div
function updateTags() {
  var tags = onix.tags;
  tags.forEach(function(tag){
    onix[tag] = partial(eb, tag);
  });
}

// expose the updateTags function
onix.updateTags = updateTags;

// create all the shorthands defined in onix.tags
onix.updateTags();

var tpls = {};
function register(templateName, node) {
  if (!isString(templateName))
    throw new Error ('templateName should be a string');
  if (!isNode(node))
    throw new Error ('node should be a DOM element');

  tpls[templateName] = node;
}
onix.register = register;

function template(templateName) {
  if (!isString(templateName))
    throw new Error ('templateName should be a string');

  return tpls[templateName];
}
onix.template = template;

function render(templateNameOrNode, data) {
  if (!(isString(templateNameOrNode) || isNode(templateNameOrNode)))
    throw new Error ('templateNameOrNode should be a string or DOM element');

  var template  = isString(templateNameOrNode) ?
                    tpls[templateNameOrNode] : templateNameOrNode,
      values    = isObject(data) || {};

  return template.cloneNode(true).outerHTML;
}
onix.render = render;

}(this));