var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;
let factor = Math.abs(innerHeight-innerWidth)

// Variables
var mouse =
{
	x: innerWidth / 2,
	y: innerHeight / 2 
};

var colors =
[
	'#2185C5',
	'#7ECEFD',
	'#FFF6E5',
	'#FF7F66'
];

// Event Listeners
addEventListener("mousemove", function(event)
{
	mouse.x = event.clientX;
	mouse.y = event.clientY;
});

addEventListener("resize", function()
{
	canvas.width = innerWidth;	
	canvas.height = innerHeight;

});

// Utility Functions
function randomIntFromRange(min,max)
{
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors)
{
	return colors[Math.floor(Math.random() * colors.length)];
}

function distance(x1, y1, x2, y2)
{
	let xDistance = x2 - x1;
	let yDistance = y2 - y1;

	return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

function win()
{
	t1 = performance.now();
	alert('YOU WON!!!' + ' Time Taken = ' + Math.floor((t1 - t0)/1000));
	init();	
}

//Actual functions
function rotate(velocity, angle)
{
    const rotatedVelocities =
    {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

function resolveCollision(particle, otherParticle)
{
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0)
    {

        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;

		if(particle.color == '#262326')
		{
			particle.color = randomColor(colors);
		}
		if(otherParticle.color == '#262326')
		{
			otherParticle.color = randomColor(colors);
		}
    }
}

function Particle(x, y, radius, color)
{
	this.x = x;
	this.y = y;
	this.velocity = 
	{
		x: randomIntFromRange(-0.5, 0.5),
		y: randomIntFromRange(-0.5, 0.5),
	}
	if(this.velocity.x == 0)
	{
		this.velocity.x = randomIntFromRange(-0.5, 0.5)
	}
	if(this.velocity.y == 0)
	{
		this.velocity.y = randomIntFromRange(-0.5, 0.5)
	}
	this.radius = radius;
	this.color = color;
	this.mass = 1;


	this.update = function(particles)
	{
		this.draw();

		for(let i = 0; i < particles.length; i++)
		{
			if(this === particles[i])
			{
				continue;
			}
			else
			{
				if(distance(this.x, this.y, particles[i].x, particles[i].y) - this.radius * 2 <= 0)
				{
					resolveCollision(this, particles[i]);
				}
			}
		}

		if(this.x-this.radius <= 1 || this.x+this.radius >= innerWidth+1)
		{
			this.velocity.x = -this.velocity.x;
		}
		if(this.y-this.radius <= 1 || this.y+this.radius >= innerHeight+1)
		{
			this.velocity.y = -this.velocity.y;
		}

		if(distance(mouse.x, mouse.y, this.x, this.y) < this.radius+5)
		{
			this.color = '#262326';
			this.velocity.x = 0;
			this.velocity.y = 0;
		}
		this.x += this.velocity.x;
		this.y += this.velocity.y;

		let flag = 'true';
		for(let i = 0; i < particles.length; i++)
		{
			if(particles[i].velocity.x != 0 || particles[i].velocity.y != 0)
			{
				flag = 'false';
				break;
			}
		}
		if(flag == 'true')
		{
			win();
		}
	};

	this.draw = function()
	{
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);	
		c.fillStyle = this.color;
		c.fill();
		c.closePath();
	};
}

//Driver
let particles;
let particleNumber = randomIntFromRange(100, 150);
let t0;
let t1;
function init()
{
	t0 = performance.now();

	particles = [];

	for(let i = 0; i < particleNumber; i++)
	{
		const radius = randomIntFromRange(10, 14);
		let x = randomIntFromRange(radius, canvas.width-radius);
		let y = randomIntFromRange(radius, canvas.height-radius);
		const color = randomColor(colors);

		if(i !== 0)
		{
			for(let j = 0; j < particles.length; j++)
			{
				if(distance(x, y, particles[j].x, particles[j].y) - radius * 2 <= 0)
				{
					x = randomIntFromRange(radius, canvas.width-radius);
					y = randomIntFromRange(radius, canvas.height-radius);
					j = -1;
				}
			}
		}

		particles.push(new Particle(x, y, radius, color));
	}
}

function animate()
{
	requestAnimationFrame(animate);

	c.clearRect(0, 0, canvas.width, canvas.height);

	particles.forEach(particle => {
		particle.update(particles);
	});
}

//Start
mouse.x = -30;
mouse.y = -30;
console.log(innerHeight, innerWidth, factor)
init();
animate();
