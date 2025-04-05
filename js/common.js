function initCommon()
{
    // snow bg
    loadScript('js/snowBg.js');

    // header
    document.body.insertAdjacentHTML('afterbegin', `
    <header>
        <div class="title">MaybeMaru</div>
        <nav class="header-buttons">
            <a href="index.html">Home</a>
            <a href="blog.html">Blog</a>
            <a href="art.html">Art</a>
            <a href="code.html">Code</a>
            <a href="about.html">About</a>
            <a href="contact.html">Contact</a>
        </nav>
    </header>
    `);
    
    // TODO: remove this when shit is done
    document.body.insertAdjacentHTML('beforeend', `
    <img src="https://www.brendoncolby.com/images/under_construction.gif"
    class="construction-gif">
    `);
    
    highlightCurrentPage();
}

function loadScript(url) {
  const script = document.createElement('script');
  script.src = url;
  script.type = 'text/javascript';
  document.head.appendChild(script);
}

// highlight current page in header
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.header-buttons a');
    
    links.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (currentPage === linkPage) {
            link.classList.add('current-page');
        }
    });
}

// init home slideshow
function initSlideshow() {
    const slideshow = document.querySelector('.slideshow-container');
    if (!slideshow) return;
    
    let index = 0;
    const images = document.querySelectorAll(".slideshow-container img");
    
    function fadeImages() {
        images[index].classList.remove("active");
        index = (index + 1) % images.length;
        images[index].classList.add("active");
    }
    
    if (images.length > 0) {
        setInterval(fadeImages, 3000);
    }
}

// call when site is opened
document.addEventListener('DOMContentLoaded', () => {
    initCommon();
    initSlideshow();
});