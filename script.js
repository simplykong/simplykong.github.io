/* =========================================================
   kong
   Orange Edition
   ========================================================= */


/* =========================================================
   SUPABASE
   ========================================================= */

const SUPABASE_URL =
    "https://hjxhpjynriafeqewwqis.supabase.co";


const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_7S5vxB9HNy90sQ_Q0znz6A_IqyjPA96";


const {
    createClient
} = window.supabase;


const supabase =
    createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


/* =========================================================
   LOGO
   ========================================================= */

const LOGO_URL =
    "https://cdn.discordapp.com/avatars/1429216999585615922/fa9f017aaaa3e55722eac94970084251.png?size=4096";


/* =========================================================
   ELEMENTS
   ========================================================= */

const landing =
    document.getElementById(
        "landing"
    );


const work =
    document.getElementById(
        "work"
    );


const workButton =
    document.getElementById(
        "workButton"
    );


const backButton =
    document.getElementById(
        "backButton"
    );


const projectsContainer =
    document.getElementById(
        "projects"
    );


const categoryTitle =
    document.getElementById(
        "categoryTitle"
    );


const categoryNumber =
    document.getElementById(
        "categoryNumber"
    );


const categoryTabs =
    document.querySelectorAll(
        ".category-tab"
    );


/* =========================================================
   CATEGORIES
   ========================================================= */

const categories = {

    video: {

        title:
            "Video Editing",

        number:
            "01"

    },

    "sound-design": {

        title:
            "Sound Design",

        number:
            "02"

    },

    photography: {

        title:
            "Photography",

        number:
            "03"

    },

    "graphic-design": {

        title:
            "Graphic Design",

        number:
            "04"

    }

};


/* =========================================================
   STATE
   ========================================================= */

let projects = [];

let currentCategory =
    "video";


/* =========================================================
   OPEN WORK
   ========================================================= */

function openWork() {

    landing.classList.add(
        "leaving"
    );


    setTimeout(
        () => {

            work.classList.add(
                "visible"
            );

            work.setAttribute(
                "aria-hidden",
                "false"
            );

            window.scrollTo(
                {
                    top: 0,
                    behavior: "instant"
                }
            );

        },
        350
    );


    setTimeout(
        () => {

            landing.style.display =
                "none";

        },
        900
    );

}


/* =========================================================
   CLOSE WORK
   ========================================================= */

function closeWork() {

    landing.style.display =
        "grid";


    requestAnimationFrame(
        () => {

            work.classList.remove(
                "visible"
            );

            work.setAttribute(
                "aria-hidden",
                "true"
            );

            landing.classList.remove(
                "leaving"
            );

            window.scrollTo(
                {
                    top: 0,
                    behavior: "instant"
                }
            );

        }
    );

}


/* =========================================================
   BUTTONS
   ========================================================= */

workButton.addEventListener(
    "click",
    openWork
);


backButton.addEventListener(
    "click",
    closeWork
);


/* =========================================================
   CATEGORY BUTTONS
   ========================================================= */

categoryTabs.forEach(
    tab => {

        tab.addEventListener(
            "click",
            () => {

                setCategory(
                    tab.dataset.category
                );

            }
        );

    }
);


/* =========================================================
   CATEGORY
   ========================================================= */

function setCategory(
    category
) {

    if (
        !categories[category]
    ) {

        return;

    }


    currentCategory =
        category;


    categoryTabs.forEach(
        tab => {

            tab.classList.toggle(
                "active",
                tab.dataset.category ===
                    category
            );

        }
    );


    categoryTitle.textContent =
        categories[
            category
        ].title;


    categoryNumber.textContent =
        categories[
            category
        ].number;


    renderProjects();

}


/* =========================================================
   LOAD PROJECTS
   ========================================================= */

async function loadProjects() {

    projectsContainer.innerHTML = `

        <div class="projects-loading">
            loading...
        </div>

    `;


    try {

        const {
            data,
            error
        } = await supabase

            .from(
                "projects"
            )

            .select("*")

            .order(
                "created_at",
                {
                    ascending: false
                }
            );


        if (
            error
        ) {

            throw error;

        }


        projects =
            data || [];


        renderProjects();


    } catch (
        error
    ) {

        console.error(
            "Supabase error:",
            error
        );


        projectsContainer.innerHTML = `

            <div class="projects-error">

                <strong>
                    couldn't load the projects.
                </strong>

                Check the browser console
                for the Supabase error.

            </div>

        `;

    }

}


/* =========================================================
   RENDER
   ========================================================= */

function renderProjects() {

    const filtered =
        projects.filter(
            project =>
                normalizeCategory(
                    project.category
                ) ===
                currentCategory
        );


    projectsContainer.innerHTML =
        "";


    if (
        filtered.length === 0
    ) {

        projectsContainer.innerHTML = `

            <div class="projects-empty">
                Nothing here yet.
            </div>

        `;

        return;

    }


    filtered.forEach(
        (
            project,
            index
        ) => {

            const element =
                createProject(
                    project
                );


            element.style.animationDelay =
                `${index * 0.08}s`;


            projectsContainer.appendChild(
                element
            );

        }
    );

}


