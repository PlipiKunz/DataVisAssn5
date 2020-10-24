/** Class implementing the table. */
class Table {
  /**
   * Creates a Table Object
   */
  constructor(teamData, treeObject) {

    // Maintain reference to the tree Object; 
    this.tree = treeObject; 

    // Create list of all elements that will populate the table
    // Initially, the tableElements will be identical to the teamData
    this.tableElements = teamData.slice();
    this.updateListIndices();

    // Store all match data for the 2014 Fifa cup
    this.teamData = teamData;

    // Default values for the Table Headers
    // this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];
    this.tableHeaders = ["name", "macroarea", "genus_pk", "region", "siblings"];

    // To be used when sizing the svgs in the table cells.
    this.cell = {
      "width": 70,
      "height": 20,
      "buffer": 15
    };

    this.bar = {
      "height": 20
    };

    // Set variables for commonly accessed data columns
    this.goalsMadeHeader = 'Goals Made';
    this.goalsConcededHeader = 'Goals Conceded';

    // Setup the scales
    this.goalScale = d3.scaleLinear();
    this.goalsWidth = 140;

    // Used for games/wins/losses
    this.gameScale = d3.scaleLinear();

    // Color scales
    // For aggregate columns  Use colors '#ece2f0', '#016450' for the range.
    this.aggregateColorScale = null; 

    // For goal Column. Use colors '#cb181d', '#034e7b'  for the range.
    this.goalColorScale = null; 

  }

  createTable() {
    this.updateList(0);
  }

  /**
   * Updates the table contents with a row for each element in the global
   * variable tableElements.
   */
  updateTable() {

    // ******* TODO: PART III *******

    // Create table rows
    let rows = d3.select('#matchTable').selectAll('.tableRow')
      .data(() => this.tableElements.filter(d => d.type == "USE"));
    
    rows.exit().remove();
    
    rows = rows
      .enter()
      .append('tr')
      .attr('class', 'tableRow')
      // .attr()
      .merge(rows)
      // .on('mouseover', d => {
      //   // console.log(d);
      //   this.tree.updateTree(d.properties.name);
      // })
      // .on('mouseout', d => {
      //   // console.log(d);
      //   this.tree.clearTree();
      // })
    ;
    // Create Team column
    let headers = rows
      .selectAll('th')
      .data(d => [d])

    headers
      .enter()
      .append('th')
      .merge(headers)
      .attr('class', d => 'aggregate')
      .html(d => d.properties.name );
    
    // Create the rest of the table
    let test = rows
      .selectAll('td')
      .data(function(d) {
        // d is an element of tableElements
        // The data for this row is an array of objects, each with properties
        // defining what is to be visualized.
        let area = {
          vis:'text', value: d.properties.language.macroarea
        };
        let siblings = {
          vis:'text', value: d.properties.language.genus_pk 
        };
        let cousins = { 
          vis:'text', value:'asdf' 
        };
        return [ area, siblings, cousins ];
      })
    ;

    test = test
      .enter()
      .append('td');

    // team name, round/result
    d3.selectAll('td').filter(function(d) {
      return d != null && d.vis == 'text';
    }).html(d => d.value);

    
    // remove bar and goal graphs
    d3.selectAll('td').filter(function(d) {
      return d != null && (d.vis == 'bar' || d.vis == 'goals');
    }).selectAll('*').remove();
  };

  updateListIndices() {
    for (let i = 0; i < this.tableElements.length; ++i) {
      this.tableElements[i].i = i;
    }
  }


  /**
   * Updates the global tableElements variable, with a row for each row
   * to be rendered in the table.
   */
  updateList(i) {
    // ******* TODO: PART IV *******
    // this.tableElements = this.tableElements.slice(0, i+1).concat(
    //   this.tableElements[i].value.games).concat(this.tableElements.slice(i+1));

    this.updateListIndices();
    
    // Only update list for aggregate clicks, not game clicks
    this.updateTable();
  }

  /**
   * Collapses all expanded countries, leaving only rows for aggregate
   * values per country.
   */
  collapseList() {
    
    // ******* TODO: PART IV *******
    this.tableElements = this.tableElements.filter(d => {
      return d.type == 'aggregate';
    });
    this.updateListIndices();
  }

}
