var express = require("express");
var router = express.Router();

var db = require('./../mongoose')

router.post("/login", function(req,res){
	// fetch user and test password verification
	db.user.findOne({ username: req.body.username }, function(err, user) {
	    if (err||!user) {
	    	res.status(404).send({result:false,error:"Username/password not found."})
	    	return
	    }
	    // test a matching password
	    user.comparePassword(req.body.password, function(err, isMatch) {
	        if (err||!isMatch){
	        	res.status(404).send({result:false,error:"Username/password not found."})
	        }
	        req.session.username=user.username
	        res.send({result:true})
	    });
	});
})
router.post("/register", function(req,res){
	if(req.body.password1&&req.body.password1!==req.body.password2){
		res.status(401).send({result:false,error:"Passwords do not match."})
		return
	}
	db.user.findOne({username:req.body.username}, function(err, user){
		if(err){
			res.status(401).send({result:false,error:err})
			return
		}
		if(user){
			res.status(401).send({result:false,error:"A user with that name already exists."})
			return
		}
		newuser = new db.user({username:req.body.username, password:req.body.password1})
		newuser.save()
		req.session.username=req.body.username
		res.send({result:true})
	})
})
router.get("/games/", function(req,res){
	if(!req.session.username){
		res.status(404).send({result:false, error:"You are not logged in."})
		return
	}
	db.user.findOne({username:req.session.username}).populate('games').exec(function(err, user){
		// db.game.find({}, function(err, games){
		// 	user.games=games
		// 	user.save()
		// })
		if(err||!user){
			res.status(404).send({result:false, error:"Error reading database."})
			return
		}
		var result = {result:true, games:[]}
		for(var i=0;i<user.games.length;i++){
			result.games.push(user.games[i].id)
		}
		res.send(result)
	})
})
router.post("/logout", function(req,res){
	req.session=null
	res.send({result:true})
})
router.get("/profile", function(req,res){
	res.send(req.session.username)
})

module.exports = router;