/* =========================================================
   NORMALIZE CATEGORY
   ========================================================= */

function normalizeCategory(
    category
) {

    if (
        !category
    ) {

        return "";

    }


    const value =
        String(
            category
        )
        .trim()
        .toLowerCase();


    const aliases = {

        video:
            "video",

        "video editing":
            "video",

        "video-editing":
            "video",

        sound:
            "sound-design",

        "sound design":
            "sound-design",

        "sound-design":
            "sound-design",

        photography:
            "photography",

        photo:
            "photography",

        "graphic design":
            "graphic-design",

        "graphic-design":
            "graphic-design",

        graphics:
            "graphic-design"

    };


    return (
        aliases[value]
        ||
        value
    );

}


/* =========================================================
   CREATE PROJECT
   ========================================================= */

function createProject(
    project
) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "project";


    const media =
        createMedia(
            project
        );


    const details =
        document.createElement(
            "div"
        );


    details.className =
        "project-details";


    const type =
        document.createElement(
            "div"
        );


    type.className =
        "project-type";


    type.textContent =
        getCategoryLabel(
            project.category
        );


    details.appendChild(
        type
    );


    const title =
        document.createElement(
            "div"
        );


    title.className =
        "project-title";


    title.textContent =
        project.title ||
        "Untitled";


    details.appendChild(
        title
    );


    if (
        project.description
    ) {

        const description =
            document.createElement(
                "div"
            );


        description.className =
            "project-description";


        description.textContent =
            project.description;


        details.appendChild(
            description
        );

    }


    if (
        project.url
    ) {

        const link =
            document.createElement(
                "a"
            );


        link.className =
            "project-link";


        link.href =
            project.url;


        link.target =
            "_blank";


        link.rel =
            "noopener noreferrer";


        link.textContent =
            "View project →";


        details.appendChild(
            link
        );

    }


    article.appendChild(
        media
    );


    article.appendChild(
        details
    );


    return article;

}


/* =========================================================
   MEDIA
   ========================================================= */

function createMedia(
    project
) {

    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.className =
        "project-media";


    const url =
        project.url ||
        "";


    const thumbnail =
        project.thumbnail_url;


    if (
        isVideoURL(
            url
        )
    ) {

        const video =
            document.createElement(
                "video"
            );


        video.src =
            url;


        video.controls =
            true;


        video.preload =
            "metadata";


        video.playsInline =
            true;


        if (
            thumbnail
        ) {

            video.poster =
                thumbnail;

        }


        wrapper.appendChild(
            video
        );


        return wrapper;

    }


    if (
        isAudioURL(
            url
        )
    ) {

        const audioContainer =
            document.createElement(
                "div"
            );


        audioContainer.className =
            "audio-project";


        const audio =
            document.createElement(
                "audio"
            );


        audio.src =
            url;


        audio.controls =
            true;


        audio.preload =
            "metadata";


        audioContainer.appendChild(
            audio
        );


        wrapper.appendChild(
            audioContainer
        );


        return wrapper;

    }


    if (
        thumbnail
    ) {

        const image =
            document.createElement(
                "img"
            );


        image.src =
            thumbnail;


        image.alt =
            project.title ||
            "Portfolio project";


        image.loading =
            "lazy";


        wrapper.appendChild(
            image
        );


        return wrapper;

    }


    const placeholder =
        document.createElement(
            "div"
        );


    placeholder.className =
        "project-placeholder";


    placeholder.textContent =
        getCategorySymbol(
            project.category
        );


    wrapper.appendChild(
        placeholder
    );


    return wrapper;

}


/* =========================================================
   CATEGORY LABEL
   ========================================================= */

function getCategoryLabel(
    category
) {

    const normalized =
        normalizeCategory(
            category
        );


    const labels = {

        video:
            "Video Editing",

        "sound-design":
            "Sound Design",

        photography:
            "Photography",

        "graphic-design":
            "Graphic Design"

    };


    return (
        labels[
            normalized
        ]
        ||
        "Project"
    );

}


/* =========================================================
   SYMBOLS
   ========================================================= */

function getCategorySymbol(
    category
) {

    const normalized =
        normalizeCategory(
            category
        );


    const symbols = {

        video:
            "▶",

        "sound-design":
            "♪",

        photography:
            "✦",

        "graphic-design":
            "◇"

    };


    return (
        symbols[
            normalized
        ]
        ||
        "•"
    );

}


/* =========================================================
   VIDEO DETECTION
   ========================================================= */

