/* eslint-disable no-console */
import axios from 'axios';

export const ErrorMessages = {
  NO_NETWORK_MESSAGE: 'No Network',
};

export const ErrorTypes = {
  NONET: 20000,
};

export const IsObject = (value) => (
  value && typeof value === 'object' && value.constructor === Object
);

// export const StandardNetErrorHandling = (
//   err = {},
// ) => {
//   if (err.type === ErrorTypes.NONET) {
//     console.log(err.type);
//     return;
//   }

//   let error = {};
//   if (err.error) error = err.error.response;
//   else error = err.response;
//   console.log(err.type);
//   if (!error) {
//     console.log(err);
//     return;
//   }

//   if (error.status === 400
//         && error.data && error.data.non_field_errors
//         && error.data.non_field_errors.length > 0) {
//     const errorMessage = error.data.non_field_errors[0];
//     console.log(`${ErrorMessages.REQUEST_ERRORED} ${errorMessage}`);
//     return;
//   }

//   const errStatus = error.status;
//   if (errStatus) {
//     let errData = error.data;
//     if (IsObject(errData)) {
//       errData = JSON.stringify(errData);
//     }
//     console.log(
//       `${ErrorMessages.NETWORK_ERROR} ${errStatus} - ${errData}`,
//     );
//     return;
//   }
//   console.log(
//     `${ErrorMessages.NETWORK_ERROR} ${errStatus}`,
//   );
// };

export const GetNetErrorMessage = (err = {}, shouldShowErrorData = false) => {
  console.log(err.code);
  if (err.type === ErrorTypes.NONET) return ErrorMessages.NO_NETWORK_MESSAGE;

  let error = err;
  if (err.error) error = err.error;
  if (error.response) {
    // handles Wraxios errors
    const { response } = error;
    if (response.status === 400
        && response.data.non_field_errors
        && response.data.non_field_errors.length) {
      const errorMessage = response.data.non_field_errors[0];
      return errorMessage;
    }

    if (response.status === 400 && response.data && response.data.length) {
      const errorMessage = response.data instanceof Array ? response.data[0] : response.data;
      return errorMessage;
    }
    const errStatus = response.status;
    if (shouldShowErrorData) {
      let errData = response.data;
      if (IsObject(errData)) errData = JSON.stringify(errData);
      return errData;
    }
    return `${ErrorMessages.NETWORK_ERROR} ${errStatus}`;
  }

  return ErrorMessages.NETWORK_ERROR;
};

export const GetNetErrorCode = (err = {}) => {
  if (err.error && err.error.response) return err.error.response.status;
  if (err.response) return err.response.status;

  return null;
};

class CustomServerError extends Error {
  constructor(status = null, message = '', error = {}, reqConfig = {}, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomServerError);
    }

    this.status = status;
    this.message = message;
    this.error = error;
    this.reqConfig = reqConfig;
  }
}

export const Wraxios = async (reqConfig) => {
  const response = await axios(reqConfig)
    .then((res) => Promise.resolve(res))
    .catch((err) => {
      const errorCode = GetNetErrorCode(err);
      // StandardNetErrorHandling(err);
      const errorMessage = GetNetErrorMessage(err);
      const error = new CustomServerError(errorCode, errorMessage, err, reqConfig);
      return Promise.reject(error);
    });

  return Promise.resolve(response);
};
