/* =========================================================
   ABDELHAMID ENGINEERING INDUSTRIES
   BACK-TO-TOP CONTROLS
========================================================= */

(function () {

    "use strict";

    const eventControls = [
        {
            selector: ".home-back-to-top",
            eventName: "homebacktotop"
        },
        {
            selector: ".about-back-to-top",
            eventName: "aboutbacktotop"
        },
        {
            selector: ".manufacturing-back-to-top",
            eventName: "manufacturingbacktotop"
        }
    ];

    eventControls.forEach(function (control) {

        const button = document.querySelector(control.selector);

        if (!button) {
            return;
        }

        button.addEventListener("click", function () {
            window.dispatchEvent(new Event(control.eventName));
        });

    });

    const productsBackToTop = document.querySelector(
        ".products-back-to-top"
    );

    if (!productsBackToTop) {
        return;
    }

    productsBackToTop.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

}());
