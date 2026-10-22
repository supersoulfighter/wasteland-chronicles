# Wasteland Chronicles

## Summary

The player character, Xavier, awakens in a cave after a seemingly global catastrophe. The cave is full of hostile mutated animals. Xavier himself now has some mutations that give him abilities like increased strength and speed. 

Xavier soon finds that his mutations are powered by Mutation Crystals he finds erupting from the ground. If he does not periodically absorb the Mutagenic energy in these crystals, he gets weaker.

 Xavier must battle his way through 24 increasingly difficult levels of the cave, find an exit to the surface, and hopefully find out what happened to the world.

## Genre

2D, action RPG, dual-stick shooter

#### Camera

Tilted top-down view, camera following player

#### Platform

Web browser, using the Phaser game engine, Arcade physics engine.

#### Why Play?

Interesting mutation mechanic and intense action.

#### Tone (art, sound, writing)

* Horror, action, adventure
* 16x16 pixel art
* Tile maps
* Particle effects are not pixelated
* Cave is hard to see in the dark beyond gradient view radius

#### References
* Binding of Issac
* Undermine

## Characters

### Attributes
| Attribute      | Player's starting value |
|----------------|-------------------------|
| Health         | 100                     |
| Speed          | 140                     |
| Mutation       | 100                     |

### Mutation
"Mutation" is an energy store that pervades every living thing (most relevantly, players and NPCs). For the player, Mutation has a base decay rate of .1 per second. It is replenished by (Cyan) Mutation Crystals found in the cave. NPCs do not consume Mutation.

#### Deficits
While the player's total Mutation store may vary, when their Mutation drops below 50% (of total), damage dealt begins to decrease (on a eased-in-quadratic curve, down to a floor of 10% at 5% Mutation). Below 5% Mutation, the player loses all Mutation-powered abilities, leaving only a weak punch attack (that does not consume Mutation).

## Movement
Characters have eight-directional movement, but their sprites are only displayed in four directions (up, down, left, right). The sprite is flipped horizontally when the character is moving left. If character is moving diagonally, the sprite displayed is the last used cardinal direction.

## Attacks
All attacks in the game come from a Mutated part of a character's body. Attacks have the following attributes:

### Position
Attacks will originate from a position relative to the character's sprite and relative to the character's facing. Using up to two letters of the following notation, the attack is positioned in one of 13 possible locations:
* C = Center
* F = Front
* R = Rear
* T = Top
* B = Bottom

Enumerated: C, FT, FC, FB, BF, BC, BR, RB, RC, RT, TR, TC, TF

### Shape
#### Mêlée
The (physics body) shape of a mêlée attack determines its range. These shape/sizes are organized into tiers. Attacks listed as "C" are a circle physics body. The number after C is the radius. However, most mêlée attacks are rectangle physics bodies with a 8 pixel height. The width of the rectangle is as follows (pixels):
* XXS = 4
* XS = 8
* S = 16
* M = 24
* L = 32
* XL = 48
* XXL = 64

#### Ranged
Ranged attacks have a trajectory shape and a projectile shape. The following notation is used later to describe the shape of the attack:
* P = Ball-like projectile, parabolic trajectory, circle shape
* U = Bullet-like projectile, straight trajectory, circle shape
* D = Dropped projectile (mine), circle shape
* Y = Ray-like projectile, line shape
* G = Global, hits no matter where player is

### Range
Ranged attacks all have the same range, roughly the game height.

### Accuracy (for the player only)
Mêlée is always more accurate than ranged. Ranged attacks also become less accurate with distance. Accuracy decreases linearly with distance, reducing by 50% from its starting value at max range.


### Enemy Attacks
All enemy attacks are innate (but see Enemies: Attacks below).

### Player Attacks
The player starts with two innate attacks. These are unlimited-ammo attacks that only become unavailable if the player's Mutation is nearly depleted. All other normal attacks are gained by picking up crystal subtypes: Attack Mutation Crystals.

