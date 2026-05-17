/* ============================================================
   معيار PRO - النظام المتكامل لتقييم المرافق الصحية
   الجمهورية اليمنية - وزارة الصحة والبيئة - محافظة إب
   Developed by: د/صلاح الأهدل
   Version: 3.0.0 PRO | Date: 2026
   Standards: JCI | HHFA | CBAHI | ISO 15189
   ============================================================ */

// ==================== CONFIGURATION ====================
const CONFIG = {
    VERSION: '3.0.0 PRO',
    APP_NAME: 'نظام معيار PRO',
    SESSION_DURATION: 3600000, // 1 hour
    API_BASE: '', // For future backend integration
    DEFAULT_FACILITIES: [
        { id: 1, name: 'مستشفى إب العام', type: 'public', category: 'hospital', city: 'إب', manager: 'د. أحمد عبدالله', license: 'YEM-IBB-001', address: 'شارع الستين، إب', status: 'active', lastAssessment: '2026-04-15' },
        { id: 2, name: 'مستشفى الثورة', type: 'public', category: 'hospital', city: 'إب', manager: 'د. محمد القادري', license: 'YEM-IBB-002', address: 'حدة، إب', status: 'active', lastAssessment: '2026-03-20' },
        { id: 3, name: 'مركز الرعاية الأولية - حزيز', type: 'public', category: 'primary', city: 'حزيز', manager: 'د. خالد الصنعاني', license: 'YEM-IBB-003', address: 'حزيز، إب', status: 'active', lastAssessment: '2026-02-10' },
        { id: 4, name: 'مستشفى السلام الخاص', type: 'private', category: 'hospital', city: 'إب', manager: 'د. سامر الحاج', license: 'YEM-IBB-004', address: 'القاعة، إب', status: 'active', lastAssessment: '2026-05-01' },
        { id: 5, name: 'عيادة الأمل الطبية', type: 'private', category: 'clinic', city: 'إب', manager: 'د. فاطمة العمري', license: 'YEM-IBB-005', address: 'الأربعين، إب', status: 'active', lastAssessment: '2026-01-18' }
    ]
};

// ==================== STATE MANAGEMENT ====================
const state = {
    currentPage: 'dashboard',
    facilities: [],
    assessments: [],
    currentAssessment: null,
    assessmentStep: 0,
    sidebarOpen: false,
    session: null,
    settings: {
        language: 'ar',
        theme: 'dark',
        notifications: true,
        autoSave: true
    }
};

