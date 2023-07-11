//import axios from 'axios';
/*
import {
  getPassageDataToSave,
  setPassageIdWithinTOCData, //
  addStudentVisibleAndHiddenDataInUnits,
  adjustDataForHomePage,
  getUniqueStudentVisibleAssingments,
  getRequiredFieldsFromAssignmentToSave
} from '../../utils/Helper';
*/
/*
import _, {
  filter,
  hasIn,
  keys,
  map,
  uniq,
  isEmpty,
  partialRight,
  pick
} from 'lodash';
*/
import _ from 'lodash';
const {  filter,
    hasIn,
    keys,
    map,
    uniq,
    isEmpty,
    replace,
    partialRight,
    pick,
    cloneDeep, compact, concat, find, flatten, forEach,  includes, indexOf, isEqual, isNumber,  lowerCase,  max, remove, sum, trim,  without,
     first,  isArray, isObject,  last,  split
    } = _;
    /*
import {
  getLocationInformation,
  getMatchedLesson,
  reSubstituteEscapedCommaAfterSplit,
  substituteEscapedCommaBeforeSplit,
  updateLocationInfoInNonInteractiveResources
} from './excelResourceUtils';
*/
import {
  UPLOAD_RESOURCES_PAGE,
  AUTOMATION_USER_ID,
  AUTOMATION_USER_NAME,
  DROPDOWN_TYPES,
  PASSAGE_ID,
  STUDENT_VISIBILITY,
  RESOURCE_CLASSIFICATION,
  xlsxConfig,
  EMPTY_COLUMN_VALUE,
  ASSOCIATED_ID,
  LOCATION,
  RESOURCE_TITLE,
  RESOURCE_CODE,
  USER_CONTENT_OBJECT_DEFAULT_DATA,
  TYPES_OF_USER_CONTENT_OBJECT,
  ID,
  CATAGORY_AUTOMATION_FILES,
  FIELDS_TO_EXCLUDE_WHILE_MODIFY_AUTOMATION_USER_CONTENT_OBJECT,
   ASSOCIATED_TYPE, COMMA_STRING, ESCAPED_CHARACTER_SUBSTITUTE, ESCAPED_CHARACTER_SUBSTITUTE_REGEX, ESCAPED_COMMA_REGEX, LESSON_NAMES_MAPPPING_CONSTANT, RESOURCES_KEY 
} from '../../utils/Constants.js';
import * as constants from '../../utils/Constants.js';
import {
  getProductStructureJson
} from '../getProductStructure/getProductStructureJson.js';
import {
  getSpreadsheetErrors
} from './getSpreadsheetErrors.js';

import {
    getHttpRequest
  } from './httpAxioRequest.js';
  
import * as XLSX from 'xlsx';
import { addPacingInformationInsideInteractiveResources } from './excelResourceUtils.js';
export function uploadImportSpreadsheet(data) {
  _console("uploadImportSpreadsheet");
  //============= CODE FOR PROCESSING ================
  return new Promise(async function(resolve, reject) {
      let {
          selectedBook,
          workbook,
          applicationType
      } = data;
      let automationObjects;
      let userContentObjects;
      let currentProductAssignments;
      let unitstructure;
      //----------------------------------------------
      _console("selectedBook = ", selectedBook);
      _console("applicationType = ", applicationType);
      // This function will convert excel data to JSON for posting to server
      //================================================
      let _bookListinfo = await getBookListInfo({
          applicationType
      });
      let currentProductId;
      let productIdExists = checkProductID(_bookListinfo, selectedBook);
      if(productIdExists)
      {
        currentProductId = selectedBook;
      }
      else
      {
        currentProductId = getProductID(_bookListinfo, selectedBook);
      }
      _console("productIdExists = ", productIdExists);
      _console("currentProductId = ", currentProductId);
      let spreadsheetErrors = getSpreadsheetErrors(workbook);
      if(spreadsheetErrors[2].errorsFound || spreadsheetErrors[3].errorsFound)
      {
        let _response = {
            jsonErrors: [],
            spreadsheetErrors
        };
        resolve(_response);
        return;
      } 
      if (currentProductId) {
         // console.log(1);
          userContentObjects = await getAutomationFiles({
              currentProductId,
              applicationType
          });
          //-----------------------------------
         // console.log(2);
          currentProductAssignments = await getCurrentProductAssignments({
              currentProductId,
              applicationType
          });
          currentProductAssignments = currentProductAssignments.data;
          //-----------------------------------
         // console.log(3);
          unitstructure = await getChapterEntityStructurePromise({
              currentProductId,
              applicationType
          });
          //---------------------------------------
         // console.log(4);
          automationObjects = await createJSON({
              currentProductId,
              userContentObjects,
              currentProductAssignments,
              unitstructure,
              workbook,
              XLSX,
              applicationType
          });
         // _console(5);
      } else {
         // console.log("currentProductId nor found");
          resolve("Error: ProductId / selectedBook not found");
          return;
      }
      //
      // console.log("automationObjects = ", automationObjects);
      // enableErrorCheck made false is commented as per jesse. Sheet will be uploaded even if it contains errors.
      let enableErrorCheck = false; // make it false to skip error check
      if (enableErrorCheck && automationObjects.jsonErrors.length > 0) {
        let _response = {
            jsonErrors: automationObjects.jsonErrors,
              spreadsheetErrors
          };
          resolve(_response); 
          return;
      }
      //return; // enable it while debugging JSON
      //================= Submit button code ==============
      //============ Save Automation files data =====================
      let automationDataToSave = automationObjects.automation_data_to_save;
      //==========================
      // deleteOldProductStructureObj function is added to delete all product structure json old file objects.
      // At the end of submit function. New file objects will get added to the API with fresh data
      // For more infor. Please check comments of tickete https://perfectionlearning.sifterapp.com/issues/16058
      await deleteOldProductStructureObj(userContentObjects,applicationType);
      //==============================================
      if (automationDataToSave.length) {
         // showLoader();
          let dataWithIds = [];
          let dataWithoutIds = [];
          automationDataToSave.forEach((element) => {
              element.hasOwnProperty('id') ? dataWithIds.push(element) : dataWithoutIds.push(element);
          });
          // ========== Filter data to remove undefined content objects ================
          // Sifter 15413
          dataWithoutIds = dataWithoutIds.filter((elm) => {
              return elm.user_id;
          });
          //=========================================
          //console.log("dataWithoutIds = ", dataWithoutIds);
          // This block will creates new user Content Object.
          if (dataWithoutIds.length) {
              let createUserContentObjectPromise = await createUserContentObject(dataWithoutIds,applicationType);
              if (createUserContentObjectPromise) {
                  _console("User content objects created", createUserContentObjectPromise);
              }
              /*
              createUserContentObjectPromise.then(async (data) => {
                console.log("User content objects created", data);
                //userContentObjects = await getAutomationFiles({currentProductId,applicationType});
                //console.log("112 userContentObjects = ",userContentObjects);
              });
              */
          }
          // console.log("dataWithIds = ", dataWithIds);
          // This block will modifies existing user Content Object.
          if (dataWithIds.length) {
              let modifyUserContentObjectPromise = await modifyUserContentObject(dataWithIds,applicationType);
              if (modifyUserContentObjectPromise) {
                  _console("User content objects created", modifyUserContentObjectPromise);
              }
              /*
              modifyUserContentObjectPromise.then(async (data) => {
                console.log("User content objects modifed", data);
                //userContentObjects = await getAutomationFiles({currentProductId,applicationType});
               // console.log("122 userContentObjects = ",userContentObjects);
              });
              */
          }
          // console.log("123");
      }
      //============ Save Automation files data =====================
      // ================ Upload Resources data =========================
      let currentUnit, currentPresentation_data;
      let automationData = [];
      let unitsWithPresentationData = [];
      let ids = [];
      let {
          units,
          chapters,
          lessons
      } = unitstructure;
      let resoursesUnitWiseData = automationObjects.resoursesUnitWiseData;
      let productInfo = automationObjects.productInfo;
      let programCategories = automationObjects.programCategories;
      let menuNavigation = automationObjects.toc;
      let reportsLabels = automationObjects.reportsLabels;
      let passagesInfo = automationObjects.passagesInfo;
      let dropdownType = automationObjects.type;
      units.forEach(function(_elem) {
          const {
              title = ''
          } = _elem;
          currentPresentation_data = {};
          if (hasIn(resoursesUnitWiseData, title)) {
              currentPresentation_data = JSON.parse(JSON.stringify(resoursesUnitWiseData[title]));
          }
          currentUnit = JSON.parse(JSON.stringify(_elem));
          var _data = {};
          currentUnit.presentation_data = (typeof currentUnit.presentation_data === Object) ? JSON.parse(currentUnit.presentation_data) : {};
          currentUnit.presentation_data = {
              ...currentUnit.presentation_data,
              resources: {
                  ...currentPresentation_data
              },
              productInfo: {
                  ...productInfo
              },
              programCategories: {
                  ...programCategories
              },
              menuNavigation: {
                  ...menuNavigation
              },
              ...!isEmpty(reportsLabels) && {
                  reportsLabels: {
                      ...reportsLabels
                  }
              }
          }
          if (keys(passagesInfo).length) {
              currentUnit.presentation_data = {
                  ...currentUnit.presentation_data,
                  passagesInfo: {
                      ...passagesInfo
                  },
              }
          }
          _data.presentation_data = JSON.stringify(currentUnit.presentation_data);
          _data._id = currentUnit.id;
          automationData.push(_data);
          ids.push(_data._id);
          unitsWithPresentationData.push({
              ...currentUnit
          });
      });
      _console("180 automationData = ", automationData);
      let isVoicesofHolocaust = false;
      switch (dropdownType) {
          case DROPDOWN_TYPES.DEFAULT: // 0
          case DROPDOWN_TYPES.FOUR: // 4
              break;
          default:
              isVoicesofHolocaust = true;
              break;
      }
      //=======================================================
      unitsWithPresentationData = addStudentVisibleAndHiddenDataInUnits(unitsWithPresentationData);
      let finalUnitData = adjustDataForHomePage(currentProductAssignments, unitsWithPresentationData, chapters, lessons, isVoicesofHolocaust, dropdownType);
      let assignementsToupdate = [];
      let studentVisibleAssignements = _.uniqBy(getUniqueStudentVisibleAssingments({
          data: finalUnitData,
          dropdownType: dropdownType
      }), 'id');
      _console("_____________________________________________________________")
      _console('studentVisibleAssignements count ', studentVisibleAssignements.length);
      _console("_____________________________________________________________")
      studentVisibleAssignements = _.forEach(studentVisibleAssignements, function(value) {
          let _data = getRequiredFieldsFromAssignmentToSave(value, ['presentation_data', 'aid'], true);
          _data && assignementsToupdate.push(_data);
      });
      let studentHiddenAssignements = _.xorBy(currentProductAssignments, studentVisibleAssignements, 'id');
      studentHiddenAssignements = _.forEach(studentHiddenAssignements, function(value) {
          let _data = getRequiredFieldsFromAssignmentToSave(value, ['presentation_data', 'aid']);
          _data && assignementsToupdate.push(_data);
      });
      _console("_____________________________________________________________")
      _console("assignementsToupdate ::::::::::", assignementsToupdate);
      _console("_____________________________________________________________")
      let assingmentChunksToModifyAssignments = _.chunk(assignementsToupdate, 50);
      for (let i = 0; i < assingmentChunksToModifyAssignments.length; i++) {
          await modifyAssignmentDataInBulk(assingmentChunksToModifyAssignments[i], i, applicationType)
      };
      _console("data", automationData);
      let updateResourcesObj;
      if (automationData.length > 0) {
          updateResourcesObj = await updateResources(automationData, unitSaved,applicationType);
      }
      //let jsonValidatorWebhook = await updateJsonValidator(productInfo);
      //_console("jsonValidatorWebhook = ", jsonValidatorWebhook);
      // ================ Upload Resources data =========================
      //console.log("Upload Successful");
      //=================== Submit button code ================
      //console.log("automation data created");
      //console.log("automationData = ", automationData);
      let uploadSuccess = true;
      let _response2 = {
        jsonErrors: automationObjects.jsonErrors,
          spreadsheetErrors,
          uploadSuccess
      };
      resolve(_response2);
  });
  // here code will process data and will create json
  // AFTER COMPLETION PRMOISE WILL GET RESOLVED
  //resolveCallback(excelObj);
  //rejectCallback("failed");
  //===============================================
}


function _console(...obj) {
    // Please change to true to enable consoles
    var bool = false;  
    if (bool) {
        console.log(...obj);
    }
}

//====================== helper JS functions 

function getPassageDataToSave (data) {
    _console("getPassageDataToSave helper");
    let passsagesDataToReturn = [];
    let { passageTabData, passageIds } = data;
    passageIds = _.map(passageIds.split(','), (id) => { return id.trim() });
    passsagesDataToReturn = _.filter(passageTabData, (passage) => {
      if (passageIds.indexOf(passage[constants.PASSAGE_ID]) !== -1) {
        return passage;
      }
    })
    return passsagesDataToReturn;
  };

