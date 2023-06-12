//import { flatten, keys, map, uniq } from "lodash";
import pkg from 'lodash';
const { flatten, keys, map, uniq } = pkg;

export const CREATE_EDIT_ASSESSMENT = "Create/Edit Assessment";
export const FROM_ASSESSMENT_PAGE = "fromAssessmentPage";
export const ASSESSMENT_ID_PREFIX = "Assessment #";
export const SUBJECT_DROPDOWN_HEADER = "Subject:";
export const UNIT_DROPDOWN_HEADER = "Unit Name:";
export const CHAPTER_DROPDOWN_HEADER = "Chapter Name:";
export const ASSESSMENT_TYPE_DROPDOWN_HEADER = "Type of assessment:";
export const UPLOAD_RESOURCES_PAGE = "uploadResourcesPage";
export const UPLOAD_POINT_PAGE = "uploadPointPage";
export const ASSESSMENT_TYPE_TEXT = "assessment_type";
export const ASSESSMENT_SUBTYPE_TEXT = "assessment_subtype";
export const ASSESSMENT_VISIBLE = "assessment_visible";
export const SUB_LESSON_TYPE = "subLessonType";
export const SUB_LESSON_INDEX = "subLessonIndex";
export const UPLOAD_XML_PROBLEMS = "uploadXml";
export const ASSESSMENT_TYPES = {
	UNIT: {
		text: "Unit Level Assessment",
		value: "unit_level_assessment",
	},
	CHAPTER: {
		text: "Chapter Level Assessment",
		value: "chapter_level_assessment",
	},
};

export const ASSESSMENT_SUBTYPE = {
	PRACTICE: {
		text: "Unit Practice Performance Tasks",
		value: "unit_practice_performance_tasks",
	},
	SUMMATIVE: {
		text: "Unit Summative Assesssments",
		value: "unit_summative_assesssments",
	},
	END_OF_COURSE: {
		text: "End-of-course assessments",
		value: "end_of_course_assessments",
	},
	CONNECT_TO_TESTING: {
		text: "Connect to Testing",
		value: "connect_to_testing",
	},
	STAAR_TESTS_A: {
		text: "STAAR Tests A",
		value: "staar_tests_a",
	},
	STAAR_TESTS_B: {
		text: "STAAR Tests B",
		value: "staar_tests_b",
	},
	VOCABULARY_TEST: {
		text: "Vocabulary Test",
		value: "vocabulary_test",
	},
	COMPREHENSION_QUIZ: {
		text: "Comprehension Quiz",
		value: "comprehension_quiz",
	},
	VOCABULARY_QUIZ: {
		text: "Vocabulary Quiz",
		value: "vocabulary_quiz",
	},
	UNIT_TEST: {
		text: "Unit Test",
		value: "unit_test",
	},
};

export const ASSESSMENT_TYPES_DATA = {
	/* 'UNIT': {
    'text': ASSESSMENT_TYPES.UNIT.text,
    'value': ASSESSMENT_TYPES.UNIT.value,
    'SUBTYPES': [
      {
        'text': ASSESSMENT_SUBTYPE.PRACTICE.text,
        'value': ASSESSMENT_SUBTYPE.PRACTICE.value
      },
      {
        'text': ASSESSMENT_SUBTYPE.SUMMATIVE.text,
        'value': ASSESSMENT_SUBTYPE.SUMMATIVE.value
      },
      {
        'text': ASSESSMENT_SUBTYPE.END_OF_COURSE.text,
        'value': ASSESSMENT_SUBTYPE.END_OF_COURSE.value
      },
      {
        'text': ASSESSMENT_SUBTYPE.STAAR_TESTS_A.text,
        'value': ASSESSMENT_SUBTYPE.STAAR_TESTS_A.value
      },
      {
        'text': ASSESSMENT_SUBTYPE.STAAR_TESTS_B.text,
        'value': ASSESSMENT_SUBTYPE.STAAR_TESTS_B.value
      },
      {
        'text': ASSESSMENT_SUBTYPE.VOCABULARY_TEST.text,
        'value': ASSESSMENT_SUBTYPE.VOCABULARY_TEST.value
      },
      {
        'text': ASSESSMENT_SUBTYPE.UNIT_TEST.text,
        'value': ASSESSMENT_SUBTYPE.UNIT_TEST.value
      }
    ]
  },
  'CHAPTER': {
    'text': ASSESSMENT_TYPES.CHAPTER.text,
    'value': ASSESSMENT_TYPES.CHAPTER.value,
    'SUBTYPES': [
      {
        'text': ASSESSMENT_SUBTYPE.CONNECT_TO_TESTING.text,
        'value': ASSESSMENT_SUBTYPE.CONNECT_TO_TESTING.value
      },
      {
        'text': ASSESSMENT_SUBTYPE.VOCABULARY_TEST.text,
        'value': ASSESSMENT_SUBTYPE.VOCABULARY_TEST.value
      },
      {
        'text': ASSESSMENT_SUBTYPE.COMPREHENSION_QUIZ.text,
        'value': ASSESSMENT_SUBTYPE.COMPREHENSION_QUIZ.value
      },
      {
        'text': ASSESSMENT_SUBTYPE.VOCABULARY_QUIZ.text,
        'value': ASSESSMENT_SUBTYPE.VOCABULARY_QUIZ.value
      }
    ]
  } */
};

export const UNWANTED_FIELDS_OF_ASSIGNMENT_TO_SAVE = [
	"active",
	"createdAt",
	"isSubAssign",
	"version",
	"assigned",
	"updatedAt",
	"passage_ids",
];

export const FIELDS_MAPPING = {
	presentation_data: "presentation_data",
	aid: "id",
	problems: "problems",
	type: "type",
};

export const TRUE_VALUES_REGEX = new RegExp(/\b(yes|y|true)\b/gi); // to match the yes, y and true from import spredsheet
export const FALSE_VALUES_REGEX = new RegExp(/\b(no|n|false)\b/gi); // to match the no, n and false from import spredsheet

export const AUTOMATION_USER_ID = 111512;
export const AUTOMATION_USER_NAME = "config19_auto@mailinator.com";
export const ID = "id";

export const USER_CONTENT_OBJECT_DEFAULT_DATA = {
	title: "",
	user_name: "",
	user_id: "",
	course_name: "",
	course_id: "",
	school_name: "",
	school_id: "",
	presentation_data: "",
	categories: [],
};

