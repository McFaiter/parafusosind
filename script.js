// ---- ESTADO DO JOGO ----
let parafusos = 0;
let ganhoPorClique = 1;
let custoClique = 10;

// >>>>> LÓGICA DO AUTOCLICK ATUALIZADA <<<<<
let autoClickLevel = 0;
const maxAutoClickLevel = 10; // Limite aumentado para 10
// Nova curva de preços com 10 níveis
const autoClickCosts = [
    500, 2500, 15000, 100000, 750000, 2.5e6, 5e6, 7.5e6, 9e6, 10e6
];

const upgradesData = [
    { key: "maquina", nome: "Máquina", custo: 10, ganho: 1, emoji: "⚙️" },
    { key: "setor", nome: "Setor", custo: 100, ganho: 5, emoji: "🏭" },
    { key: "empresa", nome: "Empresa", custo: 1000, ganho: 25, emoji: "🏟️" },
    { key: "bairro", nome: "Bairro", custo: 1e4, ganho: 125, emoji: "🏘️" },
    { key: "cidade", nome: "Cidade", custo: 1e5, ganho: 625, emoji: "🌆" },
    { key: "estado", nome: "Estado", custo: 1e6, ganho: 3125, emoji: "🌄" },
    { key: "pais", nome: "País", custo: 1e7, ganho: 15625, emoji: "🏳️" },
    { key: "continente", nome: "Continente", custo: 1e8, ganho: 78125, emoji: "🌍" },
    { key: "planeta", nome: "Planeta", custo: 1e9, ganho: 390625, emoji: "🪐" },
    { key: "universo", nome: "Universo", custo: 1e10, ganho: 1953125, emoji: "🌌" },
];

const upgrades = {};

// ---- ELEMENTOS DO DOM ----
const contadorSpan = document.getElementById("contador");
const geracaoPorSegundoSpan = document.getElementById("geracaoPorSegundo");
const botaoParafuso = document.getElementById("botaoParafuso");
const upgradesContainer = document.getElementById("upgradesContainer");
const floatingNumbersContainer = document.getElementById("floating-numbers-container");
const autoclickCursorsContainer = document.getElementById("autoclick-cursors-container");

// Clique
const qtdCliqueSpan = document.getElementById("qtdClique");
const custoCliqueSpan = document.getElementById("custoClique");
const botaoClique = document.getElementById("botaoClique");

// AutoClick
const qtdAutoClickSpan = document.getElementById("qtdAutoClick");
const custoAutoClickSpan = document.getElementById("custoAutoClick");
const botaoAutoClick = document.getElementById("botaoAutoClick");


// ---- FUNÇÕES PRINCIPAIS DO JOGO ----
function formatarNumero(num) {
    if (num < 1e3) return num.toFixed(0);
    if (num < 1e6) return (num / 1e3).toFixed(2) + "K";
    if (num < 1e9) return (num / 1e6).toFixed(2) + "M";
    if (num < 1e12) return (num / 1e9).toFixed(2) + "B";
    return (num / 1e12).toFixed(2) + "T";
}

function animarParafuso() {
    botaoParafuso.classList.add("animar");
    setTimeout(() => {
        botaoParafuso.classList.remove("animar");
    }, 300);
}

function clicarParafuso() {
    parafusos += ganhoPorClique;
    criarNumeroFlutuante(ganhoPorClique);
    animarParafuso();
    atualizarDisplay();
}

function comprar(tipo) {
    const item = upgrades[tipo];
    const custoAtual = Math.floor(item.custo);
    if (parafusos >= custoAtual) {
        parafusos -= custoAtual;
        item.qtd += 1;
        item.custo *= 1.15;
        atualizarDisplay();
    }
}

function comprarClique() {
    const custoAtual = Math.floor(custoClique);
    if (parafusos >= custoAtual) {
        parafusos -= custoAtual;
        ganhoPorClique += 1;
        custoClique *= 1.5;
        atualizarDisplay();
    }
}

function comprarAutoClick() {
    if (autoClickLevel >= maxAutoClickLevel) return;

    const custoAtual = autoClickCosts[autoClickLevel];
    if (parafusos >= custoAtual) {
        parafusos -= custoAtual;
        autoClickLevel++;
        criarCursorAutoClick(); // Adiciona um novo cursor visualmente
        atualizarDisplay();
    }
}

