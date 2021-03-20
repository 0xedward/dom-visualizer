// // // eslint-disable-next-line require-jsdoc


class DOMTree {
  constructor(data){
    this.data = data;
    this.createAndAppendDOMTree(data)
  }

  createAndAppendDOMTree(root){
    const margin = { top: 100, right: 200, bottom: 30, left: 100 };
    const width = 960 - margin.right - margin.left;
    const height = 500 - margin.top - margin.bottom;
    this.duration = 500;
    this.plot = d3
    .select("div#output-container")
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    this.tree = d3.tree().size([height, width]);
    this.treeRoot = d3.hierarchy(root[0], function(d) { return d.children; });
    this.treeRoot.x0 = height / 2
    this.treeRoot.y0 = 0
    this.treeRoot.children.forEach(function collapse(d){
      if(d.children) {
        d._children = d.children;
        d._children.forEach(collapse)
        d.children = null;
      }
    })

    this.update(this.treeRoot);
  }

  update(source) {
  let i = 0;
  const treeData = this.tree(this.treeRoot)
  const nodes = treeData.descendants();
  const links = treeData.descendants().slice(1);
  nodes.forEach(function (d) {
    d.y = d.depth * 100;
  });
  // const links = treeData.links();
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
    }).on("click", (e, d) => {
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

    nodeEnter.append('text')
    .attr("dy", ".35em")
    .attr("x", function(d) {
        return d.children || d._children ? -13 : 13;
    })
    .attr("text-anchor", function(d) {
        return d.children || d._children ? "end" : "start";
    })
    .text(function(d) { return d.data.name; });

    let nodeUpdate = nodeEnter.merge(node);

    nodeUpdate.transition()
    .duration(this.duration)
    .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
     });

    nodeUpdate.select('circle.node')
    .attr('r', 10)
    .style("fill", function(d) {
        return d._children ? "lightsteelblue" : "#fff";
    })
    .attr('cursor', 'pointer');

    let nodeExit = node.exit().transition()
      .duration(this.duration)
      .attr("transform", function(d) {
          return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

    nodeExit.select('circle')
    .attr('r', 1e-6);

    nodeExit.select('text')
    .style('fill-opacity', 1e-6);

    let link = this.plot.selectAll('path.link')
      .data(links, function(d) { return d.id; });

  const linkEnter = link.enter().insert('path', "g")
      .attr("class", "link")
      .attr('d', function(d){
        const o = {x: source.x0, y: source.y0}
        return diagonal(o, o)
      });

  const linkUpdate = linkEnter
    .merge(link)
    .attr("fill", "none")
    .attr("stroke", "#ccc")
    .attr("stroke-width", "2px");

    linkUpdate.transition()
    .duration(this.duration)
    .attr('d', function(d){ return diagonal(d, d.parent) });

    const linkExit = link.exit().transition()
    .duration(this.duration)
    .attr('d', function(d) {
      const o = {x: source.x, y: source.y}
      return diagonal(o, o)
    })
    .remove();

    nodes.forEach(function(d){
      d.x0 = d.x;
      d.y0 = d.y;
    });

    function diagonal(s, d) {
      let path = `M ${s.x} ${s.y}
        C ${(s.x + d.x) / 2} ${s.y},
          ${(s.x + d.x) / 2} ${d.y},
          ${d.x} ${d.y}`;
      return path;
    }
  }
}
