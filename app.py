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


from flask import Flask, jsonify


 

app= Flask(__name__)

@app.route("/")
def welcome():
    return ("welcome to our wine review database!")

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
        print(wine_p)

        if wine_p == price:
            return jsonify(wine_avg)
    return jsonify("No match")
    # df=pd.DataFrame(wine_avg, columns=["Country","Avg_points","Avg_price"])
    # df.set_index("Country",inplace=True)
    # df.plot.bar()
    # plt.tight_layout()
    # plt.show()      


if __name__ == "__main__":
    app.run(debug=True)