// provide PL Git repo local path
// node updateProblemEditorFiles 'D:/projects/PL/apps/ProblemEditor/'
// press enter
import * as fs from 'fs';
let _rootPath = process.argv[2];
if (!process.argv[2]) {
    console.log("Please enter root path in command");
    process.exit();
}
//===========================================================
if (_rootPath.indexOf("ProblemEditor/") == -1) {
    console.log("Please check root path, seems invalid = " + _rootPath);
    process.exit();
}
//============ Check folder exists ============
fs.access(_rootPath, error => {
    if (!error) {
        // The check succeeded
        //console.log(_rootPath," = exists");
    } else {
        // The check failed
        console.log("Please check root path, not found = " + _rootPath);
        process.exit();
    }
});
//=======================================================
let fileListObj = [
    {
        src: "src/client/app/templates/excelResource/getSpreadsheetErrors.js",
        dest: "templates/excelResource/getSpreadsheetErrors.js",
    },
    {
        src: "src/client/app/templates/excelResource/uploadImportSpreadsheet.js",
        dest: "templates/excelResource/uploadImportSpreadsheet.js",
    },
    {
        src: "src/client/app/templates/getProductStructure/getProductStructureJson.js",
        dest: "templates/getProductStructure/getProductStructureJson.js",
    }
];
//==================== Copy Files ==================
let promiseArr = [];
fileListObj.forEach((elm) => {
    promiseArr.push(new Promise(function (resolve, reject) {
        fs.copyFile(_rootPath + elm.src, elm.dest, (err) => {
            if (err) {
                resolve(elm.dest + " => FAILED");
            };
            //resolve(elm.src+' copied to '+elm.dest);
            resolve(elm.dest + " => UPDATED");
        });
    }));
});

Promise.all(promiseArr).then(function (values) {
    values.forEach((elm) => {
        console.log("[ " + elm + " ]");
    });
});
// ================ Copy and Update httpAxioRequest.js ==============
let httpAxioSrcPath = "src/client/app/templates/excelResource/httpAxioRequest.js";
let httpAxioDestPath = "templates/excelResource/httpAxioRequest.js";
fs.readFile(_rootPath + httpAxioSrcPath, function (err, buf) {
    let fileContent = buf.toString();
    fileContent = updateHttpAxioFile(fileContent);
    fs.writeFile(httpAxioDestPath, fileContent, (err) => {
        if (err) console.log(err);
        console.log("[ " + httpAxioDestPath + " => UPDATED ]");
    });
});

function updateHttpAxioFile(fileContent) {
    return fileContent.replace(/\/\/import/g, "import");
}
// ================ Copy and Update Constants.js ==============
let constantSrcPath = "src/client/app/utils/Constants.js";
let constantDestPath = "utils/Constants.js";
fs.readFile(_rootPath + constantSrcPath, function (err, buf) {
    let fileContent = buf.toString();
    fileContent = updateConstantsFile(fileContent);
    fs.writeFile(constantDestPath, fileContent, (err) => {
        if (err) console.log(err);
        console.log("[ " + constantDestPath + " => UPDATED ]");
    });

});

function updateConstantsFile(fileContent) {
    let strArr = fileContent.split('"lodash";\r\n');
    let _constantsList = strArr[0].split("}")[0].split("{")[1];
    let lodashStr = "import pkg from 'lodash';\r\n";
    lodashStr += "const { " + _constantsList + " } = pkg;\r\n";
    let newFileContent = lodashStr + strArr[1];
    return newFileContent;
}
//======================================================