function  setPassageIdWithinTOCData (dataPassed) {
    let { resources = [], tocData = {} } = dataPassed;
    let interActiveResourceData = getInteractiveResourceData(resources);
    if (interActiveResourceData && hasIn(interActiveResourceData, constants.PASSAGE_ID)) {
      let passageIdFromTocData = hasIn(tocData, constants.PASSAGE_ID) ? tocData[constants.PASSAGE_ID] : '';
      let passageIdFromInterActiveResourceData = interActiveResourceData[constants.PASSAGE_ID];
      let passageId = passageIdFromTocData;
      if (!includes(passageIdFromTocData, passageIdFromInterActiveResourceData)) {
        passageId = `${passageIdFromTocData !== '' ? `${passageIdFromTocData},` : ''}${passageIdFromInterActiveResourceData}`;
      }
      tocData = {
        ...tocData,
        [constants.PASSAGE_ID]: passageId
      };
    }
    return tocData;
  }

  /*
  function getInteractiveResourceData (resourseDataArray) {
    let dataToReturn = null;
    if (isArray(resourseDataArray)) {
      dataToReturn = find(resourseDataArray, resourseData => isResourceOfTypeInteractiveLessonOrAssessment(resourseData))
    }
    return dataToReturn;
  }
  */

  
  /*
function isArray (data) {
    return data.constructor === Array ? true : false;
  };
  */


  function addStudentVisibleAndHiddenDataInUnits (units) {
    units.forEach(function (element) {
      element['childs'] = [];
      element['unitOpener'] = [];
      element['assessments'] = [];
      element['writingAssignments'] = [];
      var temp = element['presentation_data']
        ? (typeof element['presentation_data'] === 'string' ? (JSON.parse(element['presentation_data'])['resources']) : element['presentation_data']['resources'])
        : {};
      var newPresentationData = {};
      var dataForMappingStudentVisibleAssignment = {};
      var dataForMappingStudentHiddenAssignment = {};
  
      /* -- Create three level data structure for Chapters, Lessons, Sublessons
       *   Push Resource Category at each level
       *   Level 1: Chapters
       *   Level 1: Lessons
       *   Level 1: Sublesson
       */
      Object.keys(temp).forEach(function (key) {
        if (temp[key].constructor === Object) {
          // -- Create level 1
          newPresentationData[key] = {};
          dataForMappingStudentVisibleAssignment[key] = {};
          dataForMappingStudentHiddenAssignment[key] = {};
          Object.keys(temp[key]).forEach(function (key2) {
            // -- Create level 2
            if (temp[key][key2].constructor === Object) {
              newPresentationData[key][key2] = {};
              dataForMappingStudentVisibleAssignment[key][key2] = {};
              dataForMappingStudentHiddenAssignment[key][key2] = {};
              Object.keys(temp[key][key2]).forEach(function (key3) {
                // -- Create level 3
                if (temp[key][key2][key3].constructor === Object) {
                  newPresentationData[key][key2][key3] = {};
                  dataForMappingStudentVisibleAssignment[key][key2][key3] = {};
                  dataForMappingStudentHiddenAssignment[key][key2][key3] = {};
                } else if (temp[key][key2][key3].constructor === Array) {
                  /*
                   * Push Resources at level 3
                   */
                  temp[key][key2][key3].forEach(function (
                    element,
                    index
                  ) {
                    if (
                      !newPresentationData[key][key2].hasOwnProperty(
                        element['Resource Category']
                      )
                    ) {
                      if (element['Resource Category']) {
                        newPresentationData[key][key2][
                          element['Resource Category']
                        ] = [];
                      } else {
                        newPresentationData[key][key2]['toc'] = [];
                      }
                    }
                    if (
                      !dataForMappingStudentVisibleAssignment[key][
                        key2
                      ].hasOwnProperty(element['Resource Category'])
                    ) {
                      if (element['Resource Category']) {
                        dataForMappingStudentVisibleAssignment[key][key2][
                          element['Resource Category']
                        ] = [];
                      }
                    }
  
                    if (
                      !dataForMappingStudentHiddenAssignment[key][
                        key2
                      ].hasOwnProperty(element['Resource Category'])
                    ) {
                      if (element['Resource Category']) {
                        dataForMappingStudentHiddenAssignment[key][key2][
                          element['Resource Category']
                        ] = [];
                      }
                    }
  
                    if (
                      element['Resource Category'] &&
                      element['Visible Student'] &&
                      element['Format'] &&
                      (element['Format'] === 'Interactive Lesson' ||
                        element['Format'] === 'Assessment' ||
                        element['Format'] === 'Writing')
                    ) {
                      let vFlag = element['Visible Student'];
                      switch (
                      vFlag &&
                      vFlag.match(constants.TRUE_VALUES_REGEX) &&
                      vFlag.match(constants.TRUE_VALUES_REGEX).length > 0
                      ) {
                        case true:
                          dataForMappingStudentVisibleAssignment[key][key2][
                            element['Resource Category']
                          ].push(JSON.parse(JSON.stringify(element)));
                          break;
                      }
  
                      switch (
                      vFlag &&
                      vFlag.match(constants.FALSE_VALUES_REGEX) &&
                      vFlag.match(constants.FALSE_VALUES_REGEX).length > 0
                      ) {
                        case true:
                          dataForMappingStudentHiddenAssignment[key][key2][
                            element['Resource Category']
                          ].push(JSON.parse(JSON.stringify(element)));
                          break;
                      }
                    }
  
                    if (element['Resource Category']) {
                      newPresentationData[key][key2][
                        element['Resource Category']
                      ].push(JSON.parse(JSON.stringify(element)));
                    } else {
                      newPresentationData[key][key2]['toc'].push(
                        JSON.parse(JSON.stringify(element))
                      );
                    }
                  });
                }
              });
            } else if (temp[key][key2].constructor === Array) {
              /*
               * Push Resources at level 2
               */
              temp[key][key2].forEach(function (element, index) {
                if (
                  !newPresentationData[key].hasOwnProperty(
                    element['Resource Category']
                  )
                ) {
                  if (element['Resource Category']) {
                    newPresentationData[key][element['Resource Category']] = [];
                  } else if (
                    key2 === 'passage' &&
                    !newPresentationData[key].hasOwnProperty('passage')
                  ) {
                    newPresentationData[key]['passage'] = [];
                  } else if (
                    key2 === 'toc' &&
                    !newPresentationData[key].hasOwnProperty('toc')
                  ) {
                    newPresentationData[key]['toc'] = [];
                  }
                }
  
                if (
                  !dataForMappingStudentVisibleAssignment[key].hasOwnProperty(
                    element['Resource Category']
                  )
                ) {
                  if (element['Resource Category']) {
                    dataForMappingStudentVisibleAssignment[key][
                      element['Resource Category']
                    ] = [];
                  }
                }
  
                if (
                  !dataForMappingStudentHiddenAssignment[key].hasOwnProperty(
                    element['Resource Category']
                  )
                ) {
                  if (element['Resource Category']) {
                    dataForMappingStudentHiddenAssignment[key][
                      element['Resource Category']
                    ] = [];
                  }
                }
                if (
                  element['Resource Category'] &&
                  element['Visible Student'] &&
                  element['Format'] &&
                  (element['Format'] === 'Interactive Lesson' ||
                    element['Format'] === 'Assessment' ||
                    element['Format'] === 'Writing')
                ) {
                  let vFlag = element['Visible Student'];
  
                  switch (
                  vFlag &&
                  vFlag.match(constants.TRUE_VALUES_REGEX) &&
                  vFlag.match(constants.TRUE_VALUES_REGEX).length > 0
                  ) {
                    case true:
                      dataForMappingStudentVisibleAssignment[key][
                        element['Resource Category']
                      ].push(JSON.parse(JSON.stringify(element)));
                      break;
                  }
  
                  switch (
                  vFlag &&
                  vFlag.match(constants.FALSE_VALUES_REGEX) &&
                  vFlag.match(constants.FALSE_VALUES_REGEX).length > 0
                  ) {
                    case true:
                      dataForMappingStudentHiddenAssignment[key][
                        element['Resource Category']
                      ].push(JSON.parse(JSON.stringify(element)));
                      break;
                  }
                }
  
                if (element['Resource Category']) {
                  newPresentationData[key][element['Resource Category']].push(
                    JSON.parse(JSON.stringify(element))
                  );
                } else if (key2 === 'passage') {
                  newPresentationData[key]['passage'].push(
                    JSON.parse(JSON.stringify(element))
                  );
                } else {
                  newPresentationData[key]['toc'].push(
                    JSON.parse(JSON.stringify(element))
                  );
                }
              });
            }
          });
        } else if (temp[key].constructor === Array) {
          /*
           * Push Resources at level 1
           */
          temp[key].forEach(function (element, index) {
            if (
              !newPresentationData.hasOwnProperty(element['Resource Category'])
            ) {
              if (element['Resource Category']) {
                newPresentationData[element['Resource Category']] = [];
              }
            }
            if (!newPresentationData.hasOwnProperty('toc')) {
              newPresentationData['toc'] = [];
            }
            if (!newPresentationData.hasOwnProperty('passage')) {
              newPresentationData['passage'] = [];
            }
            if (
              !dataForMappingStudentVisibleAssignment.hasOwnProperty(
                element['Resource Category']
              )
            ) {
              if (element['Resource Category']) {
                dataForMappingStudentVisibleAssignment[
                  element['Resource Category']
                ] = [];
              }
            }
  
            if (
              !dataForMappingStudentHiddenAssignment.hasOwnProperty(
                element['Resource Category']
              )
            ) {
              if (element['Resource Category']) {
                dataForMappingStudentHiddenAssignment[
                  element['Resource Category']
                ] = [];
              }
            }
  
            if (
              element['Resource Category'] &&
              element['Visible Student'] &&
              element['Format'] &&
              (element['Format'] === 'Interactive Lesson' ||
                element['Format'] === 'Assessment' ||
                element['Format'] === 'Writing')
            ) {
              let vFlag = element['Visible Student'];
  
              switch (
              vFlag &&
              vFlag.match(constants.TRUE_VALUES_REGEX) &&
              vFlag.match(constants.TRUE_VALUES_REGEX).length > 0
              ) {
                case true:
                  dataForMappingStudentVisibleAssignment[
                    element['Resource Category']
                  ].push(JSON.parse(JSON.stringify(element)));
                  break;
              }
  
              switch (
              vFlag &&
              vFlag.match(constants.FALSE_VALUES_REGEX) &&
              vFlag.match(constants.FALSE_VALUES_REGEX).length > 0
              ) {
                case true:
                  dataForMappingStudentHiddenAssignment[
                    element['Resource Category']
                  ].push(JSON.parse(JSON.stringify(element)));
                  break;
              }
            }
  
            if (element['Resource Category']) {
              newPresentationData[element['Resource Category']].push(
                JSON.parse(JSON.stringify(element))
              );
            } else if (key === 'passage') {
              newPresentationData['passage'].push(
                JSON.parse(JSON.stringify(element))
              );
            } else {
              newPresentationData['toc'].push(
                JSON.parse(JSON.stringify(element))
              );
            }
          });
        }
      });
  
      element['newPresentationData'] = JSON.parse(
        JSON.stringify(newPresentationData)
      );
  
      element['dataForMappingStudentVisibleAssignment'] = JSON.parse(
        JSON.stringify(dataForMappingStudentVisibleAssignment)
      );
  
      element['dataForMappingStudentHiddenAssignment'] = JSON.parse(
        JSON.stringify(dataForMappingStudentHiddenAssignment)
      );
  
      element['presentation_data'] = element['presentation_data']
        ? (typeof element['presentation_data'] === 'string' ? JSON.parse(element['presentation_data']) : element['presentation_data'])
        : {};
    });
    return units;
  };

  function getDataForDropdown(
    data,
    isVoicesOfHolocaust = false
  ) {
    let newData = {};
    Object.keys(data).forEach((key) => {
      newData[key] = data[key];
      switch (key) {
        case 'newPresentationData':
          if (key === 'newPresentationData') {
            Object.keys(data[key]).forEach((key2) => {
              switch (key2) {
                case 'toc':
                  newData.sortOrder = data[key][key2][0]['Display Order'];
                  newData.displayName = data[key][key2][0]['Unit (Parent)'];
                  break;
                case 'passage':
                case 'UnitReview':
                  break;
  
                default:
                  let newChapterData = {};
                  newChapterData = getChapterDataForDropdown(data, key2);
                  Object.keys(data[key][key2]).forEach((key3) => {
                    switch (key3) {
                      case 'toc':
                        newChapterData.sortOrder =
                          data[key][key2][key3][0]['Display Order'];
                        newChapterData.displayName =
                          data[key][key2][key3][0]['Lesson (Child)'];
                        break;
                      case 'passage':
                        break;
  
                      default:
                        if (!isVoicesOfHolocaust) {
                          let newLessonData = {};
                          newLessonData = getLessonDataForDropdown(
                            data,
                            key2,
                            key3
                          );
                          Object.keys(data[key][key2][key3]).forEach(
                            (key4) => {
                              switch (key4) {
                                case 'toc':
                                  if (
                                    !data[key][key2][key3][key4].hasOwnProperty(
                                      '0'
                                    )
                                  ) {
                                  }
                                  newLessonData.sortOrder =
                                    data[key][key2][key3][key4][0][
                                    'Display Order'
                                    ];
                                  newLessonData.displayName =
                                    data[key][key2][key3][key4][0][
                                    'Sub-Lesson (Sibling)'
                                    ];
                                  break;
                                default:
                                  break;
                              }
                            }
                          );
  
                          if (JSON.stringify(newLessonData) !== '{}') {
                            if (
                              !newChapterData.hasOwnProperty('childsDropdown')
                            ) {
                              newChapterData.childsDropdown = [];
                            }
                            newChapterData.childsDropdown.push(newLessonData);
                          }
                        }
                        break;
                    }
                  });
                  if (JSON.stringify(newChapterData) !== '{}') {
                    if (!newData.hasOwnProperty('childsDropdown')) {
                      newData.childsDropdown = [];
                    }
                    newData.childsDropdown.push(newChapterData);
                  }
                  break;
              }
            });
          }
          break;
        default:
          break;
      }
    });
  
    return newData;
  }

  function getChapterDataForDropdown(unitdata, chapterName) {
    let newChapterData = {};
    unitdata.childs.forEach((element) => {
      if (element.hasOwnProperty('title')) {
        var regExp1 = new RegExp(chapterName, 'i');
        var regExp2 = new RegExp(element.title.split(':')[0].trim(), 'i');
        if (element.title.match(regExp1) && chapterName.match(regExp2)) {
          Object.keys(element).forEach((key) => {
            switch (key) {
              default:
                newChapterData[key] = element[key];
                break;
            }
          });
        }
      }
    });
    return newChapterData;
  }
  
  function getLessonDataForDropdown(
    unitdata,
    chapterName,
    lessonName
  ) {
    let newLessonData = {};
    unitdata.childs.forEach((element) => {
      if (element.hasOwnProperty('title') && element.title.match(chapterName)) {
        let lessonElementResult = element.childs.find(
          (_element, lessonDataIndex) => {
            let _title = _element.title
              .split(':')
            [_element.title.split(':').length - 1].trim();
            let lessonKey = _.findKey(
              constants.LESSON_NAMES_MAPPPING_CONSTANT,
              _title
            );
            if (lessonKey) {
              _title = constants.LESSON_NAMES_MAPPPING_CONSTANT[lessonKey][_title];
            }
            if (
              _title === lessonName
              || _element.title === lessonName
            ) {
              return true;
            }
          }
        );
        if (lessonElementResult) {
          Object.keys(lessonElementResult).forEach((key) => {
            switch (key) {
              default:
                newLessonData[key] = lessonElementResult[key];
                break;
            }
          });
        }
      }
    });
  
    return newLessonData;
  }

  function getSortedUnitData(unitdata) {
    unitdata.forEach((element) => {
      if (element.hasOwnProperty('childs')) {
        element.childs.forEach((_element) => {
          if (_element.hasOwnProperty('childs')) {
            _element.childs = getSortedData(_element.childs, 'sortOrder');
          }
        });
        element.childs = getSortedData(element.childs, 'sortOrder');
      }
    });
  
    unitdata = getSortedData(unitdata, 'sortOrder');
    return unitdata;
  }

  function getSortedData (data, string) {
    if (string !== '') {
      let _string = string.split('.');
      data.sort(function (a, b) {
        let returnData;
        switch (_string.length) {
          case 1:
            returnData = a[string] - b[string];
            break;
          case 2:
            returnData = a[_string[0]][_string[1]] - b[_string[0]][_string[1]];
            break;
  
          case 3:
            returnData =
              a[_string[0]][_string[1]][_string[2]] -
              b[_string[0]][_string[1]][_string[2]];
            break;
  
          case 4:
            returnData =
              a[_string[0]][_string[1]][_string[2]][_string[3]] -
              b[_string[0]][_string[1]][_string[2]][_string[3]];
            break;
  
          default:
            break;
        }
        return returnData;
      });
    }
    return data;
  };


  function returnIndexOfChild (inputData) {
    let { data, string, dropdownType = 0, tileData = {} } = inputData;
    let index = -1;
    switch (dropdownType) {
      case constants.DROPDOWN_TYPES.THREE:
        let _chatperName = tileData[constants.RESOURCE_CLASSIFICATION];
        let _lessonName = tileData[constants.RESOURCE_TITLE];
        if (tileData.hasOwnProperty(constants.OBJECT_EDITOR_CHAPTER_NAME)) {
          _chatperName = tileData[constants.OBJECT_EDITOR_CHAPTER_NAME];
        }
        // use find method from lodash to check the first matching element in case of Lesson 1.1 and lesson 1.10 both are present.
        _.find(data, function (dataElement, ind) {
          if (dataElement.hasOwnProperty('type') && dataElement.hasOwnProperty('title')) {
            switch (dataElement.type) {
              case constants.TYPES.chapter:
                if (dataElement.title.includes(_chatperName)) {
                  return index = ind;
                }
                break;
  
              case constants.TYPES.lesson:
                if (dataElement.title.includes(_lessonName)) {
                  return index = ind;
                }
                break;
  
              default:
                break;
            }
          }
        });
  
        break;
  
      default:
        let type;
        data.forEach(function (element, ind) {
          if (hasIn(element, 'type')) {
            type = element.type;
          }
          if (element.displayName === string) {
            index = ind;
          }
        });
        if (
          index === -1 &&
          type &&
          type === 'chapter' &&
          tileData &&
          hasIn(tileData, 'Lesson / Sub-Lesson')
        ) {
          let lessonSubLesonValue = tileData['Lesson / Sub-Lesson'];
          if (trim(lessonSubLesonValue) !== '') {
            data.forEach(function (element, ind) {
              if (element.title === string) {
                index = ind;
              }
            });
          }
        }
        break;
    }
    return index;
  };


  function isString (data) {
    return data.constructor === String ? true : false;
  };

  function adjustDataForHomePage (
    connAssgnNameMap = [],
    unitData,
    chapterData,
    lessonDataResponse,
    isVoicesOfHolocaust = false,
    dropdownType = 0
  ) {
    let unitAssingments = {};
    let unitAssessments = {};
    let chapterAssessments = {};
    let unitDataWithDropdown = [];
    let writingAssingments = {};
    unitData.forEach(function (element) {
      unitAssingments[element.id] = [];
      unitAssessments[element.id] = [];
      writingAssingments[element.id] = [];
    });
  
    chapterData.forEach(function (element) {
      chapterAssessments[element.id] = [];
    });
    connAssgnNameMap.forEach(function (elem) {
      if (elem.hasOwnProperty('presentation_data')) {
        if (isString(elem.presentation_data)) {
          elem.presentation_data = JSON.parse(elem.presentation_data);
        }
      }
      let __passageList = [];
  
      if (elem.hasOwnProperty('problems') && elem.problems.length > 0) {
        elem.problems.forEach(function (element) {
          if (element.passage_ids && element.passage_ids.length > 0) {
            element.passage_ids.forEach(function (_element) {
              if (__passageList.indexOf(_element) === -1) {
                __passageList.push(_element);
              }
            });
          }
        });
      }
  
      lessonDataResponse.forEach(function (element) {
        if (
          elem.hasOwnProperty('lessons') &&
          elem.lessons.length > 0 &&
          elem.lessons[0].lessonId === element.id
        ) {
          if (!element.hasOwnProperty('childs')) {
            element['childs'] = [];
          }
          element['childs'].push(elem);
        }
      });
      Object.keys(unitAssingments).forEach(function (key) {
        if (elem.lessons.length > 0 && elem.lessons[0].lessonId === key) {
          if (
            (elem.presentation_data &&
              elem.presentation_data.hasOwnProperty('writing')) ||
            (elem.instance_presentation_data &&
              elem.instance_presentation_data.hasOwnProperty('writing'))
          ) {
            writingAssingments[key].push(elem);
          } else if (
            (elem.presentation_data &&
              elem.presentation_data.hasOwnProperty('assessment_type')) ||
            (elem.instance_presentation_data &&
              elem.instance_presentation_data.hasOwnProperty('assessment_type'))
          ) {
            unitAssessments[key].push(elem);
          } else if (
            (elem.presentation_data &&
              elem.presentation_data.hasOwnProperty('type')) ||
            (elem.instance_presentation_data &&
              elem.instance_presentation_data.hasOwnProperty('type'))
          ) {
            unitAssingments[key].push(elem);
          }
        }
      });
      Object.keys(chapterAssessments).forEach(function (key) {
        if (elem.lessons.length > 0 && elem.lessons[0].lessonId === key) {
          if (
            (elem.presentation_data &&
              elem.presentation_data.hasOwnProperty('assessment_type')) ||
            (elem.instance_presentation_data &&
              elem.instance_presentation_data.hasOwnProperty('assessment_type'))
          ) {
            chapterAssessments[key].push(elem);
          }
        }
      });
    });
  
    Object.keys(unitAssingments).forEach(function (key) {
      while (unitAssingments[key].length > 1) {
        unitAssingments[key].pop();
      }
    });
  
    chapterData.forEach(function (outerElement) {
      Object.keys(chapterAssessments).forEach((key) => {
        if (outerElement.id === key) {
          chapterAssessments[key].forEach(function (inneElement) {
            if (!outerElement.hasOwnProperty('assessments')) {
              outerElement.assessments = [];
            }
            outerElement.assessments.push(inneElement);
          });
        }
      });
    });
  
    lessonDataResponse.forEach(function (elem) {
      chapterData.forEach(function (element) {
        if (!element.hasOwnProperty('childs')) {
          element['childs'] = [];
        }
        if (!element.hasOwnProperty('extensions')) {
          element['extensions'] = [];
        }
        if (elem.parents[0].parentId === element.id) {
          if (
            elem.title.toLowerCase().match(/project-based/g) ||
            elem.title.toLowerCase().match(/project/g) ||
            elem.title.toLowerCase().match(/on your own/g)
          ) {
            element['extensions'].push(elem);
          } else {
            element['childs'].push(elem);
          }
        }
      });
    });
  
    chapterData.forEach(function (elem) {
      unitData.forEach(function (element) {
        if (elem.parents[0].parentId === element.id) {
          if (!element.hasOwnProperty('childs')) {
            element['childs'] = [];
          }
          element['childs'].push(elem);
        }
      });
    });
    var unitIdValues = [];
    unitData.sort(function (a, b) {
      return +a.title.split(' ')[1] - +b.title.split(' ')[1];
    });
  
    unitData.forEach(function (element) {
      Object.keys(unitAssingments).forEach(function (key) {
        if (element.id === key) {
          unitAssingments[key].forEach(function (elem) {
            unitIdValues.push(element.id);
            elem['isUnit'] = true;
            elem.selectedUnitName = element.title;
            element['childs'].unshift(elem);
            element['unitOpener'].unshift(elem);
            element['childs'].push({ isUnitReview: true, id: '' });
          });
          unitAssessments[key].forEach(function (element1) {
            element['assessments'].push(element1);
            element1.selectedUnitName = element.title;
            element1.title = element.title;
          });
          writingAssingments[key].forEach(function (element2) {
            element['writingAssignments'].push(element2);
          });
        }
      });
  
      unitDataWithDropdown.push(getDataForDropdown(element, isVoicesOfHolocaust));
    });
    _console("unitDataWithDropdown helper", unitDataWithDropdown)
    unitDataWithDropdown = getSortedUnitData(unitDataWithDropdown);
  
    unitData.forEach(function (element) {
      if (unitIdValues.indexOf(element.id) === -1) {
        element['childs'].unshift({ isUnit: true, id: '' });
        element['childs'].push({ isUnitReview: true, id: '' });
      }
    });
  
    return unitDataWithDropdown;
  };

  function getUniqueStudentVisibleAssingments (
    inputData
  ) {
    let { data, dropdownType } = inputData;
    _console('data', cloneDeep(data));
    let Assignments = [];
    data.forEach(function (element) {
      if (isObject(element) && element.dataForMappingStudentVisibleAssignment) {
        let _dFMSVAssignment = JSON.parse(
          JSON.stringify(element['dataForMappingStudentVisibleAssignment'])
        );
        if (isObject(_dFMSVAssignment)) {
          Object.keys(_dFMSVAssignment).forEach(function (key1) {
            let _dFMSVAssignmentKey1 = _dFMSVAssignment[key1];
            if (isObject(_dFMSVAssignmentKey1)) {
              Object.keys(_dFMSVAssignmentKey1).forEach(function (key2) {
                let _dFMSVAssignmentKey1Key2 = _dFMSVAssignmentKey1[key2];
                if (
                  isArray(_dFMSVAssignmentKey1Key2) &&
                  _dFMSVAssignmentKey1Key2.length > 0
                ) {
                  _dFMSVAssignmentKey1Key2.forEach(function (innerElement) {
                    let tempChildIndex;
                    let tempChildIndexL1;
                    let tempChildIndexL2;
                    switch (dropdownType) {
                      case constants.DROPDOWN_TYPES.THREE:
                        //let tempChildIndexL1;
                        //let tempChildIndexL2;
                        tempChildIndexL1 = returnIndexOfChild(
                          { data: JSON.parse(JSON.stringify(element.childs)), string: key1, dropdownType: dropdownType, tileData: innerElement }
                        );
                        if (tempChildIndexL1 !== -1) {
                          tempChildIndexL2 = returnIndexOfChild(
                            {
                              data: JSON.parse(
                                JSON.stringify(
                                  element.childs[tempChildIndexL1]
                                    .childs
                                )
                              ),
                              string: key2,
                              dropdownType: dropdownType,
                              tileData: innerElement
                            }
                          );
                          if (tempChildIndexL2 !== -1) {
                            switch (innerElement['Format']) {
                              case 'Interactive Lesson':
                                let lessonData = _.cloneDeep(element.childs[tempChildIndexL1].childs[tempChildIndexL2]);
                                if (lessonData.hasOwnProperty("childs")) {
                                  _.forEach(lessonData.childs, (assignment) => {
                                    Assignments.push(assignment);
                                  })
                                }
                                break;
                            }
                          }
  
                        }
                        break;
  
                      default:
                        if (innerElement && innerElement['Format'] === 'Interactive Lesson' && innerElement['Resource Classification'] === 'Unit Opener' && element.childs) {
                           /* if (element.childs[0] && element.childs[0].hasOwnProperty('productID') && element.childs[0].hasOwnProperty('id') && element.childs[0].productID !== '' && element.childs[0].id !== '') {
                            Assignments.push(cloneDeep(element.childs[0]));
                          } */
                          /**
                           * Previously below mentioned if statement was present in 
                           * above if statement in which we are checking first child 
                           * of unit is an assignment. If it not an assignment then do 
                           * nothing. Now, unit opener assignment not linked directly 
                           * to unit and has its own lesson we have moved below mentioned 
                           * if outside above if statement which is now commented.
                           */
                          if (element && element.childsDropdown && element.childsDropdown.length) {
                            tempChildIndexL1 = returnIndexOfChild(
                              { data: JSON.parse(JSON.stringify(element.childsDropdown)), string: key1 }
                            );
                            if (tempChildIndexL1 !== -1 && element.childsDropdown[tempChildIndexL1] && element.childsDropdown[tempChildIndexL1].childs && element.childsDropdown[tempChildIndexL1].childs.length) {
                              tempChildIndexL2 = returnIndexOfChild(
                                {
                                  data: JSON.parse(
                                    JSON.stringify(
                                      element.childsDropdown[tempChildIndexL1]
                                        .childs
                                    )
                                  ),
                                  string: innerElement['Resource Title'],
                                  dropdownType: 3,
                                  tileData: innerElement
                                }
                              );
                              if (tempChildIndexL2 !== -1 && element.childsDropdown[tempChildIndexL1].childs[tempChildIndexL2]) {
                                let currentlesson = element.childsDropdown[tempChildIndexL1].childs[tempChildIndexL2] || {};
                                if (currentlesson && hasIn(currentlesson, 'id') && hasIn(currentlesson, 'childs') && currentlesson.childs.length) {
                                  currentlesson.childs.forEach(function (
                                    childelement2
                                  ) {
                                    Assignments.push(
                                      JSON.parse(
                                        JSON.stringify(childelement2)
                                      )
                                    );
                                  });
                                }
                              }
                            }
                          }
                        } else if (element && element.childsDropdown) {
                          tempChildIndex = returnIndexOfChild(
                            { data: JSON.parse(JSON.stringify(element.childsDropdown)), string: key1, dropdownType: dropdownType, tileData: innerElement }
                          );
                          switch (innerElement['Format']) {
                            case 'Interactive Lesson':
                              switch (tempChildIndex) {
                                case 0:
                                  if (
                                    element.childsDropdown[tempChildIndex] &&
                                    element.childsDropdown[
                                      tempChildIndex
                                    ].hasOwnProperty('id') &&
                                    !element.childsDropdown[
                                      tempChildIndex
                                    ].hasOwnProperty('type')
                                  ) {
                                    Assignments.push(
                                      JSON.parse(
                                        JSON.stringify(
                                          element.childsDropdown[tempChildIndex]
                                        )
                                      )
                                    );
                                  } else if (
                                    element.childsDropdown[tempChildIndex] &&
                                    element.childsDropdown[tempChildIndex].hasOwnProperty('childs')
                                  ) {
                                    element.childsDropdown[
                                      tempChildIndex
                                    ].childs.forEach(function (innerElement2) {
                                      let re = new RegExp(
                                        innerElement['Resource Title'],
                                        'g'
                                      );
                                      if (
                                        innerElement2.title &&
                                        innerElement2.title.match(re) &&
                                        innerElement2.childs
                                      ) {
                                        innerElement2.childs.forEach(function (
                                          childelement2
                                        ) {
                                          Assignments.push(
                                            JSON.parse(JSON.stringify(childelement2))
                                          );
                                        });
                                      }
                                    });
                                  } else if (
                                    element.childs[tempChildIndex] &&
                                    element.childs[tempChildIndex].hasOwnProperty('id') &&
                                    element.childs[tempChildIndex].id !== ''
                                  ) {
                                    Assignments.push(
                                      JSON.parse(
                                        JSON.stringify(element.childs[tempChildIndex])
                                      )
                                    );
                                  }
                                  break;
                                case -1:
                                  break;
                                default:
                                    // Checking if element has data in childs or in extensions and if both properties are present, then also checking the length
                                    let currentElemProperties;
                                    if (
                                      element.childsDropdown[tempChildIndex].hasOwnProperty('childs') && element.childsDropdown[tempChildIndex].childs.length > 0
                                    ) {
                                      currentElemProperties = element.childsDropdown[tempChildIndex].childs
                                    } else if(element.childsDropdown[tempChildIndex].hasOwnProperty('extensions') && element.childsDropdown[tempChildIndex].extensions.length > 0){
                                      currentElemProperties = element.childsDropdown[tempChildIndex].extensions
                                    } else {
                                    }
                                    if (currentElemProperties) {
                                      currentElemProperties.forEach(function (innerElement2) {
                                        // Added escapeRegExp function because normal RegExp unable detect special characters like (?) question mark
                                        function escapeRegExp(string){
                                          return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                                        }
                                        let re = new RegExp(
                                          "(?:^|\\W)(" + escapeRegExp(innerElement['Resource Title']) + ")(?!\\w)",
                                          'g'
                                        );
                                        if (
                                          innerElement2.title &&
                                          innerElement2.title.match(re) &&
                                          innerElement2.childs
                                        ) {
                                          innerElement2.childs.forEach(function (
                                            childelement2
                                          ) {
                                            Assignments.push(
                                              JSON.parse(JSON.stringify(childelement2))
                                            );
                                          });
                                        }
                                      });
                                    }
                                  break;
                              }
                              break;
                            case 'Assessment':
                              switch (tempChildIndex) {
                                case 6:
                                  element.assessments.forEach(function (
                                    assessement
                                  ) {
                                    if (
                                      assessement.presentation_data.assessment_type.match(
                                        new RegExp(
                                          innerElement['Resource Classification'],
                                          'g'
                                        )
                                      )
                                    ) {
                                      Assignments.push(
                                        JSON.parse(JSON.stringify(assessement))
                                      );
                                    }
                                  });
                                  break;
                                case 0:
                                  Assignments.push(
                                    JSON.parse(
                                      JSON.stringify(
                                        element.childsDropdown[tempChildIndex]
                                      )
                                    )
                                  );
                                  break;
                                default:
                                  break;
                              }
                              break;
                            case 'Writing':
                              switch (tempChildIndex) {
                                default:
                                  element.writingAssignments.forEach(function (
                                    assessement
                                  ) {
                                    Assignments.push(
                                      JSON.parse(JSON.stringify(assessement))
                                    );
                                  });
                                  break;
                              }
                              break;
                          }
                        } else if (element && element.childs && element.childs.length && innerElement['Resource Title']) {
                          // Added for Vocab - Getting Started 
                          tempChildIndexL1 = returnIndexOfChild(
                            { data: JSON.parse(JSON.stringify(element.childs)), string: innerElement['Resource Title'], dropdownType: 3, tileData: innerElement }
                          );
                          if (tempChildIndexL1 !== -1 && element.childs[tempChildIndexL1] && element.childs[tempChildIndexL1].childs && element.childs[tempChildIndexL1].childs.length) {
                            tempChildIndexL2 = returnIndexOfChild(
                              {
                                data: JSON.parse(
                                  JSON.stringify(
                                    element.childs[tempChildIndexL1]
                                      .childs
                                  )
                                ),
                                string: innerElement['Resource Title'],
                                dropdownType: 3,
                                tileData: innerElement
                              }
                            );
                            if (tempChildIndexL2 !== -1 && element.childs[tempChildIndexL1].childs[tempChildIndexL2]) {
                              let currentlesson = element.childs[tempChildIndexL1].childs[tempChildIndexL2] || {};
                              if (currentlesson && hasIn(currentlesson, 'id') && hasIn(currentlesson, 'childs') && currentlesson.childs.length) {
                                currentlesson.childs.forEach(function (
                                  childelement2
                                ) {
                                  Assignments.push(
                                    JSON.parse(
                                      JSON.stringify(childelement2)
                                    )
                                  );
                                });
                              }
                            }
                          }
                        }
                        break;
                    }
                  });
                } else if (isObject(_dFMSVAssignmentKey1Key2)) {
                  Object.keys(_dFMSVAssignmentKey1Key2).forEach(function (
                    key3
                  ) {
                    let _dFMSVAssignmentKey1Key2Key3 =
                      _dFMSVAssignmentKey1Key2[key3];
                    if (
                      isArray(_dFMSVAssignmentKey1Key2Key3) &&
                      _dFMSVAssignmentKey1Key2Key3.length > 0
                    ) {
                      _dFMSVAssignmentKey1Key2Key3.forEach(function (
                        innerElement
                      ) {
                        let tempChildIndexL1;
                        let tempChildIndexL2;
                        switch (dropdownType) {
                          case constants.DROPDOWN_TYPES.THREE:
                            break;
  
                          default:
                            tempChildIndexL1 = returnIndexOfChild(
                              { data: JSON.parse(JSON.stringify(element.childsDropdown)), string: key1, dropdownType: dropdownType, tileData: innerElement }
                            );
                            tempChildIndexL2 = returnIndexOfChild(
                              {
                                data: JSON.parse(
                                  JSON.stringify(
                                    element.childsDropdown[tempChildIndexL1]
                                      .childsDropdown
                                  )
                                ),
                                string: key2,
                                dropdownType: dropdownType,
                                tileData: innerElement
                              }
                            );
                            switch (innerElement['Format']) {
                              case 'Assessment':
                                let isAssessmentFound = false;
                                element.childsDropdown[tempChildIndexL1]
                                  .assessments &&
                                  element.childsDropdown[
                                    tempChildIndexL1
                                  ].assessments.forEach(function (
                                    childElement
                                  ) {
                                    if (
                                      childElement.presentation_data &&
                                      childElement.presentation_data.assessment_type &&
                                      childElement.presentation_data.assessment_type
                                        .toLowerCase()
                                        .match(
                                          new RegExp(
                                            innerElement[
                                              'Resource Title'
                                            ].toLowerCase(),
                                            'g'
                                          )
                                        )
                                    ) {
                                      isAssessmentFound = true;
                                      Assignments.push(
                                        JSON.parse(
                                          JSON.stringify(childElement)
                                        )
                                      );
                                    }
                                  });
                                if (!isAssessmentFound && element.assessments && element.assessments.length) {
                                  element.assessments.forEach(function (childElement) {
                                    if (!isAssessmentFound && isTileSpecificAssessment(childElement, ['Resource Classification', 'Resource Title'], innerElement)) {
                                      isAssessmentFound = true;
                                      Assignments.push(
                                        JSON.parse(
                                          JSON.stringify(childElement)
                                        )
                                      );
                                    }
                                  });
                                }
                                break;
                              case 'Interactive Lesson':
                                switch (tempChildIndexL2) {
                                  default:
                                    if (element.childsDropdown && element.childsDropdown[tempChildIndexL1] && element.childsDropdown[tempChildIndexL1].extensions && element.childsDropdown[tempChildIndexL1].extensions.length) {
                                      let currentlesson = find(element.childsDropdown[tempChildIndexL1].extensions, (childElement) => {
                                        let _flag = false;
                                        let classification = innerElement['Resource Classification'];
                                        if (childElement.title && lowerCase(childElement.title).match(lowerCase(classification))) {
                                          if (classification === 'Project') {
                                            let index = childElement.title.split(' ').pop();
                                            let projectNumber = innerElement['Resource Prefix'];
                                            if (projectNumber === 'Project ' + index) {
                                              _flag = true;
                                            }
                                          } else {
                                            _flag = true;
                                          }
                                        }
                                        return _flag;
                                      });
                                      if (currentlesson && hasIn(currentlesson, 'id') && hasIn(currentlesson, 'childs') && currentlesson.childs.length) {
  
                                        currentlesson.childs.forEach(function (
                                          childelement2
                                        ) {
                                          Assignments.push(
                                            JSON.parse(
                                              JSON.stringify(childelement2)
                                            )
                                          );
                                        });
                                      } else if (
                                        
                                        tempChildIndexL2 !== -1 &&
                                        element.childsDropdown[tempChildIndexL1] &&
                                        element.childsDropdown[
                                          tempChildIndexL1
                                        ].hasOwnProperty('childsDropdown') &&
                                        element.childsDropdown[
                                          tempChildIndexL1
                                        ].childsDropdown[
                                          tempChildIndexL2
                                        ].hasOwnProperty('childs')
                                      ) {
                                        element.childsDropdown[
                                          tempChildIndexL1
                                        ].childsDropdown[
                                          tempChildIndexL2
                                        ].childs.forEach(function (childElement) {
                                          Assignments.push(
                                            JSON.parse(JSON.stringify(childElement))
                                          );
                                        });
                                      }
                                    } else {
                                      if (
                                        tempChildIndexL2 !== -1 &&
                                        element.childsDropdown[tempChildIndexL1] &&
                                        element.childsDropdown[
                                          tempChildIndexL1
                                        ].hasOwnProperty('childsDropdown') &&
                                        element.childsDropdown[
                                          tempChildIndexL1
                                        ].childsDropdown[
                                          tempChildIndexL2
                                        ].hasOwnProperty('childs')
                                      ) {
                                        element.childsDropdown[
                                          tempChildIndexL1
                                        ].childsDropdown[
                                          tempChildIndexL2
                                        ].childs.forEach(function (childElement) {
                                          Assignments.push(
                                            JSON.parse(JSON.stringify(childElement))
                                          );
                                        });
                                      }
                                    }
                                    break;
                                }
                                break;
                            }
                            break;
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      }
    });
    return Assignments;
  };


  function getRequiredFieldsFromAssignmentToSave  (
    assignment,
    required_fields,
    studentVisible = false
  ) {
    if (assignment === null) {
      return;
    }
    let assignment_data = {};
    assignment_data = getRequiredFieldsFromAssignment(assignment, required_fields)
    // created separate function of below commented code
    // _.forEach(required_fields, function (value, key) {
    //   assignment_data[value] = assignment[constants.FIELDS_MAPPING[value]];
    // });
  
    return addStudentVisibleFlagInAssignment(assignment_data, studentVisible);
  };

  function getRequiredFieldsFromAssignment (
    assignment,
    required_fields
  ) {
    if (assignment === null) {
      return;
    }
    let assignment_data = {};
  
    _.forEach(required_fields, function (value, key) {
      assignment_data[value] = assignment[constants.FIELDS_MAPPING[value]];
    });
  
    return assignment_data;
  };

  function addStudentVisibleFlagInAssignment (
    data,
    studentVisible
  ) {
    if (typeof data.presentation_data === 'string') {
      try {
        data.presentation_data = JSON.parse(data.presentation_data);
      } catch (e) {
        return false
      }
    }
  
    // if (data.presentation_data.hasOwnProperty('assessment_visible') && data.presentation_data.assessment_visible === studentVisible) {
    //   return;
    // }
    data.presentation_data = {
      ...data.presentation_data,
      assessment_visible: studentVisible
    }
    data.presentation_data = JSON.stringify(data.presentation_data);
    return data;
  };


  function removeIdentificationStyles (string) {
    return identifyStyles(string, true);
  } 

  function identifyStyles (string, replaceWithBlankSpace = false) {
    const data = [];
    const innerIdentifyStyles = (str) => {
      const temp = str && str.match(/\#italics\{|\#bold\{|\}/);
      if (temp) {
        switch (temp[0]) {
          case '#italics{':
            str = str.replace(temp[0], replaceWithBlankSpace ? '' : '<i>');
            data.push(temp[0]);
            break;
          case '#bold{':
            str = str.replace(temp[0], replaceWithBlankSpace ? '' : '<b>');
            data.push(temp[0]);
            break;
          case '}':
            if (data.length > 0) {
              switch (data[data.length - 1]) {
                case '#italics{':
                  str = str.replace(temp[0], replaceWithBlankSpace ? '' : '</i>');
                  break;
                case '#bold{':
                  str = str.replace(temp[0], replaceWithBlankSpace ? '' : '</b>');
                  break;
              }
              data.pop();
            } else if (data.length === 0) {
              return str;
            }
            break;
        }
        return innerIdentifyStyles(str);
      }
      const textArray = [
        ',#passage_title by',
        ',#passage_title',
        '(#passage_genre)',
        '#passage_author',
        '#passage_lexile',
      ];
      textArray.forEach((text) => (str = str && str.split(text).join('')));
      return str;
    };
    return innerIdentifyStyles(string);
  };

  //======================================

  function getUniqueLessonKeysWithNames () {
    let dataToReturn = {};
    forEach(LESSON_NAMES_MAPPPING_CONSTANT, (data) => {
      if (isObject(data)) {
        dataToReturn = {
          ...dataToReturn,
          ...data
        }
      }
    })
    return dataToReturn;
  }


//=============================================
//========== src\client\app\templates\excelResource\excelResourceUtils.js ===================

function getLocationInformation (dataPassed = {}) {
    const { dataArray = [], nameForComparison = '', from = '' } = dataPassed;
    let localNameForComparison = nameForComparison;
    const locationInfo = {};
  
    if (dataArray.length && nameForComparison !== '') {
      const matchedData = getMatchedChapterEntity(dataPassed);
  
      if (matchedData) {
        locationInfo[ASSOCIATED_ID] = matchedData.id;
        locationInfo[ASSOCIATED_TYPE] = matchedData.type;
      }
    }
    return locationInfo;
  }

  function getMatchedChapterEntity (dataPassed = {}) {
    const { dataArray = [], nameForComparison = '', from = '' } = dataPassed;
    let localNameForComparison = nameForComparison;
    let matchedData;
    if (dataArray.length && nameForComparison !== '') {
      if (from === 'chapter') {
        matchedData = find(dataArray, (data) => {
          let titleToMatch = data.title;
  
          let flag = false;
          let titleSplit = splitAndTrimString(titleToMatch, ':');
          let localNameForComparisonSplit = splitAndTrimString(localNameForComparison, ':');
  
          if (titleSplit.length > 1 && titleSplit.length === localNameForComparisonSplit.length) {
            flag = isEqual(titleSplit, localNameForComparisonSplit);
          }
          return flag;
        });
      }
      if (!matchedData) {
        matchedData = find(dataArray, (data) => {
          let titleToMatch = data.title;
  
          let flag = false;
          let titleSplit = splitAndTrimString(titleToMatch, ':');
          let localNameForComparisonSplit = splitAndTrimString(removeIdentificationStyles(localNameForComparison), ':');
          switch (from) {
            case 'lesson':
              titleToMatch = last(titleSplit);
              localNameForComparison = last(localNameForComparisonSplit);
              flag = (titleToMatch === localNameForComparison || titleToMatch.includes(localNameForComparison));
              if (!flag) {
                let lessonKeysAndValues = getUniqueLessonKeysWithNames();
                flag = hasIn(lessonKeysAndValues, titleToMatch) && lessonKeysAndValues[titleToMatch] === localNameForComparison;
              }
              break;
            case 'chapter':
              titleToMatch = first(titleSplit);
              localNameForComparison = first(localNameForComparisonSplit);
              flag = titleToMatch === localNameForComparison;
              if (!flag && titleSplit.length === localNameForComparisonSplit.length) {
                flag = isEqual(titleSplit, localNameForComparisonSplit);
              }
              break;
  
            default:
              flag = titleToMatch === localNameForComparison;
              break;
          }
          return flag;
        });
      }
    }
    return matchedData;
  }

  function splitAndTrimString (stringToSplit = '', splitCharacter = '') {
    return map(split(stringToSplit, splitCharacter), ele => trim(ele));
  }

  function getMatchedLesson (dataPassed = {}) {
    const { names = {}, structure = {} } = dataPassed;
    let matchedLesson, matchedChapter, matchedUnit;
    const { units = [], chapters = [], lessons = [], } = structure;
    const { unit = '', chapter = '', lesson = '', } = names
    if (unit !== '' && units.length) {
      matchedUnit = getMatchedChapterEntity({ dataArray: units, nameForComparison: unit });
    }
  
    if (matchedUnit && chapter !== '' && chapters.length) {
      const { id = '' } = matchedUnit;
      const filteredChapters = filter(chapters, chapter => chapter.parents[0].parentId === id);
      matchedChapter = getMatchedChapterEntity({ dataArray: filteredChapters, nameForComparison: chapter, from: 'chapter' });
    }
  
    if (matchedChapter && lesson !== '' && lessons.length) {
      const { id = '' } = matchedChapter;
      const filteredLessons = filter(lessons, lesson => lesson.parents[0].parentId === id);
      matchedLesson = getMatchedChapterEntity({ dataArray: filteredLessons, nameForComparison: lesson, from: 'lesson' });
    }
  
    return matchedLesson;
  }

  function reSubstituteEscapedCommaAfterSplit (string = '') {
    let _string = replace(string, ESCAPED_CHARACTER_SUBSTITUTE_REGEX, COMMA_STRING);
    return _string;
  }

  function substituteEscapedCommaBeforeSplit (string = '') {
    return replace(string, ESCAPED_COMMA_REGEX, ESCAPED_CHARACTER_SUBSTITUTE);
  }

  function updateLocationInfoInNonInteractiveResources (dataPassed = {}) {

    return updateResourcesData(dataPassed);
  }

  function updateResourcesData (dataPassed = {}) {
    let dataPassedKeys = keys(dataPassed);
    forEach(dataPassedKeys, (key) => {
      const keysData = dataPassed[key];
      if (isArray(keysData)) {
        if (key === RESOURCES_KEY) {
          if (keysData.length > 1) {
            let resourceWithLocationData = getInteractiveResourceData(keysData);
            if (resourceWithLocationData) {
              let locationData = hasIn(resourceWithLocationData, LOCATION) ? resourceWithLocationData[LOCATION] : null;
              if (locationData) {
                dataPassed[key] = map(keysData, (resourceData) => {
                  let resourceDataToModify = {
                    ...resourceData,
                  };
                  if (!isResourceOfTypeInteractiveLessonOrAssessment(resourceDataToModify)) {
                    resourceDataToModify = {
                      ...resourceDataToModify,
                      [LOCATION]: locationData
                    }
                  }
                  return resourceDataToModify;
                })
              }
            }
          }
        }
      } else if (isObject(keysData)) {
        if (key !== "name" && key !== "tiles" && key !== "passage" && key !== "EMPTY" && key !== LOCATION) {
          dataPassed[key] = updateResourcesData(keysData);
        }
      }
    });
    return dataPassed;
  }

  function getInteractiveResourceData (resourseDataArray) {
    let dataToReturn = null;
    if (isArray(resourseDataArray)) {
      dataToReturn = find(resourseDataArray, resourseData => isResourceOfTypeInteractiveLessonOrAssessment(resourseData))
    }
    return dataToReturn;
  }

  function isResourceOfTypeInteractiveLessonOrAssessment (resourseData) {
    return hasIn(resourseData, constants.FORMAT) && (isEqual(resourseData[constants.FORMAT], constants.INTERACTIVE_LESSON) || isEqual(resourseData[constants.FORMAT], constants.ASSESSMENT));
  }
  


//==============================================================

function unitSaved() {
  _console("unitSaved");
}
async function updateJsonValidator(productInfo) {
  _console("updateJsonValidator");
  //
  return new Promise((resolve, reject) => {
      //========================================
      /*
        This function updates the server about the spreadsheet uploaded. If product has 5 productCodes, then 5 calls will be send to server. More information can be found in this tickete 
        https://perfectionlearning.sifterapp.com/issues/14887
      */
      //-----------------------------------
      productInfo = productInfo.filter((elm) => {
          return elm["Product Code"] ? elm["Product Code"] : false;
      });
      let _productCodeArr = productInfo.map((elm) => {
          return elm["Product Code"];
      });
      //------------------------------------
      let _promiseArr = [];
      _productCodeArr.forEach((productCode) => {
          _promiseArr.push(new Promise((resolve, reject) => {
              updateJsonValidationWebHook(productCode, resolve);
          }));
      });
      //------------------------------------
      // showLoader();
      Promise.all(_promiseArr).then((values) => {
          //_console("JsonValidatorWebhook Response", values);
          resolve(values);
          //hideLoader();
      });
      //======================================
  });
}

function updateJsonValidationWebHook(productCode, resolve) {
  //=================================
  let _data = {
      "job": "json-validator-pipe",
      "token": "test",
      "PRODUCT": productCode
  };
  fetch('https://pljenkins.com:8443/buildByToken/buildWithParameters?' + new URLSearchParams(_data), {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "no-cors", // no-cors, *cors, same-origin
  }).then((response) => {
      //_console(response);
      response.URLSearchParams = _data;
      resolve(response);
  })
  //=================================
}
async function updateResources(_value, _callback,applicationType) {
  _console("updateResources");
  //https://node.perfectionnext.com:8083/chapters/modify
 // _console("url = ",(app.serverPath + app.paths.modifyChpaterOrLesson));
  return new Promise((resolve, reject) => {
      var settings = {
          "async": true,
          "crossDomain": true,
         // "url": app.serverPath + app.paths.modifyChpaterOrLesson,
          "url": "https://node.perfectionnext.com:8083/chapters/modify",
          "method": "PUT",
          "headers": {
              "Content-Type": "application/json"
          },
          "processData": false,
          "data": JSON.stringify(_value)
      };
      settings.applicationType = applicationType;
      getHttpRequest(settings, function(_data) {
          _console("http request sucess");
         // console.log("sucess data _data = ", _data);
          _callback(_data);
          resolve(_data);
          //hideLoader();
      }, function(error) {
          reject(error)
      });
  });
}

function modifyAssignmentDataInBulk(_data, _index, applicationType) {
  _console("modifyAssignmentDataInBulk");
  //https://node.perfectionnext.com:8083/assigns/bulk/modify
  let api = "https://node.perfectionnext.com:8083/assigns/bulk/modify";
 // console.log("url = ",(app.serverPath + app.paths.modifyAssignmentBulk));
  return new Promise((resolve, reject) => {
      let settings = {
          "async": true,
          "crossDomain": true,
          //"url": app.serverPath + app.paths.modifyAssignmentBulk,
          "url": api,
          "method": "PUT",
          "headers": {
              "Content-Type": "application/json"
          },
          "processData": false,
          "data": JSON.stringify(_data)
      }
      settings.applicationType = applicationType;
      getHttpRequest(settings, function(_resData) {
          resolve(_resData, _index);
      }, function(_status) {
          reject("Error in API call " + api + " with status " + _status);
      });
  });
}
async function deleteOldProductStructureObj(userContentObjects,applicationType) {
  _console("deleteOldProductStructureObj");
  // let { userContentObjects } = this.props;
  let productStructureFileObj = userContentObjects.filter((elm) => {
      return elm.title.indexOf("proStru.json") != -1 ? elm : false
  });
  // This function will delete
  return new Promise((resolve, reject) => {
      //======================================
      let _promiseArr = [];
      productStructureFileObj.forEach((obj) => {
          _promiseArr.push(new Promise((resolveCallback, reject) => {
              deleteFileResourceObj(obj.id, resolveCallback,applicationType);
          }));
      });
      //------------------------------------
      Promise.all(_promiseArr).then((values) => {
          _console("ProductStructure JSON deletedFiles Response", values);
          resolve("done!");
      });
  });
}
//=============================================
function createUserContentObject(data,applicationType) {
  _console("createUserContentObject");
  //https://node.perfectionnext.com:8083/usercontent/create
  //console.log("api path = ",(app.serverPath + app.paths.createUserContentObject));
  return new Promise((resolve, reject) => {
      var settings = {
          async: true,
          crossDomain: true,
         // url: app.serverPath + app.paths.createUserContentObject,
          url: "https://node.perfectionnext.com:8083/usercontent/create",
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          processData: false,
          data: JSON.stringify(data)
      };
      settings.applicationType = applicationType;
      getHttpRequest(settings, function(_data) {
          resolve(_data);
      }, function(error) {
          reject(error);
      });
  });
}

function modifyUserContentObject(data,applicationType) {
  _console("modifyUserContentObject");
  //https://node.perfectionnext.com:8083/usercontent/modify
  //console.log("api path = ",(app.serverPath + app.paths.modifyUserContentObject));
  return new Promise((resolve, reject) => {
      var settings = {
          async: true,
          crossDomain: true,
         // url: app.serverPath + app.paths.modifyUserContentObject,
          url: "https://node.perfectionnext.com:8083/usercontent/modify",
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          processData: false,
          data: JSON.stringify(data)
      };
      settings.applicationType = applicationType;
      getHttpRequest(settings, function(_data) {
          resolve(_data);
      }, function(error) {
          reject(error);
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
 
// axios({
//  method: 'PUT',
//  url: "https://node.perfectionnext.com:8083/usercontent/query",
//  data:data
// }).then(function (response) {
//  console.log(response);
// })
// .catch(function (error) {
//  console.log(error);
// });

  //======================================
};
*/

function getUniqArrValues(arr)
{
    return arr.filter((value, index, array)=>{
        return array.indexOf(value) === index;
    });
}

async function createJSON(data) {
  return new Promise(async function(resolve, reject) {
      // console.log("createJSON ============ ");
      const sheetNamesAndPurpose = {
          'resources': 'Product Resources',
          'toc': 'Program TOC',
          'passage': 'Passages',
          'productInfo': 'Product',
          'programCategories': 'Program Categories',
          'reportsLabels': 'Reports Labels',
          'productLabels': 'Product Labels'
      };
      const xlsxConfig = {
          header: 1,
      };
      let {
          currentProductId,
          userContentObjects,
          currentProductAssignments,
          unitstructure,
          workbook,
          XLSX,
          applicationType
      } = data;
      let automation_data_to_save;
      let type;
      let jsonErrors = [];
      //console.log("currentProductId =", currentProductId);
      let {
          units = [], chapters = [], lessons = []
      } = unitstructure;
      let resources, toc, passage, productInfo, programCategories, reportsLabels, productLabels = {};
      let tocHeading, passageHeading, resourcesHeading, productInfoHeading, programCategoriesHeading, reportsLabelsHeading, productLabelsHeading = []
      if (workbook.Sheets.hasOwnProperty(sheetNamesAndPurpose.resources) && workbook.Sheets.hasOwnProperty(sheetNamesAndPurpose.toc) && workbook.Sheets.hasOwnProperty(sheetNamesAndPurpose.passage) && workbook.Sheets.hasOwnProperty(sheetNamesAndPurpose.productInfo) && workbook.Sheets.hasOwnProperty(sheetNamesAndPurpose.programCategories)) {
          resources = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNamesAndPurpose.resources]);
          resourcesHeading = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNamesAndPurpose.resources], xlsxConfig);
          toc = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNamesAndPurpose.toc]);
          tocHeading = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNamesAndPurpose.toc], xlsxConfig);
          passage = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNamesAndPurpose.passage]);
          passageHeading = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNamesAndPurpose.passage], xlsxConfig);
          productInfo = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNamesAndPurpose.productInfo]);
          productInfoHeading = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNamesAndPurpose.productInfo], xlsxConfig);
          programCategories = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNamesAndPurpose.programCategories]);
          programCategoriesHeading = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNamesAndPurpose.programCategories], xlsxConfig);
          if (workbook.Sheets.hasOwnProperty(sheetNamesAndPurpose.reportsLabels)) {
              reportsLabels = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNamesAndPurpose.reportsLabels]);
              reportsLabelsHeading = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNamesAndPurpose.reportsLabels], xlsxConfig);
              reportsLabels = map(reportsLabels, partialRight(pick, reportsLabelsHeading[0]));
          }
          if (workbook.Sheets.hasOwnProperty(sheetNamesAndPurpose.productLabels)) {
              productLabels = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNamesAndPurpose.productLabels]);
              productLabelsHeading = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNamesAndPurpose.productLabels], xlsxConfig);
          }
          var resoursesUnitWiseData = {};
          var Unit = [];
          var Lesson = [];
          var Sublesson = [];
          var resourcesForAutomation = [];
          var tocForAutomation = [];
          var passageForAutomation = [];
          var passageInfoForAutomation = [];
          var passageCategoriesForAutomation = [];
          var tocMapping = {};
          var tocArray = [];
          toc.forEach((element, index) => {
              let filteredElem = {};
              let uniqueTocArray = [];
              tocHeading[0].map(function(item) {
                  if (element[item] != undefined) {
                      filteredElem[item] = element[item];
                  } else {
                      filteredElem[item] = "";
                  }
              })
              tocForAutomation.push(filteredElem);
              element['Unit (Parent)'] !== undefined && Unit.push(element['Unit (Parent)']);
              element['Lesson (Child)'] !== undefined && Lesson.push(element['Lesson (Child)']);
              element['Sub-Lesson (Sibling)'] !== undefined && Sublesson.push(element['Sub-Lesson (Sibling)']);
              if (element['Unit (Parent)'] !== undefined) {
                  if (!tocMapping.hasOwnProperty(element['Unit (Parent)'])) {
                      tocMapping[element['Unit (Parent)']] = {};
                  }
                  uniqueTocArray.push(element['Unit (Parent)']);
                  if (element['Lesson (Child)'] !== undefined) {
                      if (!tocMapping[element['Unit (Parent)']].hasOwnProperty(element['Lesson (Child)'])) {
                          tocMapping[element['Unit (Parent)']][element['Lesson (Child)']] = {};
                      }
                      uniqueTocArray.push(element['Lesson (Child)']);
                      if (element['Sub-Lesson (Sibling)'] !== undefined) {
                          if (!tocMapping[element['Unit (Parent)']][element['Lesson (Child)']].hasOwnProperty(element['Sub-Lesson (Sibling)'])) {
                              tocMapping[element['Unit (Parent)']][element['Lesson (Child)']][element['Sub-Lesson (Sibling)']] = {};
                          }
                          uniqueTocArray.push(element['Sub-Lesson (Sibling)']);
                      } else {}
                  } else {}
              }
              let locationInfo;
              if (element['Unit (Parent)'] != undefined && !resoursesUnitWiseData.hasOwnProperty(element['Unit (Parent)'])) {
                  resoursesUnitWiseData[element['Unit (Parent)']] = {};
                  locationInfo = getLocationInformation({
                      dataArray: units,
                      nameForComparison: element['Unit (Parent)']
                  });
                  if (keys(locationInfo).length) {
                      resoursesUnitWiseData[element['Unit (Parent)']][LOCATION] = locationInfo;
                  }
              }
              if (!resoursesUnitWiseData[element['Unit (Parent)']].hasOwnProperty('toc')) {
                  resoursesUnitWiseData[element['Unit (Parent)']]['toc'] = [];
                  resoursesUnitWiseData[element['Unit (Parent)']]['toc'].push(JSON.parse(JSON.stringify(element)));
              }
              if (element['Lesson (Child)'] != undefined && !resoursesUnitWiseData[element['Unit (Parent)']].hasOwnProperty(element['Lesson (Child)'])) {
                  resoursesUnitWiseData[element['Unit (Parent)']][element['Lesson (Child)']] = {};
                  if (hasIn(resoursesUnitWiseData[element['Unit (Parent)']][LOCATION], ASSOCIATED_ID)) {
                      const unitId = resoursesUnitWiseData[element['Unit (Parent)']][LOCATION][ASSOCIATED_ID];
                      const filteredChapters = filter(chapters, chapter => chapter.parents[0].parentId === unitId);
                      locationInfo = getLocationInformation({
                          dataArray: filteredChapters,
                          nameForComparison: element['Lesson (Child)'],
                          from: 'chapter'
                      });
                      if (keys(locationInfo).length) {
                          resoursesUnitWiseData[element['Unit (Parent)']][element['Lesson (Child)']][LOCATION] = locationInfo;
                      }
                  }
                  if (!resoursesUnitWiseData[element['Unit (Parent)']][element['Lesson (Child)']].hasOwnProperty('toc')) {
                      resoursesUnitWiseData[element['Unit (Parent)']][element['Lesson (Child)']]['toc'] = [];
                  }
              }
              if (element['Sub-Lesson (Sibling)'] != undefined && !resoursesUnitWiseData[element['Unit (Parent)']][element['Lesson (Child)']].hasOwnProperty(element['Sub-Lesson (Sibling)'])) {
                  resoursesUnitWiseData[element['Unit (Parent)']][element['Lesson (Child)']][element['Sub-Lesson (Sibling)']] = {};
                  if (hasIn(resoursesUnitWiseData[element['Unit (Parent)']][element['Lesson (Child)']][LOCATION], ASSOCIATED_ID)) {
                      const chapterId = resoursesUnitWiseData[element['Unit (Parent)']][element['Lesson (Child)']][LOCATION][ASSOCIATED_ID];
                      const filteredLessons = filter(lessons, lesson => lesson.parents[0].parentId === chapterId);
                      locationInfo = getLocationInformation({
                          dataArray: filteredLessons,
                          nameForComparison: element['Sub-Lesson (Sibling)'],
                          from: 'lesson'
                      });
                      if (keys(locationInfo).length) {
                          resoursesUnitWiseData[element['Unit (Parent)']][element['Lesson (Child)']][element['Sub-Lesson (Sibling)']][LOCATION] = locationInfo;
                      }
                  }
              }
              if ((element['Lesson (Child)'] != undefined || element['Lesson (Child)'] == EMPTY_COLUMN_VALUE) && ((element['Sub-Lesson (Sibling)'] == undefined || element['Sub-Lesson (Sibling)'] == EMPTY_COLUMN_VALUE) || (element['Sub-Lesson (Sibling)'] != undefined && element['Sub-Lesson (Sibling)'] != EMPTY_COLUMN_VALUE)) && resoursesUnitWiseData[element['Unit (Parent)']].hasOwnProperty(element['Lesson (Child)']) && resoursesUnitWiseData[element['Unit (Parent)']][element['Lesson (Child)']].hasOwnProperty('toc') && (resoursesUnitWiseData[element['Unit (Parent)']][element['Lesson (Child)']]['toc'].length === 0)) {
                  resoursesUnitWiseData[element['Unit (Parent)']][element['Lesson (Child)']]['toc'].push(JSON.parse(JSON.stringify(element)));
              }
              if (element['Sub-Lesson (Sibling)'] != undefined && element['Lesson (Child)'] != undefined) {
                  if (!resoursesUnitWiseData[element['Unit (Parent)']][element['Lesson (Child)']][element['Sub-Lesson (Sibling)']].hasOwnProperty('toc')) {
                      resoursesUnitWiseData[element['Unit (Parent)']][element['Lesson (Child)']][element['Sub-Lesson (Sibling)']]['toc'] = [];
                  }
                  resoursesUnitWiseData[element['Unit (Parent)']][element['Lesson (Child)']][element['Sub-Lesson (Sibling)']]['toc'].push(JSON.parse(JSON.stringify(element)));
              }
              tocArray.push(uniqueTocArray.join(':__:'));
          });
           /*
          var uniqueUnitNames = [];
          $.each(Unit, function(i, el) {
              if ($.inArray(el, uniqueUnitNames) === -1) uniqueUnitNames.push(el);
          });
          */
         var uniqueUnitNames = getUniqArrValues(Unit);
         /*
          var uniqueLessonNames = [];
          $.each(Lesson, function(i, el) {
              if ($.inArray(el, uniqueLessonNames) === -1) uniqueLessonNames.push(el);
          });
          */
         var uniqueLessonNames = getUniqArrValues(Lesson);
         /* 
          var uniqueSublessonNames = [];
          $.each(Sublesson, function(i, el) {
              if ($.inArray(el, uniqueSublessonNames) === -1) uniqueSublessonNames.push(el);
          });
          */
         var uniqueSublessonNames = getUniqArrValues(Sublesson);
          type = DROPDOWN_TYPES.DEFAULT; // 0
          if (uniqueSublessonNames.length === 0) {
              type = DROPDOWN_TYPES.ONE; // 1
          }
          if (type === DROPDOWN_TYPES.ONE /* 1 */ && uniqueUnitNames.length === 1) {
              type = DROPDOWN_TYPES.TWO; // 2
          } else if (type === DROPDOWN_TYPES.ONE /* 1 */ && uniqueLessonNames.length === 0) {
              type = DROPDOWN_TYPES.THREE; // 3
          }
          if (type === DROPDOWN_TYPES.DEFAULT /* 0 */ && uniqueUnitNames.length === 1) {
              type = DROPDOWN_TYPES.FOUR; // 4
          }
          let passageParent = [];
          passage.forEach((element, index) => {
              let filteredElem = {};
              passageHeading[0].map(function(item) {
                  if (element[item] != undefined) {
                      filteredElem[item] = element[item];
                  } else {
                      filteredElem[item] = "";
                  }
              })
              passageForAutomation.push(filteredElem);
              var node = element['Node'].trim();
              var nodeIndex = Lesson.indexOf(node);
              if (nodeIndex !== -1) {
                  if (resoursesUnitWiseData && Unit[nodeIndex] && Lesson[nodeIndex] && resoursesUnitWiseData[Unit[nodeIndex]] && resoursesUnitWiseData[Unit[nodeIndex]][Lesson[nodeIndex]]) {
                      if (!resoursesUnitWiseData[Unit[nodeIndex]][Lesson[nodeIndex]].hasOwnProperty('passage')) {
                          resoursesUnitWiseData[Unit[nodeIndex]][Lesson[nodeIndex]]['passage'] = [];
                      }
                      resoursesUnitWiseData[Unit[nodeIndex]][Lesson[nodeIndex]]['passage'].push(JSON.parse(JSON.stringify(element)));
                  }
              } else {
                  passageParent.push(node);
              }
          });
          let locationData;
          resources.forEach((element, index) => {
              let filteredElem = {};
              resourcesHeading[0].map(function(item) {
                  if (element[item] != undefined) {
                      filteredElem[item] = element[item];
                  } else {
                      filteredElem[item] = "";
                  }
              })
              resourcesForAutomation.push(filteredElem);
              var nodeLesson = element['Node / Lesson'];
              if (nodeLesson) {
                  nodeLesson = substituteEscapedCommaBeforeSplit(nodeLesson);
                  nodeLesson = nodeLesson.split(',');
                  nodeLesson.forEach((_element, _index) => {
                      nodeLesson[_index] = _element.trim();
                      nodeLesson[_index] = reSubstituteEscapedCommaAfterSplit(nodeLesson[_index]);
                  });
                  var lessonSublesson = element['Lesson / Sub-Lesson'];
                  if (lessonSublesson) {
                      lessonSublesson = lessonSublesson.replace(/\\,/g, '#NOBREAKING#').split(',');
                      lessonSublesson.forEach((_element, _index) => {
                          _element = _element.replace(/#NOBREAKING#/g, ',');
                          lessonSublesson[_index] = _element.trim();
                      });
                  }
                  if (lessonSublesson && !lessonSublesson.includes(element['Lesson / Sub-Lesson'])) {
                      lessonSublesson.push(element['Lesson / Sub-Lesson']);
                  }
                  nodeLesson.forEach((_element, _index) => {
                      var unitIndex = Unit.indexOf(_element);
                      if (unitIndex !== -1 && lessonSublesson === undefined) {
                          if (!resoursesUnitWiseData[_element].hasOwnProperty('Unit Review')) {
                              resoursesUnitWiseData[_element]['Unit Review'] = {};
                          }
                          if (!resoursesUnitWiseData[_element]['Unit Review'].hasOwnProperty('resources')) {
                              resoursesUnitWiseData[_element]['Unit Review']['resources'] = [];
                          }
                          let elementToPush = {
                              ...element
                          };
                          if (hasIn(resoursesUnitWiseData[_element], LOCATION)) {
                              locationData = resoursesUnitWiseData[_element][LOCATION];
                              const unitId = resoursesUnitWiseData[_element][LOCATION][ASSOCIATED_ID];
                              const filteredChapters = filter(chapters, chapter => chapter.parents[0].parentId === unitId);
                              if (filteredChapters) {
                                  let tempLocationInfo = getLocationInformation({
                                      dataArray: filteredChapters,
                                      nameForComparison: 'Unit Review',
                                      from: 'chapter'
                                  });
                                  if (keys(tempLocationInfo).length) {
                                      locationData = tempLocationInfo;
                                      resoursesUnitWiseData[_element]['Unit Review'][LOCATION] = locationData;
                                  }
                              }
                              elementToPush = {
                                  ...elementToPush,
                                  [LOCATION]: locationData
                              }
                          }
                          resoursesUnitWiseData[_element]['Unit Review']['resources'].push(JSON.parse(JSON.stringify(elementToPush)));
                          if (element.hasOwnProperty(PASSAGE_ID) && element.hasOwnProperty(RESOURCE_CLASSIFICATION) && passageParent.indexOf(element[RESOURCE_CLASSIFICATION].trim() !== -1)) {
                              if (!resoursesUnitWiseData[_element].hasOwnProperty('passage')) {
                                  resoursesUnitWiseData[_element]['passage'] = [];
                              }
                              resoursesUnitWiseData[_element]['passage'].push(...getPassageDataToSave({
                                  passageTabData: passage,
                                  passageIds: element[PASSAGE_ID]
                              }));
                          }
                      } else if (unitIndex !== -1) {
                          if (element.hasOwnProperty(PASSAGE_ID) && element.hasOwnProperty(RESOURCE_CLASSIFICATION) && passageParent.indexOf(element[RESOURCE_CLASSIFICATION].trim() !== -1)) {
                              if (!resoursesUnitWiseData[_element].hasOwnProperty('passage')) {
                                  resoursesUnitWiseData[_element]['passage'] = [];
                              }
                              resoursesUnitWiseData[_element]['passage'].push(...getPassageDataToSave({
                                  passageTabData: passage,
                                  passageIds: element[PASSAGE_ID]
                              }));
                          }
                          lessonSublesson.forEach((__element, __index) => {
                              if (!resoursesUnitWiseData[_element].hasOwnProperty(__element)) {
                                  if (hasIn(resoursesUnitWiseData[_element], LOCATION)) {
                                      const unitId = resoursesUnitWiseData[_element][LOCATION][ASSOCIATED_ID];
                                      const filteredChapters = filter(chapters, chapter => chapter.parents[0].parentId === unitId);
                                      if (filteredChapters) {
                                          let tempLocationInfo = getLocationInformation({
                                              dataArray: filteredChapters,
                                              nameForComparison: __element,
                                              from: 'chapter'
                                          });
                                          if (keys(tempLocationInfo).length) {
                                              resoursesUnitWiseData[_element][__element] = {};
                                              resoursesUnitWiseData[_element][__element][LOCATION] = tempLocationInfo;
                                          }
                                      }
                                  }
                              }
                              if (resoursesUnitWiseData[_element].hasOwnProperty(__element)) {
                                  if (!resoursesUnitWiseData[_element][__element].hasOwnProperty('resources')) {
                                      resoursesUnitWiseData[_element][__element]['resources'] = [];
                                  }
                                  let elementToPush = {
                                      ...element
                                  };
                                  let matchedLesson;
                                  if (hasIn(elementToPush, RESOURCE_TITLE)) {
                                      const names = {
                                          unit: _element,
                                          chapter: __element,
                                          lesson: elementToPush[RESOURCE_TITLE],
                                      }
                                      matchedLesson = getMatchedLesson({
                                          names: names,
                                          structure: unitstructure
                                      })
                                  }
                                  if (matchedLesson) {
                                      locationData = getLocationInformation({
                                          dataArray: [matchedLesson],
                                          nameForComparison: elementToPush[RESOURCE_TITLE],
                                          from: 'lesson'
                                      });
                                      elementToPush = {
                                          ...elementToPush,
                                          [LOCATION]: locationData
                                      }
                                  } else {
                                      if (hasIn(resoursesUnitWiseData[_element][__element], LOCATION)) {
                                          locationData = resoursesUnitWiseData[_element][__element][LOCATION];
                                          elementToPush = {
                                              ...elementToPush,
                                              [LOCATION]: locationData
                                          }
                                      } else if (hasIn(resoursesUnitWiseData[_element], LOCATION)) {
                                          locationData = resoursesUnitWiseData[_element][LOCATION];
                                          elementToPush = {
                                              ...elementToPush,
                                              [LOCATION]: locationData
                                          }
                                      }
                                  }
                                  resoursesUnitWiseData[_element][__element]['resources'].push(JSON.parse(JSON.stringify(elementToPush)));
                              }
                              // For ticket 14260
                              if (hasIn(resoursesUnitWiseData[_element], __element) && hasIn(resoursesUnitWiseData[_element][__element], 'toc')) {
                                  var currentSublessonIndex;
                                  toc.forEach((_ele, _ind) => {
                                      if (_ele['Unit (Parent)'] == _element && _ele['Lesson (Child)'] == __element) {
                                          currentSublessonIndex = _ind;
                                      }
                                  })
                                  var storeVisibleStudentData = [];
                                  if (hasIn(resoursesUnitWiseData[_element][__element], 'resources')) {
                                      if (resoursesUnitWiseData[_element][__element]['resources'].length > 1) {
                                          resoursesUnitWiseData[_element][__element]['resources'].forEach((_ele) => {
                                              storeVisibleStudentData.push(_ele['Visible Student'])
                                              if (storeVisibleStudentData.includes('Yes')) {
                                                  toc[currentSublessonIndex] = {
                                                      ...toc[currentSublessonIndex],
                                                      [STUDENT_VISIBILITY]: 'Yes'
                                                  };
                                              }
                                          });
                                          toc[currentSublessonIndex] = setPassageIdWithinTOCData({
                                              resources: resoursesUnitWiseData[_element][__element]['resources'],
                                              tocData: toc[currentSublessonIndex]
                                          });
                                      } else {
                                          toc[currentSublessonIndex] = {
                                              ...toc[currentSublessonIndex],
                                              [STUDENT_VISIBILITY]: (hasIn(toc[currentSublessonIndex], STUDENT_VISIBILITY) && toc[currentSublessonIndex][STUDENT_VISIBILITY]) || element['Visible Student']
                                          };
                                      }
                                  }
                                  if (hasIn(resoursesUnitWiseData[_element][__element], 'toc')) {
                                      resoursesUnitWiseData[_element][__element]['toc'][0] = toc[currentSublessonIndex]
                                  }
                                  // Checking if resoursesUnitWiseData has only resource
                                  if (hasIn(resoursesUnitWiseData[_element], 'resources')) {
                                      resoursesUnitWiseData[_element]['toc'][0] = {
                                          ...resoursesUnitWiseData[_element]['toc'][0],
                                          [STUDENT_VISIBILITY]: resoursesUnitWiseData[_element]['resources'][STUDENT_VISIBILITY]
                                      }
                                  } else {
                                      /** Checking the STUDENT_VISIBILITY in Unit -> Chapter and setting STUDENT_VISIBILITY of
                                        the unit True even if one chapter is found to be set visible.
                                      */
                                      var currentUnitIndex;
                                      toc.forEach((_ele, _ind) => {
                                          if (_ele['Unit (Parent)'] == _element && _ele['Lesson (Child)'] == 'EMPTY') {
                                              currentUnitIndex = _ind;
                                          }
                                      })
                                      let lessonChapterSublessonVisibleStudentFlagArray = [];
                                      for (var i = 0; i <= Object.keys(resoursesUnitWiseData[_element]).length; i++) {
                                          if (hasIn(resoursesUnitWiseData[_element][__element], 'toc') && hasIn(resoursesUnitWiseData[_element][__element]['toc'][0], STUDENT_VISIBILITY)) {
                                              // Adding STUDENT_VISIBILITY value to an array
                                              lessonChapterSublessonVisibleStudentFlagArray.push(resoursesUnitWiseData[_element][__element]['toc'][0][STUDENT_VISIBILITY]);
                                          }
                                          /** Checking and setting the value of unit STUDENT_VISIBILITY even if 
                                          one value in lessonChapterSublessonVisibleStudentFlagArray is found true
                                           */
                                          if (lessonChapterSublessonVisibleStudentFlagArray.includes('Yes')) {
                                              toc[currentUnitIndex] = {
                                                  ...toc[currentUnitIndex],
                                                  [STUDENT_VISIBILITY]: 'Yes'
                                              }
                                          } else {
                                              if (!hasIn(resoursesUnitWiseData[_element][__element]['toc'][0], STUDENT_VISIBILITY) || resoursesUnitWiseData[_element]['toc'][0][STUDENT_VISIBILITY] != 'Yes') {
                                                  toc[currentUnitIndex] = {
                                                      ...toc[currentUnitIndex],
                                                      [STUDENT_VISIBILITY]: 'No'
                                                  }
                                              }
                                          }
                                          resoursesUnitWiseData[_element]['toc'][0] = toc[currentUnitIndex]
                                      }
                                  }
                              }
                          });
                      }
                      var lessonIndex = Lesson.indexOf(_element);
                      if (lessonIndex !== -1 && lessonSublesson === undefined) {
                          if (!resoursesUnitWiseData[Unit[lessonIndex]][_element].hasOwnProperty('Chapter Review')) {
                              resoursesUnitWiseData[Unit[lessonIndex]][_element]['Chapter Review'] = {};
                              if (!resoursesUnitWiseData[Unit[lessonIndex]][_element]['Chapter Review'].hasOwnProperty('resources')) {
                                  resoursesUnitWiseData[Unit[lessonIndex]][_element]['Chapter Review']['resources'] = [];
                              }
                          }
                          let elementToPush = {
                              ...element
                          };
                          if (hasIn(resoursesUnitWiseData[Unit[lessonIndex]][_element], LOCATION)) {
                              locationData = resoursesUnitWiseData[Unit[lessonIndex]][_element][LOCATION];
                              elementToPush = {
                                  ...elementToPush,
                                  [LOCATION]: locationData
                              }
                          } else if (hasIn(resoursesUnitWiseData[Unit[lessonIndex]], LOCATION)) {
                              locationData = resoursesUnitWiseData[Unit[lessonIndex]][LOCATION];
                              elementToPush = {
                                  ...elementToPush,
                                  [LOCATION]: locationData
                              }
                          }
                          resoursesUnitWiseData[Unit[lessonIndex]][_element]['Chapter Review']['resources'].push(JSON.parse(JSON.stringify(elementToPush)));
                      } else if (lessonIndex !== -1) {
                          lessonSublesson.forEach((__element, __index) => {
                              if (resoursesUnitWiseData && Unit[lessonIndex] && resoursesUnitWiseData[Unit[lessonIndex]] && resoursesUnitWiseData[Unit[lessonIndex]][_element] && resoursesUnitWiseData[Unit[lessonIndex]][_element].hasOwnProperty(__element)) {
                                  if (!resoursesUnitWiseData[Unit[lessonIndex]][_element][__element].hasOwnProperty('resources')) {
                                      resoursesUnitWiseData[Unit[lessonIndex]][_element][__element]['resources'] = [];
                                  }
                                  let elementToPush = {
                                      ...element
                                  };
                                  if (hasIn(resoursesUnitWiseData[Unit[lessonIndex]][_element][__element], LOCATION)) {
                                      locationData = resoursesUnitWiseData[Unit[lessonIndex]][_element][__element][LOCATION];
                                      elementToPush = {
                                          ...elementToPush,
                                          [LOCATION]: locationData
                                      }
                                  } else if (hasIn(resoursesUnitWiseData[Unit[lessonIndex]][_element], LOCATION)) {
                                      locationData = resoursesUnitWiseData[Unit[lessonIndex]][_element][LOCATION];
                                      elementToPush = {
                                          ...elementToPush,
                                          [LOCATION]: locationData
                                      }
                                  } else if (hasIn(resoursesUnitWiseData[Unit[lessonIndex]], LOCATION)) {
                                      locationData = resoursesUnitWiseData[Unit[lessonIndex]][LOCATION];
                                      elementToPush = {
                                          ...elementToPush,
                                          [LOCATION]: locationData
                                      }
                                  }
                                  resoursesUnitWiseData[Unit[lessonIndex]][_element][__element]['resources'].push(JSON.parse(JSON.stringify(elementToPush)));
                                  // For ticket 14260
                                  if (hasIn(resoursesUnitWiseData[Unit[lessonIndex]], _element) && hasIn(resoursesUnitWiseData[Unit[lessonIndex]][_element], __element) && hasIn(resoursesUnitWiseData[Unit[lessonIndex]][_element][__element], 'toc')) {
                                      let currentLessonSublessonIndex;
                                      toc.forEach((_ele, _ind) => {
                                          if (_ele['Unit (Parent)'] == Unit[lessonIndex] && _ele['Lesson (Child)'] == _element && _ele['Sub-Lesson (Sibling)'] == __element) {
                                              currentLessonSublessonIndex = _ind;
                                          }
                                      })
                                      let storeLessonSublessonVisibleStudentData = [];
                                      if (hasIn(resoursesUnitWiseData[Unit[lessonIndex]][_element][__element], 'resources') && resoursesUnitWiseData[Unit[lessonIndex]][_element][__element]['resources'].length > 1) {
                                          resoursesUnitWiseData[Unit[lessonIndex]][_element][__element]['resources'].forEach((_ele) => {
                                              storeLessonSublessonVisibleStudentData.push(_ele['Visible Student']);
                                              if (storeLessonSublessonVisibleStudentData.includes('Yes')) {
                                                  toc[currentLessonSublessonIndex] = {
                                                      ...toc[currentLessonSublessonIndex],
                                                      [STUDENT_VISIBILITY]: 'Yes'
                                                  };
                                              }
                                          })
                                          toc[currentLessonSublessonIndex] = setPassageIdWithinTOCData({
                                              resources: resoursesUnitWiseData[Unit[lessonIndex]][_element][__element]['resources'],
                                              tocData: toc[currentLessonSublessonIndex]
                                          });
                                      } else {
                                          toc[currentLessonSublessonIndex] = {
                                              ...toc[currentLessonSublessonIndex],
                                              [STUDENT_VISIBILITY]: element['Visible Student']
                                          };
                                      }
                                      if (resoursesUnitWiseData[Unit[lessonIndex]][_element][__element].hasOwnProperty('toc')) {
                                          resoursesUnitWiseData[Unit[lessonIndex]][_element][__element].toc[0] = toc[currentLessonSublessonIndex]
                                      }
                                      // Checking if resoursesUnitWiseData has only resource
                                      if (hasIn(resoursesUnitWiseData[Unit[lessonIndex]], 'resources')) {
                                          resoursesUnitWiseData[Unit[lessonIndex]]['toc'][0] = {
                                              ...resoursesUnitWiseData[Unit[lessonIndex]]['toc'][0],
                                              [STUDENT_VISIBILITY]: resoursesUnitWiseData[Unit[lessonIndex]]['resources'][STUDENT_VISIBILITY]
                                          }
                                      } else {
                                          /** Checking the STUDENT_VISIBILITY in Unit -> Chapter -> Sub-Chapter and setting STUDENT_VISIBILITY of
                                            the unit True even if one chapter is found to be set visible.
                                          */
                                          var currentUnitIndex;
                                          toc.forEach((_ele, _ind) => {
                                              if (_ele['Unit (Parent)'] == Unit[lessonIndex] && _ele['Lesson (Child)'] == 'EMPTY') {
                                                  currentUnitIndex = _ind;
                                              }
                                          })
                                          let lessonChapterSublessonVisibleStudentFlagArray = [];
                                          for (var i = 0; i <= Object.keys(resoursesUnitWiseData[Unit[lessonIndex]]).length; i++) {
                                              if (hasIn(resoursesUnitWiseData[Unit[lessonIndex]][_element][__element], 'toc') && hasIn(resoursesUnitWiseData[Unit[lessonIndex]][_element][__element]['toc'][0], STUDENT_VISIBILITY)) {
                                                  lessonChapterSublessonVisibleStudentFlagArray.push(resoursesUnitWiseData[Unit[lessonIndex]][_element][__element]['toc'][0][STUDENT_VISIBILITY]);
                                              }
                                              /** Checking and setting the value of unit STUDENT_VISIBILITY even if 
                                              one value in lessonChapterSublessonVisibleStudentFlagArray is found true
                                              */
                                              if (lessonChapterSublessonVisibleStudentFlagArray.includes('Yes')) {
                                                  toc[currentUnitIndex] = {
                                                      ...toc[currentUnitIndex],
                                                      [STUDENT_VISIBILITY]: 'Yes'
                                                  }
                                              } else {
                                                  if (!hasIn(resoursesUnitWiseData[Unit[lessonIndex]][_element][__element]['toc'][0], STUDENT_VISIBILITY) || resoursesUnitWiseData[Unit[lessonIndex]]['toc'][0][STUDENT_VISIBILITY] != 'Yes') {
                                                      toc[currentUnitIndex] = {
                                                          ...toc[currentUnitIndex],
                                                          [STUDENT_VISIBILITY]: 'No'
                                                      }
                                                  }
                                              }
                                              resoursesUnitWiseData[Unit[lessonIndex]]['toc'][0] = toc[currentUnitIndex];
                                          }
                                      }
                                  } else {
                                      let seachArray = [];
                                      // Chapter Name
                                      seachArray.push(_element);
                                      // Lesson Name
                                      seachArray.push(__element);
                                      lessonIndex = tocArray.findIndex(function(tocData) {
                                          return tocData.includes(seachArray.join(':__:'))
                                      })
                                      if (lessonIndex !== -1) {
                                          if (resoursesUnitWiseData && Unit[lessonIndex] && resoursesUnitWiseData[Unit[lessonIndex]] && resoursesUnitWiseData[Unit[lessonIndex]][_element] && resoursesUnitWiseData[Unit[lessonIndex]][_element].hasOwnProperty(__element)) {
                                              if (!resoursesUnitWiseData[Unit[lessonIndex]][_element][__element].hasOwnProperty('resources')) {
                                                  resoursesUnitWiseData[Unit[lessonIndex]][_element][__element]['resources'] = [];
                                              }
                                              let elementToPush = {
                                                  ...element
                                              };
                                              if (hasIn(resoursesUnitWiseData[Unit[lessonIndex]][_element][__element], LOCATION)) {
                                                  locationData = resoursesUnitWiseData[Unit[lessonIndex]][_element][__element][LOCATION];
                                                  elementToPush = {
                                                      ...elementToPush,
                                                      [LOCATION]: locationData
                                                  }
                                              } else if (hasIn(resoursesUnitWiseData[Unit[lessonIndex]][_element], LOCATION)) {
                                                  locationData = resoursesUnitWiseData[Unit[lessonIndex]][_element][LOCATION];
                                                  elementToPush = {
                                                      ...elementToPush,
                                                      [LOCATION]: locationData
                                                  }
                                              } else if (hasIn(resoursesUnitWiseData[Unit[lessonIndex]], LOCATION)) {
                                                  locationData = resoursesUnitWiseData[Unit[lessonIndex]][LOCATION];
                                                  elementToPush = {
                                                      ...elementToPush,
                                                      [LOCATION]: locationData
                                                  }
                                              }
                                          }
                                          resoursesUnitWiseData[Unit[lessonIndex]][_element][__element]['resources'].push(JSON.parse(JSON.stringify(elementToPush)));
                                      }
                                  }
                              }
                          });
                      }
                      var sublessonIndex = Sublesson.indexOf(_element);
                      if (sublessonIndex !== -1) {
                          if (resoursesUnitWiseData[Unit[sublessonIndex]][Lesson[sublessonIndex]].hasOwnProperty(_element)) {
                              if (!resoursesUnitWiseData[Unit[sublessonIndex]][Lesson[sublessonIndex]][_element].hasOwnProperty('resources')) {
                                  resoursesUnitWiseData[Unit[sublessonIndex]][Lesson[sublessonIndex]][_element]['resources'] = [];
                              }
                              let elementToPush = {
                                  ...element
                              };
                              if (hasIn(resoursesUnitWiseData[Unit[sublessonIndex]][Lesson[sublessonIndex]][_element], LOCATION)) {
                                  locationData = resoursesUnitWiseData[Unit[sublessonIndex]][Lesson[sublessonIndex]][_element][LOCATION];
                                  elementToPush = {
                                      ...elementToPush,
                                      [LOCATION]: locationData
                                  }
                              } else if (hasIn(resoursesUnitWiseData[Unit[sublessonIndex]][Lesson[sublessonIndex]], LOCATION)) {
                                  locationData = resoursesUnitWiseData[Unit[sublessonIndex]][Lesson[sublessonIndex]][LOCATION];
                                  elementToPush = {
                                      ...elementToPush,
                                      [LOCATION]: locationData
                                  }
                              } else if (hasIn(resoursesUnitWiseData[Unit[sublessonIndex]], LOCATION)) {
                                  locationData = resoursesUnitWiseData[Unit[sublessonIndex]][LOCATION];
                                  elementToPush = {
                                      ...elementToPush,
                                      [LOCATION]: locationData
                                  }
                              }
                              resoursesUnitWiseData[Unit[sublessonIndex]][Lesson[sublessonIndex]][_element]['resources'].push(JSON.parse(JSON.stringify(elementToPush)));
                          }
                      }
                  });
              }
          });
          productInfo.forEach((element, index) => {
              let filteredElem = {};
              productInfoHeading[0].map(function(item) {
                  if (element[item] != undefined) {
                      filteredElem[item] = element[item];
                  } else {
                      filteredElem[item] = "";
                  }
              })
              passageInfoForAutomation.push(filteredElem);
              element['Dropdown Setting'] = type;
          });
          programCategories.forEach((element, index) => {
              let filteredElem = {};
              programCategoriesHeading[0].map(function(item) {
                  if (element[item] != undefined) {
                      filteredElem[item] = element[item];
                  } else {
                      filteredElem[item] = "";
                  }
              })
              passageCategoriesForAutomation.push(filteredElem);
          });
          if (Object.keys(productLabels).length) {
              productLabels.forEach((element, index) => {
                  let filteredElem = {};
                  productLabelsHeading[0].map(function(item) {
                      if (element[item] != undefined) {
                          filteredElem[item] = element[item];
                      } else {
                          filteredElem[item] = "";
                      }
                  })
                  productLabels.push(filteredElem);
              });
          }
          resoursesUnitWiseData = updateLocationInfoInNonInteractiveResources(resoursesUnitWiseData);
          resoursesUnitWiseData = addPacingInformationInsideInteractiveResources(resoursesUnitWiseData, cloneDeep(currentProductAssignments));
          // Start For "Automatically generate files needed for automation during import process"
          let resoursesUnitWiseDataNew = _.cloneDeep(resoursesUnitWiseData);
          let NewresoursesUnitWiseData = {
              units: []
          };
          if (Object.keys(resoursesUnitWiseDataNew).length > 0) {
              let UnitList = Object.keys(resoursesUnitWiseDataNew)
              UnitList.forEach(function(elem) {
                  if (resoursesUnitWiseDataNew[elem] !== undefined) {
                      NewresoursesUnitWiseData['units'].push(resoursesUnitWiseDataNew[elem])
                  }
              })
          }
          let resoursesUnitWiseDataForAutomation = NewresoursesUnitWiseData;
          resoursesUnitWiseDataForAutomation['units'].filter(function(elem) {
              //replace toc & Unit Review names n content
              if (elem['toc'] !== undefined) {
                  let UnitName = elem['toc'][0]['Unit (Parent)'];
                  elem['name'] = UnitName;
                  delete elem['toc'];
              }
              let chapterArray = [];
              chapterArray = Object.keys(elem).filter(function(key, index) {
                  if (key === "name" || key === "tiles" || key === "passage" || key === "EMPTY" || key === LOCATION) {
                      if (key === "passage" || key === "EMPTY") {
                          delete elem[key];
                      }
                  } else {
                      return key;
                  }
              })
              if (chapterArray.length === 1) {
                  if (elem['Unit Review'] !== undefined) {
                      _.map(elem['Unit Review'], function(element) {
                          if (element !== undefined) {
                              let ResourceCode = _.uniq(_.map(element, 'Resource Code'));
                              elem['tiles'] = ResourceCode;
                          }
                      })
                      delete elem['Unit Review'];
                      chapterArray = [];
                  }
              }
              if (chapterArray.length > 0) {
                  elem['chapters'] = [];
                  chapterArray.map(function(chapter) {
                      elem['chapters'].push({
                          ...elem[chapter],
                          name: chapter
                      });
                      delete elem[chapter]
                  })
                  elem['chapters'].map(function(element) {
                      if (element['toc'] !== undefined) {
                          delete element['toc'];
                      }
                      if (element['resources'] !== undefined) {
                          let ResourceCode = _.uniq(_.map(element['resources'], 'Resource Code'));
                          element['tiles'] = ResourceCode;
                          delete element['resources'];
                      }
                  })
                  //add chapter array
                  elem['chapters'].map(function(eleme) {
                      let lessonArray = Object.keys(eleme).filter(function(key, index) {
                          if (key === "name" || key === "tiles" || key === "passage" || key === LOCATION) {
                              if (key === "passage") {
                                  delete eleme[key];
                              }
                          } else {
                              return key;
                          }
                      })
                      if (lessonArray.length > 0) {
                          eleme['lessons'] = [];
                          lessonArray.map(function(lesson) {
                              eleme['lessons'].push(eleme[lesson]);
                              delete eleme[lesson]
                          })
                          eleme['lessons'].map(function(element) {
                              if (element['toc'] !== undefined) {
                                  let UnitName = element['toc'][0]['Sub-Lesson (Sibling)'];
                                  element['name'] = UnitName;
                                  delete element['toc'];
                              }
                              if (element['resources'] !== undefined) {
                                  let ResourceCode = _.uniq(_.map(element['resources'], 'Resource Code'));
                                  element['tiles'] = ResourceCode;
                                  delete element['resources'];
                              }
                          })
                          //add sublesson array
                          eleme['lessons'].map(function(eme) {
                              let subLessonArray = Object.keys(eme).filter(function(key, index) {
                                  if (key === "name" || key === "tiles" || key === "passage" || key === LOCATION) {
                                      if (key === "passage") {
                                          delete eme[key];
                                      }
                                  } else {
                                      return key;
                                  }
                              })
                              if (subLessonArray.length > 0) {
                                  eme['sublessons'] = [];
                                  subLessonArray.map(function(sublessons) {
                                      eme['sublessons'].push(eme[sublessons]);
                                      delete eme[sublessons]
                                  })
                                  /* CURRENT FUNCTIONALITY ONLY TILL Sub-Lesson (Sibling)*/
                                  // eme['sublessons'].map(function(element){
                                  //   if(element['toc'] !== undefined){
                                  //     let UnitName = element['toc'][0]['Sub-Lesson (Sibling)'];
                                  //     element['name'] = UnitName;
                                  //     delete element['toc'];
                                  //   }
                                  //   if(element['resources'] !== undefined){
                                  //     let ResourceCode = element['resources'].map(function(value){
                                  //        return value['Resource Code']
                                  //     })
                                  //     element['tiles'] = ResourceCode;
                                  //     delete element['resources'];
                                  //   }
                                  // })
                              } else {
                                  eme['sublessons'] = [];
                              }
                          })
                      } else {
                          eleme['lessons'] = [];
                      }
                  })
              } else {
                  elem['chapters'] = [];
              }
          });
          // FOR ONE DROP DOWN: dislay in series Unit->Chapter->Lesson->Sub-lesson
          if (resoursesUnitWiseDataForAutomation['units'].length === 1) {
              resoursesUnitWiseDataForAutomation['units'] = resoursesUnitWiseDataForAutomation['units'][0].chapters;
              resoursesUnitWiseDataForAutomation['units'].map(function(unit) {
                  if (unit['lessons'].length === 0) {
                      unit['chapters'] = [];
                      delete unit['lessons'];
                  } else {
                      unit['chapters'] = unit['lessons'];
                      delete unit['lessons'];
                      if (unit['chapters'].hasOwnProperty('sublessons')) {
                          if (unit['chapters']['sublessons'].length === 0) {
                              unit['chapters']['lessons'] = [];
                              delete unit['chapters']['sublessons'];
                          } else {
                              unit['chapters']['lessons'] = unit['chapters']['sublessons'];
                              delete unit['chapters']['sublessons'];
                          }
                      }
                  }
              })
          }
          // End For "Automatically generate files needed for automation during import process"
          // console.log("resoursesUnitWiseData", resoursesUnitWiseData);
          // console.log("resoursesUnitWiseDataForAutomation", resoursesUnitWiseDataForAutomation);
          // console.log("resourcesForAutomation", resourcesForAutomation);
          // console.log("tocForAutomation", tocForAutomation);
          // console.log("passageForAutomation", passageForAutomation);
          //============ Sifter - 9884 - Product structure json tool ================== 
          //console.log("894 currentProductId =", currentProductId);
          let addProblemDataInSheet = false;
          //await this.deleteOldProductStructureObj(userContentObjects);
          // getProductStructureJson();
          let productStructureObj = await getProductStructureJson({
              currentProductAssignments,
              unitstructure,
              addProblemDataInSheet,
              currentProductId,
              toc,
              workbook,
              resoursesUnitWiseDataForAutomation,
              applicationType
          });
          let productStructureJson = productStructureObj.productStructure;
          //--------------------------------------------
          _console("productStructureObj = ", productStructureObj);
          if (productStructureObj.errorList.length > 0) {
              productStructureObj.errorList.forEach((elm) => {
                  //jsonErrors.push("<div class='alert alert-danger' role='alert'> " + elm.msg + "</div>");
                  jsonErrors.push(elm.msg);
              });
              //jsonErrors.push("Data not uploaded. Please correct JSON errors.");
          }
          //===================================================================
          _console("resoursesUnitWiseData", resoursesUnitWiseData);
          _console("productStructureJson = ", productStructureJson);
          //========================================
          automation_data_to_save = getUserContentObjectsForCurrentProduct({
              existinguserContentObjects: userContentObjects,
              indexJsonForAutomation: resoursesUnitWiseDataForAutomation,
              resourcesForAutomation,
              tocForAutomation,
              passageForAutomation,
              currentProductId,
              user_id: AUTOMATION_USER_ID,
              user_name: AUTOMATION_USER_NAME,
              reportsLabels: reportsLabels,
              passageInfoForAutomation,
              passageCategoriesForAutomation,
              productLabels,
              productStructureJson
          });
          // _console("935 automation_data_to_save = ", automation_data_to_save);
      } else if (!workbook.Sheets.hasOwnProperty(sheetNamesAndPurpose.toc)) {
          console.log(sheetNamesAndPurpose.toc + " tab not present");
          if (!workbook.Sheets.hasOwnProperty(sheetNamesAndPurpose.resources)) {
              console.log(sheetNamesAndPurpose.resources + " tab not present");
          }
          if (!workbook.Sheets.hasOwnProperty(sheetNamesAndPurpose.passage)) {
              console.log(sheetNamesAndPurpose.passage + " tab not present");
          }
          if (!workbook.Sheets.hasOwnProperty(sheetNamesAndPurpose.productInfo)) {
              console.log(sheetNamesAndPurpose.productInfo + " tab not present");
          }
          if (!workbook.Sheets.hasOwnProperty(sheetNamesAndPurpose.programCategories)) {
              console.log(sheetNamesAndPurpose.programCategories + " tab not present");
          }
      }
      // console.log("productStructureJson = ", productStructureJson);
      //==========================
      updateResoursesUnitWiseData(resoursesUnitWiseData);
      //======= dummy code for testing toc ===========
      updateTOCdata(toc,resoursesUnitWiseData,resources);
      //===========================
      resolve({
          automation_data_to_save,
          resoursesUnitWiseData,
          productInfo,
          programCategories,
          toc,
          passage,
          uniqueUnitNames,
          reportsLabels,
          type,
          jsonErrors
      });
  });
}

