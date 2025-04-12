// API endpoints
const API_BASE_URL = 'http://localhost:3000/api';

// Components
class App {
    constructor() {
        this.container = document.getElementById('root');
        this.currentView = null;
        this.init();
    }

    async init() {
        this.render();
        this.showAvioes();
    }

    render() {
        this.container.innerHTML = `
            <nav class="navbar navbar-expand-lg navbar-dark mb-4">
                <div class="container">
                    <a class="navbar-brand" href="#">Aeroporto Mukanka</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav">
                            <li class="nav-item">
                                <a class="nav-link" href="#" id="navAvioes">Aviões</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#" id="navEmpregados">Empregados</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#" id="navTestes">Testes</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div class="container" id="content"></div>
        `;

        // Event listeners
        document.getElementById('navAvioes').addEventListener('click', () => this.showAvioes());
        document.getElementById('navEmpregados').addEventListener('click', () => this.showEmpregados());
        document.getElementById('navTestes').addEventListener('click', () => this.showTestes());
    }

    async showAvioes() {
        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="row mb-4">
                <div class="col">
                    <h2>Gestão de Aviões</h2>
                </div>
                <div class="col text-end">
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addAviaoModal">
                        Adicionar Avião
                    </button>
                </div>
            </div>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Número de Registro</th>
                                    <th>Modelo</th>
                                    <th>Capacidade</th>
                                    <th>Peso</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody id="avioesTable">
                                <tr>
                                    <td colspan="5" class="text-center">Carregando...</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Modal Adicionar Avião -->
            <div class="modal fade" id="addAviaoModal">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Adicionar Avião</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="aviaoForm">
                                <div class="mb-3">
                                    <label class="form-label">Número de Registro</label>
                                    <input type="text" class="form-control" name="numero_registo" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Código do Modelo</label>
                                    <input type="text" class="form-control" name="codigo_modelo" required>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" id="saveAviao">Salvar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.loadAvioes();
        this.setupAviaoForm();
    }

    async loadAvioes() {
        try {
            const response = await fetch(`${API_BASE_URL}/avioes`);
            const avioes = await response.json();
            const tbody = document.getElementById('avioesTable');
            
            tbody.innerHTML = avioes.map(aviao => `
                <tr>
                    <td>${aviao.numero_registo}</td>
                    <td>${aviao.nome_modelo}</td>
                    <td>${aviao.capacidade}</td>
                    <td>${aviao.peso} kg</td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="app.deleteAviao('${aviao.numero_registo}')">
                            Excluir
                        </button>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Erro ao carregar aviões:', error);
        }
    }

    setupAviaoForm() {
        document.getElementById('saveAviao').addEventListener('click', async () => {
            const form = document.getElementById('aviaoForm');
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(`${API_BASE_URL}/avioes`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    bootstrap.Modal.getInstance(document.getElementById('addAviaoModal')).hide();
                    this.loadAvioes();
                    form.reset();
                } else {
                    alert('Erro ao salvar avião');
                }
            } catch (error) {
                console.error('Erro ao salvar avião:', error);
                alert('Erro ao salvar avião');
            }
        });
    }

    async deleteAviao(numeroRegisto) {
        if (confirm('Tem certeza que deseja excluir este avião?')) {
            try {
                const response = await fetch(`${API_BASE_URL}/avioes/${numeroRegisto}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    this.loadAvioes();
                } else {
                    alert('Erro ao excluir avião');
                }
            } catch (error) {
                console.error('Erro ao excluir avião:', error);
                alert('Erro ao excluir avião');
            }
        }
    }

    // Similar methods for Empregados and Testes...
}

// Initialize the application
window.app = new App(); 