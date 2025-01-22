import sys
import os

# Adiciona o diretório do projeto ao caminho de módulos
sys.path.insert(0, '/home/edson/Documentos/comunicacaoInterna')

# Se estiver usando um ambiente virtual, ative-o
activate_this = '/home/edson/Documentos/comunicacaoInterna/venv/bin/activate_this.py'
exec(open(activate_this).read(), {'__file__': activate_this})

# Agora importe o aplicativo Flask
from app import app as application  # Ajuste se seu app for importado de um local diferente