function updateResoursesUnitWiseData(resoursesUnitWiseData) {
  // This function will update resource code in toc data
  // We can use this function to update other properties in TOC data
  // changes done for tickete 16913
  let propertiesToSkip = ["location", "toc", "EMPTY"];
  for (var i in resoursesUnitWiseData) {
    //console.log("i ======= ",i);
    let _unitObj = resoursesUnitWiseData[i];
    for (var j in _unitObj) {
      if (propertiesToSkip.indexOf(j) == -1) {
        let _chapterObj = _unitObj[j];
        //console.log(j," :: ",_chapterObj);
        if (_chapterObj.resources && _chapterObj.toc) {
          updateResourceData(_chapterObj);
        }
        else {
          for (var k in _chapterObj) {
            if (propertiesToSkip.indexOf(k) == -1) {
              //console.log(k," :: ",_chapterObj[k]);
              if (_chapterObj[k].resources && _chapterObj[k].toc) {
                updateResourceData(_chapterObj[k]);
              }
            }
          }
        }
      }
    }
    //console.log("===================");
  }
}

function updateTOCdata(toc, resoursesUnitWiseData, resources) {
  // changes done for tickete 16913
  // this function will update missing resource code and student visibility property in toc array
  toc.forEach((elm, index) => {
    if (elm["Resource Code"] === undefined) {
      let _unit = elm["Unit (Parent)"];
      let resourceArr = resources.filter((innerElm) => {
        let _node = innerElm["Node / Lesson"];
        let _lesson = innerElm["Lesson / Sub-Lesson"];
        let _format = innerElm["Format"];
        return (_node == _unit) && (_lesson == _unit) && (_format == "Interactive Lesson") ? true : false;
      });
      //console.log(index," :: resourceArr = ",resourceArr);
      if (resourceArr && resourceArr.length == 1) {
        //console.log(index, elm["Unit (Parent)"], elm["Lesson (Child)"], "UPDATED");
        //console.log("resourceArr = ",resourceArr);
        if (resourceArr[0]["Resource Code"]) {
          elm["Resource Code"] = resourceArr[0]["Resource Code"];
        }
        if (resourceArr[0]["Visible Student"]) {
          elm["student Visibility"] = resourceArr[0]["Visible Student"];
        }
      }
    }
  });
}

