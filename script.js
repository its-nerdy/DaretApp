// ================= SYSTEME DE COMPTES RESEAU (CLIENT -> SERVEUR API) =================
let currentUser = null; 
let currentUserData = null; 
let fluxData = []; let echData = [];
const SOLDE_INIT = 0; 
let currentChartYear = new Date().getFullYear();
let fluxIdCnt = 1; let echIdCnt = 1;

// GLOBAL APP VARIABLES
let fluxPage = 1; let echPage = 1; const PER_PAGE = 8;
let fluxSearch = ""; let echSearch = "";
let currentSuggestedSeuil = 10000;
let currentCurrency = localStorage.getItem('daretApp_currency') || 'MAD';

// ================= I18N =================
const translations = {
  fr: {
    nav_about: "À propos", about_project: "Projet Encadré Par", about_school: "Institut Supérieur de Commerce et d'Administration des Entreprises (ISCAE)",
    about_team: "L'Équipe DARETApp", login_btn: "Connexion", signup_btn: "Créer un compte", 
    hero_badge: "✨ La nouvelle ère de la gestion financière",
    hero_title: "Prenez le contrôle total de <br>votre <span class='highlight'>Trésorerie</span>",
    hero_desc: "Fini le stress des fins de mois et les fichiers Excel chaotiques. DARETApp apporte clarté, prévisions intelligentes et tranquillité d'esprit à votre entreprise.", 
    hero_start: "Commencer gratuitement", hero_discover: "Découvrir l'équipe",
    stat_1: "Fichier Excel Requis", stat_2: "Automatisé & Sécurisé", stat_3: "De Visibilité Financière", stat_3_num_label: "Mois",
    feat_1_title: "Suivi en Temps Réel", feat_1_desc: "Enregistrez et catégorisez vos entrées et sorties d'argent au quotidien avec une interface ultra-rapide.",
    feat_2_title: "Gestion des Échéances", feat_2_desc: "Ne manquez plus jamais un paiement. Le système vous alerte automatiquement des factures en retard et à venir.",
    feat_4_title: "Score de Santé IA", feat_4_desc: "Notre algorithme analyse vos habitudes de dépenses pour vous attribuer une note de santé financière instantanée.",
    feat_3_title: "Prévisions Dynamiques", feat_3_desc: "Notre algorithme intelligent croise votre historique réel et vos échéances pour projeter votre solde sur 8 semaines ou 6 mois.",
    how_it_works_title: "Comment ça marche ?", step_1_title: "Centralisez vos données", step_1_desc: "Importez tout votre historique via CSV en un clic, ou ajoutez vos flux manuellement jour par jour.",
    step_2_title: "Laissez l'IA calculer", step_2_desc: "Notre moteur calcule votre rythme naturel (Run-Rate) et définit un Buffer de Liquidité Dynamique adapté à votre structure.",
    step_3_title: "Prenez les bonnes décisions", step_3_desc: "Visualisez votre solde sur 8 semaines ou 6 mois pour savoir exactement quand investir ou économiser.",
    cta_title: "Prêt à transformer votre gestion financière ?", cta_desc: "Rejoignez-nous aujourd'hui et obtenez une visibilité claire et nette sur l'avenir de votre entreprise.", cta_btn: "Créer mon espace gratuit",
    login_sub: "Heureux de vous revoir", login_err: "Identifiants incorrects.", company_name: "Nom de l'entreprise",
    company_or_email: "Nom de l'entreprise ou Email", currency_label: "Devise par défaut",
    password: "Mot de passe", back_home: "← Retour", signup_sub: "Créez votre espace de trésorerie",
    signup_err: "Veuillez remplir tous les champs. Ce compte existe peut-être déjà.", email: "Email professionnel", nav_dash: "Dashboard",
    nav_flux: "Flux de trésorerie", nav_ech: "Échéancier", nav_prev: "Prévision", sync_title: "Synchronisation Globale",
    import_csv: "Importer CSV", export_csv: "Exporter CSV", reset_data: "Réinitialiser", kpi_balance: "Solde actuel",
    kpi_in: "Entrées Réalisées", kpi_out: "Sorties Réalisées", kpi_next: "Prochaine échéance", kpi_health: "Santé Financière", chart_title: "Évolution Globale",
    add_flux: "Ajouter un flux", label_name: "Libellé", label_amount: "Montant", label_type: "Type", opt_in: "Entrée",
    opt_out: "Sortie", label_date: "Date", label_cat: "Catégorie", btn_save: "Enregistrer", history_flux: "Historique",
    filter_all: "Toutes les dates", filter_month: "Ce mois", filter_year: "Cette année", sort_new: "Date (Plus récent)",
    sort_old: "Date (Plus ancien)", sort_high: "Montant (Décroissant)", label_actions: "Actions", add_ech: "Planifier une échéance",
    label_status: "Statut", stat_futur: "A venir", stat_paye: "Payé", history_ech: "Suivi des Paiements",
    prev_params: "Paramètres de Simulation", prev_weeks: "Hebdomadaire (8 sem)", prev_months: "Mensuelle (6 mois)",
    prev_alert: "Seuil d'alerte:", table_period: "Période",
    table_net: "Flux Net", table_ech: "Échéances", table_balance: "Solde Projeté", empty_title: "Pas de données",
    empty_desc: "Importez des données pour voir les prévisions.", logout: "Déconnexion", 
    word_months: ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'],
    word_pay: "Payer", word_delete: "Suppr.", word_week: "Semaine", word_in: "Entrées", word_out: "Sorties",
    prev_smart: "<strong>Moteur Intelligent :</strong> Les prévisions calculent votre rythme naturel sur TOUT l'historique ET y ajoutent vos échéances futures.",
    edit_profile: "Paramètres du Profil", change_photo: "Changer la photo", cancel: "Annuler", search: "Rechercher...",
    filter_type: "Tous les types", filter_cat: "Toutes les catégories", filter_stat: "Tous les statuts", 
    sort_mont_asc: "Montant (Croissant)", sort_lib: "Libellé (A-Z)", sort_cat: "Catégorie (A-Z)",
    prev_in_wk: "Entrées (Moy Hebdo):", prev_out_wk: "Sorties (Moy Hebdo):",
    prev_in_mo: "Entrées (Moy Mensuelle):", prev_out_mo: "Sorties (Moy Mensuelle):",
    suggested_buffer: "Buffer de Liquidité : ", reset: "↺ Réinitialiser", 
    alert_msg: "⚠️ <strong>Alerte :</strong> Votre solde projeté passera sous le seuil d'alerte", alert_during: "au cours de cette période.",
    cat_ventes: "Ventes", cat_salaires: "Salaires", cat_loyer: "Loyer", cat_tva: "TVA", cat_fournisseurs: "Fournisseurs", cat_autre: "Autre"
  },
  en: {
    nav_about: "About Us", about_project: "Project Supervised By", about_school: "Higher Institute of Commerce and Business Administration (ISCAE)",
    about_team: "The DARETApp Team", login_btn: "Login", signup_btn: "Sign Up", 
    hero_badge: "✨ The new era of financial management",
    hero_title: "Take full control of <br>your <span class='highlight'>Cash Flow</span>",
    hero_desc: "Say goodbye to stressful month-ends and chaotic spreadsheets. DARETApp brings clarity, smart forecasting, and peace of mind to your business.", 
    hero_start: "Start for free", hero_discover: "Discover the team",
    stat_1: "Spreadsheets Required", stat_2: "Automated & Secure", stat_3: "Financial Visibility", stat_3_num_label: "Months",
    feat_1_title: "Real-Time Tracking", feat_1_desc: "Record and categorize your daily cash inflows and outflows with a lightning-fast interface.",
    feat_2_title: "Schedule Management", feat_2_desc: "Never miss a payment again. The system automatically alerts you of overdue and upcoming bills.",
    feat_4_title: "AI Health Score", feat_4_desc: "Our algorithm analyzes your spending habits to give you an instant financial health grade.",
    feat_3_title: "Dynamic Forecasts", feat_3_desc: "Our smart engine crosses your real history and schedules to project your balance over 8 weeks or 6 months.",
    how_it_works_title: "How it works?", step_1_title: "Centralize your data", step_1_desc: "Import all your history via CSV in one click, or add your flows manually day by day.",
    step_2_title: "Let AI calculate", step_2_desc: "Our engine calculates your natural Run-Rate and defines a Dynamic Liquidity Buffer tailored to your structure.",
    step_3_title: "Make the right decisions", step_3_desc: "Visualize your balance over 8 weeks or 6 months to know exactly when to invest or save.",
    cta_title: "Ready to transform your financial management?", cta_desc: "Join us today and get crystal clear visibility on the future of your business.", cta_btn: "Create my free space",
    login_sub: "Welcome back", login_err: "Incorrect credentials.", company_name: "Company Name",
    company_or_email: "Company Name or Email", currency_label: "Default Currency",
    password: "Password", back_home: "← Back", signup_sub: "Create your account",
    signup_err: "Please fill all fields. This account may already exist.", email: "Professional Email", nav_dash: "Dashboard",
    nav_flux: "Cash Flow", nav_ech: "Schedule", nav_prev: "Forecast", sync_title: "Global Synchronization",
    import_csv: "Import CSV", export_csv: "Export CSV", reset_data: "Reset Data", kpi_balance: "Current Balance",
    kpi_in: "Total Incomes", kpi_out: "Total Expenses", kpi_next: "Next Due Date", kpi_health: "Financial Health", chart_title: "Global Evolution",
    add_flux: "Add Transaction", label_name: "Label", label_amount: "Amount", label_type: "Type", opt_in: "Income",
    opt_out: "Expense", label_date: "Date", label_cat: "Category", btn_save: "Save", history_flux: "History",
    filter_all: "All Dates", filter_month: "This Month", filter_year: "This Year", sort_new: "Date (Newest)",
    sort_old: "Date (Oldest)", sort_high: "Amount (High to Low)", label_actions: "Actions", add_ech: "Schedule Payment",
    label_status: "Status", stat_futur: "Upcoming", stat_paye: "Paid", history_ech: "Payment Tracking",
    prev_params: "Simulation Parameters", prev_weeks: "Weekly (8 weeks)", prev_months: "Monthly (6 months)",
    prev_alert: "Alert Threshold:", table_period: "Period",
    table_net: "Net Flow", table_ech: "Scheduled", table_balance: "Projected Balance", empty_title: "No Data",
    empty_desc: "Import data to view forecasts.", logout: "Logout",
    word_months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    word_pay: "Pay", word_delete: "Delete", word_week: "Week", word_in: "Incomes", word_out: "Expenses",
    prev_smart: "<strong>Smart Engine:</strong> Forecasts calculate your natural run-rate using ALL historical data AND overlay your scheduled future payments.",
    edit_profile: "Profile Settings", change_photo: "Change photo", cancel: "Cancel", search: "Search...",
    filter_type: "All Types", filter_cat: "All Categories", filter_stat: "All Statuses", 
    sort_mont_asc: "Amount (Low to High)", sort_lib: "Label (A-Z)", sort_cat: "Category (A-Z)",
    prev_in_wk: "Incomes (Wk Avg):", prev_out_wk: "Expenses (Wk Avg):",
    prev_in_mo: "Incomes (Mo Avg):", prev_out_mo: "Expenses (Mo Avg):",
    suggested_buffer: "Liquidity Buffer: ", reset: "↺ Reset",
    alert_msg: "⚠️ <strong>Alert:</strong> Your projected balance will fall below the alert threshold", alert_during: "during this period.",
    cat_ventes: "Sales", cat_salaires: "Salaries", cat_loyer: "Rent", cat_tva: "VAT", cat_fournisseurs: "Suppliers", cat_autre: "Other"
  },
  es: {
    nav_about: "Nosotros", about_project: "Proyecto Supervisado Por", about_school: "Instituto Superior de Comercio y Administración de Empresas (ISCAE)",
    about_team: "El Equipo DARETApp", login_btn: "Iniciar Sesión", signup_btn: "Regístrate", 
    hero_badge: "✨ La nueva era de la gestión financiera",
    hero_title: "Toma el control total de <br>tu <span class='highlight'>Flujo de Caja</span>",
    hero_desc: "Dile adiós al estrés de fin de mes y a las hojas de Excel caóticas. DARETApp aporta claridad, previsiones y tranquilidad a tu negocio.", 
    hero_start: "Empezar gratis", hero_discover: "Descubrir el equipo",
    stat_1: "Archivos Excel", stat_2: "Automatizado y Seguro", stat_3: "De Visibilidad Financiera", stat_3_num_label: "Meses",
    feat_1_title: "Seguimiento en Tiempo Real", feat_1_desc: "Registra y categoriza tus entradas y salidas diarias con una interfaz ultrarrápida.",
    feat_2_title: "Gestión de Calendario", feat_2_desc: "Nunca más te pierdas un pago. El sistema te alerta automáticamente de las facturas vencidas y próximas.",
    feat_4_title: "Puntaje de Salud IA", feat_4_desc: "Nuestro algoritmo analiza tus hábitos de gasto para darte una nota de salud financiera instantánea.",
    feat_3_title: "Previsiones Dinámicas", feat_3_desc: "Nuestro motor inteligente cruza tu historial real y tus calendarios para proyectar tu saldo a 8 semanas o 6 meses.",
    how_it_works_title: "¿Cómo funciona?", step_1_title: "Centraliza tus datos", step_1_desc: "Importa todo tu historial vía CSV en un clic, o añade tus flujos manualmente día a día.",
    step_2_title: "Deja que la IA calcule", step_2_desc: "Nuestro motor calcula tu ritmo natural (Run-Rate) y define un Búfer de Liquidez Dinámico adaptado a tu estructura.",
    step_3_title: "Toma las decisiones correctas", step_3_desc: "Visualiza tu saldo a 8 semanas o 6 meses para saber exactamente cuándo invertir o ahorrar.",
    cta_title: "¿Listo para transformar tu gestión financiera?", cta_desc: "Únete a nosotros hoy y obtén una visibilidad clara sobre el futuro de tu negocio.", cta_btn: "Crear mi espacio gratuito",
    login_sub: "Bienvenido de nuevo", login_err: "Credenciales incorrectas.", company_name: "Nombre de la Empresa",
    company_or_email: "Nombre de Empresa o Correo", currency_label: "Moneda Predeterminada",
    password: "Contraseña", back_home: "← Volver", signup_sub: "Crea tu cuenta",
    signup_err: "Por favor, rellena todos los campos o la cuenta ya existe.", email: "Correo Profesional", nav_dash: "Panel",
    nav_flux: "Flujo de Caja", nav_ech: "Calendario", nav_prev: "Previsión", sync_title: "Sincronización Global",
    import_csv: "Importar CSV", export_csv: "Exportar CSV", reset_data: "Restablecer", kpi_balance: "Saldo Actual",
    kpi_in: "Ingresos Totales", kpi_out: "Gastos Totales", kpi_next: "Próximo Vencimiento", kpi_health: "Salud Financiera", chart_title: "Evolución Global",
    add_flux: "Añadir Transacción", label_name: "Nombre", label_amount: "Cantidad", label_type: "Tipo", opt_in: "Ingreso",
    opt_out: "Gasto", label_date: "Fecha", label_cat: "Categoría", btn_save: "Guardar", history_flux: "Historial",
    filter_all: "Todas las fechas", filter_month: "Este mes", filter_year: "Este año", sort_new: "Fecha (Más reciente)",
    sort_old: "Fecha (Más antiguo)", sort_high: "Cantidad (Mayor a Menor)", label_actions: "Acciones", add_ech: "Programar Pago",
    label_status: "Estado", stat_futur: "Próximo", stat_paye: "Pagado", history_ech: "Seguimiento de Pagos",
    prev_params: "Parámetros de Simulación", prev_weeks: "Semanal (8 sem)", prev_months: "Mensual (6 meses)",
    prev_alert: "Umbral de Alerta:", table_period: "Período",
    table_net: "Flujo Neto", table_ech: "Programados", table_balance: "Saldo Proyectado", empty_title: "Sin Datos",
    empty_desc: "Importa datos para ver las previsiones.", logout: "Cerrar sesión",
    word_months: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
    word_pay: "Pagar", word_delete: "Eliminar", word_week: "Semana", word_in: "Ingresos", word_out: "Gastos",
    prev_smart: "<strong>Motor Inteligente:</strong> Las previsiones calculan su ritmo natural sobre TODO el historial Y añaden sus próximos pagos.",
    edit_profile: "Ajustes de Perfil", change_photo: "Cambiar foto", cancel: "Cancelar", search: "Buscar...",
    filter_type: "Todos los tipos", filter_cat: "Todas las categorías", filter_stat: "Todos los estados", 
    sort_mont_asc: "Cantidad (Menor a Mayor)", sort_lib: "Etiqueta (A-Z)", sort_cat: "Categoría (A-Z)",
    prev_in_wk: "Ingresos (Med Sem):", prev_out_wk: "Gastos (Med Sem):",
    prev_in_mo: "Ingresos (Med Mensual):", prev_out_mo: "Gastos (Med Mensual):",
    suggested_buffer: "Búfer de Liquidez: ", reset: "↺ Restablecer",
    alert_msg: "⚠️ <strong>Alerta:</strong> Su saldo proyectado caerá por debajo del umbral de alerta", alert_during: "durante este período.",
    cat_ventes: "Ventas", cat_salaires: "Salarios", cat_loyer: "Alquiler", cat_tva: "IVA", cat_fournisseurs: "Proveedores", cat_autre: "Otro"
  }
};