function isVideoURL(
    url
) {

    if (
        !url
    ) {

        return false;

    }


    const lower =
        url.toLowerCase();


    return (

        lower.endsWith(".mp4")

        ||

        lower.endsWith(".webm")

        ||

        lower.endsWith(".mov")

        ||

        lower.includes("video/")

    );

}


/* =========================================================
   AUDIO DETECTION
   ========================================================= */

function isAudioURL(
    url
) {

    if (
        !url
    ) {

        return false;

    }


    const lower =
        url.toLowerCase();


    return (

        lower.endsWith(".mp3")

        ||

        lower.endsWith(".wav")

        ||

        lower.endsWith(".ogg")

        ||

        lower.endsWith(".m4a")

        ||

        lower.includes("soundcloud.com")

    );

}


/* =========================================================
   CANVAS
   ========================================================= */

const backgroundCanvas =
    document.getElementById(
        "backgroundCanvas"
    );


const backgroundContext =
    backgroundCanvas.getContext(
        "2d"
    );


const particlesCanvas =
    document.getElementById(
        "particlesCanvas"
    );


const particlesContext =
    particlesCanvas.getContext(
        "2d"
    );


let canvasWidth =
    window.innerWidth;


let canvasHeight =
    window.innerHeight;


let particles = [];


/* =========================================================
   RESIZE
   ========================================================= */

function resizeCanvas() {

    const pixelRatio =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );


    canvasWidth =
        window.innerWidth;


    canvasHeight =
        window.innerHeight;


    backgroundCanvas.width =
        canvasWidth *
        pixelRatio;


    backgroundCanvas.height =
        canvasHeight *
        pixelRatio;


    backgroundCanvas.style.width =
        `${canvasWidth}px`;


    backgroundCanvas.style.height =
        `${canvasHeight}px`;


    backgroundContext.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
    );


    particlesCanvas.width =
        canvasWidth *
        pixelRatio;


    particlesCanvas.height =
        canvasHeight *
        pixelRatio;


    particlesCanvas.style.width =
        `${canvasWidth}px`;


    particlesCanvas.style.height =
        `${canvasHeight}px`;


    particlesContext.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
    );


    createParticles();

}


window.addEventListener(
    "resize",
    resizeCanvas
);


/* =========================================================
   PARTICLES
   ========================================================= */

function createParticles() {

    const amount =
        Math.min(
            80,
            Math.floor(
                canvasWidth *
                canvasHeight /
                18000
            )
        );


    particles =
        [];


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        particles.push({

            x:
                Math.random() *
                canvasWidth,

            y:
                Math.random() *
                canvasHeight,

            radius:
                Math.random() *
                1.1
                +
                0.15,

            speed:
                Math.random() *
                0.12
                +
                0.025,

            opacity:
                Math.random() *
                0.35
                +
                0.05

        });

    }

}


/* =========================================================
   BACKGROUND
   ========================================================= */

function drawBackground() {

    backgroundContext.clearRect(
        0,
        0,
        canvasWidth,
        canvasHeight
    );


    const gradient =
        backgroundContext.createRadialGradient(
            canvasWidth * 0.5,
            canvasHeight * 0.5,
            0,
            canvasWidth * 0.5,
            canvasHeight * 0.5,
            Math.max(
                canvasWidth,
                canvasHeight
            ) * 0.7
        );


    gradient.addColorStop(
        0,
        "rgba(75, 30, 5, 0.13)"
    );


    gradient.addColorStop(
        0.45,
        "rgba(30, 13, 3, 0.06)"
    );


    gradient.addColorStop(
        1,
        "rgba(0, 0, 0, 0)"
    );


    backgroundContext.fillStyle =
        gradient;


    backgroundContext.fillRect(
        0,
        0,
        canvasWidth,
        canvasHeight
    );

}


/* =========================================================
   PARTICLES
   ========================================================= */

function drawParticles() {

    particlesContext.clearRect(
        0,
        0,
        canvasWidth,
        canvasHeight
    );


    for (
        const particle of particles
    ) {

        particle.y -=
            particle.speed;


        if (
            particle.y < -5
        ) {

            particle.y =
                canvasHeight + 5;

            particle.x =
                Math.random() *
                canvasWidth;

        }


        particlesContext.beginPath();


        particlesContext.arc(
            particle.x,
            particle.y,
            particle.radius,
            0,
            Math.PI * 2
        );


        particlesContext.fillStyle =
            `rgba(255, 125, 35, ${particle.opacity})`;


        particlesContext.fill();

    }

}


/* =========================================================
   ANIMATION
   ========================================================= */

function animateBackground() {

    drawBackground();

    drawParticles();

    requestAnimationFrame(
        animateBackground
    );

}


/* =========================================================
   START
   ========================================================= */

resizeCanvas();

animateBackground();

loadProjects();


/* =========================================================
   KEYBOARD
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

            if (
                work.classList.contains(
                    "visible"
                )
            ) {

                closeWork();

            }

        }

    }
);