function updateResourceData(_chapterObj) {
  if ((_chapterObj.resources && _chapterObj.resources.length > 0) && (_chapterObj.toc && _chapterObj.toc.length > 0)) {
    let resourceObj = _chapterObj.resources.filter((elm) => {
      return elm.Format == "Interactive Lesson" ? true : false;
    });
    if (resourceObj.length > 0) {
      _chapterObj.toc[0]["Resource Code"] = resourceObj[0]["Resource Code"];
    }
  }
}

function getUserContentObjectsForCurrentProduct(data) {
  let userContentObjects = [];
  let {
      existinguserContentObjects = [], resourcesForAutomation, tocForAutomation, passageForAutomation, indexJsonForAutomation, currentProductId, user_id, user_name, reportsLabels, passageInfoForAutomation, passageCategoriesForAutomation, productLabels, productStructureJson
  } = data;
  userContentObjects = TYPES_OF_USER_CONTENT_OBJECT.map((value, index) => {
      let title = currentProductId + '_' + value;
      let user_content_object;
      user_content_object = {
          ...USER_CONTENT_OBJECT_DEFAULT_DATA
      };
      existinguserContentObjects.forEach((element) => {
          if (element.categories.indexOf(value) !== -1) {
              user_content_object = {
                  ...user_content_object,
                  ...element
              }
          }
      });
      if (!user_content_object.hasOwnProperty(ID)) {
          user_content_object.user_name = user_name;
          user_content_object.user_id = user_id;
          user_content_object.title = title;
          user_content_object.categories = [currentProductId, value, CATAGORY_AUTOMATION_FILES];
      } else {
          FIELDS_TO_EXCLUDE_WHILE_MODIFY_AUTOMATION_USER_CONTENT_OBJECT.forEach((value) => {
              delete user_content_object[value];
          });
      }
      let presentation_data;
      switch (value) {
          case TYPES_OF_USER_CONTENT_OBJECT[0]: //CATAGORY_PRODUCT_RESOURSES
              presentation_data = _.cloneDeep(resourcesForAutomation);
              break;
          case TYPES_OF_USER_CONTENT_OBJECT[1]: //CATAGORY_PROGRAM_TOC
              presentation_data = _.cloneDeep(tocForAutomation);
              break;
          case TYPES_OF_USER_CONTENT_OBJECT[2]: //CATAGORY_PASSAGES
              presentation_data = _.cloneDeep(passageForAutomation);
              break;
          case TYPES_OF_USER_CONTENT_OBJECT[3]: //CATAGORY_INDEX_TILES
              presentation_data = _.cloneDeep(indexJsonForAutomation);
              break;
          case TYPES_OF_USER_CONTENT_OBJECT[4]: //CATAGORY_INDEX_TILES
              presentation_data = _.cloneDeep(reportsLabels);
              break;
          case TYPES_OF_USER_CONTENT_OBJECT[5]: //CATAGORY_PRODUCT
              presentation_data = _.cloneDeep(passageInfoForAutomation);
              break;
          case TYPES_OF_USER_CONTENT_OBJECT[6]: //CATAGORY_PROGRAM_CATEGORIES
              presentation_data = _.cloneDeep(passageCategoriesForAutomation);
              break;
          case TYPES_OF_USER_CONTENT_OBJECT[7]: //CATAGORY_PRODUCT_LABELS
              presentation_data = _.cloneDeep(productLabels);
              break;
          case TYPES_OF_USER_CONTENT_OBJECT[8]: //CATAGORY_PRODUCT_STRUCTURE
              // presentation_data = _.cloneDeep(productStructureJson);
              return createContentObjForJson(data);
              break;
      }
      user_content_object.presentation_data = JSON.stringify(presentation_data);
      return user_content_object;
  });
  return _.flatten(userContentObjects);
};
//============================================================
function getUserContentObject(obj) {
  let {
      existinguserContentObjects = [], currentProductId, user_id, user_name
  } = obj.data;
  let value = obj.fileName;
  let title = obj.productCode + '_' + value;
  //let title =  value;
  let user_content_object;
  user_content_object = {
      ...USER_CONTENT_OBJECT_DEFAULT_DATA
  };
  // Below code is commeneted. Old code was updatating data in old file ID.
  // Now in this version fresh data of product structure json files will be uploaded
  /*
  existinguserContentObjects.forEach((element) => {
      if (element.categories.indexOf(title) !== -1) {
          user_content_object = {
              ...user_content_object,
              ...element
          }
      }
  });
  */
  if (!user_content_object.hasOwnProperty(ID)) {
      user_content_object.user_name = user_name;
      user_content_object.user_id = user_id;
      user_content_object.title = title;
      //user_content_object.categories = [currentProductId, value, constants.CATAGORY_AUTOMATION_FILES];
      user_content_object.categories = [currentProductId, title, CATAGORY_AUTOMATION_FILES];
  } else {
      FIELDS_TO_EXCLUDE_WHILE_MODIFY_AUTOMATION_USER_CONTENT_OBJECT.forEach((value) => {
          delete user_content_object[value];
      });
  }
  let presentation_data = _.cloneDeep(obj.presentationData);
  user_content_object.presentation_data = JSON.stringify(presentation_data);
  return user_content_object;
}

