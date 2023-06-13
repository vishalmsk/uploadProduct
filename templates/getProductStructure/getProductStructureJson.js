/*
import {
    forEach,
    map,
    flatten,
    uniq,
    hasIn,
    cloneDeep,
    capitalize,
    find,
    filter,
    sortBy,
    isObject,
    isString,
    keys,
    indexOf,
    isArray,
    compact
} from "lodash";
*/
import _ from 'lodash';
const { forEach,
    map,
    flatten,
    uniq,
    hasIn,
    cloneDeep,
    capitalize,
    find,
    filter,
    sortBy,
    isObject,
    isString,
    keys,
    indexOf,
    isArray,
    compact } = _;
/*
import {
    getProblemListPromise
} from "../../redux/actions/assignmentAction";
*/
/*
import {
    getTagsPromise
} from "../../utils/Promises";
*/
/*
import {
    getSortedAssignmentsSubLessonIndex
} from "../../utils/Helper";
*/
import {
    ID_COLUMN_NAME,
    INDEX_COLUMN_NAME,
    NAME_COLUMN_NAME,
    TYPE_COLUMN_NAME,
    COLUMN_SEQUENCE_TO_SORT_PRODUCT_STRUCTURE,
    COLUMN_SEQUENCE_FOR_UNIQUE_KEY,
    UNIQUE_KEY_COLUMN_NAME,
    PROBLEM_QUESTION_TEXT_COLUMN_NAME,
    ASSESSMENT_TYPE_TEXT,
    ASSESSMENT_SUBTYPE_TEXT,
    SUBTYPE_COLUMN_NAME,
    TEMPLATE_TYPE_1_COLUMN_NAME,
    TEMPLATE_TYPE_2_COLUMN_NAME,
    DYNAMIC_COLUMN_NAMES_FOR_PRODUCT_STRUCTURE,
    DYNAMIC_OBJECT_KEY_VALUES,
    COLUMN_SEQUENCE_FOR_PRODUCT_STRUCTURE,
    ASSESSMENT_TYPE_COLUMN_NAME,
    ASSESSMENT_SUBTYPE_COLUMN_NAME,
    SKILLS_COLUMN_NAME,
    TEMPLATE_TYPE_DOCUMENT_SELECTOR,
    PROBLEM_ANSWER_TEXT_COLUMN_NAME,
    SCORE_COLUMN_NAME,
    ANSWER_WISE_INFO_NEEDED_FIELD,
    ANSWER_WISE_INFO_FIELD
} from "../../utils/Constants.js";
import {
    getHttpRequest
  } from '../excelResource/httpAxioRequest.js';
export function getProductStructureJson(data) {
   // console.log("getProductStructureJson");
    _console("getProductStructureJson", 55);
    return new Promise(async function (resolve, reject) {
       // showLoader();
        const {
            currentProductAssignments,
            unitstructure,
            addProblemDataInSheet,
            currentProductId,
            toc,
            workbook,
            resoursesUnitWiseDataForAutomation,
            applicationType
        } = data;
        const {
            units,
            chapters,
            lessons
        } = unitstructure;
        let programSheet = workbook.Sheets.Product;
        let spreadSheetProductCode = getSpreadSheetProductCode(programSheet);
        let errorList = [];
        _console("FROM CHARLES 555 ========= ");
        _console("Problem Editor Product Code = ", currentProductId);
        _console("Spreadsheet Product Code = ", spreadSheetProductCode);
        if (currentProductId != spreadSheetProductCode) {
            //_console("%c SpreadSheet mismatch. Product code of uploaded spreadsheet is different from selected product code. Please upload correct spreadsheet.", 'background: #ffff00; color: #000');
            //console.warn("Server Product code = "+currentProductId+" , Spreadsheet Product code = "+spreadSheetProductCode);
           // console.warn("Product code of uploaded spreadsheet is different from product code fetched from the server.");
            // return false;
        }
        _console("currentProductAssignments = ", currentProductAssignments);
        _console("unitstructure = ", unitstructure);
        //console.log("applicationType = ", applicationType);
        let problemLevelObjectAndProblemData = await getAllAssignmentProblems(currentProductAssignments, true,applicationType);
        let product_resources = workbook.Sheets["Product Resources"];
        _console("problemLevelObjectAndProblemData = ", problemLevelObjectAndProblemData);
        _console("toc = ", toc);
        _console("workbook = ", workbook);
        _console("programSheet = ", programSheet);
        _console("resoursesUnitWiseDataForAutomation = ", resoursesUnitWiseDataForAutomation);
        //==================== READ PRODUCT VERSIONS FROM SHEET ==============
        let productVersionObj = getProductVersions(workbook);
        _console("productVersionObj = ", productVersionObj);
        //==================== CREATE PROBLEM TOC FROM UPLOADED SPREADSHEET / EXCEL 
        let {programTOC,_toc} = createProblemTOC(workbook)
        let lessonTitles = getLessonTitlesFromSheet(workbook)
        _console("lessonTitles = ", lessonTitles);
        _console("programTOC = ", programTOC);
        _console("_toc = ", _toc);
       // _console("programTOCobj = ", programTOCobj);
        //============ CREATE PROBLEM OBJECT ============
        let _problemObj = getProblemData(problemLevelObjectAndProblemData);
        //================= CREATE LESSON OBJECT CONTAINING PROBLEM DATA ======
        let _lessons = getLessonObj(currentProductAssignments, _problemObj);
        // Note: correctSublessonIndexErrors function is commented as per the comment  11436#comment_17211384
        //_lessons = correctSublessonIndexErrors(_lessons); // Sifter 14536
        //=========================================================
        _console("_lessons = ", _lessons);
        _console("_problemObj = ", _problemObj);
        //===================================
        // this function will create raw product structure based on Unitstructure API data.
        let _productStructure = createRawProductStructure(unitstructure, _lessons, currentProductAssignments);
        _console("_productStructure  = ", _productStructure);
        //===================================
        // Above is raw product structure is created based on data of ProblemEditor
        //Below is step by step product structure json is created as per requirement.
        let _jsonObj = createProductStructureJson(_productStructure, _problemObj, currentProductId, _toc, lessonTitles,errorList);
        _console("_jsonObj = ", _jsonObj);
        rearrangeChapters(_jsonObj, programTOC,_toc);
        //========== FOR ELA GRADE 9 PRODUCTS ==================
        //========== ADD MISSING CHAPTERS FROM ASSESSMENT ==================
        addMissingChaptersAssessmentData(_jsonObj, resoursesUnitWiseDataForAutomation, _productStructure, _problemObj); // FOR ELA GRADE 9 LESSONS
        //========== ADD MISSING LESSONS FROM ASSESSMENT ==================
        addMissingLessonsAssessmentData(_jsonObj, currentProductAssignments, _problemObj);
        //========== ADD PRODUCT INFO ==================
        AddProductInfo(_jsonObj, programSheet);
        //========== FILTER DATA AS PER EXCEL ==================
       
        filterDataAsPerExcel(_jsonObj, programTOC, product_resources,_toc,errorList);
        
        //================ ADD DUMMY FEEDBACK DATA TO THE PROBLEMS ===========
       addDummyFeedbackData(_jsonObj);
        //=========================
        // Here there are some lesson instances in which only single sublesson is present.
        // So in this cases, we dont have to show the sublesson array. Just copy question data and give it to parent lesson and remove sublesson array.
        mergeSingleSublesson(_jsonObj);
        //=========== ADD Product Resources Sheet data ========
        addProductResourcesSheetData(_jsonObj,_toc);
        //============ SPLIT JSON AS PER PRODUCT VERSIONS =============
        let productJsonArr = createProductJsonVersions(_jsonObj,productVersionObj);
        //============================================================
         // Old JSON structure is converted to new JSON structure as mentioned in this ticket Sifter 15569
         
         // commented on 21/3/20233. Changes for Sifter 15569 not tested
         let _oldJsonArr = JSON.parse(JSON.stringify(productJsonArr)); 
         let _newJsonArr = convertJsonToNewStructure(_oldJsonArr);
         
         //========================
        // removeUnwantedData function added at the end. In order not to disturb the above process of creating json.
        // Some data and properties are needed for json creation but not needed in final json. 
        //So removeUnwantedData function will clean the final json and remove the unwanted data and properties which are not required.
        productJsonArr = removeUnwantedData(productJsonArr);
        //========================
        // merge old and new product json array to create final json array
        let _finalJsonArray = [...productJsonArr,..._newJsonArr]  // commented on 21/3/20233. Changes for Sifter 15569 not tested
        //===============================
         _console("errorList = ", errorList);
         _console("_toc = ", _toc);
        _console("_jsonObj = ", _jsonObj);
        _console("productJsonArr = ", productJsonArr);
       
         // commented on 21/3/20233. Changes for Sifter 15569 not tested
        _console("_newJsonArr = ", _newJsonArr);
        _console("_finalJsonArray = ", _finalJsonArray);
        
        if(applicationType == "react")
        {
           // localStorage.productJson = JSON.stringify(_finalJsonArray);
        }
        
        // String is stored in localStorage for debugging 
        // to get string. use this code - JSON.parse(localStorage.productJson);
        //===================================
        // use the below function to compare final json with sheet
       // CheckFinalJsonWithSheet(_jsonObj,_toc);
        //===================================
       // demoDeleteProductData("Hk81oS6cj");
       //
     
       // hideLoader();
        resolve({
           // productStructure: productJsonArr,
            errorList:errorList,
            productStructure: _finalJsonArray, // commented on 21/3/20233. Changes for Sifter 15569 not tested
        });
        });
}


function getProblemListPromise(_searchVal,applicationType) {
    //console.log("getProblemListPromise");
    //https://node.perfectionnext.com:8083/problems/query
    return new Promise((resolve, reject) => {
      var settings = {
        "async": true,
        "crossDomain": true,
        //"url": app.serverPath + app.paths.problemQuery,
        "url": "https://node.perfectionnext.com:8083/problems/query",
        "method": "PUT",
        "headers": {
          "Content-Type": "application/json"
        },
        "processData": false,
        "data": JSON.stringify(_searchVal)
      }
      settings.applicationType = applicationType;
      getHttpRequest(settings, function (_data) {
        //console.log("ProblemList data = ",_data);
        resolve(_data)
      }, function (error) {
        reject(error)
      });
    });
  }

  function getTagsPromise(tagIdArray,applicationType) {
    //console.log("getTagsPromise json js");
    //console.log("url == ",(app.serverPath + app.paths.tagFilter));
    //https://node.perfectionnext.com:8083/tag/filter
    return new Promise((resolve, reject) => {
        let tagData = {
            tagId: {
                $in: tagIdArray
            }
        }
        let settings = {
            "async": true,
            "crossDomain": true,
            //"url": app.serverPath + app.paths.tagFilter,
            "url": "https://node.perfectionnext.com:8083/tag/filter",
            "method": "PUT",
            "headers": {
                "Content-Type": "application/json"
            },
            "processData": false,
            "data": JSON.stringify(tagData)
        }
        settings.applicationType = applicationType;
        getHttpRequest(settings, function (_resData) {
            //console.log("_resData = ",_resData);
            resolve(_resData);
        }, function (_status) {
            resolve([]);
        });
    });
}

  
/*
  function getHttpRequest(settings, _callBackFn, _errorCallBackFn) {
    console.log("getHttpRequest");
    console.log("settings = ", settings);
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
    //=====================================
   
//   axios({
//    method: 'PUT',
//    url: "https://node.perfectionnext.com:8083/usercontent/query",
//    data:data
//   }).then(function (response) {
//    console.log(response);
//   })
//   .catch(function (error) {
//    console.log(error);
//   });
  
    //======================================
  };

  */

 



 // commented on 21/3/20233. Changes for Sifter 15569 not tested

function convertJsonToNewStructure(_oldJsonArr)
{
    let _newJsonArr = [];
    _oldJsonArr.forEach((elm)=>{
        let jsonObj = {};
        jsonObj.nodes = getNodesArr(elm.json);
        jsonObj.product = {...elm.json.product}
       //---------------------------------------------
       let _productObj = {};
       _productObj.json = jsonObj;
       _productObj.productCode = elm.productCode+"_V2";
       _newJsonArr.push(_productObj);
    });
    return _newJsonArr;
}

function getNodesArr(_jsonObj)
{
    let nodeArr = [];
    _jsonObj.containers.forEach((containerObj) => {
        if (containerObj) {
            containerObj.type = "container";
            if (containerObj.containers && containerObj.contents) {
                containerObj.nodes = getNodesArr(containerObj)
            }
            delete containerObj.containers;
            delete containerObj.contents;
            nodeArr.push(containerObj);
        }
    });
    //-----------------------------------------
    // Filter out nulls, which were causing the error reported in 16379#comment_17428442
    _jsonObj.contents = _jsonObj.contents.filter(item=>item);

    _jsonObj.contents.forEach((contentsObj)=>{
        contentsObj.type = "content";
        if(contentsObj.containers && contentsObj.contents)
        {
            contentsObj.nodes =  getNodesArr(contentsObj)
        }
        delete contentsObj.containers;
        delete contentsObj.contents;
        nodeArr.push(contentsObj);
        });
    //----------------------------------------------
    // arrange array in ascending order as per displayOrder
    nodeArr.sort((a, b) => parseFloat(a.displayOrder) - parseFloat(b.displayOrder));
    //----------------------------------------------
    // Remove unwanted properties.
    nodeArr = nodeArr.map((elm,index)=>{
        if(elm.displayOrder)  delete elm.displayOrder;
        if(elm.version)  delete elm.version;
        elm.index = index;
        return elm;
    });
    //------------------------------------------------
    return nodeArr;
}



function cloneObject(obj)
{
    return JSON.parse(JSON.stringify(obj)); 
}

function findMatch(version,productVersions)
{
    if(!productVersions) return;
    if(productVersions == "All") return true;;
    productVersions = productVersions.replace(/ /g,''); // remove spaces from string
    let productVersionArr = productVersions.split(",");
    let matchArr = productVersionArr.filter((element)=>
    {
        return version == element ? element : false;
    });
    return matchArr.length > 0 ? true:false;
}

function removeIndex(arr,index)
{
    //console.log("removeIndex "); //
    //arr.splice(index, 1);
    arr[index] = null;
}

function cleanArray(arr)
{
    arr =  arr.filter((elm)=>{
        return elm ? elm : false;
    });
    return arr;
}

function filterVersionData(arr,_version,name,type)
{
    
    arr.forEach((elment, index) => {
        let _findMatch = findMatch(_version, elment.version);
        !_findMatch ? removeIndex(arr,index) : null;
        // console.log(type,name,index,_version,elment.version,_findMatch);
    });

    return cleanArray(arr);
}

function cleanVersionJson(obj)
{
    //console.log("cleanVersionJson");
    //console.log("obj = ",obj);
    obj.containers.forEach((element,index)=>{
       // console.log(index," === ",element);
        if(element.containers.length > 0)
        {
            element.containers.forEach((innerElement,innerIndex)=>{
                if(innerElement.containers.length == 0 && innerElement.contents.length == 0)
                {
                    element.containers[innerIndex] = null;
                }
            });
            element.containers = cleanArray(element.containers);
        }

        if(element.containers.length == 0 && element.contents.length == 0)
        {
            obj.containers[index] = null;
        }
    });
    obj.containers = cleanArray(obj.containers);
    return obj;

}
//=======================================================
function removeUnwantedData(productJsonArr)
{
    // This code will remove unwanted properties from the JSON string.
    productJsonArr.forEach((elm)=>{
       let _jsonObj = elm.json;
        // Check Outer Content Array
        removeData(_jsonObj.contents);
        // Check Outer Container
        _jsonObj.containers.forEach((chapters) => {
            if(chapters)
            {
                if(chapters.displayOrder)  delete chapters.displayOrder;
                if(chapters.containers)
                {
                    chapters.containers.forEach((lessons) => {
                        if(lessons.displayOrder)  delete lessons.displayOrder;
                        removeData(lessons.contents);
                    });
                }
                removeData(chapters.contents);
            }
        });
    });
    return productJsonArr;
}

function removeData(obj)
{
    if(!obj) return;
    obj.forEach((elm) => {
        if(elm)
        {
            if(elm.version)  delete elm.version;
            if(elm.displayOrder)  delete elm.displayOrder;
            if(elm.gradingObject)
            {
                rearrangeGradingObject(elm);
            }
            if(elm.sublessons)
            {
                cleanSublessonArr(elm.sublessons);
            }
        }
    });

}

function cleanSublessonArr(sublessons)
{
    //console.log("cleanSublessonArr = ",sublessons);
    sublessons.forEach((elm)=>{
        if(elm.gradingObject)
        {
           rearrangeGradingObject(elm);
        }
    });
}

function rearrangeGradingObject(elm)
{
    let qArrayIndex = elm.gradingObject.arrayIndex;
    if(elm.questions)
    {
        //elm.questions.splice(qArrayIndex, 1);
        elm.questions = elm.questions.filter((elm)=>{
            return elm.type != "grading" ? true : false;
        });
    }
    delete elm.gradingObject.arrayIndex;
    delete elm.gradingObject.questionID;
    elm.gradingObject.feedbacks[0] = elm.gradingObject.feedbacks[0].split(", question")[0];
   //console.log("elm.gradingObject = ",elm.gradingObject.questionID);
}

//=====================================
function createProductJsonVersions(_jsonObj, productVersionObj) {
    // This function will split json into multiple JSON as per product versions
    _console("createProductJsonVersions");
    //console.log("_jsonObj = ", _jsonObj);
    _console("productVersionObj = ", productVersionObj);
    //console.log("size of productVersionObj = ",_.size(productVersionObj));
    let productJsonArray = [];
    productJsonArray.push({productCode:_jsonObj.product.productCode,json:_jsonObj});
    //========================
    let productChild = [];
    for(var i in productVersionObj)
    {
        productChild.push(i);
    }
    //========================
   // console.log("productChild = ",productChild);
    if(productChild.length == 1 && productChild[0] == _jsonObj.product.productCode)
    {
        return productJsonArray;
    }

    for (var i in productVersionObj) {
        let copyJsonObj = JSON.parse(JSON.stringify(_jsonObj));
        let _version = productVersionObj[i].version;
        //=======================
        copyJsonObj.product.productCode = i;
        copyJsonObj.product.series = productVersionObj[i].programSeries;
        copyJsonObj.product.version = productVersionObj[i].version;
        //====================== Check Outer Content Array
        copyJsonObj.contents = filterVersionData(copyJsonObj.contents, _version,copyJsonObj.menuText, "unit");
        //======================= Check outer Container Array
        copyJsonObj.containers.forEach((chapters) => {
            chapters.containers.forEach((lessons) => {
                lessons.contents = filterVersionData(lessons.contents, _version,lessons.menuText, "sublesson");
            });
            chapters.contents = filterVersionData(chapters.contents, _version,chapters.menuText,"lesson");
        });
        //===================================
        copyJsonObj = cleanVersionJson(copyJsonObj); // remove blank lessons
        productVersionObj[i].json = copyJsonObj;
        productJsonArray.push({productCode:i,json:copyJsonObj});
    }
   // console.log("productVersionObj after = ", productVersionObj);
    return productJsonArray;
   // return productVersionObj;
  
}
//===================================
function getColumnName(sheetColumns,_productTab)
{
    let sheetColumnsObj = {};
    sheetColumns.forEach((elm)=>{
        for(var i in _productTab)
        {
            if(_productTab[i].v == elm)
            {
                let _name = i;
                if(!isNaN(i.charAt(1)))
                {
                    _name = i.charAt(0);
                }
                else
                {
                    _name = i.substring(0, 2);
                }
                sheetColumnsObj[elm] = _name;
                break; 
            }
        }
    });
    //================
    
    //================
    return sheetColumnsObj;
}

