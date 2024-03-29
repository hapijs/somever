// Portions of the tests are based on https://github.com/npm/node-semver
// node-semver is published under the ISC license, copyright (c) Isaac Z. Schlueter and Contributors

'use strict';

const Lab = require('@hapi/lab');
const Code = require('@hapi/code');
const Somever = require('..');


const internals = {};


const { describe, it } = exports.lab = Lab.script();
const expect = Code.expect;


describe('match()', () => {

    it('matches version within range', () => {

        const tests = [
            ['1.0.0 - 2.0.0', '1.2.3'],
            ['^1.2.3+build', '1.2.3'],
            ['^1.2.3+build', '1.3.0'],
            ['1.2.3-pre+asdf - 2.4.3-pre+asdf', '1.2.3'],
            ['1.2.3pre+asdf - 2.4.3-pre+asdf', '1.2.3'],
            ['1.2.3-pre+asdf - 2.4.3pre+asdf', '1.2.3'],
            ['1.2.3pre+asdf - 2.4.3pre+asdf', '1.2.3'],
            ['1.2.3-pre+asdf - 2.4.3-pre+asdf', '1.2.3-pre.2'],
            ['1.2.3-pre+asdf - 2.4.3-pre+asdf', '2.4.3-alpha'],
            ['1.2.3+asdf - 2.4.3+asdf', '1.2.3'],
            ['1.0.0', '1.0.0'],
            ['>=*', '0.2.4'],
            ['', '1.0.0'],
            ['*', '1.2.3'],
            ['*', 'v1.2.3'],
            ['>=1.0.0', '1.0.1'],
            ['>=1.0.0', '1.1.0'],
            ['>1.0.0', '1.0.1'],
            ['>1.0.0', '1.1.0'],
            ['<=2.0.0', '2.0.0'],
            ['<=2.0.0', '1.9999.9999'],
            ['<=2.0.0', '0.2.9'],
            ['<2.0.0', '1.9999.9999'],
            ['<2.0.0', '0.2.9'],
            ['>= 1.0.0', '1.0.0'],
            ['>=  1.0.0', '1.0.1'],
            ['>=   1.0.0', '1.1.0'],
            ['> 1.0.0', '1.0.1'],
            ['>  1.0.0', '1.1.0'],
            ['<=   2.0.0', '2.0.0'],
            ['<= 2.0.0', '1.9999.9999'],
            ['<=  2.0.0', '0.2.9'],
            ['<    2.0.0', '1.9999.9999'],
            ['<\t2.0.0', '0.2.9'],
            ['>=0.1.97', 'v0.1.97'],
            ['>=0.1.97', '0.1.97'],
            ['0.1.20 || 1.2.4', '1.2.4'],
            ['>=0.2.3 || <0.0.1', '0.0.0'],
            ['>=0.2.3 || <0.0.1', '0.2.3'],
            ['>=0.2.3 || <0.0.1', '0.2.4'],
            ['||', '1.3.4'],
            ['2.x.x', '2.1.3'],
            ['1.2.x', '1.2.3'],
            ['1.2.x || 2.x', '2.1.3'],
            ['1.2.x || 2.x', '1.2.3'],
            ['x', '1.2.3'],
            ['2.*.*', '2.1.3'],
            ['1.2.*', '1.2.3'],
            ['1.2.* || 2.*', '2.1.3'],
            ['1.2.* || 2.*', '1.2.3'],
            ['*', '1.2.3'],
            ['2', '2.1.2'],
            ['2.3', '2.3.1'],
            ['~x', '0.0.9'],
            ['~2', '2.0.9'],
            ['~2.4', '2.4.0'],
            ['~2.4', '2.4.5'],
            ['~>3.2.1', '3.2.2'],
            ['~1', '1.2.3'],
            ['~>1', '1.2.3'],
            ['~> 1', '1.2.3'],
            ['~1.0', '1.0.2'],
            ['~ 1.0', '1.0.2'],
            ['~ 1.0.3', '1.0.12'],
            ['>=1', '1.0.0'],
            ['>= 1', '1.0.0'],
            ['<1.2', '1.1.1'],
            ['< 1.2', '1.1.1'],
            ['~v0.5.4-pre', '0.5.5'],
            ['~v0.5.4-pre', '0.5.4'],
            ['=0.7.x', '0.7.2'],
            ['<=0.7.x', '0.7.2'],
            ['>=0.7.x', '0.7.2'],
            ['<=0.7.x', '0.6.2'],
            ['~1.2.1 >=1.2.3', '1.2.3'],
            ['~1.2.1 =1.2.3', '1.2.3'],
            ['~1.2.1 1.2.3', '1.2.3'],
            ['~1.2.1 >=1.2.3 1.2.3', '1.2.3'],
            ['~1.2.1 1.2.3 >=1.2.3', '1.2.3'],
            ['~1.2.1 1.2.3', '1.2.3'],
            ['>=1.2.1 1.2.3', '1.2.3'],
            ['1.2.3 >=1.2.1', '1.2.3'],
            ['>=1.2.3 >=1.2.1', '1.2.3'],
            ['>=1.2.1 >=1.2.3', '1.2.3'],
            ['>=1.2', '1.2.8'],
            ['^1.2.3', '1.8.1'],
            ['^0.1.2', '0.1.2'],
            ['^0.1', '0.1.2'],
            ['^0.0.1', '0.0.1'],
            ['^1.2', '1.4.2'],
            ['^1.2 ^1', '1.4.2'],
            ['^1.2.3-alpha', '1.2.3-pre'],
            ['^1.2.0-alpha', '1.2.0-pre'],
            ['^0.0.1-alpha', '0.0.1-beta'],
            ['^0.1.1-alpha', '0.1.1-beta'],
            ['^x', '1.2.3'],
            ['x - 1.0.0', '0.9.7'],
            ['x - 1.x', '0.9.7'],
            ['1.0.0 - x', '1.9.7'],
            ['1.x - x', '1.9.7'],
            ['<=7.x', '7.9.9'],
            ['2.x', '2.0.0-pre.0', { includePrerelease: true }],
            ['2.x', '2.1.0-pre.0', { includePrerelease: true }],
            ['1.1.x', '1.1.0-a', { includePrerelease: true }],
            ['1.1.x', '1.1.1-a', { includePrerelease: true }],
            ['*', '1.0.0-rc1', { includePrerelease: true }],
            ['^1.0.0-0', '1.0.1-rc1', { includePrerelease: true }],
            ['^1.0.0-rc2', '1.0.1-rc1', { includePrerelease: true }],
            ['^1.0.0', '1.0.1-rc1', { includePrerelease: true }],
            ['^1.0.0', '1.1.0-rc1', { includePrerelease: true }],
            ['1 - 2', '2.0.0-pre', { includePrerelease: true }],
            ['1 - 2', '1.0.0-pre', { includePrerelease: true }],
            ['1.0 - 2', '1.0.0-pre', { includePrerelease: true }],
            ['=0.7.x', '0.7.0-asdf', { includePrerelease: true }],
            ['>=0.7.x', '0.7.0-asdf', { includePrerelease: true }],
            ['<=0.7.x', '0.7.0-asdf', { includePrerelease: true }],
            ['>=1.0.0 <=1.1.0', '1.1.0-pre', { includePrerelease: true }]
        ];

        for (const test of tests) {
            const match = Somever.match(test[1], test[0], test[2]);
            if (!match) {
                console.log(test);
            }

            expect(match).to.be.true();

            // All tests that match without includePrerelease should also match with includePrerelease

            if (!test[2]?.includePrerelease) {
                const matchPre = Somever.match(test[1], test[0], { ...test[2], includePrerelease: true });
                if (!matchPre) {
                    console.log('with includePrerelease', test);
                }

                expect(matchPre).to.be.true();
            }
        }
    });

    it('fails to match version outside of range', () => {

        const tests = [
            ['1.0.0 - 2.0.0', '2.2.3'],
            ['1.2.3+asdf - 2.4.3+asdf', '1.2.3-pre.2'],
            ['1.2.3+asdf - 2.4.3+asdf', '2.4.3-alpha'],
            ['^1.2.3+build', '2.0.0'],
            ['^1.2.3+build', '1.2.0'],
            ['^1.2.3', '1.2.3-pre'],
            ['^1.2', '1.2.0-pre'],
            ['>1.2', '1.3.0-beta'],
            ['<=1.2.3', '1.2.3-beta'],
            ['^1.2.3', '1.2.3-beta'],
            ['=0.7.x', '0.7.0-asdf'],
            ['>=0.7.x', '0.7.0-asdf'],
            ['1', '1.0.0beta'],
            ['<1', '1.0.0beta'],
            ['< 1', '1.0.0beta'],
            ['1.0.0', '1.0.1'],
            ['>=1.0.0', '0.0.0'],
            ['>=1.0.0', '0.0.1'],
            ['>=1.0.0', '0.1.0'],
            ['>1.0.0', '0.0.1'],
            ['>1.0.0', '0.1.0'],
            ['<=2.0.0', '3.0.0'],
            ['<=2.0.0', '2.9999.9999'],
            ['<=2.0.0', '2.2.9'],
            ['<2.0.0', '2.9999.9999'],
            ['<2.0.0', '2.2.9'],
            ['>=0.1.97', 'v0.1.93'],
            ['>=0.1.97', '0.1.93'],
            ['0.1.20 || 1.2.4', '1.2.3'],
            ['>=0.2.3 || <0.0.1', '0.0.3'],
            ['>=0.2.3 || <0.0.1', '0.2.2'],
            ['2.x.x', '1.1.3'],
            ['2.x.x', '3.1.3'],
            ['1.2.x', '1.3.3'],
            ['1.2.x || 2.x', '3.1.3'],
            ['1.2.x || 2.x', '1.1.3'],
            ['2.*.*', '1.1.3'],
            ['2.*.*', '3.1.3'],
            ['1.2.*', '1.3.3'],
            ['1.2.* || 2.*', '3.1.3'],
            ['1.2.* || 2.*', '1.1.3'],
            ['2', '1.1.2'],
            ['2.3', '2.4.1'],
            ['~2.4', '2.5.0'],
            ['~2.4', '2.3.9'],
            ['~>3.2.1', '3.3.2'],
            ['~>3.2.1', '3.2.0'],
            ['~1', '0.2.3'],
            ['~>1', '2.2.3'],
            ['~1.0', '1.1.0'],
            ['<1', '1.0.0'],
            ['>=1.2', '1.1.1'],
            ['1', '2.0.0beta'],
            ['~v0.5.4-beta', '0.5.4-alpha'],
            ['=0.7.x', '0.8.2'],
            ['>=0.7.x', '0.6.2'],
            ['<0.7.x', '0.7.2'],
            ['<1.2.3', '1.2.3-beta'],
            ['=1.2.3', '1.2.3-beta'],
            ['>1.2', '1.2.8'],
            ['^0.0.1', '0.0.2'],
            ['^1.2.3', '2.0.0-alpha'],
            ['^1.2.3', '1.2.2'],
            ['^1.2', '1.1.9'],
            ['^0.1.0', '0.2.0'],
            ['*', 'v1.2.3-foo'],
            ['%1.2.3', '1.2.3'],
            ['2.2.0', '2.2.0-pre.0', { includePrerelease: true }],
            ['2.x', '3.0.0-pre.0', { includePrerelease: true }],
            ['^1.0.0', '1.0.0-rc1', { includePrerelease: true }],
            ['^1.0.0', '2.0.0-rc1', { includePrerelease: true }],
            ['^1.2.3-rc2', '2.0.0', { includePrerelease: true }],
            ['1 - 2', '3.0.0-pre', { includePrerelease: true }],
            ['1.1.x', '1.2.0-a', { includePrerelease: true }],
            ['1.1.x', '1.0.0-a', { includePrerelease: true }],
            ['1.x', '0.0.0-a', { includePrerelease: true }],
            ['1.x', '2.0.0-a', { includePrerelease: true }],
            ['>=1.0.0 <1.1.0', '1.1.0', { includePrerelease: true }]
        ];

        for (const test of tests) {
            const match = Somever.match(test[1], test[0], test[2]);
            if (match) {
                console.log(test);
            }

            expect(match).to.be.false();

            // All tests that don't match with includePrerelease should also not match without includePrerelease

            if (test[2]?.includePrerelease) {
                const matchPre = Somever.match(test[1], test[0], { ...test[2], includePrerelease: false });
                if (matchPre) {
                    console.log('without includePrerelease', test);
                }

                expect(matchPre).to.be.false();
            }
        }
    });
});

