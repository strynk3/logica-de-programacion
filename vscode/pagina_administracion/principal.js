// ==========================================
// 1. CONFIGURACIÓN Y ESTADO GLOBAL
// ==========================================
const CONFIG = {
    PASSWORD: 'admin123',
    SECTIONS: ['inicio', 'citas', 'calendario', 'actividad']
};

// Mapa de nombres para los revisores
const NOMBRES_JUEZ = {
    'juez1': 'Oficial Jurisdiccional',
    'juez2': 'Secretaria',
    'juez3': 'Recepcionista'
};

const API_URL = "/citas";

const AppState = {
    currentSection: 'inicio',
    isAuthenticated: false,
    isMobileMenuOpen: false
};

let citasServidor = {};

// ==========================================
// 2. FUNCIONES DE CARGA DE CITAS
// ==========================================
async function cargarCitasDesdeServidor() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const citas = await res.json();
        citasServidor = {};
        
        citas.forEach(cita => {
            const fechaObj = new Date(cita.fecha);
            const fechaFormateada = fechaObj.toISOString().split('T')[0];
            
            if (!citasServidor[fechaFormateada]) {
                citasServidor[fechaFormateada] = [];
            }
            
            // Asegurar estructura consistente
            cita.decisiones = cita.decisiones || {};
            cita.estado = cita.estado || 'pendiente';
            
            // Si el servidor devuelve juez1, juez2, juez3, convertirlos a decisiones
            if (cita.juez1 || cita.juez2 || cita.juez3) {
                if (cita.juez1) cita.decisiones.juez1 = { tipo: cita.juez1 };
                if (cita.juez2) cita.decisiones.juez2 = { tipo: cita.juez2 };
                if (cita.juez3) cita.decisiones.juez3 = { tipo: cita.juez3 };
            }
            
            citasServidor[fechaFormateada].push(cita);
        });
        
        console.log('Citas cargadas:', citasServidor);
        renderNotificaciones();
        return true;
    } catch (error) {
        console.error('Error al cargar citas:', error);
        return false;
    }
}

// ==========================================
// 3. FUNCIÓN PARA GUARDAR CITA EN EL SERVIDOR
// ==========================================
async function guardarCitaServidor(cita) {
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cita)
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();
        console.log('Cita guardada exitosamente:', result);
        return result;
    } catch (error) {
        console.error('Error al guardar cita:', error);
        throw error;
    }
}

// ==========================================
// 14. FUNCIÓN PARA ACTUALIZAR ESTADO DE JUEZ EN SERVIDOR (CORREGIDA)
// ==========================================
async function actualizarEstadoJuezEnServidor(citaId, decisiones, estado) {
    try {
        // Extraer solo los tipos de decisión para el servidor
        const juez1 = decisiones.juez1 ? decisiones.juez1.tipo || decisiones.juez1 : null;
        const juez2 = decisiones.juez2 ? decisiones.juez2.tipo || decisiones.juez2 : null;
        const juez3 = decisiones.juez3 ? decisiones.juez3.tipo || decisiones.juez3 : null;
        
        const res = await fetch(`/citas/${citaId}/estado`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                estado: estado,
                juez1: juez1,
                juez2: juez2,
                juez3: juez3
            })
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();
        console.log('Estado de juez actualizado:', result);
        
        // 🔥 ACTUALIZAR LOCALMENTE el objeto citasServidor
        // Buscar la cita en el objeto y actualizarla
        for (const fecha in citasServidor) {
            const citas = citasServidor[fecha];
            const index = citas.findIndex(c => c.id === citaId);
            if (index !== -1) {
                citas[index].estado = estado;
                citas[index].decisiones = decisiones;
                // También actualizar los campos separados
                citas[index].juez1 = juez1;
                citas[index].juez2 = juez2;
                citas[index].juez3 = juez3;
                break;
            }
        }
        
        return true;
    } catch (error) {
        console.error('Error al actualizar estado del juez:', error);
        return false;
    }
}

// ==========================================
// 4. ELEMENTOS DEL DOM
// ==========================================
const DOM = {
    loginModal: document.getElementById('login-modal'),
    loginPass: document.getElementById('login-pass'),
    loginBtn: document.getElementById('btn-login'),
    cancelBtn: document.getElementById('btn-cancel'),
    closeLoginBtn: document.getElementById('btn-close-login'),
    loginError: document.getElementById('login-error'),
    navToggle: document.querySelector('.nav-toggle'),
    navMenu: document.querySelector('.nav-menu'),
    sections: document.querySelectorAll('.section'),
    navLinks: document.querySelectorAll('.nav-link'),
    appointmentForm: document.getElementById('appointment-form')
};

