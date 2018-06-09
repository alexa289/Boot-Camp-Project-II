import datetime as dt
import numpy as np
import pandas as pd
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import matplotlib
matplotlib.use('nbagg')
from matplotlib import style
style.use('fivethirtyeight')
import matplotlib.pyplot as plt


from flask import Flask, render_template, jsonify, redirect, request

# from flask_pymongo import PyMongo
import pymongo
import os 
 

app= Flask(__name__)

# MongoDB Local Machine 
# conn = "mongodb://localhost:27017"
# client = pymongo.MongoClient(conn)
# db = client.wine_store_db
# collection = db.items

#MongoDB Server on Heroku 
mongo_connect_string = 'mongodb://heroku_89070zm5:vsvftlk81u1jbu8aaq0kf5se8l@ds151840.mlab.com:51840/heroku_89070zm5'
client2 = pymongo.MongoClient(mongo_connect_string)

# mongodb://heroku_89070zm5:vsvftlk81u1jbu8aaq0kf5se8l@ds151840.mlab.com:51840/heroku_89070zm5
# mongo_connect_string = os.environ.get('MONGODB_URI', '') or "localhost:27017"
# client2 = pymongo.MongoClient(mongo_connect_string)

# db2 = client2['wine_store_db']
db2 = client2['heroku_89070zm5']
collection2 = db2.items

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/wine-r&d")
def reviews():
    return render_template("ds-index.html")


@app.route("/summary")
def summary():
    return render_template("d3-index.html")

@app.route("/data")
def data():
    return render_template("chart-index.html")

@app.route("/countries")
def country():
    engine = create_engine("sqlite:///wine.sqlite")

    Base = automap_base()
    Base.prepare(engine, reflect = True)

    session=Session(engine)
    winebase=Base.classes.wine
    wine_func = [winebase.country,
            func.avg(winebase.points),
            func.avg(winebase.price)]
    wine_avg=session.query(*wine_func).group_by(winebase.country).order_by(winebase.country).all()
    return jsonify(wine_avg)
    # df=pd.DataFrame(wine_avg, columns=["Country","Avg_points","Avg_price"])
    # df.set_index("Country",inplace=True)
    # df.plot.bar()
    # plt.tight_layout()
    # plt.show()           


@app.route("/<price>")
def search_price(price):
    engine = create_engine("sqlite:///wine.sqlite")

    Base = automap_base()
    Base.prepare(engine, reflect = True)

    session=Session(engine)
    winebase=Base.classes.wine
    wine_func = [winebase.country,winebase.points,winebase.price]
    wine_avg=session.query(*wine_func).all()
    
    for w in wine_avg:
        wine_p=w.price
        #print(wine_p)

        if wine_p == price:
            return jsonify(wine_avg)
    return jsonify("No match")
    # df=pd.DataFrame(wine_avg, columns=["Country","Avg_points","Avg_price"])
    # df.set_index("Country",inplace=True)
    # df.plot.bar()
    # plt.tight_layout()
    # plt.show()      


# @app.route("/finder")
# def finder():
#     winelist = list(db.items.find().sort('title', pymongo.ASCENDING))
#     print(winelist)
#     return render_template("ws-index.html", winelist=winelist)

@app.route("/finder", methods=["GET", "POST"])
def finder():
   if request.method == "POST":
       name = request.form["wineName"]
       winelist = list(db2.items.find({'title': {'$regex': '' + name + ''}}))
    
       print(winelist)

       # winelist = list(db.items.find({'title': {'$regex': ''+ name +''}}))
       # return redirect("http://localhost:5000/", code=302)
       return render_template("ws-index.html", winelist=winelist)

   if request.method == "GET":
    #    winelist = list(db2.items.find().sort(
    #        'title', pymongo.ASCENDING).limit(10))
       return render_template("ws-index.html")

    #    return render_template("ws-index.html", winelist=winelist)

   return render_template("ws-index.html", winelist=winelist)

@app.route("/d3")
def graph1():
    return render_template("d3-index.html")

@app.route("/avg")
def average():
    return render_template("avg-index.html")

@app.route("/top12countries")
def top12countries():
    return render_template("topc-index.html")

@app.route("/top12varieties")
def top12varieties():
    return render_template("topv-index.html")

@app.route("/map")
def map():
    return render_template("map-index.html")
    
@app.route("/pycharts")
def charts():
    return render_template("py-index.html")


@app.route("/pycharts2")
def correlation():
    return render_template("py2-index.html")
    
if __name__ == "__main__":
    app.run(debug=True)
