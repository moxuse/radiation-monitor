(function(){
  $('body').ready(function(){
    var dataset = [42,23,35,56,23,96,23,36];

    console.log(dataset.length)

    var w = 980;
    var h = 300;

    var padding = 20;

    var svgC = d3.select("#circle").append("svg").attr({width: w, height: h});
    var svgM = d3.select("#rect").append("svg").attr({width: w, height: h});

    svgC.selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .transition()
      .duration(2000)
      .ease('bounce')
      .each("start", function() {
        d3.select(this).attr({
          fill: "white",
          r: 0,
          cy: h
        });
      })
      .delay(function(d, i){ return i * 100})
      .attr({
        cx: function(d, i) {return 50 + i * 90; },
        cy: h / 2,
        r: function(d) {return d * 0.5},
        fill: "red"
      });

    var xScale = d3.scale.linear()
                  .domain([padding, d3.max(dataset)])
                  .range([padding, w - padding])
                  .nice();

    var xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient("buttom")

    svgM.append("g")
      .attr({
        class: "axis",
        transform: "translate(0, 230)"
      })
      .call(xAxis)     

    svgM.selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .transition()
      .duration(1000)
      .ease('bounce')
      .each("start",function() {
        d3.select(this).attr({
          width: 0,
          fill: "white",
        })
      })
      .delay(function(d, i){ return i * 10})
      .attr({
        x: padding,
        y: function(d, i) {return i * 25;},
        width: function(d) { return xScale(d) -padding; },
        fill: "red",
        height: 10,
      })
      .each("start", function() {
        d3.select(this).attr({
          fill: "red",
          x: padding,
          y: function(d, i) {return i * 25;},
          width: 0,
          height: 20
        });
      })

    // Map

    var path, map, xy;
      xy = d3.geo
          .mercator()     //投影法の指定
          .scale(2500)   //スケール（ズーム）の指定
          .center([137.0032936, 43.3219088]); //中心の座標を指定
       
    path = d3.geo.path().projection(xy);

    map = d3.select("#japan").append("svg:svg").attr("width", '860px').attr("height", '1200px');

    var grad = d3.scale.linear().domain([0, 5]).range(["#000000", "#222222"]);

    d3.json("geojson/japanGeo.json", function(error, jp) {

      map.append("svg:g")
        .attr("class", "tracts")
        .selectAll("path")
        .data(jp.features)
        .enter()
        .append("svg:path")
        .attr("class", "prefecture")
        .attr("id", function(d, i) { return "pref-" + i; })
        .attr("fill", function(d, i) {return grad( Math.floor(Math.random() * 5) )})
        .attr({d: path, opacity: 0.8})  //位置情報をPathのd属性に変換して適応
        .attr("name", function(d) {return d.properties.name})
        .append("svg:text")

      map.selectAll(".pref-label")
        .data(jp.features)
        .enter()
        .append("text")            
        .text(function(d) {return d.properties.name})
        .attr({class: "pref-label"})
        .attr("dy", ".35em")
        .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })

      map.selectAll("rect")
        .data(jp.features)
        .enter()
        .append("rect")
        .transition()
        .duration(1000)
        .ease('bounce')
        .each("start",function() {
          d3.select(this).attr({
            width: 3,
            fill: "white",
          })
        })
        .delay(function(d, i){ return i * 20})
        .attr({
          y: 0,
          x: padding,
          width: 2,
          fill: "red",
          height: 3,
        })
        .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
        .each("end",function() {
          d3.select(this)
            .transition()
            .duration(1000)
            .attr({
              y: -100,
              height: 100,
            });
        });

        map.selectAll(".prefecture")
          .on("mouseover", function(d) {
            d3.select(this)
            .attr("fill", "red")
          })
          .on("mouseout", function(d) {
            d3.select(this)
            .attr("fill", function(d) {return grad( Math.floor(Math.random() * 5) )})
          })
          .on("click", function() {
            alert(
              d3.select(this).attr("name")
              );
          })
    });
  });
})()