/* ==========================================
   SIGNBRIDGE - CÁMARA Y RECONOCIMIENTO
   ========================================== */


/* ==========================================
   ELEMENTOS
========================================== */

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas ? canvas.getContext("2d") : null;

const cameraContainer =
    document.querySelector(".camera-container");

const cameraPlaceholder =
    document.getElementById("cameraPlaceholder");

const startCameraButton =
    document.getElementById("startCamera");

const startCameraBottom =
    document.getElementById("startCameraBottom");

const stopCameraButton =
    document.getElementById("stopCamera");

const cameraStatus =
    document.getElementById("cameraStatus");

const gestureResult =
    document.getElementById("gestureResult");

const targetGesture =
    document.getElementById("targetGesture");

const progressBar =
    document.getElementById("progress");

const progressText =
    document.getElementById("progressText");


/* ==========================================
   VARIABLES
========================================== */

let stream = null;

let cameraActiva = false;

let procesando = false;

let animationFrame = null;


/* ==========================================
   MEDIAPIPE HANDS
========================================== */

const hands = new Hands({

    locateFile: (file) => {

        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;

    }

});


hands.setOptions({

    maxNumHands: 1,

    modelComplexity: 1,

    minDetectionConfidence: 0.65,

    minTrackingConfidence: 0.65

});


/* ==========================================
   RESULTADOS DE MEDIAPIPE
========================================== */

hands.onResults((results) => {

    if (!cameraActiva || !canvas || !ctx) {
        return;
    }


    const width = video.videoWidth;
    const height = video.videoHeight;


    if (!width || !height) {
        return;
    }


    /* ======================================
       AJUSTAR CANVAS
    ====================================== */

    if (
        canvas.width !== width ||
        canvas.height !== height
    ) {

        canvas.width = width;
        canvas.height = height;

    }


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    /* ======================================
       DIBUJAR VIDEO COMO ESPEJO
       
       IMPORTANTE:
       El video que ve el usuario es espejo.
    ====================================== */

    ctx.save();

    ctx.translate(width, 0);

    ctx.scale(-1, 1);

    ctx.drawImage(
        video,
        0,
        0,
        width,
        height
    );

    ctx.restore();


    /* ======================================
       COMPROBAR MANO
    ====================================== */

    if (
        results.multiHandLandmarks &&
        results.multiHandLandmarks.length > 0
    ) {

        const originalLandmarks =
            results.multiHandLandmarks[0];


        /*
         * MediaPipe entrega X entre 0 y 1.
         *
         * Como mostramos el video como espejo,
         * también debemos reflejar las coordenadas
         * horizontalmente.
         */

        const landmarks =
            originalLandmarks.map(point => ({

                x: 1 - point.x,

                y: point.y,

                z: point.z

            }));


        /* ==================================
           DIBUJAR CONEXIONES
        ================================== */

        drawConnectors(

            ctx,

            landmarks,

            HAND_CONNECTIONS,

            {

                color: "#24e1d0",

                lineWidth: 3

            }

        );


        /* ==================================
           DIBUJAR PUNTOS
        ================================== */

        drawLandmarks(

            ctx,

            landmarks,

            {

                color: "#ffffff",

                fillColor: "#1264e8",

                lineWidth: 1,

                radius: 4

            }

        );


        /* ==================================
           RESULTADO
        ================================== */

        mostrarManoDetectada();


    } else {

        mostrarEsperando();

    }

});


/* ==========================================
   MOSTRAR MANO DETECTADA
========================================== */

function mostrarManoDetectada() {

    if (gestureResult) {

        gestureResult.innerHTML = `

            <span class="result-icon">
                ✋
            </span>

            <div>

                <strong>
                    Mano detectada
                </strong>

                <p>
                    Perfecto. Mantén tu mano dentro de la cámara.
                </p>

            </div>

        `;

    }


    if (targetGesture) {

        targetGesture.textContent =
            "Mano detectada";

    }


    if (progressBar) {

        progressBar.style.width =
            "35%";

    }


    if (progressText) {

        progressText.textContent =
            "Mano detectada correctamente";

    }

}