function createContentObjForJson(data) {
  let userContentObjects = [];
  let {
      productStructureJson,
      existinguserContentObjects = [],
      currentProductId
  } = data;
  //==============================================
  productStructureJson.forEach((val) => {
      userContentObjects.push(getUserContentObject({
          fileName: "proStru.json",
          productCode: val.productCode,
          presentationData: val.json,
          data: data
      }));
  });
  return userContentObjects;
}
//=======================================
function checkProductID(_bookListinfo, selectedBook) {
  let _found = false;
  let _arr = _bookListinfo.filter((elm) => {
      return (elm.productId == selectedBook)
  })
  //console.log("_arr = ",_arr);
  let _productID;
  if (_arr.length > 0) {
    _found = true;
  }
  return _found;
}
//=======================================
function getProductID(_bookListinfo, selectedBook) {
  let _arr = _bookListinfo.filter((elm) => {
      return (elm.name == selectedBook || elm.subject == selectedBook)
  })
  let _productID;
  if (_arr.length > 0) {
      _productID = _arr[0].productId;
  }
  return _productID;
}
//====================================================
async function getChapterEntityStructurePromise(data) {
  _console("getChapterEntityStructurePromise");
  let {
      currentProductId,
      applicationType
  } = data;
  let rawUnitStructrue = {
      units: [],
      chapters: [],
      lessons: []
  };
  var unitData = await getChaptersDBEntityPromise(currentProductId, 'unit', applicationType);
  rawUnitStructrue.units = getSortedChapterEntityUsingChildIndex(unitData);
  var unitIds = getSpecificKeyDataFromObject(rawUnitStructrue.units, 'id')
  var chapterData = await getChaptersDBEntityPromise(unitIds, 'chapter', applicationType);
  rawUnitStructrue.chapters = getSortedChapterEntityUsingChildIndex(chapterData);
  var chpaterIds = getSpecificKeyDataFromObject(rawUnitStructrue.chapters, 'id');
  var lessonData = await getChaptersDBEntityPromise(chpaterIds, 'lesson', applicationType);
  rawUnitStructrue.lessons = getSortedChapterEntityUsingChildIndex(lessonData);
  return rawUnitStructrue;
}
//---------------------------
function getChaptersDBEntityPromise(_ids, type, applicationType) {
  let apiPath = "https://node.perfectionnext.com:8083/chapters/query";
  if (!Array.isArray(_ids)) {
      _ids = [_ids];
  }
  return new Promise((resolve, reject) => {
      var settings = {
          async: true,
          crossDomain: true,
          url: apiPath,
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          processData: false,
          data: JSON.stringify({
              filter: {
                  type: {
                      $in: [type]
                  },
                  parents: {
                      $elemMatch: {
                          parentId: {
                              $in: _ids
                          }
                      }
                  }
              }
          })
      };
      settings.applicationType = applicationType;
      getHttpRequest(settings, function(_data) {
          resolve(_data);
      }, function(error) {
          reject(error);
      });
  });
}