export const FIELDS_TO_EXCLUDE_WHILE_MODIFY_AUTOMATION_USER_CONTENT_OBJECT = [
	"title",
	"user_name",
	"user_id",
	"course_name",
	"course_id",
	"school_name",
	"school_id",
	"categories",
];

export const CATAGORY_AUTOMATION_FILES = "automation_files";
export const CATAGORY_PRODUCT_RESOURSES = "prodres.json";
export const CATAGORY_PROGRAM_TOC = "progtoc.json";
export const CATAGORY_PASSAGES = "passages.json";
export const CATAGORY_INDEX_TILES = "index_tiles.json";
export const CATAGORY_REPORTS_LABELS = "reports_labels.json";
export const CATAGORY_PRODUCT_LABELS = "prodlabel.json";
export const CATAGORY_PROGRAM_CATEGORIES = "progcat.json";
export const CATAGORY_PRODUCT = "product.json";
export const CATAGORY_PRODUCT_STRUCTURE = "proStru.json";

export const RESOURCE_CLASSIFICATION = "Resource Classification";
export const RESOURCE_TITLE = "Resource Title";
export const RESOURCE_CODE = "Resource Code";
export const PASSAGE_ID = "Passage ID";
export const INTERACTIVE_LESSON = "Interactive Lesson";
export const ASSESSMENT = "Assessment";
export const FORMAT = "Format";
export const RESOURCES_KEY = "resources";

export const TYPES_OF_USER_CONTENT_OBJECT = [
	CATAGORY_PRODUCT_RESOURSES,
	CATAGORY_PROGRAM_TOC,
	CATAGORY_PASSAGES,
	CATAGORY_INDEX_TILES,
	CATAGORY_REPORTS_LABELS,
	CATAGORY_PRODUCT,
	CATAGORY_PROGRAM_CATEGORIES,
	CATAGORY_PRODUCT_LABELS,
	CATAGORY_PRODUCT_STRUCTURE,
];

export const WANTED_FIELDS_OF_RESOURCES_TO_SAVE = [
	"Resource Code",
	"Resource Title",
	"Resource Prefix",
	"Resource Category",
	"Resource Classification",
	"Source Product",
	"Icon",
	"Format",
	"Node / Lesson",
	"Lesson / Sub-Lesson",
	"Assignable",
	"Gradable",
	"Asset",
	"Source",
	"Source Pages",
	"Passage ID",
	"Standards",
	"Answer Key Asset",
	"Answer Key Asset Pages",
	"Answer Key Source",
	"Answer Key Source Pages",
	"Link to Product Code",
	"Link to Resource Code",
	"Display Order",
	"Downloadable Version",
	"Visible Student",
	"Visible Parent",
	"Visible Teacher",
	"Visible Administrator",
	"Allow Printing",
	"Resource Description",
	"Version",
	"Restrict Page Viewing",
	"Lesson Name",
	"lesson_id",
	"subLessonIndex",
	"Link to Interactive Lesson",
	"Asset Pages",
	"Sub-lesson Name",
];

export const WANTED_FIELDS_OF_TOC_TO_SAVE = [
	"Unit (Parent)",
	"Lesson (Child)",
	"Sub-Lesson (Sibling)",
	"Description",
	"Version",
	"Display Order",
];

export const WANTED_FIELDS_OF_PROGRAM_CATEGORIES_TO_SAVE = [
	"Name",
	"Display Order",
];

export const WANTED_FIELDS_OF_PRODUCT_INFO_TO_SAVE = [
	"Product Code",
	"Product Name",
	"Product Type",
	"Program Name",
	"Program Series",
	"Subject",
	"Grade",
	"Level",
	"Use Level",
	"Access Code",
	"Edition",
	"Link to Product Code",
	"Single Question Mode",
	"Content Package",
	"Product Graphic",
	"Product Header Graphic",
	"Product Footer Graphic",
	"Program Graphic",
	"Teacher Only",
	"Product Orientation",
	"Author",
	"Lexile",
	"Reading Level",
	"Guided Reading Level",
	"Version",
	"Item Bank Filters",
	"HEADER",
	"HEADER_BAR_TOP",
	"HEADER_BAR_BOTTOM",
	"HOVER_ON_GRADIENT_1",
	"HOVER_ON_GRADIENT_2",
	"HOVER_OFF_GRADIENT_1",
	"HOVER_OFF_GRADIENT_2",
	"DROPDOWN_BORDER",
	"TILE_GRADIENT_1",
	"TILE_GRADIENT_2",
	"has_standards",
	"Product Labels",
	"Hide Menu Navigation",
];

export const WANTED_FIELDS_OF_PASSAGES_TO_SAVE = [
	"Passage ID",
	"Description",
	"Author",
	"Genre",
	"Lexile",
	"Node",
	"Display Order",
	"Source",
];

export const WANTED_FIELDS_OF_PRODUCT_LABELS_TO_SAVE = [
	"Label",
	"Display Order",
];

export const FILTER_DATA_TO_GET_AUTOMATION_FILES = {
	filter: {
		$and: [{ categories: CATAGORY_AUTOMATION_FILES }],
	},
};

export const FILTER_DATA_TO_GET_ASSIGNMENTS_WITH_PARENT_ID = {
	filter: {
		lessons: {
			$elemMatch: {
				lessonId: "",
			},
		},
		productID: "",
	},
};

export const FILTER_DATA_TO_GET_CHAPTER_ENTITY = {
	filter: {
		type: {
			$in: [],
		},
		parents: {
			$elemMatch: {
				parentId: "",
			},
		},
	},
};

export const ADD_NEW_UNIT = "Add New Unit";
export const ADD_NEW_CHAPTER = "Add New Chapter";
export const ADD_NEW_LESSON = "Add New Lesson";
export const TYPES = {
	subject: "subject",
	unit: "unit",
	chapter: "chapter",
	lesson: "lesson",
	sublesson: "sublesson",
};

export const DEFAULT_DATA_OF_CHAPTER_ENTITY = [
	{
		title: "",
		author_name: "",
		type: "",
		parents: [
			{
				parentId: "",
				parentType: "",
				childIndex: 0,
				relationship_data: JSON.stringify({}),
			},
		],
		author_id: "",
		presentation_data: "",
		categories: [],
	},
];

export const CHILD_VAULES_TO_OMIT_FOR_CHILDINDEX = [
	"select",
	"addNewChapter",
	"lesson5language",
	"lesson4thirdread",
	"lesson3secondread",
	"lesson2firstread",
	"lesson1preview",
	"addNewLesson",
	"addNewUnit",
	"",
];

