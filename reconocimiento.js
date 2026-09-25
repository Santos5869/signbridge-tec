/* =========================================================
   SIGNBRIDGE
   RECONOCIMIENTO DE SEÑAS A-Z
   ========================================================= */

"use strict";

/* =========================================================
   ELEMENTOS HTML
   ========================================================= */

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas ? canvas.getContext("2d") : null;

const startCameraButton =
    document.getElementById("startCamera");

const stopCameraButton =
    document.getElementById("stopCamera");

const cameraMessage =
    document.getElementById("cameraMessage");

const cameraStatus =
    document.getElementById("cameraStatus");

const currentSignElement =
    document.getElementById("currentSign");

const signReferenceImage =
    document.getElementById("signReferenceImage");

const practiceResult =
    document.getElementById("practiceResult");

const resultTitle =
    document.getElementById("resultTitle");

const resultText =
    document.getElementById("resultText");

const progress =
    document.getElementById("progress");

const progressPercent =
    document.getElementById("progressPercent");

const progressText =
    document.getElementById("progressText");


/* =========================================================
   ABECEDARIO
   NO INCLUIMOS Ñ
   ========================================================= */

const letras = [
    "A", "B", "C", "D", "E", "F",
    "G", "H", "I", "J", "K", "L",
    "M", "N", "O", "P", "Q", "R",
    "S", "T", "U", "V", "W", "X",
    "Y", "Z"
];


/* =========================================================
   ESTADO
   ========================================================= */

let indiceActual = 0;

let cameraActiva = false;

let procesando = false;

let animationFrame = null;

let stream = null;

let ultimaMano = null;

let manoDetectada = false;


/* =========================================================
   CONTROL DEL RECONOCIMIENTO
   ========================================================= */

/*
   No aceptamos una postura por un solo frame.
*/

const FRAMES_NECESARIOS = 7;


/*
   Menor = más estricto.
   Mayor = más permisivo.

   0.25 es un valor moderado.
*/

const UMBRAL_RECONOCIMIENTO = 0.25;

let framesCoincidentes = 0;

let letraConfirmada = false;


/* =========================================================
   MEDIAPIPE
   ========================================================= */

if (typeof Hands === "undefined") {

    console.error(
        "MediaPipe Hands no está cargado."
    );

} else {

    window.signBridgeHands = new Hands({

        locateFile: (file) => {

            return (
                "https://cdn.jsdelivr.net/npm/@mediapipe/hands/" +
                file
            );

        }

    });


    window.signBridgeHands.setOptions({

        maxNumHands: 1,

        modelComplexity: 1,

        minDetectionConfidence: 0.60,

        minTrackingConfidence: 0.60

    });


    window.signBridgeHands.onResults(
        recibirResultados
    );
}


/* =========================================================
   NORMALIZAR MANO ACTUAL
   ========================================================= */

function normalizarMano(puntos) {

    if (
        !Array.isArray(puntos) ||
        puntos.length !== 21
    ) {

        return null;

    }


    const origen = puntos[0];


    const relativos = puntos.map(
        (punto) => {

            return {

                x:
                    punto.x -
                    origen.x,

                y:
                    punto.y -
                    origen.y,

                z:
                    (punto.z || 0) -
                    (origen.z || 0)

            };

        }
    );


    const referencia =
        relativos[9];


    let escala =
        Math.sqrt(
            referencia.x *
                referencia.x +

            referencia.y *
                referencia.y +

            referencia.z *
                referencia.z
        );


    if (
        !Number.isFinite(escala) ||
        escala < 0.0001
    ) {

        escala = 1;

    }


    return relativos.map(
        (punto) => {

            return {

                x:
                    punto.x /
                    escala,

                y:
                    punto.y /
                    escala,

                z:
                    punto.z /
                    escala

            };

        }
    );
}


/* =========================================================
   DISTANCIA ENTRE POSTURAS
   ========================================================= */

function distanciaPosturas(
    postura1,
    postura2
) {

    if (
        !Array.isArray(postura1) ||
        !Array.isArray(postura2)
    ) {

        return Infinity;

    }


    if (
        postura1.length !== 21 ||
        postura2.length !== 21
    ) {

        return Infinity;

    }


    let suma = 0;


    for (
        let i = 0;
        i < 21;
        i++
    ) {

        const a = postura1[i];

        const b = postura2[i];


        if (!a || !b) {

            return Infinity;

        }


        const dx =
            Number(a.x) -
            Number(b.x);

        const dy =
            Number(a.y) -
            Number(b.y);

        const dz =
            Number(a.z || 0) -
            Number(b.z || 0);


        suma += Math.sqrt(
            dx * dx +
            dy * dy +
            dz * dz
        );

    }


    return suma / 21;
}


