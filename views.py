from flask import Blueprint, render_template, request, redirect, url_for

views = Blueprint("views", __name__)

@views.route("/")
def home():
    # CORREÇÃO: Renderiza a página principal (index.html)
    return render_template("index.html")

@views.route("/login", methods=["GET", "POST"])
def login():
    return render_template("login.html")

@views.route('/cadastro', methods=['GET', 'POST'])
def cadastro():
   return render_template('cadastro.html')