from workers.UserWorker import UserWorker
from flask import request, jsonify
from jwt import encode

SECRET_KEY = open("secret.key", "r").read().strip()

class UserController():
    def __init__(self):
        self.userWorker = UserWorker()

    def gerar_token(self, usuario):
        payload = {
            "id": usuario["id"],
            "email": usuario["email"]
        }
        token = encode(payload, SECRET_KEY, algorithm="HS256")
        return token

    def login(self, email: str, senha: str):
        usuario = self.userWorker.getUsuarioPelosDados(email, senha)
        if not usuario:
            return None
        return usuario

    def create(self):
        data = request.get_json()
        if not data:
            return jsonify({"error": "Nenhum dado informado"}), 400

        for campo in ["nome", "email", "senha"]:
            if not data.get(campo):
                return jsonify({"error": f"{campo.capitalize()} não informado"}), 400

        usuario = {
            "nome": data["nome"],
            "email": data["email"],
            "senha": data["senha"]
        }

        try:
            inserido = self.userWorker.create(usuario)
            if inserido == {}:
                return jsonify({"error": "E-mail já cadastrado."}), 400
            return jsonify({"message": "Cadastro realizado com sucesso"}), 201
        except Exception as e:
            return jsonify({"error": f"Erro ao cadastrar: {str(e)}"}), 500

    def atualizarUsuario(self, id: int, nome: str, senha: str):
        return self.userWorker.atualizarUsuario(id, nome, senha)


