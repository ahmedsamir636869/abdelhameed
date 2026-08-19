/* =========================================================
   ABDELHAMID ENGINEERING INDUSTRIES
   LIQUID GLASS NAVIGATION
   Smooth Physics Tracking
   ========================================================= */

(function () {

    "use strict";

    function initLiquidNavigation() {

        const navLinks =
            document.querySelector(".navigation .nav-links");

        if (!navLinks) {
            return;
        }

        const links =
            navLinks.querySelectorAll("li > a");

        if (!links.length) {
            return;
        }

        /* -------------------------------------------------
           Create Bubble
        ------------------------------------------------- */

        let bubble =
            navLinks.querySelector(".nav-glass-hover");

        if (!bubble) {

            bubble =
                document.createElement("div");

            bubble.className =
                "nav-glass-hover";

            navLinks.insertBefore(
                bubble,
                navLinks.firstChild
            );

        }

        /* -------------------------------------------------
           State
        ------------------------------------------------- */

        let targetX = 0;
        let targetY = 0;

        let currentX = 0;
        let currentY = 0;

        let targetWidth = 0;
        let targetHeight = 0;

        let currentWidth = 0;
        let currentHeight = 0;

        let animationFrame = null;

        /* -------------------------------------------------
           Smoothness
           
           Higher = faster
           Lower = more liquid
        ------------------------------------------------- */

        const FOLLOW_SPEED = 0.10;


        /* -------------------------------------------------
           Move Target
        ------------------------------------------------- */

        function setTarget(link) {

            const navRect =
                navLinks.getBoundingClientRect();

            const linkRect =
                link.getBoundingClientRect();

            targetX =
                linkRect.left -
                navRect.left;

            targetY =
                linkRect.top -
                navRect.top;

            targetWidth =
                linkRect.width;

            targetHeight =
                linkRect.height;

            bubble.style.opacity = "1";

            startAnimation();

        }


        /* -------------------------------------------------
           Smooth Animation Loop
        ------------------------------------------------- */

        function renderBubble() {

            bubble.style.transform =
                `translate3d(
                    ${currentX}px,
                    ${currentY}px,
                    0
                )`;

            bubble.style.width =
                currentWidth + "px";

            bubble.style.height =
                currentHeight + "px";

        }


        function startAnimation() {

            if (animationFrame !== null) {
                return;
            }

            animationFrame = requestAnimationFrame(
                animate
            );

        }


        function animate() {

            /*
             * Smoothly approach target position.
             */

            currentX +=
                (targetX - currentX) *
                FOLLOW_SPEED;

            currentY +=
                (targetY - currentY) *
                FOLLOW_SPEED;


            currentWidth +=
                (targetWidth - currentWidth) *
                FOLLOW_SPEED;


            currentHeight +=
                (targetHeight - currentHeight) *
                FOLLOW_SPEED;


            renderBubble();

            const hasSettled =
                Math.abs(targetX - currentX) < 0.1 &&
                Math.abs(targetY - currentY) < 0.1 &&
                Math.abs(targetWidth - currentWidth) < 0.1 &&
                Math.abs(targetHeight - currentHeight) < 0.1;

            if (hasSettled) {

                currentX = targetX;
                currentY = targetY;
                currentWidth = targetWidth;
                currentHeight = targetHeight;

                renderBubble();

                animationFrame = null;

                return;

            }

            animationFrame = requestAnimationFrame(
                animate
            );

        }


        /* -------------------------------------------------
           Mouse Enter
        ------------------------------------------------- */

        links.forEach(function (link) {

            link.addEventListener(
                "mouseenter",
                function () {

                    setTarget(link);

                }
            );

        });


        /* -------------------------------------------------
           Mouse Leave
        ------------------------------------------------- */

        navLinks.addEventListener(
            "mouseleave",
            function () {

                bubble.style.opacity = "0";

            }
        );


        /* -------------------------------------------------
           Start Animation
        ------------------------------------------------- */

        const firstLink =
            navLinks.querySelector("a.active") ||
            links[0];


        if (firstLink) {

            const navRect =
                navLinks.getBoundingClientRect();

            const linkRect =
                firstLink.getBoundingClientRect();

            currentX =
                targetX =
                linkRect.left -
                navRect.left;

            currentY =
                targetY =
                linkRect.top -
                navRect.top;

            currentWidth =
                targetWidth =
                linkRect.width;

            currentHeight =
                targetHeight =
                linkRect.height;

        }


        renderBubble();


        /* -------------------------------------------------
           Resize
        ------------------------------------------------- */

        window.addEventListener(
            "resize",
            function () {

                const hovered =
                    navLinks.querySelector(
                        "a:hover"
                    );

                if (hovered) {

                    setTarget(
                        hovered
                    );

                }

            }
        );

    }


    /* =====================================================
       MOBILE NAVIGATION
       ===================================================== */

    function initMobileNavigation() {

        const navbar =
            document.querySelector(".navbar");

        const navigation =
            document.querySelector(".navigation");

        const toggle =
            document.querySelector(".mobile-toggle");

        if (!navbar || !navigation || !toggle) {
            return;
        }

        const links =
            navigation.querySelectorAll("a");

        function closeMobileNavigation() {

            navigation.classList.remove("is-open");

            navbar.classList.remove("menu-open");

            document.body.classList.remove(
                "mobile-navigation-open"
            );

            toggle.setAttribute(
                "aria-expanded",
                "false"
            );

            toggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

        }

        toggle.addEventListener(
            "click",
            function () {

                const isOpen =
                    navigation.classList.toggle("is-open");

                navbar.classList.toggle(
                    "menu-open",
                    isOpen
                );

                document.body.classList.toggle(
                    "mobile-navigation-open",
                    isOpen
                );

                toggle.setAttribute(
                    "aria-expanded",
                    isOpen ? "true" : "false"
                );

                toggle.setAttribute(
                    "aria-label",
                    isOpen
                        ? "Close navigation menu"
                        : "Open navigation menu"
                );

            }
        );

        links.forEach(function (link) {

            link.addEventListener(
                "click",
                closeMobileNavigation
            );

        });

        document.addEventListener(
            "click",
            function (event) {

                if (
                    navigation.classList.contains("is-open") &&
                    !navbar.contains(event.target)
                ) {

                    closeMobileNavigation();

                }

            }
        );

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape" &&
                    navigation.classList.contains("is-open")
                ) {

                    closeMobileNavigation();

                    toggle.focus();

                }

            }
        );

        window.addEventListener(
            "resize",
            function () {

                if (window.innerWidth > 950) {
                    closeMobileNavigation();
                }

            }
        );

    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            function () {

                initLiquidNavigation();
                initMobileNavigation();

            }
        );

    } else {

        initLiquidNavigation();
        initMobileNavigation();

    }

})();
