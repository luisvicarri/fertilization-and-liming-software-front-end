const jsonTeste = {
    status: "success",
    dose_calcario_hec: 2.5,
    dose_calcario_total: 25,
    valor_potassio_hectare: 100,
    valor_potassio_total: 1000,
    valor_fosforo_hectare: 50,
    valor_fosforo_total: 500
};

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