describe('Version', () => {

    it('builds version from object', () => {

        const version = Somever.version({ prerelease: [1], build: ['abc'] });
        expect(version.version).to.equal('x.x.x-1+abc');
    });

    it('default missing object values to wildcards', () => {

        const version = Somever.version({});
        expect(version.version).to.equal('x.x.x');
        expect(version.prerelease).to.equal([]);
        expect(version.build).to.equal([]);
    });

    it('converts to string', () => {

        const version = Somever.version({ prerelease: [1], build: ['abc'] });
        expect(`${version}`).to.equal('x.x.x-1+abc');
    });

    describe('_parse()', () => {

        it('throws on invalid version string', () => {

            expect(() => Somever.version('a.b.c')).to.throw();
            expect(() => Somever.version('1.b.c')).to.throw();
            expect(() => Somever.version('1.2.3.4')).to.throw();
            expect(() => Somever.version('1.2.3-+')).to.throw();
        });

        it('throws on invalid version string (strict)', () => {

            expect(() => Somever.version('01.02.03')).to.not.throw();
            expect(() => Somever.version('01.02.03', { strict: true })).to.throw();

            expect(() => Somever.version('1.2.3-x$')).to.not.throw();
            expect(() => Somever.version('1.2.3-x$', { strict: true })).to.throw();
        });
    });

    describe('format()', () => {

        it('marks as wildcard only when all digits are wildcards', () => {

            expect(Somever.version('1.x.x').wildcard).to.be.false();
            expect(Somever.version('x.1.x').wildcard).to.be.false();
            expect(Somever.version('x.x.1').wildcard).to.be.false();
            expect(Somever.version('x.x.x').wildcard).to.be.true();
            expect(Somever.version('x.x.x-1').wildcard).to.be.false();
        });
    });

    describe('compare()', () => {

        it('ignores prerelease bias rules when comparison does not include a range', () => {

            expect(Somever.version('1.1.2-bis').compare('1.1.2')).to.equal(-1);
        });

        it('treats wildcard as a match for anything', () => {

            expect(Somever.version('1.x.x').compare('1.1.2')).to.equal(0);
            expect(Somever.version('x.1.1').compare('2.1.1')).to.equal(0);
            expect(Somever.version('1.1.x').compare('1.1.1')).to.equal(0);
            expect(Somever.version('1.x.1').compare('1.3.1')).to.equal(0);
        });

        it('compares prereleases', () => {

            expect(Somever.version('1.1.2-bis.z.1.3').compare('1.1.2-bis.z.1.3')).to.equal(0);
            expect(Somever.version('1.1.2-bis.z.1.3').compare('1.1.2-bis.z.1.3.4')).to.equal(-1);
            expect(Somever.version('1.1.2-bis.z.1.3').compare('1.1.2-bis.z.1.3.4.5')).to.equal(-1);
            expect(Somever.version('1.1.2-bis.z.1.3.4').compare('1.1.2-bis.z.1.3')).to.equal(1);
            expect(Somever.version('1.1.2-bis.z.1.3').compare('1.1.2-bis.z.1.4')).to.equal(-1);
            expect(Somever.version('1.1.2-bis.1.3').compare('1.1.2-bis.1.z')).to.equal(-1);
            expect(Somever.version('1.1.2-bis.1.z').compare('1.1.2-bis.1.3')).to.equal(1);
        });
    });
});