function getProductVersions(workbook)
{
    let _productTab = workbook.Sheets["Product"];
    let sheetColumns = ["Product Code","Product Name","Program Series","Subject","Version"];
    let sheetColumnsObj = getColumnName(sheetColumns,_productTab);
    let productVersionObj = {};
    for (var i in _productTab) {
        if (i.indexOf("A") != -1 && i != "A1" && !isNaN(i.charAt(1))) {
            let _rowNum = i.charAt(1); 
            //===========================
            let _productCode =  _productTab[sheetColumnsObj["Product Code"]+_rowNum].v;
            let productName = _productTab[sheetColumnsObj["Product Name"]+_rowNum].v;
            let programSeries = _productTab[sheetColumnsObj["Program Series"]+_rowNum].v;
            let _subject = _productTab[sheetColumnsObj["Subject"]+_rowNum].v;
            let _version = _productTab[sheetColumnsObj["Version"]+_rowNum].v;
            //===============================
            let rowObject = {};
            rowObject.rowNum = _rowNum;
            rowObject.productName = productName;
            rowObject.programSeries = programSeries;
            rowObject.subject = _subject;
            rowObject.version = _version;
            //===============================
            productVersionObj[_productCode] = rowObject;
        }
    }
    return productVersionObj;
}

function findDuplicateIndex(_lessonId,_subLessons)
{
    //console.log("findDuplicateIndex = ",_lessonId);
    let indexArr = [];
    let duplicateIndex = false;
    _subLessons.forEach((elm)=>{
        if(indexArr.indexOf(elm.subLessonIndex) == -1)
        {
            indexArr.push(elm.subLessonIndex);
        }
        else
        {
            duplicateIndex = true;
        }
    });
    return duplicateIndex;
    

}

function correctSublessonIndexErrors(_lessons) {
    // console.log("correctSublessonIndexErrors");
    // This function is added to correct sublesson index errors.
    // many times in Server data, within a lesson, 2 sublessons may have duplicate index.
    // So it will find those errors and will correct it.
    for (var i in _lessons) {
        let _subLessons = _lessons[i];
        let duplicateIndex = findDuplicateIndex(i, _subLessons);
        if (duplicateIndex) {
            let newArr = [];
           let sortedata = _subLessons.sort(function(a, b) {
                return (a.subLessonIndex - b.subLessonIndex);
            });
            sortedata.forEach((element, index) => {
                element.subLessonIndex = index;
               // newArr.push(element);
            });
            
        }
        //console.log(i," ==== ",_subLessons);
    }
    return _lessons;
}

function demoDeleteProductData(idToDelete) {
    if(!idToDelete) return;
    /*
        This API was added to remove unwanted files uploaded on SERVER API
        for tickete https://perfectionlearning.sifterapp.com/issues/12912
    */
    //console.log("demoDeleteProductData");
    // console.log("currentProductId = ", currentProductId);
    //=======================================
    var data = {
      filter: {
        _id: {
          $in: [idToDelete],
        },
      },
    };

    var settings = {
      method: "PUT",
      xhrFields: {
        withCredentials: true,
      },
      headers: {
        "Content-Type": "application/json",
      },
      url: "https://node.perfectionnext.com:8083/usercontent/delete",
      data: JSON.stringify(data),
    };

    console.log("settings = ",settings);
    
    $.ajax(settings).done(function (response) {
      console.log(response);
    });
   
    //==========================================
  }

function CheckFinalJsonWithSheet(_jsonObj, _toc) {
    console.log("CheckFinalJsonWithSheet");
    let errorFound = false;
    for (var i in _toc) {
        let _unitName = i;
        let isContainer = false;
        // First check whether unit container or content ==========
        let childrensArr = [];
        let _unitContainer = [];
        let _unitContent = [];
        for (var j in _toc[i].children) {
            let sublessonArr = [];
            if (j != "EMPTY") {
                childrensArr.push(j);
                let _lessonName = j;
                if (_toc[i].children[j].desc) {
                    _lessonName = j + ": " + _toc[i].children[j].desc;
                }
                if (_.size(_toc[i].children[j].children) > 0) {
                    _unitContainer.push(_lessonName);
                } else {
                    _unitContent.push(_lessonName);
                }
                for (var k in _toc[i].children[j].children) {
                    sublessonArr.push(k);
                }
                // console.log(j," :: ",sublessonArr);
            } else {
                if (_toc[i].children[j].desc) {
                    _unitName = i + ": " + _toc[i].children[j].desc;
                }
            }
        }
        isContainer = childrensArr.length > 0 ? true : false;
        let _checkUnit;
        if (isContainer) {
            _checkUnit = _jsonObj.containers.filter((elm) => {
                return elm.menuText == _unitName;
            });
            if (_checkUnit.length > 0) {
                console.log("%c Unit = " + _unitName + " :: Container  verified", 'color: green');
            } else {
                console.log("%c Unit = " + _unitName + " :: Container  Error", 'color: red');
                errorFound = true;
            }
        } else {
            _checkUnit = _jsonObj.contents.filter((elm) => {
                return elm.menuText == _unitName;
            });
            if (_checkUnit.length > 0) {
                console.log("%c Unit = " + _unitName + " :: content  verified", 'color: green');
            } else {
                console.log("%c Unit = " + _unitName + " :: content  Error", 'color: red');
                errorFound = true;
            }
        }
        //console.log("isContainer = ",isContainer);
        console.log("_checkUnit = ",_checkUnit);
        // console.log("childrensArr = ",childrensArr);
        if (_checkUnit.length > 0)
        {
            if(_checkUnit[0].containers)
            {
                if (_unitContainer.length == _checkUnit[0].containers.length) {
                    console.log("%c Inner container count matched", 'color: green');
                    _checkUnit[0].containers.forEach((lesson) => {
                        if (_unitContainer.indexOf(lesson.menuText) == -1) {
                            console.log("%c " + lesson.menuText + " :: text mismatch ", 'color: red');
                            errorFound = true;
                        } else {
                            console.log("%c " + lesson.menuText + " :: text verified ", 'color: green');
                            //console.log("lesson = ",lesson);
                            let sublessonLength = _.size(_toc[i].children[lesson.menuText.split(":")[0]].children);
                            let jsonSublessons = lesson.contents;
                            if (jsonSublessons) {
                                if (sublessonLength == jsonSublessons.length) {
                                    console.log("%c Inner sublesson count verified : " + sublessonLength, 'color: green');
                                } else {
                                    console.log("%c Inner sublesson count error " + sublessonLength + " :: " + jsonSublessons.length, 'color: red');
                                    errorFound = true;
                                }
                                let _tocSublessons = _toc[i].children[lesson.menuText.split(":")[0]].children;
                                jsonSublessons.forEach((sublesson) => {
                                    if (_tocSublessons[sublesson.menuText.split(":")[0]]) {
                                        console.log("%c "+sublesson.resourceCode+" :: " + sublesson.menuText + " :: text verified ", 'color: green');
                                       // console.log("sublesson = ",sublesson);
                                    } else {
                                        console.log("%c " + sublesson.menuText + " :: text mismatch ", 'color: red');
                                        errorFound = true;
                                        console.log("_tocSublessons = ", _tocSublessons);
                                    }
                                });
                            }
                            console.log("-----------------------");
                        }
                    });
                } else {
                    console.log("%c Inner container count Error", 'color: red');
                    console.log("_unitContainer = ",_unitContainer)
                    console.log("_checkUnit[0].containers = ",_checkUnit[0].containers)
                    errorFound = true;
                }
            }
            
            if(_checkUnit[0].contents)
            {
                if (_unitContent.length == _checkUnit[0].contents.length) {
                    console.log("%c Inner contents count matched", 'color: green');
                    _checkUnit[0].contents.forEach((lesson) => {
                        if (_unitContent.indexOf(lesson.menuText) == -1) {
                            console.log("%c " + lesson.menuText + " :: text mismatch ", 'color: red');
                            errorFound = true;
                        } else {
                            console.log("%c "+lesson.resourceCode+" :: "+ lesson.menuText + " :: text verified ", 'color: green');
                           // console.log("lesson.resourceCode = ",lesson.resourceCode);
                            let tocLesson = _toc[i].children[lesson.menuText.split(":")[0]];
                            /*
                            if(lesson.resourceCode && lesson.resourceCode == tocLesson.resourceCode)
                            {
                                console.log("%c Resource Code verified ", 'color: green');
                            }
                            else
                            {
                                console.log("%c Resource Code Error ", 'color: red');
                            }
                            */
                            
                           // console.log(i,_toc[i]);
                           // console.log("lesson == ",lesson);
                            //console.log("resource code == ",_toc[i].children[lesson.menuText.split(":")[0]]);
                            //===============================
                            let sublessonLength = 0;
                            if(_toc[i].children[lesson.menuText.split(":")[0]])
                            {
                                sublessonLength = _.size(_toc[i].children[lesson.menuText.split(":")[0]].children);
                            }
                            else
                            {
                                if(_toc[i].children[lesson.menuText])
                                {
                                    sublessonLength = _.size(_toc[i].children[lesson.menuText].children);
                                }
                            }

                           



                            let jsonSublessons = lesson.contents;
                            if (jsonSublessons) {
                                if (sublessonLength == jsonSublessons.length) {
                                    console.log("%c Inner sublesson count verified : " + sublessonLength, 'color: green');
                                } else {
                                    console.log("%c Inner sublesson count error " + sublessonLength + " :: " + jsonSublessons.length, 'color: red');
                                    errorFound = true;
                                }
                                let _tocSublessons = _toc[i].children[lesson.menuText.split(":")[0]].children;
                                jsonSublessons.forEach((sublesson) => {
                                    if (_tocSublessons[sublesson.menuText.split(":")[0]]) {
                                        console.log("%c " + sublesson.menuText + " :: text verified ", 'color: green');
                                    } else {
                                        console.log("%c " + sublesson.menuText + " :: text mismatch ", 'color: red');
                                        errorFound = true;
                                    }
                                });
                            }
                           // console.log("-----------------------");
                            // console.log(" unit == _toc[i] = ",_toc[i].children[lesson.menuText]);
                            //===============================
                        }
                    });
                } else {
                    console.log("%c Inner contents count Error", 'color: red');
                    console.log("_unitContent = ",_unitContent)
                    console.log("_checkUnit[0].contents = ",_checkUnit[0].contents)
                    errorFound = true;
                }
            }
    
        }
       
        
       // console.log("_checkUnit = ", _checkUnit);
        // console.log("_unitContainer = ",_unitContainer);
         //console.log("_unitContent = ",_unitContent);
        console.log("======================================");
    }
    if (errorFound) {
        console.log("Errors found in the JSON");
    } else {
        console.log("No Errors found in the JSON");
    }
}

function _console(...obj) {
    // Please change to true to enable consoles
    var bool = false;  
    if (bool) {
        console.log(...obj);
    }
}

function getSpreadSheetProductCode(programSheet) {
    return programSheet["A2"].v;
}

function createRawProductStructure(unitstructure, _lessons, currentProductAssignments) {
    _console("createRawProductStructure");
    let _productStructure = [];
    for (var i = 0; i < unitstructure.units.length; i++) {
        let _unitObj = unitstructure.units[i];
        let _unitID = unitstructure.units[i].id;
        _unitObj.chapters = [];
        for (var j = 0; j < unitstructure.chapters.length; j++) {
            if (unitstructure.chapters[j].parents[0].parentId == _unitID) {
                let _chapterObj = unitstructure.chapters[j];
                let _chapterID = unitstructure.chapters[j].id;
                _chapterObj.lessons = [];
                //=====================================
                for (var k = 0; k < unitstructure.lessons.length; k++) {
                    if (unitstructure.lessons[k].parents[0].parentId == _chapterID) {
                        let _lessonObj = unitstructure.lessons[k];
                        let _lessonID = unitstructure.lessons[k].id;
                        _lessonObj.sublessons = [];
                        //=========================== sublesson obj 
                        let subArr = rearrangesublessons(_lessons[_lessonID]);
                        _lessonObj.sublessons.push(subArr);
                        //======================= Lessons
                        _chapterObj.lessons.push(unitstructure.lessons[k]);
                    }
                }
                //===================================== Chapters
                _unitObj.chapters.push(unitstructure.chapters[j]);
            }
        }
        //========== In chapters there may be more assignments like Unit opener, Unit one review like GRADE 9 , ELA - UNIT 1
        // fetch those assignments from currentproduct assignments
        let assignments = currentProductAssignments.filter((ele) => {
            return ele.lessons.length > 0 ? ele.lessons[0].lessonId === _unitID : false;
        });
        if (assignments.length > 0) {
            _unitObj._assignments = assignments;
        }
        //========================
        _productStructure.push(_unitObj);
    }
    return _productStructure;
}
//=======================
function correctLessonTitle(_lessonTitle, _tocLessons, chapterName) {
  let _titleArr = _lessonTitle.split(":");
  if (_titleArr.length > 2) {
    // Its is done for connection ELA titles. As there names contains units and chapters
    _lessonTitle = _titleArr[_titleArr.length - 1].trim();
  }

  if (_titleArr.length == 2 && _lessonTitle.indexOf(chapterName) != -1) {
    _lessonTitle = _titleArr[_titleArr.length - 1].trim();
  }

  //=========== Check lesson name in TOC Sheet object ============

  if (_tocLessons) {
    if (_tocLessons[_lessonTitle]) {
      //console.log("_lessonTitle found ===",_lessonTitle);
    } else {
      // console.log("_lessonTitle not found  ===",_lessonTitle);
      let _similarFoundArr = [];
      for (var m in _tocLessons) {
        if (m.indexOf(_lessonTitle) != -1) {
          _similarFoundArr.push(m);
          // console.log("Similar found   ===",m);
        }
      }
      if (_similarFoundArr.length == 1) {
        _lessonTitle = _similarFoundArr[0];
      }
      if (
        _lessonTitle.indexOf("Review") != -1 &&
        _lessonTitle.indexOf("Writing") != -1
      ) {
        _lessonTitle = "Writing";
      }
      if (_lessonTitle.indexOf("Student Support") != -1) {
        _lessonTitle = _lessonTitle.split(":")[1].trim();
      }
    }
  }
  return _lessonTitle;
}
//=======================
function createProductStructureJson(_productStructure, _problemInfo, currentProductId, toc, lessonTitles,errorList) {
    _console("createProductStructureJson");
   // _console("toc = ",toc);
    let obj = {};
    obj.product = {
        "productCode": currentProductId,
    }
    obj.containers = [];
    // 
    for (var i = 0; i < _productStructure.length; i++) {
        let _unitObj = {};
        _unitObj.menuText = _productStructure[i].title;
        let unitDescObj = getColumnDesc(_unitObj.menuText, null, null, toc,"unit");
        if (unitDescObj.desc) {
           _unitObj.menuText = _unitObj.menuText + ": " + unitDescObj.desc;
        }

        if(unitDescObj.displayOrder)
        {
            _unitObj.displayOrder = unitDescObj.displayOrder * 1;
        }
        if(unitDescObj.navigationId)
        {
            _unitObj.navID = unitDescObj.navigationId ;
        }
        _unitObj.containers = [];
        _unitObj.contents = [];
        //console.log("_unitObj.menuText = ",_unitObj.menuText);
        let _unitName = _unitObj.menuText.split(":")[0].trim();
        //console.log("_unitName = ",_unitName);
        if(!toc[_unitName])
            {
               //  console.log("Unit name not present in toc ");
              errorList.push({type:"error",msg:"⚠ JSON Error: Unit ["+_unitName+"] found in ProblemEditor but not found in program TOC."});
            }
        //============== Chapters ==========
        if(toc[_unitName] && _productStructure[i])
        {
            let {missingChapters,mDashCharacterArr} = findChapterMismatch(toc[_unitName].children,_productStructure[i].chapters);
            //console.log("mDashCharacterArr = ",mDashCharacterArr);
            if(missingChapters.length > 0)
            {
             missingChapters.forEach((elm)=>{
                 errorList.push({type:"error",msg:"⚠ JSON Error: Chapter ["+elm+"] of Unit ["+_unitName+"] found in program TOC but not found in ObjectEditor."});
             });
             
            }

            if(mDashCharacterArr.length > 0)
            {
                mDashCharacterArr.forEach((elm)=>{
                 errorList.push({type:"error",msg:"⚠ JSON Error: Chapter ["+elm.title+"] of Unit ["+_unitName+"] contains mDASH Character. Please check."});
             });
             
            }

        }
           
        for (var j = 0; j < _productStructure[i].chapters.length; j++) {
            let _chapterObj = {};
            _chapterObj.menuText = _productStructure[i].chapters[j].title;
            let _chName = getChapterMenuText( _chapterObj.menuText,toc);
            /*
            if (_chName.indexOf("Chapter") != -1 && _chName.indexOf(":") != -1) {
                _chName = _chapterObj.menuText.split(":")[0].trim();
            }
            */
            let chapterDescObj = getColumnDesc(_unitObj.menuText.split(":")[0], _chName,null,toc,"lesson");
           if (chapterDescObj.desc) {
                _chapterObj.menuText = _chName + ": " + chapterDescObj.desc;
            }
            //console.log("_chName = ",_chName,chapterDescObj);
            if(chapterDescObj.displayOrder)
            {
                _chapterObj.displayOrder = chapterDescObj.displayOrder * 1;
            }
            if(chapterDescObj.navigationId)
            {
                _chapterObj.navID = chapterDescObj.navigationId ;
            }
            _chapterObj.containers = []; 
            _chapterObj.contents = [];
            _chapterObj.id = _productStructure[i].chapters[j].id; // temp commented
            //============================
            let _unitName = _unitObj.menuText.split(":")[0].trim();
           // let _chapterName = _chapterObj.menuText.split(":")[0].trim();
            let _chapterName = getChapterMenuText(_chapterObj.menuText,toc);
            let _tocLessons;
            if(toc[_unitName])
            {
                if(toc[_unitName].children[_chapterName])
                {
                    _tocLessons  = toc[_unitName].children[_chapterName].children;
                }

            }
            //console.log("_chapterName = ",_chapterName);
            //console.log("_tocLessons  ===",_tocLessons);
            //console.log("_productStructure[i].chapters[j].lessons  ===",_productStructure[i].chapters[j].lessons);

            if(toc[_unitName] && _productStructure[i] && _productStructure[i].chapters[j])
            {
                let {missingLessons,mDashCharacterArr} = findLessonMismatch(_tocLessons,_productStructure[i].chapters[j].lessons);
            //console.log("missingLessons  ===",missingLessons);
                if(missingLessons.length > 0)
                {
                    missingLessons.forEach((elm)=>{
                     errorList.push({type:"error",msg:"⚠ JSON Error: Lesson ["+elm+"] of Unit ["+_unitName+"], Chapter["+_chapterName+"] found in program TOC but not found in ObjectEditor."});
                 });
                 
                }

                if(mDashCharacterArr.length > 0)
                {
                    mDashCharacterArr.forEach((elm)=>{
                     errorList.push({type:"error",msg:"⚠ JSON Error: Lesson ["+elm.title+"] of Unit ["+_unitName+"], Chapter["+_chapterName+"] contains mDash. Please check."});
                 });
                 
                }
            }

            

          //console.log("_chapterObj.menuText = ",_chapterObj.menuText);
            //=============== Lessons ====================
            for (var k = 0; k < _productStructure[i].chapters[j].lessons.length; k++) {
                let _lessonObj = {};
                let _lessonTitle = _productStructure[i].chapters[j].lessons[k].title;

                // This function is written to correct errors in lesson titiles, mosly in connection ELA products
                _lessonTitle = correctLessonTitle(_lessonTitle,_tocLessons,_chName);

                // console.log("_lessonTitle = ",_lessonTitle);

                //===========================================
               
                _lessonObj.menuText = _lessonTitle;
                let lessonDescObj = getColumnDesc(_unitObj.menuText.split(":")[0],_chName, _lessonObj.menuText,toc,"sublesson");
                if (lessonDescObj.desc) {
                    _lessonObj.menuText = _lessonObj.menuText + ": " + lessonDescObj.desc;
                }
               // console.log("_lessonObj = ",_lessonObj.menuText,lessonDescObj);
                if(lessonDescObj.displayOrder)
                {
                    _lessonObj.displayOrder = lessonDescObj.displayOrder * 1;
                }
                if(lessonDescObj.navigationId)
                {
                    _lessonObj.navID = lessonDescObj.navigationId ;
                }
                _lessonObj.questions = [];
                _lessonObj.sublessons = [];
               //console.log("_lessonObj.menuText = ",_lessonObj.menuText);
                //================== SUB LESSONS ==================
                let _sublessons = _productStructure[i].chapters[j].lessons[k].sublessons[0];
                //console.log("_sublessons = ",_sublessons);
                if (_sublessons) {
                    for (var l = 0; l < _sublessons.length; l++) {
                        let _subLessonObj = {};
                        if (!_sublessons[l].name || checkForLongSpacesInString(_sublessons[l].name)) {
                            let _n = _sublessons[l].presentation_data.subLessonType;
                            if(_n == "Self Check") _n = "Check";
                            _sublessons[l].name = _n; 
                            //console.log("_sublessons[l].presentation_data.subLessonType = ",_n);
                        }
                        //console.log("_sublessons[l].name = ",_sublessons[l].name);
                       //console.log("_sublessons[l].lessonName = ",_sublessons[l].lessonName);
                        if(!_sublessons[l].presentation_data.subLessonType && !_sublessons[l].presentation_data.subLessonName)
                        {
                            errorList.push({type:"error",msg:"⚠ JSON Error: Invalid values of sublesson Type is present in "+_unitObj.menuText+", "+_chapterObj.menuText+", Assignment ID: "+_sublessons[l].assignmentID});
                        }
                        let _sublessonName = _sublessons[l].name;
                        if(!_sublessonName)
                        {
                            _sublessonName = _sublessons[l].lessonName;
                        }
                        //if (_sublessons[l].name) 
                        if (_sublessonName) 
                        {
                           // _subLessonObj.name = getTextContent(_sublessons[l].name);
                            _subLessonObj.name = getTextContent(_sublessonName);
                            _subLessonObj.index = _sublessons[l].subLessonIndex;
                            _subLessonObj.questions = [];
                            let _problems = _sublessons[l].problems;
                            //console.log(_subLessonObj.name,_problems);
                            _subLessonObj.questions = createProblemObject(_problems, _problemInfo);
                            //============== Sifter 16379 - grading object =============
                            extractGradingObject(_subLessonObj);
                            /*
                            let _gradingObject = extractGradingObject(_subLessonObj.questions);
                            if(_gradingObject)
                            {
                                console.log("_gradingObject == ",_gradingObject);
                                _subLessonObj.gradingObject = _gradingObject;
                            }
                            */
                            //=========================================
                            _lessonObj.sublessons.push(_subLessonObj);
                        }
                    }
                }
                _chapterObj.contents.push(_lessonObj);
                //==========================================
            }
            //===========================================
            _unitObj.containers.push(_chapterObj);
        }
        //==================================
        obj.containers.push(_unitObj);
    }
    return obj;
}