/* =========================================================
   OBTENER POSTURAS GUARDADAS
   ========================================================= */

function obtenerPosturasGuardadas(
    letra
) {

    letra =
        String(letra)
            .trim()
            .toUpperCase();


    /*
       posturas.js es nuestro sistema principal.

       Las posturas están guardadas bajo:

       signbridge_posturas

       y posturas.js expone:

       window.obtenerPosturas()
    */

    if (
        typeof window.obtenerPosturas ===
        "function"
    ) {

        try {

            const guardadas =
                window.obtenerPosturas(
                    letra
                );


            if (
                Array.isArray(guardadas)
            ) {

                console.log(
                    `✓ ${letra}: ${guardadas.length} posturas encontradas`
                );

                return guardadas;

            }

        } catch (error) {

            console.error(
                "Error usando obtenerPosturas():",
                error
            );

        }

    }


    /*
       Respaldo directo a localStorage.
    */

    try {

        const datos =
            localStorage.getItem(
                "signbridge_posturas"
            );


        if (!datos) {

            return [];

        }


        const todas =
            JSON.parse(datos);


        if (
            todas &&
            Array.isArray(
                todas[letra]
            )
        ) {

            console.log(
                `✓ ${letra}: ${todas[letra].length} posturas encontradas`
            );

            return todas[letra];

        }

    } catch (error) {

        console.error(
            "Error leyendo signbridge_posturas:",
            error
        );

    }


    return [];
}


/* =========================================================
   CARGAR POSTURAS DE UNA LETRA
   ========================================================= */

function cargarPosturasDeLetra(
    letra
) {

    const guardadas =
        obtenerPosturasGuardadas(
            letra
        );


    /*
       IMPORTANTE:

       posturas.js YA NORMALIZA las muestras
       antes de guardarlas.

       Por eso NO hacemos:

       guardadas.map(normalizarMano)

       porque eso normalizaría dos veces.
    */

    return guardadas.filter(
        (postura) => {

            return (
                Array.isArray(postura) &&
                postura.length === 21
            );

        }
    );
}


/* =========================================================
   COMPARAR MANO CON LETRA
   ========================================================= */

function compararConLetra(
    puntos,
    letra
) {

    const actual =
        normalizarMano(
            puntos
        );


    if (!actual) {

        return {

            coincide: false,

            distancia: Infinity,

            cantidad: 0

        };

    }


    const posturas =
        cargarPosturasDeLetra(
            letra
        );


    if (
        posturas.length === 0
    ) {

        return {

            coincide: false,

            distancia: Infinity,

            cantidad: 0

        };

    }


    let mejorDistancia =
        Infinity;


    /*
       Comparamos contra todas
       las muestras guardadas.
    */

    for (
        const postura of posturas
    ) {

        const distancia =
            distanciaPosturas(
                actual,
                postura
            );


        if (
            distancia <
            mejorDistancia
        ) {

            mejorDistancia =
                distancia;

        }

    }


    return {

        coincide:
            mejorDistancia <=
            UMBRAL_RECONOCIMIENTO,

        distancia:
            mejorDistancia,

        cantidad:
            posturas.length

    };
}


/* =========================================================
   RECONOCER LETRA ACTUAL
   ========================================================= */

function reconocerLetraActual(
    puntos
) {

    const letra =
        letras[indiceActual];


    if (!letra) {

        return;

    }


    const resultado =
        compararConLetra(
            puntos,
            letra
        );


    /*
       No hay posturas.
    */

    if (
        resultado.cantidad === 0
    ) {

        framesCoincidentes = 0;


        mostrarResultado(

            "warning",

            `Faltan posturas para ${letra}`,

            `No hay posturas guardadas para la letra ${letra}.`

        );


        return;

    }


    /*
       POSTURA CORRECTA
    */

    if (
        resultado.coincide
    ) {

        framesCoincidentes++;


        if (cameraStatus) {

            cameraStatus.textContent =
                `● Postura ${letra} detectada`;

            cameraStatus.style.color =
                "#39df9b";

        }


        mostrarResultado(

            "success",

            `Postura correcta: ${letra}`,

            `Mantén la posición... ${Math.min(
                framesCoincidentes,
                FRAMES_NECESARIOS
            )}/${FRAMES_NECESARIOS}`

        );


        /*
           Confirmamos solamente después
           de varios frames consecutivos.
        */

        if (
            framesCoincidentes >=
            FRAMES_NECESARIOS &&

            !letraConfirmada
        ) {

            confirmarLetra();

        }

    } else {

        /*
           Postura incorrecta.
        */

        framesCoincidentes = 0;


        if (cameraStatus) {

            cameraStatus.textContent =
                "● Mano detectada";

            cameraStatus.style.color =
                "#f5b942";

        }


        mostrarResultado(

            "warning",

            `Aún no es la ${letra}`,

            "Coloca tu mano como aparece en la imagen de referencia."

        );

    }
}