function calcularGanhoTotalPorSegundo() {
    let ganhoTotal = 0;
    for (const chave in upgrades) {
        ganhoTotal += upgrades[chave].qtd * upgrades[chave].ganho;
    }
    return ganhoTotal;
}

// ---- ATUALIZAÇÃO E RENDERIZAÇÃO ----
function atualizarDisplay() {
    const ganhoTotal = calcularGanhoTotalPorSegundo();
    contadorSpan.textContent = formatarNumero(Math.floor(parafusos));
    geracaoPorSegundoSpan.textContent = `Gerando ${formatarNumero(ganhoTotal)} parafuso${ganhoTotal !== 1 ? "s" : ""} por segundo`;

    qtdCliqueSpan.textContent = formatarNumero(ganhoPorClique);
    custoCliqueSpan.textContent = formatarNumero(Math.floor(custoClique));
    botaoClique.disabled = parafusos < Math.floor(custoClique);

    qtdAutoClickSpan.textContent = `${autoClickLevel} / ${maxAutoClickLevel}`;
    if (autoClickLevel >= maxAutoClickLevel) {
        custoAutoClickSpan.textContent = "MAX";
        botaoAutoClick.disabled = true;
    } else {
        const custoAtual = autoClickCosts[autoClickLevel];
        custoAutoClickSpan.textContent = formatarNumero(custoAtual);
        botaoAutoClick.disabled = parafusos < custoAtual;
    }

    for (const chave in upgrades) {
        const item = upgrades[chave];
        const btn = document.getElementById(`botao_${chave}`);
        const custoSpan = document.getElementById(`custo_${chave}`);
        const nivelSpan = document.getElementById(`nivel_${chave}`);
        const ppsSpan = document.getElementById(`pps_${chave}`);

        if (btn && custoSpan && nivelSpan && ppsSpan) {
            nivelSpan.textContent = `Nível ${item.qtd}`;
            custoSpan.textContent = `Comprar por ${formatarNumero(Math.floor(item.custo))}`;
            btn.disabled = parafusos < Math.floor(item.custo);
            
            if (item.qtd > 0) {
                const ganhoDoItem = item.qtd * item.ganho;
                ppsSpan.innerHTML = `+${formatarNumero(ganhoDoItem)}/s <i class="fa-solid fa-bolt fa-xs"></i>`;
                ppsSpan.style.visibility = 'visible';
            } else {
                ppsSpan.style.visibility = 'hidden';
            }
        }
    }
    salvarProgresso();
}

// ---- FUNÇÕES DE UTILIDADE E EFEITOS ----
function criarNumeroFlutuante(valor) {
    const numberEl = document.createElement('div');
    numberEl.classList.add('floating-number');
    numberEl.textContent = `+${formatarNumero(valor)}`;
    numberEl.style.left = `${Math.random() * 50 + 25}%`;
    floatingNumbersContainer.appendChild(numberEl);

    setTimeout(() => {
        numberEl.remove();
    }, 1500);
}

// >>>>> FUNÇÃO ATUALIZADA PARA CRIAR EMOJIS EM VEZ DE SVGS <<<<<
function criarCursorAutoClick() {
    // Adiciona apenas o novo cursor, sem limpar os antigos
    const cursorEl = document.createElement('div');
    cursorEl.className = 'autoclick-emoji';
    cursorEl.id = `autoclick-cursor-${autoClickLevel - 1}`;
    cursorEl.textContent = '👆';
    autoclickCursorsContainer.appendChild(cursorEl);
}

function recriarCursoresAoCarregar() {
    autoclickCursorsContainer.innerHTML = ''; // Limpa antes de recriar
    for (let i = 0; i < autoClickLevel; i++) {
        const cursorEl = document.createElement('div');
        cursorEl.className = 'autoclick-emoji';
        cursorEl.id = `autoclick-cursor-${i}`;
        cursorEl.textContent = '👆';
        autoclickCursorsContainer.appendChild(cursorEl);
    }
}

