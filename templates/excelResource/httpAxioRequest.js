import axios from 'axios';
export function getHttpRequest(settings, _callBackFn, _errorCallBackFn) {
    //console.log("getHttpRequest from httpAxio");
    //console.log("settings = ", settings);
    //console.log("applicationType = ",applicationType);
    if(settings.applicationType == "react")
    {
      let request = $.ajax(settings);
      request.done(function(data) {
          if (typeof _callBackFn !== "undefined") {
              _callBackFn(data);
              request = null;
          }
      });
      request.fail(function() {
          if (typeof _errorCallBackFn !== "undefined") {
              _errorCallBackFn(request.status);
          }
          request = null;
      });
    }
    else
    {
      axios(settings).then(function (response) {
         // console.log(response);
          _callBackFn(response.data);
         })
         .catch(function (error) {
          //console.log(error);
          _errorCallBackFn(error);
         });
    }
   
    //=====================================
    /*
  axios({
   method: 'PUT',
   url: "https://node.perfectionnext.com:8083/usercontent/query",
   data:data
  }).then(function (response) {
   console.log(response);
  })
  .catch(function (error) {
   console.log(error);
  });
  */
    //======================================
  }; 