angular.module('GameCtrls', [])
.controller('GameCtrl', ['$scope', '$http', function($scope, $http) {
  var textures = ['highlight.png','sand.png', 'grass.png']

  $scope.game = {}
  $scope.move = {}
  $scope.currentCharacter = {}
  $scope.characterData = "Test"

  var getGame = function(){
    var req = {
      url: "http://localhost:3000/game/",
      method: 'GET',
      params: {
      }
    }
    $http(req).then(function success(res) {
      $scope.game = res.data
      $scope.gameData = JSON.stringify(res.data)
      // $scope.currentCharacter = $scope.game.turnOrder[$scope.game.turn]
    }, function error(res) {
      console.log(res)
    });
  }
  var sendMove = function(){

  }
  function getDistance(x1,y1,x2,y2){
    var z1 = -(x1+y1)
    var z2 = -(x2+y2)
    var distance = (Math.abs(x1-x2)+Math.abs(y1-y2)+Math.abs(z1-z2))/2
    return distance
  }
  $scope.click = function(tile){
    $scope.clearSelected()
    tile.selected=true
    if(tile.occupied){
      $scope.characterData = "name"
    }
  }
  $scope.rightClick = function(tile){
    var to = $scope.game.characters[0].location
    console.log(getDistance(tile.x,tile.y,to.x,to.y))
    //if character selected
      //if ability/action selected:
        //set action to tile as target, enable 'submit move'
    //else if hex is unoccupied
      //set action as move to tile, enable 'submit move'
  }
  $scope.hoverIn = function(tile){
  }
  $scope.hoverOut = function(tile){
  }

  $scope.paths = [{x:1}, {x:2}]

  $scope.getImage = function(tile){
    if(tile.selected){
      return 'images/'+textures[0]
    }
    if(tile.texture){
      return 'images/'+textures[tile.texture]
    }
    return 'images/tile.png'
  }
  $scope.clearSelected = function(){
    $scope.game.map.forEach(function(tile){
      tile.selected=false
    })
    $scope.characterData = ""
  }
  $scope.getTileX = function(tile){
    var x = tile.x+tile.y/2
    return x*92
  }
  $scope.getTileY = function(tile){
    return tile.y*80
  }

  getGame()
}])