from repositories.UserRepository import UserRepository

class UserWorker():
    def __init__(self):
        self.userRepository = UserRepository()

    def create(self, user):
        return self.userRepository.create(user)

    def getTaskByUserId(self, id: int):
        return self.userRepository.getTaskByUserId(id)

    def getUsuarioPelosDados(self, email: str, senha: str):
        return self.userRepository.getUsuarioPelosDados(email, senha)
    
    def atualizarUsuario(self, id: int, nome: str, senha: str):
        return self.userRepository.atualizarUsuario(id, nome, senha)


