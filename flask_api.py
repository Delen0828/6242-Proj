# import flask
from flask import Flask, jsonify
from flask_cors import CORS
from algo import UCB_sim

app = Flask(__name__)
CORS(app)
@app.route('/run',methods=['GET'])
def run():
    # data = request.json
	# result = "hello"
    result = UCB_sim()
    return jsonify(result=result)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5001)
