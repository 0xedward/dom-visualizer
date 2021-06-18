/* eslint-disable require-jsdoc */
"use strict";

//TODO: User can navigate to page/graph by link

// function get(name) {
//   if (
//     (name = new RegExp("[?&]" + encodeURIComponent(name) + "=([^&]*)").exec(
//       window.location.search
//     ))
//   )
//     return decodeURIComponent(name[1]);
// }

// function getUserParameter() {
//   if (window.location.search !== "") {
//     const userParameter = get(window.location.search);
//     document.addEventListener("DOMContentLoaded", () => {
//       generateDOMTree(userParameter);
//     });
//   }
// }

let initialized = false;

function generateDOMTree(userInputString) {
  const parserOutputNode = parseHTML(userInputString);
  if (parserOutputNode !== null) {
    const d3TreeData = levelOrderTraversal(parserOutputNode);
    // const DOMTreeRootNode = d3TreeData[0];
    const DOMTreeRootNode = d3TreeData;
    let DOM;
    if (initialized === false) {
      DOM = new DOMTree(DOMTreeRootNode);
      initialized = true;
    } else {
      d3.select('svg').remove();
      DOM = new DOMTree(DOMTreeRootNode);
    }
  } else {
    // TODO remove this exception when we add try catch block to parseHTML
    throw new Error('DOMParser failed to parse user input string');
  }
}
// eslint-disable-next-line no-unused-vars
function parseHTML(userInputString) {
  if (userInputString !== '') {
    // TODO will userInputString ever be null?
    const parser = new DOMParser();
    // TODO error check parseFromString - adapt to different browsers - https://developer.mozilla.org/en-US/docs/Web/API/DOMParser#DOMParser_HTML_extension
    const htmlDocument = parser.parseFromString(userInputString, 'text/html');
    return htmlDocument.documentElement;
  }
  return null;
}

function levelOrderTraversal(rootNode) {
  // Level order traverse the output of DOMParser
  const resultArray = [{name: 'HTML', children: [], type: 'doctype'}];
  levelOrderTraversalHelper(rootNode, resultArray[0].children, resultArray);
  return resultArray;
}

function levelOrderTraversalHelper(node, childrenArr, outputArray) {
  // TODO consider if it is worth removing the helper function
  // by not hardcoding [{name: 'HTML', children: []}] because
  // the conditional below is no longer intuitive

  if (
    node !== undefined &&
    node !== null &&
    outputArray !== undefined &&
    outputArray !== null
  ) {
    const isLeaf = node.children.length === 0;
    const isNotHTMLNode = node.parentNode.nodeName !== '#document';
    const currentNodeElementName = node.tagName;
    const currentNodeParentElementName = node.parentNode.tagName;
    if (isNotHTMLNode) {
      childrenArr.push({
        name: currentNodeElementName,
        parent: currentNodeParentElementName,
        children: [],
        obj: node,
        type: determineType(currentNodeElementName),
      });
    } else if (isLeaf) {
      childrenArr.push({
        name: currentNodeElementName,
        // TODO do we need this reference?
        parent: currentNodeParentElementName,
        obj: node,
        type: determineType(currentNodeElementName),
      });
    }
    if (!isLeaf) {
      for (let i = 0; i < node.children.length; i++) {
        if (isNotHTMLNode) {
          let currentNodeParentIndex = -1;
          for (let j = 0; j < childrenArr.length; j++) {
            if (childrenArr[j].obj === node) {
              currentNodeParentIndex = j;
              break;
            }
          }
          if (currentNodeParentIndex == -1) {
            throw new Error(
              "Algorithm failed to traverse in level order: Unable to find parent node of current node."
            );
          }
          levelOrderTraversalHelper(
            node.children[i],
            childrenArr[currentNodeParentIndex].children,
            outputArray
          );
        } else {
          // Currently on HTML node, we need to make a different call since the reference of childrenArr.children doesn't exist
          levelOrderTraversalHelper(node.children[i], childrenArr, outputArray);
        }
      }
    }
  } else {
    throw new Error(
      "Root node is undefined or reference to array to store the result does not exist."
    );
  }
}

function determineType(node) {
  const docMetadata = new Set(["HEAD", "TITLE", "BASE", "LINK", "META", "STYLE"]);
  const sections = new Set(["BODY", "ARTICLE", "SECTION", "NAV", "ASIDE", "H1", "H2", "H3", "H4", "H5", "H6", "HGROUP", "HEADER", "FOOTER", "ADDRESS"])
  const grouping = new Set(["P", "HR", "PRE", "BLOCKQUOTE", "OL", "UL", "MENU", "LI", "DL", "DT", "DD", "FIGURE", "FIGCAPTION", "MAIN", "DIV"])
  const textSemantics = new Set(["A", "EM", "STRONG", "SMALL", "S", "CITE", "Q", "DFN", "ABBR", "RUBY", "RT", "RP", "DATA", "TIME", "CODE", "VAR", "SAMP", "KBD", "SUB", "SUP", "I", "B", "U", "MARK", "BDI", "BDO", "SPAN", "BR", "WBR"])
  const links = new Set(["AREA", "ALTERNATE", "AUTHOR", "BOOKMARK", "CANONICAL", "DNS-PREFETCH", "EXTERNAL", "HELP", "ICON", "LICENSE", "MANIFEST", "MODULEPRELOAD", "NOFOLLOW", "NOREFERRER", "OPENER", "PINGBACK", "PRECONNECT", "PREFETCH", "PRELOAD", "PRERENDER", "SEARCH", "STYLESHEET", "TAG", "NEXT", "PREV"]);
  const edits = new Set(["INS", "DEL"]);
  const embeddedContent = new Set(["PICTURE", "SOURCE", "IMG", "SOURCE", "LINK", "IFRAME", "EMBED", "OBJECT", "PARAM", "VIDEO", "AUDIO", "TRACK", "MAP", "AREA"]);
  const tabularData = new Set(["TABLE", "CAPTION", "COLGROUP", "COL", "TBODY", "THEAD", "TFOOT", "TR", "TD", "TH"]);
  const forms = new Set(["FORM", "LABEL", "INPUT", "BUTTON", "SELECT", "DATALIST"]);

  let type;


  switch (true) {
    case docMetadata.has(node):
      type = 'docMetadata';
      break;
    case sections.has(node):
      type = 'sections';
      break;
    case grouping.has(node):
      type = 'grouping';
      break;
    case textSemantics.has(node):
      type = 'textSemantics';
      break;
    case links.has(node):
      type = 'links';
      break;
    case edits.has(node):
      type = 'edits';
      break;
    case embeddedContent.has(node):
      type = 'embeddedContent';
      break;
    case tabularData.has(node):
      type = 'tabularData';
      break;
    case forms.has(node):
      type = 'forms';
      break;
    default:
      type = 'other';
  }
  return type;
}
