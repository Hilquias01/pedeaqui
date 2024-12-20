// Função para adicionar itens ao carrinho
function adicionarAoCarrinho(nome, preco, quantidadeInputId) {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
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
//Função para abrir a página de meus pedidos
function abrirPedidos(){
    window.location.href = 'meus-pedidos.html';
}
// Função para carregar o conteúdo do carrinho
function carregarCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
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
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    carregarCarrinho();
}

// Função para finalizar o pedido e limpar o carrinho
function finalizarPedido() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    if (carrinho.length === 0) {
        alert('O carrinho está vazio!');
        return;
    }

    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const novoPedido = {
        id: Date.now(),
        itens: carrinho,
        total: carrinho.reduce((total, item) => total + item.preco * item.quantidade, 0),
        status: 'Pendente',
    };

    pedidos.push(novoPedido);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
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
    const qrCodeDiv = document.getElementById('qrCode');
    qrCodeDiv.innerHTML = `
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://hilquias01.github.io/pedeaqui/confirmacao.html" 
             alt="QR Code para pagamento" 
             style="width: 200px;">
    `;
}

// Função para exibir o pagamento via cartão
function mostrarCartao() {
    document.getElementById('metodosPagamento').style.display = 'none';
    document.getElementById('cartaoPagamento').style.display = 'block';
}

// Processar o pagamento com cartão (simulação)
function processarPagamento(event) {
    event.preventDefault();
    alert('Pagamento efetuado com sucesso!');
    finalizarCompra();
}

// Finalizar a compra e limpar o carrinho
function finalizarCompra() {
    localStorage.removeItem('carrinho');
    window.location.href = 'confirmacao.html';
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

    if (!nome || !endereco || !bairro || !cidade || !cep || !telefone) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    const dadosEntrega = { nome, endereco, bairro, cidade, cep, telefone, observacoes };
    localStorage.setItem('dadosEntrega', JSON.stringify(dadosEntrega));
    window.location.href = 'pagamento.html';
}

// Função para carregar os pedidos
function carregarPedidos() {
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const listaPedidos = document.getElementById('lista-pedidos');
    listaPedidos.innerHTML = '';

    if (pedidos.length === 0) {
        listaPedidos.innerHTML = '<p>Nenhum pedido encontrado.</p>';
        return;
    }

    pedidos.forEach(pedido => {
        const divPedido = document.createElement('div');
        divPedido.className = 'pedido';

        const itensDetalhados = pedido.itens.map(item =>
            `<p>${item.nome} - ${item.quantidade}x R$ ${item.preco.toFixed(2)}</p>`
        ).join('');

        divPedido.innerHTML = `
            <h2>Pedido #${pedido.id}</h2>
            <div class="itens">
                ${itensDetalhados}
            </div>
            <p><strong>Status:</strong> ${pedido.status}</p>
            <p><strong>Total:</strong> R$ ${pedido.total.toFixed(2)}</p>
        `;

        if (pedido.status === 'Pendente') {
            const botaoEntrega = document.createElement('button');
            botaoEntrega.textContent = 'Confirmar Entrega';
            botaoEntrega.className = 'botao-entrega';
            botaoEntrega.onclick = () => confirmarEntrega(pedido.id);
            divPedido.appendChild(botaoEntrega);
        }

        listaPedidos.appendChild(divPedido);
    });
}

// Função para confirmar a entrega de um pedido
function confirmarEntrega(pedidoId) {
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const pedido = pedidos.find(p => p.id === pedidoId);

    if (pedido) {
        pedido.status = 'Entregue';
        localStorage.setItem('pedidos', JSON.stringify(pedidos));
        alert(`Entrega confirmada para o Pedido #${pedido.id}`);
        carregarPedidos();
    }
}

// Carrega os pedidos ao abrir a página de "Meus Pedidos"
if (window.location.pathname.includes('meus-pedidos.html')) {
    carregarPedidos();
}
