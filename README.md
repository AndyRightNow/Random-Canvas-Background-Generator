# Random Canvas Background Generator

A JavaScript plugin to generate random background for HTML canvas in a certain mode.

## What is this?

It's a simple plugin to drop into your HTML **without installation and dependencies**. What it does is that it randomly generate a background on HTML canvas element you provide and the visual effect is pretty decent, I think. :)

## Why This?

Maybe because it looks quite pretty and is simple to use?

## How To Use It?
1. Make sure you have a HTML Canvas element on your web page and there is an id associated with it. If not, make one.
2. Declare the RandomBackgroundGenerator Object in your js file.
    ```javascript
    var backgroundGen = new RandomBackgroundGenerator(
        'canvas', 
        'Polygonal',
        '#AEA8D3', '#663399', '#BE90D4', '#E4F1FE');
    ```
    1) First parameter 'canvas': It's the id of the HTML Canvas element you want to generate on.
    2) Second parameter 'Polygonal': It's the mode the generator will use to generate the background.
    3) Third to the last parameters: Colors you want the background to have

3. Set the detailed parameters of the mode.
    ```javascript
    backgroundGen.getMode().setDensity(0.6);
    backgroundGen.getMode().setMixed(false);
    ```
    1) The first line of code means setting the density of the polygons on the screen.
    2) The second line of code means setting the mix mode of the color to false, which means no mixing and displaying the color one by one.

4. Generate!
    ```javascript
    backgroundGen.generate();
    ```

## Example Page

Working on it...
