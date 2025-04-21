// Substitua pelo URL do seu Web App
const API_URL = "https://script.google.com/macros/s/AKfycbwkYgxjEnwpUVE4LlKg-3seiwfPxNJ10w6_B7d3GeA4u8evI_9SbJCno5DrsnZsX78bgA/exec"; // Ex.: "https://script.google.com/macros/s/[SEU_ID]/exec"

function login() {
    const password = document.getElementById('password').value;
    localStorage.setItem('password', password);
    const url = new URL(API_URL);
    url.searchParams.append('method', 'checkPassword');
    url.searchParams.append('password', password);
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else if (data) {
                window.location.href = 'dashboard.html';
            } else {
                alert('Senha incorreta.');
            }
        })
        .catch(error => {
            console.error('Erro ao fazer login:', error);
            alert('Erro ao fazer login: ' + error.message);
        });
}

function sendBackup() {
    const email = prompt('Digite o e-mail para enviar o backup:');
    if (email) {
        const url = new URL(API_URL);
        url.searchParams.append('method', 'sendBackup');
        url.searchParams.append('password', localStorage.getItem('password'));
        url.searchParams.append('email', email);
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Backup enviado com sucesso para ' + email);
                } else {
                    alert('Erro ao enviar backup: ' + (data.error || 'Desconhecido'));
                }
            })
            .catch(error => {
                console.error('Erro ao enviar backup:', error);
                alert('Erro ao enviar backup: ' + error.message);
            });
    }
}

function logout() {
    localStorage.removeItem('password');
    window.location.href = 'index.html';
}

function fetchClients() {
    const url = new URL(API_URL);
    url.searchParams.append('method', 'getClients');
    url.searchParams.append('password', localStorage.getItem('password'));
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
    url.searchParams.append('password', localStorage.getItem('password'));
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
    url.searchParams.append('password', localStorage.getItem('password'));
    url.searchParams.append('sale', JSON.stringify(sale));
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
    url.searchParams.append('password', localStorage.getItem('password'));
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
          '7. Configurações: Envie um backup por e-mail ou saia do sistema.\n\n' +
          'Nota: Certifique-se de salvar os dados regularmente.');
}

function updateCalculatedFields() {
    const activationDate = new Date(document.getElementById('activation_date').value);
    const expirationDate = new Date(document.getElementById('expiration_date').value);
    const licenseValue = parseFloat(document.getElementById('license_value').value) || 0;
    const quantity = parseInt(document.getElementById('quantity').value) || 0;
    const discount = parseFloat(document.getElementById('discount').value) || 0;

    // Calcular dias para expirar
    const today = new Date();
    const daysToExpire = Math.max(0, Math.ceil((expirationDate - today) / (1000 * 60 * 60 * 24)));
    if (expirationDate < today) daysToExpire = 0;
    document.getElementById('days_to_expire').value = daysToExpire;

    // Calcular valores
    const totalValue = licenseValue * quantity;
    const totalWithDiscount = totalValue - discount;
    const unitValueWithDiscount = totalWithDiscount / quantity;
    const dailyValue = (activationDate < expirationDate) ? (unitValueWithDiscount / Math.ceil((expirationDate - activationDate) / (1000 * 60 * 60 * 24))) : 0;

    document.getElementById('total_value').value = totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('total_with_discount').value = totalWithDiscount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('unit_value_with_discount').value = unitValueWithDiscount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('daily_value').value = dailyValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