// ==================== MAIN APP CONTROLLER ====================
const app = {

    // --- Initialization ---
    init() {
        this.loadSession();
        this.loadFacilities();
        this.loadSettings();
        this.renderNavigation();
        this.navigate('dashboard');
        this.setupEventListeners();
        this.setupKeyboardShortcuts();

        // Display current user
        const userDisplay = document.getElementById('userDisplay');
        if (userDisplay && state.session) {
            userDisplay.textContent = state.session.username || 'مدير النظام';
        }

        console.log(`%c${CONFIG.APP_NAME} v${CONFIG.VERSION}`, 'color: #D4AF37; font-size: 16px; font-weight: bold;');
        console.log('%c⚠️ Developer Tools - Authorized Personnel Only', 'color: #ff073a; font-size: 12px;');
    },

    // --- Session Management ---
    loadSession() {
        try {
            const sessionData = localStorage.getItem('pro_session') || sessionStorage.getItem('pro_session');
            if (sessionData) {
                state.session = JSON.parse(sessionData);
            }
        } catch (e) {
            console.error('Session load error:', e);
        }
    },

    logout() {
        localStorage.removeItem('pro_session');
        sessionStorage.removeItem('pro_session');
        state.session = null;
        window.location.href = 'login.html';
    },

    // --- Data Management ---
    loadFacilities() {
        try {
            const stored = localStorage.getItem('pro_facilities');
            state.facilities = stored ? JSON.parse(stored) : [...CONFIG.DEFAULT_FACILITIES];
        } catch (e) {
            state.facilities = [...CONFIG.DEFAULT_FACILITIES];
        }
    },

    saveFacilities() {
        localStorage.setItem('pro_facilities', JSON.stringify(state.facilities));
    },

    loadSettings() {
        try {
            const stored = localStorage.getItem('pro_settings');
            if (stored) {
                state.settings = { ...state.settings, ...JSON.parse(stored) };
            }
        } catch (e) {
            console.error('Settings load error:', e);
        }
    },

    saveSettings() {
        localStorage.setItem('pro_settings', JSON.stringify(state.settings));
    },

    // --- Navigation ---
    navigate(page) {
        state.currentPage = page;

        // Update nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.page === page);
            link.setAttribute('aria-selected', link.dataset.page === page ? 'true' : 'false');
        });

        // Close mobile sidebar
        this.toggleSidebar(false);

        // Render page content
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = '';

        const renderers = {
            dashboard: () => this.renderDashboard(),
            facilities: () => this.renderFacilities(),
            assessment: () => this.renderAssessment(),
            reports: () => this.renderReports(),
            standards: () => this.renderStandards(),
            analytics: () => this.renderAnalytics(),
            settings: () => this.renderSettings()
        };

        if (renderers[page]) {
            renderers[page]();
        }

        // Update page title
        const titles = {
            dashboard: 'لوحة التحكم',
            facilities: 'المرافق الصحية',
            assessment: 'تقييم جديد',
            reports: 'التقارير',
            standards: 'دليل المعايير',
            analytics: 'التحليلات',
            settings: 'إعدادات النظام'
        };
        document.title = `${titles[page] || ''} | ${CONFIG.APP_NAME} v${CONFIG.VERSION}`;
    },

    // --- Sidebar ---
    toggleSidebar(force) {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const isOpen = force !== undefined ? force : !state.sidebarOpen;
        state.sidebarOpen = isOpen;

        sidebar.classList.toggle('open', isOpen);
        overlay.classList.toggle('active', isOpen);
    },

    // --- Toast Notifications ---
    toast(message, type = 'info', duration = 4000) {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-times-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        toast.innerHTML = `<i class="fas ${icons[type] || 'fa-info-circle'}" aria-hidden="true"></i><span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => toast.remove(), 400);
        }, duration);
    },

    // --- Modal Handling ---
    openModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },

    closeModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
        // Reset forms
        if (id === 'facilityModal') {
            document.getElementById('facilityForm').reset();
        }
    },

    confirm(message, onConfirm) {
        document.getElementById('confirmMessage').textContent = message;
        const btn = document.getElementById('confirmBtn');
        btn.onclick = () => {
            onConfirm();
            this.closeModal('confirmModal');
        };
        this.openModal('confirmModal');
    },

    // --- Loading ---
    showLoading() {
        document.getElementById('loadingOverlay').classList.add('active');
    },

    hideLoading() {
        document.getElementById('loadingOverlay').classList.remove('active');
    },

    // ==================== PAGE RENDERERS ====================

    // --- Dashboard ---
    renderDashboard() {
        const totalFacilities = state.facilities.length;
        const activeFacilities = state.facilities.filter(f => f.status === 'active').length;
        const totalAssessments = state.assessments.length || 12;
        const pendingAssessments = state.assessments.filter(a => a.status === 'pending').length || 3;

        const recentActivities = [
            { icon: 'fa-clipboard-check', text: 'تم إكمال تقييم مستشفى إب العام', time: 'منذ 2 ساعة', type: 'success' },
            { icon: 'fa-plus-circle', text: 'تم إضافة منشأة صحية جديدة', time: 'منذ 4 ساعات', type: 'info' },
            { icon: 'fa-user-plus', text: 'تم إضافة مستخدم جديد للنظام', time: 'منذ 6 ساعات', type: 'info' },
            { icon: 'fa-exclamation-circle', text: 'تنبيه: مراجعة تقرير سنوي مطلوب', time: 'منذ 8 ساعات', type: 'warning' },
            { icon: 'fa-check-circle', text: 'تم تحديث المعايير الدولية', time: 'أمس', type: 'success' },
            { icon: 'fa-chart-line', text: 'تم إنشاء تقرير تحليلي جديد', time: 'أمس', type: 'info' }
        ];

        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="page-header">
                <div class="page-title">
                    <h2>لوحة التحكم</h2>
                    <p>نظرة عامة على أداء المرافق الصحية والتقييمات</p>
                </div>
                <div class="flex gap-2 flex-wrap">
                    <button class="btn btn-primary" onclick="app.navigate('assessment')">
                        <i class="fas fa-clipboard-check"></i> تقييم جديد
                    </button>
                    <button class="btn btn-outline" onclick="window.print()">
                        <i class="fas fa-print"></i> طباعة
                    </button>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card default">
                    <div class="stat-icon"><i class="fas fa-hospital"></i></div>
                    <div class="stat-value">${totalFacilities}</div>
                    <div class="stat-label">إجمالي المرافق</div>
                    <div class="stat-trend up"><i class="fas fa-arrow-up"></i> +2 هذا الشهر</div>
                </div>
                <div class="stat-card success">
                    <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
                    <div class="stat-value">${activeFacilities}</div>
                    <div class="stat-label">المرافق النشطة</div>
                    <div class="stat-trend up"><i class="fas fa-arrow-up"></i> 100%</div>
                </div>
                <div class="stat-card info">
                    <div class="stat-icon"><i class="fas fa-clipboard-check"></i></div>
                    <div class="stat-value">${totalAssessments}</div>
                    <div class="stat-label">التقييمات</div>
                    <div class="stat-trend up"><i class="fas fa-arrow-up"></i> +5</div>
                </div>
                <div class="stat-card warning">
                    <div class="stat-icon"><i class="fas fa-clock"></i></div>
                    <div class="stat-value">${pendingAssessments}</div>
                    <div class="stat-label">قيد الانتظار</div>
                    <div class="stat-trend down"><i class="fas fa-arrow-down"></i> -1</div>
                </div>
                <div class="stat-card danger">
                    <div class="stat-icon"><i class="fas fa-exclamation-triangle"></i></div>
                    <div class="stat-value">2</div>
                    <div class="stat-label">تحتاج مراجعة</div>
                    <div class="stat-trend stable"><i class="fas fa-minus"></i> ثابت</div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-chart-line"></i> الأداء الشهري</h3>
                    <button class="btn btn-sm btn-outline" onclick="app.navigate('analytics')">
                        <i class="fas fa-expand"></i> عرض التفاصيل
                    </button>
                </div>
                <div style="height: 300px; display: flex; align-items: flex-end; justify-content: space-around; gap: 1rem; padding: 1rem 0;">
                    ${[65, 78, 82, 70, 88, 92, 85, 90, 95, 88, 92, 98].map((val, i) => `
                        <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:0.5rem;">
                            <div style="font-size:0.75rem; color:var(--gold-300); font-weight:700;">${val}%</div>
                            <div style="width:100%; max-width:40px; height:${val * 2.5}px; background: linear-gradient(180deg, var(--gold-300), var(--gold-600)); border-radius: 6px 6px 0 0; transition: var(--transition-base); cursor: pointer; position: relative;"
                                 onmouseover="this.style.filter='brightness(1.2)'; this.style.transform='scale(1.05)'"
                                 onmouseout="this.style.filter=''; this.style.transform=''">
                            </div>
                            <div style="font-size:0.7rem; color:var(--text-muted);">${['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'][i]}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="grid grid-cols-2" style="gap: 1.8rem;">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title"><i class="fas fa-list-alt"></i> النشاطات الأخيرة</h3>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:1rem;">
                        ${recentActivities.map(a => `
                            <div style="display:flex; align-items:center; gap:0.8rem; padding:0.8rem; background:var(--bg-elevated); border-radius:var(--radius-sm); transition:var(--transition-fast); cursor:default;"
                                 onmouseover="this.style.background='rgba(212,175,55,0.05)'" onmouseout="this.style.background='var(--bg-elevated)'">
                                <div style="width:36px;height:36px;border-radius:50%;background:rgba(212,175,55,0.1);display:flex;align-items:center;justify-content:center;color:var(--gold-300);flex-shrink:0;">
                                    <i class="fas ${a.icon}"></i>
                                </div>
                                <div style="flex:1;">
                                    <div style="font-size:0.9rem; color:var(--text-primary);">${a.text}</div>
                                    <div style="font-size:0.75rem; color:var(--text-muted);">${a.time}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title"><i class="fas fa-hospital"></i> المرافق حسب النوع</h3>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:1.2rem;">
                        ${[
                            { label: 'مستشفيات حكومية', value: 2, total: 5, color: '#D4AF37' },
                            { label: 'مستشفيات خاصة', value: 1, total: 5, color: '#00f3ff' },
                            { label: 'مراكز رعاية أولية', value: 1, total: 5, color: '#39ff14' },
                            { label: 'عيادات / مراكز طبية', value: 1, total: 5, color: '#ff6b35' }
                        ].map(item => `
                            <div>
                                <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem; font-size:0.9rem;">
                                    <span style="color:var(--text-primary); font-weight:600;">${item.label}</span>
                                    <span style="color:var(--gold-300); font-weight:700;">${item.value}</span>
                                </div>
                                <div style="height:8px; background:var(--bg-elevated); border-radius:var(--radius-full); overflow:hidden;">
                                    <div style="height:100%; width:${(item.value / item.total) * 100}%; background: ${item.color}; border-radius:var(--radius-full); transition: width 1s ease;"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-subtle);">
                        <h4 style="font-size: 1rem; margin-bottom: 1rem; color: var(--gold-100);">
                            <i class="fas fa-map-marker-alt" style="color: var(--neon-red);"></i> التغطية الجغرافية
                        </h4>
                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            ${['إب', 'حزيز', 'القاعة', 'الأربعين', 'حدة', 'العدين', 'يريم'].map(city => `
                                <span style="padding: 0.35rem 0.8rem; background: rgba(212,175,55,0.1); border: 1px solid rgba(212,175,55,0.2); border-radius: var(--radius-sm); font-size: 0.8rem; color: var(--gold-100);">${city}</span>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // --- Facilities ---
    renderFacilities() {
        const filter = state.facilityFilter || 'all';
        const search = state.facilitySearch || '';

        let filtered = state.facilities;
        if (filter !== 'all') {
            filtered = filtered.filter(f => f.type === filter || f.status === filter);
        }
        if (search) {
            filtered = filtered.filter(f => f.name.toLowerCase().includes(search.toLowerCase()) || f.city.includes(search));
        }

        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="page-header">
                <div class="page-title">
                    <h2>المرافق الصحية</h2>
                    <p>إدارة وتقييم المرافق الصحية المسجلة في النظام</p>
                </div>
                <div class="flex gap-2 flex-wrap">
                    <button class="btn btn-primary" onclick="app.openModal('facilityModal')">
                        <i class="fas fa-plus"></i> إضافة منشأة
                    </button>
                    <button class="btn btn-outline" onclick="window.print()">
                        <i class="fas fa-print"></i> طباعة
                    </button>
                </div>
            </div>

            <div class="search-box">
                <i class="fas fa-search"></i>
                <input type="text" class="form-input" placeholder="البحث في المرافق الصحية..."
                       value="${search}" oninput="state.facilitySearch=this.value; app.renderFacilities();">
            </div>

            <div class="filter-tabs">
                <button class="filter-tab ${filter === 'all' ? 'active' : ''}" onclick="state.facilityFilter='all'; app.renderFacilities();">الكل</button>
                <button class="filter-tab ${filter === 'public' ? 'active' : ''}" onclick="state.facilityFilter='public'; app.renderFacilities();">حكومي</button>
                <button class="filter-tab ${filter === 'private' ? 'active' : ''}" onclick="state.facilityFilter='private'; app.renderFacilities();">خاص</button>
                <button class="filter-tab ${filter === 'ngo' ? 'active' : ''}" onclick="state.facilityFilter='ngo'; app.renderFacilities();">أهلي</button>
                <button class="filter-tab ${filter === 'active' ? 'active' : ''}" onclick="state.facilityFilter='active'; app.renderFacilities();">نشط</button>
            </div>

            <div class="table-wrapper">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>المنشأة</th>
                            <th>النوع</th>
                            <th>الفئة</th>
                            <th>المدينة</th>
                            <th>المدير</th>
                            <th>الحالة</th>
                            <th>آخر تقييم</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filtered.length === 0 ? `
                            <tr><td colspan="9" class="text-center" style="padding: 3rem; color: var(--text-muted);">
                                <i class="fas fa-inbox" style="font-size: 2rem; display: block; margin-bottom: 1rem;"></i>
                                لا توجد مرافق مطابقة للبحث
                            </td></tr>
                        ` : filtered.map((f, i) => {
                            const typeLabels = { public: 'حكومي', private: 'خاص', ngo: 'أهلي', military: 'عسكري' };
                            const catLabels = { hospital: 'مستشفى', primary: 'رعاية أولية', clinic: 'عيادة', lab: 'مختبر', pharmacy: 'صيدلية' };
                            const statusBadges = {
                                active: '<span class="badge badge-success"><i class="fas fa-check"></i> نشط</span>',
                                inactive: '<span class="badge badge-neutral"><i class="fas fa-pause"></i> غير نشط</span>',
                                suspended: '<span class="badge badge-warning"><i class="fas fa-exclamation"></i> معلق</span>'
                            };
                            return `
                                <tr>
                                    <td>${i + 1}</td>
                                    <td style="font-weight: 700;">${f.name}</td>
                                    <td>${typeLabels[f.type] || f.type}</td>
                                    <td>${catLabels[f.category] || f.category}</td>
                                    <td>${f.city}</td>
                                    <td>${f.manager || '-'}</td>
                                    <td>${statusBadges[f.status] || f.status}</td>
                                    <td>${f.lastAssessment || 'لم يتم'}</td>
                                    <td>
                                        <div class="action-btns">
                                            <button class="btn-icon" title="تقييم" onclick="app.startAssessment(${f.id})">
                                                <i class="fas fa-clipboard-check"></i>
                                            </button>
                                            <button class="btn-icon" title="تعديل" onclick="app.editFacility(${f.id})">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="btn-icon" title="حذف" onclick="app.deleteFacility(${f.id})" style="color:var(--neon-red);">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    saveFacility() {
        const form = document.getElementById('facilityForm');
        const name = document.getElementById('fName').value.trim();
        const type = document.getElementById('fType').value;
        const category = document.getElementById('fCategory').value;
        const city = document.getElementById('fCity').value.trim();

        if (!name || !type || !category || !city) {
            this.toast('يرجى ملء جميع الحقول المطلوبة', 'warning');
            return;
        }

        const newFacility = {
            id: Date.now(),
            name, type, category, city,
            manager: document.getElementById('fManager').value.trim(),
            license: document.getElementById('fLicense').value.trim(),
            address: document.getElementById('fAddress').value.trim(),
            notes: document.getElementById('fNotes').value.trim(),
            status: 'active',
            lastAssessment: null
        };

        state.facilities.push(newFacility);
        this.saveFacilities();
        this.closeModal('facilityModal');
        this.toast('تم إضافة المنشأة بنجاح', 'success');
        this.renderFacilities();
    },

    deleteFacility(id) {
        this.confirm('هل أنت متأكد من حذف هذه المنشأة؟ لا يمكن التراجع عن هذا الإجراء.', () => {
            state.facilities = state.facilities.filter(f => f.id !== id);
            this.saveFacilities();
            this.toast('تم حذف المنشأة بنجاح', 'success');
            this.renderFacilities();
        });
    },

    editFacility(id) {
        const facility = state.facilities.find(f => f.id === id);
        if (!facility) return;
        this.toast('وظيفة التعديل قيد التطوير', 'info');
    },

    startAssessment(facilityId) {
        const facility = state.facilities.find(f => f.id === facilityId);
        if (!facility) return;
        state.currentAssessment = {
            facilityId,
            facilityName: facility.name,
            answers: {},
            date: new Date().toISOString()
        };
        state.assessmentStep = 0;
        this.navigate('assessment');
        this.toast(`بدء تقييم: ${facility.name}`, 'info');
    },


    // --- Assessment Wizard ---
    renderAssessment() {
        if (!state.currentAssessment) {
            document.getElementById('mainContent').innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <h3>لا يوجد تقييم نشط</h3>
                    <p>يرجى اختيار منشأة صحية من قائمة المرافق لبدء تقييم جديد</p>
                    <button class="btn btn-primary mt-4" onclick="app.navigate('facilities')">
                        <i class="fas fa-hospital"></i> اختيار منشأة
                    </button>
                </div>
            `;
            return;
        }

        const steps = [
            { title: 'المعلومات الأساسية', icon: 'fa-info-circle' },
            { title: 'الإدارة والقيادة', icon: 'fa-users-cog' },
            { title: 'جودة الرعاية', icon: 'fa-hand-holding-medical' },
            { title: 'السلامة والأمان', icon: 'fa-shield-alt' },
            { title: 'الموارد البشرية', icon: 'fa-user-md' },
            { title: 'المرافق والمعدات', icon: 'fa-tools' },
            { title: 'النتائج', icon: 'fa-flag-checkered' }
        ];

        const assessmentCriteria = [
            {
                section: 'الإدارة والقيادة',
                weight: '20%',
                criteria: [
                    { id: 'm1', title: 'وجود هيكل تنظيمي واضح', desc: 'هل يوجد هيكل تنظيمي واضح ومعتمد للمنشأة الصحية؟' },
                    { id: 'm2', title: 'خطة استراتيجية', desc: 'هل توجد خطة استراتيجية سنوية معتمدة وقابلة للقياس؟' },
                    { id: 'm3', title: 'نظام إدارة المخاطر', desc: 'هل يوجد نظام فعال لإدارة المخاطر والأزمات؟' }
                ]
            },
            {
                section: 'جودة الرعاية',
                weight: '25%',
                criteria: [
                    { id: 'q1', title: 'بروتوكولات علاجية', desc: 'هل توجد بروتوكولات علاجية معتمدة ومحدثة؟' },
                    { id: 'q2', title: 'سجل طبي إلكتروني', desc: 'هل يوجد نظام سجل طبي إلكتروني فعال؟' },
                    { id: 'q3', title: 'نظام مراقبة الجودة', desc: 'هل يوجد نظام لمراقبة ومتابعة جودة الخدمات؟' }
                ]
            },
            {
                section: 'السلامة والأمان',
                weight: '25%',
                criteria: [
                    { id: 's1', title: 'مكافحة العدوى', desc: 'هل توجد إجراءات فعالة لمكافحة العدوى؟' },
                    { id: 's2', title: 'سلامة الأدوية', desc: 'هل يوجد نظام لإدارة ومراقبة سلامة الأدوية؟' },
                    { id: 's3', title: 'إدارة النفايات', desc: 'هل توجد إجراءات آمنة لإدارة النفايات الطبية؟' }
                ]
            },
            {
                section: 'الموارد البشرية',
                weight: '15%',
                criteria: [
                    { id: 'h1', title: 'نسبة الكادر الطبي', desc: 'هل نسبة الكادر الطبي للمرضى مناسبة؟' },
                    { id: 'h2', title: 'التدريب والتطوير', desc: 'هل توجد برامج تدريب منتظمة للكادر؟' }
                ]
            },
            {
                section: 'المرافق والمعدات',
                weight: '15%',
                criteria: [
                    { id: 'f1', title: 'صيانة المعدات', desc: 'هل توجد خطة صيانة دورية للمعدات الطبية؟' },
                    { id: 'f2', title: 'نظافة المرافق', desc: 'هل تتوفر معايير نظافة وصيانة للمرافق؟' }
                ]
            }
        ];

        const currentStepData = steps[state.assessmentStep];
        const isLastStep = state.assessmentStep === steps.length - 1;
        const isFirstStep = state.assessmentStep === 0;

        let content = '';

        if (isLastStep) {
            // Results page
            content = this.renderAssessmentResults();
        } else if (state.assessmentStep === 0) {
            // Info page
            content = `
                <div class="card">
                    <h3 style="margin-bottom: 1rem;"><i class="fas fa-hospital" style="color: var(--gold-300);"></i> ${state.currentAssessment.facilityName}</h3>
                    <p style="color: var(--text-tertiary); margin-bottom: 1.5rem;">تاريخ التقييم: ${new Date().toLocaleDateString('ar-YE')}</p>
                    <div class="form-group">
                        <label class="form-label">ملاحظات عامة</label>
                        <textarea class="form-input" rows="4" placeholder="أي ملاحظات عامة قبل بدء التقييم..."></textarea>
                    </div>
                </div>
            `;
        } else {
            const section = assessmentCriteria[state.assessmentStep - 1];
            if (section) {
                content = `
                    <div class="criteria-section-header">
                        <h4><i class="fas fa-tasks" style="color: var(--gold-300);"></i> ${section.section}</h4>
                        <span class="weight-badge">الوزن: ${section.weight}</span>
                    </div>
                    ${section.criteria.map(c => `
                        <div class="criterion-card">
                            <div class="criterion-title">${c.title}</div>
                            <div class="criterion-desc">${c.desc}</div>
                            <div class="options-group">
                                <button class="option-btn ${state.currentAssessment.answers[c.id] === 'yes' ? 'selected' : ''}" data-value="yes" onclick="app.selectAnswer('${c.id}', 'yes')">
                                    <i class="fas fa-check"></i> نعم
                                </button>
                                <button class="option-btn ${state.currentAssessment.answers[c.id] === 'partial' ? 'selected' : ''}" data-value="partial" onclick="app.selectAnswer('${c.id}', 'partial')">
                                    <i class="fas fa-adjust"></i> جزئي
                                </button>
                                <button class="option-btn ${state.currentAssessment.answers[c.id] === 'no' ? 'selected' : ''}" data-value="no" onclick="app.selectAnswer('${c.id}', 'no')">
                                    <i class="fas fa-times"></i> لا
                                </button>
                                <button class="option-btn ${state.currentAssessment.answers[c.id] === 'na' ? 'selected' : ''}" data-value="na" onclick="app.selectAnswer('${c.id}', 'na')">
                                    <i class="fas fa-ban"></i> غير مطبق
                                </button>
                            </div>
                        </div>
                    `).join('')}
                `;
            }
        }

        // Progress
        const totalCriteria = assessmentCriteria.reduce((acc, s) => acc + s.criteria.length, 0);
        const answeredCount = Object.keys(state.currentAssessment.answers).length;
        const progressPercent = Math.round((answeredCount / totalCriteria) * 100);

        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="page-header">
                <div class="page-title">
                    <h2>تقييم جديد</h2>
                    <p>${state.currentAssessment.facilityName}</p>
                </div>
                <button class="btn btn-outline" onclick="app.cancelAssessment()">
                    <i class="fas fa-times"></i> إلغاء
                </button>
            </div>

            <div class="progress-container">
                <div class="progress-header">
                    <span>تقدم التقييم</span>
                    <span>${progressPercent}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercent}%"></div>
                </div>
            </div>

            <div class="wizard-container">
                <div class="wizard-steps">
                    ${steps.map((step, i) => `
                        <div class="wizard-step ${i === state.assessmentStep ? 'active' : i < state.assessmentStep ? 'completed' : ''}" onclick="app.goToStep(${i})">
                            <div class="step-number">${i < state.assessmentStep ? '<i class="fas fa-check"></i>' : i + 1}</div>
                            <div class="step-label">${step.title}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="assessment-step-content active">
                ${content}
            </div>

            <div style="display:flex; justify-content:space-between; margin-top: 2rem; flex-wrap: wrap; gap: 1rem;">
                <button class="btn btn-outline" onclick="app.prevStep()" ${isFirstStep ? 'disabled' : ''}>
                    <i class="fas fa-arrow-right"></i> السابق
                </button>
                <button class="btn btn-primary" onclick="app.nextStep()">
                    ${isLastStep ? 'إنهاء التقييم' : 'التالي'} <i class="fas fa-arrow-left"></i>
                </button>
            </div>
        `;
    },

    selectAnswer(criterionId, value) {
        if (!state.currentAssessment) return;
        state.currentAssessment.answers[criterionId] = value;
        this.renderAssessment();
    },

    goToStep(step) {
        state.assessmentStep = step;
        this.renderAssessment();
    },

    nextStep() {
        const steps = [
            'المعلومات الأساسية', 'الإدارة والقيادة', 'جودة الرعاية',
            'السلامة والأمان', 'الموارد البشرية', 'المرافق والمعدات', 'النتائج'
        ];
        if (state.assessmentStep < steps.length - 1) {
            state.assessmentStep++;
            this.renderAssessment();
        } else {
            this.finishAssessment();
        }
    },

    prevStep() {
        if (state.assessmentStep > 0) {
            state.assessmentStep--;
            this.renderAssessment();
        }
    },

    renderAssessmentResults() {
        const answers = state.currentAssessment.answers;
        const totalQuestions = Object.keys(answers).length;
        const yesCount = Object.values(answers).filter(v => v === 'yes').length;
        const partialCount = Object.values(answers).filter(v => v === 'partial').length;
        const score = totalQuestions > 0 ? Math.round(((yesCount + (partialCount * 0.5)) / totalQuestions) * 100) : 0;

        let grade, gradeClass, recommendations;
        if (score >= 95) { grade = 'A+'; gradeClass = 'grade-a-plus'; }
        else if (score >= 85) { grade = 'A'; gradeClass = 'grade-a'; }
        else if (score >= 75) { grade = 'B'; gradeClass = 'grade-b'; }
        else if (score >= 65) { grade = 'C'; gradeClass = 'grade-c'; }
        else { grade = 'D'; gradeClass = 'grade-d'; }

        const domains = [
            { name: 'الإدارة', score: 78 },
            { name: 'الجودة', score: 85 },
            { name: 'السلامة', score: 72 },
            { name: 'الموارد', score: 90 },
            { name: 'المرافق', score: 65 }
        ];

        return `
            <div class="result-header">
                <h3 style="color: var(--gold-100); margin-bottom: 1rem;">نتيجة التقييم</h3>
                <div class="grade-circle ${gradeClass}">${grade}</div>
                <div style="font-size: 2rem; font-weight: 900; color: var(--text-primary);">${score}%</div>
                <div style="color: var(--text-tertiary); margin-top: 0.5rem;">درجة التقييم الإجمالية</div>
            </div>

            <div class="radar-grid">
                ${domains.map(d => `
                    <div class="radar-item">
                        <div class="radar-score" style="color: ${d.score >= 80 ? 'var(--neon-green)' : d.score >= 70 ? 'var(--neon-gold)' : 'var(--neon-red)'};">${d.score}%</div>
                        <div class="radar-label">${d.name}</div>
                    </div>
                `).join('')}
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-lightbulb" style="color: var(--neon-gold);"></i> التوصيات</h3>
                </div>
                <div class="rec-card high">
                    <div class="rec-priority-badge high"><i class="fas fa-exclamation-circle"></i> أولوية عالية</div>
                    <p>تحسين نظام إدارة النفايات الطبية بما يتوافق مع معايير الصحة العالمية</p>
                </div>
                <div class="rec-card medium">
                    <div class="rec-priority-badge medium"><i class="fas fa-exclamation-triangle"></i> أولوية متوسطة</div>
                    <p>تطوير برامج التدريب المستمر للكادر الطبي والإداري</p>
                </div>
                <div class="rec-card low">
                    <div class="rec-priority-badge low"><i class="fas fa-check-circle"></i> أولوية منخفضة</div>
                    <p>تحديث البروتوكولات العلاجية بشكل دوري</p>
                </div>
            </div>

            <div style="display:flex; justify-content:center; gap: 1rem; margin-top: 2rem;">
                <button class="btn btn-primary" onclick="window.print()">
                    <i class="fas fa-print"></i> طباعة التقرير
                </button>
                <button class="btn btn-outline" onclick="app.navigate('dashboard')">
                    <i class="fas fa-home"></i> العودة للرئيسية
                </button>
            </div>
        `;
    },

    finishAssessment() {
        const assessment = {
            ...state.currentAssessment,
            id: Date.now(),
            status: 'completed',
            completedAt: new Date().toISOString()
        };
        state.assessments.push(assessment);
        localStorage.setItem('pro_assessments', JSON.stringify(state.assessments));

        // Update facility last assessment
        const facility = state.facilities.find(f => f.id === state.currentAssessment.facilityId);
        if (facility) {
            facility.lastAssessment = new Date().toISOString().split('T')[0];
            this.saveFacilities();
        }

        this.toast('تم إكمال التقييم بنجاح!', 'success');
        state.currentAssessment = null;
        state.assessmentStep = 0;
        this.navigate('reports');
    },

    cancelAssessment() {
        this.confirm('هل أنت متأكد من إلغاء التقييم الحالي؟ سيتم فقدان البيانات.', () => {
            state.currentAssessment = null;
            state.assessmentStep = 0;
            this.navigate('dashboard');
        });
    },

    // --- Reports ---
    renderReports() {
        const assessments = JSON.parse(localStorage.getItem('pro_assessments') || '[]');
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="page-header">
                <div class="page-title">
                    <h2>التقارير</h2>
                    <p>تقارير التقييمات والتحليلات</p>
                </div>
                <button class="btn btn-outline" onclick="window.print()">
                    <i class="fas fa-print"></i> طباعة
                </button>
            </div>

            <div class="filter-tabs">
                <button class="filter-tab active">جميع التقارير</button>
                <button class="filter-tab">شهري</button>
                <button class="filter-tab">ربع سنوي</button>
                <button class="filter-tab">سنوي</button>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-file-alt"></i> سجل التقييمات</h3>
                </div>
                <div class="table-wrapper">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>المنشأة</th>
                                <th>التاريخ</th>
                                <th>الدرجة</th>
                                <th>التقدير</th>
                                <th>الحالة</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${assessments.length === 0 ? `
                                <tr><td colspan="7" class="text-center" style="padding: 3rem; color: var(--text-muted);">
                                    <i class="fas fa-inbox" style="font-size: 2rem; display: block; margin-bottom: 1rem;"></i>
                                    لا توجد تقييمات مسجلة بعد
                                </td></tr>
                            ` : assessments.map((a, i) => {
                                const answers = a.answers || {};
                                const total = Object.keys(answers).length;
                                const yes = Object.values(answers).filter(v => v === 'yes').length;
                                const partial = Object.values(answers).filter(v => v === 'partial').length;
                                const score = total > 0 ? Math.round(((yes + (partial * 0.5)) / total) * 100) : 0;
                                const grade = score >= 85 ? 'A' : score >= 75 ? 'B' : score >= 65 ? 'C' : 'D';
                                return `
                                    <tr>
                                        <td>${i + 1}</td>
                                        <td>${a.facilityName || 'غير معروف'}</td>
                                        <td>${a.completedAt ? new Date(a.completedAt).toLocaleDateString('ar-YE') : '-'}</td>
                                        <td style="font-weight: 900;">${score}%</td>
                                        <td><span class="badge badge-${grade === 'A' ? 'success' : grade === 'B' ? 'gold' : grade === 'C' ? 'warning' : 'danger'}">${grade}</span></td>
                                        <td><span class="badge badge-success">مكتمل</span></td>
                                        <td>
                                            <button class="btn-icon" title="عرض" onclick="app.viewReport(${a.id})">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    viewReport(id) {
        this.toast('عرض التقرير قيد التطوير', 'info');
    },

    // --- Standards Guide ---
    renderStandards() {
        const standards = [
            { name: 'JCI', fullName: 'Joint Commission International', desc: 'لجنة الاعتماد المشترك الدولي - معايير الجودة والسلامة في المرافق الصحية', icon: 'fa-globe', color: '#0080ff' },
            { name: 'HHFA', fullName: 'Hospital and Health Facility Assessment', desc: 'تقييم المستشفيات والمرافق الصحية - منظمة الصحة العالمية', icon: 'fa-hospital', color: '#39ff14' },
            { name: 'CBAHI', fullName: 'Central Board for Accreditation of Healthcare Institutions', desc: 'الهيئة المركزية لاعتماد المؤسسات الصحية - المملكة العربية السعودية', icon: 'fa-certificate', color: '#D4AF37' },
            { name: 'ISO 15189', fullName: 'Medical Laboratories Quality Standard', desc: 'معيار جودة المختبرات الطبية - المنظمة الدولية للتوحيد القياسي', icon: 'fa-flask', color: '#ff6b35' }
        ];

        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="page-header">
                <div class="page-title">
                    <h2>دليل المعايير</h2>
                    <p>المعايير الدولية المعتمدة للتقييم</p>
                </div>
            </div>

            <div class="grid grid-cols-2" style="gap: 1.8rem;">
                ${standards.map(s => `
                    <div class="card" style="border-top: 3px solid ${s.color};">
                        <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1rem;">
                            <div style="width:60px;height:60px;border-radius:var(--radius-lg);background:${s.color}15;color:${s.color};display:flex;align-items:center;justify-content:center;font-size:1.8rem;">
                                <i class="fas ${s.icon}"></i>
                            </div>
                            <div>
                                <h3 style="color: var(--text-primary); font-size: 1.3rem;">${s.name}</h3>
                                <p style="color: var(--text-muted); font-size: 0.8rem;">${s.fullName}</p>
                            </div>
                        </div>
                        <p style="color: var(--text-secondary); line-height: 1.8;">${s.desc}</p>
                        <div style="margin-top: 1rem;">
                            <button class="btn btn-sm btn-outline" onclick="app.toast('التفاصيل قيد التطوير', 'info')">
                                <i class="fas fa-book-open"></i> عرض التفاصيل
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="card mt-6">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-balance-scale" style="color: var(--gold-300);"></i> مقارنة المعايير</h3>
                </div>
                <div class="table-wrapper">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>المعيار</th>
                                <th>التركيز</th>
                                <th>نطاق التطبيق</th>
                                <th>التجدد</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>JCI</td><td>الجودة والسلامة</td><td>عالمي</td><td>كل 3 سنوات</td></tr>
                            <tr><td>HHFA</td><td>التقييم الشامل</td><td>الدول النامية</td><td>سنوي</td></tr>
                            <tr><td>CBAHI</td><td>الاعتماد الوطني</td><td>السعودية</td><td>كل 3 سنوات</td></tr>
                            <tr><td>ISO 15189</td><td>المختبرات</td><td>عالمي</td><td>كل 2 سنة</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    // --- Analytics ---
    renderAnalytics() {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="page-header">
                <div class="page-title">
                    <h2>التحليلات</h2>
                    <p>تحليلات وإحصائيات شاملة</p>
                </div>
                <button class="btn btn-outline" onclick="window.print()">
                    <i class="fas fa-print"></i> طباعة
                </button>
            </div>

            <div class="stats-grid">
                <div class="stat-card default">
                    <div class="stat-icon"><i class="fas fa-chart-line"></i></div>
                    <div class="stat-value">87%</div>
                    <div class="stat-label">متوسط الجودة</div>
                </div>
                <div class="stat-card success">
                    <div class="stat-icon"><i class="fas fa-arrow-up"></i></div>
                    <div class="stat-value">+12%</div>
                    <div class="stat-label">نسبة التحسن</div>
                </div>
                <div class="stat-card info">
                    <div class="stat-icon"><i class="fas fa-clipboard-check"></i></div>
                    <div class="stat-value">94%</div>
                    <div class="stat-label">نسبة الالتزام</div>
                </div>
            </div>

            <div class="grid grid-cols-2" style="gap: 1.8rem;">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title"><i class="fas fa-chart-bar"></i> توزيع الدرجات</h3>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:1rem;">
                        ${[
                            { label: 'A+ (95-100%)', count: 2, total: 12, color: 'var(--neon-green)' },
                            { label: 'A (85-94%)', count: 4, total: 12, color: 'var(--neon-cyan)' },
                            { label: 'B (75-84%)', count: 3, total: 12, color: 'var(--neon-gold)' },
                            { label: 'C (65-74%)', count: 2, total: 12, color: '#f39c12' },
                            { label: 'D (<65%)', count: 1, total: 12, color: 'var(--neon-red)' }
                        ].map(g => `
                            <div style="display:flex; align-items:center; gap:1rem;">
                                <span style="width:80px; font-size:0.85rem; color:var(--text-secondary); font-weight:600;">${g.label}</span>
                                <div style="flex:1; height:24px; background:var(--bg-elevated); border-radius:var(--radius-sm); overflow:hidden;">
                                    <div style="height:100%; width:${(g.count/g.total)*100}%; background:${g.color}; border-radius:var(--radius-sm); transition: width 1s ease; display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:700; color:var(--yemen-black);">${g.count}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title"><i class="fas fa-calendar-alt"></i> التقييمات الشهرية</h3>
                    </div>
                    <div style="height:200px; display:flex; align-items:flex-end; justify-content:space-around; gap:0.5rem;">
                        ${[3,5,4,6,8,5,7,9,6,8,10,7].map((v, i) => `
                            <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:0.3rem;">
                                <div style="font-size:0.65rem; color:var(--text-muted);">${v}</div>
                                <div style="width:100%; max-width:30px; height:${v*15}px; background: linear-gradient(180deg, var(--gold-300), var(--gold-600)); border-radius: 4px 4px 0 0;"></div>
                                <div style="font-size:0.6rem; color:var(--text-muted);">${i+1}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    // --- Settings ---
    renderSettings() {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="page-header">
                <div class="page-title">
                    <h2>إعدادات النظام</h2>
                    <p>تخصيص إعدادات التطبيق</p>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-user-cog" style="color: var(--gold-300);"></i> إعدادات الحساب</h3>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">اسم المستخدم</label>
                        <input type="text" class="form-input" value="${state.session?.username || 'admin'}" readonly>
                    </div>
                    <div class="form-group">
                        <label class="form-label">تغيير كلمة المرور</label>
                        <input type="password" class="form-input" placeholder="كلمة المرور الجديدة">
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-palette" style="color: var(--neon-purple);"></i> المظهر</h3>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">السمة</label>
                        <select class="form-input" onchange="app.updateSetting('theme', this.value)">
                            <option value="dark" ${state.settings.theme === 'dark' ? 'selected' : ''}>داكن</option>
                            <option value="light" ${state.settings.theme === 'light' ? 'selected' : ''}>فاتح</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">اللغة</label>
                        <select class="form-input" onchange="app.updateSetting('language', this.value)">
                            <option value="ar" ${state.settings.language === 'ar' ? 'selected' : ''}>العربية</option>
                            <option value="en" ${state.settings.language === 'en' ? 'selected' : ''}>English</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-bell" style="color: var(--neon-cyan);"></i> الإشعارات</h3>
                </div>
                <div style="display:flex; flex-direction:column; gap:1rem;">
                    <label class="remember-me" style="font-size:1rem;">
                        <input type="checkbox" ${state.settings.notifications ? 'checked' : ''} onchange="app.updateSetting('notifications', this.checked)">
                        <span>تفعيل الإشعارات</span>
                    </label>
                    <label class="remember-me" style="font-size:1rem;">
                        <input type="checkbox" ${state.settings.autoSave ? 'checked' : ''} onchange="app.updateSetting('autoSave', this.checked)">
                        <span>الحفظ التلقائي</span>
                    </label>
                </div>
            </div>

            <div style="display:flex; justify-content:flex-end; gap: 1rem; margin-top: 1rem;">
                <button class="btn btn-outline" onclick="app.resetSettings()">
                    <i class="fas fa-undo"></i> إعادة الضبط
                </button>
                <button class="btn btn-primary" onclick="app.saveSettings(); app.toast('تم حفظ الإعدادات', 'success');">
                    <i class="fas fa-save"></i> حفظ الإعدادات
                </button>
            </div>
        `;
    },

    updateSetting(key, value) {
        state.settings[key] = value;
    },

    resetSettings() {
        this.confirm('هل أنت متأكد من إعادة ضبط الإعدادات الافتراضية؟', () => {
            state.settings = { language: 'ar', theme: 'dark', notifications: true, autoSave: true };
            this.saveSettings();
            this.renderSettings();
            this.toast('تم إعادة الضبط', 'success');
        });
    },

    // --- Event Listeners ---
    setupEventListeners() {
        // Close modals on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal-overlay.active').forEach(modal => {
                    modal.classList.remove('active');
                });
                document.body.style.overflow = '';
            }
        });

        // Close modals on overlay click
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });

        // Prevent back button cache
        window.addEventListener('pageshow', (e) => {
            if (e.persisted) {
                window.location.reload();
            }
        });
    },

    // --- Keyboard Shortcuts ---
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Alt + D -> Dashboard
            if (e.altKey && e.key === 'd') { e.preventDefault(); this.navigate('dashboard'); }
            // Alt + F -> Facilities
            if (e.altKey && e.key === 'f') { e.preventDefault(); this.navigate('facilities'); }
            // Alt + A -> Assessment
            if (e.altKey && e.key === 'a') { e.preventDefault(); this.navigate('assessment'); }
            // Alt + R -> Reports
            if (e.altKey && e.key === 'r') { e.preventDefault(); this.navigate('reports'); }
            // Alt + S -> Settings
            if (e.altKey && e.key === 's') { e.preventDefault(); this.navigate('settings'); }
            // Alt + L -> Logout
            if (e.altKey && e.key === 'l') { e.preventDefault(); this.logout(); }
        });
    },

    // --- Render Navigation ---
    renderNavigation() {
        // Navigation is already rendered in HTML, this is for future dynamic updates
    }
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// ==================== SECURITY ====================

