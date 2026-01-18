// Riktige svar (kan være streng eller array av alternativer)
const answers = {
    1: "Maurstien 6",
    2: "Sandhagen 2",
    3: "Storlidalsvegen 1933"
};

const solved = { 1: false, 2: false, 3: false };

// Normaliser brukerinput og riktig svar:
// - Unicode normalisering
// - fjerner diakritika
// - holder bokstaver, tall, mellomrom og bindestrek
// - gjør alt lowercase
function normalizeAnswer(answer) {
    if (!answer) return "";
    // fjern diakritika og normaliser
    const noDiacritics = answer.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
    // behold bokstaver (unicode), tall, mellomrom og bindestrek
    return noDiacritics
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s-]/gu, '')
        .replace(/\s+/g, ' ')
        .trim();
}

// Levenshtein avstand
function levenshtein(a, b) {
    const an = a.length, bn = b.length;
    if (an === 0) return bn;
    if (bn === 0) return an;
    const matrix = Array.from({length: an + 1}, () => Array(bn + 1).fill(0));
    for (let i=0;i<=an;i++) matrix[i][0]=i;
    for (let j=0;j<=bn;j++) matrix[0][j]=j;
    for (let i=1;i<=an;i++) {
        for (let j=1;j<=bn;j++) {
            const cost = a[i-1] === b[j-1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i-1][j] + 1,
                matrix[i][j-1] + 1,
                matrix[i-1][j-1] + cost
            );
        }
    }
    return matrix[an][bn];
}

// Token overlap: hvor stor andel av korteste tokens som matcher
function tokenOverlapRatio(a, b) {
    const at = a.split(' ').filter(Boolean);
    const bt = b.split(' ').filter(Boolean);
    if (at.length === 0 || bt.length === 0) return 0;
    const setB = new Set(bt);
    const common = at.filter(t => setB.has(t)).length;
    return common / Math.min(at.length, bt.length);
}

// Hovedsjekk: kombinerer ulike heuristikker
function isAnswerCorrect(userAnswerRaw, correctAnswerRaw) {
    const ua = normalizeAnswer(userAnswerRaw);
    const ca = normalizeAnswer(correctAnswerRaw);
    if (!ua || !ca) return false;

    // eksakt eller inkluderingssjekk
    if (ua === ca) return true;
    if (ua.includes(ca) || ca.includes(ua)) return true;

    // token overlap (for delvise adresser)
    if (tokenOverlapRatio(ua, ca) >= 0.6) return true;

    // Levenshtein: aksepter inntil 25% feil relativt til lengste streng
    const dist = levenshtein(ua, ca);
    const maxLen = Math.max(ua.length, ca.length);
    if (maxLen > 0 && (dist / maxLen) <= 0.25) return true;

    return false;
}

function checkAnswer(questionNumber) {
    const input = document.getElementById('answer' + questionNumber);
    const feedback = document.getElementById('feedback' + questionNumber);
    const userAnswer = input.value || '';
    const correct = answers[questionNumber];

    let matched = false;
    if (Array.isArray(correct)) {
        matched = correct.some(c => isAnswerCorrect(userAnswer, c));
    } else {
        matched = isAnswerCorrect(userAnswer, correct);
    }

    if (matched) {
        feedback.className = 'feedback correct';
        feedback.textContent = '✓ Riktig! Godt jobbet!';
        solved[questionNumber] = true;
        input.disabled = true;

        if (Object.values(solved).every(v => v === true)) {
            document.getElementById('successMessage').style.display = 'block';
        }
    } else {
        feedback.className = 'feedback incorrect';
        feedback.textContent = '✗ Ikke helt riktig. Prøv igjen!';
    }
}

// Enter-tast for alle answer-felter
['answer1','answer2','answer3'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('keypress', function(e) { 
        if (e.key === 'Enter') checkAnswer(Number(id.replace('answer',''))); 
    });
});

// WebP Detection
function supportsWebP() {
    const canvas = document.createElement('canvas');
    if (!!(canvas.getContext && canvas.getContext('2d'))) {
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
}

// Lazy Load Background Images with IntersectionObserver
function initBackgroundLazyLoad() {
    const webpSupported = supportsWebP();
    
    // Find all elements with background image data attributes
    const bgElements = document.querySelectorAll('[data-bg-jpg], [data-bg-webp]');
    
    if (!bgElements.length) return;
    
    // Create IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Choose WebP if supported and available, otherwise use JPG
                const bgImage = webpSupported && element.dataset.bgWebp 
                    ? element.dataset.bgWebp 
                    : element.dataset.bgJpg;
                
                if (bgImage) {
                    // Preload the image
                    const img = new Image();
                    img.onload = () => {
                        element.style.backgroundImage = `url('${bgImage}')`;
                        element.classList.add('bg-loaded');
                    };
                    img.src = bgImage;
                }
                
                // Stop observing this element
                observer.unobserve(element);
            }
        });
    }, {
        rootMargin: '50px' // Start loading slightly before element is visible
    });
    
    // Observe all background elements
    bgElements.forEach(element => observer.observe(element));
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBackgroundLazyLoad);
} else {
    initBackgroundLazyLoad();
}