export const BASE_FIELDS_EXCLUDE_TO_SAVE_ASSIGNMENTS = [
	"id",
	"active",
	"createdAt",
	"isSubAssign",
	"tagId",
	"version",
	"updatedAt",
	"passage_ids",
	"syncID",
];

export const FIELDS_IN_PRESENTATION_DATA_EXCLUDE_TO_SAVE_ASSIGNMENTS = [
	SUB_LESSON_TYPE,
	"assessment_type",
	"assessment_subtype",
	"isSkillSet",
];

export const FIELD_REQUIRED_TO_SAVE_NEW_PROBLEM = "_id";
export const ANSWER_PLACEHOLDER_OF_DRAG_AND_DROP_1_FROM_MULTIPART = "$";
export const DROP_PATTERN_START_OF_DRAG_AND_DROP_1_FROM_MULTIPART = "|[";
export const DROP_PATTERN_KEY_OF_DRAG_AND_DROP_1_FROM_MULTIPART =
	DROP_PATTERN_START_OF_DRAG_AND_DROP_1_FROM_MULTIPART;
export const DROP_PATTERN_END_OF_DRAG_AND_DROP_1_FROM_MULTIPART = "]|";
export const DROP_INDICATOR_OF_DRAG_AND_DROP_1_FROM_MULTIPART = "|[%id]|";

export const DROPDOWN_TYPES = {
	DEFAULT: 0,
	ONE: 1, // Lesson Drop down not present on Qa2 or QA1, Also In Import spreadsheet 'Product TOC' tab not having any Entry in Sub-Lesson (Sibling) column
	TWO: 2, // Lesson and Unit Drop down not present on Qa2 or QA1, Also In Import spreadsheet 'Product TOC' tab not having any Entry in Sub-Lesson (Sibling) column and Unit (Parent) column having only one Unique value
	THREE: 3, // Lesson and Chapter Drop down not present on Qa2 or QA1, Also In Import spreadsheet 'Product TOC' tab not having any Entry in Sub-Lesson (Sibling) and Lesson (Child) columns
	FOUR: 4, // Unit Drop down not present on Qa2 or QA1, Also In Import spreadsheet 'Product TOC' tab contain unique unit value in Unit (Parent) column and columns Lesson (Child), Sub-Lesson (Sibling) having multiple values
};

export const NONE_AUTO_NUMBERING = "None (Auto Numbering)";
export const NOT_NUMBERED = "Not Numbered";
export const USER_DEFINED_NUMBERING = "User Defined Numbering";
export const AUTO_NUMBERING = "Auto Numbering";
export const NUMBER_OPTION_FIELD = "numberOption";
export const CARRY_FORWARD_FROM_ID_FIELD = "carryForwardFromId";
export const BORDER_TREATMENT_FIELD = "borderTreatment";
export const LABEL_FIELD = "label";
export const SHOULD_CARRY_FORWARD_FIELD = "shouldCarryForward";
export const DEFAULT_RESPONSE_VALUE_FIELD = "defaultResponseValue";
export const QUESTION_NUMBER_FIELD = "qNumber";
export const PRESENTATION_DATA = "presentation_data";
export const OBJECT_EDITOR_CHAPTER_NAME = "Object Editor Chapter Name";

export const SELECT = "Select";
export const ANNOTATIONS = "Annotations";
export const RESPONSE_ONLY = "Response Only";
export const PARTICIPATION_ONLY = "Participation Only";
export const RESPONSE_AND_PARTICIPATIONS = "Response/Participation";
export const PASSAGE_ID_FIELD = "passageID";

export const MAX_TEXT_POINTS = "Max Text Points:";
export const MAX_RESPONSE_POINTS = "Max Response Points:";
export const MAX_PARTICIPATION_POINTS = "Max Participation Points:";
export const RESPONSE_RUBRIC = "Response Rubric:";
export const LANGUAGE_RUBRIC = "Language Rubric:";
export const SHOW_RUBRIC = "Show Rubric";
export const ALLOW_TEACHER_FEEDBACK = "Allow Teacher Feedback";
export const STANDARDS = "Standards:";

export const MAX_TEXT_POINTS_FIELD = "max_text_points";
export const SHOW_RUBRIC_FIELD = "show_rubric";
export const ALLOW_TEACHER_FEEDBACK_FIELD = "allow_teacher_feedback";
export const RUBRIC_CONTENT_FIELD = "rubric_content";
export const ANNOTATION_RUBRIC_FIELD = "rubric";
export const RESPONSE_RUBRIC_FIELD = "response_rubric";
export const PARTICIPATION_RUBRIC_FIELD = "participation_rubric";
export const RUBRIC_FIELDS = [
	ANNOTATION_RUBRIC_FIELD,
	RESPONSE_RUBRIC_FIELD,
	PARTICIPATION_RUBRIC_FIELD,
];

export const MAX_RESPONSE_POINTS_FIELD = "max_response_points";
export const SHOW_RESPONSE_RUBRIC_FIELD = "show_response_rubric";
export const RESPONSE_RUBRIC_CONTENT_FIELD = "response_rubric_content";

export const MAX_PARTICIPATION_POINTS_FIELD = "max_participation_points";
export const SHOW_PARTICIPATION_RUBRIC_FIELD = "show_participation_rubric";
export const PARTICIPATION_RUBRIC_CONTENT_FIELD =
	"participation_rubric_content";

export const CUSTOM_RUBRIC_LIST = ["Custom Rubric List"];
export const CONTAINS_ASSESSMENTS_TEXT = "Contains Assessments:";

export const COLUMN_NAMES_WITHIN_REPORTS_LABLES_TAB = [
	"Dropdown Type",
	"Dropdown Label",
];

export const IS_SCOREABLE_TEMPLATE_ATTRIBUTE = "isScoreable";
export const CONSIDER_QUESTION_WISE_POINT_FIELD = "considerQuestionWisePoint";

export const SCORES_GRADES = "scoresGrades";
export const SCORES_GRADES_PAGE = "scoresGradesPage";
export const SCORES_GRADES_PAGE_ROUTE = "updateScoreAndGrades";
export const SCORES_GRADES_PAGE_TITLE = "Update Scores & Grades";
export const DOWNLOAD_SAMPLE_JSON_BUTTON_TEXT = "DOWNLOAD SAMPLE JSON";
export const SCORE_AND_GRADING_SAMPLE_FILE_NAME = "Score&Grading_Sample.json";
export const PRIORITY = "priority";
export const DEFAULT = "default";
export const LESSON_NAME_MUST_CONTAIN_ARRAY = "lesson_name_must_contain_array";
export const CHAPTER_NAME_MUST_CONTAIN_ARRAY =
	"chapter_name_must_contain_array";