### Attack Mutation Crystals
Each Attack Mutation Crystal type grants a player a mêlée / ranged attack pair. Both attacks:
* Use the same body part and therefore position
* Have the same frequency (attacks per second); while holding the attack button down or pressing it rapidly attacks are limited to this rate
* Display the same animation on the player
* Have a chance to miss (Accuracy); missed attacks pass through the missed enemy and may hit another
* Are ammunition-based, that is, the crystal grants a finite number of uses
* Consume Mutation; mêlée attacks always consume .333 of the ranged cost 

### Types
| Crystal  | Uses | Coo | Cost | Pos |
|----------|------|-----|------|-----|
| (Innate) | ∞    | .5  | .1   | FC  |
| Black    | 128  | .17 | .1   | FC  |
| Red      | 64   | .33 | .2   | FC  |
| Orange   | 32   | .5  | .4   | FC  |
| Yellow   | 16   | .75 | .8   | C   |
| Green    | 8    | 1   | 1.6  | FC  |
| Blue     | 4    | 1.5 | 3.2  | C   |
| Purple   | 2    | 2   | 6.4  | BC  |
| White    | 1    | 3   | 12.8 | C   |

* "Coo" = Cooldown between attacks (seconds)
* "Cost" = Mutation cost
* "Pos" = Position on body

### Mêlée stats
| Crystal  | Dmg | Acu | Shp |
|----------|-----|-----|-----|
| (Innate) | 20  | 84  | XS  |
| Black    | 30  | 86  | XS  |
| Red      | 40  | 88  | XS  |
| Orange   | 50  | 90  | M   |
| Yellow   | 60  | 92  | C16 |
| Green    | 70  | 94  | M   |
| Blue     | 80  | 96  | C18 |
| Purple   | 90  | 98  | C20 |
| White    | 100 | 100 | C22 |

* "Dmg" = Damage dealt
* "Acu" = Accuracy (%)
* "Shp" = Shape

### Ranged
| Crystal  | Dmg | Scu | Spd | Shp |
|----------|-----|-----|-----|-----|
| (Innate) | 10  | 50  | 500 | U   |
| Black    | 15  | 55  | 750 | U   |
| Red      | 20  | 60  | 600 | U   |
| Orange   | 25  | 65  | 900 | U   |
| Yellow   | 30  | 70  | 650 | U   |
| Green    | 35  | 75  | 700 | P   |
| Blue     | 40  | 80  | 350 | U   |
| Purple   | 45  | 85  | 550 | U   |
| White    | 50  | 90  | 650 | U   |

* "Dmg" = Damage dealt
* "Acu" = Accuracy (%)
* "Spd" = projectile speed (pixels per second).
* "Shp" = Shape

### Attack descriptions

#### (Innate): Hand
Mêlée: Stab with a bayonet-like shard that extends from the player's palm.

Ranged: Shoot deadly shards from the player's palm.

#### Black: Elbow
Mêlée: Jab with the player's sharp elbow, knocking back enemies a bit.

Ranged: Rapidly shoot darts from the player's elbow.

#### Red: Forearm
Mêlée: Slash with the player's sword-like forearm, hitting everything in a 120 degree arc.

Ranged: 5 jagged shards fan out from the player's forearm in a 60 degree arc.

#### Orange: Arm
Mêlée: The player's whole arm becomes a spear, piercing through all enemies in range.

Ranged: A javelin shoots from the player's arm, piercing through all enemies in its path.

#### Yellow: Double Hands
Mêlée: Fuse the player's hands into a heavy club, damaging and staggering surrounding enemies (radius: 40).

Ranged: The player send a wave of spikes from their hands that travels through the ground and bounces off obstacles twice.

#### Green: Foot
Mêlée: A powerful kick that turns enemies into projectiles (Kicked enemy takes damage, is hurled even if killed by the kick, and does area of effect damage on impact with a radius of 30 at .333 damage).

Ranged: The player's foot becomes a flying hook, bouncing to up to 4 enemies (distance to next enemy must be less than last).

#### Blue: Shin
Mêlée: Spinning kick that hits all enemies in a full circle.

Ranged: The player sprays shrapnel in all directions.

#### Purple: Leg
Mêlée: Low full-circle kick that knocks all ground based enemies off their feet for 5 seconds.

