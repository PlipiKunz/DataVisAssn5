/** Class implementing the tree view. */
class Tree {
    /**
     * Creates a Tree Object
     */
    constructor() {
    }

    /**
     * Creates a node/edge structure and renders a tree layout based on
     * the input data
     *
     * @param treeData an array of objects that contain parent/child
     * information.
     */
  createTree(treeData) {

    // ******* TODO: PART VI *******

    // Create a tree and give it a size() of 800 by 300.
    // console.log('tree data');
    // console.log(treeData);

    // Create a root for the tree using d3.stratify();
    let root = d3.stratify()
      .id(function(d, i) {
        console.log(i+2);
        console.log(d);
        return (i+2);
      })
      .parentId(function(d) { return d['Parent']; })
    (treeData);


    // Add nodes and links to the tree.
    let mapped = d3.cluster().size([890, 400])(root);

    // Compute the new tree layout.
    let nodes = mapped.descendants();
    let links = mapped.descendants().slice(1);

    // console.log(root);
    // console.log(mapped);
    // console.log(nodes);

    let svg = d3.select('#tree')
      .attr('transform', 'translate(95, 0)')
    ;

    // adds the links between the nodes
    var link = svg.selectAll(".link")
      .data(links)
      .enter().append("path")
      .classed("link", true)
      .classed('treelink', true)
      .attr("stroke-width", 2)
      .attr("d", function(d) {
        return "M" + d.y + "," + d.x
          + "C" + (d.y + d.parent.y) / 2 + "," + d.x
          + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
          + " " + d.parent.y + "," + d.parent.x;
      });

    let node = svg.selectAll('g.node')
      // .data(nodes, d => d.id || (d.id = ++i));
      .data(nodes);

    // Enter any new modes at the parent's previous position.
    let nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr("transform", d => {
        return "translate(" + d.y + "," + d.x + ")";
      })
    ;

    // Add Circle for the nodes
    nodeEnter.append('circle')
      .attr("class", d => d.data.Name)
      .classed('treenode', true)
      .attr('r', 5)
    ;

    // Add labels for the nodes
    nodeEnter.append('text')
      .attr("dy", ".35em")
      .attr("x", -10)
      .attr("text-anchor", "end")
      .text(d => d.data.Name);

  };

  /**
   * Updates the highlighting in the tree based on the selected team.
   * Highlights the appropriate team nodes and labels.
   *
   * @param row a string specifying which team was selected in the table.
   */
  updateTree(row) {
    // ******* TODO: PART VII *******
    // console.log("updating " + row);
    // nodes
    d3.selectAll('.' + row)
      .attr('r', 8)
    ;
    // links
    d3.selectAll('.' + row + row)
      .attr('stroke-width', 5)
    ;
  }

  /**
   * Removes all highlighting from the tree.
   */
  clearTree() {
    // ******* TODO: PART VII *******

    // You only need two lines of code for this! No loops!
    // nodes
    d3.selectAll('.treenode')
      .attr('r', 5)
    ;
    // links
    d3.selectAll('.treelink')
      .attr('stroke-width', 2)
    ;
  }
}
