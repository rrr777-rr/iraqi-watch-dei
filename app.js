// حالة خيارات تصميم الساعة
const watchState = {
    caseShape: 'round',
    bezelStyle: 'smooth',
    caseMaterial: 'steel',
    strapType: 'leather',
    strapTexture: 'croco',
    steelStyle: 'oyster',
    strapColor: '#110c08',
    dialColor: '#022819',
    dialPattern: 'sunburst',
    showDate: 'yes',
    numeralLanguage: 'roman',
    handsStyle: 'dauphine',
    numeralColor: 'gold',
    zoomLevel: 1,
    nightMode: false
};

// أنماط الأرقام واللغات
const numeralSets = {
    arabic_eastern: ['١٢', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '١٠', '١١'],
    western: ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
    roman: ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'],
    hindi: ['१२', '१', '२', '३', '४', '५', '६', '७', '८', '९', '१०', '११'],
    minimal: ['', '', '', '', '', '', '', '', '', '', '', '']
};

document.addEventListener('DOMContentLoaded', () => {
    initControls();
    renderWatch();
    startClock();
    updateSpecsDescription();
});

function initControls() {
    document.querySelectorAll('.button-grid, .color-swatches').forEach(container => {
        const param = container.dataset.param;
        container.querySelectorAll('button, .swatch').forEach(btn => {
            btn.addEventListener('click', () => {
                container.querySelectorAll('.active').forEach(a => a.classList.remove('active'));
                btn.classList.add('active');
                
                watchState[param] = btn.dataset.val;
                
                if (param === 'strapType') {
                    document.getElementById('leatherOptions').style.display = (btn.dataset.val === 'leather') ? 'block' : 'none';
                    document.getElementById('steelOptions').style.display = (btn.dataset.val === 'steel') ? 'block' : 'none';
                }
                
                renderWatch();
                updateSpecsDescription();
            });
        });
    });

    document.getElementById('numeralLanguageSelect').addEventListener('change', (e) => {
        watchState.numeralLanguage = e.target.value;
        renderWatch();
        updateSpecsDescription();
    });

    document.getElementById('zoomInBtn').onclick = () => setZoom(0.15);
    document.getElementById('zoomOutBtn').onclick = () => setZoom(-0.15);
    document.getElementById('resetViewBtn').onclick = () => { watchState.zoomLevel = 1; applyZoom(); };
    
    document.getElementById('lumeToggleBtn').onclick = () => {
        watchState.nightMode = !watchState.nightMode;
        document.getElementById('studioViewport').classList.toggle('night-mode', watchState.nightMode);
        renderWatch();
    };

    document.getElementById('saveDesignBtn').onclick = () => {
        alert('تم حفظ وتصدير مواصفات وسلسلة القطع المخصصة لتصميم ساعتك بنجاح!');
    };
}

function setZoom(delta) {
    watchState.zoomLevel = Math.min(Math.max(0.8, watchState.zoomLevel + delta), 1.7);
    applyZoom();
}

function applyZoom() {
    document.getElementById('watchSVG').style.transform = `scale(${watchState.zoomLevel})`;
}

function getMaterialGrad(matKey) {
    if (matKey === 'gold') return 'url(#goldGrad)';
    if (matKey === 'rosegold') return 'url(#roseGoldGrad)';
    if (matKey === 'black') return 'url(#blackPvdGrad)';
    return 'url(#steelGrad)';
}

