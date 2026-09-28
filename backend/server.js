// ========================================
// IMPORTS
// ========================================

const express = require("express");
const cors = require("cors");

const pool = require("./db");

const app = express();


// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());
app.use(express.json());


// ========================================
// HOME
// ========================================

app.get("/", (req, res) => {

    res.json({
        message: "Student Career Tracker Backend is running!"
    });

});


// ========================================
// STUDENT APIs
// ========================================


// CREATE STUDENT
app.post("/api/students", async (req, res) => {

    try {

        const {
            name,
            email,
            target_role
        } = req.body;


        if (!name || !email || !target_role) {

            return res.status(400).json({
                message: "Name, email and target role are required."
            });

        }


        const result = await pool.query(

            `INSERT INTO students
            (name, email, target_role)
            VALUES ($1, $2, $3)
            RETURNING *`,

            [
                name,
                email,
                target_role
            ]

        );


        res.status(201).json({

            message: "Student registered successfully!",

            student: result.rows[0]

        });


    } catch (error) {

        console.error(
            "Error creating student:",
            error.message
        );


        res.status(500).json({

            message: "Failed to register student."

        });

    }

});


// GET ALL STUDENTS
app.get("/api/students", async (req, res) => {

    try {

        const result = await pool.query(

            `SELECT *
             FROM students
             ORDER BY id DESC`

        );


        res.json(result.rows);


    } catch (error) {

        console.error(
            "Error fetching students:",
            error.message
        );


        res.status(500).json({

            message: "Failed to fetch students."

        });

    }

});


// GET ONE STUDENT
app.get("/api/students/:id", async (req, res) => {

    try {

        const { id } = req.params;


        const result = await pool.query(

            `SELECT *
             FROM students
             WHERE id = $1`,

            [id]

        );


        if (result.rows.length === 0) {

            return res.status(404).json({

                message: "Student not found."

            });

        }


        res.json(result.rows[0]);


    } catch (error) {

        console.error(
            "Error fetching student:",
            error.message
        );


        res.status(500).json({

            message: "Failed to fetch student."

        });

    }

});


// UPDATE STUDENT
app.put("/api/students/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const {
            name,
            email,
            target_role
        } = req.body;


        if (!name || !email || !target_role) {

            return res.status(400).json({

                message:
                    "Name, email and target role are required."

            });

        }


        const result = await pool.query(

            `UPDATE students

             SET
                name = $1,
                email = $2,
                target_role = $3

             WHERE id = $4

             RETURNING *`,

            [
                name,
                email,
                target_role,
                id
            ]

        );


        if (result.rows.length === 0) {

            return res.status(404).json({

                message: "Student not found."

            });

        }


        res.json({

            message: "Student updated successfully!",

            student: result.rows[0]

        });


    } catch (error) {

        console.error(
            "Error updating student:",
            error.message
        );


        res.status(500).json({

            message:
                "Failed to update student."

        });

    }

});


// ========================================
// SKILLS APIs
// ========================================


// ADD SKILL
app.post("/api/skills", async (req, res) => {

    try {

        const {
            student_id,
            skill_name,
            progress
        } = req.body;


        if (
            !student_id ||
            !skill_name ||
            progress === undefined
        ) {

            return res.status(400).json({

                message:
                    "Student ID, skill name and progress are required."

            });

        }


        const result = await pool.query(

            `INSERT INTO skills
            (student_id, skill_name, progress)

            VALUES ($1, $2, $3)

            RETURNING *`,

            [
                student_id,
                skill_name,
                progress
            ]

        );


        res.status(201).json({

            message:
                "Skill added successfully!",

            skill:
                result.rows[0]

        });


    } catch (error) {

        console.error(
            "Error adding skill:",
            error.message
        );


        res.status(500).json({

            message:
                "Failed to add skill."

        });

    }

});


