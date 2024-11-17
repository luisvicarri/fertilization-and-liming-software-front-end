const jsonTeste = {
    status: "success",
    dose_calcario_hec: 2.5,
    dose_calcario_total: 25,
    valor_potassio_hectare: 100,
    valor_potassio_total: 1000,
    valor_fosforo_hectare: 50,
    valor_fosforo_total: 500
};

/*
    FUNCTIONS
*/

function sendJSON(tipoEspecie, area, smp, ctcPH7, argila, k, p) {

    let json = {
        "tipoEspecie": tipoEspecie,
        "area": area,
        "smp": smp,
        "ctcPH7": ctcPH7,
        "argila": argila,
        "p": p,
        "k": k
    };

    let jsonString = JSON.stringify(json, null, 2);

    alert("Os seguintes dados serão enviados:\n\n" + jsonString);

    console.log(jsonString);

    try {

        // Enviando o JSON para o back-end via fetch
        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Dados enviados com sucesso:', data);
            })
            .catch(error => {
                console.error('Erro ao enviar os dados:', error);
            });

    } catch (error) {
        console.error("Erro ao enviar o JSON:", error.message);
    }


}

function receiveJSON() {

    // // Simula a URL do backend
    // const apiUrl = "https://api.example.com/analise";

    // try {
    //     // Faz a requisição ao backend
    //     const response = await fetch(apiUrl);

    //     if (!response.ok) {
    //         throw new Error(`Erro ao buscar dados: ${response.statusText}`);
    //     }

    //     // Converte o JSON recebido
    //     const dados = await response.json();

    // } catch (error) {
    //     console.error("Erro ao carregar os dados:", error.message);
    // }

    let dados = jsonTeste;

    return dados;
}

function exibirModalErro(titulo, mensagem) {
    const modal = document.getElementById("modal");
    document.getElementById("modal-titulo").innerText = titulo;
    document.getElementById("modal-mensagem").innerText = mensagem;

    // Esconde o conteúdo do resultado e exibe o erro
    document.getElementById("modal-mensagem").classList.remove("oculto");
    document.getElementById("modal-resultado").classList.add("oculto");

    modal.style.display = "flex";
}

function exibirModalResultado(dados) {
    const modal = document.getElementById("modal");
    document.getElementById("modal-titulo").innerText = "Resultado da Análise";

    // Popula os campos do modal
    document.getElementById("tipoCalcario").innerText = `Tipo de Calcário: Dolomítico`;
    document.getElementById("calcarioHec").innerText = `Dose por Hectare: ${dados.dose_calcario_hec} t/ha`;
    document.getElementById("calcarioTotal").innerText = `Dose Total: ${dados.dose_calcario_total} t`;
    document.getElementById("potassioHec").innerText = `Valor por Hectare: ${dados.valor_potassio_hectare} kg/ha`;
    document.getElementById("potassioTotal").innerText = `Valor Total: ${dados.valor_potassio_total} kg`;
    document.getElementById("fosforoHec").innerText = `Valor por Hectare: ${dados.valor_fosforo_hectare} kg/ha`;
    document.getElementById("fosforoTotal").innerText = `Valor Total: ${dados.valor_fosforo_total} kg`;

    // Esconde o conteúdo de erro e exibe o resultado
    document.getElementById("modal-mensagem").classList.add("oculto");
    document.getElementById("modal-resultado").classList.remove("oculto");

    modal.style.display = "flex";
}

function showScreen() {

    const contents = document.querySelectorAll('.content');
    contents.forEach(content => content.style.display = 'none');

    const selectedValue = document.getElementById('tipoEntrada').value;

    const selectedScreen = document.getElementById(selectedValue);
    if (selectedScreen) {
        selectedScreen.style.display = 'block';
    }
}