/* ==========================================
   ESPERANDO MANO
========================================== */

function mostrarEsperando() {

    if (gestureResult) {

        gestureResult.innerHTML = `

            <span class="result-icon">
                ✋
            </span>

            <div>

                <strong>
                    Buscando tu mano...
                </strong>

                <p>
                    Coloca tu mano frente a la cámara.
                </p>

            </div>

        `;

    }


    if (targetGesture) {

        targetGesture.textContent =
            "Esperando mano";

    }


    if (progressBar) {

        progressBar.style.width =
            "15%";

    }


    if (progressText) {

        progressText.textContent =
            "Esperando detección...";

    }

}


/* ==========================================
   ACTIVAR CÁMARA
========================================== */

async function activarCamara() {

    try {

        /* ------------------------------
           COMPROBAR SOPORTE
        ------------------------------ */

        if (
            !navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia
        ) {

            mostrarErrorCamara(
                "Tu navegador no permite acceder a la cámara."
            );

            return;

        }


        /* ------------------------------
           EVITAR DOBLE CÁMARA
        ------------------------------ */

        if (cameraActiva) {

            return;

        }


        /* ------------------------------
           PEDIR PERMISO
        ------------------------------ */

        stream =
            await navigator.mediaDevices.getUserMedia({

                video: {

                    facingMode: {
                        ideal: "user"
                    },

                    width: {
                        ideal: 1280
                    },

                    height: {
                        ideal: 720
                    }

                },

                audio: false

            });


        /* ------------------------------
           CONECTAR STREAM
        ------------------------------ */

        video.srcObject = stream;


        /* ------------------------------
           ESPERAR VIDEO
        ------------------------------ */

        await new Promise((resolve) => {

            if (video.readyState >= 2) {

                resolve();

                return;

            }


            video.addEventListener(
                "loadedmetadata",
                resolve,
                {
                    once: true
                }
            );

        });


        await video.play();


        /* ------------------------------
           ACTIVAR ESTADO
        ------------------------------ */

        cameraActiva = true;

        procesando = false;


        /* ------------------------------
           PREPARAR CANVAS
        ------------------------------ */

        canvas.width =
            video.videoWidth || 1280;

        canvas.height =
            video.videoHeight || 720;


        /* ------------------------------
           MOSTRAR CÁMARA
        ------------------------------ */

        if (cameraContainer) {

            cameraContainer.classList.add(
                "active"
            );

        }


        if (cameraPlaceholder) {

            cameraPlaceholder.classList.add(
                "hidden"
            );

        }


        /* ------------------------------
           ESTADO
        ------------------------------ */

        if (cameraStatus) {

            cameraStatus.textContent =
                "Cámara activa";

        }


        /* ------------------------------
           BOTÓN PRINCIPAL
        ------------------------------ */

        if (startCameraButton) {

            startCameraButton.textContent =
                "Cámara activada";

            startCameraButton.disabled =
                true;

        }


        /* ------------------------------
           BOTÓN INFERIOR
        ------------------------------ */

        if (startCameraBottom) {

            startCameraBottom.disabled =
                true;

            startCameraBottom.textContent =
                "Cámara activada";

        }


        /* ------------------------------
           INICIAR MEDIAPIPE
        ------------------------------ */

        procesarVideo();


    } catch (error) {

        console.error(
            "Error al activar la cámara:",
            error
        );


        cameraActiva = false;


        if (error.name === "NotAllowedError") {

            mostrarErrorCamara(
                "Permiso de cámara denegado. Permite el acceso a la cámara desde el navegador."
            );

        } else if (
            error.name === "NotFoundError"
        ) {

            mostrarErrorCamara(
                "No se encontró ninguna cámara disponible."
            );

        } else {

            mostrarErrorCamara(
                "No se pudo activar la cámara. Revisa los permisos del navegador."
            );

        }


        detenerCamara();

    }

}


