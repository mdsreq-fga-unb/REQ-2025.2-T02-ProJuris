/**
 * Componente ImportarDemandas - RN01
 * 
 * Modal para importação de demandas via Excel/CSV com:
 * - Upload de arquivo (.xlsx, .xls, .csv)
 * - Preview de demandas validadas
 * - Detecção de duplicatas
 * - Mapeamento de responsável padrão
 * - Confirmação de importação
 * 
 * Autor: GitHub Copilot AI Agent
 * Data: 01/12/2025
 */

import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
    Upload, 
    FileSpreadsheet, 
    AlertCircle, 
    CheckCircle, 
    X, 
    AlertTriangle,
    UserPlus,
    FileCheck
} from 'lucide-react';
import '../../style/importarDemandas.css';

function ImportarDemandas({ onClose, onImportComplete }) {
    const [arquivo, setArquivo] = useState(null);
    const [usuarios, setUsuarios] = useState([]);
    const [responsavelPadrao, setResponsavelPadrao] = useState('');
    const [ignorarDuplicatas, setIgnorarDuplicatas] = useState(true);
    
    // Estados do processo de importação
    const [etapa, setEtapa] = useState('upload'); // 'upload', 'preview', 'confirmando', 'concluido'
    const [loading, setLoading] = useState(false);
    
    // Dados do preview
    const [preview, setPreview] = useState([]);
    const [relatorio, setRelatorio] = useState(null);
    const [duplicatas, setDuplicatas] = useState([]);
    
    // Resultado final
    const [resultado, setResultado] = useState(null);

    useEffect(() => {
        carregarUsuarios();
    }, []);

    const carregarUsuarios = async () => {
        try {
            const response = await api.get('/usuarios');
            setUsuarios(response.data);
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        
        if (!file) {
            return;
        }

        // Valida extensão
        const extensao = file.name.toLowerCase().split('.').pop();
        if (!['xlsx', 'xls', 'csv'].includes(extensao)) {
            alert('Formato de arquivo não suportado. Use .xlsx, .xls ou .csv');
            return;
        }

        setArquivo(file);
    };

    const processarArquivo = async () => {
        if (!arquivo) {
            alert('Selecione um arquivo para importar.');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('arquivo', arquivo);

            const response = await api.post('/demandas/importar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Atualiza preview
            setPreview(response.data.preview || []);
            setRelatorio(response.data.relatorio || {});
            setDuplicatas(response.data.duplicatas || []);
            
            // Avança para etapa de preview
            setEtapa('preview');
        } catch (error) {
            console.error('Erro ao processar arquivo:', error);
            const mensagem = error.response?.data?.message || 'Erro ao processar arquivo.';
            const relatorioErro = error.response?.data?.relatorio;
            
            if (relatorioErro) {
                alert(
                    `Erro ao processar arquivo:\n\n` +
                    `${relatorioErro.erros?.join('\n') || mensagem}`
                );
            } else {
                alert(mensagem);
            }
        } finally {
            setLoading(false);
        }
    };

    const confirmarImportacao = async () => {
        if (!responsavelPadrao) {
            alert('Selecione um responsável padrão para as demandas.');
            return;
        }

        setEtapa('confirmando');
        setLoading(true);

        try {
            const response = await api.post('/demandas/importar/confirmar', {
                demandas: preview,
                responsavel_padrao_id: parseInt(responsavelPadrao),
                ignorar_duplicatas: ignorarDuplicatas
            });

            setResultado(response.data);
            setEtapa('concluido');
            
            // Notifica componente pai
            if (onImportComplete) {
                onImportComplete();
            }
        } catch (error) {
            console.error('Erro ao confirmar importação:', error);
            alert(error.response?.data?.message || 'Erro ao importar demandas.');
            setEtapa('preview');
        } finally {
            setLoading(false);
        }
    };

    const fecharModal = () => {
        if (etapa === 'confirmando') {
            return; // Não permite fechar durante confirmação
        }
        
        if (onClose) {
            onClose();
        }
    };

    return (
        <div className="importar-modal-overlay" onClick={fecharModal}>
            <div className="importar-modal-content" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="importar-modal-header">
                    <h2>
                        <Upload size={24} />
                        Importar Demandas
                    </h2>
                    <button 
                        className="importar-close-button" 
                        onClick={fecharModal}
                        disabled={etapa === 'confirmando'}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Conteúdo por etapa */}
                <div className="importar-modal-body">
                    {/* ETAPA 1: Upload de Arquivo */}
                    {etapa === 'upload' && (
                        <div className="importar-etapa-upload">
                            <div className="importar-info-box">
                                <FileSpreadsheet size={48} />
                                <h3>Selecione um arquivo Excel ou CSV</h3>
                                <p>
                                    O arquivo deve conter colunas como: <strong>Título</strong> (obrigatório),
                                    Descrição, Cliente, Prazo, Prioridade, Status, Responsável.
                                </p>
                                <p className="importar-formatos">
                                    Formatos suportados: <code>.xlsx</code>, <code>.xls</code>, <code>.csv</code>
                                </p>
                            </div>

                            <div className="importar-file-input-container">
                                <input
                                    type="file"
                                    id="arquivo-importacao"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={handleFileChange}
                                    className="importar-file-input"
                                />
                                <label htmlFor="arquivo-importacao" className="importar-file-label">
                                    <Upload size={20} />
                                    {arquivo ? arquivo.name : 'Escolher arquivo'}
                                </label>
                            </div>

                            {arquivo && (
                                <button
                                    className="importar-btn-primary"
                                    onClick={processarArquivo}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner"></span>
                                            Processando...
                                        </>
                                    ) : (
                                        <>
                                            <FileCheck size={20} />
                                            Processar Arquivo
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    )}

                    {/* ETAPA 2: Preview de Demandas */}
                    {etapa === 'preview' && (
                        <div className="importar-etapa-preview">
                            {/* Relatório de Processamento */}
                            {relatorio && (
                                <div className="importar-relatorio">
                                    <h3>
                                        <FileCheck size={20} />
                                        Arquivo Processado
                                    </h3>
                                    <div className="importar-stats">
                                        <div className="stat-item">
                                            <span className="stat-label">Total de linhas:</span>
                                            <span className="stat-value">{relatorio.total_linhas}</span>
                                        </div>
                                        <div className="stat-item success">
                                            <span className="stat-label">Válidas:</span>
                                            <span className="stat-value">{relatorio.linhas_validas}</span>
                                        </div>
                                        <div className="stat-item error">
                                            <span className="stat-label">Inválidas:</span>
                                            <span className="stat-value">{relatorio.linhas_invalidas}</span>
                                        </div>
                                    </div>

                                    {/* Avisos */}
                                    {relatorio.avisos && relatorio.avisos.length > 0 && (
                                        <div className="importar-avisos">
                                            <AlertTriangle size={18} />
                                            <strong>Avisos:</strong>
                                            <ul>
                                                {relatorio.avisos.slice(0, 5).map((aviso, idx) => (
                                                    <li key={idx}>{aviso}</li>
                                                ))}
                                                {relatorio.avisos.length > 5 && (
                                                    <li>... e mais {relatorio.avisos.length - 5} avisos</li>
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Duplicatas Detectadas */}
                            {duplicatas.length > 0 && (
                                <div className="importar-duplicatas">
                                    <AlertCircle size={20} />
                                    <strong>{duplicatas.length} possível(is) duplicata(s) detectada(s)</strong>
                                    <ul>
                                        {duplicatas.slice(0, 3).map((dup, idx) => (
                                            <li key={idx}>
                                                Linha {dup.linha}: <strong>{dup.titulo}</strong>
                                            </li>
                                        ))}
                                        {duplicatas.length > 3 && (
                                            <li>... e mais {duplicatas.length - 3}</li>
                                        )}
                                    </ul>
                                    <label className="importar-checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={ignorarDuplicatas}
                                            onChange={e => setIgnorarDuplicatas(e.target.checked)}
                                        />
                                        Ignorar duplicatas (não importar)
                                    </label>
                                </div>
                            )}

                            {/* Preview de Demandas (primeiras 10) */}
                            {preview.length > 0 && (
                                <div className="importar-preview-table">
                                    <h3>Preview das Demandas ({preview.length} total)</h3>
                                    <div className="importar-table-container">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Título</th>
                                                    <th>Cliente</th>
                                                    <th>Prazo</th>
                                                    <th>Prioridade</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {preview.slice(0, 10).map((demanda, idx) => (
                                                    <tr key={idx}>
                                                        <td>{demanda.titulo}</td>
                                                        <td>{demanda.cliente || '-'}</td>
                                                        <td>{demanda.prazo || '-'}</td>
                                                        <td>
                                                            <span className={`badge badge-${demanda.prioridade}`}>
                                                                {demanda.prioridade}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className={`badge badge-${demanda.status}`}>
                                                                {demanda.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {preview.length > 10 && (
                                            <p className="importar-more-items">
                                                ... e mais {preview.length - 10} demandas
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Seleção de Responsável Padrão */}
                            <div className="importar-responsavel-padrao">
                                <label>
                                    <UserPlus size={20} />
                                    <strong>Responsável Padrão (obrigatório)</strong>
                                </label>
                                <p className="help-text">
                                    Será atribuído às demandas que não especificarem responsável
                                </p>
                                <select
                                    value={responsavelPadrao}
                                    onChange={e => setResponsavelPadrao(e.target.value)}
                                    className="importar-select"
                                >
                                    <option value="">Selecione um responsável</option>
                                    {usuarios.map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.nome} ({user.email})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Botões de Ação */}
                            <div className="importar-actions">
                                <button
                                    className="importar-btn-secondary"
                                    onClick={() => {
                                        setEtapa('upload');
                                        setArquivo(null);
                                        setPreview([]);
                                    }}
                                >
                                    Voltar
                                </button>
                                <button
                                    className="importar-btn-primary"
                                    onClick={confirmarImportacao}
                                    disabled={!responsavelPadrao || preview.length === 0}
                                >
                                    <CheckCircle size={20} />
                                    Confirmar Importação
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ETAPA 3: Confirmando (Loading) */}
                    {etapa === 'confirmando' && (
                        <div className="importar-loading">
                            <span className="spinner-large"></span>
                            <h3>Importando demandas...</h3>
                            <p>Aguarde enquanto processamos as {preview.length} demandas.</p>
                        </div>
                    )}

                    {/* ETAPA 4: Concluído */}
                    {etapa === 'concluido' && resultado && (
                        <div className="importar-resultado">
                            <div className="importar-success-icon">
                                <CheckCircle size={64} />
                            </div>
                            <h3>Importação Concluída!</h3>
                            
                            <div className="importar-resultado-stats">
                                <div className="stat-card success">
                                    <span className="stat-number">{resultado.total_importadas}</span>
                                    <span className="stat-label">Demandas Importadas</span>
                                </div>
                                {resultado.total_puladas > 0 && (
                                    <div className="stat-card warning">
                                        <span className="stat-number">{resultado.total_puladas}</span>
                                        <span className="stat-label">Demandas Puladas</span>
                                    </div>
                                )}
                            </div>

                            {/* Demandas Puladas (se houver) */}
                            {resultado.demandas_puladas && resultado.demandas_puladas.length > 0 && (
                                <div className="importar-puladas">
                                    <AlertTriangle size={20} />
                                    <strong>Demandas Puladas:</strong>
                                    <ul>
                                        {resultado.demandas_puladas.map((item, idx) => (
                                            <li key={idx}>
                                                <strong>{item.titulo}</strong>: {item.motivo}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <button
                                className="importar-btn-primary"
                                onClick={fecharModal}
                            >
                                Fechar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ImportarDemandas;
