/* =========================================================
   simplykong
   Supabase Gallery
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


const db =
    createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


/* =========================================================
   ELEMENTS
   ========================================================= */

const projectsContainer =
    document.getElementById(
        "projects"
    );


const filterButtons =
    document.querySelectorAll(
        ".filter-button"
    );


/* =========================================================
   PROJECT DATA
   ========================================================= */

let allProjects = [];


const categoryNames = {

    music:
        "music",

    "sound-design":
        "sound",

    video:
        "video",

    photo:
        "photo"

};


const categoryIcons = {

    music:
        "♪",

    "sound-design":
        "◉",

    video:
        "▶",

    photo:
        "✦"

};


/* =========================================================
   LOAD
   ========================================================= */

async function loadProjects() {

    projectsContainer.innerHTML = `
        <div class="loading">
            loading...
        </div>
    `;


    try {

        const {
            data,
            error
        } = await db

            .from("projects")

            .select("*")

            .order(
                "created_at",
                {
                    ascending: false
                }
            );


        if (error) {

            throw error;

        }


        allProjects =
            data || [];


        renderProjects(
            allProjects
        );


    } catch (error) {

        console.error(
            "Supabase error:",
            error
        );


        projectsContainer.innerHTML = `

            <div class="error-message">

                <strong>
                    something went wrong.
                </strong>

                check the browser console
                for the Supabase error.

            </div>

        `;

    }

}


/* =========================================================
   RENDER
   ========================================================= */

function renderProjects(
    projects
) {

    projectsContainer.innerHTML =
        "";


    if (
        projects.length === 0
    ) {

        projectsContainer.innerHTML = `

            <div class="empty">

                nothing here yet.

            </div>

        `;

        return;

    }


    projects.forEach(
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


    const category =
        categoryNames[
            project.category
        ]
        ||
        project.category
        ||
        "project";


    let imageHTML;


    if (
        project.thumbnail_url
    ) {

        imageHTML = `

            <img
                src="${escapeHTML(
                    project.thumbnail_url
                )}"
                alt="${escapeHTML(
                    project.title
                )}"
                loading="lazy"
            >

        `;

    } else {

        imageHTML = `

            <div class="no-image">

                ${
                    categoryIcons[
                        project.category
                    ]
                    ||
                    "•"
                }

            </div>

        `;

    }


    article.innerHTML = `

        <div class="project-image">

            ${imageHTML}

        </div>


        <div class="project-info">

            <div class="project-title">

                ${escapeHTML(
                    project.title
                )}

            </div>


            <div class="project-meta">

                <span>
                    ${escapeHTML(
                        category
                    )}
                </span>

                <span>
                    ${getYear(
                        project.created_at
                    )}
                </span>

            </div>

        </div>

    `;


    /* =============================================
       CLICK
       ============================================= */

    article.addEventListener(
        "click",
        () => {

            if (
                project.url
            ) {

                window.open(
                    project.url,
                    "_blank",
                    "noopener,noreferrer"
                );

            }

        }
    );


    return article;

}


/* =========================================================
   YEAR
   ========================================================= */

function getYear(
    date
) {

    if (!date) {

        return "";

    }


    const parsed =
        new Date(date);


    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {

        return "";

    }


    return parsed.getFullYear();

}


/* =========================================================
   FILTERING
   ========================================================= */

function filterProjects(
    category
) {

    if (
        category === "all"
    ) {

        renderProjects(
            allProjects
        );

        return;

    }


    const filtered =
        allProjects.filter(
            project =>
                project.category ===
                category
        );


    renderProjects(
        filtered
    );

}


/* =========================================================
   FILTER BUTTONS
   ========================================================= */

filterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(
                    other => {

                        other.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                filterProjects(
                    button.dataset.category
                );

            }
        );

    }
);


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


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
   START
   ========================================================= */

loadProjects();
