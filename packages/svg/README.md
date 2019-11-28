#fameteor:svg (V0.0.1)
##Introduction
This package provide a set of tools to manage interactive SVG documents to allow SVG element editing (add, remove, drag, resize, span...) simply adding classes to the element.
##Edition Modes
The context `mode` boolean parameter defines 2 modes :

- if `true` hypertext link won't be followed, but the svg can be edited.
- if `false`the svg cannot be edited, but when clicking on a zone any existing hypertext link will be followed.

##Interactive classes
- **zoomable** : if this class is added to an svg element, the whole svg document can be zoomed in and out when scrolling the mouse wheel on that element (or using CTRL+ and CTRL-).
> No other attribute should be used on that element !

- **spannable** : if this class is added to an svg element, the whole svg document can be spanned when dragging and dropping this element.
> No other attribute should be used on that element !

- **selectable** (edit mode only) :
- **draggable** (edit mode only) :
- **deletable** (edit mode only) :
- **resizable** (edit mode only):
- **handle_nwes** (edit mode only) :

#API
##Client
###Javascript
###Templates