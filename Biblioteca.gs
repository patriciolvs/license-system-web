const API_TOKEN = "seu_token_unico_aqui_123456"; // Deve ser o mesmo token usado no projeto principal e no frontend

function validarESalvar(dados) {
    Logger.log("Início da função validarESalvar");
    Logger.log("Dados recebidos: " + JSON.stringify(dados));

    // Validação inicial
    if (!dados) {
        Logger.log("Erro: Dados ausentes");
        return { success: false, error: "Dados ausentes" };
    }

    if (!dados.token || dados.token !== API_TOKEN) {
        Logger.log("Token inválido: " + dados.token);
        return { success: false, error: "Token inválido" };
    }

    if (!dados.sale) {
        Logger.log("Erro: Dados da venda ausentes");
        return { success: false, error: "Dados da venda ausentes" };
    }

    if (dados.sale.length !== 15) {
        Logger.log("Erro: Estrutura da venda inválida: " + JSON.stringify(dados.sale));
        return { success: false, error: "Estrutura da venda inválida" };
    }

    if (dados.sale.some(value => value === null || value === undefined || (typeof value === 'number' && isNaN(value)))) {
        Logger.log("Erro: Valores inválidos na venda: " + JSON.stringify(dados.sale));
        return { success: false, error: "Valores inválidos na venda" };
    }

    Logger.log("Validação concluída com sucesso");
    return { success: true };
}
