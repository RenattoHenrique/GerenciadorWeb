from repositories.BaseRepository import BaseRepository

class TaskRepository(BaseRepository):

    def __init__(self):
        super().__init__()

    def getAll(self):
        query = "SELECT id, titulo, descricao, categoria, status, prazo FROM tarefas"
        return self.executeQuery(query, ())

    def create(self, tarefa, usuario_id: int):
        query = """
        INSERT INTO tarefas (titulo, descricao, categoria, status, prazo, id_usuario)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        values = (
            tarefa["titulo"],
            tarefa["descricao"],
            tarefa["categoria"],
            tarefa.get("status", "pendente"),
            tarefa.get("prazo", None),
            usuario_id
        )
        self.execute(query, values)

    def getById(self, id: int):
        query = "SELECT * FROM tarefas WHERE id = %s"
        result = self.executeQuery(query, (id,))
        return result[0] if result else {}

    def update(self, id: int, tarefa):
        query = """
        UPDATE tarefas SET titulo = %s, descricao = %s, categoria = %s, status = %s, prazo = %s
        WHERE id = %s
        """
        values = (
            tarefa["titulo"],
            tarefa["descricao"],
            tarefa["categoria"],
            tarefa.get("status", "pendente"),
            tarefa.get("prazo", None),
            id
        )
        self.execute(query, values)

    def delete(self, id: int):
        query = "DELETE FROM tarefas WHERE id = %s"
        self.execute(query, (id,))
