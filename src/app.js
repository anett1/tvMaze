import { mapListToDOMElements } from "./DOMInteractions.js";

class TvMaze {
  constructor() {
    this.viewElems = {};
    this.showNameButtons = {};
    this.selectedName = "queen";
    this.initializeApp();
  }
  initializeApp = () => {
    this.connectDOMElement();
    this.setupListeners();
  };
  connectDOMElement = () => {
    const listOfIds = Array.from(document.querySelectorAll("[id]")).map(
      (item) => item.id
    );
    const listOfData = Array.from(
      document.querySelectorAll("[data-genre]")
    ).map((item) => item.dataset.genre);
    this.viewElems = mapListToDOMElements(listOfIds, "id");
    this.showNameButtons = mapListToDOMElements(listOfData, "data-genre");
  };
  setupListeners = () => {
    Object.keys(this.showNameButtons).forEach((showName) =>
      this.showNameButtons[showName].addEventListener(
        "click",
        this.setCurrentNameFilter
      )
    );
  };
  setCurrentNameFilter = (event) => {
    this.selectedName = event.target.dataset.genre;
  };
}

document.addEventListener("DOMContentLoaded", new TvMaze());
