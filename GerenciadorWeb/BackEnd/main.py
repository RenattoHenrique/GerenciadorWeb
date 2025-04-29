from flask import Flask, jsonify, request
from flask_cors import CORS
from jwt import encode, decode
from controllers.TaskController import TaskController
from controllers.UserController import UserController

api = Flask(__name__)
CORS(api, resources={r"/*": {"origins": "*"}})

SECRET_KEY = open("secret.key", "r").read().strip()

taskController = TaskController()
userController = UserController()

from functools import wraps

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"message": "Token não fornecido"}), 401
        try:
            decode(token, SECRET_KEY, algorithms=["HS256"])
            return f(*args, **kwargs)
        except:
            return jsonify({"message": "Token inválido"}), 401
    return decorated

@api.route("/", methods=["GET"])
def index():
    return jsonify({"message": "API do Gerenciador de Tarefas ativa"}), 200

@api.route("/tarefas", methods=["GET"])
@token_required
def listarTarefas():
    token = request.headers.get("Authorization")
    payload = decode(token, SECRET_KEY, algorithms=["HS256"])
    usuario_id = payload["id"]
    tarefas = userController.userWorker.getTaskByUserId(usuario_id)
    return jsonify({"tarefas": tarefas}), 200

@api.route("/tarefas/details/<int:id>", methods=["GET"])
def tarefaDetails(id: int):
    return taskController.details(id)

@api.route("/tarefas/create", methods=["POST"])
@token_required
def adicionarTarefa():
    return taskController.create()

@api.route("/tarefas/update/<int:id>", methods=["PUT"])
@token_required
def atualizarTarefa(id: int):
    return taskController.update(id)

@api.route("/tarefas/delete/<int:id>", methods=["DELETE"])
@token_required
def deletarTarefa(id: int):
    return taskController.delete(id)

@api.route("/cadastro", methods=["POST"])
def cadastrarUsuario():
    return userController.create()

@api.route("/login", methods=["POST"])
def login():
    dados = request.json
    email = dados.get("email")
    senha = dados.get("senha")

    if not email or not senha:
        return jsonify({"message": "E-mail e senha são obrigatórios"}), 400

    usuario = userController.login(email, senha)

    if not usuario:
        return jsonify({"message": "Usuário não cadastrado."}), 404

    token = userController.gerar_token(usuario)

    return jsonify({
        "token": token,
        "usuario": {
            "id": usuario["id"],
            "email": usuario["email"],
            "nome": usuario["nome"]
        }
    }), 200

@api.route("/usuario/atualizar", methods=["PUT"])
@token_required
def atualizarUsuario():
    token = request.headers.get("Authorization")
    payload = decode(token, SECRET_KEY, algorithms=["HS256"])
    usuario_id = payload["id"]

    dados = request.get_json()
    nome = dados.get("nome")
    senha = dados.get("senha")

    if not nome:
        return jsonify({"error": "Nome é obrigatório"}), 400

    try:
        userController.atualizarUsuario(usuario_id, nome, senha)
        return jsonify({"message": "Dados atualizados com sucesso"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Get-ChildItem -Recurse -Directory -Filter '__pycache__' | Remove-Item -Recurse -Force