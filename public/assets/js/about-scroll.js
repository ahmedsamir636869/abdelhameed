/* =========================================================
   ABDELHAMID ENGINEERING INDUSTRIES
   ABOUT PAGE — SECTION SCROLL
   Same transition system used on Home
========================================================= */

(function () {

    "use strict";


    function initAboutScroll() {


        /* ==================================================
           ABOUT PAGE ONLY
        ================================================== */

        const isAboutPage =
            window.location.pathname.endsWith("/about.php");


        if (!isAboutPage) {
            return function () {};
        }


        /* ==================================================
           GET ABOUT SECTIONS
        ================================================== */

        const sections = Array.from(
            document.querySelectorAll(
                ".about-page > .about-opening, .about-facilities"
            )
        );


        if (sections.length < 2) {
            return function () {};
        }

        const cleanups = [];

        function listen(target, type, handler, options) {
            target.addEventListener(type, handler, options);
            cleanups.push(function () {
                target.removeEventListener(type, handler, options);
            });
        }


        let currentSection = 0;

        let isScrolling = false;
        let animationFrame = null;
        let transitionId = 0;
        let transitionFrom = null;
        let transitionDirection = 0;
        let lastTransitionDirection = 0;
        let lastTransitionAt = 0;
        let scrollBehaviorBeforeTransition = null;
        let backToTopLockUntil = 0;
        let backToTopRestoreTimer = null;
        let scrollSnapBeforeBackToTop = null;
        let lastWheelEventAt = 0;
        let lastWheelDirection = 0;
        let lastWheelMagnitude = 0;
        let lastWheelWasPixelInput = false;
        let lastWheelWasFinePixelInput = false;
        let pendingFineDirection = 0;
        let pendingFineMagnitude = 0;
        let pendingFineAt = 0;
        let wheelGesture = null;
        let wheelGestureTimer = null;

        const transitionDuration = 280;
        const sameDirectionCooldown = 80;
        const wheelDirectionThreshold = 8;
        const touchpadGestureIdle = 260;
        const touchpadFollowupWindow = 50;
        const fineSwipeRecognitionWindow = 220;
        const touchpadFineDelta = 80;
        const newGestureQuietGap = 85;
        const gestureTailRatio = .55;
        const gestureReaccelerationRatio = 2.5;
        const gestureReaccelerationPeakRatio = .25;
        const landingTolerance = 1;

        function settleAtTarget(target) {

            if (Math.abs(window.scrollY - target) > landingTolerance) {
                setScrollPosition(target);
            }

        }

        function clearFineWheelInput() {

            pendingFineDirection = 0;
            pendingFineMagnitude = 0;
            pendingFineAt = 0;

        }

        function clearWheelGesture() {

            if (wheelGestureTimer !== null) {

                clearTimeout(wheelGestureTimer);
                wheelGestureTimer = null;

            }

            wheelGesture = null;
            lastWheelEventAt = 0;
            lastWheelDirection = 0;
            lastWheelMagnitude = 0;
            lastWheelWasPixelInput = false;
            lastWheelWasFinePixelInput = false;
            clearFineWheelInput();

        }

        function isFinePixelWheelInput(event, magnitude) {

            return (
                event.deltaMode === 0 &&
                (
                    magnitude < touchpadFineDelta ||
                    !Number.isInteger(event.deltaY)
                )
            );

        }

        function rememberWheelInput(event, direction, magnitude, now) {

            lastWheelEventAt = now;
            lastWheelDirection = direction;
            lastWheelMagnitude = magnitude;
            lastWheelWasPixelInput = event.deltaMode === 0;
            lastWheelWasFinePixelInput =
                isFinePixelWheelInput(event, magnitude);

        }

        function armWheelGestureTimeout() {

            if (wheelGestureTimer !== null) {

                clearTimeout(wheelGestureTimer);

            }

            wheelGestureTimer = setTimeout(
                function () {

                    if (isScrolling) {
                        armWheelGestureTimeout();
                        return;
                    }

                    clearWheelGesture();

                },
                touchpadGestureIdle
            );

        }

        function beginWheelGesture(event, direction, magnitude, now, previousMagnitude) {

            wheelGesture = {
                committed: true,
                direction: direction,
                hasTail: false,
                lastEventAt: now,
                lastMagnitude: magnitude,
                peakMagnitude: Math.max(magnitude, previousMagnitude || 0),
                tailMagnitude: Infinity
            };

            rememberWheelInput(event, direction, magnitude, now);
            clearFineWheelInput();
            armWheelGestureTimeout();

        }

        function updateWheelGesture(event, magnitude, now) {

            wheelGesture.peakMagnitude = Math.max(
                wheelGesture.peakMagnitude,
                magnitude
            );

            if (
                magnitude <=
                wheelGesture.peakMagnitude * gestureTailRatio
            ) {

                wheelGesture.hasTail = true;
                wheelGesture.tailMagnitude = Math.min(
                    wheelGesture.tailMagnitude,
                    magnitude
                );

            }

            wheelGesture.lastEventAt = now;
            wheelGesture.lastMagnitude = magnitude;
            rememberWheelInput(
                event,
                wheelGesture.direction,
                magnitude,
                now
            );
            armWheelGestureTimeout();
        }

        function hasContinuousTouchpadFollowup(event, direction, magnitude, now) {

            const isContinuous =
                direction === lastWheelDirection &&
                now - lastWheelEventAt <= touchpadFollowupWindow &&
                event.deltaMode === 0 &&
                lastWheelWasPixelInput &&
                (
                    isFinePixelWheelInput(event, magnitude) ||
                    lastWheelWasFinePixelInput
                );

            const previousMagnitude = lastWheelMagnitude;

            rememberWheelInput(event, direction, magnitude, now);

            return {
                isContinuous: isContinuous,
                previousMagnitude: previousMagnitude
            };

        }

        function shouldBeginNewWheelGesture(magnitude, now) {

            const quietRestart =
                now - wheelGesture.lastEventAt >= newGestureQuietGap &&
                magnitude >= Math.max(
                    wheelDirectionThreshold,
                    wheelGesture.peakMagnitude * .2
                );

            const renewedAcceleration =
                wheelGesture.hasTail &&
                magnitude >= Math.max(
                    wheelDirectionThreshold,
                    wheelGesture.tailMagnitude *
                        gestureReaccelerationRatio,
                    wheelGesture.peakMagnitude *
                        gestureReaccelerationPeakRatio
                );

            return quietRestart || renewedAcceleration;

        }

        function consumeFineWheelInput(event, direction, magnitude, now) {

            if (event.deltaMode !== 0) {
                return false;
            }

            if (
                direction !== pendingFineDirection ||
                now - pendingFineAt > fineSwipeRecognitionWindow
            ) {

                pendingFineDirection = direction;
                pendingFineMagnitude = magnitude;

            }

            else {

                pendingFineMagnitude += magnitude;

            }

            pendingFineAt = now;

            return pendingFineMagnitude >= wheelDirectionThreshold;

        }


        /* ==================================================
           FIND CURRENT SECTION
        ================================================== */

        function updateCurrentSection() {

            const scrollPosition =
                window.scrollY;


            let closestIndex = 0;

            let closestDistance = Infinity;


            sections.forEach(
                function (section, index) {

                    const distance =
                        Math.abs(
                            section.offsetTop -
                            scrollPosition
                        );


                    if (
                        distance <
                        closestDistance
                    ) {

                        closestDistance =
                            distance;

                        closestIndex =
                            index;

                    }

                }
            );


            currentSection =
                closestIndex;

        }


        /* ==================================================
           MOVE TO SECTION
        ================================================== */

        function useImmediateScroll() {

            if (scrollBehaviorBeforeTransition === null) {

                scrollBehaviorBeforeTransition =
                    document.documentElement.style.scrollBehavior;

                document.documentElement.style.scrollBehavior = "auto";

            }

        }


        function restoreScrollBehavior() {

            if (scrollBehaviorBeforeTransition !== null) {

                document.documentElement.style.scrollBehavior =
                    scrollBehaviorBeforeTransition;

                scrollBehaviorBeforeTransition = null;

            }

        }


        function setScrollPosition(position) {

            window.scrollTo({
                top: position,
                left: 0,
                behavior: "auto"
            });

        }


        function goToSection(index, allowInterrupt) {


            if (
                index < 0 ||
                index >= sections.length ||
                (isScrolling && !allowInterrupt)
            ) {

                return false;

            }

            const fromIndex = currentSection;


            if (animationFrame !== null) {

                cancelAnimationFrame(animationFrame);
                animationFrame = null;

            }


            transitionId += 1;


            currentSection = index;
            transitionFrom = fromIndex;


            const target =
                sections[index].offsetTop;


            const start =
                window.scrollY;


            const distance =
                target - start;


            const direction =
                Math.sign(distance) ||
                Math.sign(index - fromIndex);


            if (Math.abs(distance) < 1) {

                setScrollPosition(target);
                settleAtTarget(target);

                isScrolling = false;
                transitionFrom = null;
                transitionDirection = 0;
                restoreScrollBehavior();
                updateCurrentSection();

                return true;

            }


            isScrolling = true;
            transitionDirection = direction;
            useImmediateScroll();


            const activeTransition = transitionId;



            let startTime = null;


            function animateScroll(timestamp) {


                if (activeTransition !== transitionId) {
                    return;
                }

                if (!startTime) {

                    startTime =
                        timestamp;

                }


                const elapsed =
                    timestamp -
                    startTime;


                const progress =
                    Math.min(
                        elapsed /
                        transitionDuration,
                        1
                    );


                const eased =
                    1 -
                    Math.pow(
                        1 - progress,
                        3
                    );


                setScrollPosition(
                    start +
                    distance *
                    eased
                );


                if (progress < 1) {

                    animationFrame = requestAnimationFrame(
                        animateScroll
                    );

                }

                else {

                    setScrollPosition(target);
                    settleAtTarget(target);

                    animationFrame = null;
                    isScrolling = false;
                    lastTransitionDirection = transitionDirection;
                    lastTransitionAt = performance.now();
                    transitionFrom = null;
                    transitionDirection = 0;
                    restoreScrollBehavior();
                    updateCurrentSection();

                }

            }


            animationFrame = requestAnimationFrame(
                animateScroll
            );


            return true;

        }


        function requestSection(
            direction,
            bypassSameDirectionCooldown
        ) {

            if (isScrolling) {

                if (
                    direction !== transitionDirection &&
                    transitionFrom !== null
                ) {

                    goToSection(transitionFrom, true);

                }

                return;

            }


            if (
                !bypassSameDirectionCooldown &&
                direction === lastTransitionDirection &&
                performance.now() - lastTransitionAt <
                sameDirectionCooldown
            ) {
                return;
            }


            updateCurrentSection();


            const nextSection =
                currentSection + direction;


            if (
                nextSection >= 0 &&
                nextSection < sections.length
            ) {

                goToSection(nextSection);

            }

        }


        /* ==================================================
           MOUSE WHEEL
        ================================================== */

        listen(window,
            "wheel",
            function (event) {


                /* Normal scrolling on mobile */

                if (
                    window.innerWidth <= 1100
                ) {

                    return;

                }


                if (performance.now() < backToTopLockUntil) {

                    event.preventDefault();

                    return;

                }

                const now = performance.now();
                const direction = Math.sign(event.deltaY);
                const magnitude = Math.abs(event.deltaY);

                if (!direction) {
                    return;
                }

                if (wheelGesture !== null) {

                    if (direction !== wheelGesture.direction) {

                        if (magnitude < wheelDirectionThreshold) {
                            event.preventDefault();
                            return;
                        }

                        clearWheelGesture();

                    }

                    else {

                        if (
                            !isScrolling &&
                            shouldBeginNewWheelGesture(
                                magnitude,
                                now
                            )
                        ) {

                            beginWheelGesture(
                                event,
                                direction,
                                magnitude,
                                now,
                                magnitude
                            );
                            event.preventDefault();
                            requestSection(direction, true);

                            return;

                        }

                        updateWheelGesture(event, magnitude, now);
                        event.preventDefault();

                        return;

                    }

                }

                if (magnitude < wheelDirectionThreshold) {

                    if (
                        consumeFineWheelInput(
                            event,
                            direction,
                            magnitude,
                            now
                        )
                    ) {

                        beginWheelGesture(
                            event,
                            direction,
                            magnitude,
                            now,
                            pendingFineMagnitude
                        );
                        event.preventDefault();
                        requestSection(direction);

                        return;

                    }

                    if (event.deltaMode === 0) {
                        event.preventDefault();
                    }

                    return;

                }

                const stream = hasContinuousTouchpadFollowup(
                    event,
                    direction,
                    magnitude,
                    now
                );

                if (stream.isContinuous) {

                    beginWheelGesture(
                        event,
                        direction,
                        magnitude,
                        now,
                        stream.previousMagnitude
                    );
                    event.preventDefault();

                    return;

                }

                clearFineWheelInput();
                event.preventDefault();
                requestSection(direction);

            },
            {
                passive: false
            }
        );


        listen(window,
            "aboutbacktotop",
            function () {

                clearWheelGesture();

                if (animationFrame !== null) {

                    cancelAnimationFrame(animationFrame);
                    animationFrame = null;

                }

                transitionId += 1;
                isScrolling = false;
                transitionFrom = null;
                transitionDirection = 0;
                backToTopLockUntil = performance.now() + 650;
                restoreScrollBehavior();


                if (backToTopRestoreTimer !== null) {

                    clearTimeout(backToTopRestoreTimer);

                }


                if (scrollSnapBeforeBackToTop === null) {

                    scrollSnapBeforeBackToTop =
                        document.documentElement.style.scrollSnapType;

                    document.documentElement.style.scrollSnapType = "none";

                }


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });


                backToTopRestoreTimer = setTimeout(
                    function () {

                        document.documentElement.style.scrollSnapType =
                            scrollSnapBeforeBackToTop;

                        scrollSnapBeforeBackToTop = null;
                        backToTopRestoreTimer = null;

                    },
                    650
                );

            }
        );

        /* ==================================================
           KEYBOARD
        ================================================== */

        listen(window,
            "keydown",
            function (event) {


                if (isScrolling) {
                    return;
                }

                clearWheelGesture();


                updateCurrentSection();


                /* DOWN */

                if (
                    event.key === "ArrowDown" ||
                    event.key === "PageDown"
                ) {

                    event.preventDefault();


                    if (
                        currentSection <
                        sections.length - 1
                    ) {

                        goToSection(
                            currentSection + 1
                        );

                    }

                }


                /* UP */

                if (
                    event.key === "ArrowUp" ||
                    event.key === "PageUp"
                ) {

                    event.preventDefault();


                    if (
                        currentSection > 0
                    ) {

                        goToSection(
                            currentSection - 1
                        );

                    }

                }


                /* HOME */

                if (
                    event.key === "Home"
                ) {

                    event.preventDefault();

                    goToSection(0);

                }


                /* END */

                if (
                    event.key === "End"
                ) {

                    event.preventDefault();

                    goToSection(
                        sections.length - 1
                    );

                }

            }
        );

        listen(window,
            "blur",
            clearWheelGesture
        );

        listen(window,
            "resize",
            clearWheelGesture
        );


        /* ==================================================
           INITIAL POSITION
        ================================================== */

        updateCurrentSection();

        return function cleanupAboutScroll() {
            cleanups.forEach(function (fn) {
                fn();
            });

            if (animationFrame !== null) {
                cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }

            if (backToTopRestoreTimer) {
                clearTimeout(backToTopRestoreTimer);
                backToTopRestoreTimer = null;
            }

            if (wheelGestureTimer) {
                clearTimeout(wheelGestureTimer);
                wheelGestureTimer = null;
            }

            restoreScrollBehavior();
        };

    }


    window.__abdelhamidEffects = window.__abdelhamidEffects || {};
    window.__abdelhamidEffects['/assets/js/about-scroll.js'] = initAboutScroll;

})();