describe('compare()', () => {

    it('ignores prerelease bias rules when comparison does not include a range', () => {

        expect(Somever.compare('1.1.2-bis', '1.1.2')).to.equal(-1);
    });

    it('treats wildcard as a match for anything', () => {

        expect(Somever.compare('1.x.x', '1.1.2')).to.equal(0);
        expect(Somever.compare('x.1.1', '2.1.1')).to.equal(0);
        expect(Somever.compare('1.1.x', '1.1.1')).to.equal(0);
        expect(Somever.compare('1.x.1', '1.3.1')).to.equal(0);
        expect(Somever.compare('1.1.x', '1.1.2-pre', { includePrerelease: true })).to.equal(0);
        expect(Somever.compare('1.1.x', '1.1.2-pre', { includePrerelease: false })).to.equal(1);
        expect(Somever.compare('1.1.0', '1.1.x-pre', { includePrerelease: true })).to.equal(1);
        expect(Somever.compare('1.1.0', '1.1.x-pre', { includePrerelease: false })).to.equal(1);
    });

    it('compares prereleases', () => {

        expect(Somever.compare('1.1.2-bis.z.1.3', '1.1.2-bis.z.1.3')).to.equal(0);
        expect(Somever.compare('1.1.2-bis.z.1.3', '1.1.2-bis.z.1.3.4')).to.equal(-1);
        expect(Somever.compare('1.1.2-bis.z.1.3', '1.1.2-bis.z.1.3.4.5')).to.equal(-1);
        expect(Somever.compare('1.1.2-bis.z.1.3.4', '1.1.2-bis.z.1.3')).to.equal(1);
        expect(Somever.compare('1.1.2-bis.z.1.3', '1.1.2-bis.z.1.4')).to.equal(-1);
        expect(Somever.compare('1.1.2-bis.1.3', '1.1.2-bis.1.z')).to.equal(-1);
        expect(Somever.compare('1.1.2-bis.1.z', '1.1.2-bis.1.3')).to.equal(1);
        expect(Somever.compare('1.1.2-bis.z.1.1', '1.1.2-bis.z.1.10')).to.equal(-1);
        expect(Somever.compare('1.1.2-bis.z.1.10', '1.1.2-bis.z.1.1')).to.equal(1);
        expect(Somever.compare('1.1.2-bis.z.1.3', '1.1.2-bis.z.1.10')).to.equal(-1);
        expect(Somever.compare('1.1.2-bis.z.1.10', '1.1.2-bis.z.1.3')).to.equal(1);
    });
});

