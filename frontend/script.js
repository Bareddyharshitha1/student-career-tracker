const API_URL = "http://localhost:5000";
let currentStudentId = 4;

let student = null;
let skills = [];
let editingIndex = -1;


// ======================================================
// ROLE SKILLS
// ======================================================

const roleSkills = {

    "Full Stack Developer": [
        "HTML",
        "CSS",
        "JavaScript",
        "React",
        "Node.js",
        "SQL"
    ],

    "Frontend Developer": [
        "HTML",
        "CSS",
        "JavaScript",
        "React"
    ],

    "Backend Developer": [
        "Node.js",
        "Express.js",
        "SQL",
        "PostgreSQL",
        "MongoDB"
    ],

    "Python Developer": [
        "Python",
        "SQL",
        "Git",
        "PostgreSQL"
    ],

    "Data Analyst": [
        "Python",
        "SQL",
        "Power BI",
        "Git"
    ]

};


// ======================================================
// DOM
// ======================================================

const nameInput =
    document.getElementById("studentName");

const emailInput =
    document.getElementById("studentEmail");

const roleInput =
    document.getElementById("targetRole");

const registerButton =
    document.getElementById("registerButton");

const result =
    document.getElementById("studentMessage");

const profileContent =
    document.getElementById("profileContent");

const skillForm =
    document.getElementById("skillForm");

const skillInput =
    document.getElementById("skill");

const progressInput =
    document.getElementById("progress");

const skillsList =
    document.getElementById("skillsList");

const dashboardRole =
    document.getElementById("dashboardRole");

const totalSkills =
    document.getElementById("totalSkills");

const averageProgress =
    document.getElementById("averageProgress");

const careerReadiness =
    document.getElementById("careerReadiness");

const readinessBar =
    document.getElementById("readinessBar");

const requiredSkillsList =
    document.getElementById("requiredSkillsList");

const learningList =
    document.getElementById("learningList");

const skillGapRole =
    document.getElementById("skillGapRole");

const skillGapCount =
    document.getElementById("skillGapCount");

const skillGapList =
    document.getElementById("skillGapList");

const focusSkills =
    document.getElementById("focusSkills");

const analyzeGapButton =
    document.getElementById("analyzeGapButton");

const readinessStudent =
    document.getElementById("readinessStudent");

const readinessRole =
    document.getElementById("readinessRole");

const readinessScore =
    document.getElementById("readinessScore");

const readinessProgressBar =
    document.getElementById("readinessProgressBar");

const completedCount =
    document.getElementById("completedCount");

const inProgressCount =
    document.getElementById("inProgressCount");

const notStartedCount =
    document.getElementById("notStartedCount");

const completedSkillsList =
    document.getElementById("completedSkillsList");

const inProgressSkillsList =
    document.getElementById("inProgressSkillsList");

const notStartedSkillsList =
    document.getElementById("notStartedSkillsList");

const prioritySkillsList =
    document.getElementById("prioritySkillsList");

const readinessButton =
    document.getElementById("readinessButton");


// ======================================================
// REGISTER STUDENT
// ======================================================

if (registerButton) {

    registerButton.addEventListener(
        "click",
        async () => {

            const name =
                nameInput.value.trim();

            const email =
                emailInput.value.trim();

            const target_role =
                roleInput.value;


            if (!name) {

                alert(
                    "Please enter student name."
                );

                return;
            }


            if (!email) {

                alert(
                    "Please enter email."
                );

                return;
            }


            if (!target_role) {

                alert(
                    "Please select target job role."
                );

                return;
            }


            try {

                registerButton.disabled =
                    true;

                registerButton.textContent =
                    "Registering...";


                const response =
                    await fetch(
                        `${API_URL}/api/students`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                name,
                                email,
                                target_role
                            })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Registration failed"
                    );

                }


                student =
                    data.student ||
                    data;


                if (
                    !student.id &&
                    data.id
                ) {

                    student = data;

                }


                if (!student.id) {

                    throw new Error(
                        "Student ID was not returned by backend."
                    );

                }


                localStorage.setItem(
                    "studentId",
                    student.id
                );


                result.textContent =
                    "Student registered successfully!";

                result.style.color =
                    "green";


                skills = [];


                displayStudent();

                updateDashboard();

                displayRequiredSkills();

                displayLearning();


                await loadSkills();

                await loadSkillGap();

                await loadPlacementReadiness();


            } catch (error) {

                console.error(
                    "Registration error:",
                    error
                );


                result.textContent =
                    "Registration failed: " +
                    error.message;

                result.style.color =
                    "red";

            } finally {

                registerButton.disabled =
                    false;

                registerButton.textContent =
                    "Register Student";

            }

        }
    );

}


