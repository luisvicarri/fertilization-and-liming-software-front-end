document.getElementById('button').addEventListener('click', function (event) {

    event.preventDefault();

    let tipoEspecie = document.querySelector('input[name="option"]:checked')?.value;
    let larguraFaixa = parseFloat(document.getElementById('larguraFaixa').value);
    let distanciaLinhas = parseFloat(document.getElementById('distanciaLinhas').value);
    let bases = parseFloat(document.getElementById('bases').value);
    let smp = parseFloat(document.getElementById('smp').value);
    let ctcPH7 = parseFloat(document.getElementById('ctcPH7').value);
    let argila = parseFloat(document.getElementById('argila').value);
    let k = parseFloat(document.getElementById('potassio').value);
    let p = parseFloat(document.getElementById('fosforo').value);

    let json = {
        "tipoEspecie": tipoEspecie,
        "larguraFaixa": larguraFaixa,
        "distanciaLinhas": distanciaLinhas,
        "bases": bases,
        "smp": smp,
        "ctcPH7": ctcPH7,
        "argila": argila,
        "p": p,
        "k": k
    };

    if (!isNaN(larguraFaixa) && !isNaN(distanciaLinhas) && !isNaN(bases) && !isNaN(smp) 
        && !isNaN(ctcPH7) && !isNaN(argila) && !isNaN(p) && !isNaN(k) && tipoEspecie) {
        
        let jsonString = JSON.stringify(json, null, 2);

        alert("Os seguintes dados serão enviados:\n\n" + jsonString);

        console.log(jsonString);

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

    } else {
        alert("Por favor, insira todos os valores corretamente.");
    }

});