// Wait for DOM content to load fully before executing script
document.addEventListener("DOMContentLoaded", () => {
  // Mobile Navigation Toggle
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");

  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    // Change icon between bars and times (close)
    const icon = hamburger.querySelector("i");
    if (navMenu.classList.contains("active")) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-times");
    } else {
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    }
  });

  // Close Mobile Menu when a link is clicked
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      const icon = hamburger.querySelector("i");
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    });
  });

  // Sticky Navbar & Active Link Highlight on Scroll
  window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section");
    const scrollPos = window.scrollY + 200;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });

    // Back to Top Button Toggle Visibility
    const backToTopBtn = document.getElementById("back-to-top");
    if (window.scrollY > 300) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  });

  // Back to Top Click Action
  const backToTopBtn = document.getElementById("back-to-top");
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Fetch API to load JSON data into the DOM
  fetchData();

  // Contact Form Submission
  const contactForm = document.getElementById("contact-form");
  const formResponse = document.getElementById("form-response");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    formResponse.textContent = "Thank you! Your message has been sent successfully.";
    formResponse.className = "form-response success";
    contactForm.reset();

    setTimeout(() => {
      formResponse.style.display = "none";
    }, 5000);
  });

  // Newsletter Form Submission
  const newsletterForm = document.getElementById("newsletter-form");
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Thank you for subscribing to our newsletter!");
    newsletterForm.reset();
  });
});

// Fetch function to get remote data from data.json
async function fetchData() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Render Data Sections
    renderServices(data.services);
    renderPortfolio(data.portfolio);
    renderTestimonials(data.testimonials);

    // Initialize Interactive Category Filter for Portfolio
    setupPortfolioFilter(data.portfolio);
    
    // Start Animated Counter Stats
    animateCounters();
  } catch (error) {
    console.error("Error loading JSON data:", error);
  }
}

// Render Services HTML Cards
function renderServices(services) {
  const container = document.getElementById("services-container");
  container.innerHTML = services
    .map(
      (service) => `
    <div class="service-card">
      <div class="service-icon">
        <i class="${service.icon}"></i>
      </div>
      <h3>${service.title}</h3>
      <p>${service.description}</p>
    </div>
  `
    )
    .join("");
}

// Render Portfolio HTML Cards
function renderPortfolio(portfolioItems) {
  const container = document.getElementById("portfolio-container");
  container.innerHTML = portfolioItems
    .map(
      (item) => `
    <div class="portfolio-card" data-category="${item.category}">
      <div class="portfolio-img">
        <img src="${item.image}" alt="${item.title}">
      </div>
      <div class="portfolio-info">
        <span>${item.category.toUpperCase()}</span>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </div>
    </div>
  `
    )
    .join("");
}

// Render Testimonials HTML Cards
function renderTestimonials(testimonials) {
  const container = document.getElementById("testimonials-container");
  container.innerHTML = testimonials
    .map(
      (t) => `
    <div class="testimonial-card">
      <div class="stars">
        ${'<i class="fas fa-star"></i>'.repeat(t.rating)}
      </div>
      <p class="testimonial-text">"${t.feedback}"</p>
      <div class="client-info">
        <img src="${t.avatar}" alt="${t.name}">
        <div class="client-details">
          <h4>${t.name}</h4>
          <p>${t.role}</p>
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

// Portfolio Filter Interaction
function setupPortfolioFilter(allPortfolio) {
  const filterBtns = document.querySelectorAll(".filter-btn");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Manage Active Class State
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.getAttribute("data-filter");

      if (category === "all") {
        renderPortfolio(allPortfolio);
      } else {
        const filtered = allPortfolio.filter(
          (item) => item.category === category
        );
        renderPortfolio(filtered);
      }
    });
  });
}

// Number Counter Animation Function
function animateCounters() {
  const counters = document.querySelectorAll(".counter");
  const speed = 200; // Animation speed

  counters.forEach((counter) => {
    const updateCount = () => {
      const target = +counter.getAttribute("data-target");
      const count = +counter.innerText;
      const inc = target / speed;

      if (count < target) {
        counter.innerText = Math.ceil(count + inc);
        setTimeout(updateCount, 20);
      } else {
        counter.innerText = target;
      }
    };
    updateCount();
  });
}