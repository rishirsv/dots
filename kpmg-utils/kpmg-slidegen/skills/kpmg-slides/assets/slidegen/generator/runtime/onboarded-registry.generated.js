// GENERATED FILE - DO NOT EDIT DIRECTLY. Source: templates-src/kpmg-diligence/*
import { addAnalysisBridge } from '../builders/analysis-bridge.js';
import { addAnalysisNarrowTable } from '../builders/analysis-narrow-table.js';
import { addAnalysisWideChart2ColsText } from '../builders/analysis-wide-chart-text.js';
import { addAnalysisWideChartTableText } from '../builders/analysis-wide-chart-text.js';
import { addBackCover } from '../builders/back-cover-slide.js';
import { addBusinessOverview } from '../builders/business-overview.js';
import { addContentsSlide } from '../builders/contents-slide.js';
import { addCover } from '../builders/cover-slide.js';
import { addDivider } from '../builders/divider-slide.js';
import { addOneColumnText } from '../builders/one-column-text.js';
import { addTitleStrapline4TextBoxes } from '../builders/title-strapline-4-boxes.js';
import { addTwoColumnTextWithStrapline } from '../builders/two-column-text.js';

export const AUTHORED_REGISTRY_ENTRIES = Object.freeze({
  analysisBridge: Object.freeze({
    "builderId": "analysisBridge",
    "builder": addAnalysisBridge,
    "master": "KPMG_WHITE",
    "requiredGeometry": [
      "titleBox",
      "chartBox",
      "analysisBoxes",
      "sourceBox"
    ],
    "optionalGeometry": [
      "typography"
    ],
    "optionalDefaults": {},
    "geometryKinds": {
      "titleBox": "box",
      "chartBox": "box",
      "analysisBoxes": "boxArray",
      "sourceBox": "box",
      "typography": "object"
    },
    "primitiveMetadata": {
      "id": "analysisBridge",
      "version": 1,
      "slotSchemaRef": "analysisBridge",
      "geometryKinds": {
        "titleBox": "box",
        "chartBox": "box",
        "analysisBoxes": "boxArray",
        "sourceBox": "box",
        "typography": "object"
      }
    },
    "paginationPolicyKey": "bridge.analysisColumns.v1",
    "validationHooks": [
      "bridgeSpec"
    ],
    "excludeFromLogicalPaging": false
  }),
  analysisNarrowTable: Object.freeze({
    "builderId": "analysisNarrowTable",
    "builder": addAnalysisNarrowTable,
    "master": "KPMG_WHITE",
    "requiredGeometry": [
      "titleBox",
      "straplineBox",
      "tableBox",
      "rightTitleBox",
      "rightBodyBox"
    ],
    "optionalGeometry": [
      "noteBox"
    ],
    "optionalDefaults": {},
    "geometryKinds": {
      "titleBox": "box",
      "straplineBox": "box",
      "tableBox": "box",
      "rightTitleBox": "box",
      "rightBodyBox": "box",
      "noteBox": "box"
    },
    "primitiveMetadata": {
      "id": "analysisNarrowTable",
      "version": 1,
      "slotSchemaRef": "analysisNarrowTable",
      "geometryKinds": {
        "titleBox": "box",
        "straplineBox": "box",
        "tableBox": "box",
        "rightTitleBox": "box",
        "rightBodyBox": "box",
        "noteBox": "box"
      }
    },
    "paginationPolicyKey": "table.rows.v1",
    "validationHooks": [
      "tableShape"
    ],
    "excludeFromLogicalPaging": false
  }),
  analysisWideChart2ColsText: Object.freeze({
    "builderId": "analysisWideChart2ColsText",
    "builder": addAnalysisWideChart2ColsText,
    "master": "KPMG_WHITE",
    "requiredGeometry": [
      "titleBox",
      "straplineBox",
      "bodyBox",
      "chartBox"
    ],
    "optionalGeometry": [
      "calloutBoxes"
    ],
    "optionalDefaults": {},
    "geometryKinds": {
      "titleBox": "box",
      "straplineBox": "box",
      "bodyBox": "box",
      "chartBox": "box",
      "calloutBoxes": "boxArray"
    },
    "primitiveMetadata": {
      "id": "analysisWideChart2ColsText",
      "version": 1,
      "slotSchemaRef": "analysisWideChart2ColsText",
      "geometryKinds": {
        "titleBox": "box",
        "straplineBox": "box",
        "bodyBox": "box",
        "chartBox": "box",
        "calloutBoxes": "boxArray"
      }
    },
    "paginationPolicyKey": "text.analysisWide.2cols.v1",
    "validationHooks": [
      "chartShape"
    ],
    "excludeFromLogicalPaging": false
  }),
  analysisWideChartTableText: Object.freeze({
    "builderId": "analysisWideChartTableText",
    "builder": addAnalysisWideChartTableText,
    "master": "KPMG_WHITE",
    "requiredGeometry": [
      "titleBox",
      "straplineBox",
      "headingBox",
      "bodyBox",
      "chartBox",
      "tableBox"
    ],
    "optionalGeometry": [
      "calloutBoxes",
      "noteBox"
    ],
    "optionalDefaults": {},
    "geometryKinds": {
      "titleBox": "box",
      "straplineBox": "box",
      "headingBox": "box",
      "bodyBox": "box",
      "chartBox": "box",
      "tableBox": "box",
      "calloutBoxes": "boxArray",
      "noteBox": "box"
    },
    "primitiveMetadata": {
      "id": "analysisWideChartTableText",
      "version": 1,
      "slotSchemaRef": "analysisWideChartTableText",
      "geometryKinds": {
        "titleBox": "box",
        "straplineBox": "box",
        "headingBox": "box",
        "bodyBox": "box",
        "chartBox": "box",
        "tableBox": "box",
        "calloutBoxes": "boxArray",
        "noteBox": "box"
      }
    },
    "paginationPolicyKey": "text.analysisWide.table.v1",
    "validationHooks": [
      "chartShape",
      "tableShape"
    ],
    "excludeFromLogicalPaging": false
  }),
  backCover: Object.freeze({
    "builderId": "backCover",
    "builder": addBackCover,
    "master": "KPMG_CLOSING",
    "requiredGeometry": [
      "logoBox",
      "headingBox",
      "disclaimerBox",
      "urlBox"
    ],
    "optionalGeometry": [],
    "optionalDefaults": {},
    "geometryKinds": {
      "logoBox": "box",
      "headingBox": "box",
      "disclaimerBox": "box",
      "urlBox": "box"
    },
    "primitiveMetadata": {
      "id": "backCover",
      "version": 1,
      "slotSchemaRef": "backCover",
      "geometryKinds": {
        "logoBox": "box",
        "headingBox": "box",
        "disclaimerBox": "box",
        "urlBox": "box"
      }
    },
    "paginationPolicyKey": "none.v1",
    "validationHooks": [],
    "excludeFromLogicalPaging": true
  }),
  businessOverview: Object.freeze({
    "builderId": "businessOverview",
    "builder": addBusinessOverview,
    "master": "KPMG_WHITE",
    "requiredGeometry": [
      "titleBox",
      "leftHeadingBox",
      "leftBox",
      "rightHeadingBox",
      "bodyBox",
      "chartBox",
      "sourceBox"
    ],
    "optionalGeometry": [],
    "optionalDefaults": {},
    "geometryKinds": {
      "titleBox": "box",
      "leftHeadingBox": "box",
      "leftBox": "box",
      "rightHeadingBox": "box",
      "bodyBox": "box",
      "chartBox": "box",
      "sourceBox": "box"
    },
    "primitiveMetadata": {
      "id": "businessOverview",
      "version": 1,
      "slotSchemaRef": "businessOverview",
      "geometryKinds": {
        "titleBox": "box",
        "leftHeadingBox": "box",
        "leftBox": "box",
        "rightHeadingBox": "box",
        "bodyBox": "box",
        "chartBox": "box",
        "sourceBox": "box"
      }
    },
    "paginationPolicyKey": "business.overviewBody.v1",
    "validationHooks": [
      "businessStructureSpec"
    ],
    "excludeFromLogicalPaging": false
  }),
  contents: Object.freeze({
    "builderId": "contents",
    "builder": addContentsSlide,
    "master": "KPMG_WHITE",
    "requiredGeometry": [
      "titleBox",
      "topRowBox",
      "bottomRowBox"
    ],
    "optionalGeometry": [],
    "optionalDefaults": {},
    "geometryKinds": {
      "titleBox": "box",
      "topRowBox": "box",
      "bottomRowBox": "box"
    },
    "primitiveMetadata": {
      "id": "contents",
      "version": 1,
      "slotSchemaRef": "contents",
      "geometryKinds": {
        "titleBox": "box",
        "topRowBox": "box",
        "bottomRowBox": "box"
      }
    },
    "paginationPolicyKey": "contents.sections.v1",
    "validationHooks": [],
    "excludeFromLogicalPaging": false
  }),
  cover: Object.freeze({
    "builderId": "cover",
    "builder": addCover,
    "master": "KPMG_COVER",
    "requiredGeometry": [
      "titleBox",
      "subtitleBox",
      "photoBox",
      "logoBox"
    ],
    "optionalGeometry": [],
    "optionalDefaults": {},
    "geometryKinds": {
      "titleBox": "box",
      "subtitleBox": "box",
      "photoBox": "box",
      "logoBox": "box"
    },
    "primitiveMetadata": {
      "id": "cover",
      "version": 1,
      "slotSchemaRef": "cover",
      "geometryKinds": {
        "titleBox": "box",
        "subtitleBox": "box",
        "photoBox": "box",
        "logoBox": "box"
      }
    },
    "paginationPolicyKey": "none.v1",
    "validationHooks": [],
    "excludeFromLogicalPaging": true
  }),
  divider: Object.freeze({
    "builderId": "divider",
    "builder": addDivider,
    "master": "KPMG_SECTION_DARK",
    "requiredGeometry": [
      "numberBox",
      "titleBox"
    ],
    "optionalGeometry": [
      "gradientBox"
    ],
    "optionalDefaults": {},
    "geometryKinds": {
      "numberBox": "box",
      "titleBox": "box",
      "gradientBox": "box"
    },
    "primitiveMetadata": {
      "id": "divider",
      "version": 1,
      "slotSchemaRef": "divider",
      "geometryKinds": {
        "numberBox": "box",
        "titleBox": "box",
        "gradientBox": "box"
      }
    },
    "paginationPolicyKey": "none.v1",
    "validationHooks": [],
    "excludeFromLogicalPaging": true
  }),
  dividerDark: Object.freeze({
    "builderId": "dividerDark",
    "builder": addDivider,
    "master": "KPMG_SECTION_DARK",
    "requiredGeometry": [
      "numberBox",
      "titleBox"
    ],
    "optionalGeometry": [
      "gradientBox"
    ],
    "optionalDefaults": {},
    "geometryKinds": {
      "numberBox": "box",
      "titleBox": "box",
      "gradientBox": "box"
    },
    "primitiveMetadata": {
      "id": "dividerDark",
      "version": 1,
      "slotSchemaRef": "dividerDark",
      "geometryKinds": {
        "numberBox": "box",
        "titleBox": "box",
        "gradientBox": "box"
      }
    },
    "paginationPolicyKey": "none.v1",
    "validationHooks": [],
    "excludeFromLogicalPaging": true
  }),
  dividerLight: Object.freeze({
    "builderId": "dividerLight",
    "builder": addDivider,
    "master": "KPMG_SECTION_LIGHT",
    "requiredGeometry": [
      "numberBox",
      "titleBox"
    ],
    "optionalGeometry": [
      "gradientBox"
    ],
    "optionalDefaults": {},
    "geometryKinds": {
      "numberBox": "box",
      "titleBox": "box",
      "gradientBox": "box"
    },
    "primitiveMetadata": {
      "id": "dividerLight",
      "version": 1,
      "slotSchemaRef": "dividerLight",
      "geometryKinds": {
        "numberBox": "box",
        "titleBox": "box",
        "gradientBox": "box"
      }
    },
    "paginationPolicyKey": "none.v1",
    "validationHooks": [],
    "excludeFromLogicalPaging": true
  }),
  oneColumnText: Object.freeze({
    "builderId": "oneColumnText",
    "builder": addOneColumnText,
    "master": "KPMG_WHITE",
    "requiredGeometry": [
      "titleBox",
      "straplineBox",
      "bodyBox",
      "sourceBox"
    ],
    "optionalGeometry": [
      "calloutBoxes"
    ],
    "optionalDefaults": {},
    "geometryKinds": {
      "titleBox": "box",
      "straplineBox": "box",
      "bodyBox": "box",
      "sourceBox": "box",
      "calloutBoxes": "boxArray"
    },
    "primitiveMetadata": {
      "id": "oneColumnText",
      "version": 1,
      "slotSchemaRef": "oneColumnText",
      "geometryKinds": {
        "titleBox": "box",
        "straplineBox": "box",
        "bodyBox": "box",
        "sourceBox": "box",
        "calloutBoxes": "boxArray"
      }
    },
    "paginationPolicyKey": "text.oneColumn.v1",
    "validationHooks": [],
    "excludeFromLogicalPaging": false
  }),
  titleStrapline4TextBoxes: Object.freeze({
    "builderId": "titleStrapline4TextBoxes",
    "builder": addTitleStrapline4TextBoxes,
    "master": "KPMG_WHITE",
    "requiredGeometry": [
      "titleBox",
      "straplineBox",
      "columnBoxes"
    ],
    "optionalGeometry": [],
    "optionalDefaults": {},
    "geometryKinds": {
      "titleBox": "box",
      "straplineBox": "box",
      "columnBoxes": "boxArray"
    },
    "primitiveMetadata": {
      "id": "titleStrapline4TextBoxes",
      "version": 1,
      "slotSchemaRef": "titleStrapline4TextBoxes",
      "geometryKinds": {
        "titleBox": "box",
        "straplineBox": "box",
        "columnBoxes": "boxArray"
      }
    },
    "paginationPolicyKey": "none.v1",
    "validationHooks": [],
    "excludeFromLogicalPaging": false
  }),
  twoColumnText: Object.freeze({
    "builderId": "twoColumnText",
    "builder": addTwoColumnTextWithStrapline,
    "master": "KPMG_WHITE",
    "requiredGeometry": [
      "titleBox",
      "straplineBox",
      "leftBox",
      "rightBox"
    ],
    "optionalGeometry": [],
    "optionalDefaults": {},
    "geometryKinds": {
      "titleBox": "box",
      "straplineBox": "box",
      "leftBox": "box",
      "rightBox": "box"
    },
    "primitiveMetadata": {
      "id": "twoColumnText",
      "version": 1,
      "slotSchemaRef": "twoColumnText",
      "geometryKinds": {
        "titleBox": "box",
        "straplineBox": "box",
        "leftBox": "box",
        "rightBox": "box"
      }
    },
    "paginationPolicyKey": "text.twoColumn.v1",
    "validationHooks": [],
    "excludeFromLogicalPaging": false
  }),
});
