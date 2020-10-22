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
    this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

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


  /**
   * Creates a table skeleton including headers that when clicked allow
   * you to sort the table by the chosen attribute.
   * Also calculates aggregate values of goals, wins, losses and total
   * games as a function of country.
   */
  createTable() {
    this.updateList(0);

    // ******* TODO: PART II *******

    // Update Scale Domains
    let maxGoals = d3.max(this.teamData, function(d) {
      return d3.max([d.value['Goals Conceded'], d.value['Goals Made']]);
    });

    this.goalScale.domain([0, maxGoals]).range([10, this.goalsWidth-10]);

    let maxGames = d3.max(this.teamData, function(d) {
      return d.value['TotalGames'];
    });

    this.gameWidth = 100;
    this.gameScale.domain([0, 7]).range([0, this.gameWidth]);

    // Create the x axes for the goalScale.
    let goalAxis = d3.axisBottom();
    goalAxis.scale(this.goalScale);

    // Add GoalAxis to header of col 1.
    d3.select('#goalHeader')
      .append('svg')
      .attr('width', this.goalsWidth)
      .attr('height', 20)
      .append('g')
      .call(goalAxis);

    // ******* TODO: PART V *******

    // Set sorting callback for clicking on headers
    // console.log(d3.selectAll('.header').size());
    let thisTable = this;
    d3.selectAll('.header')
      .on('click', function() {
        thisTable.collapseList();
        let col = d3.select(this).html();
        let compare;
        if (col == 'Team') {
          compare = (a,b) => a.key.localeCompare(b.key);
        } else if (col == 'Round/Result') {
          compare = (a,b) =>
            a.value.Result.label.localeCompare(b.value.Result.label);
        } else if (col == 'Wins') {
          compare = (a,b) => b.value.Wins - a.value.Wins;
        } else if (col == 'Losses') {
          compare = (a,b) => b.value.Losses - a.value.Losses;
        } else if (col == 'Total Games') {
          compare = (a,b) => b.value.TotalGames - a.value.TotalGames;
        }
        thisTable.tableElements.sort(compare);
        if (thisTable.lastSort == col) {
          thisTable.tableElements = thisTable.tableElements.reverse();
          thisTable.lastSort = null;
        } else {
          thisTable.lastSort = col;
        }
        thisTable.updateTable();
        // console.log(col);
      });

    // Clicking on headers should also trigger collapseList() and
    // updateTable().

  }


  /**
   * Updates the table contents with a row for each element in the global
   * variable tableElements.
   */
  updateTable() {

    // ******* TODO: PART III *******

    // Create table rows
    // console.log(this.tableElements);
    let rows = d3.select('#matchTable').selectAll('.tableRow')
      .data(this.tableElements);
    rows.exit().remove();
    rows = rows
      .enter()
      .append('tr')
      .attr('class', 'tableRow')
      .merge(rows)
      .on('mouseover', d => {
        // console.log(d);
        this.tree.updateTree(d.key);
      })
      .on('mouseout', d => {
        // console.log(d);
        this.tree.clearTree();
      })
    ;
    // Create Team column
    let headers = rows
      .selectAll('th')
      .data(function(d) {
        return [d];
      });
    headers
      .enter()
      .append('th')
      .merge(headers)
      .attr('class', function(d) {
        return d.value.type;
      })
      .html(function(d) {
        if (d.value.type == 'aggregate')
          return d.key;
        return 'x' + d.key;
      })
      .on('mousedown', d => {
        this.collapseList();
        this.updateList(d.i);
      })
    ;

    // console.log('rows', rows);

    // Create the rest of the table
    let test = rows
      .selectAll('td')
      .data(function(d) {
        // d is an element of tableElements
        // The data for this row is an array of objects, each with properties
        // defining what is to be visualized.
        let goals = {
          type:d.value.type,
          vis:'goals',
          made:d.value['Goals Made'],
          conceded:d.value['Goals Conceded'],
          min:d3.min([d.value['Goals Made'], d.value['Goals Conceded']] ),
          max:d3.max([d.value['Goals Made'], d.value['Goals Conceded']] )
        };
        let round = {
          type:d.value.type, vis:'text', value:d.value.Result.label };
        let wins = { type:d.value.type, vis:'bar', value:d.value.Wins };
        let losses = { type:d.value.type, vis:'bar', value:d.value.Losses };
        let games = { type:d.value.type, vis:'bar', value:d.value.TotalGames };
        return [ goals, round, wins, losses, games ];
      })
    ;
    console.log(test);
    test = test
      .enter()
      .append('td')
    ;
    console.log(test);

    // console.log('td', test);
    // console.log('tr selection', rows.selectAll('td'));

    // team name, round/result
    d3.selectAll('td').filter(function(d) {
      return d != null && d.vis == 'text';
    }).html(d => d.value);


    // remove bar and goal graphs
    d3.selectAll('td').filter(function(d) {
      return d != null && (d.vis == 'bar' || d.vis == 'goals');
    }).selectAll('*').remove();

    let sscale = d3.scaleLinear()
      .domain([0, 18]).range([.4,.4]);
    let lscale = d3.scaleLinear()
      .domain([0, 18]).range([.8,0]);

    // win/loss/games bar graph
    let bars = d3.selectAll('td').filter(function(d) {
      return d != null && d.vis == 'bar';
    })
      .append('svg')
      .attr('width', this.gameWidth)
      .attr('height', this.bar.height)
      .filter(d => d.type == 'aggregate');

    bars
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', d => this.gameScale(d.value))
      .attr('height', this.bar.height)
      .attr('fill', d => d3.hsl(271, sscale(d.value), lscale(d.value)))
    ;

    bars
      .append('text')
      .text(d => d.value)
      .attr('x', d => this.gameScale(d.value)-2)
      .attr('y', '1em')
      .attr('text-anchor', 'end')
      .attr('fill', 'white')
    ;

    // goals
    let goalHeight = this.bar.height*5/8;
    let goalHeightGame = goalHeight/4;
    let goalSvgs = d3.selectAll('td').filter(function(d) {
      return d != null && d.vis == 'goals';
    })
      .append('svg')
      .attr('width', this.goalsWidth)
      .attr('height', this.bar.height);

    goalSvgs
      .append('rect')
      .attr('x', d => this.goalScale(d.min))
      .attr('y', d => {
        if (d.type == 'aggregate')
          return (this.bar.height-goalHeight)/2;
        return (this.bar.height-goalHeightGame)/2;
      })
      .attr('width', d => this.goalScale(d.max)-this.goalScale(d.min))
      .attr('height', function(d) {
        if (d.type == 'aggregate')
          return goalHeight;
        return goalHeightGame;
      })
      .attr('fill', d => {
        if (d.min == d.conceded)
          return 'blue';
        return 'red';
      })
      .attr('class', 'goalBar')
    ;

    goalSvgs
      .append('circle')
      .attr('cx', d => this.goalScale(d.conceded))
      .attr('cy', this.bar.height/2)
      .attr('class', function(d) {
        if (d.type == 'aggregate')
          return 'goalCircle goalCircle-aggregate-min';
        return 'goalCircle goalCircle-game-min';
        })
    ;
    goalSvgs
      .append('circle')
      .attr('cx', d => this.goalScale(d.made))
      .attr('cy', this.bar.height/2)
      .attr('class', function(d) {
        if (d.type == 'aggregate')
          return 'goalCircle goalCircle-aggregate-max';
        return 'goalCircle goalCircle-game-max';
        })
    ;

    // Append th elements for the Team Names

    // Append td elements for the remaining columns.
    // Data for each cell is of the type: {'type':<'game' or 'aggregate'>,
    // 'value':<[array of 1 or two elements]>}

    //Add scores as title property to appear on hover

    //Populate cells (do one type of cell at a time)

    //Create diagrams in the goals column

    //Set the color of all games that tied to light gray

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
    this.tableElements = this.tableElements.slice(0, i+1).concat(
      this.tableElements[i].value.games).concat(this.tableElements.slice(i+1));

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
      return d.value.type == 'aggregate';
    });
    this.updateListIndices();
  }

}
