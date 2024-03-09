import { describe, it } from "node:test";
import App from '../app.js';
import assert from "node:assert";

describe('App test', {}, () => {
    it('Returns the expected value when ran', {}, () => {
        const actual = App();
        const expected = ('hello world');
        assert.strictEqual(actual, expected);
    });
});