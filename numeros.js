// ========================================
// SIGNBRIDGE - MÓDULO DE NÚMEROS
// PROGRESO POR USUARIO
// ========================================

const numeros = [

    {
        numero: "1",
        imagen: "../images/numeros/1.png",
        descripcion: "Seña correspondiente al número 1."
    },

    {
        numero: "2",
        imagen: "../images/numeros/2.png",
        descripcion: "Seña correspondiente al número 2."
    },

    {
        numero: "3",
        imagen: "../images/numeros/3.png",
        descripcion: "Seña correspondiente al número 3."
    },

    {
        numero: "4",
        imagen: "../images/numeros/4.png",
        descripcion: "Seña correspondiente al número 4."
    },

    {
        numero: "5",
        imagen: "../images/numeros/5.png",
        descripcion: "Seña correspondiente al número 5."
    },

    {
        numero: "6",
        imagen: "../images/numeros/6.png",
        descripcion: "Seña correspondiente al número 6."
    },

    {
        numero: "7",
        imagen: "../images/numeros/7.png",
        descripcion: "Seña correspondiente al número 7."
    },

    {
        numero: "8",
        imagen: "../images/numeros/8.png",
        descripcion: "Seña correspondiente al número 8."
    },

    {
        numero: "9",
        imagen: "../images/numeros/9.png",
        descripcion: "Seña correspondiente al número 9."
    },

    {
        numero: "10",
        imagen: "../images/numeros/10.png",
        descripcion: "Seña correspondiente al número 10."
    }

];


// ========================================
// ÍNDICE ACTUAL
// ========================================

let indiceActual = 0;


// ========================================
// ELEMENTOS HTML
// ========================================

const imagen =
    document.getElementById("numeroImagen");

const titulo =
    document.getElementById("numeroTitulo");

const descripcion =
    document.getElementById("descripcion");

const barra =
    document.getElementById("progress");

const progresoTexto =
    document.getElementById("progressText");

const btnAnterior =
    document.getElementById("anterior");

const btnSiguiente =
    document.getElementById("siguiente");

const pantallaFinal =
    document.getElementById("finalScreen");

const btnVolver =
    document.getElementById("volverInicio");


// ========================================
// OBTENER USUARIO ACTIVO
// ========================================

function obtenerUsuarioActivo() {

    try {

        const datos =
            localStorage.getItem(
                "usuarioSignbridge"
            );

        if (!datos) {

            return null;

        }

        return JSON.parse(datos);

    } catch (error) {

        console.error(
            "Error obteniendo usuario:",
            error
        );

        return null;
    }
}


// ========================================
// GUARDAR USUARIO
// ========================================

function guardarUsuarioActivo(usuario) {

    localStorage.setItem(
        "usuarioSignbridge",
        JSON.stringify(usuario)
    );


    /*
       También actualizamos la lista
       general de usuarios.
    */

    try {

        const usuarios =
            JSON.parse(
                localStorage.getItem(
                    "usuariosSignbridge"
                )
            ) || [];


        const posicion =
            usuarios.findIndex(

                user =>
                    String(user.id) ===
                    String(usuario.id)

            );


        if (posicion !== -1) {

            usuarios[posicion] =
                usuario;


            localStorage.setItem(

                "usuariosSignbridge",

                JSON.stringify(usuarios)

            );

        }

    } catch (error) {

        console.error(
            "Error actualizando usuarios:",
            error
        );

    }

}


// ========================================
// GUARDAR PROGRESO DE NÚMEROS
// ========================================

function guardarProgresoNumeros() {

    const usuario =
        obtenerUsuarioActivo();


    if (!usuario) {

        console.warn(
            "No hay usuario activo."
        );

        return;

    }


    /*
       Crear progreso si no existe.
    */

    if (!usuario.progreso) {

        usuario.progreso = {

            abecedario: 0,
            numeros: 0,
            saludos: 0,
            reconocimiento: 0

        };

    }


    /*
       Calcular porcentaje según
       el número actual.

       1  = 10%
       2  = 20%
       ...
       10 = 100%
    */

    const porcentaje =
        Math.round(
            ((indiceActual + 1) /
                numeros.length) * 100
        );


    const progresoActual =
        Number(
            usuario.progreso.numeros
        ) || 0;


    /*
       Nunca retroceder el progreso.
    */

    usuario.progreso.numeros =
        Math.max(
            progresoActual,
            porcentaje
        );


    guardarUsuarioActivo(usuario);


    console.log(
        "✓ Progreso Números:",
        usuario.progreso.numeros + "%"
    );

}


// ========================================
// MOSTRAR NÚMERO
// ========================================

function mostrarNumero() {

    const actual =
        numeros[indiceActual];


    /*
       Guardar automáticamente
       el número que se está viendo.
    */

    guardarProgresoNumeros();


    imagen.classList.add(
        "fade-out"
    );

    titulo.classList.add(
        "fade-out"
    );

    descripcion.classList.add(
        "fade-out"
    );


    setTimeout(() => {

        imagen.src =
            actual.imagen;

        imagen.alt =
            "Número " +
            actual.numero;


        titulo.textContent =
            "Número " +
            actual.numero;


        descripcion.textContent =
            actual.descripcion;


        imagen.classList.remove(
            "fade-out"
        );

        titulo.classList.remove(
            "fade-out"
        );

        descripcion.classList.remove(
            "fade-out"
        );


        imagen.classList.add(
            "fade-in"
        );

        titulo.classList.add(
            "fade-in"
        );

        descripcion.classList.add(
            "fade-in"
        );

    }, 250);


    /*
       Barra propia de la lección.
    */

    const porcentaje =
        ((indiceActual + 1) /
            numeros.length) * 100;


    barra.style.width =
        porcentaje + "%";


    progresoTexto.textContent =
        `${indiceActual + 1} de ${numeros.length}`;


    btnAnterior.disabled =
        indiceActual === 0;

}


// ========================================
// BOTÓN SIGUIENTE
// ========================================

btnSiguiente.addEventListener(
    "click",
    () => {

        if (
            indiceActual <
            numeros.length - 1
        ) {

            indiceActual++;

            mostrarNumero();

        } else {

            /*
               Ya estamos en el número 10.
               Aseguramos el 100%.
            */

            guardarProgresoNumeros();

            pantallaFinal.classList.add(
                "show"
            );

        }

    }
);


// ========================================
// BOTÓN ANTERIOR
// ========================================

btnAnterior.addEventListener(
    "click",
    () => {

        if (indiceActual > 0) {

            indiceActual--;

            mostrarNumero();

        }

    }
);


// ========================================
// NAVEGACIÓN CON TECLADO
// ========================================

document.addEventListener(
    "keydown",
    (e) => {

        if (
            e.key === "ArrowRight"
        ) {

            btnSiguiente.click();

        }


        if (
            e.key === "ArrowLeft"
        ) {

            btnAnterior.click();

        }

    }
);


// ========================================
// BOTÓN VOLVER AL INICIO
// ========================================

if (btnVolver) {

    btnVolver.addEventListener(
        "click",
        () => {

            window.location.href =
                "dashboard.html";

        }
    );

}


// ========================================
// BOTÓN VOLVER DEL HEADER
// ========================================

const btnVolverPagina =
    document.querySelector(
        ".back-btn"
    );


if (btnVolverPagina) {

    btnVolverPagina.addEventListener(
        "click",
        () => {

            window.location.href =
                "dashboard.html";

        }
    );

}


// ========================================
// INICIALIZAR
// ========================================

mostrarNumero();