# Mercurium
Playable at: http://mercurium.herokuapp.com

Images:
Character Sprites: http://palinor.deviantart.com/art/RPG-Maker-VX-sprite-dump-2-227419486
Footsteps Icon: https://commons.wikimedia.org/wiki/File:Footsteps_icon.svg
Attack Icon: http://vector.me/browse/299863/icon_games

Code Snippets:
Login and Password handling: http://blog.mongodb.org/post/32866457221/password-authentication-with-mongoose-part-1

Many of the hex functions were adapted from this great resource: http://www.redblobgames.com/grids/hexagons/

#Features
Currently, the game features user creation and multiple game creation per user. AI is not yet implemented, but I would like to add it in at some point.

Each character gets a set number of action points per turn. Moving uses one point per hex moved, attacks use 2.5 movements. Characters can do any combination of movement and attacking, provided they use less action points than they have available. Any unused action points will carry over into the next round, allowing characters to 'save up' points for burst movement/damage.

The damage calculation is: base_attack plus or minus 50%, then multiplied by (10-target defense). Defense is basically 10% damage reduction per point. A character with 10 defense would then be immune to all damage.

This is a very simple damage calculation and could use some more work. The goal was to get a fully functional game done within a week. If I have more time, I would like to add more attack types and rethink the damage calculations. I would also like to add magic damage/defense as well.

Currently it is difficult to distinguish between friend and foe on the battlefield, with more time I would add some way to highlight character teams (maybe red tinting for enemies, blue tinting for friendly).

There is no display of turn results once a turn has been submitted. I would like to add a way to animate the turn so that players can actually see the characters fight and see the damage they are dealing. Also, any errors in sending a move (from malformed data) results in the user being redirected to the log-in page. Not the most graceful error handling.