function showPDFResult(result) {

    let dados = result.data;
    console.log("Dados do JSON: ", dados);

    const amostrasSection = document.getElementById("amostras-section");
    const amostrasContainer = document.getElementById("amostras-container");
    const amostrasCount = document.getElementById("amostras-count");

    // Exibe a seção de amostras
    amostrasSection.style.display = "block";

    // Atualiza o contador de amostras
    amostrasCount.textContent = dados.length;

    // Limpa o contêiner
    amostrasContainer.innerHTML = "";

    // Renderiza as amostras
    dados.forEach((amostra) => {
        const amostraDiv = document.createElement("div");
        amostraDiv.classList.add("amostra");

        amostraDiv.innerHTML = `
                <h3>Ref. ${dados[amostra.id - 1].ref}</h3>
                
                <input type="radio" name="tipo-${amostra.id}" id="consorciacao" value=0>
                <label for="consorciacao">Consorciação de Gramíneas e Leguminosas</label><br>

                <input type="radio" name="tipo-${amostra.id}" id="macieira" value=1>
                <label for="macieira">Macieira</label><br>

                <input type="number" placeholder="Área plantada em Hectares" data-id="${amostra.id}"/>
                <button class="calcular calcular-btn" data-id="${amostra.id}">Calcular</button>
                <button class="remover remover-btn">Excluir</button>  
            `;

        // Funções dos botões
        const calcularButton = amostraDiv.querySelector(".calcular");
        const removerButton = amostraDiv.querySelector(".remover");

        calcularButton.addEventListener("click", function (event) {

            event.preventDefault();

            if (result.status === "success") {
                const amostraId = this.getAttribute("data-id");
                console.log("Amostra ativada: ", amostraId)

                const areaInput = document.querySelector(`input[data-id="${amostraId}"]`);

                const radios = document.querySelectorAll(`input[name="tipo-${amostra.id}"]`);
                const isAnyRadioChecked = Array.from(radios).some(radio => radio.checked);
                const selectedRadio = document.querySelector(`input[name="tipo-${amostraId}"]:checked`);

                index = amostraId - 1
                console.log("Dados da posição ", index, " : ", dados[index])

                const isAreaValid = areaInput.value.trim() !== "";
                const isSMPValid = !isNaN(dados[index].SMP);
                const isCTCValid = !isNaN(dados[index].CTC_ph7);
                const isArgilaValid = !isNaN(dados[index].argila);
                const isFosforoValid = !isNaN(dados[index].P);
                const isPotassioValid = !isNaN(dados[index].K);

                if (isAreaValid && isAnyRadioChecked && isSMPValid && isCTCValid &&
                    isArgilaValid && isFosforoValid && isPotassioValid) {

                    sendJSON(selectedRadio.value, areaInput.value, dados[index].SMP,
                        dados[index].CTC_ph7, dados[index].argila, dados[index].K, dados[index].P);

                    calculation = receiveJSON();
                    exibirModalResultado(calculation);

                } else if (!isAnyRadioChecked) {
                    alert("Por favor, selecione o tipo de espécie");

                } else if (!isAreaValid) {
                    alert("Por favor, preencha a área do solo");

                } else {
                    alert("Algum dado necessário está ausente ou inválido.");
                }

            } else {
                exibirModalErro("Erro no Cálculo", "Não foi possível realizar o cálculo. Ocorreu um erro.");
            }

        });

        removerButton.addEventListener("click", () => {
            amostrasContainer.removeChild(amostraDiv);
            amostrasCount.textContent = --amostrasCount.textContent;
        });

        amostrasContainer.appendChild(amostraDiv);
    });
}

/*
    EVENTS
*/

document.getElementById('button').addEventListener('click', function (event) {

    event.preventDefault();

    let tipoEspecie = document.querySelector('input[name="option"]:checked')?.value;
    let area = parseFloat(document.getElementById('area').value);
    let smp = parseFloat(document.getElementById('smp').value);
    let ctcPH7 = parseFloat(document.getElementById('ctcPH7').value);
    let argila = parseFloat(document.getElementById('argila').value);
    let k = parseFloat(document.getElementById('potassio').value);
    let p = parseFloat(document.getElementById('fosforo').value);

    if (!isNaN(area) && !isNaN(smp) && !isNaN(ctcPH7) &&
        !isNaN(argila) && !isNaN(p) && !isNaN(k)) {

        sendJSON(tipoEspecie, area, smp, ctcPH7, argila, k, p);

        dados = receiveJSON();

        if (dados.status === "failed") {
            exibirModalErro("Erro no Cálculo", "Não foi possível realizar o cálculo. Ocorreu um erro.");
        } else {
            exibirModalResultado(dados);
        }

    } else {
        alert("Por favor, insira todos os valores corretamente.");
    }

});

document.getElementById("fecharModal").addEventListener("click", function () {
    document.getElementById("modal").style.display = "none";
});

document.addEventListener("DOMContentLoaded", () => {
    const fileField = document.getElementById("file-field");
    const fileInput = document.getElementById("file-input");
    const filePathInput = document.getElementById("file-path");
    const browseButton = document.getElementById("browse-btn");

    fileField.style.display = "flex";

    // Abrir o seletor de arquivo ao clicar no botão "Escolher arquivo"
    browseButton.addEventListener("click", () => {
        fileInput.click();
    });

    // Atualizar o caminho do arquivo no campo de texto
    fileInput.addEventListener("change", () => {
        if (fileInput.files[0]) {
            filePathInput.value = fileInput.files[0].name;
            console.log('Caminho do arquivo PDF selecionado: ', filePathInput.value);
        }
    });

    const processButton = document.getElementById("process-btn");
    const responseMessage = document.getElementById("responseMessage");

    processButton.addEventListener("click", async () => {
        const file = fileInput.files[0]; // Obtém o arquivo selecionado

        if (!file) {
            alert("Selecione um arquivo antes de processar!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file); // Adiciona o arquivo ao formData

        try {
            // Envia o arquivo ao backend
            const response = await fetch("http://127.0.0.1:5000/upload_pdf", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {

                let result = await response.json();
                result = JSON.parse(result);

                console.log("Resultado recebido:", result);

                showPDFResult(result);

            } else {
                responseMessage.innerText = "Erro ao processar o arquivo.";
            }

        } catch (error) {
            console.error(error);
            responseMessage.innerText = "Erro de conexão com o servidor.";
        }



    });

});