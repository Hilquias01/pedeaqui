// Função para adicionar itens ao carrinho
function adicionarAoCarrinho(nome, preco, quantidadeInputId) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const quantidade = parseInt(document.getElementById(quantidadeInputId).value) || 1;

    const itemExistente = carrinho.find(item => item.nome === nome);
    if (itemExistente) {
        itemExistente.quantidade += quantidade;
    } else {
        carrinho.push({ nome, preco, quantidade });
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    
}

// Função para abrir a página do carrinho
function abrirCarrinho() {
    window.location.href = 'carrinho.html';
}

// Função para carregar o conteúdo do carrinho
function carregarCarrinho() {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || []; // Carrega do localStorage
    console.log("Carrinho carregado:", carrinho); // Log para depurar

    const itensCarrinho = document.getElementById('itensCarrinho');
    const total = document.getElementById('total');
    itensCarrinho.innerHTML = '';
    let somaTotal = 0;

    carrinho.forEach((item, index) => {
        somaTotal += item.preco * item.quantidade;
        itensCarrinho.innerHTML += `
            <div>
                <p>${item.nome} - R$ ${item.preco.toFixed(2)} x ${item.quantidade}</p>
                <button onclick="removerDoCarrinho(${index})">Remover</button>
            </div>
        `;
    });

    total.textContent = somaTotal.toFixed(2);
}

// Função para remover um item do carrinho
function removerDoCarrinho(index) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    carregarCarrinho();
}

// Função para finalizar o pedido e limpar o carrinho
function finalizarPedido() {
    localStorage.removeItem('carrinho');
    window.location.href = 'dados-entrega.html';
}

// Função para voltar ao cardápio
function voltarAoCardapio() {
    window.location.href = 'index.html';
}

// Função para exibir o pagamento via QR Code
function mostrarPix() {
    document.getElementById('metodosPagamento').style.display = 'none';
    document.getElementById('pixPagamento').style.display = 'block';

    // Simula a geração do QR Code (coloque uma imagem para o QR Code real)
    const qrCodeDiv = document.getElementById('qrCode');
    qrCodeDiv.innerHTML = '<img src=" https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=http://127.0.0.1:5500/confirmacao.html" alt="QR Code para pagamento" style="width: 200px;">';
}

// Função para exibir o pagamento via cartão
function mostrarCartao() {
    document.getElementById('metodosPagamento').style.display = 'none';
    document.getElementById('cartaoPagamento').style.display = 'block';
}

// Processar o pagamento com cartão (simulação)
function processarPagamento(event) {
    event.preventDefault(); // Prevenir o recarregamento da página
    alert('Pagamento efetuado com sucesso!');
    finalizarCompra();
}

// Finalizar a compra e limpar o carrinho
function finalizarCompra() {
    localStorage.removeItem('carrinho'); // Limpa o carrinho
    window.location.href = 'confirmacao.html'; // Redireciona para confirmação
}

// Função para salvar os dados de entrega no localStorage
function salvarDadosEntrega() {
    const nome = document.getElementById('nome').value;
    const endereco = document.getElementById('endereco').value;
    const bairro = document.getElementById('bairro').value;
    const cidade = document.getElementById('cidade').value;
    const cep = document.getElementById('cep').value;
    const telefone = document.getElementById('telefone').value;
    const observacoes = document.getElementById('observacoes').value;

    // Validação básica
    if (!nome || !endereco || !bairro || !cidade || !cep || !telefone) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    const dadosEntrega = { nome, endereco, bairro, cidade, cep, telefone, observacoes };
    localStorage.setItem('dadosEntrega', JSON.stringify(dadosEntrega)); // Salva no localStorage
    window.location.href = 'pagamento.html'; // Redireciona para a página de pagamento
}
