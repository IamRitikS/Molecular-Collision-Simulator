var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;
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

var minRadius = 10;
var maxRadius = 15;
var minNumOfMolecules = 100;
var maxNumOfMolecules = 150;
var maxVelocity = 0.5;

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

function resolveCollision(molecule, otherMolecule)
{
    const xVelocityDiff = molecule.velocity.x - otherMolecule.velocity.x;
    const yVelocityDiff = molecule.velocity.y - otherMolecule.velocity.y;

    const xDist = otherMolecule.x - molecule.x;
    const yDist = otherMolecule.y - molecule.y;

    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0)
    {

        const angle = -Math.atan2(otherMolecule.y - molecule.y, otherMolecule.x - molecule.x);

        const m1 = molecule.mass;
        const m2 = otherMolecule.mass;

        const u1 = rotate(molecule.velocity, angle);
        const u2 = rotate(otherMolecule.velocity, angle);

        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        molecule.velocity.x = vFinal1.x;
        molecule.velocity.y = vFinal1.y;

        otherMolecule.velocity.x = vFinal2.x;
        otherMolecule.velocity.y = vFinal2.y;

		if(molecule.color == '#262326')
		{
			molecule.color = randomColor(colors);
		}
		if(otherMolecule.color == '#262326')
		{
			otherMolecule.color = randomColor(colors);
		}
    }
}

function molecule(x, y, radius, color)
{
	this.x = x;
	this.y = y;
	this.velocity = 
	{
		x: randomIntFromRange(-maxVelocity, maxVelocity),
		y: randomIntFromRange(-maxVelocity, maxVelocity),
	}
	while(this.velocity.x == 0)
	{
		this.velocity.x = randomIntFromRange(-maxVelocity, maxVelocity)
	}
	while(this.velocity.y == 0)
	{
		this.velocity.y = randomIntFromRange(-maxVelocity, maxVelocity)
	}
	this.radius = radius;
	this.color = color;
	this.mass = 1;


	this.update = function(molecules)
	{
		this.draw();

		for(let i = 0; i < molecules.length; i++)
		{
			if(this === molecules[i])
			{
				continue;
			}
			else
			{
				if(distance(this.x, this.y, molecules[i].x, molecules[i].y) - this.radius * 2 <= 0)
				{
					resolveCollision(this, molecules[i]);
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
		for(let i = 0; i < molecules.length; i++)
		{
			if(molecules[i].velocity.x != 0 || molecules[i].velocity.y != 0)
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
let molecules;
let t0;
let t1;
let MoleculeNumber = randomIntFromRange(minNumOfMolecules, maxNumOfMolecules);

function init()
{
	MoleculeNumber = randomIntFromRange(minNumOfMolecules, maxNumOfMolecules);
	console.log(MoleculeNumber);
	t0 = performance.now();

	molecules = [];

	for(let i = 0; i < MoleculeNumber; i++)
	{
		const radius = randomIntFromRange(minRadius, maxRadius);
		let x = randomIntFromRange(radius, canvas.width-radius);
		let y = randomIntFromRange(radius, canvas.height-radius);
		const color = randomColor(colors);

		if(i !== 0)
		{
			for(let j = 0; j < molecules.length; j++)
			{
				if(distance(x, y, molecules[j].x, molecules[j].y) - radius * 2 <= 0)
				{
					x = randomIntFromRange(radius, canvas.width-radius);
					y = randomIntFromRange(radius, canvas.height-radius);
					j = -1;
				}
			}
		}

		molecules.push(new molecule(x, y, radius, color));
	}
}

function animate()
{
	requestAnimationFrame(animate);

	c.clearRect(0, 0, canvas.width, canvas.height);

	molecules.forEach(molecule => {
		molecule.update(molecules);
	});
}

//Initializing Variables
mouse.x = -30;
mouse.y = -30;

function startAnimation()
{
	canvas.scrollIntoView();

	minRadius = parseInt(document.getElementById('minRadius').value,10);
	maxRadius = parseInt(document.getElementById('maxRadius').value,10);
	minNumOfMolecules = parseInt(document.getElementById('minNumOfMolecules').value,10);
	maxNumOfMolecules = parseInt(document.getElementById('maxNumOfMolecules').value,10);
	maxVelocity = parseFloat(document.getElementById('maxVelocity').value,10);
	
	console.log(minRadius);
	console.log(maxRadius);
	console.log(minNumOfMolecules);
	console.log(maxNumOfMolecules);
	console.log(maxVelocity);


	init();
	animate();
}
