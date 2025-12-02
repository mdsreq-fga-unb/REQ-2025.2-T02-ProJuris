from omegaconf import OmegaConf as oc
from omegaconf import DictConfig
from rich.table import Table
from rich.panel import Panel
from rich.console import Console

import os

console = Console()

# ------------ MÓDULO DE DATA DISCOVERY. RETORNA UMA LISTA DE DictConfig CARREGADO PELO OMEGACONF. ----------

# ---------------- DESCOBERTA DE ARQUIVOS RELEVANTES ----------------------
def pathDiscovery(path: str) -> tuple[str, list[str] | None, Table]:
    console = Console()
    table = Table(show_lines=True)
    table.add_column(f"Relevant files found in {path}")

    fileType="json"

    try:
        entries = os.listdir(path)
    except FileNotFoundError:
        console.print(f"[bold red]ERROR:[/] directory not found.")
        return path, None, table
    print(entries)
    if entries:
        filteredFiles = [e for e in entries if os.path.isfile(os.path.join(path, e)) and e.endswith(f".{fileType}")]
    else:
        filteredFiles = None

    if filteredFiles:
        for l in filteredFiles:
            table.add_row(f"{l.replace('.yml', '')}")
    return path, filteredFiles, table
# ---------------- DESCOBERTA DE ARQUIVOS RELEVANTES ----------------------

# ---------------- DESCOBERTA DE DADOS -- OS DADOS DEVEM SER EM FORMATO DE DICT. -- ------------------

def getData(path: str, userFiles: list[str]) -> list[DictConfig] | None:
    path, filteredFiles, table = pathDiscovery(path)

    console.print(Panel(table, expand=False, border_style="green"))

    if not userFiles:
        return None

    if not filteredFiles:
        return None

    files: list[DictConfig] = []

    for filename in userFiles:
        if filename in filteredFiles:
            full_path = os.path.join(path, filename)
            try:
                loaded_data = oc.load(full_path)
                if isinstance(loaded_data, DictConfig):
                    files.append(loaded_data)
                else:
                    console.print(f"[bold red]ERROR:[/] Data is not a OmegaConf dict: {full_path}")
            except Exception as e:
                console.print(f"[bold red]ERROR:[/] Could not read {filename}: {e}")
        else:
            console.print(f"[bold yellow]WARNING:[/] File {filename} not found inside {path}")

    return files if files else None


# ISSO AQUI FAZ O SEGUINTE:
# front end passa: caminho absoluto (/home/sla/caminho/projeto/backend/app/dados) da _pasta de arquivos_ de dados de kanban
# front end passa: _LISTA DE ARQUIVOS REFERENTES AO USUÁRIO_
# front end passa: número específico do indice do kanban desejado
# back end RECEBE: lista com apenas 1 ÚNICO dicionário para fazer handling de outras coisas do kanban
def getDataGranular(path: str, userFiles: list[str], iterator: int) -> list[DictConfig] | None:
    if not userFiles or iterator < 0 or iterator >= len(userFiles):
        console.print(f"[bold red]ERROR:[/] {iterator} index is out of bounds.")
        return None

    targetFilename = userFiles[iterator]
    fullPath = os.path.join(path, targetFilename)

    try:
        if not os.path.exists(fullPath):
            console.print(f"[bold red]ERROR:[/] File not found in: {fullPath}")
            return None

        data = oc.load(fullPath)

        if isinstance(data, DictConfig):
            return [data]
        else:
            console.print(f"[bold red]ERROR:[/] the file {targetFilename} is not a DictConfig.")
            return None

    except Exception as e:
        print(f"[bold red]CRITICAL:[/] error processing file {targetFilename}: {e}")
        return None
# ---------------- DESCOBERTA DE DADOS -- OS DADOS DEVEM SER EM FORMATO DE DICT. -- ------------------

# ------------ MÓDULO DE DATA DISCOVERY. RETORNA UMA LISTA DE DictConfig CARREGADO PELO OMEGACONF. ----------
