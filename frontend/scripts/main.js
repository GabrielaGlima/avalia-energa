document.getElementById('form-avaliacao').addEventListener('submit', function (event) {
    event.preventDefault(); // Previne o envio do formulário

    // Captura os dados do formulário
    const nome = document.getElementById('nome').value.trim();
    const nota = document.getElementById('nota').value;
    const comentario = document.getElementById('comentario').value.trim();
    const imagem = document.getElementById('imagem').files[0];

    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!nome || !nota || !comentario) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    // Gera um URL temporário para a imagem (se existir)
    let imagemHTML = '';
    if (imagem) {
        const imagemURL = URL.createObjectURL(imagem);
        imagemHTML = `<img src="${imagemURL}" alt="Imagem de ${nome}" style="max-width: 100px; border-radius: 5px;">`;
    }

    // Cria a nova avaliação
    const novaAvaliacao = {
        nome,
        nota,
        comentario,
        imagemHTML
    };

    // Recupera as avaliações salvas ou cria uma lista vazia
    const avaliacaoSalvas = JSON.parse(localStorage.getItem('avaliacoes')) || [];

    // Adiciona a nova avaliação à lista
    avaliacaoSalvas.push(novaAvaliacao);

    // Salva novamente no localStorage
    localStorage.setItem('avaliacoes', JSON.stringify(avaliacaoSalvas));

    // Atualiza a pré-visualização da nova avaliação
    const preview = document.getElementById('avaliacao-preview');
    if (preview) {
        preview.innerHTML = `
            <h3>${nome}</h3>
            ${imagemHTML}
            <p>Nota: ${nota}</p>
            <p>${comentario}</p>
        `;
    }

    // Mostra o botão de salvar como PDF
    document.getElementById('salvar-pdf').style.display = 'block';

    // Adiciona a nova avaliação à lista de avaliações na página
    const novaAvaliacaoElemento = document.createElement('div');
    novaAvaliacaoElemento.classList.add('avaliacao');
    novaAvaliacaoElemento.innerHTML = `
        <h3>${nome}</h3>
        ${imagemHTML}
        <p>Nota: ${nota}</p>
        <p>${comentario}</p>
        <button class="excluir">Excluir</button>
    `;
    document.querySelector('.avaliacoes-lista').appendChild(novaAvaliacaoElemento);

    // Adiciona o evento de exclusão para o botão da nova avaliação
    novaAvaliacaoElemento.querySelector('.excluir').addEventListener('click', function () {
        excluirAvaliacao(avaliacaoSalvas.length - 1);  // Passa o índice da última avaliação
    });

    // Limpa o formulário
    document.getElementById('form-avaliacao').reset();
});

// Evento para salvar a avaliação como PDF
document.getElementById('salvar-pdf').addEventListener('click', function () {
    const preview = document.getElementById('avaliacao-preview');
    if (!preview) {
        console.error("Pré-visualização não encontrada.");
        return;
    }

    const nome = preview.querySelector('h3') ? preview.querySelector('h3').textContent : '';
    const nota = preview.querySelector('p:nth-of-type(1)') ? preview.querySelector('p:nth-of-type(1)').textContent : '';
    const comentario = preview.querySelector('p:nth-of-type(2)') ? preview.querySelector('p:nth-of-type(2)').textContent : '';
    const imagem = preview.querySelector('img') ? preview.querySelector('img') : null;

    if (!nome || !nota || !comentario) {
        alert('Não há dados suficientes para gerar o PDF.');
        return;
    }

    // Criando o PDF com jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Avaliação de Energético', 20, 20);
    doc.setFontSize(12);
    doc.text(`Nome: ${nome}`, 20, 30);
    doc.text(`Nota: ${nota}`, 20, 40);
    doc.text(`Comentário: ${comentario}`, 20, 50);

    // Adiciona a imagem ao PDF se houver
    if (imagem) {
        doc.addImage(imagem.src, 'JPEG', 20, 60, 50, 50); // Ajuste a posição e tamanho da imagem conforme necessário
    }

    // Salva o PDF
    doc.save('avaliacao.pdf');
});

// Função para carregar as avaliações do localStorage e exibi-las
document.addEventListener('DOMContentLoaded', function () {
    const avaliacaoSalvas = JSON.parse(localStorage.getItem('avaliacoes')) || [];

    // Adiciona cada avaliação salva à lista de avaliações na página
    avaliacaoSalvas.forEach((avaliacao, index) => {
        const novaAvaliacaoElemento = document.createElement('div');
        novaAvaliacaoElemento.classList.add('avaliacao');
        novaAvaliacaoElemento.innerHTML = `
            <h3>${avaliacao.nome}</h3>
            ${avaliacao.imagemHTML}
            <p>Nota: ${avaliacao.nota}</p>
            <p>${avaliacao.comentario}</p>
            <button class="excluir" data-index="${index}">Excluir</button>
        `;
        document.querySelector('.avaliacoes-lista').appendChild(novaAvaliacaoElemento);

        // Adiciona o evento de exclusão para as avaliações carregadas
        novaAvaliacaoElemento.querySelector('.excluir').addEventListener('click', function () {
            excluirAvaliacao(index);
        });
    });
});

// Função para excluir uma avaliação
function excluirAvaliacao(index) {
    const avaliacaoSalvas = JSON.parse(localStorage.getItem('avaliacoes')) || [];
    avaliacaoSalvas.splice(index, 1);
    localStorage.setItem('avaliacoes', JSON.stringify(avaliacaoSalvas));
    document.querySelectorAll('.avaliacao')[index].remove();
}