// ==========================================
// 5. VARIABLES DEL CALENDARIO
// ==========================================
let currentDate = new Date(2026, 2, 1);
let $calendar, $citasModal, $detalleModal;

// ==========================================
// 6. INICIALIZACIÓN PRINCIPAL
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Inicializando aplicación...');
    
    setupEventListeners();
    showSection('inicio');
    
    await cargarCitasDesdeServidor();
    initCalendar();
});

// ==========================================
// 7. MANEJADORES DE EVENTOS
// ==========================================
function setupEventListeners() {
    DOM.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            navigateToSection(sectionId);
        });
    });

    if (DOM.navToggle) {
        DOM.navToggle.addEventListener('click', toggleMobileMenu);
    }

    setupLoginEvents();
    
    if (DOM.appointmentForm) {
        DOM.appointmentForm.addEventListener('submit', handleAppointmentSubmit);
    }
}

function setupLoginEvents() {
    if (DOM.loginBtn) DOM.loginBtn.addEventListener('click', handleLogin);
    if (DOM.cancelBtn) DOM.cancelBtn.addEventListener('click', hideLoginModal);
    if (DOM.closeLoginBtn) DOM.closeLoginBtn.addEventListener('click', hideLoginModal);
    
    if (DOM.loginPass) {
        DOM.loginPass.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleLogin();
        });
    }

    if (DOM.loginModal) {
        DOM.loginModal.addEventListener('click', (e) => {
            if (e.target === DOM.loginModal) hideLoginModal();
        });
    }
}

function toggleMobileMenu() {
    AppState.isMobileMenuOpen = !AppState.isMobileMenuOpen;
    if (DOM.navMenu) {
        DOM.navMenu.classList.toggle('active', AppState.isMobileMenuOpen);
    }
}

// ==========================================
// 8. FUNCIONES DE NAVEGACIÓN
// ==========================================
function navigateToSection(sectionId) {
    if (!CONFIG.SECTIONS.includes(sectionId)) return;

    if (sectionId === 'actividad' && !AppState.isAuthenticated) {
        showLoginModal();
        return;
    }

    showSection(sectionId);
    closeMobileMenu();
}

function showSection(sectionId) {
    DOM.sections.forEach(sec => sec.classList.remove('active'));
    const targetSection = document.getElementById(sectionId);
    if (targetSection) targetSection.classList.add('active');
    
    DOM.navLinks.forEach(link => {
        const isActive = link.getAttribute('data-section') === sectionId;
        link.classList.toggle('active', isActive);
    });

    AppState.currentSection = sectionId;
    
    if (sectionId === 'calendario' && $calendar) {
        renderCalendar();
    }
}

function closeMobileMenu() {
    if (DOM.navMenu) {
        DOM.navMenu.classList.remove('active');
    }
    AppState.isMobileMenuOpen = false;
}

// ==========================================
// 9. FUNCIONES DE AUTENTICACIÓN
// ==========================================
function showLoginModal() {
    if (DOM.loginModal) {
        DOM.loginModal.classList.remove('hidden');
        if (DOM.loginPass) DOM.loginPass.focus();
    }
}

function hideLoginModal() {
    if (DOM.loginModal) DOM.loginModal.classList.add('hidden');
    if (DOM.loginPass) DOM.loginPass.value = '';
    if (DOM.loginError) DOM.loginError.classList.add('hidden');
}

function handleLogin() {
    const password = DOM.loginPass?.value.trim();
    
    if (password === CONFIG.PASSWORD) {
        AppState.isAuthenticated = true;
        hideLoginModal();
        navigateToSection('actividad');
    } else {
        showLoginError();
    }
}

function showLoginError() {
    if (DOM.loginError) {
        DOM.loginError.classList.remove('hidden');
        if (DOM.loginPass) {
            DOM.loginPass.value = '';
            DOM.loginPass.focus();
        }
    }
}

