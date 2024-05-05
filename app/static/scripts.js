function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      // Wyszukaj ciasteczko o nazwie 'csrftoken'
      if (cookie.substring(0, 10) === 'csrftoken=') {
        cookieValue = decodeURIComponent(cookie.substring(10));
        break;
      }
    }
  }
  return cookieValue;
}
var csrftoken = getCookie('csrftoken');
let counterValue = 0;
let doBalls = null
let startTime = null
let endTime = null

function postClick() {
  if (counterValue > 0) {
    var totalTime = 0;
    if (counterValue >= 20) {
      totalTime = endTime - startTime;
    }
    startTime = null
    endTime = null

    let click = counterValue
    counterValue = 0;

    fetch("api/click/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify({ "click": click, "time": totalTime })
    })
    .then(response => {
      if (response.status == 200) {
        console.log("Dodano kliknięcia");
      } else {
        console.log("Nie znaleziono Użytkownika");
      }
      window.location.reload();
    }).catch(error => {
      console.error('Wystąpił błąd:', error);
    });
  }
}


$(document).ready(function(){
    //---------------------------------------
    // Set up ball options
    //---------------------------------------
    
    var ballCount = 100,                                     // How many balls
        DAMPING = 0.4,                                       // Damping
        GRAVITY = 0.01,                                      // Gravity strength
        SPEED = 1,                                           // Ball speed
        ballSrc = 'static/media/unicorn.png',                // Ball image source
        topOffset = 800,                                     // Adjust this for initial ball spawn point
        xOffset = 0,                                         // left offset
        yOffset = 0,                                         // bottom offset
        ballDensity = 20,                                    // How dense are the balls
        ball_1_size = 120,                                   // Ball 1 size
        ball_2_size = 150,                                   // Ball 2 size
        stackBall = true,                                    // Stack the balls (or false is overlap)
        stopAnimation = false
        
    //---------------------------------------
    //---------------------------------------
    //---------------------------------------
    
    
    //---------------------------------------
    // Canvas globals
    //---------------------------------------
    
    var canvas, 
        ctx, 
        TWO_PI = Math.PI * 2, 
        balls = [],
        vel_x,
        vel_y;
    
    var rect = {
        x: 0,
        y: 0
    }; 
    
    //---------------------------------------
    // do the animation
    //---------------------------------------
    
    window.requestAnimFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame
    
    //---------------------------------------
    // set up the ball
    //---------------------------------------
    
    var Ball = function(x, y, radius, width, height) {
        this.x = x;
        this.y = y;
        this.px = x;
        this.py = y;
        this.fx = 0;
        this.fy = 0;
        this.radius = radius;
        
        // 2 Different ball sizes
        
        if( Math.round(Math.random()) === 0) {
            this.width = ball_1_size;
            this.height = ball_1_size;
            if (stackBall) {
                this.radius = ball_1_size/2;
            }
        } else {
            this.width = ball_2_size;
            this.height = ball_2_size;
            if (stackBall) {
                this.radius = ball_2_size/2;
            }
        };
    };
    
    //---------------------------------------
    // Apply the physics
    //---------------------------------------
    
    Ball.prototype.apply_force = function(delta) {
        delta *= delta;
        this.fy += GRAVITY;
        this.x += this.fx * delta;
        this.y += this.fy * delta;
        this.fx = this.fy = 0;
    };
    
    //---------------------------------------
    // Newtonian motion algorithm
    //---------------------------------------
    
    Ball.prototype.velocity = function() {
        var nx = (this.x * 2) - this.px;
        var ny = (this.y * 2) - this.py;
        this.px = this.x;
        this.py = this.y;
        this.x = nx;
        this.y = ny;
    };
    
    //---------------------------------------
    // Ball prototype
    //---------------------------------------
    
    Ball.prototype.draw = function(ctx) {
        
        // Wireframe ball
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.radius, 0, TWO_PI);
        // ctx.stroke();
        
        img = new Image();
        img.src = ballSrc;
        if (stackBall) {
            ctx.drawImage(img, this.x-this.radius-xOffset, this.y-this.radius-xOffset, this.width, this.height); 
        } else {
            ctx.drawImage(img, this.x-xOffset, this.y-yOffset, this.width, this.height); 
        }
    };
    
    
    //---------------------------------------
    // resolve collisions (ball on ball)
    //---------------------------------------
    
    var resolve_collisions = function(ip) {
        var i = balls.length;
        while (i--) {
    
            var ball_1 = balls[i];
            var n = balls.length;
            while (n--) {
    
                if (n == i) continue;
                var ball_2 = balls[n];
                var diff_x = ball_1.x - ball_2.x;
                var diff_y = ball_1.y - ball_2.y;
                var length = diff_x * diff_x + diff_y * diff_y;
                var dist = Math.sqrt(length);
                var real_dist = dist - (ball_1.radius + ball_2.radius);
    
                if (real_dist < 0) {
    
                    var vel_x1 = ball_1.x - ball_1.px;
                    var vel_y1 = ball_1.y - ball_1.py;
                    var vel_x2 = ball_2.x - ball_2.px;
                    var vel_y2 = ball_2.y - ball_2.py;
                    var depth_x = diff_x * (real_dist / dist);
                    var depth_y = diff_y * (real_dist / dist);
                    ball_1.x -= depth_x * 0.5;
                    ball_1.y -= depth_y * 0.5;
                    ball_2.x += depth_x * 0.5;
                    ball_2.y += depth_y * 0.5;
    
                    if (ip) {
                        var pr1 = DAMPING * (diff_x * vel_x1 + diff_y * vel_y1) / length,
                            pr2 = DAMPING * (diff_x * vel_x2 + diff_y * vel_y2) / length;
    
                        vel_x1 += pr2 * diff_x - pr1 * diff_x;
                        vel_x2 += pr1 * diff_x - pr2 * diff_x;
                        vel_y1 += pr2 * diff_y - pr1 * diff_y;
                        vel_y2 += pr1 * diff_y - pr2 * diff_y;
                        ball_1.px = ball_1.x - vel_x1;
                        ball_1.py = ball_1.y - vel_y1;
                        ball_2.px = ball_2.x - vel_x2;
                        ball_2.py = ball_2.y - vel_y2;
                    }
                } 
            }
        }
    };
    
    //---------------------------------------
    // Bounce off the walls
    //---------------------------------------
    
    var check_walls = function() {
        var i = balls.length;
        while (i--) {
            var ball = balls[i];
            
            if (ball.x < ball.radius) {
            
                var vel_x = ball.px - ball.x;
                    ball.x = ball.radius;
                    ball.px = ball.x - vel_x * DAMPING;
                
            } else if (ball.x + ball.radius > canvas.width) {
            
                vel_x = ball.px - ball.x;
                ball.x = canvas.width - ball.radius;
                ball.px = ball.x - vel_x * DAMPING;
                
            }
            
            // Ball is new. So don't do collision detection until it hits the canvas. (with an offset to stop it snapping)
            if (ball.y > 100) {
                if (ball.y < ball.radius) {
                
                    var vel_y = ball.py - ball.y;
                        ball.y = ball.radius;
                        ball.py = ball.y - vel_y * DAMPING;
                    
                } else if (ball.y + ball.radius >canvas.height) {
                    
                    vel_y = ball.py - ball.y;
                    ball.y = canvas.height - ball.radius;
                    ball.py = ball.y - vel_y * DAMPING;
                    
                }
            }
        }
    };
    
    
    //---------------------------------------
    // Add a ball to the canvas
    //---------------------------------------
    
    var add_ball = function(x, y, r) {
        x = x || Math.random() * (canvas.width),
        y = -topOffset,
        r = r || 30 + Math.random() * ballDensity,
        s = true,
        i = balls.length;
        
        while (i--) {
            var ball = balls[i];
            var diff_x = ball.x - x;
            var diff_y = ball.y - y;
            var dist = Math.sqrt(diff_x * diff_x + diff_y * diff_y);
            
            if (dist < ball.radius + r) {
                s = false;
                break;
            }
        }
        i = balls.length;
        
        if (s) { 
            balls.push(new Ball(x, y, r));
        }
    };
    
    //---------------------------------------
    // iterate balls
    //---------------------------------------
    
    var update = function() {
        var iter = 1;
        var delta = SPEED / iter;
        
        while (iter--) {
        
            var i = balls.length;
            while (i--) {
                balls[i].apply_force(delta);
                balls[i].velocity();
            }
            
            resolve_collisions();
            check_walls();
            
            i = balls.length;
            while (i--) { 
                balls[i].velocity();
                var ball = balls[i];
            };
            
            resolve_collisions();
            check_walls();

        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        i = balls.length;
        while (i--) {
            balls[i].draw(ctx);
        }
        
        requestAnimFrame(update);
    };
    
    
    
    //--------------------------------------- 
    // Set up the canvas object
    //---------------------------------------
     
    doBalls = () => {  
        stopAnimation = false;
        canvas = document.getElementById('balls');
        ctx = canvas.getContext('2d');
        container = $(canvas).parent();   
        var $canvasDiv = $('.canvas-holder');
        
        function respondCanvas(){ 
            canvas.height = $canvasDiv.innerHeight();
            canvas.width = $canvasDiv.innerWidth();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        respondCanvas();
        
        // Android friendly window resize
        
        var doit;
        function resizedw(appwidth){
            var window_changed = $(window).width() != appwidth;
            if ($(window).width() != appwidth){
            
                // Reset everything on screen resize
                //this.location.reload(false);
              respondCanvas(); 
            }
            past_width = $(window).width();
        } 
        
        var past_width = $(window).width();
        
        window.onresize = function() {   
            clearTimeout(doit);
            doit = setTimeout(function() {
                resizedw(past_width);
            }, 100);
        };

        add_ball();
        update();
    };
});	




document.addEventListener('DOMContentLoaded', function () {
   // Selects the first element with the class '.confetti-button' as the target button.
   const confetti_button = document.querySelector('.confetti_button');  // You can change the class, just make sure it is defined in the module also.  
   const logout_button = document.querySelector('.logout_button');
   const counter = document.querySelector('.counter');
   const current_user_click = document.querySelector('tr.current td:nth-last-child(2)')

  fetch('api/get_user/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken
    }
  })
    .then(response => response.json())
    .then(data => {
      if (data.name) {
        confetti_button.disabled = false
      } else {
        var name = prompt("Wprowadź swóją nazwę:");
        if (name !== null) {
          fetch('api/create_user/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({ "name": name })
          })
          .then(response => response.json())
          .then(data => {
            if (data.name !== null) {
              window.location.reload();
            } else {
              alert("Nie podano nazwy, spróbój ponownie");
              window.location.reload();
            }
          }).catch(error => {
            console.error('Wystąpił błąd:', error);
          });
        }
      }
    }).catch(error => {
      console.error('Wystąpił błąd:', error);
    });

  // Adds an event listener for the 'click' event on the targeted button.
  confetti_button.addEventListener('click', function (event) {
    endTime = new Date();
    if (!startTime) {
      startTime = new Date();
    }
    // Retrieves the position and size of the button to calculate where the confetti should appear.
    const rect = confetti_button.getBoundingClientRect();

    // Calculates the horizontal (x) center of the button.
    const x = (rect.left + rect.right) / 2;

    // Calculates the vertical (y) center of the button.
    const y = (rect.top + rect.bottom) / 2;

    // Configures the settings for the confetti effect.
    const confettiSettings = {
      particleCount: 100, // Defines the number of confetti particles.
      spread: 70,         // Sets the spread angle of the confetti.
      // Specifies the origin point for the confetti effect based on the button's location.
      origin: { x: x / window.innerWidth, y: y / window.innerHeight }
    };

    // Triggers the confetti effect with the defined settings when the button is clicked.
    confetti(confettiSettings);

    counterValue++

    if (counterValue === 10) {
      const video = document.querySelector('.rickroll');
      video.style.visibility = "visible";
      video.loop = true;
      video.play()
    }

    if (counterValue % 100 === 0 || counterValue === 20 || true) {
      doBalls()
    }

    counter.textContent = counterValue
    current_user_click.textContent = parseInt(current_user_click.textContent) + 1
  });

  logout_button.addEventListener('click', function (event) {
    postClick();
    fetch('api/logout/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
      }
    })
    .then(response => {
      if (response.status == 200) {
        console.log("Wylogowano");
      } else {
        alert("Nie znaleziono Użytkownika");
      }
      window.location.reload();
    }).catch(error => {
      console.error('Wystąpił błąd:', error);
    });
  });
});

window.addEventListener('beforeunload', function(event) {
  postClick()
});
