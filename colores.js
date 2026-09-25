// ==========================================
// SIGNBRIDGE - CURSO DE COLORES BÁSICOS
// PROGRESO POR USUARIO
// ==========================================


// ==========================================
// LECCIONES
// ==========================================

const lecciones = [

    {
        nombre: "ROJO",
        emoji: "🔴",
        descripcion:
            "Aprende el nombre del color rojo y observa la seña correspondiente."
    },

    {
        nombre: "AZUL",
        emoji: "🔵",
        descripcion:
            "Aprende el nombre del color azul y observa la seña correspondiente."
    },

    {
        nombre: "AMARILLO",
        emoji: "🟡",
        descripcion:
            "Aprende el nombre del color amarillo y observa la seña correspondiente."
    },

    {
        nombre: "VERDE",
        emoji: "🟢",
        descripcion:
            "Aprende el nombre del color verde y observa la seña correspondiente."
    },

    {
        nombre: "NEGRO",
        emoji: "⚫",
        descripcion:
            "Aprende el nombre del color negro y observa la seña correspondiente."
    },

    {
        nombre: "BLANCO",
        emoji: "⚪",
        descripcion:
            "Aprende el nombre del color blanco y observa la seña correspondiente."
    },

    {
        nombre: "NARANJA",
        emoji: "🟠",
        descripcion:
            "Aprende el nombre del color naranja y observa la seña correspondiente."
    },

    {
        nombre: "MORADO",
        emoji: "🟣",
        descripcion:
            "Aprende el nombre del color morado y observa la seña correspondiente."
    },

    {
        nombre: "ROSA",
        emoji: "🩷",
        descripcion:
            "Aprende el nombre del color rosa y observa la seña correspondiente."
    },

    {
        nombre: "CAFÉ",
        emoji: "🟤",
        descripcion:
            "Aprende el nombre del color café y observa la seña correspondiente."
    }

];


// ==========================================
// VARIABLE PRINCIPAL
// ==========================================

let leccionActual = 0;


// ==========================================
// ELEMENTOS HTML
// ==========================================

const numeroLeccion =
    document.getElementById("numeroLeccion");

const tituloColor =
    document.getElementById("tituloColor");

const descripcion =
    document.getElementById("descripcion");

const nombreColor =
    document.getElementById("nombreColor");

const colorPreview =
    document.getElementById("colorPreview");

const progresoTexto =
    document.getElementById("progresoTexto");

const barra =
    document.getElementById("barra");

const anterior =
    document.getElementById("anterior");

const siguiente =
    document.getElementById("siguiente");

const finalScreen =
    document.getElementById("finalScreen");

const volver =
    document.getElementById("volver");

const volverCursos =
    document.getElementById("volverCursos");


// ==========================================
// OBTENER USUARIO ACTIVO
// ==========================================

