"use strict";


/* =========================================================
   SIGNBRIDGE — SCRIPT PRINCIPAL
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* Entrada suave */
    setTimeout(() => {
        document.body.classList.add("page-ready");
    }, 80);


    /* =====================================================
       ANIMACIONES AL HACER SCROLL
       ===================================================== */

    const elementos = document.querySelectorAll(
        ".feature-card, .learning-card, .learning-heading, .bottom-cta"
    );

    const observer = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.12
        }
    );

    elementos.forEach((elemento) => {
        observer.observe(elemento);
    });


    /* =====================================================
       LINKS INTERNOS
       ===================================================== */

    const enlacesInternos = document.querySelectorAll(
        'a[href^="#"]'
    );

    enlacesInternos.forEach((enlace) => {

        enlace.addEventListener("click", (event) => {

            const destino = enlace.getAttribute("href");

            if (!destino || destino === "#") {
                return;
            }

            const elemento = document.querySelector(destino);

            if (!elemento) {
                return;
            }

            event.preventDefault();

            elemento.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


    /* =====================================================
       TRANSICIÓN ENTRE PÁGINAS
       ===================================================== */

    const enlacesPagina = document.querySelectorAll(
        'a[href$=".html"]'
    );

    enlacesPagina.forEach((enlace) => {

        enlace.addEventListener("click", (event) => {

            const destino = enlace.getAttribute("href");

            if (!destino) {
                return;
            }

            event.preventDefault();

            document.body.classList.add("page-exiting");

            setTimeout(() => {
                window.location.href = destino;
            }, 300);

        });

    });


    /* =====================================================
       EFECTO SUTIL SOBRE EL LOGO
       ===================================================== */

    const heroVisual = document.querySelector(".hero-visual");
    const logoCard = document.querySelector(".logo-card");

    if (
        heroVisual &&
        logoCard &&
        window.matchMedia("(pointer: fine)").matches
    ) {

        heroVisual.addEventListener("mousemove", (event) => {

            const rect = heroVisual.getBoundingClientRect();

            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const moveX = (mouseX - centerX) / centerX;
            const moveY = (mouseY - centerY) / centerY;

            logoCard.style.transform = `
                translate(
                    ${moveX * 5}px,
                    ${moveY * 5}px
                )
            `;

        });

        heroVisual.addEventListener("mouseleave", () => {
            logoCard.style.transform = "";
        });

    }


    /* =====================================================
       DELAY PARA TARJETAS
       ===================================================== */

    document.querySelectorAll(".feature-card").forEach(
        (card, index) => {
            card.style.transitionDelay = `${index * 100}ms`;
        }
    );

    document.querySelectorAll(".learning-card").forEach(
        (card, index) => {
            card.style.transitionDelay = `${index * 90}ms`;
        }
    );

});


/* =========================================================
   RESTAURAR PAGINA SI SE REGRESA CON EL NAVEGADOR
   ========================================================= */

window.addEventListener("pageshow", () => {

    document.body.classList.remove("page-exiting");

    setTimeout(() => {
        document.body.classList.add("page-ready");
    }, 30);

});