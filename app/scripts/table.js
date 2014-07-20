function table() {

  var format = d3.format(',3f');

  function chart(selection) {
    selection.each(function(data) {
      
      // Select the table element, if it exists.
      var table = d3.select(this).selectAll("table").data([data]);

      // Otherwise, create the skeletal chart.
      var tEnter = table.enter().append("table").attr("class", "table table-hover")
      var thead = tEnter.append("thead").append('tr');
      var tbody = tEnter.append("tbody");

      var headers = table.select('thead').select('tr').selectAll('th').data(function(d) {
        return d.headers;
      })
      // assume a list of headers
      var hEnter = headers.enter().append('th')

      // now be a body
      // add the rows
      var rows = table.select('tbody').selectAll('tr').data(function(d) {return d.rows})
      rowsEnter = rows.enter().append('tr')
        .attr("id",function(d, i) { return "tr "+i} )
        // .on("click", function(d) {
        //   console.log(d)
        // });

      rows.exit().remove()

      var cells = rows.selectAll('td').data(function(d) {
            return d;
        })


      cells.enter()
        .append("td")

      // table.selectAll('tr')  
      // .on("click",function(d) {
      //   clickTest(d)
      // });
      
      table.selectAll('th')
        .style('text-align', function(d) {
            if (isNumber(d)) {
                return 'left'
            }
            return 'left'
        })
        .html(function(d) { return d })

      table.selectAll('td')
        .style('text-align', function(d) {
                if (isNumber(d)) {
                    return 'left';
                }
                return 'left';
            })
        .text(function(d) { 
            if (isNumber(d)) {
                var fmt = format(d);
                return fmt
            }
                return d 
            });

    
    });
  }

  // check if it is a number
  function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
   }

  // chart.margin = function(_) {
  //   if (!arguments.length) return margin;
  //   margin = _;
  //   return chart;
  // };

  
  return chart;
}                     
 