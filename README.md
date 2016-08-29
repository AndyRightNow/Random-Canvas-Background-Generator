# Random Canvas Background Generator

A JavaScript plugin to generate random background for HTML canvas in a certain mode.

## What is this?

It's a simple plugin to drop into your HTML **without installation and dependencies**. What it does is that it randomly generates a background on the HTML canvas element you provide and BTW, the visual effect is pretty decent, I think. :)

## Why This?

Maybe because it looks quite pretty and is simple to use?

## How To Use It?

Before all of steps below, make sure you have imported the module correctly.
You can either use RequireJS to import file in ```dist/amd/``` or directly import it as a global variable in ```dist/global-var```.

1. Make sure you have a HTML Canvas element on your web page and there is an id associated with it. If not, make one.
2. Declare the RandomBackgroundGenerator Object in your js file. E.g.
    ```javascript
    var backgroundGen = new RandomBackgroundGenerator({
        canvasId: 'canvas',
        mode: 'Polygonal',
        baseColors: ['#AEA8D3', '#663399', '#BE90D4', '#E4F1FE'],
        density: {
            x: 0.7, y: 0.8
        },
        isMixed: false
    });
    ```
    Different modes have different properties and you can add them all in the argument object.

3. Generate!
    ```javascript
    backgroundGen.generate();
    ```

## Example Page

The background of [My Personal Website](https://andyrightnow.github.io).

## Modes Currently Supported

1. **'Polygonal'**

    A mode to generate background with a bunch of randomly different polygons with different brightness and etc. See [Google Image - Polygonal Background](https://www.google.com/search?q=polygonal+background&newwindow=1&rlz=1C1CHWL_zh-CNCN678SG678&espv=2&biw=1366&bih=643&source=lnms&tbm=isch&sa=X&ved=0ahUKEwiWzJ_7qsHOAhVN62MKHUrJCiQQ_AUIBigB) for reference.

1. **'OverlappedRectangles'**

    A mode to generate background with a bunch of randomly different and overlapped rectangles with different brightness.