function  findChapterMismatch(tocChapters,problemEditorchapters)
{
    //console.log("findChapterMismatch");
   // console.log("tocChapters = ",tocChapters);
   // console.log("problemEditorchapters = ",problemEditorchapters);
    let missingChapters = [];
    let mDashCharacterArr = [];
    for(var i in tocChapters)
    {
        let _found = false;
        problemEditorchapters.forEach((elm)=>{
          if((i.trim() == elm.title.split(":")[0].trim()) || (i.trim() == elm.title.trim()))
            {
                _found = true;
            }
           // console.log(i,elm.title,(similarity(i, elm.title) * 100)," mdash === ",elm.title.indexOf("—"));
            if(elm.title.indexOf("—") != -1)
            {
                mDashCharacterArr.push({title:elm.title,location:"ProblemEditor"});
            }
            if(i.indexOf("—") != -1)
            {
                mDashCharacterArr.push({title:i,location:"spreadsheet"});
            }
        });
         if(i != "EMPTY" && !_found)
        {
            missingChapters.push(i);
        }
    }
    return {missingChapters,mDashCharacterArr};
}

function  findLessonMismatch(tocLessons,problemEditorLessons)
{
    let missingLessons = [];
    let mDashCharacterArr = [];
    for(var i in tocLessons)
    {
        let _found = false;
        problemEditorLessons.forEach((elm)=>{
          if((i.trim() == elm.title.split(":")[0].trim()) || (i.trim() == elm.title.trim()))
            {
                _found = true;
            }
            //console.log(i,"::",elm.title,"::",_found);
            if(elm.title.indexOf("—") != -1)
            {
                mDashCharacterArr.push({title:elm.title,location:"ProblemEditor"});
            }
            if(i.indexOf("—") != -1)
            {
                mDashCharacterArr.push({title:i,location:"spreadsheet"});
            }
        });
        
         if(i != "EMPTY" && !_found)
        {
            missingLessons.push(i);
        }
    }
    return {missingLessons,mDashCharacterArr};
}

function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
      return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
  }

  function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
  
    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i == 0)
          costs[j] = j;
        else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue),
                costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0)
        costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }


function extractGradingObject(_subLessonObj)
{
    //_subLessonObj.questions
    // This function will extract grading object from the questions array
    // grading object data will be read like other problem data in the beginiging.
    
    let gradingObj;
    let gradingIndex;
    if(_subLessonObj.questions)
    {
        _subLessonObj.questions.forEach((elm,index)=>{
            if(elm.type == "grading")
            {
               //let cloneElm = cloneObject(elm);
               let cloneElm = {...elm};
                gradingObj ={};
                gradingObj["_//"] = "grading object";
                gradingObj.grades = cloneElm.grades;
                gradingObj.feedbacks = cloneElm.feedbacks;
                gradingObj.pointValue = cloneElm.pointValue;
                gradingObj.questionID = cloneElm.questionID;
                gradingObj.gradingObjectID = cloneElm.questionID;
                gradingObj.arrayIndex = index;
                gradingIndex = index;
            }
        });
        //=============================
        if(gradingObj)
        {
            //console.log("gradingObj == ",gradingObj);
            _subLessonObj.gradingObject = gradingObj;
        }
    }
    
    if(Number.isInteger(gradingIndex))
    {
        // after separating grading object data. It will delete grading object from questions array.
       // questions.splice(gradingIndex, 1);
    }
    //return gradingObj;
}

function checkForLongSpacesInString(str)
{
    let longSpaces = false;
    if (!str.replace(/\s/g, '').length) {
        //console.log('2012 string only contains whitespace (ie. spaces, tabs or line breaks)');
        longSpaces = true;
      } 
    return longSpaces;
}

function getColumnDesc(unit, lesson, sublesson, toc, type) {
  let _desc;
  let _notAddColon;
  let _colonStr;
  let _displayOrder;
  let _navigationId;

  if (type == "unit") {
    if (toc[unit]) {
      if (toc[unit].children["EMPTY"]) {
        _desc = toc[unit].children["EMPTY"].desc;
        _notAddColon = toc[unit].children["EMPTY"].notAddColon;
        _displayOrder = toc[unit].children["EMPTY"].displayOrder * 1;
        _navigationId = toc[unit].children["EMPTY"].navigationId;
      }
    }
  }

  if (type == "lesson") {
    if (toc[unit]) {
      if (toc[unit].children[lesson]) {
        _desc = toc[unit].children[lesson].desc;
        _notAddColon = toc[unit].children[lesson].notAddColon;
        _displayOrder = toc[unit].children[lesson].displayOrder * 1;
        _navigationId = toc[unit].children[lesson].navigationId;
      }
    }
  }

  if (type == "sublesson") {
    if (toc[unit]) {
      if (toc[unit].children[lesson]) {
        if (toc[unit].children[lesson].children[sublesson]) {
          _desc = toc[unit].children[lesson].children[sublesson].desc;
          _notAddColon = toc[unit].children[lesson].children[sublesson].notAddColon;
          _displayOrder = toc[unit].children[lesson].children[sublesson].displayOrder * 1;
          _navigationId = toc[unit].children[lesson].children[sublesson].navigationId;
        }
      }
    }
  }
  _colonStr = _notAddColon == "false" ? ":" : "";
  return {desc:_desc,notAddColon:_notAddColon,colonStr:_colonStr,displayOrder:_displayOrder,navigationId:_navigationId};
}

function getLessonObj(currentProductAssignments, _problemObj) {
    // This function will group problem data to lesson ID
    _console("getLessonObj");
    _console("currentProductAssignments = ",currentProductAssignments);
    let _lessons = {};
    for (var i = 0; i < currentProductAssignments.length; i++) {
        //console.log(i,currentProductAssignments[i]);
        if (
          currentProductAssignments[i].lessons &&
          currentProductAssignments[i].lessons.length > 0
        ) {
          //
          if (!_lessons[currentProductAssignments[i].lessons[0].lessonId]) {
            _lessons[currentProductAssignments[i].lessons[0].lessonId] = [];
          }
          let _obj = {};
          _obj.lessonName = currentProductAssignments[i].lessons[0].lessonName;
          _obj.subLessonIndex =
            currentProductAssignments[i].lessons[0].subLessonIndex;
            
            let presentationData = currentProductAssignments[i].presentation_data;
            
            if(typeof presentationData == "string")
            {
                presentationData = JSON.parse(
                    currentProductAssignments[i].presentation_data
                  );
            }
           
         
            _obj.name = presentationData.subLessonName;
          _obj.problems = currentProductAssignments[i].problems;
          _obj.assignmentID = currentProductAssignments[i].id;
          _obj.presentation_data = presentationData;
          for (var j = 0; j < _obj.problems.length; j++) {
            _obj.problems[j].data = _problemObj[_obj.problems[j].problemID];
            if (
              _obj.problems[j].points.length == 0 &&
              _obj.problems[j].type == "open_response"
            ) {
              console.log(
                i,
                _obj.problems[j].problemID,
                _obj.problems[j].points
              );
            }
          }
          _lessons[currentProductAssignments[i].lessons[0].lessonId].push(_obj);
          //
        }
       
    }
    return _lessons;
}

function getProblemData(problemLevelObjectAndProblemData) {
    // this function will create problem Object based on Problem ID
    _console("getProblemData");
    let _problemData = problemLevelObjectAndProblemData.problemData;
    let _problemObj = {};
    for (var i = 0; i < _problemData.length; i++) {
        _problemObj[_problemData[i].id] = _problemData[i].presentation_data;
        _problemObj[_problemData[i].id].answer = _problemData[i].answer;
        _problemObj[_problemData[i].id].answer_type = _problemData[i].answer_type;
    }
    return _problemObj;
}

function addDataToContent(_contents,_unitName,_tocData)
{
    // console.log("addDataToContent");
    //console.log("_contents = ",_contents);
    _contents.forEach((lessonObj) => {
        //console.log("lessonObj = ",lessonObj);
        if(lessonObj)
        {
            let lessonName = lessonObj.menuText;
            let ignoreUnits = ["eBooks","End-of-Course Assessments"];
            if(ignoreUnits.indexOf(_unitName) == -1)
            {
               lessonName = lessonName.split(":")[0];// Mostly some lesson and unit names contains (:) in OE data. But (:) is not present in spreadsheet. So remove colon (:) for comparision with OE data (:) 
            }
            
            // console.log(_unitName,"::",lessonName,"::",_tocData[_unitName].children[lessonName]);
            
             if(_.size(_tocData[_unitName].children) == 1 && _tocData[_unitName].children["EMPTY"])
             {
                 lessonName = "EMPTY";
             }
     
             //console.log(lessonName,_unitName,lessonObj);
             if(_tocData[_unitName].children[lessonName])
             {
                 if(_tocData[_unitName].children[lessonName].resourceCode)
                 {
                     lessonObj.resourceCode = _tocData[_unitName].children[lessonName].resourceCode;
                     //console.log("resourceCode ",_unitName,lessonName,_tocData[_unitName].children[lessonName].format);
                     //console.log(_tocData[_unitName].children[lessonName].resourceCode,_tocData[_unitName].children[lessonName].format);
                 }
                 if(_tocData[_unitName].children[lessonName].assignable)
                 {
                     lessonObj.assignable = _tocData[_unitName].children[lessonName].assignable == "Yes" ? true : false;
                 }
                 if(_tocData[_unitName].children[lessonName].visibleStudent)
                 {
                     lessonObj.studentVisible = _tocData[_unitName].children[lessonName].visibleStudent == "Yes" ? true : false;
                 }
                 if(_tocData[_unitName].children[lessonName].version)
                 {
                    // console.log("version == ",_tocData[_unitName].children[lessonName].version)
                     lessonObj.version = _tocData[_unitName].children[lessonName].version;
                 }
                 if(_tocData[_unitName].children[lessonName].displayOrder)
                 {
                    // console.log("version == ",_tocData[_unitName].children[lessonName].version)
                     lessonObj.displayOrder = _tocData[_unitName].children[lessonName].displayOrder * 1;
                 }
                 if(_tocData[_unitName].children[lessonName].notAddColon)
                 {
                     //lessonObj.notAddColon = _tocData[_unitName].children[lessonName].notAddColon;
                    //===================================
                    /*
                        removeColonFromMenuText function will correct menu string of the lessons. 
                        Because new requirment came to remove colon from menu string. 
                        This function will check notAddColon property. If it is set to false then colon will be added. If it is set to true then colon will not be added.
                        This process of correcting menutext is done at the end of JSON creation. Because, if menutext is corrected at the start then it will induced issues in the json string. Because at many places in functions menutext with colon is considered in the logic.
                    */
                 
                   if(_tocData[_unitName].children[lessonName].notAddColon == "true" && _tocData[_unitName].children[lessonName].desc)
                   {
                        //lessonObj.tmpMenuText = removeColonFromMenuText(lessonObj.menuText,_tocData[_unitName].children[lessonName]);
                        lessonObj.menuText = removeColonFromMenuText(lessonObj.menuText,_tocData[_unitName].children[lessonName]);
                   }
                 
                
                    //==================================
             }
                 
                
             }
        }
        
    });

}
//===================

function removeColonFromMenuText(menuText,_tocData)
{
    /*
        This function will correct menu string of the lessons. 
        Because new requirment came to remove colon from menu string. 
        This function will check notAddColon property. If it is set to false then colon will be added. If it is set to true then colon will not be added.
        This process of correcting menutext is done at the end of JSON creation. Because, if menutext is corrected at the start then it will induced issues in the json string. Because at many places in functions menutext with colon is considered in the logic.
    */
    let str = String(menuText);
    str = str.split(_tocData.desc)[0];
    str = str.trim();
    str = str.substring(0, str.length-1);
    /*
    let _colonStr = "";
    if(_tocData.notAddColon == "false")
    {
        _colonStr = ":";
    }
    */
    str = str +" "+_tocData.desc;
    return str;
}

//===================


function addProductResourcesSheetData(_jsonObj,_toc)
{
    _console("addProductResourcesSheetData");
    //console.log("_jsonObj = ",_jsonObj);
   // console.log("_toc = ",_toc);
    for(var i in _jsonObj)
    {
        if(i == "containers" || i == "contents")
        {
            let _unitArr = _jsonObj[i];
            _unitArr.forEach((elm)=>{
                if(elm)
                {
                    let _unitName = elm.menuText.split(":")[0];
               
                    if(elm.containers && elm.contents)
                    {
                        addDataToContent(elm.contents,_unitName,_toc);
                        if(elm.containers.length > 0)
                        {
                            let _chapters = elm.containers;
                            _chapters.forEach((chapter)=>{
                               // let _chapterName = chapter.menuText.split(":")[0];
                                let _chapterName = getChapterMenuText(chapter.menuText,_toc); 
                                //console.log("_chapterName = ",_chapterName);
                                if(chapter.containers && chapter.contents)
                                {
                                    addDataToContent(chapter.contents,_chapterName,_toc[_unitName].children);
    
                                }
                            });
                        }
                       
                    }
                    else
                    {
                       // _console("%c Container content not defined.","color:red");
                        addDataToContent([elm],_unitName,_toc);
                    }
                    
                }
               
            });
        }
       
    }
    
}

