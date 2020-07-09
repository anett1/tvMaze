import { mapListToDOMElements, createDOMElem } from "./DOMInteractions.js";
import { getShowsByKey, getShowById } from "./request.js";

class TvMaze {
  constructor() {
    this.viewElems = {};
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
    this.viewElems = mapListToDOMElements(listOfIds, "id");
  };
  setupListeners = () => {
    this.viewElems.buttonAddon2.addEventListener(
      "click",
      this.setCurrentNameFilter
    );
  };
  setCurrentNameFilter = () => {
    this.selectedName = this.viewElems.keyValue.value;
    this.fetchAndDisplayShows();
  };

  fetchAndDisplayShows = () => {
    getShowsByKey(this.selectedName).then((shows) =>
      this.renderCardsOfList(shows)
    );
  };

  renderCardsOfList = (shows) => {
    const dataShowId = Array.from(document.querySelectorAll("[data-show-id]"));

    if (dataShowId.length) {
      dataShowId.forEach((btn) =>
        btn.removeEventListener("click", this.openDetalsView)
      );
    }
    this.viewElems.showsWrapper.innerHTML = "";

    if (shows.length) {
      for (const { show } of shows) {
        const card = this.createShowCard(show);
        this.viewElems.showsWrapper.appendChild(card);

        const cards = [...document.querySelectorAll(".card")];
        cards.map((card, index) => {
          return (card.style.animation = `cardFade .5s  cubic-bezier(0.25, 0.1, 0.25, 1) both ${
            index / 7 + 0.3
          }s `);
        });
      }
    } else {
      const info = createDOMElem(
        "h4",
        "blockquote",
        `There is no movie in the key: "${this.selectedName}". Enter a different key.`
      );
      this.viewElems.showsWrapper.appendChild(info);
    }
  };
  openDetalsView = (e) => {
    document.body.style.overflowY = "hidden";
    const { showId } = e.target.dataset;
    getShowById(showId).then((show) => {
      const card = this.createShowCard(show, true);
      this.viewElems.showPreview.appendChild(card);
    });
    this.viewElems.showPreview.style.display = "block";
  };
  closeDetalsView = (e) => {
    document.body.style.overflowY = "auto";
    this.viewElems.showPreview.style.display = "none";
    this.viewElems.showPreview.innerHTML = "";

    const { showId } = e.target.dataset;
    if (showId) {
      const closeBtn = document.querySelector(`[data-show-id="${showId}"]`);
      closeBtn.removeEventListener("click", this.closeDetalsView);
    } else {
      null;
      // powinien być removeEventListener dla div X
    }
  };
  createShowCard = (show, isDetailed) => {
    const divCard = createDOMElem("div", "card");
    const divCardBody = createDOMElem("div", "card-body");
    const h4 = createDOMElem("h4", "card-title", show.name);
    h4.style.fontFamily = "Saira Extra Condensed, sans-serif";
    h4.style.color = "#17a2b8";

    let img, p, button;

    if (show.image) {
      if (isDetailed) {
        img = createDOMElem("div", "card-preview-bg");
        img.style.backgroundImage = `url(${show.image.original})`;
      } else {
        img = createDOMElem("img", "card-img-top", null, show.image.medium);
      }
    } else {
      img = createDOMElem("div", "card-preview-bg");
      img.style.backgroundImage = `url("https://via.placeholder.com/210x295")`;
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
    if (isDetailed) {
      button = createDOMElem("button", "btn btn-outline-info", "Close details");
    } else {
      button = createDOMElem("button", "btn btn-outline-info", "Show details");
    }
    button.dataset.showId = show.id;
    if (isDetailed) {
      button.addEventListener("click", this.closeDetalsView);

      const divClosePreview = createDOMElem("div", "close-preview");
      const fontAvesomeTimes = createDOMElem("i", "fas fa-times");

      divClosePreview.setAttribute("id", "closePreview");
      divClosePreview.appendChild(fontAvesomeTimes);
      this.viewElems.showPreview.appendChild(divClosePreview);

      divClosePreview.addEventListener("click", this.closeDetalsView);
    } else {
      button.addEventListener("click", this.openDetalsView);
    }

    divCard.appendChild(divCardBody);

    divCardBody.appendChild(img);
    divCardBody.appendChild(h4);
    divCardBody.appendChild(p);

    if (isDetailed) {
      const ul = createDOMElem("ul", null);

      const liType = createDOMElem("li", null, `Type: ${show.type}`);
      const liLanguage = createDOMElem(
        "li",
        null,
        `Language: ${show.language}`
      );
      const liPremiered = createDOMElem(
        "li",
        null,
        `Premiered: ${show.premiered}`
      );

      ul.appendChild(liType);
      ul.appendChild(liLanguage);
      ul.appendChild(liPremiered);

      divCardBody.appendChild(ul);
    } else {
      null;
    }
    divCardBody.appendChild(button);

    return divCard;
  };
}

document.addEventListener("DOMContentLoaded", new TvMaze());
