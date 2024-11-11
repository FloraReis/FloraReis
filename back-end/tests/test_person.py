def test_create_person(client):
    
    response = client.post('/api/person', json={
        "full_name": "João Silva",
        "email": "joao@example.com",
        "cpf": "123.456.789-00",
        "phone": "11987654321",
        "birth_date": "1990-01-01",
        "realm": "C",
        "address": {
            "logradouro": "Rua Exemplo",
            "bairro": "Centro",
            "cidade": "São Paulo",
            "estado": "SP",
            "cep": "12345000",
            "numero": "123",
            "complemento": "Apto 1"
        }
    })
    assert response.status_code == 201
    data = response.get_json()
    assert data['data']['full_name'] == "João Silva"
    assert data['data']['email'] == "joao@example.com"
