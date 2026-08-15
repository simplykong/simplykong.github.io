/* =========================================================
   kong
   Portfolio System
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


const categoryLabel =
    document.getElementById(
        "categoryLabel"
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

        label:
            "VIDEO EDITING",

        number:
            "01"

    },

    "sound-design": {

        title:
            "Sound Design",

        label:
            "SOUND DESIGN",

        number:
            "02"

    },

    photography: {

        title:
            "Photography",

        label:
            "PHOTOGRAPHY",

        number:
            "03"

    },

    "graphic-design": {

        title:
            "Graphic Design",

        label:
            "GRAPHIC DESIGN",

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

            landing.style.display =
                "none";


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
        500
    );

}


/* =========================================================
   CLOSE WORK
   ========================================================= */

function closeWork() {

    work.classList.remove(
        "visible"
    );


    work.setAttribute(
        "aria-hidden",
        "true"
    );


    setTimeout(
        () => {

            landing.style.display =
                "grid";


            landing.classList.remove(
                "leaving"
            );


            window.scrollTo(
                {
                    top: 0,
                    behavior: "instant"
                }
            );

        },
        650
    );

}


/* =========================================================
   BUTTON EVENTS
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
   CATEGORY EVENTS
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
   SET CATEGORY
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


    const info =
        categories[
            category
        ];


    categoryNumber.textContent =
        info.number;


    categoryLabel.textContent =
        info.label;


    categoryTitle.textContent =
        info.title;


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

    }

    catch (
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

                Make sure your Supabase
                table is named
                <strong>projects</strong>
                and that its columns are correct.

            </div>

        `;

    }

}


/* =========================================================
   RENDER PROJECTS
   ========================================================= */

function renderProjects() {

    const filtered =
        projects.filter(
            project => {

                return (
                    normalizeCategory(
                        project.category
                    )
                    ===
                    currentCategory
                );

            }
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
   CREATE MEDIA
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


    /* VIDEO */

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


        addOverlay(
            wrapper,
            "PLAY"
        );


        return wrapper;

    }


    /* AUDIO */

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


    /* IMAGE */

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


        addOverlay(
            wrapper,
            "VIEW"
        );


        return wrapper;

    }


    /* PLACEHOLDER */

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
   OVERLAY
   ========================================================= */

function addOverlay(
    wrapper,
    text
) {

    const overlay =
        document.createElement(
            "div"
        );


    overlay.className =
        "project-overlay";


    const label =
        document.createElement(
            "span"
        );


    label.textContent =
        text;


    overlay.appendChild(
        label
    );


    wrapper.appendChild(
        overlay
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
            "VIDEO EDITING",

        "sound-design":
            "SOUND DESIGN",

        photography:
            "PHOTOGRAPHY",

        "graphic-design":
            "GRAPHIC DESIGN"

    };


    return (
        labels[
            normalized
        ]
        ||
        "PROJECT"
    );

}


/* =========================================================
   CATEGORY SYMBOL
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

    const value =
        url.toLowerCase();


    return (

        value.endsWith(
            ".mp4"
        )

        ||

        value.endsWith(
            ".webm"
        )

        ||

        value.endsWith(
            ".mov"
        )

        ||

        value.includes(
            "video/"
        )

    );

}


/* =========================================================
   AUDIO DETECTION
   ========================================================= */

function isAudioURL(
    url
) {

    const value =
        url.toLowerCase();


    return (

        value.endsWith(
            ".mp3"
        )

        ||

        value.endsWith(
            ".wav"
        )

        ||

        value.endsWith(
            ".ogg"
        )

        ||

        value.endsWith(
            ".m4a"
        )

        ||

        value.includes(
            "soundcloud.com"
        )

        ||

        value.includes(
            "w.soundcloud.com"
        )

    );

}


/* =========================================================
   BACKGROUND CANVAS
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


let particles =
    [];


/* =========================================================
   RESIZE
   ========================================================= */

function resizeCanvas() {

    const ratio =
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
        ratio;


    backgroundCanvas.height =
        canvasHeight *
        ratio;


    backgroundContext.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
    );


    particlesCanvas.width =
        canvasWidth *
        ratio;


    particlesCanvas.height =
        canvasHeight *
        ratio;


    particlesContext.setTransform(
        ratio,
        0,
        0,
        ratio,
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
   BACKGROUND DRAW
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
   PARTICLE DRAW
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
            `rgba(
                255,
                125,
                35,
                ${particle.opacity}
            )`;


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
   INITIALIZE
   ========================================================= */

resizeCanvas();

animateBackground();

loadProjects();


/* =========================================================
   ESCAPE
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
