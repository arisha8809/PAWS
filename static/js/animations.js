document.addEventListener("DOMContentLoaded", () => {
  // Load GSAP if it's not already loaded
  if (typeof gsap === "undefined") {
    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js"
    document.head.appendChild(script)

    script.onload = initAnimations
  } else {
    initAnimations()
  }

  function initAnimations() {
    // Intersection Observer for section animations with enhanced effects
    const sections = document.querySelectorAll(".section")

    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")

            // Animate section content with GSAP
            const content = entry.target.querySelector(".section-content")
            const icon = entry.target.querySelector(".section-icon")

            if (content) {
              gsap.from(content.children, {
                y: 30,
                opacity: 0,
                duration: 0.7,
                stagger: 0.15,
                ease: "power3.out",
              })
            }

            if (icon) {
              gsap.from(icon, {
                scale: 0.9,
                opacity: 0,
                duration: 0.8,
                ease: "back.out(1.5)",
              })
            }

            observer.unobserve(entry.target)
          }
        })
      },
      {
        root: null,
        threshold: 0.2,
        rootMargin: "0px",
      },
    )

    sections.forEach((section) => {
      sectionObserver.observe(section)
    })

    // Enhanced paw print animations
    const pawDividers = document.querySelectorAll(".paw-divider")

    pawDividers.forEach((divider) => {
      // Randomize starting positions and sizes
      const pawPrints = divider.querySelectorAll(".paw-print")
      pawPrints.forEach((paw, index) => {
        const randomDelay = Math.random() * 3
        const randomSize = 0.8 + Math.random() * 0.4

        paw.style.animationDelay = `${randomDelay}s`
        paw.style.transform = `scale(${randomSize}) translateZ(0)`

        // Add depth effect
        const opacity = 0.5 + Math.random() * 0.5
        paw.style.opacity = opacity
      })
    })

    // Scroll-triggered animations for paw dividers
    const pawDividerObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pawPrints = entry.target.querySelectorAll(".paw-print")
            pawPrints.forEach((paw, index) => {
              setTimeout(() => {
                paw.style.animationPlayState = "running"
              }, index * 200)
            })
          } else {
            const pawPrints = entry.target.querySelectorAll(".paw-print")
            pawPrints.forEach((paw) => {
              paw.style.animationPlayState = "paused"
            })
          }
        })
      },
      {
        root: null,
        threshold: 0.1,
      },
    )

    pawDividers.forEach((divider) => {
      pawDividerObserver.observe(divider)
    })

    // Enhanced parallax effect for background
    const parallaxElements = document.querySelectorAll(".feature-section")

    window.addEventListener("scroll", () => {
      const scrollPosition = window.pageYOffset

      // Subtle background parallax
      document.body.style.backgroundPositionY = `${scrollPosition * 0.05}px`

      // Element parallax
      parallaxElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top + window.scrollY
        const elementHeight = element.offsetHeight
        const windowHeight = window.innerHeight

        // Check if element is in viewport
        if (scrollPosition + windowHeight > elementTop && scrollPosition < elementTop + elementHeight) {
          const distance = (scrollPosition + windowHeight - elementTop) / (windowHeight + elementHeight)
          const shift = distance * 30 - 15 // Move between -15px and 15px

          const icon = element.querySelector(".section-icon")
          const content = element.querySelector(".section-content")

          if (icon) {
            icon.style.transform = `translateY(${shift * 0.5}px) translateZ(0)`
          }

          if (content) {
            content.style.transform = `translateY(${-shift * 0.3}px) translateZ(0)`
          }
        }
      })
    })

    // Add subtle animation to all buttons on page load
    const buttons = document.querySelectorAll(".paw-button")
    gsap.from(buttons, {
      y: 10,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
      delay: 1,
    })
  }
})