export const UNIT_NAME_MUST_CONTAIN_ARRAY = "unit_name_must_contain_array";
export const POINT_OPTION_TEXT = "point_option";
export const POINTS = "points";
export const GRADING_TYPE_KEY = "gradingType";
export const SHOW_RUBRIC_KEY = "showRubric";
export const GRADING = "Grading";
export const OPEN_ENDED = "Open-Ended";
export const INTERACTIVE = "Interactive";
export const POINT_OPTION_VALUES = [
	"point_per_question",
	"point_per_tab",
	"point_per_assignment",
];
export const SCORE_AND_GRADING_SAMPLE_JSON = {
	type: "console_only",
	autoScoringOptions: {
		scoreObject: {
			Radio: 1,
			Check: 1,
			MultiPartWithOnlyDragAndDrop: 1,
			EditingTasksChoice: 1,
		},
		updateScoreForTemplates: [
			"EditingTasksChoice",
			"MultiPartWithOnlyDragAndDrop",
			"Radio",
			"Check",
			"MultiTab",
		],
	},
	gradingOptions: [
		{
			point_option: "point_per_question",
			points: 2,
			subLessonType: "Exercise",
			subLessonIndex: 0,
			gradingType: "Response Only",
		},
		{
			point_option: "point_per_question",
			points: 2,
			subLessonType: "Exercise",
			subLessonIndex: 1,
			gradingType: "Response Only",
		},
		{
			point_option: "point_per_assignment",
			points: 3,
			subLessonType: "Exercise",
			subLessonIndex: 6,
			gradingType: "Response Only",
		},
		{
			point_option: "point_per_question",
			points: 1,
			subLessonType: "default",
			gradingType: "Response Only",
		},
	],
};

export const CONNECTIONS_SUB_LESSON_HEAD_TEXTS = [
	[
		{
			text: "Preview",
		},
		{
			text: "Making Connections",
		},
	],
	[
		{
			text: "Read",
		},
		{
			text: "Discuss",
		},
		{
			text: "Vocabulary",
		},
		{
			text: "Focus On",
		},
		{
			text: "Self Check",
		},
	],
	[
		{
			text: "Read",
		},
		{
			text: "Discuss",
		},
		{
			text: "Focus On",
		},
		{
			text: "Self Check",
		},
	],
	[
		{
			text: "Read",
		},
		{
			text: "Discuss",
		},
		{
			text: "Focus On",
		},
		{
			text: "Self Check",
		},
	],
	[
		{
			text: "Language",
		},
		{
			text: "Write",
		},
	],
	[
		{
			text: "Read",
		},
	],
	[
		{
			text: "Read",
		},
	],
	[
		{
			text: "Read",
		},
	],
	[
		{
			text: "Read",
		},
	],
];

export const PRODUCT_STRUCTURE = "productStructure";
export const PRODUCT_STRUCTURE_PAGE = "productStructurePage";
export const PRODUCT_STRUCTURE_PAGE_ROUTE = "downloadProductStructure";
export const PRODUCT_STRUCTURE_PAGE_TITLE = "Download Product Structure";

export const ID_COLUMN_NAME = "ID";
export const INDEX_COLUMN_NAME = "INDEX";
export const NAME_COLUMN_NAME = "Name";
export const TYPE_COLUMN_NAME = "Type";
export const SUBTYPE_COLUMN_NAME = "SubType";

export const UNIT_INDEX_COLUMN_NAME = "Unit INDEX";
export const UNIT_ID_COLUMN_NAME = "Unit ID";
export const UNIT_NAME_COLUMN_NAME = "Unit Name";
export const CHAPTER_INDEX_COLUMN_NAME = "Chapter INDEX";
export const CHAPTER_ID_COLUMN_NAME = "Chapter ID";
export const CHAPTER_NAME_COLUMN_NAME = "Chapter Name";
export const LESSON_INDEX_COLUMN_NAME = "Lesson INDEX";
export const LESSON_ID_COLUMN_NAME = "Lesson ID";
export const LESSON_NAME_COLUMN_NAME = "Lesson Name";
export const ASSIGNMENT_INDEX_COLUMN_NAME = "Assignment INDEX";
export const ASSIGNMENT_ID_COLUMN_NAME = "Assignment ID";
export const PROBLEM_INDEX_COLUMN_NAME = "Problem INDEX";
export const UNIQUE_KEY_COLUMN_NAME = "Unique Key";
export const TEMPLATE_TYPE_COLUMN_NAME = "Template Type";
export const PROBLEM_ID_COLUMN_NAME = "Problem ID";
export const TEMPLATE_TYPE_1_COLUMN_NAME = "Template Type1";
export const PROBLEM_ID_1_COLUMN_NAME = "Problem ID1";
export const TEMPLATE_TYPE_2_COLUMN_NAME = "Template Type2";
export const PROBLEM_ID_2_COLUMN_NAME = "Problem ID2";
export const PROBLEM_QUESTION_TEXT_COLUMN_NAME = "Question Text";
export const PROBLEM_ANSWER_TEXT_COLUMN_NAME = "Answer Text";
export const ASSESSMENT_TYPE_COLUMN_NAME = "Assessment Type";
export const ASSESSMENT_SUBTYPE_COLUMN_NAME = "Assessment SubType";
export const SKILLS_COLUMN_NAME = "Skills";
export const SCORE_COLUMN_NAME = "Points";
export const ENABLE_RESPONSE_STYLE_COLUMN_NAME = "Enable Response Styling";
export const ENTRY_FEILD_SIZE_COLUMN_NAME = "Entry Field Size";
export const ALLOW_RESIZE_COLUMN_NAME = "Allow resizing";
export const ENABLE_RUBRIC_COLUMN_NAME = "Enable a Rubric";
export const QUESTION_WISE_GRADING_ENABLED_COLUMN_NAME =
	"Question wise grading enabled";
export const RUBRIC_TITLE_COLUMN_NAME = "Rubric List";
export const TAB_VIEW_COLUMN_NAME = "Tab View";
export const RUBRIC_ID_COLUMN_NAME = "Rubric ID";
export const RUBRIC_PROBLEM_LIST_COLUMN_NAME = "Rubric Problem List";
export const SHARABLE_OPTIONS_COLUMN_NAME = "Sharable Options";
export const CONDENSED_MODE_COLUMN_NAME = "Condensed Mode";
export const REACT_POINTS_COLUMN_NAME = "React Points";
export const REACT_SHAREOPTION_COLUMN_NAME = "React Share Option";

