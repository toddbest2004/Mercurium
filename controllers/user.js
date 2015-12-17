var express = require("express");
var router = express.Router();

var db = require('./../mongoose')

router.post("/login", function(req,res){
	// fetch user and test password verification
	db.usermodel.findOne({ user_name: req.body.user_name }, function(err, user) {
	    if (err||!user) {
	    	res.status(404).send({result:false,error:"Username/password not found."})
	    	return
	    }
	    // test a matching password
	    user.comparePassword(req.body.password, function(err, isMatch) {
	        if (err||!isMatch){
	        	res.status(404).send({result:false,error:"Username/password not found."})
	        }
	        req.session.user_name=user.user_name
	        res.send({result:true})
	    });
	});
})
router.post("/register", function(req,res){
	if(req.body.password1&&req.body.password1!==req.body.password2){
		res.status(401).send({result:false,error:"Passwords do not match."})
		return
	}
	db.usermodel.findOne({user_name:req.body.user_name}, function(err, user){
		if(err){
			res.status(401).send({result:false,error:err})
			return
		}
		if(user){
			res.status(401).send({result:false,error:"A user with that name already exists."})
			return
		}
		newuser = new db.usermodel({user_name:req.body.user_name, password:req.body.password1})
		newuser.save()
		req.session.user_name=req.body.user_name
		res.send({result:true})
	})
})
router.get("/games/", function(req,res){
	if(!req.session.user_name){
		res.status(404).send({result:false, error:"You are not logged in."})
		return
	}
	db.usermodel.findOne({user_name:req.session.user_name}).populate('games').exec(function(err, user){
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
	res.send(req.session.user_name)
})

module.exports = router;