Ranged: Strands of sinew whip out from the player's leg in a full circle, entangling enemies for 5 seconds.

#### White: Torso
Mêlée: 16 spikes erupt from the player's body in random directions.

Ranged: 16 spikes explode from the player's body and then explode again into 4 fragments on impact. (Fragments have .25 of the range and damage of the parent, and do not collide with the impact point.)


### Targeting
A minimal crosshair is displayed as the player's cursor (unless the cursor is over a UI element). Attacks auto switch between mêlée and ranged based on the nearest target in the line of sight between the player and the crosshair. If there are no targets in the player's targeting cone, the mêlée attack animation plays, but no Mutation is consumed.


### Player Special Abilities
Player special abilities are not tied to specific crystals, but they still require Mutation to use. The player starts with one innate special ability, Bomb (4 Mutation cost). They can add additional special abilities as they level up (See Player Leveling below).


## Controls

| Action | Primary | Alternate | Gamepad |
| --- | --- | --- | --- |
| Move | WASD | | Left stick |
| Aim (full circle) | Mouse | Left/right arrows: rotate aim counter-/clockwise | Right stick |
| Attack | Left mouse | Up arrow | Right trigger |
| Use Special Ability | Right mouse | Down arrow | Left trigger |
| Zoom view | Scroll wheel | < and > | Left shoulder + Right stick |
| Cycle attack | /| | X |
| Cycle special ability | . | | B |
| Toggle Attack / Special ability Hotkey Bar | Shift | | Right shoulder |
| Select Attack | Number keys 1-0 |   |  |
| Select Special Ability | Number keys 1-0 |   |  |
| Map | m |  | Select button |
| Pause / Character Screen | p | c | Menu button |

## Player Leveling

The player's level starts at 1 and increases by 1 after completing a game level. Each player level increases the player's Health and Mutation by 10% (compounded). Completion of a game level also allows the player to choose 1 of the following 20 special abilities:

### Passive
| Name        | Effect                                        |
|-------------|-----------------------------------------------|
| Fortitude   | Health increased by 10%                       |
| Fleetfoot   | Speed increased by 20%                        |
| Energized   | Energy increased by 10%                       |
| Boxer       | Melee attacks do 10% more damage              |
| Dexterity   | Ranged attacks do 10% more damage             |
| Sealed      | Energy decay reduced to .5                    |
| Nightvision | Greatly increases night vision                |
| Nimble      | 10% chance of dodging incoming ranged attacks |
| Slippery    | 10% chance of doding incoming melee attacks   |
| Sturdy      | 20% chance of avoiding incoming knockdowns    |
| Swimmer     | Water movement penalty reduced to 33%         |

### Active
| Key | Name     | Cost | Coo | Dmg | Acu | Pos | Shp | Spd | 
|:----|:---------|:-----|:----|:----|:----|:----|:----|:----|
| 1   | Bomb     | 4    | 2   | 30  | 75  | TF  |     | 300 |
| 2   | Armor    | 5    | 10  |     |     |     |     |     |
| 3   | Rage     | 6    | 12  |     |     |     |     |     |
| 4   | Heal     | 7    | 15  |     |     |     |     |     |
| 5   | Charge   | 8    | 0   | 50  | 80  | C   | C10 |     |
| 6   | Beam     | .1   | .1  | 1   | 80  | FT  | Y   |     |
| 7   | Flip     | 12   | 20  |     | 90  | FC  |     | L   |
| 8   | Mine     | 4    | 3   | 60  | 100 | RB  | D   |     |
| 9   | Antenna  | 15   | 30  |     |     |     |     | L   |
| 0   | Mutilate | 20   | 90  | 70  |     |     | G   |     |

* "Cost" = Mutation consumed
* "Coo" = Seconds between allowed uses
* "Dmg" = Damage dealt
* "Acu" = Accuracy
* "Pos" = Position on body
* "Shp" = Shape
* "Spd" = For ranged attack, speed of projectile

The player's innate active Special Ability, Bomb, is listed here for completeness, but is not a level completion award.

### Active Special Ability Descriptions

