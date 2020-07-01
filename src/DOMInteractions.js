const _getDOMElem = (attribute, value) => {
  return document.querySelector(`[${attribute}=${value}]`);
};

export const mapListToDOMElements = (listOfValue, attribute) => {
  const _viewElems = {};

  for (const value of listOfValue) {
    _viewElems[value] = _getDOMElem(attribute, value);
  }
  return _viewElems;
};

export const createDOMElem = (tagName, className, innerText, src) => {
  const tag = document.createElement(tagName);
  tag.className = className;
  if (innerText) {
    tag.innerText = innerText.replace(/(<([^>]+)>)/gi, "");
  }
  if (src) {
    tag.src = src;
  }
  return tag;
};
