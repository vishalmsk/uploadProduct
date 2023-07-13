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
import * as XLSX from 'xlsx';
export function getSpreadsheetErrors(workbook) {
    let errorList = [];
    let _programToc = XLSX.utils.sheet_to_json(workbook.Sheets["Program TOC"]);
    let _programCategories = XLSX.utils.sheet_to_json(workbook.Sheets["Program Categories"]);
    let _productResources = XLSX.utils.sheet_to_json(workbook.Sheets["Product Resources"]);
    //=========================================
    let formatColumnValues = [
        "PowerPoint",
        "Interactive Lesson",
        "External URL",
        "Online eBook",
        "Assessment Prompt",
        "Writing Prompt"
    ];
    /*
    // Format column values supported by the platform
        PowerPoint
        Interactive Lesson
        External URL
        Online eBook
        Assessment Prompt
        Writing Prompt
    // As per discussion with these 2 values, we dont use now. So if the format column contains these values, these will be listed as error 
        Assessment
        Writing
    */
    //===============================================
    let _resourceCategoryArr = [];
    let versionNotFound = [];
    let tocVersionNotFound = [];
    let _nodeSublessonErrors = [];
    let _formatColumnErrors = [];

    _productResources.forEach((elm, index) => {

        if (_resourceCategoryArr.indexOf(elm["Resource Category"]) == -1) {
            _resourceCategoryArr.push(elm["Resource Category"]);
        }
        //-------------------------------------
        if (formatColumnValues.indexOf(elm["Format"]) == -1) {
            _formatColumnErrors.push(elm["Resource Code"]);
        }
        //-------------------------------------

        if (!checkSheetValue(elm.Version)) {
            versionNotFound.push(elm["Resource Code"]);
        }
        //-----------------------------------
        if (!checkSheetValue(elm["Node / Lesson"]) || !checkSheetValue(elm["Lesson / Sub-Lesson"])) {
            _nodeSublessonErrors.push(elm["Resource Code"]);
        }
    });

    //========================================
    _programToc.forEach((elm, index) => {
        if (!checkSheetValue(elm.Version)) {
            tocVersionNotFound.push(elm["Unit (Parent)"] + " : " + elm["Lesson (Child)"] + " (" + elm["NavMenuId"] + ")");
        }
    });
    //========================================
    //console.log("_programToc");
    let _programTocVersion = false;
    if (_programToc[0].Version || _programToc[1].Version) {
        _programTocVersion = true;
    }
    //=============================
    let _productResourceVersion = false;
    if (_productResources[0].Version || _productResources[1].Version) {
        _productResourceVersion = true;
    }

    //===============================
    errorList = [...errorList, ...checkFormatColumn(_formatColumnErrors)];
    errorList = [...errorList, ...checkResourceCategory(_resourceCategoryArr, _programCategories)];
    errorList = [...errorList, ...checkVersionColumn(_productResourceVersion, _programTocVersion)];
    errorList = [...errorList, ...checkVersionColumnValue(versionNotFound, tocVersionNotFound)];
    errorList = [...errorList, ...checkNodeSublessonErrors(_nodeSublessonErrors)];
    //===============================
    return errorList;
}

function checkSheetValue(val) {
    let _bool = true;
    if (!val) {
        _bool = false;
    }
    else if (val.trim() == "") {
        _bool = false;
    }
    return _bool;
}

function checkResourceCategory(_resourceCategoryArr, _programCategories) {

    let _array = [];
    let valueCheckCounter = 0;
    let _notPresentArr = [];
    _resourceCategoryArr.forEach((elm) => {
        let _present = false;
        _programCategories.forEach((obj) => {
            if (obj.Name == elm) _present = true;
        });
        if (_present) {
            valueCheckCounter++;
        }
        else {
            _notPresentArr.push(elm);
        }
    });

    if (valueCheckCounter == _resourceCategoryArr.length) {
        _array.push({ desc: "All Resource Category values in Product Resources tab are present the Program Categories tab", errorsFound: false });
    }
    else {
        _array.push({ desc: "Some Resource Category values in Product Resources tab are not present the Program Categories tab. Please check these values in Product Resources tab - <br> <span style='color:red'>" + _notPresentArr + "</span>", errorsFound: true });
    }
    return _array;
}

function checkVersionColumn(_productResourceVersion, _programTocVersion) {
    let _array = [];
    if (!_productResourceVersion) {
        _array.push({ desc: "Version column not found in Product Resources tab.", errorsFound: true });
    }
    else {
        _array.push({ desc: "Version column found in Product Resources tab.", errorsFound: false });
    }

    if (!_programTocVersion) {
        _array.push({ desc: "Version column not found in Program Toc tab.", errorsFound: true });
    }
    else {
        _array.push({ desc: "Version column found in Program Toc tab.", errorsFound: false });
    }
    return _array;
}

function checkVersionColumnValue(versionNotFound, tocVersionNotFound) {
    let _array = [];
    if (versionNotFound.length > 0) {
        _array.push({ desc: "Version column values are not found in some rows of Product Resources tab. Please check the following resource code in Product Resources tab - <br> <span style='color:red'>" + versionNotFound + "</span>", errorsFound: true });
    }
    else {
        _array.push({ desc: "Version column values are found in all the rows of Product Resources Tab. ", errorsFound: false });
    }
    //--------------------------------------------
    if (tocVersionNotFound.length > 0) {
        let lessonString = "";
        tocVersionNotFound.forEach((elm, index) => {
            lessonString += elm + "<br>";
        });

        _array.push({ desc: "Version column values are not found in some rows of Program TOC tab. Please check the following lessons - <br> <span style='color:red'>" + lessonString + "</span>", errorsFound: true });
    }
    else {
        _array.push({ desc: "Version column values are found in all the rows of Program TOC tab. ", errorsFound: false });
    }
    return _array;
}

function checkNodeSublessonErrors(_nodeSublessonErrors) {
    let _array = [];
    if (_nodeSublessonErrors.length > 0) {
        _array.push({ desc: "Lesson and Sub-Lesson are not formatted correctly in some rows. Please check the following resource code in Product Resources tab - <br> <span style='color:red'>" + _nodeSublessonErrors + "</span>", errorsFound: true });
    }
    else {
        _array.push({ desc: "Lesson and Sub-Lesson are formatted correctly in all rows of Product Resources Tab. ", errorsFound: false });
    }
    return _array;
}

function checkFormatColumn(_formatColumnErrors) {
    let _array = [];
    if (_formatColumnErrors.length > 0) {
        _array.push({ desc: "Format Column values are found incorrect in some rows of Product Resources Tab. Please check the following resource code in Product Resources tab - <br> <span style='color:red'>" + _formatColumnErrors + "</span>", errorsFound: true });
    }
    else {
        _array.push({ desc: "Format column values of all rows found correct in Product Resources Tab. ", errorsFound: false });
    }
    return _array;
}

//==================================================================

