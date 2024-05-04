document.addEventListener('DOMContentLoaded', function() {

    // Selects the first element with the class '.confetti-button' as the target button.
    const button = document.querySelector('.confetti_button');  // You can change the class, just make sure it is defined in the module also.  
    const counter = document.querySelector('.counter');

    let counterValue = 0;
  
    // Adds an event listener for the 'click' event on the targeted button.
    button.addEventListener('click', function(event) {
      // Retrieves the position and size of the button to calculate where the confetti should appear.
      const rect = button.getBoundingClientRect();
  
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
        console.log(video)
        video.style.visibility = "visible";
        video.loop = true;
        video.play()
      }

      counter.textContent = counterValue
    });
});