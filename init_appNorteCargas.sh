#!/bin/bash

# Caminho para o diretório do projeto
PROJECT_DIR="/home/edson/Documentos/comunicacaoInterna"

# Caminho para o backend onde está o arquivo Flask
BACKEND_DIR="$PROJECT_DIR/backend"

# Nome do arquivo Flask (substitua por seu nome real)
FLASK_APP="app.py"

# Inclua o diretório raiz no PYTHONPATH
export PYTHONPATH=$PROJECT_DIR

# Navegue até o diretório do ambiente virtual
cd $PROJECT_DIR || exit

# Ative o ambiente virtual
source venv/bin/activate

# Navegue até a pasta do backend
cd $BACKEND_DIR || exit

# Execute o servidor Flask com parâmetros específicos
python $FLASK_APP --host=0.0.0.0 --port=5000

# Pausa para visualizar mensagens
echo "Pressione qualquer tecla para sair..."
read -n1 -s
