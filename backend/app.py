from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import sqlite3
import json
from impressao_ci import imprimir_ci
from iscas import localiza_iscas


app = Flask(__name__, template_folder='templates', static_folder='static')

DATABASE = 'bd_norte.db'

@app.route('/')
def index():
    return render_template('index.html')

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    return response

@app.route('/<path:path>', methods=['OPTIONS'])
def options_handler(path):
    response = jsonify({})
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    return response

@app.route('/report_iscas', methods=['GET', 'POST'])
def report_iscas():
    return jsonify(localiza_iscas())

@app.route('/comunicacoes', methods=['GET'])
def get_comunicacoes():
    conn = get_db_connection()
    comunicacoes = conn.execute('SELECT * FROM comunicacao_interna ORDER BY ci_num DESC').fetchall()
    conn.close()
    return jsonify([dict(row) for row in comunicacoes])

@app.route('/print_comunicacao', methods=['POST'])
def print_comunicacao():
    data = request.get_json()
    if not data or 'ci_num' not in data:
        return jsonify({'error': 'ci_num is required'}), 400
    ci_num = data['ci_num']
    conn = get_db_connection()
    comunicacao = conn.execute('SELECT * FROM comunicacao_interna WHERE ci_num = ?', (ci_num,)).fetchone()
    conn.close()
    if comunicacao is None:
        return jsonify({'error': 'Comunicação não encontrada'}), 404
    imprimir_ci(dict(comunicacao))
    return jsonify(dict(comunicacao))

@app.route('/comunicacao/<int:ci_num>', methods=['GET'])
def get_comunicacao(ci_num):
    conn = get_db_connection()
    comunicacao = conn.execute('SELECT * FROM comunicacao_interna WHERE ci_num = ?', (ci_num,)).fetchone()
    conn.close()
    if comunicacao is None:
        return jsonify({'error': 'Comunicação não encontrada'}), 404
    return jsonify(dict(comunicacao))

@app.route('/comunicacao', methods=['POST'])
def create_comunicacao():
    data = request.get_json()
    destinatario = data.get('destinatario')
    manifesto_numero = data.get('manifesto_numero')
    motorista = data.get('motorista')
    valor_frete = data.get('valor_frete')
    percurso = data.get('percurso')
    data_comunicacao = data.get('data')
    observacao = data.get('observacao')
    isca_1 = data.get('isca_1')
    isca_2 = data.get('isca_2')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''INSERT INTO comunicacao_interna 
                      (destinatario, manifesto_numero, motorista, valor_frete, percurso, data, observacao, isca_1, isca_2) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                   (destinatario, manifesto_numero, motorista, valor_frete, percurso, data_comunicacao, observacao, isca_1, isca_2))

    comunicacao_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return jsonify({'status': 'Comunicação criada com sucesso'}), 201

@app.route('/comunicacao/<int:ci_num>', methods=['PUT'])
def update_comunicacao(ci_num):
    data = request.get_json()
    destinatario = data['destinatario']
    manifesto_numero = data['manifesto_numero']
    motorista = data['motorista']
    valor_frete = data['valor_frete']
    percurso = data['percurso']
    data_comunicacao = data['data']
    observacao = data['observacao']
    isca_1 = data['isca_1']
    isca_2 = data['isca_2']

    conn = get_db_connection()
    conn.execute('UPDATE comunicacao_interna SET destinatario = ?, manifesto_numero = ?, motorista = ?, valor_frete = ?, percurso = ?, data = ?, observacao = ?, isca_1 = ?, isca_2 = ? WHERE ci_num = ?',
                 (destinatario, manifesto_numero, motorista, valor_frete, percurso, data_comunicacao, observacao, isca_1, isca_2, ci_num))
    conn.commit()
    conn.close()
    return jsonify({'status': 'Comunicação atualizada com sucesso'})

@app.route('/comunicacao/<int:ci_num>', methods=['DELETE'])
def delete_comunicacao(ci_num):
    conn = get_db_connection()
    conn.execute('DELETE FROM comunicacao_interna WHERE ci_num = ?', (ci_num,))
    conn.commit()
    conn.close()
    return jsonify({'status': 'Comunicação deletada com sucesso'})

if __name__ == '__main__':
    app.run(debug=True)
