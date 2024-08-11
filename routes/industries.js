const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");

router.post('/', async (req, res, next) => {
    try {
        const { indCode, industry } = req.body;
        const result = await db.query(`INSERT INTO industries (indCode, industry) VALUES ($1, $2) RETURNING indCode, industry`, [indCode, industry])
        return res.statusCode(201).json({ 'industry': result.rows[0] });
    } catch (e) {
        return next(e)
    }
})