// GET SKILLS FOR ONE STUDENT
app.get("/api/skills/:student_id", async (req, res) => {

    try {

        const {
            student_id
        } = req.params;


        const result = await pool.query(

            `SELECT *

             FROM skills

             WHERE student_id = $1

             ORDER BY id DESC`,

            [student_id]

        );


        res.json(result.rows);


    } catch (error) {

        console.error(
            "Error fetching skills:",
            error.message
        );


        res.status(500).json({

            message:
                "Failed to fetch skills."

        });

    }

});


// UPDATE SKILL
app.put("/api/skills/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const {
            skill_name,
            progress
        } = req.body;


        if (
            !skill_name ||
            progress === undefined
        ) {

            return res.status(400).json({

                message:
                    "Skill name and progress are required."

            });

        }


        const result = await pool.query(

            `UPDATE skills

             SET
                skill_name = $1,
                progress = $2

             WHERE id = $3

             RETURNING *`,

            [
                skill_name,
                progress,
                id
            ]

        );


        if (result.rows.length === 0) {

            return res.status(404).json({

                message:
                    "Skill not found."

            });

        }


        res.json({

            message:
                "Skill updated successfully!",

            skill:
                result.rows[0]

        });


    } catch (error) {

        console.error(
            "Error updating skill:",
            error.message
        );


        res.status(500).json({

            message:
                "Failed to update skill."

        });

    }

});


// DELETE SKILL
app.delete("/api/skills/:id", async (req, res) => {

    try {

        const { id } = req.params;


        const result = await pool.query(

            `DELETE FROM skills

             WHERE id = $1

             RETURNING *`,

            [id]

        );


        if (result.rows.length === 0) {

            return res.status(404).json({

                message:
                    "Skill not found."

            });

        }


        res.json({

            message:
                "Skill deleted successfully!",

            skill:
                result.rows[0]

        });


    } catch (error) {

        console.error(
            "Error deleting skill:",
            error.message
        );


        res.status(500).json({

            message:
                "Failed to delete skill."

        });

    }

});


// ========================================
// SKILL GAP ANALYSIS API
// ========================================

app.get("/api/skill-gap/:student_id", async (req, res) => {

    try {

        const { student_id } = req.params;


        // Get student details
        const studentResult = await pool.query(

            `SELECT *
             FROM students
             WHERE id = $1`,

            [student_id]

        );


        if (studentResult.rows.length === 0) {

            return res.status(404).json({

                message:
                    "Student not found."

            });

        }


        const student =
            studentResult.rows[0];


        // Required skills for each target role
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
                "Express",
                "SQL",
                "PostgreSQL"
            ],

            "Python Developer": [
                "Python",
                "SQL",
                "Pandas",
                "Git"
            ],

            "Data Analyst": [
                "Python",
                "SQL",
                "Excel",
                "Power BI",
                "Statistics",
                "Pandas"
            ]

        };


        const requiredSkills =
            roleSkills[student.target_role] || [];


        // Get student's current skills
        const skillsResult = await pool.query(

            `SELECT
                skill_name,
                progress

             FROM skills

             WHERE student_id = $1`,

            [student_id]

        );


        const studentSkills =
            skillsResult.rows;


        // Compare required skills
        const skillGaps =
            requiredSkills.map(skill => {

                const foundSkill =
                    studentSkills.find(

                        item =>
                            item.skill_name.toLowerCase() ===
                            skill.toLowerCase()

                    );


                const progress =
                    foundSkill
                        ? Number(foundSkill.progress)
                        : 0;


                let status;


                if (progress === 100) {

                    status = "Completed";

                } else if (progress > 0) {

                    status = "Needs Improvement";

                } else {

                    status = "Not Started";

                }


                return {

                    skill: skill,

                    progress: progress,

                    status: status

                };

            });


        res.json({

            student:
                student.name,

            target_role:
                student.target_role,

            skill_gaps:
                skillGaps

        });


    } catch (error) {

        console.error(

            "Error analyzing skill gaps:",

            error.message

        );


        res.status(500).json({

            message:
                "Failed to analyze skill gaps."

        });

    }

});


