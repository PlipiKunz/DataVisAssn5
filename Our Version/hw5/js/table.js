class Table {
  
  constructor(teamData) {

    this.tableElements = teamData.slice();
    this.updateListIndices();
  }

  createTable() {
    this.updateList(0);
  }

  updateTable() {

    // Create table rows
    let rows = d3.select('#matchTable').selectAll('.tableRow')
      .data(() => this.tableElements.filter(d => d.type == "USE"));
    
    rows.exit().remove();
    
    rows = rows
      .enter()
      .append('tr')
      .attr('class', 'tableRow')
      .merge(rows);

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
      .data(d => [ 
          { value: d.properties.language.macroarea },
          { value: d.properties.language.genus_pk },
          { value: parseInt(d.properties.language.longitude) },
          { value: parseInt(d.properties.language.latitude) }
        ])

    test = test.enter()
      .append('td');

    d3.selectAll('td')
      .filter(d => d != null)
      .html(d => d.value);
  };

  updateListIndices() {
    for (let i = 0; i < this.tableElements.length; ++i) {
      this.tableElements[i].i = i;
    }
  }

  updateList(i) {
    this.updateListIndices();
    this.updateTable();
  }
}
