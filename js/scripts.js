// copied from assets/js/scripts.js
document.addEventListener('DOMContentLoaded', function () {
    /* ---------- NAV TOGGLE (mobile) ---------- */
    const header = document.querySelector('.site-header');
    const navToggle = document.getElementById('navToggle');
    if (navToggle && header) {
        navToggle.addEventListener('click', () => {
            const open = header.classList.toggle('nav-open');
            navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    /* ---------- LIGHTBOX (gallery) ---------- */
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.getElementById('lightboxContent');
    const lightboxClose = document.getElementById('lightboxClose');
    function openLightbox(src, alt) {
        lightboxContent.innerHTML = `<img src="${src}" alt="${alt||''}" />`;
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
        lightbox.setAttribute('aria-hidden', 'true');
        lightboxContent.innerHTML = '';
        document.body.style.overflow = '';
    }
    document.querySelectorAll('.photo').forEach(fig => {
        fig.addEventListener('click', () => {
            const src = fig.getAttribute('data-full') || fig.querySelector('img').src;
            const alt = fig.querySelector('img').alt || '';
            openLightbox(src, alt);
        });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && lightbox.getAttribute('aria-hidden') === 'false') closeLightbox();
    });

    /* ---------- FORM SUBMISSION with validation + UI feedback ---------- */
    /*
    function showToast(message, kind = 'info') {
        const t = document.createElement('div');
        t.className = `toast toast-${kind}`;
        t.textContent = message;
        document.body.appendChild(t);
        setTimeout(() => t.classList.add('visible'), 10);
        setTimeout(() => t.classList.remove('visible'), 4000);
        setTimeout(() => t.remove(), 4500);
    }
    
    async function submitFormWithUI(form, url) {
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        const data = Object.fromEntries(new FormData(form).entries());
    
        if (form.querySelector('[name="consent"]') && !data.consent) {
            showToast('Por favor aceite o consentimento.', 'warning');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            return;
        }
    
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error('Network');
            showToast('Enviado com sucesso. Obrigado!', 'success');
            form.reset();
        } catch (err) {
            console.error(err);
            showToast('Erro ao enviar. Tente novamente.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
    
    const donationForm = document.getElementById('donation-form');
    if (donationForm) donationForm.addEventListener('submit', (e) => { 
        e.preventDefault(); 
        submitFormWithUI(donationForm, '/api/donate'); 
    });
    
    const requestForm = document.getElementById('request-form');
    if (requestForm) requestForm.addEventListener('submit', (e) => { 
        e.preventDefault(); 
        submitFormWithUI(requestForm, '/api/receive'); 
    });
    
    const volunteerForm = document.getElementById('volunteer-form');
    if (volunteerForm) volunteerForm.addEventListener('submit', (e) => { 
        e.preventDefault(); 
        submitFormWithUI(volunteerForm, '/api/volunteer'); 
    });
    
    const groupForm = document.getElementById('group-form');
    if (groupForm) groupForm.addEventListener('submit', (e) => { 
        e.preventDefault(); 
        submitFormWithUI(groupForm, '/api/group'); 
    });
    
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) feedbackForm.addEventListener('submit', (e) => { 
        e.preventDefault(); 
        submitFormWithUI(feedbackForm, '/api/feedback'); 
    });
    */

    /* ---------- MAP (Leaflet) ---------- */
    const mapEl = document.getElementById('map');
    if (mapEl && window.L) {
        // Meeting point focused map
        const meetingPoint = { title: 'Ponto de Encontro - Avivamento', coords: [-23.5489, -46.6388], info: 'Rua da Fé, 123 — Segundas 09:00–12:00' };
        const otherPoints = [
            { title: 'Salão Paroquial', coords: [-23.556, -46.645], info: 'Av. Esperança, 45 — Doações de roupas' }
        ];
        const map = L.map('map', { zoomControl: false }).setView(meetingPoint.coords, 13);
        L.control.zoom({ position: 'topright' }).addTo(map);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        const meetingMarker = L.marker(meetingPoint.coords, { riseOnHover: true }).addTo(map);
        meetingMarker.bindPopup(`<strong>${meetingPoint.title}</strong><br>${meetingPoint.info}<br><em>Encontro para entregas</em>`);
        otherPoints.forEach(p => {
            L.marker(p.coords).addTo(map).bindPopup(`<strong>${p.title}</strong><br>${p.info}`);
        });
    }

    /* ---------- HERO entrance animation ---------- */
    setTimeout(() => {
        const hero = document.querySelector('.hero');
        if (hero) hero.classList.add('hero-animate');
    }, 220);
    /* ---------- SIMPLE CAROUSEL for testimonials ---------- */
    (function initCarousel(){
        const carousel = document.getElementById('testimonials');
        if (!carousel) return;
        const slides = carousel.querySelectorAll('.slide');
        let idx = 0;
        function show(i){
            slides.forEach((s,si)=> s.style.transform = `translateX(${(si-i)*100}%)`);
        }
        show(0);
        setInterval(()=>{ idx = (idx+1) % slides.length; show(idx); }, 4500);
    })();

    /* ---------- DONATION MODAL HANDLERS ---------- */
    const openDonateBtn = document.getElementById('openDonateModal');
    const donateModal = document.getElementById('donateModal');
    const donateModalClose = document.getElementById('donateModalClose');
    const cancelDonate = document.getElementById('cancelDonate');
    const confirmDonate = document.getElementById('confirmDonate');
    if (openDonateBtn && donateModal) {
        openDonateBtn.addEventListener('click', () => {
            donateModal.setAttribute('aria-hidden','false');
        });
    }
    if (donateModalClose) donateModalClose.addEventListener('click', ()=> donateModal.setAttribute('aria-hidden','true'));
    if (cancelDonate) cancelDonate.addEventListener('click', ()=> donateModal.setAttribute('aria-hidden','true'));

    // show/hide blocks based on selection
    const methodRadios = document.querySelectorAll('input[name="donation_method"]');
    function updateMethodBlocks(){
        const val = document.querySelector('input[name="donation_method"]:checked')?.value;
        const pix = document.getElementById('pixInfo');
        const ag = document.getElementById('agendamentoBlock');
        if (pix) pix.style.display = val === 'pix' ? 'block' : 'none';
        if (ag) ag.style.display = val === 'agendamento' ? 'block' : 'none';
    }
    methodRadios.forEach(r => r.addEventListener('change', updateMethodBlocks));
    updateMethodBlocks();

    if (confirmDonate) {
        confirmDonate.addEventListener('click', () => {
            const form = document.getElementById('donation-form');
            if (!form) return;
            // remove existing hidden extras
            ['donation_method','scheduleDate','scheduleTime'].forEach(k => {
                const el = form.querySelector(`input[name="${k}"]`);
                if (el) el.remove();
            });
            const method = document.querySelector('input[name="donation_method"]:checked')?.value || 'pix';
            const inMethod = document.createElement('input'); inMethod.type='hidden'; inMethod.name='donation_method'; inMethod.value=method; form.appendChild(inMethod);
            if (method === 'agendamento') {
                const date = document.getElementById('scheduleDate')?.value || '';
                const time = document.getElementById('scheduleTime')?.value || '';
                const inDate = document.createElement('input'); inDate.type='hidden'; inDate.name='scheduleDate'; inDate.value=date; form.appendChild(inDate);
                const inTime = document.createElement('input'); inTime.type='hidden'; inTime.name='scheduleTime'; inTime.value=time; form.appendChild(inTime);
            }
            donateModal.setAttribute('aria-hidden','true');
            // submit using existing handler
            // submitFormWithUI(form, '/api/donate');
            form.submit(); // envio normal para FormSubmit
        });
    }
});


