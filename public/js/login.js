/* eslint-disable */

import axios from "axios";

const { showAlert } = require(`./alerts`);

module.exports.logIn = async (name, password) => {
  try {
    const res = await axios({
      method: `POST`,
      url: `http://127.0.0.1:3000/api/v1/admin__dashboard/login`,
      data: { name, password },
    });
    if (res.data.status === `success`) {
      showAlert(`success`, `login success`);
      window.setTimeout(() => {
        location.assign(`/admin__dashboard`);
      }, 1500);
    }
  } catch (err) {
    showAlert(`error`, err.response.data.message);
  }
};

module.exports.logOut = async () => {
  try {
    const res = await axios({
      method: `GET`,
      url: `http://127.0.0.1:3000/api/v1/admin__dashboard/logout`,
    });

    if (res.data.status === `success`) location.reload(true);
  } catch (err) {
    console.log(err);
    showAlert(`error`, `Could not log out, try again.`);
  }
};
//
