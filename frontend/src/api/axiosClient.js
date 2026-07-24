import axios from "axios";
import { normalizeResponse } from "./responseHandler";
// import CryptoJS from "crypto-js";

// var key = CryptoJS.enc.Utf8.parse("X3Rjpx1cJ7snEjNsss1DRysIiQ2GhWqk");
// var iv = CryptoJS.enc.Utf8.parse("X3Rjpx1cJ7snEjNs");

const axiosClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    "api-key": "careerhelp",
    "Content-Type": "application/json",
  },
});

// Body Encryption Request
axiosClient.interceptors.request.use(function (request) {

  // if (!request.skipEncryption && request.data) {
  //   request.data = bodyEncryption(request.data, true);
  // }
  const token = getToken();
  if (token && request.requireAuth !== false) {
    request.headers["token"] = token;
  }
  return request;
});

axiosClient.interceptors.response.use(
  function (response) {
    // response = bodyDecryption(response.data);

    // if (response.code === 400) {
    //   showErrorMessage(response.data.message);
    // }

    return normalizeResponse(response.data);
  },

  function (error) {
    if (error.response?.status === 401) {
      logOutRedirectCall();
    }
    return Promise.reject(error);

    // let res = error.response;
    // if (!error.response) {
    //   return Promise.reject(error);
    // }

    // if (res.status == 401 || res.status === -1) {
    //   logOutRedirectCall();
    //   // const response = bodyDecryption(res.data);
    //   return res;
    // } else if (
    //   res.status === 400 ||
    //   res.status === 409 ||
    //   res.status === 500 ||
    //   res.status === 404
    // ) {
    //   // const response = bodyDecryption(res.data);
    //   return res;
    // } else {
    //   console.error(
    //     "Looks like there was a problem. Status Code: " + res.status
    //   );
    //   return Promise.reject(error);
    // }
  }
);

/*
function bodyEncryption(request, isStringify) {
  // console.log("bodyEncryption request=>>>", request);
  var request_ = isStringify ? JSON.stringify(request) : request;
  var encrypted = CryptoJS.AES.encrypt(request_, key, { iv: iv });
  // console.log("request=>>>",encrypted);

  return encrypted.toString();
}

function bodyDecryption(request) {
  // console.log("decryptions",request);
  var decrypted = CryptoJS.AES.decrypt(request.toString(), key, { iv: iv });
  // console.log("decryptions",decrypted);
  console.log("bodyDecryption =>>>", JSON.parse(decrypted.toString(CryptoJS.enc.Utf8)));

  return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
}
*/

function getToken() {
  const token = localStorage.getItem('token');
  if (token) {
    return `Bearer ${token}`
  } else {
    return null
  }
}

function logOutRedirectCall() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}

export { axiosClient };
