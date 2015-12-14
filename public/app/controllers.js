angular.module('GameCtrls', [])
.controller('GameCtrl', ['$scope', '$http', function($scope, $http) {
  var textures = ['highlight.png','sand.png', 'grass.png']
  $scope.game = {}
  $scope.move = {}
  $scope.currentCharacter = false
  $scope.selectedCharacter = false
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
      revertChanges()
      $scope.gameData = JSON.stringify(res.data)
    }, function error(res) {
      console.log(res)
    });
  }
  $scope.sendMove = function(){
    var req = {
      url: "http://localhost:3000/game/"+$scope.game._id,
      method: 'POST',
      data: {
        move:$scope.move
      },
      headers: {'Content-Type': 'application/json'}
    }
    $http(req).then(function success(res) {
      $scope.game = res.data
      revertChanges()
      $scope.gameData = JSON.stringify(res.data)
    }, function error(res) {
      console.log(res)
    });
  }
  function getMapIndex(x, y){
    return x+y*$scope.game.height
  }
  function getDistance(x1,y1,x2,y2){
    var z1 = -(x1+y1)
    var z2 = -(x2+y2)
    var distance = (Math.abs(x1-x2)+Math.abs(y1-y2)+Math.abs(z1-z2))/2
    return distance
  }
  $scope.click = function(tile){
    $scope.clearSelected()
    tile.selected = true
    highlightAvailableMoves()
    //selectedCharacter == false if tile isn't occupied, == character if is occupied.
    if($scope.selectedCharacter = tileOccupied(tile.x, tile.y)){
      //do additional stuff for clicking on a character
    }
  }
  $scope.rightClick = function(tile){
    $scope.clearSelected()
    tile.selected = true
    console.log($scope.currentCharacter)
    var from = $scope.currentCharacter.location
    console.log(getDistance(tile.x,tile.y,from.x,from.y))
    //if character selected
    if(from){
      if(!tileOccupied(tile.x, tile.y)){
        var distance = getDistance(tile.x, tile.y, from.x, from.y)
        if(distance<=$scope.currentCharacter.movements&&distance>0){
          $scope.currentCharacter.movements-=distance
          $scope.currentCharacter.location = {x:tile.x, y:tile.y}
          $scope.move.moves.push({action:0, at:{x:tile.x,y:tile.y}})
          highlightAvailableMoves()
        }
      }

      //if ability/action selected:
        //set action to tile as target, enable 'submit move'
    }
    //else if hex is unoccupied
      //set action as move to tile, enable 'submit move'
  }
  $scope.hoverIn = function(tile){
  }
  $scope.hoverOut = function(tile){
  }

  $scope.getImage = function(tile){
    // if(tile.selected){
    //   return 'images/'+textures[0]
    // }
    if(tile.texture){
      return 'images/'+textures[tile.texture]
    }
    return 'images/tile.png'
  }
  $scope.getCharacterImage = function(character){
    return character.image
  }
  $scope.clearSelected = function(){
    $scope.game.map.forEach(function(tile){
      tile.selected=false
    })
    $scope.characterData = ""
  }
  $scope.getTileX = function(tile){
    var x = tile.x+tile.y/2
    return x*92-($scope.game.height-$scope.game.length/2)*92
  }
  $scope.getTileY = function(tile){
    return tile.y*80-80
  }
  function tileOccupied(x, y){
    var result = false
    //go through characters array and see if any characters are present at location
    $scope.newGameState.characters.forEach(function(character){
      if(character.location.x==x && character.location.y==y){
        result = character
      }
    })
    return result
  }
  function revertChanges(){
    $scope.newGameState = $scope.game
    $scope.currentCharacter = $scope.newGameState.turnOrder[$scope.game.turn]
    $scope.move = {game: $scope.game._id,character: $scope.currentCharacter._id, moves:[]}
    $scope.clearSelected()
    highlightAvailableMoves()
    console.log($scope.currentCharacter)
  }
  function highlightAvailableMoves(){
    var charx = $scope.currentCharacter.location.x
    var chary = $scope.currentCharacter.location.y
    var movements = $scope.currentCharacter.movements
    for(var i=0; i<$scope.game.map.length; i++){
      var tile = $scope.game.map[i]
      if(tile){
        tile.highlighted=false
        var distance = getDistance(tile.x, tile.y, charx,chary)
        if(distance<=movements && distance>0&& !tileOccupied(tile.x,tile.y)){
          tile.highlighted=true
        }
      }
    }
    console.log($scope.currentCharacter)
  }

  getGame()
}])