function getColumnNameObj(_sheet)
{
    //console.log("getColumnNameObj");
    let columnHeaderObj = {};
    for (var i in _sheet)
    {
        let _firstChar = i.charAt(0);
        let _secondChar = i.charAt(1);
        let _lastChar = i.charAt(i.length-1);
        let _secondLast = i.charAt(i.length-2);
        if(isNaN(Number(_secondLast)) && !isNaN(Number(_lastChar)) && _lastChar == "1")
        {
           // console.log("i = ",i,_sheet[i].v);
            columnHeaderObj[_sheet[i].v] = i.split("1")[0];
            //columnHeaderObj[_sheet[i].v].columnName = i.split("1")[0];
        }
    }
    return columnHeaderObj;
}

function getProductResources(_sheet)
{
    _console("getProductResources");
    //console.log("_sheet = ",_sheet);
    let columnObj = getColumnNameObj(_sheet);
    _console("columnObj = ",columnObj);
    let allowedFormats = ["Interactive Lesson","Online eBook"];
    let _productResObj = {};
    for (var i in _sheet)
    {
        let _firstChar = i.charAt(0);
        let _secondChar = i.charAt(1);
        //let _lastChar = i.charAt(i.length-1);
       // let _secondLast = i.charAt(i.length-2);
        if (_firstChar == "A" && !isNaN(Number(_secondChar)) && i != "A1")
        {
            let rowNum = i.split("A")[1] * 1;
            let resourceCodeCol = columnObj["Resource Code"];
            let resourceTitleCol = columnObj["Resource Title"];
            let nodeLessonsCol = columnObj["Node / Lesson"];
            let lessonSublessonCol = columnObj["Lesson / Sub-Lesson"];
            let assignableCol = columnObj["Assignable"];
            let visibleStudentCol = columnObj["Visible Student"];
            let _formatCol = columnObj["Format"];
            let _resourceCategoryCol = columnObj["Resource Category"];
            let _resourceCode = _sheet[resourceCodeCol + rowNum] ? _sheet[resourceCodeCol + rowNum].v : undefined;
            let _resourceTitle = _sheet[resourceTitleCol + rowNum] ? _sheet[resourceTitleCol + rowNum].v : undefined;
            let _NodeLessons = _sheet[nodeLessonsCol + rowNum] ? _sheet[nodeLessonsCol + rowNum].v : undefined;
            let _lessonSublesson = _sheet[lessonSublessonCol + rowNum] ? _sheet[lessonSublessonCol + rowNum].v : undefined;
            let _assignable = _sheet[assignableCol + rowNum] ? _sheet[assignableCol + rowNum].v : undefined;
            let _visibleStudent = _sheet[visibleStudentCol + rowNum] ? _sheet[visibleStudentCol + rowNum].v : undefined;
            let _format = _sheet[_formatCol + rowNum] ? _sheet[_formatCol + rowNum].v : undefined;
            let _resourceCategory = _sheet[_resourceCategoryCol + rowNum] ? _sheet[_resourceCategoryCol + rowNum].v : undefined;
            if(_NodeLessons)
            {
                _NodeLessons =  _NodeLessons.replace(/\\/g, '');
            }
            if(_lessonSublesson)
            {
                _lessonSublesson =  _lessonSublesson.replace(/\\/g, '');
            }
           
            if(!_productResObj[_NodeLessons])
            {
                _productResObj[_NodeLessons] = {};
            }
          
            let columnJ = _lessonSublesson;
            if(!columnJ)
            {
                // at some instances like Introduction. There is no name for sublesson lesson. So in this case read the name from column b
               // columnJ = _b;
                columnJ = "EMPTY";

            }
            // console.log(i,rowNum,_NodeLessons,columnJ,_resourceCode,_resourceCategory);
                if (allowedFormats.indexOf(_format) != -1) { //==
                    if (_format != "Online eBook" || (_format == "Online eBook" && !(hasIn(_productResObj[_NodeLessons], columnJ) && hasIn(_productResObj[_NodeLessons][columnJ], 'resourceCode')))) {
                        _productResObj[_NodeLessons][columnJ] = {};
                        _productResObj[_NodeLessons][columnJ].resourceCode = _resourceCode;
                        _productResObj[_NodeLessons][columnJ].assignable = _assignable;
                        _productResObj[_NodeLessons][columnJ].visibleStudent = _visibleStudent;
                        _productResObj[_NodeLessons][columnJ].format = _format;
                        _productResObj[_NodeLessons][columnJ].row = rowNum;
                    }
                } //==
            }
        }
    //console.log("_productResObj = ",_productResObj);
  return _productResObj;
}

function readColumnData(columnName,rowNum,_tocData,sheetColumnsObj)
{
    return _tocData[sheetColumnsObj[columnName] + rowNum] ? String(_tocData[sheetColumnsObj[columnName] + rowNum].v) : undefined;
}

function createProblemTOC(workbook) {
    _console("createProblemTOC");
   // _console("workbook = ",workbook);
    // this function will create problemTOC from spreadsheet
    let programTOC = {};
    let _toc = {};
    let _tocData = workbook.Sheets["Program TOC"];
    let _productResources =  getProductResources(workbook.Sheets["Product Resources"]);
    /*
        Note: Sheet column names are dynamic. Order of columns is not fixed.
        A => "Unit (Parent)",
        B => "Lesson (Child)",
        C => "Sub-Lesson (Sibling)",
        D => "Description",
        E => "Assignment Display Name",
        F => "Version",
        G => "Display Order"
        G / H => "Not Add Colon"
    */
    let sheetColumns = [
        "Unit (Parent)", 
        "Lesson (Child)", 
        "Sub-Lesson (Sibling)", 
        "Description", 
        "Assignment Display Name", 
        "Version", 
        "Display Order",
        "Not Add Colon",
        "Navigation ID",
    ];
    let sheetColumnsObj = getColumnName(sheetColumns,_tocData);
    _console("_productResources = ",_productResources);
    for (var i in _tocData) {
        if (i.indexOf("A") != -1 && i != "A1") {
            let rowNum = i.split("A")[1] * 1;

            let _a = readColumnData("Unit (Parent)",rowNum,_tocData,sheetColumnsObj);
            let _b = readColumnData("Lesson (Child)",rowNum,_tocData,sheetColumnsObj);
            let _c = readColumnData("Sub-Lesson (Sibling)",rowNum,_tocData,sheetColumnsObj);
            let _d = readColumnData("Description",rowNum,_tocData,sheetColumnsObj);
            let _e = readColumnData("Version",rowNum,_tocData,sheetColumnsObj);
            let _f = readColumnData("Not Add Colon",rowNum,_tocData,sheetColumnsObj);
            let _g = readColumnData("Display Order",rowNum,_tocData,sheetColumnsObj);
            let _h = readColumnData("Navigation ID",rowNum,_tocData,sheetColumnsObj);
            if(_e)
            {
                _e = _e.replace(/ /g,''); // remove spaces from string
            }
            
            //=========== Replace commas in a string with slashesh =====================
            // This is done bcoz in some products, commas are added in a titles. And when we store this name in object, it adds slashesh to it. So to match it add slashesh to the sheet data.
            //_b =  _b.replace(/,/g, "^"); 

            //=================================================
            if (_a) {
                if (!programTOC[_a]) {
                    programTOC[_a] = [];
                }
                if (!_toc[_a]) {
                    _toc[_a] = {};
                    _toc[_a].children = {};
                    _toc[_a].type = "unit";
                    
                }
                if (_b) {
                    if(_b != "EMPTY")
                    {
                        programTOC[_a].push(_b);
                    }
                   
                    if (_toc[_a] && _toc[_a].children) {
                        if (!_toc[_a].children[_b]) {
                            _toc[_a].children[_b] = {};
                            _toc[_a].children[_b].children = {};
                            _toc[_a].children[_b].type = "lesson";
                            if (_d) {
                                _toc[_a].children[_b].desc = _d;
                            }
                            if (_e) {
                                _toc[_a].children[_b].version = _e;
                            }
                            if (_f) {
                                _toc[_a].children[_b].notAddColon = _f;
                            }
                            if (_g) {
                                _toc[_a].children[_b].displayOrder = _g;
                            }
                            if (_h) {
                                _toc[_a].children[_b].navigationId = _h;
                            }
                           // console.log("_a = ",_a," :: _b = ",_b);
                            if(_productResources[_a] && _productResources[_a][_b])
                            {
                                _toc[_a].children[_b] = {..._toc[_a].children[_b],..._productResources[_a][_b]}
                            }
                        }
                    }
                    //============================
                    if (_c) {
                        if (_toc[_a].children[_b] && _toc[_a].children[_b].children) {
                            if (!_toc[_a].children[_b].children[_c]) {
                                _toc[_a].children[_b].children[_c] = {};
                                _toc[_a].children[_b].children[_c].children = {};
                                _toc[_a].children[_b].children[_c].type = "subLesson";
                                //=============== Description ====================
                                if (_d) {
                                    _toc[_a].children[_b].children[_c].desc = _d;
                                }
                                if (_e) {
                                    _toc[_a].children[_b].children[_c].version = _e;
                                }
                                if (_f) {
                                    _toc[_a].children[_b].children[_c].notAddColon = _f;
                                }
                                if (_g) {
                                    _toc[_a].children[_b].children[_c].displayOrder = _g;
                                }

                                if (_h) {
                                    _toc[_a].children[_b].children[_c].navigationId = _h;
                                }
                                // Here this condition _b, _c is used. Bcoz in product resources node / lesson column may contain units or chapters. So _productResources object may contain units or chapters
                                //console.log("_b = ",_b," :: _c = ",_c);
                                if(_productResources[_b] && _productResources[_b][_c])
                                {
                                    _toc[_a].children[_b].children[_c] = {..._toc[_a].children[_b].children[_c],..._productResources[_b][_c]}
                                }
                            }
                        }
                    } // END OF C
                } // END OF B
                else
                {
                    if(_d)
                    {
                        _toc[_a].children["EMPTY"] = {};
                        _toc[_a].children["EMPTY"].desc = _d;
                    }
                    if (_f) {
                        _toc[_a].children["EMPTY"].notAddColon = _f;
                    }
                    if(_productResources[_a] && _productResources[_a]["EMPTY"])
                    {
                        _toc[_a].children["EMPTY"] = {..._toc[_a].children["EMPTY"],..._productResources[_a]["EMPTY"]}
                        if (_e) {
                            _toc[_a].children["EMPTY"].version = _e;
                        }
                    }
                    if (_g && _toc[_a].children["EMPTY"]) {
                        _toc[_a].children["EMPTY"].displayOrder = _g;
                     }
                     if (_h && _toc[_a].children["EMPTY"]) {
                        _toc[_a].children["EMPTY"].navigationId = _h;
                     }
                }
            } // END OF A
        }
    }
    //_console("_toc = ",_toc);
    return {
        programTOC,
        _toc
    };
}

function getLessonTitlesFromSheet(workbook) {
    _console("getLessonTitlesFromSheet");
    // this function will create problemTOC from spreadsheet
    // This function wil read program TOC tab of spreadsheet and will fetch title related to unit , chapter and lessons.
    let _obj = {};
    let _tocData = workbook.Sheets['Program TOC'];
    //console.log("_tocData = ", _tocData);
    for (var i in _tocData) {
        let _columnData;
        if (i.indexOf("A") != -1) {
            // READ unit data
            let rowNum = getRowNum(i);
            let Bcolumn = "";
            if (_tocData["B" + rowNum]) {
                Bcolumn = _tocData["B" + rowNum].v;
            }

            if (Bcolumn == "EMPTY" || Bcolumn == "") {
                _columnData = readDescription(i, _tocData);
            }
        }
        if (i.indexOf("B") != -1) {
            // READ lesson data
            let rowNum = getRowNum(i);
            let Ccolumn;
            if (_tocData["C" + rowNum]) {
                Ccolumn = _tocData["C" + rowNum].v;
            }
            if (!Ccolumn) {
                _columnData = readDescription(i, _tocData);
            }
        }
        if (i.indexOf("C") != -1) {
            // READ sublesson data
            _columnData = readDescription(i, _tocData);
        }
        if (_columnData && _columnData.name != "EMPTY") {
            let _unitName;
            let rowNum = getRowNum(i);
            if (_tocData["A" + rowNum]) {
                _unitName = _tocData["A" + rowNum].v;
            }
            if (!_obj[_unitName]) {
                _obj[_unitName] = [];
            }
            if (_obj[_unitName]) {
                _obj[_unitName].push({
                    columnName: _columnData.name,
                    columnDesc: _columnData.desc
                });
                //_obj[_columnData.name] = _columnData.desc;
            }
        }
    }
    return _obj;
}
//===========================
function getRowNum(column) {
    return column.match(/\d+/)[0];
}

function readDescription(column, _tocData) {
    let rowNum = column.match(/\d+/)[0] // "3"
    let _desc;
    let _lessonName = _tocData[column].v
    if (_tocData["D" + rowNum]) _desc = _tocData["D" + rowNum].v;
    if (_desc && rowNum != 1) {
        return {
            name: _lessonName,
            desc: _desc
        };
    } else {
        return false;
    }
}

function getChapterMenuText(txt,_toc)
{
   // console.log("getChapterMenuText");
    //console.log("before txt = ",txt);
   // console.log("_toc = ",_toc);
    //if (txt.indexOf("Chapter") != -1 && txt.indexOf(":") != -1) 
    if (txt.indexOf(":") != -1) 
    {
        let _title = txt.split(":")[0].trim();
        for(var i in _toc)
        {
            //console.log(i,_toc[i].children[_title]);
            if(_toc[i].children[_title])
            {
               // console.log(_title,"=================== title is a chapter = ");
                txt = _title;
            }
          
        }
    }
   // console.log("after txt = ",txt);
   // txt = txt.split(":")[0].trim();
    return txt;
}

function rearrangeChapters(_obj, programTOC, _toc) {
  _console("rearrangeChapters");
  // This function is for merging sublessons based on their children length.
  // This function will check container of unit. If chapter has one children, it will get push to contents. otherwise it will remain in container.
  let _units = _obj.containers;
  let _arr = [];
  for (var i = 0; i < _units.length; i++) {
    let chapters = _units[i].containers;
    let _unitName = _units[i].menuText.split(":")[0].trim();
    chapters = mapChaptersWithSpreadsheet(
      chapters,
      programTOC[_unitName],
      _unitName,
      _toc
    );
    if (chapters) {
      for (var j = 0; j < chapters.length; j++) {
        if (chapters[j] && chapters[j].contents.length == 2) {
          /*
                    See detailed explanation about this code in this comment https://perfectionlearning.sifterapp.com/issues/14384#comment_17082727
                    This code is written to filter correct lessons. Many times junk lessons are added in the units which are of no use. This code will check the scenario where in TOC single lesson is present and in OE more than 1 lesson is present. It will cross check lesson name with the TOC and will select correct lesson from OE data.
                    */
          let chapterMenuText = getChapterMenuText(chapters[j].menuText, _toc);
          let _sheetChildrensLength = _.size(
            _toc[_unitName].children[chapterMenuText].children
          );

         // let _tempContent;
           let _tempContent = chapters[j].contents[0];

          for (var k = 0; k < chapters[j].contents.length; k++) {
            if (_toc[_unitName].children[chapters[j].contents[k].menuText]) {
              _tempContent = chapters[j].contents[k];
            }
          }

          if (_sheetChildrensLength == 0) {
            chapters[j].contents = [];
            chapters[j].contents.push(_tempContent);
          }
        }

        //
        if (chapters[j].contents.length == 1) {
          let chapterMenuText = getChapterMenuText(chapters[j].menuText, _toc);
          let lessonChildLength = _.size(
            _toc[_unitName].children[chapterMenuText].children
          );

          let mergeSublesson;

          if (lessonChildLength == 0) mergeSublesson = true;

          if (mergeSublesson) {
            let lessonObj = {};
            lessonObj.menuText = chapters[j].menuText;
            lessonObj.questions = [];
            lessonObj.sublessons = [];
            if (chapters[j].navID) {
                lessonObj.navID = chapters[j].navID;
            }
              if (chapters[j].contents[0].sublessons.length == 1) {
                  lessonObj.questions = chapters[j].contents[0].sublessons[0].questions;
                  if (chapters[j].contents[0].sublessons[0].gradingObject) {
                      lessonObj.gradingObject = chapters[j].contents[0].sublessons[0].gradingObject;
                  }
              } else {
                  lessonObj.sublessons = chapters[j].contents[0].sublessons;
              }
            _units[i].contents.push(lessonObj);

            delete chapters[j];
          }
        }

        if (
          chapters[j] &&
          chapters[j].contents &&
          chapters[j].contents.length == 0 &&
          chapters[j].containers &&
          chapters[j].containers.length == 0
        ) {
          let lessonObj = {};
          lessonObj.menuText = chapters[j].menuText;
          lessonObj.questions = [];
          lessonObj.sublessons = [];
            _units[i].contents.push(lessonObj);

          delete chapters[j];
        }
      }
      //============ Clean Container
      let newArr = [];
      for (var j = 0; j < chapters.length; j++) {
        if (chapters[j]) {
          newArr.push(chapters[j]);
        }
      }
      _units[i].containers = newArr;

      _arr.push(_units[i]);
    } else {
      // If unit name is not in PrograM TOC then delete it
      //delete _units[i];
    }
  }
  _obj.containers = _arr;
}

function mapChaptersWithSpreadsheet(chapters, programTOC, _unitName,_toc) {
    //console.log("mapChaptersWithSpreadsheet");
    //console.log("chapters = ",chapters);
    if (!programTOC) return false;
    let newArr = [];
    for (var i = 0; i < chapters.length; i++) {
        let chapterText = getChapterMenuText(chapters[i].menuText,_toc);
         let isFound = programTOC.filter(elm => elm === chapterText);
       // console.log("chapterText = ",chapterText," :: isFound = ",isFound);
        let isSimilarFound;
        if (isFound.length == 0) {
            isSimilarFound = programTOC.filter(function (elm) {
                if (elm.indexOf(chapterText) != -1) {
                    return elm;
                }
            });
            if (isSimilarFound.length > 0) {
                isFound = isSimilarFound;
            }
        }
        //================================
        // This ondition of Intro and review is an exception. As in general product chapter name should be matched to spreadsheet chapter name
        // but here product chapter name is Unit 1 Introduction and in spreadsheet only Introduction is mentioned.
        if (chapterText.indexOf(_unitName + " Introduction") != -1 && isFound.length == 0) {
           // console.log(489);
            isFound = programTOC.filter(elm => elm === "Introduction");
            //console.log("isFound = ",isFound);
        }
        if (chapterText.indexOf(_unitName + " Review") != -1 && isFound.length == 0) {
            isFound = programTOC.filter(elm => elm === "Review");
        }
        //==========================================
        if (isFound.length > 0) {
            if (isSimilarFound && isSimilarFound.length > 0) {
                chapters[i].menuText = isFound[0]; // Give chaptername mentioned in the spreadsheet to avoid name mismatch
            }
            // This is added for Connection ELA. As writing unit contains 1 excess chapter Informational writing.
            let duplaicateNameArr = newArr.filter(ele => ele.menuText === chapters[i].menuText);
           if(duplaicateNameArr.length == 0)
           {
            newArr.push(chapters[i]);
           }
           else
           {
               //console.log(chapters[i].menuText," :: duplaicateNameArr = ",duplaicateNameArr);
           }
           //newArr.push(chapters[i]);
           
            
        }
    }
    return newArr;
}