function changeLang(lang) {
  currentLang = lang; localStorage.setItem('daretApp_lang', lang); 
  document.querySelectorAll('.lang-select').forEach(el => el.value = lang);
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n'); 
    if (el.tagName.toLowerCase() === 'input' && el.type === 'text') {
        if(translations[lang][key]) el.placeholder = translations[lang][key];
    } else {
        if(translations[lang][key]) el.innerHTML = translations[lang][key];
    }
  });

  const todayStr = new Date().toLocaleDateString(currentLang === 'en' ? 'en-US' : currentLang === 'es' ? 'es-ES' : 'fr-FR', {weekday:'long', year:'numeric', month:'long', day:'numeric'});
  const dateEl = document.getElementById('page-date');
  if(dateEl) dateEl.textContent = todayStr.charAt(0).toUpperCase() + todayStr.slice(1);
  
  if(document.getElementById('app-screen') && document.getElementById('app-screen').style.display === 'block') { 
      renderDashboard(); renderFlux(); renderEch(); renderPrevision(); 
  }
}

let currentTheme = localStorage.getItem('daretApp_theme') || 'light';
function toggleTheme() { currentTheme = currentTheme === 'light' ? 'dark' : 'light'; applyTheme(); }
function applyTheme() {
  localStorage.setItem('daretApp_theme', currentTheme); document.documentElement.setAttribute('data-theme', currentTheme);
  document.querySelectorAll('.theme-btn').forEach(btn => { btn.textContent = currentTheme === 'light' ? '🌙' : '☀️'; });
  if(document.getElementById('app-screen') && document.getElementById('app-screen').style.display === 'block') { renderDashboard(); renderPrevision(); }
}

