// Select elements
const navbar = document.querySelector('.navbar');
const aboutUsSection = document.getElementById('about_us');
const homeSection = document.querySelector('.home');
const navLinks = document.querySelectorAll('.nav-link');
const navbarToggler = document.querySelector('.navbar-toggler');
const navbarCollapse = document.getElementById('navbarSupportedContent');


// Combined scroll logic for background and active link
window.addEventListener('scroll', () => {
  const scrollY = window.pageYOffset;
//   console.log(`Scroll position: ${scrollY}`);
  const homeTop = homeSection.getBoundingClientRect().top;
  const homeBottom = homeSection.getBoundingClientRect().bottom;

  // option 1
  //   // Handle navbar background based on scroll position
    if (homeBottom <= 0) {
      navbar.classList.remove("bg-transparent", "blur-navbar");
      navbar.classList.add("bg-dark");
    } else {
      navbar.classList.remove("bg-dark");
      navbar.classList.add("bg-transparent", "blur-navbar");
      if (homeTop === 0) {
        navbar.classList.remove("blur-navbar");
      }
    }
  // option 2
//   if (homeTop === 0) {
//     navbar.classList.remove("blur-navbar");
//   } else {
//     navbar.classList.add("blur-navbar");
//   }

 // Scroll spy logic: highlight nav links based on visible section
 let anyActive = false;

 document
   .querySelectorAll("section[id], div[id]:not(#navbarSupportedContent)")
   .forEach((section) => {
     const sectionTop = section.offsetTop - 140; // Offset for navbar
     const sectionHeight = section.offsetHeight;
     const sectionId = section.getAttribute("id");

     if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        // console.log(`Section active: ${sectionId}`);
        anyActive = true;
        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
            }
        });
     }
   });

 // If no section is active, assume we're on the "home" section and remove all active states
 if (!anyActive) {
//    console.log(`Section active: home`);
   navLinks.forEach((link) => {
     link.classList.remove("active");
   });
 }
});

// Close navbar menu when nav link clicked on mobile
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth < 992 && navbarCollapse.classList.contains('show')) {
      navbarToggler.click(); // This triggers Bootstrap's collapse toggle
      link.classList.add("active");
    }
  });
});

// Disable scrolling when navbar menu is open (mobile)
navbarCollapse.addEventListener('shown.bs.collapse', () => {
  navbar.classList.add("no-blur-navbar");
  document.body.classList.add('no-scroll');
});

navbarCollapse.addEventListener("hide.bs.collapse", () => {
  navbar.classList.remove("no-blur-navbar"); // earlier
  console.log("hide.bs.collapse triggered");
});

navbarCollapse.addEventListener("hidden.bs.collapse", () => {
  document.body.classList.remove("no-scroll"); // later
  console.log("hidden.bs.collapse triggered");
});