// ---- INICIALIZAÇÃO DO JOGO ----
function criarCardsDeUpgrade() {
    upgradesData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'upgrade-card';
        card.innerHTML = `
            <div class="upgrade-info">
                <span class="upgrade-icon">${item.emoji}</span>
                <div class="upgrade-details">
                    <span class="upgrade-name">${item.nome} <span class="individual-pps">(+${formatarNumero(item.ganho)}/s)</span></span>
                    <span class="upgrade-level" id="nivel_${item.key}">Nível 0</span>
                </div>
            </div>
            <div class="upgrade-pps" id="pps_${item.key}"></div>
            <button class="buy-button" id="botao_${item.key}" onclick="comprar('${item.key}')">
                <span id="custo_${item.key}">Comprar por ${formatarNumero(item.custo)}</span>
            </button>
        `;
        upgradesContainer.appendChild(card);
    });
}

function inicializarEstado() {
    upgradesData.forEach(item => {
        upgrades[item.key] = {
            nome: item.nome, qtd: 0, custo: item.custo, ganho: item.ganho, emoji: item.emoji,
        };
    });
    carregarProgresso();
}

// ---- PERSISTÊNCIA DE DADOS (SALVAR/CARREGAR) ----
function salvarProgresso() {
    const progresso = { parafusos, ganhoPorClique, custoClique, autoClickLevel, upgrades: {} };
    for (const chave in upgrades) {
        progresso.upgrades[chave] = {
            qtd: upgrades[chave].qtd,
            custo: upgrades[chave].custo
        };
    }
    localStorage.setItem('parafusosProgressoV2', JSON.stringify(progresso));
}

function carregarProgresso() {
    const progressoSalvo = JSON.parse(localStorage.getItem('parafusosProgressoV2'));
    if (progressoSalvo) {
        parafusos = progressoSalvo.parafusos || 0;
        ganhoPorClique = progressoSalvo.ganhoPorClique || 1;
        custoClique = progressoSalvo.custoClique || 10;
        autoClickLevel = progressoSalvo.autoClickLevel || 0;
        recriarCursoresAoCarregar(); // Usa a nova função para recriar todos os cursores
        for (const chave in progressoSalvo.upgrades) {
            if (upgrades[chave]) {
                upgrades[chave].qtd = progressoSalvo.upgrades[chave].qtd || 0;
                upgrades[chave].custo = progressoSalvo.upgrades[chave].custo || upgrades[chave].custo;
            }
        }
    }
}

function exportarProgresso() {
    const progressoString = localStorage.getItem('parafusosProgressoV2');
    const blob = new Blob([progressoString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "progresso_parafusos_v2.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importarProgresso(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            JSON.parse(e.target.result); 
            localStorage.setItem('parafusosProgressoV2', e.target.result);
            location.reload();
        } catch (err) {
            alert("Erro ao importar progresso. Certifique-se de que o arquivo é um JSON válido.");
        }
    };
    reader.readAsText(file);
}

// ---- LOOP PRINCIPAL DO JOGO ----
// Loop para geração passiva (linha de produção)
setInterval(() => {
    const ganhoTotal = calcularGanhoTotalPorSegundo();
    if (ganhoTotal > 0) {
        parafusos += ganhoTotal / 10;
    }
}, 100);

// >>>>> LOOP DO AUTOCLICK ATUALIZADO COM POSICIONAMENTO ALEATÓRIO <<<<<
setInterval(() => {
    if (autoClickLevel > 0) {
        for (let i = 0; i < autoClickLevel; i++) {
            const cursorEl = document.getElementById(`autoclick-cursor-${i}`);
            if (cursorEl) {
                // Define uma posição aleatória dentro do botão
                const randomTop = Math.random() * 60 + 20; // Posição vertical entre 20% e 80%
                const randomLeft = Math.random() * 60 + 20; // Posição horizontal entre 20% e 80%
                cursorEl.style.top = `${randomTop}%`;
                cursorEl.style.left = `${randomLeft}%`;

                // Simula o clique com um pequeno atraso para cada cursor
                setTimeout(() => {
                    parafusos += ganhoPorClique;
                    criarNumeroFlutuante(ganhoPorClique);
                    cursorEl.classList.add('clicking');
                    setTimeout(() => cursorEl.classList.remove('clicking'), 200);
                }, i * 50); // Atraso de 50ms entre cada clique de cursor
            }
        }
    }
}, 1000); // Roda a cada segundo

// Loop para atualização visual da UI (menos frequente para performance)
setInterval(() => {
    atualizarDisplay();
}, 250);

// ---- INICIAR O JOGO ----
criarCardsDeUpgrade();
inicializarEstado();
atualizarDisplay();
