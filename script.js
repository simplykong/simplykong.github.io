/* =========================================================
   simplykong
   Supabase Portfolio
   ========================================================= */


/* =========================================================
   SUPABASE CONFIG
   ========================================================= */

const SUPABASE_URL =
    "https://hjxhpjynriafeqewwqis.supabase.co";


const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_7S5vxB9HNy90sQ_Q0znz6A_IqyjPA96";


/* =========================================================
   SUPABASE CLIENT
   ========================================================= */

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
   DATA
   ========================================================= */

let allProjects = [];


const categoryNames = {

    music:
        "Music",

    "sound-design":
        "Sound Design",

    video:
        "Video",

    photo:
        "Photography"

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
   LOAD PROJECTS
   ========================================================= */

async function loadProjects() {

    if (
        !projectsContainer
    ) {

        return;

    }


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


        if (
            error
        ) {

            throw error;

        }


        allProjects =
            data || [];


        displayProjects(
            allProjects
        );


    } catch (
        error
    ) {

        console.error(
            "Supabase error:",
            error
        );


        projectsContainer.innerHTML = `
            <div class="error-message">

                <strong>
                    couldn't load projects
                </strong>

                <span>
                    check the browser console
                    for the Supabase error.
                </span>

            </div>
        `;

    }

}


/* =========================================================
   DISPLAY PROJECTS
   ========================================================= */

function displayProjects(
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

            const card =
                createProjectCard(
                    project
                );


            card.style.animationDelay =
                `${index * 0.06}s`;


            projectsContainer.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   CREATE PROJECT CARD
   ========================================================= */

function createProjectCard(
    project
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "project-card";


    /* =============================================
       THUMBNAIL
       ============================================= */

    let thumbnail;


    if (
        project.thumbnail_url
    ) {

        thumbnail = `
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

        thumbnail = `
            <div class="no-thumbnail">

                ${
                    categoryIcons[
                        project.category
                    ] || "•"
                }

            </div>
        `;

    }


    /* =============================================
       CATEGORY
       ============================================= */

    const category =
        categoryNames[
            project.category
        ]
        ||
        project.category
        ||
        "Project";


    /* =============================================
       DESCRIPTION
       ============================================= */

    let description =
        "";


    if (
        project.description
    ) {

        description = `
            <p>
                ${escapeHTML(
                    project.description
                )}
            </p>
        `;

    }


    /* =============================================
       CARD HTML
       ============================================= */

    card.innerHTML = `

        <div class="project-thumbnail">

            ${thumbnail}

        </div>


        <div class="project-info">

            <div class="project-category">

                ${escapeHTML(
                    category
                )}

            </div>


            <h3>

                ${escapeHTML(
                    project.title
                )}

            </h3>


            ${description}


            <a
                class="project-link"
                href="${escapeHTML(
                    project.url
                )}"
                target="_blank"
                rel="noopener noreferrer"
            >
                view project →
            </a>

        </div>

    `;


    return card;

}


/* =========================================================
   FILTER PROJECTS
   ========================================================= */

function filterProjects(
    category
) {

    if (
        category === "all"
    ) {

        displayProjects(
            allProjects
        );

        return;

    }


    const filteredProjects =
        allProjects.filter(
            project =>
                project.category ===
                category
        );


    displayProjects(
        filteredProjects
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
                    otherButton => {

                        otherButton.classList.remove(
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
