/* =========================================================
   kong portfolio
   ========================================================= */


/* =========================================================
   SUPABASE
   ========================================================= */

const SUPABASE_URL =
    "https://hjxhpjynriafeqewwqis.supabase.co";


const SUPABASE_KEY =
    "sb_publishable_7S5vxB9HNy90sQ_Q0znz6A_IqyjPA96";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =========================================================
   ELEMENTS
   ========================================================= */

const home =
    document.getElementById(
        "home"
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


const pagination =
    document.getElementById(
        "pagination"
    );


const previousPage =
    document.getElementById(
        "previousPage"
    );


const nextPage =
    document.getElementById(
        "nextPage"
    );


const pageIndicator =
    document.getElementById(
        "pageIndicator"
    );


const tabs =
    document.querySelectorAll(
        ".tab"
    );


/* =========================================================
   SETTINGS
   ========================================================= */

const PROJECTS_PER_PAGE =
    6;


/* =========================================================
   CATEGORIES
   ========================================================= */

const categoryData = {

    video: {

        number:
            "01",

        label:
            "VIDEO EDITING"

    },


    "sound-design": {

        number:
            "02",

        label:
            "SOUND DESIGN"

    },


    photography: {

        number:
            "03",

        label:
            "PHOTOGRAPHY"

    },


    "graphic-design": {

        number:
            "04",

        label:
            "GRAPHIC DESIGN"

    }

};


/* =========================================================
   STATE
   ========================================================= */

let allProjects = [];

let currentCategory =
    "video";

let currentPage =
    1;


/* =========================================================
   OPEN WORK
   ========================================================= */

function openWork() {

    home.classList.add(
        "hidden"
    );


    setTimeout(
        function () {

            home.style.display =
                "none";


            work.classList.add(
                "visible"
            );


            window.scrollTo(
                0,
                0
            );

        },
        450
    );

}


/* =========================================================
   CLOSE WORK
   ========================================================= */

function closeWork() {

    work.classList.remove(
        "visible"
    );


    setTimeout(
        function () {

            home.style.display =
                "flex";


            home.classList.remove(
                "hidden"
            );


            window.scrollTo(
                0,
                0
            );

        },
        650
    );

}


/* =========================================================
   EVENTS
   ========================================================= */

workButton.addEventListener(
    "click",
    openWork
);


backButton.addEventListener(
    "click",
    closeWork
);


previousPage.addEventListener(
    "click",
    function () {

        if (
            currentPage >
            1
        ) {

            currentPage--;

            renderProjects();

            window.scrollTo(
                {
                    top:
                        0,

                    behavior:
                        "smooth"
                }
            );

        }

    }
);


nextPage.addEventListener(
    "click",
    function () {

        const projects =
            getCurrentProjects();


        const totalPages =
            Math.ceil(
                projects.length /
                PROJECTS_PER_PAGE
            );


        if (
            currentPage <
            totalPages
        ) {

            currentPage++;

            renderProjects();

            window.scrollTo(
                {
                    top:
                        0,

                    behavior:
                        "smooth"
                }
            );

        }

    }
);


/* =========================================================
   TABS
   ========================================================= */

tabs.forEach(
    function (tab) {

        tab.addEventListener(
            "click",
            function () {

                const category =
                    tab.dataset.category;


                switchCategory(
                    category
                );

            }
        );

    }
);


/* =========================================================
   SWITCH CATEGORY
   ========================================================= */

function switchCategory(
    category
) {

    if (
        !categoryData[
            category
        ]
    ) {

        return;

    }


    currentCategory =
        category;


    currentPage =
        1;


    tabs.forEach(
        function (tab) {

            tab.classList.toggle(
                "active",
                tab.dataset.category ===
                    category
            );

        }
    );


    renderProjects();

}


/* =========================================================
   LOAD PROJECTS
   ========================================================= */

async function loadProjects() {

    projectsContainer.innerHTML = `

        <div class="loading">
            loading...
        </div>

    `;


    try {

        const result =
            await supabaseClient

                .from(
                    "projects"
                )

                .select(
                    "*"
                )

                .order(
                    "created_at",
                    {
                        ascending:
                            false
                    }
                );


        if (
            result.error
        ) {

            throw result.error;

        }


        allProjects =
            result.data ||
            [];


        console.log(
            "Loaded projects:",
            allProjects
        );


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

            <div class="error">

                <strong>
                    Couldn't load your projects.
                </strong>

                <br><br>

                Supabase returned:

                <br>

                ${escapeHTML(
                    error.message ||
                    "Unknown error"
                )}

            </div>

        `;


        pagination.style.display =
            "none";

    }

}


/* =========================================================
   GET CURRENT PROJECTS
   ========================================================= */

function getCurrentProjects() {

    return allProjects.filter(
        function (project) {

            return (
                normalizeCategory(
                    project.category
                )
                ===
                currentCategory
            );

        }
    );

}


/* =========================================================
   RENDER PROJECTS
   ========================================================= */

function renderProjects() {

    const projects =
        getCurrentProjects();


    const totalPages =
        Math.max(
            1,
            Math.ceil(
                projects.length /
                PROJECTS_PER_PAGE
            )
        );


    /*
       If the current page somehow becomes
       larger than the available pages,
       bring it back down.
    */

    if (
        currentPage >
        totalPages
    ) {

        currentPage =
            totalPages;

    }


    const start =
        (
            currentPage -
            1
        )
        *
        PROJECTS_PER_PAGE;


    const end =
        start +
        PROJECTS_PER_PAGE;


    const visibleProjects =
        projects.slice(
            start,
            end
        );


    projectsContainer.innerHTML =
        "";


    if (
        projects.length ===
        0
    ) {

        projectsContainer.innerHTML = `

            <div class="empty">

                Nothing here yet.

            </div>

        `;


        pagination.style.display =
            "none";


        return;

    }


    /*
       Render only 6 projects.
    */

    visibleProjects.forEach(
        function (
            project,
            index
        ) {

            const element =
                createProject(
                    project
                );


            element.style.animationDelay =
                `${index * 0.07}s`;


            projectsContainer.appendChild(
                element
            );

        }
    );


    /*
       Only show the arrows if
       there is actually more than
       one page.
    */

    if (
        totalPages <=
        1
    ) {

        pagination.style.display =
            "none";

    }

    else {

        pagination.style.display =
            "flex";

    }


    previousPage.disabled =
        currentPage <=
        1;


    nextPage.disabled =
        currentPage >=
        totalPages;


    pageIndicator.textContent =
        `${String(
            currentPage
        ).padStart(
            2,
            "0"
        )} / ${String(
            totalPages
        ).padStart(
            2,
            "0"
        )}`;

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
        createProjectMedia(
            project
        );


    const info =
        document.createElement(
            "div"
        );


    info.className =
        "project-info";


    const category =
        document.createElement(
            "div"
        );


    category.className =
        "project-category";


    category.textContent =
        getCategoryLabel(
            project.category
        );


    info.appendChild(
        category
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


    info.appendChild(
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


        info.appendChild(
            description
        );

    }


    if (
        project.link
    ) {

        const link =
            document.createElement(
                "a"
            );


        link.className =
            "project-link";


        link.href =
            project.link;


        link.target =
            "_blank";


        link.rel =
            "noopener noreferrer";


        link.textContent =
            "View project →";


        info.appendChild(
            link
        );

    }


    article.appendChild(
        media
    );


    article.appendChild(
        info
    );


    return article;

}


/* =========================================================
   MEDIA
   ========================================================= */

function createProjectMedia(
    project
) {

    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.className =
        "project-media";


    const type =
        getProjectType(
            project
        );


    const mediaURL =
        project.media_url ||
        project.url ||
        "";


    const thumbnail =
        project.thumbnail_url ||
        project.image_url ||
        "";


    /* SOUNDCLOUD */

    if (
        type ===
        "soundcloud"
        ||
        mediaURL.includes(
            "soundcloud.com"
        )
    ) {

        wrapper.appendChild(
            createSoundCloud(
                mediaURL
            )
        );


        return wrapper;

    }


    /* VIDEO */

    if (
        type ===
        "video"
        ||
        isVideo(
            mediaURL
        )
    ) {

        const video =
            document.createElement(
                "video"
            );


        video.src =
            mediaURL;


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
            "VIDEO"
        );


        return wrapper;

    }


    /* AUDIO */

    if (
        type ===
        "audio"
        ||
        isAudio(
            mediaURL
        )
    ) {

        const audioContainer =
            document.createElement(
                "div"
            );


        audioContainer.className =
            "audio-project";


        const symbol =
            document.createElement(
                "div"
            );


        symbol.className =
            "audio-symbol";


        symbol.textContent =
            "♪";


        audioContainer.appendChild(
            symbol
        );


        const audio =
            document.createElement(
                "audio"
            );


        audio.src =
            mediaURL;


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
            "kong project";


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


    /* IMAGE FROM MEDIA URL */

    if (
        isImage(
            mediaURL
        )
    ) {

        const image =
            document.createElement(
                "img"
            );


        image.src =
            mediaURL;


        image.alt =
            project.title ||
            "kong project";


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
        "placeholder";


    placeholder.textContent =
        getSymbol(
            project.category
        );


    wrapper.appendChild(
        placeholder
    );


    return wrapper;

}


/* =========================================================
   SOUNDCLOUD
   ========================================================= */

function createSoundCloud(
    url
) {

    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.className =
        "soundcloud-wrapper";


    let embedURL =
        url;


    if (
        !url.includes(
            "w.soundcloud.com/player"
        )
    ) {

        embedURL =
            "https://w.soundcloud.com/player/?url="
            +
            encodeURIComponent(
                url
            )
            +
            "&color=%23ff6500"
            +
            "&auto_play=false"
            +
            "&hide_related=true"
            +
            "&show_comments=false"
            +
            "&show_user=true"
            +
            "&show_reposts=false"
            +
            "&show_teaser=false";

    }


    const iframe =
        document.createElement(
            "iframe"
        );


    iframe.src =
        embedURL;


    iframe.allow =
        "autoplay";


    iframe.loading =
        "lazy";


    wrapper.appendChild(
        iframe
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
   CATEGORY NORMALIZATION
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

        "video":
            "video",

        "video editing":
            "video",

        "video-editing":
            "video",


        "sound":
            "sound-design",

        "sound design":
            "sound-design",

        "sound-design":
            "sound-design",


        "photography":
            "photography",

        "photo":
            "photography",


        "graphic design":
            "graphic-design",

        "graphic-design":
            "graphic-design",

        "graphics":
            "graphic-design"

    };


    return (
        aliases[
            value
        ]
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
   SYMBOL
   ========================================================= */

function getSymbol(
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
   PROJECT TYPE
   ========================================================= */

function getProjectType(
    project
) {

    if (
        project.type
    ) {

        return String(
            project.type
        )
        .trim()
        .toLowerCase();

    }


    const url =
        (
            project.media_url ||
            project.url ||
            ""
        )
        .toLowerCase();


    if (
        url.includes(
            "soundcloud.com"
        )
    ) {

        return "soundcloud";

    }


    if (
        isVideo(
            url
        )
    ) {

        return "video";

    }


    if (
        isAudio(
            url
        )
    ) {

        return "audio";

    }


    if (
        isImage(
            url
        )
    ) {

        return "image";

    }


    return "";

}


/* =========================================================
   FILE CHECKS
   ========================================================= */

function isVideo(
    url
) {

    const value =
        String(
            url
        )
        .toLowerCase();


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
            ".mp4?"
        )

        ||

        value.includes(
            ".webm?"
        )

    );

}


function isAudio(
    url
) {

    const value =
        String(
            url
        )
        .toLowerCase();


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
            ".mp3?"
        )

        ||

        value.includes(
            ".wav?"
        )

    );

}


function isImage(
    url
) {

    const value =
        String(
            url
        )
        .toLowerCase();


    return (

        value.endsWith(
            ".jpg"
        )

        ||

        value.endsWith(
            ".jpeg"
        )

        ||

        value.endsWith(
            ".png"
        )

        ||

        value.endsWith(
            ".webp"
        )

        ||

        value.endsWith(
            ".gif"
        )

        ||

        value.includes(
            ".jpg?"
        )

        ||

        value.includes(
            ".png?"
        )

    );

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(
    value
) {

    return String(
        value
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );

}


/* =========================================================
   ESCAPE KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

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


/* =========================================================
   START
   ========================================================= */

loadProjects();
