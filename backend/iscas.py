import sqlite3

def consultar_isca_percurso(isca):
    # print('*************************************************************************************************************')
    # print(isca)

    conn = sqlite3.connect('bd_norte.db')  # Substitua por nome real do arquivo do banco de dados
    cursor = conn.cursor()
    # Consulta para obter a última data e percurso da isca especificada
    sql = """
            SELECT manifesto_numero,percurso, data
            FROM comunicacao_interna
            WHERE isca_1 = ? OR isca_2 = ?
            ORDER BY manifesto_numero DESC
          """

    cursor.execute(sql, (isca, isca))  # Passando a isca como parâmetro
    resultado = cursor.fetchall()

    
    # print(resultado)
    # print('*************************************************************************************************************')

    return resultado
    # # Processando os resultados da consulta
    # if resultado:
    #     # Convertendo a data para formato legível
    #     ultima_data_formatada = resultado[0][1].strftime("%Y-%m-%d")
    #     percurso = resultado[0][0]

    #     print(f"Isca: {isca}")
    #     print(f"Última Data de Uso: {ultima_data_formatada}")
    #     print(f"Percurso: {percurso}")
    # else:
    #     print(f"Isca {isca} não encontrada.") 

def data_sort_key(item):
    return item.get('data', None)  # Retorna None se 'data' não existir



def localiza_iscas():
    dict_iscas = []
    iscas = [
        16050806, 16201616, 16202962, 16205374, 16216529, 16216955, 16400103, 16400104,
        16401541, 16401627, 16405259, 16405263, 16405265, 16405266, 16405268, 16405269,
        16405270, 16405271, 16405273, 16405292, 16405293, 16405294, 16405296, 16405297,
        16405298, 16405299, 16405300, 16405301, 16405302, 16405304, 16405305, 16405306,
        16405307, 16405309, 16405310, 16405311, 16405363, 16405365, 16405366, 16405368,
        16405369, 16405370, 16405371, 16405382, 16405383, 16405384, 16405385, 16405386,
        16405387, 16405388, 16405389, 16405390, 16405391, 16405518, 16405523, 16405526,
        16405584, 16405589, 16405632, 16405633, 16405642, 16405659, 16405660, 16405671,
        16405675, 16406390, 16407040, 16407069, 16408014
    ]

    for isca in iscas:
        registro = consultar_isca_percurso(isca)
        if registro and len(registro) > 0 and len(registro[0]) == 3:
            dict_iscas.append({
                'id': isca,
                'manifesto': registro[0][0] if registro[0][0] is not None else "Sem Informação",
                'percurso': registro[0][1] if registro[0][1] is not None else "Sem Informação",
                'data': registro[0][2] if registro[0][2] is not None else "Sem Informação"
            })

    return dict_iscas

