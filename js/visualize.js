// // eslint-disable-next-line require-jsdoc

function createAndAppendDOMTree(root) {
  const margin = { top: 100, right: 200, bottom: 30, left: 100 };
  const width = 960 - margin.right - margin.left;
  const height = 500 - margin.top - margin.bottom;
  const svg = d3
    .select("div#output-container")
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  update(root, svg);
}

function update(source, svg) {
  const duration = 750;
  const margin = { top: 100, right: 200, bottom: 30, left: 100 };
  const width = 960 - margin.right - margin.left;
  const height = 500 - margin.top - margin.bottom;
  let i = 0;
  const tree = d3.tree().size([height, width]);
  const treeRoot = d3.hierarchy(source);
  tree(treeRoot);
  const nodes = treeRoot.descendants();
  nodes.forEach(function (d) {
    d.y = d.depth * 100;
  });
  const links = treeRoot.links();
  const node = svg.selectAll("g.node").data(nodes, function (d) {
    return d.id || (d.id = i++);
  });
  const nodeEnter = node
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    })
    .on("click", clickNodes);

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

  const linkEnter = link
    .enter()
    .insert("path", "g")
    .attr("class", "link")
    .attr("d", createDiagonal);

  const linkUpdate = linkEnter
    .merge(link)
    .attr("fill", "none")
    .attr("stroke", "#ccc")
    .attr("stroke-width", "2px");

  linkUpdate.transition().duration(duration).attr("d", createDiagonal);

  link
    .exit()
    .transition()
    .duration(duration)
    .attr("transform", function (d) {
      return "translate(" + source.y + "," + source.x + ")";
    })
    .remove();
}

function createDiagonal(d) {
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
}

function removeNodes() {
  d3.select("svg").remove();
}

function clickNodes(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}