/* =========================================================
   CONFIRMAR LETRA
   ========================================================= */

function confirmarLetra() {

    if (letraConfirmada) {

        return;

    }


    letraConfirmada = true;


    const letra =
        letras[indiceActual];


    framesCoincidentes = 0;


    if (cameraStatus) {

        cameraStatus.textContent =
            `✓ Letra ${letra} correcta`;

        cameraStatus.style.color =
            "#39df9b";

    }


    mostrarResultado(

        "success",

        `✓ ¡Correcto! Es la ${letra}`,

        "Muy bien. Preparando la siguiente letra..."

    );


    /*
       NO apagamos la cámara.
    */

    setTimeout(

        () => {

            siguienteLetra();

        },

        900

    );
}


/* =========================================================
   SIGUIENTE LETRA
   ========================================================= */

function siguienteLetra() {

    indiceActual++;

    framesCoincidentes = 0;

    letraConfirmada = false;


    /*
       TERMINÓ EL ABECEDARIO
    */

    if (
        indiceActual >=
        letras.length
    ) {

        indiceActual =
            letras.length - 1;


        if (cameraStatus) {

            cameraStatus.textContent =
                "✓ Abecedario completado";

            cameraStatus.style.color =
                "#39df9b";

        }


        mostrarResultado(

            "success",

            "🎉 ¡Abecedario completado!",

            "Has completado todas las letras correctamente."

        );


        actualizarProgreso();


        return;

    }


    mostrarSenaActual();
}


/* =========================================================
   MOSTRAR LETRA ACTUAL
   ========================================================= */

function mostrarSenaActual() {

    const letra =
        letras[indiceActual];


    if (!letra) {

        return;

    }


    if (currentSignElement) {

        currentSignElement.textContent =
            letra;

    }


    const titulo =
        document.querySelector(
            ".reference-title h3"
        );


    if (titulo) {

        titulo.textContent =
            `Letra ${letra}`;

    }


    const descripcion =
        document.querySelector(
            ".reference-title p"
        );


    if (descripcion) {

        descripcion.textContent =
            "Observa la referencia y reproduce la posición de la mano.";

    }


    /*
       Imagen de referencia.
    */

    if (signReferenceImage) {

        signReferenceImage.src =
            `../images/abecedario/${letra}.png`;

        signReferenceImage.alt =
            `Seña de la letra ${letra}`;

    }


    actualizarProgreso();


    /*
       Reiniciamos únicamente el reconocimiento.

       LA CÁMARA NO SE APAGA.
    */

    ultimaMano = null;

    framesCoincidentes = 0;

    letraConfirmada = false;


    const cantidad =
        obtenerPosturasGuardadas(
            letra
        ).length;


    if (
        cantidad === 0
    ) {

        mostrarResultado(

            "warning",

            `Letra ${letra}`,

            `No se encontraron posturas guardadas para ${letra}.`

        );

    } else {

        mostrarResultado(

            "ready",

            `Haz la seña ${letra}`,

            `Tengo ${cantidad} postura(s) guardada(s) para comparar.`

        );

    }
}


/* =========================================================
   PROGRESO
   ========================================================= */

function actualizarProgreso() {

    const total =
        letras.length;


    /*
       0% al comenzar A.
       100% al terminar Z.
    */

    const porcentaje =
        Math.round(
            (indiceActual /
                (total - 1)) *
            100
        );


    const porcentajeSeguro =
        Math.max(
            0,
            Math.min(
                100,
                porcentaje
            )
        );


    if (progress) {

        progress.style.width =
            `${porcentajeSeguro}%`;

    }


    if (progressPercent) {

        progressPercent.textContent =
            `${porcentajeSeguro}%`;

    }


    if (progressText) {

        progressText.textContent =
            `${indiceActual + 1} de ${total}`;

    }
}


/* =========================================================
   MOSTRAR RESULTADO
   ========================================================= */