// ================= NETWORK API CALLS =================
async function doLogin() {
  const c = document.getElementById('inp-company').value.trim().toLowerCase(); 
  const p = document.getElementById('inp-pass').value.trim();
  
  try {
      const res = await fetch('/api/login', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: c, pass: p }) // Backend now expects 'identifier' (name or email)
      });
      const data = await res.json();
      
      if(data.success){
        document.getElementById('login-err').style.display = 'none'; 
        currentUser = data.user.id; // Backend returns correct ID
        currentUserData = data.user;
        localStorage.setItem('daretApp_loggedInUser', currentUser); 
        loadDataFromObject(currentUserData);
        showScreen('app'); 
        setupAppUser();
      } else { 
        document.getElementById('login-err').style.display='block'; 
      }
  } catch (err) {
      alert("Erreur de connexion au serveur.");
  }
}

async function doSignup() {
  const c = document.getElementById('reg-company').value.trim(); 
  const e = document.getElementById('reg-email').value.trim();
  const p = document.getElementById('reg-pass').value.trim();
  const accountId = c.toLowerCase();
  
  if (!c || !p) { document.getElementById('signup-err').style.display = 'block'; return; }
  
  try {
      const res = await fetch('/api/signup', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: accountId, name: c, email: e, pass: p })
      });
      const data = await res.json();
      
      if (data.success) {
          document.getElementById('signup-err').style.display = 'none';
          currentUser = accountId;
          currentUserData = data.user;
          localStorage.setItem('daretApp_loggedInUser', currentUser); 
          loadDataFromObject(currentUserData);
          showScreen('app'); setupAppUser();
      } else {
          document.getElementById('signup-err').style.display = 'block';
      }
  } catch (err) {
      alert("Erreur de connexion au serveur.");
  }
}

