from flask import Flask, render_template
# from flask_pymongo import PyMongo
import pymongo 

app = Flask(__name__)

# mongo = PyMongo(app)

conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)
db = client.wine_store_db
collection = db.items


@app.route("/send")
def index():
    winelist = list(db.items.find().sort('title', pymongo.ASCENDING))
    # print(winelist)
    return render_template("index.html", winelist=winelist)



if __name__ == "__main__":
    app.run(debug=True)
