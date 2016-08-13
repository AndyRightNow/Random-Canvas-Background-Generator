var utils = require('./utils');

/*
 *  Check if a string is in a hex color format
 *  @return {boolean} True if the string is in a hex format
 *  @param {string} color: The string representing the color
 */
function isHex(color) {
    return /#[a-f0-9]{6}/gi.test(color);
}

/*
 *  Check if a string is in a rgb color format
 *  @return {boolean} True if the string is in a rgb format
 *  @param {string} color: The string representing the color
 */
 function isRgb(color) {
    //  Eliminate white spaces
    color = color.replace(/\s/g, "");
    return /rgb\([0-2]{0,1}[0-5]{0,1}[0-5]{1}\,[0-2]{0,1}[0-5]{0,1}[0-5]{1}\,[0-2]{0,1}[0-5]{0,1}[0-5]{1}\)/i.test(color);
}
 /*
*  Check if a string is in a rgba color format
*  @return {boolean} True if the string is in a rgba format
*  @param {string} color: The string representing the color
*/
function isRgba(color) {
 //  Eliminate white spaces
 color = color.replace(/\s/g, "");
 return /rgba\([0-2]{0,1}[0-5]{0,1}[0-5]{1}\,[0-2]{0,1}[0-5]{0,1}[0-5]{1}\,[0-2]{0,1}[0-5]{0,1}[0-5]{1}\,[0]{0,1}[.]{0,1}[0-9]{1,2}\)/i.test(color);

}

/*
 *	Convert hex color to rgb color
 *  @return {string / null} Converted color string or null if the input is invalid
 */
function hexToRgb(hex) {
    if (isHex(hex)) {
        return "rgb(" +
        parseInt(hex.substr(1, 2), 16) + ", " +
        parseInt(hex.substr(3, 2), 16) + ", " +
        parseInt(hex.substr(5, 2), 16) + ")";
    }
    else return isRgb(hex) || isRgba(hex) ? hex : null;
}

/*
 *	Adjust the brightness of a color by percentage
 *  @param {string} color: The color string
 *  @param {float} percentage: A float within [-1, 1] by which the brightness is adjusted.
 *							   1 means maximum darkness and -1 means maximum brightness.
 */
function adjustColorBrightness(color, percentage) {
    percentage = percentage || 0;
    color = hexToRgb(color);

    if (color !== null) {
        //-------------------------------------------
        //	Use different regex and formats for rgb and rgba
        //-------------------------------------------
        var regx = isRgb(color) ?
            /[0-2]{0,1}[0-5]{0,1}[0-5]{1}/gi : /[0-2]{0,1}[0-5]{0,1}[0-5]{1}\,/gi;
        var postfix = isRgb(color) ? '' : ',';

        //	Math 'n,' in order to exclude the alpha
        return color.replace(regx, function(e){
            return utils.clamp((parseInt(e) * (1 - percentage)), 0, 255).toString() + postfix;
        });
    }

    return null;
}

/*
 *  Function to generate random color with random brightness
 *  based on a given color
 *
 *	@return {string} A string of generated color
 *  @param {string} baseColor: A color string in HEX, RGB or RGBA
 *	@param {float} brightnessIntensity(Optional): The brightness intensity within [0, 1] to generate
 *												  around. 0 means generate around 0 brightness changes,
 *												  0.5 means generate around 50% brightness changes and
 *												  1 means generate around maximum brightness changes.
 *												  The brightness changes will be either drakening or brightening.
 */
 function randomColor(baseColor, brightnessIntensity){
     brightnessIntensity = brightnessIntensity || 0.5;
     var threshold = 0.2,
         rangeLower = utils.clamp(brightnessIntensity - threshold, 0, 1),
         rangeUpper = utils.clamp(brightnessIntensity + threshold, 0, 1);

     //	Used to get a either negative or positive random number
     var randomArr = [
         utils.getRandomNumberFromRange(rangeLower, rangeUpper, false),
         utils.getRandomNumberFromRange(-rangeLower, -rangeUpper, false)];

     //	Color validity checking in adjustColorBrightness
     return adjustColorBrightness(baseColor, randomArr[utils.getRandomNumberFromRange(0, 2)]);
 }

/*
 *  Function to generate random gradient color with random brightness on both sides
 *  of the linear gradient based on a given color
 *
 *	@return {Object} An object containing the pair of colors
 *  @param {string} baseColor: A color string in HEX, RGB or RGBA
 *	@param {float} brightnessIntensity(Optional): The brightness intensity within [0, 1] to generate
 *												  around. The same as the one in randomColor
 */
 function randomGradient(baseColor, brightnessIntensity) {
     brightnessIntensity = brightnessIntensity || 0.5;
     return {
         first: randomColor(baseColor, brightnessIntensity),
         second: randomColor(baseColor, brightnessIntensity)
     };
 }

//  Exports
module.exports.isHex = isHex;
module.exports.isRgb = isRgb;
module.exports.isRgba = isRgba;
module.exports.hexToRgb = hexToRgb;
module.exports.adjustColorBrightness = adjustColorBrightness;
module.exports.randomColor = randomColor;
module.exports.randomGradient = randomGradient;