function mostrarResultado(
    tipo,
    titulo,
    texto
) {

    if (resultTitle) {

        resultTitle.textContent =
            titulo;

    }


    if (resultText) {

        resultText.textContent =
            texto;

    }


    if (!practiceResult) {

        return;

    }


    practiceResult.classList.remove(

        "success",

        "warning",

        "error"

    );


    if (
        tipo === "success"
    ) {

        practiceResult.classList.add(
            "success"
        );

    }


    if (
        tipo === "warning"
    ) {

        practiceResult.classList.add(
            "warning"
        );

    }


    if (
        tipo === "error"
    ) {

        practiceResult.classList.add(
            "error"
        );

    }
}


/* =========================================================
   RESULTADOS DE MEDIAPIPE
   ========================================================= */

function recibirResultados(
    results
) {

    /*
       Si la cámara está apagada,
       no hacemos nada.

       Quitar la mano NO apaga la cámara.
    */

    if (!cameraActiva) {

        return;

    }


    if (
        !video ||
        !canvas ||
        !ctx
    ) {

        return;

    }


    const width =
        video.videoWidth;


    const height =
        video.videoHeight;


    if (
        !width ||
        !height
    ) {

        return;

    }


    if (
        canvas.width !== width ||
        canvas.height !== height
    ) {

        canvas.width =
            width;

        canvas.height =
            height;

    }


    ctx.clearRect(

        0,

        0,

        width,

        height

    );


    /*
       MANO DETECTADA
    */

    if (
        results.multiHandLandmarks &&

        results.multiHandLandmarks.length > 0
    ) {

        const puntosOriginales =
            results.multiHandLandmarks[0];


        /*
           Espejamos X para coincidir
           con la cámara frontal.
        */

        const puntos =
            puntosOriginales.map(

                (punto) => ({

                    x:
                        1 -
                        punto.x,

                    y:
                        punto.y,

                    z:
                        punto.z

                })

            );


        ultimaMano =
            puntos;


        manoDetectada =
            true;


        /*
           Dibujar conexiones.
        */

        if (
            typeof drawConnectors ===
                "function" &&

            typeof HAND_CONNECTIONS !==
                "undefined"
        ) {

            drawConnectors(

                ctx,

                puntos,

                HAND_CONNECTIONS,

                {

                    color:
                        "#20e0d0",

                    lineWidth:
                        3

                }

            );

        }


        /*
           Dibujar puntos.
        */

        if (
            typeof drawLandmarks ===
            "function"
        ) {

            drawLandmarks(

                ctx,

                puntos,

                {

                    color:
                        "#ffffff",

                    fillColor:
                        "#176ce8",

                    radius:
                        4,

                    lineWidth:
                        1

                }

            );

        }


        /*
           RECONOCIMIENTO.
        */

        reconocerLetraActual(
            puntos
        );


    } else {

        /*
           NO HAY MANO.

           IMPORTANTE:
           NO apagamos la cámara.
        */

        ultimaMano =
            null;

        manoDetectada =
            false;

        framesCoincidentes =
            0;


        if (cameraStatus) {

            cameraStatus.textContent =
                "● Buscando mano";

            cameraStatus.style.color =
                "#7185a7";

        }


        mostrarResultado(

            "normal",

            "Buscando tu mano...",

            `Coloca tu mano frente a la cámara para hacer la seña ${letras[indiceActual]}.`

        );

    }
}


/* =========================================================
   ACTIVAR CÁMARA
   ========================================================= */

async function activarCamara() {

    if (cameraActiva) {

        return;

    }


    try {

        if (
            !navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia
        ) {

            mostrarResultado(

                "error",

                "Cámara no disponible",

                "Este navegador no permite acceder a la cámara."

            );

            return;

        }


        /*
           Pedimos únicamente video.
        */

        stream =
            await navigator.mediaDevices.getUserMedia({

                video: {

                    facingMode:
                        "user",

                    width: {

                        ideal:
                            1280

                    },

                    height: {

                        ideal:
                            720

                    }

                },

                audio:
                    false

            });


        video.srcObject =
            stream;


        /*
           Esperamos que el video
           tenga sus dimensiones.
        */

        await new Promise(

            (resolve) => {

                if (
                    video.readyState >= 2
                ) {

                    resolve();

                    return;

                }


                video.addEventListener(

                    "loadedmetadata",

                    resolve,

                    {

                        once:
                            true

                    }

                );

            }

        );


        await video.play();


        cameraActiva =
            true;


        procesando =
            false;


        ultimaMano =
            null;


        framesCoincidentes =
            0;


        if (cameraMessage) {

            cameraMessage.classList.add(
                "hidden"
            );

        }


        if (startCameraButton) {

            startCameraButton.disabled =
                true;

            startCameraButton.textContent =
                "Cámara activa";

        }


        if (stopCameraButton) {

            stopCameraButton.disabled =
                false;

        }


        if (cameraStatus) {

            cameraStatus.textContent =
                "● Cámara activa";

            cameraStatus.style.color =
                "#39df9b";

        }


        mostrarSenaActual();


        iniciarProcesamiento();


        console.log(
            "✓ SignBridge: cámara activada correctamente."
        );


    } catch (error) {

        console.error(
            "Error al activar cámara:",
            error
        );


        cameraActiva =
            false;


        /*
           Si ocurrió un error,
           liberamos el stream.
        */

        if (stream) {

            stream
                .getTracks()
                .forEach(

                    (track) => {

                        track.stop();

                    }

                );

            stream = null;

        }


        if (
            error.name ===
            "NotAllowedError"
        ) {

            mostrarResultado(

                "error",

                "Permiso denegado",

                "Permite el acceso a la cámara desde el navegador."

            );


        } else if (
            error.name ===
            "NotFoundError"
        ) {

            mostrarResultado(

                "error",

                "Cámara no encontrada",

                "No se encontró ninguna cámara disponible."

            );


        } else {

            mostrarResultado(

                "error",

                "No se pudo activar la cámara",

                error.message ||
                "Revisa los permisos de la cámara."

            );

        }

    }

}


