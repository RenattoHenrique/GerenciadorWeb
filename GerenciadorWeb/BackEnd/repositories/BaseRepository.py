import mysql.connector

class BaseRepository():
    def __init__(self):
        self.dataBaseHostName = "localhost"
        self.dataBasePort = "3307"
        self.dataBaseName = "gerenciador"
        self.dataBaseUser = "root"
        self.dataBasePassword = ""

    def connect(self):
        return mysql.connector.connect(
            host=self.dataBaseHostName,
            port=self.dataBasePort,
            user=self.dataBaseUser,
            database=self.dataBaseName,
            password=self.dataBasePassword
        )

    def execute(self, query: str, values: tuple):
        connection = self.connect()
        cursor = connection.cursor()
        cursor.execute(query, values)
        connection.commit()
        connection.close()


    def executeQuery(self, query: str, values: tuple):
        connection = self.connect()
        cursor = connection.cursor(dictionary=True)
        cursor.execute(query, values)
        result = cursor.fetchall()
        connection.commit()
        connection.close()
        return result
