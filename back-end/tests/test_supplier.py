def test_get_product(client):
    
    supplier_response = client.post('/api/supplier', json={
        "email": "supplier@example.com",
        "company_name": "Supplier Company",
        "type_company": "Wholesale",
        "cnpj_cpf": "12.345.678/0001-00",
        "contact": "Contato",
        "contact_type": "Email",
        "address": {
            "logradouro": "Rua Fornecedor",
            "bairro": "Bairro",
            "cidade": "Cidade",
            "estado": "ST",
            "cep": "12345000",
            "numero": "123"
        }
    })
    
    if supplier_response.status_code != 201:
        print("Erro na criação do fornecedor:", supplier_response.json)
    assert supplier_response.status_code == 201
