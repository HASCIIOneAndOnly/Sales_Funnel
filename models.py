from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


class Deal(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    stage = db.Column(db.String(255), nullable=False)
    cost = db.Column(db.Numeric(10, 2), nullable=False)
    created_date = db.Column(db.Date, nullable=False)
    client_name = db.Column(db.String(255), nullable=False)
    additional_info = db.Column(db.Text)
