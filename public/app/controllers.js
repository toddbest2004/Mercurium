angular.module('GameCtrls', [])
.controller('GameCtrl', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams) {
  var textures = ['highlight.png','sand.png', 'grass.png']
  $scope.game = {}
  $scope.move = {}
  $scope.action=1
  $scope.currentCharacter = false
  $scope.selectedCharacter = false
  $scope.characterData = "Test"

  var getGame = function(){
    var req = {
      url: "/game/"+$routeParams.id,
      method: 'GET',
      params: {
      }
    }
    $http(req).then(function success(res) {
      $scope.game = res.data
      revertChanges()
      $scope.gameData = JSON.stringify(res.data)
    }, function error(res) {
      $location.path("/");
    });
  }
  $scope.sendMove = function(){
    var req = {
      url: "/game/"+$scope.game._id,
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
      $location.path("/");
    });
  }
  function getMapIndex(x, y){
    return x+y*($scope.game.length*1.5)
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
    var from = $scope.currentCharacter.location
    //if character selected
    if($scope.selectedCharacter = tileOccupied(tile.x, tile.y)){
      //do additional stuff for clicking on a character
    }
    if(from){
      var distance = getDistance(tile.x, tile.y, from.x, from.y)
      if(!tileOccupied(tile.x, tile.y)){
        if(distance<=$scope.currentCharacter.movements&&distance>0){
          $scope.currentCharacter.movements-=distance
          $scope.currentCharacter.location = {x:tile.x, y:tile.y}
          $scope.move.moves.push({action:0, at:{x:tile.x,y:tile.y}})
          highlightAvailableMoves()
        }
      }else{
        var action = $scope.currentCharacter.actions[$scope.action]
        if(distance<=action.range&&action.actionPoints<=$scope.currentCharacter.movements&&distance>0){
          $scope.currentCharacter.movements-=action.actionPoints
          $scope.move.moves.push({action:$scope.action, at:{x:tile.x,y:tile.y}})
          highlightAvailableMoves()
        }
    //if ability/action selected:
      //set action to tile as target, enable 'submit move'
      }
    }
    
    $scope.clearSelected()
    tile.selected = true
    //else if hex is unoccupied
      //set action as move to tile, enable 'submit move'
  }
  $scope.hoverIn = function(tile){
  }
  $scope.hoverOut = function(tile){
  }
  $scope.getMoveIcon = function(move){
    if(move.action===0){
      return "images/footsteps.png"
    }else{
      return "images/attack.png"
    }
  }
  $scope.getMoveTarget = function(move){
    if(move.action===0){
      var index = getMapIndex(move.at.x,move.at.y)
      console.log($scope.newGameState.map.length,index)
      console.log($scope.newGameState.map[index])
      console.log(index)
      return $scope.getImage($scope.newGameState.map[index])
    }else{
      var target = tileOccupied(move.at.x, move.at.y)
      return target.image
    }
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
      if(tile.x===$scope.currentCharacter.location.x&&tile.y===$scope.currentCharacter.location.y){
        tile.selected=true
      }
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
    $scope.selectedCharacter = false
    $scope.currentCharacter = $scope.newGameState.characters[$scope.newGameState.turnOrder[$scope.game.turn]]
    $scope.move = {game: $scope.game._id,character: $scope.currentCharacter._id, moves:[]}
    $scope.clearSelected()
    $scope.action=1
    highlightAvailableMoves()
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
        //character is moving
        if(distance<=movements && distance>0&& !tileOccupied(tile.x,tile.y)){
          tile.highlighted=true
        }
        
        var action = $scope.currentCharacter.actions[$scope.action]
        //if tile within action range, tile is occupied, tile occupied by enemy
        if(tileOccupied(tile.x,tile.y)&&distance<=action.range&&action.actionPoints<=movements){
          //TODO: tile.attackHighlighted
          tile.highlighted=true
        }
      }
    }
  }
  $scope.setAction = function(index){
    $scope.action = index
    highlightAvailableMoves()
  }

  getGame()
}]).controller('UserCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
  $scope.login = function(){
    var req = {
      url: "/user/login",
      method: 'POST',
      data: {
        username:$scope.loginUsername,
        password:$scope.loginPassword
      },
      headers: {'Content-Type': 'application/json'}
    }
    $scope.loginUsername=''
    $scope.loginPassword=''
    $http(req).then(function success(res) {
      if(res.data.result){
        $location.path("/profile")
      }
    }, function error(res) {
      // alert(res.data.error)
    });
  }
  $scope.register = function(){
    if($scope.registerPassword2!==$scope.registerPassword1){
      $scope.registerUsername=''
      $scope.registerPassword1=''
      $scope.registerPassword2=''
      alert("Passwords do not match.")
      return
    }
    var req = {
      url: "/user/register",
      method: 'POST',
      data: {
        username:$scope.registerUsername,
        password1:$scope.registerPassword1,
        password2:$scope.registerPassword2
      },
      headers: {'Content-Type': 'application/json'}
    }
    $scope.registerUsername=''
    $scope.registerPassword1=''
    $scope.registerPassword2=''
    $http(req).then(function success(res) {
      if(res.data.result){
        $location.path("/profile")
      }
    }, function error(res) {
      alert(res.data.error)
    });
  }
  $scope.logout = function(){
    var req = {
      url: "/user/logout",
      method: 'POST',
      headers: {'Content-Type': 'application/json'}
    }
    $http(req).then(function success(res) {
      if(res.data.result){
        $location.path("/")
      }
    }, function error(res) {
      alert("Unable to contact server.")
    });
  }
  $scope.loadGames = function(){
    var req = {
      url: "/user/games",
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
    }
    $http(req).then(function success(res) {
      if(res.data.result){
        $scope.games = res.data.games
      }
    }, function error(res) {
      $location.path("/")
    });
  }
  $scope.createGame = function(){
    // alert("test")
    var req = {
      url: "/game/create",
      method: 'POST',
      headers: {'Content-Type': 'application/json'}
    }
    $http(req).then(function success(res) {
      $scope.loadGames()
    }, function error(res) {
      $scope.loadGames()
    });
  }
}])