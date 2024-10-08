const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");
const { default: slugify } = require("slugify");

router.get('/', async (req, res, next) => {
    try {
        const result = await db.query(`SELECT code, name FROM companies`);
        return res.json({ companies: result.rows })
    } catch (e) {
        return next(e)
    }
});

router.get('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const companyResult = await db.query(`SELECT * FROM companies WHERE code = $1`, [code])
        const invoiceResult = await db.query(`SELECT id FROM invoices WHERE comp_code = $1`, [code]);
        if (result.rows.length === 0) {
            throw new ExpressError(`Can't find company with code of ${code}`, 404)
        }
        const company = companyResult.rows[0];
        const invoices = invoiceResult.rows;

        company.invoices = invoices.map(inv => inv.id);

        return res.json({ 'company': company })

    } catch (e) {
        return next(e)
    }
});

router.post('/', async (req, res, next) => {
    const { name, description } = req.body;
    const code = slugify(name, { lower: true });
    const result = await db.query(`INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description`, [code, name, description]);
    return res.status(201).json({ company: result.rows[0] })
});

router.patch('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const { name, description } = req.body;
        const result = await db.query(`UPDATE companies SET name = $1, description = $2 WHERE code = $3 RETURNING code, name, description`, [name, description, code]);
        if (results.rows.length === 0) {
            throw new ExpressError(`Can't update company with code of ${code}`, 404)
        }
        return res.json({ company: result.rows[0] })
    } catch (e) {
        return next(e)
    }
});

router.delete('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const result = await db.query(`DELETE FROM companies WHERE code = $1`, [code]);
        res.json({ status: 'deleted' });
    } catch (e) {
        return next(e)
    }
});

module.exports = router;