#### Bomb
A ball of spike launches from the player's chest and explodes on impact. (Radius 16)

#### Armor
Reduces damage received by 25% for 5 seconds.

#### Rage
All attacks do 15% more damage for 5 seconds.

#### Heal
Restores 50 health.

#### Charge
Charge forward (up to 500 pixels at 400 pixels per second), dealing damage to all enemies in the player's path.

#### Beam
Mutation energy cuts through enemies wherever the player looks. (Cooldown is attack rate. Cost and Damage are per attack)

#### Flip
Touch a non-boss enemy and they join the player's side for 10 seconds.

#### Mine
Drop a pile of shrapnel that explodes when an enemy touches it. (Radius 24)

#### Antenna
Growing from the player's head, this appendage will block up to 10 incoming ranged attacks. On 10th block, antenna dies and the cooldown starts.

#### Mutilate
The player overloads the Mutation energy of all visible enemies causing it to internally tear them apart.



## Enemies
All enemies in the game are mutated animals.

### AI
Enemy AI is modeled as states. The likelihood of adopting any state is weighted.

#### Attack
If not in range, close in. If in range, execute attack.
Weight: 2

#### Maneuver
Move around, trying to find a desirable attack position, and trying to spread out from other enemies, but don't exceed maximum maneuver time.

Enemies won't actually be in a state called maneuver, but will instead be in a more specific maneuvering style: fly, leap, burrow, walk. A flyer or leaper will tend to attack once, disengage, repeat. Burrowers or walkers tend to stay engaged.

#### Fly
Attacks player from any angle. 15% harder to hit.
Weight: 1

#### Leap
Always hopping around. Prefers to attack player from sides.
Weight: .9

#### Burrow
Burrows underground, invulnerable until surfaced. Prefers to attack player from behind.
Weight: .6

#### Walk
Prefers to attack player's front.
Weight: .5

#### Lick Wounds
Any enemy can retreat to "lick wounds" (regenerates 25% of max health over 5 seconds).
Weight: .3


### Stats

| Animal    | Health | Speed | Type   | Reveal |
|-----------|--------|-------|--------|--------|
| Mosquito  | 10     | 120   | fly    | 1      |
| Firefly   | 16     | 80    | fly    | 2      |
| Moth      | 24     | 40    | fly    | 4      |
| Bat       | 50     | 200   | fly    | 7      |
| Swiftlet  | 65     | 320   | fly    | 11     |
| Spider    | 20     | 80    | leap   | 1      |
| Frog      | 40     | 120   | leap   | 3      |
| Squirrel  | 50     | 160   | leap   | 5      |
| Toad      | 60     | 100   | leap   | 8      |
| Rabbit    | 70     | 200   | leap   | 12     |
| Ant       | 3      | 32    | burrow | 1      |
| Worm      | 25     | 20    | burrow | 3      |
| Beetle    | 30     | 40    | burrow | 6      |
| Snake     | 60     | 100   | burrow | 9      |
| Mole      | 80     | 140   | burrow | 13     |
| Scorpion  | 40     | 48    | walk   | 1      |
| Rat       | 65     | 160   | walk   | 2      |
| Porcupine | 70     | 120   | walk   | 4      |
| Skunk     | 75     | 120   | walk   | 10     |
| Fox       | 90     | 180   | walk   | 14     |

* "Speed" = movement speed (pixels per second)
* "Reveal" = game level that enemy first appears


### Attack stats

