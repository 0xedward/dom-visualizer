/* eslint-disable require-jsdoc */
"use strict";

// eslint-disable-next-line no-unused-vars
function parseHTML(userInputString) {
  if (userInputString !== "") {
    // TODO will userInputString ever be null?
    const parser = new DOMParser();
    // TODO error check parseFromString - adapt to different browsers - https://developer.mozilla.org/en-US/docs/Web/API/DOMParser#DOMParser_HTML_extension
    const htmlDocument = parser.parseFromString(userInputString, "text/html");
    const node = htmlDocument.documentElement;
    // console.log(node.children[0].children[0].children.length);
    const nodeListLevelOrder = levelOrderTraversal(node);
    console.log(nodeListLevelOrder);
  }
}

function levelOrderTraversal(rootNode) {
  const array = [{ name: "HTML", children: [] }];
  // console.log(rootNode);
  // console.log(array[0].children);
  let counter = 0;
  search(rootNode, array[0].children);

  function search(node, childrenArr) {
    console.log(`Current Node: ${node.tagName}`);
    console.log(node);
    console.log("# of nodes to insert:", node.children.length);
    console.log("Parent Node:", node.parentNode.nodeName);
    console.log("Children Array before insert", childrenArr);
    console.log("Level ->", counter);
    if (node !== undefined) {
      const isLeaf = node.children.length === 0;
      if (node.parentNode.nodeName !== "#document") {
        childrenArr.push({
          name: node.tagName,
          parent: node.parentNode.tagName,
          children: [],
        });
        console.log("children array insertion", childrenArr);
      } else if (isLeaf) {
        childrenArr.push({
          name: node.tagName,
        });
      }
      if (!isLeaf) {
        for (let i = 0; i < node.children.length; i++) {
          if (node.parentNode.nodeName !== "#document") {
            console.log("Children Array before search", childrenArr.children);
            search(node.children[i], childrenArr.children);
            counter += 1;
          } else {
            console.log("Children Array before search", childrenArr);
            search(node.children[i], childrenArr);
            counter += 1;
          }
        }
      }
    } else {
      return;
    }
  }
  return array;
}

// function JSONConverter(rootNode) {
//   //rootNode is HTML tag
//   const array = [];

//   //rootNode = <script>

//   if (rootNode.children === undefined) {
//     let arr
//     while(array.children !== undefined){
//       let arr = array.children
//     }

//     array[array.length - 1]children.push({
//       name: rootNode.tagName,
//       parent: array[array.length - 1].tagName,
//     });
//   }

//   if (rootNode.children !== undefined) {
//     array.push({ name: rootNode.tagName, children: [] });

//     for (let i = 0; i < rootNode.children.length; i++) {
//       array[array.length - 1].children.push({
//         name: rootNode.children[i].tagName,
//         parent: rootNode.tagName,
//         children: [],
//       });

//       JSONConverter(rootNode.children[i]);
//     }
//   }

//   return array;
// }

// [
//   {
//     name: "HTML",
//     children: [
//       {
//         name: "Body",
//         parent: "HTML",
//         children: [
//           {
//             name: "TR1",
//             parent: "Body",
//           },
//           {
//             name: "TR2",
//             parent: "Body",
//           },
//         ],
//       },
//       {
//         name: "Head",
//         parent: "HTML",
//         children: [
//           {
//             name: "Script",
//           },
//         ],

//Helper method takes in next node and determines how to modify it/how to push it
//Nodes go from HTML --> HEAD/BODY --> SCRIPT/P