function getSortedChapterEntityUsingChildIndex(data) {
  data.sort(function(a, b) {
      return a.parents[0].childIndex - b.parents[0].childIndex;
  });
  return data;
};

function getSpecificKeyDataFromObject(dataSet, key) {
  return uniq(map(filter(dataSet, (ele) => hasIn(ele, key)),
      (fEle) => fEle[key]));
};
//================================================
function deleteFileResourceObj(resourceId, resolveCallback,applicationType) {
  _console("deleteFileResourceObj resourceId = ", resourceId);
  //let {currentProductId,applicationType} = data;
  _console("getCurrentProductAssignments");
  let apiPath = "https://node.perfectionnext.com:8083/usercontent/delete";
  return new Promise((resolve, reject) => {
      //console.log("from promise");
      var data = {
          filter: {
              _id: {
                  $in: [resourceId],
              },
          },
      };
      var settings = {
          async: true,
          crossDomain: true,
          //url: app.serverPath + app.paths.getUserContentObject,
          url: apiPath,
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          processData: false,
          data: JSON.stringify(data)
      };
      settings.applicationType = applicationType;
      _ajax(settings, resolveCallback, reject);
  });
}
//====================================================
function getCurrentProductAssignments(data) {
  let {
      currentProductId,
      applicationType
  } = data;
  _console("getCurrentProductAssignments");
  let apiPath = "https://node.perfectionnext.com:8083/assigns/query";
  return new Promise((resolve, reject) => {
     // _console("from promise");
      var data = {
          filter: {
              productID: {
                  $in: [
                      // "T4310D"
                      currentProductId
                  ]
              }
          },
      };
      var settings = {
          async: true,
          crossDomain: true,
          //url: app.serverPath + app.paths.getUserContentObject,
          url: apiPath,
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          processData: false,
          data: JSON.stringify(data)
      };
      settings.applicationType = applicationType;
      _ajax(settings, resolve, reject);
  });
}
//getBookListInfo
function getBookListInfo(data) {
    let {
        applicationType
    } = data;
  let apiPath = "https://node.perfectionnext.com:8083/book/bulk";
  return new Promise((resolve, reject) => {
      var settings = {
          "async": true,
          "crossDomain": true,
          "url": apiPath,
          "method": "PUT",
          "headers": {
              "Content-Type": "application/json"
          }
      }
      settings.applicationType = applicationType;
      _ajax(settings, resolve, reject);
  });
}

function getAutomationFiles(data) {
  let {
      currentProductId,
      applicationType
  } = data;
  _console("getAutomationFiles");
  return new Promise((resolve, reject) => {
      var data = {
          filter: {
              $and: [{
                  "categories": "automation_files"
              }, {
                  //"categories": "T4310D"
                  "categories": currentProductId
              }]
          },
      };
      var settings = {
          async: true,
          crossDomain: true,
          //url: app.serverPath + app.paths.getUserContentObject,
          url: "https://node.perfectionnext.com:8083/usercontent/query",
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          processData: false,
          data: JSON.stringify(data)
      };
      settings.applicationType = applicationType;
      _ajax(settings, resolve, reject);
  });
}

function _ajax(settings, _resolveCallback, rejectCallback) {
  getHttpRequest(settings, function(_data) {
      _resolveCallback(_data);
  }, function(error) {
      rejectCallback(error);
  });
}