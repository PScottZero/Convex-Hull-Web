/**
 * @author Paul Scott
 * @version 25 January 2019
 *
 * handles menu functions of website
 */

/**
 * toggles slide menu
 */
function menu() {
    document.getElementById("menu_button").classList.toggle("change");

    let slide = document.getElementById("slide_menu");
    if (slide.style.left === "0em") {
        slide.style.left = "-21em";
    } else slide.style.left = "0em";
}