// ======================================================
// DISPLAY STUDENT
// ======================================================

function displayStudent() {

    if (
        !student ||
        !profileContent
    ) {

        return;

    }


    profileContent.innerHTML = `

        <div class="profile-item">

            <h3>Name</h3>

            <p>
                ${student.name}
            </p>

        </div>


        <div class="profile-item">

            <h3>Email</h3>

            <p>
                ${student.email}
            </p>

        </div>


        <div class="profile-item">

            <h3>Target Role</h3>

            <p>
                ${student.target_role}
            </p>

        </div>

    `;

}


// ======================================================
// LOAD STUDENT
// ======================================================

async function loadStudent(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/api/students/${id}`
            );


        if (!response.ok) {

            return false;

        }


        const data =
            await response.json();


        student =
            data.student ||
            data;


        return !!student.id;


    } catch (error) {

        console.error(
            "Load student error:",
            error
        );

        return false;

    }

}


// ======================================================
// ROLE CHANGE
// ======================================================

if (roleInput) {

    roleInput.addEventListener(
        "change",
        async () => {

            if (!student) {

                return;

            }


            const newRole =
                roleInput.value;


            if (!newRole) {

                return;

            }


            try {

                const response =
                    await fetch(
                        `${API_URL}/api/students/${student.id}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                name:
                                    student.name,

                                email:
                                    student.email,

                                target_role:
                                    newRole
                            })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Could not update role"
                    );

                }


                student =
                    data.student ||
                    data;


                displayStudent();

                updateDashboard();

                displayRequiredSkills();

                displayLearning();

                await loadSkillGap();

                await loadPlacementReadiness();


            } catch (error) {

                console.error(error);

                alert(
                    error.message
                );

            }

        }
    );

}


// ======================================================
// ADD / UPDATE SKILL
// ======================================================

if (skillForm) {

    skillForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            if (!student) {

                alert(
                    "Please register the student first."
                );

                return;

            }


            const skill =
                skillInput.value;


            const progress =
                Number(
                    progressInput.value
                );


            if (!skill) {

                alert(
                    "Please select a skill."
                );

                return;

            }


            if (
                Number.isNaN(progress) ||
                progress < 0 ||
                progress > 100
            ) {

                alert(
                    "Please select valid progress."
                );

                return;

            }


            try {

                if (editingIndex === -1) {

                    const response =
                        await fetch(
                            `${API_URL}/api/skills`,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({
                                    student_id:
                                        student.id,

                                    skill_name:
                                        skill,

                                    progress:
                                        progress
                                })
                            }
                        );


                    const data =
                        await response.json();


                    if (!response.ok) {

                        throw new Error(
                            data.message ||
                            "Could not add skill"
                        );

                    }

                } else {

                    const existingSkill =
                        skills[editingIndex];


                    const response =
                        await fetch(
                            `${API_URL}/api/skills/${existingSkill.id}`,
                            {
                                method: "PUT",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({
                                    skill_name:
                                        skill,

                                    progress:
                                        progress
                                })
                            }
                        );


                    if (!response.ok) {

                        throw new Error(
                            "Could not update skill"
                        );

                    }


                    editingIndex = -1;

                }


                skillForm.reset();


                const addButton =
                    document.getElementById(
                        "addSkillButton"
                    );


                if (addButton) {

                    addButton.textContent =
                        "➕ Add Skill";

                }


                await loadSkills();

                await loadSkillGap();

                await loadPlacementReadiness();


            } catch (error) {

                console.error(error);

                alert(
                    error.message
                );

            }

        }
    );

}


// ======================================================
// LOAD SKILLS
// ======================================================