async function checkAndLoadSession() {
    const loggedInUser = localStorage.getItem('daretApp_loggedInUser');
    if (loggedInUser) {
        try {
            const res = await fetch(`/api/data?id=${loggedInUser}`);
            const data = await res.json();
            if (data.success) {
                currentUser = loggedInUser;
                currentUserData = data.user;
                loadDataFromObject(currentUserData);
                showScreen('app'); 
                setupAppUser(); 
            } else {
                doLogout();
            }
        } catch (err) {
            console.error("No server connection, remaining on login.");
        }
    }
}

function loadDataFromObject(userObj) {
  fluxData = userObj.fluxData || [];
  echData = userObj.echData || [];
  fluxIdCnt = userObj.fluxIdCnt || 1;
  echIdCnt = userObj.echIdCnt || 1;
}

async function saveData() {
  if(!currentUser) return;
  try {
      await fetch('/api/sync', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              id: currentUser,
              fluxData: fluxData,
              echData: echData,
              fluxIdCnt: fluxIdCnt,
              echIdCnt: echIdCnt,
              avatar: currentUserData.avatar,
              pass: currentUserData.pass
          })
      });
  } catch (err) {
      console.error("Failed to sync with server", err);
  }
}

window.onload = function() {
  applyTheme(); changeLang(currentLang);
  checkAndLoadSession();
};

function showScreen(screenId) {
  ['landing', 'about', 'login', 'signup', 'app'].forEach(id => { const el = document.getElementById(id + '-screen'); if(el) el.style.display = 'none'; });
  const target = document.getElementById(screenId + '-screen');
  if(target) target.style.display = (screenId === 'app') ? 'block' : 'flex';
}

function setupAppUser() {
  document.getElementById('sidebar-company').textContent = currentUserData.name; 
  document.getElementById('topbar-company').textContent = currentUserData.name;
  
  const avatarImg = document.getElementById('topbar-avatar-img');
  const avatarInitials = document.getElementById('topbar-avatar');
  
  if(currentUserData.avatar) {
      avatarImg.src = currentUserData.avatar;
      avatarImg.style.display = 'block';
      avatarInitials.style.display = 'none';
  } else {
      avatarImg.style.display = 'none';
      avatarInitials.style.display = 'flex';
      avatarInitials.textContent = currentUserData.name.substring(0,2).toUpperCase(); 
  }
  
  renderDashboard();
}

function doLogout(){ 
    currentUser = null;
    currentUserData = null;
    localStorage.removeItem('daretApp_loggedInUser'); 
    showScreen('landing'); 
}

// ================= MODALS & UTILS =================
let tempAvatar = null;
function openProfileModal() {
    document.getElementById('edit-name').value = currentUserData.name;
    document.getElementById('edit-pass').value = '';
    document.getElementById('edit-currency').value = currentCurrency;
    tempAvatar = currentUserData.avatar;
    
    updateProfileModalVisuals();
    document.getElementById('profile-modal').style.display = 'flex';
}

function updateProfileModalVisuals() {
    const preview = document.getElementById('profile-preview');
    const initials = document.getElementById('profile-initials-preview');
    const removeBtn = document.getElementById('remove-photo-btn');
    
    if(tempAvatar) {
        preview.src = tempAvatar; 
        preview.style.display = 'block'; 
        initials.style.display = 'none';
        removeBtn.style.display = 'flex';
    } else {
        preview.style.display = 'none'; 
        initials.style.display = 'flex'; 
        initials.textContent = currentUserData.name.substring(0,2).toUpperCase();
        removeBtn.style.display = 'none';
    }
}

function removeProfilePhoto() {
    tempAvatar = null;
    updateProfileModalVisuals();
}

function closeProfileModal() { document.getElementById('profile-modal').style.display = 'none'; }
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            tempAvatar = event.target.result;
            updateProfileModalVisuals();
        };
        reader.readAsDataURL(file);
    }
}
function saveProfile() {
    const pass = document.getElementById('edit-pass').value.trim();
    if(pass) currentUserData.pass = pass;
    currentUserData.avatar = tempAvatar;
    
    currentCurrency = document.getElementById('edit-currency').value;
    localStorage.setItem('daretApp_currency', currentCurrency);

    saveData();
    closeProfileModal(); 
    setupAppUser(); 
    
    // Force rerender to update currency visuals everywhere
    renderDashboard(); renderFlux(); renderEch(); renderPrevision();
}

function getSoldeActuel(){ let s = SOLDE_INIT; fluxData.forEach(f=>{ s += f.type==='entree' ? f.mont : -f.mont; }); return s; }
function fmt(n){return Math.round(n).toLocaleString('fr-FR');}

function showPage(id, el){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active')); document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('page-'+id).classList.add('active'); el.classList.add('active');
  const titles={dashboard: translations[currentLang].nav_dash, flux: translations[currentLang].nav_flux, echeancier: translations[currentLang].nav_ech, prevision: translations[currentLang].nav_prev};
  
  const icons = {
    dashboard: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--primary)" stroke-width="2.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>`,
    flux: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--primary)" stroke-width="2.5"><path d="M12 20V10m0 0l-3 3m3-3l3 3M4 4h16" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    echeancier: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--primary)" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18" stroke-linecap="round"/></svg>`,
    prevision: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--primary)" stroke-width="2.5"><path d="M3 3v18h18M7 14l4-4 4 4 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  };
  
  document.getElementById('page-title').innerHTML = `${icons[id]} <span>${titles[id]}</span>`;
  setTimeout(() => { if(id==='dashboard') renderDashboard(); if(id==='flux') { fluxPage=1; renderFlux(); } if(id==='echeancier') { echPage=1; renderEch(); } if(id==='prevision') renderPrevision(); }, 10);
}

function resetData() { if(confirm("Êtes-vous sûr ?")){ fluxData = []; echData = []; fluxIdCnt = 1; echIdCnt = 1; saveData(); renderDashboard(); } }
function exportGlobalCSV() {
  let csv = "dataset,id,date,lib,cat,type,mont,stat\n";
  fluxData.forEach(f => { csv += `FLUX,${f.id},${f.date},${(f.lib||"").replace(/,/g, " ")},${f.cat||""},${f.type},${f.mont},\n`; });
  echData.forEach(e => { csv += `ECH,${e.id},${e.date},${(e.lib||"").replace(/,/g, " ")},${e.cat||""},${e.type},${e.mont},${e.stat}\n`; });
  const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); link.download = `daretapp_${currentUser}_base.csv`; link.click();
}

