export default class ErrorPopup {
  constructor(err) {
    this.#createElement(err);
  }

  #createElement(err) {
    const errorContainer = document.createElement('div');
    errorContainer.classList.add('errorContainer');

    const errorSpan = document.createElement('span');
    errorSpan.classList.add('errorSpan');
    errorSpan.textContent = err;

    errorContainer.append(errorSpan);
    this._element = errorContainer;
  }

  get element() {
    return this._element;
  }
}