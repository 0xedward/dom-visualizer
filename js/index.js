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
    console.log(node);
    const nodeListLevelOrder = levelOrderTraversal(node);
    console.log(nodeListLevelOrder);
    console.log(nodeListLevelOrder[0].children[1].children[0]);
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
    console.log("Parent Node:", node.parentNode.nodeName);
    console.log(node);
    console.log("# of nodes to insert:", node.children.length);
    console.log("Before insert", childrenArr);
    console.log("Level ->", counter);
    if (node !== undefined) {
      const isLeaf = node.children.length === 0;
      if (node.parentNode.nodeName !== "#document") {
        childrenArr.push({
          name: node.tagName,
          parent: node.parentNode.tagName,
          children: [],
          obj: node,
        });
        console.log("After insert", childrenArr);
      } else if (isLeaf) {
        childrenArr.push({
          name: node.tagName,
          parent: node.parentNode.tagName, //TODO do we need this reference?
          obj: node,
        });
      }
      if (!isLeaf) {
        for (let i = 0; i < node.children.length; i++) {
          if (node.parentNode.nodeName !== "#document") {
            console.log("Before next search", childrenArr.children);
            // search(node.children[i], childrenArr.children);
            let parentIndex = -1;
            for (let j = 0; j < childrenArr.length; j++) {
              console.log("Parent name in array", childrenArr[j].name);
              console.log("Parent in tree", node.parentNode.tagName);
              if (childrenArr[j].obj === node) {
                parentIndex = j;
                break;
              }
              // if (childrenArr[j].name === node.tagName) {
              //   parentIndex = j;
              //   break;
              // }
            }
            if (parentIndex == -1) {
              console.log("FUCK")
              return;
            }
            search(node.children[i], childrenArr[parentIndex].children);
            counter += 1;
          } else {
            console.log("Root before next search", childrenArr);
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


// [
//   {
//     name: "HTML",
//     children: [
//       {
//         name: "Head",
//         parent: "HTML",
//         children: [
//           {
//             name: "Script",
//             parent: "Head",
//           },
//         ],
//       },
//       {
//         name: "Body",
//         parent: "HTML",
//         children: [
//           {
//             name: "p",
//             parent: "Body"
//           },
//         ],
//       },
//     ],
//   },
// ];

// [
//   {
//     name: "HTML",
//     children: [
//       {
//         name: "Head",
//         parent: "HTML",
//         children: [
//           {
//             name: "Meta",
//             parent: "Head",
//           },
//           {
//             name: "Title",
//             parent: "Head",
//           },
//         ],
//       },
//       {
//         name: "Body",
//         parent: "HTML",
//         children: [
//           {
//             name: "div",
//             parent: "Body",
//             children: [
//               {
//                 name: "div",
//                 parent: "div",
//                 children: [
//                   {
//                     name: "label",
//                     parent: "div",
//                   },
//                   {
//                     name: "br",
//                     parent: "div",
//                   },
//                   {
//                     name: "br",
//                     parent: "div",
//                   },
//                   {
//                     name: "textarea",
//                     parent: "div",
//                   },
//                   {
//                     name: "br",
//                     parent: "div",
//                   },
//                   {
//                     name: "br",
//                     parent: "div",
//                   },
//                   {
//                     name: "button",
//                     parent: "div",
//                   },
//                 ],
//               },
//               {
//                 name: "div",
//                 parent: "div",
//                 children: [
//                   {
//                     name: "label",
//                     parent: "div",
//                   },
//                   {
//                     name: "br",
//                     parent: "div",
//                   },
//                   {
//                     name: "br",
//                     parent: "div",
//                   },
//                 ],
//               },
//             ],
//           },
//           {
//             name: "Script",
//             parent: "Body"
//           }
//         ],
//       },
//     ],
//   },
// ];
