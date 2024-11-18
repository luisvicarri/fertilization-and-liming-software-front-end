/*
    FUNCTIONS
*/

// Função para enviar um JSON ao back-end
async function sendJSON(apiUrl, json) {

    alert("Os seguintes dados serão enviados:\n\n" + JSON.stringify(json, null, 2));

    try {
        // Fazendo uma requisição POST com os dados no formato JSON
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(json),
        });

        if (!response.ok) {
            throw new Error(`Erro ao enviar dados: ${response.statusText}`);
        }

        // Converte a resposta para JSON e a retorna
        const data = await response.json();

        return data;

    } catch (error) {
        console.error('Erro ao enviar ou receber os dados:', error.message);
        return null;
    }

}

// Função para enviar um arquivo ao back-end
async function sendFile(apiUrl, file) {

    const formData = new FormData();
    formData.append("file", file); // Adiciona o arquivo ao FormData

    try {
         // Fazendo a requisição POST com o arquivo
        const response = await fetch(apiUrl, {
            method: "POST",
            body: formData,
        });

        if (response.ok) {

            let result = await response.json();
            result = JSON.parse(result);

            displayPDFSamples(result); // Exibe os dados processados

            return result;

        } else {
            throw new Error(`Erro ao enviar dados: ${response.statusText}`);
        }

    } catch (error) {
        console.error(error);
        return null;
    }

}

// Exibe uma mensagem de erro no modal
function displayErrorModal(title, message) {
    const modal = document.getElementById("modal");
    document.getElementById("modal-title").innerText = title;
    document.getElementById("modal-message").innerText = message;

    // Esconde o conteúdo do resultado e exibe a mensagem de erro
    document.getElementById("modal-message").classList.remove("hidden");
    document.getElementById("modal-result").classList.add("hidden");

    modal.style.display = "flex";
}

// Exibe os resultados da análise no modal
function displayResultModal(response) {
    const modal = document.getElementById("modal");
    document.getElementById("modal-title").innerText = "Resultado da Análise";

    console.log(response)
    // Obtém e formata os valores retornados
    const limestoneDosePHa = response.dose_calcario_hec !== null && response.dose_calcario_hec !== undefined 
        ? response.dose_calcario_hec.toFixed(2) : 'N/A';
    const totalLimestoneDose = response.dose_calcario_total !== null && response.dose_calcario_total !== undefined 
        ? response.dose_calcario_total.toFixed(2) : 'N/A';
    const potassiumPHa = response.valor_potassio_hectare !== null && response.valor_potassio_hectare !== undefined 
        ? response.valor_potassio_hectare.toFixed(2) : 'N/A';
    const totalpotassium = response.valor_potassio_total !== null && response.valor_potassio_total !== undefined 
        ? response.valor_potassio_total.toFixed(2) : 'N/A';
    const phosphorusPHa = response.valor_fosforo_hectare !== null && response.valor_fosforo_hectare !== undefined 
        ? response.valor_fosforo_hectare.toFixed(2) : 'N/A';
    const totalPhosphorus = response.valor_fosforo_total !== null && response.valor_fosforo_total !== undefined 
        ? response.valor_fosforo_total.toFixed(2) : 'N/A';

    // Popula os campos do modal com os resultados
    document.getElementById("limestone-type").innerText = `Tipo de Calcário: Dolomítico`;
    document.getElementById("limestone-p-ha").innerText = `Dose por Hectare: ${limestoneDosePHa} t/ha`;
    document.getElementById("total-limestone").innerText = `Dose Total: ${totalLimestoneDose} t`;
    document.getElementById("potassium-p-ha").innerText = `Valor por Hectare: ${potassiumPHa} kg/ha`;
    document.getElementById("total-potassium").innerText = `Valor Total: ${totalpotassium} kg`;
    document.getElementById("phosphorus-p-ha").innerText = `Valor por Hectare: ${phosphorusPHa} kg/ha`;
    document.getElementById("total-phosphorus").innerText = `Valor Total: ${totalPhosphorus} kg`;

    // Esconde o erro e exibe os resultados
    document.getElementById("modal-message").classList.add("hidden");
    document.getElementById("modal-result").classList.remove("hidden");

    modal.style.display = "flex";
}

