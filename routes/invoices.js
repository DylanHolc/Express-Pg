const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");
const { route } = require("./companies");

router.get('/', async (req, res, next) => {
    try {
        const result = await db.query(`SELECT id, comp_code FROM invoices`);
        return res.json({ invoices: result.rows });
    } catch (e) {
        return next(e)
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await db.query(`SELECT * FROM invoices WHERE id = $1`, [id]);
        if (result.rows.length === 0) {
            throw new ExpressError(`Can't find invoice with id of ${id}`, 404)
        }
        return res.json({ invoice: result.rows[0] })

    } catch (e) {
        return next(e)
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { comp_code, amt } = req.body;
        const result = await db.query(`INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING id, comp_code, amt, paid, add_date, paid_date`, [comp_code, amt]);
        return res.json({ invoice: result.rows[0] })
    } catch (e) {
        return next(e)
    }
});

router.patch('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { amt, paid } = req.body;
        let paidDate = null;
        const paidResult = await db.query(`SELECT paid FROM invoices WHERE id = $1`, [id]);
        if (paidResult.rows.length === 0) {
            throw new ExpressError(`Can't find invoice with id of ${id}`, 404)
        }
        let currPaidDate = paidResult.rows[0].paid_date;
        if (!currPaidDate && paid) {
            paidDate = new Date();
        }
        else if (!paid) {
            paidDate = null;
        }
        else {
            paidDate = currPaidDate;
        }

        const result = await db.query(`UPDATE invoices SET amt = $1, paid = $2, paid_date = $3 WHERE id = $4 RETURNING id, comp_code, amt, paid, add_date, paid_date`, [amt, paid, paidDate, id])
        return res.json({ invoice: result.rows[0] });
    } catch (e) {
        return next(e)
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await db.query(`DELETE FROM invoices WHERE id = $1`, [id]);
        return res.json({ status: 'deleted' })
    } catch (e) {
        return next(e)
    }
});


module.exports = router;