| Animal    | Attack         | Dmg | Coo | Pos | Shp | Spd |
|-----------|----------------|-----|-----|-----|-----|-----|
| Mosquito  | Drain Bite     | 30  | 2   | FB  | XXS |     |
| Firefly   | Burn Bite      | 20  | 1   | FB  | XXS |     |
| Moth      | Goo Bomb       | 10  | 4   | FB  | P   | 200 |
| Bat       | Wing Barbs     | 50  | 4   | C   | U   | 300 |
| Swiftlet  | Dive Bite      | 80  | 4   | FB  |     |     |
| Spider    | Poison Bite    | 20  | 1   | FT  |     |     |
| Frog      | Tongue Strike  | 30  | 2   | FT  |     | 600 |
| Squirrel  | Tail Whip      | 40  | .5  | RT  |     |     |
| Toad      | Gas Cloud      | 25  | .5  | C   | D   |     |
| Rabbit    | Headbutt Leap  | 50  | 1   | FT  | XS  |     |
| Ant       | Micro Bite     | 8   | .33 | FT  | XXS |     |
| Worm      | Regurge Surge  | 5   | 4   | FT  | *   |     |
| Beetle    | Fecal Ball     | 10  | 4   | FB  | U   | 300 |
| Snake     | Poison Spit    | 25  | 4   | FT  | P   | 400 |
| Mole      | Mound Eruption | 35  | 10  | TC  | S   |     |
| Scorpion  | Triple Strike  | 20  | 5   | FC  | M   |     |
| Rat       | Chew Through   | 40  | .2  | FT  | XS  |     |
| Porcupine | Spine Blast    | 30  | 2   | C   | U   | 500 |
| Skunk     | Acid Spray     | 30  | 2   | RC  | Y   |     |
| Fox       | Eerie Cry      | 45  | 2   | C   | XXL |     |

* "Dmg" = Damage per attack
* "Coo" = Seconds between allowed uses
* "Pos" = Position on body
* "Shp" = Shape
* "Spd" = projectile speed (no Speed means attack is mêlée)
* \* = Projectile matches whatever was swallowed


### Attack descriptions

#### Drain Bite
A bite that slows the player by 1% for 5 seconds (stacking).

#### Burn Bite
After initial damage, this bite deals 5 additional damage over 5 seconds.

#### Goo Bomb
Lobs a small toxic glob at the player; if it does not hit the player, stays on ground for 5 seconds or until player touches it.

#### Wing Barbs
Sprays 4 barbs at player in a 36 degree arc.

#### Dive Bite
Unlike the other flying enemy bites, this attack does not require slowing down; the Swiftlet passes right through the player.

#### Poison Bite
After initial damage, this bite deals 10 additional damage over 5 seconds.

#### Tongue Strike
Very fast strike from a distance.

#### Tail Whip
A whip of the tail that deals damage in a full circle.

#### Gas Cloud
Leaves behind a damaging cloud for 6 seconds.

#### Headbutt Leap
Leaps in to headbutt and immediately leaps back to dodge any counterattack.

#### Micro Bite
Ants attack in mass to do more damage.

#### Regurge Surge
The Worm can ingest any player projectile, except rays, and regurgitate it back at them.

#### Fecal Ball
A rolling fecal ball that bounces around for 3 seconds potentially hitting multiple times.

#### Poison Spit
After initial damage, this bite deals 20 additional damage over 5 seconds.

#### Mound Eruption
Damages, and then staggers player for 1 second.

#### Triple Strike
Scorpion rapidly attacks with each claw and then its tail; if all three hit, does an extra 20 damage.

#### Chew Through
Once it starts biting, the Rat does not stop until dead.

#### Spine Blast
A blast of to 8 spines in all directions.

#### Acid Spray
After initial damage, an acid (dealing 1 damage per second) stays on the player until they touch water or a Mutation Crystal.

#### Eerie Cry
Haunting shriek causes the player to lose all attack ability for 2 seconds.

## Bosses
The end of every 3 levels features a boss battle. Bosses are supported by enemies of their same type (so long as they are revealed) that arrive in waves and auto respawn when all minions in a wave are defeated (after a 5-second delay). 

| Lvl | Animal  | Health | Spd | Type   | Spt |
|-----|---------|--------|-----|--------|-----|
| 3   | Wolf    | 600    | 30  | walk   | 4   |
| 6   | Beaver  | 800    | 30  | burrow | 6   |
| 9   | Eagle   | 1000   | 80  | fly    | 8   |
| 12  | Cougar  | 1200   | 60  | leap   | 10  |
| 15  | Bear    | 1400   | 40  | walk   | 12  |
| 18  | Badger  | 1600   | 50  | burrow | 14  |
| 21  | Condor  | 1800   | 70  | fly    | 16  |
| 24  | Gorilla | 2000   | 40  | leap   | 20  |

