"""
Testes para módulo de importação - ProJuris
"""
import pytest
import pandas as pd
import io
from app.importador import ImportadorDemandas, processar_importacao

@pytest.mark.unit
class TestImportadorDemandas:
    """Testes para classe ImportadorDemandas"""
    
    def test_normalizar_prioridade(self):
        """Testa normalização de prioridades"""
        importador = ImportadorDemandas()
        
        assert importador.normalizar_prioridade('urgente') == 'urgente'
        assert importador.normalizar_prioridade('URGENT') == 'urgente'
        assert importador.normalizar_prioridade('alta') == 'alta'
        assert importador.normalizar_prioridade('HIGH') == 'alta'
        assert importador.normalizar_prioridade('normal') == 'normal'
        assert importador.normalizar_prioridade('baixa') == 'baixa'
        assert importador.normalizar_prioridade('desconhecido') == 'normal'
    
    def test_normalizar_status(self):
        """Testa normalização de status"""
        importador = ImportadorDemandas()
        
        assert importador.normalizar_status('pendente') == 'pendente'
        assert importador.normalizar_status('novo') == 'pendente'
        assert importador.normalizar_status('em andamento') == 'em_andamento'
        assert importador.normalizar_status('working') == 'em_andamento'
        assert importador.normalizar_status('revisão') == 'revisao'
        assert importador.normalizar_status('concluído') == 'concluido'
        assert importador.normalizar_status('done') == 'concluido'
    
    def test_normalizar_data(self):
        """Testa normalização de datas"""
        importador = ImportadorDemandas()
        
        # Formato DD/MM/YYYY
        assert importador.normalizar_data('15/03/2025') == '2025-03-15'
        
        # Formato DD-MM-YYYY
        assert importador.normalizar_data('15-03-2025') == '2025-03-15'
        
        # Formato YYYY-MM-DD
        assert importador.normalizar_data('2025-03-15') == '2025-03-15'
        
        # Data inválida
        assert importador.normalizar_data('invalid') is None
        assert importador.normalizar_data('') is None
    
    def test_ler_arquivo_csv(self):
        """Testa leitura de arquivo CSV"""
        importador = ImportadorDemandas()
        
        # Cria CSV em memória
        csv_content = """Título,Descrição,Prioridade
Demanda 1,Descrição 1,alta
Demanda 2,Descrição 2,normal
"""
        arquivo_bytes = csv_content.encode('utf-8')
        
        df = importador.ler_arquivo(arquivo_bytes, 'teste.csv')
        
        assert len(df) == 2
        assert 'Título' in df.columns
        assert df.iloc[0]['Título'] == 'Demanda 1'
    
    def test_mapear_colunas(self):
        """Testa mapeamento de colunas"""
        importador = ImportadorDemandas()
        
        # DataFrame com variações de nomes
        df = pd.DataFrame({
            'Título': ['Demanda 1'],
            'Descrição': ['Desc 1'],
            'Cliente': ['Cliente 1'],
            'Prazo': ['15/03/2025'],
            'Prioridade': ['alta'],
            'Status': ['pendente']
        })
        
        mapeamento = importador.mapear_colunas(df)
        
        assert 'titulo' in mapeamento
        assert 'descricao' in mapeamento
        assert 'cliente' in mapeamento
        assert 'prazo' in mapeamento
        assert 'prioridade' in mapeamento
        assert 'status' in mapeamento
    
    def test_validar_colunas_obrigatorias_sucesso(self):
        """Testa validação de colunas obrigatórias com sucesso"""
        importador = ImportadorDemandas()
        mapeamento = {'titulo': 'Título', 'descricao': 'Descrição'}
        
        assert importador.validar_colunas_obrigatorias(mapeamento) == True
    
    def test_validar_colunas_obrigatorias_falha(self):
        """Testa validação de colunas obrigatórias com falha"""
        importador = ImportadorDemandas()
        mapeamento = {'descricao': 'Descrição'}  # Falta 'titulo'
        
        assert importador.validar_colunas_obrigatorias(mapeamento) == False
        assert len(importador.erros) > 0
    
    def test_processar_linha_valida(self):
        """Testa processamento de linha válida"""
        importador = ImportadorDemandas()
        
        linha = pd.Series({
            'Título': 'Demanda Teste',
            'Descrição': 'Descrição teste',
            'Cliente': 'Cliente X',
            'Prazo': '15/03/2025',
            'Prioridade': 'alta',
            'Status': 'pendente'
        })
        
        mapeamento = {
            'titulo': 'Título',
            'descricao': 'Descrição',
            'cliente': 'Cliente',
            'prazo': 'Prazo',
            'prioridade': 'Prioridade',
            'status': 'Status'
        }
        
        dados = importador.processar_linha(linha, mapeamento, 2)
        
        assert dados is not None
        assert dados['titulo'] == 'Demanda Teste'
        assert dados['prioridade'] == 'alta'
        assert dados['status'] == 'pendente'
        assert dados['prazo'] == '2025-03-15'
    
    def test_processar_linha_sem_titulo(self):
        """Testa processamento de linha sem título (inválida)"""
        importador = ImportadorDemandas()
        
        linha = pd.Series({
            'Título': '',
            'Descrição': 'Sem título'
        })
        
        mapeamento = {
            'titulo': 'Título',
            'descricao': 'Descrição'
        }
        
        dados = importador.processar_linha(linha, mapeamento, 2)
        
        assert dados is None
        assert importador.linhas_invalidas == 1

@pytest.mark.integration
class TestImportacaoIntegration:
    """Testes de integração da importação"""
    
    def test_importar_csv_completo(self):
        """Testa importação completa de CSV"""
        csv_content = """Título,Descrição,Cliente,Prazo,Prioridade,Status
Demanda 1,Descrição 1,Cliente A,15/03/2025,alta,pendente
Demanda 2,Descrição 2,Cliente B,20/03/2025,normal,em andamento
Demanda 3,Descrição 3,Cliente C,25/03/2025,urgente,revisao
"""
        arquivo_bytes = csv_content.encode('utf-8')
        
        demandas, relatorio = processar_importacao(arquivo_bytes, 'teste.csv')
        
        assert relatorio['sucesso'] == True
        assert relatorio['total_linhas'] == 3
        assert relatorio['linhas_validas'] == 3
        assert relatorio['linhas_invalidas'] == 0
        assert len(demandas) == 3
        assert demandas[0]['titulo'] == 'Demanda 1'
        assert demandas[1]['prioridade'] == 'normal'
        assert demandas[2]['status'] == 'revisao'