function renderStrap() {
    const topG = document.getElementById('strapTopGroup');
    const botG = document.getElementById('strapBottomGroup');
    
    if (watchState.strapType === 'leather') {
        const pat = watchState.strapTexture === 'croco' ? 'url(#crocoPattern)' : 'none';
        
        topG.innerHTML = `
            <rect x="225" y="40" width="150" height="230" rx="10" fill="${watchState.strapColor}" />
            <rect x="225" y="40" width="150" height="230" rx="10" fill="${pat}" />
            <path d="M 233 40 L 233 270 M 367 40 L 367 270" stroke="rgba(255,255,255,0.18)" stroke-dasharray="5,4" stroke-width="1.5"/>
        `;
        botG.innerHTML = `
            <rect x="225" y="530" width="150" height="230" rx="10" fill="${watchState.strapColor}" />
            <rect x="225" y="530" width="150" height="230" rx="10" fill="${pat}" />
            <path d="M 233 530 L 233 760 M 367 530 L 367 760" stroke="rgba(255,255,255,0.18)" stroke-dasharray="5,4" stroke-width="1.5"/>
        `;
    } else {
        const mat = getMaterialGrad(watchState.caseMaterial);
        let topLinks = '', botLinks = '';
        
        if (watchState.steelStyle === 'oyster') {
            for(let y = 50; y < 250; y += 32) {
                topLinks += `<rect x="215" y="${y}" width="170" height="28" rx="4" fill="${mat}" stroke="#111" stroke-width="1"/>`;
            }
            for(let y = 530; y < 730; y += 32) {
                botLinks += `<rect x="215" y="${y}" width="170" height="28" rx="4" fill="${mat}" stroke="#111" stroke-width="1"/>`;
            }
        } else {
            for(let y = 50; y < 250; y += 22) {
                topLinks += `
                    <rect x="215" y="${y}" width="42" height="18" rx="8" fill="${mat}" stroke="#111" stroke-width="0.8"/>
                    <rect x="260" y="${y}" width="26" height="18" rx="8" fill="${mat}" stroke="#222" stroke-width="0.8"/>
                    <rect x="287" y="${y}" width="26" height="18" rx="8" fill="${mat}" stroke="#222" stroke-width="0.8"/>
                    <rect x="314" y="${y}" width="26" height="18" rx="8" fill="${mat}" stroke="#222" stroke-width="0.8"/>
                    <rect x="343" y="${y}" width="42" height="18" rx="8" fill="${mat}" stroke="#111" stroke-width="0.8"/>
                `;
            }
            for(let y = 530; y < 730; y += 22) {
                botLinks += `
                    <rect x="215" y="${y}" width="42" height="18" rx="8" fill="${mat}" stroke="#111" stroke-width="0.8"/>
                    <rect x="260" y="${y}" width="26" height="18" rx="8" fill="${mat}" stroke="#222" stroke-width="0.8"/>
                    <rect x="287" y="${y}" width="26" height="18" rx="8" fill="${mat}" stroke="#222" stroke-width="0.8"/>
                    <rect x="314" y="${y}" width="26" height="18" rx="8" fill="${mat}" stroke="#222" stroke-width="0.8"/>
                    <rect x="343" y="${y}" width="42" height="18" rx="8" fill="${mat}" stroke="#111" stroke-width="0.8"/>
                `;
            }
        }
        topG.innerHTML = topLinks;
        botG.innerHTML = botLinks;
    }
}

function renderCaseLugsAndCrown() {
    const lugsG = document.getElementById('caseLugsGroup');
    const crownG = document.getElementById('crownGroup');
    const mat = getMaterialGrad(watchState.caseMaterial);

    lugsG.innerHTML = `
        <path d="M 215,220 L 235,160 L 270,160 L 255,230 Z" fill="${mat}" stroke="rgba(0,0,0,0.3)"/>
        <path d="M 385,220 L 365,160 L 330,160 L 345,230 Z" fill="${mat}" stroke="rgba(0,0,0,0.3)"/>
        <path d="M 215,580 L 235,640 L 270,640 L 255,570 Z" fill="${mat}" stroke="rgba(0,0,0,0.3)"/>
        <path d="M 385,580 L 365,640 L 330,640 L 345,570 Z" fill="${mat}" stroke="rgba(0,0,0,0.3)"/>
    `;

    crownG.innerHTML = `
        <rect x="502" y="382" width="18" height="36" rx="4" fill="${mat}" stroke="#111" stroke-width="1"/>
        <line x1="506" y1="384" x2="506" y2="416" stroke="rgba(0,0,0,0.5)" stroke-width="1.5"/>
        <line x1="510" y1="384" x2="510" y2="416" stroke="rgba(0,0,0,0.5)" stroke-width="1.5"/>
        <line x1="514" y1="384" x2="514" y2="416" stroke="rgba(0,0,0,0.5)" stroke-width="1.5"/>
    `;
}

