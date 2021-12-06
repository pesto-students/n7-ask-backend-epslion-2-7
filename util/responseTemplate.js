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
    headers: {
      "Access-Control-Allow-Headers":
        "Origin,Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
      "Access-Control-Allow-Methods": "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
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