async function loadSkills() {

    if (
        !student ||
        !student.id
    ) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/skills/${student.id}`
            );


        if (!response.ok) {

            throw new Error(
                "Could not load skills"
            );

        }


        const data =
            await response.json();


        skills =
            Array.isArray(data)
                ? data
                : data.skills || [];


        renderSkills();

        updateDashboard();

        displayRequiredSkills();

        displayLearning();


    } catch (error) {

        console.error(
            "Skills error:",
            error
        );


        skills = [];

        renderSkills();

        updateDashboard();

    }

}


// ======================================================
// RENDER SKILLS
// ======================================================

function renderSkills() {

    if (!skillsList) {

        return;

    }


    if (
        skills.length === 0
    ) {

        skillsList.innerHTML =
            "<p>No skills added yet.</p>";

        return;

    }


    skillsList.innerHTML =
        "";


    skills.forEach(
        (item, index) => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "skill-item";


            div.innerHTML = `

                <div>

                    <strong>
                        ${item.skill_name}
                    </strong>

                    <p>
                        Progress:
                        ${item.progress}%
                    </p>

                </div>


                <div>

                    <button
                        type="button"
                        onclick="editSkill(${index})"
                    >
                        ✏️ Edit
                    </button>


                    <button
                        type="button"
                        onclick="deleteSkill(${item.id})"
                    >
                        🗑️ Delete
                    </button>

                </div>

            `;


            skillsList.appendChild(
                div
            );

        }
    );

}


// ======================================================
// EDIT SKILL
// ======================================================

window.editSkill =
    function(index) {

        const item =
            skills[index];


        if (!item) {

            return;

        }


        skillInput.value =
            item.skill_name;


        progressInput.value =
            item.progress;


        editingIndex =
            index;


        const button =
            document.getElementById(
                "addSkillButton"
            );


        if (button) {

            button.textContent =
                "Update Skill";

        }

    };


// ======================================================
// DELETE SKILL
// ======================================================

window.deleteSkill =
    async function(id) {

        if (
            !confirm(
                "Delete this skill?"
            )
        ) {

            return;

        }


        try {

            const response =
                await fetch(
                    `${API_URL}/api/skills/${id}`,
                    {
                        method: "DELETE"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Could not delete skill"
                );

            }


            await loadSkills();

            await loadSkillGap();

            await loadPlacementReadiness();


        } catch (error) {

            console.error(error);

            alert(
                error.message
            );

        }

    };


// ======================================================
// DASHBOARD
// ======================================================

function updateDashboard() {

    if (!student) {

        return;

    }


    const role =
        student.target_role;


    const total =
        skills.length;


    let average =
        0;


    if (total > 0) {

        const sum =
            skills.reduce(
                (total, item) =>
                    total +
                    Number(item.progress),
                0
            );


        average =
            Math.round(
                sum / total
            );

    }


    const required =
        roleSkills[role] || [];


    let readiness =
        0;


    if (
        required.length > 0
    ) {

        let totalProgress =
            0;


        required.forEach(
            requiredSkill => {

                const found =
                    skills.find(
                        item =>
                            item.skill_name
                                .toLowerCase() ===
                            requiredSkill
                                .toLowerCase()
                    );


                totalProgress +=
                    found
                        ? Number(found.progress)
                        : 0;

            }
        );


        readiness =
            Math.round(
                totalProgress /
                required.length
            );

    }


    if (dashboardRole) {

        dashboardRole.textContent =
            role;

    }


    if (totalSkills) {

        totalSkills.textContent =
            total;

    }


    if (averageProgress) {

        averageProgress.textContent =
            average + "%";

    }


    if (careerReadiness) {

        careerReadiness.textContent =
            readiness + "%";

    }


    if (readinessBar) {

        readinessBar.style.width =
            readiness + "%";

    }

}


// ======================================================
// REQUIRED SKILLS
// ======================================================

function displayRequiredSkills() {

    if (
        !requiredSkillsList ||
        !student
    ) {

        return;

    }


    const required =
        roleSkills[
            student.target_role
        ] || [];


    requiredSkillsList.innerHTML =
        "";


    required.forEach(
        skillName => {

            const found =
                skills.find(
                    item =>
                        item.skill_name
                            .toLowerCase() ===
                        skillName
                            .toLowerCase()
                );


            const progress =
                found
                    ? Number(found.progress)
                    : 0;


            let status =
                "Not Started";


            if (
                progress === 100
            ) {

                status =
                    "Completed";

            } else if (
                progress > 0
            ) {

                status =
                    "In Progress";

            }


            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "required-skill";


            div.innerHTML = `

                <h3>
                    ${skillName}
                </h3>

                <p>
                    <strong>
                        ${status}
                    </strong>
                </p>

                <p>
                    Progress:
                    ${progress}%
                </p>

            `;


            requiredSkillsList.appendChild(
                div
            );

        }
    );

}


// ======================================================
// LEARNING
// ======================================================

function displayLearning() {

    if (
        !learningList ||
        !student
    ) {

        return;

    }


    const required =
        roleSkills[
            student.target_role
        ] || [];


    learningList.innerHTML =
        "";


    required.forEach(
        skill => {

            const found =
                skills.find(
                    item =>
                        item.skill_name
                            .toLowerCase() ===
                        skill
                            .toLowerCase()
                );


            const progress =
                found
                    ? Number(found.progress)
                    : 0;


            if (
                progress < 100
            ) {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "learning-item";


                div.innerHTML = `

                    <h3>
                        ${skill}
                    </h3>

                    <p>
                        ${
                            progress === 0
                                ? `Start learning ${skill}.`
                                : `Continue improving your ${skill} skills.`
                        }
                    </p>

                `;


                learningList.appendChild(
                    div
                );

            }

        }
    );


    if (
        learningList.innerHTML === ""
    ) {

        learningList.innerHTML =
            "<p>🎉 All required skills completed!</p>";

    }

}


// ======================================================
// SKILL GAP
// ======================================================

async function loadSkillGap() {

    if (!currentStudentId) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/api/skill-gap/${currentStudentId}`
        );

        if (!response.ok) {
            throw new Error("Could not load skill gap");
        }

        const data = await response.json();

        console.log("Skill Gap loaded:", data);

        displaySkillGap(data);

    } catch (error) {

        console.error(
            "Skill gap error:",
            error
        );
    }
}