function addMissingChaptersAssessmentData(obj, resoursesUnitWiseDataForAutomation, _productStructure, _problemObj) {
    // This function will find missing chapters / assessment in the json by comparing with spreadsheet object for automation
    // And will add data of problems by reading assessment object of problemEditor
    _console("addMissingChaptersAssessmentData");
    let _units = obj.containers;
    for (var i = 0; i < _units.length; i++) {
        let _chapters = _units[i].containers;
        let _unitName = _units[i].menuText.split(":")[0].trim();
        let _assignments;
        for (var j = 0; j < _productStructure.length; j++) {
            if (_productStructure[j].title.indexOf(_unitName) != -1) {
                _assignments = _productStructure[j]._assignments;
            }
        }
        //============ Search this unit in resourcedata for automation
        for (var j = 0; j < resoursesUnitWiseDataForAutomation.units.length; j++) {
            if (resoursesUnitWiseDataForAutomation.units[j].name == _unitName) {
                let _automationChapters = resoursesUnitWiseDataForAutomation.units[j].chapters;
                let missingChapters = [];
                for (var k = 0; k < _automationChapters.length; k++) {
                    let _chapterName = _automationChapters[k].name;
                    let _found = false;
                    for (var m = 0; m < _chapters.length; m++) {
                        if (_chapters[m].menuText.indexOf(_chapterName) != -1) {
                            _found = true;
                        }
                        if (!_found) {
                            if (_chapterName.indexOf(_chapters[m].menuText) != -1) {
                                _found = true;
                            }
                            // As there is mismatch in data name and spreadsheet name. Assign spreadsheet name to chaptername
                        }
                    }
                    if (!_found) {
                        missingChapters.push(_automationChapters[k]);
                    }
                }
               // console.log("missingChapters = ",missingChapters);
                //================== Sort missing chapters as container and contents ==========
                //
                if(_assignments)
                {
                for (var k = 0; k < missingChapters.length; k++) {
                    if (missingChapters[k].lessons.length > 0) {
                        let chapterJson = getMissingChaptersJson(missingChapters[k], _assignments, _problemObj);
                        if (chapterJson) {
                            _units[i].containers.push(chapterJson);
                        }
                    } else {
                        let chapterJson = getMissingChaptersJson(missingChapters[k], _assignments, _problemObj);
                        if (chapterJson) {
                            _units[i].contents.push(chapterJson);
                        }
                    }
                }
            }
                
        }
        }
    }
}

function getMissingChaptersJson(missingChapters, _assignments, _problemObj) {
    //console.log("getMissingChaptersJson");
    let assessObj;
    if (missingChapters.lessons.length == 0) {
        assessObj = getAssessmentJson(missingChapters.name, _assignments, _problemObj);
    } else {
        let lessonsArr = [];
        assessObj = {};
        for (var j = 0; j < missingChapters.lessons.length; j++) {
            let _chapterName = missingChapters.lessons[j].name;
            if (_chapterName == "Summative Assessment") _chapterName = "Summative"; 
            let lessonObj = {};
            lessonObj = getAssessmentJson(_chapterName, _assignments, _problemObj);
            lessonsArr.push(lessonObj);
        }
        assessObj.menuText = missingChapters.name;
        assessObj.containers = [];
        assessObj.contents = lessonsArr;
    }
    return assessObj;
}

function getAssessmentJson(assignmentName, _assignments, _problemObj) {
    //console.log("getAssessmentJson"); 
    // console.log("assignmentName = ",assignmentName);
    let assessObj;
    if (_assignments) {
        for (var i = 0; i < _assignments.length; i++) {
            if (_assignments[i].lessons[0].lessonName.indexOf(assignmentName) != -1) {
                assessObj = {}
                assessObj.menuText = assignmentName;
                assessObj.questions = createProblemObject(_assignments[i].problems, _problemObj);
                assessObj.sublessons = [];
                extractGradingObject(assessObj);
            }
        }
    }
    return assessObj;
}

function addMissingLessonsAssessmentData(_obj, currentProductAssignments, _problemObj) {
    _console("addMissingLessonsAssessmentData");
    // It searches the chapterID in the 
    let _units = _obj.containers;
    for (var i = 0; i < _units.length; i++) {
        let chapters = _units[i].containers;
        //console.log("_units[i] == ",_units[i].menuText);
        let cloneChapters = [...chapters];
       // console.log("cloneChapters == ",cloneChapters);
        for (var j = 0; j < chapters.length; j++) {
            let _chapterID = chapters[j].id;
            //console.log("_chapterID == ",_chapterID,chapters[j]);
            let assignments = currentProductAssignments.filter((ele) => {
                    return ele.lessons.length > 0 ? ele.lessons[0].lessonId === _chapterID : false;
            });
           // console.log("assignments = ",assignments);
            let chapterObj = {};
            if (assignments.length == 1) {
                chapterObj = getAssessmentJson(assignments[0].lessons[0].lessonName, assignments, _problemObj);
                if (chapterObj) {
                   // console.log("Missing chapter");
                   // console.log("_units[i] = ",_units[i]..menuText);
                   // console.log("Missing chapterObj = ",chapterObj.menuText);
                    let _matchFound = false;
                    for (var k = 0; k < chapters[j].contents.length; k++)
                    {
                        if(chapters[j].contents[k].menuText == chapterObj.menuText)
                        {
                            if(chapterObj.menuText.indexOf(":") != -1)
                            {
                                chapterObj.menuText = (chapterObj.menuText.split(":")[1]).trim();
                            }
                           // console.log("connect testing match found");
                            chapters[j].contents[k] = chapterObj;
                            _matchFound = true;
                        }
                    }
                    if(!_matchFound)
                    {
                        chapters[j].contents.push(chapterObj);
                    }
                    //
                }
            }
            delete chapters[j].id;
        }
    }
}

function createMissingChaptersJSON(_obj, _productStructure, _problemObj) {
    console.log("createMissingChaptersJSON");
    let _containers = _obj.containers;
    for (var i = 0; i < _containers.length; i++) {
        let _unitName = _containers[i].menuText.split(":")[0].trim();
        let _assignments;
        for (var j = 0; j < _productStructure.length; j++) {
            if (_productStructure[j].title.indexOf(_unitName) != -1) {
                _assignments = _productStructure[j]._assignments;
            }
        }
        //========================
        for (var j = 0; j < _containers[i].containers.length; j++) {
            if (_containers[i].containers[j].name && _containers[i].containers[j].lessons.length == 0) {
                let assessmentName = _containers[i].containers[j].name;
                let assessObj = {};
                if (_assignments) {
                    for (var k = 0; k < _assignments.length; k++) {
                        if (_assignments[k].lessons[0].lessonName.indexOf(assessmentName) != -1) {
                            assessObj.menuText = assessmentName;
                            assessObj.questions = createProblemObject(_assignments[k].problems, _problemObj);
                            assessObj.sublessons = [];
                            extractGradingObject(assessObj);
                        }
                    }
                }
                if (assessObj.menuText) {
                    _containers[i].contents.push(assessObj);
                    _containers[i].containers.splice(j, 1)
                }
            }
            //=====================
            if (_containers[i].containers[j].name && _containers[i].containers[j].lessons.length > 0) {
                let chapObj = {};
                chapObj.menuText = _containers[i].containers[j].name;
                chapObj.contents = [];
                for (var m = 0; m < _containers[i].containers[j].lessons.length; m++) {
                    let assessmentName = _containers[i].containers[j].lessons[m].name;
                    if (assessmentName == "Summative Assessment") assessmentName = "Summative";
                    let assessObj = {};
                    if (_assignments) {
                        for (var k = 0; k < _assignments.length; k++) {
                            if (_assignments[k].lessons[0].lessonName.indexOf(assessmentName) != -1) {
                                if (assessmentName == "Summative") assessmentName = "Summative Assessment";
                                assessObj.menuText = assessmentName;
                                assessObj.questions = createProblemObject(_assignments[k].problems, _problemObj);
                                assessObj.sublessons = [];
                                extractGradingObject(assessObj);
                            }
                        }
                    }
                    if (assessObj.menuText) {
                        chapObj.contents.push(assessObj);
                        chapObj.containers = [];
                    }
                }
                _containers[i].containers[j] = chapObj;
            }
        }
    }
}

function rearrangesublessons(arr) {
    // this function will arrange sublesson array in proper order based on sublesson index
    if (!arr) return [];
    /*
    let newObj = {};
    for (var i = 0; i < arr.length; i++) {
        newObj[arr[i].subLessonIndex] = arr[i];
    }
    let newArr = [];
    for (var i in newObj) {
        newArr.push(newObj[i]);
    }
    */
   /*
        Above code was commented, as object is sorted using sublesson index. So it was creating missing sublesson issue.
        So below sorting is done on basis of sublesson index.
        If the Lesson has duplicate sublessons, both lessons will be visible in array with same sublesson index.
   */
   
    let sortedArr = arr.sort(function(a, b) {
        return (a.subLessonIndex - b.subLessonIndex);
    });

    return sortedArr;
}

function AddProductInfo(_obj, programSheet) {
    _console("AddProductInfo");
    //===========================
    let version;
    let program_graphic;
    for (var i in programSheet) {
        if (programSheet[i].v == "Version") {
            let lastWord = i.charAt(i.length - 1) * 1;
            let prefix = i.split(lastWord)[0]
            let nextKey = prefix + "" + (lastWord + 1);
            let nextVal = programSheet[nextKey].v;
            version = nextVal;
        }
        if (programSheet[i].v == "Program Series") {
            let lastWord = i.charAt(i.length - 1) * 1;
            let prefix = i.split(lastWord)[0]
            let nextKey = prefix + "" + (lastWord + 1);
            let nextVal = programSheet[nextKey].v;
            program_graphic = nextVal;
        }
    }
    _obj.product.version = version;
    _obj.product.series = program_graphic;
}

function mergeSingleSublesson(_obj) {
    //console.log("mergeSingleSublesson");
    // Here there are some lesson instances in which only single sublesson is present.
    // So in this cases, we dont have to show the sublesson array. Just copy question data and give it to parent lesson and remove sublesson array.
    let _array = ["contents", "containers"];
    for (var m = 0; m < _array.length; m++) {
        let containerData = _obj[_array[m]];
        for (var i = 0; i < containerData.length; i++) {
            if(containerData[i])
            {
                if (containerData[i].contents.length > 0) {
                    mergeContentSublesson(containerData[i].contents);
                }
                if (containerData[i].containers.length > 0) {
                    mergeContentainerSublesson(containerData[i].containers);
                }
                checkEmptyContainerItem(containerData[i]);
            }
          
        }
    }
}

function checkEmptyContainerItem(containerData) {
    if (containerData.contents && containerData.containers) {
        if (containerData.contents.length == 0 && containerData.containers.length == 0) {
            containerData.questions = [];
            containerData.sublessons = [];
            delete containerData.contents;
            delete containerData.containers;
        }
    }
}

function mergeContentainerSublesson(containers) {
    for (var j = 0; j < containers.length; j++) {
        if (containers[j].contents && containers[j].contents.length > 0) {
            mergeContentSublesson(containers[j].contents);
        }
        checkEmptyContainerItem(containers[j]);
    }
}

function mergeContentSublesson(contents) {
    // console.log("mergeContentSublesson");
    if (contents) {
        let _contents = contents;
        for (var j = 0; j < _contents.length; j++) {
            if (_contents[j] && _contents[j].sublessons) {
                let _sublessons = _contents[j].sublessons;
                if (_sublessons.length == 1) {
                    _contents[j].questions = _contents[j].sublessons[0].questions;
                    if(_contents[j].sublessons[0].gradingObject)
                    {
                        _contents[j].gradingObject = _contents[j].sublessons[0].gradingObject;
                    }
                    _contents[j].sublessons = [];
                }
            }
        }
    }
}

function filterDataAsPerExcel(_obj, programTOC, product_resources,_toc, errorList) {
    _console("filterDataAsPerExcel");
    //console.log("product_resources = ",product_resources);
    //Product Resources
    //============================FILTER DATA AS PER UPLOADED EXCEL =======
    // Arrange chapters as per UPLOADED EXCEL - PROGRAM TOC
    // filter units that dont have chapters
    let _mainContainer = [];
    let _mainContents = [];
    for (var i in programTOC) {
        let chapterObj;
        for (var j = 0; j < _obj.containers.length; j++) {
           if (_obj.containers[j].menuText.indexOf(i) != -1) 
            {
                /*
                    Changes for Sifter 16240: Issue is unit menutext contains name with description. It was creating issue in the old check when 2 names are similar. So now, unit name is extracted by separating desc from the name and that is checked in the code while matching.
                */
                let _baseUnitName = _obj.containers[j].menuText;
                if(_toc[i] && _toc[i].children["EMPTY"] && _toc[i].children["EMPTY"].desc)
                {
                    _baseUnitName = i;
                }
                //==================================
                if (i == _baseUnitName) 
                {
                chapterObj = _obj.containers[j]
            }
               
            }
        }
        if(!chapterObj)
        {
            errorList.push({type:"error",msg:"⚠ JSON Error: Import Spreadsheet Unit structure is not matching with the problemEditor Unit Structure. Unit "+i+" found in import spreadsheet but not found in problemEditor data. Upload button is disabled because product structure JSON is not generated properly."});
        }
        if (programTOC[i].length == 0) {
            // Here this is a exception if chapters length is greater than 1 ,  like APUSH - AP US HISTORY INTERACTIVE
            // In which intro has 2 lessons in the object data, but in product only one lesson is shown without sublesson
            // So for this problem, we will read from Product Resources tab of spreadsheet and will find out , out of 2 which lesson is used.
            let chapterUsed;
            for (var i in product_resources) {
                if (i.indexOf("B") != -1 && i != "A1") {
                    if (chapterObj && chapterObj.menuText && chapterObj.menuText.indexOf(product_resources[i].v) != -1) {
                        let rowNum = i.split("B")[1];
                        //============ Code added by sachin for 10912
                        if (hasIn(product_resources, "AI" + rowNum)) {
                            let chapterUsed = product_resources["AI" + rowNum];
                            if (hasIn(chapterUsed, 'v')) {
                                let chapterUsedLabel = product_resources["AI" + rowNum].v;
                                for (var j = 0; j < chapterObj.contents.length; j++) {
                                    if (chapterObj.contents[j].menuText.indexOf(chapterUsedLabel) != -1) {
                                        chapterUsed = chapterObj.contents[j];
                                        chapterUsed.sublessons = [];
                                    }
                                }
                                break;
                            }
                        }
                        //=============================
                        /*
                        let chapterUsedLabel = product_resources["AI" + rowNum].v;
                        for (var j = 0; j < chapterObj.contents.length; j++) {
                            if (chapterObj.contents[j].menuText.indexOf(chapterUsedLabel) != -1) {
                                chapterUsed = chapterObj.contents[j];
                                chapterUsed.sublessons = [];
                                
                            }
                        }
                        */
                        // break;
                    }
                }
            }
            if (chapterUsed) {
                chapterObj = chapterUsed;
            }
            // console.log("chapterObj = ",chapterObj);
            if(chapterObj)
            {
               // _mainContents.push(chapterObj);
            }
            _mainContents.push(chapterObj);
            
        } else {
            // console.log("chapterObj = ",chapterObj);
            if(chapterObj)
            {
                //_mainContainer.push(chapterObj);
            }
            _mainContainer.push(chapterObj);
           
        }
    }
    delete _obj.containers;
    _obj.containers = _mainContainer;
    _obj.contents = _mainContents;
}

function addDummyFeedbackData(_obj) {
    // This function is called at the last to get the correct title of parent pages.
    // because in json processing, many sublessons and lessons got merged as per spreadsheet.
    // So after finialising strucutre this is get called to add feedback and answer data.
    _console("addDummyFeedbackData");
    let _containers = _obj.containers;
    for (var i = 0; i < _containers.length; i++) {
        if(_containers[i])
        {
            if (_containers[i].containers.length > 0) {
                addFeedbackToContainers(_containers[i].containers)
            }
            if (_containers[i].contents.length > 0) {
                addFeedbackToContents(_containers[i].contents)
            }
        }
    }
}

function addFeedbackToContainers(_containers) {
    //console.log("addFeedbackToContainers");
    if (_containers) {
        for (var j = 0; j < _containers.length; j++) {
            if (_containers[j].contents && _containers[j].contents.length > 0) {
                addFeedbackToContents(_containers[j].contents)
            }
        }
    }
}

function addFeedbackToContents(_contents) {
    //console.log("addFeedbackToContents");
    // console.log("_contents = ",_contents);
    if (_contents) {
        for (var j = 0; j < _contents.length; j++) {
            if (_contents[j] && _contents[j].sublessons.length > 0) {
                addFeedbackTosublessons(_contents[j].sublessons, _contents[j]);
            }
            if (_contents[j] && _contents[j].questions && _contents[j].questions.length > 0) {
                addFeedbacktoQuestions(_contents[j].questions, "", _contents[j].menuText);
            }
        }
    }
}

function addFeedbackTosublessons(_sublessons, _contents) {
    //console.log("addFeedbackTosublessons");
    if (_sublessons && _sublessons.length > 0) {
        for (var k = 0; k < _sublessons.length; k++) {
            addFeedbacktoQuestions(_sublessons[k].questions, _sublessons[k].name, _contents.menuText);
        }
    }
}

function addFeedbacktoQuestions(questions, _sublessonName, _lessonName) {
    // console.log("addFeedbacktoQuestions");
    if (questions && questions.length > 0) {
        for (var m = 0; m < questions.length; m++) {
            let _questionLocation = "";
            if (_lessonName) {
                _questionLocation += _lessonName + ", ";
            }
            if (_sublessonName) {
                _questionLocation += _sublessonName + ", ";
            }
            if (questions[m]["_//"]) {
                _questionLocation += questions[m]["_//"];
            }
            let feedbackStr = "Feedback for student, " + _questionLocation;
            if (questions[m].type == "OpenResponse") {
                let openResponseAnswer = "Answer for student, " + _questionLocation;
                questions[m].answers[0].tabs[0].fields = [openResponseAnswer];
            }
            if (questions[m].type == "TableItems") {
                let openResponseAnswer = "Answer for student, " + _questionLocation;
                let _feildsArr = questions[m].answers[0].tabs[0].fields;
                for (var n = 0; n < _feildsArr.length; n++) {
                    _feildsArr[n] = openResponseAnswer + ", " + _feildsArr[n];
                }
            }
            questions[m].feedbacks.push(feedbackStr);
        }
    }
}