// ========================================
// PLACEMENT READINESS REPORT API
// ========================================

app.get("/api/placement-readiness/:student_id", async (req, res) => {

    try {

        const { student_id } = req.params;


        // Get student details
        const studentResult = await pool.query(

            `SELECT *
             FROM students
             WHERE id = $1`,

            [student_id]

        );


        if (studentResult.rows.length === 0) {

            return res.status(404).json({

                message:
                    "Student not found."

            });

        }


        const student =
            studentResult.rows[0];


        // Required skills for each target role
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
                "Express",
                "SQL",
                "PostgreSQL"
            ],

            "Python Developer": [
                "Python",
                "SQL",
                "Pandas",
                "Git"
            ],

            "Data Analyst": [
                "Python",
                "SQL",
                "Excel",
                "Power BI",
                "Statistics",
                "Pandas"
            ]

        };


        const requiredSkills =
            roleSkills[student.target_role] || [];


        // Get student's current skills
        const skillsResult = await pool.query(

            `SELECT
                skill_name,
                progress

             FROM skills

             WHERE student_id = $1`,

            [student_id]

        );


        const studentSkills =
            skillsResult.rows;


        // Calculate progress
        const readinessData =
            requiredSkills.map(skill => {

                const foundSkill =
                    studentSkills.find(

                        item =>
                            item.skill_name.toLowerCase() ===
                            skill.toLowerCase()

                    );


                const progress =
                    foundSkill
                        ? Number(foundSkill.progress)
                        : 0;


                return {

                    skill:
                        skill,

                    progress:
                        progress

                };

            });


        // ========================================
        // OVERALL READINESS
        // ========================================

        const totalRequiredSkills =
            readinessData.length;


        const totalProgress =
            readinessData.reduce(

                (sum, item) =>
                    sum + item.progress,

                0

            );


        const overallReadiness =
            totalRequiredSkills > 0

                ? Math.round(

                    totalProgress /
                    (totalRequiredSkills * 100) *
                    100

                )

                : 0;


        // ========================================
        // SKILL CATEGORIES
        // ========================================

        const completedSkills =
            readinessData.filter(

                item =>
                    item.progress === 100

            );


        const inProgressSkills =
            readinessData.filter(

                item =>
                    item.progress > 0 &&
                    item.progress < 100

            );


        const notStartedSkills =
            readinessData.filter(

                item =>
                    item.progress === 0

            );


        // ========================================
        // PRIORITY SKILLS
        // ========================================

        const prioritySkills =
            readinessData

                .filter(

                    item =>
                        item.progress < 100

                )

                .sort(

                    (a, b) =>
                        a.progress - b.progress

                );


        // ========================================
        // PLACEMENT READINESS REPORT
        // ========================================

        res.json({

            student:
                student.name,

            target_role:
                student.target_role,

            overall_readiness:
                overallReadiness,

            total_required_skills:
                totalRequiredSkills,

            completed_count:
                completedSkills.length,

            in_progress_count:
                inProgressSkills.length,

            not_started_count:
                notStartedSkills.length,

            completed_skills:
                completedSkills,

            in_progress_skills:
                inProgressSkills,

            not_started_skills:
                notStartedSkills,

            priority_skills:
                prioritySkills

        });


    } catch (error) {

        console.error(

            "Error generating placement readiness report:",

            error.message

        );


        res.status(500).json({

            message:
                "Failed to generate placement readiness report."

        });

    }

});


// ========================================
// INTERVIEW PREPARATION API
// ========================================