// ======================================================
// DISPLAY SKILL GAP
// ======================================================

function displaySkillGap(data) {

    if (!data) {
        return;
    }

    // Target role
    if (skillGapRole) {
        skillGapRole.value =
            data.target_role || "";
    }

    const skillGaps =
        data.skill_gaps || [];

    // Skills requiring attention
    const attentionSkills =
        skillGaps.filter(
            item =>
                item.status !== "Completed"
        );

    if (skillGapCount) {
        skillGapCount.textContent =
            attentionSkills.length;
    }

    // Skill gap list
    if (skillGapList) {

        skillGapList.innerHTML = "";

        if (attentionSkills.length === 0) {

            skillGapList.innerHTML =
                "<p>No skill gap information available.</p>";

        } else {

            attentionSkills.forEach(item => {

                const div =
                    document.createElement("div");

                div.className =
                    "skill-gap-item";

                div.innerHTML = `

                    <h3>${item.skill}</h3>

                    <p>
                        Status:
                        <strong>${item.status}</strong>
                    </p>

                    <p>
                        Current Progress:
                        <strong>${item.progress}%</strong>
                    </p>

                `;

                skillGapList.appendChild(div);

            });
        }
    }

    // Skills to focus on
    if (focusSkills) {

        focusSkills.innerHTML = "";

        if (attentionSkills.length === 0) {

            focusSkills.innerHTML =
                "<li>🎉 No major skill gaps!</li>";

        } else {

            attentionSkills.forEach(item => {

                const li =
                    document.createElement("li");

                li.textContent =
                    `${item.skill} - ${item.progress}% (${item.status})`;

                focusSkills.appendChild(li);

            });
        }
    }
}


// ======================================================
// ANALYZE BUTTON
// ======================================================

if (analyzeGapButton) {

    analyzeGapButton.addEventListener(
        "click",
        async () => {

            await loadSkillGap();


            if (skillGapList) {

                skillGapList.scrollIntoView({
                    behavior: "smooth"
                });

            }

        }
    );

}


