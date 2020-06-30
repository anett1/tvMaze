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