function createProblemObject(_problemList, _problemInfo) {
      // console.log("createProblemObject");
   // let invalidProblemType = ["expository_text", "text_annotation_item", "teacher_material", "grading", "multi_part_answer", "collaboration_table","matching","annotation_practice_item"];
    let allowedProblemTypes = [
      "open_response",
      "essay",
      "radio",
      "table_items",
      "multiTab",
      "check",
      "multi_part_answer",
      "editing_tasks_choice",
      "grading"
    ];
    //table_items removed from above array as in tickete https://perfectionlearning.sifterapp.com/issues/11115. table items questions are required
    // allowed problem types, openresponse, essay, radio, tableItems, check (checkbox)
    let _queCounter = 0;
    let _questions = [];
    for (var n = 0; n < _problemList.length; n++) {
        let _problemType = _problemInfo[_problemList[n].problemID].type;
        if (!_problemType) {
            if (_problemInfo[_problemList[n].problemID].answer_type) {
                _problemType = _problemInfo[_problemList[n].problemID].answer_type;
            }
        }
        if(_problemType == "table_items")
        {
            // remove this
            // console.log(_problemList[n].problemID,_problemType,_problemInfo[_problemList[n].problemID]);
        }
         //console.log(_problemList[n].problemID,_problemType,_problemInfo[_problemList[n].problemID],_problemInfo[_problemList[n].problemID].answer_type);
        //if (invalidProblemType.indexOf(_problemType) == -1) 
        if (allowedProblemTypes.indexOf(_problemType) != -1) 
        {
            addRubricData(_problemList[n].problemID, _problemInfo);
            if (_problemType == "multiTab") {
                //console.log(_problemList[n].problemID,_problemInfo[_problemList[n].problemID]);
                if(_problemInfo[_problemList[n].problemID].interactive_frames && _problemInfo[_problemList[n].problemID].interactive_frames.length > 0)
                {
                    //
                    let _pointArr = _problemInfo[_problemList[n].problemID].interactive_frames[0].point;
                    let _qList = _problemInfo[_problemList[n].problemID].problemList;
                    if (_pointArr) {
                        for (var i = 0; i < _qList.length; i++) {
                            addRubricData(_qList[i], _problemInfo);
                            //if (_problemInfo[_qList[i]] && (_problemInfo[_qList[i]].type))
                            // Above condition added bcoz of issue 12386. As radio buttons dont have type. So they were removed from json
                            // I have checked and verify issue 12386. It is working fine.
                            if (_problemInfo[_qList[i]]) 
                            {
                                let p_type = _problemInfo[_qList[i]].type;
                                if (!p_type) {
                                    if (_problemInfo[_qList[i]].answer_type) {
                                        p_type = _problemInfo[_qList[i]].answer_type;
                                    }
                                }
                                //if (invalidProblemType.indexOf(p_type) == -1)
                                if (allowedProblemTypes.indexOf(p_type) != -1)  
                                {
                                    let questionID = _qList[i];
                                    let grades = [_pointArr[i]];
                                    _queCounter++;
                                    let problemsObj = createSublessonProblemObj(_queCounter, _problemInfo[questionID], questionID, grades);
                                    if (problemsObj) {
                                        _questions.push(problemsObj);
                                    }
                                }
                            }
                        }
                    }
                    //
                }
                
            } else {
                let questionID = _problemList[n].problemID;
                let grades = _problemList[n].points;
                _queCounter++;
                let problemsObj = createSublessonProblemObj(_queCounter, _problemInfo[questionID], questionID, grades);
                if (problemsObj) {
                    _questions.push(problemsObj);
                }
            }
        }
    }
    return _questions;
}

function addRubricData(_problemID, problemObj) {
    if (problemObj[_problemID] && problemObj[_problemID].rubricId) {
        let _rubricId = problemObj[_problemID].rubricId;
        if (problemObj[_rubricId]) {
            if (problemObj[_rubricId].interactive_frames[0].contentTree) {
                problemObj[_problemID].rubricData = problemObj[_rubricId].interactive_frames[0].contentTree;
            }
        }
        //========================== problemListData for rubricType - https://perfectionlearning.sifterapp.com/issues/11336
        let problemList = problemObj[_problemID].problemList[0];
        problemObj[_problemID].problemListData = problemObj[problemList];
    }
}

function createSublessonProblemObj(_queCounter, _problemInfo, questionID, grades) {
    //console.log("createSublessonProblemObj");
    // This function will create a problem object as per the requirement.
    let problemsObj = {};
    problemsObj["_//"] = "question " + _queCounter;
    let problem_type = getProblemType(_problemInfo);
    if (!problem_type) return false;
    problemsObj.type = problem_type;
    //============ CARRYFORWARD =================
    addCarryforwardData(problemsObj, _problemInfo, problem_type);
    //====================== ANSWERS ============ 
    let answerObj = getProblemAnswerObj(_problemInfo, problem_type, questionID);
    problemsObj.answers = [];
    problemsObj.answers.push(answerObj);
    //============================
    problemsObj.questionID = questionID;
    //=======================
    if (grades.length == 0) {
        // for some open response or other questions grades are not defined in currentProductAssignment Object of problemEditor. So for such instances undefined is mentioned. So we can identify in which question problem is.
        grades = "undefined";
    }
    problemsObj.grades = grades;
    //problemsObj.pointValue = grades[0];
    if (_problemInfo.points || _problemInfo.points == 0) {
        problemsObj.pointValue = _problemInfo.points;
    }
    if (_problemInfo.rubricData) {
        let rubricOptionValues = getRubricOptionValues(_problemInfo.rubricData);
        if (rubricOptionValues.length > 0) {
            problemsObj.rubricOptionValues = rubricOptionValues;
        }
        let rubricGradeObj = getRubricGradeObj(_problemInfo.rubricData);
        problemsObj.grades = [];
        problemsObj.grades.push(rubricGradeObj.gradeArr);
    }
    //---------------------------------------
    /*
    if (problem_type == "Dropdown")
    {
       // console.log(questionID,problem_type,_problemInfo);
    }
    */
    //----------------------------------------------------
    if (problem_type == "OpenResponse" || problem_type == "TableItems") {
        if (typeof _problemInfo.enableARubric != "undefined") {
            problemsObj.enableARubric = _problemInfo.enableARubric ? true : false;
        }

        if (typeof _problemInfo.questionWiseGradingEnabled != "undefined") {
            problemsObj.questionWiseGradingEnabled = _problemInfo.questionWiseGradingEnabled ? true : false;
        }
    }
    //-------------------------------------------------
    if (problem_type == "OpenResponse") {
        if (_problemInfo.rubricId) {
            let problemListTitle = "";
            if (_problemInfo.problemListData) {
                problemListTitle = _problemInfo.problemListData.interactive_frames[0].title;
            }
            problemsObj.rubricType = problemListTitle;
        }

    }
    //---------------------------------------------
    if (_problemInfo.shareOption) {
        problemsObj.shareOption = _problemInfo.shareOption;
    }
    //========================
    problemsObj.feedbacks = [];
    return problemsObj;
}

function calculateTotalPts(arr) {
    let _sum = 0;
    for (var i = 0; i < arr.length; i++) {
        _sum += arr[i]
    }
    return _sum;
}

function getRubricGradeObj(rubricData) {
    let rubricGradeArr = [];
    let _totalPts = 0;
    // Logic used in this function is same as algorithm provided by Andri in the comment 9884
    for (var i = 0; i < rubricData.length; i++) {
        let _option = rubricData[i].option;
        if (_option == "checkbox") {
            if (rubricData[i].childs.length == 1) {
                rubricGradeArr.push(1);
            } else {
                addChildRubricData(rubricData[i], rubricGradeArr, _totalPts)
            }
            _totalPts++;
        }
        if (_option == "radio" && rubricData[i].childs.length > 1) {
            addChildRubricData(rubricData[i], rubricGradeArr, _totalPts)
            _totalPts++;
        }
    }
    return {
        gradeArr: rubricGradeArr,
        totalPt: _totalPts
    };
}

function addChildRubricData(rubricData, rubricGradeArr) {
    let headerElement = rubricData.point; // max point in the section
    for (var j = 0; j < rubricData.childs.length; j++) {
        if (!rubricData.childs[j].childs) {
            if (rubricData.option == "radio") {
                if (rubricData.childs[j].point == headerElement) {
                    rubricGradeArr.push(1);
                } else {
                    rubricGradeArr.push(0);
                }
            }
            if (rubricData.option == "checkbox") {
                rubricGradeArr.push(1);
            }
        }
        if (rubricData.childs[j].childs) {
            addChildRubricData(rubricData.childs[j], rubricGradeArr);
        }
    }
}

function getChildRubricData(rubricData, arr) {
    if (rubricData.childs) {
        for (var i = 0; i < rubricData.childs.length; i++) {
            if (rubricData.childs[i].childs) {
                getChildRubricData(rubricData.childs[i], arr);
            } else {
                if (rubricData.childs[i].point || rubricData.childs[i].point == 0) {
                    arr.push(rubricData.childs[i].point);
                } else {
                    arr.push("undefined");
                }
            }
        }
    }
}

function getRubricOptionValues(rubricData) {
    let arr = [];
    for (var i = 0; i < rubricData.length; i++) {
        getChildRubricData(rubricData[i], arr);
    }
    return arr;
}

function addCarryforwardData(problemsObj, _problemInfo, problem_type) {
    if (problem_type == "OpenResponse") {
        problemsObj.carryForwardFrom = -1;
        if (_problemInfo.carryForwardFromId && _problemInfo.carryForwardFromId != "") {
            problemsObj.carryForwardFrom = _problemInfo.carryForwardFromId;
        }
        problemsObj.carryForward = _problemInfo.shouldCarryForward ? true : false;
    }
}

function getProblemType(_problemInfo) {
    let problem_type = _problemInfo.type;
    if (!problem_type) {
        problem_type = _problemInfo.answer_type;
    }
    switch(problem_type)
    {
        case "radio":
        problem_type = "RadioButton";
        break;
        case "open_response":
        case "essay":
        problem_type = "OpenResponse";
        break;
        case "table_items":
        problem_type = "TableItems";
        break;
        case "check":
        problem_type = "Checkbox";
        break;
        case "multi_part_answer":
        problem_type = "DragAndDrop";
        break;
        case "editing_tasks_choice":
        problem_type = "Dropdown";
        break;
    }
    return problem_type;
}

function getColumnRowVal(_arr) {
    //console.log("getColumnRowVal");
    // console.log("_arr = ",_arr);
    let newArr = [];
    for (var i = 0; i < _arr.length; i++) {
        if (i != 0) {
            let _val = getTextContent(_arr[i]);
            _val = String(_val).replace(/\n/g, '');
            newArr.push(_val);
        }
    }
    return newArr;
}

function getAnswerRowVal(answerContents) {
    let arr = [];
    for (var i = 0; i < answerContents.length; i++) {
        arr.push("tab " + (i + 1));
    }
    return arr;
}

function arrangeAnswersAsPerRows(_problemInfo, newAnswerArr) {
  let _interactive_frames = _problemInfo.interactive_frames;
  let tempArr = [];
  let filteredArr = [];
  for (var i = 0; i < _interactive_frames.length; i++) {
    if (
      _interactive_frames[i].contents &&
      _interactive_frames[i].contents.length > 0 &&
      _interactive_frames[i].column_row_vals
    ) {
      let _column_row_vals = _interactive_frames[i].column_row_vals;
      for (var j in _column_row_vals) {
        let _columnRowArr = _column_row_vals[j];
        for (var k = 0; k < _columnRowArr.length; k++) {
          //|[
          if (_columnRowArr[k].indexOf("|[") != -1) {
            let _answerIndex = _columnRowArr[k].split("|[")[1].split("]|")[0];
            _answerIndex = _answerIndex * 1;
            tempArr[k] = newAnswerArr[_answerIndex];
          }
        }
      }
    }
  }
  tempArr.map((value) => {
    filteredArr.push(value);
  });
  return filteredArr;
}

function getGridType(_problemInfo, _finalAnswerArr) {
  let _interactive_frames = _problemInfo.interactive_frames;
  let gridType;
  if (_finalAnswerArr.length == 1) {
    gridType = "column";
  } else {
    let gridCheckArr = [];
    for (var i = 0; i < _interactive_frames.length; i++) {
      if (
        _interactive_frames[i].contents &&
        _interactive_frames[i].contents.length > 0 &&
        _interactive_frames[i].column_row_vals
      ) {
        let _column_row_vals = _interactive_frames[i].column_row_vals[i];
        let _contents = _interactive_frames[i].contents;
        if (_column_row_vals.length == _contents.length + 1) {
          gridCheckArr.push(1);
        } else {
          gridCheckArr.push(0);
        }
      }
    }
    if (gridCheckArr.length == _.sum(gridCheckArr)) {
      gridType = "grid";
    } else {
      gridType = "grid_modified";
    }
  }
  return gridType;
}

function getProblemAnswerObj(_problemInfo, problem_type, questionID) {
    //console.log("getProblemAnswerObj");
    let answerObj = {};
    switch(problem_type)
    {
        case "OpenResponse":
        answerObj.tabs = [];
        answerObj.tabs.push({
            text: "",
            fields: [getTextContent(_problemInfo.answer)]
        });
        break;
        case "TableItems":
       // let _answerModes = _problemInfo.interactive_frames[0].answer_modes;
        let _columnRowVal = getAnswerRowVal(_problemInfo.interactive_frames[0].contents);
       answerObj.tabs = [];
        answerObj.tabs.push({
            text: "",
            fields: _columnRowVal
        });
        break;
        case "RadioButton":
        answerObj.option = [];
        answerObj.option = getTextContent(_problemInfo.answer) * 1;
        break;
        case "Checkbox":
        answerObj.option = [];
        let answerArray = _problemInfo.answer.split(',');
        answerArray = answerArray.map((elm)=>{
            return elm * 1;
        });
        answerArray = answerArray.sort();
        answerObj.option = answerArray;
        break;
        case "DragAndDrop":
        answerObj.tileLocations = [];
        let answerArr = JSON.parse("["+_problemInfo.answer+"]");
        let _finalAnswerArr = [];
        answerArr.forEach((elm)=>
        {
            //if(elm != "" && elm.indexOf(",") != -1)
           if(elm != "")
            {
                let _arr = elm.split(",");
                _finalAnswerArr.push(_arr);
            }
        });
        /*
            DragAndDrop types Added on 26/8/22
            As per tickete https://perfectionlearning.sifterapp.com/issues/13625, Drag and DROP are classified into 3 forms.
            Column, Grid and modified Grid
            Column: eg. Connection ELA grade 9 , Unit 1 , Chapter 1, Lesson 1, Preview Concepts, Vocabulary, question 1 (219006)
            [0]
            [1]
            [2]
            [3]
            [4]

            Grid: eg. Vocabu-Lit (I/9 OR Grade 9) Lesson 1: Two Poems by Emily Dickinson (poetry),  Synonyms and Antonyms, question 1 (241078)
            [0] [1] [2]
            [3] [4] [5]
            [6] [7] [8]

            modified Grid: eg. Vocabu-Lit (I/9 OR Grade 9) Lesson 1: Two Poems by Emily Dickinson (poetry),  Synonyms and Antonyms, question 1 (253519)
            [-] [-] [0] [-]
            [-] [-] [1] [-]
            [-] [-] [2] [-]
            [-] [-] [-] [3]
            [-] [-] [-] [4]
        
            Logic: _finalAnswerArr variable will contain, array of columns.
            If _finalAnswerArr 
            => length is 1, it means it contains only single column array.
            => length is 2, And all the column arrays have same length. Means it is of grid form. Grid numbering logic will be used.
            => if the length is 2, and length of columns are different. one is 3 and other is 2. Then it is of the form modified grid. Then modified grid logic will be used.

        
        */

        let gridType = getGridType(_problemInfo,_finalAnswerArr);
        //================================
       let newAnswerArr = [];
       if(gridType == "column")
       {
         newAnswerArr = _finalAnswerArr[0].map((elm)=>
         {
            return elm * 1;
         });
       }
       if(gridType == "grid")
       {
         let columns =  _finalAnswerArr.length;
         let rows = _finalAnswerArr[0].length;
         for(var i=0;i<rows;i++)
         {
            for(var j=0;j<columns;j++)
            {
                // console.log(i,j,_finalAnswerArr[j][i]);
                newAnswerArr.push(_finalAnswerArr[j][i] * 1);
               
            }
         }
       }

       if(gridType == "grid_modified")
       {
            for(var i=0;i<_finalAnswerArr.length;i++)
            {
                for(var j=0;j<_finalAnswerArr[i].length;j++)
                {
                    // console.log(i,j,_finalAnswerArr[i][j]);
                    newAnswerArr.push(_finalAnswerArr[i][j] * 1);
                    
                }
            }
            /*
                Rearrange as per row position :
                This logic was added because of the issue https://perfectionlearning.sifterapp.com/issues/14623
                When grid modified logic was written for tickete https://perfectionlearning.sifterapp.com/issues/13625, this scenario is not considered. Now the answer array will be arranged as per row numbers
            */
            //newAnswerArr = arrangeAnswersAsPerRows(_problemInfo,newAnswerArr);
            newAnswerArr = getRowWiseAnswerData(_problemInfo,newAnswerArr);
       }

      
       //=============================
        //console.log("questionID = ",questionID);
       // console.log("_problemInfo = ",_problemInfo);
       // console.log("answerArr = ",answerArr);
       // console.log("_finalAnswerArr = ",_finalAnswerArr);
       // console.log("gridType = ",gridType);
       // console.log("newAnswerArr = ",newAnswerArr);
       // console.log("===================================");
        answerObj.tileLocations =  newAnswerArr;
        break;
        case "Dropdown":
            {
              let answerArray = _problemInfo.answer.split(",");
              let optionsMap = answerArray.map((elm)=>{
                let _num = elm * 1;
                return _problemInfo.answer_val_map[_num];
                });
                answerObj.options = optionsMap;
            }
        break;
    }
     return answerObj;
}