// Prevent dev tools (basic)
document.addEventListener('contextmenu', (e) => {
    // e.preventDefault(); // Uncomment for production
});

// Console warning
console.log('%c⚠️ Security Notice', 'color: #ff073a; font-size: 14px; font-weight: bold;');
console.log('%cThis browser feature is intended for developers only. Do not paste any code here.', 'color: #ff6b35; font-size: 12px;');
// ============================================================
// تصحيح: ضمان عمل زر إضافة منشأة
// ============================================================

// 1. تعريف دالة مساعدة لفتح مودال المنشأة مع إعادة تعيين النموذج
app.openFacilityModal = function() {
    // إعادة تعيين النموذج
    const form = document.getElementById('facilityForm');
    if (form) {
        form.reset();
        // إزالة أي معرف تعديل
        form.removeAttribute('data-edit-id');
    }
    
    // إعادة تعيين زر الحفظ للحالة الأصلية
    const saveBtn = document.querySelector('#facilityModal .btn-primary');
    if (saveBtn) {
        saveBtn.innerHTML = '<i class="fas fa-save"></i> حفظ المنشأة';
        saveBtn.onclick = function() {
            app.saveFacility();
        };
    }
    
    // فتح المودال
    app.openModal('facilityModal');
};

// 2. تحديث دالة closeModal لإعادة تعيين النموذج عند الإغلاق
const originalCloseModal = app.closeModal;
app.closeModal = function(id) {
    if (id === 'facilityModal') {
        const form = document.getElementById('facilityForm');
        if (form) {
            form.reset();
            form.removeAttribute('data-edit-id');
        }
        
        // إعادة تعيين زر الحفظ
        const saveBtn = document.querySelector('#facilityModal .btn-primary');
        if (saveBtn) {
            saveBtn.innerHTML = '<i class="fas fa-save"></i> حفظ المنشأة';
            saveBtn.onclick = function() {
                app.saveFacility();
            };
        }
    }
    
    // استدعاء الدالة الأصلية
    originalCloseModal.call(this, id);
};

