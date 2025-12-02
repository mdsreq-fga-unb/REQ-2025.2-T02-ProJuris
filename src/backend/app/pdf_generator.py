"""
Módulo para geração de relatórios em PDF (RNF07)
Autor: GitHub Copilot AI Agent
Data: 01/12/2025
"""

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from datetime import datetime
import io


class RelatorioDemandasPDF:
    """
    Classe para gerar relatórios de demandas em PDF
    Suporta dois tipos: resumido e detalhado
    """
    
    def __init__(self, tipo='resumido'):
        """
        Args:
            tipo (str): 'resumido' ou 'detalhado'
        """
        self.tipo = tipo
        self.buffer = io.BytesIO()
        self.styles = getSampleStyleSheet()
        self._create_custom_styles()
    
    def _create_custom_styles(self):
        """Cria estilos personalizados para o PDF"""
        # Título principal
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=18,
            textColor=colors.HexColor('#1e40af'),
            spaceAfter=30,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        ))
        
        # Subtítulo
        self.styles.add(ParagraphStyle(
            name='CustomSubtitle',
            parent=self.styles['Heading2'],
            fontSize=14,
            textColor=colors.HexColor('#3b82f6'),
            spaceAfter=12,
            spaceBefore=12,
            fontName='Helvetica-Bold'
        ))
        
        # Metadados
        self.styles.add(ParagraphStyle(
            name='Metadata',
            parent=self.styles['Normal'],
            fontSize=9,
            textColor=colors.grey,
            alignment=TA_RIGHT
        ))
        
        # Corpo de texto
        self.styles.add(ParagraphStyle(
            name='CustomBody',
            parent=self.styles['Normal'],
            fontSize=10,
            leading=14,
            spaceAfter=8
        ))
    
    def gerar_relatorio_resumido(self, demandas, filtros=None):
        """
        Gera relatório resumido com tabela de demandas
        
        Args:
            demandas (list): Lista de demandas (dicts)
            filtros (dict): Filtros aplicados (opcional)
        
        Returns:
            bytes: Conteúdo do PDF em bytes
        """
        doc = SimpleDocTemplate(
            self.buffer,
            pagesize=A4,
            rightMargin=50,
            leftMargin=50,
            topMargin=50,
            bottomMargin=50
        )
        
        story = []
        
        # Cabeçalho
        story.append(Paragraph('Relatório Resumido de Demandas', self.styles['CustomTitle']))
        story.append(Paragraph(f'ProJuris - Sistema de Gestão', self.styles['CustomBody']))
        story.append(Spacer(1, 12))
        
        # Metadados
        data_geracao = datetime.now().strftime('%d/%m/%Y %H:%M:%S')
        story.append(Paragraph(f'Gerado em: {data_geracao}', self.styles['Metadata']))
        story.append(Spacer(1, 12))
        
        # Filtros aplicados
        if filtros:
            story.append(Paragraph('Filtros Aplicados:', self.styles['CustomSubtitle']))
            filtros_texto = '<br/>'.join([f'<b>{k.capitalize()}:</b> {v}' for k, v in filtros.items()])
            story.append(Paragraph(filtros_texto, self.styles['CustomBody']))
            story.append(Spacer(1, 12))
        
        # Estatísticas
        story.append(Paragraph('Estatísticas:', self.styles['CustomSubtitle']))
        total = len(demandas)
        concluidas = len([d for d in demandas if d.get('status') == 'concluido'])
        pendentes = total - concluidas
        
        stats_texto = f"""
        <b>Total de Demandas:</b> {total}<br/>
        <b>Concluídas:</b> {concluidas} ({concluidas/total*100:.1f}%)<br/>
        <b>Pendentes:</b> {pendentes} ({pendentes/total*100:.1f}%)
        """
        story.append(Paragraph(stats_texto, self.styles['CustomBody']))
        story.append(Spacer(1, 20))
        
        # Tabela de demandas
        story.append(Paragraph('Lista de Demandas:', self.styles['CustomSubtitle']))
        story.append(Spacer(1, 12))
        
        # Cabeçalhos da tabela
        data = [['#', 'Título', 'Status', 'Prioridade', 'Prazo', 'Responsável']]
        
        # Dados das demandas
        for demanda in demandas:
            row = [
                str(demanda.get('id', '')),
                self._truncate(demanda.get('titulo', 'Sem título'), 30),
                self._format_status(demanda.get('status', '')),
                self._format_prioridade(demanda.get('prioridade', '')),
                self._format_data(demanda.get('prazo', '')),
                self._truncate(demanda.get('responsavel', 'Não atribuído'), 20)
            ]
            data.append(row)
        
        # Criar tabela
        table = Table(data, colWidths=[0.5*inch, 2*inch, 1*inch, 1*inch, 1*inch, 1.5*inch])
        table.setStyle(TableStyle([
            # Cabeçalho
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e40af')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            
            # Corpo
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
            ('ALIGN', (0, 1), (0, -1), 'CENTER'),  # ID centralizado
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 8),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.lightgrey]),
            
            # Bordas
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 1), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
        ]))
        
        story.append(table)
        story.append(Spacer(1, 20))
        
        # Rodapé
        story.append(Paragraph(
            f'Relatório gerado automaticamente pelo ProJuris | Total: {total} demandas',
            self.styles['Metadata']
        ))
        
        # Gerar PDF
        doc.build(story)
        pdf_content = self.buffer.getvalue()
        self.buffer.close()
        return pdf_content
    
    def gerar_relatorio_detalhado(self, demandas, filtros=None):
        """
        Gera relatório detalhado com informações completas de cada demanda
        
        Args:
            demandas (list): Lista de demandas (dicts)
            filtros (dict): Filtros aplicados (opcional)
        
        Returns:
            bytes: Conteúdo do PDF em bytes
        """
        doc = SimpleDocTemplate(
            self.buffer,
            pagesize=A4,
            rightMargin=50,
            leftMargin=50,
            topMargin=50,
            bottomMargin=50
        )
        
        story = []
        
        # Cabeçalho
        story.append(Paragraph('Relatório Detalhado de Demandas', self.styles['CustomTitle']))
        story.append(Paragraph(f'ProJuris - Sistema de Gestão', self.styles['CustomBody']))
        story.append(Spacer(1, 12))
        
        # Metadados
        data_geracao = datetime.now().strftime('%d/%m/%Y %H:%M:%S')
        story.append(Paragraph(f'Gerado em: {data_geracao}', self.styles['Metadata']))
        story.append(Spacer(1, 12))
        
        # Filtros aplicados
        if filtros:
            story.append(Paragraph('Filtros Aplicados:', self.styles['CustomSubtitle']))
            filtros_texto = '<br/>'.join([f'<b>{k.capitalize()}:</b> {v}' for k, v in filtros.items()])
            story.append(Paragraph(filtros_texto, self.styles['CustomBody']))
            story.append(Spacer(1, 12))
        
        # Estatísticas
        story.append(Paragraph('Estatísticas Gerais:', self.styles['CustomSubtitle']))
        total = len(demandas)
        
        # Contar por status
        status_count = {}
        for d in demandas:
            status = d.get('status', 'indefinido')
            status_count[status] = status_count.get(status, 0) + 1
        
        # Contar por prioridade
        prioridade_count = {}
        for d in demandas:
            prioridade = d.get('prioridade', 'indefinida')
            prioridade_count[prioridade] = prioridade_count.get(prioridade, 0) + 1
        
        stats_texto = f"""
        <b>Total de Demandas:</b> {total}<br/><br/>
        <b>Por Status:</b><br/>
        {self._format_dict_stats(status_count)}<br/>
        <b>Por Prioridade:</b><br/>
        {self._format_dict_stats(prioridade_count)}
        """
        story.append(Paragraph(stats_texto, self.styles['CustomBody']))
        story.append(Spacer(1, 20))
        
        # Detalhes de cada demanda
        story.append(Paragraph('Detalhes das Demandas:', self.styles['CustomSubtitle']))
        story.append(Spacer(1, 12))
        
        for idx, demanda in enumerate(demandas, 1):
            # Cabeçalho da demanda
            demanda_titulo = f"Demanda #{demanda.get('id', idx)} - {demanda.get('titulo', 'Sem título')}"
            story.append(Paragraph(demanda_titulo, self.styles['Heading3']))
            
            # Informações em tabela
            info_data = [
                ['Campo', 'Valor'],
                ['Status', self._format_status(demanda.get('status', ''))],
                ['Prioridade', self._format_prioridade(demanda.get('prioridade', ''))],
                ['Responsável', demanda.get('responsavel', 'Não atribuído')],
                ['Cliente', demanda.get('cliente', 'Não informado')],
                ['Prazo', self._format_data(demanda.get('prazo', ''))],
                ['Data Criação', self._format_data(demanda.get('data_criacao', ''))],
                ['Última Atualização', self._format_data(demanda.get('ultima_atualizacao', ''))],
            ]
            
            info_table = Table(info_data, colWidths=[2*inch, 4*inch])
            info_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3b82f6')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 9),
                ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
                
                ('BACKGROUND', (0, 1), (0, -1), colors.lightblue),
                ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 1), (-1, -1), 8),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('TOPPADDING', (0, 0), (-1, -1), 4),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ]))
            
            story.append(info_table)
            
            # Descrição (se houver)
            if demanda.get('descricao'):
                story.append(Spacer(1, 8))
                story.append(Paragraph('<b>Descrição:</b>', self.styles['CustomBody']))
                story.append(Paragraph(demanda.get('descricao', ''), self.styles['CustomBody']))
            
            # Separador entre demandas
            if idx < len(demandas):
                story.append(Spacer(1, 20))
                story.append(Paragraph('_' * 100, self.styles['CustomBody']))
                story.append(Spacer(1, 20))
        
        # Rodapé
        story.append(PageBreak())
        story.append(Paragraph(
            f'Relatório gerado automaticamente pelo ProJuris | Total: {total} demandas',
            self.styles['Metadata']
        ))
        
        # Gerar PDF
        doc.build(story)
        pdf_content = self.buffer.getvalue()
        self.buffer.close()
        return pdf_content
    
    def _truncate(self, text, max_length):
        """Trunca texto se exceder max_length"""
        if not text:
            return ''
        return text if len(text) <= max_length else text[:max_length-3] + '...'
    
    def _format_status(self, status):
        """Formata status com primeira letra maiúscula"""
        return status.capitalize() if status else 'Indefinido'
    
    def _format_prioridade(self, prioridade):
        """Formata prioridade com primeira letra maiúscula"""
        return prioridade.capitalize() if prioridade else 'Indefinida'
    
    def _format_data(self, data):
        """Formata data para DD/MM/YYYY"""
        if not data:
            return 'Não definido'
        
        # Se já for string no formato ISO (YYYY-MM-DD)
        if isinstance(data, str):
            try:
                dt = datetime.strptime(data, '%Y-%m-%d')
                return dt.strftime('%d/%m/%Y')
            except:
                return data
        
        # Se for datetime object
        if isinstance(data, datetime):
            return data.strftime('%d/%m/%Y')
        
        return str(data)
    
    def _format_dict_stats(self, stats_dict):
        """Formata dicionário de estatísticas"""
        lines = []
        for key, value in stats_dict.items():
            lines.append(f'&nbsp;&nbsp;• {key.capitalize()}: {value}')
        return '<br/>'.join(lines)


def gerar_pdf_demandas(demandas, tipo='resumido', filtros=None):
    """
    Função helper para gerar PDF de demandas
    
    Args:
        demandas (list): Lista de demandas
        tipo (str): 'resumido' ou 'detalhado'
        filtros (dict): Filtros aplicados (opcional)
    
    Returns:
        bytes: Conteúdo do PDF em bytes
    """
    gerador = RelatorioDemandasPDF(tipo=tipo)
    
    if tipo == 'detalhado':
        return gerador.gerar_relatorio_detalhado(demandas, filtros)
    else:
        return gerador.gerar_relatorio_resumido(demandas, filtros)
