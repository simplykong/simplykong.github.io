/* =========================================================
   kong portfolio
   YouTube videos open directly on YouTube
   Supabase database:
   id, title, category, url, featured
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
    document.getElementById("home");

const work =
    document.getElementById("work");

const workButton =
    document.getElementById("workButton");

const backButton =
    document.getElementById("backButton");

const projectsContainer =
    document.getElementById("projects");

const pagination =
    document.getElementById("pagination");

const previousPage =
    document.getElementById("previousPage");

const nextPage =
    document.getElementById("nextPage");

const pageIndicator =
    document.getElementById("pageIndicator");

const tabs =
    document.querySelectorAll(".tab");


/* =========================================================
   SETTINGS
   ========================================================= */

const PROJECTS_PER_PAGE = 6;


/* =========================================================
   STATE
   ========================================================= */

let allProjects = [];

let currentCategory = "video";

let currentPage = 1;


/* =========================================================
   START AT HOME
   ========================================================= */

function resetPageState() {

    if (home) {
        home.style.display = "flex";
        home.classList.remove("hidden");
    }

    if (work) {
        work.classList.remove("visible");
    }

    window.scrollTo(0, 0);
}

resetPageState();


/* =========================================================
   OPEN WORK
   ========================================================= */

function openWork() {

    if (!home || !work) {
        return;
    }

    home.classList.add("hidden");

    setTimeout(function () {

        home.style.display = "none";

        work.classList.add("visible");

        window.scrollTo(0, 0);

    }, 450);
}


/* =========================================================
   CLOSE WORK
   ========================================================= */

function closeWork() {

    if (!home || !work) {
        return;
    }

    work.classList.remove("visible");

    setTimeout(function () {

        home.style.display = "flex";

        home.classList.remove("hidden");

        window.scrollTo(0, 0);

    }, 600);
}


/* =========================================================
   BUTTON EVENTS
   ========================================================= */

if (workButton) {

    workButton.addEventListener(
        "click",
        openWork
    );

}


if (backButton) {

    backButton.addEventListener(
        "click",
        closeWork
    );

}


/* =========================================================
   PAGINATION
   ========================================================= */

if (previousPage) {

    previousPage.addEventListener(
        "click",
        function () {

            if (currentPage > 1) {

                currentPage--;

                renderProjects();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }

        }
    );

}


if (nextPage) {

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

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }

        }
    );

}


/* =========================================================
   CATEGORY TABS
   ========================================================= */

tabs.forEach(function (tab) {

    tab.addEventListener(
        "click",
        function () {

            switchCategory(
                tab.dataset.category
            );

        }
    );

});


/* =========================================================
   SWITCH CATEGORY
   ========================================================= */

function switchCategory(category) {

    currentCategory =
        category;

    currentPage =
        1;


    tabs.forEach(function (tab) {

        tab.classList.toggle(
            "active",
            tab.dataset.category ===
            category
        );

    });


    renderProjects();
}


/* =========================================================
   LOAD PROJECTS
   ========================================================= */

async function loadProjects() {

    if (!projectsContainer) {
        return;
    }


    projectsContainer.innerHTML = `
        <div class="loading">
            loading...
        </div>
    `;


    try {

        /*
           IMPORTANT:
           No .order("date") here because
           your table doesn't have a date column.
        */

        const result =
            await supabaseClient
                .from("projects")
                .select("*");


        if (result.error) {

            throw result.error;

        }


        allProjects =
            result.data || [];


        console.log(
            "Projects loaded:",
            allProjects
        );


        renderProjects();

    }

    catch (error) {

        console.error(
            "Supabase error:",
            error
        );


        projectsContainer.innerHTML = `

            <div class="error">

                <strong>
                    Couldn't load projects.
                </strong>

                <br><br>

                ${escapeHTML(
                    error.message ||
                    "Unknown error"
                )}

            </div>

        `;


        if (pagination) {

            pagination.style.display =
                "none";

        }

    }

}


/* =========================================================
   GET CURRENT CATEGORY PROJECTS
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

    if (!projectsContainer) {
        return;
    }


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


    if (currentPage > totalPages) {

        currentPage =
            totalPages;

    }


    const start =
        (
            currentPage - 1
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


    /* -----------------------------------------------------
       NOTHING IN CATEGORY
       ----------------------------------------------------- */

    if (projects.length === 0) {

        projectsContainer.innerHTML = `

            <div class="empty">

                Nothing here yet.

            </div>

        `;


        if (pagination) {

            pagination.style.display =
                "none";

        }


        return;
    }


    /* -----------------------------------------------------
       CREATE CARDS
       ----------------------------------------------------- */

    visibleProjects.forEach(
        function (
            project,
            index
        ) {

            const element =
                createProject(project);


            element.style.animationDelay =
                `${index * 0.07}s`;


            projectsContainer.appendChild(
                element
            );

        }
    );


    /* -----------------------------------------------------
       PAGINATION
       ----------------------------------------------------- */

    if (pagination) {

        if (totalPages <= 1) {

            pagination.style.display =
                "none";

        }

        else {

            pagination.style.display =
                "flex";

        }

    }


    if (previousPage) {

        previousPage.disabled =
            currentPage <= 1;

    }


    if (nextPage) {

        nextPage.disabled =
            currentPage >=
            totalPages;

    }


    if (pageIndicator) {

        pageIndicator.textContent =
            `${String(
                currentPage
            ).padStart(2, "0")} / ${String(
                totalPages
            ).padStart(2, "0")}`;

    }

}


