// Substitua pelo URL do seu Web App
const API_URL = "https://script.google.com/macros/s/AKfycbwkYgxjEnwpUVE4LlKg-3seiwfPxNJ10w6_B7d3GeA4u8evI_9SbJCno5DrsnZsX78bgA/exec";

// Token de API (definido no config.js ou diretamente aqui)
const API_TOKEN = config.apiToken || "AKfycbwkYgxjEnwpUVE4LlKg-3seiwfPxNJ10w6_B7d3GeA4u8evI_9SbJCno5DrsnZsX78bgA"; // Use config.apiToken se estiver usando config.js

// Lista predefinida de e-mails
const emailList = [
    "lopat.nfe@gmail.com",
    "patricio@example.com",
    "teste@example.com",
    "usuario1@gmail.com",
    "usuario2@outlook.com"
];

function populateEmailList() {
    const datalist = document.getElementById('emailList');
    emailList.forEach(email => {
        const option = document.createElement('option');
        option.value = email;
        datalist.appendChild(option);
    });
}

function downloadBackup() {
    // Baixar backup de vendas
    const salesUrl = new URL(API_URL);
    salesUrl.searchParams.append('method', 'downloadBackup');
    salesUrl.searchParams.append('type', 'sales');
    salesUrl.searchParams.append('token', API_TOKEN); // Adiciona o token
    fetch(salesUrl)
        .then(response => response.text())
        .then(csv => {
            const blob = new Blob([csv], { type: 'text/csv' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'sales_backup_' + new Date().toISOString().replace(/[:.]/g, '-') + '.csv';
            link.click();
        })
        .catch(error => {
            console.error('Erro ao baixar backup de vendas:', error);
            alert('Erro ao baixar backup de vendas: ' + error.message);
        });

    // Baixar backup de clientes
    const clientsUrl = new URL(API_URL);
    clientsUrl.searchParams.append('method', 'downloadBackup');
    clientsUrl.searchParams.append('type', 'clients');
    clientsUrl.searchParams.append('token', API_TOKEN); // Adiciona o token
    fetch(clientsUrl)
        .then(response => response.text())
        .then(csv => {
            const blob = new Blob([csv], { type: 'text/csv' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'clients_backup_' + new Date().toISOString().replace(/[:.]/g, '-') + '.csv';
            link.click();
        })
        .catch(error => {
            console.error('Erro ao baixar backup de clientes:', error);
            alert('Erro ao baixar backup de clientes: ' + error.message);
        });
}

function logout() {
    window.location.href = 'index.html';
}

function fetchClients() {
    const url = new URL(API_URL);
    url.searchParams.append('method', 'getClients');
    url.searchParams.append('token', API_TOKEN); // Adiciona o token
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.error) throw new Error(data.error);
            return data;
        })
        .catch(error => {
            console.error('Erro ao buscar clientes:', error);
            throw error;
        });
}

function fetchSales() {
    const url = new URL(API_URL);
    url.searchParams.append('method', 'getSales');
    url.searchParams.append('token', API_TOKEN); // Adiciona o token
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.error) throw new Error(data.error);
            return data;
        })
        .catch(error => {
            console.error('Erro ao buscar vendas:', error);
            throw error;
        });
}

function saveSale(sale, row, callback) {
    const url = new URL(API_URL);
    url.searchParams.append('method', 'saveSale');
    url.searchParams.append('sale', JSON.stringify(sale));
    url.searchParams.append('token', API_TOKEN); // Adiciona o token
    if (row !== null) url.searchParams.append('row', row);
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.success) callback();
            else alert('Erro ao salvar venda: ' + (data.error || 'Desconhecido'));
        })
        .catch(error => {
            console.error('Erro ao salvar venda:', error);
            alert('Erro ao salvar venda: ' + error.message);
        });
}

function exportSales() {
    const url = new URL(API_URL);
    url.searchParams.append('method', 'exportSales');
    url.searchParams.append('token', API_TOKEN); // Adiciona o token
    fetch(url)
        .then(response => response.text())
        .then(csv => {
            const blob = new Blob([csv], { type: 'text/csv' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'Vendas_Exportadas_' + new Date().toISOString().replace(/[:.]/g, '-') + '.csv';
            link.click();
        })
        .catch(error => {
            console.error('Erro ao exportar vendas:', error);
            alert('Erro ao exportar vendas: ' + error.message);
        });
}

function showHelp() {
    alert('Guia do Usuário:\n\n' +
          '1. Adicionar Venda: Insira uma nova venda de licença e cadastre clientes diretamente no campo de cliente.\n' +
          '2. Ver Dashboard: Veja métricas e licenças próximas ao vencimento.\n' +
          '3. Gerenciar Clientes: Visualize, edite ou exclua clientes existentes.\n' +
          '4. Histórico de Vendas: Visualize, edite ou exclua vendas registradas.\n' +
          '5. Licenças a Vencer: Filtre e exporte licenças próximas ao vencimento.\n' +
          '6. Exportar Vendas: Exporte todas as vendas para um arquivo CSV.\n' +
          '7. Configurações: Baixe o backup ou saia do sistema.\n\n' +
          'Nota: Certifique-se de salvar os dados regularmente.');
}

function updateCalculatedFields() {
    const activationDate = document.getElementById('activation_date').value;
    const expirationDate = document.getElementById('expiration_date').value;
    const licenseValue = parseFloat(document.getElementById('license_value').value) || 0;
    const quantity = parseInt(document.getElementById('quantity').value) || 0;
    const discount = parseFloat(document.getElementById('discount').value) || 0;

    // Log para depuração
    console.log('Valores de entrada:', {
        activationDate,
        expirationDate,
        licenseValue,
        quantity,
        discount
    });

    // Calcular dias para expirar
    const activationDateObj = new Date(activationDate);
    const expirationDateObj = new Date(expirationDate);
    const today = new Date();
    let daysToExpire = 0;
    if (!isNaN(activationDateObj) && !isNaN(expirationDateObj)) {
        daysToExpire = Math.max(0, Math.ceil((expirationDateObj - today) / (1000 * 60 * 60 * 24)));
        if (expirationDateObj < today) daysToExpire = 0;
    }
    document.getElementById('days_to_expire').value = daysToExpire;

    // Calcular valores
    const totalValue = licenseValue * quantity;
    const totalWithDiscount = totalValue - discount;
    const unitValueWithDiscount = quantity > 0 ? totalWithDiscount / quantity : 0;
    const dailyValue = (!isNaN(activationDateObj) && !isNaN(expirationDateObj) && activationDateObj < expirationDateObj)
        ? (unitValueWithDiscount / Math.ceil((expirationDateObj - activationDateObj) / (1000 * 60 * 60 * 24)))
        : 0;

    // Log para depuração
    console.log('Valores calculados:', {
        daysToExpire,
        totalValue,
        totalWithDiscount,
        unitValueWithDiscount,
        dailyValue
    });

    // Armazenar valores formatados para exibição
    document.getElementById('total_value').value = totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('total_with_discount').value = totalWithDiscount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('unit_value_with_discount').value = unitValueWithDiscount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('daily_value').value = dailyValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // Armazenar valores brutos para uso posterior
    document.getElementById('total_value_raw').value = totalValue;
    document.getElementById('total_with_discount_raw').value = totalWithDiscount;
    document.getElementById('unit_value_with_discount_raw').value = unitValueWithDiscount;
    document.getElementById('daily_value_raw').value = dailyValue;
}