export const SUB_LESSON_NAME_COLUMN_NAME = "Sub-lesson Name";
export const SUB_LESSON_INDEX_COLUMN_NAME = "Sub-lesson Index";
export const PROBLEM_TYPES_COLUMN_NAME = "Problem types";
export const PRODUCT_TAB_COLUMN_NAME = "Product Tab";
export const OLD_PROBLEM_TYPES_COLUMN_NAME = "Old Problem types";
export const OLD_PRODUCT_TAB_COLUMN_NAME = "Old Product Tab";
export const SCREEN_ID_COLUMN_NAME = "Screen Id";
export const SHOULD_IMPORT_COLUMN_NAME = "Should Import";
export const PREFIX_COLUMN_NAME = "Prefix";
export const PREFIX_PARENT_COLUMN_NAME = "Prefix Parent";
export const SUBLESSON_ICON_COLUMN_NAME = "Sublesson Icon";
export const ASSINGNMENT_TYPE = "type";
export const COMBINE_INFO_COLUMN_NAME = "Combine Info";
export const SHOULD_UPDATE_COLUMN_NAME = "Should Update";
export const INCLUDE_EXPOSITORY_TEXT_COLUMN_NAME = "Include Expository Text";
export const VARIATION_WITHIN_MULTITAB_COLUMN_NAME =
	"Variation Within MultiTab";
export const SR_COLUMN_NAME = "Sr";

export const COLUMN_SEQUENCE_FOR_PRODUCT_STRUCTURE = [
	UNIT_NAME_COLUMN_NAME,
	UNIT_INDEX_COLUMN_NAME,
	UNIT_ID_COLUMN_NAME,
	CHAPTER_NAME_COLUMN_NAME,
	CHAPTER_INDEX_COLUMN_NAME,
	CHAPTER_ID_COLUMN_NAME,
	LESSON_NAME_COLUMN_NAME,
	LESSON_INDEX_COLUMN_NAME,
	LESSON_ID_COLUMN_NAME,
	ASSIGNMENT_INDEX_COLUMN_NAME,
	ASSIGNMENT_ID_COLUMN_NAME,
	PROBLEM_INDEX_COLUMN_NAME,
	UNIQUE_KEY_COLUMN_NAME,
	TEMPLATE_TYPE_COLUMN_NAME,
	PROBLEM_ID_COLUMN_NAME,
];
export const DYNAMIC_OBJECT_KEY_VALUES = [
	"columnName",
	"columnNameToBeAddedAfter",
];
export const DYNAMIC_COLUMN_NAMES_FOR_PRODUCT_STRUCTURE = {
	[ASSESSMENT_TYPE_COLUMN_NAME]: {
		[DYNAMIC_OBJECT_KEY_VALUES[0]]: [ASSESSMENT_TYPE_COLUMN_NAME],
		[DYNAMIC_OBJECT_KEY_VALUES[1]]: ASSIGNMENT_ID_COLUMN_NAME,
	},
	[ASSESSMENT_SUBTYPE_COLUMN_NAME]: {
		[DYNAMIC_OBJECT_KEY_VALUES[0]]: [ASSESSMENT_SUBTYPE_COLUMN_NAME],
		[DYNAMIC_OBJECT_KEY_VALUES[1]]: ASSESSMENT_TYPE_COLUMN_NAME,
	},
	[TEMPLATE_TYPE_1_COLUMN_NAME]: {
		[DYNAMIC_OBJECT_KEY_VALUES[0]]: [
			TEMPLATE_TYPE_1_COLUMN_NAME,
			PROBLEM_ID_1_COLUMN_NAME,
		],
		[DYNAMIC_OBJECT_KEY_VALUES[1]]: PROBLEM_ID_COLUMN_NAME,
	},
	[TEMPLATE_TYPE_2_COLUMN_NAME]: {
		[DYNAMIC_OBJECT_KEY_VALUES[0]]: [
			TEMPLATE_TYPE_2_COLUMN_NAME,
			PROBLEM_ID_2_COLUMN_NAME,
		],
		[DYNAMIC_OBJECT_KEY_VALUES[1]]: PROBLEM_ID_1_COLUMN_NAME,
	},
};
export const COLUMN_SEQUENCE_TO_SORT_PRODUCT_STRUCTURE = [
	UNIT_INDEX_COLUMN_NAME,
	CHAPTER_INDEX_COLUMN_NAME,
	LESSON_INDEX_COLUMN_NAME,
	ASSIGNMENT_INDEX_COLUMN_NAME,
	PROBLEM_INDEX_COLUMN_NAME,
];

export const COLUMN_SEQUENCE_FOR_UNIQUE_KEY = [
	UNIT_ID_COLUMN_NAME,
	CHAPTER_ID_COLUMN_NAME,
	LESSON_ID_COLUMN_NAME,
	ASSIGNMENT_ID_COLUMN_NAME,
	PROBLEM_INDEX_COLUMN_NAME,
	PROBLEM_ID_COLUMN_NAME,
	PROBLEM_ID_1_COLUMN_NAME,
	PROBLEM_ID_2_COLUMN_NAME,
];

export const PRODUCT_IDS_VALUES_CAN_UPDATED_THROUGH_UPLOAD_PRODUCT_STURCTURE = [
	"T3814D_Algebra_1",
	"T3816D_Algebra_2",
	"T3815D",
];

export const UPLOAD_PRODUCT_STRUCTURE = "uploadProductStructure";
export const UPLOAD_PRODUCT_STRUCTURE_PAGE = "uploadProductStructurePage";
export const UPLOAD_PRODUCT_STRUCTURE_PAGE_ROUTE = "uploadProductStructure";
export const UPLOAD_PRODUCT_STRUCTURE_PAGE_TITLE = "Upload Product Structure";
export const DELETE_EXISTING_PRODUCT_STRUCTURE =
	"Delete Existing Product Structure";
export const NOTE_WHEN_EXISTING_STRUCTURE_PRESENT = `NOTE: Unit structure is already present. Please add structure of different Units or delete Existing structure using "${DELETE_EXISTING_PRODUCT_STRUCTURE}" button.`;

export const UPDATE_PRODUCT_STRUCTURE = "updateProductStructure";
export const UPDATE_PRODUCT_STRUCTURE_PAGE = "updateProductStructurePage";
export const UPDATE_PRODUCT_STRUCTURE_PAGE_ROUTE = "updateProductStructure";
export const UPDATE_PRODUCT_STRUCTURE_PAGE_TITLE =
	"Update Product Structure Values";