function obtenerUsuarioActivo() {

    try {

        const datos =
            localStorage.getItem(
                "usuarioSignbridge"
            );

        if (!datos) {

            console.warn(
                "No hay usuario activo."
            );

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


// ==========================================
// GUARDAR USUARIO ACTUALIZADO
// ==========================================

function guardarUsuarioActivo(usuario) {

    try {

        // Guardar usuario actual
        localStorage.setItem(
            "usuarioSignbridge",
            JSON.stringify(usuario)
        );


        // Actualizar lista general de usuarios
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
            "Error guardando usuario:",
            error
        );
    }
}


// ==========================================
// GUARDAR PROGRESO DE COLORES
// ==========================================

function guardarProgresoColores() {

    const usuario =
        obtenerUsuarioActivo();


    if (!usuario) {
        return;
    }


    // Crear objeto progreso si no existe
    if (!usuario.progreso) {

        usuario.progreso = {};
    }


    // Asegurar los cursos existentes
    if (
        typeof usuario.progreso.abecedario !==
        "number"
    ) {

        usuario.progreso.abecedario = 0;
    }


    if (
        typeof usuario.progreso.numeros !==
        "number"
    ) {

        usuario.progreso.numeros = 0;
    }


    if (
        typeof usuario.progreso.saludos !==
        "number"
    ) {

        usuario.progreso.saludos = 0;
    }


    if (
        typeof usuario.progreso.reconocimiento !==
        "number"
    ) {

        usuario.progreso.reconocimiento = 0;
    }


    if (
        typeof usuario.progreso.colores !==
        "number"
    ) {

        usuario.progreso.colores = 0;
    }


    // Calcular porcentaje
    const porcentaje =
        Math.round(
            (
                (leccionActual + 1) /
                lecciones.length
            ) * 100
        );


    // Obtener progreso anterior
    const progresoActual =
        Number(
            usuario.progreso.colores
        ) || 0;


    // Nunca disminuir progreso
    usuario.progreso.colores =
        Math.max(
            progresoActual,
            porcentaje
        );


    // Guardar
    guardarUsuarioActivo(
        usuario
    );


    console.log(
        "✓ Progreso Colores:",
        usuario.progreso.colores + "%"
    );
}


// ==========================================
// MOSTRAR LECCIÓN
// ==========================================

function mostrarLeccion() {

    const leccion =
        lecciones[leccionActual];


    if (!leccion) {
        return;
    }


    // Guardar progreso
    guardarProgresoColores();


    // Número
    numeroLeccion.textContent =
        leccionActual + 1;


    // Título
    tituloColor.textContent =
        leccion.nombre;


    // Descripción
    descripcion.textContent =
        leccion.descripcion;


    // Nombre del color
    nombreColor.textContent =
        leccion.nombre;


    // Emoji
    colorPreview.textContent =
        leccion.emoji;


    // Porcentaje
    const porcentaje =
        Math.round(
            (
                (leccionActual + 1) /
                lecciones.length
            ) * 100
        );


    progresoTexto.textContent =
        porcentaje + "%";


    barra.style.width =
        porcentaje + "%";


    // Botón anterior
    anterior.disabled =
        leccionActual === 0;


    // Botón siguiente
    if (
        leccionActual ===
        lecciones.length - 1
    ) {

        siguiente.textContent =
            "Finalizar curso ✓";

    } else {

        siguiente.textContent =
            "Siguiente →";
    }


    // Ocultar pantalla final
    finalScreen.classList.add(
        "hidden"
    );


    // Mostrar navegación
    anterior.style.display =
        "";

    siguiente.style.display =
        "";
}


// ==========================================
// BOTÓN SIGUIENTE
// ==========================================

siguiente.addEventListener(
    "click",
    function () {

        if (
            leccionActual <
            lecciones.length - 1
        ) {

            leccionActual++;

            mostrarLeccion();


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        } else {

            finalizarCurso();
        }

    }
);


// ==========================================
// BOTÓN ANTERIOR
// ==========================================

anterior.addEventListener(
    "click",
    function () {

        if (
            leccionActual > 0
        ) {

            leccionActual--;

            mostrarLeccion();


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }

    }
);


// ==========================================
// FINALIZAR CURSO
// ==========================================

function finalizarCurso() {

    const usuario =
        obtenerUsuarioActivo();


    if (usuario) {

        if (!usuario.progreso) {
            usuario.progreso = {};
        }


        // Curso completado
        usuario.progreso.colores =
            100;


        guardarUsuarioActivo(
            usuario
        );
    }


    // Mostrar pantalla final
    finalScreen.classList.remove(
        "hidden"
    );


    // Ocultar navegación
    anterior.style.display =
        "none";

    siguiente.style.display =
        "none";


    // Asegurar 100%
    progresoTexto.textContent =
        "100%";

    barra.style.width =
        "100%";


    // Llevar usuario a la pantalla final
    finalScreen.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });


    console.log(
        "✓ Curso de Colores completado."
    );
}


// ==========================================
// BOTÓN VOLVER
// ==========================================

volver.addEventListener(
    "click",
    function () {

        window.location.href =
            "cursos.html";

    }
);


// ==========================================
// VOLVER A COLORES
// ==========================================

volverCursos.addEventListener(
    "click",
    function () {

        window.location.href =
            "colores-cursos.html";

    }
);


// ==========================================
// INICIAR CURSO
// ==========================================

mostrarLeccion();