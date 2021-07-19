'use strict';

// eslint-disable-next-line no-unused-vars
class DOMTree {
  constructor(data) {
    this.data = data;
    this.svgWidth = screen.availWidth / 2.1;
    this.svgHeight = screen.availHeight * .7; ;
    this.duration = 500;
    // TODO remove function call that doesn't set something to a variable in constructor
    this.createAndAppendDOMTree(data);
  }

  createAndAppendDOMTree(root) {
    const initialX = this.svgWidth / 2;
    const initialY = this.svgHeight * .05;
    const zoomExtent = d3.zoom().scaleExtent([1/32, 4]).on('zoom', (event) => {
      svg.attr('transform', event.transform);
    });
    this.transScale = 1;

    const svg = d3.select('div#output-container')
        .append('svg').attr('width', this.svgWidth)
        .attr('height', this.svgHeight)
        .attr('class', 'graph-svg-component').call(zoomExtent)
        .call(d3.zoom().transform, d3.zoomIdentity.translate(initialX, initialY)
            .scale(this.transScale)).append('g')
        .attr('transform', 'translate(' + initialX + ',' + initialY + ')');

    this.plot = svg;
    // TODO: Bug - some node are still off-centered
    this.tree = d3.tree().nodeSize([80, 20]);
    this.treeRoot = d3.hierarchy(root[0], function(d) {
      return d.children;
    });
    this.treeRoot.x0 = 0;
    this.treeRoot.y0 = 0;

    this.update(this.treeRoot);
  }

  update(root) {
    let i = 0;
    // TODO: Change depth for media queries
    const treeLevelPadding = 100;
    this.treeData = this.tree(this.treeRoot);
    const nodes = this.treeData.descendants();
    const links = this.treeData.descendants().slice(1);
    nodes.forEach(function(d) {
      d.y = d.depth * treeLevelPadding;
    });

    const node = this.plot.selectAll('g.node').data(nodes, function(d) {
      return d.id || (d.id = ++i);
    });

    const tooltip = d3.select('div#output-container')
        .append('div').attr('class', 'tooltip').style('opacity', 0);

    // Nodes Section
    const nodeEnter = node
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', function(d) {
          return 'translate(' + (root.x0) + ',' + root.y0 + ')';
        }).on('click', (e, d) => {
          if (d.children) {
            d._children = d.children;
            d.children = null;
          } else {
            d.children = d._children;
            d._children = null;
          }
          d.clicked = true;
          this.update(d);
        }).on('mouseover', function(event, d) {
          const g = d3.select(this);
          const nodeText = g._groups[0][0].textContent;
          const nodeType = g._groups[0][0].__data__.data.type;
          tooltip.html(`${nodeText.bold()} HTML Type: ${nodeType}`)
              .style('background-color', 'tan')
              .style('border', '1px solid black')
              .style('padding', '2px')
              .style('top', event.pageY + 10 + 'px')
              .style('left', event.pageX + 10 + 'px')
              .style('opacity', 1).on('mouseout', function() {
                tooltip.style('opacity', 0);
              });
        });

    // TODO: Size rectangle height and width by some factor of svgHeight and svgWidth
    // const rectH = this.svgHeight * .025;
    // const rectW = this.svgWidth * .05;

    const rectH = 35;
    const rectW = 25;


    nodeEnter.append('rect')
        .attr('class', 'node')
        .attr('width', rectW)
        .attr('height', rectH)
        .attr('rx', '0')
        .style('stroke', function(d) {
          return d.type;
        });

    nodeEnter.append('text')
        .text(function(d) {
          return d.data.name;
        })
        .attr('x', function(d) {
          const textElement = d3.select(this.parentNode).select('text').node();
          const bbox = textElement.getBBox();
          return (rectW / 2) - (bbox.width / 2);
        })
        .attr('y', rectH / 2)
        .attr('text-anchor', function(d) {
          return 'middle';
        });
    const nodeUpdate = nodeEnter.merge(node);

    // TODO: Figure out how to get rid of starting animation
    nodeUpdate.transition()
        .duration(this.duration)
        .attr('transform', function(d) {
          return 'translate(' + d.x + ',' + d.y + ')';
        });

    // TODO: Size rectangle padding by some factor of svgHeight and svgWidth
    const nodeWidths = {};

    const horizontalPadding = 25;
    const verticalPadding = 10;
    nodeUpdate.select('rect')
        .attr('rx', 3)
        .attr('ry', 3)
        .attr('x', function(d) {
          const textElement = d3.select(this.parentNode).select('text').node();
          const bbox = textElement.getBBox();
          bbox.x -= horizontalPadding / 2;
          return bbox.x;
        })
        .attr('y', function(d) {
          const textElement = d3.select(this.parentNode).select('text').node();
          const bbox = textElement.getBBox();
          bbox.y -= verticalPadding / 2;
          return bbox.y;
        })
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .attr('width', function(d) {
          const textElement = d3.select(this.parentNode).select('text').node();
          const bbox = textElement.getBBox();
          bbox.width += horizontalPadding;
          if (nodeWidths[d.depth] === undefined) {
            nodeWidths[d.depth] = bbox.width;
          } else {
            nodeWidths[d.depth] += bbox.width;
          }
          return bbox.width;
        })
        .attr('height', function(d) {
          const textElement = d3.select(this.parentNode).select('text').node();
          const bbox = textElement.getBBox();
          bbox.height += verticalPadding;
          return bbox.height;
        })
        .style('fill', function(d) {
          return d._children ? '#fff' : d.data.color;
        });

    // TODO: Set initial zoom scaling based on max width of graph

    let maxWidth = 0;

    for (const width in nodeWidths) {
      if (nodeWidths[width] > maxWidth) {
        maxWidth = nodeWidths[width];
      }
    }


    const nodeExit = node.exit().transition()
        .duration(this.duration)
        .attr('transform', function(d) {
          return 'translate(' + root.x + ',' + root.y + ')';
        })
        .remove();


    nodeExit.select('rect')
        .attr('width', rectW)
        .attr('height', rectH)
        .attr('stroke', 'black')
        .attr('stroke-width', 1);

    nodeExit.select('text')
        .style('fill-opacity', 1e-6);

    // Links Section

    // TODO: Bug - when expanding a collapsed node, the edges appear before the nodes are transitioned into position
    const link = this.plot.selectAll('path.link')
        .data(links, function(d) {
          return d.id;
        });

    const linkEnter = link.enter().insert('path', 'g')
        .attr('class', 'link')
        .attr('d', function(d) {
          const o = {x: root.x0, y: root.y0};
          return DOMTree.diagonal(o, o);
        });

    const linkUpdate = linkEnter
        .merge(link);

    linkUpdate.transition()
        .duration(this.duration)
        .attr('d', function(d) {
          return DOMTree.diagonal(d, d.parent);
        });

    link.exit().transition()
        .duration(this.duration)
        .attr('d', function(d) {
          const o = {x: root.x, y: root.y};
          return DOMTree.diagonal(o, o);
        })
        .remove();
  }
  static diagonal(s, d) {
    const path = `M ${s.x} ${s.y}
      C ${(s.x + d.x) / 2} ${s.y},
        ${(s.x + d.x) / 2} ${d.y},
        ${d.x} ${d.y}`;
    return path;
  }
}