/* =========================================================
   PROCESAR VIDEO
   ========================================================= */

async function procesarVideo() {

    if (!cameraActiva) {

        return;

    }


    if (
        video.readyState >= 2 &&
        !procesando
    ) {

        procesando =
            true;


        try {

            if (
                window.signBridgeHands
            ) {

                await window.signBridgeHands.send({

                    image:
                        video

                });

            }

        } catch (error) {

            console.error(
                "Error procesando mano:",
                error
            );

        }


        procesando =
            false;

    }


    /*
       Seguimos procesando aunque
       no haya mano.
    */

    animationFrame =
        requestAnimationFrame(
            procesarVideo
        );
}


/* =========================================================
   INICIAR PROCESAMIENTO
   ========================================================= */

function iniciarProcesamiento() {

    if (
        animationFrame
    ) {

        cancelAnimationFrame(
            animationFrame
        );

    }


    animationFrame =
        requestAnimationFrame(
            procesarVideo
        );
}


/* =========================================================
   DETENER CÁMARA
   ========================================================= */

function detenerCamara() {

    cameraActiva =
        false;


    procesando =
        false;


    ultimaMano =
        null;


    manoDetectada =
        false;


    framesCoincidentes =
        0;


    if (
        animationFrame
    ) {

        cancelAnimationFrame(
            animationFrame
        );

        animationFrame =
            null;

    }


    if (stream) {

        stream
            .getTracks()
            .forEach(

                (track) => {

                    track.stop();

                }

            );

        stream =
            null;

    }


    if (video) {

        video.pause();

        video.srcObject =
            null;

    }


    if (
        canvas &&
        ctx
    ) {

        ctx.clearRect(

            0,

            0,

            canvas.width,

            canvas.height

        );

    }


    if (cameraMessage) {

        cameraMessage.classList.remove(
            "hidden"
        );

    }


    if (startCameraButton) {

        startCameraButton.disabled =
            false;

        startCameraButton.textContent =
            "Activar cámara";

    }


    if (stopCameraButton) {

        stopCameraButton.disabled =
            true;

    }


    if (cameraStatus) {

        cameraStatus.textContent =
            "● Esperando";

        cameraStatus.style.color =
            "#7185a7";

    }


    mostrarResultado(

        "normal",

        "Cámara detenida",

        "Activa la cámara para comenzar."

    );

}


/* =========================================================
   BOTÓN ACTIVAR
   ========================================================= */

if (
    startCameraButton
) {

    startCameraButton.addEventListener(

        "click",

        activarCamara

    );

}


/* =========================================================
   BOTÓN DETENER
   ========================================================= */

if (
    stopCameraButton
) {

    stopCameraButton.addEventListener(

        "click",

        detenerCamara

    );

}


/* =========================================================
   INICIO
   ========================================================= */

mostrarSenaActual();


/* =========================================================
   LIMPIAR AL SALIR
   ========================================================= */

window.addEventListener(

    "beforeunload",

    () => {

        detenerCamara();

    }

);


/* =========================================================
   DEBUG
   ========================================================= */

window.SignBridgeRecognition = {

    letras,

    obtenerPosturasGuardadas,

    compararConLetra,

    normalizarMano,

    siguienteLetra,

    activarCamara,

    detenerCamara

};


console.log(
    "✓ SignBridge reconocimiento cargado correctamente."
);