/* ==========================================
   MOSTRAR ERROR DE CÁMARA
========================================== */

function mostrarErrorCamara(mensaje) {

    if (gestureResult) {

        gestureResult.innerHTML = `

            <span class="result-icon">
                ⚠️
            </span>

            <div>

                <strong>
                    No se pudo activar la cámara
                </strong>

                <p>
                    ${mensaje}
                </p>

            </div>

        `;

    }

    console.error(mensaje);

}


/* ==========================================
   PROCESAR VIDEO
========================================== */

async function procesarVideo() {

    if (!cameraActiva) {

        return;

    }


    if (
        video.readyState >= 2 &&
        !procesando
    ) {

        procesando = true;


        try {

            await hands.send({

                image: video

            });


        } catch (error) {

            console.error(
                "Error procesando la cámara:",
                error
            );

        }


        procesando = false;

    }


    animationFrame =
        requestAnimationFrame(
            procesarVideo
        );

}


/* ==========================================
   DETENER CÁMARA
========================================== */

function detenerCamara() {

    cameraActiva = false;

    procesando = false;


    /* ------------------------------
       CANCELAR ANIMACIÓN
    ------------------------------ */

    if (animationFrame) {

        cancelAnimationFrame(
            animationFrame
        );

        animationFrame = null;

    }


    /* ------------------------------
       CERRAR STREAM
    ------------------------------ */

    if (stream) {

        stream
            .getTracks()
            .forEach(track => {

                track.stop();

            });

        stream = null;

    }


    /* ------------------------------
       LIMPIAR VIDEO
    ------------------------------ */

    if (video) {

        video.pause();

        video.srcObject = null;

    }


    /* ------------------------------
       LIMPIAR CANVAS
    ------------------------------ */

    if (canvas && ctx) {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

    }


    /* ------------------------------
       MOSTRAR PLACEHOLDER
    ------------------------------ */

    if (cameraPlaceholder) {

        cameraPlaceholder.classList.remove(
            "hidden"
        );

    }


    /* ------------------------------
       ESTADO
    ------------------------------ */

    if (cameraStatus) {

        cameraStatus.textContent =
            "Cámara desactivada";

    }


    /* ------------------------------
       BOTÓN PRINCIPAL
    ------------------------------ */

    if (startCameraButton) {

        startCameraButton.textContent =
            "Activar cámara";

        startCameraButton.disabled =
            false;

    }


    /* ------------------------------
       BOTÓN INFERIOR
    ------------------------------ */

    if (startCameraBottom) {

        startCameraBottom.textContent =
            "📷 Activar cámara";

        startCameraBottom.disabled =
            false;

    }


    /* ------------------------------
       RESULTADO
    ------------------------------ */

    if (gestureResult) {

        gestureResult.innerHTML = `

            <span class="result-icon">
                ✋
            </span>

            <div>

                <strong>
                    Esperando una seña
                </strong>

                <p>
                    Coloca tu mano frente a la cámara.
                </p>

            </div>

        `;

    }


    if (targetGesture) {

        targetGesture.textContent =
            "Próximamente";

    }


    if (progressBar) {

        progressBar.style.width =
            "0%";

    }


    if (progressText) {

        progressText.textContent =
            "Preparando reconocimiento...";

    }

}


/* ==========================================
   BOTÓN PRINCIPAL
========================================== */

if (startCameraButton) {

    startCameraButton.addEventListener(
        "click",
        activarCamara
    );

}


/* ==========================================
   BOTÓN INFERIOR
========================================== */

if (startCameraBottom) {

    startCameraBottom.addEventListener(
        "click",
        activarCamara
    );

}


/* ==========================================
   BOTÓN DETENER
========================================== */

if (stopCameraButton) {

    stopCameraButton.addEventListener(
        "click",
        detenerCamara
    );

}


/* ==========================================
   CERRAR PÁGINA
========================================== */

window.addEventListener(
    "beforeunload",
    detenerCamara
);