import axios from 'axios';
/*
##########################################################################
Important Points while updating this file: 
** Please do not add any external module in this File. 
** This file is used in external Node application as mentioend in the tickete Sifter 16450
** Addition of external modules will create issues in node application.
** If you want to write any function, please add function in the same file.
** Please do not use console.log, use function _console and make enableConsole variable false after work is complete., Because console data output by this function is read and processed in node appliction. Unwanted console output will create problem in node processing.
##########################################################################
*/
export function getHttpRequest(settings, _callBackFn, _errorCallBackFn) {
  if (settings.applicationType == "react") {
    let request = $.ajax(settings);
    request.done(function (data) {
      if (typeof _callBackFn !== "undefined") {
        _callBackFn(data);
        request = null;
      }
    });
    request.fail(function () {
      if (typeof _errorCallBackFn !== "undefined") {
        _errorCallBackFn(request.status);
      }
      request = null;
    });
  }
  else {
    axios(settings).then(function (response) {
      _callBackFn(response.data);
    })
      .catch(function (error) {
        _errorCallBackFn(error);
      });
  }
}; 

//===========================================================