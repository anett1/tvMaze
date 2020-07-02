import { mapListToDOMElements, createDOMElem } from "./DOMInteractions.js";
import { getShowsByKey, getShowById } from "./request.js";

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
    getShowsByKey(this.selectedName).then((shows) =>
      this.renderCardsOfList(shows)
    );
  };

  renderCardsOfList = (shows) => {
    Array.from(
      document
        .querySelectorAll("[data-show-id]")
        .forEach((btn) => btn.removeEventListener("click", this.openDetalsView))
    );
    this.viewElems.showsWrapper.innerHTML = "";

    for (const { show } of shows) {
      const card = this.createShowCard(show);
      this.viewElems.showsWrapper.appendChild(card);
    }
  };
  openDetalsView = (e) => {
    const { showId } = e.target.dataset;
    getShowById(showId).then((show) => {
      const card = this.createShowCard(show, true);
      this.viewElems.showPreview.appendChild(card);
      this.viewElems.showPreview.style.display = "block";
    });
  };
  closeDetalsView = (e) => {
    const { showId } = e.target.dataset;
    const closeBtn = document.querySelector(
      `[id="showPreview"] [data-show-id="${showId}"]`
    );
    closeBtn.removeEventListener("click", this.closeDetalsView);

    this.viewElems.showPreview.style.display = "none";
    this.viewElems.showPreview.innerHTML = "";
  };

  createShowCard = (show, isDetailed) => {
    const divCard = createDOMElem("div", "card");
    const divCardBody = createDOMElem("div", "card-body");
    const h5 = createDOMElem("h5", "card-title", show.name);
    const button = createDOMElem("button", "btn btn-primary", "Show details");
    let img, p;

    if (show.image) {
      if (isDetailed) {
        img = createDOMElem("div", "card-preview-bg");
        img.style.backgroundImage = `url(${show.image.original})`;
      } else {
        img = createDOMElem("img", "card-img-top", null, show.image.medium);
      }
    } else {
      img = createDOMElem(
        "img",
        "card-img-top",
        null,
        "https://via.placeholder.com/210x295"
      );
    }

    if (show.summary) {
      if (isDetailed) {
        p = createDOMElem("p", "card-text", show.summary);
      } else {
        p = createDOMElem("p", "card-text", `${show.summary.slice(0, 80)} ...`);
      }
    } else {
      p = createDOMElem(
        "p",
        "card-text",
        "This is no summary for that show yet"
      );
    }
    button.dataset.showId = show.id;
    if (isDetailed) {
      button.addEventListener("click", this.closeDetalsView);
    } else {
      button.addEventListener("click", this.openDetalsView);
    }

    divCard.appendChild(divCardBody);
    divCardBody.appendChild(img);
    divCardBody.appendChild(h5);
    divCardBody.appendChild(p);
    divCardBody.appendChild(button);

    return divCard;
  };
}

document.addEventListener("DOMContentLoaded", new TvMaze());

/* Bootstrap Card

<div class="card" style="width: 18rem;">
  <img src="..." class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>*/