function renderCaseAndBezel() {
    const caseG = document.getElementById('caseGroup');
    const bezelG = document.getElementById('bezelGroup');
    const mat = getMaterialGrad(watchState.caseMaterial);

    if (watchState.caseShape === 'round') {
        caseG.innerHTML = `<circle cx="300" cy="400" r="205" fill="${mat}" stroke="rgba(0,0,0,0.4)" stroke-width="2"/>`;
        
        if (watchState.bezelStyle === 'fluted') {
            let notches = '';
            for(let i = 0; i < 72; i++) {
                const angle = i * 5 * (Math.PI / 180);
                const x1 = 300 + 175 * Math.cos(angle);
                const y1 = 400 + 175 * Math.sin(angle);
                const x2 = 300 + 200 * Math.cos(angle);
                const y2 = 400 + 200 * Math.sin(angle);
                notches += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${i % 2 === 0 ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.65)'}" stroke-width="3"/>`;
            }
            bezelG.innerHTML = `<circle cx="300" cy="400" r="188" fill="none" stroke="${mat}" stroke-width="24"/>${notches}`;
        } else {
            bezelG.innerHTML = `
                <circle cx="300" cy="400" r="188" fill="none" stroke="${mat}" stroke-width="20"/>
                <circle cx="300" cy="400" r="198" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
            `;
        }
    } else {
        caseG.innerHTML = `<rect x="120" y="220" width="360" height="360" rx="46" fill="${mat}" stroke="rgba(0,0,0,0.4)" stroke-width="2"/>`;
        bezelG.innerHTML = `<rect x="138" y="238" width="324" height="324" rx="34" fill="none" stroke="${mat}" stroke-width="20"/>`;
    }
}

function renderDial() {
    const dialG = document.getElementById('dialGroup');
    const dateG = document.getElementById('dateWindowGroup');
    const pat = watchState.dialPattern === 'guilloche' ? 'url(#guillochePattern)' : 'none';

    if (watchState.caseShape === 'round') {
        dialG.innerHTML = `
            <circle cx="300" cy="400" r="172" fill="#000" />
            <circle cx="300" cy="400" r="168" fill="${watchState.dialColor}" />
            <circle cx="300" cy="400" r="168" fill="${pat}" />
            ${watchState.dialPattern === 'sunburst' ? '<circle cx="300" cy="400" r="168" fill="url(#sapphireGlare)" opacity="0.3"/>' : ''}
            <circle cx="300" cy="400" r="168" fill="none" stroke="rgba(0,0,0,0.6)" stroke-width="6"/>
        `;
    } else {
        dialG.innerHTML = `
            <rect x="154" y="254" width="292" height="292" rx="24" fill="${watchState.dialColor}" />
            <rect x="154" y="254" width="292" height="292" rx="24" fill="${pat}" />
            <rect x="154" y="254" width="292" height="292" rx="24" fill="none" stroke="rgba(0,0,0,0.6)" stroke-width="6"/>
        `;
    }

    if (watchState.showDate === 'yes') {
        const today = new Date().getDate();
        dateG.innerHTML = `
            <rect x="390" y="385" width="38" height="30" rx="4" fill="#f8f9fa" stroke="#222" stroke-width="2"/>
            <text x="409" y="406" fill="#111" font-size="17" font-weight="bold" text-anchor="middle">${today}</text>
            <circle cx="409" cy="400" r="24" fill="url(#sapphireGlare)" opacity="0.45" stroke="rgba(255,255,255,0.7)" stroke-width="1.2"/>
        `;
    } else {
        dateG.innerHTML = '';
    }
}

function renderNumerals() {
    const numG = document.getElementById('numeralsGroup');
    const set = numeralSets[watchState.numeralLanguage];
    let color = (watchState.numeralColor === 'gold') ? '#e6c667' : (watchState.numeralColor === 'rosegold' ? '#f0b39e' : '#e5e7eb');
    
    if (watchState.nightMode) {
        color = '#00ffcc';
    }

    let html = '';
    const cx = 300, cy = 400, r = 138;

    for (let i = 0; i < 12; i++) {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        
        if (watchState.numeralLanguage === 'minimal') {
            const innerX = cx + (r - 14) * Math.cos(angle);
            const innerY = cy + (r - 14) * Math.sin(angle);
            html += `<line x1="${innerX}" y1="${innerY}" x2="${x}" y2="${y}" stroke="${color}" stroke-width="${i % 3 === 0 ? 4.5 : 2.2}"/>`;
        } else {
            html += `
                <text x="${x}" y="${y + 6}" 
                      fill="${color}" 
                      font-size="20" 
                      font-weight="bold" 
                      text-anchor="middle" 
                      dominant-baseline="middle"
                      style="font-family: 'Cinzel', 'Tajawal', serif; ${watchState.nightMode ? 'filter: drop-shadow(0 0 6px #00ffcc);' : ''}">
                    ${set[i]}
                </text>
            `;
        }
    }
    numG.innerHTML = html;
}

function startClock() {
    function updateHands() {
        const now = new Date();
        const sec = now.getSeconds() + now.getMilliseconds() / 1000;
        const min = now.getMinutes() + sec / 60;
        const hr = (now.getHours() % 12) + min / 60;

        const secDeg = sec * 6;
        const minDeg = min * 6;
        const hrDeg = hr * 30;

        const handsG = document.getElementById('handsGroup');
        let color = (watchState.numeralColor === 'gold') ? '#f2d06b' : '#ffffff';
        if (watchState.nightMode) color = '#00ffcc';

        const glowFilter = watchState.nightMode ? 'filter: drop-shadow(0 0 8px #00ffcc);' : '';

        if (watchState.handsStyle === 'dauphine') {
            handsG.innerHTML = `
                <g transform="rotate(${hrDeg} 300 400)" style="${glowFilter}">
                    <polygon points="293,400 300,270 307,400" fill="${color}"/>
                </g>
                <g transform="rotate(${minDeg} 300 400)" style="${glowFilter}">
                    <polygon points="294,400 300,230 306,400" fill="${color}"/>
                </g>
                <g transform="rotate(${secDeg} 300 400)">
                    <line x1="300" y1="445" x2="300" y2="215" stroke="#e63946" stroke-width="1.6"/>
                    <circle cx="300" cy="400" r="4.5" fill="#e63946"/>
                </g>
            `;
        } else {
            handsG.innerHTML = `
                <g transform="rotate(${hrDeg} 300 400)" style="${glowFilter}">
                    <line x1="300" y1="400" x2="300" y2="280" stroke="${color}" stroke-width="3.5"/>
                    <circle cx="300" cy="290" r="7" fill="none" stroke="${color}" stroke-width="2.5"/>
                </g>
                <g transform="rotate(${minDeg} 300 400)" style="${glowFilter}">
                    <line x1="300" y1="400" x2="300" y2="235" stroke="${color}" stroke-width="3"/>
                    <circle cx="300" cy="245" r="6" fill="none" stroke="${color}" stroke-width="2"/>
                </g>
                <g transform="rotate(${secDeg} 300 400)">
                    <line x1="300" y1="435" x2="300" y2="215" stroke="#e63946" stroke-width="1.4"/>
                </g>
            `;
        }
        requestAnimationFrame(updateHands);
    }
    requestAnimationFrame(updateHands);
}

function updateSpecsDescription() {
    const caseDesc = watchState.caseShape === 'round' ? 'دائرية' : 'مستطيلة';
    const materialDesc = watchState.caseMaterial === 'gold' ? 'ذهب 18K' : (watchState.caseMaterial === 'rosegold' ? 'ذهب وردي' : (watchState.caseMaterial === 'black' ? 'تيتانيوم أسود' : 'ستيل صلب'));
    const strapDesc = watchState.strapType === 'leather' ? (watchState.strapTexture === 'croco' ? 'جلد تمساح بارز' : 'جلد إيطالي ناعم') : (watchState.steelStyle === 'oyster' ? 'سوار أويستر (3 وصلات)' : 'سوار جوبيلي (حلقات دائرية)');
    const langDesc = watchState.numeralLanguage === 'roman' ? 'رومانية' : (watchState.numeralLanguage === 'arabic_eastern' ? 'عربية شرقية' : (watchState.numeralLanguage === 'western' ? 'غربية' : (watchState.numeralLanguage === 'hindi' ? 'هندية' : 'حدسية')));

    document.getElementById('specSummary').innerHTML = `
        ملخص قطع ساعتك: العلبة <span>${caseDesc} (${materialDesc})</span> | الحزام: <span>${strapDesc}</span> | الطراز واللغة: <span>أرقام ${langDesc}</span>
    `;
}

function renderWatch() {
    renderStrap();
    renderCaseLugsAndCrown();
    renderCaseAndBezel();
    renderDial();
    renderNumerals();
}