from workers.TaskWorker import TaskWorker
from flask import request, jsonify
from jwt import decode
import os

SECRET_KEY = open("secret.key", "r").read().strip()

class TaskController():
    def __init__(self):
        self.taskWorker = TaskWorker()

    def getAll(self):
        try:
            tarefas = self.taskWorker.getAll()
        except:
            return jsonify({"error": "Falha ao tentar recuperar tarefas"}), 500

        if len(tarefas) == 0:
            return jsonify({"message": "Nenhuma tarefa adicionada"}), 204

        return jsonify({"tarefas": tarefas}), 200

    def create(self):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Token não fornecido"}), 401

        try:
            payload = decode(token, SECRET_KEY, algorithms=["HS256"])
            usuario_id = payload["id"]
        except:
            return jsonify({"error": "Token inválido"}), 401

        data = request.get_json()
        if not data:
            return jsonify({"error": "Nenhum dado informado"}), 400

        for campo in ["titulo", "descricao", "categoria"]:
            if not data.get(campo):
                return jsonify({"error": f"{campo.capitalize()} não informado"}), 400

        try:
            tarefa = {
                "titulo": data["titulo"].strip(),
                "descricao": data["descricao"].strip(),
                "categoria": data["categoria"].strip(),
                "status": data.get("status", "pendente"),
                "prazo": data.get("prazo")
            }
        except:
            return jsonify({"error": "Dados inválidos"}), 400

        self.taskWorker.create(tarefa, usuario_id)

        return jsonify({"message": "Tarefa adicionada com sucesso"}), 201

    def details(self, id: int):
        if id <= 0:
            return jsonify({"error": "id inválido"}), 400

        try:
            tarefa = self.taskWorker.getById(id)
        except:
            return jsonify({"error": "falha ao consultar tarefa"}), 404

        if not tarefa:
            return jsonify({"error": "Tarefa não encontrada"}), 404

        return jsonify({"tarefa": tarefa}), 200

    def update(self, id: int):
        data = request.get_json()
        if not data:
            return jsonify({"error": "Nenhum dado informado"}), 400

        for campo in ["titulo", "descricao", "categoria"]:
            if not data.get(campo):
                return jsonify({"error": f"{campo.capitalize()} não informado"}), 400

        try:
            tarefa = {
                "titulo": data["titulo"].strip(),
                "descricao": data["descricao"].strip(),
                "categoria": data["categoria"].strip(),
                "status": data.get("status", "pendente"),
                "prazo": data.get("prazo")
            }
        except:
            return jsonify({"error": "Dados inválidos"}), 400

        try:
            self.taskWorker.update(id, tarefa)
        except:
            return jsonify({"error": "Falha ao tentar atualizar a tarefa"}), 500

        return jsonify({"message": "Tarefa atualizada com sucesso"}), 200

    def delete(self, id: int):
        if id <= 0:
            return jsonify({"error": "id inválido"}), 400

        try:
            self.taskWorker.delete(id)
        except:
            return jsonify({"error": "Falha ao remover tarefa"}), 500

        return jsonify({"message": "Tarefa removida com sucesso"}), 200
