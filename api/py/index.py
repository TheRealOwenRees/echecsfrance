from flask import Flask
app = Flask(__name__)

@app.route("/api/py/hello")
def hello_world():
    return "<p>Hello, World!</p>"
