TimeView = function() {
  /*
  consotructor
  */
  this.currentTime = '';
}

TimeView.prototype.render = function() {
  this.currentTime = moment().format('lll');
  $('#console .time').append('<h2>');
  $('#console .time h2').text(this.currentTime);
}