function importGlobalCSV(e) {
  const file = e.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    let text = e.target.result; if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
    const lines = text.split('\n'); const separator = lines[0].includes(';') ? ';' : ',';
    fluxData = []; echData = []; fluxIdCnt = 1; echIdCnt = 1;
    for(let i = 1; i < lines.length; i++) {
      const line = lines[i].replace(/[\r\n]/g, '').trim(); if(!line) continue;
      const parts = line.split(separator);
      if(parts.length >= 7) {
        const dataset = (parts[0]||"").replace(/["'\s]/g, '').toUpperCase();
        if (!dataset.includes('FLUX') && !dataset.includes('ECH')) continue; 
        const montRaw = (parts[6]||"0").replace(/["'\s]/g, '').replace(',', '.');
        const obj = {
          id: parseInt((parts[1]||"").replace(/["']/g, '')) || (dataset.includes('FLUX') ? fluxIdCnt++ : echIdCnt++),
          date: (parts[2]||"").replace(/["']/g, '').trim(), lib: (parts[3]||"").replace(/["']/g, '').trim(), 
          cat: (parts[4]||"").replace(/["']/g, '').trim(), type: (parts[5]||"").replace(/["']/g, '').trim().toLowerCase(), 
          mont: parseFloat(montRaw) || 0
        };
        if(dataset.includes('FLUX')) { fluxData.push(obj); }
        else if(dataset.includes('ECH')) { obj.stat = parts[7] ? parts[7].replace(/["']/g, '').trim().toLowerCase() : 'futur'; echData.push(obj); }
      }
    }
    if(fluxData.length > 0) fluxIdCnt = Math.max(...fluxData.map(f=>f.id)) + 1;
    if(echData.length > 0) echIdCnt = Math.max(...echData.map(ev=>ev.id)) + 1;
    
    fluxPage = 1; echPage = 1; saveData(); 
    if(document.getElementById('page-dashboard').classList.contains('active')) renderDashboard();
    else if(document.getElementById('page-flux').classList.contains('active')) renderFlux();
    else if(document.getElementById('page-echeancier').classList.contains('active')) renderEch();
    else if(document.getElementById('page-prevision').classList.contains('active')) renderPrevision();
    document.getElementById('global-csv-input').value = ''; 
  };
  reader.readAsText(file);
}

// ================= RENDER DASHBOARD =================
Chart.defaults.font.family = "'Inter', sans-serif";
let chartDash=null;
function changeChartYear(delta) { currentChartYear += delta; renderDashboard(); }

function calculateHealthScore() {
    if(fluxData.length === 0) {
        document.getElementById('kpi-health-score').textContent = "—";
        document.getElementById('kpi-health-desc').textContent = currentLang === 'en' ? "Awaiting Data" : currentLang === 'es' ? "Esperando Datos" : "En attente de données";
        return;
    }
    let totE=0, totS=0; 
    fluxData.forEach(f=>{ if(f.type==='entree') totE+=f.mont; else totS+=f.mont; });
    
    const ratio = totE / (totS === 0 ? 1 : totS);
    let score = "C", color = "var(--warning)", desc = currentLang === 'en' ? "Needs Improvement" : currentLang === 'es' ? "Necesita Mejorar" : "À améliorer";
    
    if (ratio > 1.4) { score = "A"; color = "var(--secondary)"; desc = currentLang === 'en' ? "Excellent Health" : currentLang === 'es' ? "Salud Excelente" : "Excellente Santé"; }
    else if (ratio >= 1.0) { score = "B"; color = "var(--info)"; desc = currentLang === 'en' ? "Stable" : currentLang === 'es' ? "Estable" : "Stable"; }
    else if (ratio < 0.8) { score = "D"; color = "var(--danger)"; desc = currentLang === 'en' ? "At Risk" : currentLang === 'es' ? "En Riesgo" : "À risque"; }

    const scEl = document.getElementById('kpi-health-score');
    scEl.textContent = score;
    scEl.style.color = color;
    document.getElementById('kpi-health-desc').textContent = desc;
}

function checkAlerts() {
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
    }

    const today = new Date();
    today.setHours(0,0,0,0);
    
    let overdue = 0;
    let upcoming = 0;

    echData.forEach(e => {
        if (e.stat !== 'paye') {
            const eDate = new Date(e.date);
            const diffTime = eDate.getTime() - today.getTime();
            const diffDays = diffTime / (1000 * 3600 * 24);
            
            if (diffDays < 0) overdue++;
            else if (diffDays >= 0 && diffDays <= 3) upcoming++;
        }
    });

    const alertSec = document.getElementById('ech-alerts-section');
    if (alertSec) {
        let html = '';
        if (overdue > 0) html += `<div class="auth-err" style="display:block; text-align:left; margin-bottom: 15px;">🚨 ${overdue} échéance(s) en retard !</div>`;
        if (upcoming > 0) html += `<div class="auth-err" style="display:block; background:var(--warning-bg); color:var(--warning); text-align:left; margin-bottom: 15px;">⚠️ ${upcoming} échéance(s) dans les 3 prochains jours.</div>`;
        alertSec.innerHTML = html;
    }

    if ((overdue > 0 || upcoming > 0) && Notification.permission === "granted") {
        if (!sessionStorage.getItem('daretApp_notified')) {
            new Notification("DARETApp - Trésorerie", {
                body: `Vous avez ${overdue} retard(s) et ${upcoming} échéance(s) à venir.`,
            });
            sessionStorage.setItem('daretApp_notified', 'true');
        }
    }
}

function renderDashboard(){
  const solde = getSoldeActuel();
  document.getElementById('kpi-solde').textContent = fmt(solde) + ' ' + currentCurrency;
  document.getElementById('kpi-solde').closest('.kpi').className = 'kpi '+(solde<0?'danger':solde===0?'warn':'success')+' fade-in';

  let totE=0, totS=0; fluxData.forEach(f=>{ if(f.type==='entree') totE+=f.mont; else totS+=f.mont; });
  document.getElementById('kpi-entrees').textContent = '+'+fmt(totE) + ' ' + currentCurrency;
  document.getElementById('kpi-sorties').textContent = '-'+fmt(totS) + ' ' + currentCurrency;

  calculateHealthScore();

  const futurEch = echData.filter(e=>e.stat!=='paye').sort((a,b)=>new Date(a.date)-new Date(b.date));
  if(futurEch.length){
    document.getElementById('kpi-next-ech').textContent = futurEch[0].lib;
    document.getElementById('kpi-next-ech-date').innerHTML = `<span style="font-weight:600;">${new Date(futurEch[0].date).toLocaleDateString(currentLang === 'en' ? 'en-US' : currentLang === 'es' ? 'es-ES' : 'fr-FR')}</span> — ${fmt(futurEch[0].mont)} ${currentCurrency}`;
  } else {
    document.getElementById('kpi-next-ech').textContent = "-"; document.getElementById('kpi-next-ech-date').textContent = "—";
  }

  const yearDisplay = document.getElementById('chart-year-display');
  if(yearDisplay) yearDisplay.textContent = currentChartYear;

  const mE=Array(12).fill(0), mS=Array(12).fill(0);
  fluxData.forEach(f=>{
      const d=new Date(f.date); 
      if(d.getFullYear() === currentChartYear && !isNaN(d.getTime())) {
          if(f.type==='entree') mE[d.getMonth()]+=f.mont; else mS[d.getMonth()]+=f.mont;
      }
  });

  const gridColor = currentTheme === 'dark' ? '#334155' : '#e2e8f0';
  let existingChart = Chart.getChart("chartDash"); if (existingChart) existingChart.destroy();
  const canvas = document.getElementById('chartDash');
  if(canvas) {
    chartDash=new Chart(canvas,{
      type:'bar', data:{labels:translations[currentLang].word_months, datasets:[{label:translations[currentLang].word_in,data:mE,backgroundColor:'#10b981',borderRadius:6},{label:translations[currentLang].word_out,data:mS,backgroundColor:'#f43f5e',borderRadius:6}]},
      options:{responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{x:{grid:{display:false}},y:{border:{display:false}, grid:{color: gridColor, drawBorder: false}}}}
    });
  }

  checkAlerts(); 
}

// ================= SMART PAGINATION LOGIC =================
function changePage(type, page) {
    if (type === 'flux') { fluxPage = page; renderFlux(); }
    else if (type === 'ech') { echPage = page; renderEch(); }
}

function generatePagination(current, total, type) {
    if (total <= 1) return '';
    let html = '';
    
    html += `<button class="page-btn" ${current === 1 ? 'disabled' : `onclick="changePage('${type}', ${current - 1})"`}>&laquo;</button>`;
    
    let start = Math.max(1, current - 1);
    let end = Math.min(total, current + 1);
    
    if (current === 1) end = Math.min(total, 3);
    if (current === total) start = Math.max(1, total - 2);

    if (start > 1) {
        html += `<button class="page-btn" onclick="changePage('${type}', 1)">1</button>`;
        if (start > 2) html += `<span style="padding: 8px 4px; color: var(--text-muted);">...</span>`;
    }

    for (let i = start; i <= end; i++) {
        html += `<button class="page-btn ${i === current ? 'active-page' : ''}" onclick="changePage('${type}', ${i})">${i}</button>`;
    }

    if (end < total) {
        if (end < total - 1) html += `<span style="padding: 8px 4px; color: var(--text-muted);">...</span>`;
        html += `<button class="page-btn" onclick="changePage('${type}', ${total})">${total}</button>`;
    }

    html += `<button class="page-btn" ${current === total ? 'disabled' : `onclick="changePage('${type}', ${current + 1})"`}>&raquo;</button>`;
    
    return html;
}

// ================= RENDER DATA TABLES =================
function getTranslatedCategory(cat) {
    const key = 'cat_' + cat.toLowerCase();
    return translations[currentLang][key] || cat;
}

function renderFlux(){
  const searchInput = document.getElementById('search-flux'); fluxSearch = searchInput ? searchInput.value.toLowerCase() : "";
  const filterDate = document.getElementById('filter-flux-date')?.value || 'all';
  const filterType = document.getElementById('filter-flux-type')?.value || 'all';
  const filterCat = document.getElementById('filter-flux-cat')?.value || 'all';
  const sortType = document.getElementById('sort-flux')?.value || 'date_desc';

  let filtered = fluxData.filter(f => {
      const libText = (f.lib || "").toLowerCase();
      const d = new Date(f.date); const now = new Date(); let inDate = true;
      
      if (!isNaN(d.getTime())) {
        if (filterDate === 'this_month') inDate = d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        if (filterDate === 'this_year') inDate = d.getFullYear() === now.getFullYear();
      }
      
      let inType = (filterType === 'all') || (f.type === filterType);
      let inCat = (filterCat === 'all') || (f.cat === filterCat);

      return libText.includes(fluxSearch) && inDate && inType && inCat;
  });
  
  let sorted = filtered.sort((a,b) => {
      if (sortType === 'date_desc') return new Date(b.date||0) - new Date(a.date||0);
      if (sortType === 'date_asc') return new Date(a.date||0) - new Date(b.date||0);
      if (sortType === 'mont_desc') return (b.mont||0) - (a.mont||0);
      if (sortType === 'mont_asc') return (a.mont||0) - (b.mont||0);
      if (sortType === 'lib_asc') return (a.lib||"").localeCompare(b.lib||"");
      if (sortType === 'cat_asc') return (a.cat||"").localeCompare(b.cat||"");
      return 0;
  });
  
  const totalPages = Math.ceil(sorted.length/PER_PAGE);
  if(fluxPage > totalPages) fluxPage = totalPages || 1; 
  const slice = sorted.slice((fluxPage-1)*PER_PAGE, (fluxPage-1)*PER_PAGE+PER_PAGE);
  
  const labelEl = document.getElementById('flux-count-label');
  if(labelEl) labelEl.textContent = `Total : ${sorted.length}`;

  const tableEl = document.getElementById('flux-table');
  if(tableEl) {
      if (slice.length === 0) tableEl.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 30px;">-</td></tr>`;
      else tableEl.innerHTML=slice.map(f=>{
        let displayDate = "-";
        if(!isNaN(new Date(f.date).getTime())) displayDate = new Date(f.date).toLocaleDateString(currentLang === 'en' ? 'en-US' : currentLang === 'es' ? 'es-ES' : 'fr-FR');
        return `<tr>
          <td style="font-weight:600; color:var(--text-muted);">${displayDate}</td>
          <td style="font-weight:600;">${f.lib||""}</td><td style="color:var(--text-muted)">${getTranslatedCategory(f.cat||"")}</td>
          <td><span class="badge ${f.type}">${f.type==='entree' ? translations[currentLang].opt_in : translations[currentLang].opt_out}</span></td>
          <td class="${f.type==='entree'?'pos':'neg'}">${f.type==='entree'?'+':'-'}${fmt(f.mont)} ${currentCurrency}</td>
          <td><button class="btn-danger" onclick="deleteFlux(${f.id})">${translations[currentLang].word_delete}</button></td>
        </tr>`;
      }).join('');
  }
  
  const paginationEl = document.getElementById('flux-pagination');
  if (paginationEl) paginationEl.innerHTML = generatePagination(fluxPage, totalPages, 'flux');
}

function addFlux(){
  const lib=document.getElementById('f-lib').value.trim(); const mont=parseFloat(document.getElementById('f-mont').value);
  const type=document.getElementById('f-type').value; const date=document.getElementById('f-date').value; const cat=document.getElementById('f-cat').value;
  if(!lib||isNaN(mont)||!date)return;
  fluxData.push({id:fluxIdCnt++,lib,mont,type,date,cat});
  document.getElementById('f-lib').value=''; document.getElementById('f-mont').value=''; saveData(); fluxPage=1; renderFlux(); 
}
function deleteFlux(id){ fluxData = fluxData.filter(f=>f.id!==id); saveData(); renderFlux(); }

function renderEch(){
  const searchInput = document.getElementById('search-ech'); echSearch = searchInput ? searchInput.value.toLowerCase() : "";
  const filterDate = document.getElementById('filter-ech-date')?.value || 'all';
  const filterType = document.getElementById('filter-ech-type')?.value || 'all';
  const filterStat = document.getElementById('filter-ech-stat')?.value || 'all';
  const sortType = document.getElementById('sort-ech')?.value || 'date_asc';

  let filtered = echData.filter(e => {
      const libText = (e.lib || "").toLowerCase(); 
      const d = new Date(e.date); const now = new Date(); let inDate = true;
      
      if (!isNaN(d.getTime())) {
        if (filterDate === 'this_month') inDate = d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        if (filterDate === 'this_year') inDate = d.getFullYear() === now.getFullYear();
      }
      
      let inType = (filterType === 'all') || (e.type === filterType);
      let inStat = (filterStat === 'all') || (e.stat === filterStat);

      return libText.includes(echSearch) && inDate && inType && inStat;
  });
  
  let sorted = filtered.sort((a,b) => {
      if (sortType === 'date_desc') return new Date(b.date||0) - new Date(a.date||0);
      if (sortType === 'date_asc') return new Date(a.date||0) - new Date(b.date||0);
      if (sortType === 'mont_desc') return (b.mont||0) - (a.mont||0);
      if (sortType === 'mont_asc') return (a.mont||0) - (b.mont||0);
      if (sortType === 'lib_asc') return (a.lib||"").localeCompare(b.lib||"");
      return 0;
  });
  
  const totalPages = Math.ceil(sorted.length/PER_PAGE);
  if(echPage > totalPages) echPage = totalPages || 1;
  const slice = sorted.slice((echPage-1)*PER_PAGE, (echPage-1)*PER_PAGE+PER_PAGE);

  const labelEl = document.getElementById('ech-count-label');
  if(labelEl) labelEl.textContent = `Total : ${sorted.length}`;
  
  const tableEl = document.getElementById('ech-table');
  if(tableEl) {
      if (slice.length === 0) tableEl.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 30px;">-</td></tr>`;
      else tableEl.innerHTML=slice.map(e=>{
        let sL = ""; if(e.stat==='futur') sL = translations[currentLang].stat_futur; if(e.stat==='paye') sL = translations[currentLang].stat_paye; if(e.stat==='retard') sL = "Retard";
        let displayDate = "-"; if(!isNaN(new Date(e.date).getTime())) displayDate = new Date(e.date).toLocaleDateString(currentLang === 'en' ? 'en-US' : currentLang === 'es' ? 'es-ES' : 'fr-FR');
        const actionBtn = e.stat !== 'paye' ? `<button class="btn-pay" onclick="payEch(${e.id})">✔ ${translations[currentLang].word_pay}</button>` : '';
        return `<tr>
          <td style="font-weight:600; color:var(--text-muted);">${displayDate}</td><td style="font-weight:600;">${e.lib||""}</td><td style="color:var(--text-muted)">${getTranslatedCategory(e.cat||"")}</td>
          <td><span class="badge ${e.type}">${e.type==='entree' ? translations[currentLang].opt_in : translations[currentLang].opt_out}</span></td>
          <td class="${e.type==='entree'?'pos':'neg'}">${e.type==='entree'?'+':'-'}${fmt(e.mont)} ${currentCurrency}</td>
          <td><span class="badge ${e.stat}">${sL}</span></td>
          <td style="display:flex;">${actionBtn}<button class="btn-danger" onclick="deleteEch(${e.id})">${translations[currentLang].word_delete}</button></td>
        </tr>`;
      }).join('');
  }
  
  const paginationEl = document.getElementById('ech-pagination');
  if (paginationEl) paginationEl.innerHTML = generatePagination(echPage, totalPages, 'ech');
}

function payEch(id) {
  let ech = echData.find(e => e.id === id);
  if (ech && ech.stat !== 'paye') {
    ech.stat = 'paye'; 
    fluxData.push({ id: fluxIdCnt++, date: new Date().toISOString().split('T')[0], lib: "Pay: " + ech.lib, cat: ech.cat, type: ech.type, mont: ech.mont });
    saveData(); renderEch(); 
  }
}
function addEch(){
  const lib=document.getElementById('e-lib').value.trim(); const mont=parseFloat(document.getElementById('e-mont').value);
  const type=document.getElementById('e-type').value; const date=document.getElementById('e-date').value;
  const cat=document.getElementById('e-cat').value; const stat=document.getElementById('e-stat').value;
  if(!lib||isNaN(mont)||!date)return;
  echData.push({id:echIdCnt++,lib,mont,type,date,cat,stat});
  document.getElementById('e-lib').value=''; document.getElementById('e-mont').value='';
  saveData(); echPage=1; renderEch(); 
}
function deleteEch(id){ echData=echData.filter(e=>e.id!==id); saveData(); renderEch(); }

// ================= PREVISION INTELLIGENTE =================
function resetSeuil() {
    const seuilEl = document.getElementById('seuil-input');
    if(seuilEl) {
        seuilEl.value = currentSuggestedSeuil;
        renderPrevision();
    }
}

function renderPrevision(){
  const contentBox = document.getElementById('prevision-content');
  const emptyBox = document.getElementById('prevision-empty-state');
  if (!contentBox || !emptyBox) return;

  if (fluxData.length === 0 && echData.length === 0) {
      contentBox.style.display = 'none'; emptyBox.style.display = 'block'; return;
  } else {
      contentBox.style.display = 'block'; emptyBox.style.display = 'none';
  }

  const labelAlert = document.getElementById('label-prev-alert');
  if(labelAlert) labelAlert.innerHTML = translations[currentLang].prev_alert;

  let eTotal = 0, sTotal = 0;
  let minTime = new Date().getTime(); 
  let maxTime = new Date().getTime();
  
  fluxData.forEach(f => { 
      const fTime = new Date(f.date).getTime();
      if (!isNaN(fTime)) {
          if (fTime < minTime) minTime = fTime;
          if (fTime > maxTime) maxTime = fTime;
      }
      if(f.type === 'entree') eTotal += f.mont; else sTotal += f.mont; 
  });
  
  let spanDays = (maxTime - minTime) / (1000 * 3600 * 24);
  if (spanDays < 1) spanDays = 1; 
  
  const dailyE = eTotal / spanDays; 
  const dailyS = sTotal / spanDays; 

  const pTypeEl = document.getElementById('prev-period-type'); 
  const periodType = pTypeEl ? pTypeEl.value : 'weeks';
  
  // THE "DYNAMIC LIQUIDITY BUFFER" ALGORITHM
  let maxUpcomingOutflow = 0;
  echData.forEach(e => {
      if (e.type === 'sortie' && e.stat !== 'paye') {
          if (e.mont > maxUpcomingOutflow) maxUpcomingOutflow = e.mont;
      }
  });
  
  currentSuggestedSeuil = Math.round((dailyS * 21) + maxUpcomingOutflow) || 10000;
  
  const suggLabel = document.getElementById('suggested-seuil-text');
  if (suggLabel) suggLabel.textContent = `(${translations[currentLang].suggested_buffer}${fmt(currentSuggestedSeuil)} ${currentCurrency})`;
  
  let seuilInput = document.getElementById('seuil-input');
  if(!seuilInput.value) seuilInput.value = currentSuggestedSeuil;
  
  const seuil = parseFloat(seuilInput.value) || 0;
  
  const inEl = document.getElementById('prev-entrees'); 
  const outEl = document.getElementById('prev-sorties');
  const labelIn = document.getElementById('label-prev-in');
  const labelOut = document.getElementById('label-prev-out');

  let avgPeriodE = 0;
  let avgPeriodS = 0;

  if (periodType === 'weeks') {
      if(labelIn) labelIn.innerHTML = translations[currentLang].prev_in_wk;
      if(labelOut) labelOut.innerHTML = translations[currentLang].prev_out_wk;
      avgPeriodE = dailyE * 7;
      avgPeriodS = dailyS * 7;
  } else {
      if(labelIn) labelIn.innerHTML = translations[currentLang].prev_in_mo;
      if(labelOut) labelOut.innerHTML = translations[currentLang].prev_out_mo;
      avgPeriodE = dailyE * 30;
      avgPeriodS = dailyS * 30;
  }

  if(inEl) inEl.value = fmt(Math.round(avgPeriodE)) + ' ' + currentCurrency; 
  if(outEl) outEl.value = fmt(Math.round(avgPeriodS)) + ' ' + currentCurrency;
  
  let solde = getSoldeActuel(); 
  const rows=[], labels=[], dataPoints=[];
  const startDate = new Date(); 
  const loops = (periodType === 'weeks') ? 8 : 6;
  const localeStr = currentLang === 'en' ? 'en-US' : currentLang === 'es' ? 'es-ES' : 'fr-FR';
  
  for(let i=1; i<=loops; i++){
    let d1, d2, label = "";
    
    if (periodType === 'weeks') {
        d1 = new Date(startDate);
        d1.setDate(startDate.getDate() + (i-1)*7); 
        d2 = new Date(d1);
        d2.setDate(d1.getDate() + 6); 
        label = translations[currentLang].word_week + ' ' + i;
    } else {
        d1 = new Date(startDate.getFullYear(), startDate.getMonth() + (i-1), 1);
        d2 = new Date(startDate.getFullYear(), startDate.getMonth() + i, 0); 
        label = translations[currentLang].word_months[d1.getMonth()] + ' ' + d1.getFullYear().toString().substring(2);
    }
    
    const daysInPeriod = Math.round((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24)) + 1;
    const baseE = dailyE * daysInPeriod;
    const baseS = dailyS * daysInPeriod;
    
    let echEntrees = 0; let echSorties = 0;
    const thisPeriodEch = echData.filter(e => { const eDate = new Date(e.date); return eDate >= d1 && eDate <= d2 && e.stat !== 'paye'; });
    thisPeriodEch.forEach(e => { if(e.type === 'entree') echEntrees += e.mont; else echSorties += e.mont; });
    
    const net = (baseE + echEntrees) - (baseS + echSorties); solde += net; 
    labels.push(label); dataPoints.push(Math.round(solde));
    
    rows.push(`<tr>
      <td style="font-weight:700">${label}</td>
      <td style="color:var(--text-muted); font-size:12px;">${d1.toLocaleDateString(localeStr,{day:'2-digit',month:'short'})} - ${d2.toLocaleDateString(localeStr,{day:'2-digit',month:'short'})}</td>
      <td class="${net>=0?'pos':'neg'}">${net>=0?'+':''}${fmt(net)}</td>
      <td>${thisPeriodEch.length}</td>
      <td style="font-weight:800; font-size:15px; white-space:nowrap;">${fmt(Math.round(solde))} ${currentCurrency}</td>
    </tr>`);
  }
  
  const tBody = document.getElementById('prev-table'); if(tBody) tBody.innerHTML=rows.join('');
  const colors = dataPoints.map(v=>v<0?'#f43f5e':v<seuil?'#f59e0b':'#6366f1');
  const gridColor = currentTheme === 'dark' ? '#334155' : '#e2e8f0';
  
  // --- FORECAST ALERT SYSTEM ---
  const alertBox = document.getElementById('prev-alerts');
  let dropsBelow = dataPoints.some(v => v < seuil);
  
  if (dropsBelow && alertBox) {
      alertBox.innerHTML = `<div class="auth-err" style="display:block; background:var(--warning-bg); color:var(--warning); text-align:left; margin-bottom: 15px;">${translations[currentLang].alert_msg} (${fmt(seuil)} ${currentCurrency}) ${translations[currentLang].alert_during}</div>`;
      
      if (Notification.permission === "granted" && !sessionStorage.getItem('daretApp_prev_notified')) {
          new Notification("DARETApp - Alerte Prévision", {
              body: `Attention: Votre solde projeté passera sous votre seuil de ${fmt(seuil)} ${currentCurrency}.`,
          });
          sessionStorage.setItem('daretApp_prev_notified', 'true');
      }
  } else if (alertBox) {
      alertBox.innerHTML = '';
  }
  
  let existingChart = Chart.getChart("chartPrev"); if (existingChart) existingChart.destroy();
  const cPrevEl = document.getElementById('chartPrev');
  if(cPrevEl) {
    new Chart(cPrevEl,{ 
      type:'line', 
      data:{
          labels, 
          datasets:[
              {
                  label:'Solde Projeté', 
                  data:dataPoints, 
                  borderColor:'#6366f1', 
                  backgroundColor:'rgba(99, 102, 241, 0.15)', 
                  pointBackgroundColor:colors, 
                  fill:true, 
                  tension:0.4, 
                  borderWidth:4
              },
              {
                  label:'Seuil d\'Alerte',
                  data: Array(labels.length).fill(seuil),
                  borderColor: '#f59e0b',
                  borderWidth: 2,
                  borderDash: [5, 5],
                  pointRadius: 0,
                  fill: false,
                  tension: 0
              }
          ]
      }, 
      options:{
          responsive:true, 
          maintainAspectRatio:false, 
          plugins:{
              legend:{display: true, labels: { color: currentTheme === 'dark' ? '#94a3b8' : '#64748b' }}
          }, 
          scales:{
              x:{grid:{display:false}},
              y:{border:{display:false}, grid:{color:gridColor, drawBorder:false}}
          }
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
    const today = new Date();
    const makeDate = (y, m, d) => `${y}-${m.toString().padStart(2,'0')}-${d.toString().padStart(2,'0')}`;
    const fDate = document.getElementById('f-date');
    if(fDate) fDate.value = makeDate(today.getFullYear(), today.getMonth()+1, today.getDate());
    const eDate = document.getElementById('e-date');
    if(eDate) eDate.value = makeDate(today.getFullYear(), today.getMonth()+1, today.getDate());
});