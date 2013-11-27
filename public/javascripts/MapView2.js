/*
View MapView
*/
var MapView = Backbone.View.extend({
  defaults: {
    projection: undefined,
    mapSvg: undefined,
    tagName: 'svg',
    loadedGeoJSON: undefined,
  },
  initialize: function() {
    this.loadedGeoJSON = new $.Deferred();
    this.projection = d3.geo
      .mercator()
      .scale(2200)
      .center([135.4032936, 41.0219088]);
    this.mapSvg = d3.select("#japan").append("svg:svg").attr("width", '1000px').attr("height", '980px');
  },
  renderJp: function() {
    var self = this;
    var path, xy;
    var padding = 20;
       
    path = d3.geo.path().projection(this.projection);

    var grad = d3.scale.linear().domain([0, 5]).range(["#000000", "#222222"]);

    d3.json("geojson/japanGeo_t.json", function(error, jp) {

      self.mapSvg.append("svg:g")
        .attr("class", "tracts")
        .selectAll("path")
        .data(jp.features)
        .enter()
        .append("svg:path")
        .attr("class", "prefecture")
        .attr("id", function(d, i) { return "pref-" + i; })
        .attr("fill", function(d, i) {return grad( Math.floor(Math.random() * 5) )})
        .attr({d: path, opacity: 0.8})  //位置情報をPathのd属性に変換して適応
        .attr("name", function(d) {return d.properties.PREF.en})
        .append("svg:text")

      self.mapSvg.selectAll(".pref-label")
        .data(jp.features)
        .enter()
        .append("text")            
        .text(function(d) {return d.properties.PREF.en})
        .attr({class: "pref-label"})
        .attr("dy", ".35em")
        .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })


      self.mapSvg.selectAll(".prefecture")
        .on("mouseover", function(d) {
            d3.select(this)
            .attr("fill", function(d) {
              if ("Fukushima" == d.properties.name) {
                return 'red';
              } else {
                return '#888';
              }
            })
        })
        .on("mouseout", function(d) {
          d3.select(this)
          .attr("fill", function(d) {return grad( Math.floor(Math.random() * 5) )})
        })
        .on("click", function() {
          console.log(
            d3.select(this).attr("name")
          );
        })
        self.loadedGeoJSON.resolve();
    });
    return this.loadedGeoJSON.promise();
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
            x: function(d, i) {return (self.projection(d.get('coordinates')))[0]},
            width: 3,
            fill: "white",
          })
        })
        .delay(function(d, i){ return i * 2})
        .attr({
          y: 0,
          x: 0,
          width: 3,
          fill: "red",
          height: 3,
        })
        .attr("transform", function(d, i) {return "translate(" + self.projection(d.get('coordinates')) + ")"; })
        .attr("class", "data-rect")
        .each("end",function() {
          d3.select(this)
            .transition()
            .duration(1000)
            .attr({
              y: function(d) {return -1 * d.get('doserate') * 0.05},
              height: function(d) {return d.get('doserate') * 0.05},
            });
        });

      this.mapSvg.selectAll("rect")
        .on("mouseover", function(d) {
          var _attributes = d.attributes;
          $("#detail-data .doserate").text(_attributes.doserate);
          $("#detail-data .prefecture").text(_attributes.prefecture);
          $("#detail-data .place").text(_attributes.place);
          $("#detail-data .direction").text(_attributes.direction);
          $("#detail-data .wind").text(_attributes.wind);
          $("#detail-data .rain").text(_attributes.rain);
          $("#detail-data .rain").text(_attributes.rain);
          $("#detail-data .datatime").text(_attributes.datatime);
          $("#detail-data .createtime").text(_attributes.createtime);
          $("#detail-data .datasource").text(_attributes.datasource);
        });
    }
  },
  transformDataTo: function(type) {
    var self = this;
    var dataType = type;
    var rectColor = '#ccc';
    var scale = 0.05;
    switch (dataType) {
      case 'doserate':
        rectColor = 'red';
        scale = 0.05;
        break;
      case 'wind':
        rectColor = '#00ffff';
        scale = 5;
        break;
      case 'rain':
        rectColor = '#0022ff';
        scale = 2;
        break;
      default:
        break;
    }
    this.mapSvg.selectAll("rect")
      .transition()
      .duration(1000)
      .attr({
        y: function(d) {
          var val = d.get(dataType);
          if (self.isNumber(val)) {
            return -1 * val * scale
          } else {
            return 0.0;
          }
        },
        height: function(d) {
          var val = d.get(dataType);
          if (self.isNumber(val)) {
            return val * scale
          } else {
            return 0.0;
          }
        },
        fill: rectColor
      })
  },
  isNumber: function(x) { 
    if (typeof(x) != 'number' && typeof(x) != 'string') {
        return false;
    } else {
        return (x == parseFloat(x) && isFinite(x));
    }
  }
})