// ======================================================
// PLACEMENT READINESS
// ======================================================

async function loadPlacementReadiness() {

    if (!currentStudentId) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/api/placement-readiness/${currentStudentId}`
            );

        if (!response.ok) {

            throw new Error(
                "Could not load placement readiness"
            );

        }

        const data =
            await response.json();

        console.log(
            "Placement Readiness loaded:",
            data
        );

        displayPlacementReadiness(data);

    } catch (error) {

        console.error(
            "Placement readiness error:",
            error
        );

    }

}


// ======================================================
// DISPLAY PLACEMENT READINESS
// ======================================================

function displayPlacementReadiness(data) {

    if (!data) {

        return;

    }


    if (readinessStudent) {

        readinessStudent.textContent =
            data.student;

    }


    if (readinessRole) {

        readinessRole.textContent =
            data.target_role;

    }


    if (readinessScore) {

        readinessScore.textContent =
            data.overall_readiness +
            "%";

    }


    if (readinessProgressBar) {

        readinessProgressBar.style.width =
            data.overall_readiness +
            "%";

    }


    if (completedCount) {

        completedCount.textContent =
            data.completed_count;

    }


    if (inProgressCount) {

        inProgressCount.textContent =
            data.in_progress_count;

    }


    if (notStartedCount) {

        notStartedCount.textContent =
            data.not_started_count;

    }


    displayReadinessSkills(
        completedSkillsList,
        data.completed_skills,
        "No completed skills."
    );


    displayReadinessSkills(
        inProgressSkillsList,
        data.in_progress_skills,
        "No skills in progress."
    );


    displayReadinessSkills(
        notStartedSkillsList,
        data.not_started_skills,
        "No skills not started."
    );


    displayPrioritySkills(
        data.priority_skills
    );

}


// ======================================================
// READINESS SKILLS
// ======================================================

function displayReadinessSkills(
    container,
    skillArray,
    emptyMessage
) {

    if (!container) {

        return;

    }


    if (
        !skillArray ||
        skillArray.length === 0
    ) {

        container.innerHTML =
            `<p>${emptyMessage}</p>`;

        return;

    }


    container.innerHTML =
        "";


    skillArray.forEach(
        item => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "readiness-skill-item";


            div.innerHTML = `

                <strong>
                    ${item.skill}
                </strong>

                <span>
                    ${item.progress}%
                </span>

            `;


            container.appendChild(
                div
            );

        }
    );

}


// ======================================================
// PRIORITY SKILLS
// ======================================================

function displayPrioritySkills(
    prioritySkills
) {

    if (!prioritySkillsList) {

        return;

    }


    if (
        !prioritySkills ||
        prioritySkills.length === 0
    ) {

        prioritySkillsList.innerHTML =
            "<p>No priority skills available.</p>";

        return;

    }


    prioritySkillsList.innerHTML =
        "";


    prioritySkills.forEach(
        item => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "priority-skill-item";


            div.innerHTML = `

                <strong>
                    🔥 ${item.skill}
                </strong>

                <span>
                    ${item.progress}%
                </span>

            `;


            prioritySkillsList.appendChild(
                div
            );

        }
    );

}


// ======================================================
// READINESS BUTTON
// ======================================================

if (readinessButton) {

    readinessButton.addEventListener(
        "click",
        async () => {

            await loadPlacementReadiness();


            const section =
                document.querySelector(
                    ".placement-readiness-section"
                );


            if (section) {

                section.scrollIntoView({
                    behavior: "smooth"
                });

            }

        }
    );

}


// ======================================================
// INTERVIEW PREPARATION
// ======================================================

let interviewQuestions = [];

let currentQuestionIndex = 0;


// ======================================================
// INTERVIEW DOM ELEMENTS
// ======================================================

const interviewRole =
    document.getElementById(
        "interviewRole"
    );

const interviewType =
    document.getElementById(
        "interviewType"
    );

const startInterviewButton =
    document.getElementById(
        "startInterviewButton"
    );

const interviewQuestionArea =
    document.getElementById(
        "interviewQuestionArea"
    );

const questionNumber =
    document.getElementById(
        "questionNumber"
    );

const questionDifficulty =
    document.getElementById(
        "questionDifficulty"
    );

const interviewQuestion =
    document.getElementById(
        "interviewQuestion"
    );

const interviewAnswer =
    document.getElementById(
        "interviewAnswer"
    );

const previousQuestionButton =
    document.getElementById(
        "previousQuestionButton"
    );

const nextQuestionButton =
    document.getElementById(
        "nextQuestionButton"
    );

const interviewResult =
    document.getElementById(
        "interviewResult"
    );

const attemptedQuestions =
    document.getElementById(
        "attemptedQuestions"
    );

const completedInterviewType =
    document.getElementById(
        "completedInterviewType"
    );

const restartInterviewButton =
    document.getElementById(
        "restartInterviewButton"
    );


// ======================================================
// LOAD INTERVIEW QUESTIONS
// ======================================================

async function loadInterviewQuestions() {

    try {

        const role =
            interviewRole.value;

        const type =
            interviewType.value;


        if (!role) {

            alert(
                "Please select target job role."
            );

            return false;

        }


        if (!type) {

            alert(
                "Please select interview type."
            );

            return false;

        }


        const url =
            `${API_URL}/api/interview-questions` +
            `?target_role=${encodeURIComponent(role)}` +
            `&interview_type=${encodeURIComponent(type)}`;


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Failed to load interview questions."
            );

        }


        const data =
            await response.json();


        interviewQuestions =
            data.questions || [];


        if (
            interviewQuestions.length === 0
        ) {

            alert(
                "No interview questions available for this selection."
            );

            return false;

        }


        currentQuestionIndex = 0;


        displayInterviewQuestion();


        return true;


    } catch (error) {

        console.error(
            "Interview question error:",
            error
        );


        alert(
            "Unable to load interview questions. " +
            "Please make sure the backend is running."
        );


        return false;

    }

}


// ======================================================
// DISPLAY CURRENT INTERVIEW QUESTION
// ======================================================

function displayInterviewQuestion() {

    if (
        !interviewQuestions.length
    ) {

        return;

    }


    const question =
        interviewQuestions[
            currentQuestionIndex
        ];


    if (questionNumber) {

        questionNumber.textContent =
            `Question ${
                currentQuestionIndex + 1
            } of ${
                interviewQuestions.length
            }`;

    }


    if (questionDifficulty) {

        questionDifficulty.textContent =
            question.difficulty ||
            "Beginner";

    }


    if (interviewQuestion) {

        interviewQuestion.textContent =
            question.question;

    }


    if (interviewAnswer) {

        interviewAnswer.value =
            question.answer || "";

        interviewAnswer.disabled =
            false;

    }


    if (previousQuestionButton) {

        previousQuestionButton.disabled =
            currentQuestionIndex === 0;

    }


    if (nextQuestionButton) {

        if (
            currentQuestionIndex ===
            interviewQuestions.length - 1
        ) {

            nextQuestionButton.textContent =
                "Finish Interview 🎉";

        } else {

            nextQuestionButton.textContent =
                "Next ➡";

        }

    }

}


// ======================================================
// START INTERVIEW
// ======================================================

if (startInterviewButton) {

    startInterviewButton.addEventListener(
        "click",
        async () => {

            if (interviewResult) {

                interviewResult.style.display =
                    "none";

            }


            const loaded =
                await loadInterviewQuestions();


            if (!loaded) {

                return;

            }


            if (interviewQuestionArea) {

                interviewQuestionArea.style.display =
                    "block";

            }


            startInterviewButton.style.display =
                "none";


            if (previousQuestionButton) {

                previousQuestionButton.style.display =
                    "inline-block";

            }


            if (nextQuestionButton) {

                nextQuestionButton.style.display =
                    "inline-block";

            }

        }
    );

}


// ======================================================
// SAVE CURRENT ANSWER
// ======================================================

function saveCurrentAnswer() {

    if (
        !interviewQuestions[
            currentQuestionIndex
        ]
    ) {

        return;

    }


    interviewQuestions[
        currentQuestionIndex
    ].answer =
        interviewAnswer.value.trim();

}


// ======================================================
// NEXT QUESTION
// ======================================================

if (nextQuestionButton) {

    nextQuestionButton.addEventListener(
        "click",
        () => {

            saveCurrentAnswer();


            if (
                currentQuestionIndex <
                interviewQuestions.length - 1
            ) {

                currentQuestionIndex++;

                displayInterviewQuestion();

            } else {

                finishInterview();

            }

        }
    );

}


// ======================================================
// PREVIOUS QUESTION
// ======================================================

if (previousQuestionButton) {

    previousQuestionButton.addEventListener(
        "click",
        () => {

            saveCurrentAnswer();


            if (
                currentQuestionIndex > 0
            ) {

                currentQuestionIndex--;

                displayInterviewQuestion();

            }

        }
    );

}


// ======================================================
// FINISH INTERVIEW
// ======================================================

function finishInterview() {

    saveCurrentAnswer();


    const attempted =
        interviewQuestions.filter(
            question =>
                question.answer &&
                question.answer.trim() !== ""
        ).length;


    const total =
        interviewQuestions.length;


    const percentage =
        total > 0
            ? Math.round(
                (attempted / total) * 100
            )
            : 0;


    if (attemptedQuestions) {

        attemptedQuestions.textContent =
            `${attempted} / ${total}`;

    }


    if (completedInterviewType) {

        completedInterviewType.textContent =
            `${interviewRole.value} - ${interviewType.value}`;

    }


    if (interviewResult) {

        interviewResult.style.display =
            "block";

    }


    if (nextQuestionButton) {

        nextQuestionButton.style.display =
            "none";

    }


    if (previousQuestionButton) {

        previousQuestionButton.style.display =
            "none";

    }


    if (interviewAnswer) {

        interviewAnswer.disabled =
            true;

    }


    // Optional result message

    const resultMessage =
        document.querySelector(
            ".interview-result-message"
        );


    if (resultMessage) {

        if (percentage === 100) {

            resultMessage.textContent =
                "Excellent! You attempted all questions. 🎉";

        } else if (percentage >= 70) {

            resultMessage.textContent =
                "Good job! Keep practicing to improve further. 👍";

        } else if (percentage >= 40) {

            resultMessage.textContent =
                "Good start! Try answering more questions next time. 💪";

        } else {

            resultMessage.textContent =
                "Keep practicing your interview skills. 📚";

        }

    }

}


// ======================================================
// RESTART INTERVIEW
// ======================================================

if (restartInterviewButton) {

    restartInterviewButton.addEventListener(
        "click",
        () => {

            // Clear questions

            interviewQuestions = [];


            // Reset question number

            currentQuestionIndex = 0;


            // Clear answer

            if (interviewAnswer) {

                interviewAnswer.value =
                    "";

                interviewAnswer.disabled =
                    false;

            }


            // Hide result

            if (interviewResult) {

                interviewResult.style.display =
                    "none";

            }


            // Reset question area

            if (interviewQuestionArea) {

                interviewQuestionArea.style.display =
                    "none";

            }


            // Show start button

            if (startInterviewButton) {

                startInterviewButton.style.display =
                    "inline-block";

            }


            // Show navigation buttons

            if (previousQuestionButton) {

                previousQuestionButton.style.display =
                    "inline-block";

                previousQuestionButton.disabled =
                    true;

            }


            if (nextQuestionButton) {

                nextQuestionButton.style.display =
                    "inline-block";

                nextQuestionButton.textContent =
                    "Next ➡";

            }


            // Clear question display

            if (questionNumber) {

                questionNumber.textContent =
                    "";

            }


            if (questionDifficulty) {

                questionDifficulty.textContent =
                    "";

            }


            if (interviewQuestion) {

                interviewQuestion.textContent =
                    "";

            }

        }
    );

}


// ======================================================
// INITIALIZE APPLICATION
// ======================================================

async function initializeApp() {

    const savedStudentId =
        localStorage.getItem(
            "studentId"
        );


    if (!savedStudentId) {
    
        return;
        await loadResumeReadiness();

    }


    const loaded =
        await loadStudent(
            savedStudentId
        );


    if (!loaded) {

        localStorage.removeItem(
            "studentId"
        );

        return;

    }


    if (roleInput) {

        roleInput.value =
            student.target_role;

    }


    displayStudent();

    await loadSkills();

    updateDashboard();

    displayRequiredSkills();

    displayLearning();

    await loadSkillGap();

    await loadPlacementReadiness();

}


// ======================================================
// START APPLICATION
// ======================================================

initializeApp();
// ========================================
// RESUME READINESS
// ========================================

async function loadResumeReadiness() {

    if (!currentStudentId) {
        return;
    }

    const resumeScore =
        document.getElementById("resumeScore");

    const resumeScoreMessage =
        document.getElementById("resumeScoreMessage");

    const profileCompleted =
        document.getElementById("profileCompleted");

    const educationCompleted =
        document.getElementById("educationCompleted");

    const skillsCompleted =
        document.getElementById("skillsCompleted");

    const projectsCompleted =
        document.getElementById("projectsCompleted");

    const certificationsCompleted =
        document.getElementById("certificationsCompleted");

    const githubCompleted =
        document.getElementById("githubCompleted");

    const linkedinCompleted =
        document.getElementById("linkedinCompleted");

    try {

        const response = await fetch(
            `${API_URL}/api/resume-readiness/${currentStudentId}`
        );

        const data = await response.json();

        if (!data.data) {
            return;
        }

        const resume = data.data;

        profileCompleted.checked =
            resume.profile_completed;

        educationCompleted.checked =
            resume.education_completed;

        skillsCompleted.checked =
            resume.skills_completed;

        projectsCompleted.checked =
            resume.projects_completed;

        certificationsCompleted.checked =
            resume.certifications_completed;

        githubCompleted.checked =
            resume.github_completed;

        linkedinCompleted.checked =
            resume.linkedin_completed;

        resumeScore.textContent =
            `${resume.resume_score}%`;

        if (resume.resume_score >= 80) {

            resumeScoreMessage.textContent =
                "Great! Your resume is highly ready for job applications.";

        } else if (resume.resume_score >= 50) {

            resumeScoreMessage.textContent =
                "Good progress! Complete the remaining sections.";

        } else {

            resumeScoreMessage.textContent =
                "Keep working on your profile to improve your resume readiness.";
        }

        console.log(
            "Resume readiness loaded successfully:",
            resume
        );

    } catch (error) {

        console.error(
            "Error loading resume readiness:",
            error
        );
    }
}


async function updateResumeReadiness() {

    if (!currentStudentId) {

        alert(
            "Please register a student first."
        );

        return;
    }

    const body = {

        profile_completed:
            document.getElementById(
                "profileCompleted"
            ).checked,

        education_completed:
            document.getElementById(
                "educationCompleted"
            ).checked,

        skills_completed:
            document.getElementById(
                "skillsCompleted"
            ).checked,

        projects_completed:
            document.getElementById(
                "projectsCompleted"
            ).checked,

        certifications_completed:
            document.getElementById(
                "certificationsCompleted"
            ).checked,

        github_completed:
            document.getElementById(
                "githubCompleted"
            ).checked,

        linkedin_completed:
            document.getElementById(
                "linkedinCompleted"
            ).checked
    };

    try {

        const response = await fetch(
            `${API_URL}/api/resume-readiness/${currentStudentId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(body)
            }
        );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to update resume readiness."
            );
        }

        document.getElementById(
            "resumeScore"
        ).textContent =
            `${data.data.resume_score}%`;

        alert(
            `Resume readiness updated successfully! Score: ${data.data.resume_score}%`
        );

        console.log(
            "Resume readiness updated:",
            data.data
        );

    } catch (error) {

        console.error(
            "Error updating resume readiness:",
            error
        );

        alert(
            "Failed to update resume readiness."
        );
    }
}

// ===============================
// FINAL RESUME READINESS HANDLER
// ===============================

window.addEventListener("load", function () {

    const updateResumeButton =
        document.getElementById("updateResumeButton");

    if (updateResumeButton) {

        updateResumeButton.onclick = function () {

            console.log("Update Resume button clicked!");

            updateResumeReadiness();

        };

        console.log("Resume button connected successfully!");
    }

    setTimeout(() => {
        loadResumeReadiness();
    }, 500);

    loadPlacementReadiness();

});