/* =========================================================
   CREATE PROJECT CARD
   ========================================================= */

function createProject(project) {

    const article =
        document.createElement("article");


    article.className =
        "project";


    /*
       Clicking the card opens the
       project URL in a new tab.
    */

    if (project.url) {

        article.style.cursor =
            "pointer";


        article.addEventListener(
            "click",
            function () {

                window.open(
                    project.url,
                    "_blank",
                    "noopener,noreferrer"
                );

            }
        );

    }


    /* Media */

    const media =
        createProjectMedia(project);


    /* Info */

    const info =
        document.createElement("div");


    info.className =
        "project-info";


    /* Category */

    const category =
        document.createElement("div");


    category.className =
        "project-category";


    category.textContent =
        getCategoryLabel(
            project.category
        );


    info.appendChild(
        category
    );


    /* Title */

    const title =
        document.createElement("div");


    title.className =
        "project-title";


    title.textContent =
        project.title ||
        "Untitled";


    info.appendChild(
        title
    );


    /* Card */

    article.appendChild(
        media
    );


    article.appendChild(
        info
    );


    return article;
}


/* =========================================================
   CREATE PROJECT MEDIA
   ========================================================= */

function createProjectMedia(project) {

    const wrapper =
        document.createElement("div");


    wrapper.className =
        "project-media";


    const url =
        project.url ||
        "";


    /* -----------------------------------------------------
       YOUTUBE
       ----------------------------------------------------- */

    if (isYouTube(url)) {

        return createYouTubeThumbnail(
            project
        );

    }


    /* -----------------------------------------------------
       SOUNDCLOUD
       ----------------------------------------------------- */

    if (isSoundCloud(url)) {

        return createSoundCloudCard(
            project
        );

    }


    /* -----------------------------------------------------
       IMAGE
       ----------------------------------------------------- */

    if (isImage(url)) {

        const image =
            document.createElement("img");


        image.src =
            url;


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


    /* -----------------------------------------------------
       VIDEO FILE
       ----------------------------------------------------- */

    if (isVideoFile(url)) {

        const video =
            document.createElement("video");


        video.src =
            url;


        video.controls =
            true;


        video.preload =
            "metadata";


        video.playsInline =
            true;


        video.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

            }
        );


        wrapper.appendChild(
            video
        );


        return wrapper;

    }


    /* -----------------------------------------------------
       FALLBACK
       ----------------------------------------------------- */

    const placeholder =
        document.createElement("div");


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
   YOUTUBE THUMBNAIL
   ========================================================= */

function createYouTubeThumbnail(project) {

    const wrapper =
        document.createElement("div");


    wrapper.className =
        "project-media youtube-card";


    const videoID =
        getYouTubeID(
            project.url
        );


    /* Thumbnail */

    if (videoID) {

        const image =
            document.createElement("img");


        image.src =
            `https://img.youtube.com/vi/${videoID}/maxresdefault.jpg`;


        image.alt =
            project.title ||
            "YouTube video";


        image.loading =
            "lazy";


        /*
           Fallback thumbnail.
        */

        image.onerror =
            function () {

                image.onerror =
                    null;

                image.src =
                    `https://img.youtube.com/vi/${videoID}/hqdefault.jpg`;

            };


        wrapper.appendChild(
            image
        );

    }


    /* Overlay */

    const overlay =
        document.createElement("div");


    overlay.className =
        "youtube-overlay";


    /* Play button */

    const playButton =
        document.createElement("div");


    playButton.className =
        "youtube-play";


    playButton.innerHTML =
        "▶";


    overlay.appendChild(
        playButton
    );


    /* Label */

    const label =
        document.createElement("span");


    label.className =
        "youtube-label";


    label.textContent =
        "WATCH ON YOUTUBE";


    overlay.appendChild(
        label
    );


    wrapper.appendChild(
        overlay
    );


    return wrapper;
}


/* =========================================================
   SOUNDCLOUD CARD
   ========================================================= */