describe('Range', () => {

    it('creates dynamic rules', () => {

        const range = Somever.range();
        range.above('2.4.5').below('3.2.3');

        expect(range.match('3.2.3')).to.be.false();
        expect(range.match('3.2.2')).to.be.true();
        expect(range.match('2.4.5')).to.be.false();
        expect(range.match('2.4.6')).to.be.true();
    });

    it('validates valid ranges', () => {

        const tests = [
            ['1.0.0 - 2.0.0', '>=1.0.0 <=2.0.0'],
            ['1.0.0', '1.0.0'],
            ['>=*', '*'],
            ['', '*'],
            ['*', '*'],
            ['*', '*'],
            ['>=1.0.0', '>=1.0.0'],
            ['>1.0.0', '>1.0.0'],
            ['<=2.0.0', '<=2.0.0'],
            ['1', '1.x.x'],
            ['<=2.0.0', '<=2.0.0'],
            ['<=2.0.0', '<=2.0.0'],
            ['<2.0.0', '<2.0.0'],
            ['<2.0.0', '<2.0.0'],
            ['>= 1.0.0', '>=1.0.0'],
            ['>=  1.0.0', '>=1.0.0'],
            ['>=   1.0.0', '>=1.0.0'],
            ['> 1.0.0', '>1.0.0'],
            ['>  1.0.0', '>1.0.0'],
            ['<=   2.0.0', '<=2.0.0'],
            ['<= 2.0.0', '<=2.0.0'],
            ['<=  2.0.0', '<=2.0.0'],
            ['<    2.0.0', '<2.0.0'],
            ['<\t2.0.0', '<2.0.0'],
            ['>=0.1.97', '>=0.1.97'],
            ['>=0.1.97', '>=0.1.97'],
            ['0.1.20 || 1.2.4', '0.1.20||1.2.4'],
            ['>=0.2.3 || <0.0.1', '>=0.2.3||<0.0.1'],
            ['>=0.2.3 || <0.0.1', '>=0.2.3||<0.0.1'],
            ['>=0.2.3 || <0.0.1', '>=0.2.3||<0.0.1'],
            ['||', '*'],
            ['2.x.x', '2.x.x'],
            ['1.2.x', '1.2.x'],
            ['1.2.x || 2.x', '1.2.x||2.x.x'],
            ['x', '*'],
            ['2.*.*', '2.x.x'],
            ['1.2.*', '1.2.x'],
            ['1.2.* || 2.*', '1.2.x||2.x.x'],
            ['*', '*'],
            ['2', '2.x.x'],
            ['2.3', '2.3.x'],
            ['~2.4', '>=2.4.x <2.5.0-0'],
            ['~>3.2.1', '>=3.2.1 <3.3.0-0'],
            ['~1', '>=1.x.x <2.0.0-0'],
            ['~>1', '>=1.x.x <2.0.0-0'],
            ['~> 1', '>=1.x.x <2.0.0-0'],
            ['~1.0', '>=1.0.x <1.1.0-0'],
            ['~ 1.0', '>=1.0.x <1.1.0-0'],
            ['^0', '>=0.x.x <1.0.0-0'],
            ['^ 1', '>=1.x.x <2.0.0-0'],
            ['^0.1', '>=0.1.x <0.2.0-0'],
            ['^1.0', '>=1.0.x <2.0.0-0'],
            ['^1.2', '>=1.2.x <2.0.0-0'],
            ['^0.0.1', '>=0.0.1 <0.0.2-0'],
            ['^0.0.1-beta', '>=0.0.1-beta <0.0.2-0'],
            ['^0.1.2', '>=0.1.2 <0.2.0-0'],
            ['^1.2.3', '>=1.2.3 <2.0.0-0'],
            ['^1.2.3-beta.4', '>=1.2.3-beta.4 <2.0.0-0'],
            ['<1', '<1.x.x'],
            ['< 1', '<1.x.x'],
            ['>=1', '>=1.x.x'],
            ['>= 1', '>=1.x.x'],
            ['<1.2', '<1.2.x'],
            ['< 1.2', '<1.2.x'],
            ['>01.02.03', '>1.2.3'],
            ['~1.2.3beta', '>=1.2.3-beta <1.3.0-0'],
            ['^ 1.2 ^ 1', '>=1.2.x <2.0.0-0 >=1.x.x <2.0.0-0']
        ];

        for (const test of tests) {
            const range = Somever.range(test[0]);
            expect(range.toString()).to.equal(test[1]);
        }
    });

    it('errors on invalid range', () => {

        expect(() => Somever.range('%1.2.3')).to.throw('Invalid range: "%1.2.3" because: Invalid version string format: %1.2.3');
    });

    describe('or', () => {

        it('creates or statements', () => {

            const range = Somever.range();
            range.equal('2.4.5').or.above('3.2.3');

            expect(range.match('3.2.3')).to.be.false();
            expect(range.match('3.2.4')).to.be.true();
            expect(range.match('2.4.5')).to.be.true();
            expect(range.match('2.4.6')).to.be.false();
        });
    });

    describe('minor()', () => {

        it('treats wildcard major as exact match', () => {

            const range = Somever.range().minor('x.1.2');
            expect(range.match('3.2.3')).to.be.false();
            expect(range.match('3.1.2')).to.be.true();
        });
    });

    describe('compatible()', () => {

        it('treats wildcard major as exact match', () => {

            const range = Somever.range().compatible('x.1.2');
            expect(range.match('3.2.3')).to.be.false();
            expect(range.match('3.1.2')).to.be.true();
        });
    });
});
