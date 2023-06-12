import * as XLSX from 'xlsx/xlsx.mjs';
import {uploadImportSpreadsheet} from './templates/excelResource/uploadImportSpreadsheet.js';
import * as fs from 'fs';
import * as http from 'https';
import {Readable} from 'stream';
import * as cpexcel from 'xlsx/dist/cpexcel.full.mjs';
import axios from 'axios';
//=======================================================
XLSX.set_fs(fs);
XLSX.stream.set_readable(Readable);
XLSX.set_cptable(cpexcel);
//=========================================
//node upload 'AP Microeconomics IE' 'APMicro_import_spreadsheet_v0.06.xlsx'
let selectedBook = process.argv[2];
let filepath = process.argv[3];
let applicationType = "node";
if(!selectedBook)
{
    console.log('[Error: Product Subject not found!]');
    process.exit();
}
if(!filepath)
{
    console.log('[Error: Excel file path not found!]');
    process.exit();
}

//=========================================
// process.argv.forEach((val, index) => {
//     console.log(`${index}: ${val}`);
//   });
//console.log(process);
console.log("[Please wait...]");
//jsonValidator();
//process.exit();
if (fs.existsSync(filepath)) {
    const workbook = XLSX.readFile(filepath);
    let myPromise = uploadImportSpreadsheet({
        selectedBook,
        workbook,
        applicationType
    });
    myPromise.then(function(value) {
      if(typeof value == "object")
        {
            let {jsonErrors,spreadsheetErrors} = value;
            if(jsonErrors.length > 0)
            {
                console.log("[Spreadsheet upload failed. Please correct JSON errors]");
            }
            else
            {
                console.log("[Spreadsheet uploaded successfully.]");
            }
            console.log("[jsonErrors : ",jsonErrors,"]");
            console.log("[spreadsheetWarnings : ",spreadsheetErrors,"]");
        }

        if(typeof value == "string")
        {
            console.log("["+value+"]");
        }
        
        
    }, function(error) {
        console.log("[Error: ", error,"]");
        process.exit();
    });
} else {
    console.log('[Error: file not found!]');
    process.exit();
}
//====================================================
async function jsonValidator() {
    console.log("jsonValidator");
    let _data = {
        "job": "json-validator-pipe",
        "token": "test",
        "PRODUCT": "T1659D"
    };
   
    fetch('https://pljenkins.com:8443/buildByToken/buildWithParameters?' + new URLSearchParams(_data), {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "no-cors", // no-cors, *cors, same-origin
    }).then((response) => {
        console.log("status = ", response.status)
        console.log("statusText = ", response.statusText)
    }).then((error) => {
        console.log("error = ", error)
        //console.log("statusText = ", response.statusText)
    })
   

    /*
   var settings = {
    //"async": true,
   // "crossDomain": false,
   // "url": app.serverPath + app.paths.modifyChpaterOrLesson,
    "url": "https://pljenkins.com:8443/buildByToken/buildWithParameters?"+ new URLSearchParams(_data),
    "method": "POST",
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': '0',
    },
   // "processData": false,
    "data": JSON.stringify(_data)
};





    axios(settings).then(function (response) {
         console.log(response);
        // _callBackFn(response.data);
        })
        .catch(function (error) {
         console.log(error);
         //_errorCallBackFn(error);
        });
       */


}
//======================================