export const PRODUCT_NAME = "T4309D";
export const PRODUCT_INFORMATION_KEY = "productInformation";
export const PRODUCT_STRUCTURE_KEY = "productStructure";
export const INSTALLABLE_PRODUCT_STRUCTURE_KEY = "installableProductStructure";
export const DATA_STRUCTURE_KEY = "dataStructure";

export const PRODUCT_ID_COLUMN_HEADING = "Product ID";

export const UNIT_COLUMN_HEADING = "Unit";
export const UNIT_INDEX_COLUMN_HEADING = "Unit Index";
export const CHAPTER_COLUMN_HEADING = "Chapter";
export const CHAPTER_INDEX_COLUMN_HEADING = "Chapter Index";
export const LESSON_COLUMN_HEADING = "Lesson";
export const LESSON_INDEX_COLUMN_HEADING = "Lesson Index";
export const SUBLESSON_TYPE_COLUMN_HEADING = "Sublesson Type";
export const SUBLESSON_INDEX_COLUMN_HEADING = "Sublesson Index";
export const PROBLEM_INDEX_COLUMN_HEADING = "Problem Index";
export const UNIQUE_KEY_FROM_TAB_MENTIONED_IN_TAB_TO_REFER_COLUMN_COLUMN_HEADING =
	"Unique Key From Tab Mentioned in Tab To Refer Column";
export const PROBLEM_UNIQUE_ID_COLUMN_HEADING = "Problem Unique ID";
export const OLD_PROBLEM_UNIQUE_ID_COLUMN_HEADING = "Old Problem Unique ID";
export const TAB_TO_REFER_COLUMN_HEADING = "Tab To Refer";
export const REFERRING_INFORMATION_KEY = "refferingInfo";
export const ROWDATA_FIELD = "rowData";

export const NO_UPDATE = "NO_UPDATE";
export const MODIFY = "MODIFY";
export const CREATE = "CREATE";
export const METHODS_USED_IN_CREATING_PRODUCT_STRUCTURE = [
	NO_UPDATE,
	CREATE,
	MODIFY,
];

export const FIELDS_REQUIRED_TO_MODIFY_CHAPTER_DB_ENTITY = [
	"title",
	"author_name",
	"author_id",
	"id",
];

export const MANDATARY_COLUMN_HEADINGS_FOR_MANDATORY_TABS_UPLOAD_PRODUCT_RELATED_SPREADSHEET =
	{
		[PRODUCT_INFORMATION_KEY]: [PRODUCT_ID_COLUMN_HEADING],
		[PRODUCT_STRUCTURE_KEY]: [
			UNIT_COLUMN_HEADING,
			UNIT_INDEX_COLUMN_HEADING,
			CHAPTER_COLUMN_HEADING,
			CHAPTER_INDEX_COLUMN_HEADING,
			LESSON_COLUMN_HEADING,
			LESSON_INDEX_COLUMN_HEADING,
			SUBLESSON_TYPE_COLUMN_HEADING,
			SUBLESSON_INDEX_COLUMN_HEADING,
			PROBLEM_INDEX_COLUMN_HEADING,
			UNIQUE_KEY_FROM_TAB_MENTIONED_IN_TAB_TO_REFER_COLUMN_COLUMN_HEADING,
			TAB_TO_REFER_COLUMN_HEADING,
		],
		[INSTALLABLE_PRODUCT_STRUCTURE_KEY]: [
			/*SUB_LESSON_NAME_COLUMN_NAME, SUB_LESSON_INDEX_COLUMN_NAME, */ PREFIX_COLUMN_NAME,
			PROBLEM_TYPES_COLUMN_NAME,
			/*SCREEN_ID_COLUMN_NAME, */ PRODUCT_TAB_COLUMN_NAME,
			SHOULD_IMPORT_COLUMN_NAME /*CHAPTER_NAME_COLUMN_NAME, LESSON_NAME_COLUMN_NAME, NAME_COLUMN_NAME*/,
		],
	};
export const MANDATARY_COLUMN_HEADINGS_FOR_REFERENCE_TABS_UPLOAD_PRODUCT_RELATED_SPREADSHEET =
	[UNIQUE_KEY_COLUMN_NAME, PROBLEM_ID_COLUMN_NAME];

export const TEMPLATES_MAPPING_FOR_CREATE_PRODUCT_USING_SPREADSHEET = {
	// if any one need to add new entry please add at the end. Since we have used keys indexes.
	whiteboard: ["whiteboard", "blackboard"],
	activity: ["activity_frame"],
	quickcheck: [
		"radio",
		"check",
		"input",
		"MultKinetic",
		"multi_part_answer",
		"essay",
	],
	"kinetic homework": ["radio", "check", "input", "MultKinetic"],
	video: ["video"],
	grading: ["grading"],
	// 'expository text': ['expository_text'],
};

export const PROBLEM_ID_PROBLEM_TYPE = "Problem ID";
export const QUICKCHECK_PROBLEM_TYPE = keys(
	TEMPLATES_MAPPING_FOR_CREATE_PRODUCT_USING_SPREADSHEET
)[2];
export const KINETIC_HOMEWORK_PROBLEM_TYPE = keys(
	TEMPLATES_MAPPING_FOR_CREATE_PRODUCT_USING_SPREADSHEET
)[3];
export const WHITEBOARD_PROBLEM_TYPE = keys(
	TEMPLATES_MAPPING_FOR_CREATE_PRODUCT_USING_SPREADSHEET
)[0];
export const KINETIC_HOMEWORK_NAME_COLUMN_VALUE = "Kinetic Homework";
export const END_OF_UNIT_DATA_NAME_COLUMN_VALUE = "End Of the Unit";
export const END_OF_UNIT_NAME_COLUMN_VALUE = "End Of Unit Problem";
export const ACTIVITY_PROBLEM_TYPE = keys(
	TEMPLATES_MAPPING_FOR_CREATE_PRODUCT_USING_SPREADSHEET
)[1];
export const INTERACTIVE_PROBLEMS_NAME_COLUMN_VALUE = "Interactive Problems";

export const TEMPLATES_USED_TO_DISTINGUISH = [
	...uniq(
		flatten(
			map(
				keys(TEMPLATES_MAPPING_FOR_CREATE_PRODUCT_USING_SPREADSHEET),
				(key) => TEMPLATES_MAPPING_FOR_CREATE_PRODUCT_USING_SPREADSHEET[key]
			)
		)
	),
];

