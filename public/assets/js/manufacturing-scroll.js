/* =========================================================
   ABDELHAMID ENGINEERING INDUSTRIES
   MANUFACTURING PAGE — SECTION SCROLL

   Desktop:
   - Cinematic section-to-section scrolling
   - Sections 01 and 02 remain snap targets
   - The final machinery section scrolls naturally within its content range

   Mobile:
   - Normal browser scrolling
========================================================= */

(function () {

    "use strict";


    function initManufacturingScroll() {


        /* =====================================================
           MANUFACTURING PAGE ONLY
        ===================================================== */

        const isManufacturingPage =
            window.location.pathname.endsWith("/manufacturing.php");

        if (!isManufacturingPage) {
            return function () {};
        }


        /* =====================================================
           GET MAIN SECTIONS
        ===================================================== */

        const sections = Array.from(
            document.querySelectorAll(
                ".manufacturing-page > section"
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


        /* =====================================================
           STATE
        ===================================================== */

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
        let scrollSnapBeforeFinalSection = null;
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
        const finalSectionTolerance = 2;
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


        function shouldBeginNewWheelGesture(
            magnitude,
            now,
            requireQuietRestart
        ) {

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

            return quietRestart || (
                !requireQuietRestart &&
                renewedAcceleration
            );

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


        /* =====================================================
           GET TRUE DOCUMENT BOTTOM
        ===================================================== */

        function getDocumentBottom() {

            const scrollingElement =
                document.scrollingElement ||
                document.documentElement;

            return Math.max(
                0,
                scrollingElement.scrollHeight -
                window.innerHeight
            );

        }


        function isCustomScrollMode() {

            return window.innerWidth > 1100;

        }


        function getFinalSectionIndex() {

            return sections.length - 1;

        }


        function getFinalSectionTop() {

            return sections[
                getFinalSectionIndex()
            ].offsetTop;

        }


        function isInFinalSectionRange() {

            return window.scrollY >=
                getFinalSectionTop() -
                finalSectionTolerance;

        }


        function isAtFinalSectionTop() {

            return window.scrollY <=
                getFinalSectionTop() +
                finalSectionTolerance;

        }


        function isAtDocumentBottom() {

            return getDocumentBottom() -
                window.scrollY <=
                finalSectionTolerance;

        }


        function disableScrollSnapForFinalSection() {

            if (scrollSnapBeforeFinalSection === null) {

                scrollSnapBeforeFinalSection =
                    document.documentElement.style.scrollSnapType;

                document.documentElement.style.scrollSnapType =
                    "none";

            }

        }


        function restoreScrollSnapAfterFinalSection() {

            if (scrollSnapBeforeFinalSection !== null) {

                document.documentElement.style.scrollSnapType =
                    scrollSnapBeforeFinalSection;

                scrollSnapBeforeFinalSection = null;

            }

        }


        function syncFinalSectionScrollMode() {

            if (!isCustomScrollMode()) {

                restoreScrollSnapAfterFinalSection();

                return;

            }


            if (isInFinalSectionRange()) {

                currentSection = getFinalSectionIndex();
                disableScrollSnapForFinalSection();

                return;

            }


            restoreScrollSnapAfterFinalSection();

        }


        /* =====================================================
           GET TARGET POSITION
        ===================================================== */

        function getSectionTarget(index) {

            if (
                index === getFinalSectionIndex() &&
                !isCustomScrollMode()
            ) {

                return getDocumentBottom();

            }


            return sections[index].offsetTop;

        }


        /* =====================================================
           FIND CURRENT SECTION
        ===================================================== */

        function updateCurrentSection() {

            const scrollPosition =
                window.scrollY;


            if (
                scrollPosition >=
                getFinalSectionTop() -
                finalSectionTolerance
            ) {

                currentSection =
                    getFinalSectionIndex();

                return;

            }


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


        /* =====================================================
           SCROLL TO SECTION
        ===================================================== */

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


            if (
                index === getFinalSectionIndex() &&
                isCustomScrollMode()
            ) {

                disableScrollSnapForFinalSection();

            }

            else {

                restoreScrollSnapAfterFinalSection();

            }

            const target =
                Math.max(
                    0,
                    Math.min(
                        getSectionTarget(index),
                        getDocumentBottom()
                    )
                );


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
                syncFinalSectionScrollMode();

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


                /*
                 * Smooth ease-out.
                 */

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


                if (
                    progress < 1
                ) {

                    animationFrame = requestAnimationFrame(
                        animateScroll
                    );

                }

                else {


                    /*
                     * Final exact position.
                     */

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
                    syncFinalSectionScrollMode();

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


            if (direction > 0) {

                if (
                    currentSection >=
                    getFinalSectionIndex()
                ) {

                    return false;

                }


                goToSection(
                    currentSection + 1
                );

            }


            else if (currentSection > 0) {

                goToSection(
                    currentSection - 1
                );

            }


            else {

                window.scrollTo(
                    0,
                    0
                );

            }

        }


        /* =====================================================
           MOUSE / TRACKPAD
        ===================================================== */

        listen(window,
            "wheel",
            function (event) {


                /*
                 * Mobile uses normal scrolling.
                 */

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

                    else if (isScrolling) {

                        updateWheelGesture(event, magnitude, now);
                        event.preventDefault();

                        return;

                    }

                    else {

                        updateCurrentSection();

                        if (
                            currentSection ===
                            getFinalSectionIndex()
                        ) {

                            if (
                                shouldBeginNewWheelGesture(
                                    magnitude,
                                    now,
                                    true
                                )
                            ) {

                                clearWheelGesture();

                            }

                            else {

                                updateWheelGesture(
                                    event,
                                    magnitude,
                                    now
                                );
                                event.preventDefault();

                                return;

                            }

                        }

                        else if (
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

                        else {

                            updateWheelGesture(event, magnitude, now);
                            event.preventDefault();

                            return;

                        }

                    }

                }

                if (magnitude < wheelDirectionThreshold) {

                    if (!isScrolling) {

                        updateCurrentSection();

                        if (
                            currentSection ===
                            getFinalSectionIndex()
                        ) {

                            return;

                        }

                    }

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

                if (isScrolling) {

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

                    return;

                }


                updateCurrentSection();


                if (
                    currentSection ===
                    getFinalSectionIndex()
                ) {

                    disableScrollSnapForFinalSection();


                    if (
                        direction < 0 &&
                        isAtFinalSectionTop()
                    ) {

                        event.preventDefault();

                        if (event.deltaMode === 0) {
                            beginWheelGesture(
                                event,
                                direction,
                                magnitude,
                                now,
                                magnitude
                            );
                        }

                        requestSection(-1);

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

                if (
                    event.deltaMode === 0 &&
                    currentSection + direction ===
                    getFinalSectionIndex()
                ) {
                    beginWheelGesture(
                        event,
                        direction,
                        magnitude,
                        now,
                        magnitude
                    );
                }

                event.preventDefault();
                requestSection(direction);

            },
            {
                passive: false
            }
        );


        listen(window,
            "manufacturingbacktotop",
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
                restoreScrollSnapAfterFinalSection();


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


        /* =====================================================
           KEYBOARD
        ===================================================== */

        listen(window,
            "keydown",
            function (event) {


                if (isScrolling) {

                    return;

                }

                clearWheelGesture();


                updateCurrentSection();


                if (
                    isCustomScrollMode() &&
                    currentSection ===
                    getFinalSectionIndex()
                ) {

                    disableScrollSnapForFinalSection();


                    if (
                        (
                            event.key === "ArrowDown" ||
                            event.key === "PageDown"
                        ) &&
                        !isAtDocumentBottom()
                    ) {

                        return;

                    }


                    if (
                        (
                            event.key === "ArrowUp" ||
                            event.key === "PageUp"
                        ) &&
                        !isAtFinalSectionTop()
                    ) {

                        return;

                    }

                }


                /* =================================================
                   ARROW DOWN / PAGE DOWN
                ================================================= */

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

                    else {

                        window.scrollTo({
                            top: getDocumentBottom(),
                            left: 0,
                            behavior: "auto"
                        });

                    }

                }


                /* =================================================
                   ARROW UP / PAGE UP
                ================================================= */

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


                /* =================================================
                   HOME
                ================================================= */

                if (
                    event.key === "Home"
                ) {

                    event.preventDefault();

                    goToSection(0);

                }


                /* =================================================
                   END
                ================================================= */

                if (
                    event.key === "End"
                ) {

                    event.preventDefault();


                    /*
                     * End should go directly to the
                     * actual bottom of the document.
                     */

                    if (isCustomScrollMode()) {

                        disableScrollSnapForFinalSection();

                        window.scrollTo({
                            top: getDocumentBottom(),
                            left: 0,
                            behavior: "auto"
                        });

                        updateCurrentSection();

                    }

                    else {

                        goToSection(
                            getFinalSectionIndex()
                        );

                    }

                }

            }
        );


        /* =====================================================
           RESIZE
        ===================================================== */

        listen(window,
            "resize",
            function () {

                clearWheelGesture();
                updateCurrentSection();
                syncFinalSectionScrollMode();

            }
        );

        listen(window,
            "blur",
            clearWheelGesture
        );

        /* =====================================================
           INITIAL POSITION
        ===================================================== */

        updateCurrentSection();
        syncFinalSectionScrollMode();

        return function cleanupManufacturingScroll() {
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
            restoreScrollSnapAfterFinalSection();
        };

    }


    window.__abdelhamidEffects = window.__abdelhamidEffects || {};
    window.__abdelhamidEffects['/assets/js/manufacturing-scroll.js'] = initManufacturingScroll;

})();