function getRowWiseAnswerData(_problemInfo,nArr)
{
    // This function will arrange answer data rowwise.
    let _interactive_frames = _problemInfo.interactive_frames;
     let tableDataRowWise = [];
     let answerDataRowWise = [];
    for (var i = 0; i < _interactive_frames.length; i++) {
        if (
          _interactive_frames[i].contents &&
          _interactive_frames[i].contents.length > 0 &&
          _interactive_frames[i].column_row_vals
        ) {
            //=============================
          let _column_row_vals = _interactive_frames[i].column_row_vals;
          for (var j in _column_row_vals) {
            let _columnRowArr = _column_row_vals[j];
            for (var k = 0; k < _columnRowArr.length; k++) {
              //|[
              if (_columnRowArr[k].indexOf("|[") != -1) {
                let _answerIndex = _columnRowArr[k].split("|[")[1].split("]|")[0];
                _answerIndex = _answerIndex * 1;
                if(!tableDataRowWise[k])
                {
                    tableDataRowWise[k] = [];
                }
                tableDataRowWise[k].push({
                    dropId:_answerIndex,
                    dropAnswer:nArr[_answerIndex]
                });
              }
            }
          }
        }
      }
      //===========================
    tableDataRowWise.forEach((elm)=>{
        if(elm.length > 0)
        {
            elm.forEach((innerElm)=>{
                answerDataRowWise.push(innerElm.dropAnswer);
              });
        }
      });

    //console.log("tableDataRowWise = ",tableDataRowWise);
   // console.log("answerDataRowWise = ",answerDataRowWise);
    return answerDataRowWise;
}


function checkForSublessonTitle(obj) {
    // If sublesson title and lesson title are same. It means no need to add extra level. Replace parent with child
    if (obj.sublessons && obj.sublessons.length == 1 && obj.menuText == obj.sublessons[0].name) {
        let _sampObj = obj.sublessons[0];
        for (var i in obj.sublessons[0]) {
            _sampObj[i] = obj.sublessons[0][i];
        }
        _sampObj.menuText = obj.sublessons[0].name;
        delete _sampObj.name;
        return _sampObj;
    } else {
        return obj;
    }
}

function getTextContent(str) {
    // this function is used to remove all html tags in a string. 
    // It will render text on dom and only read textcontent property. Which will read only text
    /*
    var _testDiv = document.createElement("div");
    _testDiv.innerHTML = str;
    let _text = _testDiv.textContent;
    _text = String(_text).replace(/\t/g, '');
    // _text = String(_text).replace(/\n/g, '');
    */
    //return _text;
    return strip_html_tags(str); // function added for node application as document dont work in node
}

function strip_html_tags(str)
{
   if ((str===null) || (str===''))
       return false;
  else
   str = str.toString();
   str = str.replace(/<[^>]*>/g, '');
   str = String(str).replace(/\n/g, '');
  return str;
}

function getEditingTaskChoiceData(data) {
    let problemsWiseInfo = [];
    let {
        currentProblemData,
        currentProblemInfo,
        currentAssignmentInfo,
        currentProblemInfoWithProblemData,
        dynamicColumnData
    } = data;
    let localProblemLevel = 1;
    if (currentProblemData.hasOwnProperty('problemLevel')) {
        localProblemLevel = Number(currentProblemData.problemLevel) + 1;
        if (!dynamicColumnData[TEMPLATE_TYPE_1_COLUMN_NAME]) {
            dynamicColumnData[TEMPLATE_TYPE_1_COLUMN_NAME] = true;
        }
        if (!dynamicColumnData[TEMPLATE_TYPE_2_COLUMN_NAME]) {
            dynamicColumnData[TEMPLATE_TYPE_2_COLUMN_NAME] = true;
        }
    } else {
        if (!dynamicColumnData[TEMPLATE_TYPE_1_COLUMN_NAME]) {
            dynamicColumnData[TEMPLATE_TYPE_1_COLUMN_NAME] = true;
        }
    }
    if (hasIn(currentProblemData, 'presentation_data') && hasIn(currentProblemData.presentation_data, 'interactive_frames') && currentProblemData.presentation_data.interactive_frames.length) {
        let interactiveFrames = currentProblemData.presentation_data.interactive_frames;
        let editingTaskChoiceAnswer = currentProblemData.answer || '';
        let editingTaskChoiceAnswerValMap = {};
        if (hasIn(currentProblemData.presentation_data, 'answer_val_map')) {
            editingTaskChoiceAnswerValMap = currentProblemData.presentation_data.answer_val_map;
            editingTaskChoiceAnswer = editingTaskChoiceAnswer.split(",");
        }
        interactiveFrames && interactiveFrames.forEach(function (innerData, problemIndex) {
            let questionDataArray = [];
            if (hasIn(innerData, "text") && innerData.text !== '') {
                let dropdownTextArray = innerData.text.split("</li>");
                if (dropdownTextArray.length === 1) {
                    dropdownTextArray = innerData.text.split("</tr>");
                }
                let ind = innerData.drop_indicator.split("[").join("\\[").split("]").join("\\]").split("|").join("\\|").split("%id");
                let pattern = new RegExp(ind[0] + "(.+?)" + ind[1], "ig") //\|\[(.+?)\]\|/ig;
                dropdownTextArray.forEach(function (choiceQuestion, choiceIndex) {
                    choiceQuestion = choiceQuestion.replace(/(<\/ol>)/ig, "");
                    choiceQuestion = choiceQuestion.replace(/(<ol>)/ig, "");
                    choiceQuestion = choiceQuestion.replace(/(<\/li>)/ig, "");
                    choiceQuestion = choiceQuestion.replace(/(<li>)/ig, "");
                    choiceQuestion = choiceQuestion.replace(/(<table ((.|\n)+?)>)/ig, "");
                    choiceQuestion = choiceQuestion.replace(/(<\/table>)/ig, "");
                    choiceQuestion = choiceQuestion.replace(/(<tbody>)/ig, "");
                    choiceQuestion = choiceQuestion.replace(/(<\/tbody>)/ig, "");
                    choiceQuestion = choiceQuestion.replace(/(<tr>)/ig, "");
                    choiceQuestion = choiceQuestion.replace(/(<\/tr>)/ig, "");
                    choiceQuestion = choiceQuestion.replace(/(<td ((.|\n)+?)>)/ig, "");
                    choiceQuestion = choiceQuestion.replace(/(<\/td>)/ig, "");
                    let answerIndexArray = [];
                    if (choiceQuestion !== ' ' && choiceQuestion !== '') {
                        let splittedTextArray = choiceQuestion.split(pattern);
                        splittedTextArray.forEach(function (stringTextNumber) {
                            let numberConversion = Number(stringTextNumber);
                            if (!isNaN(numberConversion) && stringTextNumber !== '' && stringTextNumber !== ' ') {
                                answerIndexArray.push(numberConversion);
                            }
                        });
                        answerIndexArray.forEach(function (answerIndex) {
                            questionDataArray.push({
                                choiceQuestionText: choiceQuestion,
                                choiceQuestionNumber: "Question " + (choiceIndex + 1),
                                choiceAnswerText: editingTaskChoiceAnswerValMap[editingTaskChoiceAnswer[answerIndex]]
                            });
                        });
                    }
                });
            }
            questionDataArray.forEach(function (choiceQuestionData) {
                if (choiceQuestionData) {
                    let currentInnerProblemInfo = getInfo({
                        type: 'problem',
                        id: choiceQuestionData.choiceQuestionNumber,
                        template: (innerData.style || ''),
                        problemLevel: localProblemLevel,
                        questionText: choiceQuestionData.choiceQuestionText,
                        answerText: choiceQuestionData.choiceAnswerText
                    });
                    problemsWiseInfo.push({
                        ...currentInnerProblemInfo,
                        ...currentProblemInfo,
                        ...currentAssignmentInfo
                    });
                }
            });
        });
    }
    return problemsWiseInfo
}

function getTableItemData(data) {
    let problemsWiseInfo = [];
    let {
        currentProblemData,
        currentProblemInfo,
        currentAssignmentInfo,
        currentProblemInfoWithProblemData,
        dynamicColumnData
    } = data;
    let localProblemLevel = 1;
    if (currentProblemData.hasOwnProperty('problemLevel')) {
        localProblemLevel = Number(currentProblemData.problemLevel) + 1;
        if (!dynamicColumnData[TEMPLATE_TYPE_1_COLUMN_NAME]) {
            dynamicColumnData[TEMPLATE_TYPE_1_COLUMN_NAME] = true;
        }
        if (!dynamicColumnData[TEMPLATE_TYPE_2_COLUMN_NAME]) {
            dynamicColumnData[TEMPLATE_TYPE_2_COLUMN_NAME] = true;
        }
    } else {
        if (!dynamicColumnData[TEMPLATE_TYPE_1_COLUMN_NAME]) {
            dynamicColumnData[TEMPLATE_TYPE_1_COLUMN_NAME] = true;
        }
    }
    if (hasIn(currentProblemData, 'presentation_data') && hasIn(currentProblemData.presentation_data, 'interactive_frames') && currentProblemData.presentation_data.interactive_frames.length) {
        let interactiveFrames = currentProblemData.presentation_data.interactive_frames;
        let tabbedDataArray = [];
        interactiveFrames && interactiveFrames.forEach(function (innerData, problemIndex) {
            if (hasIn(innerData, 'column_row_vals') && keys(innerData.column_row_vals).length && hasIn(innerData, 'template_subtype')) {
                if (!dynamicColumnData.tableItemArray) {
                    dynamicColumnData.tableItemArray = {};
                    dynamicColumnData.tableItemArray.number = [];
                    dynamicColumnData.tableItemArray.none = [];
                }
                let currentAnswer = JSON.safeParse("[" + currentProblemData.answer + "]").valid ? JSON.safeParse("[" + currentProblemData.answer + "]").json : false;
                let _counter = 0;
                let _tempArray = [];
                let _ans = {};
                keys(innerData.column_row_vals).forEach(function (key) {
                    for (let i = 0; i < innerData.column_row_vals[0].length; i++) {
                        if (innerData.column_row_vals[key][i] == null) {
                            if (_ans.hasOwnProperty(i)) {
                                _ans[i].push(currentAnswer[_counter]);
                            } else {
                                _ans[i] = [];
                                _ans[i].push(currentAnswer[_counter]);
                            }
                            _counter++;
                        }
                    }
                });
                keys(_ans).forEach(function (key) {
                    _ans[key].forEach(function (element) {
                        _tempArray.push(element);
                    });
                });
                currentAnswer = _tempArray;
                if (hasIn(innerData, 'tabbed_view') && innerData.tabbed_view) {
                    switch (innerData.template_subtype) {
                        case "Single Tab":
                            tabbedDataArray = getSingleTabTableItemData(innerData.column_row_vals, currentAnswer);
                            break;
                        case "Numbered Tabs":
                            tabbedDataArray = getNumberedTabTableItemData(innerData.column_row_vals, currentAnswer);
                            break;
                        case "None":
                            tabbedDataArray = getDefaultTabTableItemData(innerData.column_row_vals, currentAnswer);
                            break;
                        default:
                    }
                } else {
                    if (!hasIn(innerData, 'tabbed_view') || !innerData.tabbed_view) {
                        tabbedDataArray = getNotTabbedViewContent(innerData.column_row_vals, currentAnswer);
                    }
                }
            }
            tabbedDataArray.forEach(function (tableInnerData) {
                if (tableInnerData) {
                    let currentInnerProblemInfo = getInfo({
                        type: 'problem',
                        id: tableInnerData.tabName,
                        template: innerData.template_subtype,
                        problemLevel: localProblemLevel,
                        questionText: tableInnerData.tabText,
                        answerText: tableInnerData.answerText
                    });
                    problemsWiseInfo.push({
                        ...currentInnerProblemInfo,
                        ...currentProblemInfo,
                        ...currentAssignmentInfo
                    });
                }
            });
        });
    }
    return problemsWiseInfo
}

function getNotTabbedViewContent(column_row_vals, currentAnswer) {
    let questionData = [];
    let returnTabbedData = [];
    let answerCount = 0;
    Object.keys(column_row_vals).forEach(function (key, index) {
        column_row_vals[key].forEach(function (innerElement, innerIndex) {
            if (!questionData[innerIndex]) {
                questionData[innerIndex] = {};
                questionData[innerIndex].questionText = [];
                questionData[innerIndex].answerText = [];
            }
            if (innerElement === null) {
                questionData[innerIndex].answerText.push(innerElement);
            } else {
                if (innerElement !== '') {
                    questionData[innerIndex].questionText.push(innerElement);
                }
            }
        });
    });
    questionData.forEach(function (innerData) {
        if (innerData) {
            if (_.hasIn(innerData, "questionText") && innerData.questionText.length) {
                returnTabbedData.push({
                    tabName: 'Tab 1',
                    tabText: innerData.questionText.join(":__:")
                });
            }
            if (_.hasIn(innerData, "answerText") && innerData.answerText.length) {
                innerData.answerText.forEach(function () {
                    returnTabbedData.push({
                        tabName: 'Tab 1',
                        answerText: currentAnswer[answerCount]
                    });
                    answerCount++;
                });
            }
        }
    });
    return returnTabbedData
}

function getSingleTabTableItemData(column_row_vals, currentAnswer) {
    let tabWiseData = makeTabularData(column_row_vals);
    let tabularQuestions = [];
    let tabsHeading = [];
    let tabDataArray = [];
    Object.keys(column_row_vals).forEach(function (key, index) {
        column_row_vals[key].forEach(function (innerElement, innerIndex) {
            if (index === 0 && innerIndex !== 0) {
                tabularQuestions.push(innerElement);
            } else if (index === 0 && innerIndex === 0) {
                tabsHeading.push(innerElement);
            }
        });
    });
    tabDataArray = tabularQuestions.length > 1 ? getTabbedDataForTableItem({
        tabsHeading,
        tabularQuestions,
        tabWiseData,
        type: "singleTab",
        answerText: currentAnswer
    }) : [];
    return tabDataArray
}

function getNumberedTabTableItemData(column_row_vals, currentAnswer) {
    let tabWiseData = makeTabularData(column_row_vals);
    let tabularQuestions = [];
    let tabsHeading = [];
    let tabDataArray = [];
    Object.keys(column_row_vals).forEach(function (key, index) {
        column_row_vals[key].forEach(function (innerElement, innerIndex) {
            if (index === 0 && innerIndex !== 0) {
                tabsHeading.push(innerIndex + ". ");
                tabularQuestions.push(innerElement);
            }
        });
    });
    tabDataArray = getTabbedDataForTableItem({
        tabsHeading,
        tabularQuestions,
        tabWiseData,
        type: "numberedTab",
        answerText: currentAnswer
    });
    return tabDataArray
}

function getDefaultTabTableItemData(column_row_vals, currentAnswer) {
    let tabWiseData = makeTabularData(column_row_vals);
    let tabularQuestions = [];
    let tabsHeading = [];
    let tabDataArray = [];
    Object.keys(column_row_vals).forEach(function (key, index) {
        column_row_vals[key].forEach(function (innerElement, innerIndex) {
            if (index !== 0 && innerIndex === 0) {
                tabularQuestions.push(innerElement);
            }
            if (index === 0 && innerIndex !== 0) {
                tabsHeading.push(innerElement);
            }
        });
    });
    tabDataArray = getTabbedDataForTableItem({
        tabsHeading,
        tabularQuestions,
        tabWiseData,
        type: "defaultTab",
        answerText: currentAnswer
    });
    return tabDataArray
}

function getTabbedDataForTableItem(data) {
    let {
        tabsHeading,
        tabularQuestions,
        tabWiseData,
        type,
        answerText
    } = data;
    let tabDataArray = [];
    let unNamedTabsCount = 0;
    let answerCount = 0;
    tabsHeading.forEach(function (element, index) {
        let tabName = element === null ? "word " + (++unNamedTabsCount) : element.trim();
        // let tabData = {};
        let questionTextData = "";
        let answerTextData = "";
        switch (type) {
            case "numberedTab":
                let tabData = {};
                if (tabularQuestions[index] && tabularQuestions[index] !== '' && tabularQuestions[index] !== null) {
                    questionTextData = tabularQuestions[index];
                }
                if (tabWiseData[index] && tabWiseData[index][index] && tabWiseData[index][index] !== null && tabWiseData[index][index] !== '') {
                    questionTextData += tabWiseData[index][index];
                } else if (tabWiseData[index] && tabWiseData[index][0] && tabWiseData[index][0] !== null && tabWiseData[index][0] !== '') {
                    questionTextData += tabWiseData[index][0];
                }
                if (questionTextData !== '') {
                    tabData.tabText = questionTextData;
                    tabData.tabName = `Tab ${Number(index) + 1}(${tabName})`;
                    tabDataArray.push(cloneDeep(tabData));
                }
                if (tabularQuestions[index] === null) {
                    answerTextData = answerText[answerCount];
                }
                if (tabWiseData[index] && tabWiseData[index][index] === null) {
                    answerTextData = answerText[answerCount];
                } else if (tabWiseData[index] && tabWiseData[index][0] === null) {
                    answerTextData = answerText[answerCount];
                }
                if (answerTextData !== '') {
                    tabData.tabText && delete tabData.tabText;
                    tabData.answerText = answerTextData;
                    tabData.tabName = `Tab ${Number(index) + 1}(${tabName})`;
                    tabDataArray.push(cloneDeep(tabData));
                    answerCount++;
                }
                break;
            case "defaultTab":
                tabularQuestions.forEach(function (_element, _index) {
                    let tabData = {};
                    questionTextData = "";
                    answerTextData = "";
                    if (_element && _element !== null && _element !== '') {
                        questionTextData += _element;
                    }
                    if (tabWiseData[index] && tabWiseData[index][_index] && tabWiseData[index][_index] !== null && tabWiseData[index][_index] !== '') {
                        questionTextData += tabWiseData[index][_index];
                    }
                    if (questionTextData !== '') {
                        tabData.tabText = questionTextData;
                        tabData.tabName = `Tab ${Number(index) + 1}(${tabName})`;
                        tabDataArray.push(cloneDeep(tabData));
                    }
                    if (_element === null) {
                        answerTextData = answerText[answerCount];
                    }
                    if (tabWiseData[index] && tabWiseData[index][_index] === null) {
                        answerTextData = answerText[answerCount];
                    }
                    if (answerTextData !== '') {
                        tabData.tabText && delete tabData.tabText;
                        tabData.answerText = answerTextData;
                        tabData.tabName = `Tab ${Number(index) + 1}(${tabName})`;
                        tabDataArray.push(cloneDeep(tabData));
                        answerCount++;
                    }
                });
                break;
            case "singleTab":
                tabularQuestions.forEach(function (_element, _index) {
                    let tabData = {};
                    questionTextData = "";
                    answerTextData = "";
                    if (_element && _element !== null && _element !== '') {
                        questionTextData += _element;
                    }
                    if (tabWiseData[_index] && tabWiseData[_index][index] && tabWiseData[_index][index] !== null && tabWiseData[_index][index] !== '') {
                        questionTextData += tabWiseData[_index][index];
                    }
                    if (questionTextData !== '') {
                        tabData.tabText = questionTextData;
                        tabData.tabName = `Tab ${Number(index) + 1}`;
                        tabDataArray.push(cloneDeep(tabData));
                    }
                    if (_element === null) {
                        answerTextData = answerText[answerCount];
                    }
                    if (tabWiseData[_index] && tabWiseData[_index][index] === null) {
                        answerTextData = answerText[answerCount];
                    }
                    if (answerTextData !== '') {
                        tabData.tabText && delete tabData.tabText;
                        tabData.answerText = answerTextData;
                        tabData.tabName = `Tab ${Number(index) + 1}`;
                        tabDataArray.push(cloneDeep(tabData));
                        answerCount++;
                    }
                });
                break;
        }
    });
    tabDataArray = uniq(tabDataArray)
    return tabDataArray
}

