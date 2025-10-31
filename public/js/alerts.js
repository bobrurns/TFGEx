/* eslint-disable */

module.exports.hideAlert = () => {
  const el = document.querySelector(`.alert`);

  if (el) el.parentElement.removeChild(el);
};

module.exports.showAlert = (type, msg) => {
  this.hideAlert();

  const markup = `<div class="alert alert--${type}">${msg}</div>`;

  document.querySelector(`body`).insertAdjacentHTML(`afterbegin`, markup);

  window.setTimeout(this.hideAlert, 5000);
};
