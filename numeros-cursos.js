"use strict";

/* =========================================================
   SIGNBRIDGE - NÚMEROS / CURSOS
   ========================================================= */


/* ---------- NAVEGACIÓN SUAVE ---------- */

function navegarSuave(url) {

    document.body.classList.add("page-exiting");

    setTimeout(() => {
        window.location.href = url;
    }, 350);
}


/* ---------- ABRIR CURSO 1-10 ---------- */

function abrirNumeros() {
    navegarSuave("numeros.html");
}


/* ---------- VOLVER A CURSOS ---------- */

function volverCursos() {
    navegarSuave("cursos.html");
}


/* ---------- ANIMACIÓN DE ENTRADA ---------- */

document.addEventListener("DOMContentLoaded", () => {

    setTimeout(() => {
        document.body.classList.add("page-ready");
    }, 50);

});