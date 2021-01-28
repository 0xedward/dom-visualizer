// eslint-disable-next-line require-jsdoc
let initialized = false;

function createAndAppendDOMTree(root) {
  if (initialized === false) {
    const margin = { top: 30, right: 120, bottom: 20, left: 120 };
    const width = 960 - margin.right - margin.left;
    const height = 500 - margin.top - margin.bottom;
    let i = 0;

    const diagonal = function link(d) {
      return (
        "M" +
        d.source.x +
        "," +
        d.source.y +
        "C" +
        (d.source.x + d.target.x) / 2 +
        "," +
        d.source.y +
        " " +
        (d.source.x + d.target.x) / 2 +
        "," +
        d.target.y +
        " " +
        d.target.x +
        "," +
        d.target.y
      );
    };
    // TODO make this function return the SVG and
    // allow index.js to handle appending the SVG to DOM
    const svg = d3
      .select("div#output-container")
      .append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    const tree = d3.tree().size([height, width]);

    const treeRoot = d3.hierarchy(root);
    tree(treeRoot);
    const nodes = treeRoot.descendants();
    const links = treeRoot.links();

    nodes.forEach(function (d) {
      d.y = d.depth * 100;
    });

    const node = svg.selectAll("g.node").data(nodes, function (d) {
      return d.id || (d.id = ++i);
    });

    const nodeEnter = node
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      });

    nodeEnter.append("circle").attr("r", 10).style("fill", "#fff");

    nodeEnter
      .append("text")
      .attr("y", function (d) {
        return d.children || d._children ? -18 : 18;
      })
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text(function (d) {
        return d.data.name;
      })
      .style("fill", "black");

    const link = svg.selectAll("path.link").data(links, function (d) {
      return d.target.id;
    });

    link.enter().insert("path", "g").attr("class", "link").attr("d", diagonal);
    initialized = true;
  } else {
    throw new Error("DOM Tree should only render once.");
  }
}
