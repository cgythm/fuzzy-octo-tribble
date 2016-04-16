- there is something wrong with the lineheight. It has a visual discomfort and unrhythmic feel to it.
    - unevenness comes from the underline that exist below the text input field. it emphasize how it crosses one line
     into the line below it. the solution is to have a more ample lineheight so the allowance above and below the
     text is more emphasized.
- the font size at the bp of 400px wide is a bit too big. At 14pt, the font occupies with its line-height allowance
about 20px.



if w, where 374 <= w <= 400, is percentage based, the container block's width will grow relative to the change in view
port sie and that space will be added to the left of the container, adding a hang space for the left side of the line
. this changes if we set the container block's width to 318px, where the container block will always be centered and
there wouldn't be of center because of the hanging space. I also want a visible compromise too,
so maybe a certain range I have the containing block to be relative sied, and then fixed sie after a certain margin.