export const UNIQUE_SUBLESSON_NAMES = [
	"Read",
	"Discuss",
	"Vocabulary",
	"Focus On",
	"Self Check",
	"Language",
	"Write",
	"Preview",
	"Making Connections",
];

export const REGEX_TO_FIND_LAST_WORD = / (?=[^ ]*$)/i;

export const IMPORT_FROM_PRODUCT_ID_COLUMN_HEADING = "Import From Product ID";
export const MANDATARY_COLUMN_HEADINGS_FOR_MANDATORY_TABS_IMPORT_PRODUCT_RELATED_SPREADSHEET =
	{
		[PRODUCT_INFORMATION_KEY]: [PRODUCT_ID_COLUMN_HEADING],
		[DATA_STRUCTURE_KEY]: [
			IMPORT_FROM_PRODUCT_ID_COLUMN_HEADING,
			UNIT_COLUMN_HEADING,
		],
	};

export const FIND_NUMBERS_WITHIN_STRING_REGEX = new RegExp(/\d+/g);
export const BLUE_INTRO_TEXT_REGEX = new RegExp(/Blue Intro text/gi);
export const EXPOSITORY_TEXT_REGEX = new RegExp(/Only Expository Text/gi);
export const BLUE_INTRO_TEXT_PROBLEM_INDEX = [0];
export const COMBINE_TEXT_REGEX = new RegExp(/combine/gi);
export const CONDITION = "Condition";
export const COLUMN_DATA_REQURIED_FOR_INSTALLABLE_PRODUCT_STRUCTURE_KEY = [
	CONDITION,
	NAME_COLUMN_NAME,
	SCREEN_ID_COLUMN_NAME,
	SUB_LESSON_NAME_COLUMN_NAME,
	SUB_LESSON_INDEX_COLUMN_NAME,
	PREFIX_COLUMN_NAME,
	PROBLEM_TYPES_COLUMN_NAME,
	PRODUCT_TAB_COLUMN_NAME,
	SHOULD_IMPORT_COLUMN_NAME,
	CHAPTER_NAME_COLUMN_NAME,
	LESSON_NAME_COLUMN_NAME,
	PROBLEM_UNIQUE_ID_COLUMN_HEADING,
	OLD_PRODUCT_TAB_COLUMN_NAME,
	OLD_PROBLEM_TYPES_COLUMN_NAME,
	PREFIX_PARENT_COLUMN_NAME,
	SUBLESSON_TYPE_COLUMN_HEADING,
	SUBLESSON_ICON_COLUMN_NAME,
	OLD_PROBLEM_UNIQUE_ID_COLUMN_HEADING,
	COMBINE_INFO_COLUMN_NAME,
	SHOULD_UPDATE_COLUMN_NAME,
	INCLUDE_EXPOSITORY_TEXT_COLUMN_NAME,
	VARIATION_WITHIN_MULTITAB_COLUMN_NAME,
	SR_COLUMN_NAME,
];

export const CREATE_PROBLEM_POPUP_MESSAGES_PRODUCT_ID_SELECTION = {
	rubric: "Please select Product for which you want to create Rubric.",
	grading:
		"Please select Program series from which you want to add Rubric into Current Selected Template Object.",
};

export const CREATE_PROBLEM_POPUP_MESSAGES_PROGRAM_SERIES_SELECTION = {
	rubric: "Please select Program series for which you want to create Rubric.",
};

export const MULTITAB_UPDATE_TYPES = [
	"isOnlyWhiteBoard",
	"isOnlyQuickCheck",
	"isKineticHomeWork",
];
export const ACTIVITY_UPDATE_TYPES = ["combineActivitiesIntoOne"];
export const TEMPLATE_TYPE_MULTITAB = "multiTab";
export const TEMPLATE_TYPE_ACTIVITY_FRAME = "activity_frame";
export const TEMPLATE_TYPE_DOCUMENT_SELECTOR = "documentSelector";
export const SELECT_OPTION_TEXT = "Select";

export const LANGUAGE_KEY = "Language";
export const ISO_CODE_KEY = "ISO Code";
export const SORT_ORDER_KEY = "Sort Order";
export const VISIBLE_KEY = "Visible";
export const CAPTIONS_KEY = "captions";
export const LABEL_KEY = "label";
export const KIND_KEY = "kind";
export const SRCLANG_KEY = "srclang";
export const SRC_KEY = "src";

export const HEADING = "heading";
export const OPTION = "option";

export const UPDATE_TYPE = { ADD: "Add", DELETE: "Delete", UPDATE: "Update" };
export const CAPTIONS_UPDATE_TYPES = ["Add", "Delete", "Update"];
export const PROPERTIES_TO_MAP_IN_ACTIVITY_FRAME = [
	"problemList",
	"tabName",
	"activityHeaderText",
	"combineProblems",
	"frameURL",
];

export const PAGINATION_MULTITAB_TYPE = "Pagination";
export const DEFAULT_MULTITAB_TYPE = "Default";

export const TEXT_ANNOTATION_PLACEMENT_HEADING = "Text Annotation Placement:";
export const TEXT_ANNOTATION_PLACEMENT_FIELD = "textAnnotationPlacement";
export const TEXT_ANNOTATION_PLACEMENT_NOTE =
	"If other than Default option selected in dropdown then it will override Text Annotation options mentioned in individual Text Annotation object for placement.";

export const ANSWER_WISE_INFO_NEEDED_HEADING = "Answer wise Info Needed:";
export const SKILLS_HEADING = "Skills";
export const STANDARDS_HEADING = "Standards";
export const POINT_HEADING = "Point";
export const ANSWER_WISE_TAGS_AND_STANDATADS_NEEDED_NOTE = `If we toggle the field ${SKILLS_HEADING}, ${STANDARDS_HEADING} and ${POINT_HEADING} get reset.`;
export const ANSWER_WISE_INFO_NEEDED_FIELD = "answer_wise_information_needed";
export const ANSWER_WISE_INFO_FIELD = "answer_wise_info";
export const DISPLAY_TYPE = "display_type";
export const ANSWER_WISE_TAGS_HEADING = "Answer wise Info:";
export const CANNOT_ADD_CELL_CONTENT = "--";
export const TAGS_FIELD = "tags";
export const STANDARDS_FIELD = "standards";
export const POINT_FIELD = "point";
export const CONSOLIDATED_FIELDS_NEED_TO_UPDATE_IN_TEMPLATE = [
	TAGS_FIELD,
	STANDARDS_FIELD,
	POINT_FIELD,
];
export const DEFAULT_VALUES_CONSOLIDATED_FIELDS_IN_TEMPLATE = {
	[TAGS_FIELD]: {},
	[STANDARDS_FIELD]: [],
	[POINT_FIELD]: 0,
};
export const ANSWER_WISE_FIELDS_NEEDS_TO_PERSISTS = [
	ANSWER_WISE_INFO_NEEDED_FIELD,
	ANSWER_WISE_INFO_FIELD,
];

