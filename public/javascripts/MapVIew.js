/*
MapView
*/
var MapView = Backbone.View.extend({
  model: Observatories,
  projection: undefined,
  mapSvg: undefined,
  tagName: 'svg',
  renderJp:function() {

    var self = this;
    var path, map, xy;
    var padding = 20;
    
    xy = d3.geo
      .mercator()
      .scale(2500)
      .center([137.0032936, 43.3219088]);
       
    path = d3.geo.path().projection(xy);

    map = d3.select("#japan").append("svg:svg").attr("width", '860px').attr("height", '1200px');
    
    this.mapSvg = map;
    
    this.projection = xy;

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
  },
  render: function() {
    var self = this;
    if (0 < this.collection.length && this.collection != null) {
      this.mapSvg.selectAll("rect")
        .data(self.collection.models)
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
        .delay(function(d, i){ return i * 5})
        .attr({
          y: 0,
          x: 0,
          width: 2,
          fill: "red",
          height: 3,
        })
        .attr("transform", function(d, i) {return "translate(" + self.projection(d.get('coordinates')) + ")"; })
        .each("end",function() {
          d3.select(this)
            .transition()
            .duration(1000)
            .attr({
              y: function(d) {return -1 * d.get('doserate') * 0.1},
              height: function(d) {return d.get('doserate') * 0.1},
            });
        });
    }
    return this;
  }
})