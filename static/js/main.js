document.addEventListener("DOMContentLoaded", () => {
  // Load GSAP for animations
  let gsap // Declare gsap variable
  if (typeof gsap === "undefined") {
    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js"
    document.head.appendChild(script)

    script.onload = () => {
      gsap = window.gsap // Assign gsap after loading
      initAnimations()
    }
  } else {
    initAnimations()
  }

  function initAnimations() {
    // Header scroll effect
    const header = document.querySelector("header")
    let lastScrollY = window.scrollY

    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        header.classList.add("scrolled")
      } else {
        header.classList.remove("scrolled")
      }

      lastScrollY = window.scrollY
    })

    // Mobile navigation toggle
    const createMobileNav = () => {
      const header = document.querySelector(".header-container")
      const nav = document.querySelector("nav")
      const navList = document.querySelector("nav ul")

      // Create mobile toggle button
      const mobileToggle = document.createElement("button")
      mobileToggle.classList.add("mobile-toggle")
      mobileToggle.innerHTML = "<span></span><span></span><span></span>"

      // Insert toggle button before nav
      header.insertBefore(mobileToggle, nav)

      // Toggle navigation on click
      mobileToggle.addEventListener("click", () => {
        mobileToggle.classList.toggle("active")
        navList.classList.toggle("active")
      })

      // Close navigation when clicking on a link
      const navLinks = document.querySelectorAll("nav ul li a")
      navLinks.forEach((link) => {
        link.addEventListener("click", () => {
          mobileToggle.classList.remove("active")
          navList.classList.remove("active")
        })
      })
    }

    // Add mobile navigation for screens smaller than 768px
    if (window.innerWidth < 768) {
      createMobileNav()
    }

    // Recreate mobile nav on resize
    window.addEventListener("resize", () => {
      const existingToggle = document.querySelector(".mobile-toggle")

      if (window.innerWidth < 768 && !existingToggle) {
        createMobileNav()
      } else if (window.innerWidth >= 768 && existingToggle) {
        existingToggle.remove()
        document.querySelector("nav ul").classList.remove("active")
      }
    })

    // Get Started button scroll
    const getStartedBtn = document.getElementById("getStartedBtn")
    if (getStartedBtn) {
      getStartedBtn.addEventListener("click", () => {
        const dogProfileSection = document.getElementById("dogProfileSection")

        // Add visual feedback on click
        gsap.to(getStartedBtn, {
          scale: 0.95,
          duration: 0.1,
          onComplete: () => {
            gsap.to(getStartedBtn, {
              scale: 1,
              duration: 0.3,
              ease: "back.out(1.5)",
            })
          },
        })

        dogProfileSection.scrollIntoView({ behavior: "smooth" })
      })
    }

    // Interactive mascot with improved animations
    const dogMascot = document.getElementById("dogMascot")
    if (dogMascot) {
      // Initial animation
      gsap.from(dogMascot, {
        y: 30,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.3,
      })

      // Change expression on hover
      dogMascot.addEventListener("mouseenter", function () {
        this.classList.add("happy")

        // Add subtle movement
        gsap.to(this, {
          y: -10,
          duration: 0.3,
          ease: "power1.out",
        })

        setTimeout(() => {
          this.classList.remove("happy")
          gsap.to(this, {
            y: 0,
            duration: 0.5,
            ease: "power1.inOut",
          })
        }, 1000)
      })

      // Wag tail on click
      dogMascot.addEventListener("click", function () {
        this.classList.add("wagging")

        // Add bounce effect
        gsap.to(this, {
          scale: 1.05,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: "power1.inOut",
        })

        setTimeout(() => {
          this.classList.remove("wagging")
        }, 1500)
      })
    }

    // Enhanced hover effects for buttons
    const pawButtons = document.querySelectorAll(".paw-button")
    pawButtons.forEach((button) => {
      button.addEventListener("mouseenter", function () {
        const pawIcon = this.querySelector(".paw-icon")
        if (pawIcon) {
          gsap.to(pawIcon, {
            rotation: 10,
            duration: 0.2,
            onComplete: () => {
              gsap.to(pawIcon, {
                rotation: -10,
                duration: 0.2,
                onComplete: () => {
                  gsap.to(pawIcon, {
                    rotation: 0,
                    duration: 0.2,
                  })
                },
              })
            },
          })
        }
      })
    })

    pawButtons.forEach((button) => {
      button.addEventListener("mouseenter", () => {
        const pawIcon = button.querySelector(".paw-icon")
        if (pawIcon) {
          pawIcon.style.transform = "rotate(15deg)"
        }
      })

      button.addEventListener("mouseleave", () => {
        const pawIcon = button.querySelector(".paw-icon")
        if (pawIcon) {
          pawIcon.style.transform = "rotate(0)"
        }
      })

      button.addEventListener("click", () => {
        button.classList.add("clicked")
        setTimeout(() => {
          button.classList.remove("clicked")
        }, 300)
      })
    })

    // Add lazy loading for images
    const lazyLoadImages = () => {
      const images = document.querySelectorAll("img[data-src]")

      if ("IntersectionObserver" in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target
              img.src = img.dataset.src
              img.removeAttribute("data-src")
              imageObserver.unobserve(img)
            }
          })
        })

        images.forEach((img) => {
          imageObserver.observe(img)
        })
      } else {
        // Fallback for browsers that don't support IntersectionObserver
        images.forEach((img) => {
          img.src = img.dataset.src
          img.removeAttribute("data-src")
        })
      }
    }

    // Run lazy loading
    lazyLoadImages()

    // Animate elements on page load
    const heroContent = document.querySelector(".hero-content")
    if (heroContent) {
      gsap.from(heroContent.children, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.5,
      })
    }
  }
})

