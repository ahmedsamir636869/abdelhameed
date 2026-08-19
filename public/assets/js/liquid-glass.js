/*
 * Abdelhamid Engineering Industries
 * Liquid Glass Effect
 *
 * Based on the SVG distortion approach from
 * lucasromerodb/liquid-glass-effect-macos
 */

(function () {
    "use strict";

    function createLiquidGlassFilter() {

        // Don't create it twice
        if (document.getElementById("abdelhamid-glass-svg")) {
            return;
        }

        const svgNS = "http://www.w3.org/2000/svg";

        const svg = document.createElementNS(svgNS, "svg");
        svg.id = "abdelhamid-glass-svg";
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("focusable", "false");

        svg.setAttribute("width", "0");
        svg.setAttribute("height", "0");

        svg.style.position = "absolute";
        svg.style.width = "0";
        svg.style.height = "0";
        svg.style.overflow = "hidden";

        const filter = document.createElementNS(svgNS, "filter");

        filter.id = "abdelhamid-glass-distortion";

        filter.setAttribute("x", "-20%");
        filter.setAttribute("y", "-20%");
        filter.setAttribute("width", "140%");
        filter.setAttribute("height", "140%");

        filter.setAttribute(
            "color-interpolation-filters",
            "sRGB"
        );

        /*
         * Noise map
         */
        const turbulence =
            document.createElementNS(svgNS, "feTurbulence");

        turbulence.setAttribute(
            "type",
            "fractalNoise"
        );

        turbulence.setAttribute(
            "baseFrequency",
            "0.008 0.02"
        );

        turbulence.setAttribute(
            "numOctaves",
            "2"
        );

        turbulence.setAttribute(
            "seed",
            "17"
        );

        turbulence.setAttribute(
            "result",
            "noise"
        );

        /*
         * Soften the distortion map
         */
        const blur =
            document.createElementNS(svgNS, "feGaussianBlur");

        blur.setAttribute(
            "in",
            "noise"
        );

        blur.setAttribute(
            "stdDeviation",
            "2"
        );

        blur.setAttribute(
            "result",
            "softMap"
        );

        /*
         * Displacement
         */
        const displacement =
            document.createElementNS(
                svgNS,
                "feDisplacementMap"
            );

        displacement.setAttribute(
            "in",
            "SourceGraphic"
        );

        displacement.setAttribute(
            "in2",
            "softMap"
        );

        displacement.setAttribute(
            "scale",
            "28"
        );

        displacement.setAttribute(
            "xChannelSelector",
            "R"
        );

        displacement.setAttribute(
            "yChannelSelector",
            "G"
        );

        /*
         * Specular highlight
         */
        const lighting =
            document.createElementNS(
                svgNS,
                "feSpecularLighting"
            );

        lighting.setAttribute(
            "in",
            "softMap"
        );

        lighting.setAttribute(
            "surfaceScale",
            "3"
        );

        lighting.setAttribute(
            "specularConstant",
            "0.7"
        );

        lighting.setAttribute(
            "specularExponent",
            "80"
        );

        lighting.setAttribute(
            "lighting-color",
            "#ffffff"
        );

        lighting.setAttribute(
            "result",
            "specular"
        );

        const light =
            document.createElementNS(
                svgNS,
                "fePointLight"
            );

        light.setAttribute(
            "x",
            "-200"
        );

        light.setAttribute(
            "y",
            "-200"
        );

        light.setAttribute(
            "z",
            "300"
        );

        lighting.appendChild(light);

        /*
         * Combine the effects
         */
        const composite =
            document.createElementNS(
                svgNS,
                "feComposite"
            );

        composite.setAttribute(
            "in",
            "specular"
        );

        composite.setAttribute(
            "in2",
            "SourceGraphic"
        );

        composite.setAttribute(
            "operator",
            "arithmetic"
        );

        composite.setAttribute(
            "k1",
            "0"
        );

        composite.setAttribute(
            "k2",
            "1"
        );

        composite.setAttribute(
            "k3",
            "0.4"
        );

        composite.setAttribute(
            "k4",
            "0"
        );

        composite.setAttribute(
            "result",
            "glassLight"
        );

        filter.appendChild(turbulence);
        filter.appendChild(blur);
        filter.appendChild(displacement);
        filter.appendChild(lighting);
        filter.appendChild(composite);

        svg.appendChild(filter);

        document.body.prepend(svg);
    }


    function applyLiquidGlass() {

        createLiquidGlassFilter();

        const elements = document.querySelectorAll(
            ".navbar, .hero-stat"
        );

        elements.forEach(function (element) {

            element.classList.add(
                "liquid-glass"
            );

        });
    }


    function init() {

        applyLiquidGlass();

    }


    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();

    }

})();