// Função para alternar a exibição de telas
function switchScreenDisplay() {

    const contents = document.querySelectorAll('.content');
    contents.forEach(content => content.style.display = 'none'); // Oculta todas as telas

    const selectedValue = document.getElementById('input-type').value; // Obtém a tela através da opção selecionada

    const selectedScreen = document.getElementById(selectedValue);
    if (selectedScreen) {
        selectedScreen.style.display = 'block'; // Exibe a tela correspondente
    }
}

// Função para exibir as amostras processadas em PDF
function displayPDFSamples(result) {

    let data = result.data; // Obtém o Array 'data' do Json retornado

    const sampleSection = document.getElementById("sample-section");
    const sampleContainer = document.getElementById("sample-container");
    const sampleCount = document.getElementById("sample-count");

    // Exibe a seção e atualiza o contador de amostras
    sampleSection.style.display = "block";
    sampleCount.textContent = data.length;
    sampleContainer.innerHTML = ""; // Limpa o contêiner

    // Adiciona cada amostra à interface
    data.forEach((sample) => {
        const sampleDiv = document.createElement("div"); // Cria um contêiner para cada amostra
        sampleDiv.classList.add("sample");

        // Define o conteúdo HTML para cada amostra
        sampleDiv.innerHTML = `
                <h3>Ref. ${data[sample.id - 1].ref}</h3>
                
                <input type="radio" name="type-${sample.id}" id="intercropping" value=0>
                <label for="intercropping">Consorciação de Gramíneas e Leguminosas</label><br>

                <input type="radio" name="type-${sample.id}" id="apple-tree" value=1>
                <label for="apple-tree">Macieira</label><br>

                <input type="number" placeholder="Área plantada em Hectares" data-id="${sample.id}"/>
                <button class="calculate calculate-btn" data-id="${sample.id}">Calcular</button>
                <button class="remove remove-btn">Excluir</button>  
            `;

        // Obtém referências aos botões de calcular e excluir
        const calculateBtn = sampleDiv.querySelector(".calculate");
        const removeBtn = sampleDiv.querySelector(".remove");

        // Configura o evento para obter os valores e enviá-los ao back-end
        calculateBtn.addEventListener("click", async function (event) {

            event.preventDefault();

            if (result.status === "success") {
                const sampleId = this.getAttribute("data-id");

                const area = document.querySelector(`input[data-id="${sampleId}"]`);

                const radios = document.querySelectorAll(`input[name="type-${sample.id}"]`);
                const isAnyRadioChecked = Array.from(radios).some(radio => radio.checked);
                const selectedRadio = Number(document.querySelector(`input[name="type-${sampleId}"]:checked`));

                index = sampleId - 1 // Determina o índice correspondente à amostra

                // Valida os dados necessários para o cálculo
                const isAreaValid = area.value.trim() !== "";
                const isSMPValid = !isNaN(data[index].SMP);
                const isCTCValid = !isNaN(data[index].CTC_ph7);
                const isClayValid = !isNaN(data[index].argila);
                const isPhosphorusValid = !isNaN(data[index].P);
                const isPotassiumValid = !isNaN(data[index].K);

                if (isAreaValid && isAnyRadioChecked && isSMPValid && isCTCValid &&
                    isClayValid && isPhosphorusValid && isPotassiumValid) {

                    const apiUrl = "http://localhost:8080/agri-server/recommendation/calculate";

                    // Monta o objeto JSON com os dados da amostra
                    let json = {
                        tipoEspecie: selectedRadio.value,
                        area: area.value,
                        smp: data[index].SMP,
                        ctcPH7: data[index].CTC_ph7,
                        argila: data[index].argila,
                        p: data[index].P,
                        k: data[index].K
                    };

                    // Envia os dados para o back-end e exibe o resultado em um modal
                    let calculation = await sendJSON(apiUrl, json);

                    if (calculation.status === "failed") {
                        displayErrorModal("Erro no Cálculo", "Não foi possível realizar o cálculo. Ocorreu um erro.");
                    } else {
                        displayResultModal(calculation);
                    }

                } else if (!isAnyRadioChecked) {
                    alert("Por favor, selecione o tipo de espécie");

                } else if (!isAreaValid) {
                    alert("Por favor, preencha a área do solo");

                } else {
                    alert("Algum dado necessário está ausente ou inválido.");
                }

            } else {
                displayErrorModal("Erro no Cálculo", "Não foi possível realizar o cálculo. Ocorreu um erro.");
            }

        });

        // Configura o evento para excluir a amostra da interface
        removeBtn.addEventListener("click", () => {
            sampleContainer.removeChild(sampleDiv); // Remove a amostra do contêiner
            sampleCount.textContent = --sampleCount.textContent;  // Atualiza o contador de amostras
        });

        sampleContainer.appendChild(sampleDiv); // Adiciona o contêiner da amostra à interface
    });
}

