"use strict";

/* ==========================================
   SIGNBRIDGE - CURSOS DE COLORES
   TRANSICIONES SUAVES
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("page-ready");

    prepararTransiciones();
});


/* ==========================================
   NAVEGACIÓN SUAVE
========================================== */

function navegarSuave(destino) {

    document.body.classList.remove("page-ready");
    document.body.classList.add("page-exiting");

    setTimeout(() => {
        window.location.href = destino;
    }, 400);
}


/* ==========================================
   ABRIR CURSO
========================================== */

function abrirCurso(curso) {

    switch (curso) {

        case "basicos":
            navegarSuave("colores.html");
            break;

        case "mas-colores":
            navegarSuave("mas-colores.html");
            break;

        case "practica":
            navegarSuave("practica-colores.html");
            break;

        default:
            console.warn(
                "Curso de colores no encontrado:",
                curso
            );
    }
}


/* ==========================================
   VOLVER
========================================== */

function volverCursos() {
    navegarSuave("cursos.html");
}


/* ==========================================
   TRANSICIONES DE ENLACES
========================================== */

function prepararTransiciones() {

    const enlaces = document.querySelectorAll(
        'a[href$=".html"]'
    );

    enlaces.forEach((enlace) => {

        enlace.addEventListener("click", (evento) => {

            const destino = enlace.getAttribute("href");

            if (
                !destino ||
                destino === "#" ||
                destino.startsWith("http")
            ) {
                return;
            }

            evento.preventDefault();

            navegarSuave(destino);
        });

    });
}