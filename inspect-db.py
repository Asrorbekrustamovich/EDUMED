import sqlite3
import os

db_path = 'backend/prisma/dev.db'
if not os.path.exists(db_path):
    print(f"File {db_path} does not exist!")
    # Check parent
    db_path = 'backend/dev.db'

print(f"Opening database: {db_path}")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
print([t[0] for t in cursor.fetchall()])
conn.close()
