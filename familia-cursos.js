// ==========================================
// SIGNBRIDGE - CATEGORÍA FAMILIA
// ==========================================

function abrirCurso(curso) {

    switch (curso) {

        case "familia-basica":
            window.location.href = "familia.html";
            break;

        default:
            console.log("Curso no encontrado:", curso);

    }

}