function makeTabularData(data) {
    var keys = Object.keys(data);
    var innerArrayLength = (keys.length - 1);
    var OuterArrayLength = data[keys[0]].length;
    var newDataArray = new Array(OuterArrayLength);
    keys.forEach(function (key, index) {
        data[key].forEach(function (innerElement, innerIndex) {
            if (index === 0) {
                newDataArray[innerIndex] = new Array(innerArrayLength);
            } else if (innerIndex !== 0) {
                newDataArray[innerIndex - 1][index - 1] = innerElement;
            }
        });
    });
    return newDataArray;
}

function getMultiPartData(data) {
    let problemsWiseInfo = [];
    let {
        currentProblemData,
        currentProblemInfo,
        currentAssignmentInfo,
        currentProblemInfoWithProblemData,
        dynamicColumnData
    } = data;
    let localProblemLevel = 1;
    if (currentProblemData.hasOwnProperty('problemLevel')) {
        localProblemLevel = Number(currentProblemData.problemLevel) + 1;
        if (!dynamicColumnData[TEMPLATE_TYPE_1_COLUMN_NAME]) {
            dynamicColumnData[TEMPLATE_TYPE_1_COLUMN_NAME] = true;
        }
        if (!dynamicColumnData[TEMPLATE_TYPE_2_COLUMN_NAME]) {
            dynamicColumnData[TEMPLATE_TYPE_2_COLUMN_NAME] = true;
        }
    } else {
        if (!dynamicColumnData[TEMPLATE_TYPE_1_COLUMN_NAME]) {
            dynamicColumnData[TEMPLATE_TYPE_1_COLUMN_NAME] = true;
        }
    }
    if (hasIn(currentProblemData, 'presentation_data') && hasIn(currentProblemData.presentation_data, 'interactive_frames') && currentProblemData.presentation_data.interactive_frames.length) {
        let interactiveFrames = currentProblemData.presentation_data.interactive_frames;
        if (interactiveFrames && interactiveFrames[0] && (interactiveFrames[0].style == "content_text_drop_box" || interactiveFrames[0].style == "horizontal_content_box")) {
            let frameData = combineInteractivePart(interactiveFrames);
            interactiveFrames = frameData;
        }
        let splittedMultiPartAnswer = JSON.parse("[" + currentProblemData.answer + "]");
        interactiveFrames && interactiveFrames.forEach(function (innerData, problemIndex) {
            if (innerData.style) {
                switch (innerData.style) {
                    case "content_text_drop_box":
                        let dragAndDropArray = getDragAndDropData(innerData, currentProblemData, interactiveFrames, splittedMultiPartAnswer);
                        dragAndDropArray.forEach(function (dropQuestionData) {
                            if (dropQuestionData) {
                                let currentInnerProblemInfo = getInfo({
                                    type: 'problem',
                                    id: 'Part ' + (Number(problemIndex) + 1) + ('(Q No: ' + dropQuestionData.questionNumber + ')'),
                                    template: innerData.style,
                                    problemLevel: localProblemLevel,
                                    questionText: dropQuestionData.questionText,
                                    answerText: dropQuestionData.answerText
                                });
                                problemsWiseInfo.push({
                                    ...currentInnerProblemInfo,
                                    ...currentProblemInfo,
                                    ...currentAssignmentInfo
                                });
                            }
                        });
                        break;
                    case "horizontal_content_box":
                        break;
                    default:
                        let questionText = '';
                        if (hasIn(innerData, 'text')) {
                            questionText = innerData.text;
                        }
                        if (hasIn(innerData, 'questionText')) {
                            questionText = innerData.questionText;
                        }
                        let currentInnerProblemInfo = getInfo({
                            type: 'problem',
                            id: 'Part ' + (Number(problemIndex) + 1),
                            template: innerData.style,
                            problemLevel: localProblemLevel,
                            questionText: questionText
                        });
                        problemsWiseInfo.push({
                            ...currentInnerProblemInfo,
                            ...currentProblemInfo,
                            ...currentAssignmentInfo,
                            ...currentProblemInfoWithProblemData
                        });
                        break;
                }
            }
        });
    }
    return problemsWiseInfo
}

function getDragAndDropData(frameData, currentProblemData = {}, inter = {}, answer = '') {
    let questionDataArr = [];
    let columnRowVals = frameData.column_row_vals;
    let initialCounterValue = 0;
    if (hasIn(frameData, "styleType") && frameData.styleType !== '') {
        switch (frameData.styleType) {
            case "Tile without border":
                initialCounterValue = -1;
                break;
        }
    }
    let ind = frameData.drop_indicator.split("[").join("\\[").split("]").join("\\]").split("|").join("\\|").split("%id");
    let pattern = new RegExp(ind[0] + "(.+?)" + ind[1], "ig") //\|\[(.+?)\]\|/ig;
    keys(columnRowVals).forEach(function (columnWiseData) {
        let columnArr = columnRowVals[columnWiseData];
        let questionCount = cloneDeep(initialCounterValue);
        columnArr.forEach(function (colData, colIndex) {
            let stringColumnData = '';
            if (isString(colData)) {
                stringColumnData = colData;
            } else if (isArray(colData)) {
                stringColumnData = colData.join(',');
            }
            if (stringColumnData !== '' && stringColumnData !== ' ') {
                if (!questionDataArr[colIndex]) {
                    questionDataArr[colIndex] = {};
                    questionDataArr[colIndex].questionText = '';
                    questionDataArr[colIndex].questionNumber = questionCount + 1;
                }
                questionDataArr[colIndex].questionText += ((questionDataArr[colIndex].questionText === '' ? '' : ':__:') + stringColumnData);
            }
            questionCount++;
        });
    });
    questionDataArr = compact(questionDataArr)
    let questionDataArray = [];
    let splittedAnswer = (compact(answer)).join().split(",");
    let dragAndDropAnswerValMap = currentProblemData.presentation_data.answer_val_map["part_0"];
    questionDataArr.forEach(function (problemData) {
        let answerIndexArray = [];
        if (problemData.questionText !== '') {
            let patternMatchingText = problemData.questionText.split(pattern);
            patternMatchingText.forEach(function (stringTextNumber) {
                let numberConversion = Number(stringTextNumber);
                if (!isNaN(numberConversion) && stringTextNumber !== '' && stringTextNumber !== ' ') {
                    answerIndexArray.push(numberConversion);
                }
            });
            if (answerIndexArray.length) {
                answerIndexArray.forEach(function (answerIndex) {
                    questionDataArray.push({
                        questionText: problemData.questionText,
                        questionNumber: problemData.questionNumber,
                        answerText: dragAndDropAnswerValMap[splittedAnswer[answerIndex]]
                    });
                });
            } else {
                questionDataArray.push({
                    questionText: problemData.questionText,
                    questionNumber: problemData.questionNumber,
                    answerText: ''
                });
            }
        }
    });
    return questionDataArray;
}

function combineInteractivePart(interactiveFrames) {
    let count = 0,
        group, previous_gID, part, prevPart;
    let tempFramesObj = {};
    interactiveFrames.forEach(function (i) {
        prevPart = part;
        part = i.part_id;
        previous_gID = group;
        group = i.group_id;
        if (previous_gID == group && group != undefined) {
            if ("undefined" === typeof (tempFramesObj[prevPart])) {
                var tempArr = [];
                tempArr.push(i);
                tempFramesObj[prevPart] = tempArr;
                count++;
            } else {
                if (i.column_row_vals) {
                    tempFramesObj[prevPart].forEach(function (j) {
                        $.extend(j.column_row_vals, i.column_row_vals);
                        i.contents.forEach(function (k) {
                            (j.contents).push(k);
                        });
                    });
                } else {
                    tempFramesObj[prevPart].forEach(function (j) {
                        i.contents.forEach(function (k) {
                            (j.contents).push(k);
                        });
                    });
                    tempFramesObj[prevPart].push(i);
                }
                part = prevPart;
            }
        } else {
            if (prevPart == part) {
                tempFramesObj[prevPart].push(i);
            } else {
                if ("undefined" !== typeof (tempFramesObj[part])) {
                    tempFramesObj[part].push(i);
                } else if ("undefined" === typeof (tempFramesObj["part_" + count])) {
                    var tempArr = [];
                    tempArr.push(i);
                    tempFramesObj["part_" + count] = tempArr;
                    count++;
                } else {
                    tempFramesObj["part_" + count].push(i);
                }
            }
        }
    });
    return tempFramesObj["part_0"];
}

function addProblemAttributesInSheetData(problemDataFetched, tagIdWiseAllData, problemDetails) {
    let problemData = {};
    if (hasIn(problemDataFetched, 'problemLevel')) {
        problemData.problemLevel = problemDataFetched.problemLevel;
    }
    if (hasIn(problemDataFetched, 'question')) {
        problemData.questionText = problemDataFetched.question;
    }
    if (hasIn(problemDataFetched, 'presentation_data') && hasIn(problemDataFetched.presentation_data, 'interactive_frames') && problemDataFetched.presentation_data.interactive_frames.length) {
        let interactiveFrames = problemDataFetched.presentation_data.interactive_frames[0] || {};
        if (hasIn(interactiveFrames, 'questionText')) {
            // Annotation Practice Item
            problemData.questionText = interactiveFrames.questionText;
        }
        if (hasIn(interactiveFrames, ANSWER_WISE_INFO_NEEDED_FIELD) && hasIn(interactiveFrames, ANSWER_WISE_INFO_FIELD)) {
            let answerWiseInfo = interactiveFrames["answer_wise_info"];
            let answerWiseInfoKeys = keys(answerWiseInfo);
            if (answerWiseInfoKeys.length) {
                let answerWiseScore = 0;
                answerWiseInfoKeys.forEach(function (answerKey) {
                    let answerWiseDetails = answerWiseInfoKeys[answerKey];
                    if (answerWiseDetails && hasIn(answerWiseDetails, "point")) {
                        answerWiseScore += Number(answerWiseDetails.points);
                    }
                });
                if (answerWiseScore !== 0) {
                    console.log(answerWiseScore, ' answerWiseScore found in problem id: ', problemDataFetched.id);
                }
            }
        }
    }
    if (hasIn(problemDataFetched, 'skillsArray')) {
        if (problemDataFetched.skillsArray.length !== 0 && tagIdWiseAllData) {
            let tagSkillNameArray = [];
            forEach(problemDataFetched.skillsArray, function (tagId) {
                let tagIdMatched = find(tagIdWiseAllData, {
                    'id': Number(tagId)
                });
                if (tagIdMatched) {
                    tagSkillNameArray.push(tagIdMatched.name);
                }
            });
            problemData.skills = tagSkillNameArray.join(', ');
        }
    }
    let answerText = getAnswerDataTemplateWise(problemDataFetched);
    if (answerText !== '' && answerText !== ' ') {
        problemData.answerText = answerText;
    }
    if (hasIn(problemDetails, "points") && problemDetails.points.length && problemDetails.points[0] !== 0) {
        problemData.points = problemDetails.points[0]
    }
    return problemData
}

function getAnswerDataTemplateWise(problemData) {
    let answerText = '';
    if (problemData && problemData.presentation_data && !problemData.presentation_data.type) {
        switch (problemData.answer_type) {
            case "input":
                answerText = problemData.answer;
                break;
            case "MultKinetic":
                answerText = problemData.answer;
                break;
            case "essay":
                answerText = problemData.answer;
                break;
            case "radio":
            case "check":
                let splittedAnswer = problemData.answer.split(",");
                let answerChoices = problemData.choices;
                splittedAnswer.forEach(function (answerIndex) {
                    if (answerChoices[answerIndex] && answerChoices[answerIndex] !== '') {
                        answerText += answerChoices[answerIndex].text;
                    }
                });
                break;
        }
    } else if (problemData && problemData.presentation_data && problemData.presentation_data.type) {
        switch (problemData.presentation_data.type) {
            case "shareable_open_response":
                answerText = problemData.answer;
                break;
            case "open_response":
                answerText = problemData.answer;
                break
        }
    }
    return answerText
}

function getInfo(data) {
    const {
        type,
        id,
        index,
        name,
        template,
        questionText,
        problemLevel = '',
        skills,
        answerText = '',
        points = 0
    } = data;
    let info = {};
    if (type != undefined) {
        if (id != undefined) {
            info[`${capitalize(type)} ${ID_COLUMN_NAME}${problemLevel}`] = id;
        };
        if (index != undefined) {
            info[`${capitalize(type)} ${INDEX_COLUMN_NAME}`] = +(index);
        };
        if (name != undefined) {
            info[`${capitalize(type)} ${NAME_COLUMN_NAME}`] = name
        };
        if (template != undefined) {
            info[`${capitalize('template')} ${TYPE_COLUMN_NAME}${problemLevel}`] = template
        };
        if (data[ASSESSMENT_TYPE_TEXT] != undefined) {
            info[`${capitalize(type)} ${TYPE_COLUMN_NAME}`] = data[ASSESSMENT_TYPE_TEXT]
        };
        if (data[ASSESSMENT_SUBTYPE_TEXT] != undefined) {
            info[`${capitalize(type)} ${SUBTYPE_COLUMN_NAME}`] = data[ASSESSMENT_SUBTYPE_TEXT]
        };
        if (questionText != undefined) {
            info[`${PROBLEM_QUESTION_TEXT_COLUMN_NAME}`] = questionText
        };
        if (skills != undefined) {
            info[`${SKILLS_COLUMN_NAME}`] = skills
        };
        if (points != undefined) {
            info[`${SCORE_COLUMN_NAME}`] = points
        };
        if (answerText != undefined && answerText !== '' && answerText !== ' ') {
            info[`${PROBLEM_ANSWER_TEXT_COLUMN_NAME}`] = answerText
        };
    }
    return info;
}

function getTagFromProblemData(allProblemsData) {
    let tagArray = [];
    if (allProblemsData.length) {
        allProblemsData = map(allProblemsData, function (problemData) {
            if (hasIn(problemData, 'tags')) {
                if (keys(problemData.tags).length) {
                    let tagIdArray = keys(problemData.tags);
                    tagArray.push(tagIdArray);
                    problemData.skillsArray = _.compact(_.pull(tagIdArray, 'undefined'));
                }
            }
            return problemData
        });
    }
    tagArray = uniq(flatten(tagArray));
    return {
        allProblemsData,
        tagArray
    };
}
async function getAllAssignmentProblems(assignments, addProblemDataInSheet,applicationType) {
    _console("getAllAssignmentProblems");
    _console("applicationType = ",applicationType);
    let problemIds = [];
    let problemLevelObj = {};
    let tagsData = [];
    problemIds = uniq(flatten(map(assignments, assignment => {
        return map(assignment.problems, 'problemID');
    })));
    if (problemIds.length > 0) {
        let problemsData = await getProblemListPromise({
            ids: problemIds
        },applicationType);
        let innerProblemIds = [];
        forEach(problemsData, function (problemData) {
            if (problemData && problemData.presentation_data && problemData.presentation_data.type) {
                let problemType = problemData.presentation_data.type;
                switch (problemType) {
                    case 'multiTab':
                    case 'activity_frame':
                        if (problemData.presentation_data && problemData.presentation_data.problemList && problemData.presentation_data.problemList.length) {
                            innerProblemIds = [...innerProblemIds, ...problemData.presentation_data.problemList];
                        }
                        break;
                    default:
                        break;
                }
            }
        });
        if (innerProblemIds && innerProblemIds.length) {
            let innerProblemsData = await getProblemListPromise({
                ids: innerProblemIds
            },applicationType);
            if (innerProblemsData) {
                innerProblemsData = innerProblemsData.map(function (multiTabInnerProblemData) {
                    multiTabInnerProblemData.problemLevel = 1;
                    // Added dynamic Column
                    if (!problemLevelObj[TEMPLATE_TYPE_1_COLUMN_NAME] && addProblemDataInSheet) {
                        problemLevelObj[TEMPLATE_TYPE_1_COLUMN_NAME] = true;
                    }
                    return multiTabInnerProblemData
                });
                problemsData = [...problemsData, ...innerProblemsData]
            }
        }
        //================================
        // Below code is added with discussion with sachine to get rubric problems
        let _rubricProblemID = [];
        forEach(problemsData, function (problemData) {
                let problemType = problemData.presentation_data.type;
            if(!problemType && problemData.answer_type)
            {
                problemType = problemData.answer_type;
            }
            if (problemData && problemData.presentation_data && problemType) {
                switch (problemType) {
                    case 'essay':
                    case 'open_response':
                        if (problemData.presentation_data && problemData.presentation_data.problemList && problemData.presentation_data.problemList.length) {
                            _rubricProblemID = [..._rubricProblemID, ...problemData.presentation_data.problemList];
                        }
                        break;
                    default:
                        break;
                }
            }
        });
        if (_rubricProblemID && _rubricProblemID.length) {
            let _rubricProblemData = await getProblemListPromise({
                ids: _rubricProblemID
            },applicationType);
            if (_rubricProblemData) {
                problemsData = [...problemsData, ..._rubricProblemData]
            }
        }
        //================================
        if (addProblemDataInSheet) {
            let updatedProblemData = getTagFromProblemData(problemsData);
            problemsData = updatedProblemData.allProblemsData;
            let tagIdArray = updatedProblemData.tagArray;
            if (tagIdArray.length !== 0) {
                tagsData = await getTagsPromise(tagIdArray,applicationType);
            }
        }
        return {
            problemLevelObj,
            problemData: problemsData,
            tagIdWiseAllData: tagsData
        };
    }
    return {
        problemLevelObj,
        problemData: [],
        tagIdWiseAllData: []
    };
}