* "Lvl" = Fight boss at end of this game level
* "Spd" = movement speed (pixels per second)
* "Spt" = number of minions that support the boss (in a wave)

### Boss attacks

 | Animal  | Attack           | Pos | Shp | Spd | Dmg | Coo | Wgt |
 |---------|------------------|-----|-----|-----|-----|-----|-----|
 | Wolf    | Fang Bite        | FC  | XS  |     | 20  | 1   | 2   |
 | Wolf    | Claw Combo       | FC  | S   | .5  | 10  | 5   | .7  |
 | Wolf    | Chilling Howl    | C   | G   |     |     | 10  | .3  |
 | Beaver  | Incisor Chop     | FC  | XS  | .3  | 5   | 7   | 2   |
 | Beaver  | Tail Slap        | RB  | C32 |     | 20  | 2   | 1   |
 | Beaver  | Wood Chuck       | RB  | P   | 400 | 30  | 1   | 1.5 |
 | Eagle   | Rip Bite         | FB  | XS  |     | 35  | 1   | 2   |
 | Eagle   | Talon Grab       | BF  | S   |     | 60  | 5   | 1   |
 | Eagle   | Piercing Screech | C   | G   |     |     | 10  | .3  |
 | Cougar  | Severe Scratch   | FC  | S   |     | 40  | 1   | 2   |
 | Cougar  | Brutal Pounce    | FB  | S   | .25 | 6   | 5   | 1   |
 | Cougar  | Rumbling Growl   | C   | G   |     |     | 10  | .3  |
 | Bear    | Angry Gaze       | FT  | Y   | .1  | 5   | 5   | 2   |
 | Bear    | Heavy Swipe      | FC  | S   |     | 65  | 1   | 2   |
 | Bear    | Fearsome Roar    | C   | G   |     |     | 10  | .4  |
 | Bear    | Absolute Maul    | FC  | S   | .12 | 7   | 10  | .3  |
 | Badger  | Fear Bite        | FC  | S   |     | 45  | 5   | 2   |
 | Badger  | Ankle Crush      | FB  | S   |     | 45  | 5   | 1.5 |
 | Badger  | Badgering Chase  | FC  | S   |     | 25  | 5   | .7  |
 | Badger  | Hole Trap        | C   | D   |     | 45  | 5   | 1   |
 | Condor  | Decay Bite       | FC  | M   |     | 50  | 5   | 2   |
 | Condor  | Deathly Swoop    | FB  | M   |     | 70  | 5   | 1.5 |
 | Condor  | Quill Dart       | FC  | U   |     | 35  | 1   | 1   |
 | Condor  | Quill Spray      | FC  | U   |     | 35  | 5   | .7  |
 | Gorilla | Pound Down       | FB  | C12 |     | 20  | 5   | 2   |
 | Gorilla | Hurl Boulder     | TC  | P   |     | 80  | 5   | 1.5 |
 | Gorilla | Hurl Plaything   | FB  | U   |     | 200 | 10  | .8  |
 | Gorilla | Chest Beat       | C   | G   |     |     | 10  | .4  |
 | Gorilla | Boom Clap        | C   | C64 |     | 20  | 10  | .2  |

* "Pos" = Attack position on body
* "Shp" = Shape
* "Spd" = If P-or-T-type ranged, speed of projectile (pixels per second). If R-type ranged or mêlée combo, delay between each strike (seconds).
* "Coo" = Cooldown between attacks
* "Wgt" = (Weight) Likelihood of adopting this state

### Boss attack descriptions

#### Fang Bite
Fangs pierce and tear.
#### Claw Combo
A rapid series of five claw swipes.
#### Chilling Howl
Slows the player down by 10% for 10 seconds (stacking).

#### Incisor Chop
Damages the player continuously while facing them and in range.
#### Tail Slap
A seismic rumble that staggers the player for 1 second.
#### Wood Chuck
Chucks a wooden log at the player.

