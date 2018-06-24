/*globals jasmine*/

jasmine.VERBOSE = true;

require('jasmine-reporters');

const reporters = require('jasmine-reporters');
const junitReporter = new reporters.JUnitXmlReporter({
    savePath: __dirname + '/target/',
    consolidateAll: false,
});
jasmine.getEnv().addReporter(junitReporter);
