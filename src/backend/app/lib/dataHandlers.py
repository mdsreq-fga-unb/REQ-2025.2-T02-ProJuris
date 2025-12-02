from omegaconf import DictConfig, OmegaConf as oc

import os

from typing import Literal, Any
from .dataDiscovery import getDataGranular as gdg

type Handlers = Literal[
'step',
'editor',
"client",
"expire",
"body",
'tags',
]


# coisas a serem passadas: número de passos EM INT, True/False pra pergunta "devo adicionar?" se n for True, ele SUBTRAI
def handleStep(data: DictConfig, payload: dict[str, Any]) -> bool:
    steps: int = payload.get('steps', 1)
    add: bool = payload.get('add', True)
 
    MAX_STEP = 3
    MIN_STEP = 0

    currentStep = data.get('step', 0) if data.get('step') is not None else 0

    target_step = currentStep + steps if add else currentStep - steps

    if MIN_STEP <= target_step <= MAX_STEP:
        data.step = target_step
        return True

    print(f"ERROR Step {target_step} is out of bounds ({MIN_STEP}-{MAX_STEP}).")
    return False


# coisas a serem passadas: novo nome do editor para ser editado
def handleDescEditor(data: DictConfig, payload: dict[str, Any]) -> bool:
    newEditor: str | None = payload.get('editor')

    desc: DictConfig = data.get('description')

    if not newEditor:
        print("Error: Must pass a new editor.")
        return False

    if not desc:
        data.description = {}
        desc: DictConfig = data.get('description')

    desc.editor = newEditor
    return True


# coisas a serem passadas: nome do cliente novo
def handleDescClient(data: DictConfig, payload: dict[str, Any]) -> bool:
    newClient: str | None = payload.get('client')
    desc: DictConfig = data.get('description')

    if not newClient:
        print("ERROR: must pass a new editor.")
        return False

    if not desc:
        data.description = {}
        desc: DictConfig = data.get('description')

    desc.client = newClient
    return True


# coisas a serem passadas: o conteúdo a ser adicionado, a localização do body, só temos description por enquanto,
# mas se aumentar é só colocar outro elif
def handleBody(data: DictConfig, payload: dict[str, Any]) -> bool:
    content = payload.get('body')
    placing = payload.get('bodyLocation', 'root')

    if not content:
        print("ERROR: no content passed")
        return False

    if placing == 'description':
        if 'description' not in data or data.description is None:
            data.description = {}
        desc: DictConfig = data.get('description')
        desc.body = content
        return True

    data.body = content
    return True


# coisas a serem passadas: uma lista de strings de tags novas
def handleTags(data: DictConfig, payload: dict[str, Any]) -> bool:
    newTags: list[str] | None = payload.get('tags')

    if not newTags:
        print('Error: must pass a list of tags.')
        return False

    if not data.get('tags'):
        data.tags = newTags
        return True

    data.tags.extend(newTags)
    return True


# coisas a serem passadas: uma string única que indica a data que o processo vai expirar
def handleExpire(data: DictConfig, payload: dict[str, Any]) -> bool:
    newDate: str | None = payload.get('expire_date')
    if not newDate:
        print("ERROR: must pass a new expiration date to be handled.")
        return False

    data.expiration = newDate
    return True


# front end passa: iterador (número do kanban específico)
# lista de arquivos do usuário específico
# caminho absoluto para os dados do kanban

# handlers a serem tratados
# chaves requisitadas pelos handlers pedidos
# dados são tratados para as novas versões deles, caso não existam, passam a existir
#
# EXISTEM 2 FORMAS DE PASSAR O PAYLOAD:
# MANUAL:
# 1: (..., "argumento"="variável", "argumento2"="variável2", ...)
#
# OU (modo bom)
#
# 2: dados={
#           'argumento1': 'variável1',
#           'argumento2': 'variável2',
#            ...
#            }
# (actions, iterator, userFiles, path, **dados)
def transformHandler(
    actions: list[Handlers],
    iterator: int,
    userFiles: list[str],

    path: str,

    **payload
) -> bool:

    dataList = gdg(path, userFiles, iterator)
    if dataList:
        data: DictConfig = dataList[0]
    else:
        print("No data parsed")
        return False


    if not data:
        print("Could not load data")
        return False

    changes = False

    for action in actions:
        print(f"Handling {action} in {path}")

        match action:
            case 'step':
                if handleStep(data, payload):
                    changes = True

            case 'editor':
                if handleDescEditor(data, payload):
                    changes = True

            case 'client':
                if handleDescClient(data, payload):
                    changes = True

            case 'body':
                if handleBody(data, payload):
                    changes = True

            case 'tags':
                if handleTags(data, payload):
                    changes = True

            case 'expire':
                if handleExpire(data, payload):
                    changes = True

            case _:
                print(f"Invalid handler: {action}")
                continue

    if changes:
        try:
            target = userFiles[iterator]
            fullPath = os.path.join(path, target)
            oc.save(data, fullPath)
        except Exception as e:
            print(f'Unexpected error: {e}')
        return True

    print("No changes made.")
    return False
