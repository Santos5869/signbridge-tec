"use strict";

// ============================================
// ABECEDARIO - CURSOS
// ============================================


// ============================================
// ABRIR ABECEDARIO
// ============================================

function abrirAbecedario() {
    navegarSuave("abecedario.html");
}


// ============================================
// ABRIR REPASO DE LETRAS
// ============================================

function abrirRepaso() {
    navegarSuave("repaso-letras.html");
}


// ============================================
// VOLVER A CURSOS
// ============================================

function volverCursos() {
    navegarSuave("cursos.html");
}


// ============================================
// NAVEGACIÓN SUAVE
// ============================================

function navegarSuave(url) {

    document.body.classList.add("page-exiting");

    setTimeout(() => {
        window.location.href = url;
    }, 350);

}


// ============================================
// ANIMACIÓN DE ENTRADA
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    setTimeout(() => {
        document.body.classList.add("page-ready");
    }, 50);

});