// ==========================================
// 10. FUNCIÓN DE VALIDACIÓN DEL FORMULARIO
// ==========================================
function validateAppointmentData(data) {
    if (!data.fullName || data.fullName.trim() === '') {
        alert('Por favor ingrese el nombre completo');
        return false;
    }
    
    if (!data.expediente || data.expediente.trim() === '') {
        alert('Por favor ingrese el número de expediente');
        return false;
    }
    
    if (!data.phone || data.phone.trim() === '') {
        alert('Por favor ingrese el teléfono');
        return false;
    }
    
    if (!data.tramite || data.tramite.trim() === '') {
        alert('Por favor seleccione el tipo de trámite');
        return false;
    }
    
    if (!data.fecha || data.fecha.trim() === '') {
        alert('Por favor seleccione una fecha');
        return false;
    }
    
    if (!data.time || data.time.trim() === '') {
        alert('Por favor seleccione una hora');
        return false;
    }
    
    return true;
}

// ==========================================
// 11. FUNCIÓN DEL FORMULARIO
// ==========================================
async function handleAppointmentSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    if (!validateAppointmentData(data)) {
        return;
    }

    const fechaObj = new Date(data.fecha);
    const fechaFormateada = fechaObj.toISOString().split('T')[0];

    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Guardando...';
    submitBtn.disabled = true;

    const nuevaCita = {
        nombre: data.fullName,
        expediente: data.expediente,
        telefono: data.phone,
        tramite: data.tramite,
        fecha: fechaFormateada,
        hora: data.time,
        estado: 'pendiente',
        decisiones: {}
    };

    try {
        await guardarCitaServidor(nuevaCita);
        await cargarCitasDesdeServidor();
        renderCalendar();
        e.target.reset();
        alert("Cita guardada exitosamente");
    } catch (error) {
        console.error('Error al guardar:', error);
        alert("Error al guardar la cita");
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

function showTemporalMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'success' ? '#27ae60' : '#3498db'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 3000);
}