#### Rip Bite
Rips off a piece of flesh.
#### Talon Grab
Picks up the player and drops them.
#### Piercing Screech
Increases the damage of all minions by 10% for 10 seconds (stacking).

#### Severe Scratch
After initial damage, the player bleeds 10 more damage over 5 seconds.
#### Brutal Pounce
Pounces on the player and then attacks until the player wiggle free (move in each direction 4 times).
#### Rumbling Growl
Decreases the player damage given by 10% for 10 seconds (stacking).

#### Angry Gaze
A beam attack that burns the flesh.
#### Heavy Swipe
A powerful swipe that staggers the player for 1 second.
#### Fearsome Roar
Causes the player to lose attack ability for 5 seconds.
#### Absolute Maul
A rapid series of 7 attacks. Invulnerable throughout.

#### Fear Bite
Causes the player to run away for 3 seconds.
#### Ankle Crush
After initial damage, the player is knocked down for 3 seconds.
#### Badgering Chase
Chases the player for 5 seconds, damaging at each touch. Invulnerable throughout.
#### Hole Trap
Weakens the ground so that the player will fall in and be stuck for 3 seconds.

#### Decay Bite
After initial damage, the player rots for 20 more damage over 5 seconds.
#### Deathly Swoop
After initial damage, the player is knocked down for 4 seconds.
#### Quill Dart
Feathers become projectiles. Fired in a rapid volley. Invulnerable throughout.
#### Quill Spray
A burst of 20 projectiles in a 150 degree arc. Invulnerable throughout.

#### Pound Down
A rapid series of 10 attacks. Invulnerable throughout.
#### Hurl Boulder
Hurls a large boulder that fragments into 6 smaller rocks on impact.
#### Hurl Plaything
Grabs the player smashes them down once on each side and then throws them.
#### Chest Beat
Increases the damage of all minions by 20% for 10 seconds (stacking).
#### Boom Clap
A mighty clap that knocks the player down for 5 seconds.

## Props
### Decorative: Impassable
* Stalagmite
* Stalactite

### Decorative: Passable
* Small Bones
* Small Fungus
* Roots
* Drips
* Webs

### Destructible
| Prop              | P  | H   | On destroyed                           |
|-------------------|----|-----|----------------------------------------|
| Large Fungus      |    | 300 |                                        |
| Large Bones       |    | 200 |                                        |
| Large Rock        |    | 960 | Breaks into 2-3 Medium Rocks           |
| Medium Rock       |    | 240 | Breaks into 2-4 Small Rocks            |
| Small Rock        | ✓ | 60  |                                        |
| Large Branches    |    | 450 | Breaks into 2-4 Small Branches         |
| Small Branches    | ✓ | 30  |                                        |
| Explosive Crystal |    | 70  | Does 50 damage in radius 60            |
| Slowing Crystal   |    | 70  | Slows enemies 20% 5 seconds, radius 60 |

* "P" = can be moved through
* "H" = health

### Light casting
* Glowing mushrooms
* Glowing crystals



## Terrains
| Terrain   | Level | Effect                                  | 
|-----------|-------|-----------------------------------------|
| Limestone | 1     |                                         |
| Water     | 1     | Slowed by 66%                           |
| Rocky     | 4     |                                         |
| Muddy     | 7     | Slowed by 20%                           |
| Icy       | 10    | Harder to stop (characters slide)       |
| Lava      | 16    | If not moving, take 1 damage per second |
| Mutated   | 22    | Damage increased by 10%                 |

* "Level" = game level that terrain first appears
* Flying enemies not affected by terrain movement penalties except Lava



## User Interface
### Screens
* Splash / Main Menu
* Settings
* Pause / Character
* Map
* Level Complete
* Death
* Cutscene
* Victory
* Playing

### Playing Screen
This is the main screen where the player is moving through a level, fighting enemies. The HUD for this screen contains:
* Health Meter
* Mutation Meter
* Player Level
* Game Level Name
* Hotkey Bar:
  - Toggles to display slots for Attacks or Special Abilities
  - Mapped to keys 1-0
  - Icons for each slot
  - Attacks also shows uses left
  - Special Ability also show cooldown progress bar
