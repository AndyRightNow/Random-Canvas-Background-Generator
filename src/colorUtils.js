var utils = require('./utils');

/**
 *  Check if a string is in a hex color format
 *  @return {boolean} True if the string is in a hex format
 *  @param {string} color: The string representing the color
 */
function isHex(color) {
    return /#[a-f0-9]{6}/gi.test(color);
}

/**
 *  Check if a string is in a rgb color format
 *  @return {boolean} True if the string is in a rgb format
 *  @param {string} color: The string representing the color
 */
 function isRgb(color) {
    //  Eliminate white spaces
    color = color.replace(/\s/g, "");
    return /rgb\([\d]{1,3}[.]?[\d]*\,[\d]{1,3}[.]?[\d]*\,[\d]{1,3}[.]?[\d]*\)/i.test(color);
}
 /**
*  Check if a string is in a rgba color format
*  @return {boolean} True if the string is in a rgba format
*  @param {string} color: The string representing the color
*/
function isRgba(color) {
 //  Eliminate white spaces
 color = color.replace(/\s/g, "");
 return /rgba\([\d]{1,3}[.]?[\d]*\,[\d]{1,3}[.]?[\d]*\,[\d]{1,3}[.]?[\d]*\,[\d]{1,3}[.]?[\d]*\)/i.test(color);

}

/**
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

/**
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
            /[\d]{1,3}[.]?[\d]*/gi : /[\d]{1,3}[.]?[\d]*\,/gi;
        var postfix = isRgb(color) ? '' : ',';

        //-------------------------------------------------
        //  Replace the r, g and b with adjusted numbers and
        //  round them to integers
        //-------------------------------------------------
        return color.replace(regx, function(e){
            return Math.round(utils.clamp((parseInt(e) * (1 - percentage)), 0, 255))
                .toString() + postfix;
        });
    }

    return null;
}

/**
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
 function randomColorBrightness(baseColor, brightnessIntensity){
     brightnessIntensity = brightnessIntensity || 0.5;
     var threshold = 0.2,
         rangeLower = utils.clamp(brightnessIntensity - threshold, 0, 1),
         rangeUpper = utils.clamp(brightnessIntensity + threshold, 0, 1);

     //	Used to get a either negative or positive random number
     var randomArr = [
         utils.getRandomNumberFromRange(rangeLower, rangeUpper - threshold, false), //  Darken
         utils.getRandomNumberFromRange(-rangeUpper, -rangeLower, false)];  //  Brighten

     //	Color validity checking in adjustColorBrightness
     return adjustColorBrightness(baseColor, randomArr[utils.getRandomNumberFromRange(0, 2)]);
 }

/**
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
         first: randomColorBrightness(baseColor, brightnessIntensity),
         second: randomColorBrightness(baseColor, brightnessIntensity)
     };
 }

//  Exports
module.exports.isHex = isHex;
module.exports.isRgb = isRgb;
module.exports.isRgba = isRgba;
module.exports.hexToRgb = hexToRgb;
module.exports.adjustColorBrightness = adjustColorBrightness;
module.exports.randomColorBrightness = randomColorBrightness;
module.exports.randomGradient = randomGradient;
