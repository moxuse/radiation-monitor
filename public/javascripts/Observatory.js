/*
Model Observatory
*/

var Observatory = Backbone.Model.extend({
  defaults: {
    id: 0, 
    doserate: 0,
    prefecture: '',
    place: '',
    direction: '', 
    wind: '',
    rain: '',
    lat: '',
    lng: '',
    createtime: '',
    datatime: '',
    datatimestamp: '',
    createtime: '',
    datasource: '',
    coordinates: [0, 0]
  },
  parse: function(resp) {
    if (resp.error) {
        console.log(resp.error.message);
    }
    resp.coordinates = [resp.lng, resp.lat];
    return resp
  }
})

// Observatories Collection
var Observatories = Backbone.Collection.extend({
  model: Observatory,
  url: 'http://dokusyodebokin.rulez.jp/earthquake/now/?type=jsonp',
  parse: function(resp) {
    if (resp.error) {
        console.log (resp.error.message);
    }
    return resp;
  }
});