export const ANSWER_WISE_INFO_MANIPULATION_TYPES = ["UPDATE", "DELETE"];

export const PART_ID_FIELD = "part_id";

export const xlsxConfig = {
	header: 1,
};

export const LESSON_NAMES_MAPPPING_CONSTANT = [
	{
		Preview: "Preview Concepts",
	},
];

export const EMPTY_COLUMN_VALUE = "EMPTY";

export const PROGRAM_SERIES_FIELD = "Program Series";

export const KEYS_WITHIN_PRESENTATION_DATA_PRESENT_FOR_ONLY_ONE_UNIT = {
	PRODUCT_INFO_KEY: "productInfo",
	PROGRAM_CATEGORIES_KEY: "programCategories",
	REPORT_LABELS_KEY: "reportsLabels",
};

export const BORDER_TREATMENT_OPTIONS = {
	NO_BORDER: "No Border",
	YELLOW: "Yellow",
	TEAL: "Teal",
};

export const ESCAPED_COMMA_REGEX = /\\,/g;
export const ESCAPED_CHARACTER_SUBSTITUTE = "#NOBREAKING#";
export const ESCAPED_CHARACTER_SUBSTITUTE_REGEX = new RegExp(
	ESCAPED_CHARACTER_SUBSTITUTE,
	"g"
);
export const COMMA_STRING = ",";
export const ASSOCIATED_TYPE = "associatedType";
export const ASSOCIATED_ID = "associatedId";
export const LOCATION = "location";
export const STUDENT_VISIBILITY = "student Visibility";

export const SUB_GRADING_GROUP_ID = "subGradingGroupId";
export const IS_SUB_GRADING_GROUP_ID_ENABLED = "isSubGradingGroupIdEnabled";
export const SUB_GRADING_GROUP_ID_STYLE = "subGradingGroupIdStyle";

export const SET_SUB_GRADING_GROUP_ID = "SET_SUB_GRADING_GROUP_ID ";
export const SET_IS_SUB_GRADING_GROUP_ID_ENABLED =
	"SET_IS_SUB_GRADING_GROUP_ID_ENABLED ";
export const SET_SUB_GRADING_GROUP_ID_STYLE = "SET_SUB_GRADING_GROUP_ID_STYLE ";

export const SUB_GRADING_GROUP_ID_STYLE_OPTIONS = ["(a)","Part A"];

export const TEXT_ANNOTATION_PLACEMENT_REACT_FIELD =
	"textAnnotationPlacementReact";

export const DEFAULT_SHOW_PASSAGES_ON_THE_LEFT =
	"Default show passages on the left";
export const DEFAULT_SHOW_PASSAGES_ON_THE_RIGHT =
	"Default show passages on the right";

export const textAnnoationPlacementReactDataArray = [
	DEFAULT_SHOW_PASSAGES_ON_THE_RIGHT,
	DEFAULT_SHOW_PASSAGES_ON_THE_LEFT,
];

export const SET_SUB_GRADING_GROUP_ID_IN_RADIO =
	"SET_SUB_GRADING_GROUP_ID_IN_RADIO";
export const SET_IS_SUB_GRADING_GROUP_ID_ENABLED_IN_RADIO =
	"SET_IS_SUB_GRADING_GROUP_ID_ENABLED_IN_RADIO";
export const SET_SUB_GRADING_GROUP_ID_STYLE_IN_RADIO =
	"SET_SUB_GRADING_GROUP_ID_STYLE_IN_RADIO";

export const SET_SUB_GRADING_GROUP_ID_IN_CHECKBOX =
	"SET_SUB_GRADING_GROUP_ID_IN_CHECKBOX";
export const SET_IS_SUB_GRADING_GROUP_ID_ENABLED_IN_CHECKBOX =
	"SET_IS_SUB_GRADING_GROUP_ID_ENABLED_IN_CHECKBOX";
export const SET_SUB_GRADING_GROUP_ID_STYLE_IN_CHECKBOX =
	"SET_SUB_GRADING_GROUP_ID_STYLE_IN_CHECKBOX";

export const SET_SUB_GRADING_GROUP_ID_IN_EDITING_TASK_CHOICE=
	"SET_SUB_GRADING_GROUP_ID_IN_EDITING_TASK_CHOICE";
export const SET_IS_SUB_GRADING_GROUP_ID_ENABLED_IN_EDITING_TASK_CHOICE=
	"SET_IS_SUB_GRADING_GROUP_ID_ENABLED_IN_EDITING_TASK_CHOICE";
export const SET_SUB_GRADING_GROUP_ID_STYLE_IN_EDITING_TASK_CHOICE=
	"SET_SUB_GRADING_GROUP_ID_STYLE_IN_EDITING_TASK_CHOICE";

export const TYPE = 'type';
export const ANS_TYPE = 'ansType';
export const ANSWER_TYPE = 'answer_type';
export const TAB_DATA = 'tabData';

export const INSERTED_DATA_FIELD = 'insertedData';
export const INNER_PROBLEMS_DATA_FIELD = 'innerProblemsData';
export const PROBLEM_ANSWER_FIELD = 'problemAnswerData';
export const PASSAGE_DATA_FIELD = 'passagesData';
export const PASSAGE_INFO_DATA_FIELD = 'passagesInfoData';
export const DEFAULT_MULTI_TAB_GROUP_INFO = {
  insertedData: {
    innerProblemsData: [],
    manipulatedData: true,
    id: -1,
  },
  presentation_data: {
    interactive_frames: [
      {
        point: [],
        problemList: [],
        tabName: '',
      },
    ],
    problemList: [],
    type: 'multiTab',
  },
};

export const GENERATE_LINK_ANCHOR_REGEX = /<a[^>]*href=\"generateLink[^>]*>([^<]+)<\/a>/g;
export const HREF_WITHOUT_ENDING_DOUBLE_QUOTE_REGEX = /href="([^\'\"]+)/g;

export const MAX_NUMBER_OF_IMPORT_PROBLEMS = 30;
export const ERROR_MESSAGE_FOR_IMPORT_PROBLEMS = `This import problem utility only allows ${MAX_NUMBER_OF_IMPORT_PROBLEMS} problems to be imported at a time.`

