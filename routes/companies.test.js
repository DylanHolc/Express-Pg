process.env.NODE_ENV = 'test';

const request = require('supertest')
const app = require('../app');
const db = require('../db');

let testCompany;

beforeEach(async () => {
    const result = await db.query(`INSERT INTO companies (code, name, description) VALUES ('ms', 'Microsoft', 'World leader in software development') RETURNING code, name, description`)
    testCompany = result.rows[0];
});

describe('Testing Default', () => {
    test('should work', () => {
        console.log(testCompany);
        expect(1).toBe(1);
    })
})