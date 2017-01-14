/**jshint esversion: 6 */

module.exports = {
    OUTPUT: function(content) {
        console.log('\n');
        console.log('--------------------------------------');
        console.log.apply(console, arguments);
        console.log('--------------------------------------');
    },
    LOG: function() {
        return console.log.apply(console, arguments);
    }
};
