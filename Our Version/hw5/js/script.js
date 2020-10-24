
d3.csv("data/languageTree.csv").then(function(csvData) {

  csvData.forEach((d, i) => d.id = d.langcode);

  let tree = new Tree();
  tree.createTree(csvData);

});

d3.json('data/languagedata.json').then(data => {
  let table = new Table(data);

  table.createTable();
  table.updateTable();
});



// //************************* HACKER VERSION *****************************
// // Loads in fifa-matches.csv file, aggregates the data into the correct
// // format, then calls the appropriate functions to create and populate
// // the table.
// d3.csv("data/fifa-matches.csv", function (error, matchesCSV) {

//   // Loads in the tree information from fifa-tree.csv and calls
//   // createTree(csvData) to render the tree.
//   d3.csv("data/fifa-tree.csv", function (error, treeCSV) {
//     // ******* TODO: PART I *******
//   });
// });
// //*********************** END HACKER VERSION ***************************
