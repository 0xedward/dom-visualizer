// // // eslint-disable-next-line require-jsdoc


class DOMTree {
  constructor(data){
    this.data = data;
    this.createAndAppendDOMTree(data)
  }

  createAndAppendDOMTree(root){
    this.margin = { top: 100, right: 200, bottom: 30, left: 100 };
    this.width = 960 - this.margin.right - this.margin.left;
    this.height = 500 - this.margin.top - this.margin.bottom;
    this.duration = 750;
    this.plot = d3
    .select("div#output-container")
    .append("svg")
    .attr("width", this.width + this.margin.right + this.margin.left)
    .attr("height", this.height + this.margin.top + this.margin.bottom)
    .append("g")
    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.update(root);
  }

  update(source) {
  let i = 0;
  const tree = d3.tree().size([this.height, this.width]);
  const treeRoot = d3.hierarchy(source);
  treeRoot.x0 = 0;
  treeRoot.y0 = width / 2;
  // const treeNodes =tree(treeRoot);
  tree(treeRoot)
  const nodes = treeRoot.descendants();
  nodes.forEach(function (d) {
    d.y = d.depth * 100;
  });
  const links = treeRoot.links();
  const node = this.plot.selectAll("g.node").data(nodes, function (d) {
    return d.id || (d.id = ++i);
  });

  //Nodes Section
  const nodeEnter = node
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    }).on("click", (d) => {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      this.update(d);
    })

    nodeEnter.append('circle')
    .attr('class', 'node')
    .attr('r', 1e-6)
    .style("fill", function(d) {
        return d._children ? "lightsteelblue" : "#fff";
    });

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

  const link = this.plot.selectAll("path.link").data(links, function (d) {
    return d.target.id;
  });

  const diagonal = function (s, d) {
    let path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`

    return path
  }

  const linkEnter = link
    .enter()
    .insert("path", "g")
    .attr("class", "link")
    .attr("d", diagonal);

  const linkUpdate = linkEnter
    .merge(link)
    .attr("fill", "none")
    .attr("stroke", "#ccc")
    .attr("stroke-width", "2px");

    linkUpdate.transition()
    .duration(this.duration)
    .attr('d', function(d){ return diagonal(d, d.parent) });

    const linkExit = link.exit().transition()
    .duration(duration)
    .attr('d', function(d) {
      var o = {x: source.x, y: source.y}
      return diagonal(o, o)
    })
    .remove();

    nodes.forEach(function(d){
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }
  collapse(d) {
    if(d.children) {
      d._children = d.children;
      d._children.forEach(this.collapse)
      d.children = null;
    }
  }
}