// 3. تحديث دالة saveFacility للتحقق من البيانات بشكل أفضل
const originalSaveFacility = app.saveFacility;
app.saveFacility = function() {
    const form = document.getElementById('facilityForm');
    
    // التحقق من وجود النموذج
    if (!form) {
        app.toast('خطأ: النموذج غير موجود', 'error');
        return;
    }
    
    const name = document.getElementById('fName')?.value?.trim();
    const type = document.getElementById('fType')?.value;
    const category = document.getElementById('fCategory')?.value;
    const city = document.getElementById('fCity')?.value?.trim();

    // التحقق من الحقول المطلوبة
    if (!name) {
        app.toast('يرجى إدخال اسم المنشأة', 'warning');
        document.getElementById('fName')?.focus();
        return;
    }
    if (!type) {
        app.toast('يرجى اختيار نوع المنشأة', 'warning');
        document.getElementById('fType')?.focus();
        return;
    }
    if (!category) {
        app.toast('يرجى اختيار فئة المنشأة', 'warning');
        document.getElementById('fCategory')?.focus();
        return;
    }
    if (!city) {
        app.toast('يرجى إدخال المدينة', 'warning');
        document.getElementById('fCity')?.focus();
        return;
    }

    // التحقق مما إذا كان تحديثاً أم إضافة جديدة
    const editId = form.getAttribute('data-edit-id');
    
    if (editId) {
        // تحديث منشأة موجودة
        const index = state.facilities.findIndex(f => f.id == editId);
        if (index !== -1) {
            state.facilities[index] = {
                ...state.facilities[index],
                name, type, category, city,
                manager: document.getElementById('fManager')?.value?.trim() || '',
                license: document.getElementById('fLicense')?.value?.trim() || '',
                address: document.getElementById('fAddress')?.value?.trim() || '',
                notes: document.getElementById('fNotes')?.value?.trim() || '',
                updatedAt: new Date().toISOString()
            };
            app.saveFacilities();
            app.closeModal('facilityModal');
            app.toast('تم تحديث المنشأة بنجاح', 'success');
            app.renderFacilities();
        }
    } else {
        // إضافة منشأة جديدة
        const newFacility = {
            id: Date.now(),
            name, type, category, city,
            manager: document.getElementById('fManager')?.value?.trim() || '',
            license: document.getElementById('fLicense')?.value?.trim() || '',
            address: document.getElementById('fAddress')?.value?.trim() || '',
            notes: document.getElementById('fNotes')?.value?.trim() || '',
            status: 'active',
            lastAssessment: null,
            createdAt: new Date().toISOString()
        };

        state.facilities.push(newFacility);
        app.saveFacilities();
        app.closeModal('facilityModal');
        app.toast('تم إضافة المنشأة بنجاح', 'success');
        app.renderFacilities();
    }
};

