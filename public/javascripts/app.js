(function() {
  $('body').ready(function(){
    $('#mapview').ready(function() {
      var timeView = new TimeView();
      timeView.render();
      var detailView = new DetailView();
      detailView.render();
      var observatories = new Observatories();
      var mapView  = new MapView({
        collection: observatories
      });
      
      $.when(
        mapView.renderJp()
      ).done(function() {
        observatories.fetch({
          dataType : 'jsonp',
          success: function(req){
            console.log("fetch succees!! : ", observatories.length);
            renderGraph();
          }
        })
      });

      var renderGraph = function() {
        mapView.render();
      }

      setButtonAction();

    });
    //});

    // var dataset = [42,23,35,56,23,96,23,36];

    // var w = 980;
    // var h = 300;

    // var padding = 20;

    // var svgC = d3.select("#circle").append("svg").attr({width: w, height: h});
    // var svgM = d3.select("#rect").append("svg").attr({width: w, height: h});

    // svgC.selectAll("circle")
    //   .data(dataset)
    //   .enter()
    //   .append("circle")
    //   .transition()
    //   .duration(2000)
    //   .ease('bounce')
    //   .each("start", function() {
    //     d3.select(this).attr({
    //       fill: "white",
    //       r: 0,
    //       cy: h
    //     });
    //   })
    //   .delay(function(d, i){ return i * 100})
    //   .attr({
    //     cx: function(d, i) {return 50 + i * 90; },
    //     cy: h / 2,
    //     r: function(d) {return d * 0.5},
    //     fill: "red"
    //   });

    // var xScale = d3.scale.linear()
    //               .domain([padding, d3.max(dataset)])
    //               .range([padding, w - padding])
    //               .nice();

    // var xAxis = d3.svg.axis()
    //               .scale(xScale)
    //               .orient("buttom")

    // svgM.append("g")
    //   .attr({
    //     class: "axis",
    //     transform: "translate(0, 230)"
    //   })
    //   .call(xAxis)     

    // svgM.selectAll("rect")
    //   .data(dataset)
    //   .enter()
    //   .append("rect")
    //   .transition()
    //   .duration(1000)
    //   .ease('bounce')
    //   .each("start",function() {
    //     d3.select(this).attr({
    //       width: 0,
    //       fill: "white",
    //     })
    //   })
    //   .delay(function(d, i){ return i * 10})
    //   .attr({
    //     x: padding,
    //     y: function(d, i) {return i * 25;},
    //     width: function(d) { return xScale(d) - padding; },
    //     fill: "red",
    //     height: 10,
    //   })
    //   .each("start", function() {
    //     d3.select(this).attr({
    //       fill: "red",
    //       x: padding,
    //       y: function(d, i) {return i * 25;},
    //       width: 0,
    //       height: 20
    //     });
    //   })
  });

  var showFukushima = function() {

  }

  var showJapanAll = function() {
    
  }

  var setButtonAction = function() {
    $('#show-discription').hover(
      function(e) {
        var target = $(e.target);
        target.css({color: '#08c'});
      },
      function(e) {
        var target = $(e.target);
        target.css({color: '#000000'});
      }
    );

    $('#show-discription').on('click', function() {
      if (50 > $('#discription').height()) {
        $('#discription').css({height: '50px'})
        $('#show-discription .arrow').css('-webkit-transform', 'rotate(+90deg)');;
      } else {
        $('#discription').css({height: '0px'});
        $('#show-discription .arrow').css('-webkit-transform', 'rotate(0deg)');;
      }
    })
  };
})();