// GET INTERVIEW QUESTIONS
app.get("/api/interview-questions", async (req, res) => {

    try {

        const {
            target_role,
            interview_type
        } = req.query;


        let query = `
            SELECT
                id,
                target_role,
                interview_type,
                question,
                difficulty
            FROM interview_questions
        `;


        const values = [];

        const conditions = [];


        // Filter by target role
        if (target_role) {

            values.push(target_role);

            conditions.push(
                `target_role = $${values.length}`
            );

        }


        // Filter by interview type
        if (interview_type) {

            values.push(interview_type);

            conditions.push(
                `interview_type = $${values.length}`
            );

        }


        // Add WHERE conditions
        if (conditions.length > 0) {

            query +=
                ` WHERE ${conditions.join(" AND ")}`;

        }


        query += `
            ORDER BY id ASC
        `;


        const result =
            await pool.query(query, values);


        res.json({

            success: true,

            count:
                result.rows.length,

            questions:
                result.rows

        });


    } catch (error) {

        console.error(

            "Error fetching interview questions:",

            error.message

        );


        res.status(500).json({

            success: false,

            message:
                "Failed to fetch interview questions."

        });

    }

});


// ========================================
// START SERVER
// ========================================
;

// ========================================
// RESUME READINESS API
// ========================================

app.get("/api/resume-readiness/:student_id", async (req, res) => {

    try {

        const { student_id } = req.params;

        const result = await pool.query(
            `
            SELECT
                id,
                student_id,
                profile_completed,
                education_completed,
                skills_completed,
                projects_completed,
                certifications_completed,
                github_completed,
                linkedin_completed,
                resume_score,
                created_at,
                updated_at
            FROM resume_readiness
            WHERE student_id = $1
            `,
            [student_id]
        );

        if (result.rows.length === 0) {

            return res.json({
                success: true,
                message: "Resume readiness record not found.",
                data: null
            });

        }

        res.json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {

        console.error(
            "Error fetching resume readiness:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch resume readiness."
        });

    }

});
// ========================================
// CREATE RESUME READINESS RECORD
// ========================================

app.post("/api/resume-readiness/:student_id", async (req, res) => {

    try {

        const { student_id } = req.params;

        const result = await pool.query(
            `
            INSERT INTO resume_readiness (student_id)
            VALUES ($1)
            RETURNING *
            `,
            [student_id]
        );

        res.status(201).json({
            success: true,
            message: "Resume readiness record created successfully.",
            data: result.rows[0]
        });

    } catch (error) {

        console.error(
            "Error creating resume readiness:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Failed to create resume readiness record."
        });

    }

});
// ========================================
// UPDATE RESUME READINESS
// ========================================

app.put("/api/resume-readiness/:student_id", async (req, res) => {

    try {

        const { student_id } = req.params;

        const {
            profile_completed,
            education_completed,
            skills_completed,
            projects_completed,
            certifications_completed,
            github_completed,
            linkedin_completed
        } = req.body;


        const resume_score =
            (
                Number(profile_completed) +
                Number(education_completed) +
                Number(skills_completed) +
                Number(projects_completed) +
                Number(certifications_completed) +
                Number(github_completed) +
                Number(linkedin_completed)
            ) * 100 / 7;


        const result = await pool.query(

            `
            UPDATE resume_readiness

            SET
                profile_completed = $1,
                education_completed = $2,
                skills_completed = $3,
                projects_completed = $4,
                certifications_completed = $5,
                github_completed = $6,
                linkedin_completed = $7,
                resume_score = $8,
                updated_at = CURRENT_TIMESTAMP

            WHERE student_id = $9

            RETURNING *
            `,

            [
                profile_completed,
                education_completed,
                skills_completed,
                projects_completed,
                certifications_completed,
                github_completed,
                linkedin_completed,
                Math.round(resume_score),
                student_id
            ]

        );


        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Resume readiness record not found."

            });

        }


        res.json({

            success: true,

            message:
                "Resume readiness updated successfully.",

            data:
                result.rows[0]

        });


    } catch (error) {

        console.error(
            "Error updating resume readiness:",
            error.message
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to update resume readiness."

        });

    }

});


// ========================================
// START SERVER
// ========================================

const PORT = 5000;

app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});