function createSoundCloudCard(project) {

    const wrapper =
        document.createElement("div");

    wrapper.className =
        "project-media soundcloud-card";

    /*
       Create the actual SoundCloud player.
       The database only needs the normal
       SoundCloud track URL.
    */

    const iframe =
        document.createElement("iframe");

    iframe.width =
        "100%";

    iframe.height =
        "166";

    iframe.scrolling =
        "no";

    iframe.frameBorder =
        "no";

    iframe.allow =
        "autoplay; encrypted-media";

    iframe.title =
        project.title ||
        "SoundCloud player";

    const soundcloudUrl =
        "https://w.soundcloud.com/player/?" +
        "url=" +
        encodeURIComponent(project.url) +
        "&color=%23ff5500" +
        "&auto_play=false" +
        "&hide_related=false" +
        "&show_comments=true" +
        "&show_user=true" +
        "&show_reposts=false" +
        "&show_teaser=true";

    wrapper.appendChild(
        iframe
    );

    return wrapper;
}

/* =========================================================
   GET YOUTUBE VIDEO ID
   ========================================================= */

function getYouTubeID(url) {

    if (!url) {
        return null;
    }


    try {

        const parsed =
            new URL(url);


        const hostname =
            parsed.hostname
                .toLowerCase();


        /*
           youtube.com/watch?v=...
        */

        if (
            hostname.includes(
                "youtube.com"
            )
            &&
            parsed.pathname ===
                "/watch"
        ) {

            return parsed.searchParams.get(
                "v"
            );

        }


        /*
           youtu.be/...
        */

        if (
            hostname ===
            "youtu.be"
        ) {

            return parsed.pathname
                .substring(1)
                .split("/")[0];

        }


        /*
           youtube.com/shorts/...
        */

        if (
            parsed.pathname.startsWith(
                "/shorts/"
            )
        ) {

            return parsed.pathname
                .split("/")[2];

        }


        /*
           youtube.com/embed/...
        */

        if (
            parsed.pathname.startsWith(
                "/embed/"
            )
        ) {

            return parsed.pathname
                .split("/")[2];

        }


        return null;

    }

    catch {

        return null;

    }

}


/* =========================================================
   YOUTUBE DETECTION
   ========================================================= */

function isYouTube(url) {

    if (!url) {
        return false;
    }


    try {

        const parsed =
            new URL(url);


        const hostname =
            parsed.hostname
                .toLowerCase();


        return (
            hostname.includes(
                "youtube.com"
            )
            ||
            hostname ===
                "youtu.be"
        );

    }

    catch {

        return false;

    }

}


/* =========================================================
   SOUNDCLOUD DETECTION
   ========================================================= */

function isSoundCloud(url) {

    if (!url) {
        return false;
    }


    return (
        url.includes(
            "soundcloud.com"
        )
        ||
        url.includes(
            "w.soundcloud.com/player"
        )
    );

}


/* =========================================================
   IMAGE DETECTION
   ========================================================= */

function isImage(url) {

    if (!url) {
        return false;
    }


    const value =
        url.toLowerCase();


    return (
        value.endsWith(".jpg") ||
        value.endsWith(".jpeg") ||
        value.endsWith(".png") ||
        value.endsWith(".webp") ||
        value.endsWith(".gif") ||
        value.includes(".jpg?") ||
        value.includes(".jpeg?") ||
        value.includes(".png?") ||
        value.includes(".webp?")
    );

}


/* =========================================================
   VIDEO FILE DETECTION
   ========================================================= */

function isVideoFile(url) {

    if (!url) {
        return false;
    }


    const value =
        url.toLowerCase();


    return (
        value.endsWith(".mp4") ||
        value.endsWith(".webm") ||
        value.endsWith(".mov") ||
        value.includes(".mp4?") ||
        value.includes(".webm?") ||
        value.includes(".mov?")
    );

}


/* =========================================================
   CATEGORY NORMALIZATION
   ========================================================= */

function normalizeCategory(category) {

    if (!category) {
        return "";
    }


    const value =
        String(category)
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
        aliases[value] ||
        value
    );

}


/* =========================================================
   CATEGORY LABEL
   ========================================================= */

function getCategoryLabel(category) {

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
        labels[normalized] ||
        "PROJECT"
    );

}


/* =========================================================
   SYMBOL
   ========================================================= */

function getSymbol(category) {

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
        symbols[normalized] ||
        "•"
    );

}


/* =========================================================
   ADD OVERLAY
   ========================================================= */

function addOverlay(
    wrapper,
    text
) {

    const overlay =
        document.createElement("div");


    overlay.className =
        "project-overlay";


    const label =
        document.createElement("span");


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
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    return String(value)
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
                work &&
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
   LOAD
   ========================================================= */

loadProjects();
