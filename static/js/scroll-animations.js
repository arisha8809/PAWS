document.addEventListener("DOMContentLoaded", () => {
  // Import gsap (if not already available) or declare it
  if (typeof gsap === "undefined") {
    console.error("GSAP is not defined. Make sure to include it in your project.")
    // You might want to load GSAP dynamically here if it's not already included.
    // For example:
    // const script = document.createElement('script');
    // script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js';
    // script.onload = () => {
    //   // GSAP is now loaded, you can proceed with the animation code.
    //   startAnimations(); // Call a function to start your animations
    // };
    // document.head.appendChild(script);
    return // Exit if GSAP is not available
  }

  // Create scroll paw container
  const scrollPawContainer = document.createElement("div")
  scrollPawContainer.classList.add("scroll-paw-container")
  document.body.appendChild(scrollPawContainer)

  // Smooth scrolling for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      if (targetId === "#") return

      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Animate sections on scroll
  const animateSections = () => {
    const sections = document.querySelectorAll(".section")

    sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top
      const windowHeight = window.innerHeight

      if (sectionTop < windowHeight * 0.75) {
        section.classList.add("visible")
      }
    })
  }

  // Create paw print animation when scrolling between sections
  let lastScrollTop = 0
  let isScrollingTimeout

  const createScrollPaw = () => {
    // Only create paw prints during scrolling
    clearTimeout(isScrollingTimeout)

    // Get current scroll position
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    // Determine if scrolling up or down
    const isScrollingDown = scrollTop > lastScrollTop

    // Update last scroll position
    lastScrollTop = scrollTop

    // Create paw print
    const paw = document.createElement("div")
    paw.classList.add("scroll-paw")

    // Set paw position
    const xPos = Math.random() * 15 + (isScrollingDown ? 15 : 65) // Percentage from left
    const yPos = Math.random() * 70 + 15 // Percentage from top
    const size = Math.random() * 10 + 15 // Random size between 15px and 25px
    const rotation = Math.random() * 45 - 22.5 // Random rotation between -22.5 and 22.5 degrees

    paw.style.left = `${xPos}%`
    paw.style.top = `${yPos}%`
    paw.style.width = `${size}px`
    paw.style.height = `${size}px`
    paw.style.transform = `rotate(${rotation}deg) translateZ(0)`

    // Add depth effect with varying opacity and scale
    const depth = Math.random() * 0.4 + 0.6 // Random depth between 0.6 and 1
    paw.style.opacity = depth
    paw.style.filter = `blur(${(1 - depth) * 2}px)`

    // Append paw to container
    scrollPawContainer.appendChild(paw)

    // Animate paw
    gsap.fromTo(
      paw,
      { opacity: 0, scale: 0.8 },
      {
        opacity: depth,
        scale: 1,
        duration: 0.3,
        onComplete: () => {
          gsap.to(paw, {
            opacity: 0,
            y: isScrollingDown ? 20 : -20,
            duration: 0.8,
            delay: 0.5,
            onComplete: () => {
              paw.remove()
            },
          })
        },
      },
    )

    // Set timeout to indicate scrolling has stopped
    isScrollingTimeout = setTimeout(() => {
      // Remove all remaining paws when scrolling stops
      const pawsToRemove = document.querySelectorAll(".scroll-paw")
      pawsToRemove.forEach((p) => {
        gsap.to(p, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            p.remove()
          },
        })
      })
    }, 100)
  }

  // Handle scroll events
  let scrollThrottleTimer
  window.addEventListener("scroll", () => {
    // Throttle scroll events
    if (!scrollThrottleTimer) {
      scrollThrottleTimer = setTimeout(() => {
        scrollThrottleTimer = null

        // Create paw print animation
        if (Math.random() < 0.3) {
          // Only create paws 30% of the time to avoid overcrowding
          createScrollPaw()
        }

        // Animate sections
        animateSections()
      }, 100)
    }
  })

  // Initial check
  animateSections()
})

