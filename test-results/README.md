
# Producing Test Suite Reports

All browser test results must be named following the pattern `/^\w\w\d\d\.json$/`.

When adding or updating a browser test result set, you need to run `node consolidate.js`. This will
produce the `consolidated.json` file which is the basis for all the reports.

To produce the `less-than-2.html` report, run `node less-than-2.js`.

To produce the `all.html` report, run `node all.js`.
