from repositories.BaseRepository import BaseRepository

class UserRepository(BaseRepository):
    def __init__(self):
        super().__init__()

    def create(self, user):
        query = "INSERT INTO usuarios (nome, email, senha) VALUES (%s, %s, %s)"
        values = (user["nome"], user["email"], user["senha"])
        self.execute(query, values)

    def getUsuarioPelosDados(self, email: str, senha: str):
        query = "SELECT * FROM usuarios WHERE email = %s AND senha = %s"
        result = self.executeQuery(query, (email, senha))
        return result[0] if result else None

    def getTaskByUserId(self, id: int):
        query = """
        SELECT id, titulo, descricao, categoria, status, prazo
        FROM tarefas
        WHERE id_usuario = %s
        """
        return self.executeQuery(query, (id,))
    
    def atualizarUsuario(self, id: int, nome: str, senha: str):
        if senha:
            query = "UPDATE usuarios SET nome = %s, senha = %s WHERE id = %s"
            values = (nome, senha, id)
        else:
            query = "UPDATE usuarios SET nome = %s WHERE id = %s"
            values = (nome, id)
        self.execute(query, values)
