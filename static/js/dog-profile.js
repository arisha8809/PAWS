document.addEventListener("DOMContentLoaded", () => {
  const dogProfileForm = document.getElementById("dogProfileForm")
  const formResponse = document.getElementById("formResponse")
  const dogProfileModal = document.getElementById("dogProfileModal")
  const getStartedBtn = document.getElementById("getStartedBtn")
  const ctaGetStartedBtn = document.getElementById("ctaGetStartedBtn")
  const closeModalBtn = document.getElementById("closeModalBtn")

  // Modal functions
  const openModal = () => {
    // Check if user is logged in before opening modal
    fetch('/check_auth_status', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.authenticated) {
        dogProfileModal.style.display = "flex";
        document.body.style.overflow = "hidden";
      } else {
        // Show login prompt if not authenticated
        alert("Please log in to register your dog.");
        // Optionally open the auth modal instead
        document.getElementById('auth-modal').style.display = 'block';
      }
    })
    .catch(error => {
      console.error("Error checking authentication:", error);
    });
  };

  const closeModal = () => {
    dogProfileModal.style.display = "none";
    document.body.style.overflow = "auto";
    
    // Reset form and response
    if (dogProfileForm) {
      dogProfileForm.reset();
      
      // Reset input styles
      const inputs = dogProfileForm.querySelectorAll(".animated-input");
      inputs.forEach(input => {
        input.parentElement.classList.remove("focused");
        input.style.borderColor = "";
        input.style.boxShadow = "";
      });
      
      // Hide response message if visible
      if (formResponse) {
        formResponse.style.display = "none";
        formResponse.textContent = "";
        formResponse.className = "form-response";
      }
    }
  };

  // Attach event listeners to buttons if they exist
  if (getStartedBtn) getStartedBtn.addEventListener("click", openModal);
  if (ctaGetStartedBtn) ctaGetStartedBtn.addEventListener("click", openModal);
  if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);

  // Close modal when clicking outside
  window.addEventListener("click", function(event) {
    if (event.target === dogProfileModal) {
      closeModal();
    }
  });

  if (dogProfileForm) {
    // Add animation to form inputs
    const inputs = dogProfileForm.querySelectorAll(".animated-input")
    inputs.forEach((input) => {
      // Focus animation
      input.addEventListener("focus", function () {
        this.parentElement.classList.add("focused")
        this.style.borderColor = "#5cb8ff"
        this.style.boxShadow = "0 0 0 3px rgba(92, 184, 255, 0.3)"
      })

      input.addEventListener("blur", function () {
        if (!this.value) {
          this.parentElement.classList.remove("focused")
        }
        this.style.borderColor = ""
        this.style.boxShadow = ""
      })

      // Initial state check (for pre-filled inputs)
      if (input.value) {
        input.parentElement.classList.add("focused")
      }
    })

    // Form submission with AJAX
    dogProfileForm.addEventListener("submit", function (e) {
      e.preventDefault()

      // Show loading state
      const submitButton = this.querySelector('button[type="submit"]')
      const originalButtonText = submitButton.innerHTML
      submitButton.innerHTML = 'Registering... <span class="paw-icon">🐾</span>'
      submitButton.disabled = true
      submitButton.style.opacity = "0.7"

      // Create an object from form data instead of FormData
      const formData = {
        name: document.getElementById('dogName').value,
        breed: document.getElementById('dogBreed').value,
        age: document.getElementById('dogAge').value,
        characteristics: document.getElementById('dogCharacteristics').value
      };

      // Send AJAX request with JSON
      fetch("/register_dog", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          // Reset button
          submitButton.innerHTML = originalButtonText
          submitButton.disabled = false
          submitButton.style.opacity = ""

          // Show response
          formResponse.style.display = "block"

          if (data.success) {
            formResponse.textContent = data.message
            formResponse.className = "form-response success"

            // Add success animation
            formResponse.style.animation = "bounce 0.5s"

            // Reset form
            dogProfileForm.reset()
            inputs.forEach((input) => {
              input.parentElement.classList.remove("focused")
            })

            // Scroll to response
            formResponse.scrollIntoView({ behavior: "smooth", block: "nearest" })

            // Show confetti effect
            showConfetti()
            
            // Close modal after successful registration (optional)
            setTimeout(() => {
              closeModal();
            }, 3000);
          } else {
            formResponse.textContent = data.message
            formResponse.className = "form-response error"

            // Add error animation
            formResponse.style.animation = "shake 0.5s"

            // Scroll to response
            formResponse.scrollIntoView({ behavior: "smooth", block: "nearest" })
          }

          // Remove animation after it completes
          setTimeout(() => {
            formResponse.style.animation = ""
          }, 500)
        })
        .catch((error) => {
          console.error("Error:", error)
          submitButton.innerHTML = originalButtonText
          submitButton.disabled = false
          submitButton.style.opacity = ""

          formResponse.textContent = "An error occurred. Please try again."
          formResponse.className = "form-response error"
          formResponse.style.display = "block"

          // Add error animation
          formResponse.style.animation = "shake 0.5s"

          // Scroll to response
          formResponse.scrollIntoView({ behavior: "smooth", block: "nearest" })

          // Remove animation after it completes
          setTimeout(() => {
            formResponse.style.animation = ""
          }, 500)
        })
    })
  }

  // Confetti effect function
  function showConfetti() {
    const confettiContainer = document.createElement("div")
    confettiContainer.className = "confetti-container"
    document.body.appendChild(confettiContainer)

    // Create confetti pieces
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement("div")
      confetti.className = "confetti"

      // Random properties
      const size = Math.random() * 10 + 5
      const color = getRandomColor()
      const left = Math.random() * 100
      const animationDuration = Math.random() * 3 + 2

      // Apply styles
      confetti.style.width = `${size}px`
      confetti.style.height = `${size}px`
      confetti.style.backgroundColor = color
      confetti.style.left = `${left}%`
      confetti.style.animationDuration = `${animationDuration}s`
      confetti.style.animationDelay = `${Math.random() * 0.5}s`

      confettiContainer.appendChild(confetti)
    }

    // Remove confetti after animation
    setTimeout(() => {
      confettiContainer.remove()
    }, 5000)
  }

  // Helper function to get random color
  function getRandomColor() {
    const colors = [
      "#ff9d5c", // orange
      "#5cb8ff", // blue
      "#b45cff", // purple
      "#5cff9d", // green
      "#f9ff8c", // yellow
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  // Add confetti styles
  const style = document.createElement("style")
  style.textContent = `
    .confetti-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      overflow: hidden;
    }
    
    .confetti {
      position: absolute;
      top: -10px;
      border-radius: 50%;
      animation: fall linear forwards;
    }
    
    @keyframes fall {
      0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
      }
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-10px); }
      60% { transform: translateY(-5px); }
    }
    
    /* Additional styles for the dog profile modal */
    #dogProfileModal {
      z-index: 1000;
      background-color: rgba(0, 0, 0, 0.7);
    }
    
    #dogProfileModal .modal-content {
      border-radius: 15px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      max-width: 500px;
      width: 90%;
    }
    
    #dogProfileForm {
      position: relative;
    }
    
    .dog-profile-button {
      position: relative;
      overflow: hidden;
      background-color: #5cb8ff;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 25px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .dog-profile-button:hover {
      background-color: #4ca8ef;
      transform: translateY(-2px);
    }
  `
  document.head.appendChild(style)
})