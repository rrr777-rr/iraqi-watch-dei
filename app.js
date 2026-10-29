// حالة الساعة المتقدمة
const watchState = {
    caseShape: 'round',
    bezelStyle: 'smooth',
    caseMaterial: 'steel',
    strapType: 'leather',
    strapTexture: 'croco',
    steelStyle: 'oyster',
    strapColor: '#110c08',
    dialColor: '#08080a',
    dialPattern: 'sunburst',
    showDate: 'yes',
    numeralLanguage: 'arabic_eastern',
    handsStyle: 'dauphine',
    numeralColor: 'gold',
    zoomLevel: 1
};

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
    initGlareEffect();
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
                updatePrice();
            });
        });
    });

    document.getElementById('numeralLanguageSelect').addEventListener('change', (e) => {
        watchState.numeralLanguage = e.target.value;
        renderWatch();
    });

    document.getElementById('zoomInBtn').onclick = () => setZoom(0.15);
    document.getElementById('zoomOutBtn').onclick = () => setZoom(-0.15);
    document.getElementById('resetViewBtn').onclick = () => { watchState.zoomLevel = 1; applyZoom(); };
}

function setZoom(delta) {
    watchState.zoomLevel = Math.min(Math.max(0.8, watchState.zoomLevel + delta), 1.7);
    applyZoom();
}

function applyZoom() {
    document.getElementById('watchSVG').style.transform = `scale(${watchState.zoomLevel})`;
}

// تأثير الانعكاس التفاعلي على الزجاج عند تحريك الماوس
function initGlareEffect() {
    const viewport = document.getElementById('studioViewport');
    const glare = document.getElementById('glassReflectionGroup');
    
    viewport.addEventListener('mousemove', (e) => {
        const rect = viewport.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        if (glare) {
            glare.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
        }
    });
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
            <rect x="230" y="50" width="140" height="220" rx="10" fill="${watchState.strapColor}" />
            <rect x="230" y="50" width="140" height="220" rx="10" fill="${pat}" />
            <path d="M 238 50 L 238 270 M 362 50 L 362 270" stroke="rgba(255,255,255,0.2)" stroke-dasharray="5,4" stroke-width="1.5"/>
        `;
        botG.innerHTML = `
            <rect x="230" y="530" width="140" height="220" rx="10" fill="${watchState.strapColor}" />
            <rect x="230" y="530" width="140" height="220" rx="10" fill="${pat}" />
            <path d="M 238 530 L 238 750 M 362 530 L 362 750" stroke="rgba(255,255,255,0.2)" stroke-dasharray="5,4" stroke-width="1.5"/>
        `;
    } else {
        const mat = getMaterialGrad(watchState.caseMaterial);
        let topLinks = '', botLinks = '';
        
        if (watchState.steelStyle === 'oyster') {
            for(let y = 60; y < 250; y += 32) {
                topLinks += `<rect x="220" y="${y}" width="160" height="28" rx="4" fill="${mat}" stroke="#111" stroke-width="1"/>`;
            }
            for(let y = 530; y < 720; y += 32) {
                botLinks += `<rect x="220" y="${y}" width="160" height="28" rx="4" fill="${mat}" stroke="#111" stroke-width="1"/>`;
            }
        } else { // Jubilee Link
            for(let y = 60; y < 250; y += 22) {
                topLinks += `
                    <rect x="220" y="${y}" width="40" height="18" rx="3" fill="${mat}" stroke="#111" stroke-width="0.8"/>
                    <rect x="262" y="${y}" width="24" height="18" rx="2" fill="${mat}" stroke="#222" stroke-width="0.8"/>
                    <rect x="288" y="${y}" width="24" height="18" rx="2" fill="${mat}" stroke="#222" stroke-width="0.8"/>
                    <rect x="314" y="${y}" width="24" height="18" rx="2" fill="${mat}" stroke="#222" stroke-width="0.8"/>
                    <rect x="340" y="${y}" width="40" height="18" rx="3" fill="${mat}" stroke="#111" stroke-width="0.8"/>
                `;
            }
            for(let y = 530; y < 720; y += 22) {
                botLinks += `
                    <rect x="220" y="${y}" width="40" height="18" rx="3" fill="${mat}" stroke="#111" stroke-width="0.8"/>
                    <rect x="262" y="${y}" width="24" height="18" rx="2" fill="${mat}" stroke="#222" stroke-width="0.8"/>
                    <rect x="288" y="${y}" width="24" height="18" rx="2" fill="${mat}" stroke="#222" stroke-width="0.8"/>
                    <rect x="314" y="${y}" width="24" height="18" rx="2" fill="${mat}" stroke="#222" stroke-width="0.8"/>
                    <rect x="340" y="${y}" width="40" height="18" rx="3" fill="${mat}" stroke="#111" stroke-width="0.8"/>
                `;
            }
        }
        topG.innerHTML = topLinks;
        botG.innerHTML = botLinks;
    }
}

function renderCaseAndBezel() {
    const caseG = document.getElementById('caseGroup');
    const bezelG = document.getElementById('bezelGroup');
    const mat = getMaterialGrad(watchState.caseMaterial);

    if (watchState.caseShape === 'round') {
        caseG.innerHTML = `<circle cx="300" cy="400" r="182" fill="${mat}" />`;
        
        if (watchState.bezelStyle === 'fluted') {
            let notches = '';
            for(let i = 0; i < 60; i++) {
                const angle = i * 6 * (Math.PI / 180);
                const x1 = 300 + 160 * Math.cos(angle);
                const y1 = 400 + 160 * Math.sin(angle);
                const x2 = 300 + 180 * Math.cos(angle);
                const y2 = 400 + 180 * Math.sin(angle);
                notches += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgba(0,0,0,0.4)" stroke-width="3"/>`;
            }
            bezelG.innerHTML = `<circle cx="300" cy="400" r="172" fill="none" stroke="${mat}" stroke-width="18"/>${notches}`;
        } else {
            bezelG.innerHTML = `<circle cx="300" cy="400" r="170" fill="none" stroke="${mat}" stroke-width="16"/>`;
        }
    } else {
        caseG.innerHTML = `<rect x="135" y="235" width="330" height="330" rx="42" fill="${mat}" />`;
        bezelG.innerHTML = `<rect x="150" y="250" width="300" height="300" rx="32" fill="none" stroke="${mat}" stroke-width="16"/>`;
    }
}

function renderDial() {
    const dialG = document.getElementById('dialGroup');
    const dateG = document.getElementById('dateWindowGroup');
    const pat = watchState.dialPattern === 'guilloche' ? 'url(#guillochePattern)' : 'none';

    if (watchState.caseShape === 'round') {
        dialG.innerHTML = `
            <circle cx="300" cy="400" r="148" fill="${watchState.dialColor}" />
            <circle cx="300" cy="400" r="148" fill="${pat}" />
            ${watchState.dialPattern === 'sunburst' ? '<circle cx="300" cy="400" r="148" fill="url(#sapphireGlare)" opacity="0.25"/>' : ''}
        `;
    } else {
        dialG.innerHTML = `
            <rect x="168" y="268" width="264" height="264" rx="22" fill="${watchState.dialColor}" />
            <rect x="168" y="268" width="264" height="264" rx="22" fill="${pat}" />
        `;
    }

    // نافذة التاريخ عند الساعة 3
    if (watchState.showDate === 'yes') {
        const today = new Date().getDate();
        dateG.innerHTML = `
            <rect x="380" y="386" width="34" height="28" rx="4" fill="#f8f9fa" stroke="#333" stroke-width="1.5"/>
            <text x="397" y="405" fill="#111" font-size="16" font-weight="bold" text-anchor="middle">${today}</text>
            <!-- عدسة المكبر Cyclops -->
            <circle cx="397" cy="400" r="22" fill="url(#sapphireGlare)" opacity="0.4" stroke="rgba(255,255,255,0.6)" stroke-width="1"/>
        `;
    } else {
        dateG.innerHTML = '';
    }
}

function renderNumerals() {
    const numG = document.getElementById('numeralsGroup');
    const set = numeralSets[watchState.numeralLanguage];
    const color = (watchState.numeralColor === 'gold') ? '#e6c667' : (watchState.numeralColor === 'rosegold' ? '#f0b39e' : '#e5e7eb');
    
    let html = '';
    const cx = 300, cy = 400, r = 120;

    for (let i = 0; i < 12; i++) {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        
        if (watchState.numeralLanguage === 'minimal') {
            const innerX = cx + (r - 12) * Math.cos(angle);
            const innerY = cy + (r - 12) * Math.sin(angle);
            html += `<line x1="${innerX}" y1="${innerY}" x2="${x}" y2="${y}" stroke="${color}" stroke-width="${i % 3 === 0 ? 4 : 2}"/>`;
        } else {
            html += `
                <text x="${x}" y="${y + 6}" 
                      fill="${color}" 
                      font-size="19" 
                      font-weight="bold" 
                      text-anchor="middle" 
                      dominant-baseline="middle"
                      style="font-family: 'Cinzel', 'Tajawal', serif;">
                    ${set[i]}
                </text>
            `;
        }
    }
    numG.innerHTML = html;
}

// عقارب حية ميكانيكية
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
        const color = (watchState.numeralColor === 'gold') ? '#f2d06b' : '#ffffff';

        if (watchState.handsStyle === 'dauphine') {
            handsG.innerHTML = `
                <!-- الساعات -->
                <g transform="rotate(${hrDeg} 300 400)">
                    <polygon points="294,400 300,290 306,400" fill="${color}"/>
                </g>
                <!-- الدقائق -->
                <g transform="rotate(${minDeg} 300 400)">
                    <polygon points="295,400 300,250 305,400" fill="${color}"/>
                </g>
                <!-- الثواني -->
                <g transform="rotate(${secDeg} 300 400)">
                    <line x1="300" y1="440" x2="300" y2="240" stroke="#e63946" stroke-width="1.5"/>
                    <circle cx="300" cy="400" r="4" fill="#e63946"/>
                </g>
            `;
        } else { // Breguet Style
            handsG.innerHTML = `
                <g transform="rotate(${hrDeg} 300 400)">
                    <line x1="300" y1="400" x2="300" y2="300" stroke="${color}" stroke-width="3"/>
                    <circle cx="300" cy="308" r="6" fill="none" stroke="${color}" stroke-width="2.5"/>
                </g>
                <g transform="rotate(${minDeg} 300 400)">
                    <line x1="300" y1="400" x2="300" y2="255" stroke="${color}" stroke-width="2.5"/>
                    <circle cx="300" cy="265" r="5" fill="none" stroke="${color}" stroke-width="2"/>
                </g>
                <g transform="rotate(${secDeg} 300 400)">
                    <line x1="300" y1="430" x2="300" y2="240" stroke="#e63946" stroke-width="1.2"/>
                </g>
            `;
        }
        requestAnimationFrame(updateHands);
    }
    requestAnimationFrame(updateHands);
}

function updatePrice() {
    let base = 9200;
    if (watchState.caseMaterial === 'gold') base += 5800;
    if (watchState.caseMaterial === 'rosegold') base += 6200;
    if (watchState.bezelStyle === 'fluted') base += 1400;
    if (watchState.strapType === 'steel') base += 1600;
    if (watchState.dialPattern === 'guilloche') base += 900;
    
    document.getElementById('watchPrice').innerText = `$${base.toLocaleString()}`;
}

function renderWatch() {
    renderStrap();
    renderCaseAndBezel();
    renderDial();
    renderNumerals();
}
