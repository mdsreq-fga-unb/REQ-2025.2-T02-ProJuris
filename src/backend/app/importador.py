"""
Módulo para importação de demandas via Excel/CSV (RN01)
Autor: GitHub Copilot AI Agent
Data: 01/12/2025
"""

import pandas as pd
import io
from datetime import datetime
from typing import Dict, List, Tuple, Optional, Any


class ImportadorDemandas:
    """
    Classe responsável por importar demandas de arquivos Excel/CSV
    com validação e mapeamento de colunas
    """
    
    # Mapeamento de colunas esperadas (flexível para variações)
    COLUNAS_MAPEAMENTO = {
        'titulo': ['titulo', 'título', 'title', 'nome', 'name', 'assunto'],
        'descricao': ['descricao', 'descrição', 'description', 'detalhes', 'details'],
        'cliente': ['cliente', 'client', 'customer'],
        'prazo': ['prazo', 'data_prazo', 'deadline', 'vencimento', 'due_date'],
        'prioridade': ['prioridade', 'priority', 'urgencia', 'urgência'],
        'responsavel': ['responsavel', 'responsável', 'assigned', 'atribuido'],
        'status': ['status', 'estado', 'state']
    }
    
    # Valores válidos para prioridade
    PRIORIDADES_VALIDAS = {
        'urgente': ['urgente', 'urgent', 'crítico', 'critico', 'alta+', '1'],
        'alta': ['alta', 'high', 'importante', '2'],
        'normal': ['normal', 'média', 'media', 'medium', '3'],
        'baixa': ['baixa', 'low', 'baixa prioridade', '4']
    }
    
    # Valores válidos para status
    STATUS_VALIDOS = {
        'pendente': ['pendente', 'pending', 'novo', 'new', 'aberto'],
        'em_andamento': ['em andamento', 'em_andamento', 'in progress', 'working', 'trabalhando'],
        'revisao': ['revisao', 'revisão', 'review', 'em revisão'],
        'concluido': ['concluido', 'concluído', 'completed', 'done', 'finalizado']
    }
    
    def __init__(self):
        self.erros = []
        self.avisos = []
        self.linhas_processadas = 0
        self.linhas_validas = 0
        self.linhas_invalidas = 0
    
    def ler_arquivo(self, arquivo_bytes: bytes, nome_arquivo: str) -> pd.DataFrame:
        """
        Lê arquivo Excel ou CSV e retorna DataFrame
        
        Args:
            arquivo_bytes: Conteúdo do arquivo em bytes
            nome_arquivo: Nome do arquivo (para detectar extensão)
        
        Returns:
            DataFrame com os dados do arquivo
        
        Raises:
            ValueError: Se formato não suportado ou erro na leitura
        """
        extensao = nome_arquivo.lower().split('.')[-1]
        
        try:
            if extensao in ['xlsx', 'xls']:
                df = pd.read_excel(io.BytesIO(arquivo_bytes))
            elif extensao == 'csv':
                # Tenta detectar o delimitador
                df = pd.read_csv(io.BytesIO(arquivo_bytes), sep=None, engine='python')
            else:
                raise ValueError(f"Formato de arquivo não suportado: {extensao}")
            
            if df.empty:
                raise ValueError("Arquivo está vazio")
            
            return df
        
        except Exception as e:
            raise ValueError(f"Erro ao ler arquivo: {str(e)}")
    
    def mapear_colunas(self, df: pd.DataFrame) -> Dict[str, str]:
        """
        Mapeia colunas do DataFrame para campos esperados
        
        Args:
            df: DataFrame com dados do arquivo
        
        Returns:
            Dicionário mapeando campo_esperado -> nome_coluna_real
        """
        colunas_arquivo = [col.lower().strip() for col in df.columns]
        mapeamento = {}
        
        for campo_esperado, variacoes in self.COLUNAS_MAPEAMENTO.items():
            for coluna_real in colunas_arquivo:
                if coluna_real in [v.lower() for v in variacoes]:
                    # Encontra o nome original da coluna (case-sensitive)
                    idx = [c.lower().strip() for c in df.columns].index(coluna_real)
                    mapeamento[campo_esperado] = df.columns[idx]
                    break
        
        return mapeamento
    
    def validar_colunas_obrigatorias(self, mapeamento: Dict[str, str]) -> bool:
        """
        Valida se todas as colunas obrigatórias foram mapeadas
        
        Args:
            mapeamento: Dicionário de mapeamento de colunas
        
        Returns:
            True se válido, False caso contrário
        """
        obrigatorias = ['titulo']  # Apenas título é obrigatório
        
        faltando = [campo for campo in obrigatorias if campo not in mapeamento]
        
        if faltando:
            self.erros.append(f"Colunas obrigatórias não encontradas: {', '.join(faltando)}")
            return False
        
        return True
    
    def normalizar_prioridade(self, valor: Any) -> str:
        """Normaliza valor de prioridade para formato padrão"""
        if pd.isna(valor):
            return 'normal'
        
        valor_str = str(valor).lower().strip()
        
        for prioridade_padrao, variacoes in self.PRIORIDADES_VALIDAS.items():
            if valor_str in variacoes:
                return prioridade_padrao
        
        self.avisos.append(f"Prioridade desconhecida '{valor}', usando 'normal'")
        return 'normal'
    
    def normalizar_status(self, valor: Any) -> str:
        """Normaliza valor de status para formato padrão"""
        if pd.isna(valor):
            return 'pendente'
        
        valor_str = str(valor).lower().strip()
        
        for status_padrao, variacoes in self.STATUS_VALIDOS.items():
            if valor_str in variacoes:
                return status_padrao
        
        self.avisos.append(f"Status desconhecido '{valor}', usando 'pendente'")
        return 'pendente'
    
    def normalizar_data(self, valor: Any) -> Optional[str]:
        """
        Normaliza data para formato YYYY-MM-DD
        
        Args:
            valor: Valor da data (string, datetime, timestamp)
        
        Returns:
            String no formato YYYY-MM-DD ou None se inválido
        """
        if pd.isna(valor):
            return None
        
        try:
            # Se já for datetime
            if isinstance(valor, datetime):
                return valor.strftime('%Y-%m-%d')
            
            # Se for timestamp do pandas
            if isinstance(valor, pd.Timestamp):
                return valor.strftime('%Y-%m-%d')
            
            # Tenta converter string para datetime
            if isinstance(valor, str):
                # Tenta vários formatos comuns
                formatos = [
                    '%d/%m/%Y', '%d-%m-%Y',
                    '%Y-%m-%d', '%Y/%m/%d',
                    '%d/%m/%y', '%d-%m-%y'
                ]
                
                for formato in formatos:
                    try:
                        dt = datetime.strptime(valor.strip(), formato)
                        return dt.strftime('%Y-%m-%d')
                    except ValueError:
                        continue
            
            # Se nada funcionou, tenta parser genérico do pandas
            dt = pd.to_datetime(valor)
            return dt.strftime('%Y-%m-%d')
        
        except Exception as e:
            self.avisos.append(f"Data inválida '{valor}', será ignorada")
            return None
    
    def processar_linha(self, linha: pd.Series, mapeamento: Dict[str, str], 
                       numero_linha: int) -> Optional[Dict]:
        """
        Processa uma linha do DataFrame e retorna dict com dados validados
        
        Args:
            linha: Série do pandas representando uma linha
            mapeamento: Mapeamento de colunas
            numero_linha: Número da linha para relatório de erros
        
        Returns:
            Dict com dados validados ou None se linha inválida
        """
        self.linhas_processadas += 1
        dados = {}
        erros_linha = []
        
        # Título (obrigatório)
        if 'titulo' in mapeamento:
            titulo = linha[mapeamento['titulo']]
            if pd.isna(titulo) or str(titulo).strip() == '':
                erros_linha.append(f"Linha {numero_linha}: Título vazio")
                self.linhas_invalidas += 1
                return None
            dados['titulo'] = str(titulo).strip()
        
        # Descrição (opcional)
        if 'descricao' in mapeamento:
            descricao = linha[mapeamento['descricao']]
            dados['descricao'] = str(descricao).strip() if not pd.isna(descricao) else ''
        else:
            dados['descricao'] = ''
        
        # Cliente (opcional)
        if 'cliente' in mapeamento:
            cliente = linha[mapeamento['cliente']]
            dados['cliente'] = str(cliente).strip() if not pd.isna(cliente) else ''
        else:
            dados['cliente'] = ''
        
        # Prazo (opcional)
        if 'prazo' in mapeamento:
            prazo = linha[mapeamento['prazo']]
            dados['prazo'] = self.normalizar_data(prazo)
        else:
            dados['prazo'] = None
        
        # Prioridade (opcional, padrão: normal)
        if 'prioridade' in mapeamento:
            prioridade = linha[mapeamento['prioridade']]
            dados['prioridade'] = self.normalizar_prioridade(prioridade)
        else:
            dados['prioridade'] = 'normal'
        
        # Status (opcional, padrão: pendente)
        if 'status' in mapeamento:
            status = linha[mapeamento['status']]
            dados['status'] = self.normalizar_status(status)
        else:
            dados['status'] = 'pendente'
        
        # Responsável (opcional, será atribuído depois)
        if 'responsavel' in mapeamento:
            responsavel = linha[mapeamento['responsavel']]
            dados['responsavel_nome'] = str(responsavel).strip() if not pd.isna(responsavel) else None
        else:
            dados['responsavel_nome'] = None
        
        if erros_linha:
            self.erros.extend(erros_linha)
            return None
        
        self.linhas_validas += 1
        return dados
    
    def importar(self, arquivo_bytes: bytes, nome_arquivo: str) -> Tuple[List[Dict], Dict]:
        """
        Importa demandas de arquivo Excel/CSV
        
        Args:
            arquivo_bytes: Conteúdo do arquivo em bytes
            nome_arquivo: Nome do arquivo
        
        Returns:
            Tupla (lista_demandas_validadas, relatorio)
        """
        self.erros = []
        self.avisos = []
        self.linhas_processadas = 0
        self.linhas_validas = 0
        self.linhas_invalidas = 0
        
        try:
            # 1. Ler arquivo
            df = self.ler_arquivo(arquivo_bytes, nome_arquivo)
            
            # 2. Mapear colunas
            mapeamento = self.mapear_colunas(df)
            
            # 3. Validar colunas obrigatórias
            if not self.validar_colunas_obrigatorias(mapeamento):
                return [], self._gerar_relatorio(sucesso=False)
            
            # 4. Processar linhas
            demandas = []
            numero_linha = 2  # Começa em 2 porque linha 1 é o header
            for idx, linha in df.iterrows():
                dados = self.processar_linha(linha, mapeamento, numero_linha)
                if dados:
                    demandas.append(dados)
                numero_linha += 1
            
            # 5. Gerar relatório
            relatorio = self._gerar_relatorio(sucesso=True, total_demandas=len(demandas))
            
            return demandas, relatorio
        
        except Exception as e:
            self.erros.append(str(e))
            return [], self._gerar_relatorio(sucesso=False)
    
    def _gerar_relatorio(self, sucesso: bool, total_demandas: int = 0) -> Dict:
        """Gera relatório de importação"""
        return {
            'sucesso': sucesso,
            'total_linhas': self.linhas_processadas,
            'linhas_validas': self.linhas_validas,
            'linhas_invalidas': self.linhas_invalidas,
            'total_demandas': total_demandas,
            'erros': self.erros,
            'avisos': self.avisos
        }


def processar_importacao(arquivo_bytes: bytes, nome_arquivo: str) -> Tuple[List[Dict], Dict]:
    """
    Função helper para processar importação
    
    Args:
        arquivo_bytes: Conteúdo do arquivo
        nome_arquivo: Nome do arquivo
    
    Returns:
        Tupla (demandas, relatório)
    """
    importador = ImportadorDemandas()
    return importador.importar(arquivo_bytes, nome_arquivo)
