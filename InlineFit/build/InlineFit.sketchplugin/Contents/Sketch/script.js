var onRun = function (context) {
  var sketch = require('sketch')
  const Text = require('sketch/dom').Text

  var document = sketch.getSelectedDocument()

  // go through each page

  function rel(a0, a1, b0, b1, bX) {
    console.log('rel()')
    return ((bX - b0) / (b1 - b0)) * (a1 - a0) + a0
  }

  var selection = document.selectedLayers
  var _fontSize = 0
  var _minFontSize = 6
  var _text = ''

  selection.layers.map((layer) => {
    if (layer.type == 'Text') {
      // ** record textfield info
      var parentWidth = layer.frame.width
      var parentHeight = layer.frame.height
      _text = layer.text
      _fontSize = layer.style.fontSize

      const large = 243
      const small = _minFontSize

      // ** create temp Text Field to resize to get dimensions for max and min font sizes
      const tempTF = new Text({
        frame: {
          width: layer.frame.width,
          height: layer.frame.height,
        },
        style: {
          fontSize: layer.style.fontSize,
        },
        parent: layer.parent,
        text: layer.text,
      })
      tempTF.adjustToFit()

      // ** set max font size and record dimensions
      tempTF.style.fontSize = large
      tempTF.text = _text
      tempTF.adjustToFit()
      var largeWidth = tempTF.frame.width
      var largeHeight = tempTF.frame.height

      // ** set min font size and record dimensions
      tempTF.style.fontSize = small
      tempTF.text = _text
      tempTF.adjustToFit()
      var smallWidth = tempTF.frame.width
      var smallHeight = tempTF.frame.height

      // ** perform font size calculations based on the max/min dimensions
      var fontSizeWidth = rel(large, small, largeWidth, smallWidth, parentWidth)
      var fontSizeHeight = rel(large, small, largeHeight, smallHeight, parentHeight)

      _fontSize = Math.max(_minFontSize, Math.floor(Math.min(_fontSize, Math.min(fontSizeWidth, fontSizeHeight))))

      // ** apply new font size to original Text Field
      layer.style.fontSize = _fontSize
      // ** remove temp Text Field
      tempTF.remove()
    }
  })
}