// 4. إضافة دالة editFacility الصحيحة
app.editFacility = function(id) {
    const facility = state.facilities.find(f => f.id === id);
    if (!facility) {
        app.toast('المنشأة غير موجودة', 'error');
        return;
    }

    // ملء النموذج بالبيانات
    document.getElementById('fName').value = facility.name || '';
    document.getElementById('fType').value = facility.type || '';
    document.getElementById('fCategory').value = facility.category || '';
    document.getElementById('fCity').value = facility.city || '';
    document.getElementById('fManager').value = facility.manager || '';
    document.getElementById('fLicense').value = facility.license || '';
    document.getElementById('fAddress').value = facility.address || '';
    document.getElementById('fNotes').value = facility.notes || '';

    // تخزين معرف المنشأة للتحديث
    const form = document.getElementById('facilityForm');
    form.setAttribute('data-edit-id', id);

    // تغيير نص زر الحفظ
    const saveBtn = document.querySelector('#facilityModal .btn-primary');
    if (saveBtn) {
        saveBtn.innerHTML = '<i class="fas fa-save"></i> تحديث المنشأة';
    }

    // فتح المودال
    app.openModal('facilityModal');
    app.toast(`تعديل: ${facility.name}`, 'info');
};

// 5. إصلاح زر الحفظ في المودال - ربط الحدث مباشرة
document.addEventListener('DOMContentLoaded', function() {
    // تأكد من أن زر الحفظ في المودال يعمل
    const saveBtn = document.querySelector('#facilityModal .btn-primary');
    if (saveBtn) {
        saveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            app.saveFacility();
        });
    }

    // تأكد من أن زر إضافة منشأة في الصفحة يعمل
    document.addEventListener('click', function(e) {
        if (e.target.closest('[onclick*="openModal(\'facilityModal\'"]')) {
            e.preventDefault();
            app.openFacilityModal();
        }
    });
});

console.log('%c✅ إصلاحات إضافة المنشأة محملة بنجاح', 'color: #39ff14; font-size: 12px;');
