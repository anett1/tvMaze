import { mapListToDOMElements, createDOMElem } from "./DOMInteractions.js";
import { getShowsByKey } from "./request.js";

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
    this.fetchAndDisplayShows();
  };

  fetchAndDisplayShows = () => {
    getShowsByKey(this.selectedName).then((shows) => this.renderCards(shows));
  };

  renderCards = (shows) => {
    shows.forEach(({ show }) => this.createShowCard(show));
  };

  createShowCard = (show) => {
    console.log(show);
    const divCard = createDOMElem("div", "card");
    const img = createDOMElem("img", "card-img-top", null, show.image.medium);
    const divCardBody = createDOMElem("div", "card-body");
    const h5 = createDOMElem("h5", "card-title", show.name);
    const p = createDOMElem("p", "card-text", show.summary);
    const button = createDOMElem("button", "btn btn-primary", "Show details");

    divCard.appendChild(divCardBody);
    divCardBody.appendChild(img);
    divCardBody.appendChild(h5);
    divCardBody.appendChild(p);
    divCardBody.appendChild(button);

    this.viewElems.showsWrapper.appendChild(divCard);
  };
}

document.addEventListener("DOMContentLoaded", new TvMaze());

/*<div class="card" style="width: 18rem;">
  <img src="..." class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>*/