/*
    EVENTS
*/

// Configura o evento para o botão de enviar dados na opção de inserção manual de dados
document.getElementById('button').addEventListener('click', async function (event) {

    event.preventDefault();

    // Coleta os valores de entrada preenchidos pelo usuário
    let cultivationType = Number(document.querySelector('input[name="option"]:checked')?.value);
    let area = parseFloat(document.getElementById('area').value);
    let smp = parseFloat(document.getElementById('smp').value);
    let ctcPH7 = parseFloat(document.getElementById('ctcPH7').value);
    let clay = parseFloat(document.getElementById('clay').value);
    let potassium = parseFloat(document.getElementById('potassium').value);
    let phosphorus = parseFloat(document.getElementById('phosphorus').value);

    // Verifica se todos os valores foram preenchidos corretamente
    if (!isNaN(area) && !isNaN(smp) && !isNaN(ctcPH7) &&
        !isNaN(clay) && !isNaN(phosphorus) && !isNaN(potassium)) {

        const apiUrl = "http://localhost:8080/agri-server/recommendation/calculate";

        // Monta o JSON com os valores de entrada
        let json = {
            tipoEspecie: cultivationType,
            area: area,
            smp: smp,
            ctcPH7: ctcPH7,
            argila: clay,
            p: phosphorus,
            k: potassium
        };

        // Envia os dados para o back-end e processa o resultado
        let calculation = await sendJSON(apiUrl, json);
        console.log(calculation)

        if (calculation.status === "failed") {
            displayErrorModal("Erro no Cálculo", "Não foi possível realizar o cálculo. Ocorreu um erro.");
        } else {
            displayResultModal(calculation);
        }

    } else {
        alert("Por favor, insira todos os valores corretamente.");
    }

});

// Configura o evento para fechar o modal
document.getElementById("close-modal").addEventListener("click", function () {
    document.getElementById("modal").style.display = "none";
});

// Evento disparado quando a página é carregada para configurar o seletor de arquivos
document.addEventListener("DOMContentLoaded", () => {
    const fileField = document.getElementById("file-field");
    const fileInput = document.getElementById("file-input");
    const filePathInput = document.getElementById("file-path");
    const browseButton = document.getElementById("browse-btn");

    fileField.style.display = "flex";

    // Configura o evento para abrir o seletor de arquivos
    browseButton.addEventListener("click", () => {
        fileInput.click();
    });

    // Atualiza o nome do arquivo selecionado no campo de texto
    fileInput.addEventListener("change", () => {
        if (fileInput.files[0]) {
            filePathInput.value = fileInput.files[0].name;
        }
    });

    const processButton = document.getElementById("process-btn");

    // Configura o evento para processar o arquivo carregado
    processButton.addEventListener("click", async () => {
        const file = fileInput.files[0];

        if (!file) {
            alert("Selecione um arquivo antes de processar!");
            return;
        }

        const apiUrl = "http://127.0.0.1:5000/upload_pdf";
        let PdfData = await sendFile(apiUrl, file); // Envia o arquivo para o micro serviço de leitura de PDF e recebe os dados processados

        displayPDFSamples(PdfData); // Exibe os dados processados na interface

    });

});