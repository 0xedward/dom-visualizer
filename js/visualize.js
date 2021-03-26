// // // eslint-disable-next-line require-jsdoc


class DOMTree {
  constructor(data){
    this.data = data;
    this.duration = 750;
    this.createAndAppendDOMTree(data)
  }

  createAndAppendDOMTree(root){
    const margin = { top: 50, right: 30, bottom: 0, left: 30 };
    //TODO: use media queries to determine height
    const screenWidth = screen.availWidth / 2.1;
    const screenHeight = screen.availHeight * .9;

    this.plot = d3
    .select("div#output-container")
    .append("svg")
    .attr("width", screenWidth + margin.right + margin.left)
    .attr("height", screenHeight + margin.top + margin.bottom)
    .call(d3.zoom()
    .scaleExtent([1 / 32, 8])
    .on("zoom", zoomed))
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let svg = this.plot;

    function zoomed(event) {
      svg.attr("transform", event.transform);
    }

    // this.tree = d3.tree().size([height, width]).nodeSize([80, 20]);
    this.tree = d3.tree().nodeSize([80, 20]);
    this.treeRoot = d3.hierarchy(root[0], function(d) { return d.children; });
    this.treeRoot.x0 = screenWidth /2;
    this.treeRoot.y0 = screenHeight * .05;

    this.update(this.treeRoot);
  }

  update(root) {
  let i = 0;
  //TODO: Change depth for media queries
  let treeLevelPadding = 100;
  this.treeData = this.tree(this.treeRoot)
  const nodes = this.treeData.descendants();
  const links = this.treeData.descendants().slice(1);
  nodes.forEach(function (d) {
    d.y = d.depth * treeLevelPadding;
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
      return "translate(" + (root.x0) + "," + root.y0 + ")";
    }).on("click", (e, d) => {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
      }
      this.update(d);
    })

    //TODO: Use media queries to adjust rectangle sizing
    const rectH=25
    const rectW=30


    nodeEnter.append('rect')
      .attr('class', 'node')
      .attr("width", rectW)
      .attr("height", rectH)
      .attr("rx","0")
      .style("fill", function(d) {
          return d.data.fill;
      });
    nodeEnter.append('text')
    .text(function(d) { return d.data.name; })
    .attr("x", function(d) {
      const textElement = d3.select(this.parentNode).select("text").node();
      const bbox = textElement.getBBox();
      return (rectW / 2) - (bbox.width / 2)
    })
    .attr("y", rectH / 2)
    .attr("text-anchor", function(d) {
      return "middle";
    })
    const nodeUpdate = nodeEnter.merge(node);

    //TODO: Figure out how to get rid of starting animation
    nodeUpdate.transition()
    .duration(this.duration)
    .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
     });

    let leftPadding = 25;
    let verticalPadding = 10;
    nodeUpdate.select('rect')
    .attr('rx', 3)
    .attr('ry', 3)
    .attr("x", function(d) {
      const textElement = d3.select(this.parentNode).select("text").node();
      const bbox = textElement.getBBox();
      bbox.x -= leftPadding / 2;
      if(textElement.innerHTML == "META"){
        console.log("x:", bbox.x)
      }
      return bbox.x
    })
    .attr("y", function(d) {
      const textElement = d3.select(this.parentNode).select("text").node();
      const bbox = textElement.getBBox();
      bbox.y -= verticalPadding / 2;
      if(textElement.innerHTML == "META"){
        console.log("y:", bbox.y)
      }
      return bbox.y
    })
    .attr("stroke", "black")
        .attr("stroke-width", 1)
    .attr('width', function(d){
      const textElement = d3.select(this.parentNode).select("text").node();
      const bbox = textElement.getBBox();
      bbox.width += leftPadding;
      if(textElement.innerHTML == "META"){
        console.log("w:", bbox.width)
      }
      return bbox.width;
    })
    .attr('height', function(d) {
      const textElement = d3.select(this.parentNode).select("text").node();
      const bbox = textElement.getBBox();
      bbox.height += verticalPadding
      if(textElement.innerHTML == "META"){
        console.log("height:", bbox.height)
      }
      return bbox.height
    })
    .style('fill', function(d) { return d._children ? 'lightsteelblue' : '#fff'; });

    let nodeExit = node.exit().transition()
      .duration(this.duration)
      .attr("transform", function(d) {
          return "translate(" + root.x + "," + root.y + ")";
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
        const o = {x: root.x0, y: root.y0}
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
      const o = {x: root.x, y: root.y}
      return diagonal(o, o)
    })
    .remove();

    // nodes.forEach(function(d) {
    //   d.x0 = d.x;
    //   d.y0 = d.y;
    // })

    nodes.forEach(function(d) {
      if(d.data.name === "META"){
        console.log(d)
      }
    })
    function diagonal(s, d) {
      let path = `M ${s.x} ${s.y}
        C ${(s.x + d.x) / 2} ${s.y},
          ${(s.x + d.x) / 2} ${d.y},
          ${d.x} ${d.y}`;
      return path;
    }
  }
}
