// // // eslint-disable-next-line require-jsdoc


class DOMTree {
  constructor(data){
    this.data = data;
    this.createAndAppendDOMTree(data)
  }

  createAndAppendDOMTree(root){
    const margin = { top: 50, right: 30, bottom: 0, left: 30 };
    const width = 960 - margin.right - margin.left;
    const height = 500 - margin.top - margin.bottom;
    this.duration = 750;

    this.plot = d3
    .select("div#output-container")
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .call(d3.zoom()
    .scaleExtent([1 / 32, 8])
    .on("zoom", zoomed))
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let svg = this.plot;

    function zoomed(event) {
      svg.attr("transform", event.transform);
    }

    this.tree = d3.tree().size([height, width]);
    this.treeRoot = d3.hierarchy(root[0], function(d) { return d.children; });
    this.treeRoot.x0 = height/2;
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
  const rectH=25
  const rectW=30
  const treeData = this.tree(this.treeRoot)
  const nodes = treeData.descendants();
  const links = treeData.descendants().slice(1);
  nodes.forEach(function (d) {
    d.y = d.depth * 100;
  });

  const node = this.plot.selectAll("g.node").data(nodes, function (d) {
    return d.id || (d.id = ++i);
  });


  //Nodes Section
  const nodeEnter = node
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function (d) {
      return "translate(" + (source.x0) + "," + source.y0 + ")";
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


    nodeEnter.append('rect')
      .attr('class', 'node')
      .attr("width", rectW)
      .attr("height", rectH)
      .attr("rx","5")
      .style("fill", function(d) {
          return d.data.fill;
      });
    nodeEnter.append('text')
    .attr("dy", "-.35em")
    .attr("x", rectW / 2)
    .attr("y", rectH / 2)
    .attr("text-anchor", function(d) {
      return "start";
    })
    .text(function(d) { return d.data.name; })
    .append("tspan")
    .attr("dy", "1.75em").attr("x", function(d) {
      return 13;
    })

    const nodeUpdate = nodeEnter.merge(node);

    nodeUpdate.transition()
    .duration(this.duration)
    .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
     });


    nodeUpdate.select('rect')
    .attr('rx', 6)
    .attr('ry', 6)
    .attr('y', -(rectH / 2))
    .attr("stroke", "black")
        .attr("stroke-width", 1)
    .attr('width', function(d){
      const textElement = d3.select(this.parentNode).select("text").node();
      const bbox = textElement.getBBox();
      let width = bbox.width;
      return width*2.5;
    })
    .attr('height', rectH)
    .style('fill', function(d) { return d._children ? 'lightsteelblue' : '#fff'; });

    let nodeExit = node.exit().transition()
      .duration(this.duration)
      .attr("transform", function(d) {
          return "translate(" + source.x + "," + source.y + ")";
      })
      .remove();

      nodeExit.select("rect")
      .attr("width", rectW)
      .attr("height", rectH)
  .attr("stroke", "black")
      .attr("stroke-width", 1);

    nodeExit.select('text')
    .style('fill-opacity', 1e-6);

    //Links Section

    const link = this.plot.selectAll('path.link')
    .data(links, function(d) { return d.id });

  const linkEnter = link.enter().insert('path', "g")
      .attr("class", "link")
      .attr('d', function(d){
        const o = {x: source.x0, y: source.y0}
        return diagonal(o, o)
      });

  const linkUpdate = linkEnter
    .merge(link)

    linkUpdate.transition()
    .duration(this.duration)
    .attr('d', function(d){ return diagonal(d, d.parent) });

    link.exit().transition()
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
