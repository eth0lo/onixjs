;(function(root, undefined) {
var onix;
/*
 * Global name for the browser
 */
onix = root.onix = {};

/*
 * Browser sniffing properties
 */
var isGetSetAttributeAvailable = !!HTMLElement.prototype.setAttribute;

function isObject(obj) {
  return obj && obj.constructor === Object;
}

function isNode(node) {
  return node && !!node.nodeType;
}

function isString(str) {
  return str && typeof str === 'string';
}

function slice(arr, index) {
  return Array.prototype.slice.call(arr, index);
}

function partial(fn) {
  var original  = fn,
      args      = slice(arguments, 1);
  return function() {
    return original.apply(this, args.concat(slice(arguments)));
  };
}


function addAttribute(element, property, value) {
  if (isGetSetAttributeAvailable)
    element.setAttribute(property, value);
  else
    element[property] = value;

  return element;
}

function addAttributes(element, attributes) {
  if (!isObject(attributes)) return element;
  var attribute;

  for (attribute in attributes)
    element = addAttribute(element, attribute, attributes[attribute]);

  return element;
}

function addContent(element, content) {
  if (isString(content)) element.appendChild(createText(content));
  if (isNode(content)) element.appendChild(content);

  return element;
}

function createElement(tagname) {
  if (!isString(tagname)) throw new Error('tagname has to be a string');

  return document.createElement(tagname);
}

function createText(text) {
  if (!isString(text)) throw new Error('text has to be a string');

  return document.createTextNode(text);
}

function eb(tagname, attributesOrContent) {
  var element   = createElement(tagname),
      contents  = slice(arguments, 2);

  element = addAttributes(element, attributesOrContent);
  element = addContent(element, attributesOrContent);

  contents.forEach(function(content) {
    element = addContent(element, content);
  });

  return element;
}
onix.eb = eb;

/*
 * Sugar for creating new elements
 */

var tags  = "a body div head html img li p ol table thead tbody td tr span " +
            "ul";
onix.tags = tags.split(' ');

function cleanTags() {
  var tags = onix.tags;
  tags.forEach(function(tag){
    delete onix[tag];
  });
}
onix.cleanTags = cleanTags;

function updateTags() {
  var tags = onix.tags;
  tags.forEach(function(tag){
    onix[tag] = partial(eb, tag);
  });
}
onix.updateTags = updateTags;
onix.updateTags();

/*
 * Templating options
 */
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