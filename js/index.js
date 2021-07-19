'use strict';

function generateDOMTree(userInputString) {
  const parserOutputNode = parseHTML(userInputString);
  if (parserOutputNode !== null) {
    const d3TreeData = levelOrderTraversal(parserOutputNode);
    const DOMTreeRootNode = d3TreeData;

    if (d3.select('svg').size() === 0) {
      new DOMTree(DOMTreeRootNode);
    } else {
      d3.select('svg').remove();
      d3.select('div.tooltip').remove();
      new DOMTree(DOMTreeRootNode);
    }
  } else {
    // TODO remove this exception when we add try catch block to parseHTML
    throw new Error('DOMParser failed to parse user input string');
  }
}

function parseHTML(userInputString) {
  if (userInputString !== '') {
    // TODO will userInputString ever be null?
    const parser = new DOMParser();
    // TODO error check parseFromString
    const htmlDocument = parser.parseFromString(userInputString, 'text/html');
    return htmlDocument.documentElement;
  }
  return null;
}

function levelOrderTraversal(rootNode) {
  // Level order traverse the output of DOMParser
  const resultArray = [{
    name: 'HTML',
    children: [],
    type: 'Doctype',
    color: '#CBEEF3',
  }];
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
    const {
      type,
      color,
    } = determineType(currentNodeElementName);

    if (isNotHTMLNode) {
      childrenArr.push({
        name: currentNodeElementName,
        parent: currentNodeParentElementName,
        children: [],
        obj: node,
        type: type,
        color: color,
      });
    } else if (isLeaf) {
      childrenArr.push({
        name: currentNodeElementName,
        // TODO do we need this reference?
        parent: currentNodeParentElementName,
        obj: node,
        type: type,
        color: color,
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
                'Algorithm failed to traverse in level order: Unable to find parent node of current node.'
            );
          }
          levelOrderTraversalHelper(
              node.children[i],
              childrenArr[currentNodeParentIndex].children,
              outputArray
          );
        } else {
          // On document root node, we need to make pass different params to levelOrderTraversalHelper
          // since reference to childrenArr.children doesn't exist
          levelOrderTraversalHelper(node.children[i], childrenArr, outputArray);
        }
      }
    }
  } else {
    throw new Error(
        'Root node is undefined or reference to array to store the result does not exist.'
    );
  }
}

function determineType(node) {
  const document = 'HTML';
  const docMetadata = new Set(['HEAD', 'TITLE', 'BASE', 'LINK', 'META', 'STYLE']);
  const sections = new Set(['BODY', 'ARTICLE', 'SECTION', 'NAV', 'ASIDE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HGROUP', 'HEADER', 'FOOTER', 'ADDRESS']);
  const grouping = new Set(['P', 'HR', 'PRE', 'BLOCKQUOTE', 'OL', 'UL', 'MENU', 'LI', 'DL', 'DT', 'DD', 'FIGURE', 'FIGCAPTION', 'MAIN', 'DIV']);
  const textSemantics = new Set(['A', 'EM', 'STRONG', 'SMALL', 'S', 'CITE', 'Q', 'DFN', 'ABBR', 'RUBY', 'RT', 'RP', 'DATA', 'TIME', 'CODE', 'VAR', 'SAMP', 'KBD', 'SUB', 'SUP', 'I', 'B', 'U', 'MARK', 'BDI', 'BDO', 'SPAN', 'BR', 'WBR']);
  const links = new Set(['AREA', 'ALTERNATE', 'AUTHOR', 'BOOKMARK', 'CANONICAL', 'DNS-PREFETCH', 'EXTERNAL', 'HELP', 'ICON', 'LICENSE', 'MANIFEST', 'MODULEPRELOAD', 'NOFOLLOW', 'NOREFERRER', 'OPENER', 'PINGBACK', 'PRECONNECT', 'PREFETCH', 'PRELOAD', 'PRERENDER', 'SEARCH', 'STYLESHEET', 'TAG', 'NEXT', 'PREV']);
  const edits = new Set(['INS', 'DEL']);
  const embeddedContent = new Set(['PICTURE', 'SOURCE', 'IMG', 'SOURCE', 'LINK', 'IFRAME', 'EMBED', 'OBJECT', 'PARAM', 'VIDEO', 'AUDIO', 'TRACK', 'MAP', 'AREA']);
  const tabularData = new Set(['TABLE', 'CAPTION', 'COLGROUP', 'COL', 'TBODY', 'THEAD', 'TFOOT', 'TR', 'TD', 'TH']);
  const forms = new Set(['FORM', 'LABEL', 'INPUT', 'BUTTON', 'SELECT', 'DATALIST']);

  let type;
  let color;

  switch (true) {
    case document === node:
      type = 'Document Type';
      color = '#FFFFFF';
      break;
    case docMetadata.has(node):
      type = 'Document Metadata';
      color = '#7CA982';
      break;
    case sections.has(node):
      type = 'Sections';
      color = '#E2C2FF';
      break;
    case grouping.has(node):
      type = 'Grouping Content';
      color = '#A7ADC6';
      break;
    case textSemantics.has(node):
      type = 'Text-Level Semantics';
      color = '#5BC0EB';
      break;
    case links.has(node):
      type = 'Links';
      color = '#F4F4F9';
      break;
    case edits.has(node):
      type = 'Edits';
      color = '#F3D9B1';
      break;
    case embeddedContent.has(node):
      type = 'Embedded Content';
      color = '#311E10';
      break;
    case tabularData.has(node):
      type = 'Tabular Data';
      color = '#759AAB';
      break;
    case forms.has(node):
      type = 'Forms';
      color = '#FFE787';
      break;
    default:
      type = 'Other';
      color = '#3066BE';
  }
  return {
    'type': type,
    'color': color,
  };
}

// eslint-disable-next-line no-unused-vars
function liveUpdate() {
  const userInputString = document.getElementById('html-input-box').value;
  const liveUpdateCheckBox = document.getElementById('live-update-checkbox');
  // TODO remove the check for userInputString !== "" when we wrap
  // DOMParser api call in try-catch block
  if (liveUpdateCheckBox.checked && userInputString !== '') {
    generateDOMTree(userInputString);
  }
}
