@doc doc"""
Type to include raw html code into IJulia / IPython / Jupyter notebook
files.
"""->

type Raw_html
    s::String
end

import Base.writemime
function writemime(io::IO, ::MIME"text/html", x::Raw_html)
    print(io, x.s)
end

@doc doc"""
Create canvas for Javascript chart. By default, canvas will be a <div>
element with its name given as class. Element and attribute can be
specified as additional keyword input arguments. Instead of class,
canvas may be given as tag, identifier, attribute and so forth. The
function returns a Jupyter_html type that will directly write to
IJulia / IPython / Jupyter notebook files on display.

The function also loads the d3 library.
"""->
function initCanvas(canvasName::String;
                    elem="div"::String, attr="class"::String,
                    localD3=false::Bool)
    
    if localD3
        canvasCode = """
<script src="d3/d3.v3.min.js" charset="utf-8"></script>
<$elem $attr="$canvasName"></$elem>
"""
    else
        canvasCode = """
<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<$elem $attr="$canvasName"></$elem>
"""
        
    end
    
    return Raw_html(canvasCode)
end
