/**
 * @function
 * @description Generic response template.
 * @return object : payload,
 * @param code
 * @param success
 * @param message
 * @param data
 */
module.exports = function responseTemplate(code, success, message, data) {
  return {
    statusCode: code,
    body: JSON.stringify(
      {
        success,
        message,
        data,
      },
      null,
      2
    ),
  };
};