if (!document.querySelector('#temp-styles')) {
    const style = document.createElement('style');
    style.id = 'temp-styles';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// ==========================================
// 12. FUNCIONES DE REPORTES (CORREGIDAS)
// ==========================================
window.descargarReporte = function(dias) {
    const container = document.getElementById('preview-container');
    if (container) {
        container.innerHTML = `
            <p style="color: var(--accent-color); font-weight:bold;">
                Generando reporte de los últimos ${dias} días...
            </p>
        `;
    }

    const hoy = new Date();
    const fechaLimite = new Date();
    fechaLimite.setDate(hoy.getDate() - dias);

    hoy.setHours(23, 59, 59, 999);
    fechaLimite.setHours(0, 0, 0, 0);

    let citasFiltradas = [];
    
    for (const fechaStr in citasServidor) {
        const [anio, mes, dia] = fechaStr.split('-').map(Number);
        const fechaCita = new Date(anio, mes - 1, dia);

        if (fechaCita >= fechaLimite && fechaCita <= hoy) {
            citasFiltradas = citasFiltradas.concat(citasServidor[fechaStr]);
        }
    }

    if (citasFiltradas.length === 0) {
        if (container) {
            container.innerHTML = `
                <p style="color: var(--danger-color); font-weight: bold;">
                    No se encontraron citas en el periodo seleccionado.
                </p>`;
        }
        return;
    }

    const headers = [
    'ID', 'Nombre', 'Expediente', 'Teléfono', 'Trámite', 
    'Fecha', 'Hora', 'Estado General',
    'Revisión Oficial Jurisdiccional', 
    'Revisión Secretaria', 
    'Revisión Recepcionista'
    ];
    
    let csvContent = "\uFEFF";
    csvContent += headers.join(",") + "\n";

    citasFiltradas.forEach(cita => {
        // 🔥 CORREGIDO: Acceder correctamente a las decisiones
        const decision1 = cita.decisiones && cita.decisiones.juez1 ? cita.decisiones.juez1.tipo || cita.decisiones.juez1 : null;
        const decision2 = cita.decisiones && cita.decisiones.juez2 ? cita.decisiones.juez2.tipo || cita.decisiones.juez2 : null;
        const decision3 = cita.decisiones && cita.decisiones.juez3 ? cita.decisiones.juez3.tipo || cita.decisiones.juez3 : null;
        
        const j1 = decision1 ? decision1.toUpperCase() : 'PENDIENTE';
        const j2 = decision2 ? decision2.toUpperCase() : 'PENDIENTE';
        const j3 = decision3 ? decision3.toUpperCase() : 'PENDIENTE';

        const juecesTotal = ['juez1', 'juez2', 'juez3'];
        const juecesFaltantes = juecesTotal.filter(j => !cita.decisiones || !cita.decisiones[j]);
        const faltanNombres = juecesFaltantes.length > 0 
            ? juecesFaltantes.map(j => j.replace('juez', 'Juez ')).join(' - ')
            : 'NINGUNO (COMPLETO)';

        let estadoGeneral = cita.estado || 'PENDIENTE';
        if (estadoGeneral.toLowerCase() === 'pendiente' && juecesFaltantes.length > 0) {
            estadoGeneral = 'EN REVISIÓN';
        }

        const limpiar = (texto) => `"${(texto || '').toString().replace(/"/g, '""').trim()}"`;

        const row = [
            cita.id || 'N/A',
            limpiar(cita.nombre),
            limpiar(cita.expediente || 'S/N'),
            limpiar(cita.telefono),
            limpiar(cita.tramite),
            limpiar(cita.fecha),
            limpiar(cita.hora),
            limpiar(estadoGeneral.toUpperCase()),
            limpiar(j1),
            limpiar(j2),
            limpiar(j3),
            limpiar(faltanNombres)
        ];
        
        csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `reporte_citas_${dias}_dias.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (container) {
        container.innerHTML = `
            <p style="color: #27ae60; font-weight: bold;">
                ¡Se ha descargado el archivo 'reporte_citas_${dias}_dias.csv' con ${citasFiltradas.length} registros exitosamente!
            </p>`;
    }
};

// ==========================================
// 13. LÓGICA DEL CALENDARIO
// ==========================================
function initCalendar() {
    console.log('Inicializando calendario...');
    
    $calendar = $('#jquery-calendar');
    $citasModal = $('#citas-modal');
    $detalleModal = $('#detalle-cita-modal');
    
    if (!$calendar.length) {
        console.error('No se encontró el elemento del calendario');
        return;
    }
    
    setupCalendarEvents();
    renderCalendar();
}

function setupCalendarEvents() {
    $('#prev-month').click(() => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    $('#next-month').click(() => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    $('.close-citas-modal, .close-detalle-modal').click(() => {
        $citasModal.addClass('hidden');
        $detalleModal.addClass('hidden');
    });
    
    $citasModal.click(function(e) { 
        if(e.target === this) $citasModal.addClass('hidden'); 
    });
    
    $detalleModal.click(function(e) { 
        if(e.target === this) $detalleModal.addClass('hidden'); 
    });
}

function renderCalendar() {
    if (!$calendar || !$calendar.length) return;
    
    $calendar.empty();
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    updateMonthTitle(year, month);
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startingDay = firstDay === 0 ? 6 : firstDay - 1;
    
    const calendarHTML = buildCalendarTable(year, month, daysInMonth, startingDay);
    $calendar.append(calendarHTML);
    
    attachEventsToDays();
}

function buildCalendarTable(year, month, daysInMonth, startingDay) {
    const monthPadded = String(month + 1).padStart(2, '0');
    let day = 1;
    let html = '<table class="calendar-table"><thead><tr>';
    
    ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].forEach(d => {
        html += `<th>${d}</th>`;
    });
    
    html += '</tr></thead><tbody><tr>';

    for (let i = 0; i < 42; i++) {
        if (i < startingDay || day > daysInMonth) {
            html += '<td class="calendar-day empty"></td>';
        } else {
            const dateStr = `${year}-${monthPadded}-${String(day).padStart(2, '0')}`;
            const citasDelDia = citasServidor[dateStr] || [];
            const hasCitas = citasDelDia.length > 0 ? 'has-citas' : '';
            const isToday = isCurrentDay(year, month, day) ? 'today' : '';
            
            html += `
                <td class="calendar-day ${hasCitas} ${isToday}" data-date="${dateStr}">
                    <div class="day-number">${day}</div>
                    ${citasDelDia.length > 0 ? `<div class="citas-marker">${citasDelDia.length}</div>` : ''}
                </td>`;
            day++;
        }
        
        if ((i + 1) % 7 === 0 && i !== 41) {
            html += '</tr><tr>';
        }
    }
    
    html += '</tr></tbody></table>';
    return html;
}

function updateMonthTitle(year, month) {
    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    $('#current-month').text(`${monthNames[month]} ${year}`);
}

function isCurrentDay(year, month, day) {
    const today = new Date();
    return year === today.getFullYear() && 
           month === today.getMonth() && 
           day === today.getDate();
}

function attachEventsToDays() {
    $('.calendar-day.has-citas').off('click').on('click', function() {
        const dateStr = $(this).data('date');
        showCitasDelDia(dateStr);
    });
}

function showCitasDelDia(dateStr) {
    const citas = citasServidor[dateStr] || [];
    const $lista = $('#citas-lista').empty();
    
    $('#citas-fecha').text(dateStr);

    if (citas.length === 0) {
        $lista.append('<p style="text-align:center;color:#666;">No hay citas para esta fecha</p>');
    } else {
        citas.forEach(cita => {
            const $item = createCitaItem(cita);
            $lista.append($item);
        });
    }
    
    $citasModal.removeClass('hidden');
}


function createCitaItem(cita) {
    // Determinar si el botón "No Asistió" debe mostrarse
    const estado = cita.estado || 'pendiente';
    const esCancelada = estado === 'cancelada' || cita.inasistencia === true;
    const mostrarNoAsistio = (estado === 'pendiente' || estado === 'aprobada') && !cita.inasistencia;
    
    // Determinar el texto del estado a mostrar
    let estadoTexto = estado;
    let estadoClase = estado;
    if (esCancelada) {
        estadoTexto = 'CANCELADA';
        estadoClase = 'cancelada';
    }
    
    const $item = $(`
    <div class="cita-item ${esCancelada ? 'cancelada' : ''}">
        <div class="cita-header">
            <span class="cita-hora">${cita.hora} hrs</span>
            <span class="estado-badge ${estadoClase}">
                ${estadoTexto}
            </span>
        </div>
        <strong>${escapeHtml(cita.nombre)}</strong><br>
        <small>Trámite: ${escapeHtml(cita.tramite)}</small><br>
        <small>Exp: ${escapeHtml(cita.expediente || 'S/N')}</small>
        ${esCancelada ? `<div style="margin-top: 6px; color: #e74c3c; font-weight: bold; font-size: 13px;"> Cita cancelada por falta de asistencia de ${escapeHtml(cita.nombre)}</div>` : ''}
        <div class="cita-actions" style="margin-top: 8px; display: flex; gap: 6px; flex-wrap: wrap;">
            ${mostrarNoAsistio ? `<button class="btn-no-asistio" style="background: #e74c3c; color: white; border: none; padding: 5px 12px; border-radius: 5px; cursor: pointer; font-size: 12px;"> No Asistió</button>` : ''}
            <button class="btn-delete" style="background: #c0392b; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 12px;">🗑 Eliminar</button>
        </div>
    </div>
    `);
    
    // Evento para el botón "No Asistió"
    $item.find('.btn-no-asistio').click(async (e) => {
        e.stopPropagation();
        await marcarNoAsistio(cita);
    });
    
    $item.find('.btn-delete').click(async (e) => {
        e.stopPropagation();
        if (confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
            const exito = await eliminarCitaServidor(cita.id);
            if (exito) {
                await cargarCitasDesdeServidor();
                renderCalendar();
                $('#citas-modal').addClass('hidden');
                showTemporalMessage('Cita eliminada correctamente', 'success');
            }
        }
    });

    $item.click(() => showDetalleCita(cita));
    return $item;
}

// ==========================================
// FUNCIÓN PARA ELIMINAR CITA
// ==========================================
async function eliminarCitaServidor(id) {
    try {
        const res = await fetch(`/citas/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return true;
    } catch (error) {
        console.error('Error al eliminar cita:', error);
        return false;
    }
}

// ==========================================
// 14. SISTEMA DE NOTIFICACIONES PENDIENTES
// ==========================================
function renderNotificaciones() {
    const $lista = document.getElementById('lista-notificaciones');
    if (!$lista) return;

    $lista.innerHTML = '';
    let hayPendientes = false;

    for (const fecha in citasServidor) {
        citasServidor[fecha].forEach(cita => {
            const estado = cita.estado || 'pendiente';
            const esCancelada = estado === 'cancelada' || cita.inasistencia === true;
            
            // Mostrar citas pendientes o aprobadas sin inasistencia
            if ((estado === 'pendiente' || estado === 'aprobada') && !esCancelada) {
                const juecesTotal = ['juez1', 'juez2', 'juez3'];
                const juecesFaltantes = juecesTotal.filter(j => !cita.decisiones || !cita.decisiones[j]);
                
                if (juecesFaltantes.length > 0) {
                    hayPendientes = true;
                    const faltanNombres = juecesFaltantes.map(j => NOMBRES_JUEZ[j]).join(', ');

                    const $notif = document.createElement('div');
                    $notif.className = 'notificacion-item';
                    $notif.innerHTML = `
                        <strong>${escapeHtml(cita.nombre)}</strong> - Exp: ${escapeHtml(cita.expediente || 'S/N')} <br>
                        <small>Fecha: ${cita.fecha} | Trámite: ${escapeHtml(cita.tramite)}</small><br>
                        <span class="badge-faltante">Falta revisión de: ${faltanNombres}</span>
                        <span class="badge-estado ${estado}">${estado}</span>
                    `;
                    $lista.appendChild($notif);
                }
            }
            
            // Mostrar citas canceladas por inasistencia
            if (esCancelada) {
                hayPendientes = true;
                const $notif = document.createElement('div');
                $notif.className = 'notificacion-item cancelada';
                $notif.style.borderLeft = '4px solid #e74c3c';
                $notif.style.background = '#fdf2f2';
                $notif.style.padding = '10px';
                $notif.style.marginBottom = '8px';
                $notif.style.borderRadius = '6px';
                $notif.innerHTML = `
                    <strong>${escapeHtml(cita.nombre)}</strong> - Exp: ${escapeHtml(cita.expediente || 'S/N')} <br>
                    <small>Fecha: ${cita.fecha} | Trámite: ${escapeHtml(cita.tramite)}</small><br>
                    <span style="background: #e74c3c; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;"> CITA CANCELADA</span>
                    <span style="color: #e74c3c; font-size: 12px; margin-left: 5px;">Falta de asistencia de ${escapeHtml(cita.nombre)}</span>
                `;
                $lista.appendChild($notif);
            }
        });
    }

    if (!hayPendientes) {
        $lista.innerHTML = '<p style="color: var(--text-light); text-align: center;">No hay citas pendientes de revisión.</p>';
    }
}

// ==========================================
// 15. FUNCIONES DEL DETALLE DE CITA (CORREGIDAS)
// ==========================================
function showDetalleCita(cita) {
    const $info = $('#detalle-cita-info').empty();
    
    // Verificar si la cita fue marcada como inasistencia
    const esCancelada = cita.estado === 'cancelada' || cita.inasistencia === true;
    const estado = cita.estado || 'pendiente';
    const mostrarNoAsistio = (estado === 'pendiente' || estado === 'aprobada') && !cita.inasistencia;
    
    // Determinar el texto del estado
    let estadoTexto = estado;
    let estadoClase = estado;
    if (esCancelada) {
        estadoTexto = 'CANCELADA';
        estadoClase = 'cancelada';
    }
    
    const campos = {
        'Ciudadano': cita.nombre,
        'Expediente': cita.expediente || 'S/N',
        'Teléfono': cita.telefono,
        'Estado': estadoTexto,
        'Fecha': cita.fecha,
        'Hora': cita.hora
    };

    for (const [key, value] of Object.entries(campos)) {
        $info.append(`
            <div style="margin-bottom: 8px;">
                <strong>${escapeHtml(key)}:</strong> ${escapeHtml(value)}
            </div>
        `);
    }

    // Mostrar mensaje de cancelación si corresponde
    if (esCancelada) {
        $info.append(`
            <div style="margin: 12px 0; padding: 15px; background: #f8d7da; border-radius: 8px; text-align: center; border: 2px solid #e74c3c;">
                <div style="font-size: 18px; color: #721c24; font-weight: bold;">
                     CITA CANCELADA
                </div>
                <div style="color: #721c24; font-size: 14px; margin-top: 5px;">
                    Motivo: Falta de asistencia de <strong>${escapeHtml(cita.nombre)}</strong>
                </div>
                <div style="color: #721c24; font-size: 12px; margin-top: 3px; opacity: 0.8;">
                    Fecha de cancelación: ${new Date().toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        `);
    }

    // Botón "No Asistió" en el detalle (solo si no está cancelada)
    if (mostrarNoAsistio) {
        $info.append(`
            <div style="margin: 12px 0; text-align: center;">
                <button id="btn-no-asistio-detalle" style="background: #e74c3c; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 14px; font-weight: bold;">
                     Marcar como NO ASISTIÓ
                </button>
            </div>
        `);
        
        $('#btn-no-asistio-detalle').click(async () => {
            await marcarNoAsistio(cita);
        });
    }

    // Sección de revisores
    const revisores = ['Oficial Jurisdiccional', 'Secretaria', 'Recepcionista'];
    const $approversGrid = $('<div class="approvers-grid"></div>');
    const permitirVoto = (estado === 'pendiente') && !esCancelada;

    revisores.forEach((nombre, index) => {
        const juezKey = `juez${index + 1}`;
        const decision = cita.decisiones && cita.decisiones[juezKey];
        
        const $card = $(`
            <div class="approver-card" data-juez="${juezKey}">
                <span class="juez-nombre">${escapeHtml(nombre)}</span>
                <div class="approver-content"></div>
            </div>
        `);
        
        if (decision) {
            renderDecisionResult($card, decision);
        } else {
            if (permitirVoto) {
                renderDecisionButtons($card, cita, juezKey);
            } else {
                // Mensaje según el estado
                let mensaje = '';
                if (esCancelada) {
                    mensaje = ' Cita cancelada por inasistencia del usuario';
                } else if (estado === 'aprobada') {
                    mensaje = ' Cita aprobada';
                } else if (estado === 'rechazada') {
                    mensaje = ' Cita rechazada';
                } else {
                    mensaje = ' Pendiente de revisión';
                }
                $card.find('.approver-content').html(`
                    <div class="decision-result" style="background:#f0f0f0; color:#555; padding:8px; border-radius:6px; text-align:center; font-weight:bold;">
                        ${mensaje}
                    </div>
                `);
            }
        }
        
        $approversGrid.append($card);
    });
    
    $info.append($approversGrid);
    addDynamicStyles();

    $citasModal.addClass('hidden');
    $detalleModal.removeClass('hidden');
}

function renderDecisionResult($card, decision) {
    const tipo = decision.tipo || decision;
    if (tipo === 'aceptado') {
        $card.find('.approver-content').html('<div class="decision-result aceptado">✓ Aceptado</div>');
    } else if (tipo === 'negado' || tipo === 'rechazado') {
        const comentario = decision.comentario || '';
        $card.find('.approver-content').html(`
            <div class="decision-result negado">
                ✗ Negado<br>
                <small>Comentario: ${escapeHtml(comentario)}</small>
            </div>
        `);
    }
}

function renderDecisionButtons($card, cita, juezKey) {
    $card.find('.approver-content').html(`
        <div class="actions">
            <button class="btn-status btn-accept">Aceptar</button>
            <button class="btn-status btn-reject">Negar</button>
        </div>
        <div class="comment-section hidden">
            <textarea class="comment-text" placeholder="Escribe un comentario..." rows="2"></textarea>
            <button class="btn-submit-comment">Enviar</button>
            <button class="btn-cancel-comment">Cancelar</button>
        </div>
    `);
    
    const $acceptBtn = $card.find('.btn-accept');
    const $rejectBtn = $card.find('.btn-reject');
    const $commentSection = $card.find('.comment-section');
    const $commentText = $card.find('.comment-text');
    const $submitComment = $card.find('.btn-submit-comment');
    const $cancelComment = $card.find('.btn-cancel-comment');
    
    $acceptBtn.click(() => {
        guardarDecision(cita, juezKey, 'aceptado', null, $card);
    });
    
    $rejectBtn.click(() => {
        $acceptBtn.hide();
        $rejectBtn.hide();
        $commentSection.removeClass('hidden');
    });
    
    $submitComment.click(() => {
        const comentario = $commentText.val().trim();
        if (comentario) {
            guardarDecision(cita, juezKey, 'negado', comentario, $card);
        } else {
            alert('Por favor, escribe un comentario antes de negar.');
        }
    });
    
    $cancelComment.click(() => {
        $acceptBtn.show();
        $rejectBtn.show();
        $commentSection.addClass('hidden');
        $commentText.val('');
    });
}

async function guardarDecision(cita, juezKey, tipo, comentario, $card) {
    // Si la cita ya fue cancelada, no permitir votación
    if (cita.inasistencia || cita.estado === 'cancelada') {
        alert('Esta cita fue cancelada por inasistencia, no se pueden realizar cambios.');
        return;
    }

    if (!cita.decisiones) {
        cita.decisiones = {};
    }
    
    cita.decisiones[juezKey] = {
        tipo: tipo,
        comentario: comentario,
        fecha: new Date().toISOString()
    };
    
    let nuevoEstado = 'pendiente';
    
    if (tipo === 'negado') {
        nuevoEstado = 'rechazada';
    } else {
        const j1 = cita.decisiones.juez1;
        const j2 = cita.decisiones.juez2;
        const j3 = cita.decisiones.juez3;
        if (j1 && j2 && j3) {
            if (j1.tipo !== 'negado' && j2.tipo !== 'negado' && j3.tipo !== 'negado') {
                nuevoEstado = 'aprobada';
            } else {
                nuevoEstado = 'rechazada';
            }
        } else {
            nuevoEstado = 'pendiente';
        }
    }
    
    cita.estado = nuevoEstado;
    
    const $content = $card.find('.approver-content');
    if (tipo === 'aceptado') {
        $content.html('<div class="decision-result aceptado">✓ Aceptado</div>');
    } else if (tipo === 'negado') {
        $content.html(`
            <div class="decision-result negado">
                ✗ Negado<br>
                <small>Comentario: ${escapeHtml(comentario)}</small>
            </div>
        `);
    }
    
    const exito = await actualizarEstadoJuezEnServidor(cita.id, cita.decisiones, cita.estado);
    
    if (exito) {
        renderNotificaciones();
        showDetalleCita(cita);
        console.log('Estado guardado en servidor');
    } else {
        alert('Error al guardar la decisión en el servidor');
    }
    
    const todasDecisiones = Object.keys(cita.decisiones).length === 3;
    if (todasDecisiones || nuevoEstado === 'rechazada') {
        setTimeout(() => {
            const mensaje = cita.estado === 'aprobada' 
                ? ' La cita ha sido APROBADA por todo el personal' 
                : ' La cita ha sido RECHAZADA';
            alert(mensaje);
        }, 100);
    }
    
    renderNotificaciones();
}

function addDynamicStyles() {
    if (!document.getElementById('dynamic-styles')) {
        const styles = `
            <style id="dynamic-styles">
                .decision-result {
                    padding: 8px;
                    border-radius: 6px;
                    text-align: center;
                    font-weight: bold;
                }
                .decision-result.aceptado {
                    background: #d4edda;
                    color: #155724;
                }
                .decision-result.negado {
                    background: #f8d7da;
                    color: #721c24;
                }
                .comment-section {
                    margin-top: 10px;
                }
                .comment-text {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-family: inherit;
                    font-size: 12px;
                    resize: vertical;
                }
                .btn-submit-comment, .btn-cancel-comment {
                    margin-top: 5px;
                    padding: 5px 10px;
                    font-size: 12px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-right: 5px;
                }
                .btn-submit-comment {
                    background: #27ae60;
                    color: white;
                }
                .btn-cancel-comment {
                    background: #95a5a6;
                    color: white;
                }
                .btn-submit-comment:hover {
                    background: #229954;
                }
                .btn-cancel-comment:hover {
                    background: #7f8c8d;
                }
                .approver-card {
                    transition: all 0.3s ease;
                }
                .cita-item {
                    transition: background 0.2s;
                }
                .calendar-day {
                    transition: all 0.2s;
                }
            </style>
        `;
        $('head').append(styles);
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

window.debug = {
    cargarCitas: cargarCitasDesdeServidor,
    recargarCalendario: () => renderCalendar(),
    verCitas: () => console.log(citasServidor)
};

// ==========================================
// 16. FUNCIÓN PARA MARCAR COMO NO ASISTIÓ
// ==========================================
async function marcarNoAsistio(cita) {
    const nombreUsuario = cita.nombre || 'Usuario';
    
    if (!confirm(`¿Estás seguro de que el ciudadano ${nombreUsuario} NO ASISTIÓ a la cita?`)) {
        return;
    }

    // Asegurar que existe el objeto decisiones
    if (!cita.decisiones) {
        cita.decisiones = {};
    }

    // Marcar como negado por inasistencia
    const comentario = `No asistió a la cita - ${nombreUsuario}`;
    const fecha = new Date().toISOString();

    // Establecer decisión para los tres jueces como negado por inasistencia
    const jueces = ['juez1', 'juez2', 'juez3'];
    jueces.forEach(juezKey => {
        cita.decisiones[juezKey] = {
            tipo: 'negado',
            comentario: comentario,
            fecha: fecha,
            inasistencia: true
        };
    });

    cita.estado = 'cancelada';
    cita.inasistencia = true;
    cita.motivoCancelacion = `Falta de asistencia de ${nombreUsuario}`;

    // Guardar en servidor
    const exito = await actualizarEstadoJuezEnServidor(cita.id, cita.decisiones, cita.estado);
    
    if (exito) {
        await cargarCitasDesdeServidor();
        renderNotificaciones();
        renderCalendar();
        
        // Cerrar modales y mostrar mensaje
        $('#citas-modal, #detalle-cita-modal').addClass('hidden');
        showTemporalMessage(`Cita de ${nombreUsuario} cancelada por falta de asistencia`, 'warning');
    } else {
        alert('Error al marcar la inasistencia');
    }
}