from repositories.TaskRepository import TaskRepository

class TaskWorker():
    def __init__(self):
        self.taskRepository = TaskRepository()

    def getAll(self):
        return self.taskRepository.getAll()

    def create(self, tarefa, usuario_id: int):
        return self.taskRepository.create(tarefa, usuario_id)

    def getById(self, id: int):
        return self.taskRepository.getById(id)

    def update(self, id: int, tarefa):
        return self.taskRepository.update(id, tarefa)

    def delete(self, id: int):
        return self.taskRepository.delete(id)
