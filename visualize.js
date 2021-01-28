function treeVisualizer() {
  const treeData = [
    {
      name: "HTML",
      children: [
        {
          name: "Body",
          parent: "HTML",
          children: [
            {
              name: "TR1",
              parent: "Body",
            },
            {
              name: "TR2",
              parent: "Body",
            },
          ],
        },
        {
          name: "Head",
          parent: "HTML",
          children: [
            {
              name: "Script",
            },
          ],
        },
      ],
    },
  ];
  let root = treeData[0];
  update(root);
}

function update(root) {
  var margin = { top: 30, right: 120, bottom: 20, left: 120 },
    width = 960 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;
  var i = 0;

  var diagonal = function link(d) {
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

  var svg = d3
    .select("div#output-container")
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  var tree = d3.tree().size([height, width]);

  const treeRoot = d3.hierarchy(root);
  tree(treeRoot);
  const nodes = treeRoot.descendants();
  const links = treeRoot.links();

  nodes.forEach(function (d) {
    d.y = d.depth * 100;
  });

  var node = svg.selectAll("g.node").data(nodes, function (d) {
    return d.id || (d.id = ++i);
  });

  var nodeEnter = node
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
  console.log(d.x);

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

  var link = svg.selectAll("path.link").data(links, function (d) {
    return d.target.id;
  });

  link.enter().insert("path", "g").attr("class", "link").attr("d", diagonal);
}
