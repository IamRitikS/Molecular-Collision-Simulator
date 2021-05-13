# Molecular-Collision-Simulator
This simulator simulates elastic molecular collisions of few molecules scattered across the system.
Molecular collisions are perfectly elastic; when two molecules collide, they change their directions and kinetic energies, but the total kinetic energy is conserved.  
As wikipedia states,
>At any instant, half the collisions are, to a varying extent, inelastic collisions (the pair possesses less kinetic energy in their translational motions after the collision than before), and half could be described as “super-elastic” (possessing more kinetic energy after the collision than before). Averaged across the entire sample, molecular collisions can be regarded as essentially elastic.  

However, in this simulator, if you hover your mouse over a particular molecule, it loses all its energy; it stops moving at all until some other molecule collides with it and passes some of the energy to the frozen molecule, therefore overall kinetic energy IS lost in this simulator. But if you don't hover your mouse over any molecule, no energy is lost.    

*Like challenges? Try to freeze all the molecules as fast as you can.*  


## Link to see it in working mode - https://iamritiks.github.io/Molecular-Collision-Simulator/

## Technologies used
#### JavaScript
  JavaScript canvas is used to draw the molecules on the screen.
#### Pythagorean Theorem
  Pythagorean theorem is used to detect when two molecules are colliding. An image on how this works from a higher level of understanding is linked below for reference.
  <img src="/img/Pythagorean Theorem.png" alt="Pythagorean Theorem for Collision Detection">
#### Two-dimensional Collision Resolution
  [Two-dimensional collision resolution](https://en.wikipedia.org/wiki/Elastic_collision#Two-dimensional_collision_with_two_moving_objects) formula is used to resolve when a collision happens between two molecules. An image on how this works from a higher level of understanding is linked below for reference.
  <img src="/img/Two Dimensional Collision with Two Moving Objects.jpg